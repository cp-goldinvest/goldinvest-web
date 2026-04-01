-- =============================================================
-- GoldInvest — Fix gold_price_snapshots Schema
-- Migration: 20260401000001_fix_snapshot_schema
--
-- Changes:
--   1. Allow xau_usd and usd_rsd to be NULL
--      Admin manual rate entries only have EUR data — no USD needed.
--   2. Replace price_per_g_rsd generated column to prefer EUR.
--      Old formula: xau_usd / 31.1035 * usd_rsd  (USD-based)
--      New formula: xau_eur / 31.1035 * eur_rsd   (EUR preferred, USD fallback)
--      EUR is the authoritative source because:
--        a) Admin sets EUR/RSD manually each morning
--        b) Serbia uses EUR as the reference currency
-- =============================================================

-- 1. Relax NOT NULL constraints on USD columns
ALTER TABLE gold_price_snapshots
  ALTER COLUMN xau_usd DROP NOT NULL,
  ALTER COLUMN usd_rsd DROP NOT NULL;

-- 2. Replace generated column with EUR-first formula
--    (DROP + ADD because PostgreSQL does not allow ALTER on generated columns)
ALTER TABLE gold_price_snapshots DROP COLUMN price_per_g_rsd;

ALTER TABLE gold_price_snapshots
  ADD COLUMN price_per_g_rsd numeric(12, 4)
    GENERATED ALWAYS AS (
      CASE
        WHEN xau_eur IS NOT NULL AND eur_rsd IS NOT NULL
          THEN xau_eur / 31.1035 * eur_rsd
        WHEN xau_usd IS NOT NULL AND usd_rsd IS NOT NULL
          THEN xau_usd / 31.1035 * usd_rsd
        ELSE NULL
      END
    ) STORED;
