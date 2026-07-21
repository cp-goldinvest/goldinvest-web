import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// DELETE - potpuno ukloni stavku sa lagera (npr. pogresno unesena). Uskladi
// kasu pre brisanja (bez ponovnog uknjizenja).
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { error: reconcileErr } = await supabase.rpc("reconcile_lager_item_ledger", { p_lager_item_id: id, p_repost: false });
  if (reconcileErr) return NextResponse.json({ error: reconcileErr.message }, { status: 500 });

  const { error } = await supabase.from("lager_items").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// PATCH - izmena lager stavke. Opisna polja (datum, serijski broj, racun,
// dobavljac, napomena) mogu da se menjaju bilo kad - ne uticu na kasu.
// Nabavna cena i kasa se mogu menjati samo dok stavka nije prodata (cena
// prodate stavke je "zamrznuta" u snapshotu prodaje); ako je stavka vec
// uknjizena u kasu, izmena cene/kase automatski stornira staru vrednost i
// uknjizuje novu (reconcile_lager_item_ledger RPC).
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const {
    purchase_price_rsd,
    register_type,
    purchased_at,
    serial_number,
    invoice_number,
    supplier_name,
    supplier_tax_id,
    supplier_address,
    note,
  } = body;

  const supabase = createServiceClient();

  const { data: existing, error: fetchError } = await supabase
    .from("lager_items")
    .select("sold_at")
    .eq("id", id)
    .single();
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });

  const update: Record<string, unknown> = {};
  let financialChange = false;

  if (purchase_price_rsd !== undefined) {
    if (existing.sold_at) return NextResponse.json({ error: "Stavka je vec prodata, nabavna cena se ne moze menjati" }, { status: 409 });
    if (!purchase_price_rsd || purchase_price_rsd <= 0) {
      return NextResponse.json({ error: "purchase_price_rsd mora biti pozitivan broj" }, { status: 400 });
    }
    update.purchase_price_rsd = purchase_price_rsd;
    financialChange = true;
  }
  if (register_type !== undefined) {
    if (existing.sold_at) return NextResponse.json({ error: "Stavka je vec prodata, kasa se ne moze menjati" }, { status: 409 });
    if (!["bela", "crna"].includes(register_type)) {
      return NextResponse.json({ error: "register_type mora biti 'bela' ili 'crna'" }, { status: 400 });
    }
    update.register_type = register_type;
    financialChange = true;
  }
  if (purchased_at !== undefined) update.purchased_at = purchased_at;
  if (serial_number !== undefined) update.serial_number = serial_number;
  if (invoice_number !== undefined) update.invoice_number = invoice_number;
  if (supplier_name !== undefined) update.supplier_name = supplier_name;
  if (supplier_tax_id !== undefined) update.supplier_tax_id = supplier_tax_id;
  if (supplier_address !== undefined) update.supplier_address = supplier_address;
  if (note !== undefined) update.note = note;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nema polja za izmenu" }, { status: 400 });
  }

  const { error: updateErr } = await supabase.from("lager_items").update(update).eq("id", id);
  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  if (financialChange) {
    const { error: reconcileErr } = await supabase.rpc("reconcile_lager_item_ledger", { p_lager_item_id: id, p_repost: true });
    if (reconcileErr) return NextResponse.json({ error: reconcileErr.message }, { status: 500 });
  }

  const { data, error } = await supabase.from("lager_items").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
