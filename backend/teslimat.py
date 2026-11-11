"""Teslimat yontemleri ve ucretleri. Ucretler .env'den okunur (bkz. .env.example).

Ucret siparis aninda hesaplanip siparise yazilir: ayar sonradan degisse de eski siparisler etkilenmez.
"""
import logging
import os
from decimal import Decimal, InvalidOperation

from models import TeslimatYontemi

log = logging.getLogger("paleo.teslimat")

ADLAR = {
    TeslimatYontemi.KARGO: "Kargo (Türkiye geneli)",
    TeslimatYontemi.AYVALIK: "Ayvalık içi adrese teslim",
    TeslimatYontemi.MAGAZADAN: "Dükkândan teslim al",
}


def _tutar(ad: str, varsayilan: str | None) -> Decimal | None:
    deger = os.getenv(ad, "").strip()
    if not deger:
        return Decimal(varsayilan) if varsayilan is not None else None
    try:
        tutar = Decimal(deger.replace(",", "."))
    except InvalidOperation:
        tutar = Decimal("-1")
    if tutar < 0:
        # Yanlis ayarla bedava kargo verilmesin: ayar duzeltilene kadar bu yontem kapali sayilir
        log.error("%s gecersiz: %r", ad, deger)
        raise ValueError(ad)
    return tutar.quantize(Decimal("0.01"))


def ayarlar() -> dict:
    """Her yontemin ucreti. Ayari hatali yontem listede yer almaz."""
    yontemler = {}
    for yontem, ad, varsayilan in (
        (TeslimatYontemi.KARGO, "KARGO_UCRETI", None),
        (TeslimatYontemi.AYVALIK, "AYVALIK_TESLIMAT_UCRETI", "0"),
        (TeslimatYontemi.MAGAZADAN, None, "0"),
    ):
        try:
            ucret = _tutar(ad, varsayilan) if ad else Decimal("0.00")
        except ValueError:
            continue
        if ucret is None:
            continue  # KARGO_UCRETI girilmeden kargo acilmaz
        yontemler[yontem] = ucret
    try:
        sinir = _tutar("UCRETSIZ_TESLIMAT_SINIRI", None)
    except ValueError:
        sinir = None
    return {"yontemler": yontemler, "ucretsiz_sinir": sinir}


def ucret_hesapla(yontem: str, urun_tutari: Decimal) -> Decimal | None:
    """Yontem kapaliysa None doner."""
    a = ayarlar()
    ucret = a["yontemler"].get(yontem)
    if ucret is None:
        return None
    if a["ucretsiz_sinir"] is not None and urun_tutari >= a["ucretsiz_sinir"]:
        return Decimal("0.00")
    return ucret
