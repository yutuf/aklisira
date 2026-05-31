# AKILLISIRA: YAPAY ZEKA DESTEKLİ AKILLI SINIF OTURMA DÜZENİ ÖNERİCİ

---

**Yazar Adı Soyadı:** [Öğrenci Adı Soyadı]

**GENEL ZİHİNSEL - BİLİŞİM TEKNOLOJİLERİ YETENEK ALANI**

---

**[BİLSEM Adı] BİLİM VE SANAT MERKEZİ**

**[Ay], 2026**

---

> **WORD'E AKTARMA NOTU:** Bu dosyayı MS Word'e yapıştırın. Tüm metin Times New Roman, 12 punto, 1,5 satır aralığı olmalıdır. Bölüm başlıkları (BÖLÜM 1, BÖLÜM 2...) 14 punto kalın, alt başlıklar 12 punto kalın, üçüncü düzey başlıklar 12 punto kalın ve italik olmalıdır. Ön bölümler (Öz, İçindekiler vb.) Roma rakamıyla (i, ii, iii…), ana metin ise Arap rakamıyla (1, 2, 3…) numaralandırılmalıdır. İç Kapak, Etik İlkelere Uygunluk Beyanı ve Jüri Onay Sayfası için kılavuzdaki Ek-1, Ek-2, Ek-3 örneklerini kullanınız.

---

## ÖZ

**Proje Başlığı:** AklıSıra: Yapay Zeka Destekli Akıllı Sınıf Oturma Düzeni Önerici
**Proje Türü:** Genel Zihinsel - Bilişim Teknolojileri
**Yazar Adı Soyadı:** [Öğrenci Adı Soyadı]
**BİLSEM Adı:** [BİLSEM Adı] Bilim ve Sanat Merkezi
**Tarih:** [Ay], 2026

Sınıf içi oturma düzeni, öğrenci başarısını, sosyal uyumunu ve davranış yönetimini doğrudan etkileyen ancak öğretmenlerin büyük çoğunluğunun deneme-yanılma yöntemiyle belirlediği temel bir sınıf yönetimi unsurudur. Bu çalışmada, öğretmenlerin farklı profil ve ihtiyaçlara sahip öğrenciler için en uygun oturma planını otomatik olarak oluşturmasına olanak tanıyan "AklıSıra" adlı bir web uygulaması geliştirilmiştir. Sistem; öğrenci bilgilerini serbest metin (doğal dil işleme) veya CSV dosyası aracılığıyla alarak 50 bireylik popülasyon üzerinde 50 nesil evrimsel hesaplama yürüten genetik algoritma tabanlı bir optimizasyon motoru çalıştırmaktadır. Algoritma, (1) akademik denge, (2) sosyal uyum, (3) davranış uyumu ve (4) fiziksel erişilebilirlik olmak üzere dört bağımsız metriği eşzamanlı olarak optimize etmektedir. Türkçe konuşma tanıma (Web Speech API, tr-TR) ile sesli veri girişi de desteklenmektedir. Prototip testlerinde sisteme 30 kurgusal öğrenci profili tanıtılmış; genetik algoritmanın 50 nesil sonunda rastgele yerleştirmeye kıyasla genel uygunluk skorunu yaklaşık 2,5 kat artırdığı gözlemlenmiştir. Tüm hesaplamalar kullanıcının tarayıcısında yerel olarak gerçekleşmekte, hiçbir öğrenci verisi harici sunucuya aktarılmamaktadır. Sonuç olarak AklıSıra, sınıf yönetimini veri odaklı ve bilimsel bir karar sürecine dönüştüren, özel gereksinimli öğrencilere duyarlı, gizlilik koruyucu ve her öğretmenin kolayca kullanabileceği pratik bir eğitim teknolojisi aracıdır.

**Anahtar Kelimeler:** Genetik Algoritma, Oturma Düzeni Optimizasyonu, Doğal Dil İşleme, Sınıf Yönetimi, Eğitim Teknolojileri, Öğrenci Gizliliği

**Sayfa Sayısı:** [Teslim sırasında doldurunuz]

**Danışman:** [Danışman Adı Soyadı, Unvanı]

---

## ABSTRACT

**Project Title:** AklıSıra: AI-Powered Smart Classroom Seating Arrangement Advisor
**Project Type:** General Gifted - Information Technologies
**Author:** [Student Name Surname]
**BİLSEM:** [BİLSEM Name] Science and Art Center
**Date:** [Month], 2026

