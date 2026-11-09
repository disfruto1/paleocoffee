import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Oswald } from "next/font/google";
import { Alt } from "@/components/Alt";
import { Saglayicilar } from "@/components/Saglayicilar";
import { Ust } from "@/components/Ust";
import { SITE } from "@/lib/site";
import "./globals.css";

const oswald = Oswald({ subsets: ["latin", "latin-ext"], variable: "--font-oswald" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--font-plex-mono" });
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.tamAd} | Ayvalık'ta kahvaltı ve üçüncü nesil kahve`, template: `%s | ${SITE.tamAd} Ayvalık` },
  description: "Ayvalık'ta kahvaltı, bagel sandviçler ve üçüncü nesil kahve. Çekirdek ve öğütülmüş nitelikli kahve, demleme ekipmanları; Türkiye geneline kargo, Ayvalık içi teslimat.",
  openGraph: { siteName: SITE.tamAd, locale: "tr_TR", type: "website" },
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
