"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setWaitlistStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waitlistEmail, name: waitlistName }),
      });
      if (res.ok) {
        setWaitlistStatus('success');
        setWaitlistEmail('');
        setWaitlistName('');
      } else {
        setWaitlistStatus('error');
      }
    } catch {
      setWaitlistStatus('error');
    }
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "🎤",
      title: "Doğal Dil Girişi",
      desc: "\"Ali 90 puan, biraz gürültücü\" yazın ya da sesle anlatın. AI öğrenci profilini saniyeler içinde oluşturur.",
      color: "#14b8a6",
    },
    {
      icon: "🧬",
      title: "Genetik Optimizasyon",
      desc: "Akademik denge, davranış uyumu, fiziksel gereksinimler, öğrenme stilleri — hepsini aynı anda optimize eder.",
      color: "#8b5cf6",
    },
    {
      icon: "🦋",
      title: "Sınav Modu",
      desc: "Okul genelinde kopya önleme. Sınıfları karıştır, A/B/C/D versiyonları otomatik ata, salon listeleri hazır.",
      color: "#f97316",
    },
    {
      icon: "🎯",
      title: "Takım & Proje Seçimi",
      desc: "Sosyal sorumluluk projesi mi? Birkaç tıkla dengeli takımlar kur ya da en uygun öğrencileri seç.",
      color: "#ec4899",
    },
  ];

  const stats = [
    { value: "6+", label: "Farklı Düzen\nŞablonu" },
    { value: "30sn", label: "Ortalama Optimizasyon\nSüresi" },
    { value: "∞", label: "Öğrenci\nProfili" },
    { value: "100%", label: "Ücretsiz\nBaşlangıç" },
  ];

  const testimonials = [
    {
      name: "Matematik Öğretmeni",
      school: "İstanbul, Devlet Okulu",
      text: "Eskiden Excel'de 1 saat uğraşırdım. Şimdi 2 dakikada oturma düzenim hazır, üstelik AI neden böyle yerleştirdiğini açıklıyor.",
      avatar: "👩‍🏫",
    },
    {
      name: "Sınıf Öğretmeni",
      school: "Ankara, Özel Okul",
      text: "Kelebek sistemini elle yapmak kabustu. Şimdi okul idaresiyle tek tıkla paylaşıyorum. Mükemmel 🙏",
      avatar: "👨‍🏫",
    },
    {
      name: "Fen Bilimleri Öğretmeni",
      school: "İzmir, Devlet Okulu",
      text: "Öğrencilerimin öğrenme stillerini girince algoritmanın ne kadar akıllıca yerleştirdiğini görünce şaşırdım.",
      avatar: "👩‍🔬",
    },
  ];

  return (
    <div style={{ fontFamily: "'Nunito', -apple-system, sans-serif", background: "#f7f5f2", minHeight: "100vh", color: "#1a1715" }}>

      {/* ─── Sticky Nav ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "12px 32px",
        background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
        transition: "all 0.3s ease",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo.png" alt="AklıSıra" style={{ height: "36px", width: "36px", objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span style={{ fontSize: "1.4rem", fontWeight: 900, background: "linear-gradient(135deg, #0d6e64, #14b8a6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AklıSıra
          </span>
          <span style={{ fontSize: "0.65rem", background: "#14b8a6", color: "white", padding: "2px 8px", borderRadius: "20px", fontWeight: 700 }}>BETA</span>
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <a href="#features" style={{ textDecoration: "none", color: "#57534e", fontWeight: 600, fontSize: "0.85rem" }}>Özellikler</a>
          <a href="#pricing" style={{ textDecoration: "none", color: "#57534e", fontWeight: 600, fontSize: "0.85rem" }}>Fiyat</a>
          <a href="#contact" style={{ textDecoration: "none", color: "#57534e", fontWeight: 600, fontSize: "0.85rem" }}>İletişim</a>
          <Link href="/app" style={{
            textDecoration: "none",
            background: "linear-gradient(135deg, #0d6e64, #14b8a6)",
            color: "white", padding: "8px 20px", borderRadius: "50px",
            fontWeight: 800, fontSize: "0.85rem",
          }}>
            Hemen Dene →
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center", textAlign: "center",
        padding: "120px 24px 80px",
        background: "linear-gradient(160deg, #0d6e64 0%, #094f47 35%, #1a1715 100%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background orbs */}
        <div style={{ position: "absolute", top: "10%", left: "5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "5%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(217,119,6,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.3)",
            padding: "6px 16px", borderRadius: "50px", marginBottom: "32px",
            color: "#5eead4", fontSize: "0.8rem", fontWeight: 700,
          }}>
            🏆 III. Eğitimde Yapay Zekâ Zirvesi — En İyi Demo
          </div>

          <h1 style={{
            fontSize: "clamp(2.4rem, 6vw, 4rem)", fontWeight: 900,
            color: "white", lineHeight: 1.15, marginBottom: "24px",
            letterSpacing: "-0.02em",
          }}>
            Öğretmenin <span style={{ background: "linear-gradient(90deg, #14b8a6, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>asistanı.</span>
            <br />
            Sınıfın <span style={{ background: "linear-gradient(90deg, #f97316, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>beyni.</span>
          </h1>

          <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.7, marginBottom: "48px", maxWidth: "620px", margin: "0 auto 48px" }}>
            Kağıt, Excel ve hafıza ile yönetilen <strong style={{ color: "white" }}>30 öğrencinin kaosunu</strong> doğal dil + yapay zeka ile saniyeler içinde çözen platform. Oturma düzeni, sınav modu, takım oluşturma — hepsi tek yerde.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/app" style={{
              textDecoration: "none",
              background: "linear-gradient(135deg, #14b8a6, #0d6e64)",
              color: "white", padding: "16px 36px", borderRadius: "50px",
              fontWeight: 900, fontSize: "1rem",
              boxShadow: "0 8px 32px rgba(20,184,166,0.35)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}>
              ✨ Ücretsiz Dene
            </Link>
            <a href="#features" style={{
              textDecoration: "none",
              background: "rgba(255,255,255,0.08)",
              border: "1.5px solid rgba(255,255,255,0.2)",
              color: "white", padding: "16px 36px", borderRadius: "50px",
              fontWeight: 700, fontSize: "1rem",
            }}>
              Nasıl Çalışır? ↓
            </a>
          </div>

          {/* Social proof mini */}
          <div style={{ marginTop: "48px", display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#5eead4" }}>{s.value}</div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", whiteSpace: "pre-line", lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WAITLIST ─── */}
      <section id="waitlist" style={{
        padding: "72px 24px",
        background: "linear-gradient(135deg, #fef3c7 0%, #fff 60%)",
        borderTop: "1.5px solid #e0d8d0",
        borderBottom: "1.5px solid #e0d8d0",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#fef3c7", border: "1px solid #fbbf24",
            padding: "5px 14px", borderRadius: "50px", marginBottom: "20px",
            color: "#92400e", fontSize: "0.78rem", fontWeight: 700,
          }}>
            ⏳ Erken Erişim Listesi — Sınırlı Beta Konuşma
          </div>

          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: "12px", letterSpacing: "-0.02em" }}>
            Pro özellikleri ilk deneyin
          </h2>
          <p style={{ color: "#57534e", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "32px", maxWidth: "460px", margin: "0 auto 32px" }}>
            Auth sistemi, öğrenci profil kayıtı, dönem takibi ve AI analiz raporu özellikleri hazır olunca sizi ilk haberdar edeceğiz.
            <strong style={{ color: "#0d6e64" }}> İlk 50. kullanıcıya %50 indirim.</strong>
          </p>

          {waitlistStatus === 'success' ? (
            <div style={{
              padding: "24px", background: "#dcfce7", borderRadius: "16px",
              border: "1.5px solid #86efac", color: "#15803d",
              fontWeight: 800, fontSize: "1rem",
            }}>
              ✅ Listeye eklendiniz! Haberdar edeceğiz.
            </div>
          ) : (
            <form onSubmit={handleWaitlist} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "440px", margin: "0 auto" }}>
              <input
                type="text"
                placeholder="Adınız (isteğe bağlı)"
                value={waitlistName}
                onChange={e => setWaitlistName(e.target.value)}
                style={{
                  padding: "14px 18px", borderRadius: "12px", border: "1.5px solid #e0d8d0",
                  fontSize: "0.95rem", fontFamily: "inherit", outline: "none",
                  background: "white",
                }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={waitlistEmail}
                  onChange={e => setWaitlistEmail(e.target.value)}
                  required
                  style={{
                    flex: 1, padding: "14px 18px", borderRadius: "12px",
                    border: "1.5px solid #e0d8d0", fontSize: "0.95rem",
                    fontFamily: "inherit", outline: "none", background: "white",
                  }}
                />
                <button
                  type="submit"
                  disabled={waitlistStatus === 'loading'}
                  style={{
                    padding: "14px 22px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #0d6e64, #14b8a6)",
                    color: "white", border: "none", fontWeight: 800,
                    fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit",
                    whiteSpace: "nowrap", minWidth: "120px",
                  }}
                >
                  {waitlistStatus === 'loading' ? '⏳...' : 'Listeye Katıl →'}
                </button>
              </div>
              {waitlistStatus === 'error' && (
                <p style={{ color: "#dc2626", fontSize: "0.82rem", margin: 0 }}>
                  Bir hata oluştu. Lütfen tekrar deneyin.
                </p>
              )}
              <p style={{ color: "#a8a29e", fontSize: "0.75rem", margin: 0 }}>
                Spam yok. İstediğiniz zaman çıkabilirsiniz.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ─── PROBLEM → SOLUTION ─── */}
      <section style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "16px" }}>
            Öğretmenler bugün ne yapıyor?
          </h2>
          <p style={{ color: "#57534e", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto" }}>Türkiye'deki 1.2 milyon öğretmen hâlâ kağıt ve Excel'e mahkum.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {[
            { icon: "😩", title: "Oturma düzeni = kağıt üzerinde silgi izi", desc: "Her dönem sıfırdan çiz, her şikayet sonrası yeniden düzenle." },
            { icon: "📋", title: "30 öğrenci × Excel = veri kabusu", desc: "Notlar, davranışlar, ailelerle notlar — hepsi farklı yerlerde." },
            { icon: "🔀", title: "Sınav karıştırma = idarenin eziyeti", desc: "Her sınav döneminde el ile karıştırma, liste hazırlama, baskı." },
            { icon: "🗂️", title: "Proje grubu seçimi = 'en iyiler'", desc: "Kim kimle uyumlu? Kim bu projeye en uygun? Tahmin et." },
          ].map((p, i) => (
            <div key={i} style={{
              background: "white", padding: "28px", borderRadius: "16px",
              border: "1.5px solid #e0d8d0", display: "flex", gap: "16px",
            }}>
              <span style={{ fontSize: "2rem", flexShrink: 0 }}>{p.icon}</span>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: "0.95rem", marginBottom: "8px" }}>{p.title}</h3>
                <p style={{ color: "#57534e", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" style={{ padding: "80px 24px", background: "#0d6e64" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "white", letterSpacing: "-0.02em", marginBottom: "16px" }}>
              AklıSıra ne yapar?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.05rem", maxWidth: "500px", margin: "0 auto" }}>
              Öğretmenin kağıtla yaptığı her şeyi, yapay zeka ile dakikalar içinde.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            {features.map((f, i) => (
              <div
                key={i}
                onClick={() => setActiveFeature(i)}
                style={{
                  padding: "28px", borderRadius: "16px", cursor: "pointer",
                  background: activeFeature === i ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
                  border: `1.5px solid ${activeFeature === i ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}`,
                  transition: "all 0.3s ease",
                  transform: activeFeature === i ? "scale(1.03)" : "scale(1)",
                }}
              >
                <div style={{ fontSize: "2.2rem", marginBottom: "14px" }}>{f.icon}</div>
                <h3 style={{ color: "white", fontWeight: 800, fontSize: "1rem", marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: "80px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "16px" }}>
            3 adımda çalışır
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {[
            {
              step: "01", icon: "✍️", title: "Öğrencileri Tanıt",
              desc: "\"Ali 90 puan, biraz haylaz. Elif sessiz, kısa boylu, gözlük kullanıyor\" — yaz ya da sesle anlat. AI geri kalanını yapar.",
              color: "#14b8a6",
            },
            {
              step: "02", icon: "🧬", title: "Optimizasyonu Başlat",
              desc: "Genetik algoritma 50 nesil boyunca çalışır. Akademik denge, davranış uyumu, fiziksel gereksinimler — saniyeler içinde.",
              color: "#8b5cf6",
            },
            {
              step: "03", icon: "📋", title: "Kullan, Paylaş, Tekrarla",
              desc: "Oturma planını yazdır veya paylaş. Sınav moduna geç, takım oluştur. Dönem içinde istediğin zaman güncelle.",
              color: "#f97316",
            },
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "24px", padding: "32px 0", borderBottom: i < 2 ? "1px solid #e0d8d0" : "none" }}>
              <div style={{ flexShrink: 0, width: "56px", height: "56px", borderRadius: "14px", background: step.color + "15", border: `2px solid ${step.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                {step.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 900, color: step.color, marginBottom: "6px", letterSpacing: "0.1em" }}>ADIM {step.step}</div>
                <h3 style={{ fontWeight: 900, fontSize: "1.1rem", marginBottom: "8px" }}>{step.title}</h3>
                <p style={{ color: "#57534e", lineHeight: 1.6, margin: 0, fontSize: "0.9rem" }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding: "80px 24px", background: "#f0ece7" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 900, marginBottom: "48px", letterSpacing: "-0.02em" }}>
            Öğretmenler ne diyor?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: "white", padding: "28px", borderRadius: "16px", border: "1.5px solid #e0d8d0" }}>
                <p style={{ color: "#1a1715", lineHeight: 1.7, marginBottom: "20px", fontStyle: "italic", fontSize: "0.9rem" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "2rem" }}>{t.avatar}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>{t.name}</div>
                    <div style={{ color: "#a8a29e", fontSize: "0.75rem" }}>{t.school}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" style={{ padding: "80px 24px", maxWidth: "820px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 900, marginBottom: "16px", letterSpacing: "-0.02em" }}>Sade ve şeffaf fiyatlandırma</h2>
          <p style={{ color: "#57534e", fontSize: "1rem" }}>Başvuru kartı yok. Kredi kartı yok. Sadece ihtiyacın kadar.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {/* Free */}
          <div style={{ background: "white", padding: "36px 28px", borderRadius: "20px", border: "1.5px solid #e0d8d0" }}>
            <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#57534e", marginBottom: "8px" }}>ÜCRETSIZ</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "4px" }}>₺0</div>
            <div style={{ color: "#a8a29e", fontSize: "0.8rem", marginBottom: "24px" }}>Sonsuza kadar</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {["5 öğrenciye kadar", "Tüm düzen tipleri", "Kelebek sınav modu", "Takım oluşturma"].map(f => (
                <li key={f} style={{ display: "flex", gap: "8px", fontSize: "0.85rem" }}><span style={{ color: "#14b8a6" }}>✓</span>{f}</li>
              ))}
            </ul>
            <Link href="/app" style={{
              display: "block", textAlign: "center", textDecoration: "none",
              border: "2px solid #0d6e64", color: "#0d6e64",
              padding: "12px", borderRadius: "12px", fontWeight: 800, fontSize: "0.9rem",
            }}>Ücretsiz Başla</Link>
          </div>

          {/* Pro */}
          <div style={{
            background: "linear-gradient(135deg, #0d6e64, #094f47)", padding: "36px 28px",
            borderRadius: "20px", border: "none", position: "relative", overflow: "hidden",
            boxShadow: "0 16px 48px rgba(13,110,100,0.3)",
          }}>
            <div style={{ position: "absolute", top: "16px", right: "16px", background: "#fbbf24", color: "#1a1715", fontSize: "0.65rem", fontWeight: 900, padding: "4px 10px", borderRadius: "50px" }}>BETA İNDİRİMİ</div>
            <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "8px" }}>PRO</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "white", marginBottom: "4px" }}>₺150</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginBottom: "24px" }}>/ ay — yakında ₺200</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {["Sınırsız öğrenci", "Tüm ücretsiz özellikler +", "Öğrenci not defteri", "Dönem geçmişi", "AI sınıf analizi", "Öncelikli destek"].map(f => (
                <li key={f} style={{ display: "flex", gap: "8px", fontSize: "0.85rem", color: "white" }}><span style={{ color: "#5eead4" }}>✓</span>{f}</li>
              ))}
            </ul>
            <Link href="/app" style={{
              display: "block", textAlign: "center", textDecoration: "none",
              background: "white", color: "#0d6e64",
              padding: "14px", borderRadius: "12px", fontWeight: 900, fontSize: "0.9rem",
            }}>Pro'yu Dene →</Link>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" style={{ padding: "80px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 900, marginBottom: "16px", letterSpacing: "-0.02em" }}>
            İletişime geç
          </h2>
          <p style={{ color: "#57534e", fontSize: "1rem", maxWidth: "500px", margin: "0 auto" }}>
            Okul veya kurum olarak pilot kullanım, iş birliği ya da demo talebi için ulaşın.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
          {[
            {
              icon: "✉️",
              title: "E-posta",
              value: "info@aklisira.com",
              href: "mailto:info@aklisira.com",
              desc: "Sorular, demo talepleri ve iş birlikleri için"
            },
            {
              icon: "🌐",
              title: "Web",
              value: "aklisira.com",
              href: "https://aklisira.com",
              desc: "Uygulamayı hemen ücretsiz deneyin"
            },
            {
              icon: "🏫",
              title: "Kurum",
              value: "Baykar Fen Lisesi",
              href: "#",
              desc: "İstanbul — Eğitimde Yapay Zekâ Zirvesi mezunu"
            },
          ].map((c, i) => (
            <a key={i} href={c.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "white", padding: "28px", borderRadius: "16px",
                border: "1.5px solid #e0d8d0", transition: "all 0.2s ease",
                cursor: "pointer",
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "14px" }}>{c.icon}</div>
                <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#14b8a6", marginBottom: "6px", letterSpacing: "0.08em" }}>{c.title}</div>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0d6e64", marginBottom: "8px" }}>{c.value}</div>
                <div style={{ color: "#57534e", fontSize: "0.8rem", lineHeight: 1.5 }}>{c.desc}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Simple email CTA */}
        <div style={{
          marginTop: "32px", padding: "28px 32px",
          background: "linear-gradient(135deg, #f0ece7, #fff)",
          borderRadius: "16px", border: "1.5px solid #e0d8d0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "16px",
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "4px" }}>Okulunuz için pilot kurmak ister misiniz?</div>
            <div style={{ color: "#57534e", fontSize: "0.85rem" }}>Okul yönetimleri ve zümre başkanları için özel demo randevusu.</div>
          </div>
          <a href="mailto:info@aklisira.com?subject=Pilot%20Demo%20Talebi" style={{
            textDecoration: "none",
            background: "linear-gradient(135deg, #0d6e64, #14b8a6)",
            color: "white", padding: "12px 28px", borderRadius: "50px",
            fontWeight: 800, fontSize: "0.9rem", whiteSpace: "nowrap",
          }}>
            📩 Demo Talep Et
          </a>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section style={{
        padding: "80px 24px", textAlign: "center",
        background: "linear-gradient(135deg, #0d6e64, #094f47)",
      }}>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "white", marginBottom: "16px", letterSpacing: "-0.02em" }}>
          Sınıfınızı tanımaya hazır mısınız?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.05rem", maxWidth: "500px", margin: "0 auto 40px" }}>
          Kredi kartı gerekmez. 2 dakikada kurulum. Türkiye'deki öğretmenler için.
        </p>
        <Link href="/app" style={{
          textDecoration: "none", display: "inline-block",
          background: "white", color: "#0d6e64",
          padding: "18px 48px", borderRadius: "50px",
          fontWeight: 900, fontSize: "1.1rem",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        }}>
          ✨ AklıSıra'yı Dene — Ücretsiz
        </Link>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ padding: "40px 24px", textAlign: "center", background: "#1a1715", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
          <img src="/logo.png" alt="AklıSıra" style={{ height: "28px", width: "28px", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.7 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span style={{ fontWeight: 900, color: "rgba(255,255,255,0.8)", fontSize: "1rem" }}>AklıSıra</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "12px" }}>
          <a href="#features" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Özellikler</a>
          <span>·</span>
          <a href="#pricing" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Fiyat</a>
          <span>·</span>
          <a href="#contact" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>İletişim</a>
          <span>·</span>
          <a href="/app" style={{ color: "#5eead4", textDecoration: "none" }}>Uygulamayı Aç</a>
          <span>·</span>
          <a href="mailto:info@aklisira.com" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>info@aklisira.com</a>
        </div>
        <div>Baykar Fen Lisesi · III. Eğitimde Yapay Zekâ Zirvesi 2026 · © 2026</div>
      </footer>
    </div>
  );
}
