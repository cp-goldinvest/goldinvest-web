import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/admin/rates
 *
 * Admin sets the EUR/RSD exchange rate manually.
 * The rate stays active indefinitely until admin explicitly changes it.
 *
 * Logic:
 *   1. Validate input
 *   2. Fetch latest XAU/EUR from the most recent snapshot
 *   3. Insert a new snapshot with source='manual_rates'
 *      - xau_usd / usd_rsd are omitted (nullable after migration)
 *      - price_per_g_rsd is auto-computed by Postgres: xau_eur / 31.1035 * eur_rsd
 *   4. Return computed rsd_per_gram so admin UI can show preview
 *
 * The cron job (/api/cron/fetch-gold) always uses the latest manual rate
 * (no time limit) as the highest-priority EUR/RSD source.
 */

const GRAMS_PER_OZ = 31.1034768;

async function getLatestXauEur(
  supabase: ReturnType<typeof createServiceClient>
): Promise<number> {
  const { data: last } = await supabase
    .from("gold_price_snapshots")
    .select("xau_eur")
    .not("xau_eur", "is", null)
    .order("fetched_at", { ascending: false })
    .limit(1)
    .single();
  return last?.xau_eur ?? 4375;
}

async function insertManualRateSnapshot(
  supabase: ReturnType<typeof createServiceClient>,
  xauEur: number,
  eurRsd: number
) {
  return supabase
    .from("gold_price_snapshots")
    .insert({
      xau_eur: xauEur,
      eur_rsd: eurRsd,
      eur_rsd_source: "manual",
      source: "manual_rates",
      fetched_at: new Date().toISOString(),
    })
    .select()
    .single();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const eurRsdRaw = body.eur_rsd;

    if (!eurRsdRaw) {
      return NextResponse.json({ error: "eur_rsd je obavezan" }, { status: 400 });
    }

    const eurRsd = Number(eurRsdRaw);
    if (isNaN(eurRsd) || eurRsd < 50 || eurRsd > 500) {
      return NextResponse.json({ error: "Nevažeći EUR/RSD kurs" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const xauEur = await getLatestXauEur(supabase);
    const { data, error } = await insertManualRateSnapshot(supabase, xauEur, eurRsd);

    if (error) throw error;

    const rsdPerGram = Math.round((xauEur / GRAMS_PER_OZ) * eurRsd);

    return NextResponse.json({
      ok: true,
      xau_eur: xauEur,
      eur_rsd: eurRsd,
      rsd_per_gram: rsdPerGram,
      snapshot: data,
    });
  } catch (err) {
    console.error("[api/admin/rates]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
