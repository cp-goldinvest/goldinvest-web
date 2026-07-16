import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET - lista troskova, filteri: ?register_type=bela|crna&from=YYYY-MM-DD&to=YYYY-MM-DD
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const registerType = searchParams.get("register_type");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const supabase = createServiceClient();
  let query = supabase.from("expenses").select("*").order("expense_date", { ascending: false });

  if (registerType) query = query.eq("register_type", registerType);
  if (from) query = query.gte("expense_date", from);
  if (to) query = query.lte("expense_date", to);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST - novi trosak
export async function POST(request: Request) {
  const body = await request.json();
  const { expense_date, category, register_type, amount_rsd, description } = body;

  if (!category || !register_type || !amount_rsd) {
    return NextResponse.json({ error: "category, register_type i amount_rsd su obavezni" }, { status: 400 });
  }
  if (!["bela", "crna"].includes(register_type)) {
    return NextResponse.json({ error: "register_type mora biti 'bela' ili 'crna'" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("expenses")
    .insert({
      expense_date: expense_date ?? new Date().toISOString().slice(0, 10),
      category,
      register_type,
      amount_rsd,
      description: description ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
