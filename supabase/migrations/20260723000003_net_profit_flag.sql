-- =============================================================
-- Oznaka "neto dobit" na rucnoj korekciji kase - kad se stanje crne kase
-- koriguje zato sto je iz nje izvucen neto profit (prihodovanje), a ne
-- zato sto je usklada sa stvarnim stanjem, korekcija se obelezava posebno
-- da bude jasno vidljiva u istoriji akcija.
-- Migration: 20260723000003_net_profit_flag
-- =============================================================

ALTER TABLE register_transactions
  ADD COLUMN is_net_profit boolean NOT NULL DEFAULT false;

CREATE INDEX idx_register_transactions_net_profit
  ON register_transactions(is_net_profit)
  WHERE is_net_profit;

-- -----------------------------------------------------------
-- post_register_transaction - dodat p_is_net_profit (default false)
-- -----------------------------------------------------------
DROP FUNCTION IF EXISTS post_register_transaction(text, numeric, text, date, text, uuid, uuid, uuid, uuid, uuid, text);

CREATE OR REPLACE FUNCTION post_register_transaction(
  p_register_code         text,
  p_amount_rsd            numeric,
  p_entry_type            text,
  p_occurred_at           date DEFAULT CURRENT_DATE,
  p_reason                text DEFAULT NULL,
  p_agent_id              uuid DEFAULT NULL,
  p_related_sale_id       uuid DEFAULT NULL,
  p_related_lager_item_id uuid DEFAULT NULL,
  p_related_expense_id    uuid DEFAULT NULL,
  p_transfer_group_id     uuid DEFAULT NULL,
  p_created_by            text DEFAULT NULL,
  p_is_net_profit         boolean DEFAULT false
) RETURNS register_transactions
LANGUAGE plpgsql
AS $$
DECLARE
  v_register     cash_registers;
  v_new_balance  numeric(14, 2);
  v_row          register_transactions;
BEGIN
  SELECT * INTO v_register FROM cash_registers WHERE code = p_register_code FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Nepoznata kasa: %', p_register_code;
  END IF;

  v_new_balance := v_register.current_balance_rsd + p_amount_rsd;

  UPDATE cash_registers
    SET current_balance_rsd = v_new_balance, updated_at = now()
    WHERE id = v_register.id;

  INSERT INTO register_transactions (
    register_id, occurred_at, entry_type, amount_rsd, balance_after_rsd,
    reason, agent_id, related_sale_id, related_lager_item_id, related_expense_id,
    transfer_group_id, created_by, is_net_profit
  ) VALUES (
    v_register.id, p_occurred_at, p_entry_type, p_amount_rsd, v_new_balance,
    p_reason, p_agent_id, p_related_sale_id, p_related_lager_item_id, p_related_expense_id,
    p_transfer_group_id, p_created_by, p_is_net_profit
  ) RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

-- -----------------------------------------------------------
-- set_register_balance - dodat p_is_net_profit (default false),
-- dozvoljen samo za manual_adjustment
-- -----------------------------------------------------------
DROP FUNCTION IF EXISTS set_register_balance(text, numeric, text, text, uuid, date, text);

CREATE OR REPLACE FUNCTION set_register_balance(
  p_register_code   text,
  p_new_balance_rsd numeric,
  p_entry_type      text,
  p_reason          text,
  p_agent_id        uuid DEFAULT NULL,
  p_occurred_at     date DEFAULT CURRENT_DATE,
  p_created_by      text DEFAULT NULL,
  p_is_net_profit   boolean DEFAULT false
) RETURNS register_transactions
LANGUAGE plpgsql AS $$
DECLARE
  v_current numeric(14, 2);
  v_delta   numeric(14, 2);
BEGIN
  IF p_entry_type NOT IN ('initial', 'manual_adjustment') THEN
    RAISE EXCEPTION 'Nevalidan tip akcije: %', p_entry_type;
  END IF;
  IF p_reason IS NULL OR btrim(p_reason) = '' THEN
    RAISE EXCEPTION 'Razlog je obavezan';
  END IF;
  IF p_is_net_profit AND p_entry_type <> 'manual_adjustment' THEN
    RAISE EXCEPTION 'is_net_profit se moze postaviti samo za korekciju stanja (manual_adjustment)';
  END IF;

  SELECT current_balance_rsd INTO v_current FROM cash_registers WHERE code = p_register_code;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Nepoznata kasa: %', p_register_code;
  END IF;

  v_delta := p_new_balance_rsd - v_current;

  RETURN post_register_transaction(
    p_register_code := p_register_code,
    p_amount_rsd     := v_delta,
    p_entry_type     := p_entry_type,
    p_occurred_at    := p_occurred_at,
    p_reason         := p_reason,
    p_agent_id       := p_agent_id,
    p_created_by     := p_created_by,
    p_is_net_profit  := p_is_net_profit
  );
END;
$$;
