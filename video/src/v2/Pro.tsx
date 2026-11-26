import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { C } from '../theme';
import { SCENE, TOTAL_V2 } from './timeline';
import { ColdOpen } from './scenes/ColdOpen';
import { WebSolve } from './scenes/WebSolve';
import { ExamV2 } from './scenes/ExamV2';
import { TeamsV2 } from './scenes/TeamsV2';
import { EverydayV2, PrivacyV2, EndV2 } from './scenes/RestV2';

const ORDER: [keyof typeof SCENE, React.FC][] = [
  ['cold', ColdOpen], ['web', WebSolve], ['exam', ExamV2], ['teams', TeamsV2],
  ['every', EverydayV2], ['privacy', PrivacyV2], ['end', EndV2],
];

/** Pro cut: hard cuts on the beat, one soundtrack rendered to the same timeline. */
export const Pro: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    {ORDER.map(([k, Scene]) => (
      <Sequence key={k} from={SCENE[k].from} durationInFrames={SCENE[k].d}>
        <Scene />
      </Sequence>
    ))}
    <Audio
      src={staticFile('audio/pro-soundtrack.wav')}
      volume={f => interpolate(f, [0, 6, TOTAL_V2 - 12, TOTAL_V2], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
    />
  </AbsoluteFill>
);
