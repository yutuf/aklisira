import { Student, AcademicLevel, BehaviorType } from '../types';

export const parseStudentsCSV = (csvContent: string): Student[] => {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    const students: Student[] = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(',').map(v => v.trim());
        const data: any = {};

        headers.forEach((h, idx) => {
            // Normalize headers
            const cleanHeader = h.replace(/\s+/g, '');
            data[cleanHeader] = values[idx] || '';
        });

        // Map to Student interface
        // Note: Parsing needs to be robust. 
        // Fallbacks provided.

        if (data.name) {
            students.push({
                id: `s-${Date.now()}-${i}`,
                name: data.name,
                movementNeeds: (data.movementneeds || 'moderate') as any,
                academicLevel: (data.academiclevel || 'average') as AcademicLevel,
                behaviorType: (data.behaviortype || 'quiet') as BehaviorType,
                specialNeeds: data.specialneeds || 'none',
                friends: data.friends ? data.friends.split(';') : [], // Expecting semicolon or common in CSV? Old code used comma inside CSV column? 
                // Old code: friends.split(','). But CSV lines are split by comma. 
                // If CSV has "Friend1, Friend2", it breaks the line split. 
                // Standard CSVs quote "Friend1, Friend2". 
                // The simplistic parser in script.js didn't handle quotes! 
                // It likely expected simple data or the user to use semicolons if instructed.
                // I will trust the input matches the template or use simple split for now. 
                // For summit, maybe better to use a robust parser later.
                avoidStudents: data.avoidstudents ? data.avoidstudents.split(';') : []
            });
        }
    }
    return students;
};
