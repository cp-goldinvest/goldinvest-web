const BASE_URL = "https://goldinvest.rs";
const TODAY = new Date().toISOString().split("T")[0];

const CATEGORIES = [
  { url: `${BASE_URL}/kategorija`,                    changeFrequency: "daily", priority: "0.8" },
  { url: `${BASE_URL}/kategorija/zlatne-poluge`,      changeFrequency: "daily", priority: "0.9" },
  { url: `${BASE_URL}/kategorija/zlatne-plocice`,     changeFrequency: "daily", priority: "0.9" },
  { url: `${BASE_URL}/kategorija/zlatni-dukati`,      changeFrequency: "daily", priority: "0.9" },
];

export function GET() {
  const urls = CATEGORIES.map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changeFrequency}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
