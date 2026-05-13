import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { GOLDINVEST_SITE_ID, ZLATNEPLOCICE_SITE_ID } from "@/lib/site";

export const dynamic = "force-dynamic";

function parseSiteId(value: string | number | null | undefined): number {
  const n = Number(value);
  if (n === GOLDINVEST_SITE_ID || n === ZLATNEPLOCICE_SITE_ID) return n;
  return GOLDINVEST_SITE_ID;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { variant_id, override_stock_price, override_advance_price, override_purchase_price } = body;
  const siteId = parseSiteId(body.site_id);
  if (!variant_id) return NextResponse.json({ error: "variant_id obavezan" }, { status: 400 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("pricing_rules")
    .upsert({
      variant_id,
      site_id: siteId,
      override_stock_price:    override_stock_price    || null,
      override_advance_price:  override_advance_price  || null,
      override_purchase_price: override_purchase_price || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "variant_id,site_id" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const siteId = parseSiteId(body.site_id);
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("pricing_rules")
    .delete()
    .eq("variant_id", body.variant_id)
    .eq("site_id", siteId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
