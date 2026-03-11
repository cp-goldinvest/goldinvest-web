import Image from "next/image";

const GALLERY = [
  { src: "/images/gallery-1.png", alt: "Zlatne poluge LBMA" },
  { src: "/images/gallery-2.png", alt: "Zlatna pločica" },
  { src: "/images/gold-coins.png", alt: "Zlatni dukati" },
  { src: "/images/hero-gold.png", alt: "Investiciono zlato" },
];

export function GallerySection() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-[1143px] mx-auto px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {GALLERY.map((img, i) => (
            <div
              key={i}
              className="bg-[#F9F9F9] rounded-[9px] overflow-hidden aspect-square relative"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
