import { SeatingAssignment, Student } from '../types';
import { getAcademicScore, calculateCompatibility } from './student-utils';

export interface LayoutMetrics {
    academicBalance: number;
    socialCompatibility: number;
    behavioralHarmony: number;
    physicalAccessibility: number;
    overallScore: number;
}

const NEIGHBOR_DIST = 1.5;

function neighborPairs(assignments: SeatingAssignment[]): [SeatingAssignment, SeatingAssignment][] {
    const pairs: [SeatingAssignment, SeatingAssignment][] = [];
    for (let i = 0; i < assignments.length; i++) {
        for (let j = i + 1; j < assignments.length; j++) {
            const a1 = assignments[i];
            const a2 = assignments[j];
            const dist = Math.hypot(a1.row - a2.row, a1.col - a2.col);
            if (dist <= NEIGHBOR_DIST) pairs.push([a1, a2]);
        }
    }
    return pairs;
}

function areNeighbors(a: SeatingAssignment, b: SeatingAssignment): boolean {
    return Math.hypot(a.row - b.row, a.col - b.col) <= NEIGHBOR_DIST;
}

function collectFriendPairs(students: Student[]): [string, string][] {
    const pairs: [string, string][] = [];
    const seen = new Set<string>();
    for (const s of students) {
        for (const friend of s.friends) {
            const key = [s.name, friend].sort().join('|');
            if (!seen.has(key)) {
                seen.add(key);
                pairs.push([s.name, friend]);
            }
        }
    }
    return pairs;
}

function findAssignmentByName(assignments: SeatingAssignment[], name: string): SeatingAssignment | undefined {
    return assignments.find(a => a.student.name === name);
}

function clampScore(score: number): number {
    return Math.round(Math.max(0, Math.min(100, score)));
}

function academicPairScore(a: SeatingAssignment, b: SeatingAssignment): number {
    const diff = Math.abs(
        getAcademicScore(a.student.academicLevel) - getAcademicScore(b.student.academicLevel)
    );
    if (diff === 1) return 100;
    if (diff === 2) return 82;
    if (diff === 0) return 62;
    return 38;
}

function scoreAcademicBalance(assignments: SeatingAssignment[]): number {
    const pairs = neighborPairs(assignments);
    if (pairs.length === 0) return 50;
    const total = pairs.reduce((s, [a, b]) => s + academicPairScore(a, b), 0);
    return Math.round(total / pairs.length);
}

function scoreSocialCompatibility(assignments: SeatingAssignment[]): number {
    const pairs = neighborPairs(assignments);
    if (pairs.length === 0) return 50;

    let pairTotal = 0;
    let avoidAdjacent = 0;

    for (const [a, b] of pairs) {
        const aAvoidsB = a.student.avoidStudents.includes(b.student.name);
        const bAvoidsA = b.student.avoidStudents.includes(a.student.name);
        if (aAvoidsB || bAvoidsA) {
            avoidAdjacent++;
            continue;
        }
        pairTotal += (calculateCompatibility(a.student, b.student) +
            calculateCompatibility(b.student, a.student)) / 2;
    }

    const nonAvoidPairs = pairs.length - avoidAdjacent;
    const avgPair = nonAvoidPairs > 0
        ? pairTotal / nonAvoidPairs
        : avoidAdjacent > 0 ? 10 : 35;

    const students = assignments.map(a => a.student);
    const friendPairs = collectFriendPairs(students);
    let metFriends = 0;
    for (const [nameA, nameB] of friendPairs) {
        const assignA = findAssignmentByName(assignments, nameA);
        const assignB = findAssignmentByName(assignments, nameB);
        if (assignA && assignB && areNeighbors(assignA, assignB)) metFriends++;
    }

    const friendRatio = friendPairs.length > 0 ? metFriends / friendPairs.length : 0.5;
    const classSize = assignments.length;
    const unmetCount = friendPairs.length - metFriends;
    const unmetPerFriend = classSize >= 20
        ? 0.8 + (friendPairs.length / classSize) * 1.8
        : 1.2 + (friendPairs.length / classSize) * 5.5;
    const maxUnmetPenalty = classSize >= 20 ? 12 : 34;

    let score = avgPair * 0.72 + friendRatio * 100 * 0.28;
    score -= avoidAdjacent * (14 + Math.min(6, (friendPairs.length / classSize) * 8));
    score -= Math.min(maxUnmetPenalty, unmetCount * unmetPerFriend);
    score += metFriends * 1.5;

    return clampScore(score);
}

