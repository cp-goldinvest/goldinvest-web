-- =============================================================
-- Backfill pricing_tiers.site_id = 1 (GoldInvest)
-- Migration: 20260512000002_backfill_pricing_tiers_site_id
--
-- U prethodnoj migraciji (20260512000001) dodali smo site_id kao NULLABLE
-- sa idejom "NULL = bazni tier, deljen za oba sajta". Posle odluke da ZP
-- ima razlicite marže od GI-a, sve postojece tier-ove obelezavamo kao
-- striktno GoldInvest (site_id=1) i postavljamo kolonu na NOT NULL.
-- ZP krece od 0 i kreira sve svoje tier-ove eksplicitno (site_id=2).
-- =============================================================

UPDATE pricing_tiers SET site_id = 1 WHERE site_id IS NULL;

ALTER TABLE pricing_tiers
  ALTER COLUMN site_id SET NOT NULL;

-- DEFAULT je 1 za novogodisnji unos preko admin panela - ako admin
-- zaboravi da postavi site, ide u GI (manje vidljiva strana zbog
-- "Posalji upit" flow-a). ZP forme moraju eksplicitno proslediti site_id=2.
ALTER TABLE pricing_tiers
  ALTER COLUMN site_id SET DEFAULT 1;
