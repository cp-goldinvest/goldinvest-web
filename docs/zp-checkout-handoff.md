# Handoff: Zlatne Plocice `/api/checkout` ruta

> Pisao Claude u `goldinvest-web` (`/Users/nikolapajovic/Desktop/goldinvest-web`) na 2026-05-12.
> Ovaj dokument je namenjen Claude-u u **zlatneplocice repo-u** (`/Users/nikolapajovic/Desktop/zlatneplocice`).
> Kada user kaze "procitaj handoff" — ovo procitaj prvo, pa pitaj user-a za potvrdu pre nego sto pocnes da pises kod.

---

## 1. Kontekst projekta

Imamo dva sajta koji **dele istu Supabase bazu**:

| Sajt | Domen | Repo | Model |
|---|---|---|---|
| GoldInvest | goldinvest.rs | `~/Desktop/goldinvest-web` | "Posalji upit" forma — bez korpe, bez online placanja, kupac salje upit pa se rucno zovu |
| Zlatne Plocice | zlatneplocice.rs | `~/Desktop/zlatneplocice` (TVOJ REPO) | E-commerce sa korpom, guest checkout, **bank transfer** (uplatnica) |

`sites` tabela: `id=1` GoldInvest, `id=2` Zlatne Plocice. Sve ZP redove pisi sa `site_id=2`.

**ZP nema admin panel** — admin za obe sajtove je u GoldInvest repo-u, na `/admin/porudzbine`.

---

## 2. Sta vec postoji u bazi (pripremljeno za tebe)

DB schema je vec migrirana. Sva ova polja postoje i mogu se citati/pisati.

### `sites` (master)
```
id smallint PK, key text UNIQUE, name text, domain text, base_url text, is_active boolean
seed: (1, 'goldinvest', 'GoldInvest', 'goldinvest.rs', 'https://goldinvest.rs')
      (2, 'zlatneplocice', 'Zlatne Plocice', 'zlatneplocice.rs', 'https://zlatneplocice.rs')
```

### `products` (deljeno)
Postoji 19 redova. Polja: `id uuid, slug text UNIQUE, name, category('poluga'|'plocica'|'dukat'|'multipack'), brand, refinery, origin, description, properties, payment_info, declaration, tax_info, is_active`. RLS: public SELECT kad `is_active=true`.

### `product_variants` (deljeno)
62 redova. Polja: `id uuid, product_id FK, slug UNIQUE, weight_g, weight_oz, purity, fine_weight_g, name, sku, stock_qty, availability('in_stock'|'available_on_request'|'preorder'), lead_time_weeks, images text[], sort_order, is_active`.

### `lager_items` (deljeno - **fizicki komadi**)
**KRITICNO za checkout flow.** Jedan red = jedan fizicki komad zlata.
```
id uuid PK, variant_id FK, purchase_price_rsd numeric, purchased_at date, note text,
reserved_order_id uuid REFERENCES orders(id) ON DELETE SET NULL  ← NOVA kolona za ZP
```
- "Na stanju za variant X" = `count(*) WHERE variant_id=X AND reserved_order_id IS NULL`
- Rezervisano = `reserved_order_id IS NOT NULL`
- Posle uplate, admin u GI panelu DELETE-uje rezervisane redove (= prodato).

### `pricing_tiers` (per-site)
55 redova, **svi `site_id=1`** (GoldInvest marže). ZP krece od 0 redova → pricing_tiers query za site_id=2 vraca prazno → `pricing.ts` pada na hardkodovan fallback (3% stock, 2% advance, -2% purchase).

Admin ce uneti ZP marže rucno kroz GI admin panel kasnije. Za sad ZP ce racunati cene sa fallback marzama.

### `pricing_rules` (per-site, retko)
4 reda, svi `site_id=1`, sve `override_*_price` su NULL u praksi. UNIQUE je `(variant_id, site_id)` — ZP moze imati svoj override za isti variant.

### `gold_price_snapshots` (deljeno, READ-ONLY za ZP)
Cron na GI strani upisuje svakih 5min. ZP samo cita najsvezi snapshot.

### `purchase_inquiries` (GI only, ignorisi)
Stara "Posalji upit" forma, GI legacy.

