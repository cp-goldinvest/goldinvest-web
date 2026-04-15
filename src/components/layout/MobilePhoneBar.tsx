'use client';

import { Phone } from "lucide-react";

export default function MobilePhoneBar() {
  return (
    <a
      href="tel:+381614264129"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-3 bg-[#1A1400] py-4 px-6 text-white"
      style={{ boxShadow: "0 -2px 12px rgba(0,0,0,0.35)" }}
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#C9A84C]">
        <Phone size={16} className="text-[#1A1400]" strokeWidth={2.5} />
      </span>
      <span
        style={{ fontFamily: "var(--font-rethink), sans-serif", fontWeight: 600, fontSize: "1rem", letterSpacing: "0.01em" }}
      >
        061 426 4129
      </span>
    </a>
  );
}
