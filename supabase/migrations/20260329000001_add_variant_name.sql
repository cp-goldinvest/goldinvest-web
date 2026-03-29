-- Add display name column to product_variants.
-- Nullable so existing rows are unaffected; set via admin or SQL update.
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS name text;
