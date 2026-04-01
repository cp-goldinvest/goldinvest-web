import Link from "next/link";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

type FaqItem = { q: string; a: string };

type Props = {
  title: string;
  items: FaqItem[];
  ctaHref?: string;
  ctaLabel?: string;
};

export function CategoryFaq({ title, items, ctaHref, ctaLabel }: Props) {
  return (
    <section
      className="py-20"
      style={{ background: "linear-gradient(180deg, #D4C5A3 0%, #E7E5D9 37%, #EFE7DA 100%)" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-start text-left md:items-center md:text-center mb-10">
          <span
            className="text-white"
            style={{ fontFamily: "var(--font-rethink), sans-serif", fontWeight: 400, fontSize: 19, lineHeight: "31px", textShadow: "0 1px 2px rgba(0,0,0,0.12)" }}
          >
            Edukacija
          </span>
          <h2
            style={{ fontFamily: "var(--font-pp-editorial), Georgia, serif", fontWeight: 400, fontStyle: "italic", fontSize: 35, lineHeight: "60px", color: "#1B1B1C" }}
          >
            {title}
          </h2>
        </div>

        <FaqAccordion items={items} questionTag="h3" />

        {ctaHref && ctaLabel && (
          <div className="flex justify-start md:justify-center mt-8">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "#BEAD87", fontSize: "12.1px", boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)" }}
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
