"use client";

import { useState } from "react";
import Image from "next/image";

type Member = {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  bio: string[];
};

export function TeamCard({ member }: { member: Member }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ perspective: "1200px", height: 640 }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className="absolute inset-0 transition-transform duration-700 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          willChange: "transform",
        }}
      >
        {/* ── Prednja strana ── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border border-[#EBEBEB]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <div className="relative" style={{ height: 555, transform: "translateZ(0)" }}>
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
              style={{ objectPosition: "50% 22%" }}
            />
          </div>

          <div className="flex items-center justify-between gap-4 px-6 py-5 bg-white border-t border-[#F0EDE6]">
            <div>
              <h3
                className="text-[#1B1B1C]"
                style={{
                  fontFamily: "var(--font-pp-editorial), Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(18px, 1.6vw, 22px)",
                  lineHeight: "1.15",
                }}
              >
                {member.name}
              </h3>
              <span
                className="inline-block mt-1 text-[#6B6050] text-[10.5px] font-semibold tracking-widest uppercase"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                {member.role}
              </span>
            </div>
            <span
              className="text-[#BEAD87] text-[11px] tracking-wide"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              saznaj više →
            </span>
          </div>
        </div>

        {/* ── Zadnja strana ── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col border border-[#E8E0D0]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "#FAF8F2",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex-1 flex flex-col justify-center px-8 py-10 gap-5">
            <div>
              <h3
                className="text-[#1B1B1C]"
                style={{
                  fontFamily: "var(--font-pp-editorial), Georgia, serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "clamp(22px, 2vw, 28px)",
                  lineHeight: "1.15",
                }}
              >
                {member.name}
              </h3>
              <span
                className="inline-block mt-1.5 text-[#9D9072] text-[10.5px] font-semibold tracking-widest uppercase"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                {member.role}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {member.bio.map((para, i) => (
                <p
                  key={i}
                  className="text-[#3A3A3A] text-[13.5px]"
                  style={{
                    fontFamily: "var(--font-rethink), sans-serif",
                    lineHeight: "1.75em",
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#1B1B1C] hover:text-[#BF8E41] transition-colors text-[13px] font-medium w-fit"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn profil
            </a>
          </div>

          <div className="px-8 py-4 border-t border-[#EBEBEB] flex items-center gap-2">
            <span
              className="text-[#BEAD87] text-[11px] tracking-wide"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              ← nazad
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