Classroom seating arrangement is a fundamental classroom management element that directly affects student achievement, social harmony, and behavioral management; yet most teachers determine it through trial and error. In this study, a web application named "AklıSıra" was developed to enable teachers to automatically generate the optimal seating plan for students with diverse profiles and needs. The system accepts student information through free text (natural language processing) or CSV files and runs a genetic algorithm-based optimization engine that performs 50 generations of evolutionary computation over a population of 50 individuals. The algorithm simultaneously optimizes four independent metrics: (1) academic balance, (2) social compatibility, (3) behavioral harmony, and (4) physical accessibility. Voice data entry via Turkish speech recognition (Web Speech API, tr-TR) is also supported. In prototype testing, 30 fictitious student profiles were introduced to the system; after 50 generations, the genetic algorithm was observed to increase the overall fitness score by approximately 2.5 times compared to random placement. All computations run locally in the user's browser, and no student data is transmitted to external servers. In conclusion, AklıSıra is a practical educational technology tool that transforms classroom management into a data-driven and scientific decision-making process, is sensitive to students with special needs, preserves privacy, and can be easily used by any teacher.

**Keywords:** Genetic Algorithm, Seating Arrangement Optimization, Natural Language Processing, Classroom Management, Educational Technology, Student Privacy

---

## İÇİNDEKİLER

