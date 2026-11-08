"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Hata } from "@/components/ortak";
import { api } from "@/lib/api";
import { DURUMLAR, durumAdi, fiyat, TESLIMAT_ADLARI, tarih } from "@/lib/bicim";
import type { Siparis } from "@/lib/types";

// Bir durumdan gecilebilecek durumlar (backend'deki SiparisDurum.GECISLER ile ayni)
const GECISLER: Record<string, string[]> = {
  odeme_bekliyor: ["odendi", "iptal_edildi"],
  odendi: ["kargoya_verildi", "teslim_edildi", "iptal_edildi"],
  kargoya_verildi: ["teslim_edildi"],
};

function dugmeAdi(hedef: string, yontem: string, odeme: string): string {
  if (hedef === "odendi") return odeme === "havale" ? "Havale geldi" : "Ödendi olarak işaretle";
  if (hedef === "kargoya_verildi") return yontem === "kargo" ? "Kargoya verildi" : yontem === "ayvalik" ? "Kurye yola çıktı" : "Teslime hazır";
  if (hedef === "teslim_edildi") return "Teslim edildi";
  return "İptal et";
}

function SiparisSatiri({ s, acik, degisti }: { s: Siparis; acik: boolean; degisti: (s: Siparis) => void }) {
  const [goster, setGoster] = useState(acik);
  const [takip, setTakip] = useState(s.takip_no || "");
  const [hata, setHata] = useState<string | null>(null);

  async function durum(hedef: string) {
    if (hedef === "iptal_edildi" && !confirm(s.durum === "odeme_bekliyor" ? "Sipariş iptal edilsin mi? Stok geri eklenir." : "Ödenmiş sipariş iptal edilsin mi? Kart ödemesinin iadesini PayTR panelinden ayrıca yapmalısınız."))
      return;
    setHata(null);
    try {
      degisti(await api<Siparis>(`/siparisler/${s.id}/durum`, { method: "PATCH", json: { durum: hedef, takip_no: hedef === "kargoya_verildi" ? takip || null : null } }));
    } catch (e) {
      setHata((e as Error).message);
    }
  }

  return (
    <li className="py-3">
      <button onClick={() => setGoster(!goster)} className="flex w-full flex-wrap items-center justify-between gap-3 text-left">
        <span>
          <span className="font-medium">#{s.id}</span> <span className="ml-2">{s.musteri_ad}</span>
          <span className="ml-3 text-sm text-soluk">{tarih(s.olusturulma_tarihi)} · {TESLIMAT_ADLARI[s.teslimat_yontemi]}</span>
        </span>
        <span className="flex items-center gap-4 text-sm">
          <span className="bg-kum px-3 py-1">{durumAdi(s.durum, s.teslimat_yontemi)}</span>
          <span className="tabular-nums">{fiyat(s.toplam_tutar)}</span>
        </span>
      </button>
      {goster && (
        <div className="mt-4 grid gap-6 bg-white p-5 text-sm md:grid-cols-2">
          <div>
            <ul className="space-y-1">
              {s.kalemler.map((k) => (
                <li key={k.id}>
                  <strong>{k.adet} ×</strong> {k.urun_adi}
                  {k.secenek_adi && ` · ${k.secenek_adi}`}
                  {k.ogutme && <span className="ml-1 bg-kum px-1.5">{k.ogutme}</span>}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-soluk">Teslimat ücreti: {fiyat(s.teslimat_ucreti)}</p>
          </div>
          <div className="space-y-2">
            <p><span className="text-soluk">Ödeme:</span> {s.odeme_yontemi === "havale" ? "Havale / EFT" : "Kart (PayTR)"}</p>
            <p><span className="text-soluk">Adres:</span> {s.teslimat_adresi || "Kafeden teslim"}</p>
            {s.siparis_notu && <p><span className="text-soluk">Not:</span> {s.siparis_notu}</p>}
            {s.takip_no && <p><span className="text-soluk">Takip no:</span> {s.takip_no}</p>}
            <Hata mesaj={hata} />
            {(GECISLER[s.durum] || []).includes("kargoya_verildi") && s.teslimat_yontemi === "kargo" && (
              <input value={takip} onChange={(e) => setTakip(e.target.value)} maxLength={100} placeholder="Kargo takip no" className="girdi py-2 text-sm" />
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              {(GECISLER[s.durum] || []).map((h) => (
                <button key={h} onClick={() => durum(h)} className={h === "iptal_edildi" ? "dugme-ikincil py-2" : "dugme py-2"}>
                  {dugmeAdi(h, s.teslimat_yontemi, s.odeme_yontemi)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

function Siparisler() {
  const q = useSearchParams();
  const [durum, setDurum] = useState(q.get("durum") || "");
  const [liste, setListe] = useState<Siparis[] | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const ac = Number(q.get("ac"));

  const yukle = useCallback(() => {
    setListe(null);
    api<Siparis[]>(`/siparisler?limit=200${durum ? `&durum=${durum}` : ""}`).then(setListe).catch((e) => setHata(e.message));
  }, [durum]);

  useEffect(yukle, [yukle]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {[["", "Tümü"], ...Object.entries(DURUMLAR)].map(([d, ad]) => (
          <button key={d} onClick={() => setDurum(d)} className={` border px-4 py-1.5 text-sm ${durum === d ? "border-murekkep bg-murekkep text-zemin" : "border-cizgi"}`}>
            {ad}
          </button>
        ))}
        <button onClick={yukle} className="ml-auto text-sm underline underline-offset-4">Yenile</button>
      </div>
      <div className="mt-4"><Hata mesaj={hata} /></div>
      {liste === null ? (
        <p className="mt-6 text-soluk">Yükleniyor…</p>
      ) : liste.length === 0 ? (
        <p className="mt-6 text-soluk">Sipariş yok.</p>
      ) : (
        <ul className="mt-4 divide-y divide-cizgi border-y border-cizgi">
          {liste.map((s) => (
            <SiparisSatiri key={s.id} s={s} acik={s.id === ac} degisti={(y) => setListe((l) => l!.map((x) => (x.id === y.id ? y : x)))} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Sayfa() {
  return <Suspense><Siparisler /></Suspense>;
}
