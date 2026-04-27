'use client';

import { createBrowserClient } from '@supabase/ssr'
import { useState } from 'react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

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
      alert('Giriş yaparken bir hata oluştu.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-default)',
      fontFamily: 'inherit'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        padding: '40px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%'
      }}>
        <img src="/logo.png" alt="AklıSıra Logo" style={{ width: '80px', marginBottom: '20px' }} />
        <h1 style={{ fontSize: '1.5rem', color: 'var(--text)', marginBottom: '8px', fontWeight: 800 }}>AklıSıra'ya Hoş Geldiniz</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.9rem' }}>
          Sınıf oturma düzeninizi akıllıca optimize etmek için giriş yapın.
        </p>

        <button 
          onClick={handleGoogleLogin} 
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            padding: '12px',
            background: 'white',
            color: '#333',
            border: '1px solid #ccc',
            borderRadius: 'var(--radius-sm)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: isLoading ? 0.7 : 1
          }}
          className="google-btn"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px' }} />
          {isLoading ? 'Bağlanıyor...' : 'Google ile Giriş Yap'}
        </button>
      </div>
    </div>
  );
}
