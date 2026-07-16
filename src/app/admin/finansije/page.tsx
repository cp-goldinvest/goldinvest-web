"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Download,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  ShoppingBag,
  PackagePlus,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type RegisterFilter = "sve" | "bela" | "crna";

type RegisterBucket = {
  revenue_rsd: number;
  cogs_rsd: number;
  gross_profit_rsd: number;
  expenses_rsd: number;
  net_profit_rsd: number;
  purchased_rsd: number;
  sales_count: number;
};

type Summary = { from: string; to: string; bela: RegisterBucket; crna: RegisterBucket; total: RegisterBucket };

type Sale = {
  id: string;
  sale_number: number;
  sold_at: string;
  register_type: "bela" | "crna";
  payment_method: string;
  total_rsd: number;
  customers: { full_name: string; phone: string | null } | null;
  sale_items: { product_name_snapshot: string; variant_name_snapshot: string | null }[];
};

type Expense = {
  id: string;
  expense_date: string;
  category: string;
  register_type: "bela" | "crna";
  amount_rsd: number;
  description: string | null;
};

type Period = "danas" | "nedelja" | "mesec" | "custom";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRsd(n: number) {
  return new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: "RSD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

function formatDate(d: string) {
  return d.slice(0, 10).split("-").reverse().join(".");
}

function toIsoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function rangeForPeriod(period: Period): { from: string; to: string } {
  const now = new Date();
  const today = toIsoDate(now);
  if (period === "danas") return { from: today, to: today };
  if (period === "nedelja") {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 6);
    return { from: toIsoDate(weekAgo), to: today };
  }
  // mesec
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: toIsoDate(first), to: toIsoDate(last) };
}

const EXPENSE_CATEGORIES = ["Kirija", "Plate", "Komunalije", "Marketing", "Ostalo"];
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  gotovina: "Gotovina",
  racun: "Račun",
  kartica: "Kartica",
  ostalo: "Ostalo",
};

// ── Expense Modal ────────────────────────────────────────────────────────────

function ExpenseModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [category, setCategory] = useState("Kirija");
  const [customCategory, setCustomCategory] = useState("");
  const [registerType, setRegisterType] = useState<"bela" | "crna">("bela");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(toIsoDate(new Date()));
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    const amountNum = parseFloat(amount.replace(/\./g, "").replace(",", "."));
    const finalCategory = category === "Ostalo" && customCategory.trim() ? customCategory.trim() : category;
    if (!amountNum || amountNum <= 0) {
      setError("Unesi iznos");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expense_date: date,
          category: finalCategory,
          register_type: registerType,
          amount_rsd: amountNum,
          description: description || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Greška pri čuvanju");
        setSaving(false);
        return;
      }
      onSaved();
    } catch {
      setError("Greška pri čuvanju");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1B1B1C] border border-[#2E2E2F] rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#E9E6D9] font-semibold">Dodaj trošak</h3>
          <button onClick={onClose} className="text-[#555] hover:text-[#E9E6D9] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#555] block mb-1.5">Kategorija</label>
            <div className="grid grid-cols-3 gap-1.5">
              {EXPENSE_CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${
                    category === c
                      ? "bg-[#BF8E41]/15 border-[#BF8E41]/40 text-[#BF8E41]"
                      : "border-[#2E2E2F] text-[#555] hover:text-[#8A8A8A]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            {category === "Ostalo" && (
              <input
                type="text"
                placeholder="Opiši kategoriju"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full mt-2 bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#555] block mb-1.5">Iznos (RSD)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            </div>
            <div>
              <label className="text-xs text-[#555] block mb-1.5">Datum</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Kasa</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRegisterType("bela")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  registerType === "bela"
                    ? "bg-[#E9E6D9]/10 border-[#E9E6D9]/40 text-[#E9E6D9]"
                    : "border-[#2E2E2F] text-[#555] hover:text-[#8A8A8A]"
                }`}
              >
                Bela kasa
              </button>
              <button
                type="button"
                onClick={() => setRegisterType("crna")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  registerType === "crna"
                    ? "bg-[#8A8A8A]/10 border-[#8A8A8A]/40 text-[#8A8A8A]"
                    : "border-[#2E2E2F] text-[#555] hover:text-[#8A8A8A]"
                }`}
              >
                Crna kasa
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Opis (opcionalno)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[#2E2E2F] text-sm text-[#8A8A8A] hover:text-[#E9E6D9] transition-colors"
            >
              Otkaži
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-[#BF8E41] text-[#1B1B1C] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Čuvam..." : "Sačuvaj"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Register Card ─────────────────────────────────────────────────────────────

function RegisterCard({ title, bucket, accent }: { title: string; bucket: RegisterBucket; accent: string }) {
  return (
    <div className="bg-[#1B1B1C] border border-[#2E2E2F] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className={`text-xs font-semibold uppercase tracking-wider ${accent}`}>{title}</p>
        <span className="text-[10px] text-[#444]">{bucket.sales_count} prodaja</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-[#444]">Prihod</p>
          <p className="text-sm font-semibold text-[#E9E6D9] tabular-nums">{formatRsd(bucket.revenue_rsd)}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#444]">Nabavna vrednost</p>
          <p className="text-sm font-semibold text-[#8A8A8A] tabular-nums">{formatRsd(bucket.cogs_rsd)}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#444]">Bruto profit</p>
          <p className={`text-sm font-semibold tabular-nums ${bucket.gross_profit_rsd >= 0 ? "text-green-400" : "text-red-400"}`}>
            {formatRsd(bucket.gross_profit_rsd)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#444]">Troškovi</p>
          <p className="text-sm font-semibold text-[#8A8A8A] tabular-nums">{formatRsd(bucket.expenses_rsd)}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-[#2E2E2F] flex items-center justify-between">
        <p className="text-[10px] text-[#555] uppercase tracking-wider">Neto profit</p>
        <p className={`text-base font-bold tabular-nums ${bucket.net_profit_rsd >= 0 ? "text-green-400" : "text-red-400"}`}>
          {bucket.net_profit_rsd >= 0 ? "+" : ""}
          {formatRsd(bucket.net_profit_rsd)}
        </p>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AdminFinansijePage() {
  const [period, setPeriod] = useState<Period>("mesec");
  const [customFrom, setCustomFrom] = useState(toIsoDate(new Date()));
  const [customTo, setCustomTo] = useState(toIsoDate(new Date()));
  const [registerFilter, setRegisterFilter] = useState<RegisterFilter>("sve");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const range = period === "custom" ? { from: customFrom, to: customTo } : rangeForPeriod(period);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ from: range.from, to: range.to });
    const registerParam = registerFilter !== "sve" ? `&register_type=${registerFilter}` : "";

    const [summaryRes, salesRes, expensesRes] = await Promise.all([
      fetch(`/api/admin/finance/summary?${params.toString()}`),
      fetch(`/api/admin/sales?${params.toString()}${registerParam}`),
      fetch(`/api/admin/expenses?${params.toString()}${registerParam}`),
    ]);
    if (summaryRes.ok) setSummary(await summaryRes.json());
    if (salesRes.ok) setSales(await salesRes.json());
    if (expensesRes.ok) setExpenses(await expensesRes.json());
    setLoading(false);
  }, [range.from, range.to, registerFilter]);

  useEffect(() => {
    load();
  }, [load]);

  function handleExport() {
    const params = new URLSearchParams({ from: range.from, to: range.to });
    if (registerFilter !== "sve") params.set("register_type", registerFilter);
    window.location.href = `/api/admin/export?${params.toString()}`;
  }

  const totalBucket = summary?.total;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#E9E6D9]">Finansije</h1>
          <p className="text-sm text-[#555] mt-1">Prihodi, troškovi i profit razdvojeni po kasi.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#2E2E2F] text-xs text-[#8A8A8A] hover:text-[#E9E6D9] transition-colors"
          >
            <Plus size={13} />
            Dodaj trošak
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#BF8E41]/10 border border-[#BF8E41]/20 text-[#BF8E41] text-xs font-medium hover:bg-[#BF8E41]/20 transition-colors"
          >
            <Download size={13} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-[#111112] border border-[#2E2E2F] rounded-xl">
          {(["danas", "nedelja", "mesec", "custom"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                period === p ? "bg-[#1B1B1C] text-[#E9E6D9] border border-[#2E2E2F]" : "text-[#555] hover:text-[#8A8A8A]"
              }`}
            >
              {p === "danas" ? "Danas" : p === "nedelja" ? "7 dana" : p === "mesec" ? "Ovaj mesec" : "Prilagođeno"}
            </button>
          ))}
        </div>

        {period === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-1.5 text-xs text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
            />
            <span className="text-[#555] text-xs">do</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-1.5 text-xs text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
            />
          </div>
        )}

        <div className="flex items-center gap-1 p-1 bg-[#111112] border border-[#2E2E2F] rounded-xl">
          {(["sve", "bela", "crna"] as RegisterFilter[]).map((r) => (
            <button
              key={r}
              onClick={() => setRegisterFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                registerFilter === r ? "bg-[#1B1B1C] text-[#E9E6D9] border border-[#2E2E2F]" : "text-[#555] hover:text-[#8A8A8A]"
              }`}
            >
              {r === "sve" ? "Sve kase" : r === "bela" ? "Bela" : "Crna"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-[#555] text-sm">Učitavam finansije...</div>
      ) : (
        <>
          {/* Summary cards */}
          {totalBucket && (
            <div className="mb-5">
              <div className={`border rounded-xl p-5 flex items-center justify-between ${totalBucket.net_profit_rsd >= 0 ? "bg-green-500/5 border-green-500/15" : "bg-red-500/5 border-red-500/15"}`}>
                <div className="flex items-center gap-3">
                  <Wallet size={20} className="text-[#555]" />
                  <div>
                    <p className="text-xs text-[#555] uppercase tracking-wider">Ukupan neto profit</p>
                    <p className="text-[10px] text-[#444]">{formatDate(range.from)} - {formatDate(range.to)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {totalBucket.net_profit_rsd >= 0 ? (
                    <TrendingUp size={18} className="text-green-400" />
                  ) : (
                    <TrendingDown size={18} className="text-red-400" />
                  )}
                  <p className={`text-2xl font-bold tabular-nums ${totalBucket.net_profit_rsd >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {totalBucket.net_profit_rsd >= 0 ? "+" : ""}
                    {formatRsd(totalBucket.net_profit_rsd)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
            {summary && <RegisterCard title="Bela kasa" bucket={summary.bela} accent="text-[#E9E6D9]" />}
            {summary && <RegisterCard title="Crna kasa" bucket={summary.crna} accent="text-[#8A8A8A]" />}
          </div>

          {/* Recent sales */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag size={13} className="text-[#555]" />
              <h2 className="text-xs font-semibold text-[#555] uppercase tracking-widest">Prodaje u periodu</h2>
              <div className="h-px flex-1 bg-[#2E2E2F]" />
              <span className="text-xs text-[#444]">{sales.length}</span>
            </div>
            {sales.length === 0 ? (
              <p className="text-xs text-[#444]">Nema prodaja u ovom periodu.</p>
            ) : (
              <div className="space-y-1.5">
                {sales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#1B1B1C] border border-[#2E2E2F]">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#555]">#{sale.sale_number}</span>
                      <span className="text-xs text-[#8A8A8A]">{formatDate(sale.sold_at)}</span>
                      <span className="text-xs text-[#E9E6D9]">
                        {sale.sale_items.map((i) => i.product_name_snapshot).join(", ")}
                      </span>
                      {sale.customers && <span className="text-xs text-[#555]">· {sale.customers.full_name}</span>}
                      <span
                        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
                          sale.register_type === "crna"
                            ? "text-[#8A8A8A] bg-[#8A8A8A]/10 border-[#8A8A8A]/30"
                            : "text-[#E9E6D9] bg-[#E9E6D9]/10 border-[#E9E6D9]/25"
                        }`}
                      >
                        {sale.register_type === "crna" ? "CRNA" : "BELA"}
                      </span>
                      <span className="text-[10px] text-[#444]">{PAYMENT_METHOD_LABELS[sale.payment_method] ?? sale.payment_method}</span>
                    </div>
                    <span className="text-sm text-[#BF8E41] font-medium tabular-nums">{formatRsd(sale.total_rsd)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent purchases hint + expenses */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Receipt size={13} className="text-[#555]" />
              <h2 className="text-xs font-semibold text-[#555] uppercase tracking-widest">Troškovi u periodu</h2>
              <div className="h-px flex-1 bg-[#2E2E2F]" />
              <span className="text-xs text-[#444]">{expenses.length}</span>
            </div>
            {expenses.length === 0 ? (
              <p className="text-xs text-[#444]">Nema unetih troškova u ovom periodu.</p>
            ) : (
              <div className="space-y-1.5">
                {expenses.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#1B1B1C] border border-[#2E2E2F]">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#8A8A8A]">{formatDate(exp.expense_date)}</span>
                      <span className="text-xs text-[#E9E6D9]">{exp.category}</span>
                      {exp.description && <span className="text-xs text-[#555]">{exp.description}</span>}
                      <span
                        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
                          exp.register_type === "crna"
                            ? "text-[#8A8A8A] bg-[#8A8A8A]/10 border-[#8A8A8A]/30"
                            : "text-[#E9E6D9] bg-[#E9E6D9]/10 border-[#E9E6D9]/25"
                        }`}
                      >
                        {exp.register_type === "crna" ? "CRNA" : "BELA"}
                      </span>
                    </div>
                    <span className="text-sm text-[#8A8A8A] font-medium tabular-nums">{formatRsd(exp.amount_rsd)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-1.5 text-[10px] text-[#444]">
            <PackagePlus size={11} />
            Nabavljeno robe u periodu: {totalBucket ? formatRsd(totalBucket.purchased_rsd) : "-"}
          </div>
        </>
      )}

      {showExpenseModal && (
        <ExpenseModal
          onClose={() => setShowExpenseModal(false)}
          onSaved={() => {
            setShowExpenseModal(false);
            load();
          }}
        />
      )}
    </div>
  );
}
