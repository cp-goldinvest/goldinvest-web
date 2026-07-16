import ExcelJS from "exceljs";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

// GET - Excel export trenutnog stanja lagera (sold_at IS NULL), snapshot "sada",
// bez obzira na datumski filter - cista evidencija, ne uvodi zivu cenovnu logiku.
export async function GET() {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("lager_items")
    .select(`
      purchased_at, register_type, purchase_price_rsd, supplier_name, serial_number,
      invoice_number, note,
      product_variants!inner(name, weight_g, products!inner(name, brand))
    `)
    .is("sold_at", null)
    .is("reserved_order_id", null)
    .order("purchased_at", { ascending: true });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "GoldInvest admin panel";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Na lageru");
  sheet.columns = [
    { header: "Brend", key: "brand", width: 18 },
    { header: "Proizvod", key: "product", width: 26 },
    { header: "Težina (g)", key: "weight_g", width: 10 },
    { header: "Kasa", key: "register_type", width: 8 },
    { header: "Nabavna cena", key: "purchase_price_rsd", width: 14 },
    { header: "Datum nabavke", key: "purchased_at", width: 14 },
    { header: "Dobavljač", key: "supplier_name", width: 24 },
    { header: "Serijski broj", key: "serial_number", width: 16 },
    { header: "Broj računa", key: "invoice_number", width: 14 },
    { header: "Napomena", key: "note", width: 30 },
  ];

  let totalValue = 0;
  for (const item of data ?? []) {
    const variant = item.product_variants as unknown as {
      name: string | null;
      weight_g: number;
      products: { name: string; brand: string };
    };
    totalValue += Number(item.purchase_price_rsd);
    sheet.addRow({
      brand: variant.products.brand,
      product: variant.name ?? variant.products.name,
      weight_g: variant.weight_g,
      register_type: item.register_type,
      purchase_price_rsd: Number(item.purchase_price_rsd),
      purchased_at: formatDate(item.purchased_at),
      supplier_name: item.supplier_name ?? "",
      serial_number: item.serial_number ?? "",
      invoice_number: item.invoice_number ?? "",
      note: item.note ?? "",
    });
  }

  sheet.getRow(1).font = { bold: true };
  const totalRow = sheet.addRow({ brand: "", product: "UKUPNO", purchase_price_rsd: totalValue });
  totalRow.font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `goldinvest-lager_${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
