"use client";

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function AuthGate({ children }: { children: (auth: ReturnType<typeof useAuth>) => React.ReactNode }) {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // No Supabase project configured yet — run the app without accounts.
  if (!auth.configured) return <>{children(auth)}</>;

  if (auth.loading) return null;

  if (!auth.session) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div className="card" style={{ maxWidth: 360, width: '100%' }}>
          <div className="card-header"><span>🔐 Giriş Yap</span></div>
          {sent ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {email} adresine bir giriş bağlantısı gönderdik. E-postanızı kontrol edin.
            </p>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                try {
                  await auth.signInWithEmail(email);
                  setSent(true);
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Giriş başarısız oldu.');
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <input
                type="email"
                required
                placeholder="ornek@okul.edu.tr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-textarea"
                style={{ height: 'auto', padding: '10px' }}
              />
              <button type="submit" className="btn-primary">Bağlantı Gönder</button>
              {error && <p style={{ fontSize: '0.78rem', color: '#dc2626' }}>{error}</p>}
            </form>
          )}
        </div>
      </div>
    );
  }

  return <>{children(auth)}</>;
}
