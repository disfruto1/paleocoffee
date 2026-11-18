"use client";
import { useEffect, useState } from "react";
import { Hata } from "@/components/ortak";
import { api } from "@/lib/api";
import type { Kategori } from "@/lib/types";

export default function Kategoriler() {
  const [liste, setListe] = useState<Kategori[]>([]);
  const [ad, setAd] = useState("");
  const [hata, setHata] = useState<string | null>(null);

  const yukle = () => api<Kategori[]>("/kategoriler").then(setListe).catch((e) => setHata(e.message));
  useEffect(() => {
    yukle();
  }, []);

  async function islem(f: () => Promise<unknown>) {
    setHata(null);
    try {
      await f();
      yukle();
    } catch (e) {
      setHata((e as Error).message);
    }
  }

  return (
    <div className="max-w-xl">
      <p className="text-sm text-soluk">Ürünler sayfasında filtre olarak görünür. Örnek: Tek köken, Harman, Demleme ekipmanı, Aksesuar, Yiyecek.</p>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          islem(() => api("/kategoriler", { json: { ad: ad.trim() } })).then(() => setAd(""));
        }}
      >
        <input value={ad} onChange={(e) => setAd(e.target.value)} required maxLength={120} placeholder="Yeni kategori" className="girdi" />
        <button className="dugme">Ekle</button>
      </form>
      <div className="mt-4"><Hata mesaj={hata} /></div>
      <ul className="mt-6 divide-y divide-cizgi border-y border-cizgi">
        {liste.map((k) => (
          <li key={k.id} className="flex items-center justify-between gap-3 py-3">
            <span>{k.ad}</span>
            <span className="flex gap-4 text-sm">
              <button
                className="underline underline-offset-4"
                onClick={() => {
                  const yeni = prompt("Yeni ad", k.ad);
                  if (yeni && yeni.trim() !== k.ad) islem(() => api(`/kategoriler/${k.id}`, { method: "PUT", json: { ad: yeni.trim(), aciklama: k.aciklama } }));
                }}
              >
                Yeniden adlandır
              </button>
              <button className="text-soluk underline underline-offset-4 hover:text-vurgu" onClick={() => confirm(`"${k.ad}" gizlensin mi? Ürünler silinmez.`) && islem(() => api(`/kategoriler/${k.id}`, { method: "DELETE" }))}>
                Gizle
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
