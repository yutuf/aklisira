"use client";
import React from 'react';
import { ClassroomLayout, SeatingAssignment } from '../types';

interface SeatingGridProps {
    layout: ClassroomLayout;
    assignments: SeatingAssignment[];
}

const getBehaviorLabel = (type: string) => {
    switch (type) {
        case 'leader': return { color: '#7c3aed', label: 'Ld' };
        case 'quiet': return { color: '#15803d', label: 'Ss' };
        case 'disruptive': return { color: '#b91c1c', label: 'Dd' };
        case 'active': return { color: '#0369a1', label: 'Ak' };
        case 'follower': return { color: '#737373', label: 'Tk' };
        default: return { color: '#a8a29e', label: '' };
    }
};

const getAcademicLabel = (level: string) => {
    switch (level) {
        case 'high': return { color: '#0f766e', label: '▲' };
        case 'above_average': return { color: '#14b8a6', label: '△' };
        case 'struggling': return { color: '#d97706', label: '▽' };
        case 'below_average': return { color: '#ea580c', label: '▼' };
        default: return { color: '#a8a29e', label: '—' };
    }
};

export const SeatingGrid: React.FC<SeatingGridProps> = ({ layout, assignments }) => {
    const grid = Array(layout.rows).fill(null).map(() => Array(layout.cols).fill(null));

    assignments.forEach(a => {
        if (a.row < layout.rows && a.col < layout.cols) {
            grid[a.row][a.col] = a.student;
        }
    });

    return (
        <div className="card" style={{ padding: '24px' }}>
            <div className="card-header">
                <span>📐 Sınıf Düzeni</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                    {assignments.length} öğrenci · {layout.rows}×{layout.cols} düzen
                </span>
            </div>

            {/* Teacher desk */}
            <div className="teacher-desk">
                🏫 Öğretmen Masası
            </div>

            {/* Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${layout.cols}, minmax(90px, 1fr))`,
                    gap: '10px',
                    marginTop: '12px'
                }}
            >
                {grid.map((row, rIndex) => (
                    row.map((student: any, cIndex: number) => (
                        <div
                            key={`${rIndex}-${cIndex}`}
                            className={`seat-cell ${student ? 'occupied' : 'empty'}`}
                        >
                            <div className="seat-row-label">
                                {rIndex === 0 ? "Ön sıra" : `${rIndex + 1}. sıra`}
                            </div>

                            {student ? (
                                <div style={{ textAlign: 'center', marginTop: '4px' }}>
                                    <span className="seat-name" title={student.name}>
                                        {student.name}
                                    </span>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
                                        <span
                                            title={`Davranış: ${student.behaviorType}`}
                                            style={{
                                                fontSize: '0.6rem',
                                                fontWeight: 700,
                                                color: 'white',
                                                background: getBehaviorLabel(student.behaviorType).color,
                                                padding: '1px 5px',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            {getBehaviorLabel(student.behaviorType).label}
                                        </span>
                                        <span
                                            title={`Akademik: ${student.academicLevel}`}
                                            style={{
                                                fontSize: '0.7rem',
                                                color: getAcademicLabel(student.academicLevel).color,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {getAcademicLabel(student.academicLevel).label}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Boş</span>
                            )}
                        </div>
                    ))
                ))}
            </div>

            {/* Legend */}
            <div style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                fontSize: '0.7rem',
                color: 'var(--text-muted)'
            }}>
                <span>Davranış:</span>
                <span><span style={{ color: '#7c3aed', fontWeight: 700 }}>Ld</span> Lider</span>
                <span><span style={{ color: '#15803d', fontWeight: 700 }}>Ss</span> Sessiz</span>
                <span><span style={{ color: '#b91c1c', fontWeight: 700 }}>Dd</span> D. Dağıtıcı</span>
                <span><span style={{ color: '#0369a1', fontWeight: 700 }}>Ak</span> Aktif</span>
                <span style={{ marginLeft: '8px' }}>|</span>
                <span>Akademik: <span style={{ color: '#0f766e' }}>▲</span> Yüksek <span style={{ color: '#d97706' }}>▽</span> Düşük</span>
            </div>
        </div>
    );
};
