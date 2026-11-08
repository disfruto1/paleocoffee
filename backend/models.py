from datetime import datetime
from decimal import Decimal
from sqlalchemy import BigInteger, Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base

class Kategori(Base):
    __tablename__ = "kategoriler"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    ad: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    aciklama: Mapped[str | None] = mapped_column(Text, nullable=True)
    aktif: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    olusturulma_tarihi: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    urunler: Mapped[list["Urun"]] = relationship(back_populates="kategori")

class Urun(Base):
    __tablename__ = "urunler"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    ad: Mapped[str] = mapped_column(String(120), nullable=False)
    aciklama: Mapped[str | None] = mapped_column(Text, nullable=True)
    fiyat: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    stok: Mapped[int | None] = mapped_column(Integer, nullable=True)
    aktif: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    gorsel_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    kategori_id: Mapped[int | None] = mapped_column(ForeignKey("kategoriler.id"), nullable=True)
    # Kahve bilgileri (ekipmanda bos kalir)
    mensei: Mapped[str | None] = mapped_column(String(120), nullable=True)  # ornek: Etiyopya, Yirgacheffe
    isleme: Mapped[str | None] = mapped_column(String(60), nullable=True)  # yikanmis, dogal, honey
    kavrum: Mapped[str | None] = mapped_column(String(30), nullable=True)  # acik, orta, koyu
    tat_notlari: Mapped[str | None] = mapped_column(String(200), nullable=True)  # virgulle: cilek, bergamot
    # True ise musteri siparis verirken ogutme secer (bkz. OGUTME_SECENEKLERI)
    ogutme_secilebilir: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    one_cikan: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)  # ana sayfada gosterilir
    olusturulma_tarihi: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    kategori: Mapped["Kategori | None"] = relationship(back_populates="urunler")
    # Gramaj gibi fiyati ve stogu ayri secenekler. Bos ise urunun kendi fiyati ve stogu kullanilir.
    secenekler: Mapped[list["UrunSecenegi"]] = relationship(
        back_populates="urun", order_by="UrunSecenegi.sira, UrunSecenegi.id", cascade="all, delete-orphan"
    )

    @property
    def aktif_secenekler(self) -> list["UrunSecenegi"]:
        return [s for s in self.secenekler if s.aktif]


class UrunSecenegi(Base):
    __tablename__ = "urun_secenekleri"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    urun_id: Mapped[int] = mapped_column(ForeignKey("urunler.id"), index=True, nullable=False)
    ad: Mapped[str] = mapped_column(String(60), nullable=False)  # ornek: 250 g, 1 kg
    fiyat: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    stok: Mapped[int | None] = mapped_column(Integer, nullable=True)  # None: stok takibi yok
    aktif: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sira: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    urun: Mapped[Urun] = relationship(back_populates="secenekler")


# Ogutme fiyati ve stogu degistirmez: cekirdek siparis uzerine ogutulur
OGUTME_SECENEKLERI = ["Çekirdek", "Espresso", "Moka pot", "Filtre / V60", "Chemex", "French press", "Türk kahvesi"]

class KullaniciRol:
    MUSTERI = "musteri"
    YONETICI = "yonetici"

class Kullanici(Base):
    __tablename__ = "kullanicilar"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    ad: Mapped[str] = mapped_column(String(120), nullable=False)
    e_posta: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    sifre_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    rol: Mapped[str] = mapped_column(String(20), default=KullaniciRol.MUSTERI, nullable=False)
    aktif: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    # Sifre degisince artar; eski surumle imzalanmis oturumlar gecersiz olur
    token_surumu: Mapped[int] = mapped_column(Integer, default=0, server_default="0", nullable=False)
    telefon: Mapped[str | None] = mapped_column(String(20), nullable=True)  # PayTR kart odemesi icin zorunlu ister
    olusturulma_tarihi: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    siparisler: Mapped[list["Siparis"]] = relationship(back_populates="kullanici")

