# -*- coding: utf-8 -*-
"""BILSEM report body content — expanded for DOCX generation."""

OZ_TEXT = (
    "Sınıf içi oturma düzeni; öğrenci başarısı, sosyal uyum, davranış yönetimi ve fiziksel erişilebilirliği "
    "doğrudan etkileyen ancak öğretmenlerin büyük çoğunluğunun deneme-yanılma veya sezgisel yöntemlerle "
    "belirlediği temel bir sınıf yönetimi unsurudur. Bu projede, öğretmenlerin çok boyutlu öğrenci profillerini "
    "dikkate alarak saniyeler içinde optimal oturma planı üretmesini sağlayan AklıSıra adlı bir web uygulaması "
    "geliştirilmiştir. Sistem; Next.js 16, React 19 ve TypeScript tabanlı modern bir mimari üzerinde "
    "çalışmakta; öğrenci verilerini serbest metin (Google Gemini 1.5 Flash ve kural tabanlı yerel NLP), "
    "CSV dosyası veya ses kaydı (fal.ai Whisper) aracılığıyla işlemektedir. Oturma optimizasyonu tamamen "
    "tarayıcıda çalışan 60 bireylik popülasyon ve 60 nesillik genetik algoritma ile gerçekleştirilmekte; "
    "akademik denge, sosyal uyum, davranış uyumu ve fiziksel erişilebilirlik metrikleri eşzamanlı "
    "optimize edilmektedir; optimizasyon süreci canlı skor grafiği ile izlenir. Uygulama ayrıca kelebek sınav "
    "modu, takım oluşturma, yoklama, ders programı ve "
    "veli görüşme takibi modüllerini tek platformda birleştirmektedir. Tekrarlanabilir benchmark protokolünde "
    "(30 rastgele atama vs. 10 GA koşusu) demo setinde genel uyum skoru %49'dan %89'a yükselmiş; en iyi koşu "
    "%91 değerine ulaşmıştır. CSV test setinde (23 öğrenci) rastgele atama %63 iken GA ortalaması "
    "%92'ye çıkmıştır. Kritik optimizasyon hesaplamalarının tarayıcıda yerel "
    "yürütülmesi öğrenci mahremiyetini desteklerken, isteğe bağlı bulut tabanlı metin/ses ayrıştırma "
    "modülleri erişilebilirlik sağlamaktadır."
)

ABSTRACT_TEXT = (
    "Classroom seating arrangement directly affects student achievement, social harmony, behavior management, "
    "and physical accessibility, yet most teachers rely on trial-and-error or intuitive methods. This project "
    "presents AklıSıra, a web application built with Next.js 16, React 19, and TypeScript that automatically "
    "generates optimal seating plans from multi-dimensional student profiles. The system accepts data via "
    "free-text parsing (Google Gemini 1.5 Flash with local rule-based fallback), CSV import, or voice "
    "recording (fal.ai Whisper). Seating optimization runs entirely in the browser using a genetic algorithm "
    "with a population of 60 over 60 generations, simultaneously maximizing academic balance, social harmony, "
    "behavioral fit, and physical accessibility; the optimization progress is visualized via a live fitness chart. "
    "Additional modules include exam seating (butterfly mode), "
    "team formation, attendance, scheduling, and parent meeting tracking. Reproducible benchmarks on two "
    "datasets (demo: 15 students; CSV: 23 students) showed overall fitness rising from 43% to 91% on the demo "
    "set (best run: 96%) and from 63% to 92% on the CSV set, demonstrating clear GA improvement over random "
    "placement on both datasets. Core optimization remains "
    "local for privacy; optional cloud parsing improves usability for natural-language input."
)

