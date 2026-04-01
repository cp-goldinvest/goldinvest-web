"use client";

import { useState, useMemo, useEffect } from "react";
import historicalData from "@/data/gold-historical.json";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { SectionContainer } from "@/components/ui/SectionContainer";

type Period = "1W" | "1M" | "1Y" | "5Y" | "MAX";
type Currency = "EUR" | "USD" | "RSD";
type Unit = "g" | "oz" | "kg";

const PERIODS: { label: string; value: Period; days: number }[] = [
  { label: "1 Nedelja", value: "1W",  days: 7 },
  { label: "1 Mesec",   value: "1M",  days: 30 },
  { label: "1 Godina",  value: "1Y",  days: 365 },
  { label: "5 Godina",  value: "5Y",  days: 365 * 5 },
  { label: "Maksimalno", value: "MAX", days: 365 * 20 },
];

const CURRENCIES: { label: string; value: Currency }[] = [
  { label: "EUR", value: "EUR" },
  { label: "USD", value: "USD" },
  { label: "RSD", value: "RSD" },
];

const UNITS: { label: string; value: Unit }[] = [
  { label: "1 Gram",      value: "g" },
  { label: "1 Troj unca", value: "oz" },
  { label: "1 Kilogram",  value: "kg" },
];

const EUR_RSD_FALLBACK = 117.5;
const EUR_USD = 1.09;
const GRAMS_PER_OZ = 31.1034768;

type DataPoint = { date: string; xau_eur: number };

function formatLabel(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-");
  if (days <= 30)  return `${d}.${m}`;
  if (days <= 365) return `${d}.${m}.${y.slice(2)}`;
  return `${m}.${y.slice(2)}`;
}

function buildData(
  days: number,
  currency: Currency,
  unit: Unit,
  eurRsd: number,
  liveXauEur?: number
) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const filtered = (historicalData as DataPoint[]).filter(d => d.date >= cutoffStr);

  const maxPoints = 120;
  const step = filtered.length > maxPoints ? Math.ceil(filtered.length / maxPoints) : 1;

  const points = filtered
    .filter((_, i) => i % step === 0 || i === filtered.length - 1)
    .map(d => {
      let v: number;
      if (unit === "g")  v = d.xau_eur / GRAMS_PER_OZ;
      else if (unit === "oz") v = d.xau_eur;
      else v = (d.xau_eur / GRAMS_PER_OZ) * 1000;

      if (currency === "USD") v *= EUR_USD;
      else if (currency === "RSD") v *= eurRsd;

      const value = currency === "RSD" || unit === "kg" ? Math.round(v) : parseFloat(v.toFixed(2));
      return { date: formatLabel(d.date, days), value };
    });

  // Zameni poslednju tačku sa live cenom
  if (liveXauEur && points.length > 0) {
    let v: number;
    if (unit === "g")  v = liveXauEur / GRAMS_PER_OZ;
    else if (unit === "oz") v = liveXauEur;
    else v = (liveXauEur / GRAMS_PER_OZ) * 1000;

    if (currency === "USD") v *= EUR_USD;
    else if (currency === "RSD") v *= eurRsd;

    const value = currency === "RSD" || unit === "kg" ? Math.round(v) : parseFloat(v.toFixed(2));
    points[points.length - 1] = { ...points[points.length - 1], value };
  }

  return points;
}

