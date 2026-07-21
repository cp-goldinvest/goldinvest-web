-- =============================================================
-- Kase modul - tekuce stanje kase + pun audit trail ("akcije")
-- Migration: 20260722000001_cash_registers_ledger
--
-- Uvodi:
--   - agents               (Luka Simovic, Vuk Rosic - ko je zatvorio prodaju)
--   - cash_registers       (bela_kasa, crna_kasa, beli_lager, crni_lager -
--                            tekuce stanje, denormalizovano radi brzog citanja)
--   - register_transactions (append-only ledger svake promene stanja)
--   - sales.agent_id ALTER (nullable - ne dira postojece redove)
--
-- Balans se azurira ISKLJUCIVO kroz post_register_transaction() funkciju,
-- pozvanu iz trigera (prodaja/nabavka/trosak - automatski, ne moze se
-- zaboraviti) ili direktno iz API rute (rucna korekcija/pocetno stanje/
-- transfer - eksplicitna akcija korisnika sa obaveznim razlogom).
--
-- Sve je aditivno - nema izmena postojecih redova u sales/lager_items/
-- expenses/customers. Kase startuju na 0 RSD.
-- =============================================================

-- -----------------------------------------------------------
-- AGENTS - ko je zatvorio prodaju
-- -----------------------------------------------------------
CREATE TABLE agents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   text NOT NULL,
  active      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO agents (full_name) VALUES ('Luka Simović'), ('Vuk Rosić');

-- -----------------------------------------------------------
-- CASH_REGISTERS - 4 kase sa tekucim stanjem
-- -----------------------------------------------------------
CREATE TABLE cash_registers (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code                  text UNIQUE NOT NULL
                        CHECK (code IN ('bela_kasa', 'crna_kasa', 'beli_lager', 'crni_lager')),
  display_name          text NOT NULL,
  current_balance_rsd   numeric(14, 2) NOT NULL DEFAULT 0,
  updated_at            timestamptz NOT NULL DEFAULT now()
);

INSERT INTO cash_registers (code, display_name) VALUES
  ('bela_kasa',  'Bela kasa'),
  ('crna_kasa',  'Crna kasa'),
  ('beli_lager', 'Beli lager'),
  ('crni_lager', 'Crni lager');

-- -----------------------------------------------------------
-- REGISTER_TRANSACTIONS - append-only ledger ("akcije")
-- -----------------------------------------------------------
CREATE TABLE register_transactions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  register_id             uuid NOT NULL REFERENCES cash_registers(id) ON DELETE RESTRICT,

  occurred_at             date NOT NULL DEFAULT CURRENT_DATE,
  entry_type              text NOT NULL
                          CHECK (entry_type IN ('initial', 'sale', 'purchase', 'expense', 'manual_adjustment', 'transfer')),

  amount_rsd              numeric(14, 2) NOT NULL,       -- signed delta
  balance_after_rsd       numeric(14, 2) NOT NULL,       -- snapshot posle ove akcije

  reason                  text,
  agent_id                uuid REFERENCES agents(id) ON DELETE SET NULL,

  related_sale_id         uuid REFERENCES sales(id) ON DELETE SET NULL,
  related_lager_item_id   uuid REFERENCES lager_items(id) ON DELETE SET NULL,
  related_expense_id      uuid REFERENCES expenses(id) ON DELETE SET NULL,
  transfer_group_id       uuid,                          -- spaja dve strane transfera

  created_at              timestamptz NOT NULL DEFAULT now(),
  created_by              text
);

CREATE INDEX idx_register_transactions_register ON register_transactions(register_id, occurred_at DESC);
CREATE INDEX idx_register_transactions_type     ON register_transactions(entry_type);
CREATE INDEX idx_register_transactions_transfer ON register_transactions(transfer_group_id);

-- -----------------------------------------------------------
-- SALES - dodaj agenta (ko je prodaju zatvorio)
-- -----------------------------------------------------------
ALTER TABLE sales ADD COLUMN agent_id uuid REFERENCES agents(id) ON DELETE SET NULL;
CREATE INDEX idx_sales_agent ON sales(agent_id);

