import { SeatingAssignment } from '../types';
import { getAcademicScore, getBehaviorScore, calculateCompatibility } from './student-utils';

export interface LayoutMetrics {
    academicBalance: number;
    socialCompatibility: number;
    behavioralHarmony: number;
    overallScore: number;
}

export const calculateMetrics = (assignments: SeatingAssignment[]): LayoutMetrics => {
    let academicBalance = 0;
    let socialCompatibility = 0;
    let behavioralHarmony = 0;

    // --- 1. Academic Balance ---
    const academicScores = assignments.map(a => getAcademicScore(a.student.academicLevel));
    const academicMean = academicScores.reduce((a, b) => a + b, 0) / (academicScores.length || 1);
    const academicVariance = academicScores.reduce((sum, score) => sum + Math.pow(score - academicMean, 2), 0) / (academicScores.length || 1);

    // Base balance
    let baseBalance = Math.max(0, 100 - academicVariance * 10);

    // Bonus (strategic distribution)
    let academicStrategicBonus = 0;
    assignments.forEach((a1, i) => {
        assignments.forEach((a2, j) => {
            if (i === j) return;
            const dist = Math.sqrt(Math.pow(a1.row - a2.row, 2) + Math.pow(a1.col - a2.col, 2));
            if (dist <= 1.5) {
                const diff = Math.abs(getAcademicScore(a1.student.academicLevel) - getAcademicScore(a2.student.academicLevel));
                if (diff === 2) academicStrategicBonus += 5; // Mentoring
                else if (diff === 1) academicStrategicBonus += 3; // Peer support
            }
        });
    });
    // Normalize/Clamp bonus? Legacy didn't divide by N, so score can grow huge?
    // Legacy: academicBalance = Math.min(100, baseBalance + academicStrategicBonus);
    // If N=30, pairs are many. Bonus could be huge. 
    // Wait, legacy code loop is nested. 30*29 pairs. 
    // Maybe valid pairs are few.
    // I will trust the legacy logic for now, but maybe clamp it. 

    academicBalance = Math.min(100, baseBalance + (academicStrategicBonus / (assignments.length || 1) * 2)); // normalizing a bit? 
    // Actually, let's stick to legacy exact logic if possible or try to be reasonable.
    // Legacy: academicBalance = Math.min(100, baseBalance + academicStrategicBonus);
    // If academicStrategicBonus is raw sum, satisfied pairs add 5 points.
    // 10 pairs = 50 points. Easy to reach 100.
    academicBalance = Math.min(100, baseBalance + academicStrategicBonus);


    // --- 2. Social Compatibility ---
    let totalCompatibility = 0;
    let compatibilityCount = 0;
    let maxPossibleScore = 0;

    assignments.forEach((a1, i) => {
        assignments.forEach((a2, j) => {
            if (i === j) return;
            const dist = Math.sqrt(Math.pow(a1.row - a2.row, 2) + Math.pow(a1.col - a2.col, 2));
            if (dist <= 1.5) {
                const comp = calculateCompatibility(a1.student, a2.student);
                totalCompatibility += comp;
                compatibilityCount++;

                // Potential max
                const maxComp = Math.max(comp, calculateCompatibility(a2.student, a1.student)); // symmetric mostly, but calculateCompatibility uses A->B logic?
                // calculateCompatibility is A->B?
                // Logic: needsA vs behaviorB. Yes it is directional!
                // So legacy code check both directions for max potential? 
                // Legacy: Math.max(assignment.student.getCompatibilityScore(other), other.student.getCompatibilityScore(assignment))
                maxPossibleScore += Math.max(
                    calculateCompatibility(a1.student, a2.student),
                    calculateCompatibility(a2.student, a1.student)
                );
            }
        });
    });

    const currentAvg = compatibilityCount > 0 ? totalCompatibility / compatibilityCount : 0;
    // maxPossibleScore was sum of maxes. potentialAvg should be sum / count.
    const potentialAvg = compatibilityCount > 0 ? maxPossibleScore / compatibilityCount : 0;

    // Legacy: cost optimizationEfficiency = currentAvg / potentialAvg
    const efficiency = potentialAvg > 0 ? currentAvg / potentialAvg : 1;
    socialCompatibility = currentAvg + (efficiency * 20);
    socialCompatibility = Math.min(100, socialCompatibility);


    // --- 3. Behavioral Harmony ---
    const behavioralScores = assignments.map(a => getBehaviorScore(a.student.behaviorType));
    const behavioralMean = behavioralScores.reduce((a, b) => a + b, 0) / (behavioralScores.length || 1);

    let baseHarmony = Math.max(0, 100 - Math.abs(behavioralMean - 3) * 20);

    let diversityBonus = 0;
    let behavioralStrategicBonus = 0;

    const behaviorTypes = assignments.map(a => a.student.behaviorType);
    const leaders = behaviorTypes.filter(b => b === 'leader').length;
    const quiet = behaviorTypes.filter(b => b === 'quiet').length;
    const disruptive = behaviorTypes.filter(b => b === 'disruptive').length;

    if (leaders >= 2 && quiet >= 3 && disruptive <= 2) diversityBonus += 15;

    const cols = assignments.map(a => a.col);
    const maxCol = cols.length ? Math.max(...cols) : 0;

    assignments.forEach(a => {
        if (a.student.behaviorType === 'leader' && a.row === 0) behavioralStrategicBonus += 10;
        if (a.student.behaviorType === 'quiet' && (a.col === 0 || a.col === maxCol)) behavioralStrategicBonus += 8;
    });

    behavioralHarmony = Math.min(100, baseHarmony + diversityBonus + behavioralStrategicBonus);

    const overall = (academicBalance + socialCompatibility + behavioralHarmony) / 3;

    return {
        academicBalance: Math.round(academicBalance),
        socialCompatibility: Math.round(socialCompatibility),
        behavioralHarmony: Math.round(behavioralHarmony),
        overallScore: Math.round(overall)
    };
};
