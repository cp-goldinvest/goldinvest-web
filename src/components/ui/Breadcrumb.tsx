import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href: string;
};

type Props = {
  items: BreadcrumbItem[];
  variant?: "dark" | "light";
};

export function Breadcrumb({ items, variant = "dark" }: Props) {
  const isLight = variant === "light";
  const linkColor = isLight ? "text-[#6B6B6B]" : "text-[#8A8A8A]";
  const currentColor = isLight ? "text-[#1B1B1C]" : "text-[#E9E6D9]";

  return (
    <nav aria-label="Breadcrumb">
      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: items.map((item, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: item.label,
              item: `https://goldinvest.rs${item.href}`,
            })),
          }),
        }}
      />

      <ol className={`flex items-center flex-wrap gap-1.5 text-xs ${linkColor}`}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={12} className="text-[#3A3A3B]" />}
              {isLast ? (
                <span className={currentColor} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#BF8E41] transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
