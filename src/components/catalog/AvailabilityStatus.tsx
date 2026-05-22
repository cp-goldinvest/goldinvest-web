import { CheckCircle2, Clock, PackageX, Phone } from "lucide-react";

type Props = {
  onRequest: boolean;
  inStock: boolean;
  isPreorder: boolean;
  leadTimeWeeks: number | null;
  /** card = grid kartice, detail = stranica proizvoda */
  variant?: "card" | "detail";
};

export function AvailabilityStatus({
  onRequest,
  inStock,
  isPreorder,
  leadTimeWeeks,
  variant = "card",
}: Props) {
  const iconSize = variant === "card" ? 14 : 15;
  const showsInStock = inStock && !onRequest;

  if (onRequest) {
    return (
      <div className="flex items-center gap-1.5">
        <PackageX size={iconSize} className="shrink-0 text-red-600" aria-hidden />
        <span
          className={
            variant === "card"
              ? "text-xs font-medium text-red-700"
              : "font-medium text-red-700"
          }
          style={
            variant === "detail"
              ? { fontFamily: "var(--font-rethink), sans-serif", fontSize: 13.5 }
              : undefined
          }
        >
          Nije na stanju
        </span>
      </div>
    );
  }

  if (showsInStock) {
    return (
      <div className="flex items-center gap-1.5">
        <CheckCircle2 size={iconSize} className="shrink-0 text-green-500" aria-hidden />
        <span
          className={variant === "card" ? "text-xs text-[#464747]" : "font-medium"}
          style={
            variant === "detail"
              ? { fontFamily: "var(--font-rethink), sans-serif", fontSize: 13.5, color: "#16a34a" }
              : undefined
          }
        >
          {variant === "detail" ? "Na stanju - dostupno odmah" : "Na stanju"}
        </span>
      </div>
    );
  }

  if (isPreorder) {
    const weeks = leadTimeWeeks ?? "?";
    return (
      <div className="flex items-center gap-1.5">
        <Clock size={iconSize} className="shrink-0 text-[#BEAD87]" aria-hidden />
        <span
          className={variant === "card" ? "text-xs text-[#464747]" : "font-medium text-[#6B6B6B]"}
          style={
            variant === "detail"
              ? { fontFamily: "var(--font-rethink), sans-serif", fontSize: 13.5 }
              : undefined
          }
        >
          {variant === "detail" ? `Dostupno za ${weeks} nedelje` : `${weeks} ned.`}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Phone size={iconSize} className="shrink-0 text-[#BEAD87]" aria-hidden />
      <span
        className={variant === "card" ? "text-xs text-[#464747]" : "font-medium text-[#6B6B6B]"}
        style={
          variant === "detail"
            ? { fontFamily: "var(--font-rethink), sans-serif", fontSize: 13.5 }
            : undefined
        }
      >
        {variant === "detail" ? "Dostupno na upit" : "Na upit"}
      </span>
    </div>
  );
}
