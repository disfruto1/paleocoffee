import Link from "next/link";
import { fiyat, KAVRUM, listeFiyati, stoktaYok, urunAdresi } from "@/lib/bicim";
import type { Urun } from "@/lib/types";
import { UrunGorseli } from "./UrunGorseli";

export function UrunKarti({ urun }: { urun: Urun }) {
  const f = listeFiyati(urun);
  const yok = stoktaYok(urun);
  return (
    <Link href={urunAdresi(urun)} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-kum">
        <UrunGorseli urun={urun} className="transition duration-500 group-hover:scale-105" />
        {yok && <span className="absolute left-3 top-3 rounded-full bg-zemin px-3 py-1 text-xs">Tükendi</span>}
      </div>
      <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <h3 className="font-baslik text-lg leading-snug group-hover:text-vurgu">{urun.ad}</h3>
          <p className="text-sm text-soluk">
            {[urun.mensei, urun.kavrum && KAVRUM[urun.kavrum]].filter(Boolean).join(" · ") || " "}
          </p>
        </div>
        <p className="text-sm tabular-nums sm:whitespace-nowrap">
          {f.baslayan && <span className="text-soluk">başlayan </span>}
          {fiyat(f.tutar)}
        </p>
      </div>
      {urun.tat_notlari && <p className="mt-1 text-sm italic text-soluk">{urun.tat_notlari}</p>}
    </Link>
  );
}
