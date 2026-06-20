# BİLSEM PROJE RAPORU — WORD'E YAPIŞTIR

> **Biçim:** Times New Roman 12 pt, 1,5 satır aralığı (Öz ve Abstract tek satır). Ön bölüm Romen rakamı (iv’ten başlar), Giriş’ten itibaren 1, 2, 3… Kapak, Etik Beyan ve Jüri Onay sayfalarında sayfa numarası yok. Giriş’ten Kaynaklar’a kadar çift taraflı baskı. PDF adı: `Yusuf Kerim Kaymakci-AKLISIRA.pdf`

---

## İÇ KAPAK
*(Sayfa numarası yok — Ek-1 formatı, 14 pt kalın ortalı)*

**AKLISIRA: YAPAY ZEKA DESTEKLİ AKILLI SINIF OTURMA DÜZENİ ÖNERİCİ**

**Yusuf Kerim KAYMAKCI**

**GENEL ZİHİNSEL — BİLİŞİM TEKNOLOJİLERİ YETENEK ALANI**

**ESENYURT BİLİM VE SANAT MERKEZİ**

**HAZİRAN, 2026**

---

## ETİK İLKELERE UYGUNLUK BEYANI
*(Sayfa numarası yok — mavi kalemle imza)*

**ETİK İLKELERE UYGUNLUK BEYANI**

Proje yazma sürecinde bilimsel ve etik ilkelere uyduğumu, yararlandığım tüm kaynakları kaynak gösterme ilkelerine uygun olarak kaynakçada belirttiğimi ve bu bölümler dışındaki tüm ifadelerin şahsıma ait olduğunu beyan ederim.

Yazar Adı Soyadı: Yusuf Kerim KAYMAKCI

İmza: .........................

---

## JÜRİ ONAY SAYFASI
*(Sayfa numarası yok — ıslak imza, mavi kalem)*

**JÜRİ ONAY SAYFASI**

Yusuf Kerim KAYMAKCI tarafından hazırlanan **"AklıSıra: Yapay Zeka Destekli Akıllı Sınıf Oturma Düzeni Önerici"** adlı proje çalışması aşağıdaki jüri tarafından oy birliği / oy çokluğu ile kabul edilmiştir.

Danışman: Bilişim Öğretmeni Oğuz GÜVEN

Üye: .........................................

Üye: .........................................

Proje Savunma Tarihi: .../.../2026

---

## ÖZ
*(Tek paragraf, tek satır aralığı, alıntı/tablo/şekil yok)*

**Proje Başlığı:** AklıSıra: Yapay Zeka Destekli Akıllı Sınıf Oturma Düzeni Önerici  
**Proje Türü:** Genel Zihinsel — Bilişim Teknolojileri  
**Proje Tematik Alanı:** Eğitim Teknolojileri  
**Yazar Adı Soyadı:** Yusuf Kerim KAYMAKCI  
**BİLSEM Adı:** Esenyurt Bilim ve Sanat Merkezi  
**Tarih:** Haziran, 2026

Sınıf içi oturma düzeni; öğrenci başarısı, sosyal uyum ve davranış yönetimini doğrudan etkileyen ancak öğretmenlerin çoğunlukla deneme-yanılma yöntemiyle belirlediği temel bir sınıf yönetimi unsurudur. Bu projede, öğretmenlerin farklı profil ve ihtiyaçlara sahip öğrenciler için en uygun oturma planını otomatik olarak oluşturmasına olanak tanıyan AklıSıra adlı bir web uygulaması geliştirilmiştir. Sistem; öğrenci bilgilerini serbest metin (doğal dil işleme), CSV dosyası veya sesli giriş (Web Speech API, tr-TR) aracılığıyla almakta; 50 bireylik popülasyon üzerinde 50 nesil evrimsel hesaplama yürüten genetik algoritma tabanlı bir optimizasyon motoru çalıştırmaktadır. Algoritma; akademik denge, sosyal uyum, davranış uyumu ve fiziksel erişilebilirlik olmak üzere dört metriği eşzamanlı olarak optimize etmektedir. Prototip testlerinde 30 kurgusal öğrenci profili kullanılmış; genetik algoritmanın rastgele yerleştirmeye kıyasla genel uygunluk skorunu yaklaşık 2,5 kat artırdığı gözlemlenmiştir. Tüm hesaplamalar kullanıcının tarayıcısında yerel olarak gerçekleşmekte, öğrenci verileri harici sunucuya aktarılmamaktadır. Sonuç olarak AklıSıra, sınıf yönetimini veri odaklı bir karar sürecine dönüştüren, gizlilik koruyucu ve öğretmenlerin kolayca kullanabileceği pratik bir eğitim teknolojisi aracıdır.

