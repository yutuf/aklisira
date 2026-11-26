import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Paper, ease, usePop } from '../../components';
import { C, FONT_DISPLAY } from '../../theme';
import { useLayout } from '../layout';

type Part = string | { n: string; c: string };
const LINES: { at: number; parts: Part[] }[] = [
  { at: 4, parts: [{ n: 'Burak', c: C.brick }, ' can’t sit near ', { n: 'Ali', c: C.brick }, '.'] },
  { at: 40, parts: [{ n: 'Zeynep', c: C.accent }, ' needs the front row.'] },
  { at: 76, parts: [{ n: 'Elif', c: C.primary }, ' works best beside ', { n: 'Nil', c: C.primary }, '.'] },
  { at: 108, parts: [{ n: 'Ahmet', c: C.brick }, ' and ', { n: 'Burak', c: C.brick }, '? Keep them apart.'] },
];

const Name: React.FC<{ n: string; c: string; at: number; size: number }> = ({ n, c, at, size }) => {
  const p = usePop(at + 3, { damping: 12, stiffness: 180, mass: 0.6 });
  return (
    <span
      style={{
        display: 'inline-block', padding: `0 ${size * 0.16}px`, borderRadius: size * 0.16,
        background: `${c}18`, boxShadow: `inset 0 -${size * 0.08}px 0 ${c}`, color: C.text, transform: `scale(${0.85 + 0.15 * p})`,
      }}
    >
      {n}
    </span>
  );
};

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const size = L.V ? 74 : 84;
  const lineH = L.V ? 2.45 * size : 1.32 * size;
  const top = L.V ? 330 : 220;
  const last = LINES.filter(l => frame >= l.at).length - 1;
  return (
    <Paper>
      <div style={{ position: 'absolute', left: L.V ? 72 : 150, top: 120, fontWeight: 900, fontSize: L.V ? 26 : 22, letterSpacing: '0.16em', color: C.text3, opacity: ease(frame, [0, 10], [0, 1]) }}>
        MONDAY, 08:10 · CLASS 9-A
      </div>
      {LINES.map((l, i) => {
        const a = ease(frame - l.at, [0, 10], [0, 1]);
        const dim = i < last ? 0.28 : 1;
        if (frame < l.at) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: L.V ? 72 : 150, top: top + i * lineH, width: L.V ? 936 : 1600,
              fontFamily: FONT_DISPLAY, fontSize: size, fontWeight: 560, lineHeight: 1.18, letterSpacing: '-0.02em',
              opacity: a * dim, transform: `translateY(${(1 - a) * 30}px)`, color: C.text,
            }}
          >
            {l.parts.map((p, k) => (typeof p === 'string' ? <span key={k}>{p}</span> : <Name key={k} n={p.n} c={p.c} at={l.at} size={size} />))}
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute', left: L.V ? 72 : 150, top: L.V ? 1500 : 820, fontSize: L.V ? 40 : 36, fontWeight: 800, color: C.accent,
          opacity: ease(frame - 126, [0, 8], [0, 1]),
        }}
      >
        Four rules. Fifteen students. Every single term.
      </div>
    </Paper>
  );
};
