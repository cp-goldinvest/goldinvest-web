"use client";

import { useState } from "react";
import { Phone, Mail, Clock, CheckCircle, XCircle, PhoneCall } from "lucide-react";

type Inquiry = {
  id: string;
  productName: string;
  weightG: number;
  priceAtTime: number;
  quantity: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  note: string | null;
  status: "new" | "contacted" | "sold" | "cancelled";
  createdAt: string;
};

const MOCK_INQUIRIES: Inquiry[] = [
  { id: "1", productName: "Argor-Heraeus zlatna poluga", weightG: 100, priceAtTime: 1047750, quantity: 2, clientName: "Marko Petrović",  clientPhone: "064 123 4567", clientEmail: "marko@gmail.com",  note: "Želi hitno, pozovite danas", status: "new",       createdAt: "2026-03-05T18:30:00Z" },
  { id: "2", productName: "C. Hafner zlatna poluga",     weightG: 50,  priceAtTime: 523875,  quantity: 1, clientName: "Ana Jovanović",    clientPhone: "063 987 6543", clientEmail: null,               note: null,                        status: "contacted", createdAt: "2026-03-05T16:15:00Z" },
  { id: "3", productName: "Franc Jozef dukat mali",      weightG: 3.49,priceAtTime: 37212,   quantity: 5, clientName: "Nikola Nikolić",   clientPhone: "061 555 1234", clientEmail: "nikola@firma.rs",  note: "Poklon za krštenje",        status: "sold",      createdAt: "2026-03-05T12:00:00Z" },
  { id: "4", productName: "Argor-Heraeus zlatna poluga", weightG: 250, priceAtTime: 2582625, quantity: 1, clientName: "Jovana Stojanović",clientPhone: "069 444 8888", clientEmail: null,               note: null,                        status: "cancelled", createdAt: "2026-03-04T09:00:00Z" },
];

const STATUS_CONFIG = {
  new:       { label: "Novi",       color: "text-blue-400 bg-blue-500/10 border-blue-500/20",     icon: Clock },
  contacted: { label: "Kontaktiran",color: "text-amber-400 bg-amber-500/10 border-amber-500/20",  icon: PhoneCall },
  sold:      { label: "Prodat",     color: "text-green-400 bg-green-500/10 border-green-500/20",  icon: CheckCircle },
  cancelled: { label: "Otkazan",    color: "text-red-400 bg-red-500/10 border-red-500/20",        icon: XCircle },
};

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000 / 60);
  if (diff < 60) return `pre ${diff} min`;
  if (diff < 1440) return `pre ${Math.floor(diff / 60)}h`;
  return `pre ${Math.floor(diff / 1440)} dana`;
}

export default function AdminUpitiPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
  const [filter, setFilter] = useState<"sve" | Inquiry["status"]>("sve");

  const filtered = filter === "sve" ? inquiries : inquiries.filter((i) => i.status === filter);
  const newCount = inquiries.filter((i) => i.status === "new").length;

  function handleStatusChange(id: string, status: Inquiry["status"]) {
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-[#E9E6D9]">Upiti klijenata</h1>
          <p className="text-sm text-[#555] mt-1">Pregled i upravljanje upitima sa sajta.</p>
        </div>
        {newCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold text-blue-400">{newCount} novih upita</span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["sve", "new", "contacted", "sold", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={[
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              filter === s
                ? "border-[#BF8E41] bg-[#BF8E41]/10 text-[#BF8E41]"
                : "border-[#2E2E2F] text-[#555] hover:text-[#E9E6D9]",
            ].join(" ")}
          >
            {s === "sve" ? "Svi" : STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      {/* Inquiry cards */}
      <div className="space-y-3">
        {filtered.map((inq) => {
          const StatusIcon = STATUS_CONFIG[inq.status].icon;
          return (
            <div key={inq.id} className="bg-[#1B1B1C] border border-[#2E2E2F] rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">

                {/* Left: client + product */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-[#E9E6D9]">{inq.clientName}</p>
                    <span className="text-[#555] text-xs">·</span>
                    <span className="text-xs text-[#555]">{timeAgo(inq.createdAt)}</span>
                  </div>

                  <p className="text-sm text-[#8A8A8A] mb-3">
                    {inq.productName}{" "}
                    <span className="text-[#555]">
                      {inq.weightG >= 1000 ? `${inq.weightG / 1000}kg` : `${inq.weightG}g`}
                    </span>
                    {" · "}
                    <span className="font-semibold text-[#BF8E41]">
                      {new Intl.NumberFormat("sr-RS").format(inq.priceAtTime)} RSD
                    </span>
                    {inq.quantity > 1 && (
                      <span className="text-[#555]"> × {inq.quantity} kom</span>
                    )}
                  </p>

                  {/* Contact */}
                  <div className="flex flex-wrap gap-3">
                    <a href={`tel:${inq.clientPhone}`} className="flex items-center gap-1.5 text-xs text-[#8A8A8A] hover:text-[#BF8E41] transition-colors">
                      <Phone size={11} />
                      {inq.clientPhone}
                    </a>
                    {inq.clientEmail && (
                      <a href={`mailto:${inq.clientEmail}`} className="flex items-center gap-1.5 text-xs text-[#8A8A8A] hover:text-[#BF8E41] transition-colors">
                        <Mail size={11} />
                        {inq.clientEmail}
                      </a>
                    )}
                  </div>

                  {inq.note && (
                    <p className="mt-2 text-xs text-[#BF8E41]/70 bg-[#BF8E41]/5 border border-[#BF8E41]/15 rounded-lg px-3 py-1.5">
                      📝 {inq.note}
                    </p>
                  )}
                </div>

                {/* Right: status selector */}
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[inq.status].color}`}>
                    <StatusIcon size={10} />
                    {STATUS_CONFIG[inq.status].label}
                  </span>
                  <select
                    value={inq.status}
                    onChange={(e) => handleStatusChange(inq.id, e.target.value as Inquiry["status"])}
                    className="bg-[#111112] border border-[#2E2E2F] rounded-lg px-2 py-1 text-xs text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60 transition-colors"
                  >
                    <option value="new">Novi</option>
                    <option value="contacted">Kontaktiran</option>
                    <option value="sold">Prodat</option>
                    <option value="cancelled">Otkazan</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-[#555] text-sm">
            Nema upita u ovoj kategoriji.
          </div>
        )}
      </div>
    </div>
  );
}
