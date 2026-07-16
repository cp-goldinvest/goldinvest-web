import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET - lista kupaca, opciono pretraga ?q=ime ili telefon
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  const supabase = createServiceClient();
  let query = supabase.from("customers").select("*").order("full_name", { ascending: true });

  if (q) query = query.or(`full_name.ilike.%${q}%,phone.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST - novi kupac
export async function POST(request: Request) {
  const body = await request.json();
  const { full_name, phone, email, address, id_number, note } = body;

  if (!full_name) {
    return NextResponse.json({ error: "full_name je obavezan" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("customers")
    .insert({ full_name, phone: phone ?? null, email: email ?? null, address: address ?? null, id_number: id_number ?? null, note: note ?? null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
