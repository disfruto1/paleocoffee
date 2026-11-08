// Kafenin bilgileri. Adres, telefon ve saatler Google Haritalar kaydini yansitan kafe rehberlerinden
// derlendi (Kasim 2026); kaynaklar saatlerde farkli. Kafeyle dogrulanmali. Bos alanlar sitede gosterilmez.
export const SITE = {
  ad: "Paleo Coffee",
  tamAd: "Paleo Coffee Ayvalık",
  slogan: "Ayvalık'ta özenle kavrulmuş nitelikli kahve",
  adres: "Zekibey Mah. 13 Nisan Cad. No:51, Ayvalık / Balıkesir",
  haritaAdresi: "https://www.google.com/maps/search/?api=1&query=Paleo+Coffee+13+Nisan+Cad.+51+Ayval%C4%B1k",
  telefon: "0530 265 91 03",
  eposta: "", // [doldurulacak] site alan adindaki adres, ornek: merhaba@paleocoffee.com.tr
  instagram: "", // [doldurulacak] ornek: https://www.instagram.com/kullanici-adi
  saatler: [{ gun: "Her gün", saat: "09:00 – 18:00" }],
  telefonBaglantisi: "tel:+905302659103",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
};
