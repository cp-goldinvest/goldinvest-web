const BASE_URL = "https://goldinvest.rs";
const TODAY = new Date().toISOString().split("T")[0];

const CATEGORIES = [
  { url: `${BASE_URL}/kategorija`,                    changeFrequency: "daily", priority: "0.8" },
  { url: `${BASE_URL}/kategorija/zlatne-poluge`,      changeFrequency: "daily", priority: "0.9" },
  { url: `${BASE_URL}/kategorija/zlatne-plocice`,     changeFrequency: "daily", priority: "0.9" },
  { url: `${BASE_URL}/kategorija/zlatni-dukati`,      changeFrequency: "daily", priority: "0.9" },

  { url: `${BASE_URL}/kategorija/zlatne-poluge/zlatna-poluga-1-unca`, changeFrequency: "daily", priority: "0.8" },
  { url: `${BASE_URL}/kategorija/zlatne-poluge/zlatna-poluga-50g`,    changeFrequency: "daily", priority: "0.8" },
  { url: `${BASE_URL}/kategorija/zlatne-poluge/zlatna-poluga-100g`,   changeFrequency: "daily", priority: "0.8" },
  { url: `${BASE_URL}/kategorija/zlatne-poluge/zlatna-poluga-250g`,   changeFrequency: "daily", priority: "0.8" },
  { url: `${BASE_URL}/kategorija/zlatne-poluge/zlatna-poluga-500g`,   changeFrequency: "daily", priority: "0.8" },
  { url: `${BASE_URL}/kategorija/zlatne-poluge/zlatna-poluga-1kg`,    changeFrequency: "daily", priority: "0.8" },

  { url: `${BASE_URL}/kategorija/zlatne-plocice/zlatna-plocica-1g`,   changeFrequency: "daily", priority: "0.8" },
  { url: `${BASE_URL}/kategorija/zlatne-plocice/zlatna-plocica-2g`,   changeFrequency: "daily", priority: "0.8" },
  { url: `${BASE_URL}/kategorija/zlatne-plocice/zlatna-plocica-5g`,   changeFrequency: "daily", priority: "0.8" },
  { url: `${BASE_URL}/kategorija/zlatne-plocice/zlatna-plocica-10g`,  changeFrequency: "daily", priority: "0.8" },
  { url: `${BASE_URL}/kategorija/zlatne-plocice/zlatna-plocica-20g`,  changeFrequency: "daily", priority: "0.8" },

  { url: `${BASE_URL}/kategorija/zlatni-dukati/franc-jozef-dukat`,        changeFrequency: "daily", priority: "0.8" },
  { url: `${BASE_URL}/kategorija/zlatni-dukati/becka-filharmonija-dukat`, changeFrequency: "daily", priority: "0.8" },
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
