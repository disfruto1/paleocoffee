import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SepeteEkle } from "@/components/SepeteEkle";
import { UrunGorseli } from "@/components/UrunGorseli";
import { KAVRUM, listeFiyati, stoktaYok } from "@/lib/bicim";
import { ayarlariGetir, urunGetir } from "@/lib/sunucu";

type Parametre = { params: Promise<{ id: string }> };

// Adres "/urun/12-etiyopya-yirgacheffe" bicimindedir, yalnizca bastaki numara kullanilir
const numara = (id: string) => id.split("-")[0];

export async function generateMetadata({ params }: Parametre): Promise<Metadata> {
  const urun = await urunGetir(numara((await params).id));
  if (!urun || urun === "hata") return { title: "Ürün" };
  return {
    title: urun.ad,
    description: urun.aciklama?.slice(0, 160) || `${urun.ad}: Paleo Coffee Ayvalık`,
    openGraph: urun.gorsel_url ? { images: [urun.gorsel_url] } : undefined,
  };
}

export default async function UrunSayfasi({ params }: Parametre) {
  const [urun, ayarlar] = await Promise.all([urunGetir(numara((await params).id)), ayarlariGetir()]);
  if (urun === null) notFound();
  if (urun === "hata") {
    return <p className="kap py-24 text-center text-soluk">Ürün şu an yüklenemedi. Biraz sonra tekrar deneyin.</p>;
  }
  const bilgiler = [
    ["Menşei", urun.mensei],
    ["İşleme", urun.isleme],
    ["Kavrum", urun.kavrum && (KAVRUM[urun.kavrum] || urun.kavrum)],
    ["Tat notları", urun.tat_notlari],
  ].filter(([, d]) => d) as [string, string][];
  const f = listeFiyati(urun);

  return (
    <div className="kap py-10">
      <Link href="/magaza" className="etiket text-soluk hover:text-vurgu">
        ← Tüm kahveler
      </Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2 lg:gap-16">
        <div className="aspect-square overflow-hidden bg-kum md:sticky md:top-32 md:self-start">
          <UrunGorseli urun={urun} />
        </div>
        <div>
          {urun.mensei && <p className="etiket text-vurgu">{urun.mensei}</p>}
          <h1 className="font-baslik mt-2 text-5xl leading-[1.1] font-semibold md:text-6xl">{urun.ad}</h1>
          {urun.aciklama && <p className="mt-5 whitespace-pre-line leading-relaxed text-soluk">{urun.aciklama}</p>}
          {bilgiler.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 border-l border-t border-murekkep text-sm">
              {bilgiler.map(([b, d]) => (
                <div key={b} className="border-b border-r border-murekkep p-4">
                  <dt className="etiket text-soluk">{b}</dt>
                  <dd className="mt-1 font-medium">{d}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="mt-8">
            <SepeteEkle urun={urun} ogutmeler={ayarlar?.ogutme_secenekleri || []} tukendi={stoktaYok(urun)} />
          </div>
          <p className="mt-6 text-sm text-soluk">
            Türkiye geneline kargo · Ayvalık içi teslimat · Kafeden teslim
            {ayarlar?.ucretsiz_teslimat_siniri && ` · ${Number(ayarlar.ucretsiz_teslimat_siniri).toLocaleString("tr-TR")} TL üzeri ücretsiz teslimat`}
          </p>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: urun.ad,
                description: urun.aciklama || undefined,
                image: urun.gorsel_url || undefined,
                offers: { "@type": "Offer", priceCurrency: "TRY", price: f.tutar, availability: stoktaYok(urun) ? "https://schema.org/OutOfStock" : "https://schema.org/InStock" },
              }).replace(/</g, "\\u003c"),
            }}
          />
        </div>
      </div>
    </div>
  );
}
