"use client";

import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import type { Post } from "@/components/blog/BlogGrid";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p
        className="text-[#2C2C2C] leading-relaxed mb-5"
        style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 17 }}
      >
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className="text-[#1B1B1C] mt-10 mb-4"
        style={{
          fontFamily: "var(--font-pp-editorial), Georgia, serif",
          fontSize: "clamp(22px, 3vw, 28px)",
          fontWeight: 400,
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="text-[#1B1B1C] mt-8 mb-3"
        style={{
          fontFamily: "var(--font-pp-editorial), Georgia, serif",
          fontSize: "clamp(18px, 2.5vw, 22px)",
          fontWeight: 400,
        }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#BEAD87] pl-5 my-6 text-[#5A4A2A] italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-5 space-y-2 text-[#2C2C2C]" style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 17 }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-5 space-y-2 text-[#2C2C2C]" style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 17 }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-[#1B1B1C]">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="text-[#9D7F3A] underline underline-offset-2 hover:text-[#7A6230] transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <Image
              src={urlFor(value).width(900).url()}
              alt={value.alt ?? ""}
              fill
              className="object-cover"
            />
          </div>
          {value.alt && (
            <figcaption className="text-center text-sm text-[#9D9072] mt-2">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

type Props = {
  post: Post;
  body: unknown[];
  relatedPosts: Post[];
};

const BREADCRUMBS_BASE = [
  { label: "Investiciono zlato", href: "/" },
  { label: "Blog", href: "/blog" },
];

export function SanityBlogPostTemplate({ post, body, relatedPosts }: Props) {
  const breadcrumbs = [
    ...BREADCRUMBS_BASE,
    { label: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <>
      <ReadingProgressBar />
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <SectionContainer>
          <Breadcrumb items={breadcrumbs} variant="light" />
        </SectionContainer>
      </section>

      <article className="bg-white pb-20">
        {/* Hero */}
        <section
          className="overflow-hidden pt-14 pb-12 border-b border-[#F0EDE6]"
          style={{ background: "linear-gradient(138.26deg, #BAA77F 1.38%, #E7E5D9 60.02%, #EFE7DA 97.1%)" }}
        >
          <SectionContainer>
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] gap-10 items-center">
              {/* Left */}
              <div className="text-left">
                <div className="flex flex-col gap-4 mb-6 items-start">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-[#BEAD87] text-[#1B1B1C]"
                    style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                  >
                    {post.category}
                  </span>
                  <p
                    className="flex items-center gap-2 text-[#9D9072] text-[13px] leading-snug m-0"
                    style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                  >
                    <span>{post.date}</span>
                    <span aria-hidden>•</span>
                    <span>{post.readMin} min</span>
                  </p>
                </div>
                <h1
                  className="text-[#1B1B1C] leading-[1.08]"
                  style={{
                    fontFamily: "var(--font-pp-editorial), Georgia, serif",
                    fontWeight: 400,
                    fontSize: "clamp(30px, 4vw, 54px)",
                  }}
                >
                  {post.title}
                </h1>
              </div>

              {/* Right - image */}
              {post.image && (
                <div
                  className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
                  style={{ height: 360 }}
                >
                  <Image src={post.image} alt={post.imageAlt} fill className="object-cover" priority />
                </div>
              )}
            </div>
          </SectionContainer>
        </section>

        {/* Content */}
        <SectionContainer>
          <div className="max-w-2xl mx-auto mt-10">
            {post.excerpt && (
              <p
                className="text-[#5A4A2A] mb-8 leading-relaxed"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 18,
                  borderLeft: "3px solid #BEAD87",
                  paddingLeft: 20,
                }}
              >
                {post.excerpt}
              </p>
            )}
            <PortableText value={body as Parameters<typeof PortableText>[0]["value"]} components={components} />
          </div>
        </SectionContainer>
      </article>

      {/* Pročitajte još */}
      <section className="bg-[#FAFAF8] py-14 sm:py-16 border-t border-[#F0EDE6]">
        <SectionContainer>
          <div className="max-w-5xl mx-auto">
            <h3
              className="text-[#1B1B1C] mb-8"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(26px, 2.8vw, 40px)",
                lineHeight: "1.15",
              }}
            >
              Pročitajte još
            </h3>
            {relatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group flex flex-col bg-white border border-[#F0EDE6] rounded-2xl overflow-hidden hover:shadow-[0_6px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300"
                  >
                    <div className="relative bg-[#F0EDE6]" style={{ height: 180 }}>
                      <Image
                        src={related.image}
                        alt={related.imageAlt}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <p
                        className="m-0 text-[#1B1B1C] text-[10.5px] font-semibold tracking-widest uppercase"
                        style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                      >
                        {related.category}
                      </p>
                      <h4
                        className="text-[#1B1B1C] mt-3 mb-3 group-hover:text-[#BF8E41] transition-colors"
                        style={{
                          fontFamily: "var(--font-pp-editorial), Georgia, serif",
                          fontWeight: 400,
                          fontSize: 24,
                          lineHeight: "1.2",
                        }}
                      >
                        {related.title}
                      </h4>
                      <p
                        className="text-[#6B6B6B] text-[14px] m-0"
                        style={{ fontFamily: "var(--font-rethink), sans-serif", lineHeight: "1.6em" }}
                      >
                        {related.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#F0EDE6] rounded-2xl p-6 sm:p-8">
                <p
                  className="m-0 text-[#4C4C4C]"
                  style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 16, lineHeight: "1.7em" }}
                >
                  Uskoro dodajemo još stručnih tekstova o investicionom zlatu.
                </p>
              </div>
            )}
          </div>
        </SectionContainer>
      </section>

      <WhatIsGoldSection />
    </>
  );
}
