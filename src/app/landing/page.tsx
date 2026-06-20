"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// ── Intersection Observer hook for reveal animations ──
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── Animated counter ──
function useCounter(target: number, active: boolean, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(t); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [active, target, duration]);
  return value;
}

// ── Reveal wrapper ──
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveFeature((p) => (p + 1) % 4), 3200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsActive(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setWaitlistStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: waitlistEmail, name: waitlistName }),
      });
      setWaitlistStatus(res.ok ? "success" : "error");
      if (res.ok) { setWaitlistEmail(""); setWaitlistName(""); }
    } catch {
      setWaitlistStatus("error");
    }
  };

  const features = [
    { icon: "🎤", title: "Doğal Dil Girişi", desc: "\"Ali 90 puan, biraz gürültücü\" yazın ya da sesle anlatın. AI öğrenci profilini saniyeler içinde oluşturur.", color: "#14b8a6" },
    { icon: "🧬", title: "Genetik Optimizasyon", desc: "Akademik denge, davranış uyumu, fiziksel gereksinimler, öğrenme stilleri — hepsini aynı anda optimize eder.", color: "#8b5cf6" },
    { icon: "🦋", title: "Sınav Modu (Kelebek)", desc: "Okul genelinde kopya önleme. Sınıfları karıştır, A/B/C/D versiyonları otomatik ata, salon listeleri hazır.", color: "#f97316" },
    { icon: "🎯", title: "Takım & Proje Seçimi", desc: "Sosyal sorumluluk projesi mi? Birkaç tıkla dengeli takımlar kur ya da en uygun öğrencileri seç.", color: "#ec4899" },
  ];

  const testimonials = [
    { name: "Matematik Öğretmeni", school: "İstanbul, Devlet Okulu", text: "Eskiden Excel'de 1 saat uğraşırdım. Şimdi 2 dakikada oturma düzenim hazır, üstelik AI neden böyle yerleştirdiğini açıklıyor.", avatar: "👩‍🏫" },
    { name: "Sınıf Öğretmeni", school: "Ankara, Özel Okul", text: "Kelebek sistemini elle yapmak kabustu. Şimdi okul idaresiyle tek tıkla paylaşıyorum. Mükemmel 🙏", avatar: "👨‍🏫" },
    { name: "Fen Bilimleri Öğretmeni", school: "İzmir, Devlet Okulu", text: "Öğrencilerimin öğrenme stillerini girince algoritmanın ne kadar akıllıca yerleştirdiğini görünce şaşırdım.", avatar: "👩‍🔬" },
  ];

  // Animated stat values
  const c1 = useCounter(6, statsActive);
  const c3 = useCounter(30, statsActive);

  return (
    <div style={{ fontFamily: "'Nunito', -apple-system, sans-serif", background: "#f7f5f2", minHeight: "100vh", color: "#1a1715", overflowX: "hidden" }}>

      {/* Global animation keyframes */}
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.6);opacity:0} }
        @keyframes gradient-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes fadeInDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .hero-btn:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 16px 48px rgba(20,184,166,0.45) !important; }
        .hero-btn { transition: transform 0.2s, box-shadow 0.2s; }
        .ghost-btn:hover { background: rgba(255,255,255,0.15) !important; }
        .ghost-btn { transition: background 0.2s; }
        .feature-card:hover { transform: translateY(-4px) scale(1.02); }
        .feature-card { transition: transform 0.25s, background 0.25s, border-color 0.25s; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.10); }
        .card-hover { transition: transform 0.22s, box-shadow 0.22s; }
        .nav-link:hover { color: #0d6e64 !important; }
        .nav-link { transition: color 0.15s; }
        .orb1 { animation: float 7s ease-in-out infinite; }
        .orb2 { animation: float 9s ease-in-out infinite 1s; }
        .orb3 { animation: float 11s ease-in-out infinite 2s; }
        .badge-anim { animation: fadeInDown 0.7s ease both; }
        .glass-panel { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; box-shadow: 0 30px 60px rgba(0,0,0,0.4); }
        .shimmer-text {
          background: linear-gradient(90deg, #14b8a6 0%, #fbbf24 30%, #f97316 60%, #14b8a6 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3.5s linear infinite;
        }
      `}</style>

      {/* ─── Sticky Nav ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "12px 32px",
        background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
        transition: "all 0.35s ease",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo.png" alt="AklıSıra" style={{ height: "34px", width: "34px", objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span style={{ fontSize: "1.4rem", fontWeight: 900, background: "linear-gradient(135deg, #0d6e64, #14b8a6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AklıSıra
          </span>
          <span style={{ fontSize: "0.62rem", background: "#14b8a6", color: "white", padding: "2px 8px", borderRadius: "20px", fontWeight: 700 }}>BETA</span>
        </div>
        <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          {["Özellikler#features", "Fiyat#pricing", "İletişim#contact"].map((item) => {
            const [label, href] = item.split("#");
            return (
              <a key={href} href={`#${href}`} className="nav-link" style={{ textDecoration: "none", color: scrolled ? "#57534e" : "rgba(255,255,255,0.75)", fontWeight: 600, fontSize: "0.85rem" }}>
                {label}
              </a>
            );
          })}
          <Link href="/app" className="nav-link" style={{ textDecoration: "none", color: scrolled ? "#57534e" : "rgba(255,255,255,0.75)", fontWeight: 700, fontSize: "0.85rem" }}>
            Demo
          </Link>
          <Link href="/login" style={{
            textDecoration: "none",
            background: "linear-gradient(135deg, #0d6e64, #14b8a6)",
            color: "white", padding: "8px 20px", borderRadius: "50px",
            fontWeight: 800, fontSize: "0.85rem",
            boxShadow: "0 4px 16px rgba(13,110,100,0.25)",
            transition: "all 0.2s"
          }}>
            Giriş Yap →
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center", textAlign: "center",
        padding: "160px 24px 100px",
        background: "linear-gradient(160deg, #0d6e64 0%, #094f47 35%, #1a1715 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div className="orb1" style={{ position: "absolute", top: "10%", left: "5%", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,0.25) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(40px)" }} />
        <div className="orb2" style={{ position: "absolute", bottom: "5%", right: "5%", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(217,119,6,0.2) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(40px)" }} />
        <div className="orb3" style={{ position: "absolute", top: "40%", right: "20%", width: "250px", height: "250px", borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(40px)" }} />

        {/* Floating Glass Panels */}
        <div className="orb1 glass-panel" style={{ position: "absolute", top: "15%", right: "10%", width: "180px", height: "220px", transform: "rotate(12deg)", zIndex: 0 }}>
          <div style={{ padding: "20px" }}>
            <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.2)", borderRadius: "4px", marginBottom: "12px" }}></div>
            <div style={{ width: "80%", height: "8px", background: "rgba(255,255,255,0.2)", borderRadius: "4px", marginBottom: "24px" }}></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[1,2,3,4,5,6].map(i => <div key={i} style={{ width: "100%", height: "24px", background: "rgba(255,255,255,0.1)", borderRadius: "6px" }}></div>)}
            </div>
          </div>
        </div>
        <div className="orb2 glass-panel" style={{ position: "absolute", bottom: "25%", left: "8%", width: "200px", height: "140px", transform: "rotate(-8deg)", zIndex: 0 }}>
          <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.15)" }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.3)", borderRadius: "4px", marginBottom: "8px" }}></div>
              <div style={{ width: "60%", height: "6px", background: "rgba(255,255,255,0.15)", borderRadius: "4px" }}></div>
            </div>
          </div>
          <div style={{ margin: "0 20px", height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ width: "40%", height: "12px", background: "#5eead4", borderRadius: "4px", marginBottom: "6px" }}></div>
            <div style={{ width: "70%", height: "6px", background: "rgba(255,255,255,0.2)", borderRadius: "4px" }}></div>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "820px" }}>
          <div className="badge-anim" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.3)",
            padding: "6px 18px", borderRadius: "50px", marginBottom: "36px",
            color: "#5eead4", fontSize: "0.8rem", fontWeight: 700,
          }}>
            🏆 III. Eğitimde Yapay Zekâ Zirvesi — En İyi Demo
          </div>

          <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", fontWeight: 900, color: "white", lineHeight: 1.12, marginBottom: "28px", letterSpacing: "-0.02em" }}>
            Öğretmenin{" "}
            <span className="shimmer-text">asistanı.</span>
            <br />
            Sınıfın{" "}
            <span style={{ background: "linear-gradient(90deg, #f97316, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>beyni.</span>
          </h1>

          <p style={{ fontSize: "1.12rem", color: "rgba(255,255,255,0.70)", lineHeight: 1.75, marginBottom: "52px", maxWidth: "640px", margin: "0 auto 52px" }}>
            Kağıt, Excel ve hafıza ile yönetilen <strong style={{ color: "white" }}>30 öğrencinin kaosunu</strong> doğal dil + yapay zeka ile saniyeler içinde çözen platform. Oturma düzeni, sınav modu, takım oluşturma — hepsi tek yerde.
          </p>

          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "64px" }}>
            <Link href="/login" className="hero-btn" style={{
              textDecoration: "none",
              background: "linear-gradient(135deg, #14b8a6, #0d6e64)",
              color: "white", padding: "17px 40px", borderRadius: "50px",
              fontWeight: 900, fontSize: "1.05rem",
              boxShadow: "0 8px 32px rgba(20,184,166,0.35)",
            }}>
              ✨ Ücretsiz Başla
            </Link>
            <Link href="/app" className="ghost-btn" style={{
              textDecoration: "none",
              background: "rgba(255,255,255,0.08)",
              border: "1.5px solid rgba(255,255,255,0.2)",
              color: "white", padding: "17px 40px", borderRadius: "50px",
              fontWeight: 700, fontSize: "1.05rem",
            }}>
              Kayıtsız Dene →
            </Link>
          </div>

          {/* Stats */}
          <div ref={statsRef} style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
            {[
              { val: `${c1}+`, label: "Düzen\nŞablonu" },
              { val: `${c3}sn`, label: "Optimizasyon\nSüresi" },
              { val: "∞", label: "Öğrenci\nProfili" },
              { val: "%100", label: "Ücretsiz\nBaşlangıç" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.9rem", fontWeight: 900, color: "#5eead4" }}>{s.val}</div>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.48)", whiteSpace: "pre-line", lineHeight: 1.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WAITLIST ─── */}
      <section id="waitlist" style={{ padding: "72px 24px", background: "linear-gradient(135deg, #fef3c7 0%, #fffbf0 100%)", borderTop: "1.5px solid #f0d98a", borderBottom: "1.5px solid #f0d98a" }}>
        <Reveal>
          <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#fef3c7", border: "1px solid #fbbf24", padding: "5px 15px", borderRadius: "50px", marginBottom: "20px", color: "#92400e", fontSize: "0.78rem", fontWeight: 700 }}>
              ⏳ Erken Erişim — İlk 50 kullanıcıya %50 indirim
            </div>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: "12px", letterSpacing: "-0.02em" }}>
              Pro özellikleri ilk deneyin
            </h2>
            <p style={{ color: "#57534e", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: "460px", margin: "0 auto 32px" }}>
              Auth sistemi, kalıcı öğrenci profilleri, dönem takibi ve AI analiz raporu hazır olunca sizi ilk haberdar edeceğiz.
            </p>
            {waitlistStatus === "success" ? (
              <div style={{ padding: "24px", background: "#dcfce7", borderRadius: "16px", border: "1.5px solid #86efac", color: "#15803d", fontWeight: 800, fontSize: "1rem" }}>
                ✅ Listeye eklendiniz! Haberdar edeceğiz.
              </div>
            ) : (
              <form onSubmit={handleWaitlist} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "440px", margin: "0 auto" }}>
                <input type="text" placeholder="Adınız (isteğe bağlı)" value={waitlistName} onChange={e => setWaitlistName(e.target.value)} style={{ padding: "14px 18px", borderRadius: "12px", border: "1.5px solid #e0d8d0", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", background: "white" }} />
                <div style={{ display: "flex", gap: "10px" }}>
                  <input type="email" placeholder="E-posta adresiniz" value={waitlistEmail} onChange={e => setWaitlistEmail(e.target.value)} required style={{ flex: 1, padding: "14px 18px", borderRadius: "12px", border: "1.5px solid #e0d8d0", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", background: "white" }} />
                  <button type="submit" disabled={waitlistStatus === "loading"} style={{ padding: "14px 22px", borderRadius: "12px", background: "linear-gradient(135deg, #0d6e64, #14b8a6)", color: "white", border: "none", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", minWidth: "130px" }}>
                    {waitlistStatus === "loading" ? "⏳..." : "Listeye Katıl →"}
                  </button>
                </div>
                {waitlistStatus === "error" && <p style={{ color: "#dc2626", fontSize: "0.82rem", margin: 0 }}>Bir hata oluştu. Lütfen tekrar deneyin.</p>}
                <p style={{ color: "#a8a29e", fontSize: "0.75rem", margin: 0 }}>Spam yok. İstediğiniz zaman çıkabilirsiniz.</p>
              </form>
            )}
          </div>
        </Reveal>
      </section>

      {/* ─── PROBLEM ─── */}
      <section style={{ padding: "88px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "16px" }}>Öğretmenler bugün ne yapıyor?</h2>
            <p style={{ color: "#57534e", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto" }}>Türkiye'deki 1.2 milyon öğretmen hâlâ kağıt ve Excel'e mahkum.</p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
          {[
            { icon: "😩", title: "Oturma düzeni = silgi izi", desc: "Her dönem sıfırdan çiz, her şikayet sonrası yeniden düzenle." },
            { icon: "📋", title: "30 öğrenci × Excel = kaos", desc: "Notlar, davranışlar, aile notları — hepsi farklı yerlerde." },
            { icon: "🔀", title: "Sınav karıştırma = eziyet", desc: "Her sınav döneminde el ile karıştırma, liste hazırlama." },
            { icon: "🗂️", title: "Proje grubu = 'en iyiler'", desc: "Kim kimle uyumlu? Kim bu projeye uygun? Tahmin et." },
          ].map((p, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="card-hover" style={{ background: "white", padding: "28px", borderRadius: "16px", border: "1.5px solid #e0d8d0", display: "flex", gap: "16px", height: "100%" }}>
                <span style={{ fontSize: "2rem", flexShrink: 0 }}>{p.icon}</span>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: "0.95rem", marginBottom: "8px" }}>{p.title}</h3>
                  <p style={{ color: "#57534e", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" style={{ padding: "88px 24px", background: "#0d6e64" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "white", letterSpacing: "-0.02em", marginBottom: "16px" }}>AklıSıra ne yapar?</h2>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.05rem", maxWidth: "500px", margin: "0 auto" }}>Öğretmenin kağıtla yaptığı her şeyi, yapay zeka ile dakikalar içinde.</p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 80}>
                <div
                  className="feature-card"
                  onClick={() => setActiveFeature(i)}
                  style={{
                    padding: "28px", borderRadius: "16px", cursor: "pointer", height: "100%",
                    background: activeFeature === i ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.05)",
                    border: `1.5px solid ${activeFeature === i ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.1)"}`,
                    boxShadow: activeFeature === i ? "0 8px 32px rgba(0,0,0,0.18)" : "none",
                  }}
                >
                  <div style={{ fontSize: "2.2rem", marginBottom: "14px" }}>{f.icon}</div>
                  <h3 style={{ color: "white", fontWeight: 800, fontSize: "1rem", marginBottom: "10px" }}>{f.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: "88px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <Reveal>
          <h2 style={{ textAlign: "center", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "56px" }}>3 adımda çalışır</h2>
        </Reveal>
        {[
          { step: "01", icon: "✍️", title: "Öğrencileri Tanıt", desc: "\"Ali 90 puan, biraz haylaz. Elif sessiz, kısa boylu, gözlük kullanıyor\" — yaz ya da sesle anlat. AI geri kalanını yapar.", color: "#14b8a6" },
          { step: "02", icon: "🧬", title: "Optimizasyonu Başlat", desc: "Genetik algoritma 50 nesil boyunca çalışır. Akademik denge, davranış uyumu, fiziksel gereksinimler — saniyeler içinde.", color: "#8b5cf6" },
          { step: "03", icon: "📋", title: "Kullan, Paylaş, Tekrarla", desc: "Oturma planını yazdır veya paylaş. Sınav moduna geç, takım oluştur. Dönem içinde istediğin zaman güncelle.", color: "#f97316" },
        ].map((step, i) => (
          <Reveal key={i} delay={i * 120}>
            <div style={{ display: "flex", gap: "24px", padding: "32px 0", borderBottom: i < 2 ? "1px solid #e0d8d0" : "none" }}>
              <div style={{ flexShrink: 0, width: "56px", height: "56px", borderRadius: "14px", background: step.color + "18", border: `2px solid ${step.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                {step.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 900, color: step.color, marginBottom: "6px", letterSpacing: "0.1em" }}>ADIM {step.step}</div>
                <h3 style={{ fontWeight: 900, fontSize: "1.1rem", marginBottom: "8px" }}>{step.title}</h3>
                <p style={{ color: "#57534e", lineHeight: 1.65, margin: 0, fontSize: "0.9rem" }}>{step.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding: "88px 24px", background: "#f0ece7" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ textAlign: "center", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 900, marginBottom: "48px", letterSpacing: "-0.02em" }}>Öğretmenler ne diyor?</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="card-hover" style={{ background: "white", padding: "28px", borderRadius: "16px", border: "1.5px solid #e0d8d0", height: "100%" }}>
                  <p style={{ color: "#1a1715", lineHeight: 1.7, marginBottom: "20px", fontStyle: "italic", fontSize: "0.9rem" }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "2rem" }}>{t.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>{t.name}</div>
                      <div style={{ color: "#a8a29e", fontSize: "0.75rem" }}>{t.school}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" style={{ padding: "88px 24px", maxWidth: "820px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 900, marginBottom: "16px", letterSpacing: "-0.02em" }}>Sade ve şeffaf fiyatlandırma</h2>
            <p style={{ color: "#57534e", fontSize: "1rem" }}>Başvuru kartı yok. Kredi kartı yok. Sadece ihtiyacın kadar.</p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          <Reveal delay={0}>
            <div className="card-hover" style={{ background: "white", padding: "36px 28px", borderRadius: "20px", border: "1.5px solid #e0d8d0", height: "100%" }}>
              <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#57534e", marginBottom: "8px" }}>ÜCRETSİZ</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "4px" }}>₺0</div>
              <div style={{ color: "#a8a29e", fontSize: "0.8rem", marginBottom: "24px" }}>Sonsuza kadar</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {["5 öğrenciye kadar", "Tüm düzen tipleri", "Kelebek sınav modu", "Takım oluşturma"].map(f => (
                  <li key={f} style={{ display: "flex", gap: "8px", fontSize: "0.85rem" }}><span style={{ color: "#14b8a6" }}>✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/app" style={{ display: "block", textAlign: "center", textDecoration: "none", border: "2px solid #0d6e64", color: "#0d6e64", padding: "12px", borderRadius: "12px", fontWeight: 800, fontSize: "0.9rem" }}>
                Demo'yu Aç
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ background: "linear-gradient(135deg, #0d6e64, #094f47)", padding: "36px 28px", borderRadius: "20px", position: "relative", overflow: "hidden", boxShadow: "0 16px 48px rgba(13,110,100,0.3)", height: "100%" }}>
              <div style={{ position: "absolute", top: "16px", right: "16px", background: "#fbbf24", color: "#1a1715", fontSize: "0.65rem", fontWeight: 900, padding: "4px 10px", borderRadius: "50px" }}>BETA İNDİRİMİ</div>
              <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: "8px" }}>PRO</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "white", marginBottom: "4px" }}>₺150</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginBottom: "24px" }}>/ ay — yakında ₺200</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Sınırsız öğrenci", "Tüm ücretsiz özellikler +", "Öğrenci not defteri", "Dönem geçmişi", "AI sınıf analizi", "Öncelikli destek"].map(f => (
                  <li key={f} style={{ display: "flex", gap: "8px", fontSize: "0.85rem", color: "white" }}><span style={{ color: "#5eead4" }}>✓</span>{f}</li>
                ))}
              </ul>
              <a href="#waitlist" style={{ display: "block", textAlign: "center", textDecoration: "none", background: "white", color: "#0d6e64", padding: "14px", borderRadius: "12px", fontWeight: 900, fontSize: "0.9rem" }}>
                Erken Erişim Al →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" style={{ padding: "88px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 900, marginBottom: "16px", letterSpacing: "-0.02em" }}>İletişime geç</h2>
            <p style={{ color: "#57534e", fontSize: "1rem", maxWidth: "500px", margin: "0 auto" }}>Okul veya kurum olarak pilot kullanım, iş birliği ya da demo talebi için ulaşın.</p>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
          {[
            { icon: "✉️", title: "E-POSTA", value: "info@aklisira.com", href: "mailto:info@aklisira.com", desc: "Sorular, demo talepleri ve iş birlikleri" },
            { icon: "🌐", title: "WEB", value: "aklisira.com", href: "https://aklisira.com", desc: "Uygulamayı hemen ücretsiz deneyin" },
            { icon: "🏫", title: "KURUM", value: "Baykar Fen Lisesi", href: "#", desc: "İstanbul — Eğitimde Yapay Zekâ Zirvesi" },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 100}>
              <a href={c.href} style={{ textDecoration: "none", display: "block" }}>
                <div className="card-hover" style={{ background: "white", padding: "28px", borderRadius: "16px", border: "1.5px solid #e0d8d0", height: "100%" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "14px" }}>{c.icon}</div>
                  <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#14b8a6", marginBottom: "6px", letterSpacing: "0.1em" }}>{c.title}</div>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0d6e64", marginBottom: "8px" }}>{c.value}</div>
                  <div style={{ color: "#57534e", fontSize: "0.8rem", lineHeight: 1.5 }}>{c.desc}</div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div style={{ marginTop: "32px", padding: "28px 32px", background: "linear-gradient(135deg, #f0ece7, #fff)", borderRadius: "16px", border: "1.5px solid #e0d8d0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem", marginBottom: "4px" }}>Okulunuz için pilot kurmak ister misiniz?</div>
              <div style={{ color: "#57534e", fontSize: "0.85rem" }}>Okul yönetimleri ve zümre başkanları için özel demo randevusu.</div>
            </div>
            <a href="mailto:info@aklisira.com?subject=Pilot%20Demo%20Talebi" style={{ textDecoration: "none", background: "linear-gradient(135deg, #0d6e64, #14b8a6)", color: "white", padding: "12px 28px", borderRadius: "50px", fontWeight: 800, fontSize: "0.9rem", whiteSpace: "nowrap" }}>
              📩 Demo Talep Et
            </a>
          </div>
        </Reveal>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section style={{ padding: "88px 24px", textAlign: "center", background: "linear-gradient(135deg, #0d6e64, #094f47)" }}>
        <Reveal>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "white", marginBottom: "16px", letterSpacing: "-0.02em" }}>
            Sınıfınızı tanımaya hazır mısınız?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.05rem", maxWidth: "500px", margin: "0 auto 40px" }}>
            Kredi kartı gerekmez. 2 dakikada kurulum. Türkiye'deki öğretmenler için.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/login" className="hero-btn" style={{ textDecoration: "none", display: "inline-block", background: "white", color: "#0d6e64", padding: "18px 48px", borderRadius: "50px", fontWeight: 900, fontSize: "1.1rem", boxShadow: "0 12px 40px rgba(0,0,0,0.25)" }}>
              ✨ Ücretsiz Başla
            </Link>
            <Link href="/app" className="ghost-btn" style={{ textDecoration: "none", display: "inline-block", border: "2px solid rgba(255,255,255,0.35)", color: "white", padding: "18px 48px", borderRadius: "50px", fontWeight: 700, fontSize: "1.1rem" }}>
              Kayıtsız Dene
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ padding: "40px 24px", textAlign: "center", background: "#1a1715", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
          <img src="/logo.png" alt="AklıSıra" style={{ height: "26px", width: "26px", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.65 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span style={{ fontWeight: 900, color: "rgba(255,255,255,0.8)", fontSize: "1rem" }}>AklıSıra</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "12px" }}>
          {[["Özellikler", "#features"], ["Fiyat", "#pricing"], ["İletişim", "#contact"], ["Erken Erişim", "#waitlist"]].map(([label, href]) => (
            <a key={href} href={href} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{label}</a>
          ))}
          <span>·</span>
          <Link href="/app" style={{ color: "#5eead4", textDecoration: "none" }}>Demo</Link>
          <span>·</span>
          <a href="mailto:info@aklisira.com" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>info@aklisira.com</a>
        </div>
        <div>Baykar Fen Lisesi · III. Eğitimde Yapay Zekâ Zirvesi 2026 · © 2026</div>
      </footer>
    </div>
  );
}
