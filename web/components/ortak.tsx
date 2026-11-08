"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useOturum } from "./Saglayicilar";

/** Giris yapilmamissa giris sayfasina yollar, sonra bu sayfaya geri doner. */
export function useGirisGerekli(rol?: "yonetici") {
  const { kullanici, yukleniyor } = useOturum();
  const router = useRouter();
  useEffect(() => {
    if (yukleniyor) return;
    if (!kullanici) router.replace(`/giris?sonra=${encodeURIComponent(location.pathname + location.search)}`);
    else if (rol && kullanici.rol !== rol) router.replace("/");
  }, [kullanici, yukleniyor, rol, router]);
  return !yukleniyor && !!kullanici && (!rol || kullanici.rol === rol) ? kullanici : null;
}

export function Hata({ mesaj }: { mesaj: string | null }) {
  if (!mesaj) return null;
  return (
    <p role="alert" className="rounded-xl bg-vurgu/10 px-4 py-3 text-sm text-vurgu">
      {mesaj}
    </p>
  );
}

export function Yukleniyor() {
  return <p className="kap py-24 text-center text-soluk">Yükleniyor…</p>;
}

/** Yalnizca site ici adreslere geri donulur (giris sonrasi baska siteye yonlendirme olmasin). */
export function guvenliDonus(adres: string | null): string {
  return adres && adres.startsWith("/") && !adres.startsWith("//") && !adres.startsWith("/\\") ? adres : "/hesabim";
}
