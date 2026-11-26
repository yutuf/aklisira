import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Eye, Ear, Gift, Heart, Ban, ArrowUpDown } from 'lucide-react';
import { Caption, Paper, Pointer, LevelMeter, BehaviorTag, ease } from '../components';
import { AppFrame, abs } from '../AppFrame';
import { C } from '../theme';
import data from '../data.json';

const HEIGHT_TR: Record<string, string> = { tall: 'Uzun', short: 'Kısa' };

export const Roster: React.FC = () => {
  const frame = useCurrentFrame();
  const CLICK = 34;
  const btn = abs(960, 45);
  return (
    <Paper>
      <Caption
        step="01 · Your class"
        title={<>Start with the class you already know.</>}
        sub="Add students by typing, CSV or voice, or load the demo class. Each profile holds level, behaviour, height, vision and who sits well together."
      />
      <AppFrame tab="students">
        <div style={{ position: 'absolute', left: 36, top: 24, right: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 26 }}>Öğrenci Rehberi</div>
            <div style={{ fontSize: 17, color: C.text3, fontWeight: 600, marginTop: 2 }}>
              Demo 9-A · {frame > CLICK + 4 ? `${Math.min(15, Math.max(0, Math.floor((frame - CLICK - 4) / 2.2)))} öğrenci` : 'Henüz öğrenci yok'}
            </div>
          </div>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 8, background: C.accentPale, color: C.accent,
              fontWeight: 800, fontSize: 18, padding: '12px 18px', borderRadius: 999,
              transform: `scale(${frame >= CLICK && frame < CLICK + 8 ? 0.95 : 1})`,
            }}
          >
            <Gift size={18} strokeWidth={2.2} /> Demo Yükle
          </div>
        </div>
        <div style={{ position: 'absolute', left: 36, top: 112, right: 36, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 20, rowGap: 10 }}>
          {data.students.map((s, i) => {
            const a = ease(frame - CLICK - 4 - i * 2.2, [0, 14], [0, 1]);
            return (
              <div
                key={s.id}
                style={{
                  height: 76, background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 16,
                  display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px',
                  opacity: a, transform: `translateY(${(1 - a) * 16}px)`,
                }}
              >
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 12, background: C.muted, color: C.text2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18,
                  }}
                >
                  {s.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 800, fontSize: 21 }}>{s.name}</span>
                    <BehaviorTag type={s.behaviorType} size={13} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: C.text3, fontWeight: 700, marginTop: 4 }}>
                    {s.friends.length > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Heart size={13} strokeWidth={2.4} color={C.primary} /> {s.friends.join(', ')}
                      </span>
                    )}
                    {s.avoid.length > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Ban size={13} strokeWidth={2.4} color={C.brick} /> {s.avoid.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.text2 }}>
                  {s.vision && <Eye size={19} strokeWidth={2.2} color={C.accent} />}
                  {s.hearing && <Ear size={19} strokeWidth={2.2} color={C.accent} />}
                  {HEIGHT_TR[s.height] && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 13, fontWeight: 800, color: C.text3 }}>
                      <ArrowUpDown size={13} strokeWidth={2.4} />
                      {HEIGHT_TR[s.height]}
                    </span>
                  )}
                  <LevelMeter level={s.academicLevel} size={6} />
                </div>
              </div>
            );
          })}
        </div>
      </AppFrame>
      <Pointer
        path={[
          { f: 6, x: 1300, y: 700 },
          { f: CLICK - 2, x: btn.x + 20, y: btn.y - 4 },
          { f: CLICK + 30, x: btn.x + 30, y: btn.y + 6 },
          { f: CLICK + 50, x: 1900, y: 1000 },
        ]}
        clickAt={[CLICK]}
      />
    </Paper>
  );
};
