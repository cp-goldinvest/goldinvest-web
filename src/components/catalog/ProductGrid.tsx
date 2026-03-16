"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { FilterSortBar, type SortOption, type Filters } from "./FilterSortBar";
import { computePrices } from "@/lib/pricing";
import type { ProductVariant, PricingTier, PricingRule, GoldPriceSnapshot } from "@/lib/supabase/types";

type VariantWithRelations = ProductVariant & {
  products: { name: string; brand: string; origin: string | null; category: string };
  pricing_rules: PricingRule | null;
};

type Props = {
  variants: VariantWithRelations[];
  tiers: PricingTier[];
  snapshot: GoldPriceSnapshot;
};

export function ProductGrid({ variants, tiers, snapshot }: Props) {
  const [sort, setSort] = useState<SortOption>("price_asc");
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    weights: [],
    maxPrice: null,
    brands: [],
    origins: [],
    availability: [],
  });

  // Derive available filter options from data
  const availableWeights = useMemo(
    () => [...new Set(variants.map((v) => Number(v.weight_g)))].sort((a, b) => a - b),
    [variants]
  );
  const availableBrands = useMemo(
    () => [...new Set(variants.map((v) => v.products.brand))].sort(),
    [variants]
  );
  const availableOrigins = useMemo(
    () => [...new Set(variants.map((v) => v.products.origin).filter(Boolean) as string[])].sort(),
    [variants]
  );

  const processed = useMemo(() => {
    return variants
      .map((v) => ({
        variant: v,
        prices: computePrices(
          Number(v.weight_g),
          v.products.category,
          snapshot,
          v.pricing_rules,
          tiers
        ),
      }))
      .filter(({ variant: v, prices }) => {
        if (filters.categories.length > 0 && !filters.categories.includes(v.products.category)) return false;
        if (filters.weights.length > 0 && !filters.weights.includes(Number(v.weight_g))) return false;
        if (filters.brands.length > 0  && !filters.brands.includes(v.products.brand)) return false;
        if (filters.origins.length > 0 && !filters.origins.includes(v.products.origin ?? "")) return false;
        if (filters.availability.length > 0 && !filters.availability.includes(v.availability)) return false;
        if (filters.maxPrice !== null && prices.stock > filters.maxPrice) return false;
        return true;
      })
      .sort((a, b) => {
        switch (sort) {
          case "price_asc":   return a.prices.stock - b.prices.stock;
          case "price_desc":  return b.prices.stock - a.prices.stock;
          case "weight_asc":  return Number(a.variant.weight_g) - Number(b.variant.weight_g);
          case "weight_desc": return Number(b.variant.weight_g) - Number(a.variant.weight_g);
        }
      });
  }, [variants, tiers, snapshot, sort, filters]);

  return (
    <div>
      <FilterSortBar
        availableWeights={availableWeights}
        availableBrands={availableBrands}
        availableOrigins={availableOrigins}
        totalCount={processed.length}
        sort={sort}
        filters={filters}
        onSortChange={setSort}
        onFiltersChange={setFilters}
      />

      {processed.length === 0 ? (
        <div className="py-20 text-left md:text-center text-[#8A8A8A]">
          <p className="text-lg">Nema proizvoda koji odgovaraju filterima.</p>
          <button
            onClick={() => setFilters({ weights: [], maxPrice: null, brands: [], origins: [], availability: [] })}
            className="mt-4 text-sm text-[#BF8E41] hover:underline"
          >
            Obriši sve filtere
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {processed.slice(0, 8).map(({ variant: v, prices }) => (
            <ProductCard
              key={v.id}
              slug={v.slug}
              name={`${v.products.brand} ${v.weight_g >= 1000 ? `${Number(v.weight_g) / 1000}kg` : `${v.weight_g}g`}`}
              weightG={Number(v.weight_g)}
              images={v.images}
              availability={v.availability}
              leadTimeWeeks={v.lead_time_weeks}
              prices={prices}
            />
          ))}
        </div>
      )}
    </div>
  );
}
