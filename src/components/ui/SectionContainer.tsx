import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function SectionContainer({ children, className }: Props) {
  return (
    <div className={`max-w-[1400px] mx-auto px-4 sm:px-8${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
