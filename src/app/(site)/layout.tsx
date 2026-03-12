import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {/* pt accounts for: top bar (h-10=40px) + main nav (h-16=64px mobile / h-20=80px desktop) + ticker (h-9=36px) */}
      <div className="pt-[140px] lg:pt-[156px]">
        {children}
      </div>
      <Footer />
    </>
  );
}
