import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_SINGLE_POSTS } from "@/data/blog-single-posts";
import { BLOG_POSTS } from "@/data/blog-posts";
import { SingleBlogPostTemplate } from "@/components/blog/SingleBlogPostTemplate";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema } from "@/lib/schema";

type Props = {
  params:
    | {
        slug?: string;
      }
    | Promise<{
        slug?: string;
      }>;
};

function safeSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const s = value.trim();
  return s ? s : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = safeSlug(resolvedParams?.slug);
  const entry = slug ? BLOG_SINGLE_POSTS[slug] : null;

  if (!entry) {
    return {
      title: "Blog | Gold Invest",
      description:
        "Čitajte stručne tekstove o investicionom zlatu — kako kupiti, zašto je zlato sigurna investicija.",
    };
  }

  const cardPost = BLOG_POSTS.find((p) => p.slug === slug);
  const image = cardPost?.image ?? "https://goldinvest.rs/images/bento-gold-bar.webp";

  return {
    title: entry.metaTitle,
    description: entry.metaDescription,
    alternates: { canonical: `https://goldinvest.rs/blog/${slug}` },
    openGraph: {
      title: entry.metaTitle,
      description: entry.metaDescription,
      url: `https://goldinvest.rs/blog/${slug}`,
      siteName: "Gold Invest",
      locale: "sr_RS",
      type: "article",
      images: [{ url: image, width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = safeSlug(resolvedParams?.slug);
  if (!slug) return notFound();

  const entry = BLOG_SINGLE_POSTS[slug];
  if (!entry) return notFound();

  const cardPost = BLOG_POSTS.find((p) => p.slug === slug);
  const mergedPost = cardPost
    ? { ...entry.post, image: cardPost.image, imageAlt: cardPost.imageAlt }
    : entry.post;

  const breadcrumbs = [
    { label: "Investiciono zlato", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: mergedPost.title, href: `/blog/${slug}` },
  ];

  return (
    <main className="bg-white">
      <SchemaScript schema={buildBreadcrumbSchema(breadcrumbs)} />
      <SingleBlogPostTemplate post={mergedPost} blocks={entry.blocks} />
    </main>
  );
}

