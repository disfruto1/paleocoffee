"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Hata, useGirisGerekli, Yukleniyor } from "@/components/ortak";
import { useSepet } from "@/components/Saglayicilar";
import { api } from "@/lib/api";
import { fiyat } from "@/lib/bicim";
import { kartlaOde, teslimatUcreti } from "@/lib/odeme";
import type { Adres, Ayarlar, Siparis, TeslimatYontemi } from "@/lib/types";

const YENI = -1;

export default function Odeme() {
  const kullanici = useGirisGerekli();
  const sepet = useSepet();
  const router = useRouter();
  const [ayarlar, setAyarlar] = useState<Ayarlar | null>(null);
  const [adresler, setAdresler] = useState<Adres[]>([]);
  const [yontem, setYontem] = useState<TeslimatYontemi | null>(null);
  const [adresId, setAdresId] = useState<number>(YENI);
  const [yeniAdres, setYeniAdres] = useState("");
  const [adresiKaydet, setAdresiKaydet] = useState(true);
  const [not, setNot] = useState("");
  const [odemeTuru, setOdemeTuru] = useState<"kart" | "havale">("kart");
  const [telefon, setTelefon] = useState("");
  const [onay, setOnay] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [bekle, setBekle] = useState(false);

  useEffect(() => {
    if (!kullanici) return;
    setTelefon(kullanici.telefon || "");
    Promise.all([api<Ayarlar>("/ayarlar"), api<Adres[]>("/adresler")])
      .then(([a, ad]) => {
        setAyarlar(a);
        setYontem(a.teslimat[0]?.yontem ?? null);
        setOdemeTuru(a.kart_odeme ? "kart" : "havale");
        setAdresler(ad);
        if (ad.length) setAdresId(ad[0].id);
      })
      .catch((e) => setHata(e.message));
  }, [kullanici]);

  if (!kullanici || (!ayarlar && !hata)) return <Yukleniyor />;
  if (!sepet.kalemler.length && !bekle) {
    return (
      <div className="kap py-28 text-center">
        <h1 className="font-baslik text-3xl">Sepetiniz boş</h1>
        <Link href="/magaza" className="dugme mt-6">Mağazaya git</Link>
      </div>
    );
  }

  const secili = ayarlar?.teslimat.find((t) => t.yontem === yontem);
  const ucret = secili ? teslimatUcreti(secili.ucret, sepet.toplam, ayarlar!.ucretsiz_teslimat_siniri) : 0;
  const adresGerekli = yontem === "kargo" || yontem === "ayvalik";
  const odemeVar = ayarlar?.kart_odeme || !!ayarlar?.odeme_bilgisi;

  async function siparisVer(e: React.FormEvent) {
    e.preventDefault();
    if (!yontem) return;
    setHata(null);
    let adres: string | null = null;
    if (adresGerekli) {
      adres = adresId === YENI ? yeniAdres.trim() : adresler.find((a) => a.id === adresId)?.adres || "";
      if (adres.length < 10) {
        setHata("Lütfen açık adresinizi yazın (mahalle, sokak, no, ilçe / il).");
        return;
      }
    }
    setBekle(true);
    try {
      if (adresGerekli && adresId === YENI && adresiKaydet) {
        await api("/adresler", { json: { baslik: adresler.length ? "Yeni adres" : "Ev", adres } }).catch(() => undefined);
      }
      const s = await api<Siparis>("/siparisler", {
        json: {
          teslimat_yontemi: yontem,
          teslimat_adresi: adres,
          siparis_notu: not.trim() || null,
          kalemler: sepet.kalemler.map((k) => ({ urun_id: k.urun_id, secenek_id: k.secenek_id, ogutme: k.ogutme, adet: k.adet })),
        },
      });
      sepet.bosalt();
      if (odemeTuru === "kart") {
        try {
          await kartlaOde(s.id, telefon);
          return;
        } catch (err) {
          router.replace(`/hesabim/siparis/${s.id}?hata=${encodeURIComponent((err as Error).message)}`);
          return;
        }
      }
      router.replace(`/hesabim/siparis/${s.id}?yeni=1`);
    } catch (err) {
      setHata((err as Error).message);
      setBekle(false);
    }
  }

  return (
    <form onSubmit={siparisVer} className="kap grid gap-10 py-12 lg:grid-cols-[1fr_24rem]">
      <div className="space-y-10">
        <h1 className="font-baslik text-4xl">Siparişi tamamla</h1>
        <Hata mesaj={hata} />

        <section>
          <h2 className="mb-4 font-baslik text-2xl">Teslimat</h2>
          <div className="space-y-2">
            {ayarlar?.teslimat.map((t) => {
              const u = teslimatUcreti(t.ucret, sepet.toplam, ayarlar.ucretsiz_teslimat_siniri);
              return (
                <label key={t.yontem} className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 ${yontem === t.yontem ? "border-murekkep bg-white" : "border-cizgi"}`}>
                  <span className="flex items-center gap-3">
                    <input type="radio" name="yontem" checked={yontem === t.yontem} onChange={() => setYontem(t.yontem)} />
                    {t.ad}
                  </span>
                  <span className="text-sm tabular-nums">{u === 0 ? "Ücretsiz" : fiyat(u)}</span>
                </label>
              );
            })}
          </div>
          {ayarlar?.ucretsiz_teslimat_siniri && ucret > 0 && (
            <p className="mt-2 text-sm text-soluk">{fiyat(ayarlar.ucretsiz_teslimat_siniri)} ve üzeri siparişlerde teslimat ücretsiz.</p>
          )}
          {yontem === "magazadan" && <p className="mt-3 text-sm text-soluk">Siparişiniz hazır olduğunda Hesabım sayfasında &quot;Teslime hazır&quot; görünür.</p>}
          {yontem === "ayvalik" && <p className="mt-3 text-sm text-soluk">Yalnızca Ayvalık ilçesi sınırları içindeki adreslere teslim edilir.</p>}
        </section>

        {adresGerekli && (
          <section>
            <h2 className="mb-4 font-baslik text-2xl">Adres</h2>
            <div className="space-y-2">
              {adresler.map((a) => (
                <label key={a.id} className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${adresId === a.id ? "border-murekkep bg-white" : "border-cizgi"}`}>
                  <input type="radio" name="adres" checked={adresId === a.id} onChange={() => setAdresId(a.id)} className="mt-1" />
                  <span>
                    <span className="font-medium">{a.baslik}</span>
                    <span className="block text-sm text-soluk">{a.adres}</span>
                  </span>
                </label>
              ))}
              {adresler.length > 0 && (
                <label className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${adresId === YENI ? "border-murekkep bg-white" : "border-cizgi"}`}>
                  <input type="radio" name="adres" checked={adresId === YENI} onChange={() => setAdresId(YENI)} />
                  Yeni adres
                </label>
              )}
            </div>
            {adresId === YENI && (
              <div className="mt-3 space-y-2">
                <textarea value={yeniAdres} onChange={(e) => setYeniAdres(e.target.value)} rows={3} maxLength={500} required placeholder="Mahalle, sokak, bina ve daire no, ilçe / il" className="girdi" />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={adresiKaydet} onChange={(e) => setAdresiKaydet(e.target.checked)} />
                  Bu adresi kaydet
                </label>
              </div>
            )}
          </section>
        )}

        <section>
          <h2 className="mb-4 font-baslik text-2xl">Ödeme</h2>
          {!odemeVar && <p className="text-soluk">Online ödeme şu an kapalı. Sipariş için lütfen bizimle iletişime geçin.</p>}
          <div className="space-y-2">
            {ayarlar?.kart_odeme && (
              <label className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${odemeTuru === "kart" ? "border-murekkep bg-white" : "border-cizgi"}`}>
                <input type="radio" name="odeme" checked={odemeTuru === "kart"} onChange={() => setOdemeTuru("kart")} />
                Kredi / banka kartı <span className="text-sm text-soluk">(PayTR güvenli ödeme)</span>
              </label>
            )}
            {ayarlar?.odeme_bilgisi && (
              <label className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${odemeTuru === "havale" ? "border-murekkep bg-white" : "border-cizgi"}`}>
                <input type="radio" name="odeme" checked={odemeTuru === "havale"} onChange={() => setOdemeTuru("havale")} />
                Havale / EFT
              </label>
            )}
          </div>
          {odemeTuru === "kart" && ayarlar?.kart_odeme && (
            <label className="mt-3 block">
              <span className="mb-1 block text-sm">Telefon</span>
              <input type="tel" required value={telefon} onChange={(e) => setTelefon(e.target.value)} pattern="\+?[0-9][0-9 ()\-]{9,19}" placeholder="05xx xxx xx xx" autoComplete="tel" className="girdi" />
            </label>
          )}
          {odemeTuru === "havale" && ayarlar?.odeme_bilgisi && <p className="mt-3 rounded-xl bg-kum p-4 text-sm">{ayarlar.odeme_bilgisi}</p>}
        </section>

        <section>
          <label className="block">
            <span className="mb-1 block text-sm">Sipariş notu <span className="text-soluk">(isteğe bağlı)</span></span>
            <textarea value={not} onChange={(e) => setNot(e.target.value)} rows={2} maxLength={500} className="girdi" placeholder="Örn. kafeden cumartesi alacağım" />
          </label>
        </section>
      </div>

      <aside className="h-fit space-y-4 rounded-2xl bg-kum p-6 lg:sticky lg:top-24">
        <h2 className="font-baslik text-xl">Sipariş özeti</h2>
        <ul className="space-y-3 text-sm">
          {sepet.kalemler.map((k) => (
            <li key={`${k.urun_id}:${k.secenek_id}:${k.ogutme}`} className="flex justify-between gap-3">
              <span>
                {k.adet} × {k.ad}
                <span className="block text-soluk">{[k.secenek_adi, k.ogutme].filter(Boolean).join(" · ")}</span>
              </span>
              <span className="tabular-nums">{fiyat(Number(k.fiyat) * k.adet)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t border-cizgi pt-4 text-sm">
          <div className="flex justify-between"><span>Ara toplam</span><span className="tabular-nums">{fiyat(sepet.toplam)}</span></div>
          <div className="flex justify-between"><span>Teslimat</span><span className="tabular-nums">{ucret === 0 ? "Ücretsiz" : fiyat(ucret)}</span></div>
          <div className="flex justify-between pt-2 text-base font-medium"><span>Toplam</span><span className="tabular-nums">{fiyat(sepet.toplam + ucret)}</span></div>
        </div>
        <label className="flex gap-3 text-xs text-soluk">
          <input type="checkbox" checked={onay} onChange={(e) => setOnay(e.target.checked)} required className="mt-0.5" />
          <span>
            <Link href="/sozlesmeler/on-bilgilendirme" target="_blank" className="underline">Ön bilgilendirme formunu</Link> ve{" "}
            <Link href="/sozlesmeler/mesafeli-satis" target="_blank" className="underline">mesafeli satış sözleşmesini</Link> okudum, onaylıyorum.
          </span>
        </label>
        <button className="dugme w-full" disabled={bekle || !yontem || !odemeVar || !onay}>
          {bekle ? "Bekleyin…" : odemeTuru === "kart" ? "Ödemeye geç" : "Siparişi ver"}
        </button>
      </aside>
    </form>
  );
}
