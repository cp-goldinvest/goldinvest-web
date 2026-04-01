import type { GoldPriceSnapshot, PricingRule, PricingTier } from "@/lib/supabase/types";

export type ComputedPrices = {
  stock: number;
  advance: number;
  purchase: number;
  spotPerGramRsd: number;
  onRequest: boolean;
};

const GRAMS_PER_OZ = 31.1034768;

/**
 * Compute spot price per gram in RSD from a snapshot.
 *
 * Preference order:
 *  1. xau_eur × eur_rsd  — EUR is the authoritative source; matches the
 *     rate set by admin each morning and used on the public price ticker.
 *  2. price_per_g_rsd    — Postgres-generated fallback (uses USD if EUR absent).
 */
export function spotPerGramFromSnapshot(snapshot: GoldPriceSnapshot): number {
  if (snapshot.xau_eur != null && snapshot.eur_rsd != null) {
    return (snapshot.xau_eur / GRAMS_PER_OZ) * snapshot.eur_rsd;
  }
  if (snapshot.price_per_g_rsd != null) {
    return snapshot.price_per_g_rsd;
  }
  throw new Error("Snapshot contains no usable price data");
}

function findTier(tiers: PricingTier[], weightG: number, category: string, brand?: string | null): PricingTier | undefined {
  const wb = (t: PricingTier) => t.weight_g !== null && Math.abs(t.weight_g - weightG) < 0.001;
  const ca = (t: PricingTier, c: string | null) => t.category === c;
  const br = (t: PricingTier, b: string | null) => t.brand === b;

  if (brand) {
    return (
      tiers.find(t => br(t, brand) && wb(t) && ca(t, category)) ??
      tiers.find(t => br(t, brand) && wb(t) && ca(t, null)) ??
      tiers.find(t => br(t, brand) && t.weight_g === null && ca(t, category)) ??
      tiers.find(t => br(t, brand) && t.weight_g === null && ca(t, null)) ??
      findTier(tiers, weightG, category)
    );
  }
  return (
    tiers.find(t => br(t, null) && wb(t) && ca(t, category)) ??
    tiers.find(t => br(t, null) && wb(t) && ca(t, null)) ??
    tiers.find(t => br(t, null) && t.weight_g === null && ca(t, category)) ??
    tiers.find(t => br(t, null) && t.weight_g === null && ca(t, null)) ??
    // backward compat: rows without brand column (pre-migration)
    tiers.find(t => wb(t) && ca(t, category)) ??
    tiers.find(t => wb(t) && ca(t, null)) ??
    tiers.find(t => t.weight_g === null && ca(t, category)) ??
    tiers.find(t => t.weight_g === null && ca(t, null))
  );
}

/**
 * Determines final prices for a product variant.
 *
 * Priority:
 *  1. pricing_rules override (if set for this variant)
 *  2. Brand-specific pricing_tier (if brand supplied)
 *  3. Matching pricing_tier (by category + exact weight, then fallbacks)
 *  4. Hardcoded fallback margins (3% / 2% / -2%)
 */
export function computePrices(
  weightG: number,
  category: string,
  snapshot: GoldPriceSnapshot,
  rule: PricingRule | null,
  tiers: PricingTier[],
  brand?: string | null
): ComputedPrices {
  const spotPerGramRsd = spotPerGramFromSnapshot(snapshot);

  const tier = findTier(tiers, weightG, category, brand);

  const marginStock    = tier?.margin_stock_pct    ?? 3.0;
  const marginAdvance  = tier?.margin_advance_pct  ?? 2.0;
  const marginPurchase = tier?.margin_purchase_pct ?? -2.0;

  const formulaStock    = weightG * spotPerGramRsd * (1 + marginStock    / 100);
  const formulaAdvance  = weightG * spotPerGramRsd * (1 + marginAdvance  / 100);
  const formulaPurchase = weightG * spotPerGramRsd * (1 + marginPurchase / 100);

  return {
    spotPerGramRsd,
    stock:    rule?.override_stock_price    ?? formulaStock,
    advance:  rule?.override_advance_price  ?? formulaAdvance,
    purchase: rule?.override_purchase_price ?? formulaPurchase,
    onRequest: marginStock === 0 && rule?.override_stock_price == null,
  };
}

export function formatRsd(value: number): string {
  return new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: "RSD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatWeight(weightG: number): string {
  if (weightG >= 1000) return `${weightG / 1000} kg`;
  if (Number.isInteger(weightG)) return `${weightG}g`;
  // Troy oz fractions
  const oz = weightG / 31.1035;
  if (Math.abs(oz - 1)    < 0.01) return "1 oz";
  if (Math.abs(oz - 0.5)  < 0.01) return "1/2 oz";
  if (Math.abs(oz - 0.25) < 0.01) return "1/4 oz";
  if (Math.abs(oz - 0.1)  < 0.01) return "1/10 oz";
  if (Math.abs(oz - 0.04) < 0.01) return "1/25 oz";
  return `${weightG}g`;
}
