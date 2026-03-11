"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Phone, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { GoldInvestLogo } from "@/components/ui/GoldInvestLogo";
import { PhoneBar } from "@/components/layout/PhoneBar";
import { PriceTicker } from "@/components/layout/PriceTicker";

// ── Types ─────────────────────────────────────────────────────
type NavChild = { label: string; href: string; description?: string };
type MegaItem = { label: string; href: string };
type MegaColumn = { title: string; viewAllHref: string; items: MegaItem[] };
type NavItem =
  | { label: string; href: string; children?: never; mega?: never }
  | { label: string; href?: never; children: NavChild[]; mega?: never }
  | { label: string; href?: never; mega: MegaColumn[]; children?: never };

// ── Nav structure ─────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { label: "Početna", href: "/" },
  {
    label: "Ponuda",
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
      { label: "Kako kupiti",  href: "/kako-kupiti", description: "Proces kupovine i plaćanje" },
      { label: "Otkup zlata",  href: "/otkup",       description: "Garantovani otkup istog dana" },
      { label: "FAQ",          href: "/faq",          description: "Česta pitanja" },
      { label: "O nama",       href: "/o-nama",       description: "Ko smo i gde smo" },
    ],
  },
  { label: "Cena zlata", href: "/cena-zlata" },
  {
    label: "Pokloni",
    children: [
      { label: "Poklon za krštenje",       href: "/pokloni/poklon-za-krstenje",        description: "Zlatne pločice za krštenje" },
      { label: "Poklon za rođenje deteta", href: "/pokloni/poklon-za-rodjenje-deteta", description: "Najvredniji poklon za novorođenče" },
    ],
  },
  { label: "Blog",    href: "/blog" },
  { label: "Kontakt", href: "/kontakt" },
];

