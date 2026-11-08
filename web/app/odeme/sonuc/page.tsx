"use client";
// PayTR odemeden sonra musteriyi buraya yollar. Bu sayfa odemeyi ONAYLAMAZ: sonucu sunucuya sorar,
// siparis yalnizca PayTR'in imzali bildirimiyle "odendi" olur.
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useGirisGerekli, Yukleniyor } from "@/components/ortak";
import { api } from "@/lib/api";

type Durum = { durum: string; siparis_id: number; siparis_durum: string; hata_mesaji: string | null };

function Sonuc() {
  const kullanici = useGirisGerekli();
  const oid = useSearchParams().get("oid") || "";
  const [d, setD] = useState<Durum | null>(null);
  const [zamanAsimi, setZamanAsimi] = useState(false);

  useEffect(() => {
    if (!kullanici || !/^[A-Za-z0-9]+$/.test(oid)) return;
    let deneme = 0;
    let iptal = false;
    async function sor() {
      try {
        const sonuc = await api<Durum>(`/odeme/paytr/${oid}`);
        if (iptal) return;
        setD(sonuc);
        if (sonuc.durum !== "bekliyor") return;
      } catch {
        // tekrar denenir
      }
      if (++deneme >= 20) setZamanAsimi(true);
      else setTimeout(sor, 2000);
    }
    sor();
    return () => {
      iptal = true;
    };
  }, [kullanici, oid]);

  if (!kullanici) return <Yukleniyor />;

  let baslik = "Ödemeniz kontrol ediliyor…";
  let metin = "Bu birkaç saniye sürebilir, sayfayı kapatmayın.";
  if (d?.durum === "basarili") {
    baslik = d.siparis_durum === "odeme_bekliyor" ? "Ödemeniz alındı" : "Teşekkürler, siparişiniz alındı!";
    metin = d.siparis_durum === "odeme_bekliyor" ? "Siparişiniz kontrol ediliyor, size döneceğiz." : "Kahveniz hazırlanmaya başladı. Durumunu Hesabım sayfasından izleyebilirsiniz.";
  } else if (d?.durum === "basarisiz" || d?.durum === "token_alinamadi") {
    baslik = "Ödeme tamamlanamadı";
    metin = (d.hata_mesaji ? d.hata_mesaji + ". " : "") + "Kartınızdan para çekilmedi. Siparişiniz üzerinden tekrar deneyebilirsiniz.";
  } else if (zamanAsimi) {
    baslik = "Ödeme sonucu henüz gelmedi";
    metin = "Birkaç dakika içinde sipariş sayfanızda görünecek. Kartınızdan çekim yapıldıysa siparişiniz otomatik onaylanır.";
  }

  return (
    <div className="kap max-w-lg py-24 text-center">
      <h1 className="font-baslik text-4xl">{baslik}</h1>
      <p className="mt-4 text-soluk">{metin}</p>
      {d && (
        <Link href={`/hesabim/siparis/${d.siparis_id}`} className="dugme mt-8">
          Siparişe git
        </Link>
      )}
    </div>
  );
}

export default function OdemeSonuc() {
  return <Suspense><Sonuc /></Suspense>;
}
