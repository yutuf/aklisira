import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Brain } from 'lucide-react';
import { C, FONT_BODY, FONT_DISPLAY, shadow, BEHAVIOR, LEVEL } from './theme';

export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

export const ease = (f: number, input: [number, number], output: [number, number], easing = EASE) =>
  interpolate(f, input, output, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

export const usePop = (delay: number, config = { damping: 18, stiffness: 140, mass: 0.8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

/** Warm paper background with a faint ruled-grid, like a teacher's planning pad. */
export const Paper: React.FC<{ children?: React.ReactNode; tone?: 'paper' | 'deep' }> = ({ children, tone = 'paper' }) => (
  <AbsoluteFill
    style={{
      background: tone === 'deep' ? C.primaryDark : C.bg,
      fontFamily: FONT_BODY,
      color: tone === 'deep' ? '#f7f5f2' : C.text,
    }}
  >
    {tone === 'paper' && (
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.borderLight} 1px, transparent 1px), linear-gradient(90deg, ${C.borderLight} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          opacity: 0.45,
        }}
      />
    )}
    {children}
  </AbsoluteFill>
);

/** Eyebrow + Fraunces headline + Nunito line — the English narration layer. */
export const Caption: React.FC<{
  step?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  delay?: number;
  x?: number;
  y?: number;
  width?: number;
  size?: number;
}> = ({ step, title, sub, delay = 0, x = 120, y = 120, width = 560, size = 64 }) => {
  const frame = useCurrentFrame();
  const t = (d: number) => ease(frame - delay - d, [0, 18], [0, 1]);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width }}>
      {step && (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 14, fontWeight: 800, fontSize: 20,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: C.primary,
            opacity: t(0), transform: `translateY(${(1 - t(0)) * 12}px)`,
          }}
        >
          <span style={{ width: 36, height: 2, background: C.accent, display: 'inline-block' }} />
          {step}
        </div>
      )}
      <div
        style={{
          fontFamily: FONT_DISPLAY, fontWeight: 560, fontSize: size, lineHeight: 1.06,
          letterSpacing: '-0.015em', marginTop: 22, color: C.text,
          opacity: t(4), transform: `translateY(${(1 - t(4)) * 18}px)`,
          fontVariationSettings: '"opsz" 144',
        }}
      >
        {title}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 27, lineHeight: 1.45, color: C.text2, marginTop: 26, fontWeight: 500,
            opacity: t(10), transform: `translateY(${(1 - t(10)) * 14}px)`,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};

export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div
    style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 22, boxShadow: shadow, ...style,
    }}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<{ icon?: React.ReactNode; title: string; right?: React.ReactNode }> = ({ icon, title, right }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 21, color: C.text }}>
      {icon}
      {title}
    </div>
    {right}
  </div>
);

/** Five-step level meter (academic level), replaces the app's arrow glyphs. */
export const LevelMeter: React.FC<{ level: string; size?: number }> = ({ level, size = 7 }) => {
  const n = LEVEL[level]?.n ?? 3;
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          style={{
            width: size, height: size * (0.9 + i * 0.32), borderRadius: 2,
            background: i <= n ? C.primary : C.border,
          }}
        />
      ))}
    </div>
  );
};

export const BehaviorTag: React.FC<{ type: string; size?: number }> = ({ type, size = 14 }) => {
  const b = BEHAVIOR[type];
  return (
    <span
      style={{
        fontSize: size, fontWeight: 800, color: b.color, background: `${b.color}14`,
        border: `1px solid ${b.color}33`, padding: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap',
      }}
    >
      {b.tr}
    </span>
  );
};

