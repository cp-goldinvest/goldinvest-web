import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * GET /api/cron/fetch-gold
 *
 * Vercel Cron Job — runs every 5 minutes (see vercel.json).
 * Fetches live XAU/EUR from market sources, resolves EUR/RSD via
 * priority chain, and inserts a new gold_price_snapshots row.
 *
 * EUR/RSD priority:
 *   1. Manual rate set by admin today (source='manual_rates', last 24h)
 *   2. Live rate from frankfurter.app (ECB — free, no API key)
 *   3. Latest stored eur_rsd from DB (any snapshot)
 *   4. If none available → skip snapshot, log error
 *
 * XAU/EUR priority:
 *   1. goldprice.org  (free, no key)
 *   2. Swissquote     (free, no key)
 *   3. GoldAPI.io     (requires GOLD_API_KEY env var)
 *   4. Yahoo Finance GC=F + EURUSD conversion
 *
 * Env vars:
 *   GOLD_API_KEY   — optional; enables GoldAPI.io as fallback source
 *   CRON_SECRET    — optional; protects this endpoint from public access
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GRAMS_PER_OZ = 31.1034768;

type EurRsdResult = {
  eur_rsd: number;
  eur_rsd_source: "manual" | "api" | "fallback";
};

// ── Main handler ──────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();

    // Fetch gold price and resolve EUR/RSD in parallel — they're independent
    const [xauEur, eurRsdResult] = await Promise.all([
      fetchGoldPrice(),
      resolveEurRsd(supabase),
    ]);

    if (!xauEur) {
      return NextResponse.json({ error: "Gold price fetch failed — all sources unavailable" }, { status: 502 });
    }

    if (!eurRsdResult) {
      // No EUR/RSD available from any source — do not insert a useless snapshot
      console.error("[cron/fetch-gold] EUR/RSD unavailable from all sources");
      return NextResponse.json({ error: "EUR/RSD unavailable — snapshot skipped" }, { status: 503 });
    }

    const { eur_rsd: eurRsd, eur_rsd_source: eurRsdSource } = eurRsdResult;

    // Compute USD fields for historical data richness (optional, not used for pricing)
    const eurUsd = await fetchEurUsd();
    const xauUsd = parseFloat((xauEur * eurUsd).toFixed(2));
    const usdRsd = parseFloat((eurRsd / eurUsd).toFixed(4));

    const { error } = await supabase.from("gold_price_snapshots").insert({
      xau_usd: xauUsd,
      xau_eur: xauEur,
      usd_rsd: usdRsd,
      eur_rsd: eurRsd,
      eur_rsd_source: eurRsdSource,
      source: "auto",
      fetched_at: new Date().toISOString(),
    });

    if (error) throw error;

    const rsdPerGram = Math.round((xauEur / GRAMS_PER_OZ) * eurRsd);

    return NextResponse.json({
      ok: true,
      xau_eur: xauEur,
      xau_usd: xauUsd,
      eur_rsd: eurRsd,
      eur_rsd_source: eurRsdSource,
      rsd_per_gram: rsdPerGram,
      fetched_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron/fetch-gold]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// ── EUR/RSD resolution — priority chain ──────────────────────────────────────

/**
 * Resolves the active EUR/RSD rate using this priority:
 *  1. Admin manual rate (source='manual_rates', set within last 24h)
 *  2. ECB live rate via frankfurter.app (free, no key)
 *  3. Latest stored eur_rsd from any snapshot in DB
 *  4. null → caller must skip snapshot
 *
 * A 24h window is used for manual rates instead of a strict calendar day
 * to handle timezone edge cases and late-night rate changes.
 */
async function resolveEurRsd(
  supabase: ReturnType<typeof createServiceClient>
): Promise<EurRsdResult | null> {
  // 1. Manual rate — admin override has highest priority
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: manualSnap } = await supabase
    .from("gold_price_snapshots")
    .select("eur_rsd")
    .eq("source", "manual_rates")
    .gte("fetched_at", since24h)
    .not("eur_rsd", "is", null)
    .order("fetched_at", { ascending: false })
    .limit(1)
    .single();

  if (manualSnap?.eur_rsd != null) {
    return { eur_rsd: manualSnap.eur_rsd, eur_rsd_source: "manual" };
  }

  // 2. Live ECB rate from frankfurter.app
  const apiRate = await fetchEurRsdFromApi();
  if (apiRate != null) {
    return { eur_rsd: apiRate, eur_rsd_source: "api" };
  }

  // 3. Latest known rate from DB (any snapshot)
  const { data: lastSnap } = await supabase
    .from("gold_price_snapshots")
    .select("eur_rsd")
    .not("eur_rsd", "is", null)
    .order("fetched_at", { ascending: false })
    .limit(1)
    .single();

  if (lastSnap?.eur_rsd != null) {
    console.warn("[cron/fetch-gold] EUR/RSD: using DB fallback rate", lastSnap.eur_rsd);
    return { eur_rsd: lastSnap.eur_rsd, eur_rsd_source: "fallback" };
  }

  // 4. Nothing available
  return null;
}

