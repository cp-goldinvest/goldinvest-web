import Link from "next/link";
import { SectionContainer } from "@/components/ui/SectionContainer";

type Props = {
  eyebrow: string;
  normalText: string;
  italicText: string;
  ctaHref: string;
  ctaLabel: string;
};

export function DarkQuoteSection({ eyebrow, normalText, italicText, ctaHref, ctaLabel }: Props) {
  return (
    <section className="bg-[#0D0D0D] py-16 sm:py-20">
      <SectionContainer className="flex flex-col items-start text-left md:items-center md:text-center">
        <span className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-6 block">
          {eyebrow}
        </span>
        <h2
          className="text-white leading-[1.15] mb-10 max-w-[820px]"
          style={{
            fontFamily: "var(--font-pp-editorial), Georgia, serif",
            fontSize: "clamp(22px, 3.2vw, 42px)",
            fontWeight: 400,
          }}
        >
          <span style={{ fontStyle: "normal" }}>{normalText}</span>
          <br />
          <span style={{ fontStyle: "italic" }}>{" "}{italicText}</span>
        </h2>
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center px-7 py-3 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:opacity-90"
          style={{
            backgroundColor: "#BEAD87",
            fontSize: "12.1px",
            boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)",
          }}
        >
          {ctaLabel}
        </Link>
      </SectionContainer>
    </section>
  );
}
