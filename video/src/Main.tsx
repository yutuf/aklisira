import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { Hook } from './scenes/Hook';
import { Title } from './scenes/Title';
import { Roster } from './scenes/Roster';
import { Seating } from './scenes/Seating';
import { Layouts } from './scenes/Layouts';
import { Exam } from './scenes/Exam';
import { Teams } from './scenes/Teams';
import { Everyday } from './scenes/Everyday';
import { Privacy } from './scenes/Privacy';
import { End } from './scenes/End';
import { C } from './theme';

export const SCENES = [
  { C: Hook, d: 200 },
  { C: Title, d: 100 },
  { C: Roster, d: 150 },
  { C: Seating, d: 360 },
  { C: Layouts, d: 100 },
  { C: Exam, d: 300 },
  { C: Teams, d: 240 },
  { C: Everyday, d: 130 },
  { C: Privacy, d: 170 },
  { C: End, d: 150 },
];
export const T = 14; // transition length
// Hook→Title is a hard cut (cards are in the same place), the rest cross-fade/slide.
const PRES = [null, 'fade', 'slide', 'fade', 'slide', 'slide', 'fade', 'slide', 'fade'] as const;
export const TOTAL = SCENES.reduce((s, x) => s + x.d, 0) - PRES.filter(Boolean).length * T;

// Absolute start frame of each scene (transitions overlap neighbours).
const STARTS = SCENES.reduce<number[]>((acc, x, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].d - (PRES[i - 1] ? T : 0));
  return acc;
}, []);
// [scene index, local frame] of each on-screen button press.
const CLICKS: [number, number][] = [[2, 34], [3, 50], [5, 44], [6, 40], [6, 146], [8, 44]];
const CHIMES: [number, number][] = [[1, 2], [9, 4]];

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Audio
      src={staticFile('audio/music.wav')}
      volume={f => interpolate(f, [0, 20, TOTAL - 45, TOTAL - 5], [0, 0.55, 0.55, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
    />
    {CLICKS.map(([s, f], i) => (
      <Sequence key={`c${i}`} from={STARTS[s] + f} durationInFrames={10}>
        <Audio src={staticFile('audio/click.wav')} volume={0.5} />
      </Sequence>
    ))}
    {CHIMES.map(([s, f], i) => (
      <Sequence key={`h${i}`} from={STARTS[s] + f} durationInFrames={70}>
        <Audio src={staticFile('audio/chime.wav')} volume={0.4} />
      </Sequence>
    ))}
    <TransitionSeries>
      {SCENES.map(({ C: Scene, d }, i) => (
        <React.Fragment key={i}>
          <TransitionSeries.Sequence durationInFrames={d}>
            <Scene />
          </TransitionSeries.Sequence>
          {i < PRES.length && PRES[i] && (
            <TransitionSeries.Transition
              presentation={PRES[i] === 'slide' ? slide({ direction: 'from-right' }) : fade()}
              timing={linearTiming({ durationInFrames: T })}
            />
          )}
        </React.Fragment>
      ))}
    </TransitionSeries>
  </AbsoluteFill>
);
