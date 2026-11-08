"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useOturum, useSepet } from "./Saglayicilar";

const BAGLANTILAR = [
  { href: "/magaza", ad: "Mağaza" },
  { href: "/menu", ad: "Menü" },
  { href: "/hikayemiz", ad: "Hikâyemiz" },
  { href: "/iletisim", ad: "Ziyaret" },
];

export function Ust() {
  const yol = usePathname();
  const { adet } = useSepet();
  const { kullanici } = useOturum();
  const [acik, setAcik] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-cizgi bg-zemin/95 backdrop-blur">
      <div className="kap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-baslik text-xl tracking-tight" onClick={() => setAcik(false)}>
          Paleo <span className="text-vurgu">Coffee</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {BAGLANTILAR.map((b) => (
            <Link key={b.href} href={b.href} className={yol.startsWith(b.href) ? "text-vurgu" : "hover:text-vurgu"}>
              {b.ad}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-sm">
          {kullanici?.rol === "yonetici" && (
            <Link href="/yonetim" className="hidden hover:text-vurgu sm:inline">
              Yönetim
            </Link>
          )}
          <Link href={kullanici ? "/hesabim" : "/giris"} className="hidden hover:text-vurgu sm:inline">
            {kullanici ? "Hesabım" : "Giriş"}
          </Link>
          <Link href="/sepet" className="rounded-full bg-murekkep px-4 py-2 text-zemin hover:bg-vurgu" aria-label={`Sepet, ${adet} ürün`}>
            Sepet{adet > 0 && <span className="ml-1.5 tabular-nums">({adet})</span>}
          </Link>
          <button className="md:hidden" onClick={() => setAcik(!acik)} aria-expanded={acik} aria-label="Menüyü aç">
            <span className="block h-0.5 w-5 bg-murekkep" />
            <span className="mt-1.5 block h-0.5 w-5 bg-murekkep" />
          </button>
        </div>
      </div>
      {acik && (
        <nav className="kap flex flex-col gap-1 border-t border-cizgi pb-4 pt-2 md:hidden">
          {[...BAGLANTILAR, { href: kullanici ? "/hesabim" : "/giris", ad: kullanici ? "Hesabım" : "Giriş yap" }]
            .concat(kullanici?.rol === "yonetici" ? [{ href: "/yonetim", ad: "Yönetim" }] : [])
            .map((b) => (
              <Link key={b.href} href={b.href} className="py-2" onClick={() => setAcik(false)}>
                {b.ad}
              </Link>
            ))}
        </nav>
      )}
    </header>
  );
}
