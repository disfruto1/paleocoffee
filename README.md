# Paleo Coffee Ayvalık

Kafenin tanıtım sitesi ve online satış: çekirdek ve öğütülmüş kahve, demleme ekipmanı.

- `web/`: Next.js sitesi (tanıtım sayfaları, mağaza, sepet, ödeme, hesabım, yönetim paneli)
- `backend/`: FastAPI + PostgreSQL API (üyelik, ürünler, siparişler, PayTR, teslimat ücretleri)
- `deploy/`: Docker + Caddy yayın kurulumu, adım adım rehber: [deploy/YAYIN.md](deploy/YAYIN.md)

Yol haritası ve bilinen riskler: [ROADMAP.md](ROADMAP.md)

## Yerelde çalıştırma

**Backend** (Python 3.11+, PostgreSQL):

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # DATABASE_URL, SECRET_KEY ve KARGO_UCRETI'ni doldurun
uvicorn main:app --reload --port 8000
```

İlk yönetici hesabı (kayıt olan herkes "müşteri" olur):

```bash
python create_admin.py yonetici@ornek.com "Ad Soyad"
```

**Web sitesi** (Node 22):

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

Site: http://localhost:3000 · API belgeleri: http://localhost:8000/docs. Yönetici hesabıyla giriş yapınca üst menüde **Yönetim** çıkar: ürünler, kategoriler, siparişler, günlük özet.

## Nasıl çalışır

**Ürünler:** Kahvelerde gramaj gibi seçenekler (250 g, 1 kg) ayrı fiyat ve stokla tutulur. "Müşteri öğütme seçsin" işaretliyse müşteri sepete eklerken öğütmeyi seçer (çekirdek, espresso, filtre, Türk kahvesi…); öğütme fiyatı ve stoğu değiştirmez, siparişte görünür. Ekipman seçeneksiz, tek fiyatlı ürün olarak girilir. Görseller şimdilik `https://` bağlantısı olarak girilir.

**Teslimat:** Üç yöntem var: Türkiye geneli kargo, Ayvalık içi adrese teslim, kafeden teslim. Ücretler `.env`'deki `KARGO_UCRETI`, `AYVALIK_TESLIMAT_UCRETI`, `UCRETSIZ_TESLIMAT_SINIRI` ile ayarlanır; `KARGO_UCRETI` boşsa kargo kapalıdır. Ücret sipariş anında hesaplanıp siparişe yazılır.

**Ödeme:** `PAYTR_*` doluysa kartla ödeme açılır: müşteri PayTR'ın güvenli sayfasına gider, sonra `SITE_ADRESI/odeme/sonuc` sayfasına döner. Sipariş yalnızca PayTR'ın imzalı bildirimiyle ödenmiş olur (`POST /odeme/paytr/bildirim`). `ODEME_BILGISI` doluysa havale/EFT de sunulur; havale gelince yönetici siparişi elle "Ödendi" yapar. Kart denenip 45 dakika ödenmeyen siparişler iptal olur, stok geri döner.

**Güvenlik:** Giriş denemesi sınırı, e-postayla şifre sıfırlama, KVKK aydınlatma ve izin kayıtları Butik App'ten taşındı, aynı testlerle korunuyor.

## Testler

```bash
cd backend
pip install -r requirements-dev.txt
python -m pytest -q
```

Testler geçici SQLite kullanır, gerçek veritabanına dokunmaz. Eşzamanlılık testleri yalnızca PostgreSQL'de çalışır:

```bash
TEST_DATABASE_URL=postgresql+psycopg2:///paleo_test python -m pytest -q
```

Web sitesi: `cd web && npm run lint && npm run build`.
