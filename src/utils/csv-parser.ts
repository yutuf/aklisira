import { Student, AcademicLevel, BehaviorType, MovementNeeds, LearningStyle, HeightCategory, VisionNeeds, HearingNeeds } from '../types';

export const parseStudentsCSV = (csvContent: string): Student[] => {
    // Basic CSV splitting (handling quotes would be better, but simple split for now)
    const lines = csvContent.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) throw new Error("CSV has no data");

    const rawHeaders = lines[0].split(',').map(h => h.trim().toLowerCase());

    // Map common Turkish column names to internal keys
    const headerMap: Record<string, keyof Student> = {};
    rawHeaders.forEach((h, idx) => {
        if (h.includes('ad') || h.includes('isim') || h.includes('name')) headerMap[idx] = 'name';
        else if (h.includes('akademik') || h.includes('başarı') || h.includes('not')) headerMap[idx] = 'academicLevel';
        else if (h.includes('davranış') || h.includes('huy')) headerMap[idx] = 'behaviorType';
        else if (h.includes('hareket')) headerMap[idx] = 'movementNeeds';
        else if (h.includes('özel') || h.includes('neden') || h.includes('engel')) headerMap[idx] = 'specialNeeds';
        else if (h.includes('boy')) headerMap[idx] = 'height';
        else if (h.includes('görm') || h.includes('göz')) headerMap[idx] = 'visionNeeds';
        else if (h.includes('işitm') || h.includes('duym') || h.includes('kulak')) headerMap[idx] = 'hearingNeeds';
        else if (h.includes('öğrenme') || h.includes('stil')) headerMap[idx] = 'learningStyle';
        else if (h.includes('arkadaş') || h.includes('yanına')) headerMap[idx] = 'friends';
        else if (h.includes('uzak') || h.includes('istemiyor')) headerMap[idx] = 'avoidStudents';
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
            if (acStr.includes('yüksek') || acStr.includes('iyi') || acStr.includes('high')) ac = 'high';
            else if (acStr.includes('düşük') || acStr.includes('zayıf') || acStr.includes('struggling')) ac = 'struggling';
            else if (acStr.includes('orta')) ac = 'average';

            // Behavior
            let bh: BehaviorType = 'quiet';
            const bhStr = cleanStr(data.behaviorType as any);
            if (bhStr.includes('hareketli') || bhStr.includes('aktif')) bh = 'active';
            else if (bhStr.includes('gürültü') || bhStr.includes('dağıtıcı') || bhStr.includes('yaramaz')) bh = 'disruptive';
            else if (bhStr.includes('lider')) bh = 'leader';
            else if (bhStr.includes('sessiz') || bhStr.includes('sakin')) bh = 'quiet';

            // Height
            let ht: HeightCategory = 'average';
            const htStr = cleanStr(data.height as any);
            if (htStr.includes('kısa') || htStr.includes('short')) ht = 'short';
            else if (htStr.includes('uzun') || htStr.includes('tall')) ht = 'tall';

            // Vision
            let vn: VisionNeeds = 'none';
            const vnStr = cleanStr(data.visionNeeds as any);
            if (vnStr.includes('gözlük') || vnStr.includes('ön')) vn = 'front_required';

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
                movementNeeds: 'moderate', // simplify for now or parse
                specialNeeds: (data.specialNeeds as string) || 'none',
                height: ht,
                visionNeeds: vn,
                learningStyle: ls,
                friends: (data.friends as any) || [],
                avoidStudents: (data.avoidStudents as any) || []
            });
        }
    }
    return students;
};

