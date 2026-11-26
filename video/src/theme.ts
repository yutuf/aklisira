// Colour tokens mirror src/app/globals.css (:root) in the app.
export const C = {
  primary: '#0d6e64',
  primaryLight: '#14b8a6',
  primaryPale: '#d1faf4',
  primaryDark: '#094f47',
  accent: '#d97706',
  accentLight: '#fbbf24',
  accentPale: '#fef3c7',
  bg: '#f7f5f2',
  card: '#ffffff',
  muted: '#f0ece7',
  border: '#e0d8d0',
  borderLight: '#ece6df',
  text: '#1a1715',
  text2: '#57534e',
  text3: '#7d7368',
  success: '#15803d',
  successPale: '#dcfce7',
  danger: '#dc2626',
  dangerPale: '#fee2e2',
  // Third/fourth hues for class + exam-version coding, chosen to sit with
  // the warm palette (no neon): a slate indigo and a brick.
  indigo: '#3f5a9a',
  indigoPale: '#e3e8f4',
  brick: '#a2412a',
  brickPale: '#f6e2dc',
};

export const FONT_DISPLAY = "'Fraunces', Georgia, serif";
export const FONT_BODY = "'Nunito', system-ui, sans-serif";

export const shadow = '0 1px 2px rgba(26,23,21,0.04), 0 6px 18px rgba(26,23,21,0.06)';
export const shadowLg = '0 2px 4px rgba(26,23,21,0.04), 0 18px 48px rgba(26,23,21,0.10)';

export const LEVEL: Record<string, { n: number; tr: string }> = {
  high: { n: 5, tr: 'Yüksek' },
  above_average: { n: 4, tr: 'İyi' },
  average: { n: 3, tr: 'Orta' },
  below_average: { n: 2, tr: 'Gelişen' },
  struggling: { n: 1, tr: 'Destek' },
};

export const BEHAVIOR: Record<string, { tr: string; color: string }> = {
  leader: { tr: 'Lider', color: C.indigo },
  quiet: { tr: 'Sessiz', color: C.success },
  active: { tr: 'Aktif', color: C.primary },
  follower: { tr: 'Takipçi', color: C.text3 },
  disruptive: { tr: 'Dağıtıcı', color: C.brick },
};