class KullaniciOnayi(Base):
    """Aydinlatma ve izin kayitlari (bkz. yasal_metinler.py). Ispat icin tutulur: satirlar guncellenmez,
    izin geri alinirsa verildi=False olan yeni satir eklenir."""
    __tablename__ = "kullanici_onaylari"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    kullanici_id: Mapped[int] = mapped_column(ForeignKey("kullanicilar.id"), index=True, nullable=False)
    tur: Mapped[str] = mapped_column(String(20), nullable=False)
    verildi: Mapped[bool] = mapped_column(Boolean, nullable=False)
    metin_surumu: Mapped[str] = mapped_column(String(16), nullable=False)
    # Izni verilen e-posta veya telefon: kullanici bilgisini sonradan degistirse de kayit dogru kalir
    iletisim_adresi: Mapped[str | None] = mapped_column(String(255), nullable=True)
    ip: Mapped[str] = mapped_column(String(45), nullable=False)
    tarih: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class GirisDenemesi(Base):
    """Basarisiz giris sayaci (bkz. giris_siniri.py)."""
    __tablename__ = "giris_denemeleri"
    anahtar: Mapped[str] = mapped_column(String(64), primary_key=True)  # sha256, e-posta/IP duz metin saklanmaz
    sayi: Mapped[int] = mapped_column(Integer, nullable=False)
    pencere_basi: Mapped[int] = mapped_column(BigInteger, nullable=False)  # unix zamani (saniye)

class SifreSifirlamaKodu(Base):
    """Kullanici basina en fazla bir gecerli kod (bkz. sifre_sifirlama.py)."""
    __tablename__ = "sifre_sifirlama_kodlari"
    kullanici_id: Mapped[int] = mapped_column(ForeignKey("kullanicilar.id"), primary_key=True)
    kod_ozeti: Mapped[str] = mapped_column(String(64), nullable=False)  # kodun kendisi saklanmaz
    son_kullanma: Mapped[int] = mapped_column(BigInteger, nullable=False)  # unix zamani (saniye)
    yanlis_deneme: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

class Adres(Base):
    __tablename__ = "adresler"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    kullanici_id: Mapped[int] = mapped_column(ForeignKey("kullanicilar.id"), index=True, nullable=False)
    baslik: Mapped[str] = mapped_column(String(60), nullable=False)
    adres: Mapped[str] = mapped_column(Text, nullable=False)
    varsayilan: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    olusturulma_tarihi: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class SiparisDurum:
    ODEME_BEKLIYOR = "odeme_bekliyor"
    ODENDI = "odendi"
    KARGOYA_VERILDI = "kargoya_verildi"
    TESLIM_EDILDI = "teslim_edildi"
    IPTAL_EDILDI = "iptal_edildi"

    # Bir durumdan hangi durumlara gecilebilir (yonetici durum guncellemesi icin)
    GECISLER = {
        "odeme_bekliyor": ["odendi", "iptal_edildi"],
        # Magazadan teslimde ve Ayvalik icinde kargo adimi atlanabilir
        "odendi": ["kargoya_verildi", "teslim_edildi", "iptal_edildi"],
        "kargoya_verildi": ["teslim_edildi"],
        "teslim_edildi": [],
        "iptal_edildi": [],
    }
    # Ciroya sayilan (odemesi alinmis) durumlar
    ODENMIS = ["odendi", "kargoya_verildi", "teslim_edildi"]


class TeslimatYontemi:
    KARGO = "kargo"  # Turkiye geneli
    AYVALIK = "ayvalik"  # Ayvalik ici kuryeyle adrese teslim
    MAGAZADAN = "magazadan"  # musteri kafeden alir
    HEPSI = [KARGO, AYVALIK, MAGAZADAN]
    ADRES_GEREKEN = [KARGO, AYVALIK]

