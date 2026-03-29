"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const FALLBACK = "/images/product-poluga.png";

const LABELS = ["Prednja", "Zadnja"] as const;

type Props = {
  images: string[] | null | undefined;
  productName: string;
};

export function ProductHeroImage({ images, productName }: Props) {
  const list = useMemo(() => {
    const raw = (images ?? []).filter((u) => typeof u === "string" && u.length > 0);
    const unique = [...new Set(raw)];
    return unique.length ? unique : [FALLBACK];
  }, [images]);

  const [idx, setIdx] = useState(0);
  const safeIdx = Math.min(idx, list.length - 1);
  const current = list[safeIdx] ?? FALLBACK;
  const hasMultiple = list.length > 1;

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm"
      style={{
        boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
        minHeight: 340,
        maxHeight: 480,
        height: "clamp(340px, 36vw, 480px)",
      }}
    >
      <Image
        key={current}
        src={current}
        alt={
          hasMultiple
            ? `${productName} — ${
                safeIdx === 0 ? "prednja strana" : safeIdx === 1 ? "zadnja strana" : `slika ${safeIdx + 1}`
              }`
            : productName
        }
        fill
        priority
        className="object-contain p-10 sm:p-14"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />

      {hasMultiple && (
        <div
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[1] flex max-w-[min(100%-1.5rem,220px)] flex-wrap justify-end gap-0.5 rounded-full p-[3px]"
          role="tablist"
          aria-label="Strane proizvoda"
          style={{
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "0.5px solid rgba(27,27,28,0.08)",
            boxShadow: "0 1px 12px rgba(0,0,0,0.04)",
          }}
        >
          {list.map((url, i) => {
            const label = LABELS[i] ?? `Slika ${i + 1}`;
            const active = i === safeIdx;
            return (
              <button
                key={`${url}-${i}`}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setIdx(i)}
                className="min-w-0 rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] font-medium tracking-wide transition-colors duration-200"
                style={{
                  color: active ? "#1B1B1C" : "#7A7A7A",
                  background: active ? "rgba(255,255,255,0.92)" : "transparent",
                  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div
        className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm"
        style={{ border: "0.5px solid rgba(190,173,135,0.5)" }}
      >
        <span
          className="text-[#BF8E41] font-semibold"
          style={{ fontSize: 10.5, letterSpacing: "0.05em" }}
        >
          LBMA GOOD DELIVERY
        </span>
      </div>
    </div>
  );
}
