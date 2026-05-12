# DB analiza — GoldInvest + Zlatne Pločice (multi-brand)

> Datum: 2026-05-06
> Cilj: pripremiti `goldinvest-web` Supabase bazu za novi sajt **Zlatne Pločice** (zasebni e-commerce
> sa korpom + 15-minutnim lock-inom cene), uz deljenje proizvoda i zaliha sa GoldInvest projektom.
> Zalihe **ostaju centralizovane na GoldInvest backendu** i ne dupliraju se po brendu.

---

## 1. TRENUTNO STANJE BAZE

Šema je u `supabase/migrations/` (Postgres preko Supabase). Trenutno je single-tenant — sve je
GoldInvest-ovo, ne postoji nijedna kolona ni tabela koja razlikuje "kog brenda" je porudžbina,
cena ili upit. Postojeće tabele:

### 1.1 `products`
Jedan red po proizvodnoj liniji (npr. "Argor-Heraeus zlatna poluga").
| kolona | tip | napomena |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `slug` | text UNIQUE NOT NULL | URL slug |
| `name` | text NOT NULL | naziv |
| `category` | text NOT NULL | CHECK (`poluga`, `plocica`, `dukat`, `multipack`) — *u kodu*; u initial migration `novac`, što znači da je migrirano kasnije van `migrations/` foldera |
| `brand` | text NOT NULL | **proizvodni brend** (Argor-Heraeus, C. Hafner, Münze Österreich…). Slobodan tekst, ne FK. |
| `refinery` | text | rafinerija |
| `origin` | text | zemlja porekla |
| `description`, `properties`, `payment_info`, `declaration`, `tax_info` | text | sadržaj tabova na proizvod stranici |
| `is_active` | boolean | RLS gate |
| `created_at` | timestamptz | |

Indeksi: `category`, `slug`. RLS: public SELECT kad `is_active`, admin FULL preko `auth.jwt → app_metadata.role = 'admin'`.

### 1.2 `product_variants`
Jedan red po težinskoj varijanti.
| kolona | tip | napomena |
|---|---|---|
| `id` | uuid PK | |
| `product_id` | uuid FK → `products.id` ON DELETE CASCADE | |
| `slug` | text UNIQUE NOT NULL | |
| `weight_g` | numeric(10,4) NOT NULL | |
| `weight_oz` | numeric(10,6) GENERATED `weight_g/31.1035` STORED | |
| `purity` | integer NOT NULL DEFAULT 9999 | u promilima |
| `fine_weight_g` | numeric GENERATED `weight_g*purity/10000` STORED | |
| `name` | text NULL | (dodato kasnijom migracijom) display-name |
| `sku` | text UNIQUE | |
| `stock_qty` | integer NOT NULL DEFAULT 0 | rezervisano (vidi napomenu) |
| `availability` | text NOT NULL | CHECK (`in_stock`, `available_on_request`, `preorder`) |
| `lead_time_weeks` | integer | samo za `preorder` |
| `images` | text[] | URL-ovi |
| `sort_order` | integer | |
| `is_active` | boolean | |

Napomena: `stock_qty` postoji ali fizički lager se zapravo vodi u tabeli `lager_items` (vidi 1.7) — broj komada na lageru za varijantu = `count(lager_items.variant_id = X)`.

### 1.3 `pricing_tiers`
Margine po težini/kategoriji/proizvodnom brendu. Ovo je glavni "default" sloj cena.
| kolona | tip | napomena |
|---|---|---|
| `id` | uuid PK | |
| `name` | text NOT NULL | čovekovi opis ("Poluge male") |
| `category` | text NULL | NULL = sve kategorije |
| `weight_g` | numeric NULL | u **trenutnom kodu** je tačan match po težini (single column). U initial migration je bilo `min_g`/`max_g` raspon — šema je migrirana van repo foldera. Treba sinhronizovati. |
| `brand` | text NULL | NULL = bazni tier; non-null = override za određeni *proizvodni* brend. Za `category='dukat'`/`'multipack'` polje drži ime varijante (heuristika u kodu). |
| `margin_stock_pct` | numeric NOT NULL | |
| `margin_advance_pct` | numeric NOT NULL | |
| `margin_purchase_pct` | numeric NOT NULL | otkup (negativan) |
| `created_at` | timestamptz | |

**Resolution chain** u `src/lib/pricing.ts:31-65`:
brand+weight+cat → brand+weight → brand+null-weight+cat → brand+null-weight → null-brand fallback chain → hardkodovan default 3/2/-2%.

