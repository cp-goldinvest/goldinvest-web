"use client";

import { useEffect, useRef, useState } from "react";

const PhoneIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-[#BF8E41] shrink-0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.17 3.4 2 2 0 0 1 3.15 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#BF8E41]/60 shrink-0">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

function BarContent() {
  return (
    <span className="inline-flex items-center gap-2 px-4">
      <PhoneIcon />
      <span className="text-xs text-[#9A9A8A] whitespace-nowrap">
        Pozovite za individualnu ponudu i besplatnu konsultaciju —
      </span>
      <span className="text-xs font-semibold text-[#BF8E41] tracking-wide whitespace-nowrap">
        061 269 8569
      </span>
      <ArrowIcon />
    </span>
  );
}

export function PhoneBar() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 10) {
        setVisible(true);
      } else if (y > lastScrollY.current + 5) {
        setVisible(false);      // scrolling down → hide
      } else if (y < lastScrollY.current - 5) {
        setVisible(true);       // scrolling up → show
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={[
        "bg-[#111112] border-b border-[#2E2E2F] overflow-hidden transition-all duration-300",
        visible ? "max-h-9 opacity-100" : "max-h-0 opacity-0 border-b-0",
      ].join(" ")}
    >
      <div className="h-9">
        {/* Mobile: static */}
        <a
          href="tel:+381612698569"
          className="flex lg:hidden items-center justify-center h-full w-full"
        >
          <BarContent />
        </a>

        {/* Desktop: centered static */}
        <a
          href="tel:+381612698569"
          className="hidden lg:flex items-center justify-center gap-2 h-full max-w-7xl mx-auto px-8 group hover:opacity-80 transition-opacity duration-200"
        >
          <PhoneIcon />
          <span className="text-xs text-[#9A9A8A] whitespace-nowrap">
            Pozovite za individualnu ponudu i besplatnu konsultaciju —
          </span>
          <span className="text-xs font-semibold text-[#BF8E41] tracking-wide whitespace-nowrap group-hover:text-[#D4A84F] transition-colors duration-200">
            061 269 8569
          </span>
          <ArrowIcon />
        </a>
      </div>
    </div>
  );
}
