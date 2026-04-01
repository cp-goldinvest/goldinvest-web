-- =============================================================
-- GoldInvest — Add brand-specific pricing tiers
-- Migration: 20260402000001_pricing_tiers_brand
--
-- Adds brand column to pricing_tiers.
-- NULL = base tier, applies to any brand.
-- Non-null = brand-specific tier, takes priority over base.
-- =============================================================

ALTER TABLE pricing_tiers
  ADD COLUMN brand text DEFAULT NULL;
