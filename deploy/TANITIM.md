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

## Cloudflare Pages ile yayın (önerilen, ücretsiz)

1. Cloudflare hesabı açın (ücretsiz).
2. Workers & Pages → Create → Pages → **Connect to Git** → GitHub'dan `disfruto1/paleocoffee` deposunu seçin.
3. Ayarlar:
   - Production branch: `main`
   - Framework preset: None
   - Build command: `cd web && npm ci && npm run build:tanitim`
   - Build output directory: `web/out`
   - Environment variables: `NEXT_PUBLIC_SITE_URL` = `https://ALAN_ADINIZ`, `NODE_VERSION` = `22`
4. İlk yayından sonra **Custom domains** bölümünden alan adını ekleyin. Cloudflare, alan adı firmasının
   panelinde girilecek DNS kaydını (veya nameserver değişikliğini) gösterir.

Bundan sonra `main` dalına her gönderimde site kendiliğinden güncellenir.

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
