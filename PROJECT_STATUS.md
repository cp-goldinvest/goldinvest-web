# Gold Invest — Project Status
_Last updated: March 2026_

---

## What This Is

Next.js 14 (App Router) e-commerce site for a Belgrade-based physical gold dealer.
Stack: **Next.js 14 · TypeScript · Tailwind CSS · Supabase · Recharts · Lucide**

Live URL: `https://goldinvest.rs`
Repo: `https://github.com/cp-goldinvest/goldinvest-web`
Branch: `main` (deploys directly, no PR gate enforced)

---

## Pages Built

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ Done | Homepage — hero, price ticker, chart, product grid, FAQ, CTA. Has metadata + OG + Organization schema. |
| `/kategorija/zlatne-poluge` | ✅ Done | Full category page via `CategoryPageTemplate`. OG added. |
| `/kategorija/zlatne-plocice` | ✅ Done | Full category page (older structure, mock fallback). OG added. |
| `/kategorija/zlatni-dukati` | ✅ Done | Full category page via `CategoryPageTemplate`. OG added. |
| `/kategorija/zlatne-poluge/[slug]` | ✅ Done | Product detail page (mock fallback). |
| `/kategorija/zlatne-plocice/[slug]` | ✅ Done | Product detail page (mock fallback). |
| `/kategorija/zlatni-dukati/[slug]` | ✅ Done | Product detail page (mock fallback). |
| `/cena-zlata` | ✅ Done | Gold price chart — full currency/unit/period filters, FAQ, educational sections. OG added. |
| `/kako-kupiti` | ✅ Done | Step-by-step buying guide, payment methods, delivery, trust, FAQ. |
| `/otkup-zlata` | ✅ Done | Gold buyback page — process, price formula, payout, FAQ. |
| `/o-nama` | ✅ Done | About page — story, values, comparison vs banks, LBMA brands, FAQ. Organization schema added. |
| `/kontakt` | ✅ Done | Contact page — form, address, working hours, map embed. LocalBusiness schema added. |
| `/faq` | ✅ Done | Standalone FAQ page — 13 questions, BreadcrumbList + FAQPage + WebPage schema. |
| `/blog` | ✅ Done | Blog index — 8 mock articles, category filter, newsletter section. |
| `/poklon-za-krstenje` | ✅ Done | Gift for baptism — products, FAQ, brands, delivery. OG + WebPage schema added. |
| `/pokloni/poklon-za-rodjenje-deteta` | ✅ Done | Gift for baby birth — full SEO page with products, FAQ, local SEO block. |
| `/admin/*` | ✅ Done | Admin panel: cene, zalihe, proizvodi, upiti (Supabase-backed). |

