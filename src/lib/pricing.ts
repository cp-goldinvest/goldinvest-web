import type { GoldPriceSnapshot, PricingRule, PricingTier } from "@/lib/supabase/types";

export type ComputedPrices = {
  stock: number;
  advance: number;
  purchase: number;
  spotPerGramRsd: number;
};

/**
 * Determines final prices for a product variant.
 * Priority:
 *  1. pricing_rules override (if set)
 *  2. matching pricing_tier (by category + weight range)
 *  3. hardcoded fallback margins
 */
export function computePrices(
  weightG: number,
  category: string,
  snapshot: GoldPriceSnapshot,
  rule: PricingRule | null,
  tiers: PricingTier[]
): ComputedPrices {
  const spotPerGramRsd = snapshot.price_per_g_rsd;

  // Find matching tier — priority: exact weight+category > exact weight (any category) > catch-all+category > global catch-all
  const tier =
    tiers.find((t) => t.weight_g !== null && Math.abs(t.weight_g - weightG) < 0.001 && t.category === category) ??
    tiers.find((t) => t.weight_g !== null && Math.abs(t.weight_g - weightG) < 0.001 && t.category === null) ??
    tiers.find((t) => t.weight_g === null && t.category === category) ??
    tiers.find((t) => t.weight_g === null && t.category === null);

  const marginStock    = tier?.margin_stock_pct    ?? 3.0;
  const marginAdvance  = tier?.margin_advance_pct  ?? 2.0;
  const marginPurchase = tier?.margin_purchase_pct ?? -2.0;

  const formulaStock    = weightG * spotPerGramRsd * (1 + marginStock / 100);
  const formulaAdvance  = weightG * spotPerGramRsd * (1 + marginAdvance / 100);
  const formulaPurchase = weightG * spotPerGramRsd * (1 + marginPurchase / 100);

  return {
    spotPerGramRsd,
    stock:    rule?.override_stock_price    ?? formulaStock,
    advance:  rule?.override_advance_price  ?? formulaAdvance,
    purchase: rule?.override_purchase_price ?? formulaPurchase,
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
  if (Math.abs(oz - 1)     < 0.01) return "1 oz";
  if (Math.abs(oz - 0.5)   < 0.01) return "1/2 oz";
  if (Math.abs(oz - 0.25)  < 0.01) return "1/4 oz";
  if (Math.abs(oz - 0.1)   < 0.01) return "1/10 oz";
  if (Math.abs(oz - 0.04)  < 0.01) return "1/25 oz";
  return `${weightG}g`;
}
