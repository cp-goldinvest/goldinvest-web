import Link from "next/link";
import { MapPin, Truck, ShieldCheck } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  heading: string;
  description: string;
  /** Body text for the first card ("Lično preuzimanje") — only part that varies per category */
  pickupCardBody: string;
};

export function DeliverySection({ heading, description, pickupCardBody }: Props) {
  return (
    <section className="bg-[#F9F9F9] py-16 sm:py-20 border-t border-[#F0EDE6]">
      <SectionContainer>
        <SectionHeading title={heading} description={description} />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 md:gap-10 items-start">
          {/* Left: highlight card */}
          <div className="bg-white rounded-2xl border border-[#F0EDE6] p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#BF8E41] mb-3">
              Prodaja i isporuka
            </p>
            <h3
              className="text-[#1B1B1C] mb-4"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontSize: "clamp(22px, 2.5vw, 30px)",
                fontWeight: 400,
              }}
            >
              Kako preuzimate svoju zlatnu polugu?
            </h3>
            <p
              className="text-[#4C4C4C] text-sm leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              {description}
            </p>
            <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-7">
              Bilo da dolazite lično u Beograd ili želite diskretnu dostavu na kućnu adresu, svaka
              pošiljka je osigurana i pripremljena tako da samo vi znate šta se nalazi u paketu.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: "#BEAD87",
                  fontSize: "12.1px",
                  boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)",
                }}
              >
                Kontakt forma
              </Link>
              <a
                href="tel:+381612698569"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full font-semibold transition-all duration-200"
                style={{
                  border: "0.5px solid #1B1B1C",
                  color: "#1B1B1C",
                  fontSize: "12.1px",
                }}
              >
                Pozovi: 061/269-8569
              </a>
            </div>
          </div>

          {/* Right: vertical steps */}
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#1B1B1C] text-white flex items-center justify-center shrink-0">
                <MapPin size={17} />
              </span>
              <div>
                <p className="text-[#1B1B1C] text-sm font-semibold mb-1 leading-snug">
                  Lično preuzimanje (Beograd)
                </p>
                <p className="text-[#6B6B6B] text-[13px] leading-relaxed">
                  {pickupCardBody}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#1B1B1C] text-white flex items-center justify-center shrink-0">
                <Truck size={17} />
              </span>
              <div>
                <p className="text-[#1B1B1C] text-sm font-semibold mb-1 leading-snug">
                  Beograd — dan za dan
                </p>
                <p className="text-[#6B6B6B] text-[13px] leading-relaxed">
                  Porudžbine evidentirane radnim danima do 12h isporučujemo na adresu istog dana do 18h.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#1B1B1C] text-white flex items-center justify-center shrink-0">
                <ShieldCheck size={17} />
              </span>
              <div>
                <p className="text-[#1B1B1C] text-sm font-semibold mb-1 leading-snug">
                  Isporuka za celu Srbiju
                </p>
                <p className="text-[#6B6B6B] text-[13px] leading-relaxed">
                  Maksimalno osigurana, diskretna pošiljka — rok isporuke 1 do 3 radna dana (avansne kupovine po dogovoru).
                </p>
              </div>
            </div>
          </div>
        </div>

      </SectionContainer>
    </section>
  );
}
