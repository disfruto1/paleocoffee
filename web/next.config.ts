import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker imaji icin: yalnizca calismak icin gereken dosyalar kopyalanir (bkz. web/Dockerfile)
  output: "standalone",
  poweredByHeader: false,
};

export default nextConfig;
