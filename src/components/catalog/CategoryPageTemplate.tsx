import { ReactNode } from "react";
import { Info } from "lucide-react";
import type { BrandCard } from "@/components/catalog/BrandCardsSection";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { BrandCardsSection } from "@/components/catalog/BrandCardsSection";
import { DarkQuoteSection } from "@/components/catalog/DarkQuoteSection";
import { DeliverySection } from "@/components/catalog/DeliverySection";
import { PriceStructureSection } from "@/components/catalog/PriceStructureSection";
import { CategoryFaq } from "@/components/catalog/CategoryFaq";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InfoCard } from "@/components/ui/InfoCard";

// ─── Sub-types ────────────────────────────────────────────────────────────────

type BreadcrumbItem = { label: string; href: string };
type FaqItem = { q: string; a: string };
type FilterOption = { label: string; value: number };

type InfoCardData = {
  title: ReactNode;
  body: ReactNode;
};

type InfoSectionData = {
  heading: string;
  description: string;
  /** Extra className forwarded to SectionHeading wrapper, e.g. "py-1" */
  headingClassName?: string;
  cards: [InfoCardData, InfoCardData, InfoCardData];
  /** Optional tip box rendered below the cards (content inside the <p> tag) */
  infoBoxContent?: ReactNode;
};

// ─── Main props ────────────────────────────────────────────────────────────────

type Props = {
  // Breadcrumb + Hero
  breadcrumbs: BreadcrumbItem[];
  heroTitle: string;
  heroIntro: string;

  // ProductGrid
  variants: any;
  tiers: any;
  snapshot: any;
  filterConfig?: {
    showCategoryFilter?: boolean;
    weightOptions?: FilterOption[];
    priceOptions?: FilterOption[];
  };

  // Two middle info sections
  infoSectionA: InfoSectionData; // e.g. "Koje težine postoje?" — no border-t
  infoSectionB: InfoSectionData; // e.g. "Sertifikati" — has border-t, no info box

  // Remaining sections — props forwarded directly to existing components
  darkQuote: {
    eyebrow: string;
    normalText: string;
    italicText: string;
    ctaHref: string;
    ctaLabel: string;
  };
  brandsSection: {
    title: string;
    description: string;
    brands: BrandCard[];
  };
  delivery: {
    heading: string;
    description: string;
    pickupCardBody: string;
  };
  priceStructure: {
    title: string;
    description: string;
    card1Body: string;
    card2Body: string;
    card3Body: string;
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
};

// ─── Template ─────────────────────────────────────────────────────────────────

export function CategoryPageTemplate({
  breadcrumbs,
  heroTitle,
  heroIntro,
  variants,
  tiers,
  snapshot,
  filterConfig,
  infoSectionA,
  infoSectionB,
  darkQuote,
  brandsSection,
  delivery,
  priceStructure,
  faq,
}: Props) {
  return (
    <main className="bg-white">
      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <SectionContainer>
          <Breadcrumb items={breadcrumbs} variant="light" />
        </SectionContainer>
      </section>

      {/* Hero */}
      <CategoryHero
        title={heroTitle}
        introFull={heroIntro}
        pills={[]}
        introMaxWidth="none"
        centerOnDesktop
      />

      {/* Products + Filter/Sort */}
      <section className="bg-white py-12">
        <SectionContainer>
          <ProductGrid
            variants={variants}
            tiers={tiers}
            snapshot={snapshot}
            filterConfig={filterConfig}
          />
        </SectionContainer>
      </section>

      {/* Info section A — no border-t, has optional info box */}
      <section className="bg-white py-16 sm:py-20">
        <SectionContainer>
          <SectionHeading
            title={infoSectionA.heading}
            description={infoSectionA.description}
            className={infoSectionA.headingClassName}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {infoSectionA.cards.map((card, i) => (
              <InfoCard key={i} title={card.title}>
                {card.body}
              </InfoCard>
            ))}
          </div>

          {infoSectionA.infoBoxContent && (
            <div className="mt-10 max-w-[920px] md:mx-auto">
              <div className="bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl px-6 py-5 sm:px-7 sm:py-6 flex gap-4 items-start">
                <span className="mt-0.5 w-10 h-10 rounded-xl bg-[#1B1B1C] text-white flex items-center justify-center shrink-0">
                  <Info size={18} />
                </span>
                <p
                  className="text-[#3A3A3A] leading-relaxed mb-0 text-left md:text-center md:mx-auto"
                  style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 16, lineHeight: "1.6em" }}
                >
                  {infoSectionA.infoBoxContent}
                </p>
              </div>
            </div>
          )}
        </SectionContainer>
      </section>

      {/* Info section B — border-t, no info box */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            title={infoSectionB.heading}
            description={infoSectionB.description}
            className={infoSectionB.headingClassName}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {infoSectionB.cards.map((card, i) => (
              <InfoCard key={i} title={card.title}>
                {card.body}
              </InfoCard>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* Dark quote */}
      <DarkQuoteSection
        eyebrow={darkQuote.eyebrow}
        normalText={darkQuote.normalText}
        italicText={darkQuote.italicText}
        ctaHref={darkQuote.ctaHref}
        ctaLabel={darkQuote.ctaLabel}
      />

      {/* Brands */}
      <BrandCardsSection
        title={brandsSection.title}
        description={brandsSection.description}
        brands={brandsSection.brands}
      />

      {/* Delivery */}
      <DeliverySection
        heading={delivery.heading}
        description={delivery.description}
        pickupCardBody={delivery.pickupCardBody}
      />

      {/* Price structure */}
      <PriceStructureSection
        title={priceStructure.title}
        description={priceStructure.description}
        card1Body={priceStructure.card1Body}
        card2Body={priceStructure.card2Body}
        card3Body={priceStructure.card3Body}
      />

      {/* FAQ */}
      <CategoryFaq
        title={faq.title}
        items={faq.items}
        ctaHref="/#faq"
        ctaLabel="Pogledaj sva pitanja"
      />

      {/* CTA */}
      <WhatIsGoldSection />
    </main>
  );
}
