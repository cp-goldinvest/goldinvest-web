import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/admin/rates
 * Radnik unosi jutarnje kurseve (USD/RSD, EUR/RSD).
 * Ažurira poslednji snapshot u bazi sa novim kursevima.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eur_rsd } = body;

    if (!eur_rsd) {
      return NextResponse.json({ error: "eur_rsd je obavezan" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Uzmi poslednji XAU/EUR iz snapshota
    const { data: last } = await supabase
      .from("gold_price_snapshots")
      .select("xau_eur")
      .order("fetched_at", { ascending: false })
      .limit(1)
      .single();

    const xauEur = (last as any)?.xau_eur ?? 4375;

    // Upiši novi snapshot sa novim EUR/RSD kursom
    const { data, error } = await supabase
      .from("gold_price_snapshots")
      .insert({
        xau_usd: null,
        xau_eur: xauEur,
        usd_rsd: null,
        eur_rsd: Number(eur_rsd),
        source: "manual_rates",
        fetched_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    const rsdPerGram = ((xauEur / 31.1034) * Number(eur_rsd)).toFixed(2);
    return NextResponse.json({ ok: true, rsd_per_gram: rsdPerGram, snapshot: data });
  } catch (err) {
    console.error("[api/admin/rates]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
