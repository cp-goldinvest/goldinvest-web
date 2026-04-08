import { ReactNode } from "react";
import Image from "next/image";
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
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema, buildFaqSchema, buildItemListSchema } from "@/lib/schema";
import { computePrices, formatWeight } from "@/lib/pricing";

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
  heroPills?: { label: string; href: string; active?: boolean }[];

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
  infoSectionA: InfoSectionData; // e.g. "Koje težine postoje?" - no border-t
  infoSectionB: InfoSectionData; // e.g. "Sertifikati" - has border-t, no info box
  infoSectionBLayout?: "default" | "premium-bento";
  infoSectionBImageSrc?: string;
  infoSectionBImageAlt?: string;
  /** Gold plates only: black card image flush at top, text below (premium-bento). */
  infoSectionBBentoBlackCardImageOnTop?: boolean;

  // Remaining sections - props forwarded directly to existing components
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
  heroPills,
  variants,
  tiers,
  snapshot,
  filterConfig,
  infoSectionA,
  infoSectionB,
  infoSectionBLayout = "default",
  infoSectionBImageSrc = "/images/bento-gold-bar.webp",
  infoSectionBImageAlt = "Zlatna poluga",
  infoSectionBBentoBlackCardImageOnTop = false,
  darkQuote,
  brandsSection,
  delivery,
  priceStructure,
  faq,
}: Props) {
  const isDukatBentoImage = infoSectionBImageAlt === "Zlatni dukat";
  const isPlatesBentoImageOnTop =
    infoSectionBBentoBlackCardImageOnTop && !isDukatBentoImage;

  return (
    <main className="bg-white">
      {/* Schema.org - BreadcrumbList + FAQPage + ItemList */}
      <SchemaScript schema={buildBreadcrumbSchema(breadcrumbs)} />
      <SchemaScript schema={buildFaqSchema(faq.items)} />
      {variants?.length > 0 && (
        <SchemaScript schema={buildItemListSchema(
          variants.map((v: any) => {
            const productName = v.name ?? v.products?.name ?? "Investicioni zlatni proizvod";
            const weight = formatWeight(v.weight_g);
            const normalized = (s: string) => s.toLowerCase().replace(/\s+/g, "");
            const displayName = normalized(productName).includes(normalized(weight))
              ? productName
              : `${productName} ${weight}`.trim();
            const prices = computePrices(v.weight_g, v.products?.category, snapshot, v.pricing_rules ?? null, tiers, v.products?.brand);
            return {
              name: displayName,
              url: `https://goldinvest.rs/proizvodi/${v.slug}`,
              ...(v.images?.[0] ? { image: v.images[0] } : {}),
              ...(!prices.onRequest ? { description: `Prodajna cena: ${prices.stock.toLocaleString("sr-RS")} RSD` } : {}),
            };
          })
        )} />
      )}

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
        pills={heroPills ?? []}
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

      {/* Info section A - no border-t, has optional info box */}
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

      {/* Info section B - border-t, no info box */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            title={infoSectionB.heading}
            description={infoSectionB.description}
            className={infoSectionB.headingClassName}
          />

          {infoSectionBLayout === "premium-bento" ? (
            <>
              <div
                className="hidden md:grid gap-6"
                style={{
                  gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 1fr)",
                  gridTemplateAreas: `
                    "card1 card2"
                    "card3 card2"
                  `,
                }}
              >
                <div
                  className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-7"
                  style={{ gridArea: "card1" }}
                >
                  <p className="text-[#1B1B1C] text-[15px] font-semibold mb-2 leading-snug">
                    {infoSectionB.cards[0].title}
                  </p>
                  <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
                    {infoSectionB.cards[0].body}
                  </p>
                </div>

                <div
                  className="bg-[#0D0D0D] border border-[#232324] rounded-2xl overflow-hidden flex flex-col"
                  style={{ gridArea: "card2" }}
                >
                  {isPlatesBentoImageOnTop ? (
                    <>
                      <div className="pointer-events-none pt-0 pb-2 flex justify-center">
                        <Image
                          src={infoSectionBImageSrc}
                          alt={infoSectionBImageAlt}
                          width={300}
                          height={180}
                          className="object-contain w-[72%] sm:w-[68%] -mt-2"
                        />
                      </div>
                      <div className="px-6 sm:px-7 pb-6 sm:pb-7">
                        <p className="text-[#F4F1E8] text-[15px] font-semibold mb-2 leading-snug">
                          {infoSectionB.cards[1].title}
                        </p>
                        <p className="text-[#D7D0C3] text-[13.5px] leading-relaxed">
                          {infoSectionB.cards[1].body}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`px-6 sm:px-7 pb-6 sm:pb-7 ${isDukatBentoImage ? "pt-6 sm:pt-7" : ""}`}>
                        <p className="text-[#F4F1E8] text-[15px] font-semibold mb-2 leading-snug">
                          {infoSectionB.cards[1].title}
                        </p>
                        <p className="text-[#D7D0C3] text-[13.5px] leading-relaxed">
                          {infoSectionB.cards[1].body}
                        </p>
                      </div>
                      <div
                        className={`pointer-events-none flex justify-center ${isDukatBentoImage ? "mt-auto items-end -mb-9 sm:-mb-10" : "pt-0 pb-2"}`}
                      >
                        <Image
                          src={infoSectionBImageSrc}
                          alt={infoSectionBImageAlt}
                          width={300}
                          height={180}
                          className={`object-contain w-[72%] sm:w-[68%] ${isDukatBentoImage ? "" : "-mt-2"}`}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div
                  className="bg-[#E9E6D9] border border-[#E1DBCB] rounded-2xl p-6 sm:p-7"
                  style={{ gridArea: "card3" }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center mb-5"
                    style={{ background: "rgba(194,178,128,0.22)" }}
                  >
                    <svg width="17" height="13" viewBox="0 0 17 13" fill="none" aria-hidden>
                      <path d="M1.5 6.5L6 11L15.5 1.5" stroke="#BF8E41" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-[#1B1B1C] text-[15px] font-semibold mb-2 leading-snug">
                    {infoSectionB.cards[2].title}
                  </p>
                  <p className="text-[#5B5A57] text-[13.5px] leading-relaxed">
                    {infoSectionB.cards[2].body}
                  </p>
                </div>
              </div>

              <div className="md:hidden grid grid-cols-1 gap-4">
                <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6">
                  <p className="text-[#1B1B1C] text-[15px] font-semibold mb-2 leading-snug">
                    {infoSectionB.cards[0].title}
                  </p>
                  <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
                    {infoSectionB.cards[0].body}
                  </p>
                </div>

                <div className="bg-[#0D0D0D] border border-[#232324] rounded-2xl overflow-hidden flex flex-col">
                  {isPlatesBentoImageOnTop ? (
                    <>
                      <div className="pointer-events-none pt-0 pb-2 flex justify-center">
                        <Image
                          src={infoSectionBImageSrc}
                          alt={infoSectionBImageAlt}
                          width={260}
                          height={160}
                          className="object-contain w-[74%] -mt-1"
                        />
                      </div>
                      <div className="px-6 pb-6">
                        <p className="text-[#F4F1E8] text-[15px] font-semibold mb-2 leading-snug">
                          {infoSectionB.cards[1].title}
                        </p>
                        <p className="text-[#D7D0C3] text-[13.5px] leading-relaxed">
                          {infoSectionB.cards[1].body}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`px-6 pb-6 ${isDukatBentoImage ? "pt-6" : ""}`}>
                        <p className="text-[#F4F1E8] text-[15px] font-semibold mb-2 leading-snug">
                          {infoSectionB.cards[1].title}
                        </p>
                        <p className="text-[#D7D0C3] text-[13.5px] leading-relaxed">
                          {infoSectionB.cards[1].body}
                        </p>
                      </div>
                      <div
                        className={`pointer-events-none flex justify-center ${isDukatBentoImage ? "mt-auto items-end -mb-9" : "pt-0 pb-2"}`}
                      >
                        <Image
                          src={infoSectionBImageSrc}
                          alt={infoSectionBImageAlt}
                          width={260}
                          height={160}
                          className={`object-contain w-[74%] ${isDukatBentoImage ? "" : "-mt-1"}`}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-[#E9E6D9] border border-[#E1DBCB] rounded-2xl p-6">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mb-3"
                    style={{ background: "rgba(194,178,128,0.22)" }}
                  >
                    <svg width="15" height="11" viewBox="0 0 17 13" fill="none" aria-hidden>
                      <path d="M1.5 6.5L6 11L15.5 1.5" stroke="#BF8E41" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-[#1B1B1C] text-[15px] font-semibold mb-2 leading-snug">
                    {infoSectionB.cards[2].title}
                  </p>
                  <p className="text-[#5B5A57] text-[13.5px] leading-relaxed">
                    {infoSectionB.cards[2].body}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {infoSectionB.cards.map((card, i) => (
                <InfoCard key={i} title={card.title}>
                  {card.body}
                </InfoCard>
              ))}
            </div>
          )}
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
