import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { GOLDINVEST_SITE_ID } from "@/lib/site";

export const dynamic = "force-dynamic";

// POST - upsert override za jedan variant (per-site)
export async function POST(request: Request) {
  const { variant_id, override_stock_price, override_advance_price, override_purchase_price } = await request.json();
  if (!variant_id) return NextResponse.json({ error: "variant_id obavezan" }, { status: 400 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("pricing_rules")
    .upsert({
      variant_id,
      site_id: GOLDINVEST_SITE_ID,
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

// DELETE - resetuj override (briše red) samo za ovaj sajt
export async function DELETE(request: Request) {
  const { variant_id } = await request.json();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("pricing_rules")
    .delete()
    .eq("variant_id", variant_id)
    .eq("site_id", GOLDINVEST_SITE_ID);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
