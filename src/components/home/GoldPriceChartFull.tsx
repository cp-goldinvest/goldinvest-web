"use client";

import { useState, useMemo } from "react";
import { seededRandom } from "@/lib/chartUtils";
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

type Period = "1D" | "1W" | "1M" | "1Y" | "5Y" | "MAX";
type Currency = "EUR" | "USD" | "RSD";
type Unit = "g" | "oz" | "kg";

const PERIODS: { label: string; value: Period; days: number; intraday?: boolean }[] = [
  { label: "1 Dan",     value: "1D",  days: 1,        intraday: true },
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
  { label: "1 Gram",        value: "g" },
  { label: "1 Troj unca",   value: "oz" },
  { label: "1 Kilogram",    value: "kg" },
];

const EUR_RSD = 117.5;
const EUR_USD = 1.09;
const GRAMS_PER_OZ = 31.1034768;


const FIXED_NOW = new Date("2026-03-11T00:00:00Z");

// Generate base data in EUR/gram
function generateBaseData(
  days: number,
  intraday = false
): { date: string; eurPerGram: number }[] {
  if (intraday) {
    const rand = seededRandom(99991);
    const data: { date: string; eurPerGram: number }[] = [];
    let price = 142.3;
    for (let i = 0; i <= 48; i++) {
      const totalMins = i * 30;
      const h = Math.floor(totalMins / 60);
      const m = totalMins % 60;
      const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      price = price + (rand() - 0.5) * 0.3;
      data.push({ date: label, eurPerGram: Math.max(price, 130) });
    }
    return data;
  }

  const rand = seededRandom(days * 7919);
  const data: { date: string; eurPerGram: number }[] = [];
  let price = 142 - days * 0.008;
  for (let i = days; i >= 0; i--) {
    const date = new Date(FIXED_NOW);
    date.setUTCDate(FIXED_NOW.getUTCDate() - i);
    price = price + (rand() - 0.47) * (days > 365 ? 0.18 : 0.1);
    const label =
      days <= 90
        ? `${String(date.getUTCDate()).padStart(2, "0")}.${String(date.getUTCMonth() + 1).padStart(2, "0")}`
        : `${String(date.getUTCMonth() + 1).padStart(2, "0")}.${String(date.getUTCFullYear()).slice(-2)}`;
    data.push({ date: label, eurPerGram: Math.max(price, 20) });
  }
  return data;
}

const BASE_DATA = Object.fromEntries(
  PERIODS.map((p) => [p.value, generateBaseData(p.days, p.intraday)])
) as Record<Period, { date: string; eurPerGram: number }[]>;

function convertData(
  base: { date: string; eurPerGram: number }[],
  currency: Currency,
  unit: Unit
) {
  return base.map(({ date, eurPerGram }) => {
    let v = eurPerGram;
    if (unit === "oz") v *= GRAMS_PER_OZ;
    else if (unit === "kg") v *= 1000;
    if (currency === "USD") v *= EUR_USD;
    else if (currency === "RSD") v *= EUR_RSD;
    return { date, value: v };
  });
}

function formatPrice(value: number, currency: Currency, unit: Unit): string {
  const isLarge = unit === "kg" || (unit === "oz" && currency === "RSD");
  if (currency === "RSD") {
    return `${Math.round(value).toLocaleString("sr-RS")} RSD`;
  }
  const decimals = isLarge ? 0 : 2;
  if (currency === "USD") {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  }
  return `€${value.toLocaleString("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
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

  const rawData = BASE_DATA[period];

  const convertedData = useMemo(
    () => convertData(rawData, currency, unit),
    [rawData, currency, unit]
  );

  const current = convertedData[convertedData.length - 1].value;
  const first = convertedData[0].value;
  const diff = current - first;
  const diffPct = (diff / first) * 100;
  const isUp = diff >= 0;

  const displayData = useMemo(() => {
    const maxPoints = 120;
    if (convertedData.length <= maxPoints) return convertedData;
    const step = Math.ceil(convertedData.length / maxPoints);
    return convertedData.filter((_, i) => i % step === 0 || i === convertedData.length - 1);
  }, [convertedData]);

  const yFormatter = (v: number) => {
    if (currency === "RSD") return Math.round(v).toLocaleString("sr-RS");
    if (unit === "kg") return Math.round(v).toLocaleString("de-DE");
    return v.toFixed(0);
  };

  return (
    <section className="bg-[#F9F9F9] py-16 border-b border-[#F0EDE6]">
      <SectionContainer>
        {/* Currency + Unit filter rows */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between items-start sm:items-center">
          {/* Currency */}
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

          {/* Unit */}
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
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  isUp ? "text-emerald-600" : "text-red-500"
                }`}
              >
                <span>{isUp ? "▲" : "▼"}</span>
                <span>{formatDiff(diff, currency, unit)}</span>
                <span>
                  ({isUp ? "+" : ""}
                  {diffPct.toFixed(2)}%)
                </span>
              </span>
            </div>
            <p className="text-[#9D9072] text-xs mt-1">{unitLabel(unit)}</p>
          </div>

          {/* Chart */}
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={displayData}
                margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
              >
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

          {/* Period tabs — below chart */}
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
