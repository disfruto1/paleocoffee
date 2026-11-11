"use client";
import Link from "next/link";
import { kalemAnahtari, useSepet } from "@/components/Saglayicilar";
import { UrunGorseli } from "@/components/UrunGorseli";
import { fiyat, urunAdresi } from "@/lib/bicim";

export default function SepetSayfasi() {
  const { kalemler, toplam, adetDegistir, cikar } = useSepet();

  if (!kalemler.length) {
    return (
      <div className="kap py-28 text-center">
        <h1 className="font-baslik text-4xl">Sepetiniz boş</h1>
        <p className="mt-3 text-soluk">Kahvelerimize, ekipmanlara ve diğer ürünlerimize göz atın.</p>
        <Link href="/urunler" className="dugme mt-8">Ürünlere git</Link>
      </div>
    );
  }

  return (
    <div className="kap py-12">
      <h1 className="font-baslik text-4xl">Sepet</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <ul className="divide-y divide-cizgi border-y border-cizgi">
          {kalemler.map((k) => {
            const a = kalemAnahtari(k);
            return (
              <li key={a} className="flex gap-4 py-5">
                <Link href={urunAdresi({ id: k.urun_id, ad: k.ad })} className="h-24 w-20 shrink-0 overflow-hidden bg-kum">
                  <UrunGorseli urun={k} />
                </Link>
                <div className="flex flex-1 flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <p className="font-baslik text-lg">{k.ad}</p>
                    <p className="text-sm text-soluk">{[k.secenek_adi, k.ogutme].filter(Boolean).join(" · ")}</p>
                    <button className="mt-2 text-sm text-soluk underline underline-offset-4 hover:text-vurgu" onClick={() => cikar(a)}>
                      Kaldır
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
                    <div className="flex items-center border border-cizgi text-sm">
                      <button className="px-3 py-1.5" onClick={() => adetDegistir(a, k.adet - 1)} aria-label="Azalt">−</button>
                      <span className="w-6 text-center tabular-nums">{k.adet}</span>
                      <button className="px-3 py-1.5" onClick={() => adetDegistir(a, k.adet + 1)} aria-label="Arttır">+</button>
                    </div>
                    <p className="tabular-nums">{fiyat(Number(k.fiyat) * k.adet)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <aside className="h-fit bg-kum p-6">
          <div className="flex justify-between">
            <span>Ara toplam</span>
            <span className="tabular-nums">{fiyat(toplam)}</span>
          </div>
          <p className="mt-2 text-sm text-soluk">Teslimat ücreti bir sonraki adımda, seçtiğiniz yönteme göre eklenir.</p>
          <Link href="/odeme" className="dugme mt-6 w-full">Siparişi tamamla</Link>
          <Link href="/urunler" className="mt-3 block text-center text-sm underline underline-offset-4 hover:text-vurgu">Alışverişe devam et</Link>
        </aside>
      </div>
    </div>
  );
}
