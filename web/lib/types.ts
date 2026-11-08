// API'nin dondurdugu veriler. Tutarlar API'den metin olarak gelir ("450.00"), hesapta Number'a cevrilir.

export type Secenek = { id: number; ad: string; fiyat: string; stok: number | null; aktif: boolean };

export type Urun = {
  id: number;
  ad: string;
  aciklama: string | null;
  fiyat: string;
  stok: number | null;
  aktif: boolean;
  gorsel_url: string | null;
  kategori_id: number | null;
  mensei: string | null;
  isleme: string | null;
  kavrum: string | null;
  tat_notlari: string | null;
  ogutme_secilebilir: boolean;
  one_cikan: boolean;
  secenekler: Secenek[];
};

export type Kategori = { id: number; ad: string; aciklama: string | null; aktif: boolean };

export type TeslimatYontemi = "kargo" | "ayvalik" | "magazadan";

export type Ayarlar = {
  odeme_bilgisi: string;
  kart_odeme: boolean;
  teslimat: { yontem: TeslimatYontemi; ad: string; ucret: string }[];
  ucretsiz_teslimat_siniri: string | null;
  ogutme_secenekleri: string[];
};

export type Kullanici = { id: number; ad: string; e_posta: string; rol: string; telefon: string | null };

export type Adres = { id: number; baslik: string; adres: string; varsayilan: boolean };

export type SiparisKalemi = {
  id: number;
  urun_id: number | null;
  urun_adi: string;
  secenek_adi: string | null;
  ogutme: string | null;
  birim_fiyat: string;
  adet: number;
};

export type Siparis = {
  id: number;
  kullanici_id: number;
  musteri_ad: string | null;
  durum: string;
  toplam_tutar: string;
  teslimat_yontemi: TeslimatYontemi;
  teslimat_ucreti: string;
  teslimat_adresi: string | null;
  siparis_notu: string | null;
  takip_no: string | null;
  olusturulma_tarihi: string;
  kalemler: SiparisKalemi[];
};
