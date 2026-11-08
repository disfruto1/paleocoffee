import Link from "next/link";
import { SITE } from "@/lib/site";

export function Alt() {
  return (
    <footer className="mt-24 bg-murekkep text-zemin">
      <div className="kap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-baslik text-2xl">Paleo Coffee</p>
          <p className="mt-3 text-sm text-zemin/70">{SITE.slogan}</p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-medium">Ziyaret</p>
          <p className="text-zemin/70">{SITE.adres}</p>
          {SITE.saatler.map((s) => (
            <p key={s.gun} className="text-zemin/70">
              {s.gun}: {s.saat}
            </p>
          ))}
        </div>
        <div className="text-sm">
          <p className="mb-3 font-medium">İletişim</p>
          <p className="text-zemin/70">{SITE.telefon}</p>
          <p className="text-zemin/70">{SITE.eposta}</p>
          <a href={SITE.instagram} className="text-zemin/70 hover:text-zemin" rel="noopener" target="_blank">
            Instagram
          </a>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <p className="mb-2 font-medium">Bilgi</p>
          <Link href="/sozlesmeler/teslimat-ve-iade" className="text-zemin/70 hover:text-zemin">Teslimat ve iade</Link>
          <Link href="/sozlesmeler/mesafeli-satis" className="text-zemin/70 hover:text-zemin">Mesafeli satış sözleşmesi</Link>
          <Link href="/sozlesmeler/on-bilgilendirme" className="text-zemin/70 hover:text-zemin">Ön bilgilendirme formu</Link>
          <Link href="/sozlesmeler/kvkk" className="text-zemin/70 hover:text-zemin">KVKK aydınlatma metni</Link>
        </div>
      </div>
      <div className="kap border-t border-zemin/15 py-5 text-xs text-zemin/50">© {new Date().getFullYear()} {SITE.tamAd}</div>
    </footer>
  );
}
