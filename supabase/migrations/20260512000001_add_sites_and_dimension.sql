-- =============================================================
-- GoldInvest x Zlatne Pločice - Multi-site dimenzija
-- Migration: 20260512000001_add_sites_and_dimension
--
-- Uvodi `sites` tabelu i `site_id` dimenziju na cenovnike i upite.
-- Trenutne tabele i dalje funkcionisu na GoldInvest-u (site_id=1).
-- Zlatne Plocice (site_id=2) ce kreirati svoje override-e u
-- pricing_tiers / pricing_rules naknadno; sve gde je site_id=NULL
-- u pricing_tiers tretira se kao "bazni tier" (deli ga oba sajta).
-- =============================================================

-- -----------------------------------------------------------
-- SITES - master tabela za multi-brand dimenziju
-- -----------------------------------------------------------
CREATE TABLE sites (
  id          smallint PRIMARY KEY,
  key         text UNIQUE NOT NULL,
  name        text NOT NULL,
  domain      text NOT NULL,
  base_url    text NOT NULL,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO sites (id, key, name, domain, base_url) VALUES
  (1, 'goldinvest',    'GoldInvest',      'goldinvest.rs',     'https://goldinvest.rs'),
  (2, 'zlatneplocice', 'Zlatne Plocice',  'zlatneplocice.rs',  'https://zlatneplocice.rs');

-- -----------------------------------------------------------
-- pricing_tiers - dodaj site_id (NULL = bazni tier, deli oba sajta)
-- -----------------------------------------------------------
ALTER TABLE pricing_tiers
  ADD COLUMN site_id smallint NULL REFERENCES sites(id) ON DELETE RESTRICT;

CREATE INDEX idx_pricing_tiers_site ON pricing_tiers(site_id);

-- -----------------------------------------------------------
-- pricing_rules - dodaj site_id (NOT NULL, postojeci redovi = GoldInvest)
-- Stari UNIQUE(variant_id) menjamo u UNIQUE(variant_id, site_id)
-- da bi ZP imao svoj override istog variant_a.
-- -----------------------------------------------------------
ALTER TABLE pricing_rules
  ADD COLUMN site_id smallint NOT NULL DEFAULT 1 REFERENCES sites(id) ON DELETE RESTRICT;

ALTER TABLE pricing_rules
  DROP CONSTRAINT IF EXISTS pricing_rules_variant_id_key;

ALTER TABLE pricing_rules
  ADD CONSTRAINT pricing_rules_variant_site_key UNIQUE (variant_id, site_id);

CREATE INDEX idx_pricing_rules_site ON pricing_rules(site_id);

-- -----------------------------------------------------------
-- purchase_inquiries - dodaj site_id (NOT NULL, postojeci = GoldInvest)
-- -----------------------------------------------------------
ALTER TABLE purchase_inquiries
  ADD COLUMN site_id smallint NOT NULL DEFAULT 1 REFERENCES sites(id) ON DELETE RESTRICT;

CREATE INDEX idx_purchase_inquiries_site ON purchase_inquiries(site_id);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- Public sme da cita aktivne sajtove (frontend tipa "lista linkova ka drugom sajtu" itd).
CREATE POLICY "public_read_sites"
  ON sites FOR SELECT
  USING (is_active = true);

-- Admin pun pristup.
CREATE POLICY "admin_all_sites"
  ON sites FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
