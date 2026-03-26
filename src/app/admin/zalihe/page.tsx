"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, X } from "lucide-react";

type LagerItem = {
  id: string;
  purchase_price_rsd: number;
  purchased_at: string;
  note: string | null;
  created_at: string;
  product_variants: {
    id: string;
    slug: string;
    weight_g: number;
    purity: number;
    sku: string | null;
    products: { name: string; brand: string; category: string };
  };
};

type GroupedVariant = {
  variantId: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  weightG: number;
  items: LagerItem[];
};

type LivePrice = { rsd_per_gram: number; xau_eur: number; eur_rsd: number };

function formatRsd(n: number) {
  return new Intl.NumberFormat("sr-RS", { style: "currency", currency: "RSD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(n));
}

function formatDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

// Modal za dodavanje novog itema
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    const priceNum = parseFloat(price.replace(/\./g, "").replace(",", "."));
    const qtyNum = parseInt(qty) || 1;
    if (!priceNum || priceNum <= 0) { setError("Unesi nabavnu cenu"); return; }

    setSaving(true);
    try {
      // Dodaj N komada sa istom cenom
      await Promise.all(
        Array.from({ length: qtyNum }).map(() =>
          fetch("/api/admin/lager", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              variant_id: variant.variantId,
              purchase_price_rsd: priceNum,
              purchased_at: date,
              note: note || null,
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
              Dodaj na lager — {variant.weightG >= 1000 ? `${variant.weightG / 1000}kg` : `${variant.weightG}g`}
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
                onChange={e => setQty(e.target.value)}
                className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
              />
            </div>
            <div>
              <label className="text-xs text-[#555] block mb-1.5">Datum nabavke</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
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
              onChange={e => { setPrice(e.target.value); setError(""); }}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
            />
            {parseInt(qty) > 1 && price && (
              <p className="text-xs text-[#555] mt-1">
                Ukupno: {formatRsd(parseFloat(price) * parseInt(qty))} za {qty} kom
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-[#555] block mb-1.5">Napomena (opcionalno)</label>
            <input
              type="text"
              placeholder="npr. Restock mart 2026"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[#2E2E2F] text-sm text-[#8A8A8A] hover:text-[#E9E6D9] transition-colors">
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

// Kartica za jedan variant grupisano
function VariantCard({
  group,
  livePrice,
  onAdd,
  onDelete,
}: {
  group: GroupedVariant;
  livePrice: LivePrice | null;
  onAdd: (v: GroupedVariant) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const count = group.items.length;
  const avgPurchase = count > 0
    ? group.items.reduce((s, i) => s + i.purchase_price_rsd, 0) / count
    : 0;
  const totalPurchase = group.items.reduce((s, i) => s + i.purchase_price_rsd, 0);

  // Trenutna prodajna cena = spot/gram * težina * (1 + marža) — aproksimacija sa live cenom
  const spotPerGram = livePrice?.rsd_per_gram ?? 0;
  const currentSellingPrice = spotPerGram * group.weightG * 1.03; // ~3% marža aprox

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch(`/api/admin/lager/${id}`, { method: "DELETE" });
    onDelete(id);
    setDeletingId(null);
  }

  return (
    <div className="border border-[#2E2E2F] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#1B1B1C] px-5 py-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#E9E6D9] font-medium text-sm">{group.name}</span>
            <span className="text-[10px] text-[#555] bg-[#111112] border border-[#2E2E2F] px-2 py-0.5 rounded-full">
              {group.weightG >= 1000 ? `${group.weightG / 1000}kg` : `${group.weightG}g`}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
              count > 0
                ? "text-green-400 bg-green-500/10 border-green-500/20"
                : "text-[#555] bg-[#111112] border-[#2E2E2F]"
            }`}>
              {count} {count === 1 ? "kom" : "kom"} na lageru
            </span>
          </div>

          {count > 0 && (
            <div className="flex items-center gap-4 mt-1.5 flex-wrap">
              <span className="text-xs text-[#555]">
                Prosečna nabavna: <span className="text-[#8A8A8A]">{formatRsd(avgPurchase)}</span>
              </span>
              <span className="text-xs text-[#555]">
                Ukupno uloženo: <span className="text-[#8A8A8A]">{formatRsd(totalPurchase)}</span>
              </span>
              {livePrice && (
                <span className="text-xs text-[#555]">
                  Tren. prodajna: <span className="text-[#BF8E41]">{formatRsd(currentSellingPrice)}</span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onAdd(group)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#BF8E41]/10 border border-[#BF8E41]/20 text-[#BF8E41] text-xs font-medium hover:bg-[#BF8E41]/20 transition-colors"
          >
            <Plus size={13} />
            Dodaj
          </button>
          {count > 0 && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#2E2E2F] text-xs text-[#8A8A8A] hover:text-[#E9E6D9] transition-colors"
            >
              Detalji
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded items */}
      {expanded && count > 0 && (
        <div className="border-t border-[#2E2E2F]">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-px bg-[#2E2E2F] text-[10px] font-semibold text-[#555] uppercase tracking-wider">
            <div className="bg-[#111112] px-4 py-2">#</div>
            <div className="bg-[#111112] px-4 py-2">Nabavna cena</div>
            <div className="bg-[#111112] px-4 py-2">Profit/gubitak</div>
            <div className="bg-[#111112] px-4 py-2">Datum / Napomena</div>
            <div className="bg-[#111112] px-4 py-2">Prodato</div>
          </div>

          {group.items.map((item, idx) => {
            const profitLoss = livePrice ? currentSellingPrice - item.purchase_price_rsd : null;
            const isProfit = (profitLoss ?? 0) >= 0;

            return (
              <div
                key={item.id}
                className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-px bg-[#2E2E2F] border-t border-[#2E2E2F]"
              >
                <div className="bg-[#1B1B1C] px-4 py-3 flex items-center">
                  <span className="text-xs text-[#555]">#{idx + 1}</span>
                </div>
                <div className="bg-[#1B1B1C] px-4 py-3 flex items-center">
                  <span className="text-sm text-[#E9E6D9] font-medium tabular-nums">
                    {formatRsd(item.purchase_price_rsd)}
                  </span>
                </div>
                <div className="bg-[#1B1B1C] px-4 py-3 flex items-center">
                  {profitLoss !== null ? (
                    <span className={`text-sm font-semibold tabular-nums ${isProfit ? "text-green-400" : "text-red-400"}`}>
                      {isProfit ? "+" : ""}{formatRsd(profitLoss)}
                    </span>
                  ) : (
                    <span className="text-xs text-[#555]">—</span>
                  )}
                </div>
                <div className="bg-[#1B1B1C] px-4 py-3 flex flex-col justify-center">
                  <span className="text-xs text-[#8A8A8A]">{formatDate(item.purchased_at)}</span>
                  {item.note && <span className="text-[10px] text-[#555] mt-0.5">{item.note}</span>}
                </div>
                <div className="bg-[#1B1B1C] px-4 py-3 flex items-center">
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="p-1.5 rounded-lg text-[#555] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                    title="Obriši (prodato)"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

type VariantRow = {
  id: string;
  slug: string;
  weight_g: number;
  purity: number;
  sku: string | null;
  products: { name: string; brand: string; category: string };
};

export default function AdminZalikePage() {
  const [items, setItems] = useState<LagerItem[]>([]);
  const [allVariants, setAllVariants] = useState<VariantRow[]>([]);
  const [livePrice, setLivePrice] = useState<LivePrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [addTarget, setAddTarget] = useState<GroupedVariant | null>(null);

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
    fetch("/api/prices").then(r => r.json()).then(d => {
      if (d.rsd_per_gram) setLivePrice(d);
    }).catch(() => {});
  }, [loadItems]);

  // Grupiši po variantu — uključi SVE varijante, čak i prazne
  const seen = new Map<string, GroupedVariant>();

  // Prvo dodaj sve varijante iz baze (prazne grupe)
  for (const v of allVariants) {
    seen.set(v.id, {
      variantId: v.id,
      slug: v.slug,
      name: v.products.name,
      brand: v.products.brand,
      category: v.products.category,
      weightG: v.weight_g,
      items: [],
    });
  }

  // Pa popuni sa lager itemima
  for (const item of items) {
    const v = item.product_variants;
    if (!seen.has(v.id)) {
      seen.set(v.id, {
        variantId: v.id,
        slug: v.slug,
        name: v.products.name,
        brand: v.products.brand,
        category: v.products.category,
        weightG: v.weight_g,
        items: [],
      });
    }
    seen.get(v.id)!.items.push(item);
  }

  const groups = Array.from(seen.values()).sort((a, b) => a.weightG - b.weightG);

  const totalItems = items.length;
  const totalValue = items.reduce((s, i) => s + i.purchase_price_rsd, 0);

  function handleDelete(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  async function handleSaved() {
    setAddTarget(null);
    await loadItems();
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#E9E6D9]">Lager</h1>
          <p className="text-sm text-[#555] mt-1">
            Fizičke jedinice zlata na stanju sa nabavnim cenama.
          </p>
        </div>
        {!loading && (
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <p className="text-xs text-[#555]">Ukupno na lageru</p>
              <p className="text-sm font-semibold text-[#E9E6D9] tabular-nums">{totalItems} kom</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#555]">Ukupno uloženo</p>
              <p className="text-sm font-semibold text-[#BF8E41] tabular-nums">{formatRsd(totalValue)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Live price info */}
      {livePrice && (
        <div className="mb-5 px-4 py-3 rounded-xl border border-[#2E2E2F] bg-[#111112] flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-[#555]">Live spot</span>
          </div>
          <span className="text-sm text-[#E9E6D9] tabular-nums font-medium">{formatRsd(livePrice.rsd_per_gram)} /g</span>
          <span className="text-xs text-[#555]">XAU/EUR: {livePrice.xau_eur.toLocaleString("de-DE", { minimumFractionDigits: 2 })}</span>
          <span className="text-xs text-[#555]">EUR/RSD: {livePrice.eur_rsd}</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 text-[#555] text-sm">Učitavam lager...</div>
      ) : groups.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#2E2E2F] rounded-xl">
          <p className="text-[#555] text-sm">Lager je prazan.</p>
          <p className="text-[#333] text-xs mt-1">Dodaj prve jedinice klikom na "Dodaj" pored proizvoda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map(group => (
            <VariantCard
              key={group.variantId}
              group={group}
              livePrice={livePrice}
              onAdd={setAddTarget}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {addTarget && (
        <AddItemModal
          variant={addTarget}
          onClose={() => setAddTarget(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
