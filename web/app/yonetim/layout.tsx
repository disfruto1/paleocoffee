"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGirisGerekli, Yukleniyor } from "@/components/ortak";

const SEKMELER = [
  { href: "/yonetim", ad: "Özet" },
  { href: "/yonetim/siparisler", ad: "Siparişler" },
  { href: "/yonetim/urunler", ad: "Ürünler" },
  { href: "/yonetim/kategoriler", ad: "Kategoriler" },
];

export default function YonetimYerlesim({ children }: { children: React.ReactNode }) {
  const yonetici = useGirisGerekli("yonetici");
  const yol = usePathname();
  if (!yonetici) return <Yukleniyor />;
  return (
    <div className="kap py-10">
      <nav className="mb-8 flex gap-1 overflow-x-auto border-b border-cizgi">
        {SEKMELER.map((s) => {
          const aktif = s.href === "/yonetim" ? yol === s.href : yol.startsWith(s.href);
          return (
            <Link key={s.href} href={s.href} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm ${aktif ? "border-vurgu text-vurgu" : "border-transparent hover:text-vurgu"}`}>
              {s.ad}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
