"use client";

import { useState } from "react";
import Link from "next/link";

type Pill = { label: string; href: string; active?: boolean };

type Props = {
  title: string;
  introFull: string;
  introFirstSentence?: string;
  pills: Pill[];
  expandableIntro?: boolean;
};

export function CategoryHero({ title, introFull, introFirstSentence, pills, expandableIntro = false }: Props) {
  const [expanded, setExpanded] = useState(!expandableIntro);
  const showIntro = expanded ? introFull : (introFirstSentence ?? introFull.split(/[.!?]/)[0] + ".");

  return (
    <section
      className="overflow-hidden"
      style={{ background: "linear-gradient(138.26deg, #BAA77F 1.38%, #E7E5D9 60.02%, #EFE7DA 97.1%)" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-16 lg:px-24">
        <div className="py-14 sm:py-20">
          <h1
            className="text-[#1B1B1C] leading-[1.13] mb-6"
            style={{
              fontFamily: "var(--font-pp-editorial), Georgia, serif",
              fontSize: "clamp(32px, 4.2vw, 52px)",
              fontWeight: 400,
            }}
          >
            {title}
          </h1>

          <div
            className="text-[#3A3A3A] mb-8 leading-relaxed"
            style={{ fontSize: "clamp(14px, 1.2vw, 17px)", maxWidth: 640 }}
          >
            <p>{showIntro}</p>
            {expandableIntro && !expanded && (
              <button
                onClick={() => setExpanded(true)}
                className="mt-2 inline-flex items-center gap-1 text-[#BF8E41] font-semibold hover:underline"
                style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 14 }}
                aria-expanded={expanded}
              >
                Pročitaj više <span aria-hidden>+</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {pills.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className={`inline-flex items-center justify-center px-3 py-2 sm:px-5 sm:py-2.5 rounded-full font-semibold transition-all duration-200 whitespace-nowrap ${
                  p.active
                    ? "bg-[#1B1B1C] text-white"
                    : "text-[#1B1B1C] hover:bg-[#1B1B1C] hover:text-white"
                }`}
                style={{ border: "0.5px solid #1B1B1C", fontSize: "clamp(11px, 2.5vw, 12.1px)" }}
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
