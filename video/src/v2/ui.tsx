import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LayoutGrid, Users, FileEdit, GraduationCap, ShieldCheck, Eye, Ear } from 'lucide-react';
import { Wordmark, ease, LevelMeter, BehaviorTag } from '../components';
import { C, FONT_DISPLAY, shadowLg } from '../theme';
import { STAGE_W, STAGE_H, useLayout } from './layout';

/** English narration block; position and size adapt to 16:9 / 9:16. */
export const Cap: React.FC<{
  step?: string; title: React.ReactNode; sub?: React.ReactNode; at?: number; out?: number; size?: number;
}> = ({ step, title, sub, at = 0, out, size }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const t = (d: number) => ease(frame - at - d, [0, 14], [0, 1]);
  const o = out !== undefined ? ease(frame - out, [0, 8], [1, 0]) : 1;
  if (frame < at) return null;
  return (
    <div style={{ position: 'absolute', left: L.cap.x, top: L.cap.y, width: L.cap.w, opacity: o }}>
      {step && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontWeight: 900, fontSize: L.V ? 26 : 21, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.primary, opacity: t(0) }}>
          <span style={{ width: 36, height: 3, background: C.accent, display: 'inline-block' }} />
          {step}
        </div>
      )}
      <div
        style={{
          fontFamily: FONT_DISPLAY, fontWeight: 560, fontSize: size ?? L.cap.title, lineHeight: 1.05, letterSpacing: '-0.018em',
          marginTop: 20, opacity: t(3), transform: `translateY(${(1 - t(3)) * 22}px)`,
        }}
      >
        {title}
      </div>
      {sub && (
        <div style={{ fontSize: L.cap.sub, lineHeight: 1.42, color: C.text2, marginTop: 22, fontWeight: 600, opacity: t(8), transform: `translateY(${(1 - t(8)) * 14}px)` }}>
          {sub}
        </div>
      )}
    </div>
  );
};

const TABS = [
  { id: 'students', label: 'Öğrenciler', Icon: GraduationCap },
  { id: 'classroom', label: 'Sınıf & Düzen', Icon: LayoutGrid },
  { id: 'exam', label: 'Sınav Modu', Icon: FileEdit },
  { id: 'teams', label: 'Takım Kur', Icon: Users },
];

/** App window background + top bar in stage space. `show` fades the chrome (for the reveal). */
export const Chrome: React.FC<{ tab: string; show?: number; privacy?: boolean }> = ({ tab, show = 1, privacy }) => (
  <>
    <div style={{ position: 'absolute', left: 0, top: 0, width: STAGE_W, height: STAGE_H, background: '#fcfbf9', borderRadius: 28, border: `1px solid ${C.border}`, boxShadow: shadowLg, opacity: show }} />
    <div
      style={{
        position: 'absolute', left: 0, top: 0, width: STAGE_W, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 26px', borderBottom: `1px solid ${C.borderLight}`, background: C.card, borderRadius: '28px 28px 0 0', opacity: show,
      }}
    >
      <Wordmark size={24} />
      <div style={{ display: 'flex', gap: 4 }}>
        {TABS.map(({ id, label, Icon }) => (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 12px', borderRadius: 12, fontSize: 16, fontWeight: 800, color: id === tab ? C.primaryDark : C.text3, background: id === tab ? C.primaryPale : 'transparent' }}>
            <Icon size={17} strokeWidth={2} /> {label}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 800, color: privacy ? C.primary : C.text3, border: `1.5px solid ${privacy ? C.primary : C.border}`, background: privacy ? C.primaryPale : C.card, padding: '6px 12px', borderRadius: 999 }}>
        <ShieldCheck size={15} strokeWidth={2.2} /> {privacy ? 'Gizlilik: Açık' : 'Gizlilik: Kapalı'}
      </div>
    </div>
  </>
);

/** Dark note inside the stage with a leader line to a target point (all stage coords). */
export const Note: React.FC<{
  x: number; y: number; w?: number; tx: number; ty: number; at: number; out?: number; label: string; detail?: string; color?: string;
  from?: 'left' | 'right' | 'top';
}> = ({ x, y, w = 440, tx, ty, at, out, label, detail, color = C.accent, from = 'left' }) => {
  const frame = useCurrentFrame();
  const a = ease(frame - at, [0, 10], [0, 1]);
  const l = ease(frame - at - 4, [0, 12], [0, 1]);
  const o = out !== undefined ? ease(frame - out, [0, 8], [1, 0]) : 1;
  if (frame < at) return null;
  const sx = from === 'left' ? x : from === 'right' ? x + w : x + w / 2;
  const sy = from === 'top' ? y : y + 46;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, zIndex: 40, pointerEvents: 'none' }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={STAGE_W} height={STAGE_H}>
        <line x1={sx} y1={sy} x2={sx + (tx - sx) * l} y2={sy + (ty - sy) * l} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
        <circle cx={tx} cy={ty} r={11 * l} fill="none" stroke={color} strokeWidth={3.5} />
        <circle cx={tx} cy={ty} r={4.5 * l} fill={color} />
      </svg>
      <div
        style={{
          position: 'absolute', left: x, top: y, width: w, background: C.text, color: '#fff', borderRadius: 16, padding: '16px 22px',
          borderLeft: `6px solid ${color}`, opacity: a, transform: `translateY(${(1 - a) * 12}px)`, boxShadow: '0 14px 34px rgba(26,23,21,0.25)',
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 28, lineHeight: 1.15 }}>{label}</div>
        {detail && <div style={{ fontSize: 21, opacity: 0.82, marginTop: 6, fontWeight: 600, lineHeight: 1.35 }}>{detail}</div>}
      </div>
    </div>
  );
};

