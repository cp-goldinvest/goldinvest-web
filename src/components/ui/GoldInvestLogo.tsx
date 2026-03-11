import Image from "next/image";

interface LogoProps {
  className?: string;
}

export function GoldInvestLogo({ className = "h-8 w-auto" }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Gold Invest"
      width={158}
      height={29}
      className={className}
      priority
    />
  );
}
