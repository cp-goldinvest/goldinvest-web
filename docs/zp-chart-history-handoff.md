# Handoff: Zlatne Plocice grafikon cene zlata (`/api/prices/history`)

> Pisao Claude u `goldinvest-web` (`/Users/nikolapajovic/Desktop/goldinvest-web`) na 2026-05-14.
> Namenjeno Claude-u u **zlatneplocice repo-u** (`/Users/nikolapajovic/Desktop/zlatneplocice`).
> Kada user kaze "procitaj handoff" - ovo procitaj prvo, pa potvrdi sa user-om pre nego sto pocnes da pises kod.

---

## 1. Sta treba uraditi

ZP sajt ima grafikon cene zlata (ili treba da ga ima). Trenutno na GoldInvest sajtu grafikon je upravo prepravljen tako da:
- crta krivu po periodima **1D / 1W / 1M / 1Y / 5Y / MAX**
- granulacija je razlicita po periodu (5min za 1D, satno za 1W, 4-satno za 1M, dnevno za 1Y, nedeljno za 5Y, mesecno za MAX)
- spaja staticki istorijski JSON (do 8.4.2026) sa snapshot-ovima iz baze (od 9.4.2026 nadalje, krenuo cron)

Trebamo identican mehanizam i na ZP-u. Posto **delimo `gold_price_snapshots` tabelu**, isti endpoint radi za oba sajta - samo kopiraj kod.

---

## 2. Sta vec postoji u zajednickoj bazi

### `gold_price_snapshots` tabela
Cron na GI strani upisuje **svakih 5 minuta**. Kao 14.5.2026, ima 23k+ redova, pokriva 8.4. do danas.

Relevantna polja koja koristi grafikon:
```
fetched_at timestamptz   - vreme snapshot-a
xau_eur     numeric      - cena 1 troj unce u EUR (referentno za grafikon)
eur_rsd     numeric      - kurs EUR/RSD u tom trenutku
```

ZP service-role client moze citati slobodno (proveri da postoji RLS policy za read).

### Datum kad je cron krenuo (vazno!)
**`DB_CUTOFF = "2026-04-08"`** - pre ovog datuma baza je prazna (cron tek kreirao tabelu). Za duge periode (1Y/5Y/MAX) moramo da spojimo staticki JSON (sve do 8.4.) + DB (od 9.4. nadalje).

---

## 3. Fajlovi za kreiranje

### Korak 1: Kopiraj staticki istorijski JSON

```bash
cp /Users/nikolapajovic/Desktop/goldinvest-web/src/data/gold-historical.json \
   /Users/nikolapajovic/Desktop/zlatneplocice/src/data/gold-historical.json
```

Fajl je ~100KB, sadrzi dnevne `{date: "YYYY-MM-DD", xau_eur: number}` redove od ~2005. do 2026-04-08. Identican je za oba sajta.

### Korak 2: Endpoint `src/app/api/prices/history/route.ts`

Ako ZP repo ima drugaciju strukturu (npr. `src/lib/supabase/server.ts` na drugoj putanji), prilagodi import. Ostalo kopiraj 1:1:

