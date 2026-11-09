import type { Metadata } from "next";
import Link from "next/link";
import { UrunKarti } from "@/components/UrunKarti";
import { kategorileriGetir, urunleriGetir } from "@/lib/sunucu";

export const metadata: Metadata = {
  title: "Mağaza",
  description: "Çekirdek ve öğütülmüş nitelikli kahveler, demleme ekipmanları.",
};

export default async function Magaza({ searchParams }: { searchParams: Promise<{ kategori?: string; q?: string }> }) {
  const { kategori, q } = await searchParams;
  const kategoriId = kategori && /^\d+$/.test(kategori) ? kategori : "";
  const arama = (q || "").slice(0, 100);
  const sorgu = (kategoriId ? `&kategori_id=${kategoriId}` : "") + (arama ? `&q=${encodeURIComponent(arama)}` : "");
  const [urunler, kategoriler] = await Promise.all([urunleriGetir(sorgu), kategorileriGetir()]);

  return (
    <div className="kap py-12">
      <h1 className="font-baslik border-b border-murekkep pb-4 text-6xl font-semibold md:text-8xl">Kahveler</h1>
      <p className="mt-3 max-w-xl text-soluk">Çekirdek ya da demleme yöntemine göre öğütülmüş kahveler ve evde iyi kahve için ekipmanlar.</p>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Link href="/magaza" className={` border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] ${!kategoriId ? "border-murekkep bg-murekkep text-zemin" : "border-murekkep hover:bg-kum"}`}>
          Tümü
        </Link>
        {kategoriler.map((k) => (
          <Link
            key={k.id}
            href={`/magaza?kategori=${k.id}`}
            className={` border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] ${kategoriId === String(k.id) ? "border-murekkep bg-murekkep text-zemin" : "border-murekkep hover:bg-kum"}`}
          >
            {k.ad}
          </Link>
        ))}
        <form action="/magaza" className="ml-auto w-full sm:w-64">
          {kategoriId && <input type="hidden" name="kategori" value={kategoriId} />}
          <input name="q" defaultValue={arama} placeholder="Ara: Etiyopya, V60…" className="girdi py-2 text-sm" aria-label="Ürün ara" />
        </form>
      </div>

      {urunler.length ? (
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
          {urunler.map((u) => (
            <UrunKarti key={u.id} urun={u} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-soluk">{arama ? `"${arama}" için ürün bulunamadı.` : "Ürünler yakında burada."}</p>
      )}
    </div>
  );
}
