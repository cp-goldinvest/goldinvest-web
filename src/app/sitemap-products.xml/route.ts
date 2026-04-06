import { createServiceClient } from "@/lib/supabase/server";

const BASE_URL = "https://goldinvest.rs";
const TODAY = new Date().toISOString().split("T")[0];

export async function GET() {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("product_variants")
    .select("slug")
    .eq("is_active", true)
    .order("slug");

  const slugs = (data ?? []).map((row) => row.slug).filter(Boolean);

  const urls = slugs
    .map(
      (slug) => `  <url>
    <loc>${BASE_URL}/proizvodi/${slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
