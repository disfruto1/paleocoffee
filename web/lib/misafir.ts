// Uye olmadan verilen siparislerin erisim kodlari. Kod siparis sayfasinin adresinde (# sonrasi) ve
// e-postadaki baglantida durur; ayrica bu tarayicida hatirlanir ki musteri sayfayi kapatsa da donebilsin.
import { api } from "./api";
import type { Siparis } from "./types";

const ANAHTAR = "paleo_misafir_siparisleri";

function oku(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(ANAHTAR) || "{}");
  } catch {
    return {};
  }
}

export function kodKaydet(id: number, kod: string) {
  try {
    localStorage.setItem(ANAHTAR, JSON.stringify({ ...oku(), [id]: kod }));
  } catch {
    // saklanamazsa musteri e-postadaki baglantiyi kullanir
  }
}

export function kodAl(id: number | string): string | null {
  return oku()[String(id)] || null;
}

/** PayTR siparis numarasindan (PALEO12T...) bizim siparis numaramiz. */
export function oidSiparisNo(oid: string): number | null {
  const m = /^PALEO(\d+)T/.exec(oid);
  return m ? Number(m[1]) : null;
}

export const kodBasligi = (kod: string) => ({ "X-Siparis-Kodu": kod });

export function misafirSiparisAdresi(id: number, kod: string) {
  return `/siparis/${id}#${kod}`;
}

export const misafirSiparisi = (id: number | string, kod: string) => api<Siparis>(`/misafir/siparisler/${id}`, { basliklar: kodBasligi(kod) });
