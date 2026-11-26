import React from 'react';
import { useCurrentFrame } from 'remotion';
import { HardDrive, EyeOff, FileText, Lock } from 'lucide-react';
import { Caption, Paper, Pointer, LevelMeter, BehaviorTag, ease } from '../components';
import { AppFrame, FRAME } from '../AppFrame';
import { C } from '../theme';
import data from '../data.json';

const byId = Object.fromEntries(data.students.map(s => [s.id, s]));
const TOGGLE = 46;
const POINTS = [
  { Icon: HardDrive, t: 'Class lists are stored in your browser, not in a student database.' },
  { Icon: EyeOff, t: 'Privacy mode hides behaviour and grade labels on the projector.' },
  { Icon: FileText, t: 'A plain-language data notice, right inside the app.' },
];

export const Privacy: React.FC = () => {
  const frame = useCurrentFrame();
  const on = frame >= TOGGLE;
  const hide = ease(frame - TOGGLE, [0, 14], [0, 1]);
  const toggleAt = { x: FRAME.x + FRAME.w - 100, y: FRAME.y + 35 };
  const notice = ease(frame - 92, [0, 18], [0, 1]);
  return (
    <Paper>
      <Caption step="06 · Privacy first" title={<>Student data deserves care.</>} />
      <div style={{ position: 'absolute', left: 120, top: 420, width: 560 }}>
        {POINTS.map(({ Icon, t }, i) => {
          const a = ease(frame - 14 - i * 10, [0, 16], [0, 1]);
          return (
            <div key={i} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', marginBottom: 30, opacity: a, transform: `translateY(${(1 - a) * 12}px)` }}>
              <div style={{ flex: '0 0 auto', width: 50, height: 50, borderRadius: 14, background: C.primaryPale, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} strokeWidth={2} />
              </div>
              <div style={{ fontSize: 26, lineHeight: 1.38, fontWeight: 600, color: C.text2 }}>{t}</div>
            </div>
          );
        })}
      </div>
      <AppFrame tab="classroom" privacy={on}>
        <div
          style={{
            position: 'absolute', left: 40, top: 30, width: 1000, height: 36, borderRadius: 10, background: C.primaryDark,
            color: '#e9f5f2', fontSize: 14, letterSpacing: '0.3em', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          TAHTA
        </div>
        {data.seating.optimized.map(p => {
          const s = byId[p.id];
          return (
            <div
              key={p.id}
              style={{
                position: 'absolute', left: 55 + p.col * 164, top: 90 + p.row * 130, width: 150, height: 116, borderRadius: 16,
                background: '#f1fbf9', border: `2px solid ${C.primaryLight}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 22 }}>{s.name}</div>
              <div style={{ position: 'relative', height: 24, width: '100%' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7, opacity: 1 - hide, filter: `blur(${hide * 6}px)` }}>
                  <BehaviorTag type={s.behaviorType} size={12} />
                  <LevelMeter level={s.academicLevel} size={5} />
                </div>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 14, fontWeight: 600, color: C.text3, opacity: hide }}>
                  Öğrenci
                </div>
              </div>
            </div>
          );
        })}
        {/* in-app data notice */}
        <div
          style={{
            position: 'absolute', left: 140, top: 500, width: 800, background: C.card, borderRadius: 22, border: `1px solid ${C.border}`,
            boxShadow: '0 18px 48px rgba(26,23,21,0.14)', padding: '26px 30px', opacity: notice, transform: `translateY(${(1 - notice) * 30}px)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 900, fontSize: 22 }}>
            <Lock size={21} strokeWidth={2.2} /> Öğrenci verileri hakkında kısa bilgilendirme
          </div>
          <div style={{ fontSize: 17, lineHeight: 1.55, color: C.text2, marginTop: 12, fontWeight: 500 }}>
            AklıSıra'da girdiğiniz sınıf ve öğrenci listeleri şu an sizin tarayıcınızda saklanır; kalıcı bir öğrenci veritabanına yazılmaz.
          </div>
          <div style={{ marginTop: 16, background: C.primary, color: '#fff', borderRadius: 12, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
            Anladım
          </div>
        </div>
      </AppFrame>
      <Pointer path={[{ f: 6, x: 1500, y: 800 }, { f: TOGGLE - 4, x: toggleAt.x, y: toggleAt.y }, { f: TOGGLE + 30, x: toggleAt.x + 10, y: toggleAt.y + 20 }, { f: TOGGLE + 50, x: 1920, y: 400 }]} clickAt={[TOGGLE - 2]} />
    </Paper>
  );
};
