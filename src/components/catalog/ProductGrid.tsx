"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { FilterSortBar, type SortOption, type Filters, type Option } from "./FilterSortBar";
import { computePrices, formatWeight } from "@/lib/pricing";
import { pickPricingRule } from "@/lib/site";
import type { ProductVariant, PricingTier, PricingRule, GoldPriceSnapshot } from "@/lib/supabase/types";

type VariantWithRelations = ProductVariant & {
  products: { name: string; brand: string; origin: string | null; category: string };
  pricing_rules: PricingRule[] | PricingRule | null;
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
  const weightRank = (w: number) => {
    if (Math.abs(w - 1) < 0.02) return 0;
    if (Math.abs(w - 2) < 0.02) return 1;
    if (Math.abs(w - 5) < 0.02) return 2;
    if (Math.abs(w - 10) < 0.02) return 3;
    return 999;
  };
  const brandPriority = (brandRaw: string) => {
    const b = (brandRaw ?? "").toLowerCase();
    if (b.includes("argor") && b.includes("heraeus")) return 0;
    if (b.includes("hafner")) return 1;
    return 999;
  };
  const featuredRank = (row: ProcessedRow) => {
    const category = row.variant.products.category;
    const bp = brandPriority(row.variant.products.brand);
    const wr = weightRank(Number(row.variant.weight_g));

    // Strict homepage featured order:
    // Argor 1/2/5/10, then Hafner 1/2/5/10.
    if (category === "plocica" && bp <= 1 && wr <= 3) return bp * 10 + wr;

    // Everything else comes after those 8 featured slots.
    return 1000;
  };

  switch (sort) {
    case "featured_home": {
      const fr = featuredRank(a) - featuredRank(b);
      if (fr !== 0) return fr;

      const bp = brandPriority(a.variant.products.brand) - brandPriority(b.variant.products.brand);
      if (bp !== 0) return bp;

      const wr = weightRank(Number(a.variant.weight_g)) - weightRank(Number(b.variant.weight_g));
      if (wr !== 0) return wr;

      const w = Number(a.variant.weight_g) - Number(b.variant.weight_g);
      if (w !== 0) return w;
      return (a.variant.slug ?? "").localeCompare(b.variant.slug ?? "", "sr", { sensitivity: "base" });
    }
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
  /** Enable pagination controls for current result set. */
  enablePagination?: boolean;
  /** Page size when pagination is enabled. */
  pageSize?: number;
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
  enablePagination,
  pageSize = 8,
}: Props) {
  const [sort, setSort] = useState<SortOption>(defaultSort ?? "price_asc");
  const [page, setPage] = useState(1);
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
          pickPricingRule(v.pricing_rules),
          tiers,
          v.products.brand,
          v.name
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
          case "featured_home": {
            const cmp = compareProcessed(a, b, "featured_home");
            if (cmp !== 0) return cmp;
            return 0;
          }
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

  const limitedProcessed = useMemo(
    () => processed.slice(0, maxItems ?? Number.POSITIVE_INFINITY),
    [processed, maxItems]
  );

  const shouldPaginate = Boolean(enablePagination);
  const totalPages = shouldPaginate ? Math.max(1, Math.ceil(limitedProcessed.length / pageSize)) : 1;
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const visibleProcessed = shouldPaginate ? limitedProcessed.slice(pageStart, pageEnd) : limitedProcessed;

  useEffect(() => {
    setPage(1);
  }, [sort, filters, variants.length]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const brandSections = useMemo(() => {
    if (!groupByBrand) return null;
    return buildBrandGroups(visibleProcessed, sort, undefined);
  }, [groupByBrand, visibleProcessed, sort]);

  const grid = gridClassName ?? "grid grid-cols-2 md:grid-cols-4 gap-4";

  return (
    <div>
      {!hideFilterSortBar && (
        <FilterSortBar
          availableWeights={availableWeights}
          availableBrands={availableBrands}
          availableOrigins={availableOrigins}
          totalCount={limitedProcessed.length}
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

      {limitedProcessed.length === 0 ? (
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
          {visibleProcessed.map(({ variant: v, prices }) => (
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

      {shouldPaginate && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold border border-[#1B1B1C]/20 text-[#1B1B1C] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Prethodna
          </button>
          <span className="px-2 text-sm text-[#6B6B6B]">
            {safePage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold border border-[#1B1B1C]/20 text-[#1B1B1C] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Sledeća
          </button>
        </div>
      )}
    </div>
  );
}
