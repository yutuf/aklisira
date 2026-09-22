"use client";

import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { PRIVACY_NOTICE_TITLE, PRIVACY_NOTICE_PARAGRAPHS, PRIVACY_NOTICE_FOOTNOTE_EMAIL } from '../content/privacy-notice';

const STORAGE_KEY = 'aklisira_privacy_notice_v1';
export const OPEN_PRIVACY_NOTICE_EVENT = 'aklisira:open-privacy-notice';

export function PrivacyNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {}

    const handler = () => setOpen(true);
    window.addEventListener(OPEN_PRIVACY_NOTICE_EVENT, handler);
    return () => window.removeEventListener(OPEN_PRIVACY_NOTICE_EVENT, handler);
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={dismiss}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '480px',
          width: '92%',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '24px',
          position: 'relative',
        }}
      >
        <button
          onClick={dismiss}
          aria-label="Kapat"
          style={{
            position: 'absolute', top: '14px', right: '14px',
            width: '30px', height: '30px', borderRadius: '50%',
            border: 'none', background: 'var(--bg-muted)', color: 'var(--text-secondary)',
            fontSize: '1.1rem', cursor: 'pointer', lineHeight: 1,
          }}
        >
          ×
        </button>

        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)', margin: '0 24px 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={18} strokeWidth={1.75} /> {PRIVACY_NOTICE_TITLE}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', lineHeight: 1.55, color: 'var(--text-secondary)' }}>
          {PRIVACY_NOTICE_PARAGRAPHS.map((p, i) => <p key={i} style={{ margin: 0 }}>{p}</p>)}
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Bu metin gelişebilir; sorunuz/geri bildiriminiz için:{' '}
            <a href={`mailto:${PRIVACY_NOTICE_FOOTNOTE_EMAIL}`} style={{ color: 'var(--primary)' }}>
              {PRIVACY_NOTICE_FOOTNOTE_EMAIL}
            </a>
          </p>
        </div>

        <button onClick={dismiss} className="btn-primary" style={{ width: '100%', marginTop: '18px' }}>
          Anladım
        </button>
      </div>
    </div>
  );
}

export function PrivacyNoticeLink({ style, children }: { style?: React.CSSProperties; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_PRIVACY_NOTICE_EVENT))}
      style={{
        background: 'none', border: 'none', padding: 0, margin: 0,
        font: 'inherit', color: 'inherit', cursor: 'pointer', textDecoration: 'underline',
        ...style,
      }}
    >
      {children ?? 'Veri & gizlilik'}
    </button>
  );
}
