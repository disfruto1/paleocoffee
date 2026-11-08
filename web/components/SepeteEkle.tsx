"use client";
import Link from "next/link";
import { useState } from "react";
import { aktifSecenekler, fiyat } from "@/lib/bicim";
import type { Urun } from "@/lib/types";
import { useSepet } from "./Saglayicilar";

export function SepeteEkle({ urun, ogutmeler, tukendi }: { urun: Urun; ogutmeler: string[]; tukendi: boolean }) {
  const { ekle } = useSepet();
  const secenekler = aktifSecenekler(urun);
  const ilkStoklu = secenekler.find((s) => s.stok === null || s.stok > 0) || secenekler[0];
  const [secenekId, setSecenekId] = useState<number | null>(ilkStoklu?.id ?? null);
  const [ogutme, setOgutme] = useState<string>(ogutmeler[0] || "");
  const [adet, setAdet] = useState(1);
  const [eklendi, setEklendi] = useState(false);

  const secenek = secenekler.find((s) => s.id === secenekId) || null;
  const birim = secenek ? secenek.fiyat : urun.fiyat;
  const stok = secenek ? secenek.stok : urun.stok;
  const yok = tukendi || (stok !== null && stok <= 0);

  function sepeteEkle() {
    ekle({
      urun_id: urun.id,
      secenek_id: secenek?.id ?? null,
      ogutme: urun.ogutme_secilebilir ? ogutme : null,
      adet,
      ad: urun.ad,
      secenek_adi: secenek?.ad ?? null,
      fiyat: birim,
      gorsel_url: urun.gorsel_url,
    });
    setEklendi(true);
  }

  return (
    <div className="space-y-6">
      <p className="text-3xl tabular-nums">{fiyat(Number(birim) * adet)}</p>
      {secenekler.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Miktar</legend>
          <div className="flex flex-wrap gap-2">
            {secenekler.map((s) => {
              const bitti = s.stok !== null && s.stok <= 0;
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={bitti}
                  onClick={() => { setSecenekId(s.id); setEklendi(false); }}
                  className={`rounded-full border px-4 py-2 text-sm ${s.id === secenekId ? "border-murekkep bg-murekkep text-zemin" : "border-cizgi hover:border-murekkep"} ${bitti ? "line-through opacity-40" : ""}`}
                >
                  {s.ad} · {fiyat(s.fiyat)}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
      {urun.ogutme_secilebilir && ogutmeler.length > 0 && (
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Öğütme</span>
          <select value={ogutme} onChange={(e) => { setOgutme(e.target.value); setEklendi(false); }} className="girdi">
            {ogutmeler.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full border border-cizgi">
          <button type="button" className="px-4 py-3" onClick={() => setAdet(Math.max(1, adet - 1))} aria-label="Azalt">−</button>
          <span className="w-8 text-center tabular-nums">{adet}</span>
          <button type="button" className="px-4 py-3" onClick={() => setAdet(Math.min(stok ?? 99, adet + 1, 99))} aria-label="Arttır">+</button>
        </div>
        <button type="button" className="dugme flex-1 py-3.5" disabled={yok} onClick={sepeteEkle}>
          {yok ? "Tükendi" : "Sepete ekle"}
        </button>
      </div>
      {eklendi && (
        <p className="text-sm" role="status">
          Sepete eklendi.{" "}
          <Link href="/sepet" className="underline underline-offset-4 hover:text-vurgu">
            Sepete git
          </Link>
        </p>
      )}
    </div>
  );
}
