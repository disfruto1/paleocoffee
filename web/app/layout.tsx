import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Oswald } from "next/font/google";
import { Alt } from "@/components/Alt";
import { Saglayicilar } from "@/components/Saglayicilar";
import { Ust } from "@/components/Ust";
import { SATIS_ACIK, SITE } from "@/lib/site";
import "./globals.css";

const oswald = Oswald({ subsets: ["latin", "latin-ext"], variable: "--font-oswald" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--font-plex-mono" });
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.tamAd} | Ayvalık'ta kahvaltı ve üçüncü nesil kahve`, template: `%s | ${SITE.tamAd} Ayvalık` },
  description: SATIS_ACIK
    ? "Ayvalık'ta kahvaltı, bagel sandviçler ve üçüncü nesil kahve. Çekirdek ve öğütülmüş nitelikli kahve, demleme ekipmanları; Türkiye geneline kargo, Ayvalık içi teslimat."
    : "Ayvalık'ta kahvaltı, bagel ve kruvasan sandviçler, üçüncü nesil kahve. Zekibey, 13 Nisan Caddesi; salı hariç her gün 08:30–18:00.",
  // Paylasim onizlemesi (WhatsApp, Instagram vb.) icin dukkanin fotografi
  openGraph: { siteName: SITE.tamAd, locale: "tr_TR", type: "website", images: [{ url: "/gorseller/hero.jpg", width: 1125, height: 2000 }] },
};

export default function KokYerlesim({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${oswald.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Saglayicilar>
          <Ust />
          <main className="flex-1">{children}</main>
          <Alt />
        </Saglayicilar>
      </body>
    </html>
  );
}
