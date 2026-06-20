import { Student, ClassroomLayout, SeatingAssignment } from '../types';
import { calculateMetrics } from './scoring-utils';

interface Genome {
    assignments: SeatingAssignment[];
    fitness: number;
}

const NEIGHBOR_DIST = 1.5;

export class GeneticSolver {
    private students: Student[];
    private layout: ClassroomLayout;
    private populationSize: number = 60;
    private mutationRate: number = 0.15;
    private population: Genome[] = [];

    constructor(students: Student[], layout: ClassroomLayout) {
        this.students = students;
        this.layout = layout;
    }

    initialize(): void {
        this.population = [];
        for (let i = 0; i < this.populationSize; i++) {
            this.population.push(this.createSmartGenome());
        }
    }

    // Smart genome creation that respects physical constraints from the start
    private createSmartGenome(): Genome {
        const shuffled = [...this.students];

        // Separate students with hard front-row constraints
        const frontRequired: Student[] = [];
        const shortStudents: Student[] = [];
        const tallStudents: Student[] = [];
        const rest: Student[] = [];

        shuffled.forEach(s => {
            if (s.visionNeeds === 'front_required' || s.hearingNeeds === 'front_required' ||
                s.specialNeeds === 'vision' || s.specialNeeds === 'hearing') {
                frontRequired.push(s);
            } else if (s.height === 'short') {
                shortStudents.push(s);
            } else if (s.height === 'tall') {
                tallStudents.push(s);
            } else {
                rest.push(s);
            }
        });

        // Shuffle within groups for randomness
        const shuffle = (arr: Student[]) => arr.sort(() => Math.random() - 0.5);
        shuffle(frontRequired);
        shuffle(shortStudents);
        shuffle(rest);
        shuffle(tallStudents);

        const spreadDisruptive = (list: Student[]): Student[] => {
            const disrupt = list.filter(s => s.behaviorType === 'disruptive');
            const others = list.filter(s => s.behaviorType !== 'disruptive');
            if (disrupt.length <= 1) return list;
            const out: Student[] = [];
            let di = 0;
            for (let i = 0; i < others.length; i++) {
                out.push(others[i]);
                if (di < disrupt.length && i % Math.max(1, Math.floor(others.length / disrupt.length)) === 0) {
                    out.push(disrupt[di++]);
                }
            }
            while (di < disrupt.length) out.push(disrupt[di++]);
            return out;
        };

        const separateAvoidPairs = (list: Student[]): Student[] => {
            const result = [...list];
            const nameIndex = new Map(result.map((s, i) => [s.name, i]));
            for (let pass = 0; pass < 3; pass++) {
                for (const s of result) {
                    for (const avoidName of s.avoidStudents) {
                        const avoidIdx = nameIndex.get(avoidName);
                        const sIdx = nameIndex.get(s.name);
                        if (avoidIdx === undefined || sIdx === undefined) continue;
                        if (Math.abs(avoidIdx - sIdx) <= 1) {
                            const swapIdx = Math.min(result.length - 1, sIdx + 3 + Math.floor(Math.random() * 4));
                            if (swapIdx !== sIdx && swapIdx !== avoidIdx) {
                                [result[sIdx], result[swapIdx]] = [result[swapIdx], result[sIdx]];
                                nameIndex.set(result[sIdx].name, sIdx);
                                nameIndex.set(result[swapIdx].name, swapIdx);
                            }
                        }
                    }
                }
            }
            return result;
        };

        const ordered = separateAvoidPairs(
            spreadDisruptive([...frontRequired, ...shortStudents, ...rest, ...tallStudents])
        );

        const clusterFriends = (list: Student[]): Student[] => {
            let result = [...list];
            for (let pass = 0; pass < 2; pass++) {
                const nameIndex = new Map(result.map((s, i) => [s.name, i]));
                for (const s of result) {
                    for (const friendName of s.friends) {
                        const fIdx = nameIndex.get(friendName);
                        const sIdx = nameIndex.get(s.name);
                        if (fIdx === undefined || sIdx === undefined) continue;
                        if (Math.abs(fIdx - sIdx) === 1) continue;
                        const target = sIdx + (Math.random() < 0.5 ? 1 : -1);
                        if (target >= 0 && target < result.length && target !== fIdx) {
                            [result[target], result[fIdx]] = [result[fIdx], result[target]];
                            nameIndex.set(result[target].name, target);
                            nameIndex.set(result[fIdx].name, fIdx);
                        }
                    }
                }
            }
            return result;
        };

        const finalOrder = clusterFriends(ordered);

        const assignments: SeatingAssignment[] = [];
        let studentIdx = 0;
        for (let r = 0; r < this.layout.rows; r++) {
            for (let c = 0; c < this.layout.cols; c++) {
                if (studentIdx < finalOrder.length) {
                    assignments.push({
                        student: finalOrder[studentIdx],
                        seatIndex: r * this.layout.cols + c,
                        row: r,
                        col: c
                    });
                    studentIdx++;
                }
            }
        }

        return {
            assignments,
            fitness: calculateMetrics(assignments).overallScore
        };
    }

