import Link from "next/link";
import { UrunKarti } from "@/components/UrunKarti";
import { SITE } from "@/lib/site";
import { urunleriGetir } from "@/lib/sunucu";

const MENSEILER = ["Etiyopya", "Kolombiya", "Kenya", "Brezilya", "Guatemala", "Ruanda", "Kosta Rika", "Endonezya"];

export default async function AnaSayfa() {
  let urunler = await urunleriGetir("&one_cikan=true");
  if (!urunler.length) urunler = await urunleriGetir();
  urunler = urunler.slice(0, 4);

  return (
    <>
      <section className="grid min-h-[calc(100svh-6.5rem)] bg-murekkep text-zemin lg:grid-cols-2">
        <div className="kap flex flex-col justify-end py-14 lg:mx-0 lg:max-w-none lg:px-12 lg:py-20">
          <p className="etiket text-zemin/60">Est. 2021 · Ayvalık · Kahvaltı · Üçüncü nesil kahve</p>
          <h1 className="font-baslik mt-6 text-[clamp(3.5rem,9vw,8rem)] leading-[1.1] font-semibold">
            Kahvenin
            <br />
            en eski
            <br />
            <span className="text-vurgu">hâli.</span>
          </h1>
          <p className="mt-8 max-w-md text-lg text-zemin/70">
            Ayvalık&apos;ın taş sokaklarında kahvaltı, bagel sandviçler ve üçüncü nesil kahve. Evde demlemek için seçtiğimiz çekirdekler ve ekipmanlar da burada.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/urunler" className="dugme bg-zemin text-murekkep hover:bg-vurgu hover:text-zemin">Ürünleri keşfet</Link>
            <Link href="/iletisim" className="dugme-ikincil hover:text-vurgu">Dükkâna uğra</Link>
          </div>
        </div>
        <div
          className="relative min-h-80 overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: "url(/gorseller/hero.jpg), linear-gradient(160deg, #5b3a26, #1c1a17 80%)" }}
          role="img"
          aria-label="Paleo Coffee & More"
        >
          {SITE.heroVideo && (
            // Sessiz ve dongulu; hareket azaltma tercihinde fotograf kalir (globals.css)
            <video className="hero-video absolute inset-0 h-full w-full object-cover" src={SITE.heroVideo} poster="/gorseller/hero.jpg" autoPlay muted loop playsInline aria-hidden />
          )}
        </div>
      </section>

      <div className="overflow-hidden border-b border-murekkep bg-vurgu py-3 text-zemin" aria-hidden>
        <div className="kayan flex w-max">
          {[0, 1].map((i) => (
            <p key={i} className="font-baslik flex shrink-0 text-xl">
              {MENSEILER.map((m) => (
                <span key={m} className="px-6">{m} <span className="pl-6 text-zemin/50">✳</span></span>
              ))}
            </p>
          ))}
        </div>
      </div>

      {urunler.length > 0 && (
        <section className="kap py-20">
          <div className="mb-10 flex items-end justify-between gap-4 border-b border-murekkep pb-4">
            <h2 className="font-baslik text-4xl md:text-6xl">Öne çıkan ürünler</h2>
            <Link href="/urunler" className="etiket shrink-0 hover:text-vurgu">Tümünü gör →</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
            {urunler.map((u) => <UrunKarti key={u.id} urun={u} />)}
          </div>
        </section>
      )}

      <section className="border-y border-murekkep bg-kum">
        <div className="kap py-24 text-center">
          <p className="etiket text-soluk">Neden Paleo</p>
          <p className="font-baslik mx-auto mt-6 max-w-5xl text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.08] font-semibold">
            İyi bir sabahın sırrı karmaşık tariflerde değil; doğru çekirdekte, <span className="text-vurgu">özenli demlemede</span>, sıcak bir kahvaltıda.
          </p>
        </div>
      </section>

      <section className="kap mt-px">
        <div className="grid gap-px border border-t-0 border-murekkep bg-murekkep md:grid-cols-3">
        {[
          ["01", "Seçilmiş çekirdekler", "Güvendiğimiz kavurmacılardan seçtiğimiz nitelikli kahveler; önce dükkânda deniyor, sonra rafımıza alıyoruz."],
          ["02", "İstediğin öğütme", "Çekirdek ya da demleme yöntemine göre öğütülmüş: espresso'dan Türk kahvesine."],
          ["03", "Kapına kadar", "Türkiye geneline kargo, Ayvalık içine aynı gün teslimat ya da dükkândan teslim al."],
        ].map(([no, b, m]) => (
          <div key={no} className="bg-zemin p-8 md:p-10">
            <p className="etiket text-vurgu">{no}</p>
            <h3 className="font-baslik mt-4 text-2xl">{b}</h3>
            <p className="mt-3 text-soluk">{m}</p>
          </div>
        ))}
        </div>
      </section>

      <section className="kap mt-20 grid md:grid-cols-2">
        <div
          className="min-h-80 bg-cover bg-center"
          style={{ backgroundImage: "url(/gorseller/kafe.jpg), linear-gradient(135deg, #6b7a45, #2f3820)" }}
          role="img"
          aria-label="Paleo Coffee dükkânı"
        />
        <div className="bg-murekkep p-10 text-zemin md:p-14">
          <p className="etiket text-zemin/60">Dükkânımız</p>
          <h2 className="font-baslik mt-4 text-5xl leading-[1.1] md:text-6xl">Ayvalık&apos;ta bir mola</h2>
          <p className="mt-6 text-zemin/75">
            Güne kahvaltıyla başla, öğlen bir bagel sandviçle devam et. Espresso bazlı içecekler ve filtre kahveler gün boyu; sorularını baristamıza sor.
          </p>
          <dl className="mt-8 border-t border-zemin/20 text-sm">
            <div className="flex justify-between gap-4 border-b border-zemin/20 py-3">
              <dt className="etiket text-zemin/50">Adres</dt>
              <dd className="text-right">{SITE.adres}</dd>
            </div>
            {SITE.saatler.map((s) => (
              <div key={s.gun} className="flex justify-between gap-4 border-b border-zemin/20 py-3">
                <dt className="etiket text-zemin/50">{s.gun}</dt>
                <dd className="tabular-nums">{s.saat}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className="dugme bg-zemin text-murekkep hover:bg-vurgu hover:text-zemin">Menü</Link>
            <a href={SITE.haritaAdresi} target="_blank" rel="noopener" className="dugme-ikincil hover:text-vurgu">Yol tarifi</a>
          </div>
        </div>
      </section>
    </>
  );
}
