"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Clock,
  ShoppingBag,
  PackagePlus,
  Receipt,
  SlidersHorizontal,
  Flag,
  ArrowLeftRight,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type RegisterCode = "bela_kasa" | "crna_kasa" | "beli_lager" | "crni_lager";
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
  created_at: string;
  cash_registers: { code: RegisterCode; display_name: string } | null;
  agents: { full_name: string } | null;
};

type AgentLite = { id: string; full_name: string };

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

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" });
}

function toIsoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function formatDateHeader(isoDate: string) {
  const d = new Date(isoDate + "T12:00:00");
  const today = toIsoDate(new Date());
  const yesterday = toIsoDate(new Date(Date.now() - 86400000));
  const dayLabel = d.toLocaleDateString("sr-RS", { day: "2-digit", month: "long", year: "numeric" });
  const weekday = d.toLocaleDateString("sr-RS", { weekday: "long" });
  if (isoDate === today) return `Danas · ${dayLabel}`;
  if (isoDate === yesterday) return `Juče · ${dayLabel}`;
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} · ${dayLabel}`;
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
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: toIsoDate(first), to: toIsoDate(last) };
}

const REGISTER_META: Record<RegisterCode, { label: string; dark: boolean }> = {
  bela_kasa:  { label: "Bela kasa",  dark: false },
  crna_kasa:  { label: "Crna kasa",  dark: true },
  beli_lager: { label: "Beli lager", dark: false },
  crni_lager: { label: "Crni lager", dark: true },
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

const ENTRY_TYPE_DOT: Record<EntryType, string> = {
  initial: "bg-[#8A8A8A] border-[#8A8A8A]/40",
  sale: "bg-green-400 border-green-400/40",
  purchase: "bg-[#BF8E41] border-[#BF8E41]/40",
  expense: "bg-red-400 border-red-400/40",
  manual_adjustment: "bg-yellow-400 border-yellow-400/40",
  transfer: "bg-blue-400 border-blue-400/40",
};

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AdminAkcijePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [agents, setAgents] = useState<AgentLite[]>([]);
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState<Period>("mesec");
  const [customFrom, setCustomFrom] = useState(toIsoDate(new Date()));
  const [customTo, setCustomTo] = useState(toIsoDate(new Date()));
  const [registerFilter, setRegisterFilter] = useState<RegisterCode | "sve">("sve");
  const [typeFilter, setTypeFilter] = useState<EntryType | "sve">("sve");
  const [agentFilter, setAgentFilter] = useState<string>("sve");

  const range = period === "custom" ? { from: customFrom, to: customTo } : rangeForPeriod(period);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ from: range.from, to: range.to });
    if (registerFilter !== "sve") params.set("register_code", registerFilter);
    if (typeFilter !== "sve") params.set("entry_type", typeFilter);
    if (agentFilter !== "sve") params.set("agent_id", agentFilter);

    const [transactionsRes, agentsRes] = await Promise.all([
      fetch(`/api/admin/kase/transactions?${params.toString()}`),
      fetch("/api/admin/agents"),
    ]);
    if (transactionsRes.ok) setTransactions(await transactionsRes.json());
    if (agentsRes.ok) setAgents(await agentsRes.json());
    setLoading(false);
  }, [range.from, range.to, registerFilter, typeFilter, agentFilter]);

  useEffect(() => {
    load();
  }, [load]);

  // Grupisanje po datumu (occurred_at), zadrzava opadajuci redosled iz API-ja
  const groups: { date: string; items: Transaction[] }[] = [];
  for (const t of transactions) {
    const last = groups[groups.length - 1];
    if (last && last.date === t.occurred_at) last.items.push(t);
    else groups.push({ date: t.occurred_at, items: [t] });
  }

  return (
    <div className="p-6 lg:p-10 w-full max-w-[1400px]">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#E9E6D9]">Akcije</h1>
          <p className="text-sm text-[#555] mt-1">Hronološki pregled svake promene u kasama - do detalja.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
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

        {agents.length > 0 && (
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="bg-[#111112] border border-[#2E2E2F] rounded-xl px-3 py-2 text-xs text-[#8A8A8A] focus:outline-none focus:border-[#BF8E41]/60"
          >
            <option value="sve">Svi agenti</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>{a.full_name}</option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-[#555] text-sm">Učitavam akcije...</div>
      ) : groups.length === 0 ? (
        <p className="text-sm text-[#444]">Nema akcija za izabrane filtere.</p>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.date}>
              <div className="flex items-center gap-3 mb-4 sticky top-0 bg-[#111112] py-2 z-10">
                <h2 className="text-sm font-semibold text-[#E9E6D9]">{formatDateHeader(group.date)}</h2>
                <div className="h-px flex-1 bg-[#2E2E2F]" />
                <span className="text-[10px] text-[#444]">{group.items.length} akcija</span>
              </div>

              <div className="relative pl-6">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#2E2E2F]" />
                <div className="space-y-4">
                  {group.items.map((t) => {
                    const Icon = ENTRY_TYPE_ICONS[t.entry_type];
                    const positive = t.amount_rsd >= 0;
                    const meta = t.cash_registers ? REGISTER_META[t.cash_registers.code] : null;
                    return (
                      <div key={t.id} className="relative flex items-start gap-4">
                        <div className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 ${ENTRY_TYPE_DOT[t.entry_type]}`} />
                        <div className="flex-1 bg-[#1B1B1C] border border-[#2E2E2F] rounded-xl px-5 py-4">
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <Icon size={14} className="text-[#555]" />
                              <span className="text-xs font-semibold text-[#8A8A8A]">{ENTRY_TYPE_LABELS[t.entry_type]}</span>
                              {meta && (
                                <span
                                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
                                    meta.dark
                                      ? "text-[#8A8A8A] bg-[#8A8A8A]/10 border-[#8A8A8A]/30"
                                      : "text-[#E9E6D9] bg-[#E9E6D9]/10 border-[#E9E6D9]/25"
                                  }`}
                                >
                                  {meta.label}
                                </span>
                              )}
                              <span className="text-[10px] text-[#444] flex items-center gap-1">
                                <Clock size={10} />
                                {formatTime(t.created_at)}
                              </span>
                              {t.agents && (
                                <span className="text-[10px] text-[#555]">agent: {t.agents.full_name}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-base font-bold tabular-nums ${positive ? "text-green-400" : "text-red-400"}`}>
                                {positive ? "+" : ""}
                                {formatRsd(t.amount_rsd)}
                              </span>
                            </div>
                          </div>
                          {t.reason && <p className="text-sm text-[#E9E6D9] mb-1.5">{t.reason}</p>}
                          <p className="text-[10px] text-[#444] tabular-nums">
                            Stanje posle akcije: <span className="text-[#8A8A8A]">{formatRsd(t.balance_after_rsd)}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
