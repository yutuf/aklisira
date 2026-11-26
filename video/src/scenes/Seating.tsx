import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Eye, Ear, Sparkles, LayoutGrid } from 'lucide-react';
import { Caption, Paper, Pointer, Callout, Camera, LevelMeter, BehaviorTag, ease, EASE_IN_OUT } from '../components';
import { AppFrame, abs, PrimaryButton } from '../AppFrame';
import { C, FONT_DISPLAY } from '../theme';
import data from '../data.json';

const S = data.seating;
const byId = Object.fromEntries(data.students.map(s => [s.id, s]));
const naivePos = Object.fromEntries(S.naive.map(p => [p.id, p]));
const optPos = Object.fromEntries(S.optimized.map(p => [p.id, p]));

// layout inside the frame's content area
const SX = 55, SY = 160, SW = 150, SH = 106, GX = 164, GY = 118;
export const seatCenter = (r: number, c: number) => abs(SX + c * GX + SW / 2, SY + r * GY + SH / 2);

const CLICK = 50, OPT0 = 54, OPT1 = 174;
const C1 = 206, C2 = 252, C3 = 298;

const METRICS: { key: keyof typeof S.optimizedMetrics; tr: string }[] = [
  { key: 'academicBalance', tr: 'Akademik denge' },
  { key: 'socialCompatibility', tr: 'Sosyal uyum' },
  { key: 'behavioralHarmony', tr: 'Davranış uyumu' },
  { key: 'physicalAccessibility', tr: 'Fiziksel erişim' },
];

const ORDER = ['d5', 'd12', 'd10', 'd1', 'd8', 'd2', 'd15', 'd3', 'd6', 'd9', 'd11', 'd4', 'd7', 'd13', 'd14'];

