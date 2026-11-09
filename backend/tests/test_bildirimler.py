"""Siparis e-postalari: hangi olayda kime gittigi. SMTP'ye istek gitmez, gonderim yakalanir."""
import pytest

import eposta
from conftest import kayit_ol
from test_paytr import ayarlar, bildirim, odeme_baslat, paytr_istegi  # noqa: F401 (fixture)

ADRES = "Sakarya Mah. Barbaros Cad. No:10 Ayvalik / Balikesir"


@pytest.fixture()
def gidenler(monkeypatch):
    liste = []
    monkeypatch.setattr(eposta, "gonder", lambda alici, konu, metin: liste.append((alici, konu, metin)) or True)
    monkeypatch.setenv("SIPARIS_BILDIRIM_EPOSTASI", "kafe@example.com")
    monkeypatch.setenv("SITE_ADRESI", "https://paleo.ornek.com")
    monkeypatch.setenv("ODEME_BILGISI", "IBAN TR00 0000")
    return liste


def _siparis(client, yonetici, musteri, **ek):
    u = client.post("/urunler", json={"ad": "Kenya AA", "fiyat": "0", "ogutme_secilebilir": True, "secenekler": [{"ad": "250 g", "fiyat": "500.00"}]}, headers=yonetici).json()
    govde = {"teslimat_adresi": ADRES, "kalemler": [{"urun_id": u["id"], "secenek_id": u["secenekler"][0]["id"], "ogutme": "Espresso", "adet": 2}], **ek}
    r = client.post("/siparisler", json=govde, headers=musteri)
    assert r.status_code == 200, r.text
    return r.json()


def test_havale_siparisinde_musteriye_iban_kafeye_bilgi(client, yonetici, musteri, gidenler):
    s = _siparis(client, yonetici, musteri, odeme_yontemi="havale")
    assert [g[0] for g in gidenler] == ["musteri@example.com", "kafe@example.com"]
    musteriye = gidenler[0][2]
    assert "IBAN TR00 0000" in musteriye and f"sipariş no: {s['id']}" in musteriye
    assert "2 x Kenya AA (250 g, Espresso)" in musteriye
    assert f"https://paleo.ornek.com/hesabim/siparis/{s['id']}" in musteriye
    assert "Havale bekleyen" in gidenler[1][1]


def test_kart_siparisi_olusurken_eposta_gitmez(client, yonetici, musteri, gidenler):
    _siparis(client, yonetici, musteri)
    assert gidenler == []


def test_havale_kapaliyken_havale_siparisi_verilemez(client, yonetici, musteri, gidenler, monkeypatch):
    monkeypatch.setenv("ODEME_BILGISI", "")
    u = client.post("/urunler", json={"ad": "V60", "fiyat": "10"}, headers=yonetici).json()
    r = client.post("/siparisler", json={"teslimat_adresi": ADRES, "odeme_yontemi": "havale", "kalemler": [{"urun_id": u["id"], "adet": 1}]}, headers=musteri)
    assert r.status_code == 400


def test_durum_degisikliklerinde_eposta(client, yonetici, musteri, gidenler):
    s = _siparis(client, yonetici, musteri)
    client.patch(f"/siparisler/{s['id']}/durum", json={"durum": "odendi"}, headers=yonetici)
    assert [(g[0], g[1].split(" #")[0]) for g in gidenler] == [
        ("musteri@example.com", "Ödemeniz alındı"),
        ("kafe@example.com", "Yeni sipariş: hazırlanacak"),
    ]
    assert "Espresso" in gidenler[1][2] and "Musteri <musteri@example.com>" in gidenler[1][2]
    gidenler.clear()
    client.patch(f"/siparisler/{s['id']}/durum", json={"durum": "kargoya_verildi", "takip_no": "TK42"}, headers=yonetici)
    assert len(gidenler) == 1 and "kargoda" in gidenler[0][1] and "TK42" in gidenler[0][2]
    gidenler.clear()
    client.patch(f"/siparisler/{s['id']}/durum", json={"durum": "teslim_edildi"}, headers=yonetici)
    assert gidenler == []


def test_yonetici_iptalinde_musteriye_eposta_musteri_iptalinde_gitmez(client, yonetici, musteri, gidenler):
    a = _siparis(client, yonetici, musteri)
    client.post(f"/siparisler/{a['id']}/iptal", headers=musteri)
    assert gidenler == []
    b = _siparis(client, yonetici, musteri)
    client.patch(f"/siparisler/{b['id']}/durum", json={"durum": "iptal_edildi"}, headers=yonetici)
    assert len(gidenler) == 1 and "iptal" in gidenler[0][1]


def test_paytr_odemesinde_bir_kez_eposta(client, yonetici, musteri, gidenler, ayarlar, paytr_istegi):  # noqa: F811
    s = _siparis(client, yonetici, musteri)
    oid = odeme_baslat(client, musteri, s["id"])
    assert bildirim(client, oid, toplam="100000").text == "OK"
    assert bildirim(client, oid, toplam="100000").text == "OK"  # tekrar gelen bildirim
    assert [g[0] for g in gidenler] == ["musteri@example.com", "kafe@example.com"]


def test_basarisiz_odemede_eposta_gitmez(client, yonetici, musteri, gidenler, ayarlar, paytr_istegi):  # noqa: F811
    s = _siparis(client, yonetici, musteri)
    oid = odeme_baslat(client, musteri, s["id"])
    bildirim(client, oid, durum="failed", toplam="100000")
    assert gidenler == []


def test_kafe_adresi_yoksa_yalnizca_musteriye(client, yonetici, musteri, gidenler, monkeypatch):
    monkeypatch.delenv("SIPARIS_BILDIRIM_EPOSTASI")
    s = _siparis(client, yonetici, musteri)
    client.patch(f"/siparisler/{s['id']}/durum", json={"durum": "odendi"}, headers=yonetici)
    assert [g[0] for g in gidenler] == ["musteri@example.com"]


def test_magazadan_teslimde_hazir_epostasi(client, yonetici, musteri, gidenler):
    s = _siparis(client, yonetici, musteri, teslimat_yontemi="magazadan")
    client.patch(f"/siparisler/{s['id']}/durum", json={"durum": "odendi"}, headers=yonetici)
    gidenler.clear()
    client.patch(f"/siparisler/{s['id']}/durum", json={"durum": "kargoya_verildi"}, headers=yonetici)
    assert "hazır" in gidenler[0][1] and "dükkânımızdan" in gidenler[0][2]


def test_kayit_olan_musteriye_de_gider(client, yonetici, gidenler):
    kayit_ol(client, "Ayse", "ayse@example.com")
    t = client.post("/giris", data={"username": "ayse@example.com", "password": "sifre123"}).json()["access_token"]
    s = _siparis(client, yonetici, {"Authorization": "Bearer " + t}, odeme_yontemi="havale")
    assert gidenler[0][0] == "ayse@example.com" and "Merhaba Ayse" in gidenler[0][2] and str(s["id"]) in gidenler[0][1]
