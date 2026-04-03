"use client";
import React, { useState } from 'react';
import { ClassroomLayout, SeatingAssignment } from '../types';

interface SeatingGridProps {
    layout: ClassroomLayout;
    assignments: SeatingAssignment[];
}

const getBehaviorLabel = (type: string) => {
    switch (type) {
        case 'leader': return { color: '#7c3aed', label: 'Ld', text: 'Lider' };
        case 'quiet': return { color: '#15803d', label: 'Ss', text: 'Sessiz' };
        case 'disruptive': return { color: '#dc2626', label: 'Dd', text: 'D. Dağıtıcı' };
        case 'active': return { color: '#0369a1', label: 'Ak', text: 'Aktif' };
        case 'follower': return { color: '#737373', label: 'Tk', text: 'Takipçi' };
        default: return { color: '#a8a29e', label: '', text: '' };
    }
};

const getAcademicLabel = (level: string) => {
    switch (level) {
        case 'high': return { color: '#0d6e64', label: '▲', text: 'Yüksek' };
        case 'above_average': return { color: '#14b8a6', label: '△', text: 'Ort. Üstü' };
        case 'struggling': return { color: '#d97706', label: '▽', text: 'Zorlanıyor' };
        case 'below_average': return { color: '#ea580c', label: '▼', text: 'Ort. Altı' };
        default: return { color: '#a8a29e', label: '—', text: 'Ortalama' };
    }
};

const getSpecialLabel = (needs: string) => {
    switch (needs) {
        case 'adhd': return 'DEHB';
        case 'anxiety': return 'Anksiyete';
        case 'vision': return 'Görme';
        case 'hearing': return 'İşitme';
        case 'none': return null;
        default: return needs || null;
    }
};

const getMovementLabel = (m: string) => {
    switch (m) {
        case 'high': return 'Yüksek';
        case 'moderate': return 'Orta';
        case 'low': return 'Düşük';
        case 'very_low': return 'Çok Düşük';
        default: return 'Orta';
    }
};

export const SeatingGrid: React.FC<SeatingGridProps> = ({ layout, assignments }) => {
    const [hoveredStudent, setHoveredStudent] = useState<string | null>(null);
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
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>
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
                    gridTemplateColumns: `repeat(${layout.cols}, minmax(85px, 1fr))`,
                    gap: '8px',
                    marginTop: '12px'
                }}
            >
                {grid.map((row, rIndex) => (
                    row.map((student: any, cIndex: number) => (
                        <div
                            key={`${rIndex}-${cIndex}`}
                            className={`seat-cell ${student ? 'occupied' : 'empty'}`}
                            onMouseEnter={() => student && setHoveredStudent(student.id)}
                            onMouseLeave={() => setHoveredStudent(null)}
                            style={{ position: 'relative' }}
                        >
                            <div className="seat-row-label">
                                {rIndex === 0 ? "Ön sıra" : `${rIndex + 1}. sıra`}
                            </div>

                            {student ? (
                                <div style={{ textAlign: 'center', marginTop: '4px' }}>
                                    <span className="seat-name" title={student.name}>
                                        {student.name}
                                    </span>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '5px', alignItems: 'center' }}>
                                        <span
                                            style={{
                                                fontSize: '0.58rem',
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
                                            style={{
                                                fontSize: '0.68rem',
                                                color: getAcademicLabel(student.academicLevel).color,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {getAcademicLabel(student.academicLevel).label}
                                        </span>
                                        {getSpecialLabel(student.specialNeeds) && (
                                            <span style={{
                                                fontSize: '0.5rem',
                                                fontWeight: 700,
                                                color: 'white',
                                                background: '#dc2626',
                                                padding: '0px 4px',
                                                borderRadius: '3px',
                                            }}>
                                                ⚕
                                            </span>
                                        )}
                                    </div>

                                    {/* Hover tooltip */}
                                    {hoveredStudent === student.id && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 'calc(100% + 8px)',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: 'white',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-sm)',
                                            padding: '10px 14px',
                                            boxShadow: 'var(--shadow-lg)',
                                            zIndex: 100,
                                            minWidth: '160px',
                                            textAlign: 'left',
                                            fontSize: '0.72rem',
                                            color: 'var(--text)',
                                            animation: 'fadeIn 0.15s ease-out',
                                        }}>
                                            <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '6px', color: 'var(--primary)' }}>
                                                {student.name}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                <div><span style={{ color: 'var(--text-muted)' }}>Akademik:</span> <strong>{getAcademicLabel(student.academicLevel).text}</strong></div>
                                                <div><span style={{ color: 'var(--text-muted)' }}>Davranış:</span> <strong>{getBehaviorLabel(student.behaviorType).text}</strong></div>
                                                <div><span style={{ color: 'var(--text-muted)' }}>Hareket:</span> <strong>{getMovementLabel(student.movementNeeds)}</strong></div>
                                                {getSpecialLabel(student.specialNeeds) && (
                                                    <div><span style={{ color: 'var(--text-muted)' }}>Özel:</span> <strong style={{ color: '#dc2626' }}>{getSpecialLabel(student.specialNeeds)}</strong></div>
                                                )}
                                                {student.friends?.length > 0 && (
                                                    <div><span style={{ color: 'var(--text-muted)' }}>Arkadaş:</span> <strong>{student.friends.join(', ')}</strong></div>
                                                )}
                                            </div>
                                            {/* Arrow */}
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '-5px',
                                                left: '50%',
                                                transform: 'translateX(-50%) rotate(45deg)',
                                                width: '10px',
                                                height: '10px',
                                                background: 'white',
                                                border: '1px solid var(--border)',
                                                borderTop: 'none',
                                                borderLeft: 'none',
                                            }} />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', opacity: 0.5 }}>Boş</span>
                            )}
                        </div>
                    ))
                ))}
            </div>

            {/* Legend */}
            <div style={{
                marginTop: '14px',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                alignItems: 'center',
            }}>
                <span style={{ fontWeight: 600 }}>Davranış:</span>
                <span><span style={{ color: '#7c3aed', fontWeight: 700 }}>Ld</span> Lider</span>
                <span><span style={{ color: '#15803d', fontWeight: 700 }}>Ss</span> Sessiz</span>
                <span><span style={{ color: '#dc2626', fontWeight: 700 }}>Dd</span> D. Dağıtıcı</span>
                <span><span style={{ color: '#0369a1', fontWeight: 700 }}>Ak</span> Aktif</span>
                <span style={{ opacity: 0.3 }}>|</span>
                <span>Akademik: <span style={{ color: '#0d6e64' }}>▲</span> Yüksek <span style={{ color: '#d97706' }}>▽</span> Düşük</span>
                <span style={{ opacity: 0.3 }}>|</span>
                <span><span style={{ color: '#dc2626', fontWeight: 700 }}>⚕</span> Özel Gereksinim</span>
            </div>
        </div>
    );
};
