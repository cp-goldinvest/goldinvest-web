import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type RegisterBucket = {
  revenue_rsd: number;
  cogs_rsd: number;
  gross_profit_rsd: number;
  expenses_rsd: number;
  net_profit_rsd: number;
  purchased_rsd: number;
  sales_count: number;
};

function emptyBucket(): RegisterBucket {
  return {
    revenue_rsd: 0,
    cogs_rsd: 0,
    gross_profit_rsd: 0,
    expenses_rsd: 0,
    net_profit_rsd: 0,
    purchased_rsd: 0,
    sales_count: 0,
  };
}

// GET - finansijski rezime za period, razdvojen po kasi (bela/crna).
// ?from=YYYY-MM-DD&to=YYYY-MM-DD (podrazumevano - tekuci mesec)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const now = new Date();
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  const from = searchParams.get("from") ?? defaultFrom;
  const to = searchParams.get("to") ?? defaultTo;

  const supabase = createServiceClient();

  const [salesRes, expensesRes, purchasesRes] = await Promise.all([
    supabase
      .from("sales")
      .select("register_type, total_rsd, sale_items(purchase_price_snapshot_rsd)")
      .gte("sold_at", from)
      .lte("sold_at", to),
    supabase
      .from("expenses")
      .select("register_type, amount_rsd")
      .gte("expense_date", from)
      .lte("expense_date", to),
    supabase
      .from("lager_items")
      .select("register_type, purchase_price_rsd")
      .gte("purchased_at", from)
      .lte("purchased_at", to),
  ]);

  if (salesRes.error) return NextResponse.json({ error: salesRes.error.message }, { status: 500 });
  if (expensesRes.error) return NextResponse.json({ error: expensesRes.error.message }, { status: 500 });
  if (purchasesRes.error) return NextResponse.json({ error: purchasesRes.error.message }, { status: 500 });

  const buckets: Record<"bela" | "crna", RegisterBucket> = { bela: emptyBucket(), crna: emptyBucket() };

  for (const sale of salesRes.data ?? []) {
    const bucket = buckets[sale.register_type as "bela" | "crna"];
    if (!bucket) continue;
    bucket.revenue_rsd += Number(sale.total_rsd);
    bucket.sales_count += 1;
    const items = (sale.sale_items ?? []) as { purchase_price_snapshot_rsd: number | null }[];
    for (const item of items) bucket.cogs_rsd += Number(item.purchase_price_snapshot_rsd ?? 0);
  }

  for (const expense of expensesRes.data ?? []) {
    const bucket = buckets[expense.register_type as "bela" | "crna"];
    if (!bucket) continue;
    bucket.expenses_rsd += Number(expense.amount_rsd);
  }

  for (const purchase of purchasesRes.data ?? []) {
    const bucket = buckets[purchase.register_type as "bela" | "crna"];
    if (!bucket) continue;
    bucket.purchased_rsd += Number(purchase.purchase_price_rsd);
  }

  for (const key of ["bela", "crna"] as const) {
    const b = buckets[key];
    b.gross_profit_rsd = b.revenue_rsd - b.cogs_rsd;
    b.net_profit_rsd = b.gross_profit_rsd - b.expenses_rsd;
  }

  const total: RegisterBucket = emptyBucket();
  for (const key of ["bela", "crna"] as const) {
    const b = buckets[key];
    total.revenue_rsd += b.revenue_rsd;
    total.cogs_rsd += b.cogs_rsd;
    total.gross_profit_rsd += b.gross_profit_rsd;
    total.expenses_rsd += b.expenses_rsd;
    total.net_profit_rsd += b.net_profit_rsd;
    total.purchased_rsd += b.purchased_rsd;
    total.sales_count += b.sales_count;
  }

  return NextResponse.json({ from, to, bela: buckets.bela, crna: buckets.crna, total });
}