function scoreBehavioralHarmony(assignments: SeatingAssignment[]): number {
    let score = 66;
    const pairs = neighborPairs(assignments);
    const cols = assignments.map(a => a.col);
    const maxCol = cols.length ? Math.max(...cols) : 0;
    const disruptive = assignments.filter(a => a.student.behaviorType === 'disruptive');
    const densityScale = disruptive.length >= 4 ? 0.38 : disruptive.length >= 3 ? 0.58 : 1;

    for (const [a, b] of pairs) {
        const ba = a.student.behaviorType;
        const bb = b.student.behaviorType;
        if (ba === 'disruptive' && bb === 'disruptive') score -= 26 * densityScale;
        else if (ba === 'disruptive' || bb === 'disruptive') {
            const other = ba === 'disruptive' ? bb : ba;
            if (other === 'active') score -= 13 * densityScale;
            else if (other === 'quiet') score += 7;
            else score -= 6 * densityScale;
        }
        if (
            (ba === 'active' && bb === 'active') &&
            (a.student.movementNeeds === 'high' || b.student.movementNeeds === 'high')
        ) {
            score -= 8;
        }
    }

    for (const a of assignments) {
        if (a.student.behaviorType === 'leader' && a.row <= 1) score += 7;
        if (a.student.behaviorType === 'quiet' && (a.col === 0 || a.col === maxCol)) score += 5;
    }

    if (disruptive.length >= 2) {
        const rows = disruptive.map(a => a.row);
        const spread = Math.max(...rows) - Math.min(...rows);
        const clusterPenalty = disruptive.length <= 2 ? 14 : 10 + Math.max(0, disruptive.length - 2) * 3;
        if (spread <= 1) score -= clusterPenalty * densityScale;
    }

    return clampScore(score);
}

function scorePhysicalAccessibility(assignments: SeatingAssignment[]): number {
    let physicalTotal = 0;
    let physicalChecks = 0;
    const maxRow = Math.max(...assignments.map(x => x.row), 0);

    for (const a of assignments) {
        const s = a.student;

        if (s.visionNeeds === 'front_required' || s.specialNeeds === 'vision') {
            physicalChecks++;
            physicalTotal += a.row <= 1 ? 100 : Math.max(0, 70 - (a.row - 1) * 13);
        }
        if (s.hearingNeeds === 'front_required' || s.specialNeeds === 'hearing') {
            physicalChecks++;
            physicalTotal += a.row <= 1 ? 100 : Math.max(0, 70 - (a.row - 1) * 13);
        }
        if (s.hearingNeeds === 'partial') {
            physicalChecks++;
            physicalTotal += a.row <= 2 ? 100 : 58;
        }
        if (s.height === 'tall') {
            physicalChecks++;
            physicalTotal += a.row >= Math.floor(maxRow / 2) ? 100 : 38;
        }
        if (s.height === 'short') {
            physicalChecks++;
            physicalTotal += a.row <= 1 ? 100 : 52;
        }
    }

    return physicalChecks > 0 ? Math.round(physicalTotal / physicalChecks) : 85;
}

export const calculateMetrics = (assignments: SeatingAssignment[]): LayoutMetrics => {
    if (assignments.length === 0) {
        return {
            academicBalance: 0,
            socialCompatibility: 0,
            behavioralHarmony: 0,
            physicalAccessibility: 0,
            overallScore: 0,
        };
    }

    const academicBalance = scoreAcademicBalance(assignments);
    const socialCompatibility = scoreSocialCompatibility(assignments);
    const behavioralHarmony = scoreBehavioralHarmony(assignments);
    const physicalAccessibility = scorePhysicalAccessibility(assignments);
    const overallScore = Math.round(
        (academicBalance + socialCompatibility + behavioralHarmony + physicalAccessibility) / 4
    );

    return {
        academicBalance,
        socialCompatibility,
        behavioralHarmony,
        physicalAccessibility,
        overallScore,
    };
};
