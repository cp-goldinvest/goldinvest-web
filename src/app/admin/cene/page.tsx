"use client";

import { useState, useEffect, useCallback, useMemo, Fragment } from "react";
import { RotateCcw, Zap, TrendingUp, DollarSign, Sunrise, Check, ChevronRight, ChevronDown, Trash2, Plus } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────
type Tier = {
  id: string;
  name: string;
  category: string | null;
  weight_g: number | null;
  brand: string | null;
  margin_stock_pct: number;
  margin_advance_pct: number;
  margin_purchase_pct: number;
};

type BrandDraft = { brand: string; stock: string; advance: string; purchase: string };

type RuleRow = {
  override_stock_price: number | null;
  override_advance_price: number | null;
  override_purchase_price: number | null;
};

type VariantRow = {
  id: string;
  name: string;
  weight_g: number;
  purity: number;
  sku: string | null;
  products: { name: string; brand: string; category: string };
  pricing_rules: RuleRow[] | RuleRow | null;
};

type LivePrice = { rsd_per_gram: number; xau_eur: number; eur_rsd: number; eur_rsd_source?: string | null };

const EUR_RSD_SOURCE_BADGE: Record<string, { label: string; cls: string }> = {
  manual:   { label: "MANUAL",   cls: "bg-[#BF8E41]/10 text-[#BF8E41] border border-[#BF8E41]/30" },
  api:      { label: "API",      cls: "bg-green-500/10 text-green-400 border border-green-500/25" },
  fallback: { label: "FALLBACK", cls: "bg-orange-500/10 text-orange-400 border border-orange-500/25" },
};

