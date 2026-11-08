// Tarayicidan API cagrilari. Oturum anahtari tarayicida saklanir ve her istege eklenir.

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

const TOKEN_ANAHTARI = "paleo_token";

export class ApiHatasi extends Error {
  constructor(public durum: number, mesaj: string) {
    super(mesaj);
  }
}

export function tokenAl(): string | null {
  try {
    return localStorage.getItem(TOKEN_ANAHTARI);
  } catch {
    return null;
  }
}

export function tokenYaz(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_ANAHTARI, token);
    else localStorage.removeItem(TOKEN_ANAHTARI);
  } catch {
    // gizli pencere vb.: oturum yalnizca bu sayfa acikken surer
  }
  window.dispatchEvent(new Event("paleo-oturum"));
}

// API'nin Ingilizce karakterli hata mesajlarini musteriye okunur hale getirir
const MESAJLAR: Record<string, string> = {
  "E-posta veya sifre yanlis": "E-posta veya şifre yanlış.",
  "Bu e-posta zaten kayitli": "Bu e-posta ile zaten bir hesap var.",
  "Kod gecersiz veya suresi dolmus": "Kod geçersiz veya süresi dolmuş.",
  "Teslimat adresi gerekli": "Teslimat adresi gerekli.",
  "Bu teslimat yontemi su an kullanilamiyor": "Bu teslimat yöntemi şu an kullanılamıyor.",
  "Kart ile odeme icin telefon numarasi gerekli": "Kartla ödeme için telefon numarası gerekli.",
  "Kart ile odeme su an kullanilamiyor": "Kartla ödeme şu an kullanılamıyor.",
  "Odeme baslatilamadi. Lutfen tekrar deneyin.": "Ödeme başlatılamadı. Lütfen tekrar deneyin.",
  "Metinler guncellendi, lutfen yeniden okuyun": "Metinler güncellendi, lütfen sayfayı yenileyip tekrar okuyun.",
  "Havale ile odeme su an kullanilamiyor": "Havale ile ödeme şu an kullanılamıyor.",
  "Gorsel en fazla 12 MB olabilir": "Görsel en fazla 12 MB olabilir.",
  "Yalnizca JPG, PNG veya WebP yuklenebilir": "Yalnızca JPG, PNG veya WebP yüklenebilir.",
  "Gorsel okunamadi": "Görsel okunamadı. Başka bir dosya deneyin.",
};

function mesajCevir(detay: unknown, durum: number): string {
  if (typeof detay === "string") {
    if (MESAJLAR[detay]) return MESAJLAR[detay];
    if (detay.startsWith("Yetersiz stok: ")) return `Stok yetersiz: ${detay.slice(15)}. Sepetteki adedi azaltın.`;
    if (detay.startsWith("Urun bulunamadi")) return "Sepetinizdeki bir ürün artık satışta değil. Sepetten çıkarın.";
    if (detay.startsWith("Secenek secilmeli")) return "Sepetinizdeki bir ürünün seçeneği artık satışta değil. Sepetten çıkarıp yeniden ekleyin.";
    return detay;
  }
  if (Array.isArray(detay)) {
    const alanlar: string[] = detay.map((d: { loc?: unknown[] }) => String(d?.loc?.[d.loc.length - 1] ?? ""));
    if (alanlar.includes("e_posta")) return "Geçerli bir e-posta adresi girin.";
    if (alanlar.includes("telefon")) return "Telefon numarasını kontrol edin (örn. 05xx xxx xx xx).";
    if (alanlar.some((a) => a.includes("adres"))) return "Adres en az 10 karakter olmalı.";
    return "Girilen bilgileri kontrol edin.";
  }
  if (durum === 429) return "Çok fazla deneme yapıldı. Biraz sonra tekrar deneyin.";
  return "Bir sorun oluştu. Lütfen tekrar deneyin.";
}

type Secenekler = { method?: string; json?: unknown; form?: Record<string, string>; dosya?: FormData };

export async function api<T>(yol: string, s: Secenekler = {}): Promise<T> {
  const basliklar: Record<string, string> = {};
  const token = tokenAl();
  if (token) basliklar.Authorization = `Bearer ${token}`;
  let govde: BodyInit | undefined;
  if (s.json !== undefined) {
    basliklar["Content-Type"] = "application/json";
    govde = JSON.stringify(s.json);
  } else if (s.form) {
    govde = new URLSearchParams(s.form);
  } else if (s.dosya) {
    govde = s.dosya; // tarayici Content-Type'i kendisi yazar
  }
  let cevap: Response;
  try {
    cevap = await fetch(API_URL + yol, { method: s.method || (govde ? "POST" : "GET"), headers: basliklar, body: govde });
  } catch {
    throw new ApiHatasi(0, "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin.");
  }
  if (cevap.status === 401 && token) {
    tokenYaz(null); // suresi dolan oturum
  }
  if (!cevap.ok) {
    let detay: unknown;
    try {
      detay = (await cevap.json()).detail;
    } catch {
      detay = undefined;
    }
    throw new ApiHatasi(cevap.status, mesajCevir(detay, cevap.status));
  }
  return cevap.json() as Promise<T>;
}
