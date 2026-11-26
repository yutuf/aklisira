import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ClipboardCheck, CalendarDays, Handshake } from 'lucide-react';
import { Caption, Paper, ease } from '../components';
import { C } from '../theme';

const ATT = [
  { n: 'Ali', s: 'Var' }, { n: 'Elif', s: 'Var' }, { n: 'Mehmet', s: 'Geç' }, { n: 'Ayşe', s: 'Var' },
  { n: 'Zeynep', s: 'Yok' }, { n: 'Can', s: 'Var' },
];
const ST: Record<string, { bg: string; fg: string }> = {
  Var: { bg: C.successPale, fg: C.success }, Yok: { bg: C.dangerPale, fg: C.danger }, Geç: { bg: C.accentPale, fg: C.accent },
};
const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'];
const LESSONS: [number, number, string, string][] = [
  [0, 0, 'Matematik', C.primary], [0, 2, 'Fizik', C.indigo], [1, 1, 'Matematik', C.primary], [2, 0, 'Kimya', C.accent],
  [2, 3, 'Matematik', C.primary], [3, 2, 'Fizik', C.indigo], [4, 1, 'Kulüp', C.brick], [4, 3, 'Matematik', C.primary],
];

const Panel: React.FC<{ i: number; title: string; en: string; Icon: typeof ClipboardCheck; children: React.ReactNode }> = ({ i, title, en, Icon, children }) => {
  const frame = useCurrentFrame();
  const a = ease(frame - 10 - i * 7, [0, 18], [0, 1]);
  return (
    <div style={{ width: 530, height: 560, background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 30, opacity: a, transform: `translateY(${(1 - a) * 40}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: C.primaryPale, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={24} strokeWidth={2} />
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 24 }}>{title}</div>
          <div style={{ fontWeight: 600, fontSize: 17, color: C.text3 }}>{en}</div>
        </div>
      </div>
      <div style={{ marginTop: 24 }}>{children}</div>
    </div>
  );
};

export const Everyday: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Paper>
      <Caption step="05 · Every day" title="Attendance, timetable and parent meetings, in the same place." x={120} y={90} width={1500} size={56} />
      <div style={{ position: 'absolute', left: 120, top: 330, display: 'flex', gap: 35 }}>
        <Panel i={0} title="Yoklama" en="Attendance" Icon={ClipboardCheck}>
          {ATT.map((r, k) => {
            const a = ease(frame - 24 - k * 4, [0, 10], [0, 1]);
            return (
              <div key={r.n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: `1px solid ${C.borderLight}`, opacity: a }}>
                <span style={{ fontWeight: 800, fontSize: 20 }}>{r.n}</span>
                <span style={{ fontWeight: 900, fontSize: 15, padding: '5px 14px', borderRadius: 999, background: ST[r.s].bg, color: ST[r.s].fg }}>{r.s}</span>
              </div>
            );
          })}
        </Panel>
        <Panel i={1} title="Ders Programı" en="Weekly timetable" Icon={CalendarDays}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 7 }}>
            {DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontWeight: 900, fontSize: 15, color: C.text3, paddingBottom: 4 }}>{d}</div>)}
            {Array.from({ length: 20 }).map((_, k) => {
              const day = k % 5, slot = Math.floor(k / 5);
              const l = LESSONS.find(x => x[0] === day && x[1] === slot);
              const a = ease(frame - 26 - k * 1.5, [0, 10], [0, 1]);
              return (
                <div key={k} style={{ height: 80, borderRadius: 10, background: l ? `${l[3]}16` : C.muted, borderLeft: l ? `4px solid ${l[3]}` : 'none', padding: '8px 7px', fontSize: 13, fontWeight: 800, color: l ? l[3] : 'transparent', opacity: a }}>
                  {l ? l[2] : '-'}
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel i={2} title="Veli Görüşmeleri" en="Parent meetings" Icon={Handshake}>
          {[
            { d: 'Salı · 15:30', who: 'Ayşe\'nin velisi', note: 'Sınav kaygısı, ön sıra önerisi' },
            { d: 'Perşembe · 16:00', who: 'Burak\'ın velisi', note: 'Davranış takibi, 2. görüşme' },
            { d: 'Cuma · 14:00', who: 'Emre\'nin velisi', note: 'Görme desteği, göz raporu' },
          ].map((m, k) => {
            const a = ease(frame - 30 - k * 6, [0, 12], [0, 1]);
            return (
              <div key={k} style={{ padding: '14px 16px', borderRadius: 14, border: `1px solid ${C.borderLight}`, marginBottom: 12, opacity: a, transform: `translateX(${(1 - a) * 16}px)` }}>
                <div style={{ fontWeight: 900, fontSize: 14, color: C.accent, letterSpacing: '0.04em' }}>{m.d}</div>
                <div style={{ fontWeight: 800, fontSize: 20, marginTop: 4 }}>{m.who}</div>
                <div style={{ fontWeight: 600, fontSize: 15, color: C.text3, marginTop: 2 }}>{m.note}</div>
              </div>
            );
          })}
        </Panel>
      </div>
    </Paper>
  );
};
