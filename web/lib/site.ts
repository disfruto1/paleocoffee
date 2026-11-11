// Kafenin bilgileri (kafeden alindi, Kasim 2026). Bos alanlar sitede gosterilmez.
// Saatler kis saatleridir; yazin degisecek.
export const SITE = {
  ad: "Paleo Coffee",
  tamAd: "Paleo Coffee & More",
  slogan: "Carefully sourced, better together · Est. 2021",
  adres: "Zekibey Mah. 13 Nisan Cad. 33003 Sk. No:1/A, Ayvalık / Balıkesir",
  haritaAdresi: "https://www.google.com/maps/search/?api=1&query=Paleo+Coffee+Ayval%C4%B1k",
  telefon: "0543 651 42 96",
  eposta: "", // [doldurulacak] site alan adindaki adres, ornek: merhaba@paleocoffee.com.tr
  instagram: "https://www.instagram.com/paleocoffeeayvalik",
  instagramAdi: "@paleocoffeeayvalik",
  saatler: [
    { gun: "Salı hariç her gün", saat: "08:30 – 18:00" },
    { gun: "Salı", saat: "Kapalı" },
  ],
  // Ana sayfanin ust bolumundeki video (web/public/gorseller altinda, ornek "/gorseller/hero.mp4").
  // Bos ise /gorseller/hero.jpg fotografi gosterilir.
  heroVideo: "",
  telefonBaglantisi: "tel:+905436514296",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
};
