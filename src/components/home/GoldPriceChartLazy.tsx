"use client";

import dynamic from "next/dynamic";

const GoldPriceChart = dynamic(
  () => import("@/components/home/GoldPriceChart").then((m) => ({ default: m.GoldPriceChart })),
  { ssr: false, loading: () => <div style={{ minHeight: 400 }} /> }
);

export function GoldPriceChartLazy() {
  return <GoldPriceChart />;
}
