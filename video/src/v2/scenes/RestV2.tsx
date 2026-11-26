import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ClipboardCheck, CalendarDays, Handshake, Lock } from 'lucide-react';
import { Paper, Pointer, Wordmark, ease } from '../../components';
import { C, FONT_DISPLAY } from '../../theme';
import { Stage, CutIn, useLayout } from '../layout';
import { Cap, Chrome, Seat, Board, Watermark } from '../ui';
import data from '../../data.json';

// ───────────── Everyday ─────────────
const ATT = [{ n: 'Ali', s: 'Var' }, { n: 'Elif', s: 'Var' }, { n: 'Mehmet', s: 'Geç' }, { n: 'Ayşe', s: 'Var' }, { n: 'Zeynep', s: 'Yok' }];
const ST: Record<string, { bg: string; fg: string }> = { Var: { bg: C.successPale, fg: C.success }, Yok: { bg: C.dangerPale, fg: C.danger }, Geç: { bg: C.accentPale, fg: C.accent } };
const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'];
const LESSONS: [number, number, string, string][] = [[0, 0, 'Mat', C.primary], [0, 2, 'Fizik', C.indigo], [1, 1, 'Mat', C.primary], [2, 0, 'Kimya', C.accent], [3, 2, 'Fizik', C.indigo], [4, 1, 'Kulüp', C.brick], [4, 2, 'Mat', C.primary]];
const MEET = [{ d: 'Salı · 15:30', who: 'Ayşe’nin velisi' }, { d: 'Perşembe · 16:00', who: 'Burak’ın velisi' }];

export const EverydayV2: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const cardW = L.V ? 936 : 540, cardH = L.V ? 360 : 470;
  const card = (i: number, title: string, en: string, Icon: typeof ClipboardCheck, body: React.ReactNode) => {
    const a = ease(frame - 6 - i * 5, [0, 12], [0, 1]);
    return (
      <div key={i} style={{ width: cardW, height: cardH, background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 28, opacity: a, transform: `translateY(${(1 - a) * 40}px)`, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: C.primaryPale, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={25} strokeWidth={2} /></div>
          <div><div style={{ fontWeight: 900, fontSize: 26 }}>{title}</div><div style={{ fontWeight: 700, fontSize: 18, color: C.text3 }}>{en}</div></div>
        </div>
        <div style={{ marginTop: 20 }}>{body}</div>
      </div>
    );
  };
  const rowsShown = L.V ? 4 : 5;
  return (
    <Paper>
      <CutIn>
        <Cap step="04 · Every day" title={L.V ? <>Attendance, timetable, parent meetings.</> : <>Attendance, timetable and parent meetings, in one place.</>} size={L.V ? 70 : 58} />
        <div style={{ position: 'absolute', left: L.V ? 72 : 110, top: L.V ? 470 : 420, display: 'flex', flexDirection: L.V ? 'column' : 'row', gap: L.V ? 24 : 30 }}>
          {card(0, 'Yoklama', 'Attendance', ClipboardCheck, ATT.slice(0, rowsShown).map((r, k) => (
            <div key={r.n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: L.V ? '9px 0' : '11px 0', borderBottom: `1px solid ${C.borderLight}`, opacity: ease(frame - 14 - k * 3, [0, 8], [0, 1]) }}>
              <span style={{ fontWeight: 900, fontSize: 22 }}>{r.n}</span>
              <span style={{ fontWeight: 900, fontSize: 17, padding: '5px 16px', borderRadius: 999, background: ST[r.s].bg, color: ST[r.s].fg }}>{r.s}</span>
            </div>
          )))}
          {card(1, 'Ders Programı', 'Weekly timetable', CalendarDays, (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 7 }}>
              {DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontWeight: 900, fontSize: 16, color: C.text3 }}>{d}</div>)}
              {Array.from({ length: 15 }).map((_, k) => {
                const day = k % 5, slotI = Math.floor(k / 5);
                const l = LESSONS.find(x => x[0] === day && x[1] === slotI);
                return <div key={k} style={{ height: L.V ? 62 : 84, borderRadius: 10, background: l ? `${l[3]}18` : C.muted, borderLeft: l ? `5px solid ${l[3]}` : 'none', padding: '8px 8px', fontSize: 16, fontWeight: 900, color: l ? l[3] : 'transparent', opacity: ease(frame - 14 - k, [0, 8], [0, 1]) }}>{l ? l[2] : '-'}</div>;
              })}
            </div>
          ))}
          {card(2, 'Veli Görüşmeleri', 'Parent meetings', Handshake, MEET.map((m, k) => (
            <div key={k} style={{ padding: '14px 18px', borderRadius: 14, border: `1px solid ${C.borderLight}`, marginBottom: 12, opacity: ease(frame - 18 - k * 4, [0, 10], [0, 1]) }}>
              <div style={{ fontWeight: 900, fontSize: 16, color: C.accent }}>{m.d}</div>
              <div style={{ fontWeight: 900, fontSize: 23, marginTop: 4 }}>{m.who}</div>
            </div>
          )))}
        </div>
        <Watermark />
      </CutIn>
    </Paper>
  );
};

