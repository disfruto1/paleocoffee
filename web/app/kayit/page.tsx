"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { guvenliDonus, Hata } from "@/components/ortak";
import { useOturum } from "@/components/Saglayicilar";
import { api } from "@/lib/api";

type Metinler = { aydinlatma: string; eposta_izni: string; sms_izni: string; izin_notu: string; surum: string };

function KayitFormu() {
  const { girisYap } = useOturum();
  const router = useRouter();
  const sonra = guvenliDonus(useSearchParams().get("sonra"));
  const [metinler, setMetinler] = useState<Metinler | null>(null);
  const [aydinlatmaAcik, setAydinlatmaAcik] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [bekle, setBekle] = useState(false);

  useEffect(() => {
    api<Metinler>("/yasal/kayit").then(setMetinler).catch((e) => setHata(e.message));
  }, []);

  async function gonder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!metinler) return;
    const f = new FormData(e.currentTarget);
    const telefon = String(f.get("telefon") || "").trim();
    setBekle(true);
    setHata(null);
    try {
      await api("/kayit", {
        json: {
          ad: String(f.get("ad")).trim(),
          e_posta: String(f.get("e_posta")).trim(),
          sifre: String(f.get("sifre")),
          telefon: telefon || null,
          aydinlatma_okundu: f.get("aydinlatma") === "on",
          metin_surumu: metinler.surum,
          eposta_izni: f.get("eposta_izni") === "on",
          sms_izni: f.get("sms_izni") === "on",
        },
      });
      const t = await api<{ access_token: string }>("/giris", { form: { username: String(f.get("e_posta")).trim(), password: String(f.get("sifre")) } });
      await girisYap(t.access_token);
      router.replace(sonra);
    } catch (err) {
      setHata((err as Error).message);
      setBekle(false);
    }
  }

  return (
    <div className="kap max-w-md py-16">
      <h1 className="font-baslik text-4xl">Hesap oluştur</h1>
      <form onSubmit={gonder} className="mt-8 space-y-4">
        <Hata mesaj={hata} />
        <label className="block">
          <span className="mb-1 block text-sm">Ad soyad</span>
          <input name="ad" required maxLength={120} autoComplete="name" className="girdi" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">E-posta</span>
          <input name="e_posta" type="email" required autoComplete="email" className="girdi" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Telefon <span className="text-soluk">(kartla ödeme ve SMS için)</span></span>
          <input name="telefon" type="tel" autoComplete="tel" pattern="\+?[0-9][0-9 ()\-]{9,19}" placeholder="05xx xxx xx xx" className="girdi" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Şifre <span className="text-soluk">(en az 6 karakter)</span></span>
          <input name="sifre" type="password" required minLength={6} maxLength={72} autoComplete="new-password" className="girdi" />
        </label>
        {metinler && (
          <div className="space-y-3 rounded-xl bg-kum p-4 text-sm">
            <label className="flex gap-3">
              <input type="checkbox" name="aydinlatma" required className="mt-1" />
              <span>
                <button type="button" className="underline underline-offset-4" onClick={() => setAydinlatmaAcik(!aydinlatmaAcik)}>
                  KVKK Aydınlatma Metni
                </button>
                &apos;ni okudum.
              </span>
            </label>
            {aydinlatmaAcik && <div className="max-h-56 overflow-y-auto whitespace-pre-line rounded-lg bg-white p-3 text-xs text-soluk">{metinler.aydinlatma}</div>}
            <label className="flex gap-3">
              <input type="checkbox" name="eposta_izni" className="mt-1" />
              <span>{metinler.eposta_izni}</span>
            </label>
            <label className="flex gap-3">
              <input type="checkbox" name="sms_izni" className="mt-1" />
              <span>{metinler.sms_izni}</span>
            </label>
            <p className="text-xs text-soluk">{metinler.izin_notu}</p>
          </div>
        )}
        <button className="dugme w-full" disabled={bekle || !metinler}>{bekle ? "Hesap oluşturuluyor…" : "Hesap oluştur"}</button>
      </form>
      <p className="mt-6 text-sm">
        Hesabınız var mı?{" "}
        <Link href={`/giris?sonra=${encodeURIComponent(sonra)}`} className="underline underline-offset-4 hover:text-vurgu">Giriş yapın</Link>
      </p>
    </div>
  );
}

export default function Kayit() {
  return <Suspense><KayitFormu /></Suspense>;
}
