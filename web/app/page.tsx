import Link from "next/link";
import { UrunKarti } from "@/components/UrunKarti";
import { SITE } from "@/lib/site";
import { urunleriGetir } from "@/lib/sunucu";

export default async function AnaSayfa() {
  let urunler = await urunleriGetir("&one_cikan=true");
  if (!urunler.length) urunler = await urunleriGetir();
  urunler = urunler.slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden bg-murekkep text-zemin">
        <div className="kap grid items-center gap-10 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zemin/60">Ayvalık · Nitelikli kahve</p>
            <h1 className="mt-4 font-baslik text-5xl leading-[1.05] md:text-6xl">
              Kahvenin en eski hâli, <em className="text-[#e3a17f]">bugünün özeniyle.</em>
            </h1>
            <p className="mt-6 max-w-md text-lg text-zemin/75">
              Küçük partiler halinde kavurduğumuz çekirdekler, demleme ekipmanları ve Ayvalık&apos;ın taş sokaklarında bir fincan sakinlik.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/magaza" className="dugme bg-zemin text-murekkep hover:bg-[#e3a17f] hover:text-murekkep">
                Kahveleri keşfet
              </Link>
              <Link href="/iletisim" className="dugme-ikincil border-zemin/40 hover:border-zemin hover:text-zemin">
                Kafeye uğra
              </Link>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md" aria-hidden>
            <div className="absolute inset-0 rounded-full bg-vurgu/30 blur-3xl" />
            <div className="absolute inset-[12%] rounded-full border border-zemin/20" />
            <div className="absolute inset-[24%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#7a4a2e,#2b1e16_70%)] shadow-2xl" />
            <div className="absolute inset-[36%] rounded-full bg-[radial-gradient(circle_at_40%_35%,#c58a5c,#5a3420_75%)]" />
          </div>
        </div>
      </section>

      <section className="kap grid gap-8 py-16 sm:grid-cols-3">
        {[
          ["Taze kavrum", "Her hafta küçük partiler halinde kavrulur, kavrum tarihiyle gönderilir."],
          ["İstediğin öğütme", "Çekirdek ya da demleme yöntemine göre öğütülmüş: espresso'dan Türk kahvesine."],
          ["Kapına kadar", "Türkiye geneline kargo, Ayvalık içine aynı gün teslimat ya da kafeden teslim al."],
        ].map(([b, m]) => (
          <div key={b} className="border-t border-murekkep pt-5">
            <h2 className="font-baslik text-xl">{b}</h2>
            <p className="mt-2 text-soluk">{m}</p>
          </div>
        ))}
      </section>

      {urunler.length > 0 && (
        <section className="kap py-10">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-baslik text-3xl md:text-4xl">Bu hafta kavurduklarımız</h2>
            <Link href="/magaza" className="text-sm underline underline-offset-4 hover:text-vurgu">
              Tümü
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {urunler.map((u) => (
              <UrunKarti key={u.id} urun={u} />
            ))}
          </div>
        </section>
      )}

      <section className="kap py-16">
        <div className="grid overflow-hidden rounded-3xl bg-zeytin text-zemin md:grid-cols-2">
          <div className="p-10 md:p-14">
            <p className="text-sm uppercase tracking-[0.2em] text-zemin/60">Kafemiz</p>
            <h2 className="mt-3 font-baslik text-3xl md:text-4xl">Ayvalık&apos;ta bir mola</h2>
            <p className="mt-4 text-zemin/80">
              Espresso bazlı içecekler, filtre kahveler ve ev yapımı tatlılar. Çekirdeğini seç, nasıl demlendiğini izle; sorularını barista&apos;mıza sor.
            </p>
            <div className="mt-6 space-y-1 text-sm text-zemin/80">
              <p>{SITE.adres}</p>
              {SITE.saatler.map((s) => (
                <p key={s.gun}>
                  {s.gun}: {s.saat}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/menu" className="dugme bg-zemin text-murekkep hover:bg-kum hover:text-murekkep">
                Menüye göz at
              </Link>
              <a href={SITE.haritaAdresi} target="_blank" rel="noopener" className="dugme-ikincil border-zemin/40 hover:border-zemin hover:text-zemin">
                Yol tarifi
              </a>
            </div>
          </div>
          <div className="min-h-64 bg-[linear-gradient(135deg,#6f7d48,#3f4a25)]" aria-hidden />
        </div>
      </section>
    </>
  );
}
