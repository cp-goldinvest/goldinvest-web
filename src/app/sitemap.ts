import type { MetadataRoute } from "next";

const BASE_URL = "https://goldinvest.rs";

// Static routes with their change frequency and priority
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE_URL,                                                  lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
  { url: `${BASE_URL}/kategorija/zlatne-poluge`,                    lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
  { url: `${BASE_URL}/kategorija/zlatne-plocice`,                   lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
  { url: `${BASE_URL}/kategorija/zlatni-dukati`,                    lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
  { url: `${BASE_URL}/cena-zlata`,                                  lastModified: new Date(), changeFrequency: "hourly",  priority: 0.8 },
  { url: `${BASE_URL}/kako-kupiti`,                                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/otkup-zlata`,                                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/poklon-za-krstenje`,                          lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/pokloni/poklon-za-rodjenje-deteta`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/blog`,                                        lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
  { url: `${BASE_URL}/faq`,                                         lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/o-nama`,                                      lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/kontakt`,                                     lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/uslovi-koriscenja`,                           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  { url: `${BASE_URL}/politika-privatnosti`,                        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  { url: `${BASE_URL}/podesavanje-kolacica`,                        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  // Product slug pages — zlatne poluge
  { url: `${BASE_URL}/kategorija/zlatne-poluge/zlatna-poluga-1-unca`,  lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/kategorija/zlatne-poluge/zlatna-poluga-50g`,     lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/kategorija/zlatne-poluge/zlatna-poluga-100g`,    lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/kategorija/zlatne-poluge/zlatna-poluga-250g`,    lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
  { url: `${BASE_URL}/kategorija/zlatne-poluge/zlatna-poluga-500g`,    lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
  { url: `${BASE_URL}/kategorija/zlatne-poluge/zlatna-poluga-1kg`,     lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
  // Product slug pages — zlatne pločice
  { url: `${BASE_URL}/kategorija/zlatne-plocice/zlatna-plocica-1g`,   lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/kategorija/zlatne-plocice/zlatna-plocica-2g`,   lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/kategorija/zlatne-plocice/zlatna-plocica-5g`,   lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/kategorija/zlatne-plocice/zlatna-plocica-10g`,  lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
  { url: `${BASE_URL}/kategorija/zlatne-plocice/zlatna-plocica-20g`,  lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
  // Product slug pages — zlatni dukati
  { url: `${BASE_URL}/kategorija/zlatni-dukati/mali-dukat-franc-jozef`,    lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/kategorija/zlatni-dukati/veliki-dukat-franc-jozef`,  lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/kategorija/zlatni-dukati/filharmonija-1-10-oz`,      lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
  // Blog posts
  { url: `${BASE_URL}/blog/zasto-ulagati-u-zlato`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/blog/kako-odrediti-cenu-zlata`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/blog/zlatne-poluge-vs-novcanice`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/blog/inflacija-i-zlato`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/blog/lbma-sertifikacija-sta-znaci`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/blog/centralne-banke-kupuju-zlato`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/blog/kako-cuvati-fizicko-zlato`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/blog/kamatne-stope-i-cena-zlata`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES;
}
