"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  Package,
  Inbox,
  LogOut,
  ChevronRight,
  LayoutList,
} from "lucide-react";

// Dnevne operacije — koriste se svaki dan
const NAV_DAILY = [
  { href: "/admin/cene",   label: "Cene i marže", icon: TrendingUp, desc: "Kursevi, marže, override" },
  { href: "/admin/zalihe", label: "Zalihe",        icon: Package,    desc: "Stanje na stanju" },
  { href: "/admin/upiti",  label: "Upiti",         icon: Inbox,      desc: "Zahtevi klijenata" },
];

// Admin alati — koriste se retko
const NAV_ADMIN = [
  { href: "/admin/proizvodi", label: "Katalog proizvoda", icon: LayoutList, desc: "Dodaj / ukloni proizvode" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#111112] flex">

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="w-64 shrink-0 bg-[#1B1B1C] border-r border-[#2E2E2F] flex flex-col">

        {/* Logo / brand */}
        <div className="px-6 py-5 border-b border-[#2E2E2F]">
          <p className="text-xs font-semibold text-[#BF8E41] tracking-widest uppercase">Gold Invest</p>
          <p className="text-[11px] text-[#555] mt-0.5">Admin panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-4">
          {/* Dnevne operacije */}
          <div className="space-y-1">
            {NAV_DAILY.map(({ href, label, icon: Icon, desc }) => (
              <NavLink key={href} href={href} label={label} icon={Icon} desc={desc} active={pathname.startsWith(href)} />
            ))}
          </div>

          {/* Separator */}
          <div>
            <div className="flex items-center gap-2 px-1 mb-1">
              <div className="flex-1 h-px bg-[#2E2E2F]" />
              <span className="text-[9px] font-semibold text-[#3A3A3B] uppercase tracking-widest">Admin</span>
              <div className="flex-1 h-px bg-[#2E2E2F]" />
            </div>
            <div className="space-y-1">
              {NAV_ADMIN.map(({ href, label, icon: Icon, desc }) => (
                <NavLink key={href} href={href} label={label} icon={Icon} desc={desc} active={pathname.startsWith(href)} muted />
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom: spot price + logout */}
        <div className="px-3 py-4 border-t border-[#2E2E2F] space-y-2">
          <SpotPriceBadge />
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#555] hover:text-[#E9E6D9] hover:bg-[#2E2E2F] transition-colors text-sm">
            <LogOut size={14} />
            Odjavi se
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

    </div>
  );
}

function NavLink({ href, label, icon: Icon, desc, active, muted = false }: {
  href: string; label: string; icon: React.ElementType;
  desc: string; active: boolean; muted?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
        active
          ? "bg-[#BF8E41]/10 border border-[#BF8E41]/30 text-[#BF8E41]"
          : muted
          ? "text-[#444] hover:bg-[#2E2E2F] hover:text-[#8A8A8A]"
          : "text-[#8A8A8A] hover:bg-[#2E2E2F] hover:text-[#E9E6D9]",
      ].join(" ")}
    >
      <Icon size={16} className="shrink-0" />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${active ? "text-[#BF8E41]" : ""}`}>{label}</p>
        <p className="text-[10px] text-[#555] truncate">{desc}</p>
      </div>
      {active && <ChevronRight size={12} className="text-[#BF8E41]/60" />}
    </Link>
  );
}

function SpotPriceBadge() {
  return (
    <div className="px-3 py-2 rounded-lg bg-[#111112] border border-[#2E2E2F]">
      <p className="text-[10px] text-[#555] uppercase tracking-wider">Spot cena</p>
      <p className="text-sm font-semibold text-[#BF8E41] tabular-nums mt-0.5">10.168 RSD/g</p>
      <p className="text-[10px] text-[#555]">$2.905,50 / oz</p>
    </div>
  );
}
