type Props = {
  title: string;
  description?: string;
  eyebrow?: string;
  /** Extra classes for the outer wrapper, e.g. "py-1" or "py-4" */
  className?: string;
  /** Tailwind max-width class for the description paragraph. Defaults to "max-w-[780px]" */
  descriptionMaxWidth?: string;
};

export function SectionHeading({
  title,
  description,
  eyebrow,
  className,
  descriptionMaxWidth = "max-w-[780px]",
}: Props) {
  return (
    <div className={`text-left md:text-center mb-12${className ? ` ${className}` : ""}`}>
      {eyebrow && (
        <span className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-4 block">
          {eyebrow}
        </span>
      )}
      <h2
        className="text-[#1B1B1C] mb-4"
        style={{
          fontFamily: "var(--font-rethink), sans-serif",
          fontWeight: 500,
          fontSize: 30,
          lineHeight: "27px",
          letterSpacing: "-1px",
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`${descriptionMaxWidth} md:mx-auto md:text-center`}
          style={{
            fontFamily: "var(--font-rethink), sans-serif",
            fontWeight: 400,
            fontSize: 17,
            lineHeight: "22px",
            letterSpacing: 0,
            color: "#9D9072",
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
