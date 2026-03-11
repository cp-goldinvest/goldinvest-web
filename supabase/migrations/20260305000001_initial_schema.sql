-- =============================================================
-- GoldInvest — Initial Schema
-- Migration: 20260305000001_initial_schema
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. PRODUCTS
-- One row per brand+series (e.g. "Argor-Heraeus zlatna poluga")
-- ─────────────────────────────────────────────────────────────
CREATE TABLE products (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text UNIQUE NOT NULL,
  name         text NOT NULL,
  category     text NOT NULL CHECK (category IN ('poluga', 'plocica', 'dukat', 'novac')),
  brand        text NOT NULL,
  refinery     text,
  origin       text,
  -- Product page content tabs
  description  text,
  properties   text,
  payment_info text,
  declaration  text,
  tax_info     text,
  is_active    boolean DEFAULT true,
  created_at   timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- 2. PRODUCT VARIANTS
-- One row per weight variant of a product
-- ─────────────────────────────────────────────────────────────
CREATE TABLE product_variants (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  slug            text UNIQUE NOT NULL,
  weight_g        numeric(10, 4) NOT NULL,
  -- Computed: troy oz (1 oz = 31.1035g)
  weight_oz       numeric(10, 6) GENERATED ALWAYS AS (weight_g / 31.1035) STORED,
  -- Purity in parts per 1000 (e.g. 9999 = 99.99%, 986 = 98.6%)
  purity          integer NOT NULL DEFAULT 9999,
  -- Computed: actual pure gold content
  fine_weight_g   numeric(10, 4) GENERATED ALWAYS AS (weight_g * purity / 10000.0) STORED,
  sku             text UNIQUE,
  stock_qty       integer NOT NULL DEFAULT 0,
  availability    text NOT NULL DEFAULT 'in_stock'
                  CHECK (availability IN ('in_stock', 'available_on_request', 'preorder')),
  lead_time_weeks integer,              -- only relevant when availability = 'preorder'
  images          text[] DEFAULT '{}',
  sort_order      integer DEFAULT 0,
  is_active       boolean DEFAULT true
);

-- ─────────────────────────────────────────────────────────────
-- 3. PRICING TIERS
-- Weight-based default margins per category.
-- Determines price when no override exists in pricing_rules.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE pricing_tiers (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                text NOT NULL,
  category            text,             -- null = applies to all categories
  min_g               numeric(10, 4) NOT NULL DEFAULT 0,
  max_g               numeric(10, 4) NOT NULL DEFAULT 99999,
  margin_stock_pct    numeric(6, 2) NOT NULL,
  margin_advance_pct  numeric(6, 2) NOT NULL,
  margin_purchase_pct numeric(6, 2) NOT NULL,
  created_at          timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- 4. PRICING RULES (override-only)
-- Per-variant manual price override.
-- When override_*_price is set, it bypasses the tier formula.
-- Admin can clear override to revert to tier pricing.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE pricing_rules (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id              uuid NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE UNIQUE,
  -- null = use pricing_tier formula
  override_stock_price    numeric(12, 2),
  override_advance_price  numeric(12, 2),
  override_purchase_price numeric(12, 2),
  updated_at              timestamptz DEFAULT now(),
  updated_by              text          -- admin user email for audit trail
);

-- ─────────────────────────────────────────────────────────────
-- 5. GOLD PRICE SNAPSHOTS
-- Inserted every 60s by Vercel cron job via /api/cron/gold-price
-- ─────────────────────────────────────────────────────────────
CREATE TABLE gold_price_snapshots (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  xau_usd         numeric(10, 4) NOT NULL,  -- spot price USD per troy oz
  xau_eur         numeric(10, 4),           -- spot price EUR per troy oz
  usd_rsd         numeric(8, 4) NOT NULL,   -- USD → RSD exchange rate
  eur_rsd         numeric(8, 4),            -- EUR → RSD exchange rate
  -- Computed: spot price per gram in RSD
  price_per_g_rsd numeric(12, 4) GENERATED ALWAYS AS (xau_usd / 31.1035 * usd_rsd) STORED,
  source          text DEFAULT 'goldapi',
  fetched_at      timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- 6. PURCHASE INQUIRIES
-- Created when a client submits the "Pošalji upit" form.
-- No payment gateway — all sales completed via phone/in-person.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE purchase_inquiries (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id      uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  -- Snapshot of product info at time of inquiry (immutable)
  product_name    text NOT NULL,
  weight_g        numeric(10, 4),
  price_at_time   numeric(12, 2),     -- stock price shown to client
  -- Client info
  client_name     text NOT NULL,
  client_phone    text NOT NULL,
  client_email    text,
  quantity        integer NOT NULL DEFAULT 1,
  note            text,
  -- Workflow status (managed in /admin/upiti)
  status          text NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new', 'contacted', 'sold', 'cancelled')),
  created_at      timestamptz DEFAULT now()
);

-- =============================================================
-- INDEXES
-- =============================================================
CREATE INDEX idx_products_category       ON products(category);
CREATE INDEX idx_products_slug           ON products(slug);
CREATE INDEX idx_variants_product_id     ON product_variants(product_id);
CREATE INDEX idx_variants_weight_g       ON product_variants(weight_g);
CREATE INDEX idx_variants_slug           ON product_variants(slug);
CREATE INDEX idx_variants_availability   ON product_variants(availability);
CREATE INDEX idx_snapshots_fetched_at    ON gold_price_snapshots(fetched_at DESC);
CREATE INDEX idx_inquiries_status        ON purchase_inquiries(status);
CREATE INDEX idx_inquiries_created_at    ON purchase_inquiries(created_at DESC);
CREATE INDEX idx_inquiries_variant       ON purchase_inquiries(variant_id);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================
ALTER TABLE products            ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants    ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_tiers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules       ENABLE ROW LEVEL SECURITY;
ALTER TABLE gold_price_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_inquiries  ENABLE ROW LEVEL SECURITY;

-- ── Public READ policies ────────────────────────────────────
CREATE POLICY "public_read_products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "public_read_variants"
  ON product_variants FOR SELECT
  USING (is_active = true);

CREATE POLICY "public_read_tiers"
  ON pricing_tiers FOR SELECT
  USING (true);

CREATE POLICY "public_read_rules"
  ON pricing_rules FOR SELECT
  USING (true);

CREATE POLICY "public_read_snapshots"
  ON gold_price_snapshots FOR SELECT
  USING (true);

-- ── Public INSERT for inquiries (client form) ───────────────
CREATE POLICY "public_insert_inquiries"
  ON purchase_inquiries FOR INSERT
  WITH CHECK (true);

-- ── Service role INSERT for cron job (snapshots) ───────────
CREATE POLICY "service_insert_snapshots"
  ON gold_price_snapshots FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ── Admin FULL ACCESS (app_metadata.role = 'admin') ────────
CREATE POLICY "admin_all_products"
  ON products FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_all_variants"
  ON product_variants FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_all_tiers"
  ON pricing_tiers FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_all_rules"
  ON pricing_rules FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_all_inquiries"
  ON purchase_inquiries FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================
-- SEED DATA — Pricing Tiers (default margins by weight)
-- =============================================================
INSERT INTO pricing_tiers (name, category, min_g, max_g, margin_stock_pct, margin_advance_pct, margin_purchase_pct) VALUES
  ('Pločice male',    'plocica', 1,    20,    4.50, 3.50, -2.50),
  ('Poluge male',     'poluga',  1,    20,    4.00, 3.00, -2.00),
  ('Poluge srednje',  'poluga',  21,   100,   3.00, 2.00, -2.00),
  ('Poluge velike',   'poluga',  101,  99999, 2.00, 1.50, -1.50),
  ('Kovanice sve',    'novac',   0,    99999, 5.00, 4.00, -3.00),
  ('Dukati sve',      'dukat',   0,    99999, 5.00, 4.00, -3.00);

-- =============================================================
-- SEED DATA — Products
-- =============================================================
INSERT INTO products (slug, name, category, brand, refinery, origin) VALUES
  ('argor-heraeus-zlatna-poluga',   'Argor-Heraeus zlatna poluga',          'poluga', 'Argor-Heraeus',       'Argor-Heraeus SA',      'Švajcarska'),
  ('c-hafner-zlatna-poluga',        'C. Hafner zlatna poluga',              'poluga', 'C. Hafner',           'C. Hafner GmbH & Co.',  'Nemačka'),
  ('franc-jozef-dukat',             'Dukat Franc Jozef',                    'dukat',  'Münze Österreich',    'Münze Österreich AG',   'Austrija'),
  ('becka-filharmonija',            'Zlatnik Bečka Filharmonija',           'novac',  'Münze Österreich',    'Münze Österreich AG',   'Austrija'),
  ('maple-leaf',                    'Zlatnik Javorov list (Maple Leaf)',    'novac',  'Royal Canadian Mint', 'Royal Canadian Mint',   'Kanada'),
  ('britannia',                     'Zlatnik Britannia',                    'novac',  'The Royal Mint',      'The Royal Mint',        'Velika Britanija'),
  ('kengur',                        'Zlatnik Kengur (Kangaroo)',            'novac',  'Perth Mint',          'Perth Mint',            'Australija');

-- =============================================================
-- SEED DATA — Product Variants
-- =============================================================

-- Argor-Heraeus poluge (purity 9999)
WITH p AS (SELECT id FROM products WHERE slug = 'argor-heraeus-zlatna-poluga')
INSERT INTO product_variants (product_id, slug, weight_g, purity, sku, sort_order) VALUES
  ((SELECT id FROM p), 'argor-heraeus-1g',    1.0000,    9999, 'AH-001G',  1),
  ((SELECT id FROM p), 'argor-heraeus-2g',    2.0000,    9999, 'AH-002G',  2),
  ((SELECT id FROM p), 'argor-heraeus-5g',    5.0000,    9999, 'AH-005G',  3),
  ((SELECT id FROM p), 'argor-heraeus-10g',   10.0000,   9999, 'AH-010G',  4),
  ((SELECT id FROM p), 'argor-heraeus-20g',   20.0000,   9999, 'AH-020G',  5),
  ((SELECT id FROM p), 'argor-heraeus-1oz',   31.1035,   9999, 'AH-1OZ',   6),
  ((SELECT id FROM p), 'argor-heraeus-50g',   50.0000,   9999, 'AH-050G',  7),
  ((SELECT id FROM p), 'argor-heraeus-100g',  100.0000,  9999, 'AH-100G',  8),
  ((SELECT id FROM p), 'argor-heraeus-250g',  250.0000,  9999, 'AH-250G',  9),
  ((SELECT id FROM p), 'argor-heraeus-500g',  500.0000,  9999, 'AH-500G',  10),
  ((SELECT id FROM p), 'argor-heraeus-1kg',   1000.0000, 9999, 'AH-1KG',   11);

-- C. Hafner poluge (purity 9999)
WITH p AS (SELECT id FROM products WHERE slug = 'c-hafner-zlatna-poluga')
INSERT INTO product_variants (product_id, slug, weight_g, purity, sku, sort_order) VALUES
  ((SELECT id FROM p), 'c-hafner-1g',    1.0000,    9999, 'CH-001G',  1),
  ((SELECT id FROM p), 'c-hafner-2g',    2.0000,    9999, 'CH-002G',  2),
  ((SELECT id FROM p), 'c-hafner-5g',    5.0000,    9999, 'CH-005G',  3),
  ((SELECT id FROM p), 'c-hafner-10g',   10.0000,   9999, 'CH-010G',  4),
  ((SELECT id FROM p), 'c-hafner-20g',   20.0000,   9999, 'CH-020G',  5),
  ((SELECT id FROM p), 'c-hafner-1oz',   31.1035,   9999, 'CH-1OZ',   6),
  ((SELECT id FROM p), 'c-hafner-50g',   50.0000,   9999, 'CH-050G',  7),
  ((SELECT id FROM p), 'c-hafner-100g',  100.0000,  9999, 'CH-100G',  8),
  ((SELECT id FROM p), 'c-hafner-250g',  250.0000,  9999, 'CH-250G',  9),
  ((SELECT id FROM p), 'c-hafner-500g',  500.0000,  9999, 'CH-500G',  10),
  ((SELECT id FROM p), 'c-hafner-1kg',   1000.0000, 9999, 'CH-1KG',   11);

-- Franc Jozef dukati (purity 986)
WITH p AS (SELECT id FROM products WHERE slug = 'franc-jozef-dukat')
INSERT INTO product_variants (product_id, slug, weight_g, purity, sku, sort_order) VALUES
  ((SELECT id FROM p), 'franc-jozef-mali',    3.4900,  986, 'FJ-MALI',   1),
  ((SELECT id FROM p), 'franc-jozef-veliki',  13.9600, 986, 'FJ-VELIKI', 2);

-- Bečka Filharmonija (purity 9999)
WITH p AS (SELECT id FROM products WHERE slug = 'becka-filharmonija')
INSERT INTO product_variants (product_id, slug, weight_g, purity, sku, sort_order) VALUES
  ((SELECT id FROM p), 'becka-filharmonija-1-25oz', 1.2441,  9999, 'BF-125OZ', 1),
  ((SELECT id FROM p), 'becka-filharmonija-1-10oz', 3.1103,  9999, 'BF-110OZ', 2),
  ((SELECT id FROM p), 'becka-filharmonija-1-4oz',  7.7759,  9999, 'BF-14OZ',  3),
  ((SELECT id FROM p), 'becka-filharmonija-1-2oz',  15.5518, 9999, 'BF-12OZ',  4),
  ((SELECT id FROM p), 'becka-filharmonija-1oz',    31.1035, 9999, 'BF-1OZ',   5);

-- Maple Leaf (purity 9999)
WITH p AS (SELECT id FROM products WHERE slug = 'maple-leaf')
INSERT INTO product_variants (product_id, slug, weight_g, purity, sku, sort_order) VALUES
  ((SELECT id FROM p), 'maple-leaf-1-10oz', 3.1103,  9999, 'ML-110OZ', 1),
  ((SELECT id FROM p), 'maple-leaf-1-4oz',  7.7759,  9999, 'ML-14OZ',  2),
  ((SELECT id FROM p), 'maple-leaf-1-2oz',  15.5518, 9999, 'ML-12OZ',  3),
  ((SELECT id FROM p), 'maple-leaf-1oz',    31.1035, 9999, 'ML-1OZ',   4);

-- Britannia (purity 9999)
WITH p AS (SELECT id FROM products WHERE slug = 'britannia')
INSERT INTO product_variants (product_id, slug, weight_g, purity, sku, sort_order) VALUES
  ((SELECT id FROM p), 'britannia-1-10oz', 3.1103,  9999, 'BR-110OZ', 1),
  ((SELECT id FROM p), 'britannia-1-4oz',  7.7759,  9999, 'BR-14OZ',  2),
  ((SELECT id FROM p), 'britannia-1-2oz',  15.5518, 9999, 'BR-12OZ',  3),
  ((SELECT id FROM p), 'britannia-1oz',    31.1035, 9999, 'BR-1OZ',   4);

-- Kengur (purity 9999)
WITH p AS (SELECT id FROM products WHERE slug = 'kengur')
INSERT INTO product_variants (product_id, slug, weight_g, purity, sku, sort_order) VALUES
  ((SELECT id FROM p), 'kengur-1-10oz', 3.1103,  9999, 'KN-110OZ', 1),
  ((SELECT id FROM p), 'kengur-1-4oz',  7.7759,  9999, 'KN-14OZ',  2),
  ((SELECT id FROM p), 'kengur-1-2oz',  15.5518, 9999, 'KN-12OZ',  3),
  ((SELECT id FROM p), 'kengur-1oz',    31.1035, 9999, 'KN-1OZ',   4);
