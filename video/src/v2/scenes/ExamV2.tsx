import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Shuffle, School, DoorOpen, Check } from 'lucide-react';
import { Paper, Pointer, ease } from '../../components';
import { C, FONT_DISPLAY } from '../../theme';
import { Stage, CutIn } from '../layout';
import { Cap, Chrome, Note, Board, Watermark } from '../ui';
import data from '../../data.json';

const E = data.exam;
const CLASS_COLOR: Record<string, string> = { '9-B': C.primary, '10-A': C.accent, '10-B': C.indigo };
const GX0 = 342, GY0 = 196, W = 108, H = 110, DX = 119, DY = 122;
const CLICK = 34, FILL = 40, VERS = 116, FOCUS = 168;
const short = (n: string) => { const [a, b] = n.split(' '); return `${a} ${b ? b[0] + '.' : ''}`; };
const CENTER = { x: GX0 + 2 * DX + W / 2, y: GY0 + 2 * DY + H / 2 };

export const ExamV2: React.FC = () => {
  const frame = useCurrentFrame();
  const near = (r: number, c: number) => Math.abs(r - 2) <= 1 && Math.abs(c - 2) <= 1;
  const focus = frame >= FOCUS + 8;
  return (
    <Paper>
      <CutIn>
        <Cap out={FOCUS - 4} step="02 · Exam week" title={<>Kelebek exam seating, in one click.</>}
          sub="Three classes mixed across two rooms. Neighbours get different booklets: A, B, C and D." />
        <Stage keys={[{ f: 0, s: 1, fx: 540, fy: 440 }, { f: FOCUS, s: 1, fx: 540, fy: 440 }, { f: FOCUS + 26, s: 1.42, fx: CENTER.x, fy: CENTER.y + 50 }]}>
          <Chrome tab="exam" />
          <div style={{ position: 'absolute', left: 36, top: 90, width: 280 }}>
            <Panel title="Sınıflar" icon={<School size={19} strokeWidth={2.2} />}>
              {E.classes.map((c, i) => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 20, fontWeight: 900, opacity: ease(frame - 2 - i * 4, [0, 10], [0, 1]) }}>
                  <span style={{ width: 16, height: 16, borderRadius: 4, background: CLASS_COLOR[c.name] }} />
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <span style={{ color: C.text3, fontWeight: 800, fontSize: 16 }}>{c.count} öğrenci</span>
                </div>
              ))}
            </Panel>
            <Panel title="Salonlar" icon={<DoorOpen size={19} strokeWidth={2.2} />} style={{ marginTop: 14 }}>
              {E.rooms.map(r => (
                <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 18, fontWeight: 900 }}>
                  <span>{r.name}</span><span style={{ color: C.text3, fontWeight: 800, fontSize: 16 }}>{r.rows * r.cols} koltuk</span>
                </div>
              ))}
            </Panel>
            <Panel title="Sınav tipi" style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10, fontSize: 17, fontWeight: 900, color: C.primaryDark, background: C.primaryPale, border: `1.5px solid ${C.primary}` }}>
                <Check size={17} strokeWidth={3} /> Kelebek (A, B, C, D)
              </div>
            </Panel>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, height: 60, borderRadius: 14, background: C.primary, color: '#fff', fontWeight: 900, fontSize: 19, transform: `scale(${frame >= CLICK && frame < CLICK + 5 ? 0.95 : 1})` }}>
              <Shuffle size={19} strokeWidth={2.2} /> Kelebek Düzeni Oluştur
            </div>
          </div>

          <div style={{ position: 'absolute', left: GX0, top: 92, display: 'flex', gap: 8, alignItems: 'center' }}>
            {E.rooms.map((r, i) => (
              <div key={r.name} style={{ padding: '8px 18px', borderRadius: 10, fontSize: 17, fontWeight: 900, background: i === 0 ? C.text : C.muted, color: i === 0 ? '#fff' : C.text2 }}>{r.name}</div>
            ))}
            <div style={{ fontSize: 16, fontWeight: 800, color: C.text3, marginLeft: 6 }}>60 öğrenci · 3 sınıf</div>
          </div>
          <Board x={GX0} y={146} w={6 * DX - (DX - W)} />
          {E.room1.map(seat => {
            const { row: r, col: c } = seat;
            const a = ease(frame - FILL - (r + c) * 4, [0, 12], [0, 1]);
            const v = ease(frame - VERS - (r * 6 + c) * 1.1, [0, 8], [0, 1]);
            const isC = r === 2 && c === 2;
            const col = CLASS_COLOR[seat.className];
            return (
              <div key={`${r}-${c}`} style={{
                position: 'absolute', left: GX0 + c * DX, top: GY0 + r * DY, width: W, height: H, borderRadius: 14, background: C.card,
                border: `2px solid ${focus && isC ? C.text : C.border}`, boxShadow: focus && isC ? `0 0 0 6px ${C.text}26` : 'none',
                opacity: a * (focus && !near(r, c) ? 0.3 : 1), transform: `scale(${0.8 + 0.2 * a})`, overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: col }} />
                <div style={{ position: 'absolute', left: 17, top: 11, fontSize: 14, fontWeight: 900, color: col }}>{seat.className}</div>
                <div style={{ position: 'absolute', right: 10, top: 2, fontFamily: FONT_DISPLAY, fontSize: 38, fontWeight: 600, opacity: v, transform: `scale(${1.7 - 0.7 * v})` }}>{seat.examVersion}</div>
                <div style={{ position: 'absolute', left: 17, right: 6, bottom: 11, fontSize: 17, fontWeight: 900, lineHeight: 1.1 }}>{short(seat.studentName)}</div>
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: GX0, top: 818, display: 'flex', gap: 22, fontSize: 16, fontWeight: 900, color: C.text2, opacity: ease(frame - VERS, [0, 10], [0, 1]) * (focus ? 0 : 1) }}>
            {Object.entries(CLASS_COLOR).map(([k, v]) => (
              <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ width: 13, height: 13, borderRadius: 3, background: v }} /> {k}</span>
            ))}
            <span style={{ color: C.text3 }}>Harf = kitapçık türü</span>
          </div>
          <Note at={FOCUS + 28} x={GX0 + 40} y={690} w={500} tx={CENTER.x} ty={CENTER.y + H / 2 - 4} from="top" color={C.text}
            label="No neighbour shares your booklet" detail="A is surrounded by B, C and D." />
          <Pointer path={[{ f: 0, x: 600, y: 860 }, { f: CLICK - 2, x: 190, y: 594 }, { f: CLICK + 20, x: 200, y: 610 }, { f: CLICK + 40, x: 120, y: 900 }]} clickAt={[CLICK]} />
        </Stage>
        <Watermark />
      </CutIn>
    </Paper>
  );
};

const Panel: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }> = ({ title, icon, children, style }) => (
  <div style={{ background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 18, padding: '14px 18px', ...style }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 900, fontSize: 19, marginBottom: 6 }}>{icon}{title}</div>
    {children}
  </div>
);