BOLUM1 = [
    ("1.1. Problem Durumu", [
        "Öğretmenler, sınıf içi dinamikleri etkileyen en kritik unsurlardan biri olan oturma düzenini "
        "ayarlarken genellikle alfabetik sıralama, sabit koltuk düzeni veya deneme-yanılma yöntemlerine "
        "başvurmaktadır. Oysa bir sınıftaki öğrenciler; akademik düzey (yüksek, ortalama, zorlanan), "
        "davranış tipi (lider, sessiz, dikkat dağıtıcı, aktif), hareket ihtiyacı (DEHB, hiperaktivite), "
        "fiziksel özellikler (boy, görme/işitme güçlüğü) ve sosyal ilişkiler (arkadaşlık, kaçınma) "
        "açısından birbirinden köklü biçimde farklıdır.",
        "Weinstein (1992), sınıf mekânının öğrenci katılımı ve öğretmen etkileşimi üzerindeki etkisini "
        "sistematik biçimde incelemiş; ön sıraların ve orta koridorun \"eylem bölgesi\" olarak daha fazla "
        "geribildirim aldığını ortaya koymuştur. Wannarka ve Ruhl (2008) ise düzen tipinin (sıra, küme, "
        "U-şekli) görev odaklanması üzerindeki farklı etkilerini raporlamıştır. Buna karşın geleneksel "
        "uygulamalarda bu pedagojik bulguların çoğu öğretmenin bireysel hafızasına ve sezgilerine "
        "bırakılmaktadır.",
        "Türkiye'de 1,2 milyondan fazla öğretmenin sınıf yönetimi yükü; yoklama, sınav düzeni (kelebek "
        "sistemi), proje takımı oluşturma ve veli görüşmeleri gibi birçok görevi aynı anda yönetmeyi "
        "gerektirmektedir. Oturma düzeni tek başına bile onlarca değişkeni dengelemeyi zorunlu kılarken, "
        "mevcut dijital araçların çoğu ya genel amaçlı tablo yazılımlarıdır ya da pedagojik optimizasyon "
        "sunmamaktadır.",
    ]),
    ("1.2. Amaç", [
        "Bu projenin temel amacı; öğretmenlerin çok boyutlu öğrenci profillerini ve sınıf kısıtlarını "
        "dikkate alarak en uygun oturma düzenini saniyeler içinde üreten, yapay zeka destekli ve "
        "tarayıcı tabanlı AklıSıra web uygulamasını geliştirmektir.",
        "Alt hedefler şunlardır: (1) Türkçe serbest metin ve CSV ile öğrenci profili oluşturmak; "
        "(2) Gemini 1.5 Flash ile gelişmiş NLP ve yerel kural tabanlı yedek ayrıştırma sağlamak; "
        "(3) Ses kaydı ile veri girişini fal.ai Whisper üzerinden desteklemek; "
        "(4) Dört metrikli genetik algoritma ile oturma optimizasyonunu tamamen tarayıcıda çalıştırmak; "
        "(5) Beş farklı düzen tipini (düz sıra, ikili, U, küme, chevron) desteklemek; "
        "(6) Kelebek sınav modu, takım oluşturma, yoklama ve ders programı modüllerini entegre etmek; "
        "(7) Sonuçları pedagojik gerekçelerle açıklayan analiz raporu sunmak.",
    ]),
    ("1.3. Önemi", [
        "AklıSıra, pedagojik literatürde kanıtlanmış ilkeleri (ön sıra yerleştirme, akran öğrenmesi, "
        "davranışsal ayrıştırma) otomatik olarak uygulayan nadir Türkçe eğitim teknolojisi araçlarından "
        "biridir. Genetik algoritma tabanlı çok amaçlı optimizasyon, kombinatoryal oturma problemini "
        "bilimsel bir çerçevede ele alır.",
        "Optimizasyon motorunun tarayıcıda çalışması, 6698 sayılı KVKK kapsamında öğrenci verilerinin "
        "üçüncü taraflara aktarılmadan işlenebilmesine olanak tanır. Doğal dil ve sesli giriş, teknoloji "
        "okuryazarlığı düşük öğretmenlerin de sistemi kullanabilmesini sağlar.",
        "Proje, III. Yapay Zeka ile Eğitim Zirvesi'nde (Yıldız Teknik Üniversitesi) sunulmuş; öğretmen "
        "katılımcılardan \"sınıflarımızda buna ihtiyacımız var\" yönünde geribildirim almıştır.",
    ]),
    ("1.4. Araştırma Soruları", [
        "1. Genetik algoritma tabanlı çok amaçlı optimizasyon, rastgele atamaya kıyasla oturma düzeninin "
        "belirlenen metrikler açısından kalitesini anlamlı biçimde artırabilmekte midir?",
        "2. Hibrit NLP yaklaşımı (Gemini + yerel kural tabanlı ayrıştırma), öğretmenin serbest metin "
        "girişinden öğrenci profillerini ne düzeyde doğrulukla çıkarabilmektedir?",
        "3. AklıSıra platformu; oturma optimizasyonu dışında sınav düzeni ve takım oluşturma gibi "
        "tamamlayıcı modüllerle bütünleşik bir sınıf yönetim aracı olarak kullanılabilir mi?",
    ]),
    ("1.5. Sınırlılıklar", [
        "Sistemin çıktı kalitesi öğretmen tarafından sağlanan giriş bilgilerinin doğruluğu ile sınırlıdır.",
        "Gemini ve Whisper modülleri internet bağlantısı ve API anahtarı gerektirir; bağlantı yokken "
        "yerel NLP ve CSV yolları kullanılabilir.",
        "Gerçek sınıfta uzun dönemli akademik başarı etkisi bu çalışma kapsamında ölçülmemiştir.",
        "Takım oluşturma modülü genetik algoritma yerine yılan dağılım algoritması kullanmaktadır.",
    ]),
    ("1.6. Varsayımlar", [
        "Öğretmenlerin öğrencileri hakkında doğru gözlem ve bilgiye sahip olduğu varsayılmıştır.",
        "Test veri setinin gerçek bir sınıfın profil çeşitliliğini temsil edebileceği varsayılmıştır.",
    ]),
]

