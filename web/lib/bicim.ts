import type { Urun } from "./types";

const tl = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" });

export function fiyat(tutar: string | number): string {
  return tl.format(typeof tutar === "string" ? Number(tutar) : tutar);
}

export function aktifSecenekler(u: Urun) {
  return u.secenekler.filter((s) => s.aktif);
}

/** Listede gosterilen fiyat: secenekli urunde en ucuz secenek ("... TL'den baslayan"). */
export function listeFiyati(u: Urun): { tutar: string; baslayan: boolean } {
  const s = aktifSecenekler(u);
  if (!s.length) return { tutar: u.fiyat, baslayan: false };
  const enUcuz = s.reduce((a, b) => (Number(b.fiyat) < Number(a.fiyat) ? b : a));
  return { tutar: enUcuz.fiyat, baslayan: s.length > 1 };
}

export function stoktaYok(u: Urun): boolean {
  const s = aktifSecenekler(u);
  if (s.length) return s.every((x) => x.stok !== null && x.stok <= 0);
  return u.stok !== null && u.stok <= 0;
}

export function urunAdresi(u: Pick<Urun, "id" | "ad">): string {
  const kisa = u.ad
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `/urun/${u.id}${kisa ? "-" + kisa : ""}`;
}

export const KAVRUM: Record<string, string> = { acik: "Açık kavrum", orta: "Orta kavrum", koyu: "Koyu kavrum" };

export const DURUMLAR: Record<string, string> = {
  odeme_bekliyor: "Ödeme bekliyor",
  odendi: "Hazırlanıyor",
  kargoya_verildi: "Yola çıktı",
  teslim_edildi: "Teslim edildi",
  iptal_edildi: "İptal edildi",
};

/** Teslimat yontemine gore durum adi: dükkândan teslimde "yola cikti" yerine "teslime hazir". */
export function durumAdi(durum: string, yontem: string): string {
  if (durum === "kargoya_verildi") {
    if (yontem === "magazadan") return "Teslime hazır";
    if (yontem === "kargo") return "Kargoya verildi";
  }
  return DURUMLAR[durum] || durum;
}

export const TESLIMAT_ADLARI: Record<string, string> = {
  kargo: "Kargo",
  ayvalik: "Ayvalık içi teslimat",
  magazadan: "Dükkândan teslim",
};

export function tarih(t: string): string {
  return new Date(t).toLocaleString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
