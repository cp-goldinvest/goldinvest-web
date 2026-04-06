const BASE_URL = "https://goldinvest.rs";
const TODAY = new Date().toISOString().split("T")[0];

const PAGES = [
  { url: `${BASE_URL}`,                           changeFrequency: "daily",   priority: "1.0" },
  { url: `${BASE_URL}/cena-zlata`,                changeFrequency: "hourly",  priority: "0.9" },
  { url: `${BASE_URL}/kako-kupiti`,               changeFrequency: "monthly", priority: "0.8" },
  { url: `${BASE_URL}/otkup-zlata`,               changeFrequency: "monthly", priority: "0.8" },
  { url: `${BASE_URL}/poklon-za-krstenje`,        changeFrequency: "monthly", priority: "0.7" },
  { url: `${BASE_URL}/poklon-za-rodjenje-deteta`, changeFrequency: "monthly", priority: "0.7" },
  { url: `${BASE_URL}/blog`,                      changeFrequency: "weekly",  priority: "0.7" },
  { url: `${BASE_URL}/cesta-pitanja`,             changeFrequency: "monthly", priority: "0.7" },
  { url: `${BASE_URL}/o-nama`,                    changeFrequency: "monthly", priority: "0.6" },
  { url: `${BASE_URL}/kontakt`,                   changeFrequency: "monthly", priority: "0.6" },
  { url: `${BASE_URL}/uslovi-koriscenja`,         changeFrequency: "yearly",  priority: "0.3" },
  { url: `${BASE_URL}/politika-privatnosti`,      changeFrequency: "yearly",  priority: "0.3" },
  { url: `${BASE_URL}/podesavanje-kolacica`,      changeFrequency: "yearly",  priority: "0.3" },
];

export function GET() {
  const urls = PAGES.map(
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