// ── Header component ──────────────────────────────────────────
export function Header() {
  const [menuOpen, setMenuOpen]           = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [openDropdown, setOpenDropdown]   = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]       = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
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
      <PhoneBar />

      {/* Main nav — relative z-10 keeps dropdowns above PriceTicker */}
      <div
        className={[
          "relative z-10 transition-all duration-300",
          scrolled
            ? "bg-[#1B1B1C]/95 backdrop-blur-md shadow-[0_1px_0_rgba(191,142,65,0.2)]"
            : "bg-[#1B1B1C]",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BF8E41] rounded" aria-label="Gold Invest — početna">
              <GoldInvestLogo className="h-8 lg:h-10 w-auto" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Glavna navigacija">
              {NAV_ITEMS.map((item) => {
                if (item.mega) {
                  return (
                    <MegaDropdown
                      key={item.label}
                      label={item.label}
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
                    className="px-3 py-2 text-sm font-medium text-[#E9E6D9] hover:text-[#BF8E41] transition-colors duration-200 rounded whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <Link href="/kontakt" className="px-5 py-2 text-sm font-semibold text-[#1B1B1C] rounded gold-gradient-bg hover:opacity-90 transition-opacity duration-200 whitespace-nowrap">
                Pošalji upit
              </Link>
            </div>

            {/* Mobile: hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-2 text-[#E9E6D9] hover:text-[#BF8E41] transition-colors"
                aria-label={menuOpen ? "Zatvori meni" : "Otvori meni"}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Price ticker */}
      <PriceTicker />

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
            "absolute top-0 left-0 right-0 bg-[#1B1B1C] border-b border-[#2E2E2F] max-h-[calc(100vh-88px)] overflow-y-auto",
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
                      className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium text-[#E9E6D9] hover:bg-[#242425] transition-colors"
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={`text-[#BF8E41] transition-transform duration-200 ${mobileOpen === item.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    {mobileOpen === item.label && (
                      <div className="ml-3 border-l border-[#2E2E2F] pl-3 flex flex-col gap-0.5 mb-1">
                        {item.mega ? (
                          // Mega menu mobile: show column titles as headers
                          item.mega.map((col) => (
                            <div key={col.title} className="mb-2">
                              <Link
                                href={col.viewAllHref}
                                onClick={() => setMenuOpen(false)}
                                className="block px-3 py-1.5 text-xs font-semibold text-[#BF8E41] uppercase tracking-widest hover:text-[#D4A84F] transition-colors"
                              >
                                {col.title}
                              </Link>
                              {col.items.map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  onClick={() => setMenuOpen(false)}
                                  className="flex px-3 py-2 rounded-lg hover:bg-[#242425] transition-colors text-sm text-[#E9E6D9] hover:text-[#BF8E41]"
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
                              className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-[#242425] transition-colors group"
                            >
                              <span className="text-sm font-medium text-[#E9E6D9] group-hover:text-[#BF8E41] transition-colors">
                                {child.label}
                              </span>
                              {child.description && (
                                <span className="text-xs text-[#8A8A8A] mt-0.5">{child.description}</span>
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
                  className="px-3 py-3 rounded-lg text-base font-medium text-[#E9E6D9] hover:bg-[#242425] hover:text-[#BF8E41] transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-3 pt-3 border-t border-[#2E2E2F] flex flex-col gap-3">
              <a
                href="tel:+381612698569"
                className="flex items-center justify-center gap-2 py-3.5 rounded-lg border border-[#BF8E41]/40 text-[#BF8E41] font-medium hover:bg-[#BF8E41]/10 transition-colors"
              >
                <Phone size={16} />
                061 269 8569
              </a>
              <Link
                href="/kontakt"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center py-3.5 rounded-lg font-semibold text-[#1B1B1C] gold-gradient-bg hover:opacity-90 transition-opacity"
              >
                Pošalji upit
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

// ── Mega menu dropdown ────────────────────────────────────────
function MegaDropdown({
  label, columns, isOpen, onEnter, onLeave, onClose,
}: {
  label: string;
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
          isOpen ? "text-[#BF8E41]" : "text-[#E9E6D9] hover:text-[#BF8E41]",
        ].join(" ")}
        aria-expanded={isOpen}
      >
        {label}
        <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown panel — single vertical list */}
      <div
        className={[
          "absolute top-full left-0 mt-1 w-64 z-[60] rounded-xl overflow-hidden",
          "bg-[#1E1E1F] border border-[#2E2E2F] shadow-2xl",
          "transition-all duration-200 origin-top",
          isOpen ? "opacity-100 scale-y-100 pointer-events-auto translate-y-0" : "opacity-0 scale-y-95 pointer-events-none -translate-y-1",
        ].join(" ")}
      >
        <div className="py-2 max-h-[70vh] overflow-y-auto">
          {columns.map((col, colIdx) => (
            <div key={col.title}>
              {col.items.length > 0 ? (
                /* ── Category with sub-items ── */
                <>
                  <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <span className="text-[10px] font-bold text-[#BF8E41] uppercase tracking-widest">
                      {col.title}
                    </span>
                    <Link href={col.viewAllHref} onClick={onClose} className="text-[10px] text-[#555] hover:text-[#BF8E41] transition-colors">
                      sve →
                    </Link>
                  </div>
                  {col.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center px-4 py-1.5 text-sm text-[#9A9A8A] hover:text-[#E9E6D9] hover:bg-[#2A2A2B] transition-all duration-150"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#BF8E41]/40 mr-2.5 shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                </>
              ) : (
                /* ── Direct link (no sub-items) ── */
                <Link
                  href={col.viewAllHref}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-[#E9E6D9] hover:text-[#BF8E41] hover:bg-[#2A2A2B] transition-all duration-150 group"
                >
                  {col.title}
                  <ChevronRight size={13} className="text-[#555] group-hover:text-[#BF8E41] transition-colors" />
                </Link>
              )}

              {colIdx < columns.length - 1 && (
                <div className="mx-4 mt-1 mb-0 border-t border-[#2E2E2F]" />
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
          isOpen ? "text-[#BF8E41]" : "text-[#E9E6D9] hover:text-[#BF8E41]",
        ].join(" ")}
        aria-expanded={isOpen}
      >
        {item.label}
        <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div
        className={[
          "absolute top-full left-0 mt-1 min-w-56 rounded-xl overflow-hidden z-[60]",
          "bg-[#1E1E1F] border border-[#2E2E2F] shadow-2xl",
          "transition-all duration-200 origin-top",
          isOpen ? "opacity-100 scale-y-100 pointer-events-auto translate-y-0" : "opacity-0 scale-y-95 pointer-events-none -translate-y-1",
        ].join(" ")}
      >
        {item.children.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            onClick={onClose}
            className="flex flex-col px-4 py-3 hover:bg-[#2E2E2F] transition-colors border-b border-[#2E2E2F] last:border-0 group"
          >
            <span className="text-sm font-medium text-[#E9E6D9] group-hover:text-[#BF8E41] transition-colors">
              {child.label}
            </span>
            {child.description && (
              <span className="text-xs text-[#8A8A8A] mt-0.5">{child.description}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
