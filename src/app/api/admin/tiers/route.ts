import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("pricing_tiers")
    .select("*")
    .order("min_g");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const tiers = await request.json();
  const supabase = createServiceClient();

  const updates = tiers.map((t: { id: string; margin_stock_pct: number; margin_advance_pct: number; margin_purchase_pct: number }) =>
    supabase
      .from("pricing_tiers")
      .update({
        margin_stock_pct: t.margin_stock_pct,
        margin_advance_pct: t.margin_advance_pct,
        margin_purchase_pct: t.margin_purchase_pct,
      })
      .eq("id", t.id)
  );

  const results = await Promise.all(updates);
  const failed = results.find(r => r.error);
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
