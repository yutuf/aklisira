// Reports same-class neighbour conflicts for the exam ("kelebek") seating,
// old algorithm vs new, for 3 classes x 20 students in two 5x6 rooms.
//
//   node --experimental-strip-types scripts/exam-seating-report.mts
//
// Exits non-zero if the new algorithm leaves any orthogonal conflict.

import { assignExamSeats, countConflicts, type PlacedStudent, type SeatingClass } from '../src/utils/exam-seating.ts';

const mulberry32 = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const classes: SeatingClass[] = ['5-A', '5-B', '5-C'].map(name => ({
  name,
  students: Array.from({ length: 20 }, (_, i) => `${name} #${i + 1}`),
}));
const rooms = [{ rows: 5, cols: 6 }, { rows: 5, cols: 6 }];

// The previous runKelebek(): shuffle, fill row by row, greedy swap pass that
// only accepts swaps leaving zero king-adjacent conflicts.
const legacy = (rng: () => number) => {
  const all = classes.flatMap(c => c.students.map(s => ({ name: s, className: c.name })));
  const shuffled = [...all].sort(() => rng() - 0.5);
  let idx = 0;
  const before: PlacedStudent[][] = [];
  const after: PlacedStudent[][] = [];
  for (const room of rooms) {
    const seats: PlacedStudent[] = [];
    for (let r = 0; r < room.rows && idx < shuffled.length; r++) {
      for (let c = 0; c < room.cols && idx < shuffled.length; c++) {
        seats.push({ studentName: shuffled[idx].name, className: shuffled[idx].className, row: r, col: c });
        idx++;
      }
    }
    before.push(seats.map(s => ({ ...s })));
    const near = (a: PlacedStudent, b: PlacedStudent) => Math.abs(a.row - b.row) <= 1 && Math.abs(a.col - b.col) <= 1;
    for (let pass = 0; pass < 50; pass++) {
      for (let i = 0; i < seats.length; i++) {
        const s1 = seats[i];
        if (!seats.some(s2 => s1 !== s2 && near(s1, s2) && s1.className === s2.className)) continue;
        const k = seats.findIndex((s2, j) => j !== i
          && !seats.some(s3 => s3 !== s1 && s3 !== s2 && near(s1, s3) && s2.className === s3.className)
          && !seats.some(s3 => s3 !== s1 && s3 !== s2 && near(s2, s3) && s1.className === s3.className));
        if (k !== -1) {
          [s1.studentName, seats[k].studentName] = [seats[k].studentName, s1.studentName];
          [s1.className, seats[k].className] = [seats[k].className, s1.className];
        }
      }
    }
    after.push(seats);
  }
  return { before, after };
};

// Seats with at least one same-class left/right/front/back neighbour.
const seatsWithOrthogonalNeighbour = (seats: PlacedStudent[]) => {
  const at = new Map(seats.map(s => [`${s.row},${s.col}`, s.className]));
  return seats.filter(s => [[0, 1], [0, -1], [1, 0], [-1, 0]]
    .some(([dr, dc]) => at.get(`${s.row + dr},${s.col + dc}`) === s.className)).length;
};

const render = (seats: PlacedStudent[]) => {
  const rows: string[] = [];
  for (let r = 0; r < 5; r++) {
    rows.push('    ' + Array.from({ length: 6 }, (_, c) =>
      seats.find(s => s.row === r && s.col === c)?.className.slice(-1) ?? '.').join(' '));
  }
  return rows.join('\n');
};

const SEEDS = 50;
const totals = { legacyBefore: 0, legacyAfter: 0, next: 0, nextWorst: 0, nextDiag: 0, legacySeatsAfter: 0 };
let sample: { legacyAfter: PlacedStudent[]; next: PlacedStudent[] } | null = null;

for (let seed = 1; seed <= SEEDS; seed++) {
  const { before, after } = legacy(mulberry32(seed));
  const next = assignExamSeats(classes, rooms, mulberry32(seed));
  for (let r = 0; r < rooms.length; r++) {
    totals.legacyBefore += countConflicts(before[r]).orthogonal;
    totals.legacyAfter += countConflicts(after[r]).orthogonal;
    totals.legacySeatsAfter += seatsWithOrthogonalNeighbour(after[r]);
    const c = countConflicts(next[r]);
    totals.next += c.orthogonal;
    totals.nextDiag += c.diagonal;
    totals.nextWorst = Math.max(totals.nextWorst, c.orthogonal);
    const mix = new Set(next[r].map(s => s.className)).size;
    if (next[r].length !== 30 || mix !== 3) throw new Error(`room ${r + 1} seed ${seed}: ${next[r].length} seats, ${mix} classes`);
  }
  if (seed === 1) sample = { legacyAfter: after[0], next: next[0] };
}

const perRoom = (x: number) => (x / (SEEDS * rooms.length)).toFixed(1);
console.log(`3 classes x 20 students, two 5x6 rooms, ${SEEDS} random seeds (averages per room)\n`);
console.log(`orthogonal same-class pairs   old, before swap pass: ${perRoom(totals.legacyBefore)}`);
console.log(`                              old, after swap pass:  ${perRoom(totals.legacyAfter)}`);
console.log(`                              new:                   ${perRoom(totals.next)}  (worst room: ${totals.nextWorst})`);
console.log(`seats with an orthogonal same-class neighbour, old after swap: ${perRoom(totals.legacySeatsAfter)} of 30`);
console.log(`diagonal same-class pairs, new: ${perRoom(totals.nextDiag)}\n`);
console.log(`Salon 1, seed 1 (A/B/C = class):\n  old\n${render(sample!.legacyAfter)}\n  new\n${render(sample!.next)}`);

if (totals.next > 0) {
  console.error('\nFAIL: new algorithm left orthogonal same-class neighbours');
  process.exit(1);
}
console.log('\nOK: 0 orthogonal same-class neighbours in every room');
