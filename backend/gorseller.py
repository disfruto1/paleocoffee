"""Yonetim panelinden yuklenen urun gorselleri.

Yuklenen dosya oldugu gibi saklanmaz: Pillow ile acilir, yonu duzeltilir, en fazla 1600 px'e
kucultulur ve WebP olarak yeniden kaydedilir. Boylece konum gibi EXIF bilgileri silinir, resim
gibi gorunen baska dosyalar da sunulamaz. Dosya adlari rastgeledir.
"""
import io
import os
import secrets
from pathlib import Path

from PIL import Image, ImageOps, UnidentifiedImageError

EN_BUYUK_BAYT = 12 * 1024 * 1024
EN_BUYUK_KENAR = 1600
Image.MAX_IMAGE_PIXELS = 50_000_000  # daha buyugu acilmaz (sikistirma bombasi)
IZINLI_BICIMLER = {"JPEG", "PNG", "WEBP", "MPO"}  # MPO: bazi telefonlarin JPEG'i


class GorselHatasi(ValueError):
    pass


def klasor() -> Path:
    yol = Path(os.getenv("YUKLEME_KLASORU", "yuklenen")).resolve()
    yol.mkdir(parents=True, exist_ok=True)
    return yol


def kaydet(veri: bytes) -> str:
    """Gorseli isleyip kaydeder, dosya adini dondurur."""
    if len(veri) > EN_BUYUK_BAYT:
        raise GorselHatasi("Gorsel en fazla 12 MB olabilir")
    try:
        with Image.open(io.BytesIO(veri)) as resim:
            if resim.format not in IZINLI_BICIMLER:
                raise GorselHatasi("Yalnizca JPG, PNG veya WebP yuklenebilir")
            resim = ImageOps.exif_transpose(resim)
            resim = resim.convert("RGBA" if resim.mode in ("RGBA", "LA", "P") else "RGB")
            resim.thumbnail((EN_BUYUK_KENAR, EN_BUYUK_KENAR))
            cikti = io.BytesIO()
            resim.save(cikti, "WEBP", quality=85, method=4)
    except (UnidentifiedImageError, Image.DecompressionBombError, OSError) as hata:
        raise GorselHatasi("Gorsel okunamadi") from hata
    ad = f"{secrets.token_hex(12)}.webp"
    (klasor() / ad).write_bytes(cikti.getvalue())
    return ad
