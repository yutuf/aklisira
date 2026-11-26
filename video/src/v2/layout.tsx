import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { EASE_IN_OUT } from '../components';

/** Stage = the app window, drawn in its own 1080×880 coordinate space. */
export const STAGE_W = 1080;
export const STAGE_H = 880;

export type Layout = {
  V: boolean;
  W: number;
  H: number;
  stage: { x: number; y: number; b: number };
  cap: { x: number; y: number; w: number; title: number; sub: number };
};

const HORIZ: Layout = {
  V: false, W: 1920, H: 1080,
  stage: { x: 760, y: 100, b: 1 },
  cap: { x: 110, y: 150, w: 590, title: 66, sub: 28 },
};
const VERT: Layout = {
  V: true, W: 1080, H: 1920,
  stage: { x: 20, y: 760, b: 1040 / STAGE_W },
  cap: { x: 72, y: 150, w: 936, title: 76, sub: 34 },
};

export const useLayout = (): Layout => {
  const { width, height } = useVideoConfig();
  return height > width ? VERT : HORIZ;
};

/** Camera key: local point (fx, fy) is placed at the stage box centre, zoomed by s. */
export type SKey = { f: number; s: number; fx: number; fy: number };
const DEFAULT: SKey = { f: 0, s: 1, fx: STAGE_W / 2, fy: STAGE_H / 2 };

export const useStageCam = (keys: SKey[] = [DEFAULT]) => {
  const frame = useCurrentFrame();
  const opt = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: EASE_IN_OUT };
  const pick = (sel: (k: SKey) => number) => {
    if (keys.length === 1) return sel(keys[0]);
    for (let i = 0; i < keys.length - 1; i++) {
      if (frame <= keys[i + 1].f) return interpolate(frame, [keys[i].f, keys[i + 1].f], [sel(keys[i]), sel(keys[i + 1])], opt);
    }
    return sel(keys[keys.length - 1]);
  };
  return { s: pick(k => k.s), fx: pick(k => k.fx), fy: pick(k => k.fy) };
};

/** Positions the stage for the current format and applies the camera. */
export const Stage: React.FC<{ keys?: SKey[]; children: React.ReactNode }> = ({ keys, children }) => {
  const L = useLayout();
  const { s, fx, fy } = useStageCam(keys);
  const { x, y, b } = L.stage;
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, width: STAGE_W, height: STAGE_H, transformOrigin: '0 0',
        transform: `translate(${(b * STAGE_W) / 2}px, ${(b * STAGE_H) / 2}px) scale(${b * s}) translate(${-fx}px, ${-fy}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** Scene entrance on a hard cut: a quick settle so cuts feel deliberate, not jumpy. */
export const CutIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 7], [0, 1], { extrapolateRight: 'clamp', easing: EASE_IN_OUT });
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.4 + 0.6 * t, transform: `scale(${1.025 - 0.025 * t})` }}>
      {children}
    </div>
  );
};