class Siparis(Base):
    __tablename__ = "siparisler"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    # Uye olmadan verilen sipariste bos; musteri bilgisi misafir_* alanlarindadir
    kullanici_id: Mapped[int | None] = mapped_column(ForeignKey("kullanicilar.id"), index=True, nullable=True)
    misafir_ad: Mapped[str | None] = mapped_column(String(120), nullable=True)
    misafir_eposta: Mapped[str | None] = mapped_column(String(255), nullable=True)
    misafir_telefon: Mapped[str | None] = mapped_column(String(20), nullable=True)
    # Misafirin siparise erisim kodu bundan ve SECRET_KEY'den uretilir (bkz. misafir.py); kodun kendisi saklanmaz
    erisim_tuzu: Mapped[str | None] = mapped_column(String(32), nullable=True)
    durum: Mapped[str] = mapped_column(String(30), default=SiparisDurum.ODEME_BEKLIYOR, nullable=False)
    toplam_tutar: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)  # urunler + teslimat ucreti
    teslimat_yontemi: Mapped[str] = mapped_column(String(20), default=TeslimatYontemi.KARGO, nullable=False)
    teslimat_ucreti: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    # Magazadan teslimde bos. Adres defterinden kopyalanir, adres silinse de siparis etkilenmez
    teslimat_adresi: Mapped[str | None] = mapped_column(Text, nullable=True)
    siparis_notu: Mapped[str | None] = mapped_column(String(500), nullable=True)
    odeme_yontemi: Mapped[str] = mapped_column(String(10), default="kart", nullable=False)  # kart veya havale
    takip_no: Mapped[str | None] = mapped_column(String(100), nullable=True)
    olusturulma_tarihi: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    kullanici: Mapped[Kullanici | None] = relationship(back_populates="siparisler")
    kalemler: Mapped[list["SiparisKalemi"]] = relationship(back_populates="siparis", cascade="all, delete-orphan")

    @property
    def misafir(self) -> bool:
        return self.kullanici_id is None

    @property
    def musteri_ad(self) -> str | None:
        return self.kullanici.ad if self.kullanici else self.misafir_ad

    @property
    def musteri_eposta(self) -> str | None:
        return self.kullanici.e_posta if self.kullanici else self.misafir_eposta

    @property
    def musteri_telefon(self) -> str | None:
        return self.kullanici.telefon if self.kullanici else self.misafir_telefon

class SiparisKalemi(Base):
    __tablename__ = "siparis_kalemleri"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    siparis_id: Mapped[int] = mapped_column(ForeignKey("siparisler.id"), nullable=False)
    urun_id: Mapped[int | None] = mapped_column(ForeignKey("urunler.id"), nullable=True)
    urun_adi: Mapped[str] = mapped_column(String(120), nullable=False)
    secenek_id: Mapped[int | None] = mapped_column(ForeignKey("urun_secenekleri.id"), nullable=True)
    secenek_adi: Mapped[str | None] = mapped_column(String(60), nullable=True)
    ogutme: Mapped[str | None] = mapped_column(String(40), nullable=True)
    birim_fiyat: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    adet: Mapped[int] = mapped_column(Integer, nullable=False)
    siparis: Mapped[Siparis] = relationship(back_populates="kalemler")

class PaytrDurum:
    BEKLIYOR = "bekliyor"
    TOKEN_ALINAMADI = "token_alinamadi"  # musteri odeme sayfasini hic gormedi
    BASARILI = "basarili"
    BASARISIZ = "basarisiz"

class PaytrOdeme(Base):
    """Bir siparis icin yapilan her kart odemesi denemesi. PayTR her denemede yeni numara ister."""
    __tablename__ = "paytr_odemeleri"
    merchant_oid: Mapped[str] = mapped_column(String(64), primary_key=True)
    siparis_id: Mapped[int] = mapped_column(ForeignKey("siparisler.id"), index=True, nullable=False)
    durum: Mapped[str] = mapped_column(String(20), default=PaytrDurum.BEKLIYOR, nullable=False)
    tutar_kurus: Mapped[int] = mapped_column(BigInteger, nullable=False)
    odenen_kurus: Mapped[int | None] = mapped_column(BigInteger, nullable=True)  # vade farkiyla tutardan yuksek olabilir
    test_modu: Mapped[bool] = mapped_column(Boolean, nullable=False)
    hata_kodu: Mapped[str | None] = mapped_column(String(20), nullable=True)
    hata_mesaji: Mapped[str | None] = mapped_column(String(255), nullable=True)
    # Dolu ise para alinmis ama siparis "odendi" yapilamamistir, yonetici bakmali
    inceleme_nedeni: Mapped[str | None] = mapped_column(String(40), nullable=True)
    olusturulma: Mapped[int] = mapped_column(BigInteger, nullable=False)  # unix zamani (saniye)
