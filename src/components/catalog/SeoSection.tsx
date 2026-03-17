type Props = {
  title: string;
  children: React.ReactNode;
  /** Svetla pozadina (#F9F9F9) za vizuelnu raznolikost */
  accent?: boolean;
};

export function SeoSection({ title, children, accent }: Props) {
  return (
    <section className={`py-10 sm:py-12 ${accent ? "bg-[#F9F9F9]" : ""}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="max-w-[820px]">
          <h2
            className="text-[#1B1B1C] mb-5"
            style={{
              fontFamily: "var(--font-pp-editorial), Georgia, serif",
              fontSize: "clamp(22px, 2.5vw, 32px)",
              fontWeight: 400,
            }}
          >
            {title}
          </h2>
          <div
            className="text-[#3A3A3A] leading-relaxed space-y-3"
            style={{
              fontFamily: "var(--font-rethink), sans-serif",
              fontSize: 16,
              lineHeight: "1.6em",
            }}
          >
            <div className="[&_strong]:text-[#1B1B1C] [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_li]:pl-1">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
