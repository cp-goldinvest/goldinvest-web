import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { GOLDINVEST_SITE_ID } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("product_variants")
    .select("id, name, weight_g, purity, sku, products!inner(name, brand, category), pricing_rules(*)")
    .eq("is_active", true)
    .eq("pricing_rules.site_id", GOLDINVEST_SITE_ID)
    .order("weight_g");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
