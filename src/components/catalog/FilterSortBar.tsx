"use client";

import { useState } from "react";
import { SlidersHorizontal, ArrowUpDown, ChevronDown, X } from "lucide-react";

export type SortOption =
  | "price_asc"
  | "price_desc"
  | "weight_asc"
  | "weight_desc";

export type Filters = {
  weights: number[];
  maxPrice: number | null;
  brands: string[];
  origins: string[];
  availability: string[];
};

type Props = {
  availableWeights: number[];
  availableBrands: string[];
  availableOrigins: string[];
  totalCount: number;
  sort: SortOption;
  filters: Filters;
  onSortChange: (sort: SortOption) => void;
  onFiltersChange: (filters: Filters) => void;
};

const SORT_LABELS: Record<SortOption, string> = {
  price_asc:    "Od najniže cene",
  price_desc:   "Od najviše cene",
  weight_asc:   "Od najmanje težine",
  weight_desc:  "Od najveće težine",
};

export function FilterSortBar({
  availableWeights,
  availableBrands,
  availableOrigins,
  totalCount,
  sort,
  filters,
  onSortChange,
  onFiltersChange,
}: Props) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen]     = useState(false);

  const activeFilterCount =
    filters.weights.length +
    filters.brands.length +
    filters.origins.length +
    filters.availability.length +
    (filters.maxPrice ? 1 : 0);

  function clearFilters() {
    onFiltersChange({ weights: [], maxPrice: null, brands: [], origins: [], availability: [] });
  }

  function toggleWeight(w: number) {
    const next = filters.weights.includes(w)
      ? filters.weights.filter((x) => x !== w)
      : [...filters.weights, w];
    onFiltersChange({ ...filters, weights: next });
  }

  function toggleBrand(b: string) {
    const next = filters.brands.includes(b)
      ? filters.brands.filter((x) => x !== b)
      : [...filters.brands, b];
    onFiltersChange({ ...filters, brands: next });
  }

  function toggleAvailability(a: string) {
    const next = filters.availability.includes(a)
      ? filters.availability.filter((x) => x !== a)
      : [...filters.availability, a];
    onFiltersChange({ ...filters, availability: next });
  }

  return (
    <div className="relative">
      {/* Bar */}
      <div className="flex items-center justify-between gap-3 py-3">
        <p className="text-sm text-[#8A8A8A]">
          <span className="text-[#E9E6D9] font-medium">{totalCount}</span> proizvoda
        </p>

        <div className="flex items-center gap-2">
          {/* Filter button */}
          <button
            onClick={() => { setFilterOpen((v) => !v); setSortOpen(false); }}
            className={[
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
              filterOpen || activeFilterCount > 0
                ? "border-[#BF8E41] text-[#BF8E41] bg-[#BF8E41]/5"
                : "border-[#2E2E2F] text-[#E9E6D9] hover:border-[#BF8E41]/40",
            ].join(" ")}
          >
            <SlidersHorizontal size={15} />
            Filtriraj
            {activeFilterCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-xs bg-[#BF8E41] text-[#1B1B1C] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort button */}
          <button
            onClick={() => { setSortOpen((v) => !v); setFilterOpen(false); }}
            className={[
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
              sortOpen
                ? "border-[#BF8E41] text-[#BF8E41] bg-[#BF8E41]/5"
                : "border-[#2E2E2F] text-[#E9E6D9] hover:border-[#BF8E41]/40",
            ].join(" ")}
          >
            <ArrowUpDown size={15} />
            Sortiraj
            <ChevronDown size={13} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 pb-3">
          {filters.weights.map((w) => (
            <Chip key={w} label={`${w}g`} onRemove={() => toggleWeight(w)} />
          ))}
          {filters.brands.map((b) => (
            <Chip key={b} label={b} onRemove={() => toggleBrand(b)} />
          ))}
          {filters.availability.map((a) => (
            <Chip
              key={a}
              label={a === "in_stock" ? "Na stanju" : a === "preorder" ? "Preorder" : "Na upit"}
              onRemove={() => toggleAvailability(a)}
            />
          ))}
          <button
            onClick={clearFilters}
            className="text-xs text-[#8A8A8A] hover:text-[#BF8E41] transition-colors underline"
          >
            Obriši sve
          </button>
        </div>
      )}

      {/* Sort dropdown */}
      {sortOpen && (
        <div className="absolute right-0 top-full z-30 w-56 bg-[#242425] border border-[#2E2E2F] rounded-xl overflow-hidden shadow-2xl">
          {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
            <button
              key={opt}
              onClick={() => { onSortChange(opt); setSortOpen(false); }}
              className={[
                "w-full text-left px-4 py-3 text-sm border-b border-[#2E2E2F] last:border-0 transition-colors",
                sort === opt
                  ? "text-[#BF8E41] bg-[#BF8E41]/5"
                  : "text-[#E9E6D9] hover:bg-[#2E2E2F]",
              ].join(" ")}
            >
              {SORT_LABELS[opt]}
            </button>
          ))}
        </div>
      )}

      {/* Filter panel */}
      {filterOpen && (
        <div className="border border-[#2E2E2F] rounded-xl bg-[#242425] p-5 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Weight */}
          <FilterGroup label="Težina">
            <div className="flex flex-wrap gap-2">
              {availableWeights.map((w) => (
                <button
                  key={w}
                  onClick={() => toggleWeight(w)}
                  className={[
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                    filters.weights.includes(w)
                      ? "border-[#BF8E41] bg-[#BF8E41]/10 text-[#BF8E41]"
                      : "border-[#2E2E2F] text-[#8A8A8A] hover:border-[#BF8E41]/40 hover:text-[#E9E6D9]",
                  ].join(" ")}
                >
                  {w >= 1000 ? `${w / 1000}kg` : `${w}g`}
                </button>
              ))}
            </div>
          </FilterGroup>

          {/* Manufacturer */}
          <FilterGroup label="Proizvođač">
            {availableBrands.map((b) => (
              <CheckItem
                key={b}
                label={b}
                checked={filters.brands.includes(b)}
                onChange={() => toggleBrand(b)}
              />
            ))}
          </FilterGroup>

          {/* Origin */}
          <FilterGroup label="Država/Poreklo">
            {availableOrigins.map((o) => (
              <CheckItem
                key={o}
                label={o}
                checked={filters.origins.includes(o)}
                onChange={() => {
                  const next = filters.origins.includes(o)
                    ? filters.origins.filter((x) => x !== o)
                    : [...filters.origins, o];
                  onFiltersChange({ ...filters, origins: next });
                }}
              />
            ))}
          </FilterGroup>

          {/* Availability */}
          <FilterGroup label="Raspoloživost">
            {[
              { value: "in_stock",              label: "Na stanju" },
              { value: "preorder",              label: "Preorder" },
              { value: "available_on_request",  label: "Na upit" },
            ].map((a) => (
              <CheckItem
                key={a.value}
                label={a.label}
                checked={filters.availability.includes(a.value)}
                onChange={() => toggleAvailability(a.value)}
              />
            ))}
          </FilterGroup>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">{label}</p>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-[#2E2E2F] bg-[#1B1B1C] accent-[#BF8E41] cursor-pointer"
      />
      <span className={`text-sm transition-colors ${checked ? "text-[#BF8E41]" : "text-[#8A8A8A] group-hover:text-[#E9E6D9]"}`}>
        {label}
      </span>
    </label>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#BF8E41]/10 text-[#BF8E41] border border-[#BF8E41]/20">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors">
        <X size={11} />
      </button>
    </span>
  );
}
