/**
 * Generates src/data.json — the real content shown in the video.
 *
 * Seating: runs the app's own GeneticSolver + calculateMetrics
 * (../src/utils, imported read-only) on the app's demo class.
 * Kelebek + teams: mirror the algorithms in src/components/ExamMode.tsx and
 * src/components/TeamBuilder.tsx (they live inside React components, so the
 * logic is reproduced here verbatim rather than imported).
 *
 * Math.random is seeded so the render is reproducible.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Student, ClassroomLayout, SeatingAssignment } from '../../src/types';
import { GeneticSolver } from '../../src/utils/genetic-solver';
import { calculateMetrics } from '../../src/utils/scoring-utils';

// ── seeded RNG ──
function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
Math.random = mulberry32(20261126);

// Demo class — copied from loadDemoData() in src/app/app/page.tsx
const demoStudents: Student[] = [
  { id: 'd1', name: 'Ali', academicLevel: 'high', behaviorType: 'leader', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Mehmet'], avoidStudents: ['Burak'], learningStyle: 'visual', height: 'tall' },
  { id: 'd2', name: 'Elif', academicLevel: 'high', behaviorType: 'quiet', movementNeeds: 'low', specialNeeds: 'none', friends: ['Zeynep'], avoidStudents: [], learningStyle: 'readwrite', height: 'short' },
  { id: 'd3', name: 'Mehmet', academicLevel: 'above_average', behaviorType: 'active', movementNeeds: 'high', specialNeeds: 'adhd', friends: ['Ali'], avoidStudents: [], learningStyle: 'kinesthetic', height: 'average' },
  { id: 'd4', name: 'Ayşe', academicLevel: 'average', behaviorType: 'quiet', movementNeeds: 'low', specialNeeds: 'anxiety', friends: ['Fatma'], avoidStudents: ['Burak'], learningStyle: 'auditory' },
  { id: 'd5', name: 'Zeynep', academicLevel: 'struggling', behaviorType: 'quiet', movementNeeds: 'very_low', specialNeeds: 'none', friends: ['Elif'], avoidStudents: [], visionNeeds: 'front_required', height: 'short' },
  { id: 'd6', name: 'Can', academicLevel: 'above_average', behaviorType: 'active', movementNeeds: 'high', specialNeeds: 'none', friends: ['Burak'], avoidStudents: [], learningStyle: 'kinesthetic', height: 'tall' },
  { id: 'd7', name: 'Fatma', academicLevel: 'average', behaviorType: 'follower', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Ayşe'], avoidStudents: [], learningStyle: 'visual' },
  { id: 'd8', name: 'Ahmet', academicLevel: 'below_average', behaviorType: 'disruptive', movementNeeds: 'high', specialNeeds: 'none', friends: [], avoidStudents: ['Burak'], height: 'tall' },
  { id: 'd9', name: 'Selin', academicLevel: 'high', behaviorType: 'leader', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Defne'], avoidStudents: [], learningStyle: 'auditory' },
  { id: 'd10', name: 'Burak', academicLevel: 'below_average', behaviorType: 'disruptive', movementNeeds: 'high', specialNeeds: 'none', friends: ['Can'], avoidStudents: ['Ali', 'Ahmet'], height: 'average' },
  { id: 'd11', name: 'Defne', academicLevel: 'above_average', behaviorType: 'active', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Selin'], avoidStudents: [], learningStyle: 'visual', height: 'short' },
  { id: 'd12', name: 'Emre', academicLevel: 'struggling', behaviorType: 'quiet', movementNeeds: 'low', specialNeeds: 'vision', friends: [], avoidStudents: [], visionNeeds: 'front_required', height: 'short' },
  { id: 'd13', name: 'Yağmur', academicLevel: 'average', behaviorType: 'follower', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Fatma'], avoidStudents: [], learningStyle: 'readwrite' },
  { id: 'd14', name: 'Kerem', academicLevel: 'average', behaviorType: 'active', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Can'], avoidStudents: [], hearingNeeds: 'partial', height: 'average' },
  { id: 'd15', name: 'Nil', academicLevel: 'high', behaviorType: 'quiet', movementNeeds: 'low', specialNeeds: 'none', friends: ['Elif', 'Zeynep'], avoidStudents: [], learningStyle: 'readwrite', height: 'short' },
];

const ROWS = 3, COLS = 6;
const layout: ClassroomLayout = { rows: ROWS, cols: COLS, seats: [], windowSide: 'left', doorPosition: 'front-right' };

// "By hand": the roster dropped into seats in list order.
const naive: SeatingAssignment[] = demoStudents.map((s, i) => ({
  student: s, row: Math.floor(i / COLS), col: i % COLS, seatIndex: i,
} as SeatingAssignment));
const naiveMetrics = calculateMetrics(naive);

const solver = new GeneticSolver(demoStudents, layout);
solver.initialize();
const history: number[] = [solver.getBestGenome().fitness];
for (let g = 0; g < 60; g++) history.push(solver.evolve(1).fitness);
const best = solver.getBestGenome();
const bestMetrics = calculateMetrics(best.assignments);

const seat = (a: SeatingAssignment) => ({ id: a.student.id, row: a.row, col: a.col });

// ── Kelebek (mirrors ExamMode.runKelebek, kelebek pattern) ──
const getExamVersion = (row: number, col: number) => {
  const r = row % 2, c = col % 2;
  if (r === 0 && c === 0) return 'A';
  if (r === 0 && c === 1) return 'B';
  if (r === 1 && c === 0) return 'C';
  return 'D';
};
const examClasses: Record<string, string[]> = {
  '9-B': ['Yağmur Çetin', 'Kerem Kara', 'Nil Koç', 'Berk Kurt', 'Ece Özdemir', 'Mert Şimşek', 'İrem Polat', 'Onur Erdoğan', 'Su Güneş', 'Arda Tekin', 'Deniz Akın', 'Eylül Bulut', 'Kaan Ateş', 'Melis Yavuz', 'Tuna Uçar', 'Ada Yurt', 'Ege Tan', 'Lina Er', 'Rüzgar Ak', 'Sena Oral'],
  '10-A': ['Asya Korkmaz', 'Efe Bozkurt', 'Lara Keskin', 'Umut Tan', 'Nehir Sarı', 'Bora Çakır', 'İpek Coşkun', 'Alp Ünal', 'Duru Kaplan', 'Cem Yalçın', 'Eda Aksoy', 'Ozan Kalkan', 'Pelin Turan', 'Sarp Eren', 'Tuba Işık', 'Aras Bilgin', 'Beren Kaya', 'Çağan Uz', 'Derin Sel', 'Ela Kır'],
  '10-B': ['Barış Uslu', 'Cansu Kaya', 'Doruk Er', 'Esra Gök', 'Furkan Oral', 'Gizem Sevim', 'Hakan Tunç', 'Işıl Duman', 'Koray Süer', 'Leyla Aral', 'Mina Erol', 'Nazlı Çınar', 'Oğuz Peker', 'Rüya Ekin', 'Selim Ay', 'Taylan Ok', 'Yaren Su', 'Zafer Kaan', 'Ayla Nur', 'Bulut Eke'],
};
const rooms = [
  { id: 'r1', name: 'Salon 1', rows: 5, cols: 6 },
  { id: 'r2', name: 'Salon 2', rows: 5, cols: 6 },
];
type ExamSeat = { studentName: string; className: string; row: number; col: number; examVersion: string };
const allExam = Object.entries(examClasses).flatMap(([cn, list]) => list.map(n => ({ name: n, className: cn })));
const shuffled = [...allExam].sort(() => Math.random() - 0.5);
let idx = 0;
const roomResults = rooms.map(room => {
  const seats: ExamSeat[] = [];
  for (let r = 0; r < room.rows && idx < shuffled.length; r++)
    for (let c = 0; c < room.cols && idx < shuffled.length; c++) {
      seats.push({ studentName: shuffled[idx].name, className: shuffled[idx].className, row: r, col: c, examVersion: getExamVersion(r, c) });
      idx++;
    }
  return { room, seats };
});
// Before swaps: snapshot of room 1 for the "before" frame
const room1Before = roomResults[0].seats.map(s => ({ ...s }));
const near = (a: ExamSeat, b: ExamSeat) => Math.abs(a.row - b.row) <= 1 && Math.abs(a.col - b.col) <= 1;
for (const ra of roomResults) {
  for (let pass = 0; pass < 50; pass++) {
    for (let i = 0; i < ra.seats.length; i++) {
      const s1 = ra.seats[i];
      const hasConflict = ra.seats.some(s2 => s1 !== s2 && near(s1, s2) && s1.className === s2.className);
      if (!hasConflict) continue;
      const swapIdx = ra.seats.findIndex((s2, j) => {
        if (j === i) return false;
        const a = ra.seats.some(s3 => s3 !== s1 && s3 !== s2 && near(s1, s3) && s2.className === s3.className);
        const b = ra.seats.some(s3 => s3 !== s1 && s3 !== s2 && near(s2, s3) && s1.className === s3.className);
        return !a && !b;
      });
      if (swapIdx !== -1) {
        const t = { n: s1.studentName, c: s1.className };
        s1.studentName = ra.seats[swapIdx].studentName; s1.className = ra.seats[swapIdx].className;
        ra.seats[swapIdx].studentName = t.n; ra.seats[swapIdx].className = t.c;
      }
    }
  }
}
// Orthogonal neighbours (left/right/front/back) sharing a class
const sideConflicts = (seats: ExamSeat[]) => seats.filter(a => seats.some(b => a !== b && a.className === b.className && Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1)).length;

// ── Teams (mirrors TeamBuilder.generateTeams) ──
const academicRank = (l: string) => ({ high: 5, above_average: 4, average: 3, below_average: 2, struggling: 1 } as Record<string, number>)[l] ?? 3;
const sorted = [...demoStudents].sort((a, b) => academicRank(b.academicLevel) - academicRank(a.academicLevel));
const teamCount = 4;
const mixed: Student[][] = Array.from({ length: teamCount }, () => []);
sorted.forEach((s, i) => {
  const cycle = Math.floor(i / teamCount);
  let t = i % teamCount;
  if (cycle % 2 !== 0) t = teamCount - 1 - t;
  mixed[t].push(s);
});
const similar: Student[][] = Array.from({ length: teamCount }, (_, ti) =>
  sorted.slice(Math.floor((ti * sorted.length) / teamCount), Math.floor(((ti + 1) * sorted.length) / teamCount)));
const avg = (t: Student[]) => +(t.reduce((s, x) => s + academicRank(x.academicLevel), 0) / t.length).toFixed(2);

const out = {
  students: demoStudents.map(s => ({
    id: s.id, name: s.name, academicLevel: s.academicLevel, behaviorType: s.behaviorType,
    height: s.height ?? 'average', vision: s.visionNeeds === 'front_required' || s.specialNeeds === 'vision',
    hearing: !!s.hearingNeeds, specialNeeds: s.specialNeeds, friends: s.friends, avoid: s.avoidStudents,
  })),
  seating: {
    rows: ROWS, cols: COLS,
    naive: naive.map(seat), naiveMetrics,
    optimized: best.assignments.map(seat), optimizedMetrics: bestMetrics,
    history,
  },
  exam: {
    classes: Object.keys(examClasses).map(k => ({ name: k, count: examClasses[k].length })),
    rooms: rooms.map(r => ({ name: r.name, rows: r.rows, cols: r.cols })),
    room1Before, room1: roomResults[0].seats, room2: roomResults[1].seats,
    conflictsBefore: sideConflicts(room1Before), conflictsAfter: sideConflicts(roomResults[0].seats),
  },
  teams: {
    mixed: mixed.map(t => ({ ids: t.map(s => s.id), avg: avg(t) })),
    similar: similar.map(t => ({ ids: t.map(s => s.id), avg: avg(t) })),
  },
};
writeFileSync(join(__dirname, '../src/data.json'), JSON.stringify(out, null, 2));
console.log('naive', naiveMetrics, '\noptimized', bestMetrics, '\nexam conflicts', out.exam.conflictsBefore, '->', out.exam.conflictsAfter,
  '\nteams mixed', out.teams.mixed.map(t => t.avg), 'similar', out.teams.similar.map(t => t.avg));
console.log(best.assignments.map(a => `${a.student.name}@${a.row},${a.col}`).join(' '));
