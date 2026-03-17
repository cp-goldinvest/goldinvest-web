import { ReactNode } from "react";

type Props = {
  number: number;
  title: string;
  children: ReactNode;
};

export function NumberedCard({ number, title, children }: Props) {
  return (
    <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-7">
      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1B1B1C] text-white text-sm font-semibold">
          {number}
        </span>
        <p className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-0">
          {title}
        </p>
      </div>
      <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
        {children}
      </p>
    </div>
  );
}
