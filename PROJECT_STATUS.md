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
| `/` | ✅ Done | Homepage — hero, price ticker, chart, category cards, FAQ, CTA |
| `/kategorija/zlatne-poluge` | ✅ Done | Full category page via `CategoryPageTemplate` |
| `/kategorija/zlatni-dukati` | ✅ Done | Full category page via `CategoryPageTemplate` |
| `/kategorija/zlatne-plocice` | ✅ Done | Full category page (older structure, mock fallback) |
| `/kategorija/zlatne-poluge/[slug]` | ✅ Done | Product detail page (mock fallback) |
| `/kategorija/zlatne-plocice/[slug]` | ✅ Done | Product detail page (mock fallback) |
| `/cena-zlata` | ✅ Done | Gold price chart page — full currency/unit/period filters, educational sections |
| `/admin/*` | ✅ Done | Admin panel: cene, zalihe, proizvodi, upiti (Supabase-backed) |

**Still needed:**
- `/kontakt` — contact page (linked in DeliverySection buttons but not built)
- `/kategorija/zlatni-dukati/[slug]` — product detail for dukati
- `/o-nama` — about page (not linked yet)

---

## Component Architecture

### Primitives — `src/components/ui/`
| Component | Purpose |
|---|---|
| `SectionContainer` | `max-w-[1400px] mx-auto px-4 sm:px-8` — used in every section |
| `SectionHeading` | 30px Rethink heading + optional description + optional eyebrow |
| `InfoCard` | `bg-[#F9F9F9] border` card — `ReactNode` title + text body |
| `IconCard` | `bg-white border` card — dark icon square + title + body |
| `NumberedCard` | `bg-[#F9F9F9] border` card — numbered circle + title + body |
| `Breadcrumb` | Light/dark variant breadcrumb trail |
| `GoldInvestLogo` | SVG logo component |

### Catalog — `src/components/catalog/`
| Component | Purpose |
|---|---|
| `CategoryPageTemplate` | Full category page layout — accepts all content as props, renders all sections |
| `CategoryHero` | Gradient hero with serif H1, intro text, optional pills |
| `ProductGrid` | Client component — product cards + FilterSortBar, calculates live prices |
| `ProductCard` | Individual product card with prodajna/avansna/otkupna pricing |
| `FilterSortBar` | Client filters: weight, price, sort — used inside ProductGrid |
| `BrandCardsSection` | Brand logo/photo cards grid |
| `DarkQuoteSection` | Black `bg-[#0D0D0D]` section — eyebrow + serif quote + gold CTA |
| `DeliverySection` | `bg-[#F9F9F9]` — 3 delivery IconCards + Kontakt/Pozovi buttons |
| `PriceStructureSection` | 3 NumberedCards — Trenutna / Avansna / Otkupna cena |
| `CategoryFaq` | Accordion FAQ with gold gradient background |
| `SeoSection` | (unused, exists but not referenced in current pages) |

### Home — `src/components/home/`
| Component | Purpose |
|---|---|
| `HeroSection` | Homepage hero |
| `GoldPriceChart` | Homepage chart widget — RSD/gram, 7 period tabs, links to `/cena-zlata` |
| `GoldPriceChartFull` | `/cena-zlata` chart — currency (EUR/USD/RSD) + unit (g/oz/kg) + period (1D–MAX) filters |
| `CategoryCards` | 3 category cards on homepage |
| `GoldTypesSection` | "Vrste investicionog zlata" section |
| `PriceBreakdownSection` | Price breakdown education section |
| `EducationCarousel` | Scrollable education cards |
| `FaqSection` | Homepage FAQ accordion |
| `GallerySection` | Photo gallery section |
| `WhatIsGoldSection` | Bottom CTA section — appears on all category pages |

### Layout — `src/components/layout/`
| Component | Purpose |
|---|---|
| `Header` | Navigation header |
| `Footer` | Site footer |
| `PriceTicker` | Live gold price ticker bar |
| `PhoneBar` | Static mobile top bar with phone number |

---

## Data Layer

