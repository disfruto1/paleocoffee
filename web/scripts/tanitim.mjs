// Ilk asama (satis kapali) icin tanitim sitesini sabit dosyalar olarak uretir: web/out
// Sunucu gerekmez; out klasoru Cloudflare Pages gibi herhangi bir statik barindirmaya yuklenir.
// Satis bolumleri (urunler, sepet, odeme, uyelik, yonetim) bu derlemeye hic girmez.
// Kullanim: NEXT_PUBLIC_SITE_URL=https://alanadi.com npm run build:tanitim
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..");
const GECICI = join(KOK, ".tanitim");
const CIKTI = join(KOK, "out");
const ATLANAN = new Set(["node_modules", ".next", "out", ".tanitim", "scripts"]);
const SATIS_SAYFALARI = ["urunler", "urun", "sepet", "odeme", "giris", "kayit", "sifremi-unuttum", "hesabim", "siparis", "yonetim", "sozlesmeler"];

rmSync(GECICI, { recursive: true, force: true });
rmSync(CIKTI, { recursive: true, force: true });
mkdirSync(GECICI);
for (const ad of readdirSync(KOK)) {
  if (!ATLANAN.has(ad)) cpSync(join(KOK, ad), join(GECICI, ad), { recursive: true });
}
symlinkSync(join(KOK, "node_modules"), join(GECICI, "node_modules"), "dir");
for (const sayfa of SATIS_SAYFALARI) rmSync(join(GECICI, "app", sayfa), { recursive: true, force: true });

writeFileSync(
  join(GECICI, "next.config.ts"),
  `import type { NextConfig } from "next";
const nextConfig: NextConfig = { output: "export", poweredByHeader: false, turbopack: { root: ${JSON.stringify(KOK)} } };
export default nextConfig;
`,
);

const env = { ...process.env, NEXT_PUBLIC_SATIS_ACIK: "0", NEXT_TELEMETRY_DISABLED: "1" };
if (!env.NEXT_PUBLIC_SITE_URL) console.warn("Uyari: NEXT_PUBLIC_SITE_URL verilmedi; sitemap ve paylasim adresleri localhost olur.");
execFileSync(process.execPath, [join(KOK, "node_modules", "next", "dist", "bin", "next"), "build"], { cwd: GECICI, env, stdio: "inherit" });

if (!existsSync(join(GECICI, "out", "index.html"))) throw new Error("Derleme cikti uretmedi");
cpSync(join(GECICI, "out"), CIKTI, { recursive: true });
rmSync(GECICI, { recursive: true, force: true });
console.log(`Tanitim sitesi hazir: ${CIKTI}`);
