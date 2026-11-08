"use client";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Hata, useGirisGerekli, Yukleniyor } from "@/components/ortak";
import { api } from "@/lib/api";
import { durumAdi, fiyat, TESLIMAT_ADLARI, tarih } from "@/lib/bicim";
import { kartlaOde } from "@/lib/odeme";
import type { Ayarlar, Siparis } from "@/lib/types";

function SiparisDetay() {
  const kullanici = useGirisGerekli();
  const { id } = useParams<{ id: string }>();
  const q = useSearchParams();
  const [s, setS] = useState<Siparis | null>(null);
  const [ayarlar, setAyarlar] = useState<Ayarlar | null>(null);
  const [telefon, setTelefon] = useState("");
  const [hata, setHata] = useState<string | null>(q.get("hata"));
  const [bekle, setBekle] = useState(false);

  useEffect(() => {
    if (!kullanici) return;
    setTelefon(kullanici.telefon || "");
    Promise.all([api<Siparis>(`/siparisler/${id}`), api<Ayarlar>("/ayarlar")])
      .then(([sp, a]) => { setS(sp); setAyarlar(a); })
      .catch((e) => setHata(e.message));
  }, [kullanici, id]);

  if (!kullanici || (!s && !hata)) return <Yukleniyor />;
  if (!s) return <div className="kap py-24"><Hata mesaj={hata} /></div>;

  async function ode(e: React.FormEvent) {
    e.preventDefault();
    setBekle(true);
    setHata(null);
    try {
      await kartlaOde(s!.id, telefon);
    } catch (err) {
      setHata((err as Error).message);
      setBekle(false);
    }
  }

  async function iptal() {
    if (!confirm("Sipariş iptal edilsin mi?")) return;
    try {
      setS(await api<Siparis>(`/siparisler/${s!.id}/iptal`, { method: "POST" }));
    } catch (err) {
      setHata((err as Error).message);
    }
  }

  const araToplam = Number(s.toplam_tutar) - Number(s.teslimat_ucreti);
  const bekliyor = s.durum === "odeme_bekliyor";

  return (
    <div className="kap max-w-3xl py-12">
      <Link href="/hesabim" className="text-sm text-soluk hover:text-vurgu">← Hesabım</Link>
      {q.get("yeni") && <p className="mt-6 bg-zeytin/15 p-4 text-zeytin">Siparişiniz alındı, teşekkürler!</p>}
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-baslik text-4xl">Sipariş #{s.id}</h1>
        <span className="bg-kum px-4 py-1.5 text-sm">{durumAdi(s.durum, s.teslimat_yontemi)}</span>
      </div>
      <p className="mt-1 text-sm text-soluk">{tarih(s.olusturulma_tarihi)}</p>
      <div className="mt-6"><Hata mesaj={hata} /></div>

      {bekliyor && (
        <section className="mt-6 space-y-4 border border-vurgu/30 bg-white p-6">
          <h2 className="font-baslik text-xl">Ödeme bekleniyor</h2>
          {ayarlar?.kart_odeme && (
            <form onSubmit={ode} className="flex flex-wrap gap-3">
              <input type="tel" required value={telefon} onChange={(e) => setTelefon(e.target.value)} pattern="\+?[0-9][0-9 ()\-]{9,19}" placeholder="Telefon" className="girdi max-w-56" />
              <button className="dugme" disabled={bekle}>{bekle ? "Bekleyin…" : "Kartla öde"}</button>
            </form>
          )}
          {ayarlar?.odeme_bilgisi && (
            <p className="text-sm text-soluk">
              {ayarlar.odeme_bilgisi} <strong className="text-murekkep">Açıklamaya yazılacak sipariş no: {s.id}</strong>
            </p>
          )}
          <button onClick={iptal} className="text-sm text-soluk underline underline-offset-4 hover:text-vurgu">Siparişi iptal et</button>
        </section>
      )}

      <section className="mt-8">
        <ul className="divide-y divide-cizgi border-y border-cizgi">
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
          <h2 className="mb-1 font-medium">Teslimat</h2>
          <p className="text-soluk">{s.teslimat_adresi || "Kafeden teslim alınacak"}</p>
          {s.takip_no && <p className="mt-2">Kargo takip no: <strong>{s.takip_no}</strong></p>}
        </div>
        {s.siparis_notu && (
          <div>
            <h2 className="mb-1 font-medium">Not</h2>
            <p className="text-soluk">{s.siparis_notu}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default function Sayfa() {
  return <Suspense><SiparisDetay /></Suspense>;
}
