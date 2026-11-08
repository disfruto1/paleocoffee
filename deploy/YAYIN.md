# Yayın rehberi

Kurulum: internet → (Cloudflare) → Caddy (HTTPS) → web sitesi (Next.js) ve API (FastAPI) → PostgreSQL. Hepsi aynı sunucuda Docker ile çalışır, dışarıya yalnızca Caddy açıktır. Butik App'ten tamamen ayrıdır: ayrı sunucu (veya en azından ayrı 80/443 portları), ayrı veritabanı, ayrı PayTR mağazası.

## 1. Sunucu

- Ubuntu 24.04, en az 2 GB RAM (Next.js derlemesi için), root erişimi. 80 ve 443 portları açık olmalı.
- Docker kurulumu: <https://docs.docker.com/engine/install/ubuntu/>
- SSH'ı parola yerine anahtarla kullanın.
- Butik App ile aynı sunucuya kurulacaksa iki Caddy aynı 80/443 portunu kullanamaz; bu durumda tek bir Caddy'nin iki projeye de yönlendirmesi gerekir (ayrı iş, sorun).

## 2. DNS

Alan adının DNS'ine iki kayıt eklenir (örnek alan adı `paleocoffee.com.tr`):

| Tür | Ad | Değer | Proxy |
|---|---|---|---|
| A | `@` | sunucunun IP'si | DNS only (gri bulut) |
| A | `api` | sunucunun IP'si | **DNS only** (gri bulut) |

`www` de kullanılacaksa `@`'ye yönlenen bir CNAME ekleyin ve `Caddyfile`'a yönlendirme yazın.

**Neden gri bulut:** turuncu bulutta Cloudflare'in güvenlik kuralları PayTR bildirimini engelleyebilir. Sonradan turuncuya geçilirse SSL modu "Full (strict)" olmalı ve `/odeme/paytr/bildirim` WAF ve bot korumasından muaf tutulmalı; müşteri IP'si `CF-Connecting-IP`'den doğru okunur.

## 3. Kurulum

```bash
git clone https://github.com/disfruto1/paleocoffee.git
cd paleocoffee/deploy
cp .env.example .env
chmod 600 .env
nano .env
```

`.env` içinde alan adları, `POSTGRES_PASSWORD`, `SECRET_KEY`, teslimat ücretleri, `SMTP_SIFRE`, `SIPARIS_BILDIRIM_EPOSTASI` (yeni siparişlerin gideceği kafe adresi) ve `ODEME_BILGISI` doldurulur. PayTR alanları ilk açılışta boş kalabilir, kart ödemesi kapalı başlar.

```bash
docker compose up -d --build
docker compose ps
```

İlk açılışta sertifikaların alınması bir dakika sürebilir. Sorun olursa: `docker compose logs caddy`, `docker compose logs app`, `docker compose logs web`.

İlk yönetici hesabı (şifre gizli sorulur). Sonra sitede giriş yapınca üst menüde "Yönetim" görünür:

```bash
docker compose exec app python create_admin.py e-posta@adresiniz.com "Ad Soyad"
```

**Alan adı değişirse** web sitesi yeniden derlenmelidir (`docker compose up -d --build`): API adresi derleme sırasında siteye yazılır.

## 4. Yedek

Sunucuda `crontab -e` ile her gece 03:30 yedeği:

```
30 3 * * * /home/KULLANICI/paleocoffee/deploy/yedekle.sh >> /home/KULLANICI/paleo-yedek.log 2>&1
```

Veritabanı ve yönetim panelinden yüklenen ürün fotoğrafları ayrı dosyalara yedeklenir, `deploy/yedekler/` altında 14 gün kalır. **Sunucu giderse bunlar da gider:** düzenli olarak başka bir yere de kopyalayın ve en az bir kez geri yüklemeyi deneyin.

## 5. E-posta kontrolü