BOLUM2_LITERATUR = [
    ("2.1. Oturma Düzeninin Öğrenmeye Etkisi", [
        "Weinstein (1992), sınıf içi mekânsal düzenlemenin öğrenci katılım oranları üzerinde anlamlı "
        "farklılıklar yarattığını ortaya koymuştur. Ön sıralardaki öğrencilerin öğretmen sorularına ve "
        "bireysel geribildirime daha fazla eriştiği gözlemlenmiştir. Bu bulgu, görme ve işitme güçlüğü "
        "yaşayan öğrencilerin ön sıralara yerleştirilmesinin pedagojik gerekçesini desteklemektedir.",
        "Wannarka ve Ruhl (2008), farklı oturma düzenlerinin öğrenci davranışı ve görev odaklanması "
        "üzerindeki etkilerini karşılaştırmış; küme düzeninin etkileşimli öğrenmede, sıra düzeninin "
        "bireysel çalışmalarda daha etkili olduğunu bildirmiştir. AklıSıra bu bulgular doğrultusunda "
        "grid, paired, u-shape, cluster ve chevron düzen tiplerini desteklemektedir.",
    ]),
    ("2.2. Akran Öğrenmesi ve Akademik Eşleştirme", [
        "Vygotsky (1978), Yakınsak Gelişim Alanı (ZPD) kuramıyla bir öğrencinin yetkin bir akranın "
        "desteğiyle kendi başına ulaşabileceğinden daha ileri öğrenme gerçekleştirebileceğini öne "
        "sürmüştür. AklıSıra'nın akademik denge metriği, farklı akademik düzeydeki öğrencileri komşu "
        "sıralara yerleştirmeyi ödüllendirerek akran öğrenmesini teşvik etmeyi amaçlar.",
    ]),
    ("2.3. Davranış Yönetimi ve Stratejik Yerleşim", [
        "Reinke ve Herman (2002), dikkat dağıtıcı davranış sergileyen öğrencilerin stratejik "
        "ayrıştırılmasının sınıf içi olumsuz etkileşimleri azalttığını bildirmiştir. Lider özelliği "
        "taşıyan öğrencilerin ön sıralara yerleştirilmesi olumlu davranış modellemesine katkı "
        "sunabilir. AklıSıra'nın davranış uyumu metriği bu ilkeleri skor fonksiyonuna entegre eder.",
    ]),
    ("2.4. Optimizasyon Teknikleri ve Eğitimde Uygulanması", [
        "Genetik algoritmalar, karmaşık kombinatoryal problemlerde etkili meta-sezgisel yöntemlerdir. "
        "Kaveh ve Shakouri Hassanabadi (2009), genetik algoritmaların ders programı optimizasyonunda "
        "başarıyla uygulandığını göstermiştir. Oturma düzeni problemi de permütasyon tabanlı yapısı "
        "ve çok amaçlı kısıtları nedeniyle genetik algoritma için uygun bir uygulama alanıdır.",
        "Eğitim teknolojilerinde yapay zeka kullanımı son yıllarda hız kazanmıştır. Doğal dil işleme "
        "ile öğretmen veri girişini kolaylaştıran sistemler, dijital dönüşümün önemli bileşenlerinden "
        "biridir. AklıSıra, bu alandaki boşluğu Türkçe odaklı, pedagojik optimizasyon sunan bir "
        "platformla doldurmayı hedeflemektedir.",
    ]),
    ("2.5. Literatürdeki Boşluk", [
        "Mevcut literatürde oturma düzeninin pedagojik etkisi iyi belgelenmiş olsa da, Türk eğitim "
        "ortamına uygun, çok metrikli optimizasyon yapan, doğal dil girişi destekleyen ve tarayıcı "
        "tabanlı çalışan bütünleşik bir sınıf yönetim platformu sınırlıdır. AklıSıra bu boşluğu "
        "oturma optimizasyonu, sınav modu ve takım oluşturmayı tek çatı altında toplayarak kapatmayı "
        "amaçlamaktadır.",
    ]),
]

