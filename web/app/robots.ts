import type { MetadataRoute } from "next";
import { SATIS_ACIK, SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: SATIS_ACIK
      ? { userAgent: "*", allow: "/", disallow: ["/yonetim", "/hesabim", "/sepet", "/odeme", "/siparis", "/giris", "/kayit", "/sifremi-unuttum"] }
      : { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
