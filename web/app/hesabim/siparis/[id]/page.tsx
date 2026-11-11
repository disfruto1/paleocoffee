"use client";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useGirisGerekli, Yukleniyor } from "@/components/ortak";
import { SiparisDetay } from "@/components/SiparisDetay";

function Sayfa() {
  const kullanici = useGirisGerekli();
  const { id } = useParams<{ id: string }>();
  const q = useSearchParams();
  if (!kullanici) return <Yukleniyor />;
  return <SiparisDetay id={id} telefon={kullanici.telefon || ""} yeni={!!q.get("yeni")} ilkHata={q.get("hata")} geri={{ href: "/hesabim", ad: "Hesabım" }} />;
}

export default function UyeSiparisi() {
  return <Suspense><Sayfa /></Suspense>;
}
