"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Mic, Dna, Shuffle, Users, PenLine, Printer, Mail, Globe, School, Check } from "lucide-react";

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

// ── Reveal wrapper ──
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Hero diagram: an actual seating grid next to the kelebek (A/B checkerboard)
// exam layout — the real product output, not stock/decorative art. ──
function ProductDiagram() {
  const seats = Array.from({ length: 12 }, (_, i) => i);
  const highlighted = new Set([1, 6]); // two seats called out as "paired by rule"
  return (
    <svg viewBox="0 0 360 220" width="100%" height="auto" role="img" aria-label="Örnek oturma düzeni ve kelebek sınav düzeni">
      <text x="8" y="18" fontSize="11" fontWeight="700" fill="rgba(247,245,242,0.55)" fontFamily="var(--font-nunito)">SINIF</text>
      {seats.map((i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 8 + col * 38;
        const y = 28 + row * 38;
        const on = highlighted.has(i);
        return (
          <rect
            key={i}
            x={x} y={y} width="30" height="30" rx="6"
            fill={on ? "#14b8a6" : "rgba(255,255,255,0.08)"}
            stroke={on ? "#5eead4" : "rgba(255,255,255,0.18)"}
            strokeWidth="1.5"
          />
        );
      })}
      <line x1="0" y1="0" x2="0" y2="0" />
      <line x1="176" y1="20" x2="176" y2="196" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

      <text x="196" y="18" fontSize="11" fontWeight="700" fill="rgba(247,245,242,0.55)" fontFamily="var(--font-nunito)">KELEBEK</text>
      {seats.map((i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 196 + col * 38;
        const y = 28 + row * 38;
        const isA = (col + row) % 2 === 0;
        return (
          <g key={i}>
            <rect
              x={x} y={y} width="30" height="30" rx="6"
              fill={isA ? "#d97706" : "rgba(255,255,255,0.08)"}
              stroke={isA ? "#fbbf24" : "rgba(255,255,255,0.18)"}
              strokeWidth="1.5"
            />
            <text x={x + 15} y={y + 19} fontSize="11" fontWeight="800" textAnchor="middle" fill={isA ? "#1a1715" : "rgba(255,255,255,0.4)"} fontFamily="var(--font-nunito)">
              {isA ? "A" : "B"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
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
    { Icon: Mic, title: "Kurallarınızı Türkçe yazın", desc: "\"Ali ile Mehmet yan yana, Burak öne otursun\" — cümle olarak yazın ya da sesle söyleyin. Excel şablonu yok, IT talebi yok." },
    { Icon: Dna, title: "Kısıt tabanlı yerleştirme", desc: "Akademik denge, davranış uyumu, fiziksel ihtiyaçlar ve yazdığınız kurallar aynı anda çözülür — genetik algoritma ile." },
    { Icon: Shuffle, title: "Kelebek (A/B) sınav düzeni", desc: "Tek tıkla çapraz kopya önleme düzeni: bitişik sıralar farklı soru grubu alır, salon listesi yazdırmaya hazır." },
    { Icon: Users, title: "Takım ve proje grupları", desc: "Aynı kural motoruyla dengeli takımlar kurun — kim kiminle uyumlu, tahmin etmeden." },
  ];

  return (
    <div style={{ background: "#f7f5f2", minHeight: "100vh", color: "#1a1715", overflowX: "hidden" }}>
      <style>{`
        .btn-flat { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .btn-flat:hover { transform: translateY(-1px); }
        .nav-link { transition: color 0.15s; }
        .nav-link:hover { color: #0d6e64 !important; }
        .plain-card { transition: border-color 0.15s ease; }
        .plain-card:hover { border-color: #0d6e64; }
      `}</style>

      {/* ─── Nav ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "14px 32px",
        background: scrolled ? "#f7f5f2" : "transparent",
        borderBottom: scrolled ? "1px solid #e0d8d0" : "1px solid transparent",
        transition: "all 0.25s ease",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo.png" alt="AklıSıra" style={{ height: "30px", width: "30px", objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span className="font-display" style={{ fontSize: "1.3rem", fontWeight: 600, color: "#0d6e64" }}>
            AklıSıra
          </span>
          <span style={{ fontSize: "0.6rem", border: "1px solid #0d6e64", color: "#0d6e64", padding: "1px 8px", borderRadius: "3px", fontWeight: 700, letterSpacing: "0.05em" }}>BETA</span>
        </div>
        <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          {["Neden Farklı#neden", "Özellikler#features", "Fiyat#pricing", "İletişim#contact"].map((item) => {
            const [label, href] = item.split("#");
            return (
              <a key={href} href={`#${href}`} className="nav-link" style={{ textDecoration: "none", color: "#57534e", fontWeight: 600, fontSize: "0.85rem" }}>
                {label}
              </a>
            );
          })}
          <Link href="/app" className="nav-link" style={{ textDecoration: "none", color: "#57534e", fontWeight: 700, fontSize: "0.85rem" }}>
            Demo
          </Link>
          <Link href="/login" className="btn-flat" style={{
            textDecoration: "none",
            background: "#0d6e64",
            color: "white", padding: "8px 20px", borderRadius: "6px",
            fontWeight: 700, fontSize: "0.85rem",
          }}>
            Giriş Yap
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{
        display: "flex", flexDirection: "column",
        justifyContent: "center",
        padding: "150px 24px 80px",
        background: "#1a1715",
      }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "56px", alignItems: "center" }}>
          <div>
            <div style={{
              display: "inline-block",
              borderLeft: "3px solid #14b8a6",
              paddingLeft: "12px",
              marginBottom: "28px",
              color: "rgba(247,245,242,0.6)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.02em",
            }}>
              III. Eğitimde Yapay Zekâ Zirvesi — En İyi Demo
            </div>

            <h1 className="font-display" style={{ fontSize: "clamp(2.2rem, 4.6vw, 3.4rem)", fontWeight: 600, color: "#f7f5f2", lineHeight: 1.18, marginBottom: "24px", letterSpacing: "-0.01em" }}>
              Excel yerine, sınıf masasında bir araç.
            </h1>

            <p style={{ fontSize: "1.05rem", color: "rgba(247,245,242,0.68)", lineHeight: 1.75, marginBottom: "40px", maxWidth: "520px" }}>
              Kuralları Türkçe yazın ya da sesle anlatın: kim kiminle otursun, kim önde olsun. AklıSıra oturma düzenini ve kelebek sınav yerleşimini saniyeler içinde çözer — kurulum yok, IT talebi yok.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "36px" }}>
              <Link href="/app" className="btn-flat" style={{
                textDecoration: "none",
                background: "#14b8a6",
                color: "#0a2622", padding: "14px 32px", borderRadius: "6px",
                fontWeight: 800, fontSize: "0.95rem",
              }}>
                Ücretsiz Başla
              </Link>
              <Link href="/app" className="btn-flat" style={{
                textDecoration: "none",
                background: "transparent",
                border: "1.5px solid rgba(247,245,242,0.3)",
                color: "#f7f5f2", padding: "14px 32px", borderRadius: "6px",
                fontWeight: 700, fontSize: "0.95rem",
              }}>
                Kayıtsız Dene
              </Link>
            </div>

            <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", fontSize: "0.78rem", color: "rgba(247,245,242,0.45)" }}>
              <span>İlk sınıf ücretsiz, kart gerekmez</span>
              <span>·</span>
              <span>6 düzen tipi + kelebek</span>
              <span>·</span>
              <span>Tipik optimizasyon ~30 sn</span>
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "18px" }}>
            <ProductDiagram />
          </div>
        </div>
      </section>

      {/* ─── DIFFERENTIATION: "K12 / Okulyo var, buna ne gerek?" ─── */}
      <section id="neden" style={{ padding: "80px 24px", maxWidth: "980px", margin: "0 auto" }}>
        <Reveal>
          <h2 className="font-display" style={{ fontSize: "clamp(1.7rem, 3.4vw, 2.3rem)", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "18px" }}>
            "Okulumun zaten K12 / Okulyo gibi bir sistemi var — buna ne gerek?"
          </h2>
          <p style={{ color: "#57534e", fontSize: "1rem", lineHeight: 1.75, maxWidth: "760px", marginBottom: "36px" }}>
            K12NET, Okulyo ve benzeri sistemler <strong>okul yönetim yazılımı</strong> — kayıt, devam, veli iletişimi, kurum çapında sınav organizasyonu. Kurulur, IT ekibi yönetir, tüm okulu kapsar. AklıSıra bunların yerine geçmiyor: o sistemler yokken ya da o gün elinizde yokken, <strong>tek bir sınıfın oturma düzenini</strong> Excel yerine iki dakikada çözen bir öğretmen aracı.
          </p>
        </Reveal>
        <Reveal delay={80}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #1a1715" }}>
                  <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 800 }}>Sistem</th>
                  <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 800 }}>Ne için</th>
                  <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 800, color: "#0d6e64" }}>AklıSıra farkı</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["K12NET", "Kurum çapında sınav oturma sihirbazı, tam MIS", "Öğretmenin kendi sınıfı için, IT olmadan, 2 dakikada"],
                  ["Okulyo", "Yoklama, turnike, veli bildirim — kampüs operasyonu", "Sınıf pedagojisi: kim kimle otursun, biz buna bakarız"],
                  ["ETED (TED)", "Kuruma özel yerleşik sistem", "Yerini almaya çalışmıyoruz — hâlâ Excel'e dönen öğretmen için tamamlayıcı"],
                ].map((row) => (
                  <tr key={row[0]} style={{ borderBottom: "1px solid #e0d8d0" }}>
                    <td style={{ padding: "12px", fontWeight: 700 }}>{row[0]}</td>
                    <td style={{ padding: "12px", color: "#57534e" }}>{row[1]}</td>
                    <td style={{ padding: "12px", color: "#0d6e64", fontWeight: 600 }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* ─── WAITLIST ─── */}
      <section id="waitlist" style={{ padding: "64px 24px", background: "#fdf8ee", borderTop: "1px solid #f0d98a", borderBottom: "1px solid #f0d98a" }}>
        <Reveal>
          <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#92400e", marginBottom: "14px", letterSpacing: "0.02em" }}>
              ERKEN ERİŞİM — İLK 50 KULLANICIYA %50 İNDİRİM
            </div>
            <h2 className="font-display" style={{ fontSize: "clamp(1.5rem, 3.4vw, 1.9rem)", fontWeight: 600, marginBottom: "12px" }}>
              Pro özellikleri ilk deneyin
            </h2>
            <p style={{ color: "#57534e", fontSize: "0.92rem", lineHeight: 1.7, maxWidth: "440px", margin: "0 auto 28px" }}>
              Kalıcı öğrenci profilleri, dönem takibi ve AI analiz raporu hazır olunca sizi ilk haberdar edeceğiz.
            </p>
            {waitlistStatus === "success" ? (
              <div style={{ padding: "20px", background: "#dcfce7", borderRadius: "8px", border: "1px solid #86efac", color: "#15803d", fontWeight: 700, fontSize: "0.95rem" }}>
                Listeye eklendiniz — haberdar edeceğiz.
              </div>
            ) : (
              <form onSubmit={handleWaitlist} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "420px", margin: "0 auto" }}>
                <input type="text" placeholder="Adınız (isteğe bağlı)" value={waitlistName} onChange={e => setWaitlistName(e.target.value)} style={{ padding: "13px 16px", borderRadius: "6px", border: "1.5px solid #e0d8d0", fontSize: "0.92rem", fontFamily: "inherit", outline: "none", background: "white" }} />
                <div style={{ display: "flex", gap: "10px" }}>
                  <input type="email" placeholder="E-posta adresiniz" value={waitlistEmail} onChange={e => setWaitlistEmail(e.target.value)} required style={{ flex: 1, padding: "13px 16px", borderRadius: "6px", border: "1.5px solid #e0d8d0", fontSize: "0.92rem", fontFamily: "inherit", outline: "none", background: "white" }} />
                  <button type="submit" disabled={waitlistStatus === "loading"} className="btn-flat" style={{ padding: "13px 20px", borderRadius: "6px", background: "#0d6e64", color: "white", border: "none", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                    {waitlistStatus === "loading" ? "Gönderiliyor…" : "Listeye Katıl"}
                  </button>
                </div>
                {waitlistStatus === "error" && <p style={{ color: "#dc2626", fontSize: "0.8rem", margin: 0 }}>Bir hata oluştu. Lütfen tekrar deneyin.</p>}
                <p style={{ color: "#a8a29e", fontSize: "0.74rem", margin: 0 }}>Spam yok. İstediğiniz zaman çıkabilirsiniz.</p>
              </form>
            )}
          </div>
        </Reveal>
      </section>

      {/* ─── PROBLEM ─── */}
      <section style={{ padding: "80px 24px", maxWidth: "1040px", margin: "0 auto" }}>
        <Reveal>
          <h2 className="font-display" style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.2rem)", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "14px" }}>Öğretmenler bugün ne yapıyor?</h2>
          <p style={{ color: "#57534e", fontSize: "1rem", maxWidth: "560px", marginBottom: "44px" }}>Çoğu öğretmen hâlâ kağıt ve Excel ile sınıf yönetiyor — kurumsal sistem varsa bile.</p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: "#e0d8d0", border: "1px solid #e0d8d0" }}>
          {[
            ["01", "Oturma düzeni, silgi izi", "Her dönem sıfırdan çiz, her şikayet sonrası yeniden düzenle."],
            ["02", "30 öğrenci, tek bir Excel", "Notlar, davranışlar, aile notları — hepsi farklı sekmelerde."],
            ["03", "Sınav karıştırma, eziyet", "Her dönemde el ile karıştırma, salon listesi hazırlama."],
            ["04", "Proje grubu, tahmin işi", "Kim kimle uyumlu? Kim bu projeye uygun? Belli değil."],
          ].map(([n, title, desc]) => (
            <div key={n} style={{ background: "white", padding: "26px 24px" }}>
              <div style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, fontSize: "1.6rem", color: "#d8cfc4", marginBottom: "10px" }}>{n}</div>
              <h3 style={{ fontWeight: 800, fontSize: "0.92rem", marginBottom: "8px" }}>{title}</h3>
              <p style={{ color: "#57534e", fontSize: "0.84rem", lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" style={{ padding: "80px 24px", background: "#f0ece7" }}>
        <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
          <Reveal>
            <h2 className="font-display" style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.2rem)", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "44px" }}>Ne yapar</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "36px 28px" }}>
            {features.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 60}>
                <div>
                  <Icon size={22} strokeWidth={1.6} color="#0d6e64" style={{ marginBottom: "14px" }} />
                  <h3 style={{ fontWeight: 800, fontSize: "0.96rem", marginBottom: "8px" }}>{title}</h3>
                  <p style={{ color: "#57534e", fontSize: "0.85rem", lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: "80px 24px", maxWidth: "820px", margin: "0 auto" }}>
        <Reveal>
          <h2 className="font-display" style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.2rem)", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "44px" }}>3 adımda çalışır</h2>
        </Reveal>
        {[
          { step: "01", Icon: PenLine, title: "Öğrencileri tanıtın", desc: "\"Ali 90 puan, biraz haylaz. Elif sessiz, gözlük kullanıyor\" — yazın ya da sesle anlatın." },
          { step: "02", Icon: Dna, title: "Optimizasyonu başlatın", desc: "Akademik denge, davranış uyumu, fiziksel gereksinimler — genetik algoritma ile saniyeler içinde." },
          { step: "03", Icon: Printer, title: "Kullanın, paylaşın, tekrarlayın", desc: "Planı yazdırın ya da paylaşın. Sınav moduna geçin, takım oluşturun. İstediğiniz an güncelleyin." },
        ].map(({ step, Icon, title, desc }, i) => (
          <Reveal key={step} delay={i * 90}>
            <div style={{ display: "flex", gap: "20px", padding: "28px 0", borderBottom: i < 2 ? "1px solid #e0d8d0" : "none" }}>
              <div style={{ flexShrink: 0, width: "48px", height: "48px", borderRadius: "8px", background: "#d1faf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={20} strokeWidth={1.6} color="#0d6e64" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 900, color: "#0d6e64", marginBottom: "6px", letterSpacing: "0.1em" }}>ADIM {step}</div>
                <h3 style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: "6px" }}>{title}</h3>
                <p style={{ color: "#57534e", lineHeight: 1.6, margin: 0, fontSize: "0.88rem" }}>{desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* ─── SOCIAL PROOF (real only) ─── */}
      <section style={{ padding: "72px 24px", background: "#1a1715" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <h2 className="font-display" style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)", fontWeight: 600, color: "#f7f5f2", marginBottom: "14px" }}>Kanıtlanmış demo</h2>
            <p style={{ color: "rgba(247,245,242,0.7)", fontSize: "0.98rem", lineHeight: 1.7, marginBottom: "8px" }}>
              III. Eğitimde Yapay Zekâ Zirvesi'nde <strong style={{ color: "#5eead4" }}>En İyi Demo</strong> — YTÜ Davutpaşa, 2026.
            </p>
            <p style={{ color: "rgba(247,245,242,0.4)", fontSize: "0.85rem", lineHeight: 1.6 }}>
              Sahte öğretmen yorumu yok. Ürünü kendiniz deneyin — zirvede gösterilenle aynı.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" style={{ padding: "80px 24px", maxWidth: "780px", margin: "0 auto" }}>
        <Reveal>
          <h2 className="font-display" style={{ fontSize: "clamp(1.6rem, 3.4vw, 2rem)", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "12px" }}>Sade ve şeffaf fiyatlandırma</h2>
          <p style={{ color: "#57534e", fontSize: "0.95rem", marginBottom: "44px" }}>Başvuru kartı yok, kredi kartı yok. Sadece ihtiyacınız kadar.</p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "#e0d8d0", border: "1px solid #e0d8d0" }}>
          <Reveal delay={0}>
            <div className="plain-card" style={{ background: "white", padding: "32px 26px", border: "1px solid transparent", height: "100%" }}>
              <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "#57534e", marginBottom: "8px", letterSpacing: "0.05em" }}>ÜCRETSİZ</div>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: "4px" }}>₺0</div>
              <div style={{ color: "#a8a29e", fontSize: "0.78rem", marginBottom: "22px" }}>İlk sınıf ücretsiz</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: "9px" }}>
                {["İlk sınıfın tamamı ücretsiz", "Tüm düzen tipleri", "Kelebek sınav modu", "Takım oluşturma", "Kart gerekmez"].map(f => (
                  <li key={f} style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.84rem" }}><Check size={14} color="#0d6e64" strokeWidth={2.5} />{f}</li>
                ))}
              </ul>
              <Link href="/app" style={{ display: "block", textAlign: "center", textDecoration: "none", border: "1.5px solid #0d6e64", color: "#0d6e64", padding: "11px", borderRadius: "6px", fontWeight: 700, fontSize: "0.88rem" }}>
                Demo'yu Aç
              </Link>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div style={{ background: "#1a1715", padding: "32px 26px", position: "relative", height: "100%" }}>
              <div style={{ position: "absolute", top: "16px", right: "16px", border: "1px solid #fbbf24", color: "#fbbf24", fontSize: "0.62rem", fontWeight: 800, padding: "3px 9px", borderRadius: "3px", letterSpacing: "0.03em" }}>BETA İNDİRİMİ</div>
              <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "rgba(247,245,242,0.55)", marginBottom: "8px", letterSpacing: "0.05em" }}>PRO</div>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#f7f5f2", marginBottom: "4px" }}>₺150</div>
              <div style={{ color: "rgba(247,245,242,0.45)", fontSize: "0.78rem", marginBottom: "22px" }}>/ ay — yakında ₺200</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: "9px" }}>
                {["Sınırsız öğrenci", "Tüm ücretsiz özellikler +", "Öğrenci not defteri", "Dönem geçmişi", "AI sınıf analizi", "Öncelikli destek"].map(f => (
                  <li key={f} style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.84rem", color: "#f7f5f2" }}><Check size={14} color="#5eead4" strokeWidth={2.5} />{f}</li>
                ))}
              </ul>
              <a href="#waitlist" className="btn-flat" style={{ display: "block", textAlign: "center", textDecoration: "none", background: "#14b8a6", color: "#0a2622", padding: "13px", borderRadius: "6px", fontWeight: 800, fontSize: "0.88rem" }}>
                Erken Erişim Al
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" style={{ padding: "80px 24px", maxWidth: "980px", margin: "0 auto" }}>
        <Reveal>
          <h2 className="font-display" style={{ fontSize: "clamp(1.6rem, 3.4vw, 2rem)", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "12px" }}>İletişime geçin</h2>
          <p style={{ color: "#57534e", fontSize: "0.95rem", maxWidth: "500px", marginBottom: "40px" }}>Okul veya kurum olarak pilot kullanım, iş birliği ya da demo talebi için ulaşın.</p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1px", background: "#e0d8d0", border: "1px solid #e0d8d0", marginBottom: "24px" }}>
          {[
            { Icon: Mail, title: "E-POSTA", value: "info@aklisira.com", href: "mailto:info@aklisira.com", desc: "Sorular, demo talepleri ve iş birlikleri" },
            { Icon: Globe, title: "WEB", value: "aklisira.com", href: "https://aklisira.com", desc: "Uygulamayı hemen ücretsiz deneyin" },
            { Icon: School, title: "KURUM", value: "Baykar Fen Lisesi", href: "#", desc: "İstanbul — Eğitimde Yapay Zekâ Zirvesi" },
          ].map((c) => (
            <a key={c.title} href={c.href} className="plain-card" style={{ textDecoration: "none", display: "block", background: "white", padding: "26px 24px", border: "1px solid transparent" }}>
              <c.Icon size={20} strokeWidth={1.6} color="#0d6e64" style={{ marginBottom: "14px" }} />
              <div style={{ fontSize: "0.66rem", fontWeight: 800, color: "#0d6e64", marginBottom: "6px", letterSpacing: "0.08em" }}>{c.title}</div>
              <div style={{ fontWeight: 800, fontSize: "0.94rem", color: "#1a1715", marginBottom: "6px" }}>{c.value}</div>
              <div style={{ color: "#57534e", fontSize: "0.8rem", lineHeight: 1.5 }}>{c.desc}</div>
            </a>
          ))}
        </div>
        <Reveal delay={150}>
          <div style={{ padding: "24px 28px", background: "white", border: "1px solid #e0d8d0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem", marginBottom: "4px" }}>Okulunuz için pilot kurmak ister misiniz?</div>
              <div style={{ color: "#57534e", fontSize: "0.83rem" }}>Okul yönetimleri ve zümre başkanları için özel demo randevusu.</div>
            </div>
            <a href="mailto:info@aklisira.com?subject=Pilot%20Demo%20Talebi" className="btn-flat" style={{ textDecoration: "none", background: "#0d6e64", color: "white", padding: "11px 24px", borderRadius: "6px", fontWeight: 700, fontSize: "0.86rem", whiteSpace: "nowrap" }}>
              Demo Talep Et
            </a>
          </div>
        </Reveal>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section style={{ padding: "80px 24px", textAlign: "center", background: "#0d6e64" }}>
        <Reveal>
          <h2 className="font-display" style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.2rem)", fontWeight: 600, color: "white", marginBottom: "14px" }}>
            Sınıfınızı tanımaya hazır mısınız?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", maxWidth: "480px", margin: "0 auto 32px" }}>
            Kredi kartı gerekmez. 2 dakikada kurulum. Türkiye'deki öğretmenler için.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/app" className="btn-flat" style={{ textDecoration: "none", display: "inline-block", background: "white", color: "#0d6e64", padding: "15px 40px", borderRadius: "6px", fontWeight: 800, fontSize: "1rem" }}>
              Ücretsiz Başla
            </Link>
            <Link href="/app" className="btn-flat" style={{ textDecoration: "none", display: "inline-block", border: "1.5px solid rgba(255,255,255,0.35)", color: "white", padding: "15px 40px", borderRadius: "6px", fontWeight: 700, fontSize: "1rem" }}>
              Kayıtsız Dene
            </Link>
          </div>
          <p style={{ marginTop: "18px", fontSize: "0.78rem", color: "rgba(255,255,255,0.55)" }}>
            Öğrenci listeleri tarayıcınızda kalır — <Link href="/gizlilik" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "underline" }}>ayrıntılar</Link>
          </p>
        </Reveal>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ padding: "40px 24px", textAlign: "center", background: "#1a1715", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
          <img src="/logo.png" alt="AklıSıra" style={{ height: "24px", width: "24px", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.65 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span className="font-display" style={{ fontWeight: 600, color: "rgba(255,255,255,0.85)", fontSize: "1rem" }}>AklıSıra</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "12px" }}>
          {[["Neden Farklı", "#neden"], ["Özellikler", "#features"], ["Fiyat", "#pricing"], ["İletişim", "#contact"]].map(([label, href]) => (
            <a key={href} href={href} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{label}</a>
          ))}
          <span>·</span>
          <Link href="/app" style={{ color: "#5eead4", textDecoration: "none" }}>Demo</Link>
          <span>·</span>
          <Link href="/gizlilik" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Gizlilik</Link>
        </div>
        <div style={{ marginBottom: "4px" }}>
          Yusuf Kerim Kaymakçı · Baykar Fen Lisesi · <a href="mailto:ykk@zilant.one" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>ykk@zilant.one</a> · aklisira.com
        </div>
        <div style={{ opacity: 0.7 }}>Öğrenci yapımı · III. Eğitimde Yapay Zekâ Zirvesi 2026 · © 2026</div>
      </footer>
    </div>
  );
}
