import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { assignExamSeats, countConflicts } from './exam-seating';

const mulberry32 = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const makeClasses = (sizes: number[]) => sizes.map((n, k) => ({
  name: `C${k}`,
  students: Array.from({ length: n }, (_, i) => `C${k}-${i}`),
}));
const ROOMS = [{ rows: 5, cols: 6 }, { rows: 5, cols: 6 }];

describe('assignExamSeats', () => {
  it('seats 3 classes x 20 in two 5x6 rooms with no orthogonal same-class neighbours', () => {
    for (let seed = 1; seed <= 10; seed++) {
      const rooms = assignExamSeats(makeClasses([20, 20, 20]), ROOMS, mulberry32(seed));
      for (const seats of rooms) {
        assert.equal(seats.length, 30);
        assert.equal(countConflicts(seats).orthogonal, 0, `seed ${seed}`);
        // 20 = one unavoidable diagonal pair per 2x2 block; allow a little slack.
        assert.ok(countConflicts(seats).diagonal <= 24, `seed ${seed}`);
      }
    }
  });

  it('places every student exactly once on distinct seats', () => {
    const classes = makeClasses([17, 9, 25]);
    const rooms = assignExamSeats(classes, ROOMS, mulberry32(7));
    const names = rooms.flat().map(s => s.studentName).sort();
    assert.deepEqual(names, classes.flatMap(c => c.students).sort());
    for (const seats of rooms) {
      assert.equal(new Set(seats.map(s => `${s.row},${s.col}`)).size, seats.length);
    }
  });

  it('fills rooms in order and seats row by row when there are spare seats', () => {
    const rooms = assignExamSeats(makeClasses([10, 10, 7]), ROOMS, mulberry32(3));
    assert.equal(rooms[0].length, 27);
    assert.equal(rooms[1].length, 0);
    assert.ok(rooms[0].every(s => s.row * 6 + s.col < 27));
  });
});
