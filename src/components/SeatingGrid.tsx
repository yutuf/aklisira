"use client";
import React, { useState } from 'react';
import { ClassroomLayout, SeatingAssignment } from '../types';

interface SeatingGridProps {
    layout: ClassroomLayout;
    assignments: SeatingAssignment[];
    layoutType?: string;
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

const layoutLabels: Record<string, string> = {
    'grid': 'Düz Sıra',
    'paired': 'İkili Sıra',
    'u-shape': 'U-Düzen',
    'cluster': 'Küme (Grup)',
    'chevron': 'Chevron (V)',
    'butterfly': 'Kelebek',
};

const getHeightLabel = (h?: string) => {
    switch (h) {
        case 'short': return 'Kısa';
        case 'tall': return 'Uzun';
        default: return null;
    }
};

const getVisionLabel = (v?: string) => {
    switch (v) {
        case 'glasses': return 'Gözlüklü';
        case 'front_required': return 'Ön Sıra Gerekli';
        default: return null;
    }
};

const getLearningLabel = (l?: string) => {
    switch (l) {
        case 'visual': return 'Görsel';
        case 'auditory': return 'İşitsel';
        case 'kinesthetic': return 'Kinestetik';
        case 'readwrite': return 'Okuma-Yazma';
        default: return null;
    }
};

export const SeatingGrid: React.FC<SeatingGridProps> = ({ layout, assignments, layoutType = 'grid' }) => {
    const [hoveredStudent, setHoveredStudent] = useState<string | null>(null);

    // Build student placement grid
    const grid: (any | null)[][] = Array(layout.rows).fill(null).map(() => Array(layout.cols).fill(null));
    assignments.forEach(a => {
        if (a.row < layout.rows && a.col < layout.cols) {
            grid[a.row][a.col] = a.student;
        }
    });

    // Render a single student cell
    const renderCell = (student: any, rIndex: number, cIndex: number, isGhost = false) => {
        if (!student) {
            if (isGhost) return null; // Don't render ghosts for non-grid layouts
            return (
                <div key={`${rIndex}-${cIndex}`} className="seat-cell empty" style={{ opacity: 0.25, minHeight: '60px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>·</span>
                </div>
            );
        }
        return (
            <div
                key={`${rIndex}-${cIndex}`}
                className="seat-cell occupied"
                onMouseEnter={() => setHoveredStudent(student.id)}
                onMouseLeave={() => setHoveredStudent(null)}
                style={{ position: 'relative' }}
            >
                <div className="seat-row-label">
                    {rIndex === 0 ? "Ön" : `${rIndex + 1}.`}
                </div>
                <div style={{ textAlign: 'center', marginTop: '2px' }}>
                    <span className="seat-name" title={student.name}>{student.name}</span>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '4px', alignItems: 'center' }}>
                        <span style={{
                            fontSize: '0.55rem', fontWeight: 700, color: 'white',
                            background: getBehaviorLabel(student.behaviorType).color,
                            padding: '1px 4px', borderRadius: '3px',
                        }}>
                            {getBehaviorLabel(student.behaviorType).label}
                        </span>
                        <span style={{
                            fontSize: '0.65rem', color: getAcademicLabel(student.academicLevel).color, fontWeight: 700,
                        }}>
                            {getAcademicLabel(student.academicLevel).label}
                        </span>
                        {getSpecialLabel(student.specialNeeds) && (
                            <span style={{
                                fontSize: '0.5rem', fontWeight: 700, color: 'white',
                                background: '#dc2626', padding: '0px 3px', borderRadius: '3px',
                            }}>⚕</span>
                        )}
                    </div>
                </div>

                {/* Hover tooltip */}
                {hoveredStudent === student.id && (
                    <div style={{
                        position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
                        transform: 'translateX(-50%)', background: 'white',
                        border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                        padding: '10px 14px', boxShadow: 'var(--shadow-lg)', zIndex: 100,
                        minWidth: '155px', textAlign: 'left', fontSize: '0.72rem',
                        color: 'var(--text)', animation: 'fadeIn 0.15s ease-out',
                    }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '5px', color: 'var(--primary)' }}>
                            {student.name}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div><span style={{ color: 'var(--text-muted)' }}>Akademik:</span> <strong>{getAcademicLabel(student.academicLevel).text}</strong></div>
                            <div><span style={{ color: 'var(--text-muted)' }}>Davranış:</span> <strong>{getBehaviorLabel(student.behaviorType).text}</strong></div>
                            <div><span style={{ color: 'var(--text-muted)' }}>Hareket:</span> <strong>{getMovementLabel(student.movementNeeds)}</strong></div>
                            {getLearningLabel(student.learningStyle) && (
                                <div><span style={{ color: 'var(--text-muted)' }}>Öğrenme:</span> <strong>{getLearningLabel(student.learningStyle)}</strong></div>
                            )}
                            {getHeightLabel(student.height) && (
                                <div><span style={{ color: 'var(--text-muted)' }}>Boy:</span> <strong>{getHeightLabel(student.height)}</strong></div>
                            )}
                            {getVisionLabel(student.visionNeeds) && (
                                <div><span style={{ color: 'var(--text-muted)' }}>Görme:</span> <strong style={{ color: '#0369a1' }}>{getVisionLabel(student.visionNeeds)}</strong></div>
                            )}
                            {getSpecialLabel(student.specialNeeds) && (
                                <div><span style={{ color: 'var(--text-muted)' }}>Özel:</span> <strong style={{ color: '#dc2626' }}>{getSpecialLabel(student.specialNeeds)}</strong></div>
                            )}
                            {student.friends?.length > 0 && (
                                <div><span style={{ color: 'var(--text-muted)' }}>Arkadaş:</span> <strong>{student.friends.join(', ')}</strong></div>
                            )}
                        </div>
                        <div style={{
                            position: 'absolute', bottom: '-5px', left: '50%',
                            transform: 'translateX(-50%) rotate(45deg)',
                            width: '10px', height: '10px', background: 'white',
                            border: '1px solid var(--border)', borderTop: 'none', borderLeft: 'none',
                        }} />
                    </div>
                )}
            </div>
        );
    };

