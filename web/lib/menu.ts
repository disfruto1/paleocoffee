// Kafe menusu (kafede gecerlidir, siteden satilmaz). Kafenin Kasim 2026 menusunden alindi.
// Fiyatlar bilerek yok: sik degisiyor, sitede eski fiyat kalmasin. Guncel fiyatlar kafededir.
export type MenuUrunu = { ad: string; aciklama?: string; ek?: string };
export type MenuBolumu = { baslik: string; urunler: MenuUrunu[] };

const bagelEki = "Avokado veya yumurta eklenebilir";

export const YIYECEK: MenuBolumu[] = [
  {
    baslik: "Kahvaltı",
    urunler: [
      { ad: "Kahvaltı tabağı", aciklama: "Çeri domates, hindi füme, zeytin, tulum ve beyaz peynir, göz ve haşlanmış yumurta, baget ekmek, bal, kaymak, salatalık, biber, bir bardak sallama çay" },
      { ad: "Mantarlı omlet" },
      { ad: "Peynirli omlet", aciklama: "Tulum ve beyaz peynir" },
    ],
  },
  {
    baslik: "Bagel sandviç",
    urunler: [
      { ad: "Rozbif bagel", aciklama: "El yapımı bagel ekmek, ajvar, labne, rozbif, roka, Cunda sepet peyniri, domates, zeytin" },
      { ad: "Hindi füme bagel", aciklama: "El yapımı bagel ekmek, labne, cheddar, hindi füme, roka, domates, zeytin", ek: bagelEki },
      { ad: "Avokado bagel", aciklama: "El yapımı bagel ekmek, labne, avokado, çırpılmış yumurta, Cunda tulum veya cheddar, domates, zeytin" },
      { ad: "Pesto mozzarella bagel", aciklama: "El yapımı bagel ekmek, pesto sos, mozzarella, domates, roka, zeytin" },
    ],
  },
  {
    baslik: "Kruvasan sandviç",
    urunler: [
      { ad: "Rozbif kruvasan", aciklama: "Kruvasan, ajvar, labne, rozbif, roka, Cunda sepet peyniri, domates, zeytin" },
      { ad: "Hindi füme kruvasan", aciklama: "Kruvasan, labne, cheddar, hindi füme, roka, domates, zeytin", ek: bagelEki },
      { ad: "Avokado kruvasan", aciklama: "Kruvasan, labne, avokado, çırpılmış yumurta, Cunda tulum veya cheddar, domates, zeytin" },
      { ad: "Pesto mozzarella kruvasan", aciklama: "Kruvasan, pesto sos, mozzarella, domates, roka, zeytin" },
    ],
  },
  {
    baslik: "Tabaklar",
    urunler: [
      { ad: "Tatlı kruvasan tabağı", aciklama: "Sade kruvasan, karadut reçeli, kaymak" },
      { ad: "Tuzlu kruvasan tabağı", aciklama: "Sade kruvasan, Cunda tulum, ajvar veya pesto" },
    ],
  },
  {
    baslik: "Ekmek üstü",
    urunler: [
      { ad: "Közlenmiş biber ve pastırmalı", aciklama: "Ekşi maya ekmek, labne, közlenmiş biber, pastırma, nar ekşisi, domates" },
      { ad: "Karadut ve peynirli", aciklama: "Ekşi maya ekmek, karadut reçeli, lor peyniri, ceviz, yoğurt, bal" },
    ],
  },
  {
    baslik: "Bowl",
    urunler: [
      { ad: "Granola bowl", aciklama: "El yapımı granola, süzme yoğurt, bal, mevsim meyveleri, chia tohumu, fıstık ezmesi" },
      { ad: "Smoothie bowl", aciklama: "Mevsim meyvelerinden smoothie, granola, chia tohumu" },
      { ad: "Porridge", aciklama: "Badem sütüyle pişirilmiş yulaf, mevsim meyveleri" },
    ],
  },
];

export const ICECEK: MenuBolumu[] = [
  {
    baslik: "Klasikler",
    urunler: [
      { ad: "Espresso" },
      { ad: "Double espresso" },
      { ad: "Macchiato" },
      { ad: "Americano" },
      { ad: "Cappuccino" },
      { ad: "Cortado" },
      { ad: "Flat white" },
      { ad: "Latte" },
      { ad: "Mocha" },
      { ad: "Türk kahvesi" },
    ],
  },
  {
    baslik: "Brew bar",
    urunler: [
      { ad: "Filtre kahve", aciklama: "Anlık olarak taze hazırlanır" },
      { ad: "Red eye" },
      { ad: "V60", aciklama: "Çekirdek alternatifi sunulur" },
    ],
  },
  {
    baslik: "Soğuk kahveler",
    urunler: [
      { ad: "Iced americano" },
      { ad: "Iced latte" },
      { ad: "Iced cappuccino" },
      { ad: "Iced flat white" },
      { ad: "Iced mocha" },
      { ad: "Cold brew" },
      { ad: "Affogato" },
    ],
  },
  {
    baslik: "Specials",
    urunler: [
      { ad: "Tonik espresso" },
      { ad: "Caramel latte" },
      { ad: "Pumpkin spice latte" },
      { ad: "Vanilla latte" },
      { ad: "Orange espresso" },
      { ad: "Freddo espresso" },
    ],
  },
  {
    baslik: "Çaylar",
    urunler: [
      { ad: "Mayıs çayı", aciklama: "Mayıs'ta hasat edilen siyah çay; bardakta, poşet çay olarak servis edilir" },
      { ad: "Milk oolong", aciklama: "Doğal süt kremasına benzer tat" },
      { ad: "Berry punch", aciklama: "Böğürtlen, çilek, gül yaprağı, hibiskus, portakal kurusu" },
      { ad: "Chill cold brew", aciklama: "Yeşil çay, elma kurusu, doğal aromalar" },
      { ad: "Caramel cream", aciklama: "Yeşil çay, karamel" },
      { ad: "Energy boost", aciklama: "Hibiskus, limon kabuğu, elma, kuşburnu, şeftali, cascara, zencefil" },
      { ad: "Rooibos vanilla", aciklama: "Rooibos yaprağı, vanilya parçaları" },
      { ad: "Siyah poşet çay" },
    ],
  },
  {
    baslik: "Diğer içecekler",
    urunler: [
      { ad: "Salep" },
      { ad: "Sıcak çikolata" },
      { ad: "Çikolatalı / çilekli süt" },
      { ad: "Churchill" },
      { ad: "Soda" },
      { ad: "Su" },
    ],
  },
];

export const ICECEK_EKLERI = "Ekstra shot, şurup ve bitkisel süt eklenebilir.";
export const YIYECEK_NOTU = "Günlük ve sezonluk tatlılar ile menü ekleri için bilgi alınız.";