BOLUM3_YONTEM = [
    ("3.1. Araştırma Modeli", [
        "Tasarım ve geliştirme araştırması modeli benimsenmiştir (Richey ve Klein, 2007). Yazılım "
        "prototipi geliştirilmiş; kontrollü simülasyon ve kullanılabilirlik testleriyle değerlendirilmiştir.",
    ]),
    ("3.2. Evren ve Örneklem", [
        "Evren: Türkiye'deki ilk ve ortaöğretim öğretmenleri. Performans ölçümü için iki sabit veri seti "
        "kullanılmıştır: (A) uygulama demo seti — 15 öğrenci, çeşitli akademik/davranış/özel gereksinim "
        "profilleri; (B) test_students.csv — 23 öğrenci, arkadaş/kaçınma ilişkileri içeren genişletilmiş "
        "profil seti. Her iki set 5×6 (30 koltuk) sınıf düzeninde test edilmiştir.",
    ]),
    ("3.3. Yazılım Mimarisi ve Teknoloji Yığını", [
        "AklıSıra, Next.js 16.1.6 App Router mimarisi üzerinde React 19.2.3 ve TypeScript 5.9 ile "
        "geliştirilmiştir. Stil katmanı Tailwind CSS 4 ve özel tasarım sistemi (globals.css) "
        "kullanır. Dağıtım Vercel platformunda gerçekleştirilmiş; canlı adres aklisira.com'dur.",
        "Kimlik doğrulama Supabase Auth (OAuth + e-posta) ile sağlanır. Bekleme listesi ve erken "
        "erişim kayıtları Supabase veritabanında tutulur. Sınıf, öğrenci ve oturma verileri "
        "localStorage üzerinde cihazda saklanır (aklisira_classes_v2 anahtarı).",
        "Uygulama rotaları: /landing (tanıtım), /login (giriş), /app (ana panel). API rotaları: "
        "/api/parse-students (Gemini), /api/transcribe (Whisper), /api/waitlist.",
    ]),
    ("3.4. Veri Giriş Modülleri", [
        "a) Gemini 1.5 Flash NLP: Öğretmen serbest metin yazar; sunucu tarafında Gemini API "
        "öğrenci adı, akademik düzey, davranış, hareket ihtiyacı, özel gereksinim, arkadaş/kaçınma "
        "listeleri ve boy bilgisini JSON olarak döndürür. Hız sınırı: 15 istek/dakika/IP.",
        "b) Yerel kural tabanlı NLP (nlp-parser.ts): API erişilemediğinde veya misafir kullanıcı "
        "limitinde Türkçe/İngilizce anahtar kelime eşleştirmesi devreye girer. \"başarılı\", "
        "\"gürültücü\", \"DEHB\", \"gözlük\" gibi ifadeler otomatik etiketlenir.",
        "c) CSV içe aktarma (csv-parser.ts): Türkçe/İngilizce sütun başlıkları desteklenir.",
        "d) Sesli giriş (useVoiceInput.ts): MediaRecorder ile ses kaydı alınır; /api/transcribe "
        "üzerinden fal.ai Whisper modeli metne dönüştürür; ardından NLP modülüne aktarılır.",
    ]),
    ("3.5. Genetik Algoritma Motoru", [
        "GeneticSolver sınıfı (genetic-solver.ts) tarayıcıda çalışır. Parametreler: popülasyon 60, "
        "nesil 60 (UI animasyonu), mutasyon oranı %15, elitizm (en iyi 2 birey korunur), turnuva seçimi (k=3).",
        "Çaprazlama: Permütasyon tabanlı Order Crossover (OX) — ebeveyn1'den kesme noktasına kadar "
        "koruma, kalan öğrenciler ebeveyn2 sırasıyla doldurulur.",
        "Mutasyon: İki öğrencinin koltukları değiştirilir; ön sıra zorunluluğu olan öğrencilerin "
        "arka sıraya taşınması engellenir.",
        "Akıllı başlatma: Görme/işitme güçlüğü olanlar ve ön sıra gereksinimi olanlar öne; kısa boy "
        "öne, uzun boy arkaya; gruplar içi rastgele karıştırma.",
        "UI'da her nesil 100 ms arayla gösterilir; 60 nesil yaklaşık 6 saniyede tamamlanır. Nesil ilerledikçe "
        "genel uyum skoru canlı grafikte güncellenir.",
    ]),
    ("3.6. Puanlama Metrikleri", [
        "calculateMetrics (scoring-utils.ts) dört metrik hesaplar; tüm metrikler oturma düzenine "
        "(komşuluk ilişkileri) bağlıdır:",
        "Akademik denge: Komşu öğrenci çiftlerinde akademik düzey farkına göre puan (fark 1→100, fark 2→88).",
        "Sosyal uyum: Komşu çiftlerde uyumluluk ortalaması; kaçınma listesi ihlali −18 puan/çift; "
        "arkadaş komşuluğu bonusu.",
        "Davranış uyumu: Dikkat dağıtıcı–dikkat dağıtıcı komşuluk −28; lider ön sıra +8; "
        "dikkat dağıtıcı kümeleme cezası.",
        "Fiziksel erişilebilirlik: Görme/işitme ön sıra, kısa önde/uzun arkada zorunluluğu.",
        "Genel skor: Dört metriğin aritmetik ortalaması (0–100).",
    ]),
    ("3.7. Tamamlayıcı Modüller", [
        "SeatingGrid: Sürükle-bırak düzenleme, yoklama, mahremiyet modu, hover detay kartları.",
        "ExamMode (Kelebek): Çok sınıflı sınav salonu, A/B/C/D versiyon desenleri, çakışma önleme.",
        "TeamBuilder: Yılan dağılım algoritması ile dengeli takım oluşturma (2–10 takım).",
        "ScheduleView: Haftalık ders programı. MeetingManager: Veli görüşme takibi.",
        "ClassStats: Akademik ve davranış dağılım grafikleri.",
        "ai-explanation-service: Optimizasyon sonrası pedagojik gerekçeleri Türkçe şablon metinlerle açıklar.",
    ]),
    ("3.8. Proje İş-Zaman Çizelgesi", [
        "Tablo 2, 2025–2026 eğitim-öğretim yılı boyunca planlanan proje faaliyetlerini özetlemektedir. "
        "Kasım–Mart ayları literatür taraması, gereksinim analizi ve arayüz tasarımına ayrılmış; "
        "yoğun yazılım geliştirme Nisan–Mayıs 2026'da (sürüm kontrol kayıtları ile doğrulanmıştır) "
        "tamamlanmıştır. Haziran 2026'da benchmark doğrulaması, proje raporu yazımı ve sunum "
        "materyallerinin son hâle getirilmesi planlanmaktadır.",
    ]),
    ("3.9. Veri Toplama ve Ölçme Protokolü", [
        "Performans karşılaştırması scripts/run-benchmark.ts betiği ile tekrarlanabilir biçimde "
        "yürütülmüştür (çıktı: scripts/benchmark-results.json). Protokol: (1) Rastgele taban — her veri "
        "seti için 30 bağımsız uniform rastgele koltuk ataması; metriklerin aritmetik ortalaması alınır. "
        "(2) GA koşulu — popülasyon 60, 80 nesil, 10 bağımsız koşu; tohum (seed) tabanı 20260619 ile "
        "Math.random deterministik modda çalıştırılır. (3) NLP doğruluk — 10 kontrollü Türkçe cümlede "
        "11 öznitelik (akademik düzey, davranış, hareket, görme vb.) beklenen değerlerle karşılaştırılır.",
        "Bu protokol otomatik birim test niteliğindedir; gerçek öğretmen girişi veya saha gözlemi "
        "içermez. Gemini API performansı karmaşık cümlelerde nitel olarak değerlendirilmiştir.",
    ]),
    ("3.10. Tekrarlanabilir Benchmark Komutu", [
        "Tüm performans tabloları proje kök dizininden npm run benchmark komutu ile yeniden üretilebilir. "
        "Betik scripts/run-benchmark.ts dosyasını çalıştırır; sonuçlar scripts/benchmark-results.json "
        "dosyasına yazılır. Bu komut Node.js ve npm bağımlılıklarının kurulu olduğu ortamda tek satırda "
        "çalıştırılabilir; jüri veya danışman doğrulaması için standart protokol sağlar.",
    ]),
]

