import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateMetrics } from './scoring-utils';
import { GeneticSolver } from './genetic-solver';
import { Student, ClassroomLayout, SeatingAssignment } from '../types';
import { DEMO_STUDENTS } from '../../scripts/benchmark-data';

const LAYOUT: ClassroomLayout = { rows: 5, cols: 6, seats: [] };

function makeAssignment(
  student: Student,
  row: number,
  col: number
): SeatingAssignment {
  return {
    student,
    row,
    col,
    seatIndex: row * LAYOUT.cols + col,
  };
}

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randomAssignments(students: Student[]): SeatingAssignment[] {
  const shuffled = [...students].sort(() => Math.random() - 0.5);
  const assignments: SeatingAssignment[] = [];
  let idx = 0;
  for (let r = 0; r < LAYOUT.rows; r++) {
    for (let c = 0; c < LAYOUT.cols; c++) {
      if (idx < shuffled.length) {
        assignments.push(makeAssignment(shuffled[idx], r, c));
        idx++;
      }
    }
  }
  return assignments;
}

describe('calculateMetrics', () => {
  it('penalizes adjacent avoid pairs', () => {
    const ali: Student = {
      id: '1',
      name: 'Ali',
      academicLevel: 'average',
      behaviorType: 'quiet',
      movementNeeds: 'low',
      specialNeeds: 'none',
      friends: [],
      avoidStudents: ['Burak'],
    };
    const burak: Student = {
      id: '2',
      name: 'Burak',
      academicLevel: 'average',
      behaviorType: 'disruptive',
      movementNeeds: 'high',
      specialNeeds: 'none',
      friends: [],
      avoidStudents: ['Ali'],
    };

    const bad = calculateMetrics([
      makeAssignment(ali, 0, 0),
      makeAssignment(burak, 0, 1),
    ]);
    const good = calculateMetrics([
      makeAssignment(ali, 0, 0),
      makeAssignment(burak, 2, 2),
    ]);

    assert.ok(bad.socialCompatibility < good.socialCompatibility);
    assert.ok(bad.overallScore < good.overallScore);
  });

  it('penalizes disruptive neighbor clusters', () => {
    const d1: Student = {
      id: '1',
      name: 'D1',
      academicLevel: 'average',
      behaviorType: 'disruptive',
      movementNeeds: 'high',
      specialNeeds: 'none',
      friends: [],
      avoidStudents: [],
    };
    const d2: Student = {
      id: '2',
      name: 'D2',
      academicLevel: 'average',
      behaviorType: 'disruptive',
      movementNeeds: 'high',
      specialNeeds: 'none',
      friends: [],
      avoidStudents: [],
    };
    const q: Student = {
      id: '3',
      name: 'Q',
      academicLevel: 'average',
      behaviorType: 'quiet',
      movementNeeds: 'low',
      specialNeeds: 'none',
      friends: [],
      avoidStudents: [],
    };

    const clustered = calculateMetrics([
      makeAssignment(d1, 0, 0),
      makeAssignment(d2, 0, 1),
      makeAssignment(q, 1, 0),
    ]);
    const spread = calculateMetrics([
      makeAssignment(d1, 0, 0),
      makeAssignment(d2, 3, 3),
      makeAssignment(q, 1, 0),
    ]);

    assert.ok(clustered.behavioralHarmony < spread.behavioralHarmony);
  });

  it('GA beats random baseline on demo data', () => {
    const orig = Math.random;
    Math.random = mulberry32(20260619);
    try {
      const randomScore = calculateMetrics(randomAssignments(DEMO_STUDENTS)).overallScore;

      Math.random = mulberry32(20260619 + 1000);
      const solver = new GeneticSolver(DEMO_STUDENTS, LAYOUT);
      solver.initialize();
      solver.evolve(80);
      const gaScore = calculateMetrics(solver.getBestGenome().assignments).overallScore;

      assert.ok(gaScore > randomScore + 15, `GA ${gaScore} should beat random ${randomScore}`);
    } finally {
      Math.random = orig;
    }
  });
});
