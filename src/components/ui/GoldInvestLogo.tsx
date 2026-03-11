interface LogoProps {
  className?: string;
}

// TODO: Replace with real SVG from designer (Sara Bojovic)
// Request format: SVG export from Figma, both variants:
//   1. Horizontal — GOLD [icon] INVEST  (for desktop header)
//   2. Stacked    — icon + GOLDINVEST   (for mobile / favicon)
export function GoldInvestLogo({ className = "h-10 w-auto" }: LogoProps) {
  return (
    <span className={`font-serif font-semibold tracking-widest text-[#BF8E41] ${className}`}>
      GOLD INVEST
    </span>
  );
}
