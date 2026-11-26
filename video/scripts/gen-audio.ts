/**
 * Synthesises the soundtrack (no samples, no external assets):
 *  - public/audio/music.wav : warm pad + soft mallet arpeggio + bass, 90 bpm
 *  - public/audio/click.wav : soft UI tick for button presses
 *  - public/audio/chime.wav : two-note mallet chime for title/end card
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SR = 44100;
const OUT = join(__dirname, '../public/audio');
mkdirSync(OUT, { recursive: true });

function wav(path: string, L: Float32Array, R: Float32Array) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 4, 40);
  let peak = 0; for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const g = peak > 0 ? 0.7 / peak : 1;
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4);
  }
  writeFileSync(path, buf);
}

const midi = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
const TAU = Math.PI * 2;

function mallet(L: Float32Array, R: Float32Array, t0: number, f: number, amp: number, pan = 0, dec = 0.9) {
  const start = Math.floor(t0 * SR), len = Math.floor(dec * 3 * SR);
  for (let i = 0; i < len && start + i < L.length; i++) {
    const t = i / SR;
    const atk = Math.min(1, t / 0.004);
    const v = atk * amp * (Math.sin(TAU * f * t) * Math.exp(-t / dec) + 0.25 * Math.sin(TAU * f * 4.0 * t) * Math.exp(-t / (dec * 0.12)) + 0.08 * Math.sin(TAU * f * 9.9 * t) * Math.exp(-t / 0.02));
    L[start + i] += v * (1 - pan) * 0.5 + v * 0.5 * (pan < 0 ? 1 : 1 - pan);
    R[start + i] += v * (1 + pan) * 0.5 + v * 0.5 * (pan > 0 ? 1 : 1 + pan);
  }
}

// ── music ──
{
  const DUR = 61, n = DUR * SR;
  const L = new Float32Array(n), R = new Float32Array(n);
  const beat = 60 / 90;
  const bar = beat * 4;
  // Cmaj9 – Am7 – Fmaj7 – G(add9)/B... two bars each
  const chords = [
    [48, 55, 59, 62, 64], // C E G B D (voiced)
    [45, 52, 55, 60, 64], // Am7
    [41, 48, 52, 57, 60], // Fmaj7
    [43, 50, 55, 59, 62], // G
  ];
  const chordAt = (t: number) => chords[Math.floor(t / (bar * 2)) % 4];
  // pad (soft, filtered)
  let lpL = 0, lpR = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const seg = t / (bar * 2), local = (seg - Math.floor(seg)) * bar * 2;
    const ch = chordAt(t);
    const env = Math.min(1, local / 1.2) * Math.min(1, (bar * 2 - local) / 0.6 + 0.35);
    let sL = 0, sR = 0;
    for (let k = 1; k < ch.length; k++) {
      const f = midi(ch[k]);
      sL += Math.sin(TAU * f * 0.998 * t) + 0.35 * Math.sin(TAU * f * 2 * t + 0.3);
      sR += Math.sin(TAU * f * 1.002 * t) + 0.35 * Math.sin(TAU * f * 2 * t + 1.1);
    }
    const end = t > DUR - 4 ? Math.max(0, (DUR - 1 - t) / 3) : 1;
    const g = 0.05 * env * end * Math.min(1, t / 2.5);
    lpL += 0.06 * (sL * g - lpL); lpR += 0.06 * (sR * g - lpR);
    L[i] += lpL; R[i] += lpR;
    // bass on beats 1 and 3
    const bpos = (t % (beat * 2)) / (beat * 2);
    const bt = (t % (beat * 2));
    const bf = midi(ch[0] - 12);
    const bass = 0.16 * Math.sin(TAU * bf * t) * Math.exp(-bt / 0.9) * Math.min(1, bt / 0.01) * end * Math.min(1, t / 4);
    void bpos;
    L[i] += bass; R[i] += bass;
  }
  // mallet arpeggio, eighth notes, gently swung pattern, sparse at start
  const pattern = [1, 2, 3, 4, 3, 2, 4, 3];
  for (let t = bar * 1; t < DUR - 3; t += beat / 2) {
    const step = Math.round(t / (beat / 2)) % 8;
    if (t < bar * 3 && step % 2 === 1) continue; // sparser intro
    const ch = chordAt(t);
    const note = ch[pattern[step]] + 12;
    mallet(L, R, t + (step % 2 ? 0.02 : 0), midi(note), 0.085, step % 2 ? 0.35 : -0.35, 0.45);
  }
  // final resolving chord
  [60, 64, 67, 71, 74].forEach((m, k) => mallet(L, R, 56.0 + k * 0.06, midi(m), 0.1, (k - 2) * 0.2, 1.4));
  wav(join(OUT, 'music.wav'), L, R);
}

// ── click ──
{
  const n = Math.floor(0.12 * SR), L = new Float32Array(n), R = new Float32Array(n);
  let seed = 7, lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    seed = (seed * 16807) % 2147483647;
    const noise = (seed / 2147483647) * 2 - 1;
    lp += 0.35 * (noise - lp);
    const v = (0.6 * Math.sin(TAU * 1800 * t) * Math.exp(-t / 0.012) + 0.5 * lp * Math.exp(-t / 0.006));
    L[i] = v; R[i] = v;
  }
  wav(join(OUT, 'click.wav'), L, R);
}

// ── chime ──
{
  const n = Math.floor(2.5 * SR), L = new Float32Array(n), R = new Float32Array(n);
  mallet(L, R, 0, midi(76), 0.5, -0.2, 0.8);
  mallet(L, R, 0.11, midi(83), 0.4, 0.2, 0.9);
  wav(join(OUT, 'chime.wav'), L, R);
}
console.log('audio written to', OUT);
