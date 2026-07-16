import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET - lista prodaja, filteri: ?register_type=bela|crna&from=YYYY-MM-DD&to=YYYY-MM-DD&customer_id=
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const registerType = searchParams.get("register_type");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const customerId = searchParams.get("customer_id");

  const supabase = createServiceClient();
  let query = supabase
    .from("sales")
    .select("*, customers:customer_id(id, full_name, phone), sale_items(*)")
    .order("sold_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (registerType) query = query.eq("register_type", registerType);
  if (from) query = query.gte("sold_at", from);
  if (to) query = query.lte("sold_at", to);
  if (customerId) query = query.eq("customer_id", customerId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST - nova prodaja. Body:
// { lager_item_id, customer_id? , new_customer?: {full_name, phone, email},
//   unit_price_rsd, register_type, payment_method, sold_at?, note? }
// Kreira sales + sale_items (snapshot iz lager_item/variant/product) i markira
// lager_items.sold_at (umesto DELETE-a).
export async function POST(request: Request) {
  const body = await request.json();
  const {
    lager_item_id,
    customer_id: customerIdInput,
    new_customer,
    unit_price_rsd,
    register_type,
    payment_method,
    sold_at,
    note,
    invoice_number,
  } = body;

  if (!lager_item_id || !unit_price_rsd || !register_type) {
    return NextResponse.json(
      { error: "lager_item_id, unit_price_rsd i register_type su obavezni" },
      { status: 400 }
    );
  }
  if (!["bela", "crna"].includes(register_type)) {
    return NextResponse.json({ error: "register_type mora biti 'bela' ili 'crna'" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // 1. Ucitaj lager_item + variant + product za snapshot i da proverimo da li je vec prodat
  const { data: lagerItem, error: lagerErr } = await supabase
    .from("lager_items")
    .select(`
      id, purchase_price_rsd, sold_at, serial_number,
      product_variants!inner(id, name, weight_g, products!inner(name, category))
    `)
    .eq("id", lager_item_id)
    .single();

  if (lagerErr || !lagerItem) {
    return NextResponse.json({ error: "Lager stavka nije pronadjena" }, { status: 404 });
  }
  if (lagerItem.sold_at) {
    return NextResponse.json({ error: "Ova stavka je vec markirana kao prodata" }, { status: 409 });
  }

  // 2. Odredi kupca - postojeci ili kreiraj novog
  let customerId: string | null = customerIdInput ?? null;
  if (!customerId && new_customer?.full_name) {
    const { data: createdCustomer, error: customerErr } = await supabase
      .from("customers")
      .insert({
        full_name: new_customer.full_name,
        phone: new_customer.phone ?? null,
        email: new_customer.email ?? null,
      })
      .select()
      .single();
    if (customerErr) return NextResponse.json({ error: customerErr.message }, { status: 500 });
    customerId = createdCustomer.id;
  }

  const variant = lagerItem.product_variants as unknown as {
    id: string;
    name: string | null;
    weight_g: number;
    products: { name: string; category: string };
  };

  const priceNum = Number(unit_price_rsd);

  // 3. Kreiraj sales header
  const { data: sale, error: saleErr } = await supabase
    .from("sales")
    .insert({
      register_type,
      customer_id: customerId,
      sold_at: sold_at ?? new Date().toISOString().slice(0, 10),
      payment_method: payment_method ?? "gotovina",
      subtotal_rsd: priceNum,
      total_rsd: priceNum,
      note: note ?? null,
      invoice_number: invoice_number ?? null,
    })
    .select()
    .single();

  if (saleErr) return NextResponse.json({ error: saleErr.message }, { status: 500 });

  // 4. Kreiraj sale_items (snapshot)
  const { data: saleItem, error: itemErr } = await supabase
    .from("sale_items")
    .insert({
      sale_id: sale.id,
      lager_item_id: lagerItem.id,
      variant_id: variant.id,
      product_name_snapshot: variant.products.name,
      variant_name_snapshot: variant.name,
      weight_g_snapshot: variant.weight_g,
      category_snapshot: variant.products.category,
      quantity: 1,
      unit_price_rsd: priceNum,
      line_total_rsd: priceNum,
      purchase_price_snapshot_rsd: lagerItem.purchase_price_rsd,
      serial_number_snapshot: lagerItem.serial_number,
    })
    .select()
    .single();

  if (itemErr) {
    await supabase.from("sales").delete().eq("id", sale.id);
    return NextResponse.json({ error: itemErr.message }, { status: 500 });
  }

  // 5. Markiraj lager_item kao prodat
  const { error: markErr } = await supabase
    .from("lager_items")
    .update({ sold_at: new Date().toISOString() })
    .eq("id", lagerItem.id);

  if (markErr) {
    await supabase.from("sale_items").delete().eq("id", saleItem.id);
    await supabase.from("sales").delete().eq("id", sale.id);
    return NextResponse.json({ error: markErr.message }, { status: 500 });
  }

  return NextResponse.json({ ...sale, sale_items: [saleItem] }, { status: 201 });
}
