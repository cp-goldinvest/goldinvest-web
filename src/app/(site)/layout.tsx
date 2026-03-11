import { Header } from "@/components/layout/Header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {/* pt accounts for: phone bar (h-9) + main nav (h-16 mobile / h-20 desktop) + live ticker (h-8) */}
      <div className="pt-[128px] lg:pt-[148px]">
        {children}
      </div>
    </>
  );
}
