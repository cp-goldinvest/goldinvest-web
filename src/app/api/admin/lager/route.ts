import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET — svi lager items sa variant info
export async function GET() {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("lager_items")
    .select(`
      id,
      purchase_price_rsd,
      purchased_at,
      note,
      created_at,
      product_variants!inner(
        id,
        slug,
        name,
        weight_g,
        purity,
        sku,
        products!inner(name, brand, category)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — dodaj novi item na lager
export async function POST(request: Request) {
  const body = await request.json();
  const { variant_id, purchase_price_rsd, purchased_at, note } = body;

  if (!variant_id || !purchase_price_rsd) {
    return NextResponse.json({ error: "variant_id i purchase_price_rsd su obavezni" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lager_items")
    .insert({ variant_id, purchase_price_rsd, purchased_at: purchased_at ?? new Date().toISOString().slice(0, 10), note })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
