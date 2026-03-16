type Props = {
  title: string;
  children: React.ReactNode;
};

export function SeoSection({ title, children }: Props) {
  return (
    <section className="py-8 first:pt-0">
      <h2
        className="text-[#1B1B1C] mb-4"
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
    </section>
  );
}
