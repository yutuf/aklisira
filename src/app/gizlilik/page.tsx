import Link from 'next/link';
import { PRIVACY_NOTICE_TITLE, PRIVACY_NOTICE_PARAGRAPHS, PRIVACY_NOTICE_FOOTNOTE_EMAIL } from '../../content/privacy-notice';

export const metadata = {
  title: 'Veri & Gizlilik — AklıSıra',
};

export default function GizlilikPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '48px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
        <Link href="/landing" style={{ fontSize: '0.82rem', color: 'var(--primary)', textDecoration: 'none' }}>
          ← Ana sayfa
        </Link>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', margin: '16px 0 8px' }}>
          🔒 {PRIVACY_NOTICE_TITLE}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: '16px' }}>
          {PRIVACY_NOTICE_PARAGRAPHS.map((p, i) => <p key={i} style={{ margin: 0 }}>{p}</p>)}
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Bu metin gelişebilir; sorunuz/geri bildiriminiz için:{' '}
            <a href={`mailto:${PRIVACY_NOTICE_FOOTNOTE_EMAIL}`} style={{ color: 'var(--primary)' }}>
              {PRIVACY_NOTICE_FOOTNOTE_EMAIL}
            </a>
          </p>
        </div>

        <Link
          href="/app"
          style={{
            display: 'inline-block', marginTop: '28px', padding: '12px 28px',
            background: 'var(--primary)', color: 'white', borderRadius: '50px',
            fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
          }}
        >
          Uygulamaya dön →
        </Link>
      </div>
    </div>
  );
}
