import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker imaji icin: yalnizca calismak icin gereken dosyalar kopyalanir (bkz. web/Dockerfile)
  output: "standalone",
  poweredByHeader: false,
  // Yonetim panelinden yuklenen gorseller API'de durur, site kendi adresinden sunar
  async rewrites() {
    const genel = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    const api = (process.env.API_URL || (genel.startsWith("http") ? genel : "") || "http://localhost:8000").replace(/\/$/, "");
    const yonlendirmeler = [{ source: "/yuklenen/:dosya", destination: `${api}/yuklenen/:dosya` }];
    // NEXT_PUBLIC_API_URL site ici bir yolsa (ornegin /api) tarayici API'ye sitenin kendi adresinden ulasir.
    // Onizleme ortamlari icin; yayinda API ayri alan adindadir (bkz. deploy/docker-compose.yml)
    if (genel.startsWith("/")) yonlendirmeler.push({ source: `${genel}/:yol*`, destination: `${api}/:yol*` });
    return yonlendirmeler;
  },
};

export default nextConfig;
