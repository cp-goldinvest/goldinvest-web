"use client";

import { useEffect, useRef, useState } from "react";

type PriceData = {
  xau_eur: number;
  eur_rsd: number;
  rsd_per_gram: number;
  fetched_at: string;
  rates_updated_at: string;
};

function getTimeAgo(ms: number): string {
  const diff = Math.floor((Date.now() - ms) / 1000);
  if (diff < 60) return `${diff}s`;
  const m = Math.floor(diff / 60);
  return m === 1 ? "1 min" : `${m} min`;
}

export function PriceTicker() {
  const [data, setData] = useState<PriceData | null>(null);
  const [timeAgo, setTimeAgo] = useState("...");
  const lastFetchedAt = useRef<number | null>(null);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/prices");
        if (!res.ok) return;
        const json: PriceData = await res.json();
        setData(json);
        lastFetchedAt.current = Date.now();
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
    const update = () => {
      if (lastFetchedAt.current !== null) {
        setTimeAgo(getTimeAgo(lastFetchedAt.current));
      }
    };
    update();
    const interval = setInterval(update, 15_000);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <div
      className="w-full h-9 flex items-center"
      style={{
        background: "#F5F1E5",
        borderBottom: "1px solid #E2D7BF",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 w-full flex items-center justify-between">

        {/* Left: live indicator + time */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C950] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C950]" />
          </span>
          <span className="text-[13px] text-[#4A3F2F] font-medium">
            Cene ažurirane pre{" "}
            <span className="font-semibold">{timeAgo}</span>
          </span>
        </div>

        {/* Right: gold price RSD/g */}
        <div className="text-[13px] text-[#4A3F2F] font-medium tabular-nums">
          {data ? (
            <>
              Zlato (1g):{" "}
              <span className="font-bold text-[#2E2419]">
                {data.rsd_per_gram.toLocaleString("sr-RS", {
                  maximumFractionDigits: 0,
                })}{" "}
                RSD
              </span>
            </>
          ) : (
            <span className="opacity-40">Zlato (1g): -</span>
          )}
        </div>

      </div>
    </div>
  );
}
