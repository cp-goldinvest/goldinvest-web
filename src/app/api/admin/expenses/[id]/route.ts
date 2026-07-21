import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// PATCH - izmena troska. Ako je vec uknjizen u kasu, automatski stornira
// staru vrednost i uknjizuje novu (reconcile_expense_ledger RPC).
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { expense_date, category, register_type, amount_rsd, description } = body;

  if (register_type && !["bela", "crna"].includes(register_type)) {
    return NextResponse.json({ error: "register_type mora biti 'bela' ili 'crna'" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (expense_date !== undefined) update.expense_date = expense_date;
  if (category !== undefined) update.category = category;
  if (register_type !== undefined) update.register_type = register_type;
  if (amount_rsd !== undefined) update.amount_rsd = amount_rsd;
  if (description !== undefined) update.description = description;

  const supabase = createServiceClient();
  const { error: updateErr } = await supabase.from("expenses").update(update).eq("id", id);
  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  const { error: reconcileErr } = await supabase.rpc("reconcile_expense_ledger", { p_expense_id: id, p_repost: true });
  if (reconcileErr) return NextResponse.json({ error: reconcileErr.message }, { status: 500 });

  const { data, error } = await supabase.from("expenses").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE - brisanje troska, uskladi kasu pre brisanja (bez ponovnog uknjizenja)
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { error: reconcileErr } = await supabase.rpc("reconcile_expense_ledger", { p_expense_id: id, p_repost: false });
  if (reconcileErr) return NextResponse.json({ error: reconcileErr.message }, { status: 500 });

  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
