// Shared by the scenes and scripts/gen-audio-v2.ts so picture and sound stay locked.
// 100 bpm at 30 fps → one beat = 18 frames, one bar = 72 frames.
export const FPS = 30;
export const BEAT = 18;
export const BAR = BEAT * 4;

export const SCENE = {
  cold: { from: 0, d: 144 },        // constraints, one per half bar
  web: { from: 144, d: 540 },       // quadrillion → solve (drop at +144) → reveal → callouts → layouts
  exam: { from: 684, d: 252 },
  teams: { from: 936, d: 180 },
  every: { from: 1116, d: 108 },
  privacy: { from: 1224, d: 144 },
  end: { from: 1368, d: 144 },
} as const;
export const TOTAL_V2 = SCENE.end.from + SCENE.end.d; // 1512 frames = 50.4 s

// Local beats inside the web scene
export const WEB = {
  drop: 144,      // the solve starts here (abs 288)
  flyEnd: 200,
  reveal0: 216,
  reveal1: 270,
  callouts: [288, 336, 384] as const,
  layouts: 432,
} as const;

// Frame (absolute) of every UI press, for click SFX
export const CLICKS_V2 = [
  SCENE.web.from + WEB.drop - 2,
  SCENE.exam.from + 34,
  SCENE.teams.from + 26,
  SCENE.teams.from + 98,
  SCENE.privacy.from + 34,
];
