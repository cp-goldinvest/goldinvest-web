"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { formatRsd, formatWeight } from "@/lib/pricing";

type Props = {
  slug: string;
  name: string;
  weightG: number;
  images: string[];
  availability: "in_stock" | "available_on_request" | "preorder";
  leadTimeWeeks: number | null;
  prices: {
    stock: number;
    advance: number;
    purchase: number;
    onRequest?: boolean;
  };
};

export function ProductCard({ slug, name, weightG, images, availability, leadTimeWeeks, prices }: Props) {
  const href = `/proizvodi/${slug}`;
  const inStock = availability === "in_stock";
  const isPreorder = availability === "preorder";
  const onRequest = prices.onRequest ?? false;

  return (
    <div className="group relative flex flex-col bg-white border border-[#F3F4F6] rounded-2xl overflow-hidden hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300">

      {/* Invisible overlay link */}
      <Link href={href} className="absolute inset-0 z-0" aria-label={`Pogledaj ${name}`} />

      {/* ── Image area ── */}
      <div className="relative bg-[#F9F9F9] overflow-hidden" style={{ height: 305 }}>

        {/* Weight badge — top left */}
        <div
          className="absolute top-3 left-3 z-10 px-2 py-1 rounded-[4px] text-xs font-bold text-[#1B1B1C]"
          style={{ background: "rgba(255,255,255,0.9)" }}
        >
          {formatWeight(weightG)}
        </div>

        {/* Product image */}
        {images[0] ? (
          <Image
            src={images[0]}
            alt={name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : (
          <Image
            src="/images/product-poluga.webp"
            alt={name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        )}
      </div>

      {/* ── Content area ── */}
      <div className="flex flex-col flex-1 px-4 py-5 sm:p-5" style={{ minHeight: 271 }}>

        {/* Product name */}
        <h2 className="text-[#1B1B1C] font-bold leading-snug mb-3 line-clamp-2" style={{ fontSize: 18 }}>
          {name}
        </h2>

        {/* Na stanju — levo, mobile i desktop */}
        <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
          <CheckCircle2 size={14} className={inStock ? "text-green-500" : "text-[#BEAD87]"} />
          <span className="text-xs text-[#464747]">
            {inStock ? "Na stanju" : isPreorder ? `${leadTimeWeeks ?? "?"} ned.` : "Na upit"}
          </span>
        </div>

        {/* Price rows — jedan red (label levo, cena desno) na mobile i desktop */}
        <div className="flex flex-col gap-1.5 mb-5">
          <PriceRow label="Prodajna" labelFull="Prodajna cena" value={onRequest ? "Na upit" : formatRsd(prices.stock)} bold onRequest={onRequest} />
          <PriceRow label="Avansna" labelFull="Avansna cena" value={onRequest ? "Na upit" : formatRsd(prices.advance)} onRequest={onRequest} />
          <PriceRow label="Otkupna" labelFull="Otkupna cena" value={formatRsd(prices.purchase)} muted />
        </div>

        {/* Action buttons — relative z-10 so they intercept clicks over the overlay link */}
        <div className="relative z-10 mt-auto flex items-center gap-2">
          {/* Detalji — muted gold bg */}
          <Link
            href={href}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-w-0 inline-flex items-center justify-center px-2 sm:px-3 py-1.5 rounded-full text-[#1B1B1C] text-xs font-medium whitespace-nowrap transition-opacity hover:opacity-80"
            style={{ background: "rgba(194,178,128,0.39)", fontSize: 11 }}
          >
            Detalji
          </Link>

          {/* Pozovi — outline */}
          <a
            href="tel:+381612698569"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-w-0 inline-flex items-center justify-center px-2 sm:px-3 py-1.5 rounded-full text-[#000] text-xs font-medium whitespace-nowrap transition-colors hover:bg-black/5"
            style={{ border: "0.5px solid rgba(0,0,0,0.75)", fontSize: 11 }}
          >
            Pozovi
          </a>
        </div>
      </div>
    </div>
  );
}

function PriceRow({ label, labelFull, value, bold, muted, onRequest }: { label: string; labelFull?: string; value: string; bold?: boolean; muted?: boolean; onRequest?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2 min-w-0">
      <span className={`text-sm shrink-0 ${muted ? "text-[#666]" : "text-[#464747]"}`}>
        {labelFull ?? label}
      </span>
      {onRequest ? (
        <span className="inline-flex items-center justify-center whitespace-nowrap sm:text-right px-2.5 py-1 rounded-full bg-[#F5F1E5] border border-[#D4C6A4] text-[11px] sm:text-xs font-semibold uppercase tracking-[0.08em] text-[#7A6945]">
          {value}
        </span>
      ) : (
        <span
          className={`whitespace-nowrap sm:text-right tabular-nums ${
            bold
              ? "text-[13px] sm:text-base font-bold text-[#1B1B1C]"
              : muted
              ? "text-[12px] sm:text-sm text-[#555]"
              : "text-[12px] sm:text-[15px] font-medium text-[#1B1B1C]"
          }`}
        >
          {value}
        </span>
      )}
    </div>
  );
}