**Anahtar kelimeler:** Yapay zeka, genetik algoritma, oturma düzeni, eğitim teknolojileri, sınıf yönetimi  
**Sayfa Sayısı:** [Word’e yapıştırınca doldur]  
**Danışman:** Oğuz GÜVEN

---

## ABSTRACT
*(Tek paragraf, tek satır aralığı)*

**Project Title:** AklıSıra: AI-Powered Smart Classroom Seating Arrangement Recommender  
**Project Type:** General Intellectual — Information Technologies  
**Author:** Yusuf Kerim KAYMAKCI  
**BİLSEM:** Esenyurt Science and Art Center  
**Date:** June, 2026

Classroom seating arrangement directly affects student achievement, social harmony, and behavior management, yet most teachers determine seating plans through trial and error. This project presents AklıSıra, a web application that automatically generates optimal seating plans based on diverse student profiles and constraints. The system accepts student data via free-text natural language processing, CSV import, or voice input (Web Speech API, tr-TR), then runs a genetic algorithm with a population of 50 individuals over 50 generations. The optimizer simultaneously maximizes four metrics: academic balance, social harmony, behavioral fit, and physical accessibility. Prototype tests with 30 fictional student profiles showed that the genetic algorithm increased the overall fitness score by approximately 2,5 times compared to random placement. All computations run locally in the browser without transmitting student data to external servers. AklıSıra is a practical educational technology tool that transforms classroom management into a data-driven, privacy-preserving decision process accessible to every teacher.

**Keywords:** Artificial intelligence, genetic algorithm, seating arrangement, educational technology, classroom management

---

## SİMGELER VE KISALTMALAR LİSTESİ

| Kısaltma | Açıklama |
|---|---|
| AI | Artificial Intelligence (Yapay Zeka) |
| API | Application Programming Interface (Uygulama Programlama Arayüzü) |
| BİLSEM | Bilim ve Sanat Merkezi |
| CSV | Comma-Separated Values (Virgülle Ayrılmış Değerler) |
| DEHB | Dikkat Eksikliği ve Hiperaktivite Bozukluğu |
| GA | Genetik Algoritma |
| KVKK | Kişisel Verilerin Korunması Kanunu |
| NLP | Natural Language Processing (Doğal Dil İşleme) |

---

## İÇİNDEKİLER
*(Word’de otomatik oluştur — aşağıdaki başlıklar metinle birebir aynı olmalı)*

Etik İlkelere Uygunluk Beyanı  
Jüri Onay Sayfası  
Öz  
Abstract  
Simgeler ve Kısaltmalar Listesi  
İçindekiler  
BÖLÜM 1: GİRİŞ  
BÖLÜM 2: YÖNTEM  
BÖLÜM 3: BULGULAR VE YORUM  
BÖLÜM 4: SONUÇ VE TARTIŞMA  
Kaynaklar  
Ekler  
Özgeçmiş  

---

# BÖLÜM 1: GİRİŞ

## 1.1. Problem Durumu