### `orders` (per-site, ZP koristi sa `site_id=2`)
**Nova tabela.** Klijent kreira preko `/api/checkout`. Polja:
```
id uuid PK, order_number bigserial UNIQUE (krece od 1000),
site_id smallint FK,
status text ('pending_payment'|'paid'|'shipped'|'delivered'|'cancelled') DEFAULT 'pending_payment',

customer_name text NOT NULL, customer_email text NOT NULL, customer_phone text NOT NULL,
shipping_address_line text NOT NULL, shipping_city text NOT NULL,
shipping_postal_code text NULL, shipping_country text NOT NULL DEFAULT 'Srbija',
customer_note text NULL,

subtotal_rsd numeric NOT NULL, shipping_rsd numeric NOT NULL DEFAULT 0, total_rsd numeric NOT NULL,

payment_method text DEFAULT 'bank_transfer' (bank_transfer|cash_on_delivery|online_card),
payment_reference text NULL,

shipping_carrier text NULL, shipping_tracking_number text NULL,

gold_snapshot_id uuid FK NULL,

created_at, paid_at, shipped_at, delivered_at, cancelled_at, cancelled_reason
```

RLS: **nikakav public pristup** — checkout MORA da koristi `SUPABASE_SERVICE_ROLE_KEY` (bypass RLS). Admin ima full pristup preko JWT claim-a.

### `order_items` (per-order, snapshot)
```
id uuid PK, order_id FK CASCADE,
variant_id FK SET NULL, lager_item_id FK SET NULL,
product_name_snapshot text NOT NULL,
variant_name_snapshot text NULL,
weight_g_snapshot numeric NOT NULL,
category_snapshot text NOT NULL,
quantity integer NOT NULL DEFAULT 1,
unit_price_rsd numeric NOT NULL,
line_total_rsd numeric NOT NULL,
purchase_price_snapshot_rsd numeric NULL  ← za P&L
```

---

## 3. Pricing logika (KRITICNO - replikuj iz GI)

Cena se racuna kao: `weight_g × spot_per_gram_rsd × (1 + margin_pct / 100)`.

Tri cene postoje:
- `stock` (prodajna cena za odmah-na-stanju robu)
- `advance` (predracunska, jeftinija — koristis ovu za ZP order ako zelis bolju cenu za kupca)
- `purchase` (otkupna, negativna marža)

**Za ZP preporucujem `stock` cenu** (jednostavnije, kupac dobija odmah na stanju).

GI ima ovu logiku u: `/Users/nikolapajovic/Desktop/goldinvest-web/src/lib/pricing.ts`.

Kopiraj taj fajl u ZP repo (npr. `~/Desktop/zlatneplocice/lib/pricing.ts`) **bez izmene** — radi sa pricing_tiers koje mu prosledis kao parametar. Razlika je samo da iz baze citas sa **`.eq("site_id", 2)`** (vec `pricing_tiers` ce vratiti 0 redova za sada, fallback se aktivira).

Spot price formula (iz pricing.ts): `xau_eur / GRAMS_PER_OZ * eur_rsd` (preferiraj EUR putanje).

---

## 4. Sta treba da napravis u ZP repo-u

### 4.1 Env vars

ZP repo treba u `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://ucngtcsmkxuxuubrobsc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<vidi GI .env.local ili Supabase Dashboard>
SUPABASE_SERVICE_ROLE_KEY=<vidi GI .env.local ili Supabase Dashboard>
```

User mora ovo da postavi rucno (pitati ga). U produkciji to ide u Vercel project env vars za zlatneplocice projekat.

### 4.2 Supabase klijent

Standardna setup-a `@supabase/supabase-js`. Treba dve verzije:
- **anon klijent** za client komponente (browser) — koristi anon key
- **service klijent** za API rute — koristi service role key, bypass-uje RLS

Pogledaj GI obrazac: `/Users/nikolapajovic/Desktop/goldinvest-web/src/lib/supabase/server.ts` i `client.ts`.

### 4.3 `app/api/checkout/route.ts`

**Spec:**

```ts
POST /api/checkout
Content-Type: application/json

Body:
{
  customer: {
    name: string,     // required
    email: string,    // required
    phone: string,    // required
  },
  shipping: {
    address_line: string,   // required
    city: string,           // required
    postal_code?: string,
    country?: string,       // default "Srbija"
  },
  items: [
    { variant_id: string (uuid), quantity: number (>=1) }
  ],
  shipping_rsd?: number,    // default 0 ili izracunaj na strani servera
  customer_note?: string,
}

Response 200:
{
  order_id: string (uuid),
  order_number: number,    // npr. 1000
  status: "pending_payment",
  total_rsd: number,
  payment_instructions: {
    account_number: string,
    amount_rsd: number,
    reference: string,     // npr. "Porudzbina #1000"
  }
}

Response 4xx:
{ error: string }
```

