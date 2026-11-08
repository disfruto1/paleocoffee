import type { Metadata } from "next";

export const metadata: Metadata = { title: "Menü", description: "Paleo Coffee Ayvalık kafe menüsü: espresso, filtre kahve, soğuk içecekler ve tatlılar." };

// [TASLAK] Urunler ve fiyatlar kafenin gercek menusuyle degistirilmeli. Bu menu siteden satilmaz, kafede gecerlidir.
const MENU: { baslik: string; urunler: [string, string, string?][] }[] = [
  {
    baslik: "Espresso bazlı",
    urunler: [
      ["Espresso", "[00] ₺"],
      ["Americano", "[00] ₺"],
      ["Cortado", "[00] ₺"],
      ["Flat white", "[00] ₺"],
      ["Latte", "[00] ₺", "Yulaf veya badem sütüyle de hazırlanır"],
      ["Cappuccino", "[00] ₺"],
    ],
  },
  {
    baslik: "Demleme",
    urunler: [
      ["V60", "[00] ₺", "Günün çekirdeğiyle"],
      ["Chemex (2 kişilik)", "[00] ₺"],
      ["AeroPress", "[00] ₺"],
      ["Türk kahvesi", "[00] ₺", "Közde"],
    ],
  },
  {
    baslik: "Soğuk",
    urunler: [
      ["Cold brew", "[00] ₺"],
      ["Iced latte", "[00] ₺"],
      ["Espresso tonik", "[00] ₺"],
    ],
  },
  {
    baslik: "Yanına",
    urunler: [
      ["Günün keki", "[00] ₺"],
      ["Zeytinyağlı kurabiye", "[00] ₺", "Ayvalık zeytinyağıyla"],
    ],
  },
];

export default function Menu() {
  return (
    <div className="kap max-w-4xl py-16">
      <h1 className="font-baslik text-4xl md:text-5xl">Menü</h1>
      <p className="mt-3 text-soluk">Kafemizde geçerlidir. Fiyatlara KDV dahildir.</p>
      <div className="mt-12 grid gap-12 md:grid-cols-2">
        {MENU.map((b) => (
          <section key={b.baslik}>
            <h2 className="border-b border-murekkep pb-2 font-baslik text-2xl">{b.baslik}</h2>
            <ul className="mt-4 space-y-4">
              {b.urunler.map(([ad, f, not]) => (
                <li key={ad}>
                  <div className="flex items-baseline gap-2">
                    <span>{ad}</span>
                    <span className="flex-1 border-b border-dotted border-cizgi" />
                    <span className="tabular-nums">{f}</span>
                  </div>
                  {not && <p className="text-sm text-soluk">{not}</p>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
