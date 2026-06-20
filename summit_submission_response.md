# AklıSıra — Sergi Sunumu ve Proje Detayları

## Proje Adı
**AklıSıra** — Yapay Zeka Destekli Akıllı Sınıf Oturma Düzeni Önerici

## Proje Özeti

AklıSıra, öğretmenlerin sınıf oturma düzenlerini yapay zeka yardımıyla oluşturmasını sağlayan bir web uygulamasıdır. Öğrenci bilgileri (akademik düzey, davranış tipi, hareket ihtiyacı, özel gereksinimler, arkadaşlık ve kaçınma tercihleri) girildikten sonra, genetik algoritma tabanlı bir optimizasyon motoru çalıştırılarak en uygun oturma düzeni bulunur. Sistem; akademik dengeyi, sosyal uyumu ve davranış yönetimini aynı anda optimize eder.

## Projenin Benzersiz Özellikleri

### 1. Akıllı Metin Girişi (Doğal Dil İşleme)
Öğretmen, öğrenci bilgilerini form doldurmak yerine **serbest metin olarak** yazabilir:
> "Ali gürültücü. Elif sessiz ve başarılı. Mehmet lider. Ayşe hareketli, DEHB."

Sistem bu metni otomatik olarak analiz ederek öğrenci profillerini çıkarır. Türkçe ve İngilizce anahtar kelimeler desteklenir.

### 2. Sesli Giriş
Web Speech API kullanarak öğretmen sınıf bilgilerini **sesle anlatabilir**. Sistem, konuşmayı metne çevirir ve doğal dil işleme ile öğrenci profillerini oluşturur. Türkçe konuşma tanıma (`tr-TR`) aktiftir.

### 3. Genetik Algoritma ile Optimizasyon
Basit bir rastgele atama yerine, **50 bireylik popülasyonla 50 nesil evrimsel algoritmaya** dayalı gerçek bir optimizasyon çalışır. İzleyiciler, algoritmanın her nesilde nasıl iyileştiğini canlı olarak görebilir.

### 4. Çok Amaçlı Puanlama
Sistem aynı anda üç hedefi dengeler:
- **Akademik Denge** — Güçlü ve zayıf öğrencilerin stratejik eşleştirilmesi
- **Sosyal Uyum** — Arkadaşlık tercihlerine uyum, kaçınma listelerine saygı
- **Davranış Uyumu** — Dikkat dağıtıcı kümelenmelerin önlenmesi, liderlerin stratejik yerleşimi

### 5. Yapay Zeka Analiz Raporu
Optimizasyon tamamlandıktan sonra, sistem düzenin neden bu şekilde oluşturulduğunu **doğal dilde açıklayan bir analiz raporu** otomatik olarak üretir.

---

## Sergi Alanında Ne Sunulacak?

### Donanım / Fiziksel Kurulum
- **1 adet dizüstü bilgisayar** — uygulamanın çalıştığı live demo
- **1 adet poster/afiş** (A1 boyut, opsiyonel) — projenin özet görseli

### Demo Akışı (Ziyaretçi Deneyimi)

Ziyaretçiler (öğretmenler, yöneticiler, akademisyenler) aşağıdaki interaktif deneyimi yaşayacaktır:

| Adım | Süre | Açıklama |
|------|------|----------|
| 1. **Tanıtım** | 30sn | "AklıSıra nedir?" — kısa sözlü açıklama |
| 2. **Akıllı Giriş** | 30sn | Ziyaretçi, kendi sınıfından birkaç öğrenci tanımı yazar veya sesle anlatır |
| 3. **Optimizasyon** | 30sn | "Düzeni Oluştur" butonuna basılır, genetik algoritmanın canlı çalışması izlenir |
| 4. **Sonuç İnceleme** | 30sn | Oturma düzeni, metrikler ve AI analiz raporu birlikte incelenir |
| 5. **Dışa Aktarma** | 10sn | Sonuç JSON olarak indirilir |

**Toplam interaktif demo süresi:** ~2.5 dakika

### Ziyaretçi Etkileşimi
Ziyaretçiler kendi öğrenci bilgilerini girerek sistemi **bizzat deneyebilir**. Bu, pasif izlemek yerine aktif katılım sağlar ve projenin gerçek dünyada kullanılabilirliğini gösterir.

---

## Teknik Altyapı

| Kategori | Teknoloji |
|----------|-----------|
| Çerçeve | Next.js 16 + React 19 (TypeScript) |
| Stil | Tailwind CSS 4 + Özel CSS Tasarım Sistemi |
| Optimizasyon | Genetik Algoritma (evrimsel hesaplama) |
| Doğal Dil | Kural tabanlı NLP (Türkçe/İngilizce) |
| Sesli Giriş | Web Speech API (tr-TR) |
| Versiyon | Tamamı yerel çalışır, internet bağlantısı gerekmez |
| Gizlilik | Hiçbir öğrenci verisi sunucuya gönderilmez — tüm işlem tarayıcıda yapılır |

---

## Eğitimsel Etki ve Vizyon

### Mevcut Sorun
Öğretmenler, sınıf oturma düzenlerini genellikle deneme-yanılma veya sezgisel yöntemlerle belirler. Bu süreç zaman alıcıdır ve birden fazla hedefi (akademik denge, sosyal uyum, davranış yönetimi) aynı anda gözetmek güçtür.

### AklıSıra'nın Çözümü
- Yapay zeka, **çok amaçlı optimizasyon** ile tüm hedefleri aynı anda dengeler
- Doğal dil ve sesli giriş sayesinde **teknoloji okuryazarlığı fark etmeksizin** her öğretmen kullanabilir
- Sonuçlar **sayısal metriklerle** desteklenir, karar sürecini şeffaf kılar
- Tüm işlem yerel çalışır, **öğrenci mahremiyet**i korunur

### Gelecek Planları
- Öğrenci performans verisiyle **öğrenen sistem** (zaman içinde iyileşen öneriler)
- Okul yönetim sistemleriyle (e-Okul) entegrasyon
- Mobil uygulama sürümü

---

## İletişim Bilgileri

*[Buraya ad, okul ve iletişim bilgilerinizi ekleyin]*
