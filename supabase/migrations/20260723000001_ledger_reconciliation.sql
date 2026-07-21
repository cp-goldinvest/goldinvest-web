-- =============================================================
-- Ledger rekonsilijacija - automatska korekcija kase kad se izmeni/obrise
-- vec uknjizena prodaja/nabavka/trosak.
-- Migration: 20260723000001_ledger_reconciliation
--
-- Stari podaci (pre 20260722000001) nemaju nijedan register_transactions red
-- vezan za sebe (related_sale_id/related_lager_item_id/related_expense_id su
-- NULL) - njih ove funkcije ne diraju, samo reverse/repost aktivnih ledger
-- redova. Sigurno je slobodno menjati istorijske podatke.
--
-- Model: nikad se ne menja postojeci register_transactions red. Izmena
-- proizvodi (1) storno-red koji ponistava svaki jos-ne-stornirani aktivni
-- red vezan za taj entitet, i (2) ako entitet i dalje postoji u trazenom
-- stanju, svez red sa aktuelnim vrednostima. Oba koraka su vidljiva u
-- Akcijama kao posebne, datirane stavke.
-- =============================================================

ALTER TABLE register_transactions
  ADD COLUMN reverses_transaction_id uuid REFERENCES register_transactions(id) ON DELETE SET NULL;

CREATE INDEX idx_register_transactions_reverses ON register_transactions(reverses_transaction_id);

-- -----------------------------------------------------------
-- Reverzuje sve jos-aktivne (ne-stornirane) redove za dati filter,
-- vraca broj storniranih redova.
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION reverse_active_ledger_entries(
  p_related_sale_id       uuid DEFAULT NULL,
  p_related_lager_item_id uuid DEFAULT NULL,
  p_related_expense_id    uuid DEFAULT NULL,
  p_entry_types           text[] DEFAULT NULL,
  p_reason                text DEFAULT 'Storno - izmena podatka'
) RETURNS integer
LANGUAGE plpgsql AS $$
DECLARE
  v_row     register_transactions;
  v_new_row register_transactions;
  v_count   integer := 0;
BEGIN
  FOR v_row IN
    SELECT rt.* FROM register_transactions rt
    WHERE rt.reverses_transaction_id IS NULL
      AND NOT EXISTS (SELECT 1 FROM register_transactions rev WHERE rev.reverses_transaction_id = rt.id)
      AND (p_entry_types IS NULL OR rt.entry_type = ANY(p_entry_types))
      AND (
        (p_related_sale_id IS NOT NULL AND rt.related_sale_id = p_related_sale_id) OR
        (p_related_lager_item_id IS NOT NULL AND rt.related_lager_item_id = p_related_lager_item_id) OR
        (p_related_expense_id IS NOT NULL AND rt.related_expense_id = p_related_expense_id)
      )
  LOOP
    v_new_row := post_register_transaction(
      p_register_code         := (SELECT code FROM cash_registers WHERE id = v_row.register_id),
      p_amount_rsd            := -v_row.amount_rsd,
      p_entry_type            := 'manual_adjustment',
      p_reason                := p_reason,
      p_related_sale_id       := v_row.related_sale_id,
      p_related_lager_item_id := v_row.related_lager_item_id,
      p_related_expense_id    := v_row.related_expense_id
    );
    UPDATE register_transactions SET reverses_transaction_id = v_row.id WHERE id = v_new_row.id;
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$;

-- -----------------------------------------------------------
-- Rekonsilijacija prodaje: stornira aktivne redove, pa (opciono) svezo
-- uknjizi na osnovu trenutnog stanja sales reda (ako i dalje postoji).
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION reconcile_sale_ledger(p_sale_id uuid, p_repost boolean DEFAULT true)
RETURNS void
LANGUAGE plpgsql AS $$
DECLARE
  v_sale sales;
  v_code text;