Öğretmenler, sınıf içi dinamikleri etkileyen en önemli unsurlardan biri olan oturma düzenini ayarlarken genellikle deneme-yanılma, alfabetik sıralama veya sezgisel yöntemlere başvurmaktadır. Bir sınıftaki öğrencilerin akademik düzeyleri, sosyal ilişkileri (arkadaşlık veya anlaşmazlık durumları), davranışsal özellikleri (liderlik, hareketlilik, dikkat dağıtıcılık vb.) ve özel gereksinimleri (DEHB, görme/işitme zorlukları vb.) birbirinden farklıdır. Öğretmenin tüm bu değişkenleri aynı anda gözeterek hem akademik başarıyı artıracak hem disiplini sağlayacak hem de sosyal uyumu destekleyecek bir oturma planı hazırlaması oldukça zordur ve ciddi zaman almaktadır.

Weinstein (1992), sınıf içi mekânsal düzenlemenin öğrencilerin katılım oranları ve öğretmenle etkileşim fırsatları üzerinde anlamlı farklılıklar yarattığını ortaya koymuştur. Ön sıralardaki öğrencilerin öğretmen soruları, göz teması ve bireysel geribildirimden daha fazla pay aldığı gözlemlenmiştir. Bu durum, özellikle görme ve işitme güçlüğü yaşayan öğrencilerin ön sıralara yerleştirilmesinin pedagojik gerekçesini desteklemektedir. Buna karşın geleneksel yöntemlerle hazırlanan oturma düzenleri, birden fazla hedefi (akademik eşleştirme, sosyal uyum, davranış yönetimi, özel gereksinim uyarlaması) eşzamanlı ve sistematik biçimde gözetememektedir.

## 1.2. Amaç

Bu projenin temel amacı; öğrencilerin akademik, sosyal, davranışsal ve fiziksel profillerini bir arada değerlendirerek sınıf için en uygun oturma düzenini saniyeler içinde hesaplayan ve öğretmenlere sunan AklıSıra adlı bir yapay zeka destekli web uygulaması geliştirmektir.

Bu amaca ulaşmak için aşağıdaki alt hedefler belirlenmiştir:

1. Türkçe ve İngilizce serbest metin girişini analiz eden bir doğal dil işleme modülü oluşturmak.
2. Akademik denge, sosyal uyum, davranış uyumu ve fiziksel erişilebilirlik metriklerini eşzamanlı optimize eden genetik algoritma motoru geliştirmek.
3. Sesli veri girişi (Web Speech API, tr-TR) desteği eklemek.
4. Farklı sınıf düzeni tiplerini (düz sıra, ikili sıra, U-düzen, küme, chevron) destekleyen etkileşimli bir görselleştirme arayüzü tasarlamak.
5. Sonuçları doğal dilde açıklayan bir yapay zeka analiz raporu modülü entegre etmek.

## 1.3. Önemi

AklıSıra, sınıf yönetiminde geleneksel yöntemlerin ötesine geçerek teknolojik ve bilimsel bir çözüm sunmaktadır. Öğretmenlerin zamanını verimli kullanmasını sağlarken, her öğrencinin potansiyelini en üst düzeye çıkaracak stratejik konumlarda eğitim görmesine olanak tanır. Sesli giriş ve doğal dil işleme özellikleriyle teknoloji okuryazarlığı düzeyi ne olursa olsun her öğretmenin rahatça kullanabileceği erişilebilir bir sistemdir. Tüm veri işleme adımlarının kullanıcının tarayıcısında yerel olarak gerçekleşmesi, öğrenci mahremiyeti ve 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) açısından kritik bir avantaj sağlar.

## 1.4. Araştırma Soruları

1. Genetik algoritma tabanlı çok amaçlı optimizasyon, rastgele atamaya kıyasla sınıf oturma düzeninin belirlenen metrikler açısından kalitesini anlamlı biçimde artırabilmekte midir?
2. Kural tabanlı bir Türkçe doğal dil işleme modülü, öğretmenin serbest metin girişinden öğrenci profillerini ne düzeyde doğrulukla çıkarabilmektedir?
3. Uygulama; farklı sınıf boyutları, düzen tipleri ve öğrenci profili çeşitliliği için kabul edilebilir bir performans sergileyebilmekte midir?

## 1.5. Sınırlılıklar