**Algoritam:**

1. **Validacija inputa.** Email format, phone non-empty, items[] non-empty, svaki variant_id postoji.

2. **Pribavi najsvezi gold snapshot:**
   ```ts
   const { data: snapshot } = await supabase.from("gold_price_snapshots")
     .select("*").order("fetched_at", { ascending: false }).limit(1).single();
   ```

3. **Pribavi product_variants sa products i ZP-jevim pricing_rules:**
   ```ts
   const { data: variants } = await supabase.from("product_variants")
     .select(`
       *,
       products!inner(name, brand, origin, category),
       pricing_rules(*)
     `)
     .in("id", items.map(i => i.variant_id))
     .eq("is_active", true)
     .eq("pricing_rules.site_id", 2);
   ```

4. **Pribavi ZP pricing tiers:**
   ```ts
   const { data: tiers } = await supabase.from("pricing_tiers")
     .select("*").eq("site_id", 2);
   // Trenutno vraca [], pa pricing.ts pada na hardcoded 3/2/-2% fallback.
   ```

5. **Proveri stock atomicno za svaku stavku:**
   ```ts
   for (const item of items) {
     // Pribavi koliko ima slobodnih (reserved_order_id IS NULL) lager_items
     const { data: available } = await supabase.from("lager_items")
       .select("id", { count: "exact" })
       .eq("variant_id", item.variant_id)
       .is("reserved_order_id", null)
       .limit(item.quantity);

     if (!available || available.length < item.quantity) {
       return Response.json(
         { error: `Nema dovoljno na stanju za variant ${item.variant_id}` },
         { status: 409 }
       );
     }
   }
   ```

6. **Izracunaj cene** koristeci `computePrices()` iz `lib/pricing.ts` (kopiran iz GI). Za svaku stavku: `unit_price_rsd` = `computePrices(...).stock`, `line_total_rsd` = `unit_price_rsd * quantity`. Sumiraj sve za `subtotal_rsd`. `total_rsd = subtotal + shipping`.

7. **Kreiraj order:** insert u `orders` sa `site_id: 2, status: 'pending_payment', gold_snapshot_id: snapshot.id`, kupac info, totals.

8. **Kreiraj order_items** za svaku stavku sa snapshot poljima (product_name, weight, category, unit_price). Za `purchase_price_snapshot_rsd` mozes uzeti `lager_items.purchase_price_rsd` od PRVOG slobodnog reda za taj variant.

9. **Rezervisi lager_items** — za svaki item, UPDATE prvih `quantity` slobodnih redova:
   ```ts
   const { data: rows } = await supabase.from("lager_items")
     .select("id, purchase_price_rsd")
     .eq("variant_id", item.variant_id)
     .is("reserved_order_id", null)
     .order("purchased_at", { ascending: true })  // FIFO
     .limit(item.quantity);

   const ids = rows.map(r => r.id);
   await supabase.from("lager_items")
     .update({ reserved_order_id: order.id })
     .in("id", ids);
   ```
   **Vazno:** sacuvaj `lager_item_id` na odgovarajucim `order_items` redovima (UPDATE order_items SET lager_item_id = ... gde tacno znas mapping).

10. **Vrati response** sa `order_number` i payment instructions.

### 4.4 Race condition napomena

Stock check (korak 5) i lager reservation (korak 9) nisu strogo atomicni. Ako dva kupca istovremeno kupuju poslednji komad, oba mogu da prodju check, a samo jedan dobija rezervaciju (drugi ce "rezervisati" 0 redova). Resenje za MVP:

**Provera posle rezervacije:** uradi UPDATE pa proveri `count`. Ako je `count < quantity`, ROLLBACK (delete order + order_items) i vrati 409.

Bolje resenje (kasnije): `pg_advisory_lock` ili Postgres `SELECT ... FOR UPDATE SKIP LOCKED` u SQL funkciji.

### 4.5 Bank transfer instrukcije

