"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Clock,
  CheckCircle,
  Truck,
  PackageCheck,
  XCircle,
  Phone,
  Mail,
  MapPin,
  StickyNote,
  Hash,
  AlertTriangle,
} from "lucide-react";

type OrderStatus = "pending_payment" | "paid" | "shipped" | "delivered" | "cancelled";

type OrderItem = {
  id: string;
  variant_id: string | null;
  lager_item_id: string | null;
  product_name_snapshot: string;
  variant_name_snapshot: string | null;
  weight_g_snapshot: number;
  category_snapshot: string;
  quantity: number;
  unit_price_rsd: number;
  line_total_rsd: number;
  purchase_price_snapshot_rsd: number | null;
};

type Order = {
  id: string;
  order_number: number;
  site_id: number;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address_line: string;
  shipping_city: string;
  shipping_postal_code: string | null;
  shipping_country: string;
  customer_note: string | null;
  subtotal_rsd: number;
  shipping_rsd: number;
  total_rsd: number;
  payment_method: "bank_transfer" | "cash_on_delivery" | "online_card";
  payment_reference: string | null;
  shipping_carrier: string | null;
  shipping_tracking_number: string | null;
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  cancelled_reason: string | null;
  sites: { id: number; key: string; name: string } | null;
  order_items: OrderItem[];
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending_payment: { label: "Ceka uplatu", color: "text-amber-400 bg-amber-500/10 border-amber-500/20",   icon: Clock },
  paid:            { label: "Placeno",     color: "text-green-400 bg-green-500/10 border-green-500/20",  icon: CheckCircle },
  shipped:         { label: "Poslato",     color: "text-blue-400 bg-blue-500/10 border-blue-500/20",     icon: Truck },
  delivered:       { label: "Isporuceno",  color: "text-[#BF8E41] bg-[#BF8E41]/10 border-[#BF8E41]/25",  icon: PackageCheck },
  cancelled:       { label: "Otkazano",    color: "text-red-400 bg-red-500/10 border-red-500/20",        icon: XCircle },
};

const ALL_STATUSES: OrderStatus[] = ["pending_payment", "paid", "shipped", "delivered", "cancelled"];

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000 / 60);
  if (diff < 60) return `pre ${diff} min`;
  if (diff < 1440) return `pre ${Math.floor(diff / 60)}h`;
  return `pre ${Math.floor(diff / 1440)} dana`;
}

const STALE_PENDING_MS = 24 * 60 * 60 * 1000;

function isStalePending(o: Order): boolean {
  if (o.status !== "pending_payment") return false;
  return Date.now() - new Date(o.created_at).getTime() > STALE_PENDING_MS;
}

function formatRsd(n: number): string {
  return new Intl.NumberFormat("sr-RS").format(Math.round(n));
}

function formatWeight(g: number): string {
  if (g >= 1000) return `${g / 1000}kg`;
  if (Number.isInteger(g)) return `${g}g`;
  return `${g}g`;
}