export const Seating: React.FC = () => {
  const frame = useCurrentFrame();
  const gen = Math.round(interpolate(frame, [OPT0, OPT1], [0, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const running = frame >= OPT0 && frame < OPT1;
  const series = [S.naiveMetrics.overallScore, ...S.history];
  const liveScore = frame < OPT0 ? S.naiveMetrics.overallScore
    : gen === 0 ? Math.round(interpolate(frame, [OPT0, OPT0 + 6], [S.naiveMetrics.overallScore, S.history[0]], { extrapolateRight: 'clamp' }))
    : S.history[gen];
  const metricT = ease(frame, [OPT1, OPT1 + 26], [0, 1]);
  const captionOut = ease(frame, [C1 - 18, C1 - 4], [1, 0]);

  const ring = (id: string): string | null => {
    if (frame >= C1 && frame < C1 + 52 && id === 'd5') return C.accent;
    if (frame >= C2 && frame < C2 + 52 && ['d10'].includes(id)) return C.brick;
    if (frame >= C2 + 10 && frame < C2 + 52 && ['d1', 'd8'].includes(id)) return C.text3;
    if (frame >= C3 && ['d2', 'd15', 'd5'].includes(id)) return C.primary;
    return null;
  };

  const btn = abs(902, 46);
  const z = seatCenter(0, 0), bu = seatCenter(0, 1), el = seatCenter(1, 0);

  return (
    <Paper>
      <div style={{ opacity: captionOut }}>
        <Caption
          step="02 · Smart seating"
          title={<>One click.<br />A seating plan that works.</>}
          sub="A genetic optimizer tests thousands of arrangements, weighing grades, behaviour, height, vision and friendships."
        />
      </div>
      <Camera keys={[{ f: 0, s: 1, x: 1280, y: 480 }, { f: OPT0, s: 1, x: 1280, y: 480 }, { f: OPT1, s: 1.06, x: 1280, y: 470 }, { f: C1 - 8, s: 1, x: 1280, y: 480 }]}>
        <AppFrame tab="classroom">
          {/* header */}
          <div style={{ position: 'absolute', left: 40, top: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontWeight: 900, fontSize: 26 }}>Sınıf Düzeni</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, fontWeight: 800, color: C.text2, background: C.muted, padding: '6px 12px', borderRadius: 999 }}>
              <LayoutGrid size={15} strokeWidth={2.2} /> Düz Sıra · 3 × 6
            </div>
          </div>
          <PrimaryButton
            label={running ? `Nesil ${gen} / 60` : 'Düzeni Optimize Et'}
            icon={<Sparkles size={19} strokeWidth={2.2} />}
            pressed={frame >= CLICK && frame < CLICK + 6 ? 1 : 0}
            busy={running}
            style={{ position: 'absolute', left: 760, top: 18, width: 284 }}
          />
          {/* board */}
          <div
            style={{
              position: 'absolute', left: 40, top: 100, width: 1000, height: 36, borderRadius: 10,
              background: C.primaryDark, color: '#e9f5f2', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, letterSpacing: '0.3em', fontWeight: 800,
            }}
          >
            TAHTA
          </div>
          {/* seats */}
          {ORDER.map((id, k) => {
            const s = byId[id];
            const a = naivePos[id], b = optPos[id];
            const st = OPT0 + 8 + k * 5;
            const p = ease(frame, [st, st + 34], [0, 1], EASE_IN_OUT);
            const x = SX + interpolate(p, [0, 1], [a.col, b.col]) * GX;
            const y = SY + interpolate(p, [0, 1], [a.row, b.row]) * GY - Math.sin(p * Math.PI) * 26;
            const lift = Math.sin(p * Math.PI);
            const r = ring(id);
            const settled = p >= 1 && frame >= OPT0;
            return (
              <div
                key={id}
                style={{
                  position: 'absolute', left: x, top: y, width: SW, height: SH, borderRadius: 16,
                  background: settled ? '#f1fbf9' : C.card,
                  border: `2px solid ${r ?? (settled ? C.primaryLight : C.border)}`,
                  boxShadow: r ? `0 0 0 5px ${r}33` : lift > 0.05 ? `0 ${10 * lift}px ${24 * lift}px rgba(26,23,21,${0.16 * lift})` : 'none',
                  zIndex: lift > 0.05 ? 10 : 1, transform: `scale(${1 + lift * 0.05})`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 7,
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 22, color: C.text }}>{s.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <BehaviorTag type={s.behaviorType} size={12} />
                  <LevelMeter level={s.academicLevel} size={5} />
                </div>
                {(s.vision || s.hearing) && (
                  <div style={{ position: 'absolute', top: 8, right: 10, display: 'flex', gap: 4 }}>
                    {s.vision && <Eye size={16} strokeWidth={2.4} color={C.accent} />}
                    {s.hearing && <Ear size={16} strokeWidth={2.4} color={C.accent} />}
                  </div>
                )}
              </div>
            );
          })}
          {/* empty seats for the remaining slots */}
          {Array.from({ length: S.rows * S.cols }).map((_, i) => {
            const r = Math.floor(i / S.cols), c = i % S.cols;
            const taken = S.optimized.some(p => p.row === r && p.col === c) && frame >= OPT0 + 90;
            const takenNaive = S.naive.some(p => p.row === r && p.col === c) && frame < OPT0;
            if (taken || takenNaive) return null;
            return (
              <div
                key={`e${i}`}
                style={{
                  position: 'absolute', left: SX + c * GX, top: SY + r * GY, width: SW, height: SH, borderRadius: 16,
                  border: `2px dashed ${C.border}`, zIndex: 0,
                }}
              />
            );
          })}
          {/* stats */}
          <div style={{ position: 'absolute', left: 40, top: 540, width: 290, height: 250, background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 20, padding: 26 }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.08em', color: C.text3 }}>GENEL UYUM</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 104, fontWeight: 600, color: liveScore >= 80 ? C.primary : C.accent, lineHeight: 1.05, marginTop: 10, fontVariantNumeric: 'tabular-nums' }}>
              %{liveScore}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text3, marginTop: 6 }}>
              {frame < OPT0 ? 'Liste sırasıyla oturma' : running ? 'Optimizasyon sürüyor' : `60 nesil · liste sırası: %${S.naiveMetrics.overallScore}`}
            </div>
          </div>
          <div style={{ position: 'absolute', left: 350, top: 540, width: 340, height: 250, background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 20, padding: 26 }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.08em', color: C.text3 }}>OPTİMİZASYON İLERLEMESİ</div>
            <Sparkline values={series} upto={frame < OPT0 ? 0 : gen + 1} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: C.text3, fontWeight: 700 }}>
              <span>Başlangıç</span><span>Nesil 60</span>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 710, top: 540, width: 330, height: 250, background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 20, padding: '22px 26px' }}>
            {METRICS.map(m => {
              const v = Math.round(interpolate(metricT, [0, 1], [S.naiveMetrics[m.key], S.optimizedMetrics[m.key]]));
              return (
                <div key={m.key} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: C.text2 }}>
                    <span>{m.tr}</span><span style={{ color: C.text, fontVariantNumeric: 'tabular-nums' }}>%{v}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: C.muted, marginTop: 6 }}>
                    <div style={{ width: `${v}%`, height: 8, borderRadius: 4, background: v >= 75 ? C.primary : C.accent }} />
                  </div>
                </div>
              );
            })}
          </div>
        </AppFrame>
      </Camera>

      <Pointer
        path={[
          { f: 8, x: 1100, y: 900 },
          { f: CLICK - 2, x: btn.x, y: btn.y },
          { f: CLICK + 24, x: btn.x + 10, y: btn.y + 14 },
          { f: CLICK + 44, x: 1900, y: 1060 },
        ]}
        clickAt={[CLICK]}
      />

      <Callout x={700} y={330} tx={z.x - 60} ty={z.y} delay={C1} out={C1 + 44} label="Vision need: front row" detail="Zeynep needs to sit at the front, so she does." align="right" />
      <Callout x={700} y={430} tx={bu.x} ty={bu.y + 30} delay={C2} out={C2 + 44} color={C.brick} label="Kept apart" detail="Burak sits well away from Ali and Ahmet, as the teacher asked." align="right" />
      <Callout x={700} y={540} tx={el.x - 60} ty={el.y} delay={C3} color={C.primary} label="Friends stay close" detail="Elif sits beside Nil and behind Zeynep." align="right" />
    </Paper>
  );
};

const Sparkline: React.FC<{ values: number[]; upto: number }> = ({ values, upto }) => {
  const W = 288, H = 130, min = 35, max = 95;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * W, H - ((v - min) / (max - min)) * H] as const);
  const shown = pts.slice(0, Math.max(1, upto + 1));
  const d = shown.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const last = shown[shown.length - 1];
  return (
    <svg width={W} height={H + 20} style={{ marginTop: 14, overflow: 'visible' }}>
      {[0.25, 0.5, 0.75].map(g => <line key={g} x1={0} x2={W} y1={H * g} y2={H * g} stroke={C.borderLight} strokeWidth={1} />)}
      <path d={`${d} L${last[0]} ${H} L0 ${H} Z`} fill={C.primaryPale} opacity={0.7} />
      <path d={d} fill="none" stroke={C.primary} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r={6} fill={C.card} stroke={C.primary} strokeWidth={3} />
    </svg>
  );
};
