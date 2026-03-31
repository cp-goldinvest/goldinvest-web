"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Phone, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { GoldInvestLogo } from "@/components/ui/GoldInvestLogo";
import { PriceTicker } from "@/components/layout/PriceTicker";

// ── Types ─────────────────────────────────────────────────────
type NavChild = { label: string; href: string; description?: string };
type MegaItem = { label: string; href: string };
type MegaColumn = { title: string; viewAllHref: string; items: MegaItem[] };
type NavItem =
  | { label: string; href: string; children?: never; mega?: never }
  | { label: string; href?: string; children: NavChild[]; mega?: never }
  | { label: string; href?: string; mega: MegaColumn[]; children?: never };

// ── Nav structure ─────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { label: "Početna", href: "/" },
  {
    label: "Proizvodi",
    href: "/proizvodi",
    mega: [
      {
        title: "Zlatne pločice",
        viewAllHref: "/kategorija/zlatne-plocice",
        items: [
          { label: "Zlatna pločica 1g",  href: "/kategorija/zlatne-plocice/zlatna-plocica-1g" },
          { label: "Zlatna pločica 2g",  href: "/kategorija/zlatne-plocice/zlatna-plocica-2g" },
          { label: "Zlatna pločica 5g",  href: "/kategorija/zlatne-plocice/zlatna-plocica-5g" },
          { label: "Zlatna pločica 10g", href: "/kategorija/zlatne-plocice/zlatna-plocica-10g" },
          { label: "Zlatna pločica 20g", href: "/kategorija/zlatne-plocice/zlatna-plocica-20g" },
        ],
      },
      {
        title: "Zlatne poluge",
        viewAllHref: "/kategorija/zlatne-poluge",
        items: [
          { label: "Zlatna poluga 1 unca", href: "/kategorija/zlatne-poluge/zlatna-poluga-1-unca" },
          { label: "Zlatna poluga 50g",    href: "/kategorija/zlatne-poluge/zlatna-poluga-50g" },
          { label: "Zlatna poluga 100g",   href: "/kategorija/zlatne-poluge/zlatna-poluga-100g" },
          { label: "Zlatna poluga 250g",   href: "/kategorija/zlatne-poluge/zlatna-poluga-250g" },
          { label: "Zlatna poluga 500g",   href: "/kategorija/zlatne-poluge/zlatna-poluga-500g" },
          { label: "Zlatna poluga 1kg",    href: "/kategorija/zlatne-poluge/zlatna-poluga-1kg" },
        ],
      },
      // empty items = prikazuje se kao jedan direktan link
      {
        title: "Zlatni dukati",
        viewAllHref: "/kategorija/zlatni-dukati",
        items: [],
      },
      {
        title: "Zlatnici",
        viewAllHref: "/kategorija/zlatni-dukati",
        items: [],
      },
    ],
  },
  {
    label: "O investicionom zlatu",
    children: [
      { label: "Kako kupiti",  href: "/kako-kupiti",  description: "Proces kupovine i plaćanje" },
      { label: "Otkup zlata",  href: "/otkup-zlata",  description: "Garantovani otkup istog dana" },
      { label: "FAQ",          href: "/faq",           description: "Česta pitanja" },
    ],
  },
  { label: "Cena zlata", href: "/cena-zlata" },
  { label: "O nama", href: "/o-nama" },
  {
    label: "Pokloni",
    children: [
      { label: "Poklon za krštenje",       href: "/poklon-za-krstenje",        description: "Zlatne pločice za krštenje" },
      { label: "Poklon za rođenje deteta", href: "/poklon-za-rodjenje-deteta", description: "Najvredniji poklon za novorođenče" },
    ],
  },
  { label: "Blog",    href: "/blog" },
  { label: "Kontakt", href: "/kontakt" },
];