BOLUM4_BULGULAR = [
    ("4.1. Genetik Algoritma Performansı", [
        "Tablo 3, demo seti (15 öğrenci) üzerindeki tekrarlanabilir benchmark sonuçlarını özetlemektedir. "
        "Rastgele atama ortalaması genel uyum %49 iken, GA ortalaması %89'a çıkmıştır (en iyi koşu: %91). "
        "Sosyal uyum %11→%89, davranış uyumu %24→%97, fiziksel erişilebilirlik %86→%92 artış göstermiştir. "
        "Bu sonuçlar Ek-A ekran görüntüleri ile uyumludur.",
        "Tablo 4, test_students.csv (23 öğrenci) sonuçlarını göstermektedir. Bu sette arkadaş/kaçınma "
        "ilişkileri ve dört dikkat dağıtıcı öğrenci bulunmaktadır. Rastgele atama ortalaması genel uyum "
        "%63 iken GA ortalaması %92'ye yükselmiştir (en iyi koşu: %92). Sosyal uyum %30→%85, davranış "
        "uyumu %72→%100, fiziksel erişilebilirlik %74→%99 artış göstermiştir; metrik kalibrasyonu "
        "GA'nın anlamlı iyileşme sağladığını doğrulamaktadır.",
    ]),
    ("4.2. NLP Modülü", [
        "Kontrollü test setinde (10 Türkçe cümle, 11 öznitelik) yerel kural tabanlı parser %100 doğruluk "
        "sağlamıştır. Test cümleleri scripts/run-benchmark.ts içinde tanımlıdır.",
        "Gemini 1.5 Flash: arkadaş/kaçınma ilişkileri ve çoklu özellik içeren cümlelerde üstün performans "
        "(nitel değerlendirme). Sesli giriş: Whisper transkripsiyonu Türkçe sınıf tanımlamalarında başarılı "
        "(nitel değerlendirme).",
    ]),
    ("4.3. Performans ve Kullanılabilirlik", [
        "15–23 öğrencili 5×6 sınıf optimizasyonu tarayıcıda yaklaşık 5 saniyede tamamlanır. Canlı adres "
        "aklisira.com; III. Yapay Zeka ile Eğitim Zirvesi'nde öğretmenlerden olumlu geribildirim alınmıştır.",
    ]),
]

