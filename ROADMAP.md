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
- [x] Sipariş e-postaları: müşteriye sipariş alındı (havale), ödeme alındı, yola çıktı / teslime hazır, iptal; kafeye yeni sipariş bildirimi
- [x] Yönetim panelinden fotoğraf yükleme (küçültülür, WebP'ye çevrilir, konum bilgisi silinir)
- [x] Üye olmadan sipariş: ad, e-posta, telefon alınır; müşteri siparişini e-postadaki gizli bağlantıyla izler, öder, iptal eder
- [x] Kafe bilgileri (adres, telefon, saatler) kafe rehberlerinden işlendi
- [x] Yeni keskin tasarım (Montag Coffee'den ilham)
- [x] Docker + Caddy yayın kurulumu, CI (backend testleri, site derlemesi, uçtan uca yayın testi)

## Faz 2: Yayından önce

- [ ] Gerçek bilgilerin doğrulanması: `web/lib/site.ts` (çalışma saatleri kaynaklarda farklı; e-posta ve Instagram boş), menü fiyatları, hikâye metni
- [ ] Fotoğraflar: ana sayfa, kafe bölümü, ürün görselleri
- [ ] Sözleşmeler ve KVKK metninin doldurulması ve hukuki kontrolü (`web/app/sozlesmeler`, `backend/yasal_metinler.py`)
- [ ] Alan adı, sunucu, PayTR mağaza başvurusu, Resend
- [ ] Gerçek PayTR ile test (test kartı, sonra küçük gerçek ödeme)

## Faz 3: Sonrası

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
- **E-postalar** gönderilemezse (SMTP hatası) tekrar denenmez, yalnızca sunucu kaydına yazılır. Sipariş akışı e-postaya bağlı değildir; kafe yönetim panelini de kontrol etmeli.
- Yüklenen fotoğraflar sunucunun diskinde durur; `yedekle.sh` bunları da yedekler, başka yere kopyalanmalı. Ürüne bağlanmayan fotoğraflar silinmez.
- `PAYTR_TEST_MODU=1` iken para alınmaz ama sipariş "ödendi" olur. Yayında 0 olmalı.
- Yönetici ödenmiş siparişi iptal ederse kart ücreti otomatik iade edilmez, PayTR panelinden iade gerekir.
- Eşzamanlı sipariş testleri yalnızca PostgreSQL'de çalışır, CI'da atlanıyor.
- **Üye olmadan sipariş** bağlantısı (`/siparis/12#kod`) siparişe erişimin anahtarıdır: e-postası ele geçen kişi siparişi görebilir ve ödenmemişse iptal edebilir. Kod adresin `#` kısmında olduğu için sunucu kayıtlarına düşmez. Misafir siparişleri, aynı e-postayla sonradan üye olunsa da hesaba bağlanmaz (e-posta sahipliği doğrulanmadığı için).
- Ödenmemiş siparişler stoğu tutar. Kart denenmeyen siparişler (havale) kendiliğinden iptal olmaz; misafir siparişi aynı IP'den 15 dakikada en fazla 10. Uzun süre ödenmeyen havale siparişlerini yönetici iptal etmeli.
- Hesap silme ve izni geri alma ekranı yok. Kampanya iletisi göndermeden önce İYS kaydı ve ret yolu gerekir.
- Şifre sıfırlama kodu `SMTP_*` ayarlanana kadar gitmez (site yine "gönderildi" der).
