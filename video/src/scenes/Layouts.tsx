import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Caption, Paper, ease } from '../components';
import { C } from '../theme';

type Desk = [number, number, number?]; // x, y, rotation

// Mini floor plans (desk centres in a 260×200 box, board on top).
const grid = (): Desk[] => Array.from({ length: 18 }, (_, i) => [30 + (i % 6) * 40, 60 + Math.floor(i / 6) * 46]);
const pairs = (): Desk[] => Array.from({ length: 18 }, (_, i) => {
  const c = i % 6, r = Math.floor(i / 6);
  return [24 + c * 36 + Math.floor(c / 2) * 18, 60 + r * 46];
});
const ushape = (): Desk[] => [
  ...[0, 1, 2, 3].map(i => [30, 64 + i * 34] as Desk),
  ...[0, 1, 2, 3, 4].map(i => [62 + i * 34, 170] as Desk),
  ...[0, 1, 2, 3].map(i => [230, 64 + i * 34] as Desk),
];
const clusters = (): Desk[] => [[60, 80], [96, 80], [60, 112], [96, 112], [164, 80], [200, 80], [164, 112], [200, 112], [60, 160], [96, 160], [164, 160], [200, 160]].map(([x, y]) => [x, y] as Desk);
const chevron = (): Desk[] => Array.from({ length: 12 }, (_, i) => {
  const side = i % 2, r = Math.floor(i / 4), k = Math.floor(i / 2) % 2;
  return [side ? 160 + k * 40 : 100 - k * 40, 66 + r * 48, side ? -20 : 20];
});

const LAYOUTS = [
  { tr: 'Düz Sıra', en: 'Rows', desks: grid() },
  { tr: 'İkili Sıra', en: 'Paired desks', desks: pairs() },
  { tr: 'U-Düzen', en: 'U-shape', desks: ushape() },
  { tr: 'Küme', en: 'Clusters', desks: clusters() },
  { tr: 'Chevron', en: 'Angled rows', desks: chevron() },
];

export const Layouts: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Paper>
      <Caption step="Any room" title="Five classroom layouts, same smart rules." x={120} y={130} width={1400} size={62} />
      <div style={{ position: 'absolute', left: 120, top: 400, display: 'flex', gap: 28 }}>
        {LAYOUTS.map((l, i) => {
          const a = ease(frame - 8 - i * 6, [0, 18], [0, 1]);
          const active = Math.floor(frame / 16) % 5 === i && frame > 40;
          return (
            <div
              key={l.tr}
              style={{
                width: 312, padding: 24, background: C.card, borderRadius: 22,
                border: `2px solid ${active ? C.primary : C.border}`,
                opacity: a, transform: `translateY(${(1 - a) * 30}px)`,
              }}
            >
              <svg width={264} height={210}>
                <rect x={40} y={8} width={184} height={14} rx={5} fill={C.primaryDark} />
                {l.desks.map(([x, y, rot = 0], k) => {
                  const d = ease(frame - 14 - i * 6 - k * 0.8, [0, 10], [0, 1]);
                  return (
                    <rect
                      key={k} x={x - 14} y={y - 12} width={28} height={24} rx={6}
                      fill={active ? C.primaryPale : C.muted} stroke={active ? C.primary : C.border} strokeWidth={2}
                      opacity={d} transform={`rotate(${rot} ${x} ${y})`}
                    />
                  );
                })}
              </svg>
              <div style={{ fontWeight: 900, fontSize: 26, marginTop: 14 }}>{l.tr}</div>
              <div style={{ fontWeight: 600, fontSize: 20, color: C.text3, marginTop: 2 }}>{l.en}</div>
            </div>
          );
        })}
      </div>
    </Paper>
  );
};
