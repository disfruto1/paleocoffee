"""Yonetim panelinden urun gorseli yukleme."""
import io
import os
from pathlib import Path

from PIL import Image

import gorseller


def _resim(bicim="JPEG", boyut=(3000, 2000), exif=True):
    r = Image.new("RGB", boyut, (120, 80, 50))
    cikti = io.BytesIO()
    if exif and bicim == "JPEG":
        e = Image.Exif()
        e[0x010F] = "Telefon Markasi"  # Make
        r.save(cikti, bicim, exif=e)
    else:
        r.save(cikti, bicim)
    return cikti.getvalue()


def yukle(client, headers, veri, ad="foto.jpg"):
    return client.post("/yonetim/gorseller", files={"dosya": (ad, veri, "image/jpeg")}, headers=headers)


def test_yonetici_yukler_kucultulur_webp_olur_exif_silinir(client, yonetici):
    r = yukle(client, yonetici, _resim())
    assert r.status_code == 200, r.text
    url = r.json()["url"]
    assert url.startswith("/yuklenen/") and url.endswith(".webp")
    dosya = Path(os.environ["YUKLEME_KLASORU"]) / url.rsplit("/", 1)[1]
    with Image.open(dosya) as kayitli:
        assert kayitli.format == "WEBP" and max(kayitli.size) == 1600
        assert not kayitli.getexif()
    # API'den sunulur ve urune yazilabilir
    assert client.get(url).status_code == 200
    u = client.post("/urunler", json={"ad": "Kenya", "fiyat": "1", "gorsel_url": url}, headers=yonetici)
    assert u.status_code == 200 and u.json()["gorsel_url"] == url


def test_png_de_kabul_edilir(client, yonetici):
    assert yukle(client, yonetici, _resim("PNG", (400, 300)), "a.png").status_code == 200


def test_musteri_yukleyemez(client, musteri):
    assert yukle(client, musteri, _resim()).status_code == 403


def test_resim_olmayan_dosya_reddedilir(client, yonetici):
    onceki = set(Path(os.environ["YUKLEME_KLASORU"]).iterdir())
    assert yukle(client, yonetici, b"<svg onload=alert(1)>", "x.svg").status_code == 400
    assert yukle(client, yonetici, b"GIF89a" + b"\x00" * 50, "x.gif").status_code == 400
    assert set(Path(os.environ["YUKLEME_KLASORU"]).iterdir()) == onceki


def test_buyuk_dosya_reddedilir(client, yonetici, monkeypatch):
    monkeypatch.setattr(gorseller, "EN_BUYUK_BAYT", 1000)
    assert yukle(client, yonetici, _resim()).status_code == 400


def test_klasor_disina_cikilamaz(client):
    assert client.get("/yuklenen/../main.py").status_code == 404
    assert client.get("/yuklenen/%2e%2e/main.py").status_code == 404
