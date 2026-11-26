import React from 'react';
import { Paper, Wordmark } from '../components';
import { C, FONT_DISPLAY } from '../theme';
import { Seat } from './ui';
import data from '../data.json';

const byId = Object.fromEntries(data.students.map(s => [s.id, s]));

/** 1920×1080 poster / YouTube thumbnail. */
export const Thumbnail: React.FC = () => (
  <Paper>
    <div style={{ position: 'absolute', left: 110, top: 120 }}><Wordmark size={56} /></div>
    <div style={{ position: 'absolute', left: 110, top: 300, width: 860, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 92, lineHeight: 1.02, letterSpacing: '-0.025em' }}>
      Over a quadrillion ways to seat one class.
    </div>
    <div style={{ position: 'absolute', left: 110, top: 640, fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: 64, color: C.accent }}>
      Find the right one.
    </div>
    <div style={{ position: 'absolute', left: 110, top: 860, fontSize: 34, fontWeight: 900, color: C.primary }}>aklisira.com</div>
    <div style={{ position: 'absolute', left: 1040, top: 220, width: 780, height: 640, background: '#fcfbf9', borderRadius: 32, border: `1px solid ${C.border}`, boxShadow: '0 24px 60px rgba(26,23,21,0.12)' }}>
      <div style={{ position: 'absolute', left: 40, top: 34, right: 40, height: 34, borderRadius: 10, background: C.primaryDark, color: '#e9f5f2', fontSize: 14, fontWeight: 900, letterSpacing: '0.3em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>TAHTA</div>
      {data.seating.optimized.map(p => (
        <Seat key={p.id} s={byId[p.id]} cx={40 + 58 + p.col * 120} cy={130 + 50 + p.row * 130} w={112} h={112} settled />
      ))}
      <div style={{ position: 'absolute', left: 40, bottom: 36, display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 96, fontWeight: 600, color: C.primary, lineHeight: 1 }}>%{data.seating.optimizedMetrics.overallScore}</span>
        <span style={{ fontSize: 26, fontWeight: 800, color: C.text3 }}>fit, from %{data.seating.naiveMetrics.overallScore} in list order</span>
      </div>
    </div>
  </Paper>
);