### 1.4 `pricing_rules` (overrides)
Po-varijanti hard-coded cena koja gazi tier formulu.
| kolona | tip | napomena |
|---|---|---|
| `id` | uuid PK | |
| `variant_id` | uuid FK → `product_variants.id` ON DELETE CASCADE, **UNIQUE** | jedan red po varijanti |
| `override_stock_price` | numeric NULL | NULL = koristi tier |
| `override_advance_price` | numeric NULL | |
| `override_purchase_price` | numeric NULL | |
| `updated_at`, `updated_by` | | audit |

### 1.5 `gold_price_snapshots`
Cron snima svakih 5 min iz `/api/cron/fetch-gold` (goldprice.org → swissquote → goldapi → yahoo).
Admin može ručno upisati EUR/RSD preko `/api/admin/rates`.
| kolona | tip | napomena |
|---|---|---|
| `id` | uuid PK | |
| `xau_usd`, `xau_eur` | numeric NULL | spot u USD/EUR po troy oz |
| `usd_rsd`, `eur_rsd` | numeric NULL | |
| `price_per_g_rsd` | numeric GENERATED — preferira EUR×eur_rsd, fallback USD×usd_rsd | |
| `source` | text DEFAULT `'goldapi'` | u praksi `'auto'` ili `'manual_rates'` |
| `eur_rsd_source` | text NULL | CHECK `manual`/`api`/`fallback` |
| `fetched_at` | timestamptz | |

### 1.6 `purchase_inquiries`
"Pošalji upit" forma — nije porudžbina, samo lead. Završetak preko telefona / uživo.
| kolona | tip | napomena |
|---|---|---|
| `id` | uuid PK | |
| `variant_id` | uuid FK → `product_variants` ON DELETE SET NULL | |
| `product_name`, `weight_g`, `price_at_time` | snapshot u trenutku slanja | |
| `client_name`, `client_phone` | NOT NULL | |
| `client_email` | NULL | |
| `quantity` | integer DEFAULT 1 | |
| `note` | text | |
| `status` | text | CHECK `new`/`contacted`/`sold`/`cancelled` |
| `created_at` | timestamptz | |

### 1.7 `lager_items` (fizički lager)
Postoji u kodu (`/api/admin/lager`), nije u `migrations/` folderu.
| kolona | tip | napomena |
|---|---|---|
| `id` | uuid PK | |
| `variant_id` | uuid FK → `product_variants` | |
| `purchase_price_rsd` | numeric NOT NULL | nabavna cena pojedinačnog komada |
| `purchased_at` | date | |
| `note` | text | |
| `created_at` | timestamptz | |

Brisanje reda = "prodato". Broj na lageru = `COUNT` po `variant_id`. P&L se računa razlikom prodajne cene (preko brand-aware tier-a) i `purchase_price_rsd`.

### 1.8 `admin_users`
| kolona | tip |
|---|---|
| `id` uuid, `email` text, `full_name` text NULL, `is_active` boolean, `created_at` timestamptz |

Stvarna admin autorizacija ide preko `auth.jwt() -> app_metadata ->> 'role' = 'admin'` (Supabase Auth claim).

### 1.9 Relacije (sumarno)
```
products 1 ── n product_variants 1 ── 0..1 pricing_rules
                              1 ── n  lager_items
                              1 ── n  purchase_inquiries (SET NULL)
pricing_tiers — soft-join preko (category, weight_g, brand) — bez FK na products
gold_price_snapshots — nezavisno, vremenska serija
admin_users — nezavisno
```

### 1.10 Šta NE postoji u bazi (a treba za e-commerce)
- nema `customers` (registrovani ili guest kupci)
- nema `carts` / `cart_items` (korpa)
- nema `orders` / `order_items` (završene porudžbine, za razliku od "upita")
- nema `payments` / `invoices`
- nema dimenzije "kog sajta / kog brenda" — sve je implicitno GoldInvest
- nema mehanizma za **lock-in cene 15 min**
- nema `brands` tabele (proizvodni brand je free-text)
- nema per-site SEO/sadržaja
- sadržaj statičnih stranica (o nama, kako kupiti, FAQ) je u Sanity, ali bez site filtera

---

## 2. ŠTA JE DELJENO A ŠTA NIJE

Pravilo zadatka: **zalihe se ne dupliraju** — ostaju na GoldInvest backendu i čitaju se iz iste tabele za oba sajta.

