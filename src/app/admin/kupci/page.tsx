"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, UserPlus, ChevronDown, ChevronUp, Phone, Mail, MapPin, X, Pencil, Users } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Customer = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  id_number: string | null;
  note: string | null;
  created_at: string;
};

type SaleItem = {
  id: string;
  product_name_snapshot: string;
  variant_name_snapshot: string | null;
  weight_g_snapshot: number;
  unit_price_rsd: number;
};

type Sale = {
  id: string;
  sale_number: number;
  sold_at: string;
  register_type: "bela" | "crna";
  payment_method: string;
  total_rsd: number;
  sale_items: SaleItem[];
};

type Purchase = {
  id: string;
  purchase_price_rsd: number;
  purchased_at: string;
  register_type: "bela" | "crna";
  product_variants: {
    name: string | null;
    weight_g: number;
    products: { name: string; brand: string };
  };
};

type CustomerDetail = Customer & { sales: Sale[]; purchases_as_supplier: Purchase[] };

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRsd(n: number) {
  return new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: "RSD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

function formatDate(d: string) {
  return d.slice(0, 10).split("-").reverse().join(".");
}

// ── New / Edit Customer Modal ────────────────────────────────────────────────

function CustomerFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: Customer | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [fullName, setFullName] = useState(initial?.full_name ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [idNumber, setIdNumber] = useState(initial?.id_number ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!fullName.trim()) {
      setError("Ime je obavezno");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = initial ? `/api/admin/customers/${initial.id}` : "/api/admin/customers";
      const method = initial ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          email: email.trim() || null,
          address: address.trim() || null,
          id_number: idNumber.trim() || null,
          note: note.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Greška pri čuvanju");
        setSaving(false);
        return;
      }
      onSaved();
    } catch {
      setError("Greška pri čuvanju");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1B1B1C] border border-[#2E2E2F] rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#E9E6D9] font-semibold">{initial ? "Izmeni kupca" : "Novi kupac"}</h3>
          <button onClick={onClose} className="text-[#555] hover:text-[#E9E6D9] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-[#555] block mb-1.5">Ime i prezime *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#555] block mb-1.5">Telefon</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            </div>
            <div>
              <label className="text-xs text-[#555] block mb-1.5">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-[#555] block mb-1.5">Adresa</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
            />
          </div>
          <div>
            <label className="text-xs text-[#555] block mb-1.5">Lična karta / JMBG (opciono)</label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
            />
          </div>
          <div>
            <label className="text-xs text-[#555] block mb-1.5">Napomena</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60 resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[#2E2E2F] text-sm text-[#8A8A8A] hover:text-[#E9E6D9] transition-colors"
            >
              Otkaži
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-[#BF8E41] text-[#1B1B1C] text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Čuvam..." : "Sačuvaj"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Customer Row (expandable) ────────────────────────────────────────────────

function CustomerRow({ customer, onEdit }: { customer: Customer; onEdit: (c: Customer) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!expanded && !detail) {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/customers/${customer.id}`);
        if (res.ok) setDetail(await res.json());
      } finally {
        setLoading(false);
      }
    }
    setExpanded((e) => !e);
  }

  const totalSpent = detail?.sales.reduce((s, sale) => s + Number(sale.total_rsd), 0) ?? 0;

  return (
    <div className="border border-[#2E2E2F] rounded-xl overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggle();
        }}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#1B1B1C] hover:bg-[#1B1B1C]/70 transition-colors text-left cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#E9E6D9] font-medium">{customer.full_name}</p>
          <div className="flex items-center gap-3 mt-0.5">
            {customer.phone && (
              <span className="flex items-center gap-1 text-xs text-[#555]">
                <Phone size={11} /> {customer.phone}
              </span>
            )}
            {customer.email && (
              <span className="flex items-center gap-1 text-xs text-[#555]">
                <Mail size={11} /> {customer.email}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(customer);
            }}
            className="p-1.5 rounded-lg text-[#555] hover:text-[#BF8E41] hover:bg-[#BF8E41]/10 transition-colors"
            title="Izmeni"
          >
            <Pencil size={13} />
          </button>
          {expanded ? <ChevronUp size={14} className="text-[#555]" /> : <ChevronDown size={14} className="text-[#555]" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#2E2E2F] bg-[#111112] px-4 py-4">
          {loading ? (
            <p className="text-xs text-[#555]">Učitavam...</p>
          ) : detail ? (
            <div className="space-y-4">
              {(customer.address || customer.id_number || customer.note) && (
                <div className="space-y-1">
                  {customer.address && (
                    <p className="flex items-center gap-1.5 text-xs text-[#8A8A8A]">
                      <MapPin size={11} className="text-[#444]" /> {customer.address}
                    </p>
                  )}
                  {customer.id_number && <p className="text-xs text-[#8A8A8A]">Lična: {customer.id_number}</p>}
                  {customer.note && <p className="text-xs text-[#555] italic">{customer.note}</p>}
                </div>
              )}

              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] text-[#444] uppercase tracking-wider">Ukupno kupio</p>
                  <p className="text-sm font-semibold text-[#BF8E41] tabular-nums">{formatRsd(totalSpent)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#444] uppercase tracking-wider">Broj kupovina</p>
                  <p className="text-sm font-semibold text-[#E9E6D9] tabular-nums">{detail.sales.length}</p>
                </div>
              </div>

              {detail.sales.length > 0 && (
                <div>
                  <p className="text-[10px] text-[#444] uppercase tracking-wider mb-2">Istorija kupovina</p>
                  <div className="space-y-1.5">
                    {detail.sales.map((sale) => (
                      <div key={sale.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#1B1B1C] border border-[#2E2E2F]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#8A8A8A]">{formatDate(sale.sold_at)}</span>
                          <span className="text-xs text-[#555]">
                            {sale.sale_items.map((i) => i.product_name_snapshot).join(", ")}
                          </span>
                          <span
                            className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
                              sale.register_type === "crna"
                                ? "text-[#8A8A8A] bg-[#8A8A8A]/10 border-[#8A8A8A]/30"
                                : "text-[#E9E6D9] bg-[#E9E6D9]/10 border-[#E9E6D9]/25"
                            }`}
                          >
                            {sale.register_type === "crna" ? "CRNA" : "BELA"}
                          </span>
                        </div>
                        <span className="text-xs text-[#E9E6D9] font-medium tabular-nums">{formatRsd(sale.total_rsd)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detail.purchases_as_supplier.length > 0 && (
                <div>
                  <p className="text-[10px] text-[#444] uppercase tracking-wider mb-2">Otkup od ovog lica</p>
                  <div className="space-y-1.5">
                    {detail.purchases_as_supplier.map((p) => (
                      <div key={p.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#1B1B1C] border border-[#2E2E2F]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#8A8A8A]">{formatDate(p.purchased_at)}</span>
                          <span className="text-xs text-[#555]">
                            {p.product_variants.products.brand} - {p.product_variants.name ?? p.product_variants.products.name}
                          </span>
                        </div>
                        <span className="text-xs text-[#E9E6D9] font-medium tabular-nums">{formatRsd(p.purchase_price_rsd)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detail.sales.length === 0 && detail.purchases_as_supplier.length === 0 && (
                <p className="text-xs text-[#444]">Nema još evidentiranih transakcija.</p>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AdminKupciPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [formTarget, setFormTarget] = useState<Customer | null | "new">(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadCustomers = useCallback(async (q?: string) => {
    const res = await fetch(`/api/admin/customers${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    if (res.ok) setCustomers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadCustomers(query), 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, loadCustomers]);

  async function handleSaved() {
    setFormTarget(null);
    await loadCustomers(query);
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#E9E6D9]">Kupci</h1>
          <p className="text-sm text-[#555] mt-1">CRM - istorija kupovina i otkupa po osobi.</p>
        </div>
        <button
          onClick={() => setFormTarget("new")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#BF8E41]/10 border border-[#BF8E41]/20 text-[#BF8E41] text-xs font-medium hover:bg-[#BF8E41]/20 transition-colors"
        >
          <UserPlus size={14} />
          Novi kupac
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
        <input
          type="text"
          placeholder="Pretraži po imenu ili telefonu..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#111112] border border-[#2E2E2F] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-[#555] text-sm">Učitavam kupce...</div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#2E2E2F] rounded-xl">
          <Users size={32} className="text-[#333] mx-auto mb-3" />
          <p className="text-[#555] text-sm">{query ? "Nema rezultata pretrage." : "Još nema kupaca u bazi."}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {customers.map((c) => (
            <CustomerRow key={c.id} customer={c} onEdit={setFormTarget} />
          ))}
        </div>
      )}

      {formTarget && (
        <CustomerFormModal
          initial={formTarget === "new" ? null : formTarget}
          onClose={() => setFormTarget(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
