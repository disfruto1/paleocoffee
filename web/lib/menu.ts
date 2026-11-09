// Kafe menusu (kafede gecerlidir, siteden satilmaz). Kafenin Kasim 2026 menusunden alindi.
export type MenuUrunu = { ad: string; fiyat: number; aciklama?: string; ek?: string };
export type MenuBolumu = { baslik: string; urunler: MenuUrunu[] };

const bagelEki = "Avokado +75 ₺ · Yumurta +50 ₺";

export const YIYECEK: MenuBolumu[] = [
  {
    baslik: "Kahvaltı",
    urunler: [
      { ad: "Kahvaltı tabağı", fiyat: 500, aciklama: "Çeri domates, hindi füme, zeytin, tulum ve beyaz peynir, göz ve haşlanmış yumurta, baget ekmek, bal, kaymak, salatalık, biber, bir bardak sallama çay" },
      { ad: "Mantarlı omlet", fiyat: 450 },
      { ad: "Peynirli omlet", fiyat: 450, aciklama: "Tulum ve beyaz peynir" },
    ],
  },
  {
    baslik: "Bagel sandviç",
    urunler: [
      { ad: "Rozbif bagel", fiyat: 550, aciklama: "El yapımı bagel ekmek, ajvar, labne, rozbif, roka, Cunda sepet peyniri, domates, zeytin" },
      { ad: "Hindi füme bagel", fiyat: 500, aciklama: "El yapımı bagel ekmek, labne, cheddar, hindi füme, roka, domates, zeytin", ek: bagelEki },
      { ad: "Avokado bagel", fiyat: 500, aciklama: "El yapımı bagel ekmek, labne, avokado, çırpılmış yumurta, Cunda tulum veya cheddar, domates, zeytin" },
      { ad: "Pesto mozzarella bagel", fiyat: 500, aciklama: "El yapımı bagel ekmek, pesto sos, mozzarella, domates, roka, zeytin" },
    ],
  },
  {
    baslik: "Kruvasan sandviç",
    urunler: [
      { ad: "Rozbif kruvasan", fiyat: 550, aciklama: "Kruvasan, ajvar, labne, rozbif, roka, Cunda sepet peyniri, domates, zeytin" },
      { ad: "Hindi füme kruvasan", fiyat: 500, aciklama: "Kruvasan, labne, cheddar, hindi füme, roka, domates, zeytin", ek: bagelEki },
      { ad: "Avokado kruvasan", fiyat: 500, aciklama: "Kruvasan, labne, avokado, çırpılmış yumurta, Cunda tulum veya cheddar, domates, zeytin" },
      { ad: "Pesto mozzarella kruvasan", fiyat: 500, aciklama: "Kruvasan, pesto sos, mozzarella, domates, roka, zeytin" },
    ],
  },
  {
    baslik: "Tabaklar",
    urunler: [
      { ad: "Tatlı kruvasan tabağı", fiyat: 350, aciklama: "Sade kruvasan, karadut reçeli, kaymak" },
      { ad: "Tuzlu kruvasan tabağı", fiyat: 350, aciklama: "Sade kruvasan, Cunda tulum, ajvar veya pesto" },
    ],
  },
  {
    baslik: "Ekmek üstü",
    urunler: [
      { ad: "Közlenmiş biber ve pastırmalı", fiyat: 400, aciklama: "Ekşi maya ekmek, labne, közlenmiş biber, pastırma, nar ekşisi, domates" },
      { ad: "Karadut ve peynirli", fiyat: 350, aciklama: "Ekşi maya ekmek, karadut reçeli, lor peyniri, ceviz, yoğurt, bal" },
    ],
  },
  {
    baslik: "Bowl",
    urunler: [
      { ad: "Granola bowl", fiyat: 450, aciklama: "El yapımı granola, süzme yoğurt, bal, mevsim meyveleri, chia tohumu, fıstık ezmesi" },
      { ad: "Smoothie bowl", fiyat: 450, aciklama: "Mevsim meyvelerinden smoothie, granola, chia tohumu" },
      { ad: "Porridge", fiyat: 500, aciklama: "Badem sütüyle pişirilmiş yulaf, mevsim meyveleri" },
    ],
  },
];