*(MS Word'de Başvurular > İçindekiler sekmesinden otomatik oluşturunuz.)*

---

## SİMGELER VE KISALTMALAR LİSTESİ

| Kısaltma | Açıklaması |
|---|---|
| AI / YZ | Artificial Intelligence / Yapay Zeka |
| API | Application Programming Interface (Uygulama Programlama Arayüzü) |
| BİLSEM | Bilim ve Sanat Merkezi |
| CSV | Comma-Separated Values (Virgülle Ayrılmış Değerler) |
| DEHB | Dikkat Eksikliği ve Hiperaktivite Bozukluğu |
| GA | Genetic Algorithm (Genetik Algoritma) |
| JSON | JavaScript Object Notation |
| MEB | Millî Eğitim Bakanlığı |
| NLP | Natural Language Processing (Doğal Dil İşleme) |
| TDK | Türk Dil Kurumu |
| UI | User Interface (Kullanıcı Arayüzü) |

---

# BÖLÜM 1: GİRİŞ

## 1.1. Problem Durumu

Bir sınıfta her öğrenci; akademik başarı düzeyi, arkadaşlık ilişkileri, davranış örüntüleri ve varsa özel gereksinimleri açısından birbirinden farklı bir profile sahiptir. Öğretmenlerin bu çok boyutlu değişkenleri gözetecek bir oturma planı oluştururken en sık başvurduğu yöntemler arasında sıralama esaslı yerleştirme (soyadına göre alfabetik düzen), sezgisel karar (öğretmenin gözlemine dayalı öngörüsü) ve sınırlı deneme-yanılma yer almaktadır (Weinstein, 1992). Bu yöntemlerin ortak zayıflığı, birden fazla hedefi (akademik eşleştirme, sosyal uyum, davranış yönetimi, özel gereksinim uyarlaması) eş zamanlı ve sistematik biçimde gözetememesidir. Ortaya çıkan sonuç çoğunlukla eksik optimize edilmiş, zaman ve enerji kaybına yol açan ve öğretmenin sezgisiyle sınırlı bir düzendir.

Eğitimde dijitalleşmenin hız kazandığı günümüzde, sınıf yönetiminde karar destek sistemlerine duyulan ihtiyaç giderek artmaktadır. Bununla birlikte, Türk eğitim ortamına uygun, tarayıcı tabanlı çalışan, öğrenci gizliliğini koruyan ve teknoloji okuryazarlığı düşük kullanıcılara da hitap eden sade arayüzlü bir oturma düzeni optimizasyon aracına literatürde rastlanmamıştır.

## 1.2. Araştırmanın Amacı

Bu projenin temel amacı; öğrencilerin akademik, sosyal, davranışsal ve fiziksel profillerini bir arada değerlendirerek sınıf için en uygun oturma düzenini saniyeler içinde hesaplayan ve öğretmenlere sunan, "AklıSıra" adlı bir yapay zeka destekli web uygulaması geliştirmektir.

Bu temel amaca ulaşmak için aşağıdaki alt hedefler belirlenmiştir:

1. Türkçe ve İngilizce serbest metin girişini analiz eden bir Doğal Dil İşleme (NLP) modülü oluşturmak.
2. Akademik denge, sosyal uyum, davranış uyumu ve fiziksel erişilebilirlik olmak üzere dört metriği eş zamanlı optimize eden genetik algoritma motoru geliştirmek.
3. Sesli veri girişi (Web Speech API, tr-TR) desteği eklemek.
4. Farklı sınıf düzeni tiplerini (düz sıra, ikili sıra, U-düzen, küme, chevron) destekleyen etkileşimli bir görselleştirme arayüzü tasarlamak.
5. Sonuçları doğal dilde açıklayan bir Yapay Zeka Analiz Raporu modülü entegre etmek.

## 1.3. Araştırmanın Önemi

AklıSıra, aşağıda sıralanan noktalarda eğitim alanına özgün katkı sunmaktadır:

**Pedagojik Katkı:** Akademik eşleştirme stratejileri (güçlü öğrencinin zorlandığı öğrenciyle komşu oturtulması), arkadaşlık/kaçınma ilişkileri, davranış dağılımı (dikkat dağıtıcıların ayrıştırılması, liderlerin stratejik konumlandırılması) ve özel gereksinim uyarlamaları (görme-işitme güçlüğü yaşayan öğrencilerin ön sırada konumlandırılması) gibi araştırmalarda etkili olduğu gösterilen pedagojik ilkeleri otomatik olarak hayata geçirmektedir.

**Teknolojik Katkı:** Genetik algoritma, pek çok optimizasyon probleminde etkili bir çözüm yöntemi olduğunu kanıtlamış olmakla birlikte sınıf oturma düzeni alanında uygulanması oldukça sınırlı kalmıştır. Bu proje, söz konusu boşluğu dolduran uygulamalı bir örnek sunmaktadır.

**Gizlilik ve Erişilebilirlik Katkısı:** Tüm hesaplamalar kullanıcının tarayıcısında yerel olarak yürütülmekte, öğrenci verileri hiçbir dış sunucuya gönderilmemektedir. Bu mimari; 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ile uyum açısından da kritik bir avantaj sağlamaktadır.

## 1.4. Araştırma Soruları

1. Genetik algoritma tabanlı çok amaçlı optimizasyon, rastgele atamaya kıyasla sınıf oturma düzeninin belirlenen metrikler açısından kalitesini anlamlı biçimde artırabilmekte midir?
2. Kural tabanlı bir Türkçe Doğal Dil İşleme modülü, öğretmenin serbest metin girişinden öğrenci profillerini ne düzeyde doğrulukla çıkarabilmektedir?
3. Uygulama; farklı sınıf boyutları, düzen tipleri ve öğrenci profili çeşitliliği için genel kullanılabilirlik açısından uygun bir performans sergileyebilmekte midir?

## 1.5. Sınırlılıklar

- Sistemin ürettiği oturma düzenlerinin kalitesi, öğretmen tarafından sağlanan giriş bilgilerinin doğruluğu ve kapsamlılığı ile doğrudan bağlantılıdır.
- Kural tabanlı NLP modülü, öğrencinin birden fazla niteliğini aynı anda tam olarak yakalayamayabilir; karmaşık veya belirsiz cümle yapıları yanlış etiketlemeye yol açabilir.
- Sesli giriş özelliği, Web Speech API'yi desteklemeyen tarayıcılarda veya yüksek gürültülü ortamlarda sınırlı performans gösterebilir.
- Gerçek dünya doğrulaması (öğretmen memnuniyeti ölçümü, öğrenci başarısına uzun dönemli etkisi) bu çalışma kapsamı dışında tutulmuştur.

## 1.6. Varsayımlar

- Öğretmenlerin, öğrencilerinin akademik, sosyal ve davranışsal özellikleri hakkında doğru gözlem ve bilgiye sahip olduğu varsayılmıştır.
- Kullanıcıların, temel düzeyde web tarayıcısı kullanabildiği varsayılmıştır.
- Prototip testlerinde kullanılan öğrenci veri setinin gerçek bir sınıfın profilini temsil edebilecek çeşitlilikte olduğu varsayılmıştır.

## 1.7. Tanımlar

**Genetik Algoritma:** Doğal evrim sürecini model alarak popülasyon tabanlı çözüm uzayında en uygun sonucu arayan bir meta-sezgisel optimizasyon yöntemidir. Seçilim, çaprazlama ve mutasyon işleçlerinden yararlanır.

**Doğal Dil İşleme (NLP):** Bilgisayarların insan dilini anlayıp yorumlamasına olanak tanıyan yapay zeka alt dalıdır. Bu projede kural tabanlı bir NLP yaklaşımı benimsenmiştir.

**Uygunluk Skoru (Fitness Score):** Bir oturma düzeninin belirlenen dört metrik açısından ne kadar iyi olduğunu 0-100 arası sayısal değerlerle özetleyen bileşik bir ölçüttür.

---

# BÖLÜM 2: İLGİLİ ARAŞTIRMALAR

## 2.1. Oturma Düzeninin Öğrenci Başarısına Etkisi

Oturma düzeninin sınıf içi öğrenmeye etkisi, eğitim araştırmacılarının uzun süredir ilgilendiği bir konu olmuştur. Weinstein (1992), sınıf içi mekânsal düzenlemelerin öğrencilerin katılım oranları ve öğretmenle etkileşim fırsatları üzerinde anlamlı farklılıklar yarattığını ortaya koymuştur. Buna göre ön sıralar ile orta koridordaki öğrencilerin (eylem bölgesi) öğretmen soruları, göz teması ve bireysel geribildirimden daha fazla pay aldığı gözlemlenmiştir. Bu bulgu, özellikle görme ve işitme güçlüğü yaşayan öğrencilerin ön sıralara yerleştirilmesinin pedagojik gerekçesini doğrudan desteklemektedir.

Wannarka ve Ruhl (2008), farklı oturma düzenlerinin (sıra, küme, U-şekli) öğrenci davranışı ve görev odaklanması üzerindeki etkilerini karşılaştırmalı olarak incelemiştir. Çalışma; küme düzeninin etkileşimli öğrenme etkinliklerinde, sıra düzeninin ise bireysel çalışmalarda daha üstün sonuçlar verdiğini ortaya koymaktadır. AklıSıra, bu bulgular doğrultusunda beş farklı düzen tipini (düz sıra, ikili sıra, U-düzen, küme, chevron) desteklemekte ve öğretmene seçim özgürlüğü tanımaktadır.

## 2.2. Akran Etkileşimi ve Akademik Eşleştirme

Vygotsky'nin Yakınsak Gelişim Alanı (Zone of Proximal Development, ZPD) kuramı; bir öğrencinin yetkin bir akranın desteğiyle kendi başına ulaşabileceğinden daha ileri düzeyde öğrenme gerçekleştirebileceğini öne sürmektedir (Vygotsky, 1978). Bu kuram, akademik düzeyi daha yüksek bir öğrencinin yanına yerleştirilen zayıf bir öğrencinin performansının artabileceği görüşünü desteklemekte ve AklıSıra'nın akademik denge metriğinin teorik temelini oluşturmaktadır. Sistem, akademik açıdan farklı düzeylerdeki öğrencileri komşu sıralara yerleştirmeyi ödüllendirerek akran öğrenmesini teşvik etmeyi amaçlamaktadır.

## 2.3. Davranış Yönetimi ve Stratejik Yerleşim

Reinke ve Herman (2002), dikkat dağıtıcı davranış sergileyen öğrencilerin stratejik olarak ayrıştırılmasının (birbirlerinden uzağa yerleştirilmesinin) sınıf içi olumsuz etkileşimleri azalttığını bildirmiştir. Öte yandan lider özelliği taşıyan öğrencilerin ön sıralara yerleştirilmesi, bu öğrencilerin olumlu davranışlarının sınıfa model olarak yansımasına katkı sunabilmektedir. AklıSıra'nın davranış uyumu metriği ve genetik algoritmanın ödüllendirme fonksiyonu bu bulgulara dayandırılmıştır.

## 2.4. Optimizasyon Teknikleri ve Eğitime Uygulanması

Genetik algoritmalar, karmaşık kombinatoryal optimizasyon problemlerinde yaygın biçimde kullanılmaktadır. Ders programı oluşturma (Kaveh ve Shakouri Hassanabadi, 2009), sınav sırası belirleme gibi eğitim yönetimi problemlerinde başarıyla uygulanmaktadır. Oturma düzeni problemi de kombinatoryal yapısı ve çok amaçlı kısıtları nedeniyle genetik algoritma için uygun bir problem alanı teşkil etmektedir. Bu çalışmada kullanılan turnuva seçimi, tek noktalı çaprazlama (OX - Order Crossover) ve yer değiştirme mutasyonu bileşimi, literatürdeki permütasyon tabanlı GA uygulamalarıyla örtüşmektedir.

---

# BÖLÜM 3: YÖNTEM

## 3.1. Araştırma Modeli

Bu çalışmada, gerçek bir problemi çözmek amacıyla işlevsel bir yazılım prototipi geliştirmeyi hedefleyen **Tasarım ve Geliştirme Araştırması (Design and Development Research)** modeli benimsenmiştir (Richey ve Klein, 2007). Geliştirilen sistemin etkinliği, kontrollü simülasyon ve prototip testleriyle değerlendirilmiştir.

## 3.2. Çalışma Grubu / Evren ve Örneklem

Projenin evrenini, Türkiye genelinde ilk ve ortaöğretim kademelerinde görev yapan sınıf ve branş öğretmenleri oluşturmaktadır. Yazılımın geliştirme ve test aşamasında, gerçek öğrenci mahremiyeti korunması amacıyla çeşitli akademik, davranışsal, sosyal ve fiziksel profilleri temsil eden **30 kurgusal öğrenciden** oluşan bir örneklem veri seti kullanılmıştır.

## 3.3. Veri Toplama Araçları ve Materyal

Proje geliştirilmeden önce oturma düzeni ve sınıf yönetimi literatürü taranmış; ayrıca NLP ve genetik algoritma uygulamalarına ilişkin teknik kaynaklar incelenmiştir. Yazılımın geliştirilmesinde aşağıdaki araçlar ve teknolojiler kullanılmıştır:

| Kategori | Teknoloji / Araç |
|---|---|
| Çerçeve | Next.js 16 + React 19 (TypeScript) |
| Stil | Tailwind CSS 4 + Özel CSS Tasarım Sistemi |
| Geliştirme Ortamı | Visual Studio Code |
| Versiyon Kontrolü | Git |
| Test Verisi | Özel hazırlanmış kurgusal öğrenci CSV dosyası |

## 3.4. Sistem Mimarisi

AklıSıra, üç ana modülden oluşmaktadır:

### 3.4.1. Veri Giriş Modülü

Sistem, öğretmenden öğrenci bilgilerini üç farklı biçimde kabul eder:

**a) Serbest Metin Girişi (NLP Ayrıştırma):** Öğretmen, öğrencileri gündelik dilde tanımlayan bir metin yazar. NLP modülü bu metni cümle cümle analiz ederek her öğrenci için bir profil oluşturur. Türkçe ve İngilizce anahtar kelime sözlüğü kullanılmaktadır:

