"use client";
// Oturum ve sepet tum sayfalarda ortak. Sepet tarayicida saklanir; fiyat ve stok her sipariste sunucuda dogrulanir.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, tokenAl, tokenYaz } from "@/lib/api";
import type { Kullanici } from "@/lib/types";

export type SepetKalemi = {
  urun_id: number;
  secenek_id: number | null;
  ogutme: string | null;
  adet: number;
  // Gosterim icin kopya; siparis tutari sunucuda yeniden hesaplanir
  ad: string;
  secenek_adi: string | null;
  fiyat: string;
  gorsel_url: string | null;
};

const SEPET_ANAHTARI = "paleo_sepet";

export const kalemAnahtari = (k: Pick<SepetKalemi, "urun_id" | "secenek_id" | "ogutme">) =>
  `${k.urun_id}:${k.secenek_id ?? ""}:${k.ogutme ?? ""}`;

type Oturum = {
  kullanici: Kullanici | null;
  yukleniyor: boolean;
  girisYap: (token: string) => Promise<void>;
  cikisYap: () => void;
  yenile: () => Promise<void>;
};

type Sepet = {
  kalemler: SepetKalemi[];
  adet: number;
  toplam: number;
  ekle: (k: SepetKalemi) => void;
  adetDegistir: (anahtar: string, adet: number) => void;
  cikar: (anahtar: string) => void;
  bosalt: () => void;
};

const OturumBaglami = createContext<Oturum | null>(null);
const SepetBaglami = createContext<Sepet | null>(null);

export function Saglayicilar({ children }: { children: React.ReactNode }) {
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kalemler, setKalemler] = useState<SepetKalemi[]>([]);
  const [sepetHazir, setSepetHazir] = useState(false);

  const yenile = useCallback(async () => {
    if (!tokenAl()) {
      setKullanici(null);
      setYukleniyor(false);
      return;
    }
    try {
      setKullanici(await api<Kullanici>("/ben"));
    } catch {
      setKullanici(null);
    } finally {
      setYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    yenile();
    // Baska sekmede giris/cikis veya suresi dolan oturum
    const dinle = () => yenile();
    window.addEventListener("paleo-oturum", dinle);
    window.addEventListener("storage", dinle);
    return () => {
      window.removeEventListener("paleo-oturum", dinle);
      window.removeEventListener("storage", dinle);
    };
  }, [yenile]);

  useEffect(() => {
    try {
      const kayit = localStorage.getItem(SEPET_ANAHTARI);
      if (kayit) setKalemler(JSON.parse(kayit));
    } catch {
      // bozuk kayit: bos sepetle devam
    }
    setSepetHazir(true);
  }, []);

  useEffect(() => {
    if (!sepetHazir) return;
    try {
      localStorage.setItem(SEPET_ANAHTARI, JSON.stringify(kalemler));
    } catch {
      // saklanamazsa sepet yalnizca bu sayfada kalir
    }
  }, [kalemler, sepetHazir]);

  const oturum = useMemo<Oturum>(
    () => ({
      kullanici,
      yukleniyor,
      yenile,
      girisYap: async (token) => {
        tokenYaz(token);
        await yenile();
      },
      cikisYap: () => {
        tokenYaz(null);
        setKullanici(null);
      },
    }),
    [kullanici, yukleniyor, yenile],
  );

  const sepet = useMemo<Sepet>(
    () => ({
      kalemler,
      adet: kalemler.reduce((t, k) => t + k.adet, 0),
      toplam: kalemler.reduce((t, k) => t + Number(k.fiyat) * k.adet, 0),
      ekle: (yeni) =>
        setKalemler((eski) => {
          const a = kalemAnahtari(yeni);
          const var_ = eski.find((k) => kalemAnahtari(k) === a);
          if (var_) return eski.map((k) => (kalemAnahtari(k) === a ? { ...k, ...yeni, adet: Math.min(k.adet + yeni.adet, 99) } : k));
          return [...eski, yeni];
        }),
      adetDegistir: (a, adet) =>
        setKalemler((eski) => eski.map((k) => (kalemAnahtari(k) === a ? { ...k, adet: Math.max(1, Math.min(adet, 99)) } : k))),
      cikar: (a) => setKalemler((eski) => eski.filter((k) => kalemAnahtari(k) !== a)),
      bosalt: () => setKalemler([]),
    }),
    [kalemler],
  );

  return (
    <OturumBaglami.Provider value={oturum}>
      <SepetBaglami.Provider value={sepet}>{children}</SepetBaglami.Provider>
    </OturumBaglami.Provider>
  );
}

export function useOturum() {
  const o = useContext(OturumBaglami);
  if (!o) throw new Error("Saglayicilar eksik");
  return o;
}

export function useSepet() {
  const s = useContext(SepetBaglami);
  if (!s) throw new Error("Saglayicilar eksik");
  return s;
}