### Deljeno (1 zapis za oba sajta)
| stvar | tabela / izvor | obrazloženje |
|---|---|---|
| Proizvodi i varijante | `products`, `product_variants` | nema duplog unosa |
| Fizički lager | `lager_items` | jedinstveni izvor istine; sprečava dvostruku prodaju iste pločice |
| Spot cena zlata | `gold_price_snapshots` | jedan feed |
| Proizvodni brendovi (Argor-Heraeus…) | `products.brand` | atribut proizvoda, ne sajta |
| Kovnice/rafinerije | `products.refinery`, `products.origin` | atribut proizvoda |
| Bazni tieri | `pricing_tiers` (red sa `site_key=NULL` posle migracije) | GI default |

### Brand-specific (mora se razdvojiti po sajtu)
Pod "brand" ovde = **store/site brand** (GoldInvest vs Zlatne Pločice), ne proizvodni brend.

| stvar | predlog mesta | obrazloženje |
|---|---|---|
| Marže (margin_*_pct) | `pricing_tiers.site_key` ili `pricing_tiers_site` join | ZP ima drugačije marže, mora nezavisno |
| Override cene po varijanti | `pricing_rules.site_key` | retko se koristi, ali mora biti per-site |
| Porudžbine kupaca | nova tabela `orders` sa `site_key` kolonom | ZP je jedini sa korpom |
| Lock-in cene | nova tabela `price_quotes` sa `site_key` | ZP feature |
| Sadržaj stranica (o nama, FAQ, kako kupiti…) | Sanity, dodati `site` polje na document | različite stranice po sajtu |
| Per-proizvod sadržaj (description/properties tabovi) ako se razlikuje | nova `product_site_content (product_id, site_key, …override polja)` ili sve u Sanity | NULL polja = naslijedi iz `products` |
| Slugovi proizvoda (ako budu drugačiji) | `product_site_content.slug_override` | ZP može imati drugačije URL-ove |
| SEO meta tagovi | `product_site_content.{seo_title,seo_description}` ili Sanity | per-site |
| Slike (ako budu drugačije) | `product_site_content.images_override` ili Sanity | opciono |
| Inquiries / upiti | `purchase_inquiries.site_key` | razdvajanje vodjenja leadova |
| Email kupaca / customers | nova `customers` (sa `site_key`) | ZP guest checkout, GI nema |

### Isto u kodu, ne u bazi
- Spot cena, formula `weight × spot × (1 + margin/100)` — ista formula, samo drugi tier.
- `availability` / `lead_time_weeks` — derivisano iz lager-a, isto za oba sajta.
- Cron za zlato — jedan endpoint, deli rezultat.

---

## 3. PREPORUKA ZA BAZU

### 3.1 Jedna baza, multi-brand (ne dve odvojene baze)

**Predlog: proširiti postojeću Supabase bazu sa tankim "site" slojem.**

Razlozi protiv dve baze:
- **Lager mora biti deljen** — dve baze znače da bi trebao sync mehanizam u realnom vremenu (kompleksno, lako da se zaglavi i prodaš jedan komad dva puta).
- **Proizvodi i varijante** — duplo unošenje, dve istine, drift.
- **Spot feed** — duplo plaćanje GoldAPI, dva crona, racione.
- **Admin** — operater bi morao da skače između dve aplikacije.

Razlozi ZA jednu bazu:
- Sve je već u jednoj instanci, nula migracije podataka.
- RLS politike se lako prošire da ZP javni endpoint vidi samo aktivne ZP cene.
- "Dodaj sajt" kasnije (treći brend) postaje samo nova vrednost u `site_key` koloni.

### 3.2 Konkretne izmene šeme

**A. Uvesti `site_key` kolonu (text) na sledeće tabele**, sa CHECK-om u prvoj iteraciji:
```
CHECK (site_key IN ('goldinvest', 'zlatneplocice'))
```

| tabela | semantika `site_key` |
|---|---|
| `pricing_tiers` | NULL = base (deljeno default), `'goldinvest'` ili `'zlatneplocice'` = override za sajt |
| `pricing_rules` | NOT NULL, default `'goldinvest'` (za postojeće override-e); ZP override je novi red |
| `purchase_inquiries` | NOT NULL, default `'goldinvest'` za stare; nove iz ZP forme = `'zlatneplocice'` |