    // Flatten assignments for non-grid layouts
    const studentList = assignments.map(a => a.student);

    // ─── U-Shape Layout ───
    const renderUShape = () => {
        const sideCount = Math.floor(studentList.length * 0.3);
        const bottomCount = studentList.length - sideCount * 2;
        const leftSide = studentList.slice(0, Math.min(sideCount, studentList.length));
        const rightSide = studentList.slice(sideCount, sideCount * 2);
        const bottom = studentList.slice(sideCount * 2);
        const maxSide = Math.max(leftSide.length, rightSide.length, 1);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'space-between' }}>
                    {/* Left column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '90px' }}>
                        {leftSide.map((s, i) => renderCell(s, i, 0))}
                    </div>
                    {/* Center empty space */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: maxSide * 90 }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', opacity: 0.4, textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📚</div>
                            Çalışma Alanı
                        </div>
                    </div>
                    {/* Right column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '90px' }}>
                        {rightSide.map((s, i) => renderCell(s, i, 1))}
                    </div>
                </div>
                {/* Bottom row */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {bottom.map((s, i) => (
                        <div key={i} style={{ width: '90px' }}>{renderCell(s, maxSide, i)}</div>
                    ))}
                </div>
            </div>
        );
    };

    // ─── Cluster Layout (Groups of 4) ───
    const renderCluster = () => {
        const groups: any[][] = [];
        for (let i = 0; i < studentList.length; i += 4) {
            groups.push(studentList.slice(i, i + 4));
        }
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {groups.map((group, gIdx) => (
                    <div key={gIdx} style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px',
                        padding: '10px', border: '2px solid var(--border)',
                        borderRadius: 'var(--radius-md)', background: 'var(--bg-muted)',
                    }}>
                        <div style={{
                            gridColumn: '1 / -1', textAlign: 'center',
                            fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)',
                            padding: '0 0 4px', borderBottom: '1px solid var(--border-light)',
                        }}>
                            Grup {gIdx + 1}
                        </div>
                        {group.map((s, i) => (
                            <div key={i} style={{ width: '85px' }}>{renderCell(s, gIdx, i)}</div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    // ─── Chevron (V-Shape) Layout ───
    const renderChevron = () => {
        const rowCount = Math.ceil(studentList.length / layout.cols);
        let idx = 0;
        const rows: any[][] = [];
        for (let r = 0; r < rowCount; r++) {
            const row = studentList.slice(idx, idx + layout.cols);
            rows.push(row);
            idx += layout.cols;
        }
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                {rows.map((row, rIdx) => (
                    <div key={rIdx} style={{
                        display: 'flex', gap: '8px', justifyContent: 'center',
                        paddingLeft: `${rIdx * 20}px`, paddingRight: `${rIdx * 20}px`,
                    }}>
                        {row.map((s, cIdx) => (
                            <div key={cIdx} style={{ width: '85px' }}>{renderCell(s, rIdx, cIdx)}</div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    // ─── Standard Grid (centered) ───
    const renderGrid = () => {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${layout.cols}, minmax(80px, 1fr))`,
                gap: '8px', marginTop: '12px',
            }}>
                {grid.map((row, rIndex) =>
                    row.map((student: any, cIndex: number) => renderCell(student, rIndex, cIndex))
                )}
            </div>
        );
    };

    // ─── Paired Desks (İkili Sıra) ───
    const renderPaired = () => {
        const pairsPerRow = Math.ceil(layout.cols / 2);
        const rowCount = Math.ceil(studentList.length / layout.cols);
        let idx = 0;
        const rows: any[][] = [];
        for (let r = 0; r < rowCount; r++) {
            const row = studentList.slice(idx, idx + layout.cols);
            rows.push(row);
            idx += layout.cols;
        }
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
                {rows.map((row, rIdx) => {
                    const pairs: any[][] = [];
                    for (let p = 0; p < row.length; p += 2) {
                        pairs.push(row.slice(p, p + 2));
                    }
                    return (
                        <div key={rIdx} style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            {pairs.map((pair, pIdx) => (
                                <div key={pIdx} style={{
                                    display: 'flex', gap: '2px',
                                    border: '2px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '4px',
                                    background: 'var(--bg-muted)',
                                }}>
                                    {pair.map((s, i) => (
                                        <div key={i} style={{ width: '85px' }}>
                                            {renderCell(s, rIdx, pIdx * 2 + i)}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    };

    // ─── Kelebek (Exam Anti-Cheat Checkerboard A/B) ───
    const renderButterfly = () => {
        return (
            <div>
                <div style={{
                    display: 'flex', gap: '12px', justifyContent: 'center',
                    marginBottom: '12px', fontSize: '0.72rem', fontWeight: 600,
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#dbeafe', border: '1.5px solid #3b82f6', display: 'inline-block' }} />
                        Sınav A
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#ffedd5', border: '1.5px solid #f97316', display: 'inline-block' }} />
                        Sınav B
                    </span>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${layout.cols}, minmax(80px, 1fr))`,
                    gap: '8px',
                }}>
                    {grid.map((row, rIndex) =>
                        row.map((student: any, cIndex: number) => {
                            const isGroupA = (rIndex + cIndex) % 2 === 0;
                            const colorStyle = isGroupA
                                ? { border: '2px solid #3b82f6', background: '#dbeafe' }
                                : { border: '2px solid #f97316', background: '#ffedd5' };
                            if (!student) {
                                return (
                                    <div key={`${rIndex}-${cIndex}`} className="seat-cell empty" style={{ opacity: 0.2, minHeight: '60px', ...colorStyle }}>
                                        <span style={{ fontSize: '0.55rem', fontWeight: 700, color: isGroupA ? '#3b82f6' : '#f97316' }}>
                                            {isGroupA ? 'A' : 'B'}
                                        </span>
                                    </div>
                                );
                            }
                            return (
                                <div
                                    key={`${rIndex}-${cIndex}`}
                                    className="seat-cell occupied"
                                    onMouseEnter={() => setHoveredStudent(student.id)}
                                    onMouseLeave={() => setHoveredStudent(null)}
                                    style={{ position: 'relative', ...colorStyle }}
                                >
                                    <div style={{
                                        position: 'absolute', top: '3px', right: '5px',
                                        fontSize: '0.6rem', fontWeight: 800,
                                        color: isGroupA ? '#2563eb' : '#ea580c',
                                    }}>
                                        {isGroupA ? 'A' : 'B'}
                                    </div>
                                    <div className="seat-row-label">
                                        {rIndex === 0 ? "Ön" : `${rIndex + 1}.`}
                                    </div>
                                    <div style={{ textAlign: 'center', marginTop: '2px' }}>
                                        <span className="seat-name" title={student.name}>{student.name}</span>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '4px', alignItems: 'center' }}>
                                            <span style={{
                                                fontSize: '0.55rem', fontWeight: 700, color: 'white',
                                                background: getBehaviorLabel(student.behaviorType).color,
                                                padding: '1px 4px', borderRadius: '3px',
                                            }}>
                                                {getBehaviorLabel(student.behaviorType).label}
                                            </span>
                                            <span style={{
                                                fontSize: '0.65rem', color: getAcademicLabel(student.academicLevel).color, fontWeight: 700,
                                            }}>
                                                {getAcademicLabel(student.academicLevel).label}
                                            </span>
                                        </div>
                                    </div>

                                    {hoveredStudent === student.id && (
                                        <div style={{
                                            position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
                                            transform: 'translateX(-50%)', background: 'white',
                                            border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                                            padding: '10px 14px', boxShadow: 'var(--shadow-lg)', zIndex: 100,
                                            minWidth: '155px', textAlign: 'left', fontSize: '0.72rem',
                                            color: 'var(--text)', animation: 'fadeIn 0.15s ease-out',
                                        }}>
                                            <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '5px', color: isGroupA ? '#2563eb' : '#ea580c' }}>
                                                {student.name} — Sınav {isGroupA ? 'A' : 'B'}
                                            </div>
                                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                                Komşu öğrenciler farklı sınav alır
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    };


    const renderLayout = () => {
        switch (layoutType) {
            case 'paired': return renderPaired();
            case 'u-shape': return renderUShape();
            case 'cluster': return renderCluster();
            case 'chevron': return renderChevron();
            case 'butterfly': return renderButterfly();
            default: return renderGrid();
        }
    };

    return (
        <div className="card" style={{ padding: '24px' }}>
            <div className="card-header">
                <span>📐 Sınıf Düzeni — {layoutLabels[layoutType] || 'Düz Sıra'}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                    {assignments.length} öğrenci
                </span>
            </div>

            {/* Teacher desk */}
            <div className="teacher-desk">🏫 Öğretmen Masası</div>

            {/* Grid Content */}
            <div style={{ marginTop: '12px' }}>
                {renderLayout()}
            </div>

            {/* Legend */}
            <div style={{
                marginTop: '14px', paddingTop: '10px',
                borderTop: '1px solid var(--border-light)',
                display: 'flex', flexWrap: 'wrap', gap: '10px',
                fontSize: '0.65rem', color: 'var(--text-muted)', alignItems: 'center',
            }}>
                <span style={{ fontWeight: 600 }}>Davranış:</span>
                <span><span style={{ color: '#7c3aed', fontWeight: 700 }}>Ld</span> Lider</span>
                <span><span style={{ color: '#15803d', fontWeight: 700 }}>Ss</span> Sessiz</span>
                <span><span style={{ color: '#dc2626', fontWeight: 700 }}>Dd</span> D.Dağıtıcı</span>
                <span><span style={{ color: '#0369a1', fontWeight: 700 }}>Ak</span> Aktif</span>
                <span style={{ opacity: 0.3 }}>|</span>
                <span><span style={{ color: '#0d6e64' }}>▲</span> Yüksek <span style={{ color: '#d97706' }}>▽</span> Düşük</span>
                <span style={{ opacity: 0.3 }}>|</span>
                <span><span style={{ color: '#dc2626', fontWeight: 700 }}>⚕</span> Özel</span>
            </div>
        </div>
    );
};
