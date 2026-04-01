"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = { q: string; a: string };

export function FaqAccordion({ items, questionTag = "span" }: { items: FaqItem[]; questionTag?: "h3" | "span" }) {
  const [open, setOpen] = useState<number | null>(null);
  const Q = questionTag;

  return (
    <div className="max-w-[760px] w-full md:mx-auto flex flex-col gap-3">
      {items.map((faq, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid rgba(190,173,135,0.68)" }}>
          <button
            className="w-full flex items-center justify-between px-6 py-5 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <Q
              className="text-[#1B1B1C] pr-6"
              style={{ fontFamily: "var(--font-rethink), sans-serif", fontWeight: 600, fontSize: 18, lineHeight: "28px" }}
            >
              {faq.q}
            </Q>
            <ChevronDown
              size={18}
              className={`text-[#BEAD87] transition-transform shrink-0 ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <div className="px-6 pb-5 border-t border-[#F0EDE6]">
              <p className="text-[#6B5E3F] leading-relaxed pt-4" style={{ fontSize: 15, fontFamily: "var(--font-rethink), sans-serif" }}>
                {faq.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
