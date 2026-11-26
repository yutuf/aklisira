import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Sparkles, LayoutGrid } from 'lucide-react';
import { Paper, Pointer, ease, EASE_IN_OUT } from '../../components';
import { C, FONT_DISPLAY } from '../../theme';
import { Stage, useLayout, SKey } from '../layout';
import { Cap, Chrome, Note, Seat, Board, Watermark } from '../ui';
import { WEB } from '../timeline';
import data from '../../data.json';

const S = data.seating;
const byId = Object.fromEntries(data.students.map(s => [s.id, s]));
const byName = Object.fromEntries(data.students.map(s => [s.name, s.id]));
const opt = Object.fromEntries(S.optimized.map(p => [p.id, p]));
// students in optimized seat order (row-major) — slot k of every layout
const ORDERED = [...S.optimized].sort((a, b) => a.row * 6 + a.col - (b.row * 6 + b.col)).map(p => p.id);
const PERMS = '1,067,062,284,288,000';
const N = 1067062284288000;

// ── constraint pairs from the real demo profiles ──
const pairs: { a: string; b: string; kind: 'friend' | 'avoid' }[] = [];
const seen = new Set<string>();
data.students.forEach(s => {
  s.friends.forEach(f => { const k = [s.id, byName[f]].sort().join(); if (byName[f] && !seen.has(k)) { seen.add(k); pairs.push({ a: s.id, b: byName[f], kind: 'friend' }); } });
  s.avoid.forEach(f => { const k = [s.id, byName[f]].sort().join() + 'x'; if (byName[f] && !seen.has(k)) { seen.add(k); pairs.push({ a: s.id, b: byName[f], kind: 'avoid' }); } });
});

// ── layout slots (stage coords): centre, size, rotation, tag visibility ──
type Slot = { x: number; y: number; w: number; h: number; r: number; t: number };
const grid = (k: number): Slot => ({ x: 130 + (k % 6) * 164, y: 283 + Math.floor(k / 6) * 118, w: 150, h: 106, r: 0, t: 1 });
const pairsL = (k: number): Slot => { const c = k % 6; return { x: 136 + c * 148 + Math.floor(c / 2) * 34, y: 283 + Math.floor(k / 6) * 118, w: 138, h: 100, r: 0, t: 1 }; };
const uL = (k: number): Slot => {
  if (k < 4) return { x: 110, y: 270 + k * 86, w: 104, h: 74, r: 0, t: 0 };
  if (k < 8) return { x: 970, y: 270 + (k - 4) * 86, w: 104, h: 74, r: 0, t: 0 };
  return { x: 225 + (k - 8) * 105, y: 540, w: 96, h: 74, r: 0, t: 0 };
};
const clusterL = (k: number): Slot => {
  const g = Math.floor(k / 4), i = k % 4;
  const gx = [300, 780, 300, 780][g], gy = [330, 330, 500, 500][g];
  return { x: gx + (i % 2 ? 60 : -60), y: gy + (i < 2 ? -41 : 41), w: 112, h: 74, r: 0, t: 0 };
};
const chevronL = (k: number): Slot => {
  const i = k % 5, row = Math.floor(k / 5);
  return { x: 140 + i * 200, y: 290 + row * 118 + Math.abs(i - 2) * 16, w: 124, h: 82, r: i < 2 ? 14 : i > 2 ? -14 : 0, t: 0 };
};
const LAYOUTS = [
  { name: 'Düz Sıra', f: grid },
  { name: 'İkili Sıra', f: pairsL },
  { name: 'U-Düzen', f: uL },
  { name: 'Küme', f: clusterL },
  { name: 'Chevron', f: chevronL },
];
const MORPH = [WEB.layouts, WEB.layouts + 27, WEB.layouts + 54, WEB.layouts + 81]; // into layouts 1..4

const METRICS = [
  { key: 'academicBalance', tr: 'Akademik denge' },
  { key: 'socialCompatibility', tr: 'Sosyal uyum' },
  { key: 'behavioralHarmony', tr: 'Davranış uyumu' },
  { key: 'physicalAccessibility', tr: 'Fiziksel erişim' },
] as const;

const CX = 540, CY = 400, R = 330;