    nextGeneration(): Genome {
        const newPopulation: Genome[] = [];

        this.population.sort((a, b) => b.fitness - a.fitness);
        if (this.population.length > 0) {
            newPopulation.push(this.population[0]);
            if (this.population.length > 1) newPopulation.push(this.population[1]);
        } else {
            return { assignments: [], fitness: 0 };
        }

        while (newPopulation.length < this.populationSize) {
            const p1 = this.tournamentSelect();
            const p2 = this.tournamentSelect();
            const child = this.crossover(p1, p2);
            this.mutate(child);
            child.fitness = calculateMetrics(child.assignments).overallScore;
            newPopulation.push(child);
        }
        this.population = newPopulation;

        this.population.sort((a, b) => b.fitness - a.fitness);
        return this.population[0];
    }

    evolve(generations: number = 1): Genome {
        for (let g = 0; g < generations; g++) {
            this.nextGeneration();
        }
        return this.population[0];
    }

    getBestGenome(): Genome {
        return [...this.population].sort((a, b) => b.fitness - a.fitness)[0];
    }

    private tournamentSelect(): Genome {
        const k = 3;
        let best = this.population[Math.floor(Math.random() * this.population.length)];
        for (let i = 0; i < k - 1; i++) {
            const ind = this.population[Math.floor(Math.random() * this.population.length)];
            if (ind.fitness > best.fitness) best = ind;
        }
        return best;
    }

    private crossover(p1: Genome, p2: Genome): Genome {
        const students1 = [...p1.assignments].sort((a, b) => a.seatIndex - b.seatIndex).map(a => a.student);
        const cut = Math.floor(Math.random() * students1.length);
        const childStudents: (Student | null)[] = Array(students1.length).fill(null);

        for (let i = 0; i < cut; i++) childStudents[i] = students1[i];

        const students2 = [...p2.assignments].sort((a, b) => a.seatIndex - b.seatIndex).map(a => a.student);
        let currentPos = cut;
        for (const s of students2) {
            if (!childStudents.includes(s)) {
                if (currentPos < childStudents.length) {
                    childStudents[currentPos] = s;
                    currentPos++;
                }
            }
        }

        const newAssignments: SeatingAssignment[] = [];
        let studentIdx = 0;
        for (let r = 0; r < this.layout.rows; r++) {
            for (let c = 0; c < this.layout.cols; c++) {
                if (studentIdx < childStudents.length && childStudents[studentIdx]) {
                    newAssignments.push({
                        student: childStudents[studentIdx]!,
                        seatIndex: r * this.layout.cols + c,
                        row: r,
                        col: c
                    });
                    studentIdx++;
                }
            }
        }

        return { assignments: newAssignments, fitness: 0 };
    }

    private mutate(genome: Genome): void {
        if (Math.random() < 0.14) {
            const assignments = genome.assignments;
            for (const a of assignments) {
                for (const friendName of a.student.friends) {
                    const friendAssign = assignments.find(x => x.student.name === friendName);
                    if (!friendAssign) continue;
                    const dist = Math.hypot(a.row - friendAssign.row, a.col - friendAssign.col);
                    if (dist <= NEIGHBOR_DIST) continue;
                    const emptyIdx = assignments.findIndex(x =>
                        x !== a && x !== friendAssign &&
                        Math.hypot(x.row - a.row, x.col - a.col) <= NEIGHBOR_DIST
                    );
                    if (emptyIdx >= 0) {
                        const tmp = assignments[emptyIdx].student;
                        assignments[emptyIdx].student = friendAssign.student;
                        friendAssign.student = tmp;
                        return;
                    }
                }
            }
        }

        if (Math.random() < this.mutationRate) {
            const idx1 = Math.floor(Math.random() * genome.assignments.length);
            const idx2 = Math.floor(Math.random() * genome.assignments.length);

            const s1 = genome.assignments[idx1].student;
            const s2 = genome.assignments[idx2].student;
            const r1 = genome.assignments[idx1].row;
            const r2 = genome.assignments[idx2].row;

            const needsFront = (s: Student) =>
                s.visionNeeds === 'front_required' || s.hearingNeeds === 'front_required' ||
                s.specialNeeds === 'vision' || s.specialNeeds === 'hearing';

            if (needsFront(s1) && r2 > 1) return;
            if (needsFront(s2) && r1 > 1) return;

            const wouldCreateAvoid = (a: Student, b: Student, rowA: number, rowB: number) => {
                const dist = Math.hypot(rowA - rowB, genome.assignments[idx1].col - genome.assignments[idx2].col);
                if (dist > 1.5) return false;
                return a.avoidStudents.includes(b.name) || b.avoidStudents.includes(a.name);
            };
            if (wouldCreateAvoid(s1, s2, r2, r1)) return;

            genome.assignments[idx1].student = s2;
            genome.assignments[idx2].student = s1;
        }
    }
}
