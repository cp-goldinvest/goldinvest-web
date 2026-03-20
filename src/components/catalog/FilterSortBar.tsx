"use client";

import { useState } from "react";
import { SlidersHorizontal, ArrowUpDown, ChevronDown, X } from "lucide-react";

export type SortOption = "price_asc" | "price_desc" | "weight_asc" | "weight_desc";

export type Filters = {
  categories: string[];
  weights: number[];
  maxPrice: number | null;
  brands: string[];
  origins: string[];
  availability: string[];
};

export type Option<T> = { label: string; value: T };

type Props = {
  availableWeights: number[];
  availableBrands: string[];
  availableOrigins: string[];
  totalCount: number;
  sort: SortOption;
  filters: Filters;
  onSortChange: (sort: SortOption) => void;
  onFiltersChange: (filters: Filters) => void;

  /** Optional UI overrides for category pages */
  showCategoryFilter?: boolean;
  categoryOptions?: Option<string>[];
  weightOptions?: Option<number>[];
  priceOptions?: Option<number>[];

  /** UI text overrides + page-specific filter visibility */
  filterLabelText?: string;
  sortLabelText?: string;
  showPriceFilter?: boolean;
  showBrandFilter?: boolean;
  showOriginFilter?: boolean;
};

const DEFAULT_CATEGORY_OPTIONS: Option<string>[] = [
  { label: "Zlatne pločice", value: "plocica" },
  { label: "Zlatne poluge",  value: "poluga"  },
  { label: "Zlatni dukati",  value: "dukat"   },
  { label: "Zlatnici",       value: "novac"   },
];

const DEFAULT_PRICE_OPTIONS: Option<number>[] = [
  { label: "Do 15.000 RSD",   value: 15_000 },
  { label: "Do 30.000 RSD",   value: 30_000 },
  { label: "Do 60.000 RSD",   value: 60_000 },
  { label: "Do 120.000 RSD",  value: 120_000 },
  { label: "Do 300.000 RSD",  value: 300_000 },
  { label: "Do 600.000 RSD",  value: 600_000 },
  { label: "Do 1.200.000 RSD",value: 1_200_000 },
];

const SORT_LABELS: Record<SortOption, string> = {
  price_asc:   "Od najniže cene",
  price_desc:  "Od najviše cene",
  weight_asc:  "Od najmanje težine",
  weight_desc: "Od najveće težine",
};

type OpenDropdown = "category" | "weight" | "price" | "brand" | "origin" | "sort" | null;

const EMPTY_FILTERS: Filters = { categories: [], weights: [], maxPrice: null, brands: [], origins: [], availability: [] };

