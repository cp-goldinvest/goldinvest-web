import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * GET /api/prices
 *
 * Returns current gold price from the latest DB snapshot.
 *
 * Architecture: this route does NOT call any external API directly.
 * All market fetching is done by the Vercel cron job (/api/cron/fetch-gold)
 * which runs every 5 minutes and writes to gold_price_snapshots.
 *
 * Benefits:
 *   - Fast: single Supabase read, no external network calls
 *   - Stable: never fails due to Yahoo/goldprice.org downtime
 *   - Consistent: every consumer (ticker, chart, product prices) sees the same value
 *
 * EUR/RSD source priority:
 *   1. Admin manually sets rate via /api/admin/rates (creates snapshot with source='manual_rates')
 *   2. Cron job carries forward the last known eur_rsd when inserting new snapshots
 *
 * Called by: PriceTicker (every 60s), GoldPriceChartFull (on mount), admin pages
 */
export const revalidate = 55;

const GRAMS_PER_OZ = 31.1034768;

export async function GET() {
  try {
    const supabase = createServiceClient();

    const { data: snap, error } = await supabase
      .from("gold_price_snapshots")
      .select("xau_eur, xau_usd, eur_rsd, usd_rsd, price_per_g_rsd, fetched_at, source, eur_rsd_source")
      .order("fetched_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !snap) {
      console.error("[api/prices] No snapshot available:", error);
      return NextResponse.json({ error: "Prices unavailable" }, { status: 503 });
    }

    // Compute rsd_per_gram from EUR data when available (preferred — matches admin rate).
    // Fall back to stored price_per_g_rsd (computed from USD) if EUR fields are missing.
    const rsdPerGram =
      snap.xau_eur != null && snap.eur_rsd != null
        ? Math.round((snap.xau_eur / GRAMS_PER_OZ) * snap.eur_rsd)
        : snap.price_per_g_rsd != null
          ? Math.round(snap.price_per_g_rsd)
          : null;

    if (rsdPerGram == null) {
      return NextResponse.json({ error: "Prices unavailable" }, { status: 503 });
    }

    return NextResponse.json(
      {
        xau_eur: snap.xau_eur,
        eur_rsd: snap.eur_rsd,
        rsd_per_gram: rsdPerGram,
        fetched_at: snap.fetched_at,
        source: snap.source,
        eur_rsd_source: snap.eur_rsd_source ?? "fallback",
      },
      {
        headers: {
          // 55s browser cache — PriceTicker polls every 60s
          "Cache-Control": "public, s-maxage=55, stale-while-revalidate=10",
        },
      }
    );
  } catch (err) {
    console.error("[api/prices]", err);
    return NextResponse.json({ error: "Prices unavailable" }, { status: 503 });
  }
}
