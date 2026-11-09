import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Hikâyemiz", description: "Paleo Coffee: Ayvalık'ta kahvaltı, bagel sandviçler ve üçüncü nesil kahve." };

// [TASLAK] Kafenin kendi anlatimiyla guncellenebilir
export default function Hikayemiz() {
  return (
    <div className="kap max-w-3xl py-16">
      <p className="etiket text-soluk">Hikâyemiz</p>
      <h1 className="font-baslik mt-3 text-5xl leading-[1.1] font-semibold md:text-6xl">Özüne dönen bir kahve dükkânı</h1>
      <div className="metin mt-8 text-lg">
        <p>
          &quot;Paleo&quot; eski, köklere ait olan demek. Biz de kahveye ve sofraya böyle bakıyoruz: iyi bir sabahın sırrı karmaşık tariflerde değil; doğru çekirdekte, özenli bir demlemede ve sade, iyi malzemeyle hazırlanmış bir kahvaltıda.
        </p>
        <p>
          Ayvalık&apos;ın taş sokaklarındaki dükkânımızda güne kahvaltıyla başlıyor, gün boyu bagel sandviçler ve üçüncü nesil kahve hazırlıyoruz.
        </p>
        <h2>Kahvelerimiz</h2>
        <p>
          Kahvelerimizi kendimiz kavurmuyoruz; güvendiğimiz kavurmacıların farklı bölgelerden getirdiği çekirdekleri seçiyoruz. Her birini önce dükkânda, farklı yöntemlerle demleyip deniyor; beğendiklerimizi rafımıza ve bu siteye alıyoruz.
        </p>
        <h2>Dükkânımıza bekleriz</h2>
        <p>Yeni kahvelerimizi ilk dükkânda deniyoruz. Uğrayın, birlikte tadalım.</p>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/magaza" className="dugme">Kahvelerimiz</Link>
        <Link href="/menu" className="dugme-ikincil">Menü</Link>
      </div>
    </div>
  );
}
