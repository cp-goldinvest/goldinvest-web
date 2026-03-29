"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Category = "Svi tekstovi" | "Investiciono zlato" | "Tržište" | "Saveti" | "Vodič";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: Exclude<Category, "Svi tekstovi">;
  date: string;
  readMin: number;
  image: string;
  imageAlt: string;
  featured?: boolean;
};

// ─── Category badge ───────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<Exclude<Category, "Svi tekstovi">, string> = {
  "Saveti":            "bg-[#BEAD87] text-[#1B1B1C]",
  "Tržište":           "bg-[#1B1B1C] text-white",
  "Investiciono zlato":"bg-[#E9E6D9] text-[#5A4A2A]",
  "Vodič":             "border border-[#BEAD87] text-[#9D9072] bg-transparent",
};

export function CategoryBadge({ cat }: { cat: Exclude<Category, "Svi tekstovi"> }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10.5px] font-semibold tracking-wide uppercase ${CATEGORY_STYLES[cat]}`}
      style={{ fontFamily: "var(--font-rethink), sans-serif" }}
    >
      {cat}
    </span>
  );
}

// ─── Featured card (large horizontal) ────────────────────────────────────────

function FeaturedCard({ post }: { post: Post }) {
  const isInflationPost = post.slug === "inflacija-i-zlato";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white border border-[#F0EDE6] rounded-3xl overflow-hidden hover:shadow-[0_8px_40px_rgba(0,0,0,0.07)] transition-shadow duration-300"
    >
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
        {/* Image */}
        <div className="relative bg-[#F0EDE6]" style={{ minHeight: 320 }}>
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            className={`object-cover transition-transform duration-500 ${
              isInflationPost
                ? "scale-[1.12] object-[50%_52%] group-hover:scale-[1.14]"
                : "group-hover:scale-[1.02]"
            }`}
          />
          <span className="absolute top-5 left-5">
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-white/90 text-[#BF8E41] backdrop-blur-sm"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              Izdvojeno
            </span>
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
          <div className="mb-4">
            <CategoryBadge cat={post.category} />
          </div>
          <h2
            className="text-[#1B1B1C] mb-4 group-hover:text-[#BF8E41] transition-colors"
            style={{
              fontFamily: "var(--font-pp-editorial), Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(22px, 2.5vw, 34px)",
              lineHeight: "1.2",
            }}
          >
            {post.title}
          </h2>
          <p
            className="text-[#4C4C4C] leading-relaxed mb-6"
            style={{
              fontFamily: "var(--font-rethink), sans-serif",
              fontSize: 15,
              lineHeight: "1.65em",
            }}
          >
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-[#9D9072] text-[12px]"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}>
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                {post.readMin} min čitanja
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-[#BF8E41] text-[13px] font-semibold group-hover:gap-2.5 transition-all"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}>
              Čitajte
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Regular card ─────────────────────────────────────────────────────────────

function PostCard({ post }: { post: Post }) {
  const isInflationPost = post.slug === "inflacija-i-zlato";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white border border-[#F0EDE6] rounded-2xl overflow-hidden hover:shadow-[0_6px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative bg-[#F0EDE6] overflow-hidden" style={{ height: 210 }}>
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          className={`object-cover transition-transform duration-500 ${
            isInflationPost
              ? "scale-[1.14] object-[50%_52%] group-hover:scale-[1.16]"
              : "group-hover:scale-[1.03]"
          }`}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="mb-3">
          <CategoryBadge cat={post.category} />
        </div>
        <h3
          className="text-[#1B1B1C] mb-3 flex-1 group-hover:text-[#BF8E41] transition-colors"
          style={{
            fontFamily: "var(--font-pp-editorial), Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(17px, 1.5vw, 20px)",
            lineHeight: "1.25",
          }}
        >
          {post.title}
        </h3>
        <p
          className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-5"
          style={{ fontFamily: "var(--font-rethink), sans-serif" }}
        >
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#F0EDE6]">
          <div className="flex items-center gap-3 text-[#BDBDBD] text-[11.5px]"
            style={{ fontFamily: "var(--font-rethink), sans-serif" }}>
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {post.readMin} min
            </span>
          </div>
          <ArrowRight
            size={15}
            className="text-[#BEAD87] group-hover:translate-x-0.5 transition-transform"
          />
        </div>
      </div>
    </Link>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  "Svi tekstovi",
  "Investiciono zlato",
  "Tržište",
  "Saveti",
  "Vodič",
];

type Props = { posts: Post[] };

export function BlogGrid({ posts }: Props) {
  const [active, setActive] = useState<Category>("Svi tekstovi");

  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  const filtered =
    active === "Svi tekstovi"
      ? rest
      : rest.filter((p) => p.category === active);

  const showFeatured = active === "Svi tekstovi" && featured;

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`inline-flex items-center px-4 py-2 rounded-full text-[12px] font-semibold transition-all duration-200 ${
              active === cat
                ? "bg-[#1B1B1C] text-white"
                : "bg-white border border-[#E8E3D8] text-[#6B6B6B] hover:border-[#1B1B1C] hover:text-[#1B1B1C]"
            }`}
            style={{ fontFamily: "var(--font-rethink), sans-serif" }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured post */}
      {showFeatured && (
        <div className="mb-8">
          <FeaturedCard post={featured!} />
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p
            className="text-[#9D9072]"
            style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 16 }}
          >
            Uskoro — članci iz ove kategorije su u pripremi.
          </p>
        </div>
      )}
    </div>
  );
}
