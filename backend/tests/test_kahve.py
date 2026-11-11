"""Kahveye ozel kurallar: gramaj secenekleri, ogutme ve teslimat yontemleri."""
from decimal import Decimal

ADRES = "Sakarya Mah. Barbaros Cad. No:10 Ayvalik / Balikesir"


def kahve_ekle(client, yonetici, **kw):
    veri = {
        "ad": "Etiyopya Yirgacheffe", "fiyat": "0", "ogutme_secilebilir": True, "mensei": "Etiyopya",
        "kavrum": "acik", "tat_notlari": "bergamot, yasemin",
        "secenekler": [{"ad": "250 g", "fiyat": "450.00", "stok": 3}, {"ad": "1 kg", "fiyat": "1600.00", "stok": 1}],
    }
    veri.update(kw)
    r = client.post("/urunler", json=veri, headers=yonetici)
    assert r.status_code == 200, r.text
    return r.json()


def siparis(client, musteri, kalemler, yontem="kargo", adres=ADRES, **ek):
    govde = {"teslimat_yontemi": yontem, "kalemler": kalemler, **ek}
    if adres is not None:
        govde["teslimat_adresi"] = adres
    return client.post("/siparisler", json=govde, headers=musteri)


def test_secenekli_kahve_siparisi_secenek_stogunu_dusurur(client, yonetici, musteri):
    u = kahve_ekle(client, yonetici)
    s250 = u["secenekler"][0]
    r = siparis(client, musteri, [{"urun_id": u["id"], "secenek_id": s250["id"], "ogutme": "Filtre / V60", "adet": 2}])
    assert r.status_code == 200, r.text
    s = r.json()
    assert Decimal(s["toplam_tutar"]) == Decimal("900.00")
    assert s["kalemler"][0]["secenek_adi"] == "250 g" and s["kalemler"][0]["ogutme"] == "Filtre / V60"
    assert client.get(f"/urunler/{u['id']}").json()["secenekler"][0]["stok"] == 1
    # iptal edince secenegin stogu geri gelir
    client.post(f"/siparisler/{s['id']}/iptal", headers=musteri)
    assert client.get(f"/urunler/{u['id']}").json()["secenekler"][0]["stok"] == 3


def test_secenek_ve_ogutme_zorunlu(client, yonetici, musteri):
    u = kahve_ekle(client, yonetici)
    sid = u["secenekler"][0]["id"]
    assert siparis(client, musteri, [{"urun_id": u["id"], "ogutme": "Çekirdek", "adet": 1}]).status_code == 400
    assert siparis(client, musteri, [{"urun_id": u["id"], "secenek_id": sid, "adet": 1}]).status_code == 400
    assert siparis(client, musteri, [{"urun_id": u["id"], "secenek_id": sid, "ogutme": "Toz", "adet": 1}]).status_code == 400


def test_baska_urunun_secenegi_kullanilamaz(client, yonetici, musteri):
    a = kahve_ekle(client, yonetici)
    b = kahve_ekle(client, yonetici, ad="Kolombiya", secenekler=[{"ad": "250 g", "fiyat": "10.00"}])
    r = siparis(client, musteri, [{"urun_id": a["id"], "secenek_id": b["secenekler"][0]["id"], "ogutme": "Çekirdek", "adet": 1}])
    assert r.status_code == 400


def test_secenek_stogu_yetmezse_siparis_olmaz(client, yonetici, musteri):
    u = kahve_ekle(client, yonetici)
    kg = u["secenekler"][1]
    r = siparis(client, musteri, [{"urun_id": u["id"], "secenek_id": kg["id"], "ogutme": "Çekirdek", "adet": 2}])
    assert r.status_code == 400 and "1 kg" in r.json()["detail"]


def test_kaldirilan_secenek_pasife_alinir_ve_satilmaz(client, yonetici, musteri):
    u = kahve_ekle(client, yonetici)
    ilk, ikinci = u["secenekler"]
    veri = {"ad": u["ad"], "fiyat": "0", "ogutme_secilebilir": True, "secenekler": [{"id": ilk["id"], "ad": "250 g", "fiyat": "500.00", "stok": 3}]}
    r = client.put(f"/urunler/{u['id']}", json=veri, headers=yonetici)
    assert r.status_code == 200, r.text
    durum = {s["id"]: (s["aktif"], s["fiyat"]) for s in r.json()["secenekler"]}
    assert durum[ilk["id"]] == (True, "500.00") and durum[ikinci["id"]][0] is False
    r = siparis(client, musteri, [{"urun_id": u["id"], "secenek_id": ikinci["id"], "ogutme": "Çekirdek", "adet": 1}])
    assert r.status_code == 400


def test_ayni_isimde_iki_secenek_olmaz(client, yonetici):
    r = client.post("/urunler", json={"ad": "X", "fiyat": "1", "secenekler": [{"ad": "250 g", "fiyat": "1"}, {"ad": "250 G", "fiyat": "2"}]}, headers=yonetici)
    assert r.status_code == 400


