import Link from "next/link";
import { SITE } from "@/lib/site";

export function Alt() {
  return (
    <footer className="mt-24 bg-murekkep text-zemin">
      <div className="kap border-b border-zemin/15 py-14">
        <p className="font-baslik text-[clamp(3rem,12vw,9rem)] leading-[0.95] font-semibold">
          Paleo<span className="text-vurgu">.</span> Coffee
        </p>
        <p className="etiket mt-4 text-zemin/60">{SITE.slogan}</p>
      </div>
      <div className="kap grid gap-10 py-12 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="etiket mb-4 text-zemin/50">Ziyaret</p>
          <p className="text-zemin/80">{SITE.adres}</p>
          {SITE.saatler.map((s) => (
            <p key={s.gun} className="text-zemin/80">{s.gun}: {s.saat}</p>
          ))}
        </div>
        <div>
          <p className="etiket mb-4 text-zemin/50">İletişim</p>
          <p className="text-zemin/80">{SITE.telefon}</p>
          <p className="text-zemin/80">{SITE.eposta}</p>
          <a href={SITE.instagram} className="text-zemin/80 underline underline-offset-4 hover:text-zemin" rel="noopener" target="_blank">Instagram</a>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="etiket mb-3 text-zemin/50">Alışveriş</p>
          <Link href="/magaza" className="text-zemin/80 hover:text-zemin">Kahveler</Link>
          <Link href="/hesabim" className="text-zemin/80 hover:text-zemin">Hesabım</Link>
          <Link href="/sozlesmeler/teslimat-ve-iade" className="text-zemin/80 hover:text-zemin">Teslimat ve iade</Link>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="etiket mb-3 text-zemin/50">Yasal</p>
          <Link href="/sozlesmeler/mesafeli-satis" className="text-zemin/80 hover:text-zemin">Mesafeli satış sözleşmesi</Link>
          <Link href="/sozlesmeler/on-bilgilendirme" className="text-zemin/80 hover:text-zemin">Ön bilgilendirme formu</Link>
          <Link href="/sozlesmeler/kvkk" className="text-zemin/80 hover:text-zemin">KVKK aydınlatma metni</Link>
        </div>
      </div>
      <div className="kap etiket border-t border-zemin/15 py-5 text-zemin/40">© {new Date().getFullYear()} {SITE.tamAd}</div>
    </footer>
  );
}
