import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/components/blog/BlogGrid";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { BLOG_SINGLE_POSTS } from "@/data/blog-single-posts";
import { BLOG_POSTS } from "@/data/blog-posts";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { WorldGoldMap } from "@/components/blog/WorldGoldMap";
import { GoldPriceChart } from "@/components/blog/GoldPriceChart";
import { GoldMacroChart } from "@/components/blog/GoldMacroChart";

export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "checklist"; items: string[] }
  | { type: "orderedList"; items: string[] }
  | { type: "ruleBox"; text: string }
  | { type: "image"; src: string; alt: string }
  | { type: "stepItem"; number: number; title: string; body: string | string[] }
  | { type: "macroChart" }
  | {
      type: "comparison";
      leftTitle: string;
      rightTitle: string;
      rows: Array<{
        label: string;
        left: string;
        right: string;
        better: "left" | "right" | "both" | "neutral";
      }>;
    }
  | {
      type: "chart";
      title: string;
      legend: { gold: string; dollar: string };
      summary: { goldGrowth: string; dollarDecline: string };
    }
  | { type: "goldPriceChart" }
  | { type: "worldMap" }
  | { type: "timeline"; items: Array<{ period: string; inflation: string; goldChange?: string }> }
  | { type: "quote"; text: string }
  | {
      type: "storageComparisonTable";
      rows: Array<{
        label: string;
        subtitle?: string;
        prednosti: Array<{ text: string; check?: boolean }>;
        nedostaci: string[];
        paznja: Array<{ text: string; check?: boolean }>;
      }>;
    };

type Props = {
  post: Post;
  blocks: BlogBlock[];
};

const CATEGORY_STYLES: Record<string, string> = {
  "Saveti": "bg-[#BEAD87] text-[#1B1B1C]",
  "Tržište": "bg-[#1B1B1C] text-white",
  "Investiciono zlato": "bg-[#E9E6D9] text-[#5A4A2A]",
  "Vodič": "border border-[#BEAD87] text-[#9D9072] bg-transparent",
};

