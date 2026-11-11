import Link from "next/link";
import { SITE } from "@/lib/site";

export function Alt() {
  return (
    <footer className="mt-24 bg-murekkep text-zemin">
      <div className="kap border-b border-zemin/15 py-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/marka/logo-tam-acik.png" alt={`Paleo Coffee & More. ${SITE.slogan}`} width={900} height={601} loading="lazy" className="h-auto w-full max-w-md" />
      </div>
      <div className="kap grid gap-10 py-12 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-3">
          <p className="etiket text-zemin/50">İletişim</p>
          <p className="text-zemin/80">{SITE.adres}</p>
          <div>
            {SITE.saatler.map((s) => (
              <p key={s.gun} className="text-zemin/80">{s.gun}: {s.saat}</p>
            ))}
          </div>
          <div>
          <a href={SITE.telefonBaglantisi} className="block text-zemin/80 hover:text-zemin">{SITE.telefon}</a>
          {SITE.eposta && <a href={`mailto:${SITE.eposta}`} className="block text-zemin/80 hover:text-zemin">{SITE.eposta}</a>}
          {SITE.instagram && <a href={SITE.instagram} className="block text-zemin/80 underline underline-offset-4 hover:text-zemin" rel="noopener" target="_blank">{SITE.instagramAdi}</a>}
          <a href={SITE.haritaAdresi} className="block text-zemin/80 underline underline-offset-4 hover:text-zemin" rel="noopener" target="_blank">Google Haritalar</a>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="etiket mb-3 text-zemin/50">Alışveriş</p>
          <Link href="/urunler" className="text-zemin/80 hover:text-zemin">Ürünler</Link>
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
