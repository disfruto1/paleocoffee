"use client";
// Uye (Hesabim) ve misafir siparis sayfalarinin ortak gorunumu.
import Link from "next/link";
import { useEffect, useState } from "react";
import { Hata, Yukleniyor } from "@/components/ortak";
import { api } from "@/lib/api";
import { durumAdi, fiyat, TESLIMAT_ADLARI, tarih } from "@/lib/bicim";
import { kodBasligi } from "@/lib/misafir";
import { kartlaOde } from "@/lib/odeme";
import type { Ayarlar, Siparis } from "@/lib/types";

type Ozellikler = {
  id: string;
  misafirKodu?: string; // varsa misafir uclari kullanilir
  telefon?: string;
  yeni?: boolean;
  ilkHata?: string | null;
  geri?: { href: string; ad: string };
};

export function SiparisDetay({ id, misafirKodu, telefon: ilkTelefon = "", yeni, ilkHata = null, geri }: Ozellikler) {
  const [s, setS] = useState<Siparis | null>(null);
  const [ayarlar, setAyarlar] = useState<Ayarlar | null>(null);
  const [telefon, setTelefon] = useState(ilkTelefon);
  const [hata, setHata] = useState<string | null>(ilkHata);
  const [bekle, setBekle] = useState(false);
  const basliklar = misafirKodu ? kodBasligi(misafirKodu) : undefined;
  const taban = misafirKodu ? `/misafir/siparisler/${id}` : `/siparisler/${id}`;

  useEffect(() => {
    Promise.all([api<Siparis>(taban, { basliklar }), api<Ayarlar>("/ayarlar")])
      .then(([sp, a]) => { setS(sp); setAyarlar(a); })
      .catch((e) => setHata(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taban, misafirKodu]);

  if (!s && !hata) return <Yukleniyor />;
  if (!s) return <div className="kap max-w-3xl py-24"><Hata mesaj={hata} /></div>;

  async function ode(e: React.FormEvent) {
    e.preventDefault();
    setBekle(true);
    setHata(null);
    try {
      await kartlaOde(s!.id, telefon, misafirKodu);
    } catch (err) {
      setHata((err as Error).message);
      setBekle(false);
    }
  }

  async function iptal() {
    if (!confirm("Sipariş iptal edilsin mi?")) return;
    try {
      setS(await api<Siparis>(`${taban}/iptal`, { method: "POST", basliklar }));
    } catch (err) {
      setHata((err as Error).message);
    }
  }

  const araToplam = Number(s.toplam_tutar) - Number(s.teslimat_ucreti);
  const bekliyor = s.durum === "odeme_bekliyor";

  return (
    <div className="kap max-w-3xl py-12">
      {geri && <Link href={geri.href} className="etiket text-soluk hover:text-vurgu">← {geri.ad}</Link>}
      {yeni && (
        <div className="mt-6 border border-zeytin bg-zeytin/10 p-4 text-zeytin">
          <p className="font-medium">Siparişiniz alındı, teşekkürler!</p>
          {misafirKodu && (
            <p className="mt-1 text-sm">Sipariş bilgileri e-postanıza gönderildi. Siparişinizi o e-postadaki bağlantıdan veya bu sayfanın adresinden izleyebilirsiniz.</p>
          )}
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-baslik text-5xl font-semibold">Sipariş #{s.id}</h1>
        <span className="etiket bg-murekkep px-3 py-2 text-zemin">{durumAdi(s.durum, s.teslimat_yontemi)}</span>
      </div>
      <p className="mt-1 text-sm text-soluk">{tarih(s.olusturulma_tarihi)}</p>
      <div className="mt-6"><Hata mesaj={hata} /></div>

      {bekliyor && (
        <section className="mt-6 space-y-4 border border-vurgu bg-white p-6">
          <h2 className="font-baslik text-2xl">Ödeme bekleniyor</h2>
          {ayarlar?.kart_odeme && (
            <form onSubmit={ode} className="flex flex-wrap gap-3">
              <input type="tel" required value={telefon} onChange={(e) => setTelefon(e.target.value)} pattern="\+?[0-9][0-9 ()\-]{9,19}" placeholder="Telefon" className="girdi max-w-56" />
              <button className="dugme" disabled={bekle}>{bekle ? "Bekleyin…" : "Kartla öde"}</button>
            </form>
          )}
          {s.odeme_yontemi === "havale" && ayarlar?.odeme_bilgisi && (
            <p className="text-sm text-soluk">
              {ayarlar.odeme_bilgisi} <strong className="text-murekkep">Açıklamaya yazılacak sipariş no: {s.id}</strong>
            </p>
          )}
          <button onClick={iptal} className="text-sm text-soluk underline underline-offset-4 hover:text-vurgu">Siparişi iptal et</button>
        </section>
      )}

      <section className="mt-8">
        <ul className="divide-y divide-cizgi border-y border-murekkep">
          {s.kalemler.map((k) => (
            <li key={k.id} className="flex justify-between gap-4 py-4">
              <span>
                {k.adet} × {k.urun_adi}
                <span className="block text-sm text-soluk">{[k.secenek_adi, k.ogutme].filter(Boolean).join(" · ")}</span>
              </span>
              <span className="tabular-nums">{fiyat(Number(k.birim_fiyat) * k.adet)}</span>
            </li>
          ))}
        </ul>
        <div className="ml-auto mt-4 max-w-xs space-y-1 text-sm">
          <div className="flex justify-between"><span>Ara toplam</span><span className="tabular-nums">{fiyat(araToplam)}</span></div>
          <div className="flex justify-between"><span>{TESLIMAT_ADLARI[s.teslimat_yontemi]}</span><span className="tabular-nums">{Number(s.teslimat_ucreti) === 0 ? "Ücretsiz" : fiyat(s.teslimat_ucreti)}</span></div>
          <div className="flex justify-between pt-2 text-base font-medium"><span>Toplam</span><span className="tabular-nums">{fiyat(s.toplam_tutar)}</span></div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 text-sm sm:grid-cols-2">
        <div>
          <h2 className="etiket mb-2 text-soluk">Teslimat</h2>
          <p>{s.teslimat_adresi || "Kafeden teslim alınacak"}</p>
          {s.takip_no && <p className="mt-2">Kargo takip no: <strong>{s.takip_no}</strong></p>}
        </div>
        {s.siparis_notu && (
          <div>
            <h2 className="etiket mb-2 text-soluk">Not</h2>
            <p>{s.siparis_notu}</p>
          </div>
        )}
      </section>
    </div>
  );
}
