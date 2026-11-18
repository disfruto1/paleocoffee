import Link from "next/link";
import { SATIS_ACIK } from "@/lib/site";

export default function Bulunamadi() {
  return (
    <div className="kap py-28 text-center">
      <h1 className="font-baslik text-4xl">Sayfa bulunamadı</h1>
      <p className="mt-3 text-soluk">
        {SATIS_ACIK ? "Aradığınız sayfa taşınmış ya da satıştan kalkmış olabilir." : "Aradığınız sayfa taşınmış olabilir."}
      </p>
      {SATIS_ACIK ? (
        <Link href="/urunler" className="dugme mt-8">Ürünlere dön</Link>
      ) : (
        <Link href="/" className="dugme mt-8">Ana sayfaya dön</Link>
      )}
    </div>
  );
}
