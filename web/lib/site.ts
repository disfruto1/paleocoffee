// Kafenin bilgileri. [koseli parantez] icindekiler gercek bilgilerle degistirilmeli.
export const SITE = {
  ad: "Paleo Coffee",
  tamAd: "Paleo Coffee Ayvalık",
  slogan: "Ayvalık'ta özenle kavrulmuş nitelikli kahve",
  adres: "[Mahalle, Cadde, No], Ayvalık / Balıkesir",
  haritaAdresi: "https://www.google.com/maps/search/?api=1&query=Paleo+Coffee+Ayval%C4%B1k",
  telefon: "[0 (266) 000 00 00]",
  eposta: "[merhaba@alanadi]",
  instagram: "https://www.instagram.com/[kullanici-adi]",
  saatler: [
    { gun: "Pazartesi – Cuma", saat: "[08:00 – 20:00]" },
    { gun: "Cumartesi – Pazar", saat: "[09:00 – 21:00]" },
  ],
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
};
