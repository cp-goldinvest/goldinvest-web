import { ReactNode } from "react";

type Props = {
  /** Card title — accepts ReactNode to support inline links/spans */
  title: ReactNode;
  children: ReactNode;
  className?: string;
};

export function InfoCard({ title, children, className }: Props) {
  return (
    <div className={`bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-7${className ? ` ${className}` : ""}`}>
      <p className="text-[#1B1B1C] text-[15px] font-semibold mb-2 leading-snug">
        {title}
      </p>
      <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
        {children}
      </p>
    </div>
  );
}
