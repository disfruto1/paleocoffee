"""Uye olmadan siparis: kod ile erisim, odeme, iptal, e-postalar."""
import pytest

import eposta
import giris_siniri
from test_paytr import ayarlar, bildirim, paytr_istegi  # noqa: F401 (fixture)

ADRES = "Sakarya Mah. Barbaros Cad. No:10 Ayvalik / Balikesir"


def urun(client, yonetici, stok=5):
    return client.post("/urunler", json={"ad": "Chemex", "fiyat": "100.00", "stok": stok}, headers=yonetici).json()


def misafir_siparisi(client, urun_id, **ek):
    govde = {
        "ad": "Deniz Kaya", "e_posta": "Deniz@Example.com", "telefon": "0555 111 22 33", "aydinlatma_okundu": True,
        "teslimat_adresi": ADRES, "kalemler": [{"urun_id": urun_id, "adet": 2}], **ek,
    }
    return client.post("/misafir/siparisler", json=govde)


def kodla(k):
    return {"X-Siparis-Kodu": k}


def test_misafir_siparis_verir_kodla_gorur(client, yonetici):
    u = urun(client, yonetici)
    r = misafir_siparisi(client, u["id"])
    assert r.status_code == 200, r.text
    s = r.json()
    assert s["misafir"] is True and s["kullanici_id"] is None and s["musteri_ad"] == "Deniz Kaya"
    assert len(s["erisim_kodu"]) == 32
    assert client.get(f"/urunler/{u['id']}").json()["stok"] == 3
    g = client.get(f"/misafir/siparisler/{s['id']}", headers=kodla(s["erisim_kodu"]))
    assert g.status_code == 200 and "erisim_kodu" not in g.json()
    # yonetici listede gorur
    liste = client.get("/siparisler", headers=yonetici).json()
    assert liste[0]["misafir"] is True and liste[0]["musteri_ad"] == "Deniz Kaya"


def test_kodsuz_veya_yanlis_kodla_erisilemez(client, yonetici):
    s = misafir_siparisi(client, urun(client, yonetici)["id"]).json()
    assert client.get(f"/misafir/siparisler/{s['id']}").status_code == 404
    assert client.get(f"/misafir/siparisler/{s['id']}", headers=kodla("0" * 32)).status_code == 404
    assert client.post(f"/misafir/siparisler/{s['id']}/iptal", headers=kodla("0" * 32)).status_code == 404
    # baska bir siparisin kodu da gecmez
    diger = misafir_siparisi(client, urun(client, yonetici)["id"]).json()
    assert client.get(f"/misafir/siparisler/{s['id']}", headers=kodla(diger["erisim_kodu"])).status_code == 404


def test_uye_siparisi_misafir_ucundan_acilamaz(client, yonetici, musteri):
    u = urun(client, yonetici)
    s = client.post("/siparisler", json={"teslimat_adresi": ADRES, "kalemler": [{"urun_id": u["id"], "adet": 1}]}, headers=musteri).json()
    assert client.get(f"/misafir/siparisler/{s['id']}", headers=kodla("x")).status_code == 404


def test_misafir_siparisi_uyenin_listesinde_gorunmez(client, yonetici, musteri):
    misafir_siparisi(client, urun(client, yonetici)["id"])
    assert client.get("/siparisler", headers=musteri).json() == []


def test_aydinlatma_ve_telefon_zorunlu(client, yonetici):
    u = urun(client, yonetici)
    assert misafir_siparisi(client, u["id"], aydinlatma_okundu=False).status_code == 400
    assert misafir_siparisi(client, u["id"], telefon="abc").status_code == 422
    assert client.get(f"/urunler/{u['id']}").json()["stok"] == 5


def test_misafir_iptal_eder_stok_doner(client, yonetici):
    u = urun(client, yonetici)
    s = misafir_siparisi(client, u["id"]).json()
    r = client.post(f"/misafir/siparisler/{s['id']}/iptal", headers=kodla(s["erisim_kodu"]))
    assert r.status_code == 200 and r.json()["durum"] == "iptal_edildi"
    assert client.get(f"/urunler/{u['id']}").json()["stok"] == 5


def test_ip_basina_siparis_siniri(client, yonetici, monkeypatch):
    monkeypatch.setattr(giris_siniri, "MISAFIR_SIPARIS_IP_SINIRI", 2)
    u = urun(client, yonetici, stok=None)
    assert misafir_siparisi(client, u["id"]).status_code == 200
    assert misafir_siparisi(client, u["id"]).status_code == 200
    assert misafir_siparisi(client, u["id"]).status_code == 429


def test_misafir_kartla_oder_sonucu_kodla_sorar(client, yonetici, ayarlar, paytr_istegi):  # noqa: F811
    s = misafir_siparisi(client, urun(client, yonetici)["id"]).json()
    r = client.post(f"/misafir/siparisler/{s['id']}/odeme/paytr", json={}, headers=kodla(s["erisim_kodu"]))
    assert r.status_code == 200, r.text
    d = paytr_istegi[-1][1]
    assert d["email"] == "deniz@example.com" and d["user_phone"] == "0555 111 22 33" and d["user_name"] == "Deniz Kaya"
    oid = r.json()["merchant_oid"]
    assert client.get(f"/odeme/paytr/{oid}").status_code == 404
    assert bildirim(client, oid, toplam="20000").text == "OK"
    durum = client.get(f"/odeme/paytr/{oid}", headers=kodla(s["erisim_kodu"])).json()
    assert durum["durum"] == "basarili" and durum["siparis_durum"] == "odendi"


def test_yanlis_kodla_odeme_baslatilamaz_sayac_dolmaz(client, yonetici, ayarlar, paytr_istegi, monkeypatch):  # noqa: F811
    monkeypatch.setattr(giris_siniri, "ODEME_BASLATMA_SINIRI", 1)
    s = misafir_siparisi(client, urun(client, yonetici)["id"]).json()
    for _ in range(3):
        assert client.post(f"/misafir/siparisler/{s['id']}/odeme/paytr", json={}, headers=kodla("1" * 32)).status_code == 404
    assert paytr_istegi == []
    assert client.post(f"/misafir/siparisler/{s['id']}/odeme/paytr", json={}, headers=kodla(s["erisim_kodu"])).status_code == 200


def test_misafir_epostalarinda_kodlu_baglanti(client, yonetici, monkeypatch):
    gidenler = []
    monkeypatch.setattr(eposta, "gonder", lambda a, k, m: gidenler.append((a, k, m)) or True)
    monkeypatch.setenv("SITE_ADRESI", "https://paleo.ornek.com")
    monkeypatch.setenv("ODEME_BILGISI", "IBAN TR00")
    monkeypatch.setenv("SIPARIS_BILDIRIM_EPOSTASI", "kafe@example.com")
    s = misafir_siparisi(client, urun(client, yonetici)["id"], odeme_yontemi="havale").json()
    assert gidenler[0][0] == "deniz@example.com"
    assert f"https://paleo.ornek.com/siparis/{s['id']}#{s['erisim_kodu']}" in gidenler[0][2]
    assert "(üye değil)" in gidenler[1][2] and s["erisim_kodu"] not in gidenler[1][2]
    gidenler.clear()
    client.patch(f"/siparisler/{s['id']}/durum", json={"durum": "odendi"}, headers=yonetici)
    assert f"#{s['erisim_kodu']}" in gidenler[0][2]


@pytest.mark.parametrize("yol", ["/misafir/siparisler/999", "/misafir/siparisler/abc"])
def test_olmayan_siparis(client, yol):
    assert client.get(yol, headers=kodla("x")).status_code in (404, 422)
