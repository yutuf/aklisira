'use client';

import { createBrowserClient } from '@supabase/ssr'
import { useState } from 'react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    if (error) {
      console.error(error);
      setIsLoading(false);
      alert('Google ile giriş yaparken bir hata oluştu.');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert('Lütfen e-posta ve şifrenizi girin.');
    
    setIsLoading(true);
    
    if (isLoginMode) {
      // Login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setIsLoading(false);
        return alert(error.message === 'Invalid login credentials' ? 'E-posta veya şifre hatalı.' : error.message);
      }
      window.location.href = '/app';
    } else {
      // Signup
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      setIsLoading(false);
      if (error) {
        return alert(error.message);
      }
      alert('Kayıt başarılı! Lütfen e-postanızı kontrol ederek hesabınızı doğrulayın.');
      setIsLoginMode(true);
    }
  };

  return (
    <div className="login-container" style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-default)',
      fontFamily: 'inherit'
    }}>
      {/* ─── Left Side: Brand & Visuals ─── */}
      <div className="login-brand" style={{
        flex: 1,
        background: 'var(--primary-gradient)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>
        
        <div style={{ zIndex: 1, textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ 
            background: 'white', 
            width: '100px', 
            height: '100px', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <img src="/logo.png" alt="AklıSıra Logo" style={{ width: '64px' }} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>
            Sınıfınızı Geleceğe Taşıyın
          </h1>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', opacity: 0.9 }}>
            Yapay zeka destekli akıllı algoritmalar ile saniyeler içinde mükemmel oturma düzenini oluşturun, akademik başarıyı ve sınıf içi uyumu maksimize edin.
          </p>
        </div>
      </div>

      {/* ─── Right Side: Auth Form ─── */}
      <div className="login-form-wrapper" style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: 'var(--bg)',
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
              {isLoginMode ? 'AklıSıra\'ya Giriş Yap' : 'Hesap Oluştur'}
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              {isLoginMode ? 'Hesabınıza giriş yaparak optimizasyonlara devam edin.' : 'Sınıf düzeninizi oluşturmak için ücretsiz kayıt olun.'}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>E-posta Adresi</label>
              <input 
                type="email" 
                placeholder="ornek@okul.edu.tr" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1.5px solid var(--border)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>Şifre</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1.5px solid var(--border)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
                }}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--primary-dark)', color: 'white', border: 'none', fontSize: '1rem', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '8px', transition: 'all 0.2s', opacity: isLoading ? 0.8 : 1
              }}
            >
              {isLoading ? 'İşleniyor...' : (isLoginMode ? 'Giriş Yap' : 'Kayıt Ol')}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>veya şununla devam et</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={handleGoogleLogin} 
              disabled={isLoading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', padding: '14px', background: 'white', color: '#3c4043', border: '1px solid #dadce0', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
              }}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px' }} />
              Google ile {isLoginMode ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>

            <button 
              onClick={() => alert('Microsoft Office 365 / Azure entegrasyonu onay aşamasındadır. Lütfen şimdilik Google veya E-posta kullanın.')} 
              disabled={isLoading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', padding: '14px', background: 'white', color: '#3c4043', border: '1px solid #dadce0', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
              }}
            >
              <img src="https://www.svgrepo.com/show/452062/microsoft.svg" alt="Microsoft" style={{ width: '20px' }} />
              Microsoft ile {isLoginMode ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </div>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {isLoginMode ? 'Henüz hesabınız yok mu?' : 'Zaten bir hesabınız var mı?'}
            <button 
              onClick={() => setIsLoginMode(!isLoginMode)}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, marginLeft: '6px', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              {isLoginMode ? 'Kayıt Ol' : 'Giriş Yap'}
            </button>
          </div>
          
        </div>
      </div>
      
      {/* Mobile Styles embedded */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 900px) {
          .login-container {
            flex-direction: column !important;
          }
          .login-brand {
            padding: 40px 20px !important;
            flex: none !important;
          }
          .login-form-wrapper {
            padding: 40px 20px !important;
            align-items: flex-start !important;
          }
        }
      `}} />
    </div>
  );
}