export default function AdminPorudzbinePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"sve" | OrderStatus>("sve");
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) setOrders(await res.json());
    } catch {
      // silent - prikazi empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () => (filter === "sve" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  );

  const counts = useMemo(() => {
    const c: Record<OrderStatus | "sve", number> = {
      sve: orders.length, pending_payment: 0, paid: 0, shipped: 0, delivered: 0, cancelled: 0,
    };
    orders.forEach((o) => { c[o.status]++; });
    return c;
  }, [orders]);

  async function transition(orderId: string, action: string, payload?: Record<string, unknown>) {
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error ?? "Greska pri promeni statusa");
        return;
      }
      if (data.requires_manual_restock) {
        alert(data.message);
      }
      await load();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Mreza greska");
    }
  }

  async function handleConfirmPayment(o: Order) {
    if (!confirm(`Potvrdjujes da je uplata za #${o.order_number} stigla? Lager ce biti smanjen.`)) return;
    await transition(o.id, "confirm_payment");
  }

  async function handleMarkShipped(o: Order) {
    const carrier = prompt("Kurirska sluzba (npr. DExpress, AKS, Postanski paketi):", o.shipping_carrier ?? "");
    if (carrier === null) return;
    const trackingNumber = prompt("Broj posiljke (tracking):", o.shipping_tracking_number ?? "");
    if (trackingNumber === null) return;
    await transition(o.id, "mark_shipped", { carrier, tracking_number: trackingNumber });
  }

  async function handleMarkDelivered(o: Order) {
    if (!confirm(`Potvrdjujes da je porudzbina #${o.order_number} isporucena kupcu?`)) return;
    await transition(o.id, "mark_delivered");
  }

  async function handleCancel(o: Order) {
    const reason = prompt(`Razlog otkazivanja porudzbine #${o.order_number}:`, "");
    if (reason === null) return;
    await transition(o.id, "cancel", { reason });
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-[#E9E6D9]">Porudžbine</h1>
          <p className="text-sm text-[#555] mt-1">
            Sve porudžbine sa svih sajtova. Trenutno: <span className="text-[#BF8E41]">Zlatne Pločice</span> (GoldInvest koristi Upite).
          </p>
        </div>
        {counts.pending_payment > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-amber-400">
              {counts.pending_payment} čeka uplatu
            </span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["sve", ...ALL_STATUSES] as const).map((s) => {
          const label = s === "sve" ? "Sve" : STATUS_CONFIG[s].label;
          const isActive = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={[
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-2",
                isActive
                  ? "border-[#BF8E41] bg-[#BF8E41]/10 text-[#BF8E41]"
                  : "border-[#2E2E2F] text-[#555] hover:text-[#E9E6D9]",
              ].join(" ")}
            >
              <span>{label}</span>
              <span className={`text-[10px] ${isActive ? "text-[#BF8E41]/70" : "text-[#444]"}`}>
                {counts[s]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Error banner */}
      {actionError && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/25 flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-400">{actionError}</p>
          </div>
          <button onClick={() => setActionError(null)} className="text-red-400/60 hover:text-red-400">
            <XCircle size={14} />
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="py-16 text-center text-[#555] text-sm">Učitavanje…</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-[#555] text-sm">
          {filter === "sve"
            ? "Još nema porudžbina. Kad ZP sajt bude pušten u rad, ovde će se pojaviti prve porudžbine."
            : "Nema porudžbina u ovoj kategoriji."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              onConfirmPayment={() => handleConfirmPayment(o)}
              onMarkShipped={() => handleMarkShipped(o)}
              onMarkDelivered={() => handleMarkDelivered(o)}
              onCancel={() => handleCancel(o)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order: o,
  onConfirmPayment,
  onMarkShipped,
  onMarkDelivered,
  onCancel,
}: {
  order: Order;
  onConfirmPayment: () => void;
  onMarkShipped: () => void;
  onMarkDelivered: () => void;
  onCancel: () => void;
}) {
  const cfg = STATUS_CONFIG[o.status];
  const StatusIcon = cfg.icon;
  const stale = isStalePending(o);

  return (
    <div
      className={[
        "bg-[#1B1B1C] border rounded-xl p-5",
        stale ? "border-red-500/40 ring-1 ring-red-500/15" : "border-[#2E2E2F]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        {/* Header */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#E9E6D9]">
              <Hash size={12} className="text-[#555]" />
              {o.order_number}
            </span>
            <span className="text-[#555] text-xs">·</span>
            <span className="text-xs text-[#555]">{timeAgo(o.created_at)}</span>
            {o.sites && (
              <>
                <span className="text-[#555] text-xs">·</span>
                <span className="text-[10px] font-semibold text-[#BF8E41]/80 uppercase tracking-wider">
                  {o.sites.name}
                </span>
              </>
            )}
          </div>
          <p className="text-sm font-medium text-[#E9E6D9]">{o.customer_name}</p>

          {/* Contact */}
          <div className="flex flex-wrap gap-3 mt-1.5">
            <a href={`tel:${o.customer_phone}`} className="flex items-center gap-1.5 text-xs text-[#8A8A8A] hover:text-[#BF8E41] transition-colors">
              <Phone size={11} />
              {o.customer_phone}
            </a>
            <a href={`mailto:${o.customer_email}`} className="flex items-center gap-1.5 text-xs text-[#8A8A8A] hover:text-[#BF8E41] transition-colors">
              <Mail size={11} />
              {o.customer_email}
            </a>
          </div>

          {/* Address */}
          <div className="flex items-start gap-1.5 mt-1.5 text-xs text-[#777]">
            <MapPin size={11} className="mt-0.5 shrink-0" />
            <span>
              {o.shipping_address_line}, {o.shipping_city}
              {o.shipping_postal_code ? `, ${o.shipping_postal_code}` : ""}, {o.shipping_country}
            </span>
          </div>

          {o.customer_note && (
            <div className="flex items-start gap-1.5 mt-2 text-xs text-[#BF8E41]/70 bg-[#BF8E41]/5 border border-[#BF8E41]/15 rounded-lg px-3 py-1.5">
              <StickyNote size={11} className="mt-0.5 shrink-0" />
              <span>{o.customer_note}</span>
            </div>
          )}
        </div>

        {/* Status pill (+ stale badge) */}
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
            <StatusIcon size={10} />
            {cfg.label}
          </span>
          {stale && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border text-red-400 bg-red-500/10 border-red-500/30">
              <AlertTriangle size={9} />
              Starije od 24h
            </span>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="border-t border-[#2E2E2F] pt-3 space-y-1.5">
        {o.order_items.map((it) => (
          <div key={it.id} className="flex items-center justify-between gap-3 text-xs">
            <span className="text-[#8A8A8A] truncate">
              {it.product_name_snapshot}
              {it.variant_name_snapshot ? ` - ${it.variant_name_snapshot}` : ""}
              <span className="text-[#555]"> · {formatWeight(it.weight_g_snapshot)}</span>
              {it.quantity > 1 && <span className="text-[#555]"> × {it.quantity}</span>}
            </span>
            <span className="text-[#E9E6D9] tabular-nums whitespace-nowrap">
              {formatRsd(it.line_total_rsd)} RSD
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-[#2E2E2F] mt-3 pt-3 space-y-1">
        <div className="flex justify-between text-xs text-[#777]">
          <span>Stavke</span>
          <span className="tabular-nums">{formatRsd(o.subtotal_rsd)} RSD</span>
        </div>
        <div className="flex justify-between text-xs text-[#777]">
          <span>Dostava</span>
          <span className="tabular-nums">{formatRsd(o.shipping_rsd)} RSD</span>
        </div>
        <div className="flex justify-between text-sm font-semibold text-[#BF8E41] pt-1 border-t border-[#2E2E2F]/50">
          <span>Ukupno</span>
          <span className="tabular-nums">{formatRsd(o.total_rsd)} RSD</span>
        </div>
      </div>

      {/* Payment + Shipping meta */}
      {(o.payment_reference || o.shipping_carrier) && (
        <div className="mt-3 pt-3 border-t border-[#2E2E2F] grid grid-cols-2 gap-3 text-[11px] text-[#777]">
          <div>
            <p className="text-[10px] text-[#555] uppercase tracking-wider">Plaćanje</p>
            <p className="mt-0.5">{o.payment_method}</p>
            {o.payment_reference && <p className="text-[#8A8A8A]">Ref: {o.payment_reference}</p>}
          </div>
          {(o.shipping_carrier || o.shipping_tracking_number) && (
            <div>
              <p className="text-[10px] text-[#555] uppercase tracking-wider">Otprema</p>
              {o.shipping_carrier && <p className="mt-0.5">{o.shipping_carrier}</p>}
              {o.shipping_tracking_number && (
                <p className="text-[#8A8A8A]">#{o.shipping_tracking_number}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-[#2E2E2F] flex flex-wrap gap-2">
        {o.status === "pending_payment" && (
          <>
            <ActionBtn onClick={onConfirmPayment} variant="primary">Potvrdi uplatu</ActionBtn>
            <ActionBtn onClick={onCancel} variant="danger">Otkaži</ActionBtn>
          </>
        )}
        {o.status === "paid" && (
          <>
            <ActionBtn onClick={onMarkShipped} variant="primary">Označi poslato</ActionBtn>
            <ActionBtn onClick={onCancel} variant="danger">Otkaži</ActionBtn>
          </>
        )}
        {o.status === "shipped" && (
          <>
            <ActionBtn onClick={onMarkDelivered} variant="primary">Označi isporučeno</ActionBtn>
            <ActionBtn onClick={onCancel} variant="danger">Otkaži</ActionBtn>
          </>
        )}
        {(o.status === "delivered" || o.status === "cancelled") && (
          <p className="text-[10px] text-[#555]">
            {o.status === "cancelled" && o.cancelled_reason
              ? `Razlog otkazivanja: ${o.cancelled_reason}`
              : "Završeno"}
          </p>
        )}
      </div>
    </div>
  );
}

function ActionBtn({
  onClick,
  variant,
  children,
}: {
  onClick: () => void;
  variant: "primary" | "danger";
  children: React.ReactNode;
}) {
  const cls =
    variant === "primary"
      ? "bg-[#BF8E41]/15 border-[#BF8E41]/40 text-[#BF8E41] hover:bg-[#BF8E41]/25"
      : "bg-red-500/10 border-red-500/25 text-red-400 hover:bg-red-500/15";
  return (
    <button
      onClick={onClick}
      className={["px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors", cls].join(" ")}
    >
      {children}
    </button>
  );
}
