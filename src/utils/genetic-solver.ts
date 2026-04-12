import { Student, ClassroomLayout, SeatingAssignment } from '../types';
import { calculateMetrics } from './scoring-utils';

interface Genome {
    assignments: SeatingAssignment[];
    fitness: number;
}

export class GeneticSolver {
    private students: Student[];
    private layout: ClassroomLayout;
    private populationSize: number = 50;
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

        // Build ordered list: front-required → short → rest → tall
        const ordered = [...frontRequired, ...shortStudents, ...rest, ...tallStudents];

        const assignments: SeatingAssignment[] = [];
        let studentIdx = 0;
        for (let r = 0; r < this.layout.rows; r++) {
            for (let c = 0; c < this.layout.cols; c++) {
                if (studentIdx < ordered.length) {
                    assignments.push({
                        student: ordered[studentIdx],
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
        if (Math.random() < this.mutationRate) {
            const idx1 = Math.floor(Math.random() * genome.assignments.length);
            const idx2 = Math.floor(Math.random() * genome.assignments.length);

            // Check if swap violates hard constraints
            const s1 = genome.assignments[idx1].student;
            const s2 = genome.assignments[idx2].student;
            const r1 = genome.assignments[idx1].row;
            const r2 = genome.assignments[idx2].row;

            const needsFront = (s: Student) =>
                s.visionNeeds === 'front_required' || s.hearingNeeds === 'front_required' ||
                s.specialNeeds === 'vision' || s.specialNeeds === 'hearing';

            // Don't swap front-required students to back rows
            if (needsFront(s1) && r2 > 1) return;
            if (needsFront(s2) && r1 > 1) return;

            genome.assignments[idx1].student = s2;
            genome.assignments[idx2].student = s1;
        }
    }
}
