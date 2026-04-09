import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const JSON_PATH = resolve(__dirname, '../src/data/gold-historical.json');

const GRAMS_PER_OZ = 31.1034768;

// Fetch XAU/EUR from Yahoo Finance (GC=F in USD, then convert via EUR/USD)
async function fetchYahooRange(from, to) {
  const period1 = Math.floor(new Date(from).getTime() / 1000);
  const period2 = Math.floor(new Date(to).getTime() / 1000);

  const [xauRes, eurRes] = await Promise.all([
    fetch(`https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1d&period1=${period1}&period2=${period2}`),
    fetch(`https://query1.finance.yahoo.com/v8/finance/chart/EURUSD%3DX?interval=1d&period1=${period1}&period2=${period2}`),
  ]);

  const xauJson = await xauRes.json();
  const eurJson = await eurRes.json();

  const xauResult = xauJson?.chart?.result?.[0];
  const eurResult = eurJson?.chart?.result?.[0];

  if (!xauResult || !eurResult) throw new Error('Yahoo Finance returned no data');

  const timestamps = xauResult.timestamp;
  const xauClose = xauResult.indicators.quote[0].close;
  const eurClose = eurResult.indicators.quote[0].close;

  const points = [];
  for (let i = 0; i < timestamps.length; i++) {
    const xauUsd = xauClose[i];
    const eurUsd = eurClose[i];
    if (!xauUsd || !eurUsd) continue;

    const date = new Date(timestamps[i] * 1000).toISOString().split('T')[0];
    const xauEurPerOz = xauUsd / eurUsd;

    points.push({ date, xau_eur: Math.round(xauEurPerOz * 100) / 100 });
  }

  return points;
}

async function main() {
  const existing = JSON.parse(readFileSync(JSON_PATH, 'utf8'));
  const lastDate = existing[existing.length - 1].date;
  console.log(`Poslednji datum u JSON-u: ${lastDate}`);

  const fromDate = new Date(lastDate);
  fromDate.setDate(fromDate.getDate() + 1);
  const from = fromDate.toISOString().split('T')[0];
  const to = new Date().toISOString().split('T')[0];

  console.log(`Dohvatam podatke od ${from} do ${to}...`);

  const newPoints = await fetchYahooRange(from, to);
  console.log(`Pronađeno ${newPoints.length} novih tačaka`);

  if (newPoints.length === 0) {
    console.log('Nema novih podataka.');
    return;
  }

  // Filter out dates already in the JSON
  const existingDates = new Set(existing.map(p => p.date));
  const toAdd = newPoints.filter(p => !existingDates.has(p.date));
  console.log(`Dodajem ${toAdd.length} novih zapisa...`);

  toAdd.forEach(p => console.log(`  ${p.date}: €${p.xau_eur}/g`));

  const updated = [...existing, ...toAdd].sort((a, b) => a.date.localeCompare(b.date));
  writeFileSync(JSON_PATH, JSON.stringify(updated));
  console.log(`✓ JSON ažuriran. Ukupno ${updated.length} zapisa. Poslednji: ${updated[updated.length - 1].date}`);
}

main().catch(console.error);
