"use client";

import { useState } from "react";
import { Plus, ChevronDown, ChevronRight, Trash2, ToggleLeft, ToggleRight, X, Package } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type Category = "poluga" | "plocica" | "dukat" | "multipack";

type Variant = {
  id: string;
  name: string;
  weight_g: number;
  purity: number;
  sku: string;
  stock_qty: number;
  availability: "in_stock" | "available_on_request" | "preorder";
  lead_time_weeks: number | null;
  sort_order: number;
  is_active: boolean;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  brand: string;
  refinery: string;
  origin: string;
  is_active: boolean;
  variants: Variant[];
};

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1", slug: "argor-heraeus-poluga", name: "Argor-Heraeus", category: "poluga",
    brand: "Argor-Heraeus", refinery: "Argor-Heraeus SA", origin: "Švajcarska", is_active: true,
    variants: [
      { id: "v1", name: "Argor-Heraeus zlatna poluga 1g",    weight_g: 1,    purity: 999.9, sku: "AH-1G",    stock_qty: 12, availability: "in_stock",             lead_time_weeks: null, sort_order: 1, is_active: true },
      { id: "v2", name: "Argor-Heraeus zlatna poluga 5g",    weight_g: 5,    purity: 999.9, sku: "AH-5G",    stock_qty: 6,  availability: "in_stock",             lead_time_weeks: null, sort_order: 2, is_active: true },
      { id: "v3", name: "Argor-Heraeus zlatna poluga 10g",   weight_g: 10,   purity: 999.9, sku: "AH-10G",   stock_qty: 3,  availability: "in_stock",             lead_time_weeks: null, sort_order: 3, is_active: true },
      { id: "v4", name: "Argor-Heraeus zlatna poluga 20g",   weight_g: 20,   purity: 999.9, sku: "AH-20G",   stock_qty: 0,  availability: "available_on_request", lead_time_weeks: null, sort_order: 4, is_active: true },
      { id: "v5", name: "Argor-Heraeus zlatna poluga 50g",   weight_g: 50,   purity: 999.9, sku: "AH-50G",   stock_qty: 2,  availability: "in_stock",             lead_time_weeks: null, sort_order: 5, is_active: true },
      { id: "v6", name: "Argor-Heraeus zlatna poluga 100g",  weight_g: 100,  purity: 999.9, sku: "AH-100G",  stock_qty: 1,  availability: "in_stock",             lead_time_weeks: null, sort_order: 6, is_active: true },
      { id: "v7", name: "Argor-Heraeus zlatna poluga 250g",  weight_g: 250,  purity: 999.9, sku: "AH-250G",  stock_qty: 0,  availability: "preorder",             lead_time_weeks: 3,    sort_order: 7, is_active: true },
      { id: "v8", name: "Argor-Heraeus zlatna poluga 1kg",   weight_g: 1000, purity: 999.9, sku: "AH-1KG",   stock_qty: 0,  availability: "preorder",             lead_time_weeks: 4,    sort_order: 8, is_active: true },
    ],
  },
  {
    id: "p2", slug: "c-hafner-poluga", name: "C. Hafner", category: "poluga",
    brand: "C. Hafner", refinery: "C.Hafner GmbH", origin: "Nemačka", is_active: true,
    variants: [
      { id: "v9",  name: "C. Hafner zlatna poluga 100g", weight_g: 100,  purity: 999.9, sku: "CH-100G",  stock_qty: 2,  availability: "in_stock",  lead_time_weeks: null, sort_order: 1, is_active: true },
      { id: "v10", name: "C. Hafner zlatna poluga 250g", weight_g: 250,  purity: 999.9, sku: "CH-250G",  stock_qty: 0,  availability: "preorder",  lead_time_weeks: 3,    sort_order: 2, is_active: true },
    ],
  },
  {
    id: "p3", slug: "franc-jozef-dukat", name: "Franc Jozef", category: "dukat",
    brand: "Austrijska kovnica", refinery: "Münze Österreich", origin: "Austrija", is_active: true,
    variants: [
      { id: "v11", name: "Franc Jozef dukat mali (3,49g)",   weight_g: 3.49,  purity: 986, sku: "FJ-MALI",   stock_qty: 5,  availability: "in_stock",  lead_time_weeks: null, sort_order: 1, is_active: true },
      { id: "v12", name: "Franc Jozef dukat veliki (13,96g)", weight_g: 13.96, purity: 986, sku: "FJ-VELIKI", stock_qty: 2,  availability: "in_stock",  lead_time_weeks: null, sort_order: 2, is_active: true },
    ],
  },
];