/** Persistent domain mark so clips shared on their own still point home. */
export const Watermark: React.FC = () => {
  const L = useLayout();
  return L.V ? (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1735, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <Wordmark size={40} />
      <div style={{ fontSize: 26, fontWeight: 900, color: C.text3, letterSpacing: '0.04em' }}>aklisira.com</div>
    </div>
  ) : (
    <div style={{ position: 'absolute', right: 56, bottom: 34, fontSize: 19, fontWeight: 900, color: C.text3, letterSpacing: '0.04em' }}>aklisira.com</div>
  );
};

/** Seat card positioned by its centre so it can morph between layouts and sizes. */
export const Seat: React.FC<{
  s: { name: string; behaviorType: string; academicLevel: string; vision?: boolean; hearing?: boolean };
  cx: number; cy: number; w: number; h: number; rot?: number; tags?: number; ring?: string | null; settled?: boolean; lift?: number; z?: number;
  privacy?: number;
}> = ({ s, cx, cy, w, h, rot = 0, tags = 1, ring, settled, lift = 0, z = 1, privacy = 0 }) => {
  const nameSize = Math.max(18, Math.min(24, h * 0.3));
  return (
    <div
      style={{
        position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: Math.min(16, h * 0.2),
        background: settled ? '#f1fbf9' : C.card, border: `2px solid ${ring ?? (settled ? C.primaryLight : C.border)}`,
        boxShadow: ring ? `0 0 0 6px ${ring}30` : lift > 0.05 ? `0 ${12 * lift}px ${26 * lift}px rgba(26,23,21,${0.18 * lift})` : '0 1px 2px rgba(26,23,21,0.05)',
        transform: `rotate(${rot}deg) scale(${1 + lift * 0.05})`, zIndex: lift > 0.05 ? 20 : z,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 7 * tags,
      }}
    >
      <div style={{ fontWeight: 900, fontSize: nameSize, color: C.text, whiteSpace: 'nowrap' }}>{s.name}</div>
      {tags > 0.02 && (
        <div style={{ position: 'relative', height: 22 * tags, width: '100%', opacity: tags }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7, opacity: 1 - privacy, filter: `blur(${privacy * 6}px)` }}>
            <BehaviorTag type={s.behaviorType} size={13} />
            <LevelMeter level={s.academicLevel} size={5} />
          </div>
          {privacy > 0 && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 15, fontWeight: 700, color: C.text3, opacity: privacy }}>Öğrenci</div>
          )}
        </div>
      )}
      {(s.vision || s.hearing) && tags > 0.02 && privacy < 1 && (
        <div style={{ position: 'absolute', top: 8, right: 10, display: 'flex', gap: 4, opacity: tags * (1 - privacy) }}>
          {s.vision && <Eye size={17} strokeWidth={2.4} color={C.accent} />}
          {s.hearing && <Ear size={17} strokeWidth={2.4} color={C.accent} />}
        </div>
      )}
    </div>
  );
};

export const Board: React.FC<{ x?: number; y: number; w?: number; show?: number }> = ({ x = 40, y, w = 1000, show = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: 34, borderRadius: 10, background: C.primaryDark, color: '#e9f5f2', fontSize: 14, letterSpacing: '0.3em', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: show }}>
    TAHTA
  </div>
);
