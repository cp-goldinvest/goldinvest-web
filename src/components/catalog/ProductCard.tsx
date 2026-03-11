"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  };
};

export function ProductCard({
  slug,
  name,
  weightG,
  images,
  availability,
  leadTimeWeeks,
  prices,
}: Props) {
  const [qty, setQty] = useState(1);
  const href = `/proizvodi/${slug}`;
  const inStock = availability === "in_stock";
  const isPreorder = availability === "preorder";
  const canBuy = inStock || isPreorder;

  return (
    /*
     * Overlay-link pattern:
     * The <Link> sits as absolute inset-0 z-0.
     * Interactive elements (qty, button) are relative z-10 and intercept
     * clicks before the link does — card still navigates everywhere else.
     */
    <div className="group relative flex flex-col bg-[#242425] border border-[#2E2E2F] rounded-xl overflow-hidden hover:border-[#BF8E41]/40 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(191,142,65,0.08)]">

      {/* Invisible full-card link */}
      <Link
        href={href}
        className="absolute inset-0 z-0"
        aria-label={`Pogledaj ${name}`}
      />

      {/* ── Image ────────────────────────────────── */}
      <div className="relative aspect-square bg-[#1B1B1C] overflow-hidden">
        {images[0] ? (
          <Image
            src={images[0]}
            alt={name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#2E2E2F] text-5xl">◈</span>
          </div>
        )}

        {/* Availability badge */}
        <div className="absolute top-3 left-3">
          {inStock ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Na stanju
            </span>
          ) : isPreorder ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#BF8E41]/10 text-[#BF8E41] border border-[#BF8E41]/20">
              Dostava za {leadTimeWeeks ?? "?"} ned.
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#2E2E2F] text-[#8A8A8A] border border-[#3A3A3B]">
              Na upit
            </span>
          )}
        </div>
      </div>

      {/* ── Content ──────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Title + weight */}
        <div>
          <h2 className="text-sm font-semibold text-[#E9E6D9] group-hover:text-[#BF8E41] transition-colors leading-snug line-clamp-2">
            {name}
          </h2>
          <p className="text-xs text-[#8A8A8A] mt-0.5">{formatWeight(weightG)}</p>
        </div>

        {/* Prices */}
        <div className="flex flex-col gap-1.5 border-t border-[#2E2E2F] pt-3">
          <PriceRow
            label="Prodajna"
            value={formatRsd(prices.stock)}
            highlight
            dimmed={!canBuy}
          />
          <PriceRow
            label="Avansna"
            value={formatRsd(prices.advance)}
            dimmed={!canBuy}
          />
          <PriceRow
            label="Otkupna"
            value={formatRsd(prices.purchase)}
            small
          />
        </div>

        {/* ── Quantity + CTA ── relative z-10 so they sit above the link */}
        <div className="relative z-10 mt-auto flex flex-col gap-2 pt-1">

          {/* Quantity control — only shown when buyable */}
          {canBuy && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8A8A8A]">Kol.:</span>
              <div className="flex items-center border border-[#2E2E2F] rounded-lg overflow-hidden bg-[#1B1B1C]">
                <button
                  onClick={(e) => { e.preventDefault(); setQty((q) => Math.max(1, q - 1)); }}
                  className="px-3 py-1.5 text-[#E9E6D9] hover:text-[#BF8E41] hover:bg-[#2E2E2F] transition-colors text-sm font-medium"
                  aria-label="Smanji količinu"
                >
                  −
                </button>
                <span className="px-3 py-1.5 text-sm font-semibold text-[#E9E6D9] min-w-[2rem] text-center tabular-nums border-x border-[#2E2E2F]">
                  {qty}
                </span>
                <button
                  onClick={(e) => { e.preventDefault(); setQty((q) => q + 1); }}
                  className="px-3 py-1.5 text-[#E9E6D9] hover:text-[#BF8E41] hover:bg-[#2E2E2F] transition-colors text-sm font-medium"
                  aria-label="Povećaj količinu"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to cart / disabled */}
          <button
            onClick={(e) => { e.preventDefault(); /* TODO: cart logic */ }}
            disabled={!canBuy}
            className={[
              "w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
              canBuy
                ? "gold-gradient-bg text-[#1B1B1C] hover:opacity-90 cursor-pointer"
                : "bg-[#2E2E2F] text-[#555] cursor-not-allowed",
            ].join(" ")}
          >
            {canBuy ? "Dodaj u korpu" : "Pozovite nas"}
          </button>
        </div>

      </div>
    </div>
  );
}

function PriceRow({
  label,
  value,
  highlight = false,
  small = false,
  dimmed = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  small?: boolean;
  dimmed?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-xs ${dimmed ? "text-[#444]" : "text-[#8A8A8A]"}`}>
        {label}:
      </span>
      <span
        className={[
          "font-semibold tabular-nums",
          small ? "text-xs" : "text-sm",
          highlight
            ? dimmed ? "text-[#555]" : "text-[#BF8E41]"
            : dimmed ? "text-[#444]" : "text-[#E9E6D9]",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}
