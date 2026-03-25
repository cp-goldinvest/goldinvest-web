import type { Post } from "@/components/blog/BlogGrid";

/** Same source as blog listing — single place for static post data. */
export const BLOG_POSTS: Post[] = [
  {
    slug: "zasto-ulagati-u-zlato",
    title: "Zašto ulagati u zlato — 7 razloga koje svaki investitor treba da zna",
    excerpt:
      "Zlato čuva vrednost kroz decenije, štiti od inflacije i valutnih kriza. Evo konkretnih razloga zašto finansijski stručnjaci preporučuju 5–15% zlata u portfelju.",
    category: "Investiciono zlato",
    date: "15. mart 2025.",
    readMin: 7,
    image: "/images/bento-gold-bar.png",
    imageAlt: "Zlatna poluga kao investicija",
    featured: true,
  },
  {
    slug: "kako-odrediti-cenu-zlata",
    title: "Kako se formira cena zlata na tržištu",
    excerpt:
      "London Bullion Market Association (LBMA) dva puta dnevno objavljuje referentnu cenu zlata. Saznajte šta utiče na kurs i kako pratiti pravi trenutak za kupovinu.",
    category: "Tržište",
    date: "8. mart 2025.",
    readMin: 5,
    image: "/images/faktori-1.png",
    imageAlt: "Grafikon cene zlata na berzi",
  },
  {
    slug: "zlatne-poluge-vs-novcanice",
    title: "Zlatne poluge ili novčanice — šta je bolje za početnike",
    excerpt:
      "Poluge nude nižu premiju za veće iznose, dok novčanice omogućavaju fleksibilnu prodaju u manjim količinama. Uporedite prednosti i mane oba formata.",
    category: "Vodič",
    date: "1. mart 2025.",
    readMin: 6,
    image: "/images/bento-coins.png",
    imageAlt: "Zlatne poluge i zlatnici",
  },
  {
    slug: "inflacija-i-zlato",
    title: "Inflacija i zlato — istorijska veza koja štiti vašu ušteđevinu",
    excerpt:
      "U periodima visoke inflacije, zlato je istorijski čuvalo kupovnu moć. Pogledajte podatke iz poslednjih 50 godina i šta to znači za vaš novac danas.",
    category: "Saveti",
    date: "22. februar 2025.",
    readMin: 8,
    image: "/images/faktori-inflacija.png",
    imageAlt: "Inflacija i zaštita ušteđevine zlatom",
  },
  {
    slug: "lbma-sertifikacija-sta-znaci",
    title: "LBMA sertifikacija — zašto je važna i kako je prepoznati",
    excerpt:
      "Samo zlato od LBMA akreditovanih kovnica garantuje međunarodnu prihvatljivost i lakšu preprodaju. Naučite kako da proverite poreklo pre kupovine.",
    category: "Vodič",
    date: "14. februar 2025.",
    readMin: 4,
    image: "/images/edu-sertifikati-lbma.png",
    imageAlt: "LBMA sertifikat za zlatnu polugu",
  },
  {
    slug: "centralne-banke-kupuju-zlato",
    title: "Centralne banke rekordno kupuju zlato — šta to znači za vas",
    excerpt:
      "U 2024. centralnim bankama sveta kupile su više zlata nego ikad. Otkrijte zašto ovo povećava dugoročni pritisak na cenu i kako to utiče na privatne investitore.",
    category: "Tržište",
    date: "5. februar 2025.",
    readMin: 6,
    image: "/images/faktori-centralne-banke.png",
    imageAlt: "Centralne banke i zlato",
  },
  {
    slug: "kako-cuvati-fizicko-zlato",
    title: "Kako čuvati fizičko zlato — sef, banka ili kuća",
    excerpt:
      "Čuvanje zlata kod kuće, u bankarskom sefu ili kod dilera — svaka opcija ima svoje prednosti i rizike. Ovaj vodič pomaže da donesete pravu odluku.",
    category: "Saveti",
    date: "28. januar 2025.",
    readMin: 5,
    image: "/images/jastuk-poluga.png",
    imageAlt: "Čuvanje fizičkog zlata u sefu",
  },
  {
    slug: "kamatne-stope-i-cena-zlata",
    title: "Kamatne stope i cena zlata — inverzna veza koju morate razumeti",
    excerpt:
      "Kada kamatne stope rastu, cena zlata obično pada — i obrnuto. Razumevanje ove veze pomaže vam da bolje planirate trenutak ulaska u investiciju.",
    category: "Tržište",
    date: "20. januar 2025.",
    readMin: 5,
    image: "/images/faktori-kamatne-stope.png",
    imageAlt: "Kamatne stope i kretanje cene zlata",
  },
];

const MONTH_ORDER: Record<string, number> = {
  januar: 1,
  februar: 2,
  mart: 3,
  april: 4,
  maj: 5,
  jun: 6,
  jul: 7,
  avgust: 8,
  septembar: 9,
  oktobar: 10,
  novembar: 11,
  decembar: 12,
};

function postDateMs(dateStr: string): number {
  const m = dateStr.trim().match(/^(\d+)\.\s*([^\s.]+)\s*(\d{4})/i);
  if (!m) return 0;
  const day = Number(m[1]);
  const mon = MONTH_ORDER[m[2].toLowerCase()] ?? 0;
  const year = Number(m[3]);
  if (!mon) return 0;
  return new Date(year, mon - 1, day).getTime();
}

/** Newest first (by `date` string), then take first `count`. */
export function getLatestBlogPosts(posts: Post[], count: number): Post[] {
  return [...posts]
    .sort((a, b) => postDateMs(b.date) - postDateMs(a.date))
    .slice(0, count);
}
