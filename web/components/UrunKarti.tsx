import Link from "next/link";
import { fiyat, KAVRUM, listeFiyati, stoktaYok, urunAdresi } from "@/lib/bicim";
import type { Urun } from "@/lib/types";
import { UrunGorseli } from "./UrunGorseli";

export function UrunKarti({ urun }: { urun: Urun }) {
  const f = listeFiyati(urun);
  const yok = stoktaYok(urun);
  const ust = [urun.mensei?.split(",")[0], urun.kavrum && KAVRUM[urun.kavrum]].filter(Boolean).join(" · ");
  return (
    <Link href={urunAdresi(urun)} className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-kum">
        <UrunGorseli urun={urun} className="transition duration-700 group-hover:scale-[1.04]" />
        {yok && <span className="etiket absolute left-0 top-0 bg-murekkep px-3 py-1.5 text-zemin">Tükendi</span>}
        <span className="etiket absolute inset-x-0 bottom-0 translate-y-full bg-murekkep py-3 text-center text-zemin transition duration-300 group-hover:translate-y-0">
          İncele
        </span>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <p className="etiket min-h-4 text-soluk">{ust}</p>
        <h3 className="font-baslik mt-1 text-xl leading-[1.15] group-hover:text-vurgu">{urun.ad}</h3>
        {urun.tat_notlari && <p className="mt-1 text-sm text-soluk">{urun.tat_notlari}</p>}
        <p className="mt-auto pt-3 text-sm font-semibold tabular-nums">
          {f.baslayan && <span className="font-normal text-soluk">başlayan </span>}
          {fiyat(f.tutar)}
        </p>
      </div>
    </Link>
  );
}
