import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
};

export function IconCard({ icon, title, children, className }: Props) {
  return (
    <div className={`bg-white border border-[#F0EDE6] rounded-2xl p-6 sm:p-7${className ? ` ${className}` : ""}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="w-10 h-10 rounded-xl bg-[#1B1B1C] text-white flex items-center justify-center">
          {icon}
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
