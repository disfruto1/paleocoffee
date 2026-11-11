"use client";
// Uye olmadan verilen siparisin sayfasi. Erisim kodu adresin # kismindadir (sunucuya, kayitlara gitmez).
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Yukleniyor } from "@/components/ortak";
import { SiparisDetay } from "@/components/SiparisDetay";
import { kodAl, kodKaydet } from "@/lib/misafir";

function Sayfa() {
  const { id } = useParams<{ id: string }>();
  const q = useSearchParams();
  const [kod, setKod] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const adrestekiKod = decodeURIComponent(location.hash.slice(1));
    if (/^[0-9a-f]{32}$/.test(adrestekiKod)) {
      kodKaydet(Number(id), adrestekiKod);
      setKod(adrestekiKod);
    } else {
      setKod(kodAl(id));
    }
  }, [id]);

  if (kod === undefined) return <Yukleniyor />;
  if (!kod) {
    return (
      <div className="kap max-w-lg py-24 text-center">
        <h1 className="font-baslik text-4xl">Sipariş bağlantısı gerekli</h1>
        <p className="mt-4 text-soluk">Siparişinizi görmek için size gönderdiğimiz e-postadaki bağlantıyı açın. Üyeyseniz siparişleriniz Hesabım sayfasındadır.</p>
        <Link href="/hesabim" className="dugme mt-8">Hesabım</Link>
      </div>
    );
  }
  return <SiparisDetay id={id} misafirKodu={kod} yeni={!!q.get("yeni")} ilkHata={q.get("hata")} />;
}

export default function MisafirSiparisi() {
  return <Suspense><Sayfa /></Suspense>;
}
