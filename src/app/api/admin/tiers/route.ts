import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { GOLDINVEST_SITE_ID, ZLATNEPLOCICE_SITE_ID } from "@/lib/site";

export const dynamic = "force-dynamic";

function parseSiteId(value: string | number | null | undefined): number {
  const n = Number(value);
  if (n === GOLDINVEST_SITE_ID || n === ZLATNEPLOCICE_SITE_ID) return n;
  return GOLDINVEST_SITE_ID;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const siteId = parseSiteId(url.searchParams.get("site_id"));

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("pricing_tiers")
    .select("*")
    .eq("site_id", siteId)
    .order("category").order("weight_g", { nullsFirst: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const tiers = Array.isArray(body) ? body : body.tiers;
  const siteId = parseSiteId(Array.isArray(body) ? null : body.site_id);
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
      .eq("site_id", siteId)
  );

  const results = await Promise.all(updates);
  const failed = results.find(r => r.error);
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, category, weight_g, brand, margin_stock_pct, margin_advance_pct, margin_purchase_pct } = body;
  const siteId = parseSiteId(body.site_id);

  if (!brand) return NextResponse.json({ error: "brand je obavezan" }, { status: 400 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("pricing_tiers")
    .insert({
      site_id: siteId,
      name, category, weight_g, brand,
      margin_stock_pct,
      margin_advance_pct: margin_advance_pct ?? 0,
      margin_purchase_pct: margin_purchase_pct ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: Request) {
  const { id, site_id } = await request.json();
  if (!id) return NextResponse.json({ error: "id je obavezan" }, { status: 400 });
  const siteId = parseSiteId(site_id);

  const supabase = createServiceClient();

  const { data: tier } = await supabase
    .from("pricing_tiers")
    .select("brand")
    .eq("id", id)
    .eq("site_id", siteId)
    .single();

  if (!tier?.brand) {
    return NextResponse.json({ error: "Ne možeš obrisati bazni tier" }, { status: 403 });
  }

  const { error } = await supabase.from("pricing_tiers").delete().eq("id", id).eq("site_id", siteId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