Resolution chain za `pricing_tiers` postaje:
1. site=Z & brand=X & weight=Y & cat=C
2. site=Z & brand=X & weight=Y & cat=null
3. site=Z & brand=null & ...
4. site=null (base) & brand=X & ...
5. site=null & brand=null & ...
6. hardcoded default

Ovo se mapira u jednu izmenu `findTier()` u `src/lib/pricing.ts` (dodati `siteKey` parametar i 4 nova reda u prioritetni lanac).

**B. Nove tabele za ZP e-commerce:**

```
sites (referentna tabela, opciono — može i bez nje)
  key text PK ('goldinvest' | 'zlatneplocice'), name, base_url, is_active

customers
  id uuid PK, site_key text, email text, phone text, full_name text, address jsonb, created_at
  UNIQUE (site_key, email)

carts                     -- guest+registered, identifikacija preko cookie session_id
  id uuid PK, site_key text, customer_id uuid NULL, session_id text, created_at, updated_at

cart_items
  id uuid PK, cart_id uuid FK CASCADE, variant_id uuid FK,
  quantity integer, locked_quote_id uuid FK NULL → price_quotes
  UNIQUE (cart_id, variant_id)

price_quotes              -- 15-min lock-in
  id uuid PK, site_key text, variant_id uuid FK, snapshot_id uuid FK → gold_price_snapshots,
  locked_stock_price_rsd numeric, locked_at timestamptz, expires_at timestamptz
  INDEX (variant_id, expires_at)

orders
  id uuid PK, site_key text, customer_id uuid FK NULL,
  guest_email text, guest_phone text, guest_name text, shipping_address jsonb,
  status text CHECK (pending_payment, paid, shipped, delivered, cancelled, refunded),
  subtotal_rsd, shipping_rsd, total_rsd numeric,
  created_at, paid_at, shipped_at

order_items
  id uuid PK, order_id uuid FK CASCADE, variant_id uuid FK,
  quantity integer, unit_price_rsd numeric, snapshot_id uuid FK,
  product_name_snapshot text, weight_g_snapshot numeric  -- imutabilno

payments
  id uuid PK, order_id uuid FK, provider text, provider_ref text, amount_rsd, status, raw jsonb
```

**C. Per-site sadržaj proizvoda (opciono, samo ako ZP zaista ima drugačije opise/slike/URL-ove):**

```
product_site_content
  id uuid PK,
  product_id uuid FK CASCADE, site_key text NOT NULL,
  slug_override text NULL,
  name_override text NULL,
  description_override text NULL,
  properties_override text NULL,
  images_override text[] NULL,
  seo_title text NULL,
  seo_description text NULL,
  is_visible boolean DEFAULT true,
  UNIQUE (product_id, site_key)
```

Logika: čita se `LEFT JOIN`; NULL polje = naslijedi `products.<polje>`. Ako tabela ne postoji za par (product, site), default je iz `products`.

**Alternativa za sadržaj:** ostaviti sve u Sanity i dodati polje `site` na blog/page documente u Sanity-ju. Za sam product description teško, jer je u Postgres-u. Hibrid je realan: statične stranice u Sanity per-site, product description i dalje u Postgres-u (sa override tabelom samo gde je potrebno).

**D. RLS politike**

- `public_read_*` ostaju, ali se filtriraju per-site samo za `pricing_*` (čitanje cena za pogrešan sajt nije sigurnosni problem, ali je čistije).
- `orders`, `cart_items`, `payments` — RLS per `site_key` + per `customer.id = auth.uid()` (ako bude registrovanih) ili per `session_id` cookie.
- `service_role` u checkout cron-u ima FULL.

### 3.3 Migracija postojećih podataka
1. Dodati kolone (NULLABLE prvo, popuniti default-om, pa NOT NULL).
2. `UPDATE pricing_rules SET site_key='goldinvest' WHERE site_key IS NULL;`
3. `UPDATE purchase_inquiries SET site_key='goldinvest';`
4. `pricing_tiers` ostavi `site_key=NULL` na svima — to su bazni tieri, ZP će kreirati svoje.

---

## 4. PREPORUKA ZA ADMIN PANEL

### 4.1 **Jedan admin** sa site-aware sekcijama (ne dva odvojena)

