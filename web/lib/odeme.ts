import { api } from "./api";

/** Kart odemesini baslatir ve musteriyi PayTR'in guvenli odeme sayfasina yollar. Misafirde siparis kodu gerekir. */
export async function kartlaOde(siparisId: number, telefon: string, misafirKodu?: string) {
  const yol = misafirKodu ? `/misafir/siparisler/${siparisId}/odeme/paytr` : `/siparisler/${siparisId}/odeme/paytr`;
  const r = await api<{ odeme_url: string }>(yol, {
    json: { telefon: telefon.trim() || null },
    basliklar: misafirKodu ? { "X-Siparis-Kodu": misafirKodu } : undefined,
  });
  window.location.href = r.odeme_url;
}

/** Sepetteki teslimat ucreti tahmini. Kesin tutar siparis olusunca sunucudan gelir. */
export function teslimatUcreti(ucret: string, araToplam: number, ucretsizSinir: string | null): number {
  if (ucretsizSinir !== null && araToplam >= Number(ucretsizSinir)) return 0;
  return Number(ucret);
}