function EurRsdBadge({ source }: { source?: string | null }) {
  const s = source && EUR_RSD_SOURCE_BADGE[source];
  if (!s) return null;
  return <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono tracking-wider ${s.cls}`}>{s.label}</span>;
}

const GRAMS_PER_OZ = 31.1034;

const CATEGORY_LABELS: Record<string, string> = {
  poluga: "Poluge", plocica: "Pločice", dukat: "Dukati", multipack: "Multipack",
};

function tierWeightLabel(t: Tier): string {
  if (t.weight_g === null) return "sve gramaže (catch-all)";
  const w = t.weight_g;
  if (w >= 1000) return `${w / 1000}kg`;
  if (Number.isInteger(w)) return `${w}g`;
  const oz = w / 31.1035;
  if (Math.abs(oz - 1) < 0.01) return "1 oz";
  if (Math.abs(oz - 0.5) < 0.01) return "1/2 oz";
  if (Math.abs(oz - 0.25) < 0.01) return "1/4 oz";
  if (Math.abs(oz - 0.1) < 0.01) return "1/10 oz";
  return `${w}g`;
}

function computeAutoPrice(weightG: number, category: string, brand: string, tiers: Tier[], spotPerGram: number, productName?: string): { stock: number; advance: number; purchase: number } {
  const wb = (t: Tier) => t.weight_g !== null && Math.abs(t.weight_g - weightG) < 0.001;

  // For dukati: match by product name (stored in tier's brand field), ignore weight
  const tier = (category === "dukat" || category === "multipack")
    ? (
        tiers.find(t => t.brand === productName && t.category === category) ??
        tiers.find(t => t.brand === null && t.category === category) ??
        tiers.find(t => t.brand === null && t.category === null)
      )
    : (
        tiers.find(t => t.brand === brand && wb(t) && t.category === category) ??
        tiers.find(t => t.brand === brand && wb(t) && t.category === null) ??
        tiers.find(t => t.brand === brand && t.weight_g === null && t.category === category) ??
        tiers.find(t => t.brand === brand && t.weight_g === null && t.category === null) ??
        tiers.find(t => t.brand === null && wb(t) && t.category === category) ??
        tiers.find(t => t.brand === null && wb(t) && t.category === null) ??
        tiers.find(t => t.brand === null && t.weight_g === null && t.category === category) ??
        tiers.find(t => t.brand === null && t.weight_g === null && t.category === null)
      );
  const ms = tier?.margin_stock_pct    ?? 3.0;
  const ma = tier?.margin_advance_pct  ?? 2.0;
  const mp = tier?.margin_purchase_pct ?? -2.0;
  return {
    stock:    Math.round(weightG * spotPerGram * (1 + ms / 100)),
    advance:  Math.round(weightG * spotPerGram * (1 + ma / 100)),
    purchase: Math.round(weightG * spotPerGram * (1 + mp / 100)),
  };
}

function formatRsd(n: number) {
  return new Intl.NumberFormat("sr-RS").format(Math.round(n));
}

function getAgeLabel(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 2) return "malopre";
  if (mins < 60) return `${mins} min`;
  if (hours < 24) return `${hours}h`;
  if (days === 1) return "juče";
  return `${days} dana`;
}

// ── Sub-components ─────────────────────────────────────────────
function TabButton({ active, onClick, icon, label, desc, badge }: {
  active: boolean; onClick: () => void; icon: React.ReactNode;
  label: string; desc: string; badge?: number;
}) {
  return (
    <button onClick={onClick} className={["flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all duration-200",
      active ? "bg-[#BF8E41]/15 border border-[#BF8E41]/40 text-[#BF8E41]"
             : "text-[#555] hover:text-[#E9E6D9] hover:bg-[#242425] border border-transparent"].join(" ")}>
      {icon}
      <div className="text-left">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{label}</span>
          {badge && badge > 0 && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-[#1B1B1C]">{badge}</span>}
        </div>
        <span className="text-[10px] opacity-60">{desc}</span>
      </div>
    </button>
  );
}

function TierCell({ value, onChange, color = "default" }: { value: string; onChange: (v: string) => void; color?: "gold" | "muted" | "default" }) {
  return (
    <div className="bg-[#1B1B1C] px-3 py-4">
      <div className="relative flex items-center">
        <input type="number" step="0.5" value={value} onChange={e => onChange(e.target.value)}
          className={["w-full bg-[#111112] border border-[#2E2E2F] rounded-lg pl-3 pr-7 py-2 text-sm tabular-nums focus:outline-none focus:border-[#BF8E41]/60 transition-colors",
            color === "gold" ? "text-[#BF8E41]" : color === "muted" ? "text-[#8A8A8A]" : "text-[#E9E6D9]"].join(" ")} />
        <span className="absolute right-2.5 text-xs text-[#555] pointer-events-none">%</span>
      </div>
    </div>
  );
}

function PriceCell({ autoPrice, value, onChange, color = "default" }: {
  autoPrice: number; value: string; onChange: (v: string) => void; color?: "gold" | "muted" | "default";
}) {
  const hasValue = value !== "";
  return (
    <div className="bg-[#1B1B1C] px-3 py-3">
      <input type="number" value={value} onChange={e => onChange(e.target.value)}
        placeholder={String(Math.round(autoPrice))}
        className={["w-full bg-[#111112] border rounded-lg px-3 py-1.5 text-sm tabular-nums focus:outline-none focus:border-[#BF8E41]/60 transition-colors",
          hasValue ? "border-[#BF8E41]/40 text-[#E9E6D9]" : "border-[#2E2E2F] placeholder-[#3A3A3B]",
          !hasValue && (color === "gold" ? "text-[#BF8E41]/40" : color === "muted" ? "text-[#555]" : "text-[#8A8A8A]/40")].join(" ")} />
      <p className="text-[10px] text-[#444] mt-1 pl-0.5 tabular-nums">auto: {formatRsd(autoPrice)}</p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function AdminCenePage() {
  const [activeTab, setActiveTab] = useState<"marze" | "cene" | "jutro">("marze");

  // Live price
  const [livePrice, setLivePrice] = useState<LivePrice | null>(null);
  const [liveFetchedAt, setLiveFetchedAt] = useState<Date>(new Date());

  // Jutarnji kurs
  const [eurRsd, setEurRsd] = useState("117.60");
  const [ratesSaving, setRatesSaving] = useState(false);
  const [ratesSaved, setRatesSaved] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);

  // Tiers
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [tierEdits, setTierEdits] = useState<Record<string, { stock: string; advance: string; purchase: string }>>({});
  const [tierSaving, setTierSaving] = useState(false);
  const [tierSaved, setTierSaved] = useState(false);
  const [tierError, setTierError] = useState<string | null>(null);

  // Brand tier expand/create state
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set());
  const [brandDrafts, setBrandDrafts] = useState<Record<string, BrandDraft>>({});
  const [brandSavingId, setBrandSavingId] = useState<string | null>(null);
  const [brandDeletingId, setBrandDeletingId] = useState<string | null>(null);
  const [brandCreatingFor, setBrandCreatingFor] = useState<string | null>(null);

  // Variants + overrides
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [overrideEdits, setOverrideEdits] = useState<Record<string, { stock: string; advance: string; purchase: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("sve");

  const spotPerGram = livePrice?.rsd_per_gram ?? 0;

  const knownBrands = useMemo(
    () => [...new Set(variants.map(v => v.products.brand))].sort(),
    [variants]
  );

  // For dukat tiers: returns product names. For others: returns brands filtered by category+weight.
  const brandsForTier = useCallback(
    (category: string | null, weight_g: number | null): string[] => {
      if (category === "dukat" || category === "multipack") {
        return [...new Set(
          variants
            .filter(v => v.products.category === category)
            .map(v => v.name)
        )].sort();
      }
      return [...new Set(
        variants
          .filter(v =>
            (category === null || v.products.category === category) &&
            (weight_g === null || Math.abs(Number(v.weight_g) - weight_g) < 0.001)
          )
          .map(v => v.products.brand)
      )].sort();
    },
    [variants]
  );

  const baseTiers = useMemo(() => tiers.filter(t => t.brand === null), [tiers]);
  const brandTiersByKey = useMemo(() => {
    const map: Record<string, Tier[]> = {};
    for (const t of tiers) {
      if (t.brand === null) continue;
      const key = `${t.weight_g ?? "null"}_${t.category ?? "null"}`;
      (map[key] ??= []).push(t);
    }
    return map;
  }, [tiers]);

  const loadData = useCallback(async () => {
    const [tiersRes, varRes, priceRes] = await Promise.all([
      fetch("/api/admin/tiers"),
      fetch("/api/admin/variants-with-rules"),
      fetch("/api/prices"),
    ]);

    if (tiersRes.ok) {
      const t: Tier[] = await tiersRes.json();
      setTiers(t);
      const edits: Record<string, { stock: string; advance: string; purchase: string }> = {};
      t.forEach(tier => {
        edits[tier.id] = {
          stock:    String(tier.margin_stock_pct),
          advance:  String(tier.margin_advance_pct),
          purchase: String(tier.margin_purchase_pct),
        };
      });
      setTierEdits(edits);
    }

    if (varRes.ok) {
      const v: VariantRow[] = await varRes.json();
      setVariants(v);
      const edits: Record<string, { stock: string; advance: string; purchase: string }> = {};
      v.forEach(variant => {
        const r = Array.isArray(variant.pricing_rules)
          ? variant.pricing_rules[0] ?? null
          : variant.pricing_rules;
        edits[variant.id] = {
          stock:    r?.override_stock_price    ? String(r.override_stock_price)    : "",
          advance:  r?.override_advance_price  ? String(r.override_advance_price)  : "",
          purchase: r?.override_purchase_price ? String(r.override_purchase_price) : "",
        };
      });
      setOverrideEdits(edits);
    }

    if (priceRes.ok) {
      const p = await priceRes.json();
      if (p.rsd_per_gram) { setLivePrice(p); setLiveFetchedAt(new Date()); }
      if (p.eur_rsd) setEurRsd(String(p.eur_rsd));
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Jutarnji kurs save ──
  async function handleSaveRates() {
    setRatesSaving(true); setRatesError(null);
    try {
      const res = await fetch("/api/admin/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eur_rsd: eurRsd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Greška");
      setRatesSaved(true);
      setTimeout(() => setRatesSaved(false), 4000);
      loadData();
    } catch (err) {
      setRatesError(err instanceof Error ? err.message : "Greška");
    } finally {
      setRatesSaving(false);
    }
  }

  // ── Tier save ──
  async function handleSaveTiers() {
    setTierSaving(true); setTierError(null);
    try {
      const payload = tiers.map(t => ({
        id: t.id,
        margin_stock_pct:    parseFloat(tierEdits[t.id]?.stock    ?? String(t.margin_stock_pct)),
        margin_advance_pct:  parseFloat(tierEdits[t.id]?.advance  ?? String(t.margin_advance_pct)),
        margin_purchase_pct: parseFloat(tierEdits[t.id]?.purchase ?? String(t.margin_purchase_pct)),
      }));
      const res = await fetch("/api/admin/tiers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Greška");
      setTierSaved(true);
      setTimeout(() => setTierSaved(false), 2500);
      loadData();
    } catch (err) {
      setTierError(err instanceof Error ? err.message : "Greška");
    } finally {
      setTierSaving(false);
    }
  }

  // ── Brand tier handlers ──
  async function handleSaveBrandTier(tierId: string) {
    setBrandSavingId(tierId);
    const e = tierEdits[tierId];
    try {
      const res = await fetch("/api/admin/tiers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{
          id: tierId,
          margin_stock_pct:    parseFloat(e?.stock    ?? "0"),
          margin_advance_pct:  parseFloat(e?.advance  ?? "0"),
          margin_purchase_pct: parseFloat(e?.purchase ?? "0"),
        }]),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Greška");
      loadData();
    } finally {
      setBrandSavingId(null);
    }
  }

  async function handleDeleteBrandTier(tierId: string, name: string) {
    if (!confirm(`Da li ste sigurni da želite da obrišete marže za "${name}"?`)) return;
    setBrandDeletingId(tierId);
    try {
      await fetch("/api/admin/tiers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tierId }),
      });
      loadData();
    } finally {
      setBrandDeletingId(null);
    }
  }

  async function handleCreateBrandTier(baseTier: Tier) {
    const draft = brandDrafts[baseTier.id];
    if (!draft?.brand) return;
    setBrandCreatingFor(baseTier.id);
    try {
      const res = await fetch("/api/admin/tiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${draft.brand} (${baseTier.name})`,
          category: baseTier.category,
          weight_g: baseTier.weight_g,
          brand: draft.brand,
          margin_stock_pct:    parseFloat(draft.stock    || String(baseTier.margin_stock_pct)),
          margin_advance_pct:  parseFloat(draft.advance  || String(baseTier.margin_advance_pct)),
          margin_purchase_pct: parseFloat(draft.purchase || String(baseTier.margin_purchase_pct)),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Greška");
      setBrandDrafts(p => { const n = { ...p }; delete n[baseTier.id]; return n; });
      loadData();
    } finally {
      setBrandCreatingFor(null);
    }
  }

  // ── Override save ──
  async function handleSaveOverride(variantId: string) {
    setSavingId(variantId);
    const e = overrideEdits[variantId];
    try {
      const res = await fetch("/api/admin/pricing-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variant_id: variantId,
          override_stock_price:    e?.stock    ? parseFloat(e.stock)    : null,
          override_advance_price:  e?.advance  ? parseFloat(e.advance)  : null,
          override_purchase_price: e?.purchase ? parseFloat(e.purchase) : null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setSavedId(variantId);
      setTimeout(() => setSavedId(null), 2000);
      loadData();
    } finally {
      setSavingId(null);
    }
  }

  // ── Override reset ──
  async function handleResetOverride(variantId: string) {
    await fetch("/api/admin/pricing-rules", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variant_id: variantId }),
    });
    setOverrideEdits(prev => ({ ...prev, [variantId]: { stock: "", advance: "", purchase: "" } }));
    loadData();
  }

  const overrideCount = variants.filter(v => {
    const e = overrideEdits[v.id];
    return e && (e.stock || e.advance || e.purchase);
  }).length;

  const categories = ["sve", ...new Set(variants.map(v => v.products.category))];
  const filtered = categoryFilter === "sve" ? variants : variants.filter(v => v.products.category === categoryFilter);

  const spotRsdG = livePrice
    ? formatRsd(livePrice.rsd_per_gram)
    : "-";

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[#E9E6D9]">Cene i marže</h1>
        {overrideCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <Zap size={13} className="text-amber-400" />
            <span className="text-xs font-medium text-amber-400">{overrideCount} aktivnih override-a</span>
          </div>
        )}
      </div>

      {/* Spot strip */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#1B1B1C] border border-[#2E2E2F] mb-6 w-fit">
        <span className="text-base font-bold text-[#BF8E41] tabular-nums">{spotRsdG} RSD/g</span>
        <span className="text-[#3A3A3B]">·</span>
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
        </span>
        <span className="text-xs text-[#555]">ažurirano pre <span className="text-[#8A8A8A]">{getAgeLabel(liveFetchedAt)}</span></span>
        <EurRsdBadge source={livePrice?.eur_rsd_source} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#1B1B1C] border border-[#2E2E2F] rounded-xl mb-6 w-fit">
        <TabButton active={activeTab === "marze"} onClick={() => setActiveTab("marze")} icon={<TrendingUp size={14} />} label="Postavi marže" desc="Globalno po kategoriji" />
        <TabButton active={activeTab === "cene"} onClick={() => setActiveTab("cene")} icon={<DollarSign size={14} />} label="Postavi cene" badge={overrideCount} desc="Override po proizvodu" />
        <TabButton active={activeTab === "jutro"} onClick={() => setActiveTab("jutro")} icon={<Sunrise size={14} />} label="Jutarnji kurs" desc="EUR/RSD kurs" />
      </div>

      {/* ── Tab: Jutarnji kurs ── */}
      {activeTab === "jutro" && (
        <div className="max-w-lg">
          <p className="text-xs text-[#555] mb-5">Svako jutro unesite kurs evra. Cena zlata (XAU/EUR) se vuče automatski.</p>

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1B1B1C] border border-[#2E2E2F] mb-5">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              <span className="text-xs text-[#555]">XAU/EUR automatski</span>
            </div>
            <span className="text-sm font-semibold text-[#E9E6D9] tabular-nums">
              €{livePrice ? livePrice.xau_eur.toLocaleString("de-DE", { minimumFractionDigits: 2 }) : "-"}
            </span>
            <span className="text-[11px] text-[#555] ml-auto">ažurirano pre {getAgeLabel(liveFetchedAt)}</span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#1B1B1C] border border-[#2E2E2F]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-[#E9E6D9]">EUR / RSD</p>
                  <p className="text-[11px] text-[#555] mt-0.5">Vaš kupovni kurs evra jutros</p>
                </div>
                <EurRsdBadge source={livePrice?.eur_rsd_source} />
              </div>
              <div className="flex items-center gap-3">
                <input type="number" step="0.01" value={eurRsd} onChange={e => setEurRsd(e.target.value)}
                  className="flex-1 bg-[#111112] border border-[#2E2E2F] rounded-lg px-4 py-2.5 text-xl font-bold text-[#E9E6D9] tabular-nums focus:outline-none focus:border-[#BF8E41]/60 transition-colors" />
                <span className="text-sm text-[#555] whitespace-nowrap">RSD / EUR</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#BF8E41]/5 border border-[#BF8E41]/20 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#BF8E41]/70 uppercase tracking-wider mb-1">Izračunata baza cena</p>
                <p className="text-3xl font-bold text-[#BF8E41] tabular-nums leading-none">
                  {spotRsdG}<span className="text-base font-medium text-[#8A8A8A] ml-1.5">RSD/g</span>
                </p>
              </div>
              <div className="text-right text-[11px] text-[#555] leading-relaxed">
                <p className="font-mono">€{livePrice?.xau_eur ?? "-"} ÷ {GRAMS_PER_OZ}</p>
                <p className="font-mono">× {eurRsd} RSD</p>
              </div>
            </div>

            {ratesError && <p className="text-xs text-red-400 px-1">{ratesError}</p>}

            <button onClick={handleSaveRates} disabled={ratesSaving}
              className={["w-full py-3 rounded-xl text-sm font-bold transition-all duration-200",
                ratesSaved ? "bg-green-500/10 text-green-400 border border-green-500/20"
                           : "gold-gradient-bg text-[#1B1B1C] hover:opacity-90 disabled:opacity-50"].join(" ")}>
              {ratesSaving ? "Čuvanje..." : ratesSaved
                ? <span className="flex items-center justify-center gap-2"><Check size={15} /> Kursevi sačuvani</span>
                : "Sačuvaj kurseve i ažuriraj sajt"}
            </button>
          </div>
        </div>
      )}

      {/* ── Tab: Marže ── */}
      {activeTab === "marze" && (
        <div>
          <p className="text-xs text-[#555] mb-4">Podesi procenat marže po kategoriji. Cene na sajtu se preračunavaju čim sačuvaš.</p>
          <div className="rounded-xl border border-[#2E2E2F] overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-px bg-[#2E2E2F] text-[10px] font-semibold text-[#555] uppercase tracking-wider">
              <div className="bg-[#242425] px-4 py-3">Kategorija / opseg</div>
              <div className="bg-[#242425] px-4 py-3 text-[#BF8E41]">Prodajna %</div>
              <div className="bg-[#242425] px-4 py-3">Avansna %</div>
              <div className="bg-[#242425] px-4 py-3">Otkupna %</div>
            </div>

            {baseTiers.map(tier => {
              const key = `${tier.weight_g ?? "null"}_${tier.category ?? "null"}`;
              const brandSubs = brandTiersByKey[key] ?? [];
              const isExpanded = expandedTiers.has(tier.id);
              const draft = brandDrafts[tier.id];

              return (
                <Fragment key={tier.id}>
                  {/* ── Base tier row ── */}
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-px bg-[#2E2E2F] border-t border-[#2E2E2F] first:border-t-0">
                    <div className="bg-[#1B1B1C] px-4 py-4 flex items-center gap-2">
                      <button
                        onClick={() => setExpandedTiers(p => { const n = new Set(p); n.has(tier.id) ? n.delete(tier.id) : n.add(tier.id); return n; })}
                        className="text-[#555] hover:text-[#E9E6D9] transition-colors shrink-0"
                        title={isExpanded ? "Skupi" : "Prikaži brendove"}
                      >
                        {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                      </button>
                      <div>
                        <p className="text-sm font-medium text-[#E9E6D9]">{tier.name}</p>
                        <p className="text-[11px] text-[#555] mt-0.5">
                          {tierWeightLabel(tier)}{tier.category ? ` · ${CATEGORY_LABELS[tier.category] ?? tier.category}` : ""}
                          {brandSubs.length > 0 && <span className="ml-2 text-[#BF8E41]/60">{brandSubs.length} brend{brandSubs.length !== 1 ? "a" : ""}</span>}
                        </p>
                      </div>
                    </div>
                    <TierCell value={tierEdits[tier.id]?.stock    ?? ""} onChange={v => setTierEdits(p => ({ ...p, [tier.id]: { ...p[tier.id], stock: v }    }))} color="gold" />
                    <TierCell value={tierEdits[tier.id]?.advance  ?? ""} onChange={v => setTierEdits(p => ({ ...p, [tier.id]: { ...p[tier.id], advance: v }  }))} />
                    <TierCell value={tierEdits[tier.id]?.purchase ?? ""} onChange={v => setTierEdits(p => ({ ...p, [tier.id]: { ...p[tier.id], purchase: v } }))} color="muted" />
                  </div>

                  {/* ── Brand sub-rows (visible when expanded) ── */}
                  {isExpanded && (
                    <>
                      {brandSubs.map(bt => (
                        <div key={bt.id} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-px bg-[#2A2A2B] border-t border-[#2E2E2F]">
                          <div className="bg-[#161617] pl-10 pr-3 py-3 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#BF8E41]/40 shrink-0" />
                            <span className="text-xs font-medium text-[#BF8E41] truncate">{bt.brand}</span>
                            <button
                              onClick={() => handleDeleteBrandTier(bt.id, bt.brand ?? "")}
                              disabled={brandDeletingId === bt.id}
                              className="ml-auto p-1 rounded text-[#555] hover:text-red-400 transition-colors disabled:opacity-40 shrink-0"
                              title="Obriši brend marže"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                          <TierCell value={tierEdits[bt.id]?.stock    ?? ""} onChange={v => setTierEdits(p => ({ ...p, [bt.id]: { ...p[bt.id], stock: v }    }))} color="gold" />
                          <TierCell value={tierEdits[bt.id]?.advance  ?? ""} onChange={v => setTierEdits(p => ({ ...p, [bt.id]: { ...p[bt.id], advance: v }  }))} />
                          <div className="bg-[#161617] px-3 py-3 flex items-center gap-2">
                            <div className="flex-1">
                              <div className="relative flex items-center">
                                <input type="number" step="0.5"
                                  value={tierEdits[bt.id]?.purchase ?? ""}
                                  onChange={e => setTierEdits(p => ({ ...p, [bt.id]: { ...p[bt.id], purchase: e.target.value } }))}
                                  className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg pl-3 pr-7 py-2 text-sm text-[#8A8A8A] tabular-nums focus:outline-none focus:border-[#BF8E41]/60 transition-colors" />
                                <span className="absolute right-2.5 text-xs text-[#555] pointer-events-none">%</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleSaveBrandTier(bt.id)}
                              disabled={brandSavingId === bt.id}
                              className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold gold-gradient-bg text-[#1B1B1C] hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                            >
                              {brandSavingId === bt.id ? "..." : "Sačuvaj"}
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* ── Add brand tier draft row ── */}
                      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-px bg-[#2A2A2B] border-t border-[#2E2E2F]">
                        <div className="bg-[#141415] pl-10 pr-3 py-3 flex items-center gap-2">
                          <Plus size={11} className="text-[#555] shrink-0" />
                          <select
                            value={draft?.brand ?? ""}
                            onChange={e => setBrandDrafts(p => ({ ...p, [tier.id]: { ...(p[tier.id] ?? { stock: "", advance: "", purchase: "" }), brand: e.target.value } }))}
                            className="bg-[#1B1B1C] border border-[#2E2E2F] rounded px-2 py-1 text-[11px] text-[#8A8A8A] focus:outline-none focus:border-[#BF8E41]/60 min-w-0 flex-1"
                          >
                            <option value="">- odaberi brend -</option>
                            {brandsForTier(tier.category, tier.weight_g)
                              .filter(b => !brandSubs.some(bt => bt.brand === b))
                              .map(b => <option key={b} value={b}>{b}</option>)
                            }
                          </select>
                        </div>
                        <TierCell value={draft?.stock ?? ""} onChange={v => setBrandDrafts(p => ({ ...p, [tier.id]: { ...(p[tier.id] ?? { brand: "", advance: "", purchase: "" }), stock: v } }))} color="gold" />
                        <TierCell value={draft?.advance ?? ""} onChange={v => setBrandDrafts(p => ({ ...p, [tier.id]: { ...(p[tier.id] ?? { brand: "", stock: "", purchase: "" }), advance: v } }))} />
                        <div className="bg-[#141415] px-3 py-3 flex items-center gap-2">
                          <div className="flex-1">
                            <div className="relative flex items-center">
                              <input type="number" step="0.5"
                                value={draft?.purchase ?? ""}
                                onChange={e => setBrandDrafts(p => ({ ...p, [tier.id]: { ...(p[tier.id] ?? { brand: "", stock: "", advance: "" }), purchase: e.target.value } }))}
                                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg pl-3 pr-7 py-2 text-sm text-[#8A8A8A] tabular-nums focus:outline-none focus:border-[#BF8E41]/60 transition-colors" />
                              <span className="absolute right-2.5 text-xs text-[#555] pointer-events-none">%</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCreateBrandTier(tier)}
                            disabled={!draft?.brand || brandCreatingFor === tier.id}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold gold-gradient-bg text-[#1B1B1C] hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                          >
                            {brandCreatingFor === tier.id ? "..." : "Dodaj"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </Fragment>
              );
            })}

            <div className="bg-[#1B1B1C] border-t border-[#2E2E2F] px-5 py-4 flex items-center justify-between">
              <p className="text-[11px] text-[#555]">
                Otkupna je negativna (npr. <span className="text-[#8A8A8A]">-2.00</span> = kupujemo za 2% ispod spot cene)
              </p>
              <div className="flex items-center gap-3">
                {tierError && <p className="text-xs text-red-400">{tierError}</p>}
                <button onClick={handleSaveTiers} disabled={tierSaving}
                  className={["px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                    tierSaved ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "gold-gradient-bg text-[#1B1B1C] hover:opacity-90 disabled:opacity-50"].join(" ")}>
                  {tierSaving ? "Čuvanje..." : tierSaved ? "✓ Sačuvano" : "Sačuvaj marže"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Cene (override) ── */}
      {activeTab === "cene" && (
        <div>
          <div className="flex flex-wrap items-start gap-4 mb-4 p-3.5 rounded-lg bg-[#1B1B1C] border border-[#2E2E2F]">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-[#2E2E2F] flex items-center justify-center text-[9px] text-[#555] shrink-0">A</span>
              <div>
                <p className="text-xs font-medium text-[#E9E6D9]">Prazno = automatska cena</p>
                <p className="text-[11px] text-[#555] mt-0.5">Računa se iz spot + marže po kategoriji</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-[#BF8E41]/20 flex items-center justify-center text-[9px] text-[#BF8E41] shrink-0">F</span>
              <div>
                <p className="text-xs font-medium text-[#E9E6D9]">Broj = fiksna cena</p>
                <p className="text-[11px] text-[#555] mt-0.5">Ignoriše spot, prikazuje se direktno na sajtu</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={["px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                  categoryFilter === cat ? "border-[#BF8E41] bg-[#BF8E41]/10 text-[#BF8E41]"
                                        : "border-[#2E2E2F] text-[#555] hover:text-[#E9E6D9] hover:border-[#3A3A3B]"].join(" ")}>
                {cat === "sve" ? "Svi" : CATEGORY_LABELS[cat] ?? cat}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-[#2E2E2F] overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-px bg-[#2E2E2F] text-[10px] font-semibold text-[#555] uppercase tracking-wider">
              <div className="bg-[#1B1B1C] px-4 py-3">Proizvod</div>
              <div className="bg-[#1B1B1C] px-4 py-3 text-[#BF8E41]">Prodajna RSD</div>
              <div className="bg-[#1B1B1C] px-4 py-3">Avansna RSD</div>
              <div className="bg-[#1B1B1C] px-4 py-3">Otkupna RSD</div>
              <div className="bg-[#1B1B1C] px-4 py-3">Akcija</div>
            </div>

            {filtered.map(v => {
              const e = overrideEdits[v.id] ?? { stock: "", advance: "", purchase: "" };
              const hasOverride = !!(e.stock || e.advance || e.purchase);
              const auto = computeAutoPrice(v.weight_g, v.products.category, v.products.brand, tiers, spotPerGram, v.name);

              return (
                <div key={v.id} className={["grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-px border-t border-[#2E2E2F] first:border-t-0",
                  hasOverride ? "bg-amber-500/5" : "bg-[#2E2E2F]"].join(" ")}>
                  <div className="bg-[#1B1B1C] px-4 py-3 flex items-center gap-2.5">
                    {hasOverride && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-[#E9E6D9]">{v.products.brand}</p>
                      <p className="text-xs text-[#555]">
                        {v.weight_g >= 1000 ? `${v.weight_g / 1000}kg` : `${v.weight_g}g`} · {CATEGORY_LABELS[v.products.category] ?? v.products.category}
                      </p>
                    </div>
                  </div>

                  <PriceCell autoPrice={auto.stock}    value={e.stock}    onChange={val => setOverrideEdits(p => ({ ...p, [v.id]: { ...p[v.id], stock: val }    }))} color="gold" />
                  <PriceCell autoPrice={auto.advance}  value={e.advance}  onChange={val => setOverrideEdits(p => ({ ...p, [v.id]: { ...p[v.id], advance: val }  }))} />
                  <PriceCell autoPrice={auto.purchase} value={e.purchase} onChange={val => setOverrideEdits(p => ({ ...p, [v.id]: { ...p[v.id], purchase: val } }))} color="muted" />

                  <div className="bg-[#1B1B1C] px-3 py-3 flex items-center gap-2">
                    <button onClick={() => handleSaveOverride(v.id)} disabled={savingId === v.id}
                      className={["px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap",
                        savedId === v.id ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                        : "gold-gradient-bg text-[#1B1B1C] hover:opacity-90 disabled:opacity-50"].join(" ")}>
                      {savingId === v.id ? "..." : savedId === v.id ? "✓ Ok" : "Sačuvaj"}
                    </button>
                    {hasOverride && (
                      <button onClick={() => handleResetOverride(v.id)}
                        className="p-1.5 rounded-lg text-[#555] hover:text-[#E9E6D9] hover:bg-[#2E2E2F] transition-colors" title="Resetuj na auto">
                        <RotateCcw size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
