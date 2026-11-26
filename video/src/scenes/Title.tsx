import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Paper, Wordmark, ease, EASE_IN_OUT } from '../components';
import { C, FONT_DISPLAY, shadow } from '../theme';
import data from '../data.json';

// Picks up the tidy 3×6 grid the hook ended on, then the brand lands.
const GX = 1010, GY = 330, CW = 140, CH = 92, GAP = 14;
const NAMES = data.students.map(s => s.name).concat(['Berk', 'Ece', 'Mert']);

export const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const t = (d: number) => ease(frame - d, [0, 20], [0, 1]);
  return (
    <Paper>
      <AbsoluteFill>
        {NAMES.map((name, i) => {
          const fill = ease(frame - 6 - ((i % 6) + Math.floor(i / 6)) * 3, [0, 12], [0, 1], EASE_IN_OUT);
          return (
            <div
              key={i}
              style={{
                position: 'absolute', left: GX + (i % 6) * (CW + GAP), top: GY + Math.floor(i / 6) * (CH + GAP),
                width: CW, height: CH, borderRadius: 14, boxShadow: shadow,
                background: fill > 0.5 ? C.primary : '#fffdf9', border: `1.5px solid ${fill > 0.5 ? C.primary : C.border}`,
                color: fill > 0.5 ? '#fff' : C.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 24, transform: `scale(${1 - Math.sin(fill * Math.PI) * 0.06})`,
              }}
            >
              {name}
            </div>
          );
        })}
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 120, top: 360, opacity: t(4), transform: `translateY(${(1 - t(4)) * 20}px)` }}>
        <Wordmark size={84} />
      </div>
      <div
        style={{
          position: 'absolute', left: 124, top: 500, width: 860, fontFamily: FONT_DISPLAY, fontSize: 44, lineHeight: 1.2,
          color: C.text2, opacity: t(14), transform: `translateY(${(1 - t(14)) * 16}px)`, fontWeight: 400,
        }}
      >
        Seating plans, exam layouts, teams:
        <br />
        <span style={{ color: C.text, fontWeight: 600 }}>sorted in seconds.</span>
      </div>
    </Paper>
  );
};
