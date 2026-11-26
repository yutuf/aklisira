import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Paper, Wordmark, ease } from '../components';
import { C, FONT_DISPLAY } from '../theme';

export const End: React.FC = () => {
  const frame = useCurrentFrame();
  const t = (d: number) => ease(frame - d, [0, 22], [0, 1]);
  const line = ease(frame - 34, [0, 26], [0, 1]);
  return (
    <Paper>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ opacity: t(0), transform: `translateY(${(1 - t(0)) * 20}px)` }}>
          <Wordmark size={110} />
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 46, color: C.text2, marginTop: 34, opacity: t(12), fontWeight: 400 }}>
          Less time arranging the room. More time teaching it.
        </div>
        <div style={{ marginTop: 70, opacity: t(26), display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 44, fontWeight: 900, color: C.primary, letterSpacing: '0.01em' }}>aklisira.com</div>
          <div style={{ height: 4, width: 300 * line, background: C.accent, borderRadius: 2, marginTop: 10 }} />
          <div style={{ fontSize: 22, fontWeight: 700, color: C.text3, marginTop: 22 }}>Free to start · No card needed · Runs in the browser</div>
        </div>
      </div>
    </Paper>
  );
};
