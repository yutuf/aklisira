import { Student, AcademicLevel, BehaviorType } from '../types';

export const parseNaturalLanguage = (text: string): Student[] => {
    const students: Student[] = [];
    const lines = text.split(/[.\n]+/).filter(l => l.trim().length > 3);

    lines.forEach((line, idx) => {
        const lower = line.toLowerCase();

        // Extract Name — first word that looks like a name
        const words = line.trim().split(' ');
        let name = words[0];
        name = name.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ]/g, '');

        if (name.length < 2) return;

        // Default traits
        let academic: AcademicLevel = 'average';
        let behavior: BehaviorType = 'quiet';
        let movement: 'high' | 'moderate' | 'low' | 'very_low' = 'moderate';

        // ─── Academic Detection (TR + EN) ───
        if (lower.match(/\d{2,3}/)) {
            // Score mode: "Ali 90", "Elif notu 45"
            const numMap = line.match(/(\d{2,3})/);
            if (numMap) {
                const score = parseInt(numMap[0]);
                if (score >= 85) academic = 'high';
                else if (score >= 70) academic = 'above_average';
                else if (score >= 50) academic = 'average';
                else if (score >= 40) academic = 'below_average';
                else academic = 'struggling';
            }
        } else {
            // Descriptive mode — Turkish
            if (lower.includes('başarılı') || lower.includes('zeki') || lower.includes('çalışkan'))
                academic = 'high';
            else if (lower.includes('iyi') || lower.includes('güçlü'))
                academic = 'above_average';
            else if (lower.includes('zorlanıyor') || lower.includes('zayıf') || lower.includes('düşük'))
                academic = 'struggling';
            else if (lower.includes('orta'))
                academic = 'average';
            // English fallback
            else if (lower.includes('smart') || lower.includes('genius') || lower.includes('excellent'))
                academic = 'high';
            else if (lower.includes('struggling') || lower.includes('failing'))
                academic = 'struggling';
            else if (lower.includes('good'))
                academic = 'above_average';
        }

        // ─── Behavior Detection (TR + EN) ───
        if (lower.includes('gürültücü') || lower.includes('yaramaz') || lower.includes('haylaz') || lower.includes('dikkat dağıt'))
            behavior = 'disruptive';
        else if (lower.includes('sessiz') || lower.includes('sakin') || lower.includes('utangaç') || lower.includes('içine kapanık'))
            behavior = 'quiet';
        else if (lower.includes('lider') || lower.includes('önder') || lower.includes('sınıf başkanı'))
            behavior = 'leader';
        else if (lower.includes('aktif') || lower.includes('katılımcı') || lower.includes('enerjik') || lower.includes('hareketli'))
            behavior = 'active';
        else if (lower.includes('takipçi') || lower.includes('uyumlu'))
            behavior = 'follower';
        // English fallback
        else if (lower.includes('noisy') || lower.includes('talkative') || lower.includes('disruptive'))
            behavior = 'disruptive';
        else if (lower.includes('quiet') || lower.includes('shy') || lower.includes('silent'))
            behavior = 'quiet';
        else if (lower.includes('leader') || lower.includes('boss'))
            behavior = 'leader';

        // ─── Movement Detection (TR + EN) ───
        if (lower.includes('dehb') || lower.includes('adhd') || lower.includes('hiperaktif') || lower.includes('hareketli') || lower.includes('yerinde duramıyor'))
            movement = 'high';
        else if (lower.includes('hareketsiz') || lower.includes('durgun'))
            movement = 'very_low';

        students.push({
            id: `nlp-${Date.now()}-${idx}`,
            name: name.charAt(0).toUpperCase() + name.slice(1),
            academicLevel: academic,
            behaviorType: behavior,
            movementNeeds: movement,
            specialNeeds: 'none',
            friends: [],
            avoidStudents: []
        });
    });

    return students;
};
