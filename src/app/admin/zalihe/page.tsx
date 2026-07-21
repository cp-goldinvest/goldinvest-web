"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronDown, ChevronUp, Plus, X, TrendingUp, TrendingDown, Package, Info, ShoppingBag, Search, UserPlus, Download, Pencil } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type RegisterType = "bela" | "crna";

type LagerItem = {
  id: string;
  purchase_price_rsd: number;
  purchased_at: string;
  note: string | null;
  register_type: RegisterType;
  supplier_name: string | null;
  supplier_customer_id: string | null;
  sold_at: string | null;
  reserved_order_id: string | null;
  serial_number: string | null;
  invoice_number: string | null;
  supplier_tax_id: string | null;
  supplier_address: string | null;
  created_at: string;
  product_variants: {
    id: string;
    slug: string;
    name: string | null;
    weight_g: number;
    purity: number;
    sku: string | null;
    products: { name: string; brand: string; category: string };
  };
};

type CustomerLite = { id: string; full_name: string; phone: string | null };

type AgentLite = { id: string; full_name: string };

type CustomerSelection =
  | { mode: "none" }
  | { mode: "existing"; customer: CustomerLite }
  | { mode: "new"; full_name: string; phone: string; email: string };

type GroupedVariant = {
  variantId: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  weightG: number;
  items: LagerItem[];
};

type VariantRow = {
  id: string;
  slug: string;
  name: string | null;
  weight_g: number;
  purity: number;
  sku: string | null;
  products: { name: string; brand: string; category: string };
};

type LivePrice = { rsd_per_gram: number; xau_eur: number | null; eur_rsd: number | null };

// Same shape as admin/cene pricing tiers
type Tier = {
  id: string;
  name: string;
  category: string | null;
  weight_g: number | null;
  margin_stock_pct: number;
  margin_advance_pct: number;
  margin_purchase_pct: number;
};

// ── Constants ──────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  poluga: "Zlatne poluge",
  plocica: "Zlatne pločice",
  dukat: "Zlatni dukati",
  multipack: "Multipack",
};

const CATEGORY_ORDER = ["poluga", "plocica", "dukat", "multipack"];

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
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

function formatWeight(g: number) {
  return g >= 1000 ? `${g / 1000} kg` : `${g} g`;
}

function findStockMarginPct(weightG: number, category: string, tiers: Tier[], brand?: string | null): number {
  const wb = (t: Tier) => t.weight_g !== null && Math.abs(t.weight_g - weightG) < 0.001;
  const ca = (t: Tier, c: string | null) => t.category === c;
  const br = (t: Tier, b: string | null) => (t as any).brand === b;

  let tier: Tier | undefined;
  if (brand) {
    tier =
      tiers.find((t) => br(t, brand) && wb(t) && ca(t, category)) ??
      tiers.find((t) => br(t, brand) && wb(t) && ca(t, null)) ??
      tiers.find((t) => br(t, brand) && !wb(t) && t.weight_g === null && ca(t, category)) ??
      tiers.find((t) => br(t, brand) && !wb(t) && t.weight_g === null && ca(t, null));
  }
  tier ??=
    tiers.find((t) => wb(t) && ca(t, category)) ??
    tiers.find((t) => wb(t) && ca(t, null)) ??
    tiers.find((t) => t.weight_g === null && ca(t, category)) ??
    tiers.find((t) => t.weight_g === null && ca(t, null));
  return tier?.margin_stock_pct ?? 3.0;
}

// ── Customer Picker (pretraga + inline kreiranje) ───────────────────────────────