BOLUM5_SONUC = [
    ("5.1. Sonuç", [
        "AklıSıra, pedagojik literatürle uyumlu, çok metrikli genetik algoritma tabanlı bir oturma "
        "optimizasyon platformu olarak geliştirilmiştir. Tekrarlanabilir benchmark protokolü ile demo "
        "setinde genel uyum skoru %43'ten %91'e yükselmiştir. Hibrit NLP (Gemini + yerel), sesli giriş "
        "ve CSV desteği veri girişini kolaylaştırmıştır. Kritik optimizasyon tarayıcıda yerel "
        "çalışarak mahremiyeti desteklemiştir.",
    ]),
    ("5.2. Tartışma", [
        "Sonuçlar Weinstein (1992) ve Reinke ve Herman (2002) bulgularıyla tutarlıdır. GA'nın eğitim "
        "alanında oturma problemine uygulanması literatürde sınırlı kalmış olup bu proje uygulamalı "
        "bir örnek sunmaktadır.",
    ]),
    ("5.3. Öneriler", [
        "Nesil grafiği ve optimizasyon geçmişi: GA koşusunun her nesilindeki metrik eğilimlerini karşılaştırmalı "
        "gösteren gelişmiş grafik paneli; öğretmenlere algoritmanın iyileşme sürecini pedagojik olarak açıklama "
        "imkânı sunar.",
        "Gerçek öğretmenlerle saha testi: En az bir pilot sınıfta dönem boyunca oturma düzeni değişiminin "
        "davranış ve akademik göstergelere etkisinin gözlemlenmesi.",
        "e-Okul entegrasyonu: Öğrenci listelerinin MEB e-Okul sisteminden güvenli aktarımı ile manuel veri "
        "giriş yükünün azaltılması.",
        "Puanlama fonksiyonunun farklı sınıf profillerine göre otomatik kalibrasyonu. "
        "Takım modülünde GA kullanımı. Mobil uygulama. Tamamen offline Whisper alternatifi.",
    ]),
]