-- =============================================================
-- CORE FUNKCIJA - jedina putanja koja sme da menja current_balance_rsd
-- =============================================================
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
  p_created_by            text DEFAULT NULL
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
    transfer_group_id, created_by
  ) VALUES (
    v_register.id, p_occurred_at, p_entry_type, p_amount_rsd, v_new_balance,
    p_reason, p_agent_id, p_related_sale_id, p_related_lager_item_id, p_related_expense_id,
    p_transfer_group_id, p_created_by
  ) RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

-- =============================================================
-- AUTOMATSKO KNJIZENJE - trigeri (sale / nabavka / trosak)
-- =============================================================

-- Prodaja: +total_rsd na bela_kasa/crna_kasa
CREATE OR REPLACE FUNCTION trg_sales_post_ledger() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  v_code text := CASE NEW.register_type WHEN 'bela' THEN 'bela_kasa' ELSE 'crna_kasa' END;
BEGIN
  PERFORM post_register_transaction(
    p_register_code   := v_code,
    p_amount_rsd      := NEW.total_rsd,
    p_entry_type      := 'sale',
    p_occurred_at     := NEW.sold_at,
    p_reason          := 'Prodaja #' || NEW.sale_number,
    p_agent_id        := NEW.agent_id,
    p_related_sale_id := NEW.id,
    p_created_by      := NEW.created_by
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER sales_after_insert_ledger
AFTER INSERT ON sales
FOR EACH ROW EXECUTE FUNCTION trg_sales_post_ledger();

-- Nabavka (novi lager_item): -purchase_price sa kase, +purchase_price na lager pool
CREATE OR REPLACE FUNCTION trg_lager_purchase_post_ledger() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  v_kasa_code  text := CASE NEW.register_type WHEN 'bela' THEN 'bela_kasa'  ELSE 'crna_kasa'  END;
  v_lager_code text := CASE NEW.register_type WHEN 'bela' THEN 'beli_lager' ELSE 'crni_lager' END;
  v_reason     text := 'Nabavka' || CASE WHEN NEW.serial_number IS NOT NULL THEN ' SN ' || NEW.serial_number ELSE '' END;
BEGIN
  PERFORM post_register_transaction(
    p_register_code         := v_kasa_code,
    p_amount_rsd            := -NEW.purchase_price_rsd,
    p_entry_type            := 'purchase',
    p_occurred_at           := NEW.purchased_at::date,
    p_reason                := v_reason,
    p_related_lager_item_id := NEW.id
  );
  PERFORM post_register_transaction(
    p_register_code         := v_lager_code,
    p_amount_rsd            := NEW.purchase_price_rsd,
    p_entry_type            := 'purchase',
    p_occurred_at           := NEW.purchased_at::date,
    p_reason                := v_reason,
    p_related_lager_item_id := NEW.id
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER lager_items_after_insert_ledger
AFTER INSERT ON lager_items
FOR EACH ROW EXECUTE FUNCTION trg_lager_purchase_post_ledger();

-- Prodato sa lagera (sold_at NULL -> NOT NULL): -purchase_price sa odgovarajuceg lager pool-a
-- (na nivou stavke, nezavisno od toga u koju kasu ide prihod od prodaje)
CREATE OR REPLACE FUNCTION trg_lager_sold_post_ledger() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  v_lager_code text;
BEGIN
  IF OLD.sold_at IS NULL AND NEW.sold_at IS NOT NULL THEN
    v_lager_code := CASE NEW.register_type WHEN 'bela' THEN 'beli_lager' ELSE 'crni_lager' END;
    PERFORM post_register_transaction(
      p_register_code         := v_lager_code,
      p_amount_rsd            := -NEW.purchase_price_rsd,
      p_entry_type            := 'sale',
      p_occurred_at           := NEW.sold_at::date,
      p_reason                := 'Prodato' || CASE WHEN NEW.serial_number IS NOT NULL THEN ' SN ' || NEW.serial_number ELSE '' END,
      p_related_lager_item_id := NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER lager_items_after_update_sold_ledger
AFTER UPDATE ON lager_items
FOR EACH ROW EXECUTE FUNCTION trg_lager_sold_post_ledger();

-- Trosak: -amount_rsd sa bela_kasa/crna_kasa
CREATE OR REPLACE FUNCTION trg_expenses_post_ledger() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  v_code text := CASE NEW.register_type WHEN 'bela' THEN 'bela_kasa' ELSE 'crna_kasa' END;
BEGIN
  PERFORM post_register_transaction(
    p_register_code      := v_code,
    p_amount_rsd          := -NEW.amount_rsd,
    p_entry_type          := 'expense',
    p_occurred_at         := NEW.expense_date,
    p_reason              := COALESCE(NEW.category, 'Trošak') || CASE WHEN NEW.description IS NOT NULL THEN ' - ' || NEW.description ELSE '' END,
    p_related_expense_id  := NEW.id,
    p_created_by          := NEW.created_by
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER expenses_after_insert_ledger
AFTER INSERT ON expenses
FOR EACH ROW EXECUTE FUNCTION trg_expenses_post_ledger();

-- =============================================================
-- RUCNE AKCIJE - pozivaju se iz /api/admin/kase (RPC)
-- =============================================================

-- Pocetno stanje / rucna korekcija - racuna deltu sam, razlog obavezan
CREATE OR REPLACE FUNCTION set_register_balance(
  p_register_code   text,
  p_new_balance_rsd numeric,
  p_entry_type      text,
  p_reason          text,
  p_agent_id        uuid DEFAULT NULL,
  p_occurred_at     date DEFAULT CURRENT_DATE,
  p_created_by      text DEFAULT NULL
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
    p_created_by     := p_created_by
  );
END;
$$;

-- Transfer izmedju dve kase - dve povezane stavke (debit + credit), atomicno
CREATE OR REPLACE FUNCTION transfer_between_registers(
  p_from_code   text,
  p_to_code     text,
  p_amount_rsd  numeric,
  p_reason      text,
  p_agent_id    uuid DEFAULT NULL,
  p_occurred_at date DEFAULT CURRENT_DATE,
  p_created_by  text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql AS $$
DECLARE
  v_group_id uuid := gen_random_uuid();
BEGIN
  IF p_amount_rsd <= 0 THEN
    RAISE EXCEPTION 'Iznos transfera mora biti pozitivan';
  END IF;
  IF p_from_code = p_to_code THEN
    RAISE EXCEPTION 'Izvorna i odredišna kasa moraju biti različite';
  END IF;
  IF p_reason IS NULL OR btrim(p_reason) = '' THEN
    RAISE EXCEPTION 'Razlog je obavezan';
  END IF;

  PERFORM post_register_transaction(
    p_register_code     := p_from_code,
    p_amount_rsd         := -p_amount_rsd,
    p_entry_type         := 'transfer',
    p_occurred_at        := p_occurred_at,
    p_reason             := p_reason,
    p_agent_id           := p_agent_id,
    p_transfer_group_id  := v_group_id,
    p_created_by         := p_created_by
  );
  PERFORM post_register_transaction(
    p_register_code     := p_to_code,
    p_amount_rsd         := p_amount_rsd,
    p_entry_type         := 'transfer',
    p_occurred_at        := p_occurred_at,
    p_reason             := p_reason,
    p_agent_id           := p_agent_id,
    p_transfer_group_id  := v_group_id,
    p_created_by         := p_created_by
  );

  RETURN v_group_id;
END;
$$;

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================
ALTER TABLE agents                ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_registers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE register_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_agents"
  ON agents FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_all_cash_registers"
  ON cash_registers FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_all_register_transactions"
  ON register_transactions FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
