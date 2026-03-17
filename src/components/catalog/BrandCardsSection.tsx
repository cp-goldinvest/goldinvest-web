import Image from "next/image";

export type BrandCard = {
  img: string;
  title: string;
  origin: string;
  text: string;
  imageMode?: "logo" | "photo";
  /** Fine-tune logo size (1 = default). */
  imageScale?: number;
};

type Props = {
  title: string;
  description: string;
  brands: BrandCard[];
};

export function BrandCardsSection({ title, description, brands }: Props) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="text-left md:text-center">
          <h2
            style={{
              fontFamily: "var(--font-rethink), sans-serif",
              fontWeight: 500,
              fontSize: 30,
              lineHeight: "27px",
              letterSpacing: "-1px",
              color: "#000000",
              marginBottom: 16,
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-rethink), sans-serif",
              fontWeight: 400,
              fontSize: 17,
              lineHeight: "22px",
              letterSpacing: "0px",
              color: "#9D9072",
              marginBottom: 28,
            }}
            className="max-w-[720px] md:mx-auto"
          >
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {brands.map((b) => (
            <div
              key={b.title}
              className="flex flex-col rounded-2xl overflow-hidden border border-[#F0EDE6] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-shadow"
            >
              <div
                className="relative w-full bg-[#F9F9F9] flex items-center justify-center"
                style={{ height: 200 }}
              >
                <div className="relative w-full h-full px-8 py-10">
                  <Image
                    src={b.img}
                    alt={`${b.title} logo`}
                    fill
                    className={b.imageMode === "photo" ? "object-cover" : "object-contain"}
                    style={b.imageScale ? { transform: `scale(${b.imageScale})` } : undefined}
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-[#BF8E41] text-xs font-semibold tracking-wider uppercase mb-1">
                  {b.origin}
                </span>
                <h3 className="text-[#1B1B1C] font-bold text-lg mb-2">
                  {b.title}
                </h3>
                <p className="text-[#6B6B6B] text-[14px] leading-relaxed">
                  {b.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

