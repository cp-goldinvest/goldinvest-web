"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  ShoppingBag,
  PackagePlus,
  X,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type RegisterFilter = "sve" | "bela" | "crna";

type RegisterBucket = {
  revenue_rsd: number;
  cogs_rsd: number;
  gross_profit_rsd: number;
  expenses_rsd: number;
  net_profit_additions_rsd: number;
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
  agents: { full_name: string } | null;
  sale_items: { product_name_snapshot: string; variant_name_snapshot: string | null }[];
};

type SaleItemDetail = {
  id: string;
  product_name_snapshot: string;
  variant_name_snapshot: string | null;
  weight_g_snapshot: number;
  category_snapshot: string;
  quantity: number;
  unit_price_rsd: number;
  line_total_rsd: number;
  purchase_price_snapshot_rsd: number | null;
  serial_number_snapshot: string | null;
};

type SaleDetail = {
  id: string;
  sale_number: number;
  register_type: "bela" | "crna";
  sold_at: string;
  payment_method: string;
  subtotal_rsd: number;
  total_rsd: number;
  invoice_number: string | null;
  note: string | null;
  customers: { full_name: string; phone: string | null; email: string | null } | null;
  agents: { full_name: string } | null;
  sale_items: SaleItemDetail[];
};

type Expense = {
  id: string;
  expense_date: string;
  category: string;
  register_type: "bela" | "crna";
  amount_rsd: number;
  description: string | null;
};

type NetProfitEntry = {
  id: string;
  occurred_at: string;
  amount_rsd: number;
  reason: string | null;
  cash_registers: { code: "bela_kasa" | "crna_kasa" | "beli_lager" | "crni_lager"; display_name: string } | null;
  agents: { full_name: string } | null;
};

type Period = "danas" | "nedelja" | "mesec" | "sve" | "custom";

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
  if (period === "sve") return { from: "2000-01-01", to: today };
  // mesec
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: toIsoDate(first), to: toIsoDate(last) };
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  gotovina: "Gotovina",
  racun: "Račun",
  kartica: "Kartica",
  ostalo: "Ostalo",
};

const EXPENSE_CATEGORIES = ["Kirija", "Plate", "Komunalije", "Marketing", "Ostalo"];

// ── Expense Edit Modal ────────────────────────────────────────────────────────

