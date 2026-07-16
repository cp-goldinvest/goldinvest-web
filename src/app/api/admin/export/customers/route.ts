import ExcelJS from "exceljs";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

// GET - Excel export kupaca (CRM).
// Bez parametara: lista svih kupaca sa agregatima, sortirano po potrosnji.
// Sa ?customer_id=: 1 kupac + puna istorija njegovih kupovina.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get("customer_id");

  const supabase = createServiceClient();
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "GoldInvest admin panel";
  workbook.created = new Date();

  if (customerId) {
    const [customerRes, salesRes] = await Promise.all([
      supabase.from("customers").select("*").eq("id", customerId).single(),
      supabase
        .from("sales")
        .select("sale_number, sold_at, register_type, payment_method, invoice_number, total_rsd, sale_items(product_name_snapshot, variant_name_snapshot, weight_g_snapshot, unit_price_rsd)")
        .eq("customer_id", customerId)
        .order("sold_at", { ascending: false }),
    ]);
    if (customerRes.error) return Response.json({ error: customerRes.error.message }, { status: 500 });
    if (salesRes.error) return Response.json({ error: salesRes.error.message }, { status: 500 });

    const customer = customerRes.data;

    const infoSheet = workbook.addWorksheet("Kupac");
    infoSheet.columns = [
      { header: "Polje", key: "field", width: 20 },
      { header: "Vrednost", key: "value", width: 40 },
    ];
    infoSheet.addRows([
      { field: "Ime i prezime", value: customer.full_name },
      { field: "Telefon", value: customer.phone ?? "" },
      { field: "Email", value: customer.email ?? "" },
      { field: "Adresa", value: customer.address ?? "" },
      { field: "Lična karta / PIB", value: customer.id_number ?? "" },
      { field: "Napomena", value: customer.note ?? "" },
    ]);
    infoSheet.getColumn(1).font = { bold: true };

    const historySheet = workbook.addWorksheet("Istorija kupovina");
    historySheet.columns = [
      { header: "Broj", key: "sale_number", width: 10 },
      { header: "Broj računa", key: "invoice_number", width: 14 },
      { header: "Datum", key: "sold_at", width: 12 },
      { header: "Kasa", key: "register_type", width: 8 },
      { header: "Proizvod", key: "product", width: 30 },
      { header: "Cena", key: "unit_price_rsd", width: 14 },
      { header: "Način plaćanja", key: "payment_method", width: 14 },
    ];
    for (const sale of salesRes.data ?? []) {
      const items = (sale.sale_items ?? []) as {
        product_name_snapshot: string;
        variant_name_snapshot: string | null;
        unit_price_rsd: number;
      }[];
      for (const item of items) {
        historySheet.addRow({
          sale_number: sale.sale_number,
          invoice_number: sale.invoice_number ?? "",
          sold_at: formatDate(sale.sold_at),
          register_type: sale.register_type,
          product: [item.product_name_snapshot, item.variant_name_snapshot].filter(Boolean).join(" - "),
          unit_price_rsd: Number(item.unit_price_rsd),
          payment_method: sale.payment_method,
        });
      }
    }
    historySheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    const filename = `kupac_${customer.full_name.replace(/\s+/g, "_")}.xlsx`;
    return new Response(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  // ── Lista svih kupaca ──────────────────────────────────────────────────
  const [customersRes, salesRes] = await Promise.all([
    supabase.from("customers").select("*"),
    supabase.from("sales").select("customer_id, total_rsd, sold_at"),
  ]);
  if (customersRes.error) return Response.json({ error: customersRes.error.message }, { status: 500 });
  if (salesRes.error) return Response.json({ error: salesRes.error.message }, { status: 500 });

  const stats = new Map<string, { count: number; total: number; last: string | null }>();
  for (const sale of salesRes.data ?? []) {
    if (!sale.customer_id) continue;
    const s = stats.get(sale.customer_id) ?? { count: 0, total: 0, last: null };
    s.count += 1;
    s.total += Number(sale.total_rsd);
    if (!s.last || sale.sold_at > s.last) s.last = sale.sold_at;
    stats.set(sale.customer_id, s);
  }

  const rows = (customersRes.data ?? [])
    .map((c) => ({ ...c, stats: stats.get(c.id) ?? { count: 0, total: 0, last: null } }))
    .sort((a, b) => b.stats.total - a.stats.total);

  const sheet = workbook.addWorksheet("Kupci");
  sheet.columns = [
    { header: "Ime i prezime", key: "full_name", width: 24 },
    { header: "Telefon", key: "phone", width: 16 },
    { header: "Email", key: "email", width: 24 },
    { header: "Adresa", key: "address", width: 28 },
    { header: "Lična karta / PIB", key: "id_number", width: 16 },
    { header: "Broj kupovina", key: "purchase_count", width: 12 },
    { header: "Ukupno potrošeno", key: "total_spent_rsd", width: 16 },
    { header: "Poslednja kupovina", key: "last_purchase_at", width: 14 },
    { header: "Napomena", key: "note", width: 24 },
  ];
  for (const c of rows) {
    sheet.addRow({
      full_name: c.full_name,
      phone: c.phone ?? "",
      email: c.email ?? "",
      address: c.address ?? "",
      id_number: c.id_number ?? "",
      purchase_count: c.stats.count,
      total_spent_rsd: c.stats.total,
      last_purchase_at: formatDate(c.stats.last),
      note: c.note ?? "",
    });
  }
  sheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="goldinvest-kupci.xlsx"`,
    },
  });
}