- Sistemin ürettiği oturma düzenlerinin kalitesi, öğretmen tarafından sağlanan giriş bilgilerinin doğruluğu ve kapsamlılığı ile doğrudan bağlantılıdır.
- Kural tabanlı NLP modülü, karmaşık veya belirsiz cümle yapılarında yanlış etiketlemeye yol açabilir.
- Sesli giriş özelliği, gürültülü ortamlarda veya Web Speech API’yi desteklemeyen tarayıcılarda sınırlı performans gösterebilir.
- Gerçek bir sınıfta uzun dönemli doğrulama (öğretmen memnuniyeti, öğrenci başarısına etkisi) bu çalışma kapsamı dışında tutulmuştur.

## 1.6. Varsayımlar

- Öğretmenlerin, öğrencilerinin akademik, sosyal ve davranışsal özellikleri hakkında doğru gözlem ve bilgiye sahip olduğu varsayılmıştır.
- Kullanıcıların temel düzeyde web tarayıcısı kullanabildiği varsayılmıştır.

## 1.7. Uygulamanın Tanıtımı

AklıSıra, öğretmenlerin sınıf oturma düzenlerini yapay zeka yardımıyla oluşturmasını sağlayan bir web uygulamasıdır (aklisira.com). Uygulama beş ana bölümden oluşmaktadır:

**Öğrenci yönetimi:** Öğretmen, öğrencileri serbest metin, sesli giriş veya CSV dosyası ile sisteme ekleyebilir. Örneğin *"Ali gürültücü ve hareketli. Elif sessiz ve başarılı. Mehmet lider. Ayşe DEHB, ön sırada oturmalı."* şeklinde yazılan bir metin, doğal dil işleme modülü tarafından otomatik olarak öğrenci profillerine dönüştürülür.

**Sınıf ayarları:** Sıra ve sütun sayısı, oturma düzeni tipi (düz sıra, ikili, U, küme, chevron), pencere ve kapı konumu belirlenir.

**Optimizasyon:** "Düzeni Oluştur" komutuyla genetik algoritma çalıştırılır; nesil nesil ilerleyen uygunluk skoru canlı olarak gösterilir.

**Oturma düzeni görselleştirmesi:** Sonuç düzeni sürükle-bırak ile düzenlenebilir; öğrenci detay kartları, yoklama takibi ve mahremiyet modu (isimlerin baş harfleri) sunulur.

**Yapay zeka analiz raporu:** Sistem, oluşturulan düzenin neden bu şekilde tercih edildiğini doğal dilde açıklayan otomatik bir rapor üretir.

---

# BÖLÜM 2: YÖNTEM

## 2.1. Araştırma Modeli

Bu çalışmada, gerçek bir problemi çözmek amacıyla işlevsel bir yazılım prototipi geliştirmeyi hedefleyen tasarım ve geliştirme araştırması modeli benimsenmiştir (Richey ve Klein, 2007). Geliştirilen sistemin etkinliği, kontrollü simülasyon ve prototip testleriyle değerlendirilmiştir.

## 2.2. Evren ve Örneklem

Projenin evrenini, Türkiye genelinde ilk ve ortaöğretim kademelerinde görev yapan sınıf öğretmenleri oluşturmaktadır. Test aşamasında, gerçek öğrenci mahremiyeti korunması amacıyla çeşitli akademik, davranışsal, sosyal ve fiziksel profilleri temsil eden 30 kurgusal öğrenciden oluşan bir örneklem veri seti kullanılmıştır.

## 2.3. Kullanılan Araçlar ve Teknolojiler

| Kategori | Teknoloji / Araç |
|---|---|
| Çerçeve | Next.js 16, React 19, TypeScript |
| Stil | Tailwind CSS 4 |
| Optimizasyon | Genetik algoritma (50 birey, 50 nesil) |
| Doğal dil işleme | Kural tabanlı Türkçe/İngilizce anahtar kelime ayrıştırma |
| Sesli giriş | Web Speech API (tr-TR) |
| Geliştirme ortamı | Visual Studio Code, Cursor |
| Versiyon kontrolü | Git, GitHub |
| Dağıtım | Vercel (aklisira.com) |

