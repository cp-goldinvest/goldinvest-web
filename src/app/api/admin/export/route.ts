import ExcelJS from "exceljs";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

// GET - Excel export. ?from=YYYY-MM-DD&to=YYYY-MM-DD&register_type=bela|crna (opciono)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const now = new Date();
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  const from = searchParams.get("from") ?? defaultFrom;
  const to = searchParams.get("to") ?? defaultTo;
  const registerType = searchParams.get("register_type");

  const supabase = createServiceClient();

  let salesQuery = supabase
    .from("sales")
    .select("sale_number, sold_at, register_type, payment_method, total_rsd, note, invoice_number, customers:customer_id(full_name, phone), sale_items(product_name_snapshot, variant_name_snapshot, weight_g_snapshot, unit_price_rsd, purchase_price_snapshot_rsd, serial_number_snapshot)")
    .gte("sold_at", from)
    .lte("sold_at", to)
    .order("sold_at", { ascending: false });
  if (registerType) salesQuery = salesQuery.eq("register_type", registerType);

  let lagerQuery = supabase
    .from("lager_items")
    .select("purchased_at, register_type, purchase_price_rsd, supplier_name, note, serial_number, invoice_number, product_variants!inner(name, weight_g, products!inner(name, brand))")
    .gte("purchased_at", from)
    .lte("purchased_at", to)
    .order("purchased_at", { ascending: false });
  if (registerType) lagerQuery = lagerQuery.eq("register_type", registerType);

  let expensesQuery = supabase
    .from("expenses")
    .select("expense_date, category, register_type, amount_rsd, description")
    .gte("expense_date", from)
    .lte("expense_date", to)
    .order("expense_date", { ascending: false });
  if (registerType) expensesQuery = expensesQuery.eq("register_type", registerType);

  const [salesRes, lagerRes, expensesRes] = await Promise.all([salesQuery, lagerQuery, expensesQuery]);

  if (salesRes.error) return Response.json({ error: salesRes.error.message }, { status: 500 });
  if (lagerRes.error) return Response.json({ error: lagerRes.error.message }, { status: 500 });
  if (expensesRes.error) return Response.json({ error: expensesRes.error.message }, { status: 500 });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "GoldInvest admin panel";
  workbook.created = new Date();

  // ── Prodaja ──────────────────────────────────────────────
  const salesSheet = workbook.addWorksheet("Prodaja");
  salesSheet.columns = [
    { header: "Broj", key: "sale_number", width: 10 },
    { header: "Broj racuna", key: "invoice_number", width: 14 },
    { header: "Datum", key: "sold_at", width: 12 },
    { header: "Kasa", key: "register_type", width: 8 },
    { header: "Kupac", key: "customer", width: 24 },
    { header: "Telefon", key: "phone", width: 16 },
    { header: "Proizvod", key: "product", width: 30 },
    { header: "Tezina (g)", key: "weight_g", width: 10 },
    { header: "Serijski broj", key: "serial_number", width: 16 },
    { header: "Prodajna cena", key: "unit_price_rsd", width: 14 },
    { header: "Nabavna cena", key: "purchase_price_rsd", width: 14 },
    { header: "Profit", key: "profit_rsd", width: 12 },
    { header: "Nacin placanja", key: "payment_method", width: 14 },
    { header: "Napomena", key: "note", width: 24 },
  ];
  for (const sale of salesRes.data ?? []) {
    const items = (sale.sale_items ?? []) as {
      product_name_snapshot: string;
      variant_name_snapshot: string | null;
      weight_g_snapshot: number;
      unit_price_rsd: number;
      purchase_price_snapshot_rsd: number | null;
      serial_number_snapshot: string | null;
    }[];
    const customer = sale.customers as unknown as { full_name: string; phone: string | null } | null;
    for (const item of items) {
      salesSheet.addRow({
        sale_number: sale.sale_number,
        invoice_number: sale.invoice_number ?? "",
        sold_at: formatDate(sale.sold_at),
        register_type: sale.register_type,
        customer: customer?.full_name ?? "",
        phone: customer?.phone ?? "",
        product: [item.product_name_snapshot, item.variant_name_snapshot].filter(Boolean).join(" - "),
        weight_g: item.weight_g_snapshot,
        serial_number: item.serial_number_snapshot ?? "",
        unit_price_rsd: Number(item.unit_price_rsd),
        purchase_price_rsd: Number(item.purchase_price_snapshot_rsd ?? 0),
        profit_rsd: Number(item.unit_price_rsd) - Number(item.purchase_price_snapshot_rsd ?? 0),
        payment_method: sale.payment_method,
        note: sale.note ?? "",
      });
    }
  }

  // ── Nabavka ──────────────────────────────────────────────
  const lagerSheet = workbook.addWorksheet("Nabavka");
  lagerSheet.columns = [
    { header: "Datum", key: "purchased_at", width: 12 },
    { header: "Broj racuna", key: "invoice_number", width: 14 },
    { header: "Kasa", key: "register_type", width: 8 },
    { header: "Proizvod", key: "product", width: 30 },
    { header: "Tezina (g)", key: "weight_g", width: 10 },
    { header: "Serijski broj", key: "serial_number", width: 16 },
    { header: "Nabavna cena", key: "purchase_price_rsd", width: 14 },
    { header: "Dobavljac / od koga", key: "supplier_name", width: 24 },
    { header: "Napomena", key: "note", width: 24 },
  ];
  for (const item of lagerRes.data ?? []) {
    const variant = item.product_variants as unknown as {
      name: string | null;
      weight_g: number;
      products: { name: string; brand: string };
    };
    lagerSheet.addRow({
      purchased_at: formatDate(item.purchased_at),
      invoice_number: item.invoice_number ?? "",
      register_type: item.register_type,
      product: [variant.products.brand, variant.name ?? variant.products.name].filter(Boolean).join(" - "),
      weight_g: variant.weight_g,
      serial_number: item.serial_number ?? "",
      purchase_price_rsd: Number(item.purchase_price_rsd),
      supplier_name: item.supplier_name ?? "",
      note: item.note ?? "",
    });
  }

  // ── Troskovi ─────────────────────────────────────────────
  const expensesSheet = workbook.addWorksheet("Troskovi");
  expensesSheet.columns = [
    { header: "Datum", key: "expense_date", width: 12 },
    { header: "Kasa", key: "register_type", width: 8 },
    { header: "Kategorija", key: "category", width: 18 },
    { header: "Iznos", key: "amount_rsd", width: 14 },
    { header: "Opis", key: "description", width: 30 },
  ];
  for (const expense of expensesRes.data ?? []) {
    expensesSheet.addRow({
      expense_date: formatDate(expense.expense_date),
      register_type: expense.register_type,
      category: expense.category,
      amount_rsd: Number(expense.amount_rsd),
      description: expense.description ?? "",
    });
  }

  for (const sheet of [salesSheet, lagerSheet, expensesSheet]) {
    sheet.getRow(1).font = { bold: true };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `goldinvest-finansije_${from}_${to}.xlsx`;

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
