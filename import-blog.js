// ============================================================
// UPUTSTVO:
// 1. Stavi ovaj fajl u ROOT folder tvog Next.js projekta
// 2. Instaliraj dependency: npm install @sanity/client
// 3. Pokreni: node import-blog.js
// ============================================================

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-09',
  token: process.env.SANITY_API_TOKEN, // dodaćeš ovo u .env.local
  useCdn: false,
})

// ============================================================
// BLOG POST DOKUMENT
// Tabele su konvertovane u formatted blokove jer tvoja shema
// nema @sanity/table plugin — samo block i image tipovi.
// ============================================================

const blogPost = {
  _type: 'post',
  title: 'Cena zlata 2026 — Šta investitori treba da znaju',
  slug: { _type: 'slug', current: 'cena-zlata-2026' },
  category: 'Tržište',
  readMin: 7,
  featured: false,
  publishedAt: '2026-04-09T00:00:00.000Z',
  excerpt:
    'Cena zlata u 2026. godini je već srušila sve rekorde — zlato je počelo godinu iznad 5.000 dolara po unci. Šta stoji iza ovog rasta, gde analitičari najvećih svetskih banaka vide cenu do kraja godine i šta to znači za investitore u Srbiji?',
  metaTitle: 'Cena zlata 2026 — Prognoza i analiza za investitore u Srbiji',
  metaDescription:
    'Aktuelna cena zlata u 2026, prognoze JP Morgan, Goldman Sachs i UBS, kretanje po mesecima i šta rekordne cene znače za investitore u Srbiji.',
  body: [
    // ── UVOD ──────────────────────────────────────────────
    {
      _type: 'block',
      _key: 'intro01',
      style: 'normal',
      markDefs: [
        { _key: 'link_gi', _type: 'link', href: 'https://goldinvest.rs' },
      ],
      children: [
        {
          _type: 'span',
          _key: 's1',
          text: 'Cena zlata u 2026. godini već piše istoriju — metal je prvu polovinu godine dočekao iznad 5.000 dolara po unci, nastavivši uzlazni trend koji je u 2025. doneo rast od čak 64%. Ako razmatrate ',
          marks: [],
        },
        {
          _type: 'span',
          _key: 's2',
          text: 'investiciono zlato',
          marks: ['link_gi'],
        },
        {
          _type: 'span',
          _key: 's3',
          text: ' kao zaštitu kapitala, ovo je tekst koji treba da pročitate pre nego što donesete odluku — konkretni podaci, prognoze najvećih svetskih banaka i šta sve to znači za vaš novac.',
          marks: [],
        },
      ],
    },

    // ── H2: TRENUTNA CENA ─────────────────────────────────
    {
      _type: 'block',
      _key: 'h2_01',
      style: 'h2',
      markDefs: [],
      children: [{ _type: 'span', _key: 'h2_01s', text: 'Kolika je trenutna cena zlata u 2026. godini?', marks: [] }],
    },
    {
      _type: 'block',
      _key: 'p01',
      style: 'normal',
      markDefs: [{ _key: 'link_cena', _type: 'link', href: 'https://goldinvest.rs/cena-zlata' }],
      children: [
        {
          _type: 'span', _key: 'p01s1',
          text: 'Zlato je 2026. godinu otvorilo na istorijski visokim nivoima — početkom januara spot cena se kretala oko 5.100 dolara po unci. U februaru je dostignut privremeni maksimum od 5.405 dolara, dok je u martu 2026. došlo do korekcije usled geopolitičkih tenzija između Irana i SAD. Korekcija je cenu povukla prema zoni 4.300–4.600 dolara, ali analitičari tu vide jaku zonu podrške i potencijal za novi rast. Aktuelnu ',
          marks: [],
        },
        { _type: 'span', _key: 'p01s2', text: 'cenu zlata', marks: ['link_cena'] },
        { _type: 'span', _key: 'p01s3', text: ' možete pratiti uživo na našoj stranici koja se ažurira u realnom vremenu.', marks: [] },
      ],
    },

    // Tabela 1 — kretanje cene (kao formatiran tekst)
    {
      _type: 'block', _key: 'tbl1_head', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't1h', text: 'Kretanje cene zlata 2025–2026:', marks: ['strong'] }],
    },
    {
      _type: 'block', _key: 'tbl1_r1', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't1r1', text: '• Januar 2025. — ~2.650 $/oz (~77 €/g) — Početak bul-trenda', marks: [] }],
    },
    {
      _type: 'block', _key: 'tbl1_r2', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't1r2', text: '• Oktobar 2025. — ~4.000 $/oz (~116 €/g) — Prelazak istorijskog nivoa', marks: [] }],
    },
    {
      _type: 'block', _key: 'tbl1_r3', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't1r3', text: '• Januar 2026. — ~5.100 $/oz (~148 €/g) — Rekordni nivoi', marks: [] }],
    },
    {
      _type: 'block', _key: 'tbl1_r4', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't1r4', text: '• Februar 2026. — ~5.405 $/oz (~157 €/g) — Godišnji maksimum (za sada)', marks: [] }],
    },
    {
      _type: 'block', _key: 'tbl1_r5', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't1r5', text: '• April 2026. — ~4.600–5.000 $/oz (~130–145 €/g) — Korekcija + stabilizacija', marks: [] }],
    },

    // ── H2: FAKTORI ───────────────────────────────────────
    {
      _type: 'block', _key: 'h2_02', style: 'h2', markDefs: [],
      children: [{ _type: 'span', _key: 'h2_02s', text: 'Zašto je cena zlata toliko porasla — koji su ključni faktori?', marks: [] }],
    },
    {
      _type: 'block', _key: 'p03', style: 'normal',
      markDefs: [{ _key: 'link_formiranje', _type: 'link', href: 'https://goldinvest.rs/blog/kako-odrediti-cenu-zlata' }],
      children: [
        { _type: 'span', _key: 'p03s1', text: 'Rast nije slučajan. Iza rekordnih nivoa stoji više strukturnih sila koje deluju istovremeno. Razumevanje ovih faktora ključno je za svakog investitora — detaljno smo ih obradili i u tekstu o tome ', marks: [] },
        { _type: 'span', _key: 'p03s2', text: 'kako se formira cena zlata na tržištu', marks: ['link_formiranje'] },
        { _type: 'span', _key: 'p03s3', text: '.', marks: [] },
      ],
    },

    // H3: Centralne banke
    {
      _type: 'block', _key: 'h3_01', style: 'h3', markDefs: [],
      children: [{ _type: 'span', _key: 'h3_01s', text: 'Centralne banke kupuju rekordne količine zlata', marks: [] }],
    },
    {
      _type: 'block', _key: 'p04', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 'p04s', text: 'Od 2022. godine, centralne banke zemalja u razvoju ubrzano povećavaju zlatne rezerve kao alternativu dolarskim sredstvima. U 2025. godini kupljeno je više od 1.000 tona, a J.P. Morgan prognozira oko 755 tona u 2026 — i dalje znatno iznad istorijskog proseka od 400–500 tona pre 2022. Kina, Indija i Turska predvode tzv. dedolarizaciju rezervi. Taj strukturni pritisak na potražnju stvara čvrst pod ispod cene zlata čak i tokom korekcija.', marks: [] }],
    },

    // H3: Kamatne stope
    {
      _type: 'block', _key: 'h3_02', style: 'h3', markDefs: [],
      children: [{ _type: 'span', _key: 'h3_02s', text: 'Kamatne stope i slabiji dolar', marks: [] }],
    },
    {
      _type: 'block', _key: 'p05', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 'p05s', text: 'Američka federalna rezerva (FED) zadržava kamatne stope na nivou 4,25–4,50%, ali tržište u 2026. godini ceni dva do tri smanjenja. Niže kamatne stope direktno pogoduju zlatu: smanjuju prinos na državne obveznice i slabe vrednost dolara. Slabiji dolar čini zlato jeftinijim za kupce koji plaćaju u evrima ili dinarima — što pojačava globalnu tražnju. Dolar je u 2025. zabeležio najstrmiji godišnji pad od 2017.', marks: [] }],
    },

    // H3: Geopolitika
    {
      _type: 'block', _key: 'h3_03', style: 'h3', markDefs: [],
      children: [{ _type: 'span', _key: 'h3_03s', text: 'Geopolitička neizvesnost i bekstvo u sigurnu luku', marks: [] }],
    },
    {
      _type: 'block', _key: 'p06', style: 'normal',
      markDefs: [{ _key: 'link_inflacija', _type: 'link', href: 'https://goldinvest.rs/blog/inflacija-i-zlato' }],
      children: [
        { _type: 'span', _key: 'p06s1', text: 'Sukobi na Bliskom istoku, tenzije SAD–Kina i rastuće carine stvorili su klimu u kojoj investitori traže imovinu bez kreditnog rizika. Zlato igra ulogu finansijskog osiguranja — istorijska veza između geopolitičkih kriza i rasta cene zlata detaljno je obrađena u našem tekstu o ', marks: [] },
        { _type: 'span', _key: 'p06s2', text: 'inflaciji i zlatu', marks: ['link_inflacija'] },
        { _type: 'span', _key: 'p06s3', text: '.', marks: [] },
      ],
    },

    // H3: ETF
    {
      _type: 'block', _key: 'h3_04', style: 'h3', markDefs: [],
      children: [{ _type: 'span', _key: 'h3_04s', text: 'ETF i investitorska potražnja', marks: [] }],
    },
    {
      _type: 'block', _key: 'p07', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 'p07s', text: 'Od 2024. godine, institucionalni investitori su u zlatne ETF fondove usmerili više od 50 milijardi dolara. J.P. Morgan prognozira daljih 250 tona novih ETF priljeva tokom 2026, dok potražnja za fizičkim polugama i kovanicama treba da ponovo premaši 1.200 tona godišnje. Kada se tražnja institucija, centralnih banaka i privatnih investitora poklopi, rezultat su istorijski visoke cene.', marks: [] }],
    },

    // ── H2: PROGNOZE BANAKA ───────────────────────────────
    {
      _type: 'block', _key: 'h2_03', style: 'h2', markDefs: [],
      children: [{ _type: 'span', _key: 'h2_03s', text: 'Šta najveće svetske banke prognoziraju za cenu zlata do kraja 2026.?', marks: [] }],
    },
    {
      _type: 'block', _key: 'p08', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 'p08s', text: 'Prognoze vodećih finansijskih institucija pružaju investitorima okvir za donošenje odluka. Evo ažuriranih ciljnih cena za kraj 2026, zasnovanih na istraživanjima objavljenim u prvoj polovini ove godine:', marks: [] }],
    },

    // Tabela 2 — prognoze banaka
    {
      _type: 'block', _key: 'tbl2_head', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't2h', text: 'Prognoze cene zlata za kraj 2026. (USD/oz):', marks: ['strong'] }],
    },
    {
      _type: 'block', _key: 'tbl2_r1', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't2r1', text: '• J.P. Morgan — 6.300 $ — Centralne banke + dedolarizacija', marks: [] }],
    },
    {
      _type: 'block', _key: 'tbl2_r2', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't2r2', text: '• UBS — 6.000 $ — Geopolitika + smanjenje stopa FED-a', marks: [] }],
    },
    {
      _type: 'block', _key: 'tbl2_r3', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't2r3', text: '• Goldman Sachs — 5.400–5.800 $ — Kupovina centralnih banaka + ETF', marks: [] }],
    },
    {
      _type: 'block', _key: 'tbl2_r4', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't2r4', text: '• CIBC — 6.000 $ — Strukturna promena rizika', marks: [] }],
    },
    {
      _type: 'block', _key: 'tbl2_r5', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't2r5', text: '• Bank of America — 5.000 $ — Fizička potražnja Azija + sigurna luka', marks: [] }],
    },
    {
      _type: 'block', _key: 'tbl2_r6', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't2r6', text: '• HSBC — 4.800–5.000 $ — Konzervativna procena, solidna podrška', marks: [] }],
    },
    {
      _type: 'block', _key: 'tbl2_r7', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't2r7', text: '• Morgan Stanley — 4.500–4.800 $ — Fizička tražnja Azija', marks: [] }],
    },
    {
      _type: 'block', _key: 'p09', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 'p09s', text: 'Konsenzus srednje vrednosti svih prognoza iznosi oko 5.500 dolara po unci za kraj 2026. Čak i najkonzervativnija prognoza (HSBC) ne predviđa pad ispod 4.500 dolara, što govori da strukturna potpora tržištu ostaje snažna.', marks: [] }],
    },

    // ── H2: KOREKCIJA ────────────────────────────────────
    {
      _type: 'block', _key: 'h2_04', style: 'h2', markDefs: [],
      children: [{ _type: 'span', _key: 'h2_04s', text: 'Da li je korekcija iz marta 2026. bila kraj rasta ili samo pauza?', marks: [] }],
    },
    {
      _type: 'block', _key: 'p10', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 'p10s', text: 'Mart 2026. doneo je nagli pad od oko 18% — sa 5.294 dolara na 4.342 dolara u roku od nepunih deset dana. Okidač je bio vojni sukob Irana i SAD, koji je ironično ojačao dolar umesto da podstakne bekstvo u zlato. Tehnički indikatori (RSI u preprodatoj zoni, cena na 50% Fibonačijevog povratka čitavog rasta) sugerišu da je bila reč o zdravoj korekciji unutar uzlaznog trenda — ne preokret.', marks: [] }],
    },
    {
      _type: 'block', _key: 'p11', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 'p11s', text: 'Ključni signal je bila snažna kineska fizička kupovina tokom pada — Šangajska berza zlata (SGE) beležila je rekordne količine ispod 4.500 dolara. Kada azijska fizička tražnja agresivno stupa na scenu tokom pada, to istorijski označava zonu podrške, ne početak medveđeg tržišta.', marks: [] }],
    },

    // ── H2: RIZICI ────────────────────────────────────────
    {
      _type: 'block', _key: 'h2_05', style: 'h2', markDefs: [],
      children: [{ _type: 'span', _key: 'h2_05s', text: 'Koji su rizici — šta bi moglo da obori cenu zlata u 2026.?', marks: [] }],
    },
    {
      _type: 'block', _key: 'p12', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 'p12s', text: 'Balansiran investitor mora razumeti i rizike. Tri scenarija koja bi mogla pritisnuti cenu nadole:', marks: [] }],
    },
    {
      _type: 'block', _key: 'p12a', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 'p12as', text: '• Agresivni zaokret FED-a — ako inflacija neočekivano padne prema cilju od 2%, realne kamatne stope bi porasle i smanjile atraktivnost zlata. HSBC navodi da je rast realnih prinosa jedini ozbiljan medveđi rizik.', marks: [] }],
    },
    {
      _type: 'block', _key: 'p12b', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 'p12bs', text: '• Jačanje dolara — ako se američka ekonomija pokaže otpornijom od očekivane, dolar bi mogao ojačati i pritisnuti cenu zlata izraženu u dolarima.', marks: [] }],
    },
    {
      _type: 'block', _key: 'p12c', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 'p12cs', text: '• De-eskalacija geopolitičkih tenzija — rešenje sukoba na Bliskom istoku i smanjenje tenzija SAD–Kina bi delimično uklonilo premiju rizika ugrađenu u cenu.', marks: [] }],
    },
    {
      _type: 'block', _key: 'p13', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 'p13s', text: 'Međutim, čak i u najnepovoljnijem scenariju, strukturni pod koji postavljaju centralne banke trebalo bi da drži cenu iznad 4.000 dolara.', marks: [] }],
    },

    // ── H2: SRBIJA ────────────────────────────────────────
    {
      _type: 'block', _key: 'h2_06', style: 'h2', markDefs: [],
      children: [{ _type: 'span', _key: 'h2_06s', text: 'Šta rekordna cena zlata znači za investitore u Srbiji?', marks: [] }],
    },
    {
      _type: 'block', _key: 'p14', style: 'normal',
      markDefs: [
        { _key: 'link_poluge', _type: 'link', href: 'https://goldinvest.rs/kategorija/zlatne-poluge' },
        { _key: 'link_plocice', _type: 'link', href: 'https://goldinvest.rs/kategorija/zlatne-plocice' },
      ],
      children: [
        { _type: 'span', _key: 'p14s1', text: 'Za investitore u Srbiji, ključna je kombinacija globalnog rasta cene u dolarima i stabilnog kursa EUR/RSD. Ko je u prethodne dve–tri godine investirao u ', marks: [] },
        { _type: 'span', _key: 'p14s2', text: 'zlatne poluge', marks: ['link_poluge'] },
        { _type: 'span', _key: 'p14s3', text: ' ili ', marks: [] },
        { _type: 'span', _key: 'p14s4', text: 'zlatne pločice', marks: ['link_plocice'] },
        { _type: 'span', _key: 'p14s5', text: ', u dinarima je zabeležio prinos od 60–80% — bez kreditnog rizika, bez bankarskog posrednika i bez PDV-a (investiciono zlato je u Srbiji oslobođeno PDV-a od 2018. godine).', marks: [] },
      ],
    },
    {
      _type: 'block', _key: 'p15', style: 'normal',
      markDefs: [
        { _key: 'link_dukati', _type: 'link', href: 'https://goldinvest.rs/kategorija/zlatni-dukati' },
        { _key: 'link_zasto', _type: 'link', href: 'https://goldinvest.rs/blog/zasto-ulagati-u-zlato' },
      ],
      children: [
        { _type: 'span', _key: 'p15s1', text: 'Investitori koji razmišljaju o fleksibilnijem formatu mogu razmotriti i ', marks: [] },
        { _type: 'span', _key: 'p15s2', text: 'zlatne dukate', marks: ['link_dukati'] },
        { _type: 'span', _key: 'p15s3', text: ' — manji, lakše utrživiji format. O tome koji format bolje odgovara vašim ciljevima pišemo u tekstu sa ', marks: [] },
        { _type: 'span', _key: 'p15s4', text: '7 razloga za ulaganje u zlato', marks: ['link_zasto'] },
        { _type: 'span', _key: 'p15s5', text: '.', marks: [] },
      ],
    },

    // ── H2: POLUGE VS PLOCICE ─────────────────────────────
    {
      _type: 'block', _key: 'h2_07', style: 'h2', markDefs: [],
      children: [{ _type: 'span', _key: 'h2_07s', text: 'Poluge ili pločice — šta je bolja kupovina pri visokim cenama?', marks: [] }],
    },
    {
      _type: 'block', _key: 'p16', style: 'normal',
      markDefs: [{ _key: 'link_pvn', _type: 'link', href: 'https://goldinvest.rs/blog/zlatne-poluge-vs-novcanice' }],
      children: [
        { _type: 'span', _key: 'p16s1', text: 'Zlatno pravilo: što je poluga teža, premija po gramu je niža. Razlika u premiji između pločice od 1g i poluge od 100g može iznositi 6–8% po gramu — što direktno utiče na vašu tačku rentabiliteta. Detaljan pregled možete naći u tekstu ', marks: [] },
        { _type: 'span', _key: 'p16s2', text: 'zlatne poluge ili zlatnici — šta je bolje za početnike', marks: ['link_pvn'] },
        { _type: 'span', _key: 'p16s3', text: '.', marks: [] },
      ],
    },

    // Tabela 3 — premije
    {
      _type: 'block', _key: 'tbl3_head', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't3h', text: 'Orijentacione premije po formatu investicionog zlata:', marks: ['strong'] }],
    },
    {
      _type: 'block', _key: 'tbl3_r1', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't3r1', text: '• Zlatna pločica 1g — premija 7–10% — Preporučeno za početnike i poklone', marks: [] }],
    },
    {
      _type: 'block', _key: 'tbl3_r2', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't3r2', text: '• Zlatna pločica 5–10g — premija 4–6% — Preporučeno za redovne kupce', marks: [] }],
    },
    {
      _type: 'block', _key: 'tbl3_r3', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't3r3', text: '• Zlatna poluga 50–100g — premija 2–4% — Preporučeno za veće investicije', marks: [] }],
    },
    {
      _type: 'block', _key: 'tbl3_r4', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't3r4', text: '• Zlatna poluga 250g–1kg — premija 1–2,5% — Preporučeno za institucionalne kupovine', marks: [] }],
    },
    {
      _type: 'block', _key: 'tbl3_r5', style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: 't3r5', text: '• Zlatni dukat — premija 5–8% — Preporučeno za fleksibilne investitore', marks: [] }],
    },

    // ── H2: KASNO? ────────────────────────────────────────
    {
      _type: 'block', _key: 'h2_08', style: 'h2', markDefs: [],
      children: [{ _type: 'span', _key: 'h2_08s', text: 'Da li je 2026. godina prekasna za ulazak u zlato?', marks: [] }],
    },
    {
      _type: 'block', _key: 'p17', style: 'normal',
      markDefs: [
        { _key: 'link_kako', _type: 'link', href: 'https://goldinvest.rs/kako-kupiti' },
        { _key: 'link_lbma', _type: 'link', href: 'https://goldinvest.rs/blog/lbma-sertifikacija-sta-znaci' },
      ],
      children: [
        { _type: 'span', _key: 'p17s1', text: 'Zlato nije špekulativna investicija — to je instrument zaštite vrednosti. Konsenzus analitičara ne predviđa pad ispod 4.000 dolara čak ni u medveđem scenariju. Ako je vaš cilj očuvanje kupovne moći dinara ili evra na duži rok, ulazna tačka je uvek manje bitna od toga da li uopšte imate fizičku imovinu u portfelju. Pre kupovine, upoznajte se s tim ', marks: [] },
        { _type: 'span', _key: 'p17s2', text: 'kako kupiti investiciono zlato', marks: ['link_kako'] },
        { _type: 'span', _key: 'p17s3', text: ' i zašto je ', marks: [] },
        { _type: 'span', _key: 'p17s4', text: 'LBMA sertifikacija', marks: ['link_lbma'] },
        { _type: 'span', _key: 'p17s5', text: ' jedini sigurni garant autentičnosti i dalje prodaje.', marks: [] },
      ],
    },

    // ── H2: ZAKLJUČAK ─────────────────────────────────────
    {
      _type: 'block', _key: 'h2_09', style: 'h2', markDefs: [],
      children: [{ _type: 'span', _key: 'h2_09s', text: 'Zaključak — šta investitori treba da pamte o ceni zlata u 2026.', marks: [] }],
    },
    {
      _type: 'block', _key: 'p18', style: 'normal',
      markDefs: [{ _key: 'link_otkup', _type: 'link', href: 'https://goldinvest.rs/otkup-zlata' }],
      children: [
        { _type: 'span', _key: 'p18s1', text: 'Cena zlata u 2026. godini odražava promenu globalnog investicionog okruženja: centralne banke akumuliraju zlato kao alternativu dolaru, kamatne stope padaju, a geopolitička neizvesnost ne jenjava. Prognoze najvećih svetskih banaka kreću se u rasponu 4.800–6.300 dolara po unci za kraj 2026, a konsenzus je nedvosmisleno uzlazan. Korekcija iz marta bila je zdravi tehnički povlak, ne preokret trenda. Za investitore u Srbiji to znači: fizičko investiciono zlato — LBMA sertifikovane poluge, pločice i dukati — i dalje je najefikasniji instrument zaštite od inflacije i valutnog rizika, uz garantovani ', marks: [] },
        { _type: 'span', _key: 'p18s2', text: 'otkup zlata', marks: ['link_otkup'] },
        { _type: 'span', _key: 'p18s3', text: ' u slučaju potrebe za likvidnošću.', marks: [] },
      ],
    },
  ],
}

// ── POKRETANJE ────────────────────────────────────────────────
async function main() {
  console.log('🔄 Proveravam konekciju sa Sanity...')

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('❌ Nedostaje NEXT_PUBLIC_SANITY_PROJECT_ID u .env.local')
    process.exit(1)
  }
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Nedostaje SANITY_API_TOKEN u .env.local')
    console.error('   Idi na: https://sanity.io/manage → tvoj projekat → API → Tokens → Add API token')
    console.error('   Dodeli: Editor permisiju')
    process.exit(1)
  }

  try {
    const result = await client.create(blogPost)
    console.log('✅ Blog post uspešno kreiran!')
    console.log(`   ID: ${result._id}`)
    console.log(`   Slug: ${result.slug?.current}`)
    console.log(`   Otvori Studio da vidiš post: http://localhost:3000/studio`)
  } catch (err) {
    console.error('❌ Greška:', err.message)
  }
}

main()
