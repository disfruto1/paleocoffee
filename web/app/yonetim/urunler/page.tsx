"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Hata } from "@/components/ortak";
import { UrunGorseli } from "@/components/UrunGorseli";
import { api } from "@/lib/api";
import { fiyat, listeFiyati } from "@/lib/bicim";
import type { Kategori, Urun } from "@/lib/types";

type SecenekForm = { id?: number; ad: string; fiyat: string; stok: string };

type Form = {
  ad: string;
  aciklama: string;
  fiyat: string;
  stok: string;
  gorsel_url: string;
  kategori_id: string;
  mensei: string;
  isleme: string;
  kavrum: string;
  tat_notlari: string;
  ogutme_secilebilir: boolean;
  one_cikan: boolean;
  secenekler: SecenekForm[];
};

const BOS: Form = {
  ad: "", aciklama: "", fiyat: "", stok: "", gorsel_url: "", kategori_id: "", mensei: "", isleme: "", kavrum: "",
  tat_notlari: "", ogutme_secilebilir: false, one_cikan: false, secenekler: [],
};

const KAHVE_SABLONU: Partial<Form> = {
  ogutme_secilebilir: true,
  fiyat: "0",
  secenekler: [{ ad: "250 g", fiyat: "", stok: "" }, { ad: "1 kg", fiyat: "", stok: "" }],
};

function formdan(u: Urun): Form {
  return {
    ad: u.ad, aciklama: u.aciklama || "", fiyat: u.fiyat, stok: u.stok === null ? "" : String(u.stok), gorsel_url: u.gorsel_url || "",
    kategori_id: u.kategori_id ? String(u.kategori_id) : "", mensei: u.mensei || "", isleme: u.isleme || "", kavrum: u.kavrum || "",
    tat_notlari: u.tat_notlari || "", ogutme_secilebilir: u.ogutme_secilebilir, one_cikan: u.one_cikan,
    secenekler: u.secenekler.filter((s) => s.aktif).map((s) => ({ id: s.id, ad: s.ad, fiyat: s.fiyat, stok: s.stok === null ? "" : String(s.stok) })),
  };
}

const sayi = (d: string) => (d.trim() === "" ? null : Number(d.replace(",", ".")));

