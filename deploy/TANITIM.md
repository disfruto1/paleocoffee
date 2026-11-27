# İlk aşama: tanıtım sitesinin yayını

İlk aşamada online satış kapalıdır. Site yalnızca Ana sayfa, Menü, Hikâyemiz ve İletişim sayfalarından oluşur ve
**sunucu gerektirmez**: sabit dosyalar olarak üretilir, ücretsiz bir statik barındırmada yayınlanır. Backend,
veritabanı ve Docker kurulumu (`deploy/YAYIN.md`) satış açılınca kullanılır.

## Derleme

```bash
cd web
npm ci
NEXT_PUBLIC_SITE_URL=https://ALAN_ADINIZ npm run build:tanitim
```

Çıktı `web/out` klasörüdür. Satış sayfaları (ürünler, sepet, ödeme, üyelik, yönetim) bu derlemeye girmez.

## Cloudflare ile yayın (ücretsiz)

Depoda kökteki `wrangler.jsonc`, Cloudflare'e `web/out` klasörünü yayınlamasını söyler.

1. Cloudflare panelinde **Workers & Pages → Create → Import a repository** → GitHub'dan `disfruto1/paleocoffee`.
2. Ayarlar (Settings → Build):
   - Project / Worker name: `paleocoffee` (`wrangler.jsonc` içindeki `name` ile aynı olmalı)
   - Production branch: `main`
   - Root directory: boş (depo kökü)
   - Build command: `cd web && npm ci && npm run build:tanitim`
   - Deploy command: `npx wrangler deploy`
   - Build variables: `NODE_VERSION` = `22`, `NEXT_PUBLIC_SITE_URL` = `https://ALAN_ADINIZ`
3. Deploy. Site önce `paleocoffee.<hesap>.workers.dev` adresinde açılır.
4. Alan adı: Settings → **Domains & Routes → Add → Custom domain**. Alan adı Cloudflare'e eklenmiş olmalı
   (Cloudflare, alan adı firmasının panelinde değiştirilecek nameserver'ları gösterir).

Bundan sonra `main` dalına her gönderimde site kendiliğinden güncellenir.

Hata "Could not detect a directory containing static files" ise ya Build command girilmemiştir ya da
`wrangler.jsonc` içermeyen eski bir commit derlenmiştir.

## Fotoğraf ve video

- `web/public/gorseller/hero.jpg`: ana sayfanın üst bölümü
- `web/public/gorseller/kafe.jpg`: ana sayfadaki dükkân bölümü
- Video: `web/public/gorseller/hero.mp4` konup `web/lib/site.ts` içinde `heroVideo: "/gorseller/hero.mp4"` yazılır.
  Kısa (10-20 sn), sessiz ve sıkıştırılmış olmalı (birkaç MB).

## Bilgileri güncelleme

Adres, telefon, saatler ve Instagram `web/lib/site.ts`, menü `web/lib/menu.ts` içindedir. Değiştirip `main`'e
gönderince site güncellenir.

## Satışa geçiş

Satış açılınca `deploy/YAYIN.md` ile sunucu kurulur; Docker kurulumu siteyi satış açık
(`NEXT_PUBLIC_SATIS_ACIK=1`) derler. Alan adı o zaman Cloudflare Pages'ten sunucuya yönlendirilir.