function formatPrice(value: number, currency: Currency, unit: Unit): string {
  if (currency === "RSD") return `${Math.round(value).toLocaleString("sr-RS")} RSD`;
  const decimals = unit === "kg" ? 0 : 2;
  if (currency === "USD") {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  }
  return `€${value.toLocaleString("de-DE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

function formatDiff(diff: number, currency: Currency, unit: Unit): string {
  const sign = diff >= 0 ? "+" : "−";
  const abs = Math.abs(diff);
  if (currency === "RSD") return `${sign}${Math.round(abs).toLocaleString("sr-RS")} RSD`;
  const decimals = unit === "kg" ? 0 : 2;
  if (currency === "USD")
    return `${sign}$${abs.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  return `${sign}€${abs.toLocaleString("de-DE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

function unitLabel(unit: Unit): string {
  if (unit === "oz") return "cena za Troj uncu";
  if (unit === "kg") return "cena za kilogram";
  return "cena za gram";
}

interface TooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  currency: Currency;
  unit: Unit;
}

function CustomTooltip({ active, payload, label, currency, unit }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1B1B1C] text-white text-xs px-3 py-2 rounded-lg shadow-lg">
      <p className="text-[#9D9072] mb-0.5">{label}</p>
      <p className="font-semibold">{formatPrice(payload[0].value, currency, unit)}</p>
    </div>
  );
}

export function GoldPriceChartFull() {
  const [period, setPeriod] = useState<Period>("1Y");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [unit, setUnit] = useState<Unit>("g");
  const [live, setLive] = useState<{ xauEur: number; eurRsd: number } | null>(null);

  useEffect(() => {
    fetch("/api/prices")
      .then(r => r.json())
      .then(d => {
        if (d.xau_eur && d.eur_rsd) {
          setLive({ xauEur: d.xau_eur, eurRsd: d.eur_rsd });
        }
      })
      .catch(() => {});
  }, []);

  const data = useMemo(
    () => buildData(
      PERIODS.find(p => p.value === period)!.days,
      currency,
      unit,
      live?.eurRsd ?? EUR_RSD_FALLBACK,
      live?.xauEur
    ),
    [period, currency, unit, live]
  );

  const current = data[data.length - 1]?.value ?? 0;
  const first   = data[0]?.value ?? 0;
  const diff    = current - first;
  const diffPct = first > 0 ? (diff / first) * 100 : 0;
  const isUp    = diff >= 0;

  const yFormatter = (v: number) => {
    if (currency === "RSD") return Math.round(v).toLocaleString("sr-RS");
    if (unit === "kg") return Math.round(v).toLocaleString("de-DE");
    return Number(v).toFixed(0);
  };

  return (
    <section className="bg-[#F9F9F9] pt-0 pb-16 border-b border-[#F0EDE6]">
      <SectionContainer>
        {/* Currency + Unit filter rows */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between items-start sm:items-center">
          <div className="flex items-center gap-1 bg-white border border-[#F0EDE6] rounded-xl p-1">
            {CURRENCIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCurrency(c.value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currency === c.value
                    ? "bg-[#1B1B1C] text-white shadow-sm"
                    : "text-[#9D9072] hover:text-[#1B1B1C]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white border border-[#F0EDE6] rounded-xl p-1">
            {UNITS.map((u) => (
              <button
                key={u.value}
                onClick={() => setUnit(u.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  unit === u.value
                    ? "bg-[#1B1B1C] text-white shadow-sm"
                    : "text-[#9D9072] hover:text-[#1B1B1C]"
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main chart card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
          {/* Price display */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span
                className="text-[#1B1B1C] font-semibold"
                style={{ fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-1px" }}
              >
                {formatPrice(current, currency, unit)}
              </span>
              <span className={`flex items-center gap-1 text-sm font-medium ${isUp ? "text-emerald-600" : "text-red-500"}`}>
                <span>{isUp ? "▲" : "▼"}</span>
                <span>{formatDiff(diff, currency, unit)}</span>
                <span>({isUp ? "+" : ""}{diffPct.toFixed(2)}%)</span>
              </span>
            </div>
            <p className="text-[#9D9072] text-xs mt-1">{unitLabel(unit)}</p>
          </div>

          {/* Chart */}
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="goldGradientFull" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#BF8E41" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#BF8E41" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE6" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#9D9072", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "#9D9072", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={85}
                  tickFormatter={yFormatter}
                  domain={["auto", "auto"]}
                />
                <Tooltip content={<CustomTooltip currency={currency} unit={unit} />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#BF8E41"
                  strokeWidth={2}
                  fill="url(#goldGradientFull)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#BF8E41", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Period tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-1 bg-[#F4F4F4] rounded-xl p-1 mt-6 flex-wrap">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  period === p.value
                    ? "bg-white text-[#1B1B1C] shadow-sm"
                    : "text-[#9D9072] hover:text-[#1B1B1C]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