// ── Header component ──────────────────────────────────────────
export function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen]           = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [barsVisible, setBarsVisible]     = useState(true);
  const [openDropdown, setOpenDropdown]   = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]       = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      if (y < 10) {
        setBarsVisible(true);
      } else if (y > lastScrollY.current + 4) {
        setBarsVisible(false);
      } else if (y < lastScrollY.current - 4) {
        setBarsVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function handleMouseEnter(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  }
  function handleMouseLeave() {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">

      {/* Top bar — phone number (hides on scroll down) */}
      <div
        className="w-full overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: barsVisible ? "40px" : "0px",
          opacity: barsVisible ? 1 : 0,
          background: "#F5F1E5",
          borderBottom: "1px solid #E2D7BF",
        }}
      >
      <div className="w-full h-10 flex items-center overflow-hidden">
        {/* Desktop: centrirano */}
        <div className="hidden sm:flex w-full items-center justify-center">
          <a href="tel:+381612698569" className="flex items-center gap-2 text-[#4A3F2F] hover:opacity-80 transition-opacity">
            <Phone size={15} color="#4A3F2F" />
            <span className="text-[14px]">Pozovite za sve informacije →</span>
            <span className="text-[14px] font-bold ml-1 text-[#BF8E41]">061/269-8569</span>
          </a>
        </div>
        {/* Mobile: static (centered) */}
        <div className="flex sm:hidden w-full items-center justify-center">
          <a href="tel:+381612698569" className="flex items-center gap-2 text-[#4A3F2F] text-[14px] hover:opacity-80 transition-opacity">
            <Phone size={15} color="#4A3F2F" />
            <span>Pozovite za sve informacije →</span>
            <span className="font-bold ml-1 text-[#BF8E41]">061/269-8569</span>
          </a>
        </div>
      </div>
      </div>

      {/* Main nav — white background */}
      <div
        className={[
          "relative z-10 transition-all duration-300 bg-white",
          scrolled ? "shadow-[0_1px_8px_rgba(0,0,0,0.08)]" : "border-b border-[#EBEBEB]",
        ].join(" ")}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 focus:outline-none" aria-label="Gold Invest — početna">
              <GoldInvestLogo className="h-8 lg:h-9 w-auto" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Glavna navigacija">
              {NAV_ITEMS.map((item) => {
                if (item.mega) {
                  return (
                    <MegaDropdown
                      key={item.label}
                      label={item.label}
                      href={item.href}
                      columns={item.mega}
                      isOpen={openDropdown === item.label}
                      onEnter={() => handleMouseEnter(item.label)}
                      onLeave={handleMouseLeave}
                      onClose={() => setOpenDropdown(null)}
                    />
                  );
                }
                if (item.children) {
                  return (
                    <DropdownItem
                      key={item.label}
                      item={item as { label: string; children: NavChild[] }}
                      isOpen={openDropdown === item.label}
                      onEnter={() => handleMouseEnter(item.label)}
                      onLeave={handleMouseLeave}
                      onClose={() => setOpenDropdown(null)}
                    />
                  );
                }
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-[#1A1A1A] hover:text-[#BF8E41] transition-colors duration-200 rounded whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile: hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-2 text-[#1A1A1A] hover:text-[#BF8E41] transition-colors"
                aria-label={menuOpen ? "Zatvori meni" : "Otvori meni"}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Price ticker — ispod glavnog menija (hides on scroll down) */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: barsVisible ? "40px" : "0px", opacity: barsVisible ? 1 : 0 }}
      >
        <PriceTicker />
      </div>

      {/* Mobile menu */}
      <div
        className={[
          "lg:hidden fixed inset-0 z-40 transition-all duration-300",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        style={{ top: "88px" }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
        <nav
          className={[
            "absolute top-0 left-0 right-0 bg-white border-b border-[#EBEBEB] max-h-[calc(100vh-116px)] overflow-y-auto",
            "transition-transform duration-300",
            menuOpen ? "translate-y-0" : "-translate-y-full",
          ].join(" ")}
        >
          <div className="px-4 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const hasChildren = item.children || item.mega;
              const allChildren: NavChild[] = item.mega
                ? item.mega.flatMap((col) => [
                    { label: col.title, href: col.viewAllHref, description: "Sve →" },
                    ...col.items,
                  ])
                : (item.children ?? []);

              if (hasChildren) {
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => setMobileOpen(mobileOpen === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium text-[#1A1A1A] hover:bg-[#FAF8F2] transition-colors"
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={`text-[#BF8E41] transition-transform duration-200 ${mobileOpen === item.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    {mobileOpen === item.label && (
                      <div className="ml-3 border-l border-[#EBEBEB] pl-3 flex flex-col gap-0.5 mb-1">
                        {item.mega ? (
                          item.mega.map((col) => (
                            <div key={col.title} className="mb-2">
                              <Link
                                href={col.viewAllHref}
                                onClick={() => setMenuOpen(false)}
                                className="block px-3 py-1.5 text-xs font-semibold text-[#BF8E41] uppercase tracking-widest"
                              >
                                {col.title}
                              </Link>
                              {col.items.map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  onClick={() => setMenuOpen(false)}
                                  className="flex px-3 py-2 rounded-lg hover:bg-[#FAF8F2] text-sm text-[#444] hover:text-[#BF8E41] transition-colors"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          ))
                        ) : (
                          allChildren.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMenuOpen(false)}
                              className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-[#FAF8F2] transition-colors group"
                            >
                              <span className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#BF8E41] transition-colors">
                                {child.label}
                              </span>
                              {child.description && (
                                <span className="text-xs text-[#888] mt-0.5">{child.description}</span>
                              )}
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-3 rounded-lg text-base font-medium text-[#1A1A1A] hover:bg-[#FAF8F2] hover:text-[#BF8E41] transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}

          </div>
        </nav>
      </div>
    </header>
  );
}

// ── Mega menu dropdown ────────────────────────────────────────
function MegaDropdown({
  label, href, columns, isOpen, onEnter, onLeave, onClose,
}: {
  label: string;
  href?: string;
  columns: MegaColumn[];
  isOpen: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        className={[
          "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded transition-colors duration-200 whitespace-nowrap",
          isOpen ? "text-[#BF8E41]" : "text-[#1A1A1A] hover:text-[#BF8E41]",
        ].join(" ")}
        aria-expanded={isOpen}
        onClick={() => {
          if (href) {
            // use window.location to avoid hook usage in this helper component
            window.location.href = href;
          }
        }}
      >
        {label}
        <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown panel */}
      <div
        className={[
          "absolute top-full left-0 mt-2 w-64 z-[60] rounded-xl overflow-hidden",
          "bg-white border border-[#EBEBEB] shadow-[0_4px_24px_rgba(0,0,0,0.08)]",
          "transition-all duration-200 origin-top",
          isOpen ? "opacity-100 scale-y-100 pointer-events-auto translate-y-0" : "opacity-0 scale-y-95 pointer-events-none -translate-y-1",
        ].join(" ")}
      >
        <div className="py-2 max-h-[70vh] overflow-y-auto">
          {columns.map((col, colIdx) => (
            <div key={col.title}>
              {col.items.length > 0 ? (
                <>
                  <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <span className="text-[10px] font-bold text-[#BF8E41] uppercase tracking-widest">
                      {col.title}
                    </span>
                    <Link href={col.viewAllHref} onClick={onClose} className="text-[10px] text-[#999] hover:text-[#BF8E41] transition-colors">
                      sve →
                    </Link>
                  </div>
                  {col.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center px-4 py-1.5 text-sm text-[#444] hover:text-[#BF8E41] hover:bg-[#FAF8F2] transition-all duration-150"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#BF8E41]/50 mr-2.5 shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  href={col.viewAllHref}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-[#1A1A1A] hover:text-[#BF8E41] hover:bg-[#FAF8F2] transition-all duration-150 group"
                >
                  {col.title}
                  <ChevronRight size={13} className="text-[#999] group-hover:text-[#BF8E41] transition-colors" />
                </Link>
              )}

              {colIdx < columns.length - 1 && (
                <div className="mx-4 mt-1 mb-0 border-t border-[#EBEBEB]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Simple dropdown ───────────────────────────────────────────
function DropdownItem({
  item, isOpen, onEnter, onLeave, onClose,
}: {
  item: { label: string; children: NavChild[] };
  isOpen: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        className={[
          "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded transition-colors duration-200 whitespace-nowrap",
          isOpen ? "text-[#BF8E41]" : "text-[#1A1A1A] hover:text-[#BF8E41]",
        ].join(" ")}
        aria-expanded={isOpen}
      >
        {item.label}
        <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div
        className={[
          "absolute top-full left-0 mt-2 w-64 z-[60] rounded-xl overflow-hidden",
          "bg-white border border-[#EBEBEB] shadow-[0_4px_24px_rgba(0,0,0,0.08)]",
          "transition-all duration-200 origin-top",
          isOpen ? "opacity-100 scale-y-100 pointer-events-auto translate-y-0" : "opacity-0 scale-y-95 pointer-events-none -translate-y-1",
        ].join(" ")}
      >
        <div className="py-2">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onClose}
              className="flex items-start px-4 py-1.5 hover:bg-[#FAF8F2] transition-all duration-150 group"
            >
              <span className="w-1 h-1 rounded-full bg-[#BF8E41]/50 mr-2.5 shrink-0 mt-[7px]" />
              <span className="flex flex-col">
                <span className="text-sm text-[#444] group-hover:text-[#BF8E41] transition-colors">
                  {child.label}
                </span>
                {child.description && (
                  <span className="text-[11px] text-[#AAA] mt-0.5 leading-tight">{child.description}</span>
                )}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