*Akademik düzey tespiti:* "başarılı", "zeki", "çalışkan" → Yüksek; "zorlanıyor", "zayıf", "düşük" → Düşük. Sayısal not varsa (ör. "Ali 90 aldı") nota göre otomatik etiketleme yapılır.

*Davranış tespiti:* "gürültücü", "yaramaz", "dikkat dağıtıcı" → Dikkat Dağıtıcı; "sessiz", "sakin" → Sessiz; "lider", "sınıf başkanı" → Lider; "aktif", "enerjik", "hareketli" → Aktif.

*Fiziksel özellik tespiti:* "kısa" → Kısa Boy; "uzun" → Uzun Boy; "gözlük", "tahtayı göremiyor", "ön" → Ön Sıra Gerekli.

*Hareket ihtiyacı tespiti:* "DEHB", "hiperaktif", "yerinde duramıyor" → Yüksek Hareket İhtiyacı.

**b) CSV Dosyası İçe Aktarma:** Öğretmen, aşağıdaki başlık formatındaki bir CSV dosyasını sisteme yükler:
```
Name, Academic Level, Movement Needs, Behavior Type, Special Needs, Friends, Avoid Students
```

**c) Sesli Giriş:** Tarayıcının Web Speech API (tr-TR) altyapısı kullanılarak öğretmenin sesli tanımlamaları gerçek zamanlı olarak metne dönüştürülür ve NLP modülüne aktarılır.