function CategoryPill({ category }: { category: string }) {
  const cls = CATEGORY_STYLES[category] ?? "bg-white border border-[#F0EDE6] text-[#1B1B1C]";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10.5px] font-semibold tracking-widest uppercase ${cls}`}
      style={{ fontFamily: "var(--font-rethink), sans-serif" }}
    >
      {category}
    </span>
  );
}

function StorageComparisonCheckList({
  lines,
  defaultCheck,
}: {
  lines: Array<{ text: string; check?: boolean }>;
  defaultCheck: boolean;
}) {
  if (lines.length === 0) {
    return <span className="text-[#9D9072]">-</span>;
  }
  return (
    <ul className="m-0 flex flex-col gap-2.5 list-none p-0">
      {lines.map((line, i) => {
        const showCheck = line.check !== undefined ? line.check : defaultCheck;
        return (
          <li
            key={i}
            className="flex gap-2.5 items-start text-[#4C4C4C]"
            style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 14, lineHeight: "1.6em" }}
          >
            {showCheck ? (
              <span
                className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#BF8E41] text-[#BF8E41] text-[11px] font-semibold leading-none"
                aria-hidden
              >
                ✓
              </span>
            ) : (
              <span className="mt-0.5 inline-block w-5 shrink-0" aria-hidden />
            )}
            <span>{line.text}</span>
          </li>
        );
      })}
    </ul>
  );
}

function StorageComparisonPlainList({ lines }: { lines: string[] }) {
  if (lines.length === 0) {
    return <span className="text-[#9D9072]">-</span>;
  }
  return (
    <ul className="m-0 flex flex-col gap-2 list-none p-0">
      {lines.map((line, i) => (
        <li
          key={i}
          className="text-[#4C4C4C]"
          style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 14, lineHeight: "1.6em" }}
        >
          {line}
        </li>
      ))}
    </ul>
  );
}

export function SingleBlogPostTemplate({ post, blocks }: Props) {
  const relatedEntries = Object.values(BLOG_SINGLE_POSTS)
    .filter((entry) => entry.post.slug !== post.slug)
    .map((entry) => {
      const listPost = BLOG_POSTS.find((p) => p.slug === entry.post.slug);
      if (!listPost) return entry;
      return {
        ...entry,
        post: {
          ...entry.post,
          title: listPost.title,
          image: listPost.image,
          imageAlt: listPost.imageAlt,
        },
      };
    })
    .slice(0, 3);

  const isHighlightParagraph = (text: string) =>
    text.startsWith("Zlato nije novi trend.");

  const isQuoteParagraph = (text: string) =>
    text.startsWith("Konzervativna preporuka finansijskih planera:");

  return (
    <>
      <ReadingProgressBar />

      {/* Hero */}
      <section
        className="overflow-hidden pt-14 pb-12 border-b border-[#F0EDE6]"
        style={{ background: "linear-gradient(138.26deg, #BAA77F 1.38%, #E7E5D9 60.02%, #EFE7DA 97.1%)" }}
      >
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] gap-10 items-center">
            {/* Left - meta + title */}
            <div className="text-left">
              <div className="flex flex-col gap-4 mb-6 items-start">
                <CategoryPill category={post.category} />
                <p
                  className="flex items-center gap-2 text-[#9D9072] text-[13px] leading-snug"
                  style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                >
                  <span>{post.date}</span>
                  <span aria-hidden>•</span>
                  <span>
                    {post.readMin} min
                  </span>
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
            <div
              className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
              style={{ height: 360 }}
            >
              <Image src={post.image} alt={post.imageAlt} fill className="object-cover" />
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Body */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <SectionContainer>
          <div className="max-w-3xl mx-auto">
            {blocks.map((b, idx) => {
              if (b.type === "heading") {
                const headingMatch = b.text.match(/^(\d+)\.\s*(.+)$/);
                const headingNum = headingMatch?.[1] ?? null;
                const headingText = headingMatch?.[2] ?? b.text;

                return (
                  <div key={idx} className={`${idx === 0 ? "mt-8" : "mt-14"} mb-6`}>
                    {idx > 0 ? <div className="border-t border-[#F0EDE6] my-10" aria-hidden /> : null}
                    <div className="flex items-start gap-4">
                      <div className="w-[2px] self-stretch bg-[#BF8E41] mt-1" aria-hidden />
                      <div className="min-w-0">
                        {headingNum ? (
                          <p
                            className="m-0 mb-2 text-[#BF8E41]"
                            style={{
                              fontFamily: "var(--font-rethink), sans-serif",
                              fontWeight: 700,
                              fontSize: 14,
                              letterSpacing: "0.14em",
                              lineHeight: "1",
                            }}
                          >
                            {headingNum.padStart(2, "0")}
                          </p>
                        ) : (
                          <div className="h-[2px] w-10 bg-[#BF8E41] mb-4" aria-hidden />
                        )}
                        <h2
                          className="text-[#1B1B1C] mb-4"
                          style={{
                            fontFamily: "var(--font-pp-editorial), Georgia, serif",
                            fontWeight: 400,
                            fontSize: "clamp(24px, 2.5vw, 34px)",
                            lineHeight: "1.18",
                          }}
                        >
                          {headingText}
                        </h2>
                      </div>
                    </div>
                    <div className="border-b border-[#F0EDE6]" aria-hidden />
                  </div>
                );
              }

              if (b.type === "stepItem") {
                const isLast = blocks[idx + 1]?.type !== "stepItem";
                const paragraphs = Array.isArray(b.body) ? b.body : [b.body];
                return (
                  <div
                    key={idx}
                    className={`relative flex gap-6 sm:gap-8 ${isLast ? "pb-0" : "pb-10"}`}
                  >
                    {!isLast ? (
                      <div
                        className="hidden md:block absolute left-[19px] top-6 bottom-6 w-px"
                        style={{
                          background: "linear-gradient(180deg, #BEAD87 0%, #E6DFC9 100%)",
                        }}
                        aria-hidden
                      />
                    ) : null}

                    <div className="flex flex-col items-center shrink-0">
                      <span
                        className="relative z-10 inline-flex items-center justify-center w-10 h-10 rounded-full text-white text-sm font-semibold shrink-0"
                        style={{
                          background: "#1B1B1C",
                          fontFamily: "var(--font-rethink), sans-serif",
                          boxShadow: "0 0 0 4px #fff, 0 0 0 5px #E6DFC9",
                        }}
                      >
                        {b.number}
                      </span>
                    </div>

                    <div className="flex-1 pt-1.5">
                      <h3
                        className="text-[#1B1B1C] mb-3"
                        style={{
                          fontFamily: "var(--font-pp-editorial), Georgia, serif",
                          fontWeight: 400,
                          fontSize: "clamp(20px, 2vw, 26px)",
                          lineHeight: "1.2",
                        }}
                      >
                        {b.title}
                      </h3>
                      <div className="flex flex-col gap-3">
                        {paragraphs.map((p, pIdx) => (
                          <p
                            // eslint-disable-next-line react/no-array-index-key
                            key={pIdx}
                            className="text-[#4C4C4C] leading-relaxed m-0"
                            style={{
                              fontFamily: "var(--font-rethink), sans-serif",
                              fontSize: 15,
                              lineHeight: "1.65em",
                            }}
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              if (b.type === "quote") {
                return (
                  <div
                    key={idx}
                    className="bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl px-6 py-7 sm:px-8 sm:py-8 my-8"
                  >
                    <blockquote
                      className="text-[#3A3A3A] leading-relaxed m-0"
                      style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 16, lineHeight: "1.7em" }}
                    >
                      {b.text}
                    </blockquote>
                  </div>
                );
              }

              if (b.type === "list") {
                return (
                  <div
                    key={idx}
                    className="bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl px-6 py-6 sm:px-8 sm:py-7 my-7"
                  >
                    <ul
                      className="m-0 pl-5 flex flex-col gap-3"
                      style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 16, lineHeight: "1.7em" }}
                    >
                      {b.items.map((item, i) => (
                        <li key={i} className="text-[#4C4C4C]">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              if (b.type === "storageComparisonTable") {
                return (
                  <div key={idx} className="my-8 -mx-4 sm:mx-0">
                    <div className="overflow-x-auto rounded-2xl border border-[#F0EDE6] bg-[#FAF8F2] shadow-[0_8px_28px_rgba(0,0,0,0.04)]">
                      <table className="min-w-[720px] w-full border-collapse text-left">
                        <thead>
                          <tr className="border-b border-[#F0EDE6] bg-[#FDFCF9]">
                            <th
                              scope="col"
                              className="sticky left-0 z-[1] bg-[#FDFCF9] px-4 py-3 text-[13px] font-semibold text-[#1B1B1C] w-[min(28%,220px)] shadow-[2px_0_8px_rgba(0,0,0,0.04)]"
                              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                            >
                              Opcija
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-[13px] font-semibold text-[#1B1B1C] min-w-[200px]"
                              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                            >
                              Prednosti
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-[13px] font-semibold text-[#1B1B1C] min-w-[200px]"
                              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                            >
                              Nedostaci
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-[13px] font-semibold text-[#1B1B1C] min-w-[220px]"
                              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                            >
                              Na šta obratiti pažnju
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {b.rows.map((row, ri) => (
                            <tr key={ri} className="border-b border-[#F0EDE6] last:border-0 align-top">
                              <th
                                scope="row"
                                className="sticky left-0 z-[1] bg-[#FAF8F2] px-4 py-4 align-top shadow-[2px_0_8px_rgba(0,0,0,0.04)]"
                              >
                                <span
                                  className="block text-[#1B1B1C] font-semibold"
                                  style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 14 }}
                                >
                                  {row.label}
                                </span>
                                {row.subtitle ? (
                                  <span
                                    className="mt-2 block text-[#4C4C4C] font-normal"
                                    style={{
                                      fontFamily: "var(--font-rethink), sans-serif",
                                      fontSize: 13,
                                      lineHeight: "1.55em",
                                    }}
                                  >
                                    {row.subtitle}
                                  </span>
                                ) : null}
                              </th>
                              <td className="px-4 py-4 align-top border-l border-[#F0EDE6]/80">
                                <StorageComparisonCheckList lines={row.prednosti} defaultCheck />
                              </td>
                              <td className="px-4 py-4 align-top border-l border-[#F0EDE6]/80">
                                <StorageComparisonPlainList lines={row.nedostaci} />
                              </td>
                              <td className="px-4 py-4 align-top border-l border-[#F0EDE6]/80">
                                <StorageComparisonCheckList lines={row.paznja} defaultCheck={false} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              }

              if (b.type === "checklist") {
                return (
                  <div
                    key={idx}
                    className="bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl px-6 py-6 sm:px-8 sm:py-7 my-7"
                  >
                    <ul className="m-0 flex flex-col gap-3">
                      {b.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span
                            className="w-6 h-6 rounded-full border-2 border-[#BF8E41] flex items-center justify-center shrink-0"
                            style={{ color: "#BF8E41", fontSize: 12, lineHeight: "12px" }}
                            aria-hidden
                          >
                            ✔
                          </span>
                          <span
                            className="text-[#4C4C4C]"
                            style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 16, lineHeight: "1.7em" }}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              if (b.type === "orderedList") {
                return (
                  <div
                    key={idx}
                    className="bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl px-6 py-6 sm:px-8 sm:py-7 my-7"
                  >
                    <ol className="m-0 flex flex-col gap-3">
                      {b.items.map((item, i) => (
                        <li key={i} className="flex gap-4">
                          <span
                            className="text-[#BF8E41] font-semibold shrink-0"
                            style={{
                              fontFamily: "var(--font-rethink), sans-serif",
                              fontSize: 16,
                              lineHeight: "1.7em",
                              width: 30,
                              textAlign: "right",
                            }}
                          >
                            {i + 1}.
                          </span>
                          <span
                            className="text-[#4C4C4C]"
                            style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 16, lineHeight: "1.7em" }}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              }

              if (b.type === "ruleBox") {
                return (
                  <div
                    key={idx}
                    className="my-7 bg-[#BF8E41] text-[#1B1B1C] rounded-2xl px-6 py-5 sm:px-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                  >
                    <p
                      className="m-0"
                      style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 16, lineHeight: "1.7em" }}
                    >
                      {b.text}
                    </p>
                  </div>
                );
              }

              if (b.type === "image") {
                return (
                  <div key={idx} className="my-7">
                    <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-2xl shadow-[0_14px_36px_rgba(0,0,0,0.12)] bg-[#F5F2E8]">
                      <div style={{ paddingTop: "56.25%" }} />
                      <Image src={b.src} alt={b.alt} fill className="object-contain p-6 sm:p-8" />
                    </div>
                  </div>
                );
              }

              if (b.type === "comparison") {
                return (
                  <div key={idx} className="my-8 bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl p-5 sm:p-7">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="rounded-xl border border-[#F0EDE6] bg-white px-4 py-3">
                        <p
                          className="m-0 text-[#1B1B1C]"
                          style={{ fontFamily: "var(--font-pp-editorial), Georgia, serif", fontSize: 24, lineHeight: "1.2" }}
                        >
                          {b.leftTitle}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#F0EDE6] bg-white px-4 py-3">
                        <p
                          className="m-0 text-[#1B1B1C]"
                          style={{ fontFamily: "var(--font-pp-editorial), Georgia, serif", fontSize: 24, lineHeight: "1.2" }}
                        >
                          {b.rightTitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {b.rows.map((row, i) => (
                        <div key={i} className="rounded-xl border border-[#F0EDE6] bg-white p-4">
                          <p
                            className="m-0 mb-3 text-[#1B1B1C]"
                            style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
                          >
                            {row.label}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div
                              className={`rounded-lg border px-3 py-3 ${
                                row.better === "left" || row.better === "both"
                                  ? "bg-[#BF8E41] border-[#BF8E41]"
                                  : "bg-[#FAF8F2] border-[#F0EDE6]"
                              }`}
                            >
                              <p
                                className={`m-0 ${row.better === "left" || row.better === "both" ? "text-[#1B1B1C]" : "text-[#4C4C4C]"}`}
                                style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 15, lineHeight: "1.65em" }}
                              >
                                {row.better === "left" || row.better === "both" ? <span className="text-[#1B1B1C] font-semibold">✔ </span> : null}
                                {row.left}
                              </p>
                            </div>
                            <div
                              className={`rounded-lg border px-3 py-3 ${
                                row.better === "right" || row.better === "both"
                                  ? "bg-[#BF8E41] border-[#BF8E41]"
                                  : "bg-[#FAF8F2] border-[#F0EDE6]"
                              }`}
                            >
                              <p
                                className={`m-0 ${row.better === "right" || row.better === "both" ? "text-[#1B1B1C]" : "text-[#4C4C4C]"}`}
                                style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 15, lineHeight: "1.65em" }}
                              >
                                {row.better === "right" || row.better === "both" ? <span className="text-[#1B1B1C] font-semibold">✔ </span> : null}
                                {row.right}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (b.type === "timeline") {
                return (
                  <div
                    key={idx}
                    className="my-8 bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl px-6 py-7 sm:px-8 sm:py-8"
                  >
                    <div className="relative">
                      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#F0EDE6]" aria-hidden />
                      <div className="flex flex-col gap-8">
                        {b.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="relative pl-8">
                            <span
                              className="absolute left-0 top-2 h-[14px] w-[14px] rounded-full border-2 border-[#BF8E41] bg-white"
                              aria-hidden
                            />
                            <p
                              className="m-0 mb-2 text-[#1B1B1C]"
                              style={{
                                fontFamily: "var(--font-rethink), sans-serif",
                                fontSize: 18,
                                lineHeight: "1.4em",
                                fontWeight: 700,
                              }}
                            >
                              {item.period}
                            </p>
                            {item.inflation ? (
                              <p
                                className="m-0 text-[#4C4C4C]"
                                style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 16, lineHeight: "1.7em" }}
                              >
                                {item.inflation}
                              </p>
                            ) : null}
                            {item.goldChange ? (
                              <p
                                className="m-0 mt-2 text-[#4C4C4C]"
                                style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 16, lineHeight: "1.7em" }}
                              >
                                {item.goldChange}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              if (b.type === "chart") {
                return (
                  <div
                    key={idx}
                    className="my-8 bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl px-6 py-7 sm:px-8 sm:py-8"
                  >
                    <p
                      className="m-0 mb-5 text-[#1B1B1C]"
                      style={{
                        fontFamily: "var(--font-pp-editorial), Georgia, serif",
                        fontWeight: 400,
                        fontSize: "clamp(20px, 2.2vw, 28px)",
                        lineHeight: "1.2",
                      }}
                    >
                      {b.title}
                    </p>

                    <div className="mb-5">
                      <svg viewBox="0 0 640 260" className="w-full h-auto rounded-xl bg-[#FDFCF9]" role="img" aria-label={b.title}>
                        {/* subtle grid */}
                        <line x1="40" y1="40" x2="600" y2="40" stroke="#F0EDE6" />
                        <line x1="40" y1="110" x2="600" y2="110" stroke="#F0EDE6" />
                        <line x1="40" y1="180" x2="600" y2="180" stroke="#F0EDE6" />
                        <line x1="40" y1="230" x2="600" y2="230" stroke="#E7E1D4" />

                        {/* axis markers */}
                        <text x="40" y="248" fill="#9D9072" fontSize="13" fontFamily="var(--font-rethink), sans-serif">
                          1971
                        </text>
                        <text x="560" y="248" fill="#9D9072" fontSize="13" fontFamily="var(--font-rethink), sans-serif">
                          2024
                        </text>

                        {/* lines */}
                        <polyline
                          fill="none"
                          stroke="#BF8E41"
                          strokeWidth="4"
                          strokeLinecap="round"
                          points="60,220 180,190 300,145 420,95 580,34"
                        />
                        <polyline
                          fill="none"
                          stroke="#1B1B1C"
                          strokeOpacity="0.65"
                          strokeWidth="4"
                          strokeLinecap="round"
                          points="60,220 180,210 300,198 420,186 580,175"
                        />

                        {/* end dots */}
                        <circle cx="580" cy="34" r="5" fill="#BF8E41" />
                        <circle cx="580" cy="175" r="5" fill="#1B1B1C" />
                      </svg>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-5 flex-wrap">
                        <span
                          className="inline-flex items-center gap-2 text-[#4C4C4C]"
                          style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 14 }}
                        >
                          <span className="h-[3px] w-7 rounded-full bg-[#BF8E41]" aria-hidden />
                          {b.legend.gold}
                        </span>
                        <span
                          className="inline-flex items-center gap-2 text-[#4C4C4C]"
                          style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 14 }}
                        >
                          <span className="h-[3px] w-7 rounded-full bg-[#1B1B1C]/70" aria-hidden />
                          {b.legend.dollar}
                        </span>
                      </div>
                      <div
                        className="text-[#4C4C4C]"
                        style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 14, lineHeight: "1.6em" }}
                      >
                        <span className="text-[#BF8E41] font-semibold">{b.summary.goldGrowth}</span>
                        {" · "}
                        <span className="text-[#1B1B1C] font-semibold">{b.summary.dollarDecline}</span>
                      </div>
                    </div>
                  </div>
                );
              }

              if (b.type === "worldMap") {
                return <WorldGoldMap key={idx} />;
              }

              if (b.type === "goldPriceChart") {
                return <GoldPriceChart key={idx} />;
              }

              if (b.type === "macroChart") {
                return <GoldMacroChart key={idx} />;
              }

              // paragraph
              if (isHighlightParagraph(b.text)) {
                return (
                  <div
                    key={idx}
                    className="mt-6 bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl px-6 py-6 sm:px-8"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-[3px] self-stretch bg-[#BF8E41] rounded-full" aria-hidden />
                      <p
                        className="text-[#4C4C4C] m-0"
                        style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 16, lineHeight: "1.75em" }}
                      >
                        {b.text}
                      </p>
                    </div>
                  </div>
                );
              }

              if (isQuoteParagraph(b.text)) {
                return (
                  <blockquote
                    key={idx}
                    className="mt-8 mb-2 bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl px-6 py-7 sm:px-8"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-[3px] self-stretch bg-[#BF8E41] rounded-full" aria-hidden />
                      <p
                        className="text-[#3A3A3A] m-0 italic"
                        style={{ fontFamily: "var(--font-pp-editorial), Georgia, serif", fontSize: 24, lineHeight: "1.35em" }}
                      >
                        {b.text}
                      </p>
                    </div>
                  </blockquote>
                );
              }

              return (
                <p
                  key={idx}
                  className="text-[#4C4C4C] m-0 mt-5"
                  style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 16, lineHeight: "1.75em" }}
                >
                  {b.text}
                </p>
              );
            })}
          </div>
        </SectionContainer>
      </section>

      {/* Related posts */}
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

            {relatedEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedEntries.map((entry) => (
                  <Link
                    key={entry.post.slug}
                    href={`/blog/${entry.post.slug}`}
                    className="group flex flex-col bg-white border border-[#F0EDE6] rounded-2xl overflow-hidden hover:shadow-[0_6px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300"
                  >
                    <div className="relative bg-[#F0EDE6]" style={{ height: 180 }}>
                      <Image
                        src={entry.post.image}
                        alt={entry.post.imageAlt}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <p
                        className="m-0 text-[#1B1B1C] text-[10.5px] font-semibold tracking-widest uppercase"
                        style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                      >
                        {entry.post.category}
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
                        {entry.post.title}
                      </h4>
                      <p
                        className="text-[#6B6B6B] text-[14px] m-0"
                        style={{ fontFamily: "var(--font-rethink), sans-serif", lineHeight: "1.6em" }}
                      >
                        {entry.post.date}
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

      {/* Footer-adjacent CTA (appears above the site footer in the layout) */}
      <WhatIsGoldSection />
    </>
  );
}

