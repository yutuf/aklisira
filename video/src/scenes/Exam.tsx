import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Shuffle, School, DoorOpen, Check } from 'lucide-react';
import { Caption, Paper, Pointer, Callout, Camera, ease } from '../components';
import { AppFrame, abs, PrimaryButton } from '../AppFrame';
import { C, FONT_DISPLAY } from '../theme';
import data from '../data.json';

const E = data.exam;
export const CLASS_COLOR: Record<string, string> = { '9-B': C.primary, '10-A': C.accent, '10-B': C.indigo };

const GX0 = 342, GY0 = 126, W = 108, H = 110, DX = 119, DY = 122;
const CLICK = 44, FILL = 50, VERS = 150, FOCUS = 196;
const short = (n: string) => { const [a, b] = n.split(' '); return `${a} ${b ? b[0] + '.' : ''}`; };

export const Exam: React.FC = () => {
  const frame = useCurrentFrame();
  const center = abs(GX0 + 2 * DX + W / 2, GY0 + 2 * DY + H / 2);
  const btn = abs(176, 668);
  const isNeighbour = (r: number, c: number) => Math.abs(r - 2) <= 1 && Math.abs(c - 2) <= 1;
  const focusOn = frame >= FOCUS + 10;
  const captionOut = ease(frame, [FOCUS - 6, FOCUS + 8], [1, 0]);

  return (
    <Paper>
      <div style={{ opacity: captionOut }}>
        <Caption
          step="03 · Exam seating"
          title={<>Kelebek exam seating, ready in seconds.</>}
          sub="Mix two or more classes across exam rooms. Neighbours get different booklet versions: A, B, C and D."
        />
      </div>
      <Camera keys={[{ f: 0, s: 1, x: center.x, y: center.y }, { f: FOCUS, s: 1, x: center.x, y: center.y }, { f: FOCUS + 30, s: 1.32, x: center.x, y: center.y }]}>
        <AppFrame tab="exam">
          {/* left column */}
          <div style={{ position: 'absolute', left: 36, top: 20, width: 280 }}>
            <Panel title="Sınıflar" icon={<School size={18} strokeWidth={2.2} />}>
              {E.classes.map((c, i) => {
                const a = ease(frame - 4 - i * 5, [0, 12], [0, 1]);
                return (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', opacity: a, fontSize: 18, fontWeight: 800 }}>
                    <span style={{ width: 14, height: 14, borderRadius: 4, background: CLASS_COLOR[c.name] }} />
                    <span style={{ flex: 1 }}>{c.name}</span>
                    <span style={{ color: C.text3, fontWeight: 700, fontSize: 15 }}>{c.count} öğrenci</span>
                  </div>
                );
              })}
            </Panel>
            <Panel title="Salonlar" icon={<DoorOpen size={18} strokeWidth={2.2} />} style={{ marginTop: 16 }}>
              {E.rooms.map(r => (
                <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: 17, fontWeight: 800 }}>
                  <span>{r.name}</span>
                  <span style={{ color: C.text3, fontWeight: 700, fontSize: 15 }}>{r.rows} × {r.cols} · {r.rows * r.cols} koltuk</span>
                </div>
              ))}
            </Panel>
            <Panel title="Sınav tipi" style={{ marginTop: 16 }}>
              {['Kelebek (A, B, C, D)', 'Sütun A / B', 'Satır A / B'].map((l, i) => (
                <div
                  key={l}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', marginTop: i ? 6 : 0, borderRadius: 10,
                    fontSize: 16, fontWeight: 800, color: i === 0 ? C.primaryDark : C.text3,
                    background: i === 0 ? C.primaryPale : 'transparent', border: `1.5px solid ${i === 0 ? C.primary : C.borderLight}`,
                  }}
                >
                  {i === 0 && <Check size={16} strokeWidth={3} />} {l}
                </div>
              ))}
            </Panel>
            <PrimaryButton
              label="Kelebek Düzeni Oluştur" icon={<Shuffle size={19} strokeWidth={2.2} />}
              pressed={frame >= CLICK && frame < CLICK + 6 ? 1 : 0}
              style={{ marginTop: 18, fontSize: 18 }}
            />
          </div>

          {/* right: room grid */}
          <div style={{ position: 'absolute', left: GX0, top: 20, display: 'flex', gap: 8 }}>
            {E.rooms.map((r, i) => (
              <div key={r.name} style={{ padding: '8px 18px', borderRadius: 10, fontSize: 16, fontWeight: 800, background: i === 0 ? C.text : C.muted, color: i === 0 ? '#fff' : C.text2 }}>
                {r.name}
              </div>
            ))}
            <div style={{ padding: '8px 4px', fontSize: 15, fontWeight: 700, color: C.text3 }}>60 öğrenci · 3 sınıf · 2 salon</div>
          </div>
          <div
            style={{
              position: 'absolute', left: GX0, top: 76, width: 6 * DX - (DX - W), height: 30, borderRadius: 8,
              background: C.primaryDark, color: '#e9f5f2', fontSize: 13, letterSpacing: '0.3em', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            TAHTA
          </div>
          {E.room1.map(seat => {
            const { row: r, col: c } = seat;
            const a = ease(frame - FILL - (r + c) * 5, [0, 14], [0, 1]);
            const v = ease(frame - VERS - (r * 6 + c) * 1.2, [0, 10], [0, 1]);
            const dim = focusOn && !isNeighbour(r, c) ? 0.35 : 1;
            const isCenter = r === 2 && c === 2;
            const hl = focusOn && isNeighbour(r, c);
            const col = CLASS_COLOR[seat.className];
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  position: 'absolute', left: GX0 + c * DX, top: GY0 + r * DY, width: W, height: H, borderRadius: 14,
                  background: C.card, border: `2px solid ${hl ? (isCenter ? C.text : C.border) : C.border}`,
                  boxShadow: isCenter && hl ? `0 0 0 5px ${C.text}22` : 'none',
                  opacity: a * dim, transform: `scale(${0.8 + a * 0.2})`, overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 7, background: col }} />
                <div style={{ position: 'absolute', left: 16, top: 12, fontSize: 13, fontWeight: 900, color: col }}>{seat.className}</div>
                <div
                  style={{
                    position: 'absolute', right: 10, top: 4, fontFamily: FONT_DISPLAY, fontSize: 34, fontWeight: 600,
                    color: C.text, opacity: v, transform: `scale(${1.6 - v * 0.6})`,
                  }}
                >
                  {seat.examVersion}
                </div>
                <div style={{ position: 'absolute', left: 16, right: 8, bottom: 12, fontSize: 16, fontWeight: 800, color: C.text, lineHeight: 1.15 }}>
                  {short(seat.studentName)}
                </div>
              </div>
            );
          })}
          {/* legend */}
          <div style={{ position: 'absolute', left: GX0, top: 748, display: 'flex', gap: 22, fontSize: 15, fontWeight: 800, color: C.text2, opacity: ease(frame - VERS, [0, 12], [0, 1]) }}>
            {Object.entries(CLASS_COLOR).map(([k, v]) => (
              <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: v }} /> {k}
              </span>
            ))}
            <span style={{ color: C.text3 }}>Harf = kitapçık türü</span>
          </div>
        </AppFrame>
      </Camera>
      <Pointer
        path={[{ f: 4, x: 600, y: 900 }, { f: CLICK - 2, x: btn.x, y: btn.y }, { f: CLICK + 24, x: btn.x + 10, y: btn.y + 10 }, { f: CLICK + 46, x: 300, y: 1080 }]}
        clickAt={[CLICK]}
      />
      <Callout
        x={760} y={440} tx={center.x - 30} ty={center.y} delay={FOCUS + 34} color={C.text}
        label="No neighbour shares your booklet" detail="Version A is surrounded by B, C and D, in every direction." align="right"
      />
    </Paper>
  );
};

const Panel: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }> = ({ title, icon, children, style }) => (
  <div style={{ background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 18, padding: '16px 18px', ...style }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 900, fontSize: 18, marginBottom: 8, color: C.text }}>
      {icon}
      {title}
    </div>
    {children}
  </div>
);