// ───────────── Privacy ─────────────
const byId = Object.fromEntries(data.students.map(s => [s.id, s]));
const TOGGLE = 36;
export const PrivacyV2: React.FC = () => {
  const frame = useCurrentFrame();
  const hide = ease(frame - TOGGLE, [0, 12], [0, 1]);
  const notice = ease(frame - 78, [0, 14], [0, 1]);
  return (
    <Paper>
      <CutIn>
        <Cap step="05 · Privacy first" title={<>Student data deserves care.</>}
          sub="Class lists stay in your browser, not in a student database. Privacy mode hides behaviour and grade labels on the projector." />
        <Stage>
          <Chrome tab="classroom" privacy={frame >= TOGGLE} />
          <Board y={100} />
          {data.seating.optimized.map(p => (
            <Seat key={p.id} s={byId[p.id]} cx={130 + p.col * 164} cy={213 + p.row * 130} w={150} h={116} settled privacy={hide} />
          ))}
          <div style={{
            position: 'absolute', left: 120, top: 540, width: 840, background: C.card, borderRadius: 22, border: `1px solid ${C.border}`,
            boxShadow: '0 18px 48px rgba(26,23,21,0.16)', padding: '26px 30px', opacity: notice, transform: `translateY(${(1 - notice) * 30}px)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 900, fontSize: 24 }}><Lock size={23} strokeWidth={2.2} /> Öğrenci verileri hakkında kısa bilgilendirme</div>
            <div style={{ fontSize: 19, lineHeight: 1.5, color: C.text2, marginTop: 12, fontWeight: 600 }}>
              Girdiğiniz sınıf ve öğrenci listeleri sizin tarayıcınızda saklanır; kalıcı bir öğrenci veritabanına yazılmaz.
            </div>
            <div style={{ marginTop: 16, background: C.primary, color: '#fff', borderRadius: 12, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 19 }}>Anladım</div>
          </div>
          <Pointer path={[{ f: 0, x: 700, y: 700 }, { f: TOGGLE - 4, x: 990, y: 36 }, { f: TOGGLE + 20, x: 1000, y: 56 }, { f: TOGGLE + 40, x: 1100, y: 300 }]} clickAt={[TOGGLE - 2]} />
        </Stage>
        <Watermark />
      </CutIn>
    </Paper>
  );
};

// ───────────── End card ─────────────
export const EndV2: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const t = (d: number) => ease(frame - d, [0, 16], [0, 1]);
  const line = ease(frame - 30, [0, 20], [0, 1]);
  return (
    <Paper>
      <CutIn>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 70px' }}>
          <div style={{ opacity: t(0), transform: `translateY(${(1 - t(0)) * 20}px)` }}><Wordmark size={L.V ? 104 : 116} /></div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: L.V ? 60 : 58, lineHeight: 1.12, color: C.text, marginTop: 40, opacity: t(10), fontWeight: 500, maxWidth: L.V ? 900 : 1300 }}>
            The right seat for every student.
          </div>
          <div style={{ fontSize: L.V ? 32 : 30, fontWeight: 700, color: C.text2, marginTop: 20, opacity: t(18) }}>
            Seating · Kelebek exams · Teams · Attendance
          </div>
          <div style={{ marginTop: 70, opacity: t(26), display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: L.V ? 60 : 54, fontWeight: 900, color: C.primary }}>aklisira.com</div>
            <div style={{ height: 5, width: (L.V ? 380 : 360) * line, background: C.accent, borderRadius: 3, marginTop: 12 }} />
            <div style={{ fontSize: L.V ? 28 : 24, fontWeight: 800, color: C.text3, marginTop: 24 }}>Free to start · No card needed · Runs in the browser</div>
          </div>
        </div>
      </CutIn>
    </Paper>
  );
};