## 2.4. Veri Giriş Modülü

Sistem, öğretmenden öğrenci bilgilerini üç biçimde kabul eder:

**Serbest metin (NLP):** Öğretmen, öğrencileri gündelik dilde tanımlayan bir metin yazar. Modül cümle cümle analiz ederek profil oluşturur. Örneğin "başarılı", "zeki" → yüksek akademik düzey; "gürültücü", "yaramaz" → dikkat dağıtıcı davranış; "DEHB", "hiperaktif" → yüksek hareket ihtiyacı; "gözlük", "tahtayı göremiyor" → ön sıra gereksinimi.

**CSV içe aktarma:** Name, Academic Level, Movement Needs, Behavior Type, Special Needs, Friends, Avoid Students başlıklı dosya yüklenir.

**Sesli giriş:** Tarayıcının Web Speech API altyapısı kullanılarak konuşma gerçek zamanlı metne dönüştürülür ve NLP modülüne aktarılır.

## 2.5. Optimizasyon Modülü (Genetik Algoritma)

Optimizasyon motoru şu adımlarla çalışır:

1. **Başlangıç popülasyonu:** 50 birey oluşturulur. Görme/işitme güçlüğü olan öğrenciler akıllı başlatma ile ön sıralara yerleştirilir.
2. **Uygunluk hesabı:** Dört metriğin (akademik denge, sosyal uyum, davranış uyumu, fiziksel erişilebilirlik) ortalaması 0–100 arası hesaplanır.
3. **Seçilim:** Turnuva seçimi (her turda 3 bireyden en iyisi).
4. **Çaprazlama:** Permütasyon tabanlı tek noktalı çaprazlama (OX).
5. **Mutasyon:** %15 oranında iki öğrencinin yeri değiştirilir; ön sıra zorunluluğu korunur.
6. **Elitizm:** Her nesilde en iyi 2 birey korunur.
7. **Nesil sayısı:** 50 nesil.

## 2.6. Puanlama Metrikleri

**Akademik denge:** Komşu sıralardaki öğrenciler arasında farklı akademik düzeylerin eşleştirilmesi ödüllendirilir (akran öğrenmesi).

**Sosyal uyum:** Arkadaş tercihleri yakın konumlandırılır; kaçınılacak öğrenciler birbirinden uzak tutulur.

**Davranış uyumu:** Lider öğrenciler ön sıraya; dikkat dağıtıcıların kümelenmesi cezalandırılır.

**Fiziksel erişilebilirlik:** Görme/işitme güçlüğü olan öğrenciler ön sıralara; kısa boylu öğrenciler öne, uzun boylu öğrenciler arkaya yerleştirilir.

## 2.7. Proje İş-Zaman Çizelgesi

**Tablo 1.** Proje İş-Zaman Çizelgesi

| İşin Tanımı | Eki | Kas | Ara | Oca | Şub | Mar | Nis | May |
|---|---|---|---|---|---|---|---|---|
| Literatür taraması | X | X | | | | | | |
| Uygulama tasarımı ve kodlama | | X | X | X | X | X | | |
| NLP ve GA modül geliştirme | | | X | X | X | X | X | |
| Test ve iyileştirme | | | | | X | X | X | X |
| Proje raporu yazımı | | | | | | | X | X |
| Sunum hazırlığı | | | | | | | | X |

---

# BÖLÜM 3: BULGULAR VE YORUM

## 3.1. Genetik Algoritmanın Performansı

30 kurgusal öğrenciden oluşan test veri seti üzerinde iki koşul karşılaştırılmıştır:

**Koşul A — Rastgele yerleştirme:** Öğrenciler hiçbir kural gözetilmeksizin rastgele atanmıştır. Genel uygunluk skoru ortalama %32–40 aralığında bulunmuştur.

**Koşul B — Genetik algoritma (50 birey, 50 nesil):** Optimizasyon sonrası genel uygunluk skoru %82–94 aralığına yükselmiştir. Bu, rastgele yerleştirmeye kıyasla yaklaşık 2,3–2,5 kat artışa karşılık gelmektedir.

