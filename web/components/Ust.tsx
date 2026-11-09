"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useOturum, useSepet } from "./Saglayicilar";

const BAGLANTILAR = [
  { href: "/magaza", ad: "Kahveler" },
  { href: "/menu", ad: "Menü" },
  { href: "/hikayemiz", ad: "Hikâyemiz" },
  { href: "/iletisim", ad: "Ziyaret" },
];

export function Ust() {
  const yol = usePathname();
  const { adet } = useSepet();
  const { kullanici } = useOturum();
  const [acik, setAcik] = useState(false);
  const hesap = kullanici ? { href: "/hesabim", ad: "Hesabım" } : { href: "/giris", ad: "Giriş" };

  return (
    <header className="sticky top-0 z-30">
      <p className="etiket bg-murekkep py-2 text-center text-zemin/80">
        Ayvalık içi aynı gün teslimat · Türkiye geneline kargo · Salı hariç her gün 08:30–18:00
      </p>
      <div className="border-b border-murekkep bg-zemin">
        <div className="kap flex h-16 items-center justify-between gap-6">
          <Link href="/" className="font-baslik text-2xl font-semibold tracking-wide" onClick={() => setAcik(false)}>
            Paleo<span className="text-vurgu">.</span>
          </Link>
          <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.12em] md:flex">
            {BAGLANTILAR.map((b) => (
              <Link key={b.href} href={b.href} className={`py-1 ${yol.startsWith(b.href) ? "border-b-2 border-vurgu" : "hover:text-vurgu"}`}>
                {b.ad}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-5 text-xs font-semibold uppercase tracking-[0.12em]">
            {kullanici?.rol === "yonetici" && (
              <Link href="/yonetim" className="hidden hover:text-vurgu lg:inline">Yönetim</Link>
            )}
            <Link href={hesap.href} className="hidden hover:text-vurgu sm:inline">{hesap.ad}</Link>
            <Link href="/sepet" className="bg-murekkep px-4 py-2.5 text-zemin hover:bg-vurgu" aria-label={`Sepet, ${adet} ürün`}>
              Sepet <span className="tabular-nums">({adet})</span>
            </Link>
            <button className="md:hidden" onClick={() => setAcik(!acik)} aria-expanded={acik} aria-label="Menüyü aç">
              <span className="block h-0.5 w-6 bg-murekkep" />
              <span className="mt-1.5 block h-0.5 w-6 bg-murekkep" />
            </button>
          </div>
        </div>
        {acik && (
          <nav className="kap flex flex-col border-t border-cizgi pb-4 md:hidden">
            {[...BAGLANTILAR, hesap, ...(kullanici?.rol === "yonetici" ? [{ href: "/yonetim", ad: "Yönetim" }] : [])].map((b) => (
              <Link key={b.href} href={b.href} className="font-baslik border-b border-cizgi py-3 text-2xl" onClick={() => setAcik(false)}>
                {b.ad}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