export const ICECEK: MenuBolumu[] = [
  {
    baslik: "Klasikler",
    urunler: [
      { ad: "Espresso", fiyat: 150 },
      { ad: "Double espresso", fiyat: 180 },
      { ad: "Macchiato", fiyat: 200 },
      { ad: "Americano", fiyat: 200 },
      { ad: "Cappuccino", fiyat: 240 },
      { ad: "Cortado", fiyat: 220 },
      { ad: "Flat white", fiyat: 220 },
      { ad: "Latte", fiyat: 220 },
      { ad: "Mocha", fiyat: 260 },
      { ad: "Türk kahvesi", fiyat: 140 },
    ],
  },
  {
    baslik: "Brew bar",
    urunler: [
      { ad: "Filtre kahve", fiyat: 200, aciklama: "Anlık olarak taze hazırlanır" },
      { ad: "Red eye", fiyat: 220 },
      { ad: "V60", fiyat: 280, aciklama: "Çekirdek alternatifi sunulur" },
    ],
  },
  {
    baslik: "Soğuk kahveler",
    urunler: [
      { ad: "Iced americano", fiyat: 210 },
      { ad: "Iced latte", fiyat: 220 },
      { ad: "Iced cappuccino", fiyat: 230 },
      { ad: "Iced flat white", fiyat: 220 },
      { ad: "Iced mocha", fiyat: 270 },
      { ad: "Cold brew", fiyat: 260 },
      { ad: "Affogato", fiyat: 270 },
    ],
  },
  {
    baslik: "Specials",
    urunler: [
      { ad: "Tonik espresso", fiyat: 220 },
      { ad: "Caramel latte", fiyat: 290 },
      { ad: "Pumpkin spice latte", fiyat: 290 },
      { ad: "Vanilla latte", fiyat: 290 },
      { ad: "Orange espresso", fiyat: 290 },
      { ad: "Freddo espresso", fiyat: 220 },
    ],
  },
  {
    baslik: "Çaylar",
    urunler: [
      { ad: "Mayıs çayı", fiyat: 150, aciklama: "Mayıs'ta hasat edilen siyah çay, poşet olarak servis edilir" },
      { ad: "Milk oolong", fiyat: 200, aciklama: "Doğal süt kremasına benzer tat" },
      { ad: "Berry punch", fiyat: 200, aciklama: "Böğürtlen, çilek, gül yaprağı, hibiskus, portakal kurusu" },
      { ad: "Chill cold brew", fiyat: 200, aciklama: "Yeşil çay, elma kurusu, doğal aromalar" },
      { ad: "Caramel cream", fiyat: 200, aciklama: "Yeşil çay, karamel" },
      { ad: "Energy boost", fiyat: 200, aciklama: "Hibiskus, limon kabuğu, elma, kuşburnu, şeftali, cascara, zencefil" },
      { ad: "Rooibos vanilla", fiyat: 200, aciklama: "Rooibos yaprağı, vanilya parçaları" },
      { ad: "Siyah poşet çay", fiyat: 100 },
    ],
  },
  {
    baslik: "Diğer içecekler",
    urunler: [
      { ad: "Salep", fiyat: 200 },
      { ad: "Sıcak çikolata", fiyat: 180 },
      { ad: "Çikolatalı / çilekli süt", fiyat: 150 },
      { ad: "Churchill", fiyat: 150 },
      { ad: "Soda", fiyat: 100 },
      { ad: "Su", fiyat: 50 },
    ],
  },
];

export const ICECEK_EKLERI = "Ekstra shot 50 ₺ · Şurup 70 ₺ · Bitkisel süt 100 ₺";
export const YIYECEK_NOTU = "Günlük ve sezonluk tatlılar ile menü ekleri için bilgi alınız.";
