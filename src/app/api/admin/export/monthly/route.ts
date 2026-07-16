import ExcelJS from "exceljs";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Bucket = { revenue: number; cogs: number; expenses: number };

function emptyBucket(): Bucket {
  return { revenue: 0, cogs: 0, expenses: 0 };
}

function monthKey(dateStr: string) {
  return dateStr.slice(0, 7); // YYYY-MM
}

// GET - mesecni pregled (Prihod/Nabavka robe/Bruto profit/Troskovi/Neto profit),
// razdvojeno po kasi, po mesecima. Podrazumevano cela istorija (od 2000),
// ?from= i ?to= opciono suzavaju period.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ?? "2000-01-01";
  const to = searchParams.get("to") ?? new Date().toISOString().slice(0, 10);

  const supabase = createServiceClient();

  const [salesRes, expensesRes] = await Promise.all([
    supabase
      .from("sales")
      .select("register_type, total_rsd, sold_at, sale_items(purchase_price_snapshot_rsd)")
      .gte("sold_at", from)
      .lte("sold_at", to),
    supabase
      .from("expenses")
      .select("register_type, amount_rsd, expense_date")
      .gte("expense_date", from)
      .lte("expense_date", to),
  ]);
  if (salesRes.error) return Response.json({ error: salesRes.error.message }, { status: 500 });
  if (expensesRes.error) return Response.json({ error: expensesRes.error.message }, { status: 500 });

  // month -> { bela: Bucket, crna: Bucket }
  const months = new Map<string, { bela: Bucket; crna: Bucket }>();
  function getMonth(m: string) {
    if (!months.has(m)) months.set(m, { bela: emptyBucket(), crna: emptyBucket() });
    return months.get(m)!;
  }

  for (const sale of salesRes.data ?? []) {
    const m = getMonth(monthKey(sale.sold_at));
    const bucket = m[sale.register_type as "bela" | "crna"];
    bucket.revenue += Number(sale.total_rsd);
    const items = (sale.sale_items ?? []) as { purchase_price_snapshot_rsd: number | null }[];
    for (const item of items) bucket.cogs += Number(item.purchase_price_snapshot_rsd ?? 0);
  }
  for (const expense of expensesRes.data ?? []) {
    const m = getMonth(monthKey(expense.expense_date));
    const bucket = m[expense.register_type as "bela" | "crna"];
    bucket.expenses += Number(expense.amount_rsd);
  }

  const sortedMonths = [...months.keys()].sort();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "GoldInvest admin panel";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Mesecni pregled");
  sheet.columns = [
    { header: "Mesec", key: "month", width: 10 },
    { header: "Kasa", key: "kasa", width: 8 },
    { header: "Prihod", key: "revenue", width: 14 },
    { header: "Nabavna vrednost", key: "cogs", width: 16 },
    { header: "Bruto profit", key: "gross", width: 14 },
    { header: "Troškovi", key: "expenses", width: 14 },
    { header: "Neto profit", key: "net", width: 14 },
  ];

  for (const month of sortedMonths) {
    const { bela, crna } = months.get(month)!;
    const rows: { kasa: string; b: Bucket }[] = [
      { kasa: "bela", b: bela },
      { kasa: "crna", b: crna },
      { kasa: "UKUPNO", b: { revenue: bela.revenue + crna.revenue, cogs: bela.cogs + crna.cogs, expenses: bela.expenses + crna.expenses } },
    ];
    for (const { kasa, b } of rows) {
      const gross = b.revenue - b.cogs;
      const row = sheet.addRow({
        month,
        kasa,
        revenue: b.revenue,
        cogs: b.cogs,
        gross,
        expenses: b.expenses,
        net: gross - b.expenses,
      });
      if (kasa === "UKUPNO") row.font = { bold: true };
    }
  }

  sheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `goldinvest-mesecni-pregled.xlsx`;

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
