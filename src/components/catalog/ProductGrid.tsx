"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { FilterSortBar, type SortOption, type Filters, type Option } from "./FilterSortBar";
import { computePrices, formatWeight } from "@/lib/pricing";
import type { ProductVariant, PricingTier, PricingRule, GoldPriceSnapshot } from "@/lib/supabase/types";

type VariantWithRelations = ProductVariant & {
  products: { name: string; brand: string; origin: string | null; category: string };
  pricing_rules: PricingRule | null;
};

function getCardName(v: VariantWithRelations): string {
  if (v.name) return v.name;
  if (v.products.name) return v.products.name;
  return `${v.products.brand} ${formatWeight(Number(v.weight_g))}`;
}

type ProcessedRow = {
  variant: VariantWithRelations;
  prices: ReturnType<typeof computePrices>;
};

function compareProcessed(a: ProcessedRow, b: ProcessedRow, sort: SortOption): number {
  switch (sort) {
    case "price_asc":
      return a.prices.stock - b.prices.stock;
    case "price_desc":
      return b.prices.stock - a.prices.stock;
    case "weight_asc":
      return Number(a.variant.weight_g) - Number(b.variant.weight_g);
    case "weight_desc":
      return Number(b.variant.weight_g) - Number(a.variant.weight_g);
    case "brand_asc": {
      const wa = Number(a.variant.weight_g) - Number(b.variant.weight_g);
      if (wa !== 0) return wa;
      return (a.variant.slug ?? "").localeCompare(b.variant.slug ?? "", "sr", { sensitivity: "base" });
    }
  }
}

function buildBrandGroups(
  processed: ProcessedRow[],
  sort: SortOption,
  maxItems: number | undefined
): { brand: string; items: ProcessedRow[] }[] {
  const byBrand = new Map<string, ProcessedRow[]>();
  for (const row of processed) {
    const b = row.variant.products.brand?.trim() || "Ostalo";
    const list = byBrand.get(b) ?? [];
    list.push(row);
    byBrand.set(b, list);
  }
  for (const arr of byBrand.values()) {
    arr.sort((a, b) => compareProcessed(a, b, sort));
  }
  const brandKeys = [...byBrand.keys()].sort((a, b) => a.localeCompare(b, "sr", { sensitivity: "base" }));

  const cap = maxItems ?? Number.POSITIVE_INFINITY;
  const limited: ProcessedRow[] = [];
  outer: for (const key of brandKeys) {
    const items = byBrand.get(key)!;
    for (const item of items) {
      if (limited.length >= cap) break outer;
      limited.push(item);
    }
  }

  const groups: { brand: string; items: ProcessedRow[] }[] = [];
  for (const row of limited) {
    const b = row.variant.products.brand?.trim() || "Ostalo";
    const last = groups[groups.length - 1];
    if (!last || last.brand !== b) groups.push({ brand: b, items: [row] });
    else last.items.push(row);
  }
  return groups;
}

type Props = {
  variants: VariantWithRelations[];
  tiers: PricingTier[];
  snapshot: GoldPriceSnapshot;
  /** Initial sort; user can still change it in the bar when visible. */
  defaultSort?: SortOption;
  /** Jedan vizuelni blok (redovi mreže) po brendu, brendovi A–Ž. */
  groupByBrand?: boolean;
  filterConfig?: {
    showCategoryFilter?: boolean;
    weightOptions?: Option<number>[];
    priceOptions?: Option<number>[];
    filterLabelText?: string;
    sortLabelText?: string;
    showPriceFilter?: boolean;
    showBrandFilter?: boolean;
    showOriginFilter?: boolean;
  };
  /** Hide the filter/sort bar (useful for competitor-like layouts). */
  hideFilterSortBar?: boolean;
  /** Override cards grid layout. */
  gridClassName?: string;
  /** Limit number of visible cards (omit for no limit). */
  maxItems?: number;
};

export function ProductGrid({
  variants,
  tiers,
  snapshot,
  defaultSort,
  groupByBrand,
  filterConfig,
  hideFilterSortBar,
  gridClassName,
  maxItems,
}: Props) {
  const [sort, setSort] = useState<SortOption>(defaultSort ?? "price_asc");
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
          case "brand_asc": {
            const ba = (a.variant.products.brand ?? "").localeCompare(b.variant.products.brand ?? "", "sr", {
              sensitivity: "base",
            });
            if (ba !== 0) return ba;
            const wa = Number(a.variant.weight_g) - Number(b.variant.weight_g);
            if (wa !== 0) return wa;
            return (a.variant.slug ?? "").localeCompare(b.variant.slug ?? "", "sr", { sensitivity: "base" });
          }
        }
      });
  }, [variants, tiers, snapshot, sort, filters]);

  const brandSections = useMemo(() => {
    if (!groupByBrand) return null;
    return buildBrandGroups(processed, sort, maxItems);
  }, [groupByBrand, processed, sort, maxItems]);

  const grid = gridClassName ?? "grid grid-cols-2 md:grid-cols-4 gap-4";

  return (
    <div>
      {!hideFilterSortBar && (
        <FilterSortBar
          availableWeights={availableWeights}
          availableBrands={availableBrands}
          availableOrigins={availableOrigins}
          totalCount={processed.length}
          sort={sort}
          filters={filters}
          onSortChange={setSort}
          onFiltersChange={setFilters}
          showCategoryFilter={filterConfig?.showCategoryFilter}
          weightOptions={filterConfig?.weightOptions}
          priceOptions={filterConfig?.priceOptions}
          filterLabelText={filterConfig?.filterLabelText}
          sortLabelText={filterConfig?.sortLabelText}
          showPriceFilter={filterConfig?.showPriceFilter}
          showBrandFilter={filterConfig?.showBrandFilter}
          showOriginFilter={filterConfig?.showOriginFilter}
        />
      )}

      {processed.length === 0 ? (
        <div className="py-20 text-left md:text-center text-[#8A8A8A]">
          <p className="text-lg">Nema proizvoda koji odgovaraju filterima.</p>
          <button
            onClick={() => setFilters({ categories: [], weights: [], maxPrice: null, brands: [], origins: [], availability: [] })}
            className="mt-4 text-sm text-[#BF8E41] hover:underline"
          >
            Obriši sve filtere
          </button>
        </div>
      ) : brandSections ? (
        <div className="mt-6 space-y-10">
          {brandSections.map(({ brand, items }) => (
            <div key={brand}>
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B5E3F] mb-4 border-b border-[#F0EDE6] pb-2"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                {brand}
              </p>
              <div className={grid}>
                {items.map(({ variant: v, prices }) => (
                  <ProductCard
                    key={v.id}
                    slug={v.slug}
                    name={getCardName(v)}
                    weightG={Number(v.weight_g)}
                    images={v.images}
                    availability={v.availability}
                    leadTimeWeeks={v.lead_time_weeks}
                    prices={prices}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`${grid} mt-6`}>
          {processed.slice(0, maxItems ?? Number.POSITIVE_INFINITY).map(({ variant: v, prices }) => (
            <ProductCard
              key={v.id}
              slug={v.slug}
              name={getCardName(v)}
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