**Not yet built:**
- Individual blog post pages (`/blog/[slug]`) — links exist in BlogGrid but pages return 404
- `/kategorija/srebro` — silver category (footer links to it, page doesn't exist)
- Legal pages (`/uslovi-koriscenja`, `/politika-privatnosti`, `/kolacici`) — footer links, no pages

---

## Technical SEO Status

### ✅ Completed

| Item | Detail |
|---|---|
| `sitemap.xml` | Auto-generated via `src/app/sitemap.ts` — 35 URLs, correct priorities and change frequencies |
| `robots.txt` | Auto-generated via `src/app/robots.ts` — allows all, disallows `/admin/` and `/api/` |
| Canonical tags | Present on all pages via `alternates.canonical` |
| OpenGraph | Present on all pages (homepage, all categories, all info pages, gift pages) |
| `lang="sr"` | Set on root `<html>` |
| `metadataBase` | Set to `https://goldinvest.rs` in root layout |
| BreadcrumbList schema | All pages except homepage |
| FAQPage schema | FAQ, kako-kupiti, otkup-zlata, cena-zlata, all category pages, both poklon pages |
| WebPage schema | All info pages |
| Organization schema | Homepage + `/o-nama` |
| LocalBusiness schema | `/kontakt` — includes address, phone, hours, geo coordinates |
| Phone number | Consistent `061/269-8569` (`+381612698569`) across all pages, header, footer, and WhatIsGoldSection |
| H1 hierarchy | Present on all pages (via CategoryHero title or explicit h1) |
| H2 sections | Present on all content pages |

### ⚠️ Known gaps

| Item | Detail |
|---|---|
| Blog post pages | `/blog/[slug]` pages don't exist — links from BlogGrid are 404 |
| Product schema | `buildProductSchema()` is available in `schema.ts` but not wired to any product page |
| OG images | No `og:image` set on any page — recommended for social sharing (1200×630px) |
| Silver category | `/kategorija/srebro` linked in footer but page doesn't exist |
| Legal pages | Footer links to `/uslovi-koriscenja`, `/politika-privatnosti`, `/kolacici` — all 404 |
| Real price feed | Charts use deterministic mock data; cron job in `/api/cron/fetch-gold` should feed live data |

---

## Component Architecture

### Primitives — `src/components/ui/`
| Component | Purpose |
|---|---|
| `SectionContainer` | `max-w-[1400px] mx-auto px-4 sm:px-8` — used in every section |
| `SectionHeading` | 30px Rethink heading + optional description + optional eyebrow |
| `InfoCard` | `bg-[#F9F9F9] border` card — `ReactNode` title + text body |
| `NumberedCard` | `bg-[#F9F9F9] border` card — numbered circle + title + body |
| `Breadcrumb` | Light/dark variant breadcrumb trail with JSON-LD schema |
| `GoldInvestLogo` | SVG logo component |
| `SchemaScript` | Injects JSON-LD `<script type="application/ld+json">` server-side |

### Catalog — `src/components/catalog/`
| Component | Purpose |
|---|---|
| `CategoryPageTemplate` | Full category page layout — accepts all content as props |
| `CategoryHero` | Gradient hero with serif H1, intro text, optional pills |
| `ProductGrid` | Client component — product cards + FilterSortBar, calculates live prices |
| `ProductCard` | Individual product card with prodajna/avansna/otkupna pricing |
| `FilterSortBar` | Client filters: weight, price, sort |
| `BrandCardsSection` | Brand logo/photo cards grid |
| `DarkQuoteSection` | Black section — eyebrow + serif quote + gold CTA |
| `DeliverySection` | `bg-[#F9F9F9]` — 3 delivery cards + contact buttons |
| `PriceStructureSection` | 3 NumberedCards — Trenutna / Avansna / Otkupna cena |
| `CategoryFaq` | Accordion FAQ with gold gradient background |

### Home — `src/components/home/`
| Component | Purpose |
|---|---|
| `HeroSection` | Homepage hero |
| `GoldPriceChart` | Homepage chart widget — RSD/gram, 7 period tabs, links to `/cena-zlata` |
| `GoldPriceChartFull` | `/cena-zlata` chart — currency (EUR/USD/RSD) + unit (g/oz/kg) + period (1D–MAX) |
| `GoldTypesSection` | "Vrste investicionog zlata" section |
| `PriceBreakdownSection` | Price breakdown education section |
| `EducationCarousel` | Scrollable education cards |
| `FaqSection` | Homepage FAQ accordion |
| `WhatIsGoldSection` | Bottom CTA section — appears on all info and category pages |

### Contact & Blog — `src/components/contact/`, `src/components/blog/`
| Component | Purpose |
|---|---|
| `ContactForm` | Client form — name, phone, email, subject, message; placeholder submit |
| `BlogGrid` | Client component — post cards with category filter tabs |
| `NewsletterSection` | Client component — email input with placeholder submit |

### Layout — `src/components/layout/`
| Component | Purpose |
|---|---|
| `Header` | Fixed nav — mega menu (Ponuda), dropdowns (O zlatu, Pokloni), mobile hamburger |
| `Footer` | 4-col footer — brand, products, info, contact |
| `PriceTicker` | Live gold price ticker bar (polls `/api/prices`) |

---

## Schema.org Coverage

| Schema type | Builder | Used on |
|---|---|---|
| `BreadcrumbList` | `buildBreadcrumbSchema()` | All pages except homepage |
| `FAQPage` | `buildFaqSchema()` | FAQ, kako-kupiti, otkup-zlata, cena-zlata, all category pages, poklon pages |
| `WebPage` | `buildWebPageSchema()` | All info pages |
| `Organization` | `buildOrganizationSchema()` | Homepage, o-nama |
| `LocalBusiness` | `buildLocalBusinessSchema()` | kontakt |
| `Product` | `buildProductSchema()` | Available but not used — wire to product slug pages |

---

## Data Layer

### Supabase Tables (production)
- `product_variants` — variants with weight, purity, stock, availability
- `products` — name, brand, origin, category (`poluga` / `kovanica` / `dukat` / `plocica`)
- `pricing_tiers` — margin percentages (stock/advance/purchase) by weight range
- `gold_price_snapshots` — fetched gold price rows (xau_usd, xau_eur, usd_rsd, eur_rsd)
- `pricing_rules` — per-variant overrides

### API Routes
- `GET /api/prices` — returns latest gold price snapshot
- `POST /api/cron/fetch-gold` — cron job that fetches live gold price and inserts snapshot
- `GET/POST /api/admin/rates` — admin rate management

### Mock Fallback Pattern
Every product page has hardcoded `MOCK_SNAPSHOT`, `MOCK_TIERS`, `MOCK_VARIANTS`. If Supabase is unavailable the page renders with mock data. This keeps the site functional in dev without credentials.

### Shared Utilities
- `src/lib/schema.ts` — all JSON-LD schema builders
- `src/lib/pricing.ts` — `computePrices()`, `formatRsd()`, `formatWeight()`
- `src/lib/chartUtils.ts` — `seededRandom()` (shared between both chart components)

---

## Design System Rules

**Fonts:**
- `var(--font-rethink)` — UI text, headings, nav, cards
- `var(--font-pp-editorial)` — Serif display text (H1 heroes, DarkQuoteSection, FAQ title)

**Colors (key values):**
- `#1B1B1C` — primary dark (text, dark backgrounds)
- `#BEAD87` / `#BF8E41` — gold (CTAs, accents, eyebrows)
- `#F0EDE6` — border color (all section dividers)
- `#F9F9F9` / `#FAFAF8` — card/section background
- `#9D9072` — muted text (descriptions, labels)
- `#0D0D0D` — DarkQuoteSection background

**Pattern:** Tailwind for layout/spacing, inline `style={}` for typography. Do NOT mix them.

**Section spacing:** `py-16 sm:py-20` standard · `py-12` product grid · `py-4` breadcrumb.

**Section dividers:** `border-t border-[#F0EDE6]` between adjacent sections on white background.

---

## Known Technical Debt

- Pre-existing TypeScript errors in `next.config.ts`, `api/cron/fetch-gold/route.ts`, `api/prices/route.ts`, and `ProductGrid.tsx` — existed before current session.
- `ContactForm` and `NewsletterSection` have placeholder submit logic (setTimeout mock) — need wiring to an actual email service or API route.
- Admin login (`/admin/login`) has a TODO for Supabase auth — currently mock check.
- `next.config.ts` has `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true` — masks real errors.

---

## Next Recommended Steps

### High priority
1. **Build `/blog/[slug]` pages** — BlogGrid links to 8 posts, all return 404; add dynamic route with metadata template
2. **Wire `ContactForm`** to a real API route or email service (Resend, SendGrid, etc.)
3. **Connect price feed** — `GoldPriceChart` and `GoldPriceChartFull` should poll `/api/prices` instead of using deterministic mock data
4. **Add OG images** — create a 1200×630 default image and set `openGraph.images` in root metadata; optionally generate per-page OG images with Next.js `ImageResponse`

### Medium priority
5. **Build `/kategorija/srebro`** — silver category page; it's linked in footer and could capture search traffic
6. **Add Product schema** — use `buildProductSchema()` in slug pages (`/[slug]/page.tsx`) for rich results in Google Shopping
7. **Wire newsletter** — `NewsletterSection` submit is a placeholder; connect to Mailchimp, Klaviyo, or custom API route
8. **Build legal pages** — `/uslovi-koriscenja`, `/politika-privatnosti`, `/kolacici` (required for cookie consent and compliance)

### Low priority
9. **Fix pre-existing TS errors** — set `ignoreBuildErrors: false` and resolve the 4 pre-existing issues
10. **`/kategorija/zlatne-plocice` refactor** — currently uses older structure; migrate to `CategoryPageTemplate` for consistency
