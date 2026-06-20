import { Student, AcademicLevel, BehaviorType, MovementNeeds, LearningStyle, HeightCategory, VisionNeeds, HearingNeeds } from '../types';

export const parseStudentsCSV = (csvContent: string): Student[] => {
    // Basic CSV splitting (handling quotes would be better, but simple split for now)
    const lines = csvContent.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) throw new Error("CSV has no data");

    const rawHeaders = lines[0].split(',').map(h => h.trim().toLowerCase());

    // Map Turkish and English column names to internal keys
    const headerMap: Record<number, keyof Student> = {};
    rawHeaders.forEach((h, idx) => {
        if (h === 'name' || h.includes('isim') || h.includes('öğrenci ad')) headerMap[idx] = 'name';
        else if (h.includes('akademik') || h.includes('academic') || h.includes('başarı')) headerMap[idx] = 'academicLevel';
        else if (h.includes('davran') || h.includes('behavior') || h.includes('huy')) headerMap[idx] = 'behaviorType';
        else if (h.includes('hareket') || h.includes('movement')) headerMap[idx] = 'movementNeeds';
        else if (h.includes('özel') || h.includes('special') || h.includes('neden') || h.includes('engel')) headerMap[idx] = 'specialNeeds';
        else if (h.includes('boy') || h.includes('height')) headerMap[idx] = 'height';
        else if (h.includes('görm') || h.includes('göz') || h.includes('vision')) headerMap[idx] = 'visionNeeds';
        else if (h.includes('işitm') || h.includes('duym') || h.includes('kulak') || h.includes('hearing')) headerMap[idx] = 'hearingNeeds';
        else if (h.includes('öğrenme') || h.includes('stil') || h.includes('learning')) headerMap[idx] = 'learningStyle';
        else if (h.includes('friend') || h.includes('arkadaş') || h.includes('yanına')) headerMap[idx] = 'friends';
        else if (h.includes('avoid') || h.includes('uzak') || h.includes('istemiyor')) headerMap[idx] = 'avoidStudents';
    });

    const students: Student[] = [];

    for (let i = 1; i < lines.length; i++) {
        // Match CSV line respecting quotes
        const match = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        
        if (values.length === 0 || !values[0]) continue;

        const data: Partial<Student> = {};
        
        values.forEach((val, idx) => {
            const key = headerMap[idx];
            if (key) {
                if (key === 'friends' || key === 'avoidStudents') {
                    // split by semicolon or pipe since commas are often used for csv delimiters
                    data[key] = val ? val.split(/[;|]/).map(s => s.trim()).filter(Boolean) : [];
                } else {
                    (data as any)[key] = val;
                }
            }
        });

        if (data.name) {
            // Data normalization mapping
            const cleanStr = (s?: string) => s?.toLowerCase().trim() || '';
            
            // Academic
            let ac: AcademicLevel = 'average';
            const acStr = cleanStr(data.academicLevel as any);
            if (acStr.includes('above') || acStr.includes('üstü')) ac = 'above_average';
            else if (acStr.includes('below') || acStr.includes('altı')) ac = 'below_average';
            else if (acStr.includes('yüksek') || acStr.includes('iyi') || acStr === 'high') ac = 'high';
            else if (acStr.includes('düşük') || acStr.includes('zayıf') || acStr.includes('struggling')) ac = 'struggling';
            else if (acStr.includes('orta') || acStr === 'average') ac = 'average';

            // Movement
            let mn: MovementNeeds = 'moderate';
            const mnStr = cleanStr(data.movementNeeds as any);
            if (mnStr.includes('very_low') || mnStr.includes('çok az')) mn = 'very_low';
            else if (mnStr.includes('high') || mnStr.includes('yüksek')) mn = 'high';
            else if (mnStr.includes('low') || mnStr.includes('düşük')) mn = 'low';
            else if (mnStr.includes('moderate') || mnStr.includes('orta')) mn = 'moderate';

            // Behavior
            let bh: BehaviorType = 'quiet';
            const bhStr = cleanStr(data.behaviorType as any);
            if (bhStr === 'active' || bhStr.includes('hareketli') || bhStr.includes('aktif')) bh = 'active';
            else if (bhStr === 'disruptive' || bhStr.includes('gürültü') || bhStr.includes('dağıtıcı') || bhStr.includes('yaramaz')) bh = 'disruptive';
            else if (bhStr === 'leader' || bhStr.includes('lider')) bh = 'leader';
            else if (bhStr === 'follower' || bhStr.includes('takip')) bh = 'follower';
            else if (bhStr === 'quiet' || bhStr.includes('sessiz') || bhStr.includes('sakin')) bh = 'quiet';

            // Height
            let ht: HeightCategory = 'average';
            const htStr = cleanStr(data.height as any);
            if (htStr.includes('kısa') || htStr.includes('short')) ht = 'short';
            else if (htStr.includes('uzun') || htStr.includes('tall')) ht = 'tall';

            const snStr = cleanStr(data.specialNeeds as any);

            // Vision / hearing (column or special-needs field)
            let vn: VisionNeeds = 'none';
            const vnStr = cleanStr(data.visionNeeds as any);
            if (vnStr.includes('gözlük') || vnStr.includes('ön') || vnStr.includes('front')) vn = 'front_required';
            else if (snStr === 'vision' || snStr.includes('gör')) vn = 'front_required';

            let hn: HearingNeeds = 'none';
            const hnStr = cleanStr(data.hearingNeeds as any);
            if (hnStr.includes('partial') || hnStr.includes('kısmi')) hn = 'partial';
            else if (hnStr.includes('front') || hnStr.includes('ön')) hn = 'front_required';
            else if (snStr === 'hearing' || snStr.includes('işit')) hn = 'front_required';

            // Learning Style
            let ls: LearningStyle | undefined = undefined;
            const lsStr = cleanStr(data.learningStyle as any);
            if (lsStr.includes('görsel') || lsStr.includes('visual')) ls = 'visual';
            else if (lsStr.includes('işitsel') || lsStr.includes('auditory')) ls = 'auditory';
            else if (lsStr.includes('kinestetik') || lsStr.includes('dokunsal')) ls = 'kinesthetic';

            students.push({
                id: `s-${Date.now()}-${i}`,
                name: data.name as string,
                academicLevel: ac,
                behaviorType: bh,
                movementNeeds: mn,
                specialNeeds: (data.specialNeeds as string) || 'none',
                height: ht,
                visionNeeds: vn,
                hearingNeeds: hn,
                learningStyle: ls,
                friends: (data.friends as any) || [],
                avoidStudents: (data.avoidStudents as any) || []
            });
        }
    }
    return students;
};

