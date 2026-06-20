/**
 * Reproducible GA + NLP benchmarks for BİLSEM report.
 * Run: npx tsx scripts/run-benchmark.ts
 */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { ClassroomLayout, SeatingAssignment, Student } from '../src/types';
import { GeneticSolver } from '../src/utils/genetic-solver';
import { calculateMetrics, LayoutMetrics } from '../src/utils/scoring-utils';
import { parseNaturalLanguage } from '../src/utils/nlp-parser';
import { DEMO_STUDENTS, loadCsvStudents } from './benchmark-data';

const LAYOUT: ClassroomLayout = { rows: 5, cols: 6, seats: [] };
const GA_GENERATIONS = 80;
const RANDOM_TRIALS = 30;
const GA_TRIALS = 10;
const BASE_SEED = 20260619;

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function withSeed<T>(seed: number, fn: () => T): T {
  const orig = Math.random;
  Math.random = mulberry32(seed);
  try {
    return fn();
  } finally {
    Math.random = orig;
  }
}

function randomAssignments(students: Student[], layout: ClassroomLayout): SeatingAssignment[] {
  const shuffled = [...students].sort(() => Math.random() - 0.5);
  const assignments: SeatingAssignment[] = [];
  let idx = 0;
  for (let r = 0; r < layout.rows; r++) {
    for (let c = 0; c < layout.cols; c++) {
      if (idx < shuffled.length) {
        assignments.push({
          student: shuffled[idx],
          seatIndex: r * layout.cols + c,
          row: r,
          col: c,
        });
        idx++;
      }
    }
  }
  return assignments;
}

function runGa(students: Student[], seed: number): LayoutMetrics {
  return withSeed(seed, () => {
    const solver = new GeneticSolver(students, LAYOUT);
    solver.initialize();
    const best = solver.evolve(GA_GENERATIONS);
    return calculateMetrics(best.assignments);
  });
}

function avgMetrics(list: LayoutMetrics[]) {
  const keys: (keyof LayoutMetrics)[] = [
    'academicBalance',
    'socialCompatibility',
    'behavioralHarmony',
    'physicalAccessibility',
    'overallScore',
  ];
  const out: Record<string, number> = {};
  for (const k of keys) {
    out[k] = Math.round(list.reduce((s, m) => s + m[k], 0) / list.length);
  }
  return out as LayoutMetrics;
}

function benchmarkDataset(name: string, students: Student[]) {
  const randomRuns: LayoutMetrics[] = [];
  for (let i = 0; i < RANDOM_TRIALS; i++) {
    randomRuns.push(
      withSeed(BASE_SEED + i, () => calculateMetrics(randomAssignments(students, LAYOUT)))
    );
  }
  const gaRuns: LayoutMetrics[] = [];
  for (let i = 0; i < GA_TRIALS; i++) {
    gaRuns.push(runGa(students, BASE_SEED + 1000 + i * 17));
  }
  const randomAvg = avgMetrics(randomRuns);
  const gaAvg = avgMetrics(gaRuns);
  const gaBest = gaRuns.reduce((a, b) => (b.overallScore > a.overallScore ? b : a));
  return {
    name,
    studentCount: students.length,
    layout: '5×6',
    randomTrials: RANDOM_TRIALS,
    gaTrials: GA_TRIALS,
    gaGenerations: GA_GENERATIONS,
    random: randomAvg,
    gaAverage: gaAvg,
    gaBestRun: gaBest,
    improvementRatio: +(gaAvg.overallScore / (randomAvg.overallScore || 1)).toFixed(2),
  };
}

const NLP_CASES: Array<{
  text: string;
  expect: Partial<Pick<Student, 'academicLevel' | 'behaviorType' | 'movementNeeds' | 'visionNeeds'>>;
}> = [
  { text: 'Ali gürültücü ve hareketli.', expect: { behaviorType: 'disruptive', movementNeeds: 'high' } },
  { text: 'Elif sessiz ve başarılı.', expect: { behaviorType: 'quiet', academicLevel: 'high' } },
  { text: 'Mehmet lider.', expect: { behaviorType: 'leader' } },
  { text: 'Ayşe DEHB.', expect: { movementNeeds: 'high' } },
  { text: 'Can gözlük kullanıyor ön sırada oturmalı.', expect: { visionNeeds: 'front_required' } },
  { text: 'Zeynep zorlanıyor.', expect: { academicLevel: 'struggling' } },
  { text: 'Deniz 92 puan.', expect: { academicLevel: 'high' } },
  { text: 'Burak haylaz.', expect: { behaviorType: 'disruptive' } },
  { text: 'Selin sessiz.', expect: { behaviorType: 'quiet' } },
  { text: 'Emre kısa boylu.', expect: {} },
];

function benchmarkNlp() {
  let hits = 0;
  let total = 0;
  const details: Array<{ text: string; ok: boolean; got: string }> = [];
  for (const c of NLP_CASES) {
    const parsed = parseNaturalLanguage(c.text);
    if (parsed.length === 0) {
      details.push({ text: c.text, ok: false, got: 'parse failed' });
      continue;
    }
    const s = parsed[0];
    for (const [key, expected] of Object.entries(c.expect) as [keyof typeof c.expect, string][]) {
      total++;
      const ok = (s as any)[key] === expected;
      if (ok) hits++;
      details.push({
        text: `${c.text} [${key}]`,
        ok,
        got: String((s as any)[key]),
      });
    }
  }
  return {
    cases: NLP_CASES.length,
    attributesTested: total,
    correct: hits,
    accuracyPercent: total ? Math.round((hits / total) * 100) : 0,
    details,
  };
}

const results = {
  generatedAt: new Date().toISOString(),
  protocol: {
    randomBaseline: `${RANDOM_TRIALS} independent uniform random seat assignments`,
    ga: `${GA_TRIALS} runs × ${GA_GENERATIONS} generations, population 60, seed base ${BASE_SEED}`,
    layout: '5 rows × 6 columns',
  },
  datasets: [
    benchmarkDataset('test_students.csv', loadCsvStudents()),
    benchmarkDataset('demo_15_students', DEMO_STUDENTS),
  ],
  nlp: benchmarkNlp(),
};

const outPath = join(__dirname, 'benchmark-results.json');
writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
console.error(`\nSaved: ${outPath}`);
