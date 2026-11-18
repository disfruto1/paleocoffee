"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { guvenliDonus, Hata } from "@/components/ortak";
import { useOturum } from "@/components/Saglayicilar";
import { api } from "@/lib/api";

function GirisFormu() {
  const { girisYap } = useOturum();
  const router = useRouter();
  const sonra = guvenliDonus(useSearchParams().get("sonra"));
  const [hata, setHata] = useState<string | null>(null);
  const [bekle, setBekle] = useState(false);

  async function gonder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBekle(true);
    setHata(null);
    try {
      const t = await api<{ access_token: string }>("/giris", { form: { username: String(f.get("e_posta")), password: String(f.get("sifre")) } });
      await girisYap(t.access_token);
      router.replace(sonra);
    } catch (err) {
      setHata((err as Error).message);
      setBekle(false);
    }
  }

  return (
    <div className="kap max-w-md py-16">
      <h1 className="font-baslik text-4xl">Giriş yap</h1>
      <form onSubmit={gonder} className="mt-8 space-y-4">
        <Hata mesaj={hata} />
        <label className="block">
          <span className="mb-1 block text-sm">E-posta</span>
          <input name="e_posta" type="email" required autoComplete="email" className="girdi" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Şifre</span>
          <input name="sifre" type="password" required autoComplete="current-password" className="girdi" />
        </label>
        <button className="dugme w-full" disabled={bekle}>{bekle ? "Giriş yapılıyor…" : "Giriş yap"}</button>
      </form>
      <div className="mt-6 flex justify-between text-sm">
        <Link href={`/kayit?sonra=${encodeURIComponent(sonra)}`} className="underline underline-offset-4 hover:text-vurgu">Hesap oluştur</Link>
        <Link href="/sifremi-unuttum" className="text-soluk hover:text-vurgu">Şifremi unuttum</Link>
      </div>
    </div>
  );
}

export default function Giris() {
  return <Suspense><GirisFormu /></Suspense>;
}
