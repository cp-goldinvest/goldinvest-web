"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

type FaqItem = { q: string; a: string };

type Props = {
  title: string;
  items: FaqItem[];
  ctaHref?: string;
  ctaLabel?: string;
};

export function CategoryFaq({ title, items, ctaHref, ctaLabel }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      className="py-20"
      style={{
        background: "linear-gradient(180deg, #D4C5A3 0%, #E7E5D9 37%, #EFE7DA 100%)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-start text-left md:items-center md:text-center mb-10">
          <span
            style={{
              fontFamily: "var(--font-rethink), sans-serif",
              fontWeight: 400,
              fontSize: 19,
              lineHeight: "31px",
              color: "#C2B280",
            }}
          >
            Edukacija
          </span>
          <h2
            style={{
              fontFamily: "var(--font-pp-editorial), Georgia, serif",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: 35,
              lineHeight: "60px",
              color: "#1B1B1C",
            }}
          >
            {title}
          </h2>
        </div>

        <div className="max-w-[760px] w-full md:mx-auto flex flex-col gap-3">
          {items.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(190,173,135,0.68)" }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <h3
                  className="text-[#1B1B1C] pr-6"
                  style={{
                    fontFamily: "var(--font-rethink), sans-serif",
                    fontWeight: 600,
                    fontSize: 18,
                    lineHeight: "28px",
                  }}
                >
                  {faq.q}
                </h3>
                <ChevronDown
                  size={18}
                  className={`text-[#BEAD87] transition-transform shrink-0 ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 border-t border-[#F0EDE6]">
                  <p
                    className="text-[#6B5E3F] leading-relaxed pt-4"
                    style={{ fontSize: 15, fontFamily: "var(--font-rethink), sans-serif" }}
                  >
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {ctaHref && ctaLabel && (
          <div className="flex justify-start md:justify-center mt-8">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: "#BEAD87",
                fontSize: "12.1px",
                boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)",
              }}
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
