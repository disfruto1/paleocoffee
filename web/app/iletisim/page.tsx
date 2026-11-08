import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Ziyaret ve iletişim", description: "Paleo Coffee Ayvalık adresi, çalışma saatleri ve iletişim bilgileri." };

export default function Iletisim() {
  return (
    <div className="kap py-16">
      <h1 className="font-baslik text-4xl md:text-5xl">Ziyaret ve iletişim</h1>
      <div className="mt-12 grid gap-12 md:grid-cols-3">
        <section>
          <h2 className="font-baslik text-xl">Adres</h2>
          <p className="mt-2 text-soluk">{SITE.adres}</p>
          <a href={SITE.haritaAdresi} target="_blank" rel="noopener" className="dugme-ikincil mt-4">
            Haritada aç
          </a>
        </section>
        <section>
          <h2 className="font-baslik text-xl">Çalışma saatleri</h2>
          <dl className="mt-2 space-y-1 text-soluk">
            {SITE.saatler.map((s) => (
              <div key={s.gun} className="flex justify-between gap-4">
                <dt>{s.gun}</dt>
                <dd className="tabular-nums">{s.saat}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section>
          <h2 className="font-baslik text-xl">Bize ulaşın</h2>
          <p className="mt-2 text-soluk">{SITE.telefon}</p>
          <p className="text-soluk">{SITE.eposta}</p>
          <a href={SITE.instagram} target="_blank" rel="noopener" className="mt-2 inline-block underline underline-offset-4 hover:text-vurgu">
            Instagram
          </a>
        </section>
      </div>
      <section className="mt-16 bg-kum p-8 md:p-10">
        <h2 className="font-baslik text-2xl">Toptan ve kafe işbirlikleri</h2>
        <p className="mt-2 max-w-2xl text-soluk">
          İşletmeniz için düzenli kahve tedariki veya ekipman danışmanlığı istiyorsanız e-posta ile yazın, size özel teklif hazırlayalım.
        </p>
      </section>
    </div>
  );
}