export const WebSolve: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const D = WEB.drop;

  const keys: SKey[] = L.V
    ? [{ f: 0, s: 1.25, fx: CX, fy: CY }, { f: D, s: 1.25, fx: CX, fy: CY }, { f: D + 40, s: 1, fx: CX, fy: CY }, { f: WEB.reveal0, s: 1, fx: CX, fy: CY }, { f: WEB.reveal1, s: 1, fx: 540, fy: 440 }]
    : [{ f: 0, s: 1.18, fx: CX, fy: CY }, { f: D, s: 1.18, fx: CX, fy: CY }, { f: D + 40, s: 1, fx: CX, fy: CY }, { f: WEB.reveal0, s: 1, fx: CX, fy: CY }, { f: WEB.reveal1, s: 1, fx: 540, fy: 440 }];

  const chrome = ease(frame, [WEB.reveal0, WEB.reveal1 - 10], [0, 1]);
  const board = ease(frame, [D + 34, D + 50], [0, 1]);
  const linesOut = ease(frame, [D + 4, D + 44], [1, 0]);
  const count = ease(frame, [18, 104], [0, 1], (t: number) => 1 - Math.pow(1 - t, 3));
  const flyScore = Math.round(interpolate(ease(frame, [D + 8, D + 56], [0, 1]), [0, 1], [S.naiveMetrics.overallScore, S.optimizedMetrics.overallScore]));
  const layoutIdx = MORPH.filter(m => frame >= m + 12).length;
  const metricT = ease(frame, [WEB.reveal0 + 10, WEB.reveal1 + 10], [0, 1]);

  // position of each student (stage coords)
  const pos = (id: string, k: number) => {
    const i = data.students.findIndex(s => s.id === id);
    const ang = (i / 15) * Math.PI * 2 - Math.PI / 2;
    const web: Slot = { x: CX + Math.cos(ang) * R, y: CY + Math.sin(ang) * R * 0.92, w: 128, h: 54, r: 0, t: 0 };
    const p = ease(frame, [D + 2 + k * 2, D + 32 + k * 2], [0, 1], EASE_IN_OUT);
    let cur: Slot = {
      x: interpolate(p, [0, 1], [web.x, grid(k).x]), y: interpolate(p, [0, 1], [web.y, grid(k).y]) - Math.sin(p * Math.PI) * 40,
      w: interpolate(p, [0, 1], [web.w, 150]), h: interpolate(p, [0, 1], [web.h, 106]), r: 0, t: ease(frame, [D + 34 + k * 2, D + 46 + k * 2], [0, 1]),
    };
    let lift = Math.sin(p * Math.PI);
    MORPH.forEach((m, j) => {
      const q = ease(frame, [m + k * 0.7, m + 14 + k * 0.7], [0, 1], EASE_IN_OUT);
      if (q <= 0) return;
      const a = j === 0 ? grid(k) : LAYOUTS[j].f(k);
      const b = LAYOUTS[j + 1].f(k);
      const from = j === 0 ? cur : a;
      cur = { x: interpolate(q, [0, 1], [from.x, b.x]), y: interpolate(q, [0, 1], [from.y, b.y]), w: interpolate(q, [0, 1], [from.w, b.w]), h: interpolate(q, [0, 1], [from.h, b.h]), r: interpolate(q, [0, 1], [from.r, b.r]), t: interpolate(q, [0, 1], [from.t, b.t]) };
      lift = Math.max(lift * (1 - q), Math.sin(q * Math.PI) * 0.6);
    });
    const appear = ease(frame - i * 1.5, [0, 10], [0, 1]);
    return { ...cur, lift, appear };
  };
  const positions = Object.fromEntries(ORDERED.map((id, k) => [id, pos(id, k)]));

  const [c1, c2, c3] = WEB.callouts;
  const ring = (id: string): string | null => {
    if (frame >= c1 && frame < c1 + 46 && id === 'd5') return C.accent;
    if (frame >= c2 && frame < c2 + 46 && id === 'd10') return C.brick;
    if (frame >= c2 + 6 && frame < c2 + 46 && (id === 'd1' || id === 'd8')) return C.text3;
    if (frame >= c3 && frame < c3 + 46 && ['d2', 'd15', 'd5'].includes(id)) return C.primary;
    if (frame < D && (id === 'd5' || id === 'd12')) return C.accent; // front-row needs in the web
    return null;
  };

  const btnY = L.V ? 600 : 760;
  const series = [S.naiveMetrics.overallScore, ...S.history];

  return (
    <Paper>
      {/* ── narration ── */}
      {frame < D && (
        <div style={{ position: 'absolute', left: L.cap.x, top: L.V ? 150 : 170, width: L.cap.w, opacity: ease(frame, [D - 8, D], [1, 0]) }}>
          <div style={{ fontWeight: 900, fontSize: L.V ? 26 : 21, letterSpacing: '0.14em', color: C.text3 }}>POSSIBLE SEATING PLANS</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: L.V ? 74 : 58, fontWeight: 600, color: C.text, marginTop: 14, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            {fmt(Math.floor(count * N))}
          </div>
          <div style={{ fontSize: L.V ? 34 : 28, fontWeight: 600, color: C.text2, marginTop: 14, opacity: ease(frame, [30, 44], [0, 1]) }}>
            for 15 students in 18 desks.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: L.V ? 30 : 24, marginTop: 22, fontSize: L.V ? 26 : 21, fontWeight: 800, color: C.text2, opacity: ease(frame, [56, 70], [0, 1]) }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 30, height: 5, background: C.primary, borderRadius: 3 }} />friends</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 30, height: 0, borderTop: `5px dashed ${C.brick}` }} />keep apart</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 20, height: 20, borderRadius: 6, border: `3.5px solid ${C.accent}` }} />front row</span>
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: L.V ? 72 : 64, fontWeight: 500, color: C.accent, marginTop: L.V ? 40 : 56, opacity: ease(frame, [104, 114], [0, 1]), transform: `translateY(${(1 - ease(frame, [104, 114], [0, 1])) * 16}px)` }}>
            Which one is right?
          </div>
        </div>
      )}
      {frame >= D - 18 && frame < D + 6 && (
        <div
          style={{
            position: 'absolute', left: L.cap.x, top: btnY, display: 'flex', alignItems: 'center', gap: 12, background: C.primary, color: '#fff',
            fontWeight: 900, fontSize: L.V ? 34 : 28, padding: L.V ? '24px 36px' : '20px 30px', borderRadius: 18,
            opacity: ease(frame, [D - 18, D - 10], [0, 1]) * ease(frame, [D, D + 6], [1, 0]),
            transform: `scale(${frame >= D - 2 && frame < D + 3 ? 0.95 : 1})`,
          }}
        >
          <Sparkles size={L.V ? 34 : 28} strokeWidth={2.2} /> Düzeni Optimize Et
        </div>
      )}
      {frame >= D && frame < WEB.reveal0 + 6 && (
        <div style={{ position: 'absolute', left: L.cap.x, top: L.V ? 170 : 300, width: L.cap.w, opacity: ease(frame, [WEB.reveal0 - 6, WEB.reveal0 + 4], [1, 0]) }}>
          <div style={{ fontWeight: 900, fontSize: L.V ? 26 : 21, letterSpacing: '0.14em', color: C.primary }}>FIT SCORE</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: L.V ? 220 : 200, lineHeight: 1, fontWeight: 600, color: flyScore >= 80 ? C.primary : C.accent, fontVariantNumeric: 'tabular-nums', marginTop: 8 }}>
            %{flyScore}
          </div>
          <div style={{ fontSize: L.V ? 34 : 28, fontWeight: 700, color: C.text2, marginTop: 10 }}>
            One click. 60 generations of a genetic optimizer.
          </div>
        </div>
      )}
      <Cap at={WEB.reveal0 + 6} out={WEB.layouts - 8} step="01 · Smart seating" title={<>Every rule, respected.</>}
        sub="Grades, behaviour, height, vision and friendships are weighed together, in about six seconds." />
      <Cap at={WEB.layouts} step="Any room" title={<>Five layouts, same rules.</>} sub="Rows, paired desks, U-shape, clusters and chevron." />

      {/* ── stage ── */}
      <Stage keys={keys}>
        <Chrome tab="classroom" show={chrome} />
        <div style={{ position: 'absolute', left: 40, top: 96, display: 'flex', alignItems: 'center', gap: 14, opacity: chrome }}>
          <div style={{ fontWeight: 900, fontSize: 28 }}>Sınıf Düzeni</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 17, fontWeight: 800, color: layoutIdx ? C.primaryDark : C.text2, background: layoutIdx ? C.primaryPale : C.muted, padding: '7px 14px', borderRadius: 999 }}>
            <LayoutGrid size={16} strokeWidth={2.2} /> {LAYOUTS[layoutIdx].name}
          </div>
        </div>
        <div style={{ position: 'absolute', right: 40, top: 92, opacity: chrome, display: 'flex', alignItems: 'center', gap: 8, background: C.primary, color: '#fff', fontWeight: 900, fontSize: 18, padding: '12px 18px', borderRadius: 14 }}>
          <Sparkles size={18} strokeWidth={2.2} /> Düzeni Optimize Et
        </div>
        <Board y={172} show={board} />

        {/* constraint web */}
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: linesOut }} width={1080} height={880}>
          {pairs.map((p, i) => {
            const A = positions[p.a], B = positions[p.b];
            const d = ease(frame - 14 - i * 5, [0, 16], [0, 1]);
            const x2 = A.x + (B.x - A.x) * d, y2 = A.y + (B.y - A.y) * d;
            return (
              <line key={i} x1={A.x} y1={A.y} x2={x2} y2={y2} strokeLinecap="round"
                stroke={p.kind === 'friend' ? C.primary : C.brick} strokeWidth={p.kind === 'friend' ? 4 : 3.5} strokeDasharray={p.kind === 'avoid' ? '10 9' : undefined} opacity={0.85} />
            );
          })}
        </svg>
        {ORDERED.map(id => {
          const p = positions[id];
          const settled = frame > WEB.flyEnd;
          return (
            <div key={id} style={{ opacity: p.appear }}>
              <Seat s={byId[id]} cx={p.x} cy={p.y} w={p.w} h={p.h} rot={p.r} tags={p.t} ring={ring(id)} settled={settled} lift={p.lift} />
            </div>
          );
        })}
        {/* empty desks in the grid */}
        {[15, 16, 17].map(k => {
          const g = grid(k);
          const o = ease(frame, [D + 30, D + 46], [0, 1]) * ease(frame, [MORPH[0], MORPH[0] + 8], [1, 0]);
          return <div key={k} style={{ position: 'absolute', left: g.x - 75, top: g.y - 53, width: 150, height: 106, borderRadius: 16, border: `2px dashed ${C.border}`, opacity: o }} />;
        })}

        {/* results strip */}
        <div style={{ position: 'absolute', left: 40, top: 620, width: 1000, height: 230, display: 'flex', gap: 20, opacity: chrome, transform: `translateY(${(1 - chrome) * 30}px)` }}>
          <div style={{ width: 290, background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 20, padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '0.08em', color: C.text3 }}>GENEL UYUM</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 100, fontWeight: 600, color: C.primary, lineHeight: 1.05, marginTop: 8 }}>%{S.optimizedMetrics.overallScore}</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.text3, marginTop: 4 }}>liste sırasıyla: %{S.naiveMetrics.overallScore}</div>
          </div>
          <div style={{ width: 330, background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 20, padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '0.08em', color: C.text3 }}>60 NESİL</div>
            <Spark values={series} t={metricT} />
          </div>
          <div style={{ flex: 1, background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 20, padding: '20px 24px' }}>
            {METRICS.map(m => {
              const v = Math.round(interpolate(metricT, [0, 1], [S.naiveMetrics[m.key], S.optimizedMetrics[m.key]]));
              return (
                <div key={m.key} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 800, color: C.text2 }}>
                    <span>{m.tr}</span><span style={{ color: C.text }}>%{v}</span>
                  </div>
                  <div style={{ height: 9, borderRadius: 5, background: C.muted, marginTop: 5 }}>
                    <div style={{ width: `${v}%`, height: 9, borderRadius: 5, background: v >= 75 ? C.primary : C.accent }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Note at={c1} out={c1 + 42} x={560} y={455} w={470} tx={grid(0).x + 40} ty={grid(0).y} from="left" color={C.accent}
          label="Vision need → front row" detail="Zeynep sits in the first row." />
        <Note at={c2} out={c2 + 42} x={560} y={455} w={470} tx={grid(1).x + 40} ty={grid(1).y + 20} from="left" color={C.brick}
          label="Kept apart" detail="Burak sits away from Ali and Ahmet." />
        <Note at={c3} out={c3 + 42} x={560} y={455} w={470} tx={grid(6).x + 40} ty={grid(6).y} from="left" color={C.primary}
          label="Friends nearby" detail="Elif sits beside Nil, behind Zeynep." />
      </Stage>

      {/* pointer presses the big button in the narration column */}
      <Pointer
        path={[
          { f: D - 30, x: L.V ? 700 : 760, y: L.V ? 900 : 1000 },
          { f: D - 4, x: L.cap.x + (L.V ? 300 : 240), y: btnY + (L.V ? 44 : 38) },
          { f: D + 20, x: L.cap.x + (L.V ? 320 : 260), y: btnY + (L.V ? 60 : 54) },
          { f: D + 40, x: L.V ? 1100 : 0, y: L.V ? 700 : 1100 },
        ]}
        clickAt={[D - 2]}
      />
      {frame >= WEB.reveal0 && <Watermark />}
    </Paper>
  );
};

const fmt = (n: number) => {
  const s = String(n);
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
void PERMS;
void opt;

const Spark: React.FC<{ values: number[]; t: number }> = ({ values, t }) => {
  const W = 282, H = 120, min = 35, max = 95;
  const upto = Math.max(1, Math.round(t * (values.length - 1)));
  const pts = values.slice(0, upto + 1).map((v, i) => [(i / (values.length - 1)) * W, H - ((v - min) / (max - min)) * H] as const);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  return (
    <svg width={W} height={H + 10} style={{ marginTop: 18, overflow: 'visible' }}>
      {[0.25, 0.5, 0.75].map(g => <line key={g} x1={0} x2={W} y1={H * g} y2={H * g} stroke={C.borderLight} />)}
      <path d={`${d} L${last[0]} ${H} L0 ${H} Z`} fill={C.primaryPale} opacity={0.75} />
      <path d={d} fill="none" stroke={C.primary} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r={6.5} fill={C.card} stroke={C.primary} strokeWidth={3} />
    </svg>
  );
};
