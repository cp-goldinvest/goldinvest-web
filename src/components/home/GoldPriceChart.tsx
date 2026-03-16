"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Period = "1M" | "3M" | "6M" | "1G" | "3G" | "5G" | "10G";

const PERIODS: { label: string; value: Period; days: number }[] = [
  { label: "1M",  value: "1M",  days: 30 },
  { label: "3M",  value: "3M",  days: 90 },
  { label: "6M",  value: "6M",  days: 180 },
  { label: "1G",  value: "1G",  days: 365 },
  { label: "3G",  value: "3G",  days: 365 * 3 },
  { label: "5G",  value: "5G",  days: 365 * 5 },
  { label: "10G", value: "10G", days: 365 * 10 },
];

// Deterministic pseudo-random (seeded) — same output on server and client
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const FIXED_NOW = new Date("2026-03-11T00:00:00Z");
const EUR_RSD = 117.5; // za konverziju mock podataka u RSD
const GRAMS_PER_OUNCE = 31.1034768;

const generateMockData = (days: number) => {
  const rand = seededRandom(days * 7919);
  const data = [];
  let priceEurPerOunce = 4418 - days * 0.3;
  for (let i = days; i >= 0; i--) {
    const date = new Date(FIXED_NOW);
    date.setUTCDate(FIXED_NOW.getUTCDate() - i);
    priceEurPerOunce = priceEurPerOunce + (rand() - 0.47) * (days > 365 ? 6 : 3);
    const label =
      days <= 90
        ? `${String(date.getUTCDate()).padStart(2, "0")}.${String(date.getUTCMonth() + 1).padStart(2, "0")}`
        : `${String(date.getUTCMonth() + 1).padStart(2, "0")}.${String(date.getUTCFullYear()).slice(-2)}`;
    const priceEurPerGram = priceEurPerOunce / GRAMS_PER_OUNCE;
    const priceRsd = Math.round(priceEurPerGram * EUR_RSD);
    data.push({ date: label, value: priceRsd });
  }
  return data;
};

// Pre-generate all datasets
const ALL_DATA = Object.fromEntries(
  PERIODS.map((p) => [p.value, generateMockData(p.days)])
) as Record<Period, { date: string; value: number }[]>;

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1B1B1C] text-white text-xs px-3 py-2 rounded-lg shadow-lg">
      <p className="text-[#9D9072] mb-0.5">{label}</p>
      <p className="font-semibold">
        {payload[0].value.toLocaleString("sr-RS")} RSD
      </p>
    </div>
  );
}

export function GoldPriceChart() {
  const [period, setPeriod] = useState<Period>("1G");

  const data = ALL_DATA[period];
  const current = data[data.length - 1].value;
  const first = data[0].value;
  const diff = current - first;
  const diffPct = (diff / first) * 100;
  const isUp = diff >= 0;

  // Thin out data points for longer periods to keep chart clean
  const displayData = useMemo(() => {
    const maxPoints = 120;
    if (data.length <= maxPoints) return data;
    const step = Math.ceil(data.length / maxPoints);
    return data.filter((_, i) => i % step === 0 || i === data.length - 1);
  }, [data]);

  return (
    <section className="bg-[#F9F9F9] py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">

        {/* Section heading */}
        <div className="flex flex-col sm:items-center sm:text-center gap-4 mb-8">
          <div className="sm:flex sm:flex-col sm:items-center">
            <span className="text-[#BEAD87] text-xs font-semibold tracking-widest uppercase mb-3 block">
              Tržišne cene
            </span>
            <h2
              className="text-[#1B1B1C] leading-tight"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontSize: "clamp(22px, 2.8vw, 36px)",
                fontWeight: 400,
              }}
            >
              Spot cena zlata u realnom vremenu
            </h2>
            <p className="text-[#9D9072] text-[15px] mt-2 max-w-[480px] sm:mx-auto">
              Pratite kretanje cene investicionog zlata i donosite informisane odluke o kupovini.
            </p>
          </div>
          <Link
            href="/cena-zlata"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:opacity-90 whitespace-nowrap self-start sm:self-center"
            style={{ backgroundColor: "#BEAD87", fontSize: "12.1px", boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)" }}
          >
            Saznaj više
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.06)]">

          {/* Top row: price + period tabs */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span
                  className="text-[#1B1B1C] font-semibold"
                  style={{ fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-1px" }}
                >
                  {current.toLocaleString("sr-RS")} RSD
                </span>
                <span className={`flex items-center gap-1 text-sm font-medium ${isUp ? "text-emerald-600" : "text-red-500"}`}>
                  <span>{isUp ? "▲" : "▼"}</span>
                  <span>{isUp ? "+" : ""}{diff.toLocaleString("sr-RS")} RSD</span>
                  <span>({isUp ? "+" : ""}{diffPct.toFixed(2)}%)</span>
                </span>
              </div>
              <p className="text-[#9D9072] text-xs mt-1">
                cena za gram
              </p>
            </div>

            {/* Period tabs */}
            <div className="flex items-center gap-1 bg-[#F4F4F4] rounded-xl p-1 self-start flex-wrap">
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

          {/* Chart */}
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
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
                  width={80}
                  tickFormatter={(v) => `${Number(v).toLocaleString("sr-RS")}`}
                  domain={["auto", "auto"]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#BF8E41"
                  strokeWidth={2}
                  fill="url(#goldGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#BF8E41", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </section>
  );
}