export function FilterSortBar({
  availableWeights,
  availableBrands,
  availableOrigins,
  sort,
  filters,
  onSortChange,
  onFiltersChange,
  showCategoryFilter = true,
  categoryOptions,
  weightOptions,
  priceOptions,
  filterLabelText = "Filteri",
  sortLabelText = "Sortiraj po:",
  showPriceFilter = true,
  showBrandFilter = true,
  showOriginFilter = true,
}: Props) {
  const [open, setOpen] = useState<OpenDropdown>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const CATEGORY_OPTIONS = categoryOptions ?? DEFAULT_CATEGORY_OPTIONS;
  const PRICE_OPTIONS = priceOptions ?? DEFAULT_PRICE_OPTIONS;
  const WEIGHT_OPTIONS: Option<number>[] =
    weightOptions ?? availableWeights.map((w) => ({ value: w, label: w >= 1000 ? `${w / 1000}kg` : `${w}g` }));

  function toggle(d: OpenDropdown) {
    setOpen((prev) => (prev === d ? null : d));
  }

  function toggleCategory(c: string) {
    const next = filters.categories.includes(c)
      ? filters.categories.filter((x) => x !== c)
      : [...filters.categories, c];
    onFiltersChange({ ...filters, categories: next });
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

  function toggleOrigin(o: string) {
    const next = filters.origins.includes(o)
      ? filters.origins.filter((x) => x !== o)
      : [...filters.origins, o];
    onFiltersChange({ ...filters, origins: next });
  }

  const activeCount =
    (showCategoryFilter ? filters.categories.length : 0) +
    filters.weights.length +
    (showBrandFilter ? filters.brands.length : 0) +
    (showOriginFilter ? filters.origins.length : 0) +
    filters.availability.length +
    (showPriceFilter ? (filters.maxPrice ? 1 : 0) : 0);

  return (
    <div className="relative">
      {/* ─── MOBILE BAR ────────────────────────────────────────────── */}
      <div className="flex md:hidden items-center justify-between bg-white border-b border-[#E5E7EB] py-3">
        <button
          onClick={() => { setMobileOpen(!mobileOpen); setOpen(null); }}
          className={`flex items-center gap-2 border rounded-[10px] px-3 py-2 text-sm font-medium transition-colors ${
            mobileOpen || activeCount > 0
              ? "border-[#BF8E41] text-[#BF8E41] bg-[#FAF8F2]"
              : "border-[#E5E7EB] text-[#1B1B1C]"
          }`}
        >
          <SlidersHorizontal size={15} />
          {filterLabelText}
          {activeCount > 0 && (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#BF8E41] text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </button>

        {/* Mobile sort */}
        <div className="relative">
          <button
            onClick={() => toggle("sort")}
            className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-[10px] px-3 py-2 text-sm font-medium text-[#1B1B1C]"
          >
            <ArrowUpDown size={14} className="text-[#464747]" />
            <span className="max-w-[110px] truncate">{SORT_LABELS[sort]}</span>
            <ChevronDown size={13} className={`text-[#999] transition-transform ${open === "sort" ? "rotate-180" : ""}`} />
          </button>
          {open === "sort" && (
            <div className="absolute right-0 top-full mt-1 z-30 w-48 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => { onSortChange(opt); setOpen(null); }}
                  className={`w-full text-left px-4 py-3 text-sm border-b border-[#F3F4F6] last:border-0 transition-colors ${
                    sort === opt ? "text-[#BF8E41] bg-[#FAF8F2]" : "text-[#1B1B1C] hover:bg-[#F9F9F9]"
                  }`}
                >
                  {SORT_LABELS[opt]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter panel */}
      {mobileOpen && (
        <div className="flex md:hidden flex-col gap-5 bg-white border border-[#E5E7EB] rounded-xl p-4 mt-2 mb-2 shadow-sm">
          {showCategoryFilter && (
            <div>
              <p className="text-xs font-semibold text-[#464747] uppercase tracking-wider mb-2">Kategorija</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map(({ label, value }) => (
                  <button key={value} onClick={() => toggleCategory(value)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${filters.categories.includes(value) ? "border-[#BF8E41] bg-[#FAF8F2] text-[#BF8E41]" : "border-[#E5E7EB] text-[#1B1B1C]"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {WEIGHT_OPTIONS.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[#464747] uppercase tracking-wider mb-2">Težina</p>
              <div className="flex flex-wrap gap-2">
                {WEIGHT_OPTIONS.map(({ value: w, label }) => (
                  <button
                    key={w}
                    onClick={() => toggleWeight(w)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      filters.weights.includes(w)
                        ? "border-[#BF8E41] bg-[#FAF8F2] text-[#BF8E41]"
                        : "border-[#E5E7EB] text-[#1B1B1C]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {showBrandFilter && availableBrands.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[#464747] uppercase tracking-wider mb-2">Proizvođač</p>
              <div className="flex flex-col gap-2">
                {availableBrands.map((b) => (
                  <label key={b} className="flex items-center gap-2 cursor-pointer text-sm text-[#1B1B1C]">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(b)}
                      onChange={() => toggleBrand(b)}
                      className="accent-[#BF8E41]"
                    />
                    {b}
                  </label>
                ))}
              </div>
            </div>
          )}
          {showOriginFilter && availableOrigins.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[#464747] uppercase tracking-wider mb-2">Zemlja porekla</p>
              <div className="flex flex-col gap-2">
                {availableOrigins.map((o) => (
                  <label key={o} className="flex items-center gap-2 cursor-pointer text-sm text-[#1B1B1C]">
                    <input
                      type="checkbox"
                      checked={filters.origins.includes(o)}
                      onChange={() => toggleOrigin(o)}
                      className="accent-[#BF8E41]"
                    />
                    {o}
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between pt-1 border-t border-[#F3F4F6]">
            {activeCount > 0 ? (
              <button
                onClick={() => { onFiltersChange(EMPTY_FILTERS); setMobileOpen(false); }}
                className="flex items-center gap-1 text-sm text-[#999] hover:text-[#BF8E41]"
              >
                <X size={13} /> Obriši sve
              </button>
            ) : <span />}
            <button
              onClick={() => setMobileOpen(false)}
              className="px-5 py-2 bg-[#BF8E41] text-white text-sm rounded-lg font-medium"
            >
              Primeni
            </button>
          </div>
        </div>
      )}

      {/* ─── DESKTOP BAR ───────────────────────────────────────────── */}
      <div
        className="hidden md:flex items-center justify-between bg-white border-b border-[#E5E7EB]"
        style={{ height: 87.5 }}
      >
        {/* LEFT: filter buttons, each wrapped in relative for correct dropdown placement */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-[#464747]" />
            <span className="text-base font-medium text-[#464747]">{filterLabelText}:</span>
          </div>

          {/* Kategorija */}
          {showCategoryFilter && (
            <div className="relative">
              <FilterBtn label="Kategorija" active={filters.categories.length > 0} open={open === "category"} onClick={() => toggle("category")} />
              {open === "category" && (
                <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)] min-w-52">
                  <PanelHeader title="Kategorija" onClose={() => setOpen(null)} />
                  <div className="flex flex-col gap-1">
                    {CATEGORY_OPTIONS.map(({ label, value }) => (
                      <button key={value} onClick={() => toggleCategory(value)}
                        className={`text-left px-3 py-2 rounded-lg text-sm border transition-colors ${filters.categories.includes(value) ? "border-[#BF8E41] bg-[#FAF8F2] text-[#BF8E41]" : "border-transparent text-[#1B1B1C] hover:bg-[#F9F9F9]"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Težina */}
          <div className="relative">
            <FilterBtn label="Težina" active={filters.weights.length > 0} open={open === "weight"} onClick={() => toggle("weight")} />
            {open === "weight" && (
              <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)] min-w-56">
                <PanelHeader title="Težina" onClose={() => setOpen(null)} />
                <div className="flex flex-wrap gap-2">
                  {WEIGHT_OPTIONS.map(({ value: w, label }) => (
                    <button key={w} onClick={() => toggleWeight(w)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${filters.weights.includes(w) ? "border-[#BF8E41] bg-[#FAF8F2] text-[#BF8E41]" : "border-[#E5E7EB] text-[#1B1B1C] hover:border-[#BF8E41]/40"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cena */}
          {showPriceFilter && (
            <div className="relative">
              <FilterBtn label="Cena" active={!!filters.maxPrice} open={open === "price"} onClick={() => toggle("price")} />
              {open === "price" && (
                <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)] min-w-48">
                  <PanelHeader title="Maksimalna cena" onClose={() => setOpen(null)} />
                  <div className="flex flex-col gap-1">
                    {PRICE_OPTIONS.map(({ label, value }) => (
                      <button
                        key={value}
                        onClick={() => {
                          onFiltersChange({ ...filters, maxPrice: value });
                          setOpen(null);
                        }}
                        className={`text-left px-3 py-2 rounded-lg text-sm border transition-colors ${filters.maxPrice === value ? "border-[#BF8E41] bg-[#FAF8F2] text-[#BF8E41]" : "border-transparent text-[#1B1B1C] hover:bg-[#F9F9F9]"}`}
                      >
                        {label}
                      </button>
                    ))}
                    {filters.maxPrice && (
                      <button
                        onClick={() => onFiltersChange({ ...filters, maxPrice: null })}
                        className="text-left px-3 py-2 text-xs text-[#999] hover:text-[#BF8E41] flex items-center gap-1 mt-1"
                      >
                        <X size={11} /> Ukloni filter
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Proizvođač */}
          {showBrandFilter && (
            <div className="relative">
              <FilterBtn label="Proizvođač" active={filters.brands.length > 0} open={open === "brand"} onClick={() => toggle("brand")} />
              {open === "brand" && (
                <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)] min-w-48">
                  <PanelHeader title="Proizvođač" onClose={() => setOpen(null)} />
                  <div className="flex flex-col gap-2">
                    {availableBrands.map((b) => (
                      <label key={b} className="flex items-center gap-2 cursor-pointer text-sm text-[#1B1B1C]">
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(b)}
                          onChange={() => toggleBrand(b)}
                          className="accent-[#BF8E41]"
                        />
                        {b}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Zemlja porekla */}
          {showOriginFilter && (
            <div className="relative">
              <FilterBtn
                label="Zemlja porekla"
                active={filters.origins.length > 0}
                open={open === "origin"}
                onClick={() => toggle("origin")}
              />
              {open === "origin" && (
                <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)] min-w-48">
                  <PanelHeader title="Zemlja porekla" onClose={() => setOpen(null)} />
                  <div className="flex flex-col gap-2">
                    {availableOrigins.map((o) => (
                      <label key={o} className="flex items-center gap-2 cursor-pointer text-sm text-[#1B1B1C]">
                        <input
                          type="checkbox"
                          checked={filters.origins.includes(o)}
                          onChange={() => toggleOrigin(o)}
                          className="accent-[#BF8E41]"
                        />
                        {o}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeCount > 0 && (
            <button onClick={() => onFiltersChange(EMPTY_FILTERS)}
              className="flex items-center gap-1 text-sm text-[#999] hover:text-[#BF8E41] transition-colors">
              <X size={13} /> Obriši
            </button>
          )}
        </div>

        {/* RIGHT: sort */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ArrowUpDown size={20} className="text-[#464747]" />
            <span className="text-base font-medium text-[#464747]">{sortLabelText}</span>
          </div>
          <div className="relative">
            <button
              onClick={() => toggle("sort")}
              className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-[10px] px-4 text-sm font-medium text-[#1B1B1C] hover:border-[#BF8E41]/40 transition-colors"
              style={{ height: 38, minWidth: 172 }}
            >
              <span className="flex-1 text-left">{SORT_LABELS[sort]}</span>
              <ChevronDown size={14} className={`text-[#999] transition-transform ${open === "sort" ? "rotate-180" : ""}`} />
            </button>
            {open === "sort" && (
              <div className="absolute right-0 top-full mt-1 z-30 w-52 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                  <button key={opt} onClick={() => { onSortChange(opt); setOpen(null); }}
                    className={`w-full text-left px-4 py-3 text-sm border-b border-[#F3F4F6] last:border-0 transition-colors ${sort === opt ? "text-[#BF8E41] bg-[#FAF8F2]" : "text-[#1B1B1C] hover:bg-[#F9F9F9]"}`}>
                    {SORT_LABELS[opt]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active chips (desktop) */}
      {activeCount > 0 && (
        <div className="hidden md:flex flex-wrap gap-2 pt-3">
          {showCategoryFilter && filters.categories.map((c) => (
            <Chip key={c} label={CATEGORY_OPTIONS.find(o => o.value === c)?.label ?? c} onRemove={() => toggleCategory(c)} />
          ))}
          {filters.weights.map((w) => (
            <Chip key={w} label={WEIGHT_OPTIONS.find(o => o.value === w)?.label ?? (w >= 1000 ? `${w / 1000}kg` : `${w}g`)} onRemove={() => toggleWeight(w)} />
          ))}
          {showBrandFilter &&
            filters.brands.map((b) => (
              <Chip key={b} label={b} onRemove={() => toggleBrand(b)} />
            ))}
          {showOriginFilter &&
            filters.origins.map((o) => (
              <Chip key={o} label={o} onRemove={() => toggleOrigin(o)} />
            ))}
        </div>
      )}
    </div>
  );
}

function FilterBtn({ label, active, open, onClick }: { label: string; active: boolean; open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 bg-white border rounded-[10px] px-4 text-sm font-medium transition-colors ${
        active || open
          ? "border-[#BF8E41] text-[#BF8E41]"
          : "border-[#E5E7EB] text-[#1B1B1C] hover:border-[#BF8E41]/40"
      }`}
      style={{ height: 38 }}
    >
      {label}
      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#BF8E41]" />}
      <ChevronDown size={14} className={`text-[#999] transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

function PanelHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-semibold text-[#1B1B1C]">{title}</span>
      <button onClick={onClose} className="text-[#999] hover:text-[#1B1B1C]"><X size={14} /></button>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FAF8F2] text-[#BF8E41] border border-[#E5E7EB]">
      {label}
      <button onClick={onRemove} className="hover:text-[#1B1B1C]"><X size={11} /></button>
    </span>
  );
}
