-- =============================================================
-- Ispravka teksta razloga za storno unutar reconcile_* funkcija -
-- storno prilikom brisanja (p_repost=false) sad kaze "obrisana/obrisan",
-- ne "izmena" (koje je tacno samo kad se ponovo uknjizuje, p_repost=true).
-- Migration: 20260723000002_ledger_reconciliation_reason_fix
-- =============================================================

CREATE OR REPLACE FUNCTION reconcile_sale_ledger(p_sale_id uuid, p_repost boolean DEFAULT true)
RETURNS void
LANGUAGE plpgsql AS $$
DECLARE
  v_sale sales;
  v_code text;
BEGIN
  PERFORM reverse_active_ledger_entries(
    p_related_sale_id := p_sale_id,
    p_reason := CASE WHEN p_repost THEN 'Storno - izmena prodaje' ELSE 'Storno - prodaja obrisana' END
  );

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

CREATE OR REPLACE FUNCTION reconcile_expense_ledger(p_expense_id uuid, p_repost boolean DEFAULT true)
RETURNS void
LANGUAGE plpgsql AS $$
DECLARE
  v_expense expenses;
  v_code text;
BEGIN
  PERFORM reverse_active_ledger_entries(
    p_related_expense_id := p_expense_id,
    p_reason := CASE WHEN p_repost THEN 'Storno - izmena troška' ELSE 'Storno - trošak obrisan' END
  );

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

CREATE OR REPLACE FUNCTION reconcile_lager_item_ledger(p_lager_item_id uuid, p_repost boolean DEFAULT true)
RETURNS void
LANGUAGE plpgsql AS $$
DECLARE
  v_item lager_items;
  v_kasa_code  text;
  v_lager_code text;
BEGIN
  PERFORM reverse_active_ledger_entries(
    p_related_lager_item_id := p_lager_item_id,
    p_reason := CASE WHEN p_repost THEN 'Storno - izmena lager stavke' ELSE 'Storno - lager stavka obrisana' END
  );

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
