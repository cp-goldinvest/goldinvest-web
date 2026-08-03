"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export type TocItem = { id: string; text: string };

type Props = {
  items: TocItem[];
};

export function TableOfContents({ items }: Props) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    const headingEls = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingEls.length === 0) return;

    const ACTIVE_LINE = 200; // px from viewport top; matches heading scroll-mt offset

    let ticking = false;
    const updateActive = () => {
      ticking = false;
      let current = headingEls[0].id;
      for (const el of headingEls) {
        if (el.getBoundingClientRect().top - ACTIVE_LINE <= 0) {
          current = el.id;
        }
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  if (items.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
    setOpen(false);
  };

  return (
    <nav
      aria-label="Sadržaj članka"
      className="mb-8 lg:mb-0 lg:sticky lg:top-[176px] lg:self-start"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#F0EDE6] bg-[#FAFAF8] px-4 py-3 text-left lg:hidden"
      >
        <span
          className="text-[13px] font-semibold uppercase tracking-wide text-[#1B1B1C]"
          style={{ fontFamily: "var(--font-rethink), sans-serif" }}
        >
          Sadržaj članka
        </span>
        <ChevronDown
          size={16}
          className={`text-[#9D9072] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <ul
        className={`${open ? "block" : "hidden"} mt-2 space-y-1 rounded-xl border border-[#F0EDE6] bg-[#FAFAF8] p-4 lg:mt-0 lg:block lg:border-0 lg:bg-transparent lg:p-0`}
      >
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                aria-current={isActive ? "location" : undefined}
                className={`block border-l-2 py-1.5 pl-3 text-[14px] leading-snug transition-colors ${
                  isActive
                    ? "border-[#BF8E41] font-semibold text-[#1B1B1C]"
                    : "border-transparent text-[#6B6B6B] hover:text-[#1B1B1C]"
                }`}
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
