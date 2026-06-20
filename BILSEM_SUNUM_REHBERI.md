# BİLSEM Sunum Rehberi — AklıSıra

## Hocanın özellikle istediği şeyler

1. **Canlı uygulama gösterimi** — demo önceden test edilmiş olmalı
2. **Kendi laptop'un** kullanılabilir; okulda **HDMI** var — adaptör/soket kontrol et
3. **2 nüsha rapor çıktısı** — sunuma gelirken yanında olmalı
4. **PDF rapor** — `Yusuf Kerim Kaymakci-AKLISIRA.pdf` (27 sayfa, Ek-A gömülü)

---

## Sunumda ne yapacaksın? (5–7 dk)

### 1. Giriş (45 sn)
- "Merhaba, ben Yusuf Kerim Kaymakcı."
- "Projem AklıSıra — öğretmenlerin sınıf oturma düzenini yapay zeka ile oluşturduğu bir web uygulaması."
- Problem: "Öğretmenler oturma düzenini sezgiyle yapıyor; akademik, sosyal ve davranış faktörlerini aynı anda dengelemek zor."

### 2. Çözüm (45 sn)
- NLP: Gemini + yerel Türkçe parser ("Ali gürültücü, Elif sessiz...")
- Genetik algoritma — popülasyon 60, 60 nesil, 4 metrik
- Optimizasyon tarayıcıda → KVKK uyumlu; nesil grafiği canlı izlenir

### 3. CANLI DEMO (2–3 dk) ← en önemli kısım
**aklisira.com** veya localhost — internet çalışsın.

| Adım | Ne yap | Ne söyle |
|------|--------|----------|
| 1 | Siteyi aç | "Uygulama aklisira.com adresinde" |
| 2 | **Demo Yükle** | "15 öğrencili hazır profil seti" |
| 3 | Sınıf & Düzen | "Düzen tipi ve sınıf boyutu seçiyoruz" |
| 4 | **Düzeni Optimize Et** | "60 nesil çalışıyor — skor grafiği canlı yükseliyor" |
| 5 | Sonucu göster | "Rastgele ~%49, algoritma ~%89 ortalama, canlı koşu ~%91" |
| 6 | AI raporu + kelebek modu | "Pedagojik gerekçe + sınav düzeni modülü" |

### 4. Bulgular (45 sn)
- Rapordaki **Tablo 3** (demo seti):
  - Genel skor: **%49 → %89** (en iyi koşu **%91**)
  - Sosyal uyum: **%6 → %100**
  - Davranış uyumu: **%6 → %85**
- Rapordaki **Tablo 4** (CSV seti):
  - Genel skor: **%63 → %92**
- Tekrarlanabilir ölçüm: `npm run benchmark`
- YTÜ AI Zirvesi geribildirimi (varsa)

### 5. Kapanış (30 sn)
- "Sonuç: AklıSıra öğretmenlere zaman kazandırıyor, pedagojik ilkeleri otomatik uyguluyor."
- "Gelecek: e-Okul, saha testi, metrik kalibrasyonu."
- "Sorularınız?"

---

## Sunumdan önce checklist

- [ ] Laptop şarj + adaptör
- [ ] HDMI test
- [ ] Demo 1 kez: Demo Yükle → Optimize → ~%91 gör
- [ ] Hotspot yedeği
- [ ] **2 çıktı** + imzalı etik/jüri sayfaları
- [ ] PDF hocaya: `Yusuf Kerim Kaymakci-AKLISIRA.pdf`
- [ ] Savunma tarihi raporda doldurulmuş mu?

---

## Jüri muhtemelen sorar

| Soru | Kısa cevap |
|------|------------|
| Genetik algoritma nedir? | Doğadan esinlenen optimizasyon; popülasyon 60, 60 nesil |
| Veriler nereye gidiyor? | Oturma optimizasyonu tarayıcıda lokal; NLP/ses isteğe bağlı bulut |
| Gerçek sınıfta test? | Simülasyon + tekrarlanabilir benchmark; saha çalışması gelecek iş |
| NLP nasıl? | Gemini 1.5 Flash + yerel kural tabanlı yedek |
| %91 ekranda, raporda %89? | Ekran tek koşu; tablo 10 koşu ortalaması — ikisi de doğru |
| AI raporu LLM mi? | Hayır — optimizasyon sonucuna göre şablon tabanlı Türkçe açıklama |

---

## Teknik yedek plan

Demo çökerse:
1. Rapordaki Ek-A ekran görüntülerini göster (6 şekil, nesil grafiği dahil)
2. Tablo 3'ü rapordan oku
3. Panik yok — "Canlı bağlantı sorunu, uygulama normalde çalışıyor"
