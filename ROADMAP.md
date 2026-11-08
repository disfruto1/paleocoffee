# Paleo Coffee Yol Haritası

Teknoloji: FastAPI + SQLAlchemy + PostgreSQL (backend), Next.js 16 + Tailwind (web). Backend'in üyelik, güvenlik ve PayTR kısmı Butik App'ten kopyalandı, ortak kod veya bağlantı yok.

`[x]` bitti, `[ ]` yapılacak.

## Faz 1: İlk sürüm

- [x] Tanıtım sayfaları: ana sayfa, hikâyemiz, kafe menüsü, ziyaret/iletişim (metinler taslak)
- [x] Mağaza: kategori filtresi, arama, ürün sayfası (menşei, işleme, kavrum, tat notları)
- [x] Gramaj seçenekleri (ayrı fiyat ve stok) ve öğütme seçimi
- [x] Sepet (tarayıcıda saklanır), üyelik, şifre sıfırlama, adres defteri
- [x] Teslimat: kargo, Ayvalık içi, kafeden teslim; ücretler ve ücretsiz teslimat sınırı `.env`'den
- [x] Ödeme: PayTR kart (sitede sonuç sayfası) ve havale/EFT
- [x] Hesabım: siparişler, sipariş detayı, bekleyen siparişi kartla ödeme veya iptal
- [x] Yönetim paneli: özet, stoğu azalanlar, ödeme sorunları, siparişler (durum, takip no), ürünler, kategoriler
- [x] Arama motoru: sayfa başlıkları, sitemap, robots, ürün yapısal verisi
- [x] Docker + Caddy yayın kurulumu, CI (backend testleri, site derlemesi, uçtan uca yayın testi)

## Faz 2: Yayından önce

- [ ] Gerçek bilgiler: `web/lib/site.ts` (adres, telefon, saatler, Instagram), menü fiyatları, hikâye metni
- [ ] Fotoğraflar: ana sayfa, kafe bölümü, ürün görselleri
- [ ] Sözleşmeler ve KVKK metninin doldurulması ve hukuki kontrolü (`web/app/sozlesmeler`, `backend/yasal_metinler.py`)
- [ ] Alan adı, sunucu, PayTR mağaza başvurusu, Resend
- [ ] Gerçek PayTR ile test (test kartı, sonra küçük gerçek ödeme)

## Faz 3: Sonrası

- [ ] Üye olmadan sipariş (misafir ödeme)
- [ ] Sipariş onayı ve durum değişikliği e-postaları (müşteriye ve kafeye)
- [ ] Görsel yükleme (şimdilik bağlantı giriliyor)
- [ ] Kupon ve kampanyalar, abonelik (her ay kahve)
- [ ] Yönetim panelinde iade (PayTR API) ve sipariş arama
- [ ] Alembic migration'ları (şimdilik yalnızca eksik tablolar açılışta oluşur)
- [ ] Refresh token, genel istek sınırlama, hata izleme (Sentry)
- [ ] İngilizce sayfa (Ayvalık turistleri için)

## Bilinen riskler

- **Taslak metinler:** sözleşmeler, KVKK aydınlatma metni, menü ve iletişim bilgileri `[köşeli parantez]` içinde yer tutucu içeriyor. Doldurulmadan yayına alınmamalı; PayTR başvurusu da bu sayfaları ister.
- **Cayma hakkı:** teslimat ve iade sayfasında öğütülmüş ve ambalajı açılmış kahvede cayma hakkı olmadığı yazıyor (Mesafeli Sözleşmeler Yönetmeliği m. 15). Hukuki kontrolde doğrulanmalı.
- **Ayvalık içi teslimat** adresin gerçekten Ayvalık'ta olup olmadığını kontrol etmez; yönetici siparişte adrese bakmalı.
- **Oturum anahtarı tarayıcıda (localStorage) saklanıyor.** Sitede başkasının kodunu çalıştıran bir açık olursa oturum çalınabilir. Site dışarıdan script yüklemiyor; ileride httpOnly çerezli oturuma geçilebilir.
- **Ürün görseli** yöneticinin girdiği bağlantıdan doğrudan yüklenir; görselin bulunduğu site ziyaretçi IP'lerini görür. Kendi sunucumuza yüklemeye geçilmeli.
- `PAYTR_TEST_MODU=1` iken para alınmaz ama sipariş "ödendi" olur. Yayında 0 olmalı.
- Yönetici ödenmiş siparişi iptal ederse kart ücreti otomatik iade edilmez, PayTR panelinden iade gerekir.
- Eşzamanlı sipariş testleri yalnızca PostgreSQL'de çalışır, CI'da atlanıyor.
- Hesap silme ve izni geri alma ekranı yok. Kampanya iletisi göndermeden önce İYS kaydı ve ret yolu gerekir.
- Şifre sıfırlama kodu `SMTP_*` ayarlanana kadar gitmez (site yine "gönderildi" der).
