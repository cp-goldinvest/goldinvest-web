import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET - lager items sa variant info. Podrazumevano samo "na lageru"
// (nije prodato, nije rezervisano); ?all=true vraca i prodate/rezervisane.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";

  const supabase = createServiceClient();

  let query = supabase
    .from("lager_items")
    .select(`
      id,
      purchase_price_rsd,
      purchased_at,
      note,
      register_type,
      supplier_name,
      supplier_customer_id,
      sold_at,
      reserved_order_id,
      serial_number,
      invoice_number,
      supplier_tax_id,
      supplier_address,
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

  if (!all) query = query.is("sold_at", null).is("reserved_order_id", null);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST - dodaj novi item na lager
export async function POST(request: Request) {
  const body = await request.json();
  const {
    variant_id,
    purchase_price_rsd,
    purchased_at,
    note,
    register_type,
    supplier_name,
    supplier_customer_id,
    serial_number,
    invoice_number,
    supplier_tax_id,
    supplier_address,
  } = body;

  if (!variant_id || !purchase_price_rsd) {
    return NextResponse.json({ error: "variant_id i purchase_price_rsd su obavezni" }, { status: 400 });
  }
  if (register_type && !["bela", "crna"].includes(register_type)) {
    return NextResponse.json({ error: "register_type mora biti 'bela' ili 'crna'" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lager_items")
    .insert({
      variant_id,
      purchase_price_rsd,
      purchased_at: purchased_at ?? new Date().toISOString().slice(0, 10),
      note,
      register_type: register_type ?? "bela",
      supplier_name: supplier_name ?? null,
      supplier_customer_id: supplier_customer_id ?? null,
      serial_number: serial_number ?? null,
      invoice_number: invoice_number ?? null,
      supplier_tax_id: supplier_tax_id ?? null,
      supplier_address: supplier_address ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