const CATEGORY_LABELS: Record<Category, string> = {
  poluga: "Poluge", plocica: "Pločice", dukat: "Dukati", multipack: "Multipack",
};

const AVAILABILITY_LABELS = {
  in_stock:             "Na stanju",
  available_on_request: "Na upit",
  preorder:             "Preorder",
};

// ── Empty form defaults ────────────────────────────────────────────────────
const EMPTY_PRODUCT = { name: "", brand: "", category: "poluga" as Category, refinery: "", origin: "" };
const EMPTY_VARIANT = { name: "", weight_g: "", purity: "999.9", sku: "", stock_qty: "0", availability: "in_stock" as Variant["availability"], lead_time_weeks: "", sort_order: "1" };

// ── Main page ──────────────────────────────────────────────────────────────
export default function AdminProizvodiPage() {
  const [products, setProducts]         = useState<Product[]>(MOCK_PRODUCTS);
  const [categoryFilter, setCategoryFilter] = useState<Category | "sve">("sve");
  const [expanded, setExpanded]         = useState<Set<string>>(new Set(["p1"]));
  const [confirmDelete, setConfirmDelete] = useState<{ type: "product" | "variant"; id: string; parentId?: string } | null>(null);

  // Add product drawer
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm]   = useState(EMPTY_PRODUCT);
  const [productSaving, setProductSaving] = useState(false);

  // Add variant drawer
  const [addVariantFor, setAddVariantFor] = useState<string | null>(null);
  const [variantForm, setVariantForm]   = useState(EMPTY_VARIANT);
  const [variantSaving, setVariantSaving] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────
  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleProductActive(id: string) {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !p.is_active } : p));
  }

  function toggleVariantActive(productId: string, variantId: string) {
    setProducts((prev) => prev.map((p) => p.id !== productId ? p : {
      ...p,
      variants: p.variants.map((v) => v.id === variantId ? { ...v, is_active: !v.is_active } : v),
    }));
  }

  async function handleAddProduct() {
    if (!productForm.name || !productForm.brand) return;
    setProductSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    const newProduct: Product = {
      id: `p${Date.now()}`,
      slug: `${productForm.brand}-${productForm.name}`.toLowerCase().replace(/\s+/g, "-"),
      name: productForm.name,
      brand: productForm.brand,
      category: productForm.category,
      refinery: productForm.refinery,
      origin: productForm.origin,
      is_active: true,
      variants: [],
    };
    setProducts((prev) => [...prev, newProduct]);
    setProductForm(EMPTY_PRODUCT);
    setProductSaving(false);
    setShowAddProduct(false);
  }

  async function handleAddVariant() {
    if (!addVariantFor || !variantForm.weight_g) return;
    setVariantSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    const newVariant: Variant = {
      id: `v${Date.now()}`,
      name: variantForm.name,
      weight_g: parseFloat(variantForm.weight_g),
      purity: parseFloat(variantForm.purity) || 999.9,
      sku: variantForm.sku,
      stock_qty: parseInt(variantForm.stock_qty) || 0,
      availability: variantForm.availability,
      lead_time_weeks: variantForm.lead_time_weeks ? parseInt(variantForm.lead_time_weeks) : null,
      sort_order: parseInt(variantForm.sort_order) || 1,
      is_active: true,
    };
    setProducts((prev) => prev.map((p) => p.id !== addVariantFor ? p : {
      ...p, variants: [...p.variants, newVariant].sort((a, b) => a.weight_g - b.weight_g),
    }));
    setVariantForm(EMPTY_VARIANT);
    setVariantSaving(false);
    setAddVariantFor(null);
  }

  function handleConfirmedDelete() {
    if (!confirmDelete) return;
    if (confirmDelete.type === "product") {
      setProducts((prev) => prev.filter((p) => p.id !== confirmDelete.id));
    } else {
      setProducts((prev) => prev.map((p) => p.id !== confirmDelete.parentId ? p : {
        ...p, variants: p.variants.filter((v) => v.id !== confirmDelete.id),
      }));
    }
    setConfirmDelete(null);
  }

  const categories: (Category | "sve")[] = ["sve", "poluga", "plocica", "dukat", "multipack"];
  const filtered = categoryFilter === "sve" ? products : products.filter((p) => p.category === categoryFilter);

  return (
    <div className="p-6 lg:p-8 max-w-5xl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#E9E6D9]">Katalog proizvoda</h1>
          <p className="text-sm text-[#555] mt-0.5">Dodaj, ukloni ili deaktiviraj proizvode i varijante</p>
        </div>
        <button
          onClick={() => setShowAddProduct(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg gold-gradient-bg text-[#1B1B1C] text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={15} />
          Dodaj proizvod
        </button>
      </div>

      {/* ── Category filter ── */}
      <div className="flex gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={[
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              categoryFilter === cat
                ? "border-[#BF8E41] bg-[#BF8E41]/10 text-[#BF8E41]"
                : "border-[#2E2E2F] text-[#555] hover:text-[#E9E6D9] hover:border-[#3A3A3B]",
            ].join(" ")}
          >
            {cat === "sve" ? "Svi" : CATEGORY_LABELS[cat]}
            <span className="ml-1.5 text-[10px] opacity-60">
              {cat === "sve"
                ? products.length
                : products.filter((p) => p.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Products list ── */}
      <div className="space-y-3">
        {filtered.map((product) => (
          <div
            key={product.id}
            className={[
              "rounded-xl border overflow-hidden transition-colors",
              product.is_active ? "border-[#2E2E2F]" : "border-[#2E2E2F]/50 opacity-60",
            ].join(" ")}
          >
            {/* Product header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#1B1B1C]">
              <button
                onClick={() => toggleExpanded(product.id)}
                className="flex items-center gap-3 flex-1 min-w-0 text-left"
              >
                {expanded.has(product.id)
                  ? <ChevronDown size={15} className="text-[#555] shrink-0" />
                  : <ChevronRight size={15} className="text-[#555] shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#E9E6D9]">{product.brand}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2E2E2F] text-[#555]">
                      {CATEGORY_LABELS[product.category]}
                    </span>
                    {!product.is_active && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        Deaktiviran
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#555] mt-0.5">
                    {product.refinery} · {product.origin} · {product.variants.length} varijanti
                  </p>
                </div>
              </button>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => { setAddVariantFor(product.id); setVariantForm(EMPTY_VARIANT); }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-[#555] hover:text-[#BF8E41] hover:bg-[#2E2E2F] transition-colors"
                  title="Dodaj varijantu"
                >
                  <Plus size={12} /> Varijanta
                </button>
                <button
                  onClick={() => toggleProductActive(product.id)}
                  className="p-1.5 rounded-lg text-[#555] hover:text-[#E9E6D9] hover:bg-[#2E2E2F] transition-colors"
                  title={product.is_active ? "Deaktiviraj" : "Aktiviraj"}
                >
                  {product.is_active
                    ? <ToggleRight size={16} className="text-green-400" />
                    : <ToggleLeft size={16} />
                  }
                </button>
                <button
                  onClick={() => setConfirmDelete({ type: "product", id: product.id })}
                  className="p-1.5 rounded-lg text-[#555] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Obriši proizvod"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Variants table */}
            {expanded.has(product.id) && (
              <div className="border-t border-[#2E2E2F]">
                {/* Header */}
                <div className="grid grid-cols-[80px_70px_1fr_110px_60px_80px] text-[10px] font-semibold text-[#555] uppercase tracking-wider bg-[#111112] border-b border-[#2E2E2F]">
                  <div className="px-4 py-2">Težina</div>
                  <div className="px-3 py-2">Čistoća</div>
                  <div className="px-3 py-2">SKU</div>
                  <div className="px-3 py-2">Status</div>
                  <div className="px-3 py-2">Kom.</div>
                  <div className="px-3 py-2">Akcija</div>
                </div>

                {product.variants.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-[#555] bg-[#111112]">
                    Nema varijanti - klikni "+ Varijanta" da dodaš
                  </div>
                ) : (
                  product.variants.map((v) => (
                    <div
                      key={v.id}
                      className={[
                        "grid grid-cols-[80px_70px_1fr_110px_60px_80px] border-t border-[#2E2E2F] first:border-t-0",
                        v.is_active ? "bg-[#111112]" : "bg-[#111112] opacity-50",
                      ].join(" ")}
                    >
                      <div className="px-4 py-2.5 flex items-center">
                        <span className="text-sm font-semibold text-[#E9E6D9] tabular-nums">
                          {v.weight_g >= 1000 ? `${v.weight_g / 1000}kg` : `${v.weight_g}g`}
                        </span>
                      </div>
                      <div className="px-3 py-2.5 flex items-center">
                        <span className="text-xs text-[#8A8A8A] tabular-nums">{v.purity}</span>
                      </div>
                      <div className="px-3 py-2.5 flex items-center">
                        <span className="text-xs font-mono text-[#555]">{v.sku || "-"}</span>
                      </div>
                      <div className="px-3 py-2.5 flex items-center">
                        <span className={[
                          "text-[11px] px-2 py-0.5 rounded-full border",
                          v.availability === "in_stock"
                            ? "text-green-400 bg-green-500/10 border-green-500/20"
                            : v.availability === "preorder"
                            ? "text-[#BF8E41] bg-[#BF8E41]/10 border-[#BF8E41]/20"
                            : "text-[#8A8A8A] bg-[#2E2E2F] border-[#3A3A3B]",
                        ].join(" ")}>
                          {AVAILABILITY_LABELS[v.availability]}
                          {v.availability === "preorder" && v.lead_time_weeks && ` ${v.lead_time_weeks}ned`}
                        </span>
                      </div>
                      <div className="px-3 py-2.5 flex items-center">
                        <span className="text-xs text-[#8A8A8A] tabular-nums">{v.stock_qty}</span>
                      </div>
                      <div className="px-3 py-2.5 flex items-center gap-1">
                        <button
                          onClick={() => toggleVariantActive(product.id, v.id)}
                          className="p-1 rounded text-[#555] hover:text-[#E9E6D9] hover:bg-[#2E2E2F] transition-colors"
                          title={v.is_active ? "Deaktiviraj" : "Aktiviraj"}
                        >
                          {v.is_active
                            ? <ToggleRight size={14} className="text-green-400" />
                            : <ToggleLeft size={14} />
                          }
                        </button>
                        <button
                          onClick={() => setConfirmDelete({ type: "variant", id: v.id, parentId: product.id })}
                          className="p-1 rounded text-[#555] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Obriši varijantu"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-[#555]">
            <Package size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nema proizvoda u ovoj kategoriji</p>
          </div>
        )}
      </div>

      {/* ── Drawer: Dodaj proizvod ── */}
      {showAddProduct && (
        <Drawer title="Dodaj novi proizvod" onClose={() => setShowAddProduct(false)}>
          <div className="space-y-4">
            <Field label="Naziv proizvoda *" hint="npr. Argor-Heraeus, C. Hafner, Franc Jozef">
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="npr. Argor-Heraeus"
                className={inputCls}
              />
            </Field>

            <Field label="Brend *">
              <input
                type="text"
                value={productForm.brand}
                onChange={(e) => setProductForm((f) => ({ ...f, brand: e.target.value }))}
                placeholder="npr. Argor-Heraeus SA"
                className={inputCls}
              />
            </Field>

            <Field label="Kategorija *">
              <select
                value={productForm.category}
                onChange={(e) => setProductForm((f) => ({ ...f, category: e.target.value as Category }))}
                className={inputCls}
              >
                <option value="poluga">Poluge</option>
                <option value="plocica">Pločice</option>
                <option value="dukat">Dukati</option>
                <option value="multipack">Multipack</option>
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Rafinerija">
                <input
                  type="text"
                  value={productForm.refinery}
                  onChange={(e) => setProductForm((f) => ({ ...f, refinery: e.target.value }))}
                  placeholder="npr. Argor-Heraeus SA"
                  className={inputCls}
                />
              </Field>
              <Field label="Poreklo">
                <input
                  type="text"
                  value={productForm.origin}
                  onChange={(e) => setProductForm((f) => ({ ...f, origin: e.target.value }))}
                  placeholder="npr. Švajcarska"
                  className={inputCls}
                />
              </Field>
            </div>

            <p className="text-[11px] text-[#555] pt-1">
              Nakon dodavanja proizvoda, možete mu dodati varijante (gramature) klikom na "+ Varijanta".
            </p>

            <button
              onClick={handleAddProduct}
              disabled={productSaving || !productForm.name || !productForm.brand}
              className="w-full py-2.5 rounded-lg gold-gradient-bg text-[#1B1B1C] text-sm font-bold disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              {productSaving ? "Dodavanje..." : "Dodaj proizvod"}
            </button>
          </div>
        </Drawer>
      )}

      {/* ── Drawer: Dodaj varijantu ── */}
      {addVariantFor && (
        <Drawer
          title={`Dodaj varijantu - ${products.find((p) => p.id === addVariantFor)?.brand}`}
          onClose={() => setAddVariantFor(null)}
        >
          <div className="space-y-4">
            <Field label="Naziv varijante *" hint="npr. Argor-Heraeus zlatna poluga 100g">
              <input
                type="text"
                value={variantForm.name}
                onChange={(e) => setVariantForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="npr. Franc Jozef dukat mali (3,49g)"
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Težina (g) *">
                <input
                  type="number"
                  step="0.01"
                  value={variantForm.weight_g}
                  onChange={(e) => setVariantForm((f) => ({ ...f, weight_g: e.target.value }))}
                  placeholder="npr. 100"
                  className={inputCls}
                />
              </Field>
              <Field label="Čistoća (‰)">
                <input
                  type="number"
                  step="0.1"
                  value={variantForm.purity}
                  onChange={(e) => setVariantForm((f) => ({ ...f, purity: e.target.value }))}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="SKU (opcionalno)">
                <input
                  type="text"
                  value={variantForm.sku}
                  onChange={(e) => setVariantForm((f) => ({ ...f, sku: e.target.value }))}
                  placeholder="npr. AH-100G"
                  className={inputCls}
                />
              </Field>
              <Field label="Početna količina">
                <input
                  type="number"
                  min="0"
                  value={variantForm.stock_qty}
                  onChange={(e) => setVariantForm((f) => ({ ...f, stock_qty: e.target.value }))}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Dostupnost">
              <select
                value={variantForm.availability}
                onChange={(e) => setVariantForm((f) => ({ ...f, availability: e.target.value as Variant["availability"] }))}
                className={inputCls}
              >
                <option value="in_stock">Na stanju</option>
                <option value="preorder">Preorder</option>
                <option value="available_on_request">Na upit</option>
              </select>
            </Field>

            {variantForm.availability === "preorder" && (
              <Field label="Rok isporuke (nedelje)">
                <input
                  type="number"
                  min="1"
                  value={variantForm.lead_time_weeks}
                  onChange={(e) => setVariantForm((f) => ({ ...f, lead_time_weeks: e.target.value }))}
                  placeholder="npr. 3"
                  className={inputCls}
                />
              </Field>
            )}

            <button
              onClick={handleAddVariant}
              disabled={variantSaving || !variantForm.weight_g}
              className="w-full py-2.5 rounded-lg gold-gradient-bg text-[#1B1B1C] text-sm font-bold disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              {variantSaving ? "Dodavanje..." : "Dodaj varijantu"}
            </button>
          </div>
        </Drawer>
      )}

      {/* ── Confirm delete modal ── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#1B1B1C] border border-[#2E2E2F] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Trash2 size={15} className="text-red-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#E9E6D9]">
                  {confirmDelete.type === "product" ? "Obriši proizvod?" : "Obriši varijantu?"}
                </p>
                <p className="text-xs text-[#555] mt-0.5">Ova akcija se ne može poništiti</p>
              </div>
            </div>
            <p className="text-xs text-[#8A8A8A] mb-5">
              {confirmDelete.type === "product"
                ? "Brisanjem proizvoda brišu se i sve njegove varijante, cene i pravila."
                : "Brisanjem varijante se briše i njena istorija cena i upiti vezani za nju."
              }
              {" "}Alternativa je <strong className="text-[#E9E6D9]">deaktivacija</strong> - proizvod se sklanja sa sajta ali podaci ostaju.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-lg border border-[#2E2E2F] text-sm text-[#8A8A8A] hover:text-[#E9E6D9] hover:bg-[#2E2E2F] transition-colors"
              >
                Otkaži
              </button>
              <button
                onClick={handleConfirmedDelete}
                className="flex-1 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400 hover:bg-red-500/20 transition-colors font-semibold"
              >
                Obriši
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ── Shared UI components ───────────────────────────────────────────────────
const inputCls = "w-full bg-[#111112] border border-[#2E2E2F] rounded-lg px-3 py-2 text-sm text-[#E9E6D9] focus:outline-none focus:border-[#BF8E41]/60 transition-colors placeholder-[#3A3A3B]";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5">{label}</label>
      {hint && <p className="text-[11px] text-[#555] mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

function Drawer({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/60" onClick={onClose} />
      {/* Panel */}
      <div className="w-full max-w-md bg-[#1B1B1C] border-l border-[#2E2E2F] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2E2E2F]">
          <h2 className="text-sm font-semibold text-[#E9E6D9]">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#555] hover:text-[#E9E6D9] hover:bg-[#2E2E2F] transition-colors">
            <X size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
