import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Zlatne poluge | Prodaja zlatnih poluga - Najpovoljnija Cena",
  description:
    "Kupite LBMA sertifikovane zlatne poluge čistoće 999,9 — Argor-Heraeus, C. Hafner, The Royal Mint. Transparentne prodajne, avansne i otkupne cene. Dostava za celu Srbiju.",
  alternates: {
    canonical: "https://goldinvest.rs/kategorija/zlatne-poluge",
  },
};

const BREADCRUMBS = [
  { label: "Investiciono zlato", href: "/" },
  { label: "Zlatne poluge", href: "/kategorija/zlatne-poluge" },
];

export default async function ZlatnePolutePage() {
  const supabase = createServiceClient();

  const [{ data: variants }, { data: tiers }, { data: snapshotRow }] =
    await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .eq("products.category", "poluga")
        .eq("is_active", true)
        .order("sort_order"),
      supabase.from("pricing_tiers").select("*"),
      supabase
        .from("gold_price_snapshots")
        .select("*")
        .order("fetched_at", { ascending: false })
        .limit(1)
        .single(),
    ]);

  if (!snapshotRow || !variants || !tiers) {
    return (
      <main className="min-h-screen bg-[#1B1B1C]">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#8A8A8A]">
          Cene trenutno nisu dostupne. Pokušajte ponovo.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1B1B1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <Breadcrumb items={BREADCRUMBS} />

        {/* Hero */}
        <div className="mt-6 mb-10">
          <h1 className="font-serif text-4xl lg:text-5xl font-semibold text-[#E9E6D9]">
            Zlatne poluge
          </h1>
          <p className="mt-4 text-[#8A8A8A] text-base max-w-2xl leading-relaxed">
            Zlatne poluge su najsigurniji način da zaštitite veći kapital od inflacije i
            ekonomskih potresa. Naša ponuda obuhvata isključivo LBMA sertifikovane poluge
            finoće 999,9, poznatih svetskih kovnica. Obezbedili smo vam transparentne cene
            za trenutnu i avansnu kupovinu, uz garantovan i siguran otkup.
          </p>
        </div>

        {/* Category quick-links */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { label: "Pločice 1g–20g",    href: "/kategorija/zlatne-plocice" },
            { label: "Poluge 50g–1kg",     href: "/kategorija/zlatne-poluge" },
            { label: "Dukati i kovanice",  href: "/kategorija/zlatni-dukati" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={[
                "px-5 py-2 rounded-full text-sm font-medium border transition-colors",
                link.href === "/kategorija/zlatne-poluge"
                  ? "border-[#BF8E41] text-[#BF8E41] bg-[#BF8E41]/5"
                  : "border-[#2E2E2F] text-[#8A8A8A] hover:border-[#BF8E41]/40 hover:text-[#E9E6D9]",
              ].join(" ")}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Product grid with filter/sort */}
        <ProductGrid
          variants={variants as any}
          tiers={tiers}
          snapshot={snapshotRow}
        />

        {/* SEO content sections */}
        <div className="mt-20 space-y-12 border-t border-[#2E2E2F] pt-12">

          <Section title="Koje težine zlatnih poluga postoje?">
            <p>
              U Gold Invest asortimanu nalaze se isključivo investicione poluge maksimalne
              čistoće od 99.99% (24 karata). Da biste lakše isplanirali svoju investiciju,
              evo detaljnog pregleda formata poluga:
            </p>
            <ul>
              <li>
                <strong>Zlatne pločice manje težine (1g, 2g, 5g, 10g i 20g)</strong> — savršen
                način da započnete svoju investicionu priču ili obezbedite najvredniji poklon
                za krštenja, rođenja i venčanja.
              </li>
              <li>
                <strong>Srednje poluge (50g i 100g)</strong> — ovo je apsolutno najtraženiji
                format na domaćem i evropskom tržištu. Poluga od 100 grama je najčešći izbor
                kao savršen investicioni balans.
              </li>
              <li>
                <strong>Velike poluge (250g, 500g i 1kg)</strong> — ultimativni izbor za
                ozbiljne investitore koji prebacuju veće sume novca iz nesigurnog bankarskog
                sistema u opipljivu imovinu.
              </li>
            </ul>
          </Section>

          <Section title="Sertifikati i LBMA standard zlatnih poluga">
            <p>
              Svaka zlatna poluga u Gold Invest ponudi dolazi isključivo iz najprestižnijih
              svetskih rafinerija i poseduje LBMA (London Bullion Market Association)
              sertifikat — vaša ultimativna garancija da kupujete zlato najvišeg svetskog
              ranga, koje je priznato i lako naplativo svuda u svetu.
            </p>
            <p className="text-[#BF8E41] font-medium">
              ⚠ Zlatno pravilo: Ne otvarajte ambalažu! Oštećenje blistera trajno uništava
              investicioni Good Delivery status vaše poluge.
            </p>
          </Section>

          <Section title="Brendovi zlatnih poluga">
            <ul>
              <li>
                <strong>Argor-Heraeus</strong> — švajcarska preciznost i industrijski standard.
              </li>
              <li>
                <strong>C. Hafner</strong> — nemački premium kvalitet, tradicija duga preko 170 godina.
              </li>
              <li>
                <strong>The Royal Mint</strong> — britanski prestiž, zvanična državna kovnica Velike Britanije.
              </li>
            </ul>
          </Section>

          <Section title="Cena zlatnih poluga — Trenutna/Avansna/Otkupna">
            <ol>
              <li>
                <strong>Trenutna kupovina</strong> — plaćate i istog dana preuzimate polugu
                iz našeg trezora.
              </li>
              <li>
                <strong>Avansna kupovina</strong> — uplatite unapred, zaključate trenutnu
                cenu i sačekate isporuku direktno iz kovnice.
              </li>
              <li>
                <strong>Otkupna cena</strong> — javno istaknuta cena po kojoj Gold Invest
                garantovano otkupljuje vaše poluge, uz isplatu istog dana.
              </li>
            </ol>
          </Section>

        </div>

        {/* FAQ */}
        <div className="mt-12 border-t border-[#2E2E2F] pt-12">
          <h2 className="font-serif text-2xl lg:text-3xl text-[#E9E6D9] mb-6">
            Česta pitanja o zlatnim polugama
          </h2>
          <FaqList />
        </div>

      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl lg:text-3xl text-[#E9E6D9] mb-4">{title}</h2>
      <div className="text-[#8A8A8A] leading-relaxed space-y-3 [&_strong]:text-[#E9E6D9] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2">
        {children}
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "Koja zlatna poluga se najviše isplati za kupovinu?",
    a: "Matematički gledano, najviše se isplati poluga od 1 kilograma. Međutim, investitori se najčešće odlučuju za kupovinu više poluga od 100g zbog fleksibilnosti.",
  },
  {
    q: "Da li se na zlatne poluge plaća porez u Srbiji?",
    a: "Ne. U skladu sa Zakonom o PDV-u, promet investicionim zlatnim polugama čistoće 995/1000 ili više u potpunosti je oslobođen PDV-a.",
  },
  {
    q: "Šta znači LBMA oznaka proizvođača?",
    a: "LBMA (London Bullion Market Association) je najviše globalno telo koje kontroliše tržište plemenitih metala i garantuje čistoću, tačnu gramažu i legalno poreklo.",
  },
  {
    q: "Gde je najbezbednije čuvati veće zlatne poluge?",
    a: "Stručnjaci preporučuju zakup sefa u poslovnoj banci. Zakup je pristupačan (nekoliko hiljada dinara godišnje) i pruža maksimalnu fizičku i pravnu sigurnost.",
  },
  {
    q: "Koliko traje isporuka?",
    a: "Za Beograd: isti dan (porudžbine do 12h). Za ostatak Srbije: 1–3 radna dana. Za avansne kupovine rok se precizno definiše pri kupovini.",
  },
];

function FaqList() {
  return (
    <div className="space-y-0 divide-y divide-[#2E2E2F]">
      {FAQS.map((faq) => (
        <FaqItem key={faq.q} q={faq.q} a={faq.a} />
      ))}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-4">
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <h3 className="text-sm font-medium text-[#E9E6D9] group-hover:text-[#BF8E41] transition-colors pr-4">
          {q}
        </h3>
        <span className="text-[#BF8E41] flex-shrink-0 transition-transform group-open:rotate-45 text-xl leading-none">
          +
        </span>
      </summary>
      <p className="mt-3 text-sm text-[#8A8A8A] leading-relaxed">{a}</p>
    </details>
  );
}
