import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// DELETE - prodato, skini sa lagera
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { error } = await supabase.from("lager_items").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// PATCH - koriguj nabavnu cenu i/ili kasu stavke koja jos nije prodata
// (npr. kad se zna da stize jeftinija/skuplja zamena pre nego sto se stavka proda,
// ili kad se stavka pogresno unela pod pogresnom kasom)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { purchase_price_rsd, register_type } = body;

  const update: Record<string, unknown> = {};
  if (purchase_price_rsd !== undefined) {
    if (!purchase_price_rsd || purchase_price_rsd <= 0) {
      return NextResponse.json({ error: "purchase_price_rsd mora biti pozitivan broj" }, { status: 400 });
    }
    update.purchase_price_rsd = purchase_price_rsd;
  }
  if (register_type !== undefined) {
    if (!["bela", "crna"].includes(register_type)) {
      return NextResponse.json({ error: "register_type mora biti 'bela' ili 'crna'" }, { status: 400 });
    }
    update.register_type = register_type;
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nema polja za izmenu" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: existing, error: fetchError } = await supabase
    .from("lager_items")
    .select("sold_at")
    .eq("id", id)
    .single();
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
  if (existing.sold_at) {
    return NextResponse.json({ error: "Stavka je vec prodata, ne moze se menjati" }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("lager_items")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