1. Resend panelinde alan adı "Verified" görünmeli.
2. Sitede "Şifremi unuttum" deneyin; kod gelen kutusuna düşmeli, spam'e bakın.
3. Havale ile küçük bir deneme siparişi verin: müşteriye ödeme bilgisi, `SIPARIS_BILDIRIM_EPOSTASI` adresine bildirim gelmeli. Yönetim panelinden "Havale geldi" deyince ikisine de yeni e-posta gider.

## 6. PayTR

Paleo Coffee için **ayrı bir PayTR mağazası** açılır; Butik'in mağazasıyla ilgisi yoktur.

1. PayTR başvurusunda sitede şu sayfalar istenir, yayından önce doldurun: hakkımızda (`/hikayemiz`), iletişim (`/iletisim`), mesafeli satış sözleşmesi, ön bilgilendirme formu, teslimat ve iade, KVKK (alt menüde). Bunlar şu an **taslaktır**.
2. PayTR panelinde Bildirim URL'si: `https://api.ALAN_ADINIZ/odeme/paytr/bildirim`
3. `.env` içine `PAYTR_MERCHANT_ID`, `PAYTR_MERCHANT_KEY`, `PAYTR_MERCHANT_SALT` yazın, `PAYTR_TEST_MODU=1` bırakın, `docker compose up -d` çalıştırın.
4. Sitede PayTR'ın test kartıyla baştan sona deneyin: başarılı ödeme, reddedilen kart, vazgeçme. Sipariş "Hazırlanıyor" olmalı.
5. Her şey doğruysa `PAYTR_TEST_MODU=0` yapın, `docker compose up -d` çalıştırın ve küçük tutarlı gerçek bir ödemeyle deneyip iade edin.

Test modunda sipariş "ödendi" olur ama para alınmaz. Test siparişlerini göndermeyin, gerçek satışa `0` yapmadan başlamayın.

## Yayın öncesi kontrol

- [ ] `SECRET_KEY` yeni üretildi, `.env` izinleri 600
- [ ] `EPOSTA_KONSOLA_YAZ` ve `PAYTR_YEREL_IP` boş
- [ ] `ODEME_BILGISI` gerçek IBAN'ı gösteriyor, teslimat ücretleri doğru
- [ ] `web/lib/site.ts` içindeki adres, telefon, saatler, Instagram dolduruldu; `[köşeli parantez]` kalmadı
- [ ] Sözleşmeler ve KVKK metni (`backend/yasal_metinler.py`) dolduruldu ve hukuki kontrolden geçti
- [ ] Site ve API HTTPS ile açılıyor, HTTP adresi HTTPS'e yönleniyor
- [ ] Sunucudan dışarıya 3000, 5432 ve 8000 portları kapalı (başka bir makineden deneyin)
- [ ] Şifre sıfırlama ve sipariş e-postaları geliyor (müşteriye ve kafeye)
- [ ] Yedek alındı ve geri yüklemesi denendi
- [ ] PayTR test ödemesi tamamlandı; gerçek satışta `PAYTR_TEST_MODU=0`

## Güncelleme ve geri alma

Güncelleme öncesi yedek alın:

```bash
cd paleocoffee/deploy
./yedekle.sh
git pull
docker compose up -d --build
```

Sorun çıkarsa önceki commit'e dönün (`git checkout <commit>` ve `docker compose up -d --build`). Uygulama açılırken yalnızca eksik tabloları ekler; var olan tabloya yeni kolon eklenmesi gerekirse Alembic'e geçilmeli (bkz. ROADMAP).

## Bilinen sınırlar

- `deploy/duman_testi.sh` bu kurulumu GitHub Actions'ta her push'ta dener: imajlar, PostgreSQL, HTTPS, site ve API, CORS, gerçek IP okuma, sahte başlıklar. Gerçek sertifika, gerçek Cloudflare ve gerçek PayTR bu testin dışındadır. **`duman_testi.sh` veriyi siler, sunucuda çalıştırmayın.**
- Tek sunucu, tek API süreci: sunucu kapanırsa site de kapanır. Kafe ölçeği için yeterli.