### Supabase Tables (production)
- `product_variants` — variants with weight, purity, stock, availability
- `products` — name, brand, origin, category (`poluga` / `kovanica` / `dukat` / `plocica`)
- `pricing_tiers` — margin percentages (stock/advance/purchase) by weight range
- `gold_price_snapshots` — fetched gold price rows (xau_usd, xau_eur, usd_rsd, eur_rsd, price_per_g_rsd)
- `pricing_rules` — per-variant overrides

### Pricing Logic (`src/app/api/pricing.ts`)
All price calculation lives here. ProductGrid uses it client-side with snapshot + tiers.

### API Routes
- `GET /api/prices` — returns latest gold price snapshot
- `POST /api/cron/fetch-gold` — cron job that fetches live gold price and inserts snapshot
- `GET/POST /api/admin/rates` — admin rate management

### Mock Fallback Pattern
Every category page has hardcoded `MOCK_*` constants. If Supabase is unavailable or ENV vars are missing, the page renders with mock data. This keeps the site functional in dev without Supabase credentials.

---

## Design System Rules

**Fonts:**
- `var(--font-rethink)` — UI text, headings (SectionHeading, cards, nav)
- `var(--font-pp-editorial)` — Serif display text (H1 heroes, DarkQuoteSection, FAQ title)

**Colors (key values):**
- `#1B1B1C` — primary dark (text, dark backgrounds)
- `#BEAD87` / `#BF8E41` — gold (CTAs, accents, eyebrows)
- `#F0EDE6` — border color (all section dividers)
- `#F9F9F9` — card/section background
- `#9D9072` — muted text (descriptions, labels)
- `#0D0D0D` — DarkQuoteSection background

**Pattern:** Tailwind for layout/spacing, inline `style={}` for typography (font, size, line-height, letter-spacing). Do NOT mix them.

**Section spacing:** `py-16 sm:py-20` — standard. `py-12` — product grid section. `py-4` — breadcrumb.

**Section dividers:** `border-t border-[#F0EDE6]` between adjacent sections on white background.

**Card grids:** Always `grid-cols-1 md:grid-cols-3 gap-6` for 3 cards. Use `sm:grid-cols-2 lg:grid-cols-3` for 5 cards.

---

## SEO Content

Located in `/seo/` directory:
- `Cena zlata - Izrada sadržaja (Mart 2026) - Gold Invest.md` — ✅ **Mapped** into `/cena-zlata`

**Content still needed (not yet written):**
- SEO pages for `/kontakt`, `/o-nama`
- Blog/education articles (if planned)

---

## Known Issues / Technical Debt

- Pre-existing TypeScript errors in `next.config.ts`, `src/app/api/cron/fetch-gold/route.ts`, `src/app/api/prices/route.ts`, and `ProductGrid.tsx` — these existed before current work, not introduced by the component refactor.
- `SeoSection` component exists but is unused — can be deleted.
- `GoldPriceChart` (homepage) and `GoldPriceChartFull` (/cena-zlata) both use mock/generated data. Neither connects to a real price feed yet — that's the cron job's job in production.
- `/kontakt` route is linked from `DeliverySection` buttons but the page doesn't exist yet.

---

## What Was Done This Session

1. Built `/kategorija/zlatni-dukati` page (modeled on zlatne-poluge)
2. Extracted 5 UI primitives: `SectionContainer`, `SectionHeading`, `InfoCard`, `IconCard`, `NumberedCard`
3. Extracted 3 section components: `DarkQuoteSection`, `DeliverySection`, `PriceStructureSection`
4. Created `CategoryPageTemplate` — full category page layout as a single reusable component
5. Refactored `zlatne-poluge` and `zlatni-dukati` pages to use `CategoryPageTemplate`
6. Built `/cena-zlata` page with `GoldPriceChartFull` (currency + unit + period filters)

---

## Next Session — Suggested Priorities

1. **Build `/kontakt` page** — contact form, address, map embed (linked everywhere, currently 404)
2. **`/kategorija/zlatni-dukati/[slug]`** — product detail page for dukati (poluge and plocice already have it)
3. **Connect real price feed** — wire `GoldPriceChart` and `GoldPriceChartFull` to `/api/prices` instead of mock data
4. **Refactor `zlatne-plocice` page** to use `CategoryPageTemplate` (currently older structure)
5. **Delete `SeoSection`** — unused component
