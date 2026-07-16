import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET - lista kupaca sa agregatima (broj kupovina, ukupno potroseno, poslednja kupovina),
// opciono pretraga ?q=ime ili telefon
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  const supabase = createServiceClient();
  let query = supabase.from("customers").select("*").order("full_name", { ascending: true });

  if (q) query = query.or(`full_name.ilike.%${q}%,phone.ilike.%${q}%`);

  const [customersRes, salesRes] = await Promise.all([
    query,
    supabase.from("sales").select("customer_id, total_rsd, sold_at"),
  ]);

  if (customersRes.error) return NextResponse.json({ error: customersRes.error.message }, { status: 500 });
  if (salesRes.error) return NextResponse.json({ error: salesRes.error.message }, { status: 500 });

  const stats = new Map<string, { count: number; total: number; last: string | null }>();
  for (const sale of salesRes.data ?? []) {
    if (!sale.customer_id) continue;
    const s = stats.get(sale.customer_id) ?? { count: 0, total: 0, last: null };
    s.count += 1;
    s.total += Number(sale.total_rsd);
    if (!s.last || sale.sold_at > s.last) s.last = sale.sold_at;
    stats.set(sale.customer_id, s);
  }

  const withStats = (customersRes.data ?? []).map((c) => {
    const s = stats.get(c.id);
    return {
      ...c,
      purchase_count: s?.count ?? 0,
      total_spent_rsd: s?.total ?? 0,
      last_purchase_at: s?.last ?? null,
    };
  });

  return NextResponse.json(withStats);
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
