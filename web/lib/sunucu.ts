// Sunucu tarafinda (sayfa olusturulurken) API'den veri okuma. Hata olursa sayfa bos liste ile acilir.
import type { Ayarlar, Kategori, Urun } from "./types";

// Urun ve stok bilgisi en fazla bu kadar saniye eski gosterilir. Kisa tutuldu: yonetici urun
// eklediginde veya stok bittiginde site hemen guncellensin. Siparis tutari zaten sunucuda hesaplanir.
const TAZELIK = 10;

const ADRES = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

async function oku<T>(yol: string, yedek: T): Promise<T> {
  try {
    const cevap = await fetch(ADRES + yol, { next: { revalidate: TAZELIK } });
    if (!cevap.ok) return yedek;
    return (await cevap.json()) as T;
  } catch {
    return yedek;
  }
}

export const urunleriGetir = (sorgu = "") => oku<Urun[]>(`/urunler?limit=100${sorgu}`, []);
export const kategorileriGetir = () => oku<Kategori[]>("/kategoriler", []);
export const ayarlariGetir = () => oku<Ayarlar | null>("/ayarlar", null);

export async function urunGetir(id: string): Promise<Urun | null | "hata"> {
  if (!/^\d+$/.test(id)) return null;
  try {
    const cevap = await fetch(`${ADRES}/urunler/${id}`, { next: { revalidate: TAZELIK } });
    if (cevap.status === 404) return null;
    if (!cevap.ok) return "hata";
    return (await cevap.json()) as Urun;
  } catch {
    return "hata";
  }
}
