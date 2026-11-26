# AklıSıra demo video (Remotion)

A ~60 s, 1920×1080, 30 fps promo for AklıSıra. English captions, Turkish UI.
Lives in its own package so the Next.js app's dependencies and build are untouched.

The app screens are **redesigned as React scenes** (not screenshots), using the
app's colour tokens from `src/app/globals.css` and the same fonts (Fraunces + Nunito).
The content is real: `scripts/gen-data.ts` runs the app's own `GeneticSolver` and
`calculateMetrics` on the demo class (seeded, reproducible) and mirrors the kelebek
and team-builder logic from `ExamMode.tsx` / `TeamBuilder.tsx`.

## Pro cut (v2): `src/v2/`
50 s, cut on the beat (100 bpm, 18 frames per beat), rendered from one source in two formats:
`AklisiraPro` (1920×1080) and `AklisiraProVertical` (1080×1920), plus the `AklisiraThumbnail` still.

1. Cold open: four real rules from the demo class (Burak/Ali, Zeynep front row, Elif/Nil, Ahmet/Burak)
2. The puzzle: 1,067,062,284,288,000 possible plans (18!/3!: 15 students in 18 desks), drawn as a constraint web
3. The solve (music drop): the web collapses into the optimized grid, 43% → 90%, then the camera pulls back to reveal the app
4. Callouts, then the same class morphing through the layouts
5. Kelebek exam, 6. Teams (balanced → by level), 7. Everyday tools, 8. Privacy, 9. End card

Scenes draw the app window in its own 1080×880 "stage" space (`src/v2/layout.tsx`), so the same
code lays out for 16:9 and 9:16. `src/v2/timeline.ts` drives both the picture and
`scripts/gen-audio-v2.ts`, which synthesises the whole soundtrack (pad, bass, soft kit, riser,
landing notes, clicks, whooshes) against the frame timeline.

## First cut (v1) scenes
1. Hook: hours of planning by hand
2. Title
3. Class roster (demo data)
4. Smart seating: list order 43% → optimized 90% over 60 generations, with callouts
5. Five layout types
6. Kelebek exam seating: 3 classes, 2 rooms, A/B/C/D booklets
7. Team builder: balanced vs similar levels
8. Attendance, timetable, parent meetings
9. Privacy: browser storage, privacy mode, data notice
10. End card: aklisira.com

## Commands
```bash
npm install
npm run data     # regenerate src/data.json from the app's algorithms
npm run audio    # synthesise public/audio/*.wav (also runs automatically before render)
npm run studio   # preview
npm run render       # v1 -> out/aklisira-demo.mp4
npm run render:pro   # v2 -> 16:9, 9:16 and thumbnail in out/
```
Rendering uses the system Chromium headless shell configured in `remotion.config.ts`
(`/opt/pw-browsers/chromium_headless_shell`); remove that line to let Remotion download its own.

`renders/` holds the current renders: v1 (`aklisira-demo.mp4`) and the Pro cut (`aklisira-pro-16x9.mp4`, `aklisira-pro-9x16.mp4`, `aklisira-thumbnail.png`).
