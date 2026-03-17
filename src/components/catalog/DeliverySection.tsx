import Link from "next/link";
import { MapPin, Truck, ShieldCheck } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconCard } from "@/components/ui/IconCard";

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <IconCard icon={<MapPin size={18} />} title="Lično preuzimanje (Beograd)">
            {pickupCardBody}
          </IconCard>

          <IconCard icon={<Truck size={18} />} title="Beograd — dan za dan">
            Za porudžbine evidentirane radnim danima do 12h, isporuka na adresu istog dana do 18h (dan za dan).
          </IconCard>

          <IconCard icon={<ShieldCheck size={18} />} title="Isporuka za celu Srbiju">
            Maksimalno osigurana, potpuno neprimetna pošiljka — rok isporuke 1 do 3 radna dana (avansne kupovine po dogovoru).
          </IconCard>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-center">
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
      </SectionContainer>
    </section>
  );
}