```ts
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import historicalData from "@/data/gold-historical.json";

/**
 * GET /api/prices/history?period=1D|1W|1M|1Y|5Y|MAX
 *
 * Vraca dnevne/satne/petominutne tacke za grafikon cene zlata.
 * Granulacija se bira po periodu (vidi PERIOD_CFG).
 *
 * Za duge periode (1Y/5Y/MAX) spaja staticki istorijski JSON
 * (sve do 8.4.2026) sa snapshot-ovima iz baze (od 9.4.2026 nadalje).
 *
 * Vraca i trenutni eur_rsd za RSD konverziju na klijentu.
 */
export const runtime = "nodejs";

type Period = "1D" | "1W" | "1M" | "1Y" | "5Y" | "MAX";
type StaticPoint = { date: string; xau_eur: number };
type Point = { date: string; xau_eur: number };

const STATIC: StaticPoint[] = historicalData as StaticPoint[];
const DB_CUTOFF = "2026-04-08";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

const PERIOD_CFG: Record<
  Period,
  { days: number; bucketMs: number; cache: number; useStatic: boolean }
> = {
  "1D":  { days: 1,        bucketMs: 0,                cache: 60,   useStatic: false },
  "1W":  { days: 7,        bucketMs: HOUR_MS,          cache: 300,  useStatic: false },
  "1M":  { days: 30,       bucketMs: 4 * HOUR_MS,      cache: 900,  useStatic: false },
  "1Y":  { days: 365,      bucketMs: DAY_MS,           cache: 3600, useStatic: true  },
  "5Y":  { days: 365 * 5,  bucketMs: 7 * DAY_MS,       cache: 3600, useStatic: true  },
  "MAX": { days: 365 * 20, bucketMs: 30 * DAY_MS,      cache: 3600, useStatic: true  },
};

export async function GET(req: NextRequest) {
  const period = (req.nextUrl.searchParams.get("period") ?? "1Y") as Period;
  const cfg = PERIOD_CFG[period];
  if (!cfg) {
    return NextResponse.json({ error: "Invalid period" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - cfg.days);
  const cutoffIso = cutoff.toISOString();

  // PostgREST default db-max-rows = 1000, paginira za period > ~1.7 dana.
  type Row = { fetched_at: string; xau_eur: number };
  const PAGE = 1000;
  const rows: Row[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("gold_price_snapshots")
      .select("fetched_at, xau_eur")
      .gte("fetched_at", cutoffIso)
      .not("xau_eur", "is", null)
      .order("fetched_at", { ascending: true })
      .range(from, from + PAGE - 1);

    if (error) {
      console.error("[api/prices/history]", error);
      return NextResponse.json({ error: "History unavailable" }, { status: 503 });
    }
    if (!data || data.length === 0) break;
    rows.push(...(data as Row[]));
    if (data.length < PAGE) break;
    if (from >= 30 * PAGE) break; // safety stop ~52 dana
  }

  // Bucket DB rows: u svakom bucket-u poslednja vrednost pobedjuje.
  let dbPoints: Point[] = [];
  if (rows.length > 0) {
    if (cfg.bucketMs === 0) {
      dbPoints = rows.map((r) => ({ date: r.fetched_at, xau_eur: Number(r.xau_eur) }));
    } else {
      const buckets = new Map<number, Point>();
      for (const r of rows) {
        const t = new Date(r.fetched_at).getTime();
        const key = Math.floor(t / cfg.bucketMs);
        buckets.set(key, { date: r.fetched_at, xau_eur: Number(r.xau_eur) });
      }
      dbPoints = [...buckets.values()];
    }
  }

  // Spoji sa statikom za duge periode.
  let points: Point[];
  if (cfg.useStatic) {
    const cutoffStr = cutoffIso.slice(0, 10);
    const staticInRange = STATIC.filter(
      (d) => d.date >= cutoffStr && d.date < DB_CUTOFF
    ).map((d) => ({ date: d.date, xau_eur: d.xau_eur }));
    points = [...staticInRange, ...dbPoints];
  } else {
    points = dbPoints;
  }

  // Trenutni EUR/RSD za RSD konverziju na klijentu.
  const { data: latest } = await supabase
    .from("gold_price_snapshots")
    .select("eur_rsd")
    .not("eur_rsd", "is", null)
    .order("fetched_at", { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json(
    { points, eur_rsd: latest?.eur_rsd ?? 117.5 },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${cfg.cache}, stale-while-revalidate=60`,
      },
    }
  );
}
```

### Korak 3: Endpoint za trenutnu cenu (`/api/prices`)

Ako ZP **vec ima** `/api/prices` rutu (za price ticker ili sl.) - preskoci ovaj korak.

Ako nema, kopiraj `src/app/api/prices/route.ts` iz GI repo-a (vraca najsveziji snapshot, koristi se za "current price" prikaz iznad grafikona kad cache na duzem periodu istekne).

### Korak 4: Chart komponenta

Pogledaj `src/components/home/GoldPriceChartFull.tsx` u GI repo-u kao referencu. Ne kopiraj 1:1 jer ZP verovatno ima drugaciji design system (boje, fontove, button-style). Adaptiraj na ZP brand.

**Kljucna logika koju treba zadrzati (van stila):**

```tsx
"use client";
import { useState, useMemo, useEffect } from "react";

type Period = "1D" | "1W" | "1M" | "1Y" | "5Y" | "MAX";
type ApiPoint = { date: string; xau_eur: number };
type HistoryResponse = { points: ApiPoint[]; eur_rsd: number };

const EUR_USD = 1.09;
const EUR_RSD_FALLBACK = 117.5;
const GRAMS_PER_OZ = 31.1034768;
const MAX_RENDER_POINTS = 250;

// 1. Fetch po periodu
useEffect(() => {
  let cancelled = false;
  setLoading(true);
  fetch(`/api/prices/history?period=${period}`)
    .then((r) => r.json())
    .then((d: HistoryResponse) => { if (!cancelled) { setHistory(d); setLoading(false); }})
    .catch(() => { if (!cancelled) setLoading(false); });
  return () => { cancelled = true; };
}, [period]);

