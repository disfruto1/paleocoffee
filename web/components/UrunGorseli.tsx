/* eslint-disable @next/next/no-img-element */
import type { Urun } from "@/lib/types";

// Gorseli olmayan urunde kahve cekirdegi deseni gosterilir
export function UrunGorseli({ urun, className = "" }: { urun: Pick<Urun, "ad" | "gorsel_url">; className?: string }) {
  if (urun.gorsel_url) {
    return <img src={urun.gorsel_url} alt={urun.ad} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  }
  return (
    <div className={`flex h-full w-full items-center justify-center bg-kum ${className}`} aria-hidden>
      <svg viewBox="0 0 64 64" className="h-1/3 w-1/3 text-murekkep/25">
        <ellipse cx="32" cy="32" rx="18" ry="26" fill="currentColor" transform="rotate(25 32 32)" />
        <path d="M26 10 C40 24 24 40 38 54" stroke="var(--color-kum)" strokeWidth="3" fill="none" transform="rotate(25 32 32)" />
      </svg>
    </div>
  );
}
