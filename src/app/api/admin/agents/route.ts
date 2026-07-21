import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET - lista agenata. Podrazumevano samo aktivni; ?all=true vraca sve.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";

  const supabase = createServiceClient();
  let query = supabase.from("agents").select("*").order("full_name", { ascending: true });
  if (!all) query = query.eq("active", true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
