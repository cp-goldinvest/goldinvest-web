import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { GOLDINVEST_SITE_ID, ZLATNEPLOCICE_SITE_ID } from "@/lib/site";

export const dynamic = "force-dynamic";

function parseSiteId(value: string | null): number {
  const n = Number(value);
  if (n === GOLDINVEST_SITE_ID || n === ZLATNEPLOCICE_SITE_ID) return n;
  return GOLDINVEST_SITE_ID;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const siteId = parseSiteId(url.searchParams.get("site_id"));
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("product_variants")
    .select("id, name, weight_g, purity, sku, products!inner(name, brand, category), pricing_rules(*)")
    .eq("is_active", true)
    .eq("pricing_rules.site_id", siteId)
    .order("weight_g");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
