import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LayoutGrid, Users, FileEdit, GraduationCap, ShieldCheck } from 'lucide-react';
import { Wordmark, ease } from './components';
import { C, shadowLg } from './theme';

export const FRAME = { x: 740, y: 90, w: 1080, h: 900 };

const TABS = [
  { id: 'students', label: 'Öğrenciler', Icon: GraduationCap },
  { id: 'classroom', label: 'Sınıf & Düzen', Icon: LayoutGrid },
  { id: 'exam', label: 'Sınav Modu', Icon: FileEdit },
  { id: 'teams', label: 'Takım Kur', Icon: Users },
];

/** A redesigned, simplified AklıSıra window used as the stage for each feature. */
export const AppFrame: React.FC<{ tab: string; children: React.ReactNode; privacy?: boolean; delay?: number }> = ({ tab, children, privacy, delay = 0 }) => {
  const frame = useCurrentFrame();
  const t = ease(frame - delay, [0, 22], [0, 1]);
  return (
    <div
      style={{
        position: 'absolute', left: FRAME.x, top: FRAME.y, width: FRAME.w, height: FRAME.h,
        background: '#fcfbf9', borderRadius: 28, border: `1px solid ${C.border}`, boxShadow: shadowLg,
        overflow: 'hidden', opacity: t, transform: `translateY(${(1 - t) * 40}px)`,
      }}
    >
      <div
        style={{
          height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', borderBottom: `1px solid ${C.borderLight}`, background: C.card,
        }}
      >
        <Wordmark size={24} />
        <div style={{ display: 'flex', gap: 6 }}>
          {TABS.map(({ id, label, Icon }) => {
            const active = id === tab;
            return (
              <div
                key={id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 12,
                  fontSize: 16, fontWeight: 800,
                  color: active ? C.primaryDark : C.text3, background: active ? C.primaryPale : 'transparent',
                }}
              >
                <Icon size={17} strokeWidth={2} />
                {label}
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 800,
            color: privacy ? C.primary : C.text3, border: `1.5px solid ${privacy ? C.primary : C.border}`,
            background: privacy ? C.primaryPale : C.card, padding: '6px 12px', borderRadius: 999,
          }}
        >
          <ShieldCheck size={15} strokeWidth={2.2} />
          {privacy ? 'Gizlilik: Açık' : 'Gizlilik: Kapalı'}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 70, right: 0, bottom: 0 }}>{children}</div>
    </div>
  );
};

/** Coordinates inside the frame's content area → absolute 1920×1080 coordinates. */
export const abs = (x: number, y: number) => ({ x: FRAME.x + x, y: FRAME.y + 70 + y });

export const PrimaryButton: React.FC<{ label: string; icon?: React.ReactNode; pressed?: number; style?: React.CSSProperties; busy?: boolean }> = ({ label, icon, pressed = 0, style, busy }) => (
  <div
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      background: busy ? C.primaryDark : C.primary, color: '#fff', fontWeight: 800, fontSize: 20,
      borderRadius: 14, height: 56, transform: `scale(${1 - pressed * 0.04})`, ...style,
    }}
  >
    {icon}
    {label}
  </div>
);
