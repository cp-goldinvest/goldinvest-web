# Gold Invest – Design System i struktura stranica

Referenca za izradu novih stranica po uzoru na HomePage. Koristi ovaj dokument kada kažeš AI-u: *"Napravi stranicu X po strukturi HomePage"*.

---

## 1. Fontovi

| Font | Izvor | CSS varijabla | Namena |
|------|-------|---------------|--------|
| **Rethink Sans** | Google Fonts | `--font-rethink` | Body, paragrafi, linkovi, dugmad, UI |
| **PP Editorial New** | Lokalno `public/fonts/` | `--font-pp-editorial` | Naslovi, citati, display tekst |
| **Space Grotesk** | Google Fonts | `--font-space-grotesk` | Footer naslovi (Proizvodi, Informacije, Kontakt) |

**Učitavanje:** `src/app/layout.tsx`  
**CSS varijable:** `src/app/globals.css` (`--font-sans`, `--font-editorial`)

### Pravila korišćenja

- **Naslovi (h1, h2, h3):** PP Editorial New — Regular za normalan tekst, Italic za citate/akcent
- **Body tekst:** Rethink Sans (inherited od `body`)
- **Footer naslovi:** Space Grotesk Bold

```tsx
// PP Editorial New Regular
style={{ fontFamily: "var(--font-pp-editorial), Georgia, serif", fontWeight: 400, fontStyle: "normal" }}

// PP Editorial New Italic
style={{ fontFamily: "var(--font-pp-editorial), Georgia, serif", fontWeight: 400, fontStyle: "italic" }}

// Rethink Sans (body default)
style={{ fontFamily: "var(--font-rethink), sans-serif" }}
```

---

## 2. Boje (globals.css)

| Token | Hex | Namena |
|-------|-----|--------|
| `--color-onyx` | #1B1B1C | Tamna pozadina, tekst, outline dugmad |
| `--color-gold-yellow` | #BF8E41 | Akcent, labele, CTA |
| `--color-champagne` | #E9E6D9 | Svetli tekst, pozadine |
| `--color-sand` | #E9E6D9 | Svetle površine |
| `#BEAD87` | — | Zlatno-champagne (dugmad, hover) |
| `#0D0D0D` | — | Tamna sekcija (citat) |
| `#1B1B1C` | — | Tamna pozadina sekcija |

---

## 3. Struktura HomePage (redosled sekcija)

```
1. HeroSection
2. ProductGrid (proizvodi)
3. GoldTypesSection (vrste i pravila)
4. Citat sekcija (tamna pozadina #0D0D0D)
5. PriceBreakdownSection
6. GoldPriceChart
7. EducationCarousel
8. FaqSection
9. WhatIsGoldSection (CTA iznad footera)
```

---

## 4. Layout pattern za sekcije

```tsx
<main className="bg-white">
  <section className="bg-white py-12">  {/* ili py-20 za veće sekcije */}
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-24">
      {/* sadržaj */}
    </div>
  </section>
</main>
```

- **Max širina:** `1400px`
- **Padding:** `px-4 sm:px-8` (opciono `lg:px-24` za hero)
- **Vertikalni razmak:** `py-12` do `py-20` / `py-24`

---

## 5. Sekcija – label + naslov

```tsx
<span className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-6">
  Label (npr. Investicija, Edukacija)
</span>
<h2
  style={{
    fontFamily: "var(--font-pp-editorial), Georgia, serif",
    fontSize: "clamp(22px, 3.2vw, 42px)",
    fontWeight: 400,
    fontStyle: "italic",  // opciono za citate
  }}
>
  Naslov
</h2>
```

---

## 6. Dugmad

**Primarno (zlatno):**
```tsx
<Link
  href="..."
  className="inline-flex items-center justify-center px-7 py-3 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:opacity-90"
  style={{
    backgroundColor: "#BEAD87",
    fontSize: "12.1px",
    boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)",
  }}
>
  Saznaj više
</Link>
```

**Outline (tamno):**
```tsx
<Link
  href="..."
  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:bg-[#1B1B1C] hover:text-white"
  style={{ border: "0.5px solid #1B1B1C", fontSize: "clamp(11px, 2.5vw, 12.1px)" }}
>
  Label
</Link>
```

---

## 7. Komponente

| Komponenta | Fajl | Namena |
|------------|------|--------|
| HeroSection | `home/HeroSection.tsx` | Hero sa naslovom, tekstom, dugmadima, slikom |
| **CategoryHero** | `catalog/CategoryHero.tsx` | Hero za kategorijske stranice (gradient, h1, expandable intro, pills) |
| **SeoSection** | `catalog/SeoSection.tsx` | H2 + sadržaj blok za SEO sekcije |
| **CategoryFaq** | `catalog/CategoryFaq.tsx` | FAQ accordion za kategorije (H2 + H3 pitanja) |
| ProductGrid | `catalog/ProductGrid.tsx` | Mreža proizvoda (uključuje FilterSortBar) |
| GoldTypesSection | `home/GoldTypesSection.tsx` | Vrste zlata, pravila |
| PriceBreakdownSection | `home/PriceBreakdownSection.tsx` | Spot cena, premija |
| GoldPriceChart | `home/GoldPriceChart.tsx` | Grafikon cene |
| EducationCarousel | `home/EducationCarousel.tsx` | Edukativni slajdovi |
| FaqSection | `home/FaqSection.tsx` | FAQ accordion (homepage) |
| WhatIsGoldSection | `home/WhatIsGoldSection.tsx` | CTA iznad footera |
| CategoryCards | `home/CategoryCards.tsx` | Kartice kategorija |
| Breadcrumb | `ui/Breadcrumb.tsx` | Navigacija putanje (`variant="light"` za belu pozadinu) |
| Header, Footer | `layout/` | Navigacija, footer |

---

## 8. Hero pozadina

```css
background: linear-gradient(138.26deg, #BAA77F 1.38%, #E7E5D9 60.02%, #EFE7DA 97.1%);
```

---

## 9. Utility klase

- `.gold-gradient` — zlatni gradient na tekstu
- `.gold-gradient-bg` — zlatni gradient na pozadini
- `.scrollbar-hide` — sakriva scrollbar
- `.animate-marquee` — animacija za announcement bar

---

## 10. Primjer nove stranice

```tsx
// src/app/(site)/nova-stranica/page.tsx
import { HeroSection } from "@/components/home/HeroSection";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";

export default function NovaStranicaPage() {
  return (
    <main className="bg-white">
      {/* Hero ili custom naslov */}
      <section className="bg-white py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <span className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-6">
            Label
          </span>
          <h1
            style={{
              fontFamily: "var(--font-pp-editorial), Georgia, serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 400,
            }}
          >
            Naslov stranice
          </h1>
          <p className="text-[#3A3A3A] mt-6" style={{ fontFamily: "var(--font-rethink), sans-serif" }}>
            Body tekst...
          </p>
        </div>
      </section>

      {/* Ostale sekcije po potrebi */}

      <WhatIsGoldSection />
    </main>
  );
}
```

---

*Poslednje ažuriranje: mart 2026*
