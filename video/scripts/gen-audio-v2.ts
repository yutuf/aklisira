/**
 * Pro-cut soundtrack, rendered sample-accurately against src/v2/timeline.ts.
 * Everything is synthesised here (no samples): pad, bass, mallets, soft kit,
 * risers/whooshes, UI clicks and "seat landing" notes.
 * Output: public/audio/pro-soundtrack.wav
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SCENE, TOTAL_V2, FPS, WEB, CLICKS_V2 } from '../src/v2/timeline';

const SR = 48000;
const DUR = TOTAL_V2 / FPS + 0.5;
const N = Math.ceil(DUR * SR);
const L = new Float32Array(N), R = new Float32Array(N);
const TAU = Math.PI * 2;
const sec = (frame: number) => frame / FPS;
const midi = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
let seed = 12345;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

const add = (i: number, v: number, pan = 0) => {
  if (i < 0 || i >= N) return;
  L[i] += v * Math.min(1, 1 - pan);
  R[i] += v * Math.min(1, 1 + pan);
};

function mallet(t0: number, f: number, amp: number, pan = 0, dec = 0.5) {
  const s0 = Math.floor(t0 * SR), len = Math.floor(dec * 4 * SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const v = Math.min(1, t / 0.003) * amp * (
      Math.sin(TAU * f * t) * Math.exp(-t / dec) +
      0.22 * Math.sin(TAU * f * 4 * t) * Math.exp(-t / (dec * 0.12)) +
      0.06 * Math.sin(TAU * f * 10 * t) * Math.exp(-t / 0.015));
    add(s0 + i, v, pan);
  }
}
function kick(t0: number, amp: number) {
  const s0 = Math.floor(t0 * SR), len = Math.floor(0.45 * SR);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const f = 46 + 80 * Math.exp(-t / 0.035);
    ph += TAU * f / SR;
    const v = amp * (Math.sin(ph) * Math.exp(-t / 0.22) + 0.25 * Math.exp(-t / 0.004) * rnd());
    add(s0 + i, v);
  }
}
function shaker(t0: number, amp: number, pan: number) {
  const s0 = Math.floor(t0 * SR), len = Math.floor(0.09 * SR);
  let prev = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, n = rnd(), hp = n - prev; prev = n;
    add(s0 + i, amp * hp * Math.min(1, t / 0.008) * Math.exp(-t / 0.03), pan);
  }
}
function snap(t0: number, amp: number) { // soft clap/snap on 2 & 4
  const s0 = Math.floor(t0 * SR), len = Math.floor(0.2 * SR);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR; lp += 0.45 * (rnd() - lp);
    const env = Math.exp(-t / 0.05) * (1 + 0.6 * Math.exp(-((t - 0.012) ** 2) / 0.00002));
    add(s0 + i, amp * lp * env, 0.1);
  }
}
function click(t0: number, amp: number) {
  const s0 = Math.floor(t0 * SR), len = Math.floor(0.08 * SR);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR; lp += 0.3 * (rnd() - lp);
    add(s0 + i, amp * (0.7 * Math.sin(TAU * 2100 * t) * Math.exp(-t / 0.01) + 0.6 * lp * Math.exp(-t / 0.005)));
  }
}
function whoosh(tEnd: number, len: number, amp: number) { // filtered noise swell ending on a cut
  const s0 = Math.floor((tEnd - len) * SR), n = Math.floor((len + 0.15) * SR);
  let lp = 0, lp2 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR, x = Math.min(1, t / len);
    const cutoff = 0.02 + 0.25 * x * x;
    lp += cutoff * (rnd() - lp); lp2 += cutoff * (lp - lp2);
    const env = t < len ? x * x : Math.exp(-(t - len) / 0.05);
    add(s0 + i, amp * lp2 * env * 3, Math.sin(t * 9) * 0.4);
  }
}

// ── harmony ──
const beat = 0.6, bar = 2.4;
const DROP = sec(SCENE.web.from + WEB.drop); // 9.6 s
const END = sec(SCENE.end.from);            // breakdown
// I – V/3 – vi – IV in D, one chord per bar
const PROG = [
  [50, 57, 62, 66, 69], // D
  [49, 57, 61, 64, 69], // A/C#
  [47, 54, 59, 62, 66], // Bm
  [43, 55, 59, 62, 67], // G
];
const INTRO = [[50, 57, 62, 64, 69], [50, 57, 62, 64, 69], [47, 54, 59, 62, 66], [43, 55, 59, 62, 67]]; // Dadd9 … Bm G
const chordAt = (t: number) => (t < DROP ? INTRO : PROG)[Math.floor(t / bar) % 4];

// pad
let pL = 0, pR = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const ch = chordAt(t);
  const local = t % bar;
  const env = Math.min(1, local / 0.5) * (0.75 + 0.25 * Math.min(1, (bar - local) / 0.3));
  let sL = 0, sR = 0;
  for (let k = 1; k < ch.length; k++) {
    const f = midi(ch[k]);
    sL += Math.sin(TAU * f * 0.997 * t) + 0.3 * Math.sin(TAU * 2 * f * t + 0.4);
    sR += Math.sin(TAU * f * 1.003 * t) + 0.3 * Math.sin(TAU * 2 * f * t + 1.3);
  }
  const lvl = (t < DROP ? 0.032 + 0.02 * (t / DROP) : t < END ? 0.05 : 0.05 * Math.max(0, 1 - (t - END - 2.2) / 2.6)) * Math.min(1, t / 1.5);
  const cut = t < DROP ? 0.03 + 0.05 * (t / DROP) : 0.09;
  pL += cut * (sL * lvl * env - pL); pR += cut * (sR * lvl * env - pR);
  L[i] += pL; R[i] += pR;
}

// bass: pulse in the web build, groove after the drop
for (let t = bar * 2; t < END; t += beat / 2) {
  const step = Math.round(t / (beat / 2));
  const ch = chordAt(t);
  if (t < DROP && step % 2) continue;
  const f = midi(ch[0] - 12 + (t >= DROP && step % 8 === 7 ? 7 : 0));
  const s0 = Math.floor(t * SR), len = Math.floor(0.5 * SR);
  const amp = t < DROP ? 0.1 + 0.08 * ((t - bar * 2) / (DROP - bar * 2)) : 0.2;
  for (let i = 0; i < len; i++) {
    const tt = i / SR;
    add(s0 + i, amp * (Math.sin(TAU * f * tt) + 0.2 * Math.sin(TAU * 2 * f * tt)) * Math.min(1, tt / 0.006) * Math.exp(-tt / 0.22));
  }
}

// kit after the drop, stops at the end card
for (let t = DROP; t < END - 0.01; t += beat / 2) {
  const step = Math.round((t - DROP) / (beat / 2));
  if (step % 2 === 0) kick(t, 0.34);
  if (step % 4 === 2) snap(t, 0.12);
  shaker(t + (step % 2 ? 0.03 : 0), step % 2 ? 0.06 : 0.035, step % 2 ? 0.3 : -0.3);
}

// mallet arpeggio after the drop
const ARP = [1, 2, 3, 4, 3, 2, 4, 3];
for (let t = DROP; t < END; t += beat / 2) {
  const step = Math.round((t - DROP) / (beat / 2)) % 8;
  mallet(t, midi(chordAt(t)[ARP[step]] + 12), 0.05, step % 2 ? 0.35 : -0.35, 0.32);
}

// ── cold open: a note for each rule, rising ──
[4, 40, 76, 108].forEach((f, i) => mallet(sec(f), midi([69, 71, 74, 76][i]), 0.16, i % 2 ? 0.25 : -0.25, 0.7));
for (let b = 0; b < 8; b++) click(b * beat, 0.035); // clock tick on each beat
// web: soft plucks as constraint lines draw, then the riser into the drop
for (let i = 0; i < 12; i++) mallet(sec(SCENE.web.from + 14 + i * 5), midi(81 + (i % 3) * 2), 0.03, (i % 2) ? 0.5 : -0.5, 0.18);
whoosh(DROP, 2.4, 0.5);
// solve: each seat lands on a note of D major pentatonic, rising
const PENTA = [62, 64, 66, 69, 71];
for (let k = 0; k < 15; k++) {
  const tl = sec(SCENE.web.from + WEB.drop + 32 + k * 2);
  mallet(tl, midi(PENTA[k % 5] + 12 * (1 + Math.floor(k / 5))), 0.06, (k / 14) * 1.2 - 0.6, 0.25);
}
// callouts + layout morphs
WEB.callouts.forEach(c => mallet(sec(SCENE.web.from + c), midi(78), 0.07, 0.2, 0.4));
[0, 27, 54, 81].forEach(d => mallet(sec(SCENE.web.from + WEB.layouts + d), midi(74 + (d / 27) * 2), 0.05, -0.2, 0.3));
// UI presses
CLICKS_V2.forEach(f => click(sec(f), 0.32));
// whooshes into each hard cut
[SCENE.exam.from, SCENE.teams.from, SCENE.every.from, SCENE.privacy.from, SCENE.end.from].forEach(f => whoosh(sec(f), 0.35, 0.35));
// exam: booklet letters stamp in (every 6th seat, so it reads as a ripple, not a rattle)
for (let k = 0; k < 30; k += 3) click(sec(SCENE.exam.from + 116 + k * 1.1), 0.08);
// end card: resolving chime + final chord
mallet(END + 0.05, midi(78), 0.18, -0.2, 0.9);
mallet(END + 0.16, midi(85), 0.15, 0.2, 1.0);
[62, 66, 69, 73, 76].forEach((m, k) => mallet(END + 0.8 + k * 0.05, midi(m), 0.09, (k - 2) * 0.2, 1.3));

// soft limiter + normalise
let peak = 0;
for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i] * 1.2); R[i] = Math.tanh(R[i] * 1.2); peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
const g = 0.89 / peak;
const out = Buffer.alloc(44 + N * 4);
out.write('RIFF', 0); out.writeUInt32LE(36 + N * 4, 4); out.write('WAVE', 8); out.write('fmt ', 12);
out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22); out.writeUInt32LE(SR, 24);
out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34); out.write('data', 36); out.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4);
  out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4);
}
const dir = join(__dirname, '../public/audio');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'pro-soundtrack.wav'), out);
console.log('pro soundtrack', DUR.toFixed(2), 's');