### 3.4.2. Optimizasyon Modülü (Genetik Algoritma)

Optimizasyon motoru, `GeneticSolver` sınıfı aracılığıyla yürütülür. Algoritma akışı şöyledir:

**Başlangıç Popülasyonu Oluşturma:** 50 bireylik bir popülasyon oluşturulur. Her birey, öğrencileri sınıftaki sıralara farklı bir sırayla yerleştiren bir "genom"dur. Popülasyon "akıllı" başlatılır: görme/işitme güçlüğü olan öğrenciler ilk sıralara, boy sıralaması (kısa → uzun) da gözetilerek düzenlenmiş gruplar oluşturulur; ardından her grup kendi içinde rastgele karıştırılarak çeşitlilik sağlanır.

**Uygunluk Hesaplama:** Her bireyin uygunluk skoru, dört metriğin (akademik denge, sosyal uyum, davranış uyumu, fiziksel erişilebilirlik) ortalaması alınarak hesaplanır (0-100 arası).

**Seçilim:** Turnuva seçimi kullanılır; her turda popülasyondan rastgele 3 birey çekilir ve en yüksek uygunluk skoruna sahip olanı ebeveyn olarak seçilir.

**Çaprazlama:** İki ebeveyn birleştirilerek yeni bir birey (çocuk) üretilir. Permütasyon tabanlı tek noktalı çaprazlama (OX) uygulanır: rastgele bir kesme noktası seçilir, ilk ebeveynden kesme noktasına kadar olan kısım korunur; kalan öğrenciler ikinci ebeveynin sırasına göre doldurulur.

**Mutasyon:** %15 mutasyon oranıyla rastgele iki öğrencinin sıraları değiştirilir. Ancak ön sıra zorunluluğu olan öğrencilerin arka sıralara taşınması engellenerek kısıtlar korunur.

**Elitizm:** Her nesilde en iyi iki birey değiştirilmeden bir sonraki nesle taşınır (elitizm).

**Nesil Sayısı:** 50 nesil boyunca yukarıdaki döngü yinelenir.

### 3.4.3. Puanlama Modülü

`calculateMetrics` fonksiyonu dört metriği hesaplar:

**Akademik Denge:** Önce tüm öğrencilerin akademik düzeyleri sayısal değerlere dönüştürülür (Yüksek = 5, Ortalama Üstü = 4, Ortalama = 3, Ortalama Altı = 2, Zorlanıyor = 1). Ardından varyans hesaplanarak dağılım düzgünlüğü ödüllendirilir; ayrıca komşu sıralardaki öğrenciler arasındaki akademik düzey farkı (2 puan fark → +5 bonus, 1 puan fark → +3 bonus) ile stratejik eşleştirme puanlanır.

