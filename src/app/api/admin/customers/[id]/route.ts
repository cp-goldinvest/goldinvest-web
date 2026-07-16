import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET - detalji kupca + istorija prodaja + otkup (kad je kupac bio dobavljac)
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const [customerRes, salesRes, purchasesRes] = await Promise.all([
    supabase.from("customers").select("*").eq("id", id).single(),
    supabase
      .from("sales")
      .select("*, sale_items(*)")
      .eq("customer_id", id)
      .order("sold_at", { ascending: false }),
    supabase
      .from("lager_items")
      .select(`
        id, purchase_price_rsd, purchased_at, note, register_type,
        product_variants!inner(id, slug, name, weight_g, products!inner(name, brand, category))
      `)
      .eq("supplier_customer_id", id)
      .order("purchased_at", { ascending: false }),
  ]);

  if (customerRes.error) return NextResponse.json({ error: customerRes.error.message }, { status: 500 });
  if (salesRes.error) return NextResponse.json({ error: salesRes.error.message }, { status: 500 });
  if (purchasesRes.error) return NextResponse.json({ error: purchasesRes.error.message }, { status: 500 });

  return NextResponse.json({
    ...customerRes.data,
    sales: salesRes.data,
    purchases_as_supplier: purchasesRes.data,
  });
}

// PATCH - izmena podataka kupca
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { full_name, phone, email, address, id_number, note } = body;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("customers")
    .update({ full_name, phone, email, address, id_number, note, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE - brisanje kupca (samo ako nema vezanih prodaja/nabavki - FK je ON DELETE SET NULL pa ce proci,
// ali cuvamo istoriju prodaja pa dozvoljavamo)
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