BEGIN
  PERFORM reverse_active_ledger_entries(p_related_sale_id := p_sale_id, p_reason := 'Storno - izmena prodaje');

  IF NOT p_repost THEN
    RETURN;
  END IF;

  SELECT * INTO v_sale FROM sales WHERE id = p_sale_id;
  IF NOT FOUND THEN
    RETURN;
  END IF;

  v_code := CASE v_sale.register_type WHEN 'bela' THEN 'bela_kasa' ELSE 'crna_kasa' END;
  PERFORM post_register_transaction(
    p_register_code   := v_code,
    p_amount_rsd      := v_sale.total_rsd,
    p_entry_type      := 'manual_adjustment',
    p_occurred_at     := v_sale.sold_at,
    p_reason          := 'Ponovo uknjiženo - prodaja #' || v_sale.sale_number,
    p_agent_id        := v_sale.agent_id,
    p_related_sale_id := v_sale.id
  );
END;
$$;

-- -----------------------------------------------------------
-- Rekonsilijacija troska: isto, jedan red (kasa umanjenje).
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION reconcile_expense_ledger(p_expense_id uuid, p_repost boolean DEFAULT true)
RETURNS void
LANGUAGE plpgsql AS $$
DECLARE
  v_expense expenses;
  v_code text;
BEGIN
  PERFORM reverse_active_ledger_entries(p_related_expense_id := p_expense_id, p_reason := 'Storno - izmena troška');

  IF NOT p_repost THEN
    RETURN;
  END IF;

  SELECT * INTO v_expense FROM expenses WHERE id = p_expense_id;
  IF NOT FOUND THEN
    RETURN;
  END IF;

  v_code := CASE v_expense.register_type WHEN 'bela' THEN 'bela_kasa' ELSE 'crna_kasa' END;
  PERFORM post_register_transaction(
    p_register_code      := v_code,
    p_amount_rsd          := -v_expense.amount_rsd,
    p_entry_type          := 'manual_adjustment',
    p_occurred_at         := v_expense.expense_date,
    p_reason              := 'Ponovo uknjiženo - trošak (' || v_expense.category || ')',
    p_related_expense_id  := v_expense.id
  );
END;
$$;

-- -----------------------------------------------------------
-- Rekonsilijacija lager stavke: stornira nabavku (kasa+lager) i, ako je
-- prodata, prodajni odliv sa lagera; pa svezo uknjizi oba na osnovu
-- trenutnog stanja (ako stavka i dalje postoji).
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION reconcile_lager_item_ledger(p_lager_item_id uuid, p_repost boolean DEFAULT true)
RETURNS void
LANGUAGE plpgsql AS $$
DECLARE
  v_item lager_items;
  v_kasa_code  text;
  v_lager_code text;
BEGIN
  PERFORM reverse_active_ledger_entries(p_related_lager_item_id := p_lager_item_id, p_reason := 'Storno - izmena lager stavke');

  IF NOT p_repost THEN
    RETURN;
  END IF;

  SELECT * INTO v_item FROM lager_items WHERE id = p_lager_item_id;
  IF NOT FOUND THEN
    RETURN;
  END IF;

  v_kasa_code  := CASE v_item.register_type WHEN 'bela' THEN 'bela_kasa'  ELSE 'crna_kasa'  END;
  v_lager_code := CASE v_item.register_type WHEN 'bela' THEN 'beli_lager' ELSE 'crni_lager' END;

  PERFORM post_register_transaction(
    p_register_code         := v_kasa_code,
    p_amount_rsd            := -v_item.purchase_price_rsd,
    p_entry_type            := 'manual_adjustment',
    p_occurred_at           := v_item.purchased_at::date,
    p_reason                := 'Ponovo uknjiženo - nabavka (izmena)',
    p_related_lager_item_id := v_item.id
  );
  PERFORM post_register_transaction(
    p_register_code         := v_lager_code,
    p_amount_rsd            := v_item.purchase_price_rsd,
    p_entry_type            := 'manual_adjustment',
    p_occurred_at           := v_item.purchased_at::date,
    p_reason                := 'Ponovo uknjiženo - nabavka (izmena)',
    p_related_lager_item_id := v_item.id
  );

  IF v_item.sold_at IS NOT NULL THEN
    PERFORM post_register_transaction(
      p_register_code         := v_lager_code,
      p_amount_rsd            := -v_item.purchase_price_rsd,
      p_entry_type            := 'manual_adjustment',
      p_occurred_at           := v_item.sold_at::date,
      p_reason                := 'Ponovo uknjiženo - prodato (izmena)',
      p_related_lager_item_id := v_item.id
    );
  END IF;
END;
$$;
