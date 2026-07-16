-- =============================================================
-- Finansijska evidencija + CRM + bela/crna kasa
-- Migration: 20260715000001_financial_crm_system
--
-- Uvodi:
--   - customers        (CRM - profil kupca/dobavljaca sa istorijom)
--   - sales/sale_items (prodajna transakcija - zamena za DELETE-on-sale)
--   - expenses         (opsti poslovni troskovi, van robne marze)
--   - lager_items ALTER: register_type, supplier_name,
--     supplier_customer_id, sold_at (zamena za brisanje reda)
--
-- Bela/crna kasa vazi i za nabavku (lager_items) i za prodaju (sales)
-- i za troskove (expenses) - nezavisan izbor po transakciji.
--
-- lager_items je istorijski kreirana rucno u Supabase (nije bila u
-- trackovanoj migraciji), pa ovde samo ALTER-ujemo postojecu tabelu.
-- =============================================================

-- -----------------------------------------------------------
-- CUSTOMERS - CRM profil (kupac i/ili dobavljac za otkup)
-- -----------------------------------------------------------
CREATE TABLE customers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   text NOT NULL,
  phone       text,
  email       text,
  address     text,
  id_number   text,        -- licna karta / JMBG, opciono
  note        text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_customers_full_name ON customers(full_name);
CREATE INDEX idx_customers_phone     ON customers(phone);

-- -----------------------------------------------------------
-- LAGER_ITEMS - dodaj kasu, dobavljaca i "prodato" markiranje
-- (zamenjuje dosadasnji DELETE-on-sale)
-- -----------------------------------------------------------
ALTER TABLE lager_items
  ADD COLUMN register_type        text NOT NULL DEFAULT 'bela'
             CHECK (register_type IN ('bela', 'crna')),
  ADD COLUMN supplier_name        text,
  ADD COLUMN supplier_customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  ADD COLUMN sold_at              timestamptz;

CREATE INDEX idx_lager_items_register_type ON lager_items(register_type);
CREATE INDEX idx_lager_items_sold_at       ON lager_items(sold_at);

-- -----------------------------------------------------------
-- SALES - prodajna transakcija (header)
-- -----------------------------------------------------------
CREATE TABLE sales (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_number    bigserial UNIQUE NOT NULL,
  site_id        smallint NOT NULL REFERENCES sites(id) ON DELETE RESTRICT DEFAULT 1,

  register_type  text NOT NULL CHECK (register_type IN ('bela', 'crna')),
  customer_id    uuid REFERENCES customers(id) ON DELETE SET NULL,

  sold_at        date NOT NULL DEFAULT CURRENT_DATE,
  payment_method text NOT NULL DEFAULT 'gotovina'
                 CHECK (payment_method IN ('gotovina', 'racun', 'kartica', 'ostalo')),

  subtotal_rsd   numeric(12, 2) NOT NULL CHECK (subtotal_rsd >= 0),
  total_rsd      numeric(12, 2) NOT NULL CHECK (total_rsd >= 0),

  note           text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  created_by     text
);

ALTER SEQUENCE sales_sale_number_seq RESTART WITH 1000;

CREATE INDEX idx_sales_sold_at       ON sales(sold_at DESC);
CREATE INDEX idx_sales_register_type ON sales(register_type);
CREATE INDEX idx_sales_customer      ON sales(customer_id);

-- -----------------------------------------------------------
-- SALE_ITEMS - stavke prodaje (snapshot pattern, isto kao order_items)
-- -----------------------------------------------------------
CREATE TABLE sale_items (
  id                           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id                      uuid NOT NULL REFERENCES sales(id) ON DELETE CASCADE,

  lager_item_id                uuid REFERENCES lager_items(id) ON DELETE SET NULL,
  variant_id                   uuid REFERENCES product_variants(id) ON DELETE SET NULL,

  product_name_snapshot        text NOT NULL,
  variant_name_snapshot        text,
  weight_g_snapshot            numeric(10, 4) NOT NULL,
  category_snapshot            text NOT NULL,

  quantity                     integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_rsd               numeric(12, 2) NOT NULL CHECK (unit_price_rsd >= 0),
  line_total_rsd               numeric(12, 2) NOT NULL CHECK (line_total_rsd >= 0),

  purchase_price_snapshot_rsd  numeric(12, 2),

  created_at                   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sale_items_sale        ON sale_items(sale_id);
CREATE INDEX idx_sale_items_lager       ON sale_items(lager_item_id);
CREATE INDEX idx_sale_items_variant     ON sale_items(variant_id);

-- -----------------------------------------------------------
-- EXPENSES - opsti poslovni troskovi (van robne marze)
-- -----------------------------------------------------------
CREATE TABLE expenses (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_date   date NOT NULL DEFAULT CURRENT_DATE,
  category       text NOT NULL,
  register_type  text NOT NULL CHECK (register_type IN ('bela', 'crna')),
  amount_rsd     numeric(12, 2) NOT NULL CHECK (amount_rsd >= 0),
  description    text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  created_by     text
);

CREATE INDEX idx_expenses_date          ON expenses(expense_date DESC);
CREATE INDEX idx_expenses_register_type ON expenses(register_type);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================
ALTER TABLE customers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales        ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses     ENABLE ROW LEVEL SECURITY;

-- Bez public politika - sve ide preko service_role iz admin API ruta.
-- Admin pun pristup (defense-in-depth, isti pattern kao ostale tabele).
CREATE POLICY "admin_all_customers"
  ON customers FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_all_sales"
  ON sales FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_all_sale_items"
  ON sale_items FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_all_expenses"
  ON expenses FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