function UrunFormu({ urun, kategoriler, bitti }: { urun: Urun | null; kategoriler: Kategori[]; bitti: (u: Urun | null) => void }) {
  const [f, setF] = useState<Form>(urun ? formdan(urun) : BOS);
  const [hata, setHata] = useState<string | null>(null);
  const [bekle, setBekle] = useState(false);
  const yaz = <K extends keyof Form>(k: K, v: Form[K]) => setF((e) => ({ ...e, [k]: v }));
  const secenekYaz = (i: number, k: keyof SecenekForm, v: string) =>
    setF((e) => ({ ...e, secenekler: e.secenekler.map((s, j) => (j === i ? { ...s, [k]: v } : s)) }));

  async function kaydet(e: React.FormEvent) {
    e.preventDefault();
    setBekle(true);
    setHata(null);
    const govde = {
      ad: f.ad.trim(),
      aciklama: f.aciklama.trim() || null,
      fiyat: f.secenekler.length ? (f.fiyat.trim() || "0") : f.fiyat.replace(",", "."),
      stok: f.secenekler.length ? null : sayi(f.stok),
      gorsel_url: f.gorsel_url.trim() || null,
      kategori_id: f.kategori_id ? Number(f.kategori_id) : null,
      mensei: f.mensei, isleme: f.isleme, kavrum: f.kavrum, tat_notlari: f.tat_notlari,
      ogutme_secilebilir: f.ogutme_secilebilir,
      one_cikan: f.one_cikan,
      secenekler: f.secenekler.map((s) => ({ id: s.id, ad: s.ad.trim(), fiyat: s.fiyat.replace(",", "."), stok: sayi(s.stok), aktif: true })),
    };
    try {
      const u = await api<Urun>(urun ? `/urunler/${urun.id}` : "/urunler", { method: urun ? "PUT" : "POST", json: govde });
      bitti(u);
    } catch (err) {
      setHata((err as Error).message);
      setBekle(false);
    }
  }

  const alan = (etiket: string, cocuk: React.ReactNode, genis = false) => (
    <label className={`block ${genis ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-sm text-soluk">{etiket}</span>
      {cocuk}
    </label>
  );

  return (
    <form onSubmit={kaydet} className="space-y-6 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-baslik text-2xl">{urun ? "Ürünü düzenle" : "Yeni ürün"}</h2>
        {!urun && (
          <button type="button" className="text-sm underline underline-offset-4" onClick={() => setF((e) => ({ ...e, ...KAHVE_SABLONU }))}>
            Kahve şablonu (250 g / 1 kg, öğütme)
          </button>
        )}
      </div>
      <Hata mesaj={hata} />
      <div className="grid gap-4 sm:grid-cols-2">
        {alan("Ad", <input required maxLength={120} value={f.ad} onChange={(e) => yaz("ad", e.target.value)} className="girdi" />)}
        {alan("Kategori", (
          <select value={f.kategori_id} onChange={(e) => yaz("kategori_id", e.target.value)} className="girdi">
            <option value="">—</option>
            {kategoriler.map((k) => <option key={k.id} value={k.id}>{k.ad}</option>)}
          </select>
        ))}
        {alan("Açıklama", <textarea rows={4} value={f.aciklama} onChange={(e) => yaz("aciklama", e.target.value)} className="girdi" />, true)}
        {alan("Görsel bağlantısı (https://…)", <input value={f.gorsel_url} onChange={(e) => yaz("gorsel_url", e.target.value)} pattern="(https://|/).*" maxLength={500} className="girdi" />, true)}
      </div>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 font-medium">Kahve bilgileri <span className="text-sm font-normal text-soluk">(ekipmanda boş bırakın)</span></legend>
        {alan("Menşei", <input value={f.mensei} maxLength={120} onChange={(e) => yaz("mensei", e.target.value)} placeholder="Etiyopya, Yirgacheffe" className="girdi" />)}
        {alan("İşleme", <input value={f.isleme} maxLength={60} onChange={(e) => yaz("isleme", e.target.value)} placeholder="Yıkanmış, doğal, honey" className="girdi" />)}
        {alan("Kavrum", (
          <select value={f.kavrum} onChange={(e) => yaz("kavrum", e.target.value)} className="girdi">
            <option value="">—</option>
            <option value="acik">Açık</option>
            <option value="orta">Orta</option>
            <option value="koyu">Koyu</option>
          </select>
        ))}
        {alan("Tat notları", <input value={f.tat_notlari} maxLength={200} onChange={(e) => yaz("tat_notlari", e.target.value)} placeholder="Bergamot, yasemin, şeftali" className="girdi" />)}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={f.ogutme_secilebilir} onChange={(e) => yaz("ogutme_secilebilir", e.target.checked)} />
          Müşteri öğütme seçsin
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={f.one_cikan} onChange={(e) => yaz("one_cikan", e.target.checked)} />
          Ana sayfada göster
        </label>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-medium">Fiyat ve stok</legend>
        {f.secenekler.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {alan("Fiyat (₺)", <input required inputMode="decimal" value={f.fiyat} onChange={(e) => yaz("fiyat", e.target.value)} className="girdi" />)}
            {alan("Stok (boş: takip yok)", <input inputMode="numeric" pattern="[0-9]*" value={f.stok} onChange={(e) => yaz("stok", e.target.value)} className="girdi" />)}
          </div>
        ) : (
          <div className="space-y-2">
            {f.secenekler.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2">
                <input required maxLength={60} value={s.ad} onChange={(e) => secenekYaz(i, "ad", e.target.value)} placeholder="250 g" className="girdi" aria-label="Seçenek adı" />
                <input required inputMode="decimal" value={s.fiyat} onChange={(e) => secenekYaz(i, "fiyat", e.target.value)} placeholder="Fiyat ₺" className="girdi" aria-label="Fiyat" />
                <input inputMode="numeric" pattern="[0-9]*" value={s.stok} onChange={(e) => secenekYaz(i, "stok", e.target.value)} placeholder="Stok" className="girdi" aria-label="Stok" />
                <button type="button" className="px-2 text-soluk hover:text-vurgu" onClick={() => setF((e) => ({ ...e, secenekler: e.secenekler.filter((_, j) => j !== i) }))} aria-label="Seçeneği kaldır">✕</button>
              </div>
            ))}
            <p className="text-xs text-soluk">Stok boşsa takip edilmez. Kaldırılan seçenek satıştan kalkar, eski siparişler etkilenmez.</p>
          </div>
        )}
        <button type="button" className="mt-3 text-sm underline underline-offset-4" onClick={() => setF((e) => ({ ...e, secenekler: [...e.secenekler, { ad: "", fiyat: "", stok: "" }] }))}>
          + Seçenek ekle (gramaj vb.)
        </button>
      </fieldset>

      <div className="flex gap-3">
        <button className="dugme" disabled={bekle}>{bekle ? "Kaydediliyor…" : "Kaydet"}</button>
        <button type="button" className="dugme-ikincil" onClick={() => bitti(null)}>Vazgeç</button>
      </div>
    </form>
  );
}

function Urunler() {
  const q = useSearchParams();
  const [liste, setListe] = useState<Urun[]>([]);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [duzenlenen, setDuzenlenen] = useState<Urun | "yeni" | null>(null);
  const [hata, setHata] = useState<string | null>(null);

  const yukle = useCallback(async () => {
    try {
      const [u, k] = await Promise.all([api<Urun[]>("/yonetim/urunler?limit=200"), api<Kategori[]>("/kategoriler")]);
      setListe(u);
      setKategoriler(k);
      const id = Number(q.get("duzenle"));
      if (id) setDuzenlenen((d) => d ?? u.find((x) => x.id === id) ?? null);
    } catch (e) {
      setHata((e as Error).message);
    }
  }, [q]);

  useEffect(() => {
    yukle();
  }, [yukle]);

  async function aktiflik(u: Urun) {
    try {
      const y = await api<Urun>(`/urunler/${u.id}/aktif`, { method: "PATCH", json: { aktif: !u.aktif } });
      setListe((l) => l.map((x) => (x.id === y.id ? y : x)));
    } catch (e) {
      setHata((e as Error).message);
    }
  }

  if (duzenlenen) {
    return (
      <UrunFormu
        key={duzenlenen === "yeni" ? "yeni" : duzenlenen.id}
        urun={duzenlenen === "yeni" ? null : duzenlenen}
        kategoriler={kategoriler}
        bitti={(u) => {
          setDuzenlenen(null);
          if (u) yukle();
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-soluk">{liste.length} ürün</p>
        <button className="dugme" onClick={() => setDuzenlenen("yeni")}>Yeni ürün</button>
      </div>
      <div className="mt-4"><Hata mesaj={hata} /></div>
      <ul className="mt-4 divide-y divide-cizgi border-y border-cizgi">
        {liste.map((u) => {
          const f = listeFiyati(u);
          const stoklar = u.secenekler.filter((s) => s.aktif).map((s) => `${s.ad}: ${s.stok ?? "∞"}`).join(", ");
          return (
            <li key={u.id} className={`flex items-center gap-4 py-3 ${u.aktif ? "" : "opacity-50"}`}>
              <div className="h-14 w-12 shrink-0 overflow-hidden bg-kum"><UrunGorseli urun={u} /></div>
              <div className="flex-1">
                <p className="font-medium">{u.ad} {u.one_cikan && <span className="text-xs text-vurgu">★ ana sayfa</span>} {!u.aktif && <span className="text-xs">(satışta değil)</span>}</p>
                <p className="text-sm text-soluk">
                  {f.baslayan && "başlayan "}{fiyat(f.tutar)} · Stok: {stoklar || (u.stok ?? "takip yok")}
                </p>
              </div>
              <button className="text-sm underline underline-offset-4" onClick={() => setDuzenlenen(u)}>Düzenle</button>
              <button className="text-sm text-soluk underline underline-offset-4 hover:text-vurgu" onClick={() => aktiflik(u)}>{u.aktif ? "Satıştan kaldır" : "Satışa al"}</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Sayfa() {
  return <Suspense><Urunler /></Suspense>;
}
