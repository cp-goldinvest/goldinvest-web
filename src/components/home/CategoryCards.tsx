"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const categories = [
  {
    label: "Zlatne poluge",
    sub: "1g – 1000g",
    href: "/kategorija/zlatne-poluge",
    accent: "#BF8E41",
    number: "01",
    description: "LBMA sertifikovane poluge vodećih svetskih rafinerija",
    illustration: <GoldBarsIllustration />,
    gradient: "from-[#2A1F0A] via-[#1E1608] to-[#1B1B1C]",
    borderColor: "#BF8E41",
  },
  {
    label: "Zlatne pločice",
    sub: "1g – 100g",
    href: "/kategorija/zlatne-plocice",
    accent: "#D4A84F",
    number: "02",
    description: "Tanje i elegantne — idealne za postepenu akumulaciju",
    illustration: <GoldPlatesIllustration />,
    gradient: "from-[#251A05] via-[#1C1408] to-[#1B1B1C]",
    borderColor: "#D4A84F",
  },
  {
    label: "Zlatni dukati",
    sub: "Dukat – 4 dukata",
    href: "/kategorija/zlatni-dukati",
    accent: "#E8C97A",
    number: "03",
    description: "Istorijske kovanice i numizmatičko zlato sa tradicijom",
    illustration: <GoldCoinIllustration />,
    gradient: "from-[#221B06] via-[#191408] to-[#1B1B1C]",
    borderColor: "#E8C97A",
  },
];

