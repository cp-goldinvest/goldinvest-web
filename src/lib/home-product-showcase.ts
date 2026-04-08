/**
 * Homepage product strip: Argor-Heraeus 1/2/5/10g, then C.Hafner 1/2/5/10g (zlatne pločice).
 * C.Hafner 10g: samo pojedinačna pločica u blisteru - set (10×1g / SmartPack) se ne prikazuje radi konzistentnosti sa 1/2/5g.
 */
const PLATE_WEIGHTS = [1, 2, 5, 10] as const;

function normBrand(brand: string) {
  return brand.toLowerCase().replace(/\s+/g, " ").trim();
}

function isArgorHeraeus(brand: string) {
  const b = normBrand(brand);
  return b.includes("argor") && b.includes("heraeus");
}

function isCHafner(brand: string) {
  const b = normBrand(brand);
  return b.includes("hafner");
}

function matchesWeight(weightG: unknown, target: number) {
  return Math.abs(Number(weightG) - target) < 0.02;
}

type VariantRow = {
  weight_g: number;
  slug?: string;
  name?: string | null;
  products?: { brand?: string; category?: string; name?: string } | null;
};

/** Multi-pack / set (nije ista vizuelna linija kao pojedinačne pločice). */
function isPlateSetOrMultipackVariant(v: VariantRow): boolean {
  const slug = (v.slug ?? "").toLowerCase();
  const variantName = (v.name ?? "").toLowerCase();
  const productName = (v.products?.name ?? "").toLowerCase();
  const blob = `${slug} ${variantName} ${productName}`;
  if (!matchesWeight(v.weight_g, 10)) return false;
  return (
    slug.includes("set") ||
    slug.includes("10x1") ||
    slug.includes("10-x-1") ||
    /\b10\s*[x×]\s*1\s*g?\b/i.test(blob) ||
    blob.includes("set") ||
    blob.includes("smartpack") ||
    blob.includes("smart pack")
  );
}

export function buildHomepagePlateShowcase(variants: VariantRow[]): VariantRow[] {
  const plocice = variants.filter((v) => v.products?.category === "plocica");
  const usedIds = new Set<string>();
  const out: VariantRow[] = [];

  const pickRow = (brandPredicate: (b: string) => boolean, opts?: { hafner10gExcludeSets?: boolean }) => {
    for (const w of PLATE_WEIGHTS) {
      const pool = plocice.filter((v) => {
        const id = (v as { id?: string }).id;
        if (id && usedIds.has(id)) return false;
        return brandPredicate(v.products?.brand ?? "") && matchesWeight(v.weight_g, w);
      });

      let found: VariantRow | undefined;
      if (opts?.hafner10gExcludeSets && w === 10) {
        found = pool.find((v) => !isPlateSetOrMultipackVariant(v));
      } else {
        found = pool[0];
      }

      if (found) {
        const id = (found as { id?: string }).id;
        if (id) usedIds.add(id);
        out.push(found);
      }
    }
  };

  pickRow(isArgorHeraeus);
  pickRow(isCHafner, { hafner10gExcludeSets: true });
  return out;
}