/** A label with a hairline leader pointing at (tx, ty). */
export const Callout: React.FC<{
  x: number; y: number; tx: number; ty: number; delay: number; label: string; detail?: string;
  color?: string; align?: 'left' | 'right'; out?: number;
}> = ({ x, y, tx, ty, delay, label, detail, color = C.accent, align = 'left', out }) => {
  const frame = useCurrentFrame();
  const lineT = ease(frame - delay, [0, 14], [0, 1]);
  const boxT = ease(frame - delay - 8, [0, 14], [0, 1]);
  const fadeOut = out !== undefined ? ease(frame - out, [0, 10], [1, 0]) : 1;
  const dx = tx - x, dy = ty - y;
  const len = Math.hypot(dx, dy);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: fadeOut, pointerEvents: 'none' }}>
      <svg style={{ position: 'absolute', inset: 0, overflow: 'visible' }} width="100%" height="100%">
        <line
          x1={x} y1={y} x2={x + dx * lineT} y2={y + dy * lineT}
          stroke={color} strokeWidth={2.5} strokeDasharray={`${len}`} strokeLinecap="round"
        />
        <circle cx={tx} cy={ty} r={9 * lineT} fill="none" stroke={color} strokeWidth={2.5} />
        <circle cx={tx} cy={ty} r={3.5 * lineT} fill={color} />
      </svg>
      <div
        style={{
          position: 'absolute', top: y, left: align === 'left' ? x : undefined,
          right: align === 'right' ? 1920 - x : undefined,
          transform: `translate(${align === 'left' ? 0 : 0}px, -50%) translateY(${(1 - boxT) * 10}px)`,
          opacity: boxT, background: C.text, color: '#fff', padding: '16px 22px', borderRadius: 14,
          boxShadow: shadow, maxWidth: 430,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 26 }}>{label}</div>
        {detail && <div style={{ fontSize: 20, opacity: 0.8, marginTop: 4, lineHeight: 1.35, fontWeight: 500 }}>{detail}</div>}
      </div>
    </div>
  );
};

/** Simple camera: keyframed scale + focal point, eased between keys. */
export type CamKey = { f: number; s: number; x: number; y: number };
export const Camera: React.FC<{ keys: CamKey[]; children: React.ReactNode }> = ({ keys, children }) => {
  const frame = useCurrentFrame();
  const fs = keys.map(k => k.f);
  const opt = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: EASE_IN_OUT };
  const pick = (sel: (k: CamKey) => number) => {
    if (keys.length === 1) return sel(keys[0]);
    // piecewise so each segment gets its own ease
    for (let i = 0; i < keys.length - 1; i++) {
      if (frame <= fs[i + 1]) return interpolate(frame, [fs[i], fs[i + 1]], [sel(keys[i]), sel(keys[i + 1])], opt);
    }
    return sel(keys[keys.length - 1]);
  };
  const s = pick(k => k.s), x = pick(k => k.x), y = pick(k => k.y);
  // Focal point (x,y) in 1920x1080 space is moved to frame centre when s>1.
  const tx = (960 - x) * (s - 1) / s, ty = (540 - y) * (s - 1) / s;
  return (
    <AbsoluteFill style={{ transform: `scale(${s}) translate(${tx}px, ${ty}px)`, transformOrigin: '960px 540px' }}>
      {children}
    </AbsoluteFill>
  );
};

/** Pointer used to "press" buttons. */
export const Pointer: React.FC<{ path: { f: number; x: number; y: number }[]; clickAt?: number[] }> = ({ path, clickAt = [] }) => {
  const frame = useCurrentFrame();
  const fs = path.map(p => p.f);
  const opt = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: EASE_IN_OUT };
  const x = interpolate(frame, fs, path.map(p => p.x), opt);
  const y = interpolate(frame, fs, path.map(p => p.y), opt);
  const press = clickAt.reduce((m, c) => Math.max(m, frame >= c && frame < c + 8 ? 1 - Math.abs(frame - c - 4) / 4 : 0), 0);
  const appear = ease(frame - fs[0], [0, 10], [0, 1]);
  const ring = clickAt.map(c => (frame >= c && frame < c + 18 ? (frame - c) / 18 : -1)).find(v => v >= 0);
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: appear, pointerEvents: 'none', zIndex: 50 }}>
      {ring !== undefined && (
        <div
          style={{
            position: 'absolute', left: -28 * (0.4 + ring), top: -28 * (0.4 + ring),
            width: 56 * (0.4 + ring), height: 56 * (0.4 + ring), borderRadius: '50%',
            border: `3px solid ${C.accent}`, opacity: 1 - ring,
          }}
        />
      )}
      <svg width="34" height="40" viewBox="0 0 34 40" style={{ transform: `scale(${1 - press * 0.15})`, transformOrigin: '0 0' }}>
        <path d="M3 2 L3 31 L11 24 L16.5 37 L22 34.5 L16.5 22 L27 22 Z" fill={C.text} stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const Wordmark: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = C.primary }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.3 }}>
    <Brain size={size} strokeWidth={1.75} color={color} />
    <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: size * 1.05, color, letterSpacing: '-0.01em' }}>AklıSıra</span>
  </div>
);
