import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker imaji icin: yalnizca calismak icin gereken dosyalar kopyalanir (bkz. web/Dockerfile)
  output: "standalone",
  poweredByHeader: false,
  // Yonetim panelinden yuklenen gorseller API'de durur, site kendi adresinden sunar
  async rewrites() {
    const api = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
    return [{ source: "/yuklenen/:dosya", destination: `${api}/yuklenen/:dosya` }];
  },
};

export default nextConfig;
