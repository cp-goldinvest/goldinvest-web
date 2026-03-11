"use client";

import { useState } from "react";
import { RotateCcw, Zap, TrendingUp, DollarSign, Sunrise, Check } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────
type Tier = {
  id: string;
  name: string;
  rangeLabel: string;
  stockPct: string;
  advancePct: string;
  purchasePct: string;
};

type Variant = {
  id: string;
  name: string;
  weightG: number;
  category: string;
  autoPrices: { stock: number; advance: number; purchase: number };
  override: { stock: string; advance: string; purchase: string } | null;
};

// ── Mock data ─────────────────────────────────────────────────
const INITIAL_TIERS: Tier[] = [
  { id: "t1", name: "Poluge male",    rangeLabel: "1g – 20g",    stockPct: "4.00", advancePct: "3.00", purchasePct: "-2.00" },
  { id: "t2", name: "Poluge srednje", rangeLabel: "21g – 100g",  stockPct: "3.00", advancePct: "2.00", purchasePct: "-2.00" },
  { id: "t3", name: "Poluge velike",  rangeLabel: "101g – 1kg",  stockPct: "2.00", advancePct: "1.50", purchasePct: "-1.50" },
  { id: "t4", name: "Pločice male",   rangeLabel: "1g – 20g",    stockPct: "4.50", advancePct: "3.50", purchasePct: "-2.50" },
  { id: "t5", name: "Dukati",         rangeLabel: "sve gramaze", stockPct: "5.00", advancePct: "4.00", purchasePct: "-3.00" },
  { id: "t6", name: "Kovanice",       rangeLabel: "sve gramaze", stockPct: "5.00", advancePct: "4.00", purchasePct: "-3.00" },
];

const MOCK_VARIANTS: Variant[] = [
  { id: "1",  name: "Argor-Heraeus",  weightG: 1,     category: "poluga", autoPrices: { stock: 10575,   advance: 10473,   purchase: 9965    }, override: null },
  { id: "2",  name: "Argor-Heraeus",  weightG: 5,     category: "poluga", autoPrices: { stock: 52875,   advance: 52365,   purchase: 49825   }, override: null },
  { id: "3",  name: "Argor-Heraeus",  weightG: 10,    category: "poluga", autoPrices: { stock: 105750,  advance: 104730,  purchase: 99650   }, override: null },
  { id: "4",  name: "Argor-Heraeus",  weightG: 20,    category: "poluga", autoPrices: { stock: 211500,  advance: 209460,  purchase: 199300  }, override: null },
  { id: "5",  name: "Argor-Heraeus",  weightG: 50,    category: "poluga", autoPrices: { stock: 523875,  advance: 513225,  purchase: 498250  }, override: null },
  { id: "6",  name: "Argor-Heraeus",  weightG: 100,   category: "poluga", autoPrices: { stock: 1047750, advance: 1025850, purchase: 996500  }, override: null },
  { id: "7",  name: "Argor-Heraeus",  weightG: 250,   category: "poluga", autoPrices: { stock: 2582625, advance: 2539875, purchase: 2491250 }, override: null },
  { id: "8",  name: "C. Hafner",      weightG: 100,   category: "poluga", autoPrices: { stock: 1047750, advance: 1025850, purchase: 996500  }, override: null },
  { id: "9",  name: "Franc Jozef",    weightG: 3.49,  category: "dukat",  autoPrices: { stock: 37212,   advance: 35614,   purchase: 33845   }, override: null },
  { id: "10", name: "Franc Jozef",    weightG: 13.96, category: "dukat",  autoPrices: { stock: 148826,  advance: 142450,  purchase: 135408  }, override: null },
];

const CATEGORY_LABELS: Record<string, string> = {
  poluga: "Poluge", plocica: "Pločice", dukat: "Dukati", novac: "Kovanice",
};

// ── Rates state type ──────────────────────────────────────────
type Rates = {
  eurRsd: string;
  xauEur: string;
};

