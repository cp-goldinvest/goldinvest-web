import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// POST — upsert override za jedan variant
export async function POST(request: Request) {
  const { variant_id, override_stock_price, override_advance_price, override_purchase_price } = await request.json();
  if (!variant_id) return NextResponse.json({ error: "variant_id obavezan" }, { status: 400 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("pricing_rules")
    .upsert({
      variant_id,
      override_stock_price:    override_stock_price    || null,
      override_advance_price:  override_advance_price  || null,
      override_purchase_price: override_purchase_price || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "variant_id" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — resetuj override (briše red)
export async function DELETE(request: Request) {
  const { variant_id } = await request.json();
  const supabase = createServiceClient();
  const { error } = await supabase.from("pricing_rules").delete().eq("variant_id", variant_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
