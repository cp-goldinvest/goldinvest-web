"use client";

import { useState } from "react";

type StockItem = {
  id: string;
  name: string;
  weightG: number;
  category: string;
  stockQty: number;
  availability: "in_stock" | "available_on_request" | "preorder";
  leadTimeWeeks: number | null;
};

const MOCK_STOCK: StockItem[] = [
  { id: "1", name: "Argor-Heraeus 1g",    weightG: 1,    category: "poluga", stockQty: 15, availability: "in_stock",             leadTimeWeeks: null },
  { id: "2", name: "Argor-Heraeus 5g",    weightG: 5,    category: "poluga", stockQty: 8,  availability: "in_stock",             leadTimeWeeks: null },
  { id: "3", name: "Argor-Heraeus 10g",   weightG: 10,   category: "poluga", stockQty: 3,  availability: "in_stock",             leadTimeWeeks: null },
  { id: "4", name: "Argor-Heraeus 20g",   weightG: 20,   category: "poluga", stockQty: 0,  availability: "available_on_request", leadTimeWeeks: null },
  { id: "5", name: "Argor-Heraeus 50g",   weightG: 50,   category: "poluga", stockQty: 2,  availability: "in_stock",             leadTimeWeeks: null },
  { id: "6", name: "Argor-Heraeus 100g",  weightG: 100,  category: "poluga", stockQty: 1,  availability: "in_stock",             leadTimeWeeks: null },
  { id: "7", name: "C. Hafner 100g",      weightG: 100,  category: "poluga", stockQty: 0,  availability: "preorder",             leadTimeWeeks: 2 },
  { id: "8", name: "Franc Jozef mali",    weightG: 3.49, category: "dukat",  stockQty: 5,  availability: "in_stock",             leadTimeWeeks: null },
];

const AVAILABILITY_LABELS = {
  in_stock:             { label: "Na stanju",  color: "text-green-400 bg-green-500/10 border-green-500/20" },
  available_on_request: { label: "Na upit",    color: "text-[#8A8A8A] bg-[#2E2E2F] border-[#3A3A3B]" },
  preorder:             { label: "Preorder",   color: "text-[#BF8E41] bg-[#BF8E41]/10 border-[#BF8E41]/20" },
};

export default function AdminZalikePage() {
  const [items, setItems] = useState<StockItem[]>(MOCK_STOCK);
  const [saved, setSaved] = useState<string | null>(null);

  function handleQtyChange(id: string, qty: string) {
    const n = parseInt(qty) || 0;
    setItems((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      const availability = n > 0 ? "in_stock" : item.availability === "in_stock" ? "available_on_request" : item.availability;
      return { ...item, stockQty: n, availability };
    }));
  }

  function handleAvailabilityChange(id: string, val: StockItem["availability"]) {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, availability: val } : item));
  }

  async function handleSave(id: string) {
    await new Promise((r) => setTimeout(r, 400));
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#E9E6D9]">Zalihe</h1>
        <p className="text-sm text-[#555] mt-1">Ažuriraj stanje na stanju i dostupnost proizvoda.</p>
      </div>

      <div className="rounded-xl border border-[#2E2E2F] overflow-hidden">
        <div className="grid grid-cols-[2fr_100px_1fr_auto] gap-px bg-[#2E2E2F] text-[10px] font-semibold text-[#555] uppercase tracking-wider">
          <div className="bg-[#1B1B1C] px-4 py-3">Proizvod</div>
          <div className="bg-[#1B1B1C] px-4 py-3">Komada</div>
          <div className="bg-[#1B1B1C] px-4 py-3">Status</div>
          <div className="bg-[#1B1B1C] px-4 py-3">Akcija</div>
        </div>

        {items.map((item) => {
          const avail = AVAILABILITY_LABELS[item.availability];
          return (
            <div key={item.id} className="grid grid-cols-[2fr_100px_1fr_auto] gap-px bg-[#2E2E2F] border-t border-[#2E2E2F] first:border-t-0">
              <div className="bg-[#1B1B1C] px-4 py-3">
                <p className="text-sm font-medium text-[#E9E6D9]">{item.name}</p>
                <p className="text-xs text-[#555]">{item.category}</p>
              </div>

              <div className="bg-[#1B1B1C] px-3 py-3">
                <input
                  type="number"
                  min="0"
                  value={item.stockQty}
                  onChange={(e) => handleQtyChange(item.id, e.target.value)}
                  className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-1.5 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60 transition-colors tabular-nums"
                />
              </div>

              <div className="bg-[#1B1B1C] px-3 py-3">
                <select
                  value={item.availability}
                  onChange={(e) => handleAvailabilityChange(item.id, e.target.value as StockItem["availability"])}
                  className="w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-1.5 text-xs text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60 transition-colors"
                >
                  <option value="in_stock">Na stanju</option>
                  <option value="preorder">Preorder</option>
                  <option value="available_on_request">Na upit</option>
                </select>
                {item.availability === "preorder" && (
                  <p className="text-[10px] text-[#555] mt-1">
                    Rok: {item.leadTimeWeeks ?? "?"} ned.
                  </p>
                )}
              </div>

              <div className="bg-[#1B1B1C] px-3 py-3 flex items-center">
                <button
                  onClick={() => handleSave(item.id)}
                  className={[
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap",
                    saved === item.id
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "gold-gradient-bg text-[#1B1B1C] hover:opacity-90",
                  ].join(" ")}
                >
                  {saved === item.id ? "✓ Ok" : "Sačuvaj"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
