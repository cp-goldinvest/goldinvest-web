"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Wallet,
  Vault,
  ArrowLeftRight,
  Plus,
  X,
  Clock,
  ShoppingBag,
  PackagePlus,
  Receipt,
  SlidersHorizontal,
  Flag,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type RegisterCode = "bela_kasa" | "crna_kasa" | "beli_lager" | "crni_lager";

type CashRegister = {
  id: string;
  code: RegisterCode;
  display_name: string;
  current_balance_rsd: number;
  updated_at: string;
  computed_balance_rsd: number | null;
};

type EntryType = "initial" | "sale" | "purchase" | "expense" | "manual_adjustment" | "transfer";

type Transaction = {
  id: string;
  register_id: string;
  occurred_at: string;
  entry_type: EntryType;
  amount_rsd: number;
  balance_after_rsd: number;
  reason: string | null;
  agent_id: string | null;
  is_net_profit: boolean;
  created_at: string;
  cash_registers: { code: RegisterCode; display_name: string } | null;
  agents: { full_name: string } | null;
};

type AgentLite = { id: string; full_name: string };

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRsd(n: number) {
  return new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: "RSD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

function formatDateTime(d: string) {
  return new Date(d).toLocaleString("sr-RS", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatDate(d: string) {
  return d.slice(0, 10).split("-").reverse().join(".");
}

function toIsoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

const REGISTER_META: Record<RegisterCode, { label: string; group: "kasa" | "lager"; accent: string }> = {
  bela_kasa:  { label: "Bela kasa",  group: "kasa",  accent: "text-[#E9E6D9]" },
  crna_kasa:  { label: "Crna kasa",  group: "kasa",  accent: "text-[#8A8A8A]" },
  beli_lager: { label: "Beli lager", group: "lager", accent: "text-[#E9E6D9]" },
  crni_lager: { label: "Crni lager", group: "lager", accent: "text-[#8A8A8A]" },
};

const ENTRY_TYPE_LABELS: Record<EntryType, string> = {
  initial: "Početno stanje",
  sale: "Prodaja",
  purchase: "Nabavka",
  expense: "Trošak",
  manual_adjustment: "Korekcija",
  transfer: "Transfer",
};

const ENTRY_TYPE_ICONS: Record<EntryType, React.ElementType> = {
  initial: Flag,
  sale: ShoppingBag,
  purchase: PackagePlus,
  expense: Receipt,
  manual_adjustment: SlidersHorizontal,
  transfer: ArrowLeftRight,
};

const EXPENSE_CATEGORIES = ["Kirija", "Plate", "Komunalije", "Marketing", "Ostalo"];

// ── Balance Modal (pocetno stanje / korekcija) ───────────────────────────────

function BalanceModal({
  register,
  agents,
  onClose,
  onSaved,
  prefillBalance,
  prefillReason,
}: {
  register: CashRegister;
  agents: AgentLite[];
  onClose: () => void;
  onSaved: () => void;
  prefillBalance?: number;
  prefillReason?: string;
}) {
  const meta = REGISTER_META[register.code];
  const [newBalance, setNewBalance] = useState(
    String(Math.round(prefillBalance ?? register.current_balance_rsd))
  );
  const [reason, setReason] = useState(prefillReason ?? "");
  const [agentId, setAgentId] = useState("");
  const [date, setDate] = useState(toIsoDate(new Date()));
  const [isNetProfit, setIsNetProfit] = useState(false);
  const [netProfitAmount, setNetProfitAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const entryType = register.current_balance_rsd === 0 ? "initial" : "manual_adjustment";
  const canFlagNetProfit = register.code === "crna_kasa" && entryType === "manual_adjustment";
  const netProfitMode = canFlagNetProfit && isNetProfit;

  async function handleSave() {
    let balanceNum: number;
    if (netProfitMode) {
      const addedNum = parseFloat(netProfitAmount.replace(/\./g, "").replace(",", "."));
      if (Number.isNaN(addedNum) || addedNum <= 0) {
        setError("Unesi iznos neto dobiti koji se dodaje (mora biti pozitivan)");
        return;
      }
      balanceNum = register.current_balance_rsd + addedNum;
    } else {
      balanceNum = parseFloat(newBalance.replace(/\./g, "").replace(",", "."));
      if (Number.isNaN(balanceNum)) {
        setError("Unesi ispravno stanje");
        return;
      }
    }
    if (!reason.trim()) {
      setError("Razlog je obavezan");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/kase/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          register_code: register.code,
          entry_type: entryType,
          new_balance_rsd: balanceNum,
          reason: reason.trim(),
          agent_id: agentId || null,
          occurred_at: date,
          is_net_profit: netProfitMode,
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
          <div>
            <p className={`text-xs mb-0.5 ${meta.accent}`}>{meta.label}</p>
            <h3 className="text-[#E9E6D9] font-semibold">Unesi / koriguj stanje</h3>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-[#E9E6D9] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#111112] border border-[#2E2E2F] text-xs">
            <span className="text-[#555]">Trenutno stanje</span>
            <span className="text-[#8A8A8A] tabular-nums">{formatRsd(register.current_balance_rsd)}</span>
          </div>

          {canFlagNetProfit && (
            <label
              className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                isNetProfit ? "bg-green-500/10 border-green-500/30" : "border-[#2E2E2F] hover:border-[#3A3A3B]"
              }`}
            >
              <input
                type="checkbox"
                checked={isNetProfit}
                onChange={(e) => {
                  setIsNetProfit(e.target.checked);
                  setError("");
                }}
                className="mt-0.5 accent-green-500"
              />
              <span>
                <span className={`block text-xs font-medium ${isNetProfit ? "text-green-400" : "text-[#8A8A8A]"}`}>
                  Ovo je neto dobit (prihodovanje)
                </span>
                <span className="block text-[10px] text-[#555] mt-0.5">
                  Označi kad ubacuješ čistu dobit u crnu kasu - uvek povećava stanje, biće posebno obeleženo u istoriji akcija.
                </span>
              </span>
            </label>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#555] block mb-1.5">
                {netProfitMode ? "Iznos neto dobiti (RSD)" : "Novo stanje (RSD)"}
              </label>
              <input
                type="number"
                value={netProfitMode ? netProfitAmount : newBalance}
                onChange={(e) => {
                  if (netProfitMode) {
                    setNetProfitAmount(e.target.value);
                  } else {
                    setNewBalance(e.target.value);
                  }
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

          {netProfitMode && netProfitAmount.trim() !== "" && !Number.isNaN(parseFloat(netProfitAmount.replace(/\./g, "").replace(",", "."))) && (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-green-500/5 border border-green-500/20 text-xs">
              <span className="text-[#555]">Novo stanje posle uplate</span>
              <span className="text-green-400 tabular-nums">
                {formatRsd(register.current_balance_rsd + parseFloat(netProfitAmount.replace(/\./g, "").replace(",", ".")))}
              </span>
            </div>
          )}

          <div>
            <label className="text-xs text-[#555] block mb-1.5">
              Razlog (obavezno){netProfitMode ? " - napomena zašto je ovo neto dobit" : ""}
            </label>
            <input
              type="text"
              placeholder={
                netProfitMode
                  ? "npr. isplata dobiti za mart, podela profita..."
                  : "npr. usklađivanje sa stvarnim stanjem, zaduženje od CP menjačnice..."
              }
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
            />
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Agent (opcionalno)</label>
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

// ── Transfer Modal ────────────────────────────────────────────────────────────

function TransferModal({
  registers,
  agents,
  onClose,
  onSaved,
}: {
  registers: CashRegister[];
  agents: AgentLite[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [fromCode, setFromCode] = useState<RegisterCode>("crna_kasa");
  const [toCode, setToCode] = useState<RegisterCode>("bela_kasa");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [agentId, setAgentId] = useState("");
  const [date, setDate] = useState(toIsoDate(new Date()));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    const amountNum = parseFloat(amount.replace(/\./g, "").replace(",", "."));
    if (!amountNum || amountNum <= 0) {
      setError("Unesi iznos transfera");
      return;
    }
    if (fromCode === toCode) {
      setError("Izvorna i odredišna kasa moraju biti različite");
      return;
    }
    if (!reason.trim()) {
      setError("Razlog je obavezan");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/kase/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_register_code: fromCode,
          to_register_code: toCode,
          amount_rsd: amountNum,
          reason: reason.trim(),
          agent_id: agentId || null,
          occurred_at: date,
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
          <h3 className="text-[#E9E6D9] font-semibold">Transfer između kasa</h3>
          <button onClick={onClose} className="text-[#555] hover:text-[#E9E6D9] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <label className="text-xs text-[#555] block mb-1.5">Iz kase</label>
              <select
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value as RegisterCode)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              >
                {registers.map((r) => (
                  <option key={r.code} value={r.code}>{REGISTER_META[r.code].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#555] block mb-1.5">U kasu</label>
              <select
                value={toCode}
                onChange={(e) => setToCode(e.target.value as RegisterCode)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              >
                {registers.map((r) => (
                  <option key={r.code} value={r.code}>{REGISTER_META[r.code].label}</option>
                ))}
              </select>
            </div>
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
            <label className="text-xs text-[#555] block mb-1.5">Razlog (obavezno)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
            />
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Agent (opcionalno)</label>
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
              {saving ? "Čuvam..." : "Potvrdi transfer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Expense Modal (premesteno sa Finansija) ──────────────────────────────────

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

function RegisterCard({
  register,
  onAdjust,
  onSync,
}: {
  register: CashRegister;
  onAdjust: () => void;
  onSync?: () => void;
}) {
  const meta = REGISTER_META[register.code];
  const isLager = register.computed_balance_rsd !== null;
  const diff = isLager ? register.current_balance_rsd - (register.computed_balance_rsd ?? 0) : 0;
  const mismatched = isLager && Math.round(diff) !== 0;

  return (
    <div
      className={`bg-[#1B1B1C] border rounded-xl p-4 flex flex-col justify-between ${
        mismatched ? "border-yellow-500/30" : "border-[#2E2E2F]"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          {meta.group === "kasa" ? <Wallet size={13} className="text-[#555]" /> : <Vault size={13} className="text-[#555]" />}
          <p className={`text-xs font-semibold uppercase tracking-wider ${meta.accent}`}>{meta.label}</p>
        </div>
      </div>
      <p className="text-2xl font-bold text-[#E9E6D9] tabular-nums mb-1">{formatRsd(register.current_balance_rsd)}</p>
      <p className="text-[10px] text-[#444] flex items-center gap-1 mb-3">
        <Clock size={10} />
        Poslednja promena: {formatDateTime(register.updated_at)}
      </p>

      {isLager && (
        <div
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg mb-3 text-[10px] ${
            mismatched ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/5 text-green-400/80"
          }`}
        >
          <span className="flex items-center gap-1">
            {mismatched ? <AlertTriangle size={11} /> : <CheckCircle2 size={11} />}
            Stvarno na zalihama
          </span>
          <span className="tabular-nums font-medium">{formatRsd(register.computed_balance_rsd ?? 0)}</span>
        </div>
      )}

      {isLager ? (
        <div className="space-y-1.5">
          {mismatched && (
            <button
              onClick={onSync}
              className="w-full py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-400 hover:bg-yellow-500/20 transition-colors"
            >
              Uskladi sa zalihama ({diff > 0 ? "-" : "+"}{formatRsd(Math.abs(diff))})
            </button>
          )}
          <button
            onClick={onAdjust}
            className="w-full py-1.5 rounded-lg text-[10px] text-[#555] hover:text-[#8A8A8A] transition-colors"
          >
            Ručna korekcija
          </button>
        </div>
      ) : (
        <button
          onClick={onAdjust}
          className="w-full py-2 rounded-lg border border-[#2E2E2F] text-xs text-[#8A8A8A] hover:text-[#E9E6D9] hover:border-[#BF8E41]/40 transition-colors"
        >
          Unesi / koriguj stanje
        </button>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AdminKasePage() {
  const [registers, setRegisters] = useState<CashRegister[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [agents, setAgents] = useState<AgentLite[]>([]);
  const [loading, setLoading] = useState(true);

  const [registerFilter, setRegisterFilter] = useState<RegisterCode | "sve">("sve");
  const [typeFilter, setTypeFilter] = useState<EntryType | "sve">("sve");

  const [adjustRegister, setAdjustRegister] = useState<CashRegister | null>(null);
  const [syncRegister, setSyncRegister] = useState<CashRegister | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (registerFilter !== "sve") params.set("register_code", registerFilter);
    if (typeFilter !== "sve") params.set("entry_type", typeFilter);

    const [registersRes, transactionsRes, agentsRes] = await Promise.all([
      fetch("/api/admin/kase"),
      fetch(`/api/admin/kase/transactions?${params.toString()}`),
      fetch("/api/admin/agents"),
    ]);
    if (registersRes.ok) setRegisters(await registersRes.json());
    if (transactionsRes.ok) setTransactions(await transactionsRes.json());
    if (agentsRes.ok) setAgents(await agentsRes.json());
    setLoading(false);
  }, [registerFilter, typeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const kasaRegisters = registers.filter((r) => REGISTER_META[r.code].group === "kasa");
  const lagerRegisters = registers.filter((r) => REGISTER_META[r.code].group === "lager");

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#E9E6D9]">Kase</h1>
          <p className="text-sm text-[#555] mt-1">Tekuće stanje i pun log svake promene - transparentno, do detalja.</p>
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
            onClick={() => setShowTransferModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#BF8E41]/10 border border-[#BF8E41]/20 text-[#BF8E41] text-xs font-medium hover:bg-[#BF8E41]/20 transition-colors"
          >
            <ArrowLeftRight size={13} />
            Transfer između kasa
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-[#555] text-sm">Učitavam kase...</div>
      ) : (
        <>
          {/* Kasa cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {kasaRegisters.map((r) => (
              <RegisterCard key={r.id} register={r} onAdjust={() => setAdjustRegister(r)} />
            ))}
          </div>

          {/* Lager value cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
            {lagerRegisters.map((r) => (
              <RegisterCard
                key={r.id}
                register={r}
                onAdjust={() => setAdjustRegister(r)}
                onSync={() => setSyncRegister(r)}
              />
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-1 p-1 bg-[#111112] border border-[#2E2E2F] rounded-xl flex-wrap">
              {(["sve", "bela_kasa", "crna_kasa", "beli_lager", "crni_lager"] as const).map((code) => (
                <button
                  key={code}
                  onClick={() => setRegisterFilter(code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    registerFilter === code ? "bg-[#1B1B1C] text-[#E9E6D9] border border-[#2E2E2F]" : "text-[#555] hover:text-[#8A8A8A]"
                  }`}
                >
                  {code === "sve" ? "Sve kase" : REGISTER_META[code].label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 p-1 bg-[#111112] border border-[#2E2E2F] rounded-xl flex-wrap">
              {(["sve", "initial", "sale", "purchase", "expense", "manual_adjustment", "transfer"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    typeFilter === t ? "bg-[#1B1B1C] text-[#E9E6D9] border border-[#2E2E2F]" : "text-[#555] hover:text-[#8A8A8A]"
                  }`}
                >
                  {t === "sve" ? "Sve akcije" : ENTRY_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Ledger */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={13} className="text-[#555]" />
              <h2 className="text-xs font-semibold text-[#555] uppercase tracking-widest">Istorija akcija</h2>
              <div className="h-px flex-1 bg-[#2E2E2F]" />
              <span className="text-xs text-[#444]">{transactions.length}</span>
            </div>

            {transactions.length === 0 ? (
              <p className="text-xs text-[#444]">Nema akcija za izabrane filtere.</p>
            ) : (
              <div className="space-y-1.5">
                {transactions.map((t) => {
                  const Icon = ENTRY_TYPE_ICONS[t.entry_type];
                  const positive = t.amount_rsd >= 0;
                  return (
                    <div key={t.id} className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#1B1B1C] border border-[#2E2E2F]">
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon size={13} className="text-[#555] shrink-0" />
                        <span className="text-xs text-[#8A8A8A] shrink-0">{formatDate(t.occurred_at)}</span>
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${
                            t.cash_registers?.code.includes("crna") || t.cash_registers?.code.includes("crni")
                              ? "text-[#8A8A8A] bg-[#8A8A8A]/10 border-[#8A8A8A]/30"
                              : "text-[#E9E6D9] bg-[#E9E6D9]/10 border-[#E9E6D9]/25"
                          }`}
                        >
                          {t.cash_registers ? REGISTER_META[t.cash_registers.code].label : "-"}
                        </span>
                        <span className="text-[10px] text-[#444] shrink-0">{ENTRY_TYPE_LABELS[t.entry_type]}</span>
                        {t.is_net_profit && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 text-green-400 bg-green-500/10 border-green-500/30">
                            Neto dobit
                          </span>
                        )}
                        {t.reason && <span className="text-xs text-[#E9E6D9] truncate">{t.reason}</span>}
                        {t.agents && <span className="text-[10px] text-[#555] shrink-0">· {t.agents.full_name}</span>}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-sm font-medium tabular-nums ${positive ? "text-green-400" : "text-red-400"}`}>
                          {positive ? "+" : ""}
                          {formatRsd(t.amount_rsd)}
                        </span>
                        <span className="text-[10px] text-[#444] tabular-nums w-24 text-right">
                          stanje: {formatRsd(t.balance_after_rsd)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {adjustRegister && (
        <BalanceModal
          register={adjustRegister}
          agents={agents}
          onClose={() => setAdjustRegister(null)}
          onSaved={() => {
            setAdjustRegister(null);
            load();
          }}
        />
      )}

      {syncRegister && (
        <BalanceModal
          register={syncRegister}
          agents={agents}
          prefillBalance={syncRegister.computed_balance_rsd ?? 0}
          prefillReason="Usklađivanje sa stvarnim stanjem zaliha"
          onClose={() => setSyncRegister(null)}
          onSaved={() => {
            setSyncRegister(null);
            load();
          }}
        />
      )}

      {showTransferModal && (
        <TransferModal
          registers={registers}
          agents={agents}
          onClose={() => setShowTransferModal(false)}
          onSaved={() => {
            setShowTransferModal(false);
            load();
          }}
        />
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
