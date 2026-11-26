# AklıSıra demo video (Remotion)

A ~60 s, 1920×1080, 30 fps promo for AklıSıra. English captions, Turkish UI.
Lives in its own package so the Next.js app's dependencies and build are untouched.

The app screens are **redesigned as React scenes** (not screenshots), using the
app's colour tokens from `src/app/globals.css` and the same fonts (Fraunces + Nunito).
The content is real: `scripts/gen-data.ts` runs the app's own `GeneticSolver` and
`calculateMetrics` on the demo class (seeded, reproducible) and mirrors the kelebek
and team-builder logic from `ExamMode.tsx` / `TeamBuilder.tsx`.

## Scenes
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
npm run render   # -> out/aklisira-demo.mp4
```
Rendering uses the system Chromium headless shell configured in `remotion.config.ts`
(`/opt/pw-browsers/chromium_headless_shell`); remove that line to let Remotion download its own.

`renders/aklisira-demo.mp4` is the current render (~10 MB).
