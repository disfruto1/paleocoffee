import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";

// [TASLAK] Bu metinler hukuki kontrol yapilmadan ve [koseli parantez] alanlari doldurulmadan yayina alinmamali.
// PayTR basvurusunda da bu sayfalarin sitede bulunmasi istenir.
const SATICI = `[İşletme unvanı], ${SITE.adres}. Telefon: ${SITE.telefon}. E-posta: ${SITE.eposta}. Vergi dairesi / no: [....]. MERSİS: [....]`;

const SAYFALAR: Record<string, { baslik: string; govde: React.ReactNode }> = {
  "teslimat-ve-iade": {
    baslik: "Teslimat ve iade",
    govde: (
      <>
        <h2>Teslimat seçenekleri</h2>
        <ul>
          <li><strong>Kargo (Türkiye geneli):</strong> Siparişler ödeme onayından sonra [1–2] iş günü içinde kargoya verilir. Kargo takip numarası Hesabım sayfasında görünür.</li>
          <li><strong>Ayvalık içi teslimat:</strong> Ayvalık merkez ve [Cunda, Sarımsaklı …] adreslerine kuryeyle teslim edilir. [Saat …]&apos;e kadar verilen siparişler aynı gün teslim edilir.</li>
          <li><strong>Kafeden teslim:</strong> Siparişiniz hazır olduğunda Hesabım sayfasında &quot;Teslime hazır&quot; görünür. Çalışma saatlerimizde kafemizden alabilirsiniz.</li>
        </ul>
        <p>Teslimat ücreti sepette ve ödeme adımında gösterilir.</p>
        <h2>Cayma hakkı ve iade</h2>
        <p>Ekipman ürünlerinde, teslim tarihinden itibaren 14 gün içinde gerekçe göstermeden cayma hakkınızı kullanabilirsiniz. Ürün kullanılmamış ve yeniden satılabilir durumda olmalıdır.</p>
        <p>Kahve gıda ürünüdür. Ambalajı açılmış kahvelerde ve isteğinize göre öğütülerek hazırlanan kahvelerde, Mesafeli Sözleşmeler Yönetmeliği m. 15 uyarınca cayma hakkı bulunmaz. Hasarlı veya hatalı ürün ulaştıysa teslimattan itibaren [3] gün içinde bize yazın, ürünü değiştirir veya bedelini iade ederiz.</p>
        <p>İade talepleriniz için: {SITE.eposta}. Kartla yapılan ödemelerin iadesi aynı karta yapılır; bankanıza bağlı olarak hesabınıza yansıması birkaç gün sürebilir.</p>
      </>
    ),
  },
  "mesafeli-satis": {
    baslik: "Mesafeli satış sözleşmesi",
    govde: (
      <>
        <h2>1. Taraflar</h2>
        <p><strong>Satıcı:</strong> {SATICI}</p>
        <p><strong>Alıcı:</strong> Sipariş sırasında bilgileri alınan kişi.</p>
        <h2>2. Konu</h2>
        <p>Bu sözleşme, alıcının {SITE.url} üzerinden elektronik ortamda sipariş ettiği ürünlerin satışı ve teslimatına ilişkin tarafların hak ve yükümlülüklerini 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca düzenler.</p>
        <h2>3. Ürün, fiyat ve ödeme</h2>
        <p>Ürünlerin adı, miktarı, KDV dahil satış fiyatı, teslimat ücreti ve ödeme şekli sipariş özetinde ve sipariş onayında yer alır. Kartla ödemeler PayTR güvenli ödeme altyapısıyla alınır; kart bilgileri satıcı tarafından saklanmaz.</p>
        <h2>4. Teslimat</h2>
        <p>Ürünler alıcının seçtiği yöntemle (kargo, Ayvalık içi teslimat veya kafeden teslim) en geç 30 gün içinde teslim edilir.</p>
        <h2>5. Cayma hakkı</h2>
        <p>Cayma hakkı ve istisnaları &quot;Teslimat ve iade&quot; sayfasında açıklanmıştır.</p>
        <h2>6. Uyuşmazlıklar</h2>
        <p>Uyuşmazlıklarda, Ticaret Bakanlığınca ilan edilen parasal sınırlar dahilinde alıcının yerleşim yerindeki tüketici hakem heyetleri ve tüketici mahkemeleri yetkilidir.</p>
      </>
    ),
  },
  "on-bilgilendirme": {
    baslik: "Ön bilgilendirme formu",
    govde: (
      <>
        <p><strong>Satıcı:</strong> {SATICI}</p>
        <p>Siparişinizdeki ürünlerin temel nitelikleri, KDV dahil toplam fiyatı, teslimat ücreti, ödeme ve teslimat bilgileri ödeme adımında sipariş özetinde gösterilir.</p>
        <p>Cayma hakkının kullanılma şartları, süresi ve istisnaları &quot;Teslimat ve iade&quot; sayfasındadır. Şikâyet ve itirazlarınızı {SITE.eposta} adresine iletebilirsiniz.</p>
      </>
    ),
  },
};

type Parametre = { params: Promise<{ sayfa: string }> };

export function generateStaticParams() {
  return [...Object.keys(SAYFALAR), "kvkk"].map((sayfa) => ({ sayfa }));
}

export async function generateMetadata({ params }: Parametre): Promise<Metadata> {
  const { sayfa } = await params;
  return { title: sayfa === "kvkk" ? "KVKK aydınlatma metni" : SAYFALAR[sayfa]?.baslik };
}

async function aydinlatma(): Promise<string | null> {
  // Uyelikte onaylanan metinle ayni olsun diye backend'den okunur
  const adres = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
  try {
    const r = await fetch(`${adres}/yasal/kayit`, { next: { revalidate: 300 } });
    return r.ok ? (await r.json()).aydinlatma : null;
  } catch {
    return null;
  }
}

export default async function Sozlesme({ params }: Parametre) {
  const { sayfa } = await params;
  if (sayfa === "kvkk") {
    const metin = await aydinlatma();
    return (
      <div className="kap max-w-3xl py-16">
        <h1 className="font-baslik text-4xl">KVKK aydınlatma metni</h1>
        <div className="metin mt-8">
          {metin ? metin.split("\n\n").map((p, i) => <p key={i}>{p}</p>) : <p>Metin şu an yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>}
        </div>
      </div>
    );
  }
  const s = SAYFALAR[sayfa];
  if (!s) notFound();
  return (
    <div className="kap max-w-3xl py-16">
      <h1 className="font-baslik text-4xl">{s.baslik}</h1>
      <div className="metin mt-8">{s.govde}</div>
    </div>
  );
}
