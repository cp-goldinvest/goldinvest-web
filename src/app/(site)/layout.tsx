import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {/* pt accounts for: ticker (h-9 = 36px) + main nav (h-16 = 64px mobile / h-20 = 80px desktop) */}
      <div className="pt-[100px] lg:pt-[116px]">
        {children}
      </div>
      <Footer />
    </>
  );
}
