import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { CategoryBadge, type Post } from "@/components/blog/BlogGrid";

function MetaRow({ post, compact }: { post: Post; compact?: boolean }) {
  const textClass = compact
    ? "text-[#BDBDBD] text-[11.5px]"
    : "text-[#9D9072] text-[12px]";
  const iconSize = compact ? 11 : 12;
  return (
    <div
      className={`flex items-center gap-3 ${textClass}`}
      style={{ fontFamily: "var(--font-rethink), sans-serif" }}
    >
      <span className="flex items-center gap-1">
        <Calendar size={iconSize} />
        {post.date}
      </span>
      <span className="flex items-center gap-1">
        <Clock size={iconSize} />
        {compact ? `${post.readMin} min` : `${post.readMin} min čitanja`}
      </span>
    </div>
  );
}

type Props = { posts: Post[] };

/**
 * GoldTypesSection-style bento grid filled with blog post cards (same content fields as BlogGrid PostCard).
 */
export function HomeBlogBentoSection({ posts }: Props) {
  const [a, b, c, d, e] = posts;
  if (!a || !b || !c || !d || !e) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-start text-left md:items-center md:text-center mb-8 md:mb-10">
          <span
            className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-3 block"
            style={{ fontFamily: "var(--font-rethink), sans-serif" }}
          >
            Blog
          </span>
          <h2
            className="text-[#1B1B1C] leading-tight"
            style={{
              fontFamily: "var(--font-rethink), sans-serif",
              fontWeight: 500,
              fontSize: 30,
              lineHeight: "27px",
              letterSpacing: "-1px",
            }}
          >
            Najnoviji članci
          </h2>
        </div>

        {/* Desktop - same grid areas as GoldTypesSection */}
        <div
          className="hidden md:grid gap-6"
          style={{
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateAreas: `
              "text-forms   center-gold   kovanice"
              "pdv          center-gold   kovanice"
              "pdv          center-gold   kovanice"
              "dollars      dollars       dollars"
            `,
          }}
        >
          {/* text-forms - post b */}
          <Link
            href={`/blog/${b.slug}`}
            className="group bg-[#F9F9F9] rounded-2xl overflow-hidden flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300"
            style={{ gridArea: "text-forms", minHeight: 180 }}
          >
            <div className="p-7 pb-4 flex-1">
              <div className="mb-3">
                <CategoryBadge cat={b.category} />
              </div>
              <h3
                className="text-[#1B1B1C] mb-3 group-hover:text-[#BF8E41] transition-colors"
                style={{
                  fontFamily: "var(--font-pp-editorial), Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(17px, 1.5vw, 20px)",
                  lineHeight: "1.25",
                }}
              >
                {b.title}
              </h3>
              <p
                className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-4"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                {b.excerpt}
              </p>
              <MetaRow post={b} compact />
            </div>
            <div className="relative min-h-[200px] overflow-hidden flex-1">
              <Image
                src={b.image}
                alt={b.imageAlt}
                fill
                className="object-cover scale-[1.05] group-hover:scale-[1.08] transition-transform duration-500"
              />
            </div>
          </Link>

          {/* center-gold - post a (newest) */}
          <Link
            href={`/blog/${a.slug}`}
            className="group rounded-2xl overflow-hidden flex flex-col border border-[#F0EDE6] bg-white hover:shadow-[0_8px_40px_rgba(0,0,0,0.07)] transition-shadow duration-300"
            style={{ gridArea: "center-gold" }}
          >
            <div className="relative bg-[#F9F9F9]" style={{ minHeight: 340, flex: "1 1 auto" }}>
              <Image
                src={a.image}
                alt={a.imageAlt}
                fill
                className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            <div className="bg-[#F9F9F9] p-7 border-t border-[#F0EDE6]">
              <div className="mb-3">
                <CategoryBadge cat={a.category} />
              </div>
              <h3
                className="text-[#1B1B1C] mb-3 group-hover:text-[#BF8E41] transition-colors"
                style={{
                  fontFamily: "var(--font-pp-editorial), Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(20px, 2vw, 28px)",
                  lineHeight: "1.2",
                }}
              >
                {a.title}
              </h3>
              <p
                className="text-[#4C4C4C] text-[15px] leading-relaxed mb-5"
                style={{ fontFamily: "var(--font-rethink), sans-serif", lineHeight: "1.65em" }}
              >
                {a.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <MetaRow post={a} />
                <span
                  className="flex items-center gap-1.5 text-[#BF8E41] text-[13px] font-semibold group-hover:gap-2.5 transition-all"
                  style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                >
                  Čitajte
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>

          {/* kovanice - post c dark */}
          <Link
            href={`/blog/${c.slug}`}
            className="group bg-[#0D0D0D] rounded-2xl p-7 flex flex-col gap-5 border border-[#232324] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-shadow duration-300"
            style={{ gridArea: "kovanice" }}
          >
            <div className="flex flex-col flex-1 min-h-0">
              <div className="mb-3">
                <CategoryBadge cat={c.category} />
              </div>
              <h3
                className="text-[#F4F1E8] mb-3 group-hover:text-[#BEAD87] transition-colors"
                style={{
                  fontFamily: "var(--font-pp-editorial), Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(17px, 1.5vw, 20px)",
                  lineHeight: "1.25",
                }}
              >
                {c.title}
              </h3>
              <p
                className="text-[#D7D0C3] text-[13.5px] leading-relaxed mb-4 flex-1"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                {c.excerpt}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-[#2E2E2E]">
                <div className="flex items-center gap-3 text-[#9D9072] text-[11.5px]" style={{ fontFamily: "var(--font-rethink), sans-serif" }}>
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {c.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {c.readMin} min
                  </span>
                </div>
                <ArrowRight size={15} className="text-[#BEAD87] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div className="flex-1 flex items-end justify-center -mb-7 min-h-[120px] pointer-events-none">
              <div className="relative w-full max-w-[85%] aspect-[4/3] max-h-[200px]">
                <Image
                  src={c.image}
                  alt={c.imageAlt}
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </Link>

          {/* pdv - post d gold */}
          <Link
            href={`/blog/${d.slug}`}
            className="group bg-[#E9E6D9] rounded-2xl p-7 flex flex-col justify-end hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow duration-300"
            style={{ gridArea: "pdv", minHeight: 180 }}
          >
            <div className="mb-3">
              <CategoryBadge cat={d.category} />
            </div>
            <h3
              className="text-[#1B1B1C] text-[17px] font-semibold leading-snug mb-2 group-hover:text-[#BF8E41] transition-colors"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              {d.title}
            </h3>
            <p
              className="text-[#5A5347] text-[13px] leading-relaxed mb-3 line-clamp-3"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              {d.excerpt}
            </p>
            <MetaRow post={d} compact />
          </Link>

          {/* dollars - post e wide */}
          <Link
            href={`/blog/${e.slug}`}
            className="group bg-[#F9F9F9] rounded-2xl flex overflow-hidden border border-[#F0EDE6] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300"
            style={{ gridArea: "dollars", minHeight: 260 }}
          >
            <div className="relative w-1/2 shrink-0 p-5">
              <div className="relative w-full h-full rounded-xl overflow-hidden min-h-[220px]">
                <Image
                  src={e.image}
                  alt={e.imageAlt}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end p-7 pl-4">
              <div className="mb-3">
                <CategoryBadge cat={e.category} />
              </div>
              <h3
                className="text-[#1B1B1C] mb-3 group-hover:text-[#BF8E41] transition-colors"
                style={{
                  fontFamily: "var(--font-pp-editorial), Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(17px, 1.5vw, 22px)",
                  lineHeight: "1.25",
                }}
              >
                {e.title}
              </h3>
              <p
                className="text-[#3A3A3A] text-[15px] leading-relaxed mb-4"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                {e.excerpt}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-[#F0EDE6]">
                <MetaRow post={e} compact />
                <ArrowRight
                  size={15}
                  className="text-[#BEAD87] group-hover:translate-x-0.5 transition-transform shrink-0"
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Mobile - stacked, same order a→e */}
        <div className="flex md:hidden flex-col gap-4">
          {[a, b, c, d, e].map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white border border-[#F0EDE6] rounded-2xl overflow-hidden hover:shadow-[0_6px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300"
            >
              <div className="relative bg-[#F0EDE6] overflow-hidden" style={{ height: 200 }}>
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col flex-1 p-6">
                <div className="mb-3">
                  <CategoryBadge cat={post.category} />
                </div>
                <h3
                  className="text-[#1B1B1C] mb-3 group-hover:text-[#BF8E41] transition-colors"
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
                  <MetaRow post={post} compact />
                  <ArrowRight
                    size={15}
                    className="text-[#BEAD87] group-hover:translate-x-0.5 transition-transform"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-start md:justify-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: "#BEAD87",
              fontSize: "12.1px",
              fontFamily: "var(--font-rethink), sans-serif",
              boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)",
            }}
          >
            Svi članci
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
