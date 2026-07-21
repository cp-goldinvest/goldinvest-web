import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET - tekuce stanje sve 4 kase (bela_kasa, crna_kasa, beli_lager, crni_lager).
// Za beli_lager/crni_lager dodaje computed_balance_rsd - uzivo izracunat zbir
// nabavne vrednosti neprodatih stavki iz lager_items (izvor istine za zalihe).
// Poredjenje sa current_balance_rsd (ledger) otkriva da li je nesto promaklo.
export async function GET() {
  const supabase = createServiceClient();
  const [registersRes, lagerRes] = await Promise.all([
    supabase.from("cash_registers").select("*").order("code", { ascending: true }),
    supabase.from("lager_items").select("register_type, purchase_price_rsd").is("sold_at", null),
  ]);

  if (registersRes.error) return NextResponse.json({ error: registersRes.error.message }, { status: 500 });
  if (lagerRes.error) return NextResponse.json({ error: lagerRes.error.message }, { status: 500 });

  const sums: Record<"bela" | "crna", number> = { bela: 0, crna: 0 };
  for (const item of lagerRes.data ?? []) {
    const key = item.register_type as "bela" | "crna";
    sums[key] += Number(item.purchase_price_rsd);
  }

  const data = (registersRes.data ?? []).map((r) => ({
    ...r,
    computed_balance_rsd: r.code === "beli_lager" ? sums.bela : r.code === "crni_lager" ? sums.crna : null,
  }));

  return NextResponse.json(data);
}
