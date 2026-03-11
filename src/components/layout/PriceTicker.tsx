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

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/prices");
        if (!res.ok) return;
        const json: PriceData = await res.json();
        setData(json);
      } catch {
        // silent
      }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!data) return;
    setTimeAgo(getTimeAgo(data.fetched_at));
    const interval = setInterval(() => setTimeAgo(getTimeAgo(data.fetched_at)), 30_000);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <div
      className="w-full h-9 flex items-center"
      style={{
        background:
          "linear-gradient(178deg, rgba(186,167,127,1) 1%, rgba(231,229,217,1) 60%, rgba(239,231,218,1) 97%)",
      }}
    >
      <div className="max-w-[1143px] mx-auto px-8 w-full flex items-center justify-between">

        {/* Left: live indicator + time */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C950] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C950]" />
          </span>
          <span className="text-[11px] text-[#4A3F2F] font-medium">
            Cene ažurirane pre{" "}
            <span className="font-semibold">{timeAgo}</span>
          </span>
        </div>

        {/* Right: gold price */}
        <div className="text-[11px] text-[#4A3F2F] font-medium tabular-nums">
          {data ? (
            <>
              Zlato (1oz):{" "}
              <span className="font-bold text-[#2E2419]">
                {(data.xau_eur * 31.1035).toLocaleString("de-DE", {
                  maximumFractionDigits: 0,
                })}{" "}
                €
              </span>
            </>
          ) : (
            <span className="opacity-40">Zlato (1oz): —</span>
          )}
        </div>

      </div>
    </div>
  );
}
