// ─── Schema.org JSON-LD builder functions ─────────────────────────────────
// Usage: pass the result to <SchemaScript schema={...} />

const BASE_URL = "https://goldinvest.rs";

// ── BreadcrumbList ─────────────────────────────────────────────────────────
export function buildBreadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${BASE_URL}${item.href}`,
    })),
  };
}

// ── FAQPage ────────────────────────────────────────────────────────────────
export function buildFaqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

// ── Product ────────────────────────────────────────────────────────────────
export function buildProductSchema(data: {
  name: string;
  description: string;
  brand: string;
  slug: string;
  image?: string;
  purity?: string;
  weightGrams?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    description: data.description,
    brand: {
      "@type": "Brand",
      name: data.brand,
    },
    url: `${BASE_URL}${data.slug}`,
    ...(data.image ? { image: `${BASE_URL}${data.image}` } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "RSD",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Gold Invest",
        url: BASE_URL,
      },
    },
    ...(data.purity || data.weightGrams
      ? {
          additionalProperty: [
            ...(data.purity
              ? [{ "@type": "PropertyValue", name: "Cistoca", value: data.purity }]
              : []),
            ...(data.weightGrams
              ? [{ "@type": "PropertyValue", name: "Tezina", value: `${data.weightGrams}g` }]
              : []),
          ],
        }
      : {}),
  };
}

// ── Organization ───────────────────────────────────────────────────────────
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Gold Invest",
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    telephone: "+381612698569",
    email: "info@goldinvest.rs",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bulevar oslobođenja 123",
      addressLocality: "Beograd",
      postalCode: "11000",
      addressCountry: "RS",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+381612698569",
      contactType: "customer service",
      availableLanguage: "Serbian",
      areaServed: "RS",
    },
    sameAs: [
      "https://www.facebook.com/goldinvest",
      "https://www.instagram.com/goldinvest",
    ],
  };
}

// ── LocalBusiness ──────────────────────────────────────────────────────────
export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#localbusiness`,
    name: "Gold Invest",
    url: BASE_URL,
    telephone: "+381612698569",
    email: "info@goldinvest.rs",
    priceRange: "€€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bulevar oslobođenja 123",
      addressLocality: "Beograd",
      postalCode: "11000",
      addressCountry: "RS",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 44.7866,
      longitude: 20.4489,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "13:00",
      },
    ],
  };
}

// ── WebPage (for non-product pages like /cena-zlata) ──────────────────────
export function buildWebPageSchema(data: { name: string; description: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: data.name,
    description: data.description,
    url: `${BASE_URL}${data.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Gold Invest",
      url: BASE_URL,
    },
  };
}
