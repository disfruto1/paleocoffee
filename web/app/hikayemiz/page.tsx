import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Hikâyemiz", description: "Paleo Coffee'nin Ayvalık'taki hikâyesi." };

// [TASLAK] Metin kafenin kendi hikâyesiyle degistirilmeli
export default function Hikayemiz() {
  return (
    <div className="kap max-w-3xl py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-soluk">Hikâyemiz</p>
      <h1 className="mt-3 font-baslik text-4xl leading-tight md:text-5xl">Özüne dönen bir kahve</h1>
      <div className="metin mt-8 text-lg">
        <p>
          &quot;Paleo&quot; eski, köklere ait olan demek. Biz de kahveye böyle bakıyoruz: iyi bir fincanın sırrı karmaşık tariflerde değil, doğru çekirdekte, özenli bir kavrumda ve sabırlı bir demlemede.
        </p>
        <p>
          Ayvalık&apos;ın taş sokaklarında açtığımız kafemizde, dünyanın farklı bölgelerinden seçtiğimiz çekirdekleri küçük partiler halinde kavuruyoruz. Her partiyi tadıyor, en iyi hâlini bulana kadar profili ayarlıyoruz.
        </p>
        <h2>Neden küçük partiler?</h2>
        <p>
          Kahve kavrulduktan sonraki haftalarda en canlı hâlindedir. Az ve sık kavurarak raflarımızda bekleyen kahve yerine, size hep taze kahve gönderiyoruz.
        </p>
        <h2>Kafemize bekleriz</h2>
        <p>Yeni kahvelerimizi ilk kafede deniyoruz. Uğrayın, birlikte tadalım.</p>
      </div>
      <div className="mt-10 flex gap-3">
        <Link href="/magaza" className="dugme">Kahvelerimiz</Link>
        <Link href="/iletisim" className="dugme-ikincil">Ziyaret bilgileri</Link>
      </div>
    </div>
  );
}