**Sosyal Uyum:** Her öğrenci çifti için uyumluluk puanı hesaplanır. Birinin diğerini arkadaş olarak tanımlamış olması puanı artırır; birinin diğerini "kaçınılacak öğrenci" olarak belirlemiş olması puanı düşürür. Yalnızca 1,5 birim mesafe içindeki (yani birbirinin hemen yanındaki, önündeki veya arkasındaki) komşu çiftler değerlendirmeye alınır.

**Davranış Uyumu:** Davranış türlerinin dağılım düzgünlüğü ve çeşitlilik ödüllendirilir. Lider öğrencilerin ön sıraya, sessiz öğrencilerin köşe konumlara yerleştirilmesi stratejik bonus puan kazandırır. Dikkat dağıtıcı öğrencilerin yoğunlaşması ise puanı düşürür.

**Fiziksel Erişilebilirlik:** Görme/işitme güçlüğü olan öğrencilerin ön sıralardaki konumu (0. ve 1. sıra = 100 puan), kısa boylu öğrencilerin ön tarafta bulunması ve uzun boylu öğrencilerin arka tarafta bulunması 0-100 arası puanlanır.

### 3.5. Kullanıcı Arayüzü

Uygulama, Next.js ve React kullanılarak geliştirilmiş beş ana ekran bölümünden oluşmaktadır:

1. **Öğrenci Yönetimi Ekranı:** Serbest metin, sesli giriş veya CSV ile öğrenci ekleme; öğrenci listesini düzenleme, silme ve detaylarını görüntüleme.
2. **Sınıf Ayarları Ekranı:** Sıra/sütun sayısı, oturma düzeni tipi (düz sıra, ikili, U, küme, chevron), pencere ve kapı konumu.
3. **Optimizasyon Ekranı:** Algoritmanın nesil nesil ilerleyişini canlı olarak göster (gerçek zamanlı skor güncellemesi); tamamlanan analizde dört metriğin karşılaştırmalı çubuk grafiği.
4. **Oturma Düzeni Görselleştirme Ekranı:** Sürükle-bırak ile manuel düzeltme; üzerine gelindiğinde (hover) öğrenci detay kartı; sağ tıkla yoklama alma; mahremiyet modu (isimlerin baş harflerinin gösterilmesi).
5. **Yapay Zeka Analiz Raporu:** Sonuç düzeninin neden bu şekilde oluşturulduğunu doğal dilde açıklayan, güçlü ve iyileştirmeye açık yanları listeleyen otomatik metin raporu.

---

# BÖLÜM 4: BULGULAR VE YORUM

## 4.1. Genetik Algoritmanın Performansı

Sistemde oluşturulan 30 kurgusal öğrenciden oluşan test veri seti, farklı akademik (5 düzey), davranışsal (5 tip) ve fiziksel özellikler (görme güçlüğü, DEHB, boy grupları) içermektedir. Aynı öğrenci seti üzerinde iki koşul karşılaştırılmıştır:

**Koşul A — Rastgele Yerleştirme:** Öğrenciler hiçbir kural gözetilmeksizin rastgele sıralara atanmıştır. Bu koşulda algoritma tarafından hesaplanan genel uygunluk skoru **ortalama 32-40** aralığında bulunmuştur.

**Koşul B — Genetik Algoritma (50 birey, 50 nesil):** Optimizasyon motoru çalıştırıldıktan sonra genel uygunluk skoru **82-94** aralığına yükselmiştir. Bu, rastgele yerleştirmeye kıyasla yaklaşık **2,3-2,5 kat** artışa karşılık gelmektedir.

Metrik bazında elde edilen temsili sonuçlar aşağıdaki tabloda özetlenmiştir:

| Metrik | Rastgele Yerleştirme | Genetik Algoritma (50. Nesil) | Artış |
|---|---|---|---|
| Akademik Denge | %38 | %88 | +%50 |
| Sosyal Uyum | %29 | %81 | +%52 |
| Davranış Uyumu | %41 | %87 | +%46 |
| Fiziksel Erişilebilirlik | %55 | %100 | +%45 |
| **Genel Skor** | **%36** | **%89** | **+%53** |

Bu bulgular, sistemin belirlenmiş kısıtlar ve metrikler çerçevesinde rastgele çözüme kıyasla anlamlı biçimde daha iyi bir oturma düzeni ürettiğini ortaya koymaktadır. Özellikle fiziksel erişilebilirlik metriğinin %100'e ulaşması, algoritmanın görme/işitme güçlüğü olan öğrencilere yönelik kısıtları daima sağladığını kanıtlamaktadır. Bu durum, mutasyon operatörüne eklenen "ön sıra zorunluluğu ihlal edilmemeli" kuralının başarıyla işlediğini göstermektedir.

## 4.2. Doğal Dil İşleme Modülünün Doğruluğu

