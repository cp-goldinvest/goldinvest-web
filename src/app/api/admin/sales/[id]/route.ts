import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET - detalji jedne prodaje
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("sales")
    .select("*, customers:customer_id(id, full_name, phone, email), agents:agent_id(id, full_name), sale_items(*)")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH - izmena prodaje (header + opciono stavke). Namenjeno ispravci
// netacnih podataka (i istorijskih i novih). Ako je prodaja vec uknjizena
// u kasu, izmena automatski stornira staru vrednost i uknjizuje novu
// (reconcile_sale_ledger RPC) - stara istorija (bez ledger reda) se samo
// direktno menja, bez uticaja na kasu.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const {
    customer_id,
    agent_id,
    sold_at,
    payment_method,
    invoice_number,
    note,
    register_type,
    items,
  } = body;

  if (register_type && !["bela", "crna"].includes(register_type)) {
    return NextResponse.json({ error: "register_type mora biti 'bela' ili 'crna'" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // 1. Izmeni stavke (ako su poslate)
  if (Array.isArray(items)) {
    for (const item of items) {
      if (!item.id) continue;
      const itemUpdate: Record<string, unknown> = {};
      if (item.product_name_snapshot !== undefined) itemUpdate.product_name_snapshot = item.product_name_snapshot;
      if (item.variant_name_snapshot !== undefined) itemUpdate.variant_name_snapshot = item.variant_name_snapshot;
      if (item.weight_g_snapshot !== undefined) itemUpdate.weight_g_snapshot = item.weight_g_snapshot;
      if (item.category_snapshot !== undefined) itemUpdate.category_snapshot = item.category_snapshot;
      if (item.serial_number_snapshot !== undefined) itemUpdate.serial_number_snapshot = item.serial_number_snapshot;
      if (item.purchase_price_snapshot_rsd !== undefined) itemUpdate.purchase_price_snapshot_rsd = item.purchase_price_snapshot_rsd;

      if (item.unit_price_rsd !== undefined || item.quantity !== undefined) {
        const { data: current, error: curErr } = await supabase
          .from("sale_items")
          .select("unit_price_rsd, quantity")
          .eq("id", item.id)
          .single();
        if (curErr) return NextResponse.json({ error: curErr.message }, { status: 500 });
        const unitPrice = item.unit_price_rsd ?? current.unit_price_rsd;
        const quantity = item.quantity ?? current.quantity;
        itemUpdate.unit_price_rsd = unitPrice;
        itemUpdate.quantity = quantity;
        itemUpdate.line_total_rsd = unitPrice * quantity;
      }

      if (Object.keys(itemUpdate).length > 0) {
        const { error: itemErr } = await supabase.from("sale_items").update(itemUpdate).eq("id", item.id);
        if (itemErr) return NextResponse.json({ error: itemErr.message }, { status: 500 });
      }
    }
  }

  // 2. Izracunaj total na osnovu trenutnih stavki
  const { data: currentItems, error: itemsErr } = await supabase
    .from("sale_items")
    .select("line_total_rsd")
    .eq("sale_id", id);
  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 });
  const total = (currentItems ?? []).reduce((sum, i) => sum + Number(i.line_total_rsd), 0);

  // 3. Izmeni header
  const headerUpdate: Record<string, unknown> = { subtotal_rsd: total, total_rsd: total };
  if (customer_id !== undefined) headerUpdate.customer_id = customer_id;
  if (agent_id !== undefined) headerUpdate.agent_id = agent_id;
  if (sold_at !== undefined) headerUpdate.sold_at = sold_at;
  if (payment_method !== undefined) headerUpdate.payment_method = payment_method;
  if (invoice_number !== undefined) headerUpdate.invoice_number = invoice_number;
  if (note !== undefined) headerUpdate.note = note;
  if (register_type !== undefined) headerUpdate.register_type = register_type;

  const { error: saleErr } = await supabase.from("sales").update(headerUpdate).eq("id", id);
  if (saleErr) return NextResponse.json({ error: saleErr.message }, { status: 500 });

  // 4. Uskladi kasu (ako je ova prodaja vec bila uknjizena - inace no-op)
  const { error: reconcileErr } = await supabase.rpc("reconcile_sale_ledger", { p_sale_id: id, p_repost: true });
  if (reconcileErr) return NextResponse.json({ error: reconcileErr.message }, { status: 500 });

  const { data, error } = await supabase
    .from("sales")
    .select("*, customers:customer_id(id, full_name, phone, email), agents:agent_id(id, full_name), sale_items(*)")
    .eq("id", id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE - storniranje prodaje: uskladi kasu (bez ponovnog uknjizenja),
// vrati lager_items.sold_at na NULL i uskladi njihov "prodato" ledger krak,
// pa obrisi sale (cascade brise sale_items)
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: items, error: itemsErr } = await supabase
    .from("sale_items")
    .select("lager_item_id")
    .eq("sale_id", id);

  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 });

  // Stornira prihod od ove prodaje u kasi (bez ponovnog uknjizenja - prodaja se brise)
  const { error: reconcileErr } = await supabase.rpc("reconcile_sale_ledger", { p_sale_id: id, p_repost: false });
  if (reconcileErr) return NextResponse.json({ error: reconcileErr.message }, { status: 500 });

  const lagerItemIds = (items ?? []).map((i) => i.lager_item_id).filter((v): v is string => !!v);
  if (lagerItemIds.length > 0) {
    const { error: restoreErr } = await supabase
      .from("lager_items")
      .update({ sold_at: null })
      .in("id", lagerItemIds);
    if (restoreErr) return NextResponse.json({ error: restoreErr.message }, { status: 500 });

    // Vrati robu u odgovarajuci lager pool (stornira samo "prodato" krak, ne dira nabavni)
    for (const lagerItemId of lagerItemIds) {
      const { error: revErr } = await supabase.rpc("reverse_active_ledger_entries", {
        p_related_lager_item_id: lagerItemId,
        p_entry_types: ["sale"],
        p_reason: "Storno - prodaja poništena",
      });
      if (revErr) return NextResponse.json({ error: revErr.message }, { status: 500 });
    }
  }

  const { error } = await supabase.from("sales").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
