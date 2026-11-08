"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Hata, useGirisGerekli, Yukleniyor } from "@/components/ortak";
import { useOturum } from "@/components/Saglayicilar";
import { api } from "@/lib/api";
import { durumAdi, fiyat, TESLIMAT_ADLARI, tarih } from "@/lib/bicim";
import type { Adres, Siparis } from "@/lib/types";

export default function Hesabim() {
  const kullanici = useGirisGerekli();
  const { cikisYap } = useOturum();
  const [siparisler, setSiparisler] = useState<Siparis[] | null>(null);
  const [adresler, setAdresler] = useState<Adres[]>([]);
  const [hata, setHata] = useState<string | null>(null);

  async function yukle() {
    try {
      const [s, a] = await Promise.all([api<Siparis[]>("/siparisler"), api<Adres[]>("/adresler")]);
      setSiparisler(s);
      setAdresler(a);
    } catch (e) {
      setHata((e as Error).message);
    }
  }

  useEffect(() => {
    if (kullanici) yukle();
  }, [kullanici]);

  async function adresIslem(yol: string, method: string) {
    try {
      await api(yol, { method });
      yukle();
    } catch (e) {
      setHata((e as Error).message);
    }
  }

  if (!kullanici) return <Yukleniyor />;

  return (
    <div className="kap py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-baslik text-4xl">Merhaba, {kullanici.ad.split(" ")[0]}</h1>
          <p className="mt-1 text-soluk">{kullanici.e_posta}</p>
        </div>
        <button onClick={cikisYap} className="dugme-ikincil">Çıkış yap</button>
      </div>
      <div className="mt-6"><Hata mesaj={hata} /></div>

      <section className="mt-10">
        <h2 className="font-baslik text-2xl">Siparişlerim</h2>
        {siparisler === null ? (
          <p className="mt-4 text-soluk">Yükleniyor…</p>
        ) : siparisler.length === 0 ? (
          <p className="mt-4 text-soluk">Henüz siparişiniz yok. <Link href="/magaza" className="underline">Mağazaya göz atın.</Link></p>
        ) : (
          <ul className="mt-4 divide-y divide-cizgi border-y border-cizgi">
            {siparisler.map((s) => (
              <li key={s.id}>
                <Link href={`/hesabim/siparis/${s.id}`} className="flex flex-wrap items-center justify-between gap-3 py-4 hover:text-vurgu">
                  <span>
                    <span className="font-medium">#{s.id}</span>
                    <span className="ml-3 text-sm text-soluk">{tarih(s.olusturulma_tarihi)} · {TESLIMAT_ADLARI[s.teslimat_yontemi]}</span>
                  </span>
                  <span className="flex items-center gap-4 text-sm">
                    <span className={` px-3 py-1 ${s.durum === "odeme_bekliyor" ? "bg-vurgu/10 text-vurgu" : s.durum === "iptal_edildi" ? "bg-cizgi" : "bg-zeytin/15 text-zeytin"}`}>
                      {durumAdi(s.durum, s.teslimat_yontemi)}
                    </span>
                    <span className="tabular-nums">{fiyat(s.toplam_tutar)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-baslik text-2xl">Adreslerim</h2>
        {adresler.length === 0 ? (
          <p className="mt-4 text-soluk">Kayıtlı adres yok. İlk siparişinizde girdiğiniz adres buraya kaydedilir.</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {adresler.map((a) => (
              <li key={a.id} className="border border-cizgi p-4">
                <p className="font-medium">{a.baslik} {a.varsayilan && <span className="text-xs text-soluk">(varsayılan)</span>}</p>
                <p className="mt-1 text-sm text-soluk">{a.adres}</p>
                <div className="mt-3 flex gap-4 text-sm">
                  {!a.varsayilan && <button className="underline underline-offset-4" onClick={() => adresIslem(`/adresler/${a.id}/varsayilan`, "POST")}>Varsayılan yap</button>}
                  <button className="text-soluk underline underline-offset-4 hover:text-vurgu" onClick={() => adresIslem(`/adresler/${a.id}`, "DELETE")}>Sil</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
