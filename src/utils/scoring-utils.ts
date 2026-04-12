import { SeatingAssignment } from '../types';
import { getAcademicScore, getBehaviorScore, calculateCompatibility } from './student-utils';

export interface LayoutMetrics {
    academicBalance: number;
    socialCompatibility: number;
    behavioralHarmony: number;
    physicalAccessibility: number;
    overallScore: number;
}

export const calculateMetrics = (assignments: SeatingAssignment[]): LayoutMetrics => {
    let academicBalance = 0;
    let socialCompatibility = 0;
    let behavioralHarmony = 0;
    let physicalAccessibility = 0;

    // --- 1. Academic Balance ---
    const academicScores = assignments.map(a => getAcademicScore(a.student.academicLevel));
    const academicMean = academicScores.reduce((a, b) => a + b, 0) / (academicScores.length || 1);
    const academicVariance = academicScores.reduce((sum, score) => sum + Math.pow(score - academicMean, 2), 0) / (academicScores.length || 1);

    let baseBalance = Math.max(0, 100 - academicVariance * 10);
    let academicStrategicBonus = 0;

    assignments.forEach((a1, i) => {
        assignments.forEach((a2, j) => {
            if (i === j) return;
            const dist = Math.sqrt(Math.pow(a1.row - a2.row, 2) + Math.pow(a1.col - a2.col, 2));
            if (dist <= 1.5) {
                const diff = Math.abs(getAcademicScore(a1.student.academicLevel) - getAcademicScore(a2.student.academicLevel));
                if (diff === 2) academicStrategicBonus += 5;
                else if (diff === 1) academicStrategicBonus += 3;
            }
        });
    });

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
                maxPossibleScore += Math.max(
                    calculateCompatibility(a1.student, a2.student),
                    calculateCompatibility(a2.student, a1.student)
                );
            }
        });
    });

    const currentAvg = compatibilityCount > 0 ? totalCompatibility / compatibilityCount : 0;
    const potentialAvg = compatibilityCount > 0 ? maxPossibleScore / compatibilityCount : 0;
    const efficiency = potentialAvg > 0 ? currentAvg / potentialAvg : 1;
    socialCompatibility = Math.min(100, currentAvg + (efficiency * 20));

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

    // --- 4. Physical Accessibility (NEW) ---
    let physicalTotal = 0;
    let physicalChecks = 0;

    assignments.forEach(a => {
        const s = a.student;

        // Vision: front_required must be in row 0 or 1
        if (s.visionNeeds === 'front_required') {
            physicalChecks++;
            physicalTotal += a.row <= 1 ? 100 : Math.max(0, 50 - (a.row - 1) * 25);
        }

        // Hearing: front_required must be in row 0 or 1
        if (s.hearingNeeds === 'front_required') {
            physicalChecks++;
            physicalTotal += a.row <= 1 ? 100 : Math.max(0, 50 - (a.row - 1) * 25);
        }

        // Legacy special needs vision/hearing check
        if (s.specialNeeds === 'vision' && !s.visionNeeds) {
            physicalChecks++;
            physicalTotal += a.row <= 1 ? 100 : 40;
        }
        if (s.specialNeeds === 'hearing' && !s.hearingNeeds) {
            physicalChecks++;
            physicalTotal += a.row <= 1 ? 100 : 40;
        }

        // Height: shorter students should be closer to front
        if (s.height === 'tall') {
            physicalChecks++;
            const maxRow = Math.max(...assignments.map(x => x.row), 0);
            // Tall students should be in later rows
            physicalTotal += a.row >= maxRow / 2 ? 100 : 50;
        }
        if (s.height === 'short') {
            physicalChecks++;
            // Short students should be in earlier rows
            physicalTotal += a.row <= 1 ? 100 : 60;
        }
    });

    physicalAccessibility = physicalChecks > 0 ? Math.round(physicalTotal / physicalChecks) : 100;

    // --- Overall ---
    const overall = physicalChecks > 0
        ? (academicBalance + socialCompatibility + behavioralHarmony + physicalAccessibility) / 4
        : (academicBalance + socialCompatibility + behavioralHarmony) / 3;

    return {
        academicBalance: Math.round(academicBalance),
        socialCompatibility: Math.round(socialCompatibility),
        behavioralHarmony: Math.round(behavioralHarmony),
        physicalAccessibility: Math.round(physicalAccessibility),
        overallScore: Math.round(overall)
    };
};
