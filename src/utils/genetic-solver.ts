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
    private mutationRate: number = 0.1;
    private population: Genome[] = [];

    constructor(students: Student[], layout: ClassroomLayout) {
        this.students = students;
        this.layout = layout;
    }

    // Initialize random population
    initialize(): void {
        this.population = [];
        for (let i = 0; i < this.populationSize; i++) {
            this.population.push(this.createRandomGenome());
        }
    }

    private createRandomGenome(): Genome {
        // Shuffle students
        const shuffled = [...this.students].sort(() => Math.random() - 0.5);
        const assignments: SeatingAssignment[] = [];

        // Assign to seats
        let studentIdx = 0;
        for (let r = 0; r < this.layout.rows; r++) {
            for (let c = 0; c < this.layout.cols; c++) {
                if (studentIdx < shuffled.length) {
                    assignments.push({
                        student: shuffled[studentIdx],
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

        // Elite preservation (keep top 2)
        this.population.sort((a, b) => b.fitness - a.fitness);
        if (this.population.length > 0) {
            newPopulation.push(this.population[0]);
            if (this.population.length > 1) newPopulation.push(this.population[1]);
        } else {
            // Safety if population somehow empty
            return { assignments: [], fitness: 0 };
        }

        // Fill rest
        while (newPopulation.length < this.populationSize) {
            const p1 = this.tournamentSelect();
            const p2 = this.tournamentSelect();
            const child = this.crossover(p1, p2);
            this.mutate(child);
            // Recalculate fitness
            child.fitness = calculateMetrics(child.assignments).overallScore;
            newPopulation.push(child);
        }
        this.population = newPopulation;

        // Return best of this generation
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
        // Extract student order from assignments (sorted by seat index to get linearized genome)
        const students1 = p1.assignments.sort((a, b) => a.seatIndex - b.seatIndex).map(a => a.student);

        const cut = Math.floor(Math.random() * students1.length);
        const childStudents = Array(students1.length).fill(null);

        // Copy first part from P1
        for (let i = 0; i < cut; i++) childStudents[i] = students1[i];

        // Fill rest from P2 (preserving P2's relative order for those not yet in child)
        const students2 = p2.assignments.sort((a, b) => a.seatIndex - b.seatIndex).map(a => a.student);
        let currentPos = cut;
        for (const s of students2) {
            if (!childStudents.includes(s)) {
                if (currentPos < childStudents.length) {
                    childStudents[currentPos] = s;
                    currentPos++;
                }
            }
        }

        // Reconstruct assignments
        const newAssignments: SeatingAssignment[] = [];
        let studentIdx = 0;
        for (let r = 0; r < this.layout.rows; r++) {
            for (let c = 0; c < this.layout.cols; c++) {
                if (studentIdx < childStudents.length && childStudents[studentIdx]) {
                    newAssignments.push({
                        student: childStudents[studentIdx],
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
            // Swap two random students
            const idx1 = Math.floor(Math.random() * genome.assignments.length);
            const idx2 = Math.floor(Math.random() * genome.assignments.length);

            const tempStudent = genome.assignments[idx1].student;
            genome.assignments[idx1].student = genome.assignments[idx2].student;
            genome.assignments[idx2].student = tempStudent;
        }
    }
}
