import type { Metadata } from "next";

export const metadata: Metadata = { title: "Menü", description: "Paleo Coffee Ayvalık menüsü: kahvaltı, bagel sandviçler, espresso bazlı içecekler ve demleme kahveler." };

// [TASLAK] Urunler ve fiyatlar kafenin gercek menusuyle degistirilmeli. Bu menu siteden satilmaz, kafede gecerlidir.
const MENU: { baslik: string; not?: string; urunler: [string, string, string?][] }[] = [
  {
    baslik: "Kahvaltı",
    urunler: [
      ["[Kahvaltı tabağı]", "[00] ₺", "[içerik]"],
      ["[Kahvaltılık]", "[00] ₺", "[içerik]"],
      ["[Kahvaltılık]", "[00] ₺", "[içerik]"],
    ],
  },
  {
    baslik: "Bagel sandviçler",
    urunler: [
      ["[Bagel adı]", "[00] ₺", "[içerik]"],
      ["[Bagel adı]", "[00] ₺", "[içerik]"],
      ["[Bagel adı]", "[00] ₺", "[içerik]"],
    ],
  },
  {
    baslik: "Espresso bazlı",
    urunler: [
      ["Espresso", "[00] ₺"],
      ["Americano", "[00] ₺"],
      ["Cortado", "[00] ₺"],
      ["Flat white", "[00] ₺"],
      ["Latte", "[00] ₺", "Bitkisel sütle de hazırlanır"],
      ["Cappuccino", "[00] ₺"],
    ],
  },
  {
    baslik: "Demleme ve soğuk",
    urunler: [
      ["V60", "[00] ₺", "Günün çekirdeğiyle"],
      ["Chemex (2 kişilik)", "[00] ₺"],
      ["Türk kahvesi", "[00] ₺"],
      ["Cold brew", "[00] ₺"],
      ["Iced latte", "[00] ₺"],
    ],
  },
];

export default function Menu() {
  return (
    <div className="kap max-w-4xl py-16">
      <h1 className="font-baslik border-b border-murekkep pb-4 text-6xl font-semibold md:text-8xl">Menü</h1>
      <p className="mt-3 text-soluk">Kafemizde geçerlidir. Fiyatlara KDV dahildir.</p>
      <div className="mt-12 grid gap-12 md:grid-cols-2">
        {MENU.map((b) => (
          <section key={b.baslik}>
            <h2 className="flex items-baseline justify-between border-b border-murekkep pb-2 font-baslik text-2xl">
              {b.baslik}
              {b.not && <span className="etiket font-sans text-soluk">{b.not}</span>}
            </h2>
            <ul className="mt-4 space-y-4">
              {b.urunler.map(([ad, f, not], i) => (
                <li key={i}>
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