// ── Main component ────────────────────────────────────────────
export default function AdminCenePage() {
  const [activeTab, setActiveTab] = useState<"marze" | "cene" | "jutro">("marze");

  // Jutarnji kursevi
  const [rates, setRates] = useState<Rates>({ eurRsd: "117.60", xauEur: "4375.00" });
  const [ratesSaving, setRatesSaving] = useState(false);
  const [ratesSaved, setRatesSaved] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);
  // Vreme poslednje izmene kurseva (mock: pre 2 dana)
  const [ratesUpdatedAt] = useState<Date>(() => {
    const d = new Date(); d.setDate(d.getDate() - 2); return d;
  });
  const [goldUpdatedAt] = useState<Date>(new Date());

  async function handleSaveRates() {
    setRatesSaving(true);
    setRatesError(null);
    try {
      const res = await fetch("/api/admin/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eur_rsd: rates.eurRsd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Greška pri čuvanju");
      setRatesSaved(true);
      setTimeout(() => setRatesSaved(false), 4000);
    } catch (err) {
      setRatesError(err instanceof Error ? err.message : "Greška");
    } finally {
      setRatesSaving(false);
    }
  }

  // Formula: (XAU/EUR ÷ 31,1034) × EUR/RSD
  const spotRsdG = rates.xauEur && rates.eurRsd
    ? ((parseFloat(rates.xauEur) / 31.1034) * parseFloat(rates.eurRsd)).toFixed(0)
    : "—";

  // Tiers state
  const [tiers, setTiers] = useState<Tier[]>(INITIAL_TIERS);
  const [tierSaving, setTierSaving] = useState(false);
  const [tierSaved, setTierSaved] = useState(false);

  // Variants state
  const [variants, setVariants] = useState<Variant[]>(MOCK_VARIANTS);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("sve");

  const overrideCount = variants.filter(
    (v) => v.override && (v.override.stock || v.override.advance || v.override.purchase)
  ).length;

  // Tier handlers
  function handleTierChange(id: string, field: keyof Omit<Tier, "id" | "name" | "rangeLabel">, value: string) {
    setTiers((prev) => prev.map((t) => t.id === id ? { ...t, [field]: value } : t));
  }
  async function handleSaveTiers() {
    setTierSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setTierSaving(false);
    setTierSaved(true);
    setTimeout(() => setTierSaved(false), 2500);
  }

  // Override handlers
  function handleOverrideChange(id: string, field: "stock" | "advance" | "purchase", value: string) {
    setVariants((prev) => prev.map((v) => {
      if (v.id !== id) return v;
      const cur = v.override ?? { stock: "", advance: "", purchase: "" };
      return { ...v, override: { ...cur, [field]: value } };
    }));
  }
  async function handleSave(id: string) {
    setSaving(id);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(null);
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  }
  function handleReset(id: string) {
    setVariants((prev) => prev.map((v) => v.id === id ? { ...v, override: null } : v));
  }

  const categories = ["sve", ...new Set(MOCK_VARIANTS.map((v) => v.category))];
  const filtered = categoryFilter === "sve" ? variants : variants.filter((v) => v.category === categoryFilter);

  return (
    <div className="p-6 lg:p-8 max-w-6xl">

      {/* ── Page title ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[#E9E6D9]">Cene i marže</h1>
        {overrideCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <Zap size={13} className="text-amber-400" />
            <span className="text-xs font-medium text-amber-400">{overrideCount} aktivnih override-a</span>
          </div>
        )}
      </div>

      {/* ── Spot price strip ── */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#1B1B1C] border border-[#2E2E2F] mb-6 w-fit">
        <span className="text-base font-bold text-[#BF8E41] tabular-nums">
          {new Intl.NumberFormat("sr-RS").format(Number(spotRsdG))} RSD/g
        </span>
        <span className="text-[#3A3A3B]">·</span>
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
        </span>
        <span className="text-xs text-[#555]">
          ažurirano pre <span className="text-[#8A8A8A]">{getAgeLabel(goldUpdatedAt)}</span>
        </span>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 p-1 bg-[#1B1B1C] border border-[#2E2E2F] rounded-xl mb-6 w-fit">
        <TabButton
          active={activeTab === "marze"}
          onClick={() => setActiveTab("marze")}
          icon={<TrendingUp size={14} />}
          label="Postavi marže"
          desc="Globalno po kategoriji"
        />
        <TabButton
          active={activeTab === "cene"}
          onClick={() => setActiveTab("cene")}
          icon={<DollarSign size={14} />}
          label="Postavi cene"
          badge={overrideCount > 0 ? overrideCount : undefined}
          desc="Override po proizvodu"
        />
        <TabButton
          active={activeTab === "jutro"}
          onClick={() => setActiveTab("jutro")}
          icon={<Sunrise size={14} />}
          label="Jutarnji kurs"
          desc="EUR/RSD kurs"
        />
      </div>

      {/* ── Tab: Jutarnji kurs ── */}
      {activeTab === "jutro" && (
        <div className="max-w-lg">
          <p className="text-xs text-[#555] mb-5">
            Svako jutro unesite kurseve iz vaše menjačnice. Cena zlata (XAU/USD) se vuce automatski svakih 30 minuta.
          </p>

          {/* Automatski fetch status */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1B1B1C] border border-[#2E2E2F] mb-5">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              <span className="text-xs text-[#555]">XAU/EUR automatski</span>
            </div>
            <span className="text-sm font-semibold text-[#E9E6D9] tabular-nums">€{rates.xauEur}</span>
            <span className="text-[11px] text-[#555] ml-auto">ažurirano pre 4 min</span>
          </div>

          <div className="space-y-4">
            {/* EUR/RSD */}
            <div className="p-4 rounded-xl bg-[#1B1B1C] border border-[#2E2E2F]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-[#E9E6D9]">EUR / RSD</p>
                  <p className="text-[11px] text-[#555] mt-0.5">Vaš kupovni kurs evra jutros</p>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-md bg-[#BF8E41]/10 text-[#BF8E41] border border-[#BF8E41]/20 font-mono">primaran</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.01"
                  value={rates.eurRsd}
                  onChange={(e) => setRates((r) => ({ ...r, eurRsd: e.target.value }))}
                  className="flex-1 bg-[#111112] border border-[#2E2E2F] rounded-lg px-4 py-2.5 text-xl font-bold text-[#E9E6D9] tabular-nums focus:outline-none focus:border-[#BF8E41]/60 transition-colors"
                />
                <span className="text-sm text-[#555] whitespace-nowrap">RSD / EUR</span>
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 rounded-xl bg-[#BF8E41]/5 border border-[#BF8E41]/20 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#BF8E41]/70 uppercase tracking-wider mb-1">Izračunata baza cena</p>
                <p className="text-3xl font-bold text-[#BF8E41] tabular-nums leading-none">
                  {new Intl.NumberFormat("sr-RS").format(Number(spotRsdG))}
                  <span className="text-base font-medium text-[#8A8A8A] ml-1.5">RSD/g</span>
                </p>
              </div>
              <div className="text-right text-[11px] text-[#555] leading-relaxed">
                <p className="font-mono">€{rates.xauEur} ÷ 31,1034</p>
                <p className="font-mono">× {rates.eurRsd} RSD</p>
              </div>
            </div>

            {ratesError && (
              <p className="text-xs text-red-400 px-1">{ratesError}</p>
            )}

            <button
              onClick={handleSaveRates}
              disabled={ratesSaving}
              className={[
                "w-full py-3 rounded-xl text-sm font-bold transition-all duration-200",
                ratesSaved
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "gold-gradient-bg text-[#1B1B1C] hover:opacity-90 disabled:opacity-50",
              ].join(" ")}
            >
              {ratesSaving ? "Čuvanje..." : ratesSaved
                ? <span className="flex items-center justify-center gap-2"><Check size={15} /> Kursevi sačuvani — sajt je ažuriran</span>
                : "Sačuvaj kurseve i ažuriraj sajt"
              }
            </button>
          </div>
        </div>
      )}

      {/* ── Tab: Marže ── */}
      {activeTab === "marze" && (
        <div>
          <p className="text-xs text-[#555] mb-4">
            Podesi procenat marže po kategoriji. Cene na sajtu se automatski preračunavaju čim sačuvaš.
          </p>
          <div className="rounded-xl border border-[#2E2E2F] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-px bg-[#2E2E2F] text-[10px] font-semibold text-[#555] uppercase tracking-wider">
              <div className="bg-[#242425] px-4 py-3">Kategorija / opseg</div>
              <div className="bg-[#242425] px-4 py-3 text-[#BF8E41]">Prodajna %</div>
              <div className="bg-[#242425] px-4 py-3">Avansna %</div>
              <div className="bg-[#242425] px-4 py-3">Otkupna %</div>
            </div>

            {tiers.map((tier) => (
              <div key={tier.id} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-px bg-[#2E2E2F] border-t border-[#2E2E2F] first:border-t-0">
                <div className="bg-[#1B1B1C] px-4 py-4">
                  <p className="text-sm font-medium text-[#E9E6D9]">{tier.name}</p>
                  <p className="text-[11px] text-[#555] mt-0.5">{tier.rangeLabel}</p>
                </div>
                <TierCell value={tier.stockPct}    onChange={(v) => handleTierChange(tier.id, "stockPct",    v)} color="gold"    />
                <TierCell value={tier.advancePct}  onChange={(v) => handleTierChange(tier.id, "advancePct",  v)}                 />
                <TierCell value={tier.purchasePct} onChange={(v) => handleTierChange(tier.id, "purchasePct", v)} color="muted"   />
              </div>
            ))}

            <div className="bg-[#1B1B1C] border-t border-[#2E2E2F] px-5 py-4 flex items-center justify-between">
              <p className="text-[11px] text-[#555]">
                Otkupna je negativna (npr. <span className="text-[#8A8A8A]">-2.00</span> = kupujemo za 2% ispod spot cene)
              </p>
              <button
                onClick={handleSaveTiers}
                disabled={tierSaving}
                className={[
                  "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  tierSaved
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "gold-gradient-bg text-[#1B1B1C] hover:opacity-90 disabled:opacity-50",
                ].join(" ")}
              >
                {tierSaving ? "Čuvanje..." : tierSaved ? "✓ Sačuvano" : "Sačuvaj marže"}
              </button>
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
                <p className="text-xs font-medium text-[#E9E6D9]">Prazno polje = automatska cena</p>
                <p className="text-[11px] text-[#555] mt-0.5">Cena se računa iz spot baze + marže po kategoriji</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-[#BF8E41]/20 flex items-center justify-center text-[9px] text-[#BF8E41] shrink-0">F</span>
              <div>
                <p className="text-xs font-medium text-[#E9E6D9]">Broj u polju = fiksna cena</p>
                <p className="text-[11px] text-[#555] mt-0.5">Ova cena se prikazuje na sajtu, ignoriše se spot</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <RotateCcw size={13} className="mt-0.5 text-[#555] shrink-0" />
              <div>
                <p className="text-xs font-medium text-[#E9E6D9]">Dugme ↺ = resetuj na auto</p>
                <p className="text-[11px] text-[#555] mt-0.5">Pojavljuje se pored "Sačuvaj" kada je fiksna cena aktivna</p>
              </div>
            </div>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={[
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                  categoryFilter === cat
                    ? "border-[#BF8E41] bg-[#BF8E41]/10 text-[#BF8E41]"
                    : "border-[#2E2E2F] text-[#555] hover:text-[#E9E6D9] hover:border-[#3A3A3B]",
                ].join(" ")}
              >
                {cat === "sve" ? "Svi" : CATEGORY_LABELS[cat] ?? cat}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-[#2E2E2F] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-px bg-[#2E2E2F] text-[10px] font-semibold text-[#555] uppercase tracking-wider">
              <div className="bg-[#1B1B1C] px-4 py-3">Proizvod</div>
              <div className="bg-[#1B1B1C] px-4 py-3 text-[#BF8E41]">Prodajna RSD</div>
              <div className="bg-[#1B1B1C] px-4 py-3">Avansna RSD</div>
              <div className="bg-[#1B1B1C] px-4 py-3">Otkupna RSD</div>
              <div className="bg-[#1B1B1C] px-4 py-3">Akcija</div>
            </div>

            {filtered.map((v) => {
              const hasOverride = v.override && (v.override.stock || v.override.advance || v.override.purchase);
              const isSaving = saving === v.id;
              const isSaved = saved === v.id;

              return (
                <div
                  key={v.id}
                  className={[
                    "grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-px border-t border-[#2E2E2F] first:border-t-0",
                    hasOverride ? "bg-amber-500/5" : "bg-[#2E2E2F]",
                  ].join(" ")}
                >
                  <div className="bg-[#1B1B1C] px-4 py-3 flex items-center gap-2.5">
                    {hasOverride && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-[#E9E6D9]">{v.name}</p>
                      <p className="text-xs text-[#555]">
                        {v.weightG >= 1000 ? `${v.weightG / 1000}kg` : `${v.weightG}g`}
                        {" · "}{CATEGORY_LABELS[v.category] ?? v.category}
                      </p>
                    </div>
                  </div>

                  <PriceCell autoPrice={v.autoPrices.stock}    value={v.override?.stock    ?? ""} onChange={(val) => handleOverrideChange(v.id, "stock",    val)} color="gold"  />
                  <PriceCell autoPrice={v.autoPrices.advance}  value={v.override?.advance  ?? ""} onChange={(val) => handleOverrideChange(v.id, "advance",  val)}              />
                  <PriceCell autoPrice={v.autoPrices.purchase} value={v.override?.purchase ?? ""} onChange={(val) => handleOverrideChange(v.id, "purchase", val)} color="muted" />

                  <div className="bg-[#1B1B1C] px-3 py-3 flex items-center gap-2">
                    <button
                      onClick={() => handleSave(v.id)}
                      disabled={isSaving}
                      className={[
                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap",
                        isSaved
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "gold-gradient-bg text-[#1B1B1C] hover:opacity-90 disabled:opacity-50",
                      ].join(" ")}
                    >
                      {isSaving ? "..." : isSaved ? "✓ Ok" : "Sačuvaj"}
                    </button>
                    {hasOverride && (
                      <button
                        onClick={() => handleReset(v.id)}
                        className="p-1.5 rounded-lg text-[#555] hover:text-[#E9E6D9] hover:bg-[#2E2E2F] transition-colors"
                        title="Resetuj na automatsku cenu"
                      >
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

// ── Time helpers ──────────────────────────────────────────────
function getAgeLabel(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (mins < 2) return "malopre";
  if (mins < 60) return `${mins} min`;
  if (hours < 24) return `${hours}h`;
  if (days === 1) return "juče";
  return `${days} dana`;
}

function getRateAgeWarning(date: Date): "ok" | "warn" | "danger" {
  const days = (Date.now() - date.getTime()) / 86400000;
  if (days >= 3) return "danger";
  if (days >= 1) return "warn";
  return "ok";
}

// ── Tab button ────────────────────────────────────────────────
function TabButton({
  active, onClick, icon, label, desc, badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  desc: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all duration-200",
        active
          ? "bg-[#BF8E41]/15 border border-[#BF8E41]/40 text-[#BF8E41]"
          : "text-[#555] hover:text-[#E9E6D9] hover:bg-[#242425] border border-transparent",
      ].join(" ")}
    >
      {icon}
      <div className="text-left">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{label}</span>
          {badge && badge > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-[#1B1B1C]">
              {badge}
            </span>
          )}
        </div>
        <span className="text-[10px] opacity-60">{desc}</span>
      </div>
    </button>
  );
}

// ── Tier cell ─────────────────────────────────────────────────
function TierCell({ value, onChange, color = "default" }: { value: string; onChange: (v: string) => void; color?: "gold" | "muted" | "default" }) {
  return (
    <div className="bg-[#1B1B1C] px-3 py-4">
      <div className="relative flex items-center">
        <input
          type="number"
          step="0.5"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={[
            "w-full bg-[#111112] border border-[#2E2E2F] rounded-lg pl-3 pr-7 py-2 text-sm tabular-nums focus:outline-none focus:border-[#BF8E41]/60 transition-colors",
            color === "gold" ? "text-[#BF8E41]" : color === "muted" ? "text-[#8A8A8A]" : "text-[#E9E6D9]",
          ].join(" ")}
        />
        <span className="absolute right-2.5 text-xs text-[#555] pointer-events-none">%</span>
      </div>
    </div>
  );
}

// ── Price cell ────────────────────────────────────────────────
function PriceCell({ autoPrice, value, onChange, color = "default" }: { autoPrice: number; value: string; onChange: (v: string) => void; color?: "gold" | "muted" | "default" }) {
  const hasValue = value !== "";
  return (
    <div className="bg-[#1B1B1C] px-3 py-3">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={String(Math.round(autoPrice))}
        className={[
          "w-full bg-[#111112] border rounded-lg px-3 py-1.5 text-sm tabular-nums focus:outline-none focus:border-[#BF8E41]/60 transition-colors",
          hasValue ? "border-[#BF8E41]/40 text-[#E9E6D9]" : "border-[#2E2E2F] placeholder-[#3A3A3B]",
          !hasValue && (color === "gold" ? "text-[#BF8E41]/40" : color === "muted" ? "text-[#555]" : "text-[#8A8A8A]/40"),
        ].join(" ")}
      />
      <p className="text-[10px] text-[#444] mt-1 pl-0.5 tabular-nums">
        auto: {new Intl.NumberFormat("sr-RS").format(Math.round(autoPrice))}
      </p>
    </div>
  );
}
