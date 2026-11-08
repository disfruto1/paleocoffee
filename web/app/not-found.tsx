import Link from "next/link";

export default function Bulunamadi() {
  return (
    <div className="kap py-28 text-center">
      <h1 className="font-baslik text-4xl">Sayfa bulunamadı</h1>
      <p className="mt-3 text-soluk">Aradığınız sayfa taşınmış ya da satıştan kalkmış olabilir.</p>
      <Link href="/magaza" className="dugme mt-8">Mağazaya dön</Link>
    </div>
  );
}
