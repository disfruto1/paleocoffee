import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Alt } from "@/components/Alt";
import { Saglayicilar } from "@/components/Saglayicilar";
import { Ust } from "@/components/Ust";
import { SITE } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-fraunces" });
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.tamAd} | Nitelikli kahve ve kavurma`, template: `%s | ${SITE.tamAd}` },
  description: "Ayvalık'ta nitelikli kahve. Taze kavrulmuş çekirdek ve öğütülmüş kahve, demleme ekipmanları. Türkiye geneline kargo, Ayvalık içi teslimat.",
  openGraph: { siteName: SITE.tamAd, locale: "tr_TR", type: "website" },
};

export default function KokYerlesim({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${fraunces.variable} ${inter.variable}`}>
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
