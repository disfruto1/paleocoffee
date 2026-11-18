import type { MetadataRoute } from "next";
import { urunAdresi } from "@/lib/bicim";
import { SATIS_ACIK, SITE } from "@/lib/site";
import { urunleriGetir } from "@/lib/sunucu";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sabit = ["", ...(SATIS_ACIK ? ["/urunler"] : []), "/menu", "/hikayemiz", "/iletisim"].map((y) => ({ url: SITE.url + y }));
  if (!SATIS_ACIK) return sabit;
  const urunler = await urunleriGetir();
  return [...sabit, ...urunler.map((u) => ({ url: SITE.url + urunAdresi(u) }))];
}
