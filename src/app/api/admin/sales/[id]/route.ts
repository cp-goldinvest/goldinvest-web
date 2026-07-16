import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET - detalji jedne prodaje
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("sales")
    .select("*, customers:customer_id(id, full_name, phone, email), sale_items(*)")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE - storniranje prodaje: vrati lager_items.sold_at na NULL, obrisi sale (cascade brise sale_items)
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: items, error: itemsErr } = await supabase
    .from("sale_items")
    .select("lager_item_id")
    .eq("sale_id", id);

  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 });

  const lagerItemIds = (items ?? []).map((i) => i.lager_item_id).filter((v): v is string => !!v);
  if (lagerItemIds.length > 0) {
    const { error: restoreErr } = await supabase
      .from("lager_items")
      .update({ sold_at: null })
      .in("id", lagerItemIds);
    if (restoreErr) return NextResponse.json({ error: restoreErr.message }, { status: 500 });
  }

  const { error } = await supabase.from("sales").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
