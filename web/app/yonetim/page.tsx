"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Hata } from "@/components/ortak";
import { api } from "@/lib/api";
import { DURUMLAR, fiyat } from "@/lib/bicim";

type Ozet = {
  bugun_siparis_adedi: number;
  bugun_tutar: number;
  odenmis_toplam_ciro: number;
  durum_sayilari: Record<string, number>;
  dusuk_stok: { id: number; ad: string; stok: number }[];
};

type Sorun = { merchant_oid: string; siparis_id: number; inceleme_nedeni: string; odenen_kurus: number | null; test_modu: boolean };

const SORUN_ADLARI: Record<string, string> = {
  iptal_siparise_odeme: "İptal edilmiş siparişe ödeme geldi: PayTR panelinden iade edin",
  zaten_odenmis_siparis: "Sipariş iki kez ödendi: fazla ödemeyi iade edin",
  tutar_uyusmazligi: "Ödenen tutar sipariş tutarından düşük",
  test_bildirimi: "Gerçek modda test bildirimi geldi",
};

export default function YonetimOzet() {
  const [o, setO] = useState<Ozet | null>(null);
  const [sorunlar, setSorunlar] = useState<Sorun[]>([]);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    api<Ozet>("/yonetim/ozet").then(setO).catch((e) => setHata(e.message));
    api<Sorun[]>("/yonetim/odeme-sorunlari").then(setSorunlar).catch(() => undefined);
  }, []);

  return (
    <div className="space-y-10">
      <Hata mesaj={hata} />
      {sorunlar.length > 0 && (
        <section className="rounded-2xl border border-vurgu/40 bg-vurgu/5 p-6">
          <h2 className="font-baslik text-xl text-vurgu">İncelenmesi gereken ödemeler</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {sorunlar.map((s) => (
              <li key={s.merchant_oid}>
                <Link href={`/yonetim/siparisler?ac=${s.siparis_id}`} className="underline">Sipariş #{s.siparis_id}</Link>
                {" · "}
                {SORUN_ADLARI[s.inceleme_nedeni] || s.inceleme_nedeni}
                {s.odenen_kurus !== null && ` · ${fiyat(s.odenen_kurus / 100)}`} · PayTR no: {s.merchant_oid}
              </li>
            ))}
          </ul>
        </section>
      )}
      {o && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Bugünkü sipariş", String(o.bugun_siparis_adedi)],
              ["Bugünkü tutar", fiyat(o.bugun_tutar)],
              ["Ödenmiş toplam ciro", fiyat(o.odenmis_toplam_ciro)],
            ].map(([b, d]) => (
              <div key={b} className="rounded-2xl bg-kum p-5">
                <p className="text-sm text-soluk">{b}</p>
                <p className="mt-1 text-2xl tabular-nums">{d}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <section>
              <h2 className="mb-3 font-baslik text-xl">Sipariş durumları</h2>
              <ul className="divide-y divide-cizgi border-y border-cizgi text-sm">
                {Object.entries(DURUMLAR).map(([d, ad]) => (
                  <li key={d}>
                    <Link href={`/yonetim/siparisler?durum=${d}`} className="flex justify-between py-2.5 hover:text-vurgu">
                      <span>{ad}</span>
                      <span className="tabular-nums">{o.durum_sayilari[d] || 0}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="mb-3 font-baslik text-xl">Stoğu azalanlar</h2>
              {o.dusuk_stok.length === 0 ? (
                <p className="text-sm text-soluk">Stoğu 5 ve altına düşen ürün yok.</p>
              ) : (
                <ul className="divide-y divide-cizgi border-y border-cizgi text-sm">
                  {o.dusuk_stok.map((u, i) => (
                    <li key={i}>
                      <Link href={`/yonetim/urunler?duzenle=${u.id}`} className="flex justify-between py-2.5 hover:text-vurgu">
                        <span>{u.ad}</span>
                        <span className={`tabular-nums ${u.stok <= 0 ? "text-vurgu" : ""}`}>{u.stok}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