/**
 * Fetch EUR/RSD from ECB via frankfurter.app.
 * Free, no API key, data from the European Central Bank.
 * Note: ECB updates rates on business days around 16:00 CET.
 */
async function fetchEurRsdFromApi(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.frankfurter.app/latest?from=EUR&to=RSD",
      { next: { revalidate: 0 } }
    );
    if (res.ok) {
      const data = await res.json();
      const rate: unknown = data?.rates?.RSD;
      if (typeof rate === "number" && rate > 50 && rate < 500) return rate;
    }
  } catch {
    console.warn("[cron/fetch-gold] frankfurter.app EUR/RSD fetch failed");
  }
  return null;
}

// ── XAU/EUR fetcher — cascading fallbacks ────────────────────────────────────

async function fetchGoldPrice(): Promise<number | null> {
  const apiKey = process.env.GOLD_API_KEY;

  // 1. goldprice.org — free, no key (primary)
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
      const price: unknown = data?.items?.[0]?.xauPrice;
      if (typeof price === "number" && price > 100) return price;
    }
  } catch {
    console.warn("[fetch-gold] goldprice.org failed");
  }

  // 2. Swissquote — free, no key
  try {
    const res = await fetch(
      "https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/EUR",
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }
    );
    if (res.ok) {
      const data = await res.json();
      const ask: unknown = data?.[0]?.spreadProfilePrices?.[0]?.ask;
      if (typeof ask === "number" && ask > 100) return ask;
    }
  } catch {
    console.warn("[fetch-gold] Swissquote failed");
  }

  // 3. GoldAPI.io — requires GOLD_API_KEY
  if (apiKey) {
    try {
      const res = await fetch("https://www.goldapi.io/api/XAU/EUR", {
        headers: { "x-access-token": apiKey },
        next: { revalidate: 0 },
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.price === "number" && data.price > 100) return data.price;
      }
    } catch {
      console.warn("[fetch-gold] goldapi.io failed");
    }
  }

  // 4. Yahoo Finance GC=F (USD futures) ÷ EURUSD
  try {
    const [gRes, fRes] = await Promise.all([
      fetch("https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1m&range=1d",
        { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }),
      fetch("https://query1.finance.yahoo.com/v8/finance/chart/EURUSD%3DX?interval=1m&range=1d",
        { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }),
    ]);
    if (gRes.ok && fRes.ok) {
      const [gd, fd] = await Promise.all([gRes.json(), fRes.json()]);
      const xauUsd: unknown = gd?.chart?.result?.[0]?.meta?.regularMarketPrice;
      const eurUsd: unknown = fd?.chart?.result?.[0]?.meta?.regularMarketPrice;
      if (typeof xauUsd === "number" && typeof eurUsd === "number" && xauUsd > 100 && eurUsd > 0) {
        return xauUsd / eurUsd;
      }
    }
  } catch {
    console.warn("[fetch-gold] Yahoo Finance fallback failed");
  }

  return null;
}

// ── EUR/USD helper — for computing optional USD snapshot fields ───────────────

async function fetchEurUsd(): Promise<number> {
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/EURUSD%3DX?interval=1m&range=1d",
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }
    );
    if (res.ok) {
      const data = await res.json();
      const rate: unknown = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
      if (typeof rate === "number" && rate > 0) return rate;
    }
  } catch {
    console.warn("[fetch-gold] EUR/USD fetch failed, using fallback 1.08");
  }
  return 1.08;
}
