import React from 'react';
import { Composition, Still, staticFile, continueRender, delayRender } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { Main, TOTAL } from './Main';
import { Pro } from './v2/Pro';
import { Thumbnail } from './v2/Thumbnail';
import { TOTAL_V2 } from './v2/timeline';

// Fraunces + Nunito (variable), latin + latin-ext so Turkish glyphs render.
const fonts = [
  { family: 'Fraunces', file: 'fraunces-latin-opsz-normal.woff2', range: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD' },
  { family: 'Fraunces', file: 'fraunces-latin-ext-opsz-normal.woff2', range: 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF' },
  { family: 'Nunito', file: 'nunito-latin-wght-normal.woff2', range: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD' },
  { family: 'Nunito', file: 'nunito-latin-ext-wght-normal.woff2', range: 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF' },
];
const handle = delayRender('fonts');
Promise.all(
  fonts.map(f => loadFont({ family: f.family, url: staticFile(`fonts/${f.file}`), weight: '100 900', unicodeRange: f.range, format: 'woff2-variations' as never })),
).then(() => continueRender(handle));

export const Root: React.FC = () => (
  <>
    <Composition id="AklisiraDemo" component={Main} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="AklisiraPro" component={Pro} durationInFrames={TOTAL_V2} fps={30} width={1920} height={1080} />
    <Composition id="AklisiraProVertical" component={Pro} durationInFrames={TOTAL_V2} fps={30} width={1080} height={1920} />
    <Still id="AklisiraThumbnail" component={Thumbnail} width={1920} height={1080} />
  </>
);