export function CategoryCards() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // On mobile: start scrolled to the middle card
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Only on mobile (lg breakpoint = 1024px)
    if (window.innerWidth >= 1024) return;
    const cards = el.querySelectorAll<HTMLElement>(":scope > a");
    if (cards.length < 2) return;
    const middleCard = cards[1];
    const containerCenter = el.offsetWidth / 2;
    const cardCenter = middleCard.offsetLeft + middleCard.offsetWidth / 2;
    el.scrollLeft = cardCenter - containerCenter;
  }, []);

  return (
    /* Mobile: horizontal snap-scroll centered on middle | Desktop: 3-column grid */
    <div
      ref={scrollRef}
      className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0"
    >
      {categories.map((cat) => (
        <Link
          key={cat.href}
          href={cat.href}
          className={[
            "group relative flex-shrink-0 w-[72vw] sm:w-[55vw] lg:w-auto",
            "snap-start rounded-2xl overflow-hidden",
            "bg-gradient-to-br",
            cat.gradient,
            "border transition-all duration-500",
            "hover:shadow-[0_8px_40px_-8px_var(--cat-accent)]",
            "hover:-translate-y-1",
          ].join(" ")}
          style={{
            borderColor: `${cat.borderColor}30`,
            ["--cat-accent" as string]: `${cat.accent}60`,
          }}
        >
          {/* Ambient glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${cat.accent}18 0%, transparent 70%)`,
            }}
          />

          {/* Top: number + illustration */}
          <div className="relative h-44 lg:h-52 flex items-center justify-center overflow-hidden">
            {/* CSS illustration */}
            <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-500">
              {cat.illustration}
            </div>

            {/* Subtle horizontal line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${cat.borderColor}40, transparent)` }}
            />
          </div>

          {/* Bottom: content */}
          <div className="px-5 py-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-serif text-xl font-semibold text-[#E9E6D9] group-hover:text-[#E8C97A] transition-colors duration-300 leading-tight">
                {cat.label}
              </h3>
              {/* Arrow */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 mt-0.5 text-[#8A8A8A] group-hover:text-[#BF8E41] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
              >
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </div>

            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: cat.accent }}
            >
              {cat.sub}
            </p>

            <p className="text-xs text-[#8A8A8A] leading-relaxed">
              {cat.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ── Illustrations ───────────────────────────────────────────── */

function GoldBarsIllustration() {
  return (
    <svg width="140" height="90" viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Back bar */}
      <g transform="translate(30, 10)">
        <path d="M10 30 L70 30 L80 18 L20 18 Z" fill="#8A6020" opacity="0.6"/>
        <rect x="10" y="30" width="60" height="32" rx="1" fill="#7A5518" opacity="0.6"/>
        <path d="M70 30 L80 18 L80 50 L70 62 Z" fill="#5A3D10" opacity="0.6"/>
      </g>
      {/* Front bar */}
      <g transform="translate(18, 26)">
        <path d="M10 28 L72 28 L82 16 L20 16 Z" fill="url(#barTop)"/>
        <rect x="10" y="28" width="62" height="34" rx="1" fill="url(#barFront)"/>
        <path d="M72 28 L82 16 L82 50 L72 62 Z" fill="url(#barSide)"/>
        {/* Engraving lines on top */}
        <line x1="26" y1="22" x2="76" y2="22" stroke="#E8C97A" strokeWidth="0.5" opacity="0.5"/>
        <line x1="28" y1="24" x2="74" y2="24" stroke="#E8C97A" strokeWidth="0.5" opacity="0.3"/>
        {/* Weight text */}
        <text x="41" y="48" fill="#E8C97A" fontSize="8" fontFamily="serif" opacity="0.7">100g</text>
      </g>
      <defs>
        <linearGradient id="barTop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#BF8E41"/>
          <stop offset="50%" stopColor="#E8C97A"/>
          <stop offset="100%" stopColor="#BF8E41"/>
        </linearGradient>
        <linearGradient id="barFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9963A"/>
          <stop offset="100%" stopColor="#8A5F1A"/>
        </linearGradient>
        <linearGradient id="barSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A07828"/>
          <stop offset="100%" stopColor="#5A3D10"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function GoldPlatesIllustration() {
  const plates = [
    { y: 0, opacity: 0.45, label: "" },
    { y: 14, opacity: 0.6, label: "" },
    { y: 28, opacity: 0.75, label: "" },
    { y: 42, opacity: 1, label: "20g" },
  ];
  return (
    <svg width="140" height="90" viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(22, 8)">
        {plates.map((p, i) => (
          <g key={i} transform={`translate(${i * 3}, ${p.y})`} opacity={p.opacity}>
            <path d={`M8 18 L82 18 L90 10 L16 10 Z`} fill="url(#plateTop)"/>
            <rect x="8" y="18" width="74" height="18" rx="0.5" fill="url(#plateFront)"/>
            <path d={`M82 18 L90 10 L90 28 L82 36 Z`} fill="url(#plateSide)"/>
            {p.label && (
              <text x="40" y="30" fill="#E8C97A" fontSize="7" fontFamily="serif" opacity="0.8">{p.label}</text>
            )}
          </g>
        ))}
      </g>
      <defs>
        <linearGradient id="plateTop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C8922A"/>
          <stop offset="50%" stopColor="#E8C97A"/>
          <stop offset="100%" stopColor="#BF8E41"/>
        </linearGradient>
        <linearGradient id="plateFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C09030"/>
          <stop offset="100%" stopColor="#7A5515"/>
        </linearGradient>
        <linearGradient id="plateSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9A7020"/>
          <stop offset="100%" stopColor="#4A3010"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function GoldCoinIllustration() {
  return (
    <svg width="120" height="90" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow coin */}
      <ellipse cx="62" cy="76" rx="30" ry="5" fill="#0A0800" opacity="0.5"/>
      {/* Coin body */}
      <circle cx="60" cy="44" r="34" fill="url(#coinOuter)"/>
      <circle cx="60" cy="44" r="29" fill="url(#coinMid)"/>
      {/* Inner ring */}
      <circle cx="60" cy="44" r="24" fill="none" stroke="#E8C97A" strokeWidth="0.75" opacity="0.6"/>
      <circle cx="60" cy="44" r="22" fill="url(#coinInner)"/>
      {/* Rim edge highlight */}
      <circle cx="60" cy="44" r="33" fill="none" stroke="#F0D88A" strokeWidth="0.5" opacity="0.4"/>
      {/* Cross/eagle motif — simplified */}
      <line x1="60" y1="32" x2="60" y2="56" stroke="#C8922A" strokeWidth="1" opacity="0.5"/>
      <line x1="48" y1="44" x2="72" y2="44" stroke="#C8922A" strokeWidth="1" opacity="0.5"/>
      {/* Shine streak */}
      <path d="M42 28 Q52 36 48 50" stroke="#FFFBE8" strokeWidth="2" strokeLinecap="round" opacity="0.18"/>
      {/* Denomination text */}
      <text x="60" y="48" textAnchor="middle" fill="#7A5010" fontSize="9" fontFamily="serif" fontWeight="bold" opacity="0.9">DUKAT</text>
      <defs>
        <radialGradient id="coinOuter" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#F0D060"/>
          <stop offset="60%" stopColor="#BF8E41"/>
          <stop offset="100%" stopColor="#8A6010"/>
        </radialGradient>
        <radialGradient id="coinMid" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#E8C060"/>
          <stop offset="100%" stopColor="#A07020"/>
        </radialGradient>
        <radialGradient id="coinInner" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#D4A840"/>
          <stop offset="100%" stopColor="#9A6818"/>
        </radialGradient>
      </defs>
    </svg>
  );
}
