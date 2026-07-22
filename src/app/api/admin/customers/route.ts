import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET - lista kupaca sa agregatima (broj kupovina, ukupno potroseno, poslednja kupovina,
// broj nabavki kao dobavljac), opciono pretraga ?q=ime ili telefon.
// ?context=supplier|customer grupise rezultate: prvo oni sa istorijom u trazenoj ulozi,
// pa oni sa istorijom u suprotnoj ulozi, pa ostali - bez ogranicenja broja rezultata
// (osim ako je eksplicitno prosledjen ?limit).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const context = searchParams.get("context"); // "supplier" | "customer" | null
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : null;

  const supabase = createServiceClient();
  let query = supabase.from("customers").select("*").order("full_name", { ascending: true });

  if (q) query = query.or(`full_name.ilike.%${q}%,phone.ilike.%${q}%`);

  const [customersRes, salesRes, lagerRes] = await Promise.all([
    query,
    supabase.from("sales").select("customer_id, total_rsd, sold_at"),
    supabase.from("lager_items").select("supplier_customer_id, purchased_at"),
  ]);

  if (customersRes.error) return NextResponse.json({ error: customersRes.error.message }, { status: 500 });
  if (salesRes.error) return NextResponse.json({ error: salesRes.error.message }, { status: 500 });
  if (lagerRes.error) return NextResponse.json({ error: lagerRes.error.message }, { status: 500 });

  const purchaseStats = new Map<string, { count: number; total: number; last: string | null }>();
  for (const sale of salesRes.data ?? []) {
    if (!sale.customer_id) continue;
    const s = purchaseStats.get(sale.customer_id) ?? { count: 0, total: 0, last: null };
    s.count += 1;
    s.total += Number(sale.total_rsd);
    if (!s.last || sale.sold_at > s.last) s.last = sale.sold_at;
    purchaseStats.set(sale.customer_id, s);
  }

  const supplyStats = new Map<string, { count: number; last: string | null }>();
  for (const item of lagerRes.data ?? []) {
    if (!item.supplier_customer_id) continue;
    const s = supplyStats.get(item.supplier_customer_id) ?? { count: 0, last: null };
    s.count += 1;
    if (!s.last || item.purchased_at > s.last) s.last = item.purchased_at;
    supplyStats.set(item.supplier_customer_id, s);
  }

  let withStats = (customersRes.data ?? []).map((c) => {
    const s = purchaseStats.get(c.id);
    const sup = supplyStats.get(c.id);
    return {
      ...c,
      purchase_count: s?.count ?? 0,
      total_spent_rsd: s?.total ?? 0,
      last_purchase_at: s?.last ?? null,
      supply_count: sup?.count ?? 0,
      last_supply_at: sup?.last ?? null,
    };
  });

  // Grupisano: prvo entiteti sa istorijom u trazenoj ulozi, pa u suprotnoj, pa ostali -
  // tako se dobavljaci/kupci ne gube izmedju kontakata bez ikakve istorije.
  if (context === "supplier" || context === "customer") {
    const primaryKey = context === "supplier" ? "supply_count" : "purchase_count";
    const secondaryKey = context === "supplier" ? "purchase_count" : "supply_count";
    const rank = (c: (typeof withStats)[number]) =>
      c[primaryKey] > 0 ? 0 : c[secondaryKey] > 0 ? 1 : 2;

    withStats.sort((a, b) => {
      const ra = rank(a);
      const rb = rank(b);
      if (ra !== rb) return ra - rb;
      const key = ra === 0 ? primaryKey : ra === 1 ? secondaryKey : null;
      if (key && b[key] !== a[key]) return b[key] - a[key];
      return a.full_name.localeCompare(b.full_name);
    });
  }

  if (limit) withStats = withStats.slice(0, limit);

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