| sekcija | režim | obrazloženje |
|---|---|---|
| `/admin/proizvodi` | **shared** (bez site selektora) | jedan unos = dva sajta vide |
| `/admin/zalihe` (lager) | **shared** | jedna istina o fizičkom lageru |
| `/admin/cene` (spot + tieri) | **per-site tab** (`GoldInvest` / `Zlatne Pločice`) | marže odvojene |
| `/admin/upiti` | **per-site filter** | inquiry forma se zadržava na obe strane |
| `/admin/porudzbine` (NOVA) | **ZP-only sekcija** | samo ZP ima orders/cart |
| `/admin/kupci` (NOVA) | **ZP-only** | samo ZP ima customers |
| `/admin/cene` → spot rates | **shared** | jedan EUR/RSD, jedan spot |
| `/admin/sadrzaj` (opciono) | **per-site** | ako bude `product_site_content` |

UX: globalni site selector u headeru (ili `?site=zp`) menja kontekst za sekcije koje su per-site. Shared sekcije ignorišu selector.

### 4.2 Postavljanje ZP marži nezavisno od GI

Trenutno u `/admin/cene/page.tsx:67-91` postoji `findTier()` koji rezolvuje (brand × weight × category). Posle migracije:

1. Dodati `site_key` u API rute `/api/admin/tiers` (POST/PATCH/DELETE).
2. Tabovi GI / ZP u UI-ju filtriraju listu po `site_key`. Bazni (NULL) tieri se prikazuju na oba taba kao "default" (read-only), ZP tab prikazuje samo ZP-specifične redove sa CTA "Kreiraj ZP override iz baznog".
3. Default flow za novi proizvod: "naslijedi iz GI" dugme = kopira GI tier u ZP red sa istim marginama, koje admin onda ručno menja. Posle 5 min admin ima ZP cenu iz baze.

### 4.3 Izbegavanje duplog rada
- Proizvodi se unose **samo jednom** u `/admin/proizvodi`.
- Slike i opis se u 95% slučajeva ne razlikuju — `product_site_content` je samo za ZP-specific izmene (npr. drugačiji naslov ili dodatna slika za korpu). Ne kreira se red dok admin ne klikne "ZP override".
- Sanity stranice sa `site` poljem: jedna struktura, dva izlaza. Ako 90% sadržaja u FAQ ostaje isto, koristiti **shared** dokumente (bez `site` polja = vide oba sajta) i samo ZP-specifične stavke imaju `site='zp'`.

### 4.4 Auth
Postojeći Supabase Auth + `app_metadata.role='admin'` ostaje. Eventualno dodati `app_metadata.site_access` (array) ako bude različitih operatera za GI i ZP — za sad pretpostavka je da je isti tim.

---

## 5. KONKRETNI SLEDEĆI KORACI

Redosled je važan: **prvo migracija šeme, pa kod, pa UI.**

1. **Sinhronizovati postojeću šemu sa migrations/ folderom**
   - U bazi je trenutno `category='multipack'` i `pricing_tiers.weight_g` (single), a u repo migracijama je `'novac'` i `min_g`/`max_g`. Pisati nedostajuće migracije (`add_lager_items.sql`, `add_admin_users.sql`, `pricing_tiers_weight_single.sql`, `category_multipack.sql`) tako da je `migrations/` istina.

2. **Migracija `add_site_key.sql`**
   - `ALTER TABLE pricing_tiers ADD COLUMN site_key text NULL;`
   - `ALTER TABLE pricing_rules ADD COLUMN site_key text NOT NULL DEFAULT 'goldinvest';`
   - `ALTER TABLE purchase_inquiries ADD COLUMN site_key text NOT NULL DEFAULT 'goldinvest';`
   - CHECK constraint na svim sa `IN ('goldinvest','zlatneplocice')` (NULL-able tamo gde treba).
   - Backfill pre `NOT NULL`.

3. **Proširiti `findTier()` u `src/lib/pricing.ts`**
   - Dodati `siteKey: string | null` parametar i prioritetni lanac (vidi 3.2.A).
   - Update tipova u `src/lib/supabase/types.ts`.

4. **Dodati site-aware tabove u `/admin/cene`**
   - Tab "Zlatne Pločice" čita `pricing_tiers` gde `site_key='zlatneplocice'`.
   - "Naslijedi iz GI / baznog tier-a" dugme = INSERT sa kopijama margina.
   - API `POST /api/admin/tiers` prima `site_key` u body-ju.

5. **Migracija `create_ecommerce_tables.sql`** — `customers`, `carts`, `cart_items`, `price_quotes`, `orders`, `order_items`, `payments` (vidi 3.2.B). Sa odgovarajućim indeksima i RLS-om.