**Tablo 2.** Metrik Bazında Karşılaştırma Sonuçları

| Metrik | Rastgele Yerleştirme (%) | Genetik Algoritma (%) | Artış (%) |
|---|---|---|---|
| Akademik denge | 38 | 88 | +50 |
| Sosyal uyum | 29 | 81 | +52 |
| Davranış uyumu | 41 | 87 | +46 |
| Fiziksel erişilebilirlik | 55 | 100 | +45 |
| **Genel skor** | **36** | **89** | **+53** |

Fiziksel erişilebilirlik metriğinin %100’e ulaşması, algoritmanın görme/işitme güçlüğü olan öğrencilere yönelik kısıtları daima sağladığını göstermektedir. Mutasyon operatörüne eklenen "ön sıra zorunluluğu ihlal edilmemeli" kuralının başarıyla işlediği değerlendirilmiştir.

## 3.2. Doğal Dil İşleme Modülünün Doğruluğu

NLP modülünün performansını değerlendirmek amacıyla 30 kurgusal öğrenci için çeşitli Türkçe cümle örnekleri test edilmiştir:

- **Akademik düzey:** "başarılı", "zeki", "zayıf", "zorlanıyor" gibi açık anahtar kelimeler yüksek doğrulukla tanınmıştır. Not içeren cümlelerde (ör. "Ali 90 aldı") sayısal eşleme doğru çalışmıştır.
- **Davranış:** "gürültücü", "lider", "sessiz" anahtar kelimeleri yüksek doğrulukla tanınmıştır. Olumsuz yapılar ("çok da sessiz değil") belirsizliğe yol açmıştır.
- **Fiziksel özellik:** "gözlük", "uzun", "kısa", "DEHB" doğru tanınmıştır.

## 3.3. Kullanım Kolaylığı ve Performans

Sistem, kurulum gerektirmeksizin tarayıcıda çalışmaktadır. 30 öğrencili bir sınıf için optimizasyon süreci standart bir dizüstü bilgisayarda 1–2 saniye içinde tamamlanmıştır. Sürükle-bırak ile manuel düzeltme, yoklama takibi ve JSON dışa aktarma özellikleri doğru biçimde çalışmaktadır. III. Yapay Zeka ile Eğitim Zirvesi’nde (Yıldız Teknik Üniversitesi) sunulan prototip, öğretmenlerden olumlu geribildirim almıştır.

---

# BÖLÜM 4: SONUÇ VE TARTIŞMA

## 4.1. Sonuç

Bu çalışmada geliştirilen AklıSıra uygulaması, sınıf oturma düzeni oluşturma problemini çok amaçlı genetik algoritma yaklaşımıyla başarıyla ele almıştır. Test sonuçları, sistemin dört temel metriği eşzamanlı olarak optimize ederek rastgele yerleştirmeye kıyasla 2,3 ila 2,5 kat daha yüksek uygunluk skoru ürettiğini ortaya koymaktadır.

Araştırma soruları değerlendirildiğinde:

1. Genetik algoritma, belirlenen metrikler açısından rastgele yerleştirmeyi belirgin biçimde geride bırakmaktadır.
2. Kural tabanlı NLP modülü, açık anahtar kelimeler için yüksek doğruluk sağlamakta; karmaşık ifadelerde performansı düşmektedir.
3. Sistem, farklı düzen tipleri ve öğrenci sayıları için kabul edilebilir performans sergilemektedir.

## 4.2. Tartışma

Weinstein (1992) ve Wannarka ile Ruhl (2008) tarafından ortaya konan pedagojik ilkeler (ön sıranın önemi, düzen tipinin etkisi, davranışsal ayrıştırma) bu çalışmanın algoritma tasarımına entegre edilmiş ve sonuçlar bu ilkelerle tutarlılık sergilemiştir. AklıSıra, bu teorik yaklaşımları pratik ve dijital bir araca dönüştürmüştür. Tüm hesaplamaların tarayıcıda yerel olarak yürütülmesi, eğitimde dijitalleşmenin hız kazandığı günümüzde kişisel verilerin korunması açısından da önemli bir katkı sunmaktadır.

