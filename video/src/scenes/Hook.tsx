import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { Clock } from 'lucide-react';
import { Caption, Paper, ease, EASE_IN_OUT } from '../components';
import { C, FONT_DISPLAY, shadow } from '../theme';
import data from '../data.json';

const NAMES = data.students.map(s => s.name).concat(['Berk', 'Ece', 'Mert']);

// Final tidy grid the cards snap into (sets up the title scene).
const GX = 1010, GY = 330, CW = 140, CH = 92, GAP = 14;

const TASKS = [
  { label: 'Seating plan, 9-A', mins: 50, at: 40 },
  { label: 'Exam layout, 3 classes in 2 rooms', mins: 75, at: 70 },
  { label: 'Group-work teams', mins: 30, at: 100 },
];

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const snap = ease(frame, [150, 190], [0, 1], EASE_IN_OUT);
  const listOut = ease(frame, [140, 160], [1, 0]);
  const total = TASKS.reduce((m, t) => m + ease(frame, [t.at, t.at + 24], [0, t.mins]), 0);
  const h = Math.floor(total / 60), m = Math.round(total % 60);

  return (
    <Paper>
      <div style={{ opacity: listOut }}>
        <Caption
          step="Every term"
          title={<>Hours of planning,<br />done by hand.</>}
          size={76}
          y={150}
          width={720}
        />
        <div style={{ position: 'absolute', left: 120, top: 520, width: 640 }}>
          {TASKS.map((t, i) => {
            const a = ease(frame - t.at, [0, 16], [0, 1]);
            return (
              <div
                key={i}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  padding: '18px 0', borderBottom: `1.5px dashed ${C.border}`, opacity: a,
                  transform: `translateX(${(1 - a) * -20}px)`, fontSize: 30, fontWeight: 600,
                }}
              >
                <span>{t.label}</span>
                <span style={{ color: C.text3, fontWeight: 700, fontSize: 26 }}>
                  {t.mins >= 60 ? `${Math.floor(t.mins / 60)} h ${t.mins % 60} min` : `${t.mins} min`}
                </span>
              </div>
            );
          })}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 14, marginTop: 30, opacity: ease(frame - 40, [0, 12], [0, 1]),
            }}
          >
            <Clock size={34} color={C.accent} strokeWidth={2} />
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 48, fontWeight: 600, color: C.accent, fontVariantNumeric: 'tabular-nums' }}>
              {h} h {String(m).padStart(2, '0')} min
            </span>
          </div>
        </div>
      </div>

      {/* scattered name cards, nudged around like a teacher shuffling slips */}
      <AbsoluteFill>
        {NAMES.map((name, i) => {
          const sx = 1000 + random(`x${i}`) * 720;
          const sy = 140 + random(`y${i}`) * 760;
          const rot = (random(`r${i}`) - 0.5) * 40;
          // a few cards get "moved" during the messy phase
          const wob = Math.sin((frame + i * 13) / 22) * 10 * (1 - snap);
          const gx = GX + (i % 6) * (CW + GAP);
          const gy = GY + Math.floor(i / 6) * (CH + GAP);
          const delayed = ease(frame, [150 + (i % 6) * 2, 186 + (i % 6) * 2], [0, 1], EASE_IN_OUT);
          const x = interpolate(delayed, [0, 1], [sx + wob, gx]);
          const y = interpolate(delayed, [0, 1], [sy - wob * 0.6, gy]);
          const r = interpolate(delayed, [0, 1], [rot, 0]);
          const enter = ease(frame - i * 2, [0, 14], [0, 1]);
          const crossed = i % 5 === 2 && frame < 150;
          return (
            <div
              key={i}
              style={{
                position: 'absolute', left: x, top: y, width: CW, height: CH, borderRadius: 14,
                background: '#fffdf9', border: `1.5px solid ${C.border}`, boxShadow: shadow,
                transform: `rotate(${r}deg) scale(${0.85 + enter * 0.15})`, opacity: enter,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 24, color: C.text,
              }}
            >
              {name}
              {crossed && (
                <svg style={{ position: 'absolute', inset: 0 }} width={CW} height={CH}>
                  <path
                    d={`M18 ${CH - 22} L${CW - 18} 22`}
                    stroke={C.danger} strokeWidth={3.5} strokeLinecap="round" fill="none"
                    strokeDasharray="140" strokeDashoffset={interpolate(frame, [60 + i * 3, 80 + i * 3], [140, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
                  />
                </svg>
              )}
            </div>
          );
        })}
      </AbsoluteFill>
    </Paper>
  );
};
