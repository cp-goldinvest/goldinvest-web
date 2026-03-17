import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NumberedCard } from "@/components/ui/NumberedCard";

type Props = {
  title: string;
  description: string;
  card1Body: string;
  card2Body: string;
  card3Body: string;
};

export function PriceStructureSection({ title, description, card1Body, card2Body, card3Body }: Props) {
  return (
    <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
      <SectionContainer>
        <SectionHeading title={title} description={description} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NumberedCard number={1} title="Trenutna kupovina (Roba na stanju)">
            {card1Body}
          </NumberedCard>

          <NumberedCard number={2} title="Avansna kupovina (Najbolja cena zlata)">
            {card2Body}
          </NumberedCard>

          <NumberedCard number={3} title="Otkupna cena (Garantovana likvidnost)">
            {card3Body}
          </NumberedCard>
        </div>
      </SectionContainer>
    </section>
  );
}