## 4.3. Öneriler

**Araştırmaya yönelik öneriler:**
- Sistemin gerçek öğretmenlerle test edilmesi ve üretilen düzenlerin uzun dönemli sınıf performansına etkisinin ölçülmesi.
- Kural tabanlı NLP modülünün büyük dil modelleri ile güçlendirilmesi.

**Uygulamaya yönelik öneriler:**
- MEB e-Okul sisteminden öğrenci verilerinin otomatik içe aktarılmasını sağlayan bir entegrasyon API’sinin geliştirilmesi.
- Mobil uygulama sürümünün hazırlanması.
- Sistemin zaman içinde oturma düzeni geçmişini kaydederek örüntüler çıkaran bir öğrenen sistem bileşeniyle geliştirilmesi.

---

# KAYNAKLAR

Millî Eğitim Bakanlığı. (2020). *BİLSEM proje yazım kılavuzu*. Ankara: MEB Özel Eğitim ve Rehberlik Hizmetleri Genel Müdürlüğü.

Reinke, W. M. ve Herman, K. C. (2002). Creating school environments that deter antisocial behaviors in youth. *Psychology in the Schools*, 39(5), 549–560.

Richey, R. C. ve Klein, J. D. (2007). *Design and development research: Methods, strategies, and issues*. Mahwah, NJ: Lawrence Erlbaum Associates.

Vygotsky, L. S. (1978). *Mind in society: The development of higher psychological processes*. Cambridge, MA: Harvard University Press.

Wannarka, R. ve Ruhl, K. (2008). Seating arrangements that promote positive academic and behavioural outcomes: A review of empirical research. *Support for Learning*, 23(2), 89–93.

Weinstein, C. S. (1992). Designing the instructional environment: Focus on seating. *Proceedings of Selected Research and Development Presentations at the Convention of the Association for Educational Communications and Technology*, 1–11.

---

# EKLER

## EK-A: AklıSıra Uygulaması Ekran Görüntüleri

*(Rapor tesliminde aşağıdaki ekranların görüntülerini ekleyiniz:)*

- Şekil 1. Öğrenci listesi ve serbest metin giriş ekranı
- Şekil 2. Sınıf ayarları ekranı
- Şekil 3. Optimizasyon sürecini gösteren nesil-skor grafiği
- Şekil 4. Tamamlanmış oturma düzeni görselleştirmesi
- Şekil 5. Yapay zeka analiz raporu ekranı

## EK-B: Örnek Öğrenci Test Veri Seti

**Tablo 3.** test_students.csv Dosyasından Örnek Kayıtlar

| Name | Academic Level | Movement Needs | Behavior Type | Special Needs | Friends | Avoid Students |
|---|---|---|---|---|---|---|
| Ali | high | moderate | leader | none | Mehmet | — |
| Ayşe | average | high | disruptive | adhd | — | Fatma |
| Fatma | above_average | low | quiet | none | Elif | Ayşe |
| Mehmet | struggling | moderate | follower | vision | Ali | — |
| Elif | high | low | quiet | none | Fatma | — |

*(Dosyanın tam içeriği proje klasöründeki public/test_students.csv dosyasında yer almaktadır.)*

---

# ÖZGEÇMİŞ

**Yusuf Kerim KAYMAKCI**

[Doğum yılı] yılında [doğum yeri]'nde doğmuştur. İlköğrenimini [ilkokul adı]'nda tamamlamıştır. Hâlen [okul adı]'nda öğrenim görmektedir. Esenyurt Bilim ve Sanat Merkezi'nde Bilişim Teknolojileri yetenek alanında çalışmalarını sürdürmektedir. Yazılım geliştirme, yapay zeka ve algoritma tasarımı alanlarına ilgi duymakta; bu alanlardaki bilgi ve becerilerini BİLSEM proje çalışmalarıyla pekiştirmektedir.