User je rekao da je `payment_method='bank_transfer'`. Account_number, naziv primaoca itd. — pitaj user-a. Hardkoduj za sad ili u env var. Reference = `Porudzbina #<order_number>`.

---

## 5. Sta admin radi u GI repo-u (kontekst)

GI repo ima `/admin/porudzbine` koja:
- Lista sve porudzbine (sa join-om na sites i order_items)
- Filter tabs po statusu
- Status transitions preko `POST /api/admin/orders/[id]/transition` sa akcijama:
  - `confirm_payment` → status=paid + DELETE rezervisanih lager_items
  - `mark_shipped` → status=shipped + carrier + tracking
  - `mark_delivered` → status=delivered
  - `cancel` → status=cancelled (+ vraca lager u stock ako jos nije paid)
- "Starije od 24h" badge za stare pending_payment porudzbine

Tako: kad ZP kreira porudzbinu, admin to vidi u GI panelu, vidi "Ceka uplatu", proverava banku, klikne "Potvrdi uplatu" — sistem brise lager, status postaje "paid".

---

## 6. Sta JOS NIJE uradjeno (out-of-scope za ovaj task)

- **Email notifikacije** kupcu i adminu (Resend integracija) - kasnije
- **Cron** za auto-cancel starih pending_payment — preskoceno, koristimo vizuelni indikator umesto
- **Online card placanje** (Monri/WSPay) - kasnije, sad samo bank transfer
- **Lock-in cene 15min** - preskoceno za MVP, cena se fiksira u trenutku checkout-a

---

## 7. DB connection za testiranje (handle paznjivo)

Direktna konekcija na DB (ako trebas da query-jujеs ili pokreces migracije):
- Pooler URL format: `postgresql://postgres.ucngtcsmkxuxuubrobsc:<PASSWORD>@aws-1-eu-west-1.pooler.supabase.com:5432/postgres`
- DB password: **pitaj user-a** (rotirao je posle handoff-a)
- pg_dump je u `/opt/homebrew/opt/libpq/bin/pg_dump`

Backup baze pre nego sto si poceo: `/Users/nikolapajovic/Desktop/goldinvest-web/backups/db/goldinvest-public-20260512-171638.sql`

---

## 8. Korisni commit-ovi u GI repo-u (referenca)

| Commit | Sta | Fajl |
|---|---|---|
| `f00c57b` | Sites tabela + site_id dimenzija | `supabase/migrations/20260512000001_add_sites_and_dimension.sql` |
| `6f0baf9` | pricing_tiers site_id=1, NOT NULL | `supabase/migrations/20260512000002_backfill_pricing_tiers_site_id.sql` |
| `56fe49a` | orders, order_items, lager rezervacija | `supabase/migrations/20260512000003_create_orders_and_lager_reservation.sql` |
| `242d716` | GI upiti filtriraju po site_id=1 (referenca za ZP query patterns) | `src/app/(site)/page.tsx` + 12 ostalih |
| `e37925f` | `/admin/porudzbine` u GI | `src/app/admin/porudzbine/page.tsx`, `src/app/api/admin/orders/...` |
| `77e7bca` | Stale indikator za 24h+ pending | `src/app/admin/porudzbine/page.tsx` |

---

## 9. Pravila i preferencije user-a

User-ove guidelines (iz njegove memory):
- **Bez em-dash-a** (`—`) u kodu i tekstu, koristi obicnu crticu `-` ili pipe `|`
- **Bez safety branch-eva** — commit i push direktno na main
- **Komentari na srpskom kad smo u Srbiji** (kad pises new komentare)

Stack u GI je Next.js 16.2.6 + App Router + Supabase JS + Tailwind 4. ZP je Next.js 16.2.4. Drzi se istog stila.

---

## 10. Pitanja za user-a pre nego sto pocnes

1. Sta su tacno **bank account details** (broj racuna, naziv primaoca) za payment instructions?
2. **Shipping cena** — fiksna (npr. 500 RSD), besplatna iznad praga (npr. 50,000 RSD), ili po kuriru?
3. **Stock check strategija** — slazes li se sa "check + reserve, rollback ako gubi race"? Ili odlozi za polirano kasnije?
4. Da li ZP frontend vec ima **korpu i checkout formu** koju treba da konektujes, ili samo API ruta?

Posle odgovora — pocni implementaciju. Komituj na main bez branch-eva. Build mora da prodje pre push-a.
