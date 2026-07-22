import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET - lista dosad koriscenih dobavljaca (grupisano po supplier_name iz lager_items),
// sa poslednjim PIB/adresom i brojem nabavki. Ovo je istorija slobodnog teksta dobavljaca
// unetih pri dodavanju na lager (supplier_name), za razliku od /api/admin/customers koja
// vraca kupce/dobavljace povezane sa stvarnim redom u "customers" tabeli.
export async function GET() {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("lager_items")
    .select("supplier_name, supplier_tax_id, supplier_address, purchased_at")
    .not("supplier_name", "is", null)
    .order("purchased_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Ovi nazivi su placeholderi/pogresni unosi iz stare evidencije (nisu stvarni dobavljaci
  // zlata) - iskljuceni su samo iz predloga, postojeci lager_items redovi ostaju netaknuti.
  const EXCLUDED_SUPPLIER_NAMES = new Set(["nema imena", "top pos servis d.o.o."]);

  const byName = new Map<
    string,
    { name: string; tax_id: string | null; address: string | null; count: number; last_purchased_at: string }
  >();

  for (const row of data ?? []) {
    const name = (row.supplier_name ?? "").trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (EXCLUDED_SUPPLIER_NAMES.has(key)) continue;
    const existing = byName.get(key);
    if (existing) {
      existing.count += 1;
      // podaci su sortirani opadajuce po datumu, pa je prvi susret najnoviji
    } else {
      byName.set(key, {
        name,
        tax_id: row.supplier_tax_id,
        address: row.supplier_address,
        count: 1,
        last_purchased_at: row.purchased_at,
      });
    }
  }

  const suppliers = Array.from(byName.values()).sort(
    (a, b) => b.last_purchased_at.localeCompare(a.last_purchased_at)
  );

  return NextResponse.json(suppliers);
}