// 2. Fetch live current price (jednom, za displej iznad grafikona)
useEffect(() => {
  fetch("/api/prices")
    .then((r) => r.json())
    .then((d) => {
      if (d.xau_eur && d.eur_rsd) setLive({ xauEur: d.xau_eur, eurRsd: d.eur_rsd });
    })
    .catch(() => {});
}, []);

// 3. Format label po periodu (HH:MM za 1D, DD.MM za 1W/1M, DD.MM.YY za 1Y, MM.YY za 5Y/MAX)
function formatLabel(isoDate: string, period: Period): string { /* vidi GI fajl */ }

// 4. Downsample na max 250 tacaka pre render-a (Recharts performans)
function downsample<T>(arr: T[], maxPoints: number): T[] { /* vidi GI fajl */ }

// 5. Konvertuj xau_eur -> izabrana valuta + jedinica
function convert(xauEur: number, currency, unit, eurRsd): number { /* vidi GI fajl */ }

// 6. Live overlay: ako imamo live cenu, prepisi POSLEDNJU tacku u grafikonu
//    (za vizuelnu kontinuitet na 1Y/5Y/MAX kad bucket je dnevni/nedeljni)
```

Period dugmici (ZP stil):
```tsx
const PERIODS = [
  { label: "1 Dan",      value: "1D"  },
  { label: "1 Nedelja",  value: "1W"  },
  { label: "1 Mesec",    value: "1M"  },
  { label: "1 Godina",   value: "1Y"  },
  { label: "5 Godina",   value: "5Y"  },
  { label: "Maksimalno", value: "MAX" },
];
```

---

## 4. Vazne sitnice (gotcha-e)

### PostgREST `db-max-rows = 1000`
Supabase ima default limit od 1000 redova po query-ju. `.limit(20000)` **NE radi** - vraca i dalje samo 1000. Zbog toga endpoint paginira u petlji. **Ne uklanjaj paginaciju.** Za 1M (30 dana) treba ~9 stranica (8640 redova / 1000).

### `useStatic: true` samo za 1Y+
Za 1D/1W/1M, statika je beskorisna (samo dnevni close prices, nemamo intraday u JSON-u). Koristi iskljucivo DB.

### Live overlay je za "trenutnu cenu"
History endpoint ima cache do 1h za duge periode. Big displej iznad grafikona mora biti svez. Zato dodatni fetch `/api/prices` koji ima 60s cache. Ne brkaj ova dva endpoint-a.

### EUR/USD kurs je konstanta
GI grafikon koristi `EUR_USD = 1.09` (hardkodovan). Ako ZP zeli precizniji USD, mora se dodati u snapshot tabelu ili u zaseban API call. Za sada drzi se konstante.

---

## 5. Testiranje

Posle implementacije, pokreni `npm run dev` u ZP repo-u i `curl`-uj:

```bash
curl -s "http://localhost:3000/api/prices/history?period=1D"  | jq '.points | length'
curl -s "http://localhost:3000/api/prices/history?period=1W"  | jq '.points | length'
curl -s "http://localhost:3000/api/prices/history?period=1M"  | jq '.points | length'
curl -s "http://localhost:3000/api/prices/history?period=1Y"  | jq '.points | length'
curl -s "http://localhost:3000/api/prices/history?period=5Y"  | jq '.points | length'
curl -s "http://localhost:3000/api/prices/history?period=MAX" | jq '.points | length'
```

Ocekivani brojevi (na dan 14.5.2026, ce rasti vremenom):

| Period | ~tacaka |
|---|---|
| 1D | 280-290 |
| 1W | 165-170 |
| 1M | 175-185 |
| 1Y | 265-275 |
| 5Y | 1200+ |
| MAX | 2500+ |

Ako 1W vraca ~40 tacaka i pokriva samo ~2 dana - **paginacija ne radi**, pogledaj kod.

Ako 1Y zavrsava na 4. aprilu (a ne danas) - isto, **paginacija ne radi**.

I poslednje: otvori grafikon u browseru, klikaj kroz periode i valute (EUR/USD/RSD), proveri da nema praznog stanja, gap-a izmedju statika→DB tacke, ili pogresnih labela na X osi.

---

## 6. Sta NE treba raditi

- **Ne pisi u `gold_price_snapshots`** sa ZP-a. Cron na GI strani je vlasnik. ZP samo cita.
- **Ne pravi novi cron** na ZP-u. Imali bismo duplikate.
- **Ne menjaj `DB_CUTOFF`**. Ako se ikad backfill-uje praznina izmedju 5.3. i 8.4. (sad nije potrebno), pomeri datum.
- **Ne mesaj history endpoint sa `/api/prices`**. Razlicite svrhe, razliciti cache profili.