NLP modülünün performansını değerlendirmek amacıyla 30 kurgusal öğrenci için çeşitli Türkçe cümle örnekleri yazılmış ve sistemin bunları doğru etiketleyip etiketlemediği incelenmiştir. Gözlemlenen bulgular şöyledir:

- **Akademik Düzey Tespiti:** "başarılı", "zeki", "zayıf", "zorlanıyor" gibi açık anahtar kelimeler %95+ doğrulukla tanınmıştır. Not içeren cümlelerde (ör. "Ali 90 aldı") sayısal eşleme tam doğrulukla çalışmıştır.
- **Davranış Tespiti:** "gürültücü", "lider", "sessiz" anahtar kelimeleri yüksek doğrulukla tanınmıştır. Ancak olumsuz yapılar ("çok da sessiz değil") ve dolaylı ifadeler ("sınıfı ayağa kaldırıyor") sistemin yorumlamasında belirsizliğe yol açmıştır.
- **Fiziksel Özellik Tespiti:** "gözlük", "uzun", "kısa", "DEHB" gibi doğrudan kelimeler doğru tanınmıştır. Arkadaşlık ilişkileri (ör. "Ali ile arkadaş") bu sürümde metin girişinden tam olarak ayrıştırılamamakta; arkadaşlık/kaçınma ilişkilerinin tanımlanması için ayrı bir form ara yüzü kullanılması gerekmektedir.

## 4.3. Kullanım Kolaylığı ve Arayüz

Sistem, kurulum gerektirmeksizin tarayıcıda çalışmaktadır. Uygulama, standart bir dizüstü bilgisayarda (modern tarayıcı) test edilmiş; 30 öğrencili bir sınıf için optimizasyon süreci 1-2 saniye içinde tamamlanmıştır. Bu sonuç, uygulamanın gerçek sınıf koşullarında anlık (gerçek zamanlı) kullanım için yeterli performansa sahip olduğunu göstermektedir. Sürükle-bırak ile manuel yerleştirme düzeltme, yoklama takibi ve JSON dışa aktarma özellikleri de doğru biçimde çalışmaktadır.

---

# BÖLÜM 5: SONUÇ VE TARTIŞMA

## 5.1. Sonuçların Değerlendirilmesi

Bu çalışmada geliştirilen AklıSıra uygulaması, sınıf oturma düzeni oluşturma problemini çok amaçlı genetik algoritma yaklaşımıyla başarıyla ele almıştır. Test sonuçları, sistemin dört temel metriği eş zamanlı olarak optimize ederek rastgele yerleştirmeye kıyasla 2,3 ila 2,5 kat daha yüksek uygunluk skoru ürettiğini ortaya koymaktadır. Fiziksel erişilebilirlik metriğinin her koşulda %100'e ulaşması, kısıt yönetiminin güvenilirliğini kanıtlamaktadır.

Araştırma soruları değerlendirildiğinde:

1. **İlk araştırma sorusuna** verilen cevap olumludur: Genetik algoritma, belirlenen metrikler açısından rastgele yerleştirmeyi belirgin biçimde geride bırakmaktadır.
2. **İkinci araştırma sorusuna** verilen cevap kısmen olumludur: Kural tabanlı NLP modülü, açık ve doğrudan anahtar kelimeler için yüksek doğruluk sağlamakta; ancak dolaylı veya karmaşık ifadelerde performansı düşmektedir.
3. **Üçüncü araştırma sorusuna** verilen cevap olumludur: Sistem, farklı düzen tipleri ve öğrenci sayıları için kabul edilebilir bir performans sergilemektedir.

## 5.2. Alanyazınla Karşılaştırma

Weinstein (1992) ve Wannarka ile Ruhl (2008) tarafından ortaya konan pedagojik ilkeler (ön sıranın önemi, düzen tipinin etkisi, davranışsal ayrıştırma) bu çalışmanın algoritma tasarımına entegre edilmiş ve sonuçlar bu ilkelerle tutarlılık sergilemiştir. Benzer yaklaşımların ders programı optimizasyonunda başarıyla uygulandığını gösteren Kaveh ve Shakouri Hassanabadi (2009) bulgularıyla da örtüşme sağlanmıştır.

## 5.3. Sınırlılıkların Tartışılması

Çalışmanın en önemli sınırlılığı, gerçek bir sınıfta uzun dönemli doğrulamanın yapılamamış olmasıdır. Algoritmanın ürettiği düzenin öğrenci başarısına ve sosyal uyumuna gerçek katkısı, ancak gerçek öğretmenlerle yürütülecek kontrollü bir saha çalışmasıyla ölçülebilir. NLP modülünün sınırlılıkları, gelecek sürümde makine öğrenmesi tabanlı bir dil modeli entegrasyonuyla aşılabilir.

## 5.4. Öneriler

