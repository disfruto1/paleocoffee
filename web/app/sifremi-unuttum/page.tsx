"use client";
import Link from "next/link";
import { useState } from "react";
import { Hata } from "@/components/ortak";
import { api } from "@/lib/api";

export default function SifremiUnuttum() {
  const [eposta, setEposta] = useState("");
  const [asama, setAsama] = useState<"iste" | "kod" | "tamam">("iste");
  const [hata, setHata] = useState<string | null>(null);
  const [bekle, setBekle] = useState(false);

  async function iste(e: React.FormEvent) {
    e.preventDefault();
    setBekle(true);
    setHata(null);
    try {
      await api("/sifre-sifirlama/iste", { json: { e_posta: eposta.trim() } });
      setAsama("kod");
    } catch (err) {
      setHata((err as Error).message);
    }
    setBekle(false);
  }

  async function tamamla(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBekle(true);
    setHata(null);
    try {
      await api("/sifre-sifirlama/tamamla", { json: { e_posta: eposta.trim(), kod: String(f.get("kod")).trim(), yeni_sifre: String(f.get("sifre")) } });
      setAsama("tamam");
    } catch (err) {
      setHata((err as Error).message);
    }
    setBekle(false);
  }

  return (
    <div className="kap max-w-md py-16">
      <h1 className="font-baslik text-4xl">Şifremi unuttum</h1>
      <div className="mt-8 space-y-4">
        <Hata mesaj={hata} />
        {asama === "iste" && (
          <form onSubmit={iste} className="space-y-4">
            <p className="text-soluk">E-posta adresinize 8 haneli bir kod göndereceğiz.</p>
            <input type="email" required value={eposta} onChange={(e) => setEposta(e.target.value)} placeholder="E-posta" autoComplete="email" className="girdi" />
            <button className="dugme w-full" disabled={bekle}>Kod gönder</button>
          </form>
        )}
        {asama === "kod" && (
          <form onSubmit={tamamla} className="space-y-4">
            <p className="text-soluk">Bu e-posta kayıtlıysa kod gönderildi. Kod 15 dakika geçerlidir; gelmediyse spam klasörüne bakın.</p>
            <input name="kod" required inputMode="numeric" pattern="[0-9]{8}" maxLength={8} placeholder="8 haneli kod" autoComplete="one-time-code" className="girdi tracking-widest" />
            <input name="sifre" type="password" required minLength={6} maxLength={72} placeholder="Yeni şifre" autoComplete="new-password" className="girdi" />
            <button className="dugme w-full" disabled={bekle}>Şifreyi değiştir</button>
          </form>
        )}
        {asama === "tamam" && (
          <>
            <p>Şifreniz değiştirildi. Diğer cihazlardaki oturumlarınız kapatıldı.</p>
            <Link href="/giris" className="dugme">Giriş yap</Link>
          </>
        )}
      </div>
    </div>
  );
}
