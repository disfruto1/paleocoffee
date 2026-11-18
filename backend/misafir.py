"""Uye olmadan verilen siparislere erisim.

Musteriye siparise ozel bir kod verilir (siparis sayfasinin adresinde ve e-postalarda). Kod saklanmaz:
siparisteki rastgele tuz ve SECRET_KEY'den HMAC ile uretilir, boylece sonraki e-postalara da eklenebilir
ve dogrulanirken yeniden hesaplanir. 128 bitlik kod tahmin edilemez.
"""
import hashlib
import hmac
import secrets

from auth import SECRET_KEY

BASLIK = "X-Siparis-Kodu"


def tuz_uret() -> str:
    return secrets.token_hex(16)


def kod(siparis_id: int, tuz: str) -> str:
    return hmac.new(SECRET_KEY.encode(), f"misafir:{siparis_id}:{tuz}".encode(), hashlib.sha256).hexdigest()[:32]


def dogru_mu(siparis_id: int, tuz: str | None, gelen: str | None) -> bool:
    if not tuz or not gelen:
        return False
    return hmac.compare_digest(kod(siparis_id, tuz), gelen)