KAYNAKLAR = [
    "Kaveh, A. ve Shakouri Hassanabadi, H. (2009). A heuristic method for timetabling problem. International Journal of Computational Intelligence Research, 5(2), 135–162.",
    "Millî Eğitim Bakanlığı. (2020). BİLSEM proje yazım kılavuzu. Ankara: MEB Özel Eğitim ve Rehberlik Hizmetleri Genel Müdürlüğü.",
    "Reinke, W. M. ve Herman, K. C. (2002). Creating school environments that deter antisocial behaviors in youth. Psychology in the Schools, 39(5), 549–560.",
    "Richey, R. C. ve Klein, J. D. (2007). Design and development research: Methods, strategies, and issues. Mahwah, NJ: Lawrence Erlbaum Associates.",
    "Vygotsky, L. S. (1978). Mind in society: The development of higher psychological processes. Cambridge, MA: Harvard University Press.",
    "Wannarka, R. ve Ruhl, K. (2008). Seating arrangements that promote positive academic and behavioural outcomes. Support for Learning, 23(2), 89–93.",
    "Weinstein, C. S. (1992). Designing the instructional environment: Focus on seating. Proceedings of AECT Convention, 1–11.",
]

IS_ZAMAN_ROWS = [
    ["Literatür taraması", "X", "X", "X", "", "", "", "", ""],
    ["UI/UX tasarımı", "", "", "X", "X", "X", "", "", ""],
    ["Next.js çekirdek geliştirme", "", "", "", "", "X", "X", "X", ""],
    ["NLP ve GA modülleri", "", "", "", "", "", "X", "X", ""],
    ["Sınav/takım modülleri", "", "", "", "", "", "X", "X", ""],
    ["Test ve iyileştirme", "", "", "", "", "", "", "X", "X"],
    ["Zirve sunumu", "", "", "", "", "", "", "X", ""],
    ["Proje raporu", "", "", "", "", "", "", "", "X"],
]

BULGU_TABLE_DEMO = [
    ["Akademik denge", "76", "77", "+1"],
    ["Sosyal uyum", "9", "89", "+80"],
    ["Davranış uyumu", "24", "97", "+73"],
    ["Fiziksel erişilebilirlik", "86", "92", "+6"],
    ["Genel skor", "49", "89", "+40"],
]

BULGU_TABLE_CSV = [
    ["Akademik denge", "76", "81", "+5"],
    ["Sosyal uyum", "30", "85", "+55"],
    ["Davranış uyumu", "72", "100", "+28"],
    ["Fiziksel erişilebilirlik", "74", "99", "+25"],
    ["Genel skor", "63", "92", "+29"],
]

TEKNO_TABLE = [
    ["Frontend", "Next.js 16.1.6, React 19.2.3, TypeScript 5.9"],
    ["Stil", "Tailwind CSS 4, özel CSS tasarım sistemi"],
    ["Kimlik doğrulama", "Supabase Auth (OAuth, e-posta)"],
    ["Veritabanı", "Supabase (waitlist); localStorage (sınıf verisi)"],
    ["NLP (bulut)", "Google Gemini 1.5 Flash API"],
    ["NLP (yerel)", "Kural tabanlı Türkçe/İngilizce parser"],
    ["Ses tanıma", "fal.ai Whisper API + MediaRecorder"],
    ["Optimizasyon", "Genetik algoritma (tarayıcı, GeneticSolver)"],
    ["Dağıtım", "Vercel (aklisira.com)"],
    ["Geliştirme", "Visual Studio Code, Cursor, Git/GitHub"],
]
