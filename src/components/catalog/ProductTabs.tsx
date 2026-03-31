"use client";

import { useState } from "react";

type TabId =
  | "opis"
  | "svojstva"
  | "placanje"
  | "deklaracija"
  | "poreski";

type ProductSpec = {
  label: string;
  value: string;
};

type Props = {
  weightG: number;
  purity: number;
  brand: string;
  origin: string;
  category?: string | null;
  sku: string | null;
  variantName?: string | null;
  description?: string | null;
  specs?: ProductSpec[];
  lengthMm?: number | null;
  widthMm?: number | null;
  thicknessMm?: number | null;
};

const TABS: { id: TabId; label: string }[] = [
  { id: "opis",        label: "Opis proizvoda" },
  { id: "svojstva",    label: "Svojstva proizvoda" },
  { id: "placanje",    label: "Način i vreme plaćanja" },
  { id: "deklaracija", label: "Deklaracija proizvoda" },
  { id: "poreski",     label: "Poreski i drugi relevantni tretmani" },
];

export function ProductTabs({ weightG, purity, brand, origin, category, sku, variantName, description, lengthMm, widthMm, thicknessMm }: Props) {
  const [active, setActive] = useState<TabId>("opis");

  // Baza čuva purity kao integer (9999) ili decimal (0.9999) — normalizujemo
  const purityNorm = purity > 1 ? purity / 10000 : purity;
  const purityDisplay = (purityNorm * 1000).toFixed(1).replace(".0", "");
  const weightDisplay = weightG >= 1000 ? `${weightG / 1000} kg` : `${weightG} g`;

  const formatLabel =
    category === "plocica" ? "Pločica (investicioni bar)" :
    category === "dukat"   ? "Dukat (investiciona kovanica)" :
    "Poluga (investicioni bar)";

  const dimensionsDisplay = lengthMm && widthMm && thicknessMm
    ? `${lengthMm} × ${widthMm} × ${thicknessMm} mm`
    : null;

  return (
    <div>
      {/* Tab bar — full width, horizontally scrollable on small screens */}
      <div className="border-b border-[#F0EDE6] overflow-x-auto scrollbar-hide">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex min-w-max sm:min-w-0 sm:w-full">
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className="relative flex-1 px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors text-center"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 13.5,
                  color: isActive ? "#1B1B1C" : "#8A8A8A",
                }}
              >
                {tab.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{ background: "#BF8E41" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {active === "opis" && (
          <div
            className="w-full text-[#4A4A4A] leading-relaxed"
            style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 15.5 }}
          >
            {description ? (
              <div
                className="space-y-4 prose-custom"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <div className="space-y-4">
                <p>
                  <strong className="text-[#1B1B1C]">{variantName ?? `${brand} ${weightDisplay}`}</strong> je
                  investicioni zlatni proizvod čistoće{" "}
                  <strong className="text-[#1B1B1C]">{purityDisplay}/1000 (24 karata)</strong>, proizveden od strane
                  rafinerije <strong className="text-[#1B1B1C]">{brand}</strong> iz {origin}a.
                </p>
                <p>
                  Svaki proizvod dolazi fabrički zapečaćen u originalnom sigurnosnom blisteru koji je ujedno
                  i vaš zvanični sertifikat autentičnosti. Na blisteru i samom proizvodu laserski su ugravirani
                  logo proizvođača, nominalna masa, čistoća i jedinstveni serijski broj.
                </p>
                <p>
                  Proizvod nosi <strong className="text-[#1B1B1C]">LBMA &ldquo;Good Delivery&rdquo; status</strong> — najvišu
                  međunarodnu sertifikaciju za investiciono zlato, koju izdaje London Bullion Market Association.
                  Ovaj status garantuje prihvatanje bez ikakve provere autentičnosti kod svakog profesionalnog
                  dilera, u svakoj banci i na svakom tržištu plemenitih metala na svetu.
                </p>
                <p>
                  <span className="text-[#BF8E41] font-semibold">Zlatno pravilo:</span> Nikad ne otvarajte
                  fabrički blister — otvoren proizvod gubi &ldquo;Good Delivery&rdquo; status i otkupljuje se po
                  nižoj ceni. Pakovanje je garancija, ne samo ambalaža.
                </p>
              </div>
            )}
          </div>
        )}

        {active === "svojstva" && (
          <div className="max-w-[640px] w-full mx-auto">
            <div className="rounded-2xl border border-[#F0EDE6] overflow-hidden">
              {[
                { label: "Težina",           value: weightDisplay },
                { label: "Čistoća",          value: `${purityDisplay}/1000 (24 karata, 999,9 finog zlata)` },
                { label: "Format",           value: formatLabel },
                { label: "Proizvođač",       value: brand },
                { label: "Zemlja porekla",   value: origin },
                ...(dimensionsDisplay ? [{ label: "Dimenzije", value: dimensionsDisplay }] : []),
                { label: "Pakovanje",        value: "Fabrički zapečaćen sigurnosni blister (optifit)" },
                { label: "Sertifikacija",    value: "LBMA Good Delivery" },
                { label: "Serijski broj",    value: "Da — laserski graviran na proizvodu i blisteru" },
                { label: "PDV",              value: "Oslobođeno PDV-a (investiciono zlato)" },
                ...(sku ? [{ label: "Šifra proizvoda", value: sku }] : []),
              ].map(({ label, value }, i) => (
                <div
                  key={label}
                  className={`flex items-start gap-4 px-5 py-3.5 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"
                  }`}
                >
                  <span
                    className="shrink-0 text-[#8A8A8A] w-44"
                    style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 13.5 }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-[#1B1B1C] font-medium"
                    style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 13.5 }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "placanje" && (
          <div
            className="w-full space-y-6"
            style={{ fontFamily: "var(--font-rethink), sans-serif" }}
          >
            <div className="bg-[#FAFAF8] border border-[#F0EDE6] rounded-2xl overflow-hidden">
              <div className="divide-y divide-[#F0EDE6]">
                {[
                  {
                    title: "Plaćanje gotovinom",
                    body: "Plaćanje gotovinom prihvatamo do zakonskog limita od 1.160.000 RSD (10.000 EUR). Za iznose iznad ovog limita obavezno je plaćanje bankovnim transferom.",
                  },
                  {
                    title: "Bankovni transfer",
                    body: "Uplata na poslovni račun Gold Invest. Nakon što uplata bude evidentirana (isti ili sledeći radni dan), organizujemo preuzimanje ili dostavu.",
                  },
                  {
                    title: "Avansna kupovina",
                    body: "Uplatom avansa zaključavate trenutnu berzansku cenu. Roba se naručuje direktno iz rafinerije. Isporuka: 3–7 radnih dana od uplate.",
                  },
                  {
                    title: "Plaćanje pouzećem",
                    body: "Moguće za dostavu kurirskom službom uz limit osiguranja pošiljke. Kontaktirajte nas za detalje pre porudžbine.",
                  },
                ].map(({ title, body }) => (
                  <div key={title} className="px-6 py-5 sm:px-7 sm:py-6">
                    <p className="text-[#1B1B1C] font-semibold mb-2" style={{ fontSize: 14.5 }}>
                      {title}
                    </p>
                    <p className="text-[#6B6B6B] leading-relaxed mb-0" style={{ fontSize: 13.5 }}>
                      {body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="px-6 py-5 sm:px-7 sm:py-6 bg-[#FAF8F2] border-t border-[#F0EDE6]">
                <p className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-2">
                  Vreme isporuke
                </p>
                <ul className="text-[#4A4A4A] space-y-1.5" style={{ fontSize: 14, lineHeight: "1.6em" }}>
                  <li>
                    <span className="font-semibold text-[#1B1B1C]">Lager (roba na stanju):</span>{" "}
                    Beograd — isti dan (porudžbine do 12h), Srbija — 1–3 radna dana
                  </li>
                  <li>
                    <span className="font-semibold text-[#1B1B1C]">Avansna kupovina:</span>{" "}
                    3–7 radnih dana od potvrde uplate (direktno iz rafinerije)
                  </li>
                  <li>
                    <span className="font-semibold text-[#1B1B1C]">Lično preuzimanje:</span>{" "}
                    Odmah nakon evidentiranja uplate, u našoj poslovnici u Beogradu
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {active === "deklaracija" && (
          <div
            className="max-w-[760px] w-full mx-auto space-y-5"
            style={{ fontFamily: "var(--font-rethink), sans-serif" }}
          >
            <div className="rounded-2xl border border-[#F0EDE6] overflow-hidden">
              {[
                { label: "Naziv proizvoda",      value: variantName ?? `${brand} zlatni proizvod ${weightDisplay}` },
                { label: "Zemlja porekla",        value: origin },
                { label: "Proizvođač",            value: brand },
                { label: "Sastav",                value: `Zlato (Au) ${purityDisplay}/1000 — čistoće 99,99%` },
                { label: "Nominalna masa",         value: weightDisplay },
                ...(dimensionsDisplay ? [{ label: "Dimenzije", value: dimensionsDisplay }] : []),
                { label: "Pakovanje",             value: "Originalni sigurnosni blister (optifit) — fabrički zapečaćen" },
                { label: "Uvoznik / Distributer", value: "Gold Invest d.o.o., Beograd, Srbija" },
                { label: "Garancija porekla",     value: "LBMA Good Delivery sertifikat" },
                { label: "Uslovi čuvanja",        value: "Na sobnoj temperaturi, zaštićeno od vlage i direktnog sunca" },
              ].map(({ label, value }, i) => (
                <div
                  key={label}
                  className={`flex items-start gap-4 px-5 py-3.5 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"
                  }`}
                >
                  <span
                    className="shrink-0 text-[#8A8A8A] w-48"
                    style={{ fontSize: 13.5 }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-[#1B1B1C] font-medium"
                    style={{ fontSize: 13.5 }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <p
              className="text-[#8A8A8A] text-xs leading-relaxed"
            >
              Svi podaci na ovoj stranici su informativnog karaktera. Stvarni podaci o proizvodu
              nalaze se na originalnom blisteru i sertifikatu koji dolaze uz polugu.
            </p>
          </div>
        )}

        {active === "poreski" && (
          <div
            className="w-full"
            style={{ fontFamily: "var(--font-rethink), sans-serif" }}
          >
            <div className="bg-[#FAFAF8] border border-[#F0EDE6] rounded-2xl overflow-hidden">
              <div className="divide-y divide-[#F0EDE6]">
                <div className="px-6 py-5 sm:px-7 sm:py-6 bg-[#FAF8F2]">
                  <p className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-2">
                    Oslobođenje od PDV-a
                  </p>
                  <p className="text-[#1B1B1C] font-semibold text-[15px] mb-2">
                    Zlatne poluge su u potpunosti oslobođene PDV-a
                  </p>
                  <p className="text-[#6B6B6B] text-[14px] leading-relaxed mb-0">
                    U skladu sa Zakonom o porezu na dodatu vrednost Republike Srbije (čl. 25, st. 1, tač. 4), promet investicionog
                    zlata — uključujući zlatne poluge čistoće iznad 995/1000 — u potpunosti je oslobođen PDV-a od 20%. Svaki dinar koji
                    date ide direktno u vrednost čistog zlata, bez dodatnog poreza.
                  </p>
                </div>

                <div className="px-6 py-5 sm:px-7 sm:py-6">
                  <p className="text-[#1B1B1C] font-semibold text-[14.5px] mb-2">
                    Porez na kapitalnu dobit
                  </p>
                  <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                    U Republici Srbiji, prihod od prodaje investicionog zlata fizičkih lica nije predmet poreza na kapitalnu dobit,
                    ukoliko se radi o fizičkim licima koja ne obavljaju registrovanu delatnost prometom plemenitih metala. Preporučujemo
                    da se konsultujete sa poreskim savetnikom za vašu specifičnu situaciju.
                  </p>
                </div>

                <div className="px-6 py-5 sm:px-7 sm:py-6">
                  <p className="text-[#1B1B1C] font-semibold text-[14.5px] mb-2">
                    Zakon o sprečavanju pranja novca
                  </p>
                  <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                    U skladu sa Zakonom o sprečavanju pranja novca i finansiranja terorizma, gotovinska plaćanja dozvoljena su do
                    1.160.000 RSD (oko 10.000 EUR). Za veće iznose obavezno je plaćanje bezgotovinskim putem, uz odgovarajuću
                    dokumentaciju o identitetu kupca.
                  </p>
                </div>

                <div className="px-6 py-5 sm:px-7 sm:py-6">
                  <p className="text-[#1B1B1C] font-semibold text-[14.5px] mb-2">
                    Nasledstvo i prenos imovine
                  </p>
                  <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                    Fizičko zlato u vidu poluga prenosi se kao i svaka druga imovina. Zlatne poluge u originalnom LBMA blisteru sa
                    serijskim brojem lako je moguće dokumentovati za potrebe zaostavštine ili poklona. Za konkretne pravne i poreske
                    aspekte prenosa imovine, konsultujte se sa notarom ili poreskim savetnikom.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
