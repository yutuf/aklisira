// Exam-room seating ("kelebek"): spread students over rooms and seats so that
// students from the same class do not sit next to each other.
//
// Kept free of React and path aliases so it can be run directly by
// scripts/exam-seating-report.ts with Node's type stripping.

export interface SeatingClass {
  name: string;
  students: string[];
}

export interface SeatingRoom {
  rows: number;
  cols: number;
}

export interface PlacedStudent {
  studentName: string;
  className: string;
  row: number;
  col: number;
}

type Rng = () => number;

// Same-class pairs cost this much when they sit left/right/front/back of each
// other, and 1 when they sit diagonally. Orthogonal neighbours are the ones
// that can read each other's paper, so they dominate; diagonals are only a
// tie-breaker (with 3 classes they cannot all be avoided).
const ORTHOGONAL_WEIGHT = 10;
const DIAGONAL_WEIGHT = 1;

const shuffle = <T,>(items: T[], rng: Rng): T[] => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Interleave all students so every class is spread evenly along the list:
 * at each step pick the class that is furthest behind its fair share. Any
 * contiguous slice (one room's worth) then has roughly the global class mix.
 */
const interleaveByClass = (classes: SeatingClass[], rng: Rng) => {
  const pools = shuffle(classes, rng)
    .filter(c => c.students.length > 0)
    .map(c => ({ name: c.name, queue: shuffle(c.students, rng), taken: 0, size: c.students.length }));
  const out: { name: string; className: string }[] = [];
  const total = pools.reduce((s, p) => s + p.size, 0);
  while (out.length < total) {
    let best: (typeof pools)[number] | null = null;
    let bestKey = Infinity;
    for (const p of pools) {
      if (p.taken >= p.size) continue;
      const key = (p.taken + 1) / p.size;
      if (key < bestKey) { bestKey = key; best = p; }
    }
    out.push({ name: best!.queue[best!.taken], className: best!.name });
    best!.taken++;
  }
  return out;
};

/** Same-class neighbour pairs among placed seats. */
export const countConflicts = (seats: PlacedStudent[]) => {
  const at = new Map<string, string>();
  for (const s of seats) at.set(`${s.row},${s.col}`, s.className);
  let orthogonal = 0;
  let diagonal = 0;
  for (const s of seats) {
    // Look only "forward" so each pair is counted once.
    if (at.get(`${s.row},${s.col + 1}`) === s.className) orthogonal++;
    if (at.get(`${s.row + 1},${s.col}`) === s.className) orthogonal++;
    if (at.get(`${s.row + 1},${s.col - 1}`) === s.className) diagonal++;
    if (at.get(`${s.row + 1},${s.col + 1}`) === s.className) diagonal++;
  }
  return { orthogonal, diagonal };
};

/**
 * Reorder students among a fixed set of seats to minimise same-class
 * adjacency, using simulated annealing over pairwise swaps.
 */
const optimiseRoom = (
  positions: { row: number; col: number }[],
  students: { name: string; className: string }[],
  rng: Rng,
): PlacedStudent[] => {
  const n = positions.length;
  if (n < 2) {
    return positions.map((p, i) => ({ ...p, studentName: students[i].name, className: students[i].className }));
  }

  // Neighbour lists with weights.
  const index = new Map<string, number>();
  positions.forEach((p, i) => index.set(`${p.row},${p.col}`, i));
  const nbrs: { j: number; w: number }[][] = positions.map(p => {
    const list: { j: number; w: number }[] = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const j = index.get(`${p.row + dr},${p.col + dc}`);
        if (j !== undefined) list.push({ j, w: dr === 0 || dc === 0 ? ORTHOGONAL_WEIGHT : DIAGONAL_WEIGHT });
      }
    }
    return list;
  });

  // Class ids per seat; start from the interleaved order laid out along
  // anti-diagonals, which already separates classes fairly well.
  const classIds = new Map<string, number>();
  for (const s of students) if (!classIds.has(s.className)) classIds.set(s.className, classIds.size);
  const diagonalOrder = positions
    .map((p, i) => i)
    .sort((a, b) => (positions[a].row + positions[a].col) - (positions[b].row + positions[b].col) || positions[a].row - positions[b].row);
  const order: number[] = new Array(n); // order[seat] = student index
  diagonalOrder.forEach((seat, k) => { order[seat] = k; });

  const cls = order.map(k => classIds.get(students[k].className)!);

  // Cost of seat i if it held class c, ignoring seat `skip`.
  const local = (i: number, c: number, skip: number) => {
    let sum = 0;
    for (const { j, w } of nbrs[i]) if (j !== skip && cls[j] === c) sum += w;
    return sum;
  };
  const totalCost = () => {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += local(i, cls[i], -1);
    return sum / 2;
  };

  let cost = totalCost();
  let bestCost = cost;
  let bestOrder = [...order];

  const iterations = 3000 * n;
  const tStart = 3;
  const tEnd = 0.05;
  for (let it = 0; it < iterations && bestCost > 0; it++) {
    const i = Math.floor(rng() * n);
    const j = Math.floor(rng() * n);
    const ci = cls[i];
    const cj = cls[j];
    if (ci === cj) continue;
    const delta = local(i, cj, j) + local(j, ci, i) - local(i, ci, j) - local(j, cj, i);
    const t = tStart * Math.pow(tEnd / tStart, it / iterations);
    if (delta <= 0 || rng() < Math.exp(-delta / t)) {
      cls[i] = cj; cls[j] = ci;
      [order[i], order[j]] = [order[j], order[i]];
      cost += delta;
      if (cost < bestCost) { bestCost = cost; bestOrder = [...order]; }
    }
  }

  return positions.map((p, i) => ({
    row: p.row,
    col: p.col,
    studentName: students[bestOrder[i]].name,
    className: students[bestOrder[i]].className,
  }));
};

/**
 * Assign every student to a room and seat. Rooms are filled in order, seats
 * row by row (the same seats the old algorithm used); within each room the
 * students are arranged to avoid same-class neighbours.
 */
export const assignExamSeats = (
  classes: SeatingClass[],
  rooms: SeatingRoom[],
  rng: Rng = Math.random,
): PlacedStudent[][] => {
  const queue = interleaveByClass(classes, rng);
  let next = 0;
  return rooms.map(room => {
    const positions: { row: number; col: number }[] = [];
    for (let r = 0; r < room.rows && next + positions.length < queue.length; r++) {
      for (let c = 0; c < room.cols && next + positions.length < queue.length; c++) {
        positions.push({ row: r, col: c });
      }
    }
    const students = queue.slice(next, next + positions.length);
    next += positions.length;
    return optimiseRoom(positions, students, rng);
  });
};