function ExpenseEditModal({
  expense,
  onClose,
  onSaved,
}: {
  expense: Expense;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isKnownCategory = EXPENSE_CATEGORIES.includes(expense.category);
  const [category, setCategory] = useState(isKnownCategory ? expense.category : "Ostalo");
  const [customCategory, setCustomCategory] = useState(isKnownCategory ? "" : expense.category);
  const [registerType, setRegisterType] = useState<"bela" | "crna">(expense.register_type);
  const [amount, setAmount] = useState(String(Math.round(expense.amount_rsd)));
  const [date, setDate] = useState(expense.expense_date.slice(0, 10));
  const [description, setDescription] = useState(expense.description ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    const amountNum = parseFloat(amount.replace(/\./g, "").replace(",", "."));
    const finalCategory = category === "Ostalo" && customCategory.trim() ? customCategory.trim() : category;
    if (!amountNum || amountNum <= 0) {
      setError("Unesi iznos");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/expenses/${expense.id}`, {
        method: "PATCH",
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

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/expenses/${expense.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Greška pri brisanju");
        setDeleting(false);
        return;
      }
      onSaved();
    } catch {
      setError("Greška pri brisanju");
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1B1B1C] border border-[#2E2E2F] rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#E9E6D9] font-semibold">Uredi trošak</h3>
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

          {confirmDelete ? (
            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 space-y-2">
              <p className="text-xs text-red-400">Sigurno obrisati ovaj trošak? Ako je već uknjižen u kasu, stanje će se automatski ispraviti.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2 rounded-lg border border-[#2E2E2F] text-xs text-[#8A8A8A] hover:text-[#E9E6D9] transition-colors"
                >
                  Otkaži
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-400 hover:bg-red-500/25 transition-colors disabled:opacity-50"
                >
                  {deleting ? "Brišem..." : "Da, obriši"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setConfirmDelete(true)}
                className="py-2.5 px-4 rounded-lg border border-red-500/20 text-sm text-red-400/80 hover:bg-red-500/10 transition-colors"
              >
                Obriši
              </button>
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
          )}
        </div>
      </div>
    </div>
  );
}

// ── Export Confirm Modal ─────────────────────────────────────────────────────

type ExportKind = "all" | "bela" | "crna" | "monthly";

const PERIOD_LABELS: Record<Period, string> = {
  danas: "danas",
  nedelja: "poslednjih 7 dana",
  mesec: "ovaj mesec",
  sve: "ceo period",
  custom: "prilagođen period",
};

function ExportConfirmModal({
  kind,
  periodLabel,
  onClose,
  onConfirm,
}: {
  kind: ExportKind;
  periodLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const text: Record<ExportKind, string> = {
    all: `Izvozi Prodaju, Nabavku i Troškove za ${periodLabel}.`,
    bela: `Izvozi samo BELU kasu za ${periodLabel}.`,
    crna: `Izvozi samo CRNU kasu za ${periodLabel}.`,
    monthly: "Izvozi pregled po mesecima za celu istoriju (bela i crna posebno).",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1B1B1C] border border-[#2E2E2F] rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <h3 className="text-[#E9E6D9] font-semibold mb-2">Export u Excel</h3>
        <p className="text-sm text-[#8A8A8A] mb-5">{text[kind]}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-[#2E2E2F] text-sm text-[#8A8A8A] hover:text-[#E9E6D9] transition-colors"
          >
            Otkaži
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg bg-[#BF8E41] text-[#1B1B1C] text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Izvezi
          </button>
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
      {bucket.net_profit_additions_rsd > 0 && (
        <div className="mt-3 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-green-500/5 text-[10px] text-green-400/90">
          <span>Neto dobit uneta u kasu</span>
          <span className="tabular-nums font-medium">+{formatRsd(bucket.net_profit_additions_rsd)}</span>
        </div>
      )}
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

// ── Sale Detail Modal ────────────────────────────────────────────────────────

type AgentLite = { id: string; full_name: string };

type ItemEdits = Record<string, { unit_price_rsd: string; purchase_price_snapshot_rsd: string; serial_number_snapshot: string }>;

function SaleDetailModal({ saleId, onClose, onSaved }: { saleId: string; onClose: () => void; onSaved: () => void }) {
  const [sale, setSale] = useState<SaleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<AgentLite[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmStorno, setConfirmStorno] = useState(false);
  const [storning, setStorning] = useState(false);

  // Header edit fields
  const [soldAt, setSoldAt] = useState("");
  const [registerType, setRegisterType] = useState<"bela" | "crna">("bela");
  const [paymentMethod, setPaymentMethod] = useState("gotovina");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [note, setNote] = useState("");
  const [agentId, setAgentId] = useState("");
  const [itemEdits, setItemEdits] = useState<ItemEdits>({});

  useEffect(() => {
    fetch("/api/admin/agents")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: AgentLite[]) => setAgents(data))
      .catch(() => {});
  }, []);

  const loadSale = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/sales/${saleId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SaleDetail | null) => {
        setSale(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [saleId]);

  useEffect(() => {
    loadSale();
  }, [loadSale]);

  function startEditing() {
    if (!sale) return;
    setSoldAt(sale.sold_at.slice(0, 10));
    setRegisterType(sale.register_type);
    setPaymentMethod(sale.payment_method);
    setInvoiceNumber(sale.invoice_number ?? "");
    setNote(sale.note ?? "");
    setAgentId(sale.agents ? (agents.find((a) => a.full_name === sale.agents!.full_name)?.id ?? "") : "");
    const edits: ItemEdits = {};
    for (const item of sale.sale_items) {
      edits[item.id] = {
        unit_price_rsd: String(Math.round(item.unit_price_rsd)),
        purchase_price_snapshot_rsd: String(Math.round(item.purchase_price_snapshot_rsd ?? 0)),
        serial_number_snapshot: item.serial_number_snapshot ?? "",
      };
    }
    setItemEdits(edits);
    setError("");
    setEditing(true);
  }

  async function handleSave() {
    if (!sale) return;
    setSaving(true);
    setError("");
    try {
      const items = sale.sale_items.map((item) => {
        const e = itemEdits[item.id];
        return {
          id: item.id,
          unit_price_rsd: parseFloat(e.unit_price_rsd.replace(/\./g, "").replace(",", ".")) || 0,
          purchase_price_snapshot_rsd: parseFloat(e.purchase_price_snapshot_rsd.replace(/\./g, "").replace(",", ".")) || 0,
          serial_number_snapshot: e.serial_number_snapshot || null,
        };
      });
      const res = await fetch(`/api/admin/sales/${saleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sold_at: soldAt,
          register_type: registerType,
          payment_method: paymentMethod,
          invoice_number: invoiceNumber || null,
          note: note || null,
          agent_id: agentId || null,
          items,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Greška pri čuvanju");
        setSaving(false);
        return;
      }
      setEditing(false);
      setSaving(false);
      loadSale();
      onSaved();
    } catch {
      setError("Greška pri čuvanju");
      setSaving(false);
    }
  }

  async function handleStorno() {
    setStorning(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/sales/${saleId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Greška pri storniranju");
        setStorning(false);
        return;
      }
      onSaved();
      onClose();
    } catch {
      setError("Greška pri storniranju");
      setStorning(false);
    }
  }

  const cogs = sale ? sale.sale_items.reduce((sum, i) => sum + (i.purchase_price_snapshot_rsd ?? 0) * i.quantity, 0) : 0;
  const profit = sale ? sale.total_rsd - cogs : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1B1B1C] border border-[#2E2E2F] rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        {loading || !sale ? (
          <div className="py-16 text-center text-[#555] text-sm">Učitavam...</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[#E9E6D9] font-semibold">Prodaja #{sale.sale_number}</h3>
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
                      sale.register_type === "crna"
                        ? "text-[#8A8A8A] bg-[#8A8A8A]/10 border-[#8A8A8A]/30"
                        : "text-[#E9E6D9] bg-[#E9E6D9]/10 border-[#E9E6D9]/25"
                    }`}
                  >
                    {sale.register_type === "crna" ? "CRNA" : "BELA"}
                  </span>
                </div>
                <p className="text-xs text-[#555]">{formatDate(sale.sold_at)}</p>
              </div>
              <div className="flex items-center gap-3">
                {!editing && (
                  <button onClick={startEditing} className="text-xs text-[#8A8A8A] hover:text-[#BF8E41] transition-colors">
                    Uredi
                  </button>
                )}
                <button onClick={onClose} className="text-[#555] hover:text-[#E9E6D9] transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {editing ? (
              <div className="space-y-4 mb-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#555] block mb-1.5">Datum prodaje</label>
                    <input
                      type="date"
                      value={soldAt}
                      onChange={(e) => setSoldAt(e.target.value)}
                      className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#555] block mb-1.5">Broj računa</label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
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
                        registerType === "bela" ? "bg-[#E9E6D9]/10 border-[#E9E6D9]/40 text-[#E9E6D9]" : "border-[#2E2E2F] text-[#555] hover:text-[#8A8A8A]"
                      }`}
                    >
                      Bela kasa
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterType("crna")}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        registerType === "crna" ? "bg-[#8A8A8A]/10 border-[#8A8A8A]/40 text-[#8A8A8A]" : "border-[#2E2E2F] text-[#555] hover:text-[#8A8A8A]"
                      }`}
                    >
                      Crna kasa
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#555] block mb-1.5">Način plaćanja</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
                    >
                      {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#555] block mb-1.5">Agent</label>
                    <select
                      value={agentId}
                      onChange={(e) => setAgentId(e.target.value)}
                      className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
                    >
                      <option value="">-</option>
                      {agents.map((a) => (
                        <option key={a.id} value={a.id}>{a.full_name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#555] block mb-1.5">Napomena</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
                  />
                </div>

                <div>
                  <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Stavke</p>
                  <div className="space-y-2">
                    {sale.sale_items.map((item) => (
                      <div key={item.id} className="px-3 py-2.5 rounded-lg bg-[#111112] border border-[#2E2E2F]">
                        <p className="text-xs text-[#E9E6D9] mb-2">
                          {item.product_name_snapshot}{item.variant_name_snapshot ? ` - ${item.variant_name_snapshot}` : ""}
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-[#555] block mb-1">Prodajna cena</label>
                            <input
                              type="number"
                              value={itemEdits[item.id]?.unit_price_rsd ?? ""}
                              onChange={(e) => setItemEdits((prev) => ({ ...prev, [item.id]: { ...prev[item.id], unit_price_rsd: e.target.value } }))}
                              className="w-full bg-[#1B1B1C] border border-[#2E2E2F] rounded-lg px-2 py-1.5 text-xs text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-[#555] block mb-1">Nabavna cena</label>
                            <input
                              type="number"
                              value={itemEdits[item.id]?.purchase_price_snapshot_rsd ?? ""}
                              onChange={(e) => setItemEdits((prev) => ({ ...prev, [item.id]: { ...prev[item.id], purchase_price_snapshot_rsd: e.target.value } }))}
                              className="w-full bg-[#1B1B1C] border border-[#2E2E2F] rounded-lg px-2 py-1.5 text-xs text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-[#555] block mb-1">Serijski broj</label>
                            <input
                              type="text"
                              value={itemEdits[item.id]?.serial_number_snapshot ?? ""}
                              onChange={(e) => setItemEdits((prev) => ({ ...prev, [item.id]: { ...prev[item.id], serial_number_snapshot: e.target.value } }))}
                              className="w-full bg-[#1B1B1C] border border-[#2E2E2F] rounded-lg px-2 py-1.5 text-xs text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 py-2.5 rounded-lg border border-[#2E2E2F] text-sm text-[#8A8A8A] hover:text-[#E9E6D9] transition-colors"
                  >
                    Otkaži
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-lg bg-[#BF8E41] text-[#1B1B1C] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {saving ? "Čuvam..." : "Sačuvaj izmene"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="px-3 py-2 rounded-lg bg-[#111112] border border-[#2E2E2F]">
                    <p className="text-[10px] text-[#555] mb-0.5">Kupac</p>
                    <p className="text-xs text-[#E9E6D9]">{sale.customers?.full_name ?? "Bez kupca"}</p>
                    {sale.customers?.phone && <p className="text-[10px] text-[#555]">{sale.customers.phone}</p>}
                    {sale.customers?.email && <p className="text-[10px] text-[#555]">{sale.customers.email}</p>}
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-[#111112] border border-[#2E2E2F]">
                    <p className="text-[10px] text-[#555] mb-0.5">Agent</p>
                    <p className="text-xs text-[#E9E6D9]">{sale.agents?.full_name ?? "-"}</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-[#111112] border border-[#2E2E2F]">
                    <p className="text-[10px] text-[#555] mb-0.5">Način plaćanja</p>
                    <p className="text-xs text-[#E9E6D9]">{PAYMENT_METHOD_LABELS[sale.payment_method] ?? sale.payment_method}</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-[#111112] border border-[#2E2E2F]">
                    <p className="text-[10px] text-[#555] mb-0.5">Broj računa</p>
                    <p className="text-xs text-[#E9E6D9]">{sale.invoice_number ?? "-"}</p>
                  </div>
                  {sale.note && (
                    <div className="col-span-2 px-3 py-2 rounded-lg bg-[#111112] border border-[#2E2E2F]">
                      <p className="text-[10px] text-[#555] mb-0.5">Napomena</p>
                      <p className="text-xs text-[#E9E6D9]">{sale.note}</p>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="mb-5">
                  <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Stavke ({sale.sale_items.length})</p>
                  <div className="space-y-1.5">
                    {sale.sale_items.map((item) => {
                      const itemCogs = (item.purchase_price_snapshot_rsd ?? 0) * item.quantity;
                      const itemProfit = item.line_total_rsd - itemCogs;
                      return (
                        <div key={item.id} className="px-3 py-2.5 rounded-lg bg-[#111112] border border-[#2E2E2F]">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-[#E9E6D9]">
                              {item.product_name_snapshot}
                              {item.variant_name_snapshot ? ` - ${item.variant_name_snapshot}` : ""}
                              <span className="text-[#555]"> · {item.weight_g_snapshot}g</span>
                              {item.quantity > 1 && <span className="text-[#555]"> · {item.quantity}kom</span>}
                            </p>
                            <p className="text-sm text-[#BF8E41] font-medium tabular-nums">{formatRsd(item.line_total_rsd)}</p>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-[#555]">
                            {item.serial_number_snapshot && <span>SN {item.serial_number_snapshot}</span>}
                            <span>Nabavna: {formatRsd(itemCogs)}</span>
                            <span className={itemProfit >= 0 ? "text-green-400/80" : "text-red-400/80"}>
                              Profit: {itemProfit >= 0 ? "+" : ""}{formatRsd(itemProfit)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Totals */}
                <div className="pt-4 border-t border-[#2E2E2F] space-y-1.5 mb-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#555]">Ukupno naplaćeno</span>
                    <span className="text-[#E9E6D9] tabular-nums">{formatRsd(sale.total_rsd)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#555]">Nabavna vrednost</span>
                    <span className="text-[#8A8A8A] tabular-nums">{formatRsd(cogs)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold pt-1">
                    <span className="text-[#555] uppercase tracking-wider text-[10px]">Profit</span>
                    <span className={`tabular-nums ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {profit >= 0 ? "+" : ""}
                      {formatRsd(profit)}
                    </span>
                  </div>
                </div>

                {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

                {confirmStorno ? (
                  <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 space-y-2">
                    <p className="text-xs text-red-400">
                      Sigurno stornirati ovu prodaju? Stavka se vraća na lager, kasa se automatski ispravlja.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmStorno(false)}
                        className="flex-1 py-2 rounded-lg border border-[#2E2E2F] text-xs text-[#8A8A8A] hover:text-[#E9E6D9] transition-colors"
                      >
                        Otkaži
                      </button>
                      <button
                        onClick={handleStorno}
                        disabled={storning}
                        className="flex-1 py-2 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-400 hover:bg-red-500/25 transition-colors disabled:opacity-50"
                      >
                        {storning ? "Storniram..." : "Da, storniraj"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmStorno(true)}
                    className="text-xs text-red-400/70 hover:text-red-400 transition-colors"
                  >
                    Storniraj prodaju
                  </button>
                )}
              </>
            )}
          </>
        )}
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
  const [netProfitEntries, setNetProfitEntries] = useState<NetProfitEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportConfirm, setExportConfirm] = useState<ExportKind | null>(null);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const range = period === "custom" ? { from: customFrom, to: customTo } : rangeForPeriod(period);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ from: range.from, to: range.to });
    const registerParam = registerFilter !== "sve" ? `&register_type=${registerFilter}` : "";

    const [summaryRes, salesRes, expensesRes, netProfitRes] = await Promise.all([
      fetch(`/api/admin/finance/summary?${params.toString()}`),
      fetch(`/api/admin/sales?${params.toString()}${registerParam}`),
      fetch(`/api/admin/expenses?${params.toString()}${registerParam}`),
      registerFilter === "bela"
        ? Promise.resolve(null)
        : fetch(`/api/admin/kase/transactions?register_code=crna_kasa&entry_type=manual_adjustment&is_net_profit=true&${params.toString()}`),
    ]);
    if (summaryRes.ok) setSummary(await summaryRes.json());
    if (salesRes.ok) setSales(await salesRes.json());
    if (expensesRes.ok) setExpenses(await expensesRes.json());
    setNetProfitEntries(netProfitRes && netProfitRes.ok ? await netProfitRes.json() : []);
    setLoading(false);
  }, [range.from, range.to, registerFilter]);

  useEffect(() => {
    load();
  }, [load]);

  function runExport(kind: ExportKind) {
    if (kind === "monthly") {
      window.location.href = `/api/admin/export/monthly`;
    } else if (kind === "all") {
      const params = new URLSearchParams({ from: range.from, to: range.to });
      if (registerFilter !== "sve") params.set("register_type", registerFilter);
      window.location.href = `/api/admin/export?${params.toString()}`;
    } else {
      const params = new URLSearchParams({ from: range.from, to: range.to, register_type: kind });
      window.location.href = `/api/admin/export?${params.toString()}`;
    }
    setExportConfirm(null);
  }

  const totalBucket = summary?.total;

  type PeriodItem =
    | { kind: "sale"; date: string; sale: Sale }
    | { kind: "net_profit"; date: string; entry: NetProfitEntry };

  const periodItems: PeriodItem[] = [
    ...sales.map((s): PeriodItem => ({ kind: "sale", date: s.sold_at, sale: s })),
    ...netProfitEntries.map((e): PeriodItem => ({ kind: "net_profit", date: e.occurred_at, entry: e })),
  ].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#E9E6D9]">Finansije</h1>
          <p className="text-sm text-[#555] mt-1">Prihodi, troškovi i profit razdvojeni po kasi.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExportConfirm("all")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#BF8E41]/10 border border-[#BF8E41]/20 text-[#BF8E41] text-xs font-medium hover:bg-[#BF8E41]/20 transition-colors"
          >
            <Download size={13} />
            Export Excel
          </button>
          <div className="flex items-center gap-1 p-1 bg-[#111112] border border-[#2E2E2F] rounded-lg">
            <button
              onClick={() => setExportConfirm("bela")}
              title="Export samo bele kase za trenutni period"
              className="px-2.5 py-1 rounded-md text-[10px] font-medium text-[#8A8A8A] hover:text-[#E9E6D9] transition-colors"
            >
              Bela
            </button>
            <button
              onClick={() => setExportConfirm("crna")}
              title="Export samo crne kase za trenutni period"
              className="px-2.5 py-1 rounded-md text-[10px] font-medium text-[#8A8A8A] hover:text-[#E9E6D9] transition-colors"
            >
              Crna
            </button>
          </div>
          <button
            onClick={() => setExportConfirm("monthly")}
            title="Pregled po mesecima, cela istorija, po kasi"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#2E2E2F] text-xs text-[#8A8A8A] hover:text-[#E9E6D9] transition-colors"
          >
            <Download size={13} />
            Mesečni pregled
          </button>
        </div>
      </div>

      {exportConfirm && (
        <ExportConfirmModal
          kind={exportConfirm}
          periodLabel={PERIOD_LABELS[period]}
          onClose={() => setExportConfirm(null)}
          onConfirm={() => runExport(exportConfirm)}
        />
      )}

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-[#111112] border border-[#2E2E2F] rounded-xl">
          {(["danas", "nedelja", "mesec", "sve", "custom"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                period === p ? "bg-[#1B1B1C] text-[#E9E6D9] border border-[#2E2E2F]" : "text-[#555] hover:text-[#8A8A8A]"
              }`}
            >
              {p === "danas" ? "Danas" : p === "nedelja" ? "7 dana" : p === "mesec" ? "Ovaj mesec" : p === "sve" ? "Sve" : "Prilagođeno"}
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
              <span className="text-xs text-[#444]">{periodItems.length}</span>
            </div>
            {periodItems.length === 0 ? (
              <p className="text-xs text-[#444]">Nema prodaja u ovom periodu.</p>
            ) : (
              <div className="space-y-1.5">
                {periodItems.map((item) =>
                  item.kind === "sale" ? (
                    <div
                      key={`sale-${item.sale.id}`}
                      onClick={() => setSelectedSaleId(item.sale.id)}
                      className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#1B1B1C] border border-[#2E2E2F] cursor-pointer hover:border-[#BF8E41]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#555]">#{item.sale.sale_number}</span>
                        <span className="text-xs text-[#8A8A8A]">{formatDate(item.sale.sold_at)}</span>
                        <span className="text-xs text-[#E9E6D9]">
                          {item.sale.sale_items.map((i) => i.product_name_snapshot).join(", ")}
                        </span>
                        {item.sale.customers && <span className="text-xs text-[#555]">· {item.sale.customers.full_name}</span>}
                        {item.sale.agents && <span className="text-[10px] text-[#444]">· agent {item.sale.agents.full_name}</span>}
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
                            item.sale.register_type === "crna"
                              ? "text-[#8A8A8A] bg-[#8A8A8A]/10 border-[#8A8A8A]/30"
                              : "text-[#E9E6D9] bg-[#E9E6D9]/10 border-[#E9E6D9]/25"
                          }`}
                        >
                          {item.sale.register_type === "crna" ? "CRNA" : "BELA"}
                        </span>
                        <span className="text-[10px] text-[#444]">{PAYMENT_METHOD_LABELS[item.sale.payment_method] ?? item.sale.payment_method}</span>
                      </div>
                      <span className="text-sm text-[#BF8E41] font-medium tabular-nums">{formatRsd(item.sale.total_rsd)}</span>
                    </div>
                  ) : (
                    <div
                      key={`np-${item.entry.id}`}
                      className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-green-500/5 border border-green-500/20"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#8A8A8A]">{formatDate(item.entry.occurred_at)}</span>
                        {item.entry.reason && <span className="text-xs text-[#E9E6D9]">{item.entry.reason}</span>}
                        {item.entry.agents && <span className="text-[10px] text-[#444]">· agent {item.entry.agents.full_name}</span>}
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border text-green-400 bg-green-500/10 border-green-500/30">
                          NETO DOBIT
                        </span>
                      </div>
                      <span className="text-sm text-green-400 font-medium tabular-nums">+{formatRsd(item.entry.amount_rsd)}</span>
                    </div>
                  )
                )}
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
                  <div
                    key={exp.id}
                    onClick={() => setSelectedExpense(exp)}
                    className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#1B1B1C] border border-[#2E2E2F] cursor-pointer hover:border-[#BF8E41]/40 transition-colors"
                  >
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

      {selectedSaleId && (
        <SaleDetailModal saleId={selectedSaleId} onClose={() => setSelectedSaleId(null)} onSaved={load} />
      )}

      {selectedExpense && (
        <ExpenseEditModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onSaved={() => {
            setSelectedExpense(null);
            load();
          }}
        />
      )}
    </div>
  );
}
