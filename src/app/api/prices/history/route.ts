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

// Datum od kog cron pouzdano puni bazu (~575 snapshot-ova/dan).
// Za duge periode statika pokriva sve do ovog datuma, baza preuzima posle.
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

  // Supabase/PostgREST ima db-max-rows = 1000 - moramo paginirati za period > ~1.7 dana.
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
    // safety stop - 30 stranica = 30k snapshot-ova (~52 dana, dovoljno za 1M)
    if (from >= 30 * PAGE) break;
  }

  // Bucket DB rows: poslednja vrednost u bucket-u pobedjuje (data je ASC).
  let dbPoints: Point[] = [];
  if (rows && rows.length > 0) {
    if (cfg.bucketMs === 0) {
      dbPoints = rows.map((r) => ({
        date: r.fetched_at as string,
        xau_eur: Number(r.xau_eur),
      }));
    } else {
      const buckets = new Map<number, Point>();
      for (const r of rows) {
        const t = new Date(r.fetched_at as string).getTime();
        const key = Math.floor(t / cfg.bucketMs);
        buckets.set(key, {
          date: r.fetched_at as string,
          xau_eur: Number(r.xau_eur),
        });
      }
      dbPoints = [...buckets.values()];
    }
  }

  // Spoji sa statikom za duge periode (statika pokriva sve do DB_CUTOFF).
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
