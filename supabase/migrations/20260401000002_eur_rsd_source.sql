-- =============================================================
-- GoldInvest — Track EUR/RSD resolution source
-- Migration: 20260401000002_eur_rsd_source
--
-- Adds eur_rsd_source to gold_price_snapshots so every snapshot
-- records HOW its EUR/RSD rate was determined:
--
--   'manual'   — admin set it explicitly via /admin/cene today
--   'api'      — auto-fetched from ECB via frankfurter.app
--   'fallback' — carried forward from the last known stored rate
--
-- NULL on old rows (pre-migration) — treated as 'fallback' in code.
-- =============================================================

ALTER TABLE gold_price_snapshots
  ADD COLUMN eur_rsd_source text
    CHECK (eur_rsd_source IN ('manual', 'api', 'fallback'));
