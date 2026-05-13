-- =============================================================
-- Seed Zlatne Plocice (site_id=2) base pricing tiers from GoldInvest
-- Migration: 20260514000001_seed_zp_pricing_tiers
--
-- ZP do sada nije imao nijedan tier red u pricing_tiers, pa je sve
-- racunato preko hardcoded fallback marže (3% / 2% / -2%) u
-- src/lib/pricing.ts. Sada admin moze da editjuje ZP prodajnu marzu
-- kroz /admin/cene, pa seed-ujemo iste base tier-ove kao GI ali
-- iskljucivo prodajna (margin_stock_pct).
--
-- ZP ne koristi avansne i otkupne cene (nema "posalji upit" flow-a,
-- nema buyback-a), pa su margin_advance_pct i margin_purchase_pct
-- postavljeni na 0 i nikada se ne prikazuju u admin UI-u za ZP.
-- =============================================================

INSERT INTO pricing_tiers (
  site_id, name, category, weight_g, brand,
  margin_stock_pct, margin_advance_pct, margin_purchase_pct
)
SELECT
  2 AS site_id,
  name,
  category,
  weight_g,
  brand,
  margin_stock_pct,
  0 AS margin_advance_pct,
  0 AS margin_purchase_pct
FROM pricing_tiers
WHERE site_id = 1
  AND brand IS NULL;
