import type { Metadata } from "next";
import { ICECEK, ICECEK_EKLERI, type MenuBolumu, YIYECEK, YIYECEK_NOTU } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menü",
  description: "Paleo Coffee Ayvalık menüsü: kahvaltı, bagel ve kruvasan sandviçler, bowl'lar, espresso bazlı içecekler, brew bar ve çaylar.",
};

function Bolumler({ bolumler }: { bolumler: MenuBolumu[] }) {
  return (
    <div className="grid gap-x-16 gap-y-12 md:grid-cols-2">
      {bolumler.map((b) => (
        <section key={b.baslik} className="break-inside-avoid">
          <h3 className="font-baslik border-b border-murekkep pb-2 text-2xl">{b.baslik}</h3>
          <ul className="mt-4 space-y-4">
            {b.urunler.map((u) => (
              <li key={u.ad}>
                <p className="font-medium">{u.ad}</p>
                {u.aciklama && <p className="mt-0.5 text-sm text-soluk">{u.aciklama}</p>}
                {u.ek && <p className="etiket mt-1 text-vurgu">{u.ek}</p>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default function Menu() {
  return (
    <div className="kap py-16">
      <h1 className="font-baslik border-b border-murekkep pb-4 text-6xl font-semibold md:text-8xl">Menü</h1>
      <p className="mt-3 text-soluk">Kafemizde geçerlidir. Güncel fiyatları kafemizde bulabilirsiniz.</p>
      <nav className="mt-6 flex gap-2">
        <a href="#yiyecek" className="dugme-ikincil py-2">Yiyecek</a>
        <a href="#icecek" className="dugme-ikincil py-2">İçecek</a>
      </nav>

      <h2 id="yiyecek" className="font-baslik mt-16 scroll-mt-32 text-4xl font-semibold text-vurgu md:text-5xl">Yiyecek</h2>
      <div className="mt-8"><Bolumler bolumler={YIYECEK} /></div>
      <p className="etiket mt-10 text-soluk">{YIYECEK_NOTU}</p>

      <h2 id="icecek" className="font-baslik mt-20 scroll-mt-32 text-4xl font-semibold text-vurgu md:text-5xl">İçecek</h2>
      <div className="mt-8"><Bolumler bolumler={ICECEK} /></div>
      <p className="etiket mt-10 text-soluk">{ICECEK_EKLERI}</p>
    </div>
  );
}
