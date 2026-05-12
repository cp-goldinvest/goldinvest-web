import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type TransitionAction =
  | "confirm_payment"
  | "mark_shipped"
  | "mark_delivered"
  | "cancel";

// POST - menja status porudzbine i sinhronizuje lager_items rezervaciju.
//
// Bodies:
//   { action: "confirm_payment" }
//      -> status: paid, paid_at: now, DELETE rezervisanih lager_items (prodato)
//   { action: "mark_shipped", carrier?, tracking_number? }
//      -> status: shipped, shipped_at: now
//   { action: "mark_delivered" }
//      -> status: delivered, delivered_at: now
//   { action: "cancel", reason? }
//      -> status: cancelled, cancelled_at: now, cancelled_reason
//      Ako cancel pre paid -> oslobodi rezervaciju (reserved_order_id=NULL).
//      Ako cancel posle paid -> upozorenje da treba rucno re-INSERT u lager.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const action = body.action as TransitionAction;

  if (!id) return NextResponse.json({ error: "id obavezan" }, { status: 400 });
  if (!action) return NextResponse.json({ error: "action obavezan" }, { status: 400 });

  const supabase = createServiceClient();

  // Pribavi trenutno stanje order-a
  const { data: order, error: fetchErr } = await supabase
    .from("orders")
    .select("id, status, paid_at")
    .eq("id", id)
    .single();
  if (fetchErr || !order) {
    return NextResponse.json({ error: "Porudzbina nije pronadjena" }, { status: 404 });
  }

  const now = new Date().toISOString();

  if (action === "confirm_payment") {
    if (order.status !== "pending_payment") {
      return NextResponse.json(
        { error: `Ne mozes potvrditi uplatu - status je '${order.status}', a treba 'pending_payment'` },
        { status: 409 }
      );
    }

    const { error: updErr } = await supabase
      .from("orders")
      .update({ status: "paid", paid_at: now })
      .eq("id", id);
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

    // Rezervisani komadi sada postaju prodati - briseme ih iz lager-a.
    // order_items.lager_item_id ce automatski postati NULL (ON DELETE SET NULL).
    const { error: delErr, count } = await supabase
      .from("lager_items")
      .delete({ count: "exact" })
      .eq("reserved_order_id", id);
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

    return NextResponse.json({ ok: true, lager_items_removed: count ?? 0 });
  }

  if (action === "mark_shipped") {
    if (order.status !== "paid") {
      return NextResponse.json(
        { error: `Treba prvo potvrditi uplatu - status je '${order.status}'` },
        { status: 409 }
      );
    }

    const update: Record<string, unknown> = { status: "shipped", shipped_at: now };
    if (body.carrier) update.shipping_carrier = body.carrier;
    if (body.tracking_number) update.shipping_tracking_number = body.tracking_number;

    const { error: updErr } = await supabase.from("orders").update(update).eq("id", id);
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === "mark_delivered") {
    if (order.status !== "shipped") {
      return NextResponse.json(
        { error: `Treba prvo poslati - status je '${order.status}'` },
        { status: 409 }
      );
    }
    const { error: updErr } = await supabase
      .from("orders")
      .update({ status: "delivered", delivered_at: now })
      .eq("id", id);
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === "cancel") {
    if (order.status === "cancelled" || order.status === "delivered") {
      return NextResponse.json(
        { error: `Ne mozes otkazati porudzbinu sa statusom '${order.status}'` },
        { status: 409 }
      );
    }

    const wasPaid = order.paid_at != null;

    const { error: updErr } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        cancelled_at: now,
        cancelled_reason: body.reason ?? null,
      })
      .eq("id", id);
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

    // Ako jos nije bilo placeno - oslobodi rezervaciju (vrati u lager).
    // Ako je vec bilo placeno - lager_items su DELETE-ovani, admin treba rucno.
    if (!wasPaid) {
      const { error: relErr, count } = await supabase
        .from("lager_items")
        .update({ reserved_order_id: null }, { count: "exact" })
        .eq("reserved_order_id", id);
      if (relErr) return NextResponse.json({ error: relErr.message }, { status: 500 });
      return NextResponse.json({ ok: true, lager_items_released: count ?? 0 });
    }

    return NextResponse.json({
      ok: true,
      requires_manual_restock: true,
      message:
        "Porudzbina je vec bila placena - lager_items su obrisani. Ako vracas robu, dodaj nove redove kroz /admin/zalihe.",
    });
  }

  return NextResponse.json({ error: `Nepoznata akcija: ${action}` }, { status: 400 });
}
