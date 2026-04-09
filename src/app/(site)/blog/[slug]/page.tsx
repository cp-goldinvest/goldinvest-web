import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_SINGLE_POSTS } from "@/data/blog-single-posts";
import { BLOG_POSTS } from "@/data/blog-posts";
import { SingleBlogPostTemplate } from "@/components/blog/SingleBlogPostTemplate";
import { SanityBlogPostTemplate } from "@/components/blog/SanityBlogPostTemplate";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { getSanityPost, getSanityPosts } from "@/sanity/queries";

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

  // Static post
  const entry = slug ? BLOG_SINGLE_POSTS[slug] : null;
  if (entry) {
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

  // Sanity post
  if (slug) {
    const sanityEntry = await getSanityPost(slug);
    if (sanityEntry) {
      const title = sanityEntry.metaTitle ?? sanityEntry.post.title;
      const description = sanityEntry.metaDescription ?? sanityEntry.post.excerpt;
      return {
        title,
        description,
        alternates: { canonical: `https://goldinvest.rs/blog/${slug}` },
        openGraph: {
          title,
          description,
          url: `https://goldinvest.rs/blog/${slug}`,
          siteName: "Gold Invest",
          locale: "sr_RS",
          type: "article",
          images: [{ url: sanityEntry.post.image, width: 1200, height: 630 }],
        },
      };
    }
  }

  return {
    title: "Blog | Gold Invest",
    description: "Čitajte stručne tekstove o investicionom zlatu - kako kupiti, zašto je zlato sigurna investicija.",
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = safeSlug(resolvedParams?.slug);
  if (!slug) return notFound();

  // Static post
  const entry = BLOG_SINGLE_POSTS[slug];
  if (entry) {
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

  // Sanity post
  const [sanityEntry, sanityPosts] = await Promise.all([
    getSanityPost(slug),
    getSanityPosts(),
  ]);
  if (!sanityEntry) return notFound();

  const relatedPosts = [
    ...sanityPosts.filter((p) => p.slug !== slug),
    ...BLOG_POSTS,
  ].slice(0, 3);

  const breadcrumbs = [
    { label: "Investiciono zlato", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: sanityEntry.post.title, href: `/blog/${slug}` },
  ];

  return (
    <main className="bg-white">
      <SchemaScript schema={buildBreadcrumbSchema(breadcrumbs)} />
      <SanityBlogPostTemplate post={sanityEntry.post} body={sanityEntry.body} relatedPosts={relatedPosts} />
    </main>
  );
}
