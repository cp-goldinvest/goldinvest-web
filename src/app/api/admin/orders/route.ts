import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET - lista porudzbina sa stavkama i sajt info
// Opciono filter: ?site_id=2 (ZP), ?status=pending_payment
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siteIdParam = searchParams.get("site_id");
  const statusParam = searchParams.get("status");

  const supabase = createServiceClient();

  let query = supabase
    .from("orders")
    .select(`
      *,
      sites:site_id(id, key, name),
      order_items(
        id,
        variant_id,
        lager_item_id,
        product_name_snapshot,
        variant_name_snapshot,
        weight_g_snapshot,
        category_snapshot,
        quantity,
        unit_price_rsd,
        line_total_rsd,
        purchase_price_snapshot_rsd
      )
    `)
    .order("created_at", { ascending: false });

  if (siteIdParam) {
    const siteId = Number.parseInt(siteIdParam, 10);
    if (!Number.isNaN(siteId)) query = query.eq("site_id", siteId);
  }
  if (statusParam) query = query.eq("status", statusParam);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