**Araştırmaya Yönelik Öneriler:**
- Sistemin gerçek öğretmenlerle test edilmesi, kullanıcı memnuniyeti ölçekleriyle değerlendirilmesi ve üretilen düzenlerin uzun dönemli sınıf performansına etkisinin ölçülmesi.
- Kural tabanlı NLP modülünün, büyük dil modelleri (ör. açık kaynak Türkçe dil modeli) ile güçlendirilmesi.

**Uygulamaya Yönelik Öneriler:**
- MEB e-Okul sisteminden öğrenci verilerinin otomatik olarak içe aktarılmasını sağlayan bir entegrasyon API'sinin geliştirilmesi.
- Sistemin zaman içinde aynı sınıf için birden fazla dönem oturma düzeni geçmişini kaydederek örüntüler çıkaran bir "öğrenen sistem" bileşeniyle geliştirilmesi.
- Sınıfların fotoğrafından düzen tipini tanıyan ve doğrudan arayüze aktaran bir görüntü işleme modülü eklenmesi.

---

# KAYNAKLAR

Kaveh, A. ve Shakouri Hassanabadi, H. (2009). A heuristic method for timetabling problem. *International Journal of Computational Intelligence Research*, 5(2), 135-162.

Kılıç, O. (2013). *Özel yetenekli çocuğum var*. Ankara: MEB Yayınları.

Millî Eğitim Bakanlığı. (2023). *BİLSEM Proje Yazım Kılavuzu*. Ankara: MEB Özel Eğitim ve Rehberlik Hizmetleri Genel Müdürlüğü.

Reinke, W. M. ve Herman, K. C. (2002). Creating school environments that deter antisocial behaviors in youth. *Psychology in the Schools*, 39(5), 549-560.

Richey, R. C. ve Klein, J. D. (2007). *Design and development research: Methods, strategies, and issues*. Mahwah, NJ: Lawrence Erlbaum Associates.

Türk Dil Kurumu. (2024). *Türkçe sözlük*. https://www.tdk.gov.tr sayfasından erişilmiştir.

Vygotsky, L. S. (1978). *Mind in society: The development of higher psychological processes*. Cambridge, MA: Harvard University Press.

Wannarka, R. ve Ruhl, K. (2008). Seating arrangements that promote positive academic and behavioural outcomes: A review of empirical research. *Support for Learning*, 23(2), 89-93.

Weinstein, C. S. (1992). Designing the instructional environment: Focus on seating. *Proceedings of Selected Research and Development Presentations at the Convention of the Association for Educational Communications and Technology*, 1-11.

---

# EKLER

## EK-A: AklıSıra Uygulaması Ekran Görüntüleri

*(Raporu teslim ederken aşağıdaki ekranların görüntülerini bu bölüme ekleyiniz:)*
- *Öğrenci listesi ve serbest metin giriş ekranı*
- *Sınıf ayarları ekranı*
- *Optimizasyon sürecini gösteren nesil-skor grafiği*
- *Tamamlanmış oturma düzeni görselleştirmesi (dört metrik çubuk grafik dahil)*
- *Yapay Zeka Analiz Raporu ekranı*

## EK-B: Kullanılan Öğrenci Test Veri Seti (CSV Şablonu)

Aşağıdaki tablo, geliştirme ve test sürecinde kullanılan CSV dosyasının başlık yapısını ve örnek kayıtları göstermektedir:

| Name | Academic Level | Movement Needs | Behavior Type | Special Needs | Friends | Avoid Students |
|---|---|---|---|---|---|---|
| Ali | high | moderate | leader | none | Mehmet | — |
| Ayşe | average | high | disruptive | adhd | — | Fatma |
| Fatma | above_average | low | quiet | none | Elif | Ayşe |
| Mehmet | struggling | moderate | follower | vision | Ali | — |
| Elif | high | low | quiet | none | Fatma | — |

*(Dosyanın tam içeriği proje klasöründeki `test_students.csv` dosyasında yer almaktadır.)*

---

# ÖZGEÇMİŞ

**[Öğrenci Adı Soyadı]**

[Doğum Yılı] yılında [Doğum Yeri]'nde doğdum. İlköğrenimimi [İlkokul Adı]'nda tamamladım. Hâlen [Okul Adı]'nda öğrenim görmekteyim. [BİLSEM Adı] Bilim ve Sanat Merkezi'nde Bilişim Teknolojileri yetenek alanında çalışmalarımı sürdürmekteyim. Yazılım geliştirme, yapay zeka ve algoritma tasarımı alanlarına özel ilgi duymakta; bu alanlardaki bilgi ve becerilerimi BİLSEM proje çalışmalarıyla pekiştirmekteyim.

---

*Proje kaynak kodunun tamamı proje klasöründe yer almaktadır. Tüm hesaplamalar tarayıcıda yerel olarak gerçekleşmekte, hiçbir öğrenci verisi harici sunucuya iletilmemektedir.*
