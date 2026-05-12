import type { PricingRule } from "@/lib/supabase/types";

export const GOLDINVEST_SITE_ID = 1;
export const ZLATNEPLOCICE_SITE_ID = 2;

export const CURRENT_SITE_ID = GOLDINVEST_SITE_ID;

export function pickPricingRule(
  rules: PricingRule[] | PricingRule | null | undefined
): PricingRule | null {
  if (!rules) return null;
  if (Array.isArray(rules)) return rules[0] ?? null;
  return rules;
}
