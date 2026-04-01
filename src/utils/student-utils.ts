import { Student, AcademicLevel, BehaviorType } from '../types';

export const getAcademicScore = (level: AcademicLevel): number => {
    const scores: Record<AcademicLevel, number> = {
        'high': 5,
        'above_average': 4,
        'average': 3,
        'below_average': 2,
        'struggling': 1
    };
    return scores[level] || 3;
};

export const getBehaviorScore = (type: BehaviorType): number => {
    const scores: Record<BehaviorType, number> = {
        'quiet': 5,
        'active': 4,
        'follower': 3,
        'leader': 4,
        'disruptive': 1
    };
    return scores[type] || 3;
};

export const calculateCompatibility = (studentA: Student, studentB: Student): number => {
    let score = 0;

    // 1. Movement Needs Compatibility
    const needsA = studentA.movementNeeds;
    const needsB = studentB.movementNeeds;
    const behaviorA = studentA.behaviorType;
    const behaviorB = studentB.behaviorType;

    if (needsA === 'high' && behaviorB === 'quiet') score += 45;
    else if (needsA === 'very_low' && needsB === 'very_low') score += 40;
    else if (needsA === 'high' && needsB === 'high') score -= 25;
    else if (needsA === 'moderate' && needsB === 'moderate') score += 30;

    // 2. Academic Level Compatibility
    const scoreA = getAcademicScore(studentA.academicLevel);
    const scoreB = getAcademicScore(studentB.academicLevel);
    const diff = Math.abs(scoreA - scoreB);

    if (diff <= 1) score += 50; // Peer tutoring
    else if (diff === 2) score += 35; // Mentoring
    else score += 15;

    // 3. Behavioral Compatibility
    if (behaviorA === 'quiet' && behaviorB === 'quiet') score += 25;
    else if (behaviorA === 'leader' && behaviorB === 'follower') score += 30;
    else if (behaviorA === 'disruptive' && behaviorB === 'disruptive') score -= 40;
    else if (behaviorA === 'disruptive' && behaviorB === 'quiet') score += 20;

    // 4. Special Needs Accommodation
    // Logic: ADHD/Anxiety benefit from Quiet neighbors
    const specialA = Array.isArray(studentA.specialNeeds) ? studentA.specialNeeds[0] : studentA.specialNeeds;
    // Note: Old code treated specialNeeds as single string. New type is string but we might parse it. 
    // Assuming 'none' or specific string for now as per type definition.

    const snA = (studentA.specialNeeds || 'none').toLowerCase();

    if (snA.includes('adhd') && behaviorB === 'quiet') score += 25;
    if (snA.includes('anxiety') && behaviorB === 'quiet') score += 30;
    if (snA.includes('vision') || snA.includes('hearing')) score += 15; // Just for being placed? Logic in old code added this to neighbor score? 
    // Old code: if (this.specialNeeds === 'vision' || ...) score += 15; 
    // Yes, it adds to compatibility score, implying they work well with... anyone? Or just a boost?
    // It seems like a general boost to ensure they get *some* good neighbor, or maybe a copy-paste quirk. I'll keep it.

    // 5. Friend Preferences
    // studentA.friends is list of names.
    if (studentA.friends.includes(studentB.name)) score += 35;

    // 6. Avoid Preferences
    if (studentA.avoidStudents.includes(studentB.name)) score -= 60;

    // Clamp 0-100
    return Math.max(0, Math.min(100, score));
};
