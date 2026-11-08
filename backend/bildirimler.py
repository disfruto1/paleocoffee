"""Siparis e-postalari: musteriye siparis/odeme/teslimat bilgisi, kafeye yeni siparis bildirimi.

Metinler istek icinde hazirlanir (veritabani oturumu acikken), gonderim arka planda yapilir.
SMTP ayarli degilse eposta.gonder sessizce vazgecer; siparis akisi e-postaya bagli degildir.
"""
import os
from dataclasses import dataclass

import eposta
from models import Siparis, TeslimatYontemi

TESLIMAT = {
    TeslimatYontemi.KARGO: "Kargo",
    TeslimatYontemi.AYVALIK: "Ayvalık içi teslimat",
    TeslimatYontemi.MAGAZADAN: "Kafeden teslim",
}


@dataclass(frozen=True)
class Eposta:
    alici: str
    konu: str
    metin: str


def gonder(epostalar: list[Eposta]) -> None:
    for e in epostalar:
        eposta.gonder(e.alici, e.konu, e.metin)


def _site() -> str:
    return os.getenv("SITE_ADRESI", "").strip().rstrip("/")


def _kafe_adresi() -> str | None:
    return os.getenv("SIPARIS_BILDIRIM_EPOSTASI", "").strip() or None


def _tl(tutar) -> str:
    return f"{tutar:,.2f} TL".replace(",", "X").replace(".", ",").replace("X", ".")


def _ozet(s: Siparis) -> str:
    satirlar = []
    for k in s.kalemler:
        ekler = ", ".join(e for e in (k.secenek_adi, k.ogutme) if e)
        satirlar.append(f"- {k.adet} x {k.urun_adi}{f' ({ekler})' if ekler else ''}: {_tl(k.birim_fiyat * k.adet)}")
    satirlar.append(f"- {TESLIMAT.get(s.teslimat_yontemi, 'Teslimat')}: {_tl(s.teslimat_ucreti)}")
    satirlar.append(f"Toplam: {_tl(s.toplam_tutar)}")
    satirlar.append("")
    satirlar.append(f"Teslimat: {s.teslimat_adresi or 'Kafeden teslim alınacak'}")
    if s.siparis_notu:
        satirlar.append(f"Not: {s.siparis_notu}")
    return "\n".join(satirlar)


def _siparis_baglantisi(s: Siparis) -> str:
    return f"\n\nSiparişinizi buradan izleyebilirsiniz: {_site()}/hesabim/siparis/{s.id}" if _site() else ""


def _kafeye(s: Siparis, baslik: str) -> list[Eposta]:
    adres = _kafe_adresi()
    if not adres:
        return []
    musteri = s.kullanici
    iletisim = f"{musteri.ad} <{musteri.e_posta}>" + (f", {musteri.telefon}" if musteri.telefon else "")
    baglanti = f"\n\nYönetim paneli: {_site()}/yonetim/siparisler?ac={s.id}" if _site() else ""
    return [Eposta(adres, f"{baslik} #{s.id} · {TESLIMAT.get(s.teslimat_yontemi, '')}", f"Müşteri: {iletisim}\n\n{_ozet(s)}{baglanti}")]


def havale_siparisi_alindi(s: Siparis, odeme_bilgisi: str) -> list[Eposta]:
    """Havale secilen siparis olusunca: musteriye odeme talimati, kafeye bilgi."""
    metin = (
        f"Merhaba {s.kullanici.ad},\n\n#{s.id} numaralı siparişinizi aldık. Ödemeniz ulaştığında hazırlamaya başlayacağız.\n\n"
        f"{odeme_bilgisi}\nAçıklamaya yazılacak sipariş no: {s.id}\n\n{_ozet(s)}{_siparis_baglantisi(s)}\n\nPaleo Coffee Ayvalık"
    )
    return [Eposta(s.kullanici.e_posta, f"Siparişiniz alındı #{s.id}", metin)] + _kafeye(s, "Havale bekleyen sipariş")


def odeme_alindi(s: Siparis) -> list[Eposta]:
    """Siparis odendi olunca (kart bildirimi veya havalenin elle onayi)."""
    metin = (
        f"Merhaba {s.kullanici.ad},\n\n#{s.id} numaralı siparişinizin ödemesi alındı, kahveniz hazırlanıyor.\n\n"
        f"{_ozet(s)}{_siparis_baglantisi(s)}\n\nTeşekkürler,\nPaleo Coffee Ayvalık"
    )
    return [Eposta(s.kullanici.e_posta, f"Ödemeniz alındı #{s.id}", metin)] + _kafeye(s, "Yeni sipariş: hazırlanacak")


def yola_cikti(s: Siparis) -> list[Eposta]:
    if s.teslimat_yontemi == TeslimatYontemi.MAGAZADAN:
        konu, govde = "Siparişiniz hazır", "siparişiniz hazır. Çalışma saatlerimizde kafemizden teslim alabilirsiniz."
    elif s.teslimat_yontemi == TeslimatYontemi.AYVALIK:
        konu, govde = "Siparişiniz yolda", "siparişiniz yola çıktı, kısa süre içinde adresinizde olacak."
    else:
        konu = "Siparişiniz kargoda"
        govde = "siparişiniz kargoya verildi." + (f" Kargo takip numaranız: {s.takip_no}" if s.takip_no else "")
    metin = f"Merhaba {s.kullanici.ad},\n\n#{s.id} numaralı {govde}{_siparis_baglantisi(s)}\n\nAfiyet olsun,\nPaleo Coffee Ayvalık"
    return [Eposta(s.kullanici.e_posta, f"{konu} #{s.id}", metin)]


def iptal_edildi(s: Siparis, zaman_asimi: bool) -> list[Eposta]:
    neden = "ödeme tamamlanmadığı için" if zaman_asimi else ""
    metin = (
        f"Merhaba {s.kullanici.ad},\n\n#{s.id} numaralı siparişiniz {neden + ' ' if neden else ''}iptal edildi."
        " Kartınızdan çekim yapıldıysa ücret iade edilir. Sorunuz olursa bizimle iletişime geçebilirsiniz.\n\nPaleo Coffee Ayvalık"
    )
    return [Eposta(s.kullanici.e_posta, f"Siparişiniz iptal edildi #{s.id}", metin)]
