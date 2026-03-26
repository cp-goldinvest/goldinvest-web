import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * GET /api/cron/fetch-gold
 *
 * Vercel Cron Job — poziva se automatski svakih 30 minuta.
 * Vuce XAU/USD sa goldapi.io i upisuje u gold_price_snapshots.
 *
 * Podesi u vercel.json:
 * {
 *   "crons": [{ "path": "/api/cron/fetch-gold", "schedule": "0 8 * * *" }]
 * }
 *
 * Env varijable:
 *   GOLD_API_KEY   — sa https://www.goldapi.io (besplatno, 100 req/dan)
 *   CRON_SECRET    — opcionalno, za zaštitu endpoint-a
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Zaštita — samo Vercel Cron ili zahtevi sa tajnim ključem
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const xauEur = await fetchGoldPrice();
    if (!xauEur) {
      return NextResponse.json({ error: "Gold price fetch failed" }, { status: 502 });
    }

    // Učitaj poslednji EUR/RSD kurs koji je radnik uneo jutros
    const supabase = createServiceClient();
    const { data: lastRates } = await supabase
      .from("gold_price_snapshots")
      .select("eur_rsd")
      .order("fetched_at", { ascending: false })
      .limit(1)
      .single();

    const eurRsd = lastRates?.eur_rsd ?? 117.6;

    // Pribavi EUR/USD kurs za konverziju
    const eurUsd = await fetchEurUsd();
    const xauUsd = parseFloat((xauEur * eurUsd).toFixed(2));
    const usdRsd = parseFloat((eurRsd / eurUsd).toFixed(4));

    // Upiši novi snapshot
    const { error } = await supabase.from("gold_price_snapshots").insert({
      xau_usd: xauUsd,
      xau_eur: xauEur,
      usd_rsd: usdRsd,
      eur_rsd: eurRsd,
      source: "auto",
      fetched_at: new Date().toISOString(),
    });

    if (error) throw error;

    const rsdPerGram = ((xauEur / 31.1034) * eurRsd).toFixed(2);
    return NextResponse.json({
      ok: true,
      xau_eur: xauEur,
      xau_usd: xauUsd,
      eur_rsd: eurRsd,
      usd_rsd: usdRsd,
      rsd_per_gram: rsdPerGram,
      fetched_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron/fetch-gold]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// ── XAU/EUR fetcher ────────────────────────────────────────────────────────
async function fetchGoldPrice(): Promise<number | null> {
  const apiKey = process.env.GOLD_API_KEY;

  // 1. goldprice.org — besplatno, bez API ključa (primarni izvor)
  try {
    const res = await fetch("https://data-asg.goldprice.org/dbXRates/EUR", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Referer": "https://goldprice.org/",
        "Origin": "https://goldprice.org",
      },
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      const price = data?.items?.[0]?.xauPrice;
      if (price && price > 100) return price;
    }
  } catch {
    console.warn("[fetch-gold] goldprice.org failed, trying fallback");
  }

  // 2. Swissquote — javni feed, bez API ključa
  try {
    const res = await fetch(
      "https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/EUR",
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }
    );
    if (res.ok) {
      const data = await res.json();
      const ask = data?.[0]?.spreadProfilePrices?.[0]?.ask;
      if (ask && ask > 100) return ask;
    }
  } catch {
    console.warn("[fetch-gold] Swissquote failed, trying fallback");
  }

  // 3. GoldAPI.io — ako je API ključ podešen
  if (apiKey) {
    try {
      const res = await fetch("https://www.goldapi.io/api/XAU/EUR", {
        headers: { "x-access-token": apiKey },
        next: { revalidate: 0 },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.price && data.price > 100) return data.price;
      }
    } catch {
      console.warn("[fetch-gold] goldapi.io failed");
    }
  }

  // 4. Yahoo GC=F (USD) + EUR/USD konverzija
  try {
    const [gRes, fRes] = await Promise.all([
      fetch("https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1m&range=1d",
        { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }),
      fetch("https://query1.finance.yahoo.com/v8/finance/chart/EURUSD%3DX?interval=1m&range=1d",
        { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }),
    ]);
    if (gRes.ok && fRes.ok) {
      const [gd, fd] = await Promise.all([gRes.json(), fRes.json()]);
      const xauUsd = gd?.chart?.result?.[0]?.meta?.regularMarketPrice;
      const eurUsd = fd?.chart?.result?.[0]?.meta?.regularMarketPrice;
      if (xauUsd > 100 && eurUsd > 0) return xauUsd / eurUsd;
    }
  } catch {
    console.warn("[fetch-gold] Yahoo Finance fallback also failed");
  }

  return null;
}

// ── EUR/USD fetcher ─────────────────────────────────────────────────────────
async function fetchEurUsd(): Promise<number> {
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/EURUSD%3DX?interval=1m&range=1d",
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }
    );
    if (res.ok) {
      const data = await res.json();
      const rate = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
      if (rate && rate > 0) return rate;
    }
  } catch {
    console.warn("[fetch-gold] EUR/USD Yahoo fetch failed, using fallback");
  }
  return 1.08; // razuman fallback
}
