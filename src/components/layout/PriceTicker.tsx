"use client";

import { useEffect, useState } from "react";

type PriceData = {
  xau_eur: number;
  eur_rsd: number;
  rsd_per_gram: number;
  fetched_at: string;
  rates_updated_at: string;
};

function getTimeAgo(isoString: string): string {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return m === 1 ? "1 min" : `${m} min`;
  }
  const h = Math.floor(diff / 3600);
  return h === 1 ? "1h" : `${h}h`;
}

export function PriceTicker() {
  const [data, setData] = useState<PriceData | null>(null);
  const [timeAgo, setTimeAgo] = useState("...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/prices");
        if (!res.ok) return;
        const json: PriceData = await res.json();
        setData(json);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }

    fetchPrices();
    // Osvežavamo svake 60 sekundi — cena se povlači live
    const interval = setInterval(fetchPrices, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Ažuriramo "pre X min" prikaz svakih 30s
  useEffect(() => {
    if (!data) return;
    setTimeAgo(getTimeAgo(data.fetched_at));
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo(data.fetched_at));
    }, 30_000);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className="bg-[#111112]/60 backdrop-blur-md border-b border-[#2E2E2F]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-8 gap-3">

          {/* Live RSD/g — samo na većim ekranima */}
          {data && (
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#555] tabular-nums">
              <span className="text-[#6A6A6A]">XAU</span>
              <span className="text-[#8A8A8A] font-medium">€{data.xau_eur.toLocaleString("de-DE", { maximumFractionDigits: 0 })}</span>
              <span className="text-[#3A3A3B]">·</span>
              <span className="text-[#6A6A6A]">RSD/g</span>
              <span className="text-[#9A9A8A] font-medium">
                {new Intl.NumberFormat("sr-RS").format(data.rsd_per_gram)}
              </span>
              <span className="text-[#3A3A3B]">·</span>
            </span>
          )}

          {/* Status */}
          <span className="flex items-center gap-1.5 text-[11px] text-[#6A6A6A] whitespace-nowrap">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
            </span>
            Cene ažurirane pre{" "}
            <span className="text-[#9A9A8A] font-medium">{loading ? "..." : timeAgo}</span>
          </span>

        </div>
      </div>
    </div>
  );
}