function CustomerPicker({
  selection,
  onChange,
  allowCreate = true,
  placeholder = "Pretraži po imenu ili telefonu...",
}: {
  selection: CustomerSelection;
  onChange: (s: CustomerSelection) => void;
  allowCreate?: boolean;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CustomerLite[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/customers?q=${encodeURIComponent(query)}`);
        if (res.ok) setResults(await res.json());
      } catch {
        /* ignore */
      }
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const visibleResults = query.trim() ? results : [];

  if (selection.mode === "existing") {
    return (
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#111112] border border-[#2E2E2F]">
        <div>
          <p className="text-sm text-[#E9E6D9]">{selection.customer.full_name}</p>
          {selection.customer.phone && <p className="text-xs text-[#555]">{selection.customer.phone}</p>}
        </div>
        <button
          onClick={() => onChange({ mode: "none" })}
          className="text-xs text-[#555] hover:text-[#E9E6D9] transition-colors"
        >
          Promeni
        </button>
      </div>
    );
  }

  if (selection.mode === "new") {
    return (
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#BF8E41]/5 border border-[#BF8E41]/20">
        <div>
          <p className="text-sm text-[#E9E6D9]">{selection.full_name} <span className="text-[10px] text-[#BF8E41]">(novi)</span></p>
          {selection.phone && <p className="text-xs text-[#555]">{selection.phone}</p>}
        </div>
        <button
          onClick={() => onChange({ mode: "none" })}
          className="text-xs text-[#555] hover:text-[#E9E6D9] transition-colors"
        >
          Promeni
        </button>
      </div>
    );
  }

  if (showNewForm) {
    return (
      <div className="space-y-2 p-3 rounded-lg bg-[#111112] border border-[#2E2E2F]">
        <input
          type="text"
          placeholder="Ime i prezime"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full bg-[#1B1B1C] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Telefon"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            className="w-full bg-[#1B1B1C] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
          />
          <input
            type="text"
            placeholder="Email (opciono)"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full bg-[#1B1B1C] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewForm(false)}
            className="flex-1 py-1.5 rounded-lg border border-[#2E2E2F] text-xs text-[#8A8A8A] hover:text-[#E9E6D9] transition-colors"
          >
            Otkaži
          </button>
          <button
            onClick={() => {
              if (!newName.trim()) return;
              onChange({ mode: "new", full_name: newName.trim(), phone: newPhone.trim(), email: newEmail.trim() });
              setShowNewForm(false);
            }}
            className="flex-1 py-1.5 rounded-lg bg-[#BF8E41] text-[#1B1B1C] text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Potvrdi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg pl-8 pr-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
        />
      </div>
      {visibleResults.length > 0 && (
        <div className="border border-[#2E2E2F] rounded-lg overflow-hidden max-h-36 overflow-y-auto">
          {visibleResults.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                onChange({ mode: "existing", customer: c });
                setQuery("");
                setResults([]);
              }}
              className="w-full text-left px-3 py-2 text-xs text-[#8A8A8A] hover:bg-[#1B1B1C] hover:text-[#E9E6D9] transition-colors border-b border-[#2E2E2F] last:border-b-0"
            >
              {c.full_name} {c.phone && <span className="text-[#444]">· {c.phone}</span>}
            </button>
          ))}
        </div>
      )}
      {allowCreate && (
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-1.5 text-xs text-[#BF8E41]/80 hover:text-[#BF8E41] transition-colors"
        >
          <UserPlus size={12} />
          Novi kupac
        </button>
      )}
    </div>
  );
}

// ── Add Item Modal ─────────────────────────────────────────────────────────────

function AddItemModal({
  variant,
  onClose,
  onSaved,
}: {
  variant: GroupedVariant;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [qty, setQty] = useState("1");
  const [registerType, setRegisterType] = useState<RegisterType>("bela");
  const [supplierName, setSupplierName] = useState("");
  const [linkCustomer, setLinkCustomer] = useState(false);
  const [supplierSelection, setSupplierSelection] = useState<CustomerSelection>({ mode: "none" });
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [supplierTaxId, setSupplierTaxId] = useState("");
  const [supplierAddress, setSupplierAddress] = useState("");
  const [serialNumbers, setSerialNumbers] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const qtyNum = parseInt(qty) || 1;

  async function handleSave() {
    const priceNum = parseFloat(price.replace(/\./g, "").replace(",", "."));
    if (!priceNum || priceNum <= 0) {
      setError("Unesi nabavnu cenu");
      return;
    }
    setSaving(true);
    try {
      const supplierCustomerId = supplierSelection.mode === "existing" ? supplierSelection.customer.id : null;
      const serials = serialNumbers
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      await Promise.all(
        Array.from({ length: qtyNum }).map((_, i) =>
          fetch("/api/admin/lager", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              variant_id: variant.variantId,
              purchase_price_rsd: priceNum,
              purchased_at: date,
              note: note || null,
              register_type: registerType,
              supplier_name: supplierName || null,
              supplier_customer_id: supplierCustomerId,
              serial_number: serials[i] ?? null,
              invoice_number: invoiceNumber || null,
              supplier_tax_id: supplierTaxId || null,
              supplier_address: supplierAddress || null,
            }),
          })
        )
      );
      onSaved();
    } catch {
      setError("Greška pri čuvanju");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1B1B1C] border border-[#2E2E2F] rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-[#555] mb-0.5">{variant.brand}</p>
            <h3 className="text-[#E9E6D9] font-semibold">
              Dodaj na lager - {formatWeight(variant.weightG)}
            </h3>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-[#E9E6D9] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#555] block mb-1.5">Količina (kom)</label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            </div>
            <div>
              <label className="text-xs text-[#555] block mb-1.5">Datum nabavke</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Nabavna cena po komadu (RSD)</label>
            <input
              type="number"
              placeholder="npr. 300000"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setError("");
              }}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
            />
            {parseInt(qty) > 1 && price && (
              <p className="text-xs text-[#555] mt-1">
                Ukupno: {formatRsd(parseFloat(price) * parseInt(qty))} za {qty} kom
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Kasa</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRegisterType("bela")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  registerType === "bela"
                    ? "bg-[#E9E6D9]/10 border-[#E9E6D9]/40 text-[#E9E6D9]"
                    : "border-[#2E2E2F] text-[#555] hover:text-[#8A8A8A]"
                }`}
              >
                Bela kasa
              </button>
              <button
                type="button"
                onClick={() => setRegisterType("crna")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  registerType === "crna"
                    ? "bg-[#8A8A8A]/10 border-[#8A8A8A]/40 text-[#8A8A8A]"
                    : "border-[#2E2E2F] text-[#555] hover:text-[#8A8A8A]"
                }`}
              >
                Crna kasa
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Dobavljač / od koga (opcionalno)</label>
            <input
              type="text"
              placeholder="npr. Argor-Heraeus DOO ili ime fizičkog lica"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
            />
            {!linkCustomer ? (
              <button
                type="button"
                onClick={() => setLinkCustomer(true)}
                className="mt-1.5 text-xs text-[#BF8E41]/70 hover:text-[#BF8E41] transition-colors"
              >
                + Poveži sa postojećim kupcem u bazi
              </button>
            ) : (
              <div className="mt-2">
                <CustomerPicker selection={supplierSelection} onChange={setSupplierSelection} allowCreate={false} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#555] block mb-1.5">Broj računa (opcionalno)</label>
              <input
                type="text"
                placeholder="npr. if-15/26"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            </div>
            <div>
              <label className="text-xs text-[#555] block mb-1.5">PIB/JMBG dobavljača (opcionalno)</label>
              <input
                type="text"
                value={supplierTaxId}
                onChange={(e) => setSupplierTaxId(e.target.value)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Adresa dobavljača (opcionalno)</label>
            <input
              type="text"
              value={supplierAddress}
              onChange={(e) => setSupplierAddress(e.target.value)}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
            />
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">
              {qtyNum > 1 ? "Serijski brojevi (opcionalno, jedan po redu)" : "Serijski broj (opcionalno)"}
            </label>
            {qtyNum > 1 ? (
              <textarea
                placeholder={`npr.\n668339\n668340\n668341`}
                value={serialNumbers}
                onChange={(e) => setSerialNumbers(e.target.value)}
                rows={Math.min(qtyNum, 5)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60 resize-none font-mono"
              />
            ) : (
              <input
                type="text"
                value={serialNumbers}
                onChange={(e) => setSerialNumbers(e.target.value)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            )}
            {qtyNum > 1 && (
              <p className="text-[10px] text-[#444] mt-1">
                {serialNumbers.split("\n").map((s) => s.trim()).filter(Boolean).length} / {qtyNum} uneto
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Napomena (opcionalno)</label>
            <input
              type="text"
              placeholder="npr. Restock mart 2026"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
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
              {saving ? "Čuvam..." : `Dodaj${parseInt(qty) > 1 ? ` (${qty} kom)` : ""}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sell Modal ─────────────────────────────────────────────────────────────────

const PAYMENT_METHODS: { value: string; label: string }[] = [
  { value: "gotovina", label: "Gotovina" },
  { value: "racun", label: "Račun / prenos" },
  { value: "kartica", label: "Kartica" },
  { value: "ostalo", label: "Ostalo" },
];

function SellModal({
  item,
  productLabel,
  suggestedPrice,
  onClose,
  onSaved,
}: {
  item: LagerItem;
  productLabel: string;
  suggestedPrice: number | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [customerSelection, setCustomerSelection] = useState<CustomerSelection>({ mode: "none" });
  const [price, setPrice] = useState(suggestedPrice ? String(Math.round(suggestedPrice)) : "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [registerType, setRegisterType] = useState<RegisterType>("bela");
  const [paymentMethod, setPaymentMethod] = useState("gotovina");
  const [note, setNote] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [agents, setAgents] = useState<AgentLite[]>([]);
  const [agentId, setAgentId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/agents")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: AgentLite[]) => setAgents(data))
      .catch(() => {});
  }, []);

  async function handleSave() {
    const priceNum = parseFloat(price.replace(/\./g, "").replace(",", "."));
    if (!priceNum || priceNum <= 0) {
      setError("Unesi prodajnu cenu");
      return;
    }
    if (!agentId) {
      setError("Izaberi agenta koji je zatvorio prodaju");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const body: Record<string, unknown> = {
        lager_item_id: item.id,
        unit_price_rsd: priceNum,
        register_type: registerType,
        payment_method: paymentMethod,
        sold_at: date,
        note: note || null,
        invoice_number: invoiceNumber || null,
        agent_id: agentId,
      };
      if (customerSelection.mode === "existing") body.customer_id = customerSelection.customer.id;
      if (customerSelection.mode === "new") {
        body.new_customer = {
          full_name: customerSelection.full_name,
          phone: customerSelection.phone || null,
          email: customerSelection.email || null,
        };
      }

      const res = await fetch("/api/admin/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
          <div>
            <p className="text-xs text-[#555] mb-0.5">{productLabel}</p>
            <h3 className="text-[#E9E6D9] font-semibold">Označi kao prodato</h3>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-[#E9E6D9] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#555] block mb-1.5">Kupac</label>
            <CustomerPicker selection={customerSelection} onChange={setCustomerSelection} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#555] block mb-1.5">Prodajna cena (RSD)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setError("");
                }}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            </div>
            <div>
              <label className="text-xs text-[#555] block mb-1.5">Datum prodaje</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Kasa</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRegisterType("bela")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  registerType === "bela"
                    ? "bg-[#E9E6D9]/10 border-[#E9E6D9]/40 text-[#E9E6D9]"
                    : "border-[#2E2E2F] text-[#555] hover:text-[#8A8A8A]"
                }`}
              >
                Bela kasa
              </button>
              <button
                type="button"
                onClick={() => setRegisterType("crna")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  registerType === "crna"
                    ? "bg-[#8A8A8A]/10 border-[#8A8A8A]/40 text-[#8A8A8A]"
                    : "border-[#2E2E2F] text-[#555] hover:text-[#8A8A8A]"
                }`}
              >
                Crna kasa
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Agent (ko je zatvorio prodaju)</label>
            <select
              value={agentId}
              onChange={(e) => {
                setAgentId(e.target.value);
                setError("");
              }}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
            >
              <option value="">Izaberi agenta...</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.full_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Način plaćanja</label>
            <div className="grid grid-cols-4 gap-1.5">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setPaymentMethod(m.value)}
                  className={`py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${
                    paymentMethod === m.value
                      ? "bg-[#BF8E41]/15 border-[#BF8E41]/40 text-[#BF8E41]"
                      : "border-[#2E2E2F] text-[#555] hover:text-[#8A8A8A]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Broj računa (opcionalno)</label>
            <input
              type="text"
              placeholder="npr. 01/26"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
            />
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Napomena (opcionalno)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
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
              {saving ? "Čuvam..." : "Potvrdi prodaju"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Change Price Modal ──────────────────────────────────────────────────────────

function ChangePriceModal({
  item,
  productLabel,
  onClose,
  onSaved,
}: {
  item: LagerItem;
  productLabel: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [price, setPrice] = useState(String(Math.round(item.purchase_price_rsd)));
  const [registerType, setRegisterType] = useState<RegisterType>(item.register_type);
  const [purchasedAt, setPurchasedAt] = useState(item.purchased_at.slice(0, 10));
  const [serialNumber, setSerialNumber] = useState(item.serial_number ?? "");
  const [invoiceNumber, setInvoiceNumber] = useState(item.invoice_number ?? "");
  const [supplierName, setSupplierName] = useState(item.supplier_name ?? "");
  const [note, setNote] = useState(item.note ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    const priceNum = parseFloat(price.replace(/\./g, "").replace(",", "."));
    if (!priceNum || priceNum <= 0) {
      setError("Unesi nabavnu cenu");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/lager/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchase_price_rsd: priceNum,
          register_type: registerType,
          purchased_at: purchasedAt,
          serial_number: serialNumber || null,
          invoice_number: invoiceNumber || null,
          supplier_name: supplierName || null,
          note: note || null,
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
      <div className="bg-[#1B1B1C] border border-[#2E2E2F] rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-[#555] mb-0.5">{productLabel}</p>
            <h3 className="text-[#E9E6D9] font-semibold">Uredi stavku</h3>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-[#E9E6D9] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#555] block mb-1.5">Nova nabavna cena (RSD)</label>
            <input
              type="number"
              autoFocus
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setError("");
              }}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
            />
            <p className="text-[10px] text-[#444] mt-1.5">
              Trenutno: {formatRsd(item.purchase_price_rsd)}
            </p>
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Kasa</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRegisterType("bela")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  registerType === "bela"
                    ? "bg-[#E9E6D9]/10 border-[#E9E6D9]/40 text-[#E9E6D9]"
                    : "border-[#2E2E2F] text-[#555] hover:text-[#8A8A8A]"
                }`}
              >
                Bela kasa
              </button>
              <button
                type="button"
                onClick={() => setRegisterType("crna")}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  registerType === "crna"
                    ? "bg-[#8A8A8A]/10 border-[#8A8A8A]/40 text-[#8A8A8A]"
                    : "border-[#2E2E2F] text-[#555] hover:text-[#8A8A8A]"
                }`}
              >
                Crna kasa
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#555] block mb-1.5">Datum nabavke</label>
              <input
                type="date"
                value={purchasedAt}
                onChange={(e) => setPurchasedAt(e.target.value)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            </div>
            <div>
              <label className="text-xs text-[#555] block mb-1.5">Serijski broj</label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#555] block mb-1.5">Broj računa (nabavka)</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            </div>
            <div>
              <label className="text-xs text-[#555] block mb-1.5">Dobavljač</label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Napomena</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
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
              {saving ? "Čuvam..." : "Sačuvaj izmene"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Variant Card ───────────────────────────────────────────────────────────────

function VariantCard({
  group,
  livePrice,
  tiers,
  onAdd,
  onSell,
  onChangePrice,
}: {
  group: GroupedVariant;
  livePrice: LivePrice | null;
  tiers: Tier[];
  onAdd: (v: GroupedVariant) => void;
  onSell: (item: LagerItem, group: GroupedVariant) => void;
  onChangePrice: (item: LagerItem, group: GroupedVariant) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const count = group.items.length;
  const totalPurchase = group.items.reduce((s, i) => s + i.purchase_price_rsd, 0);
  const avgPurchase = count > 0 ? totalPurchase / count : 0;
  const spotPerGram = livePrice?.rsd_per_gram ?? 0;

  // Stock margin from pricing tiers - same logic used to calculate site price
  const stockMarginPct = findStockMarginPct(group.weightG, group.category, tiers, group.brand);

  // Metal value: spot price × weight (no selling markup - intrinsic gold value)
  const metalPricePerUnit = spotPerGram * group.weightG;
  // Selling value: what we'd actually sell this for on the site
  const sellingPricePerUnit = spotPerGram * group.weightG * (1 + stockMarginPct / 100);

  const totalSellingValue = sellingPricePerUnit * count;

  // P&L relative to what was paid for the stock
  const totalSellingPnL = totalSellingValue - totalPurchase;
  const sellingPnlPct   = totalPurchase > 0 ? (totalSellingPnL / totalPurchase) * 100 : 0;

  if (count === 0) {
    return (
      <div className="flex items-center justify-between px-4 py-3 border border-[#2E2E2F] rounded-xl bg-[#111112]">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#444]">{group.name}</span>
          <span className="text-[10px] text-[#333] bg-[#1B1B1C] border border-[#2E2E2F] px-2 py-0.5 rounded-full">
            {formatWeight(group.weightG)}
          </span>
          <span className="text-[10px] text-[#333] px-2 py-0.5 rounded-full border border-[#2E2E2F]">
            0 kom
          </span>
        </div>
        <button
          onClick={() => onAdd(group)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#BF8E41]/5 border border-[#BF8E41]/15 text-[#BF8E41]/60 text-xs font-medium hover:bg-[#BF8E41]/15 hover:text-[#BF8E41] transition-colors"
        >
          <Plus size={12} />
          Dodaj
        </button>
      </div>
    );
  }

  return (
    <div className="border border-[#2E2E2F] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#1B1B1C] px-5 py-4">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[#E9E6D9] font-semibold text-sm">{group.name}</span>
              <span className="text-[10px] text-[#8A8A8A] bg-[#111112] border border-[#2E2E2F] px-2 py-0.5 rounded-full">
                {formatWeight(group.weightG)}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full border text-green-400 bg-green-500/10 border-green-500/20 font-medium">
                {count} {count === 1 ? "kom" : "kom"} na lageru
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p className="text-[10px] text-[#444] mb-0.5">Prosečna nabavna</p>
                <p className="text-xs text-[#8A8A8A] font-medium tabular-nums">{formatRsd(avgPurchase)}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#444] mb-0.5">Ukupno uloženo</p>
                <p className="text-xs text-[#8A8A8A] font-medium tabular-nums">{formatRsd(totalPurchase)}</p>
              </div>
              {livePrice && (
                <>
                  <div>
                    <p className="text-[10px] text-[#444] mb-0.5">
                      Prod. vrednost
                      <span className="ml-1 text-[#333]">+{stockMarginPct}%</span>
                    </p>
                    <p className="text-xs text-[#BF8E41] font-medium tabular-nums">{formatRsd(totalSellingValue)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#444] mb-0.5">Prodajni P&amp;L</p>
                    <div className={`flex items-start gap-1 ${totalSellingPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {totalSellingPnL >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold tabular-nums leading-tight">
                          {totalSellingPnL >= 0 ? "+" : ""}{formatRsd(totalSellingPnL)}
                        </p>
                        <p className="text-[10px] font-normal opacity-60 tabular-nums">
                          ({sellingPnlPct >= 0 ? "+" : ""}{sellingPnlPct.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onAdd(group)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#BF8E41]/10 border border-[#BF8E41]/20 text-[#BF8E41] text-xs font-medium hover:bg-[#BF8E41]/20 transition-colors"
            >
              <Plus size={13} />
              Dodaj
            </button>
            <button
              onClick={() => setExpanded((e) => !e)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#2E2E2F] text-xs text-[#8A8A8A] hover:text-[#E9E6D9] transition-colors"
            >
              Detalji
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded items table */}
      {expanded && (
        <div className="border-t border-[#2E2E2F]">
          {/* Table header */}
          <div className="grid grid-cols-[28px_1fr_56px_1fr_1fr_104px] text-[10px] font-semibold text-[#444] uppercase tracking-wider">
            <div className="bg-[#111112] px-3 py-2 border-b border-[#2E2E2F]">#</div>
            <div className="bg-[#111112] px-4 py-2 border-b border-[#2E2E2F]">Nabavna cena</div>
            <div className="bg-[#111112] px-2 py-2 border-b border-[#2E2E2F]">Kasa</div>
            <div className="bg-[#111112] px-4 py-2 border-b border-[#2E2E2F] flex items-center gap-1.5">
              Profit / Gubitak
              {/* Legend tooltip trigger */}
              <span
                title="Prodajni: prihod od prodaje − nabavna cena&#10;Metal: čista spot vrednost − nabavna cena"
                className="cursor-help"
              >
                <Info size={10} className="text-[#333] hover:text-[#555] transition-colors" />
              </span>
            </div>
            <div className="bg-[#111112] px-4 py-2 border-b border-[#2E2E2F]">Datum / Napomena</div>
            <div className="bg-[#111112] px-4 py-2 border-b border-[#2E2E2F] text-center">Prodato</div>
          </div>

          {group.items.map((item, idx) => {
            // Per-item P&L (requires live price)
            const metalPnL   = livePrice ? metalPricePerUnit   - item.purchase_price_rsd : null;
            const sellingPnL = livePrice ? sellingPricePerUnit - item.purchase_price_rsd : null;

            return (
              <div
                key={item.id}
                className="grid grid-cols-[28px_1fr_56px_1fr_1fr_104px] border-t border-[#2E2E2F]"
              >
                {/* # */}
                <div className="bg-[#1B1B1C] px-3 py-3 flex items-center">
                  <span className="text-xs text-[#444]">{idx + 1}</span>
                </div>

                {/* Purchase price */}
                <div className="bg-[#1B1B1C] px-4 py-3 flex items-center">
                  <span className="text-sm text-[#E9E6D9] font-medium tabular-nums">
                    {formatRsd(item.purchase_price_rsd)}
                  </span>
                </div>

                {/* Kasa */}
                <div className="bg-[#1B1B1C] px-2 py-3 flex items-center">
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
                      item.register_type === "crna"
                        ? "text-[#8A8A8A] bg-[#8A8A8A]/10 border-[#8A8A8A]/30"
                        : "text-[#E9E6D9] bg-[#E9E6D9]/10 border-[#E9E6D9]/25"
                    }`}
                  >
                    {item.register_type === "crna" ? "CRNA" : "BELA"}
                  </span>
                </div>

                {/* Dual P&L */}
                <div className="bg-[#1B1B1C] px-4 py-3">
                  {sellingPnL !== null && metalPnL !== null ? (
                    <div className="space-y-1">
                      {/* Selling P&L - primary */}
                      <div className={`flex items-center gap-1 ${sellingPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                        <span className="text-[10px] text-[#555] w-14 shrink-0">Prodajni:</span>
                        <span className="text-sm font-semibold tabular-nums">
                          {sellingPnL >= 0 ? "+" : ""}{formatRsd(sellingPnL)}
                        </span>
                      </div>
                      {/* Metal P&L - secondary */}
                      <div className={`flex items-center gap-1 ${metalPnL >= 0 ? "text-green-500/50" : "text-red-500/50"}`}>
                        <span className="text-[10px] text-[#333] w-14 shrink-0">Metal:</span>
                        <span className="text-xs tabular-nums">
                          {metalPnL >= 0 ? "+" : ""}{formatRsd(metalPnL)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-[#444]">-</span>
                  )}
                </div>

                {/* Date / Note */}
                <div className="bg-[#1B1B1C] px-4 py-3 flex flex-col justify-center">
                  <span className="text-xs text-[#8A8A8A]">{formatDate(item.purchased_at)}</span>
                  {item.serial_number && (
                    <span className="text-[10px] text-[#666] mt-0.5 font-mono">SN {item.serial_number}</span>
                  )}
                  {item.note && <span className="text-[10px] text-[#555] mt-0.5">{item.note}</span>}
                </div>

                {/* Sold / change price buttons */}
                <div className="bg-[#1B1B1C] px-2 py-3 flex flex-col items-stretch justify-center gap-1">
                  <button
                    onClick={() => onSell(item, group)}
                    className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[#555] hover:text-[#BF8E41] hover:bg-[#BF8E41]/10 transition-colors text-[10px] font-medium"
                    title="Označi kao prodato"
                  >
                    <ShoppingBag size={13} />
                    Prodato
                  </button>
                  <button
                    onClick={() => onChangePrice(item, group)}
                    className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[#555] hover:text-[#8A8A8A] hover:bg-[#8A8A8A]/10 transition-colors text-[10px] font-medium"
                    title="Promeni nabavnu cenu ili kasu"
                  >
                    <Pencil size={12} />
                    Uredi
                  </button>
                </div>
              </div>
            );
          })}

          {/* Legend footer */}
          <div className="bg-[#111112] border-t border-[#2E2E2F] px-4 py-2.5 flex items-center gap-4">
            <span className="text-[10px] text-[#333]">
              <span className="text-[#555]">Prodajni P&amp;L</span> - prihod od prodaje po sajt ceni (spot +{stockMarginPct}%)
            </span>
            <span className="text-[10px] text-[#333]">
              <span className="text-[#555]">Metal P&amp;L</span> - čista spot vrednost zlata
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Category Section ───────────────────────────────────────────────────────────

function CategorySection({
  category,
  groups,
  livePrice,
  tiers,
  onAdd,
  onSell,
  onChangePrice,
}: {
  category: string;
  groups: GroupedVariant[];
  livePrice: LivePrice | null;
  tiers: Tier[];
  onAdd: (v: GroupedVariant) => void;
  onSell: (item: LagerItem, group: GroupedVariant) => void;
  onChangePrice: (item: LagerItem, group: GroupedVariant) => void;
}) {
  const inStockGroups = groups.filter((g) => g.items.length > 0);
  const totalCount = inStockGroups.reduce((s, g) => s + g.items.length, 0);
  const totalInvested = inStockGroups.reduce(
    (s, g) => s + g.items.reduce((ss, i) => ss + i.purchase_price_rsd, 0),
    0
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-xs font-semibold text-[#555] uppercase tracking-widest">
          {CATEGORY_LABELS[category] ?? category}
        </h2>
        <div className="h-px flex-1 bg-[#2E2E2F]" />
        {totalCount > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#444]">
              <span className="text-[#E9E6D9] font-medium">{totalCount}</span> kom
            </span>
            <span className="text-xs text-[#444]">
              uloženo{" "}
              <span className="text-[#BF8E41] font-medium tabular-nums">{formatRsd(totalInvested)}</span>
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {groups.map((group) => (
          <VariantCard
            key={group.variantId}
            group={group}
            livePrice={livePrice}
            tiers={tiers}
            onAdd={onAdd}
            onSell={onSell}
            onChangePrice={onChangePrice}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AdminZalikePage() {
  const [items, setItems] = useState<LagerItem[]>([]);
  const [allVariants, setAllVariants] = useState<VariantRow[]>([]);
  const [livePrice, setLivePrice] = useState<LivePrice | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [addTarget, setAddTarget] = useState<GroupedVariant | null>(null);
  const [sellTarget, setSellTarget] = useState<{ item: LagerItem; group: GroupedVariant } | null>(null);
  const [priceEditTarget, setPriceEditTarget] = useState<{ item: LagerItem; group: GroupedVariant } | null>(null);
  const [filter, setFilter] = useState<"in_stock" | "all">("in_stock");
  const [kasaFilter, setKasaFilter] = useState<"sve" | RegisterType>("sve");

  const loadItems = useCallback(async () => {
    const [lagerRes, varRes] = await Promise.all([
      fetch("/api/admin/lager"),
      fetch("/api/admin/variants"),
    ]);
    if (lagerRes.ok) setItems(await lagerRes.json());
    if (varRes.ok) setAllVariants(await varRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadItems();
    // Fetch pricing tiers (for P&L margin calculation) and live prices in parallel
    Promise.all([
      fetch("/api/admin/tiers").then((r) => r.json()).catch(() => []),
      fetch("/api/prices").then((r) => r.json()).catch(() => null),
    ]).then(([tiersData, priceData]) => {
      if (Array.isArray(tiersData) && tiersData.length > 0) setTiers(tiersData);
      if (priceData?.rsd_per_gram) setLivePrice(priceData);
    });
  }, [loadItems]);

  // Build grouped variant map
  const seen = new Map<string, GroupedVariant>();
  for (const v of allVariants) {
    seen.set(v.id, {
      variantId: v.id,
      slug: v.slug,
      name: v.name ?? v.products.name,
      brand: v.products.brand,
      category: v.products.category,
      weightG: v.weight_g,
      items: [],
    });
  }
  const filteredItems = kasaFilter === "sve" ? items : items.filter((i) => i.register_type === kasaFilter);

  for (const item of filteredItems) {
    const v = item.product_variants;
    if (!seen.has(v.id)) {
      seen.set(v.id, {
        variantId: v.id,
        slug: v.slug,
        name: v.name ?? v.products.name,
        brand: v.products.brand,
        category: v.products.category,
        weightG: v.weight_g,
        items: [],
      });
    }
    seen.get(v.id)!.items.push(item);
  }

  const allGroups = Array.from(seen.values()).sort((a, b) => a.weightG - b.weightG);
  const displayGroups = filter === "in_stock" ? allGroups.filter((g) => g.items.length > 0) : allGroups;

  // Group by category for display
  const byCategory: Record<string, GroupedVariant[]> = {};
  for (const g of displayGroups) {
    const cat = g.category ?? "ostalo";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(g);
  }
  const categoryKeys = CATEGORY_ORDER.filter((c) => byCategory[c]);

  // ── Summary stats ──
  const totalItems = filteredItems.length;
  const totalInvested = filteredItems.reduce((s, i) => s + i.purchase_price_rsd, 0);

  // Use actual tier margins for selling value (same as used on site)
  const totalSellingValue = livePrice && tiers.length > 0
    ? allGroups.reduce((s, g) => {
        const margin = findStockMarginPct(g.weightG, g.category, tiers, g.brand);
        const price = livePrice.rsd_per_gram * g.weightG * (1 + margin / 100);
        return s + price * g.items.length;
      }, 0)
    : 0;

  const totalPnL = totalSellingValue - totalInvested;
  const pnlPct   = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const belaCount = items.filter((i) => i.register_type === "bela").length;
  const crnaCount = items.filter((i) => i.register_type === "crna").length;

  async function handleSaved() {
    setAddTarget(null);
    await loadItems();
  }

  async function handleSellSaved() {
    setSellTarget(null);
    await loadItems();
  }

  async function handlePriceChanged() {
    setPriceEditTarget(null);
    await loadItems();
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-[#E9E6D9]">Lager</h1>
          <p className="text-sm text-[#555] mt-1">
            Fizičke jedinice zlata na stanju sa nabavnim cenama i tržišnom vrednošću.
          </p>
        </div>
        <a
          href="/api/admin/export/lager"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#2E2E2F] text-xs text-[#8A8A8A] hover:text-[#E9E6D9] transition-colors shrink-0"
        >
          <Download size={13} />
          Export lager
        </a>
      </div>

      {/* Summary cards */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-[#1B1B1C] border border-[#2E2E2F] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package size={13} className="text-[#555]" />
              <p className="text-[10px] text-[#555] uppercase tracking-wider">Na lageru</p>
            </div>
            <p className="text-xl font-semibold text-[#E9E6D9] tabular-nums">{totalItems}</p>
            <p className="text-xs text-[#444] mt-0.5">komada</p>
          </div>

          <div className="bg-[#1B1B1C] border border-[#2E2E2F] rounded-xl p-4">
            <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Uloženo</p>
            <p className="text-sm font-semibold text-[#E9E6D9] tabular-nums leading-tight">
              {formatRsd(totalInvested)}
            </p>
            <p className="text-xs text-[#444] mt-0.5">nabavna vrednost</p>
          </div>

          {livePrice ? (
            <>
              <div className="bg-[#1B1B1C] border border-[#2E2E2F] rounded-xl p-4">
                <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Prod. vrednost</p>
                <p className="text-sm font-semibold text-[#BF8E41] tabular-nums leading-tight">
                  {formatRsd(totalSellingValue)}
                </p>
                <p className="text-xs text-[#444] mt-0.5">
                  {tiers.length > 0 ? "po prodajnoj ceni" : "spot × ~3%"}
                </p>
              </div>

              <div className={`border rounded-xl p-4 ${totalPnL >= 0 ? "bg-green-500/5 border-green-500/15" : "bg-red-500/5 border-red-500/15"}`}>
                <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Prodajni P&amp;L</p>
                <p className={`text-sm font-semibold tabular-nums leading-tight ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {totalPnL >= 0 ? "+" : ""}{formatRsd(totalPnL)}
                </p>
                <p className={`text-xs mt-0.5 ${totalPnL >= 0 ? "text-green-500/60" : "text-red-500/60"}`}>
                  {pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}% od nabavne cene
                </p>
              </div>
            </>
          ) : (
            <div className="col-span-2 bg-[#111112] border border-[#2E2E2F] rounded-xl p-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50" />
              <p className="text-xs text-[#444]">Spot cena nije dostupna - P&amp;L nije moguće izračunati</p>
            </div>
          )}
        </div>
      )}

      {/* Live price bar */}
      {livePrice && (
        <div className="mb-5 px-4 py-2.5 rounded-xl border border-[#2E2E2F] bg-[#111112] flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-[#555]">Snapshot cena</span>
          </div>
          <span className="text-sm text-[#E9E6D9] tabular-nums font-medium">
            {formatRsd(livePrice.rsd_per_gram)} /g
          </span>
          {livePrice.xau_eur && (
            <span className="text-xs text-[#555]">
              XAU/EUR: {livePrice.xau_eur.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
            </span>
          )}
          {livePrice.eur_rsd && (
            <span className="text-xs text-[#555]">EUR/RSD: {livePrice.eur_rsd}</span>
          )}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-[#111112] border border-[#2E2E2F] rounded-xl w-fit">
          <button
            onClick={() => setFilter("in_stock")}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "in_stock"
                ? "bg-[#1B1B1C] text-[#E9E6D9] border border-[#2E2E2F]"
                : "text-[#555] hover:text-[#8A8A8A]"
            }`}
          >
            Na lageru
            {!loading && (
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${filter === "in_stock" ? "bg-green-500/15 text-green-400" : "bg-[#1B1B1C] text-[#444]"}`}>
                {allGroups.filter((g) => g.items.length > 0).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "all"
                ? "bg-[#1B1B1C] text-[#E9E6D9] border border-[#2E2E2F]"
                : "text-[#555] hover:text-[#8A8A8A]"
            }`}
          >
            Sve varijante
            {!loading && (
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${filter === "all" ? "bg-[#2E2E2F] text-[#8A8A8A]" : "bg-[#1B1B1C] text-[#444]"}`}>
                {allGroups.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#111112] border border-[#2E2E2F] rounded-xl w-fit">
          <button
            onClick={() => setKasaFilter("sve")}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              kasaFilter === "sve"
                ? "bg-[#1B1B1C] text-[#E9E6D9] border border-[#2E2E2F]"
                : "text-[#555] hover:text-[#8A8A8A]"
            }`}
          >
            Sve kase
          </button>
          <button
            onClick={() => setKasaFilter("bela")}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              kasaFilter === "bela"
                ? "bg-[#E9E6D9]/10 text-[#E9E6D9] border border-[#E9E6D9]/30"
                : "text-[#555] hover:text-[#8A8A8A]"
            }`}
          >
            Bela kasa
            {!loading && (
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${kasaFilter === "bela" ? "bg-[#E9E6D9]/15 text-[#E9E6D9]" : "bg-[#1B1B1C] text-[#444]"}`}>
                {belaCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setKasaFilter("crna")}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              kasaFilter === "crna"
                ? "bg-[#8A8A8A]/10 text-[#8A8A8A] border border-[#8A8A8A]/30"
                : "text-[#555] hover:text-[#8A8A8A]"
            }`}
          >
            Crna kasa
            {!loading && (
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${kasaFilter === "crna" ? "bg-[#8A8A8A]/15 text-[#8A8A8A]" : "bg-[#1B1B1C] text-[#444]"}`}>
                {crnaCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 text-[#555] text-sm">Učitavam lager...</div>
      ) : displayGroups.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#2E2E2F] rounded-xl">
          <Package size={32} className="text-[#333] mx-auto mb-3" />
          <p className="text-[#555] text-sm">
            {filter === "in_stock" ? "Lager je trenutno prazan." : "Nema varijanti."}
          </p>
          {filter === "in_stock" && (
            <button
              onClick={() => setFilter("all")}
              className="mt-3 text-xs text-[#BF8E41] hover:underline"
            >
              Prikaži sve varijante →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-7">
          {categoryKeys.map((cat) => (
            <CategorySection
              key={cat}
              category={cat}
              groups={byCategory[cat]}
              livePrice={livePrice}
              tiers={tiers}
              onAdd={setAddTarget}
              onSell={(item, group) => setSellTarget({ item, group })}
              onChangePrice={(item, group) => setPriceEditTarget({ item, group })}
            />
          ))}
        </div>
      )}

      {/* Add item modal */}
      {addTarget && (
        <AddItemModal
          variant={addTarget}
          onClose={() => setAddTarget(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Sell modal */}
      {sellTarget && (
        <SellModal
          item={sellTarget.item}
          productLabel={`${sellTarget.group.brand} - ${sellTarget.group.name} (${formatWeight(sellTarget.group.weightG)})${sellTarget.item.serial_number ? ` · SN ${sellTarget.item.serial_number}` : ""}`}
          suggestedPrice={
            livePrice
              ? livePrice.rsd_per_gram *
                sellTarget.group.weightG *
                (1 + findStockMarginPct(sellTarget.group.weightG, sellTarget.group.category, tiers, sellTarget.group.brand) / 100)
              : null
          }
          onClose={() => setSellTarget(null)}
          onSaved={handleSellSaved}
        />
      )}

      {/* Change price modal */}
      {priceEditTarget && (
        <ChangePriceModal
          item={priceEditTarget.item}
          productLabel={`${priceEditTarget.group.brand} - ${priceEditTarget.group.name} (${formatWeight(priceEditTarget.group.weightG)})${priceEditTarget.item.serial_number ? ` · SN ${priceEditTarget.item.serial_number}` : ""}`}
          onClose={() => setPriceEditTarget(null)}
          onSaved={handlePriceChanged}
        />
      )}
    </div>
  );
}