def test_ekipman_seceneksiz_ve_ogutmesiz(client, yonetici, musteri):
    u = client.post("/urunler", json={"ad": "V60 Dripper", "fiyat": "750.00", "stok": 2}, headers=yonetici).json()
    r = siparis(client, musteri, [{"urun_id": u["id"], "adet": 1}])
    assert r.status_code == 200, r.text
    assert r.json()["kalemler"][0]["ogutme"] is None
    # ogutme gonderilse de yok sayilir
    r = siparis(client, musteri, [{"urun_id": u["id"], "ogutme": "Espresso", "adet": 1}])
    assert r.json()["kalemler"][0]["ogutme"] is None


def test_kargo_ucreti_ve_ucretsiz_sinir(client, yonetici, musteri, monkeypatch):
    monkeypatch.setenv("KARGO_UCRETI", "90")
    monkeypatch.setenv("UCRETSIZ_TESLIMAT_SINIRI", "1000")
    u = client.post("/urunler", json={"ad": "Filtre kagidi", "fiyat": "100.00"}, headers=yonetici).json()
    s = siparis(client, musteri, [{"urun_id": u["id"], "adet": 2}]).json()
    assert Decimal(s["teslimat_ucreti"]) == Decimal("90.00") and Decimal(s["toplam_tutar"]) == Decimal("290.00")
    s = siparis(client, musteri, [{"urun_id": u["id"], "adet": 10}]).json()
    assert Decimal(s["teslimat_ucreti"]) == 0 and Decimal(s["toplam_tutar"]) == Decimal("1000.00")


def test_kargo_ucreti_girilmeden_kargo_kapali(client, yonetici, musteri, monkeypatch):
    monkeypatch.delenv("KARGO_UCRETI")
    u = client.post("/urunler", json={"ad": "Filtre kagidi", "fiyat": "100.00"}, headers=yonetici).json()
    assert siparis(client, musteri, [{"urun_id": u["id"], "adet": 1}]).status_code == 400
    assert [t["yontem"] for t in client.get("/ayarlar").json()["teslimat"]] == ["ayvalik", "magazadan"]


def test_hatali_ucret_ayari_yontemi_kapatir(client, monkeypatch):
    monkeypatch.setenv("KARGO_UCRETI", "-5")
    monkeypatch.setenv("AYVALIK_TESLIMAT_UCRETI", "abc")
    assert [t["yontem"] for t in client.get("/ayarlar").json()["teslimat"]] == ["magazadan"]


def test_magazadan_teslim_adres_istemez_ucretsizdir(client, yonetici, musteri, monkeypatch):
    monkeypatch.setenv("KARGO_UCRETI", "90")
    u = client.post("/urunler", json={"ad": "Chemex", "fiyat": "2000.00"}, headers=yonetici).json()
    r = siparis(client, musteri, [{"urun_id": u["id"], "adet": 1}], yontem="magazadan", adres=None, siparis_notu="Cumartesi gelirim")
    assert r.status_code == 200, r.text
    s = r.json()
    assert s["teslimat_adresi"] is None and Decimal(s["teslimat_ucreti"]) == 0 and s["siparis_notu"] == "Cumartesi gelirim"
    # odendikten sonra kargo adimi olmadan teslim edilebilir
    client.patch(f"/siparisler/{s['id']}/durum", json={"durum": "odendi"}, headers=yonetici)
    assert client.patch(f"/siparisler/{s['id']}/durum", json={"durum": "teslim_edildi"}, headers=yonetici).status_code == 200


def test_ayvalik_ve_kargo_adres_ister(client, yonetici, musteri, monkeypatch):
    monkeypatch.setenv("AYVALIK_TESLIMAT_UCRETI", "40")
    u = client.post("/urunler", json={"ad": "Chemex", "fiyat": "2000.00"}, headers=yonetici).json()
    for yontem in ("kargo", "ayvalik"):
        assert siparis(client, musteri, [{"urun_id": u["id"], "adet": 1}], yontem=yontem, adres=None).status_code == 400
    s = siparis(client, musteri, [{"urun_id": u["id"], "adet": 1}], yontem="ayvalik").json()
    assert Decimal(s["teslimat_ucreti"]) == Decimal("40.00") and s["teslimat_yontemi"] == "ayvalik"


def test_one_cikan_filtresi(client, yonetici):
    kahve_ekle(client, yonetici, one_cikan=True)
    kahve_ekle(client, yonetici, ad="Brezilya")
    assert [u["ad"] for u in client.get("/urunler", params={"one_cikan": True}).json()] == ["Etiyopya Yirgacheffe"]


def test_gorsel_adresi_https_veya_site_ici_olmali(client, yonetici):
    assert client.post("/urunler", json={"ad": "X", "fiyat": "1", "gorsel_url": "javascript:alert(1)"}, headers=yonetici).status_code == 422
    assert client.post("/urunler", json={"ad": "X", "fiyat": "1", "gorsel_url": "/urunler/v60.jpg"}, headers=yonetici).status_code == 200


def test_ozet_secenek_stogunu_gosterir(client, yonetici):
    kahve_ekle(client, yonetici)
    dusuk = client.get("/yonetim/ozet", headers=yonetici).json()["dusuk_stok"]
    assert [d["ad"] for d in dusuk] == ["Etiyopya Yirgacheffe (1 kg)", "Etiyopya Yirgacheffe (250 g)"]
