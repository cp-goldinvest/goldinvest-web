import type { ReactNode } from "react";
import Link from "next/link";

type Pill = { label: string; href: string; active?: boolean };

type Props = {
  title: string;
  introFull: ReactNode;
  pills: Pill[];
  /** Default 640. Set to "none" to remove max width. */
  introMaxWidth?: number | "none";
  /** Center title + intro on desktop, keep left on mobile. */
  centerOnDesktop?: boolean;
  // kept for backward compat but no longer used
  introFirstSentence?: string;
  expandableIntro?: boolean;
};

export function CategoryHero({ title, introFull, pills, introMaxWidth = 640, centerOnDesktop = false }: Props) {
  return (
    <section
      className="overflow-hidden"
      style={{ background: "linear-gradient(138.26deg, #BAA77F 1.38%, #E7E5D9 60.02%, #EFE7DA 97.1%)" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-16 lg:px-24">
        <div className={`py-8 sm:py-10 ${centerOnDesktop ? "md:text-center" : ""}`}>
          <h1
            className="text-[#1B1B1C] leading-[1.13] mb-4"
            style={{ fontFamily: "var(--font-pp-editorial), Georgia, serif", fontSize: "clamp(32px, 4.2vw, 52px)", fontWeight: 400 }}
          >
            {title}
          </h1>

          <div
            className="text-[#3A3A3A] mb-5 leading-relaxed"
            style={{
              fontSize: "clamp(14px, 1.2vw, 17px)",
              maxWidth: introMaxWidth === "none" ? undefined : introMaxWidth,
              marginLeft: centerOnDesktop ? "auto" : undefined,
              marginRight: centerOnDesktop ? "auto" : undefined,
            }}
          >
            <p>{introFull}</p>
          </div>

          {pills.length > 0 && (
            <div className={`flex flex-wrap gap-2 sm:gap-3 ${centerOnDesktop ? "md:justify-center" : ""}`}>
              {pills.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className={`inline-flex items-center justify-center px-3 py-2 sm:px-5 sm:py-2.5 rounded-full font-semibold transition-all duration-200 whitespace-nowrap ${
                    p.active ? "bg-[#1B1B1C] text-white" : "text-[#1B1B1C] hover:bg-[#1B1B1C] hover:text-white"
                  }`}
                  style={{ border: "0.5px solid #1B1B1C", fontSize: "clamp(11px, 2.5vw, 12.1px)" }}
                >
                  {p.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
