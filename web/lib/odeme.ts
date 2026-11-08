import { api } from "./api";

/** Kart odemesini baslatir ve musteriyi PayTR'in guvenli odeme sayfasina yollar. */
export async function kartlaOde(siparisId: number, telefon: string) {
  const r = await api<{ odeme_url: string }>(`/siparisler/${siparisId}/odeme/paytr`, { json: { telefon: telefon.trim() || null } });
  window.location.href = r.odeme_url;
}

/** Sepetteki teslimat ucreti tahmini. Kesin tutar siparis olusunca sunucudan gelir. */
export function teslimatUcreti(ucret: string, araToplam: number, ucretsizSinir: string | null): number {
  if (ucretsizSinir !== null && araToplam >= Number(ucretsizSinir)) return 0;
  return Number(ucret);
}
