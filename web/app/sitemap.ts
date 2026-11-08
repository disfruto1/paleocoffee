import type { MetadataRoute } from "next";
import { urunAdresi } from "@/lib/bicim";
import { SITE } from "@/lib/site";
import { urunleriGetir } from "@/lib/sunucu";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urunler = await urunleriGetir();
  const sabit = ["", "/magaza", "/menu", "/hikayemiz", "/iletisim"].map((y) => ({ url: SITE.url + y }));
  return [...sabit, ...urunler.map((u) => ({ url: SITE.url + urunAdresi(u) }))];
}
