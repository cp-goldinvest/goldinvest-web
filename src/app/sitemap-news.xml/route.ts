import { BLOG_POSTS } from "@/data/blog-posts";
import { client } from "@/sanity/lib/client";

const BASE_URL = "https://goldinvest.rs";
const TODAY = new Date().toISOString().split("T")[0];

type SanitySlugEntry = { slug: string; publishedAt?: string };

export async function GET() {
  const sanityPosts = await client.fetch<SanitySlugEntry[]>(
    `*[_type == "post"] | order(publishedAt desc) { "slug": slug.current, publishedAt }`,
    {},
    { next: { revalidate: 3600 } }
  );

  const staticSlugs = new Set(BLOG_POSTS.map((p) => p.slug));

  const staticUrls = BLOG_POSTS.map(
    (post) => `  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  );

  const sanityUrls = sanityPosts
    .filter((p) => p.slug && !staticSlugs.has(p.slug))
    .map((post) => {
      const lastmod = post.publishedAt
        ? post.publishedAt.split("T")[0]
        : TODAY;
      return `  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...sanityUrls].join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
