import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * GET /api/prices
 *
 * Vraća live cenu zlata + kurseve.
 * Strategija:
 *   1. Pokušaj da dobavimo live XAU/USD (Yahoo Finance, bez ključa)
 *   2. Uzmemo USD/RSD i EUR/RSD iz poslednjeg Supabase snapshot-a (radnik uneo jutros)
 *   3. Izračunamo RSD/g i vratimo JSON
 *
 * Ovaj route poziva browser direktno (iz PriceTicker-a) svakih 60 sekundi.
 * Nema potrebe za Vercel Cron za cenu zlata.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Live XAU/USD sa Yahoo Finance (besplatno, bez ključa)
    const xauEur = await fetchXauEur();

    // 2. EUR/RSD iz Supabase (radnik unosi jutros)
    const supabase = createServiceClient();
    const { data: snap } = await supabase
      .from("gold_price_snapshots")
      .select("eur_rsd, fetched_at")
      .order("fetched_at", { ascending: false })
      .limit(1)
      .single();

    const eurRsd = snap?.eur_rsd ?? 117.6;
    const ratesUpdatedAt = snap?.fetched_at ?? new Date().toISOString();

    // 3. Izračun: (XAU/EUR ÷ 31,1034) × EUR/RSD
    const rsdPerGram = Math.round((xauEur / 31.1034) * eurRsd);

    return NextResponse.json(
      {
        xau_eur: Math.round(xauEur * 100) / 100,
        eur_rsd: eurRsd,
        rsd_per_gram: rsdPerGram,
        fetched_at: new Date().toISOString(),
        rates_updated_at: ratesUpdatedAt,
      },
      {
        headers: {
          // Cache 55 sekundi — browser osvežava svakih 60s
          "Cache-Control": "public, s-maxage=55, stale-while-revalidate=10",
        },
      }
    );
  } catch (err) {
    console.error("[api/prices]", err);
    return NextResponse.json({ error: "Prices unavailable" }, { status: 503 });
  }
}

// ── Live XAU/EUR fetch ─────────────────────────────────────────────────────
async function fetchXauEur(): Promise<number> {
  // Pokušaj 1: GoldAPI.io — XAU/EUR direktno (ako je GOLD_API_KEY postavljen)
  const goldApiKey = process.env.GOLD_API_KEY;
  if (goldApiKey) {
    try {
      const res = await fetch("https://www.goldapi.io/api/XAU/EUR", {
        headers: { "x-access-token": goldApiKey },
        next: { revalidate: 0 },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.price && data.price > 100) return data.price;
      }
    } catch { /* fallthrough */ }
  }

  // Pokušaj 2: Yahoo Finance — XAUEUR=X spot
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/XAUEUR%3DX?interval=1m&range=1d",
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }
    );
    if (res.ok) {
      const data = await res.json();
      const price: number | undefined = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
      if (price && price > 100) return price;
    }
  } catch { /* fallthrough */ }

  // Pokušaj 3: Yahoo Finance GC=F (USD futures) + EUR/USD konverzija
  try {
    const [goldRes, fxRes] = await Promise.all([
      fetch("https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1m&range=1d",
        { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }),
      fetch("https://query1.finance.yahoo.com/v8/finance/chart/EURUSD%3DX?interval=1m&range=1d",
        { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }),
    ]);
    if (goldRes.ok && fxRes.ok) {
      const [gd, fd] = await Promise.all([goldRes.json(), fxRes.json()]);
      const xauUsd: number = gd?.chart?.result?.[0]?.meta?.regularMarketPrice;
      const eurUsd: number = fd?.chart?.result?.[0]?.meta?.regularMarketPrice;
      if (xauUsd > 100 && eurUsd > 0) return xauUsd / eurUsd;
    }
  } catch { /* fallthrough */ }

  // Fallback: poslednja poznata cena iz Supabase
  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("gold_price_snapshots")
      .select("xau_eur")
      .order("fetched_at", { ascending: false })
      .limit(1)
      .single();
    if (data?.xau_eur) return data.xau_eur;
  } catch { /* fallthrough */ }

  throw new Error("All gold price sources failed");
}
