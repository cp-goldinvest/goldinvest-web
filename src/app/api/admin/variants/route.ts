import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("product_variants")
    .select("id, name, slug, weight_g, purity, sku, products!inner(name, brand, category)")
    .eq("is_active", true)
    .order("weight_g");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