6. **Cron za isticanje quote-ova**
   - `/api/cron/expire-quotes` svake 1 min: `DELETE FROM price_quotes WHERE expires_at < now()` i `UPDATE cart_items SET locked_quote_id=NULL WHERE locked_quote_id IN (...)`. Ili soft via SELECT-where filter — bez DELETE-a, ako se istorija quote-ova želi sačuvati.

7. **Nove ZP rute (kasnije, posebno od ovog dokumenta):** `/api/zp/cart`, `/api/zp/checkout`, `/api/zp/orders`. Same su u **drugom Next.js projektu** (zlatneplocice.rs) ali pišu u istu Supabase bazu sa odgovarajućim `site_key='zlatneplocice'`.

8. **Sanity:** dodati `site` polje (string list `goldinvest`/`zlatneplocice`/`both`) na page i blog dokumente; u GROQ query-jima filtrirati per sajt.

9. **Decommissioning:** ne brisati `purchase_inquiries` — i dalje će ga koristiti GoldInvest "Pošalji upit" forma. ZP koristi `orders` umesto inquiries-a.

10. **(Opciono) `product_site_content`** — uvesti tek kad se identifikuje prvi proizvod kome treba drugačiji opis/slug na ZP. Do tada nepotrebno.

---

## Apendiks A — razlike u odnosu na ranije dogovoreni plan (2026-05-04)

Pre dva dana je u razgovoru već utvrđen plan za ZP koji uglavnom prati istu logiku ali sa
nekoliko tehničkih razlika. Lista konflikata da bi se mogla doneti svesna odluka:

| tema | raniji plan | predlog ovog dokumenta | preporuka |
|---|---|---|---|
| Site dimenzija | `sites` tabela + `site_id` (FK integer) sa seed 1=GI / 2=ZP | `site_key` text sa CHECK | Funkcionalno isto. `site_id` je strožiji i lakši za RLS po `auth.jwt() → site_id`; `site_key` je čitljiviji u SQL alatima. Birati jedno i ostati dosledan. |
| Bazni tier (deljen za oba sajta) | nema — `pricing_tiers` će imati `NOT NULL site_id`, ZP fallback je hardkodovan 3/2/-2 | `site_key NULL` = bazni, deli se | Predlog ovog dokumenta čuva mogućnost da GI i ZP imaju iste default margine bez duplog unosa. |
| Lager / dekrement | atomic `UPDATE product_variants SET stock_qty = stock_qty - X WHERE stock_qty >= X` | lager je `lager_items` (count, ne `stock_qty`); dekrement = `DELETE` reda kad se proda | Trenutni kod već koristi `lager_items` (vidi 1.7). `stock_qty` na varijanti je legacy. Treba odlučiti: ili konsolidovati u `stock_qty` (dosta refaktora `/admin/zalihe` i P&L), ili ZP checkout briše konkretan `lager_items` red atomično. Druga opcija je manje invazivna. |
| Order tabele | `orders`, `order_items` (sa `gold_snapshot_id` na orderu) | `orders`, `order_items` (sa `snapshot_id` na stavci, immutabilan snapshot) | Snapshot na stavci je tačniji ako se 15-min lock razlikuje od price_quotes-a, ali je redundantnije. Ok ostaviti na orderu kako je dogovoreno. |
| Product per-site content | `product_site_content` sa fiksnim setom kolona (description, properties, payment_info, declaration, tax_info, meta_*) | isto, plus `slug_override`, `images_override` | Dodaj override polja samo ako će se zaista koristiti. |
| Sanity blog | **odvojen dataset** `zlatneplocice` | jedan dataset, `site` polje na dokumentima | Odvojen dataset je čistiji za SEO/duplicate content (potpuno nezavisan blog). Predlog ovog dokumenta je pogrešan — ići sa odvojenim datasetom. |
| Centralizovan admin | da, u GI panelu, sa dropdown-om za sajt | isto | Saglasno. |
| Guest checkout | da, bez user naloga | da | Saglasno (`customers` tabela u predlogu je redundantna ako nema registracije — može se izostaviti i držati podaci na `orders` direktno). |
| Plaćanje | bank transfer (uplatnica) na startu | predlog ne specifikuje | Pratiti dogovoreni plan. |

**Sumarno:** glavna otvorena pitanja za korisnika su (a) `site_id` integer vs `site_key` text,
(b) da li uopšte uvoditi `site_key=NULL` kao "deljeni bazni tier" ili ići sa hardkodovanim
fallback-om, (c) Sanity dataset model. Sve ostalo se naslanja na prethodni dogovor.
