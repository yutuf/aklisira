"use client";

import React, { useState } from 'react';

interface ExamClass {
  id: string;
  name: string; // e.g. "5-A", "6-B"
  students: string[];
}

interface ExamRoom {
  id: string;
  name: string; // e.g. "Salon 1"
  capacity: number;
  rows: number;
  cols: number;
}

interface ExamSeat {
  studentName: string;
  className: string;
  row: number;
  col: number;
  examVersion: 'A' | 'B' | 'C' | 'D';
}

interface RoomAssignment {
  room: ExamRoom;
  seats: ExamSeat[];
}

// Assign exam version based on position (4-version kelebek pattern)
const getExamVersion = (row: number, col: number): 'A' | 'B' | 'C' | 'D' => {
  const r = row % 2;
  const c = col % 2;
  if (r === 0 && c === 0) return 'A';
  if (r === 0 && c === 1) return 'B';
  if (r === 1 && c === 0) return 'C';
  return 'D';
};

const examVersionColors: Record<string, { bg: string; border: string; text: string }> = {
  A: { bg: '#dbeafe', border: '#3b82f6', text: '#1d4ed8' },
  B: { bg: '#ffedd5', border: '#f97316', text: '#c2410c' },
  C: { bg: '#dcfce7', border: '#22c55e', text: '#15803d' },
  D: { bg: '#fae8ff', border: '#d946ef', text: '#a21caf' },
};

export const ExamMode: React.FC = () => {
  const [classes, setClasses] = useState<ExamClass[]>([]);
  const [rooms, setRooms] = useState<ExamRoom[]>([
    { id: 'r1', name: 'Salon 1', capacity: 30, rows: 5, cols: 6 },
    { id: 'r2', name: 'Salon 2', capacity: 30, rows: 5, cols: 6 },
  ]);
  const [classInput, setClassInput] = useState('');
  const [className, setClassName] = useState('');
  const [results, setResults] = useState<RoomAssignment[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number>(0);

  // Add a class with its student list
  const addClass = () => {
    if (!className.trim() || !classInput.trim()) return;
    const studentNames = classInput
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (studentNames.length === 0) return;

    setClasses(prev => [...prev, {
      id: `c-${Date.now()}`,
      name: className.trim(),
      students: studentNames,
    }]);
    setClassName('');
    setClassInput('');
  };

  // Add room
  const addRoom = () => {
    setRooms(prev => [...prev, {
      id: `r-${Date.now()}`,
      name: `Salon ${prev.length + 1}`,
      capacity: 30,
      rows: 5,
      cols: 6,
    }]);
  };

  // Remove class/room
  const removeClass = (id: string) => setClasses(prev => prev.filter(c => c.id !== id));
  const removeRoom = (id: string) => {
    if (rooms.length <= 1) return;
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  // ─── KELEBEK ALGORITHM ───
  const runKelebek = () => {
    // Flatten ALL students with their class info
    const allStudents = classes.flatMap(c =>
      c.students.map(s => ({ name: s, className: c.name }))
    );

    // Shuffle randomly
    const shuffled = [...allStudents].sort(() => Math.random() - 0.5);

    // Distribute across rooms, maximizing class separation
    const roomAssignments: RoomAssignment[] = rooms.map(room => ({
      room,
      seats: [],
    }));

    let studentIdx = 0;
    for (const ra of roomAssignments) {
      const { room } = ra;
      const seats: ExamSeat[] = [];

      for (let r = 0; r < room.rows && studentIdx < shuffled.length; r++) {
        for (let c = 0; c < room.cols && studentIdx < shuffled.length; c++) {
          seats.push({
            studentName: shuffled[studentIdx].name,
            className: shuffled[studentIdx].className,
            row: r,
            col: c,
            examVersion: getExamVersion(r, c),
          });
          studentIdx++;
        }
      }
      ra.seats = seats;
    }

    // Post-process: swap students to minimize same-class adjacency
    for (const ra of roomAssignments) {
      for (let pass = 0; pass < 50; pass++) {
        for (let i = 0; i < ra.seats.length; i++) {
          const s1 = ra.seats[i];
          // Check if any neighbor is from same class
          const hasConflict = ra.seats.some(s2 => {
            if (s1 === s2) return false;
            const dr = Math.abs(s1.row - s2.row);
            const dc = Math.abs(s1.col - s2.col);
            return dr <= 1 && dc <= 1 && s1.className === s2.className;
          });

          if (hasConflict) {
            // Find a non-conflicting swap partner
            const swapIdx = ra.seats.findIndex((s2, j) => {
              if (j === i) return false;
              // Would s2 at position of s1 cause conflict?
              const s2AtS1Conflict = ra.seats.some(s3 => {
                if (s3 === s1 || s3 === s2) return false;
                const dr = Math.abs(s1.row - s3.row);
                const dc = Math.abs(s1.col - s3.col);
                return dr <= 1 && dc <= 1 && s2.className === s3.className;
              });
              // Would s1 at position of s2 cause conflict?
              const s1AtS2Conflict = ra.seats.some(s3 => {
                if (s3 === s1 || s3 === s2) return false;
                const dr = Math.abs(s2.row - s3.row);
                const dc = Math.abs(s2.col - s3.col);
                return dr <= 1 && dc <= 1 && s1.className === s3.className;
              });
              return !s2AtS1Conflict && !s1AtS2Conflict;
            });

            if (swapIdx !== -1) {
              // Swap student info but keep positions
              const tempName = s1.studentName;
              const tempClass = s1.className;
              s1.studentName = ra.seats[swapIdx].studentName;
              s1.className = ra.seats[swapIdx].className;
              ra.seats[swapIdx].studentName = tempName;
              ra.seats[swapIdx].className = tempClass;
            }
          }
        }
      }
    }

    setResults(roomAssignments);
    setSelectedRoom(0);
  };

  const totalStudents = classes.reduce((sum, c) => sum + c.students.length, 0);
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);

  // Generate unique colors for each class
  const classColors: Record<string, string> = {};
  const colorPalette = ['#3b82f6', '#f97316', '#22c55e', '#d946ef', '#ef4444', '#06b6d4', '#eab308', '#8b5cf6', '#ec4899', '#14b8a6'];
  classes.forEach((c, i) => {
    classColors[c.name] = colorPalette[i % colorPalette.length];
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }}>
      {/* ═══ Left Panel ═══ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Add Class Card */}
        <div className="card animate-fade-in">
          <div className="card-header">
            <span>🏫 Sınıf Ekle</span>
          </div>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
            <input
              type="text"
              value={className}
              onChange={e => setClassName(e.target.value)}
              placeholder="Sınıf adı (ör: 5-A)"
              style={{
                flex: 1, padding: '8px 12px', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-sm)', fontSize: '0.82rem',
                background: 'var(--bg-elevated)', color: 'var(--text)',
              }}
            />
          </div>

          <textarea
            value={classInput}
            onChange={e => setClassInput(e.target.value)}
            placeholder={"Öğrenci isimlerini girin (her satıra bir isim):\nAli Yılmaz\nElif Kaya\nMehmet Demir"}
            rows={4}
            style={{
              width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', resize: 'vertical',
              background: 'var(--bg-elevated)', color: 'var(--text)',
              fontFamily: 'inherit', marginBottom: '8px',
            }}
          />

          <button onClick={addClass} className="btn-primary" style={{ width: '100%' }}
            disabled={!className.trim() || !classInput.trim()}>
            ➕ Sınıfı Ekle
          </button>
        </div>

        {/* Classes Summary */}
        {classes.length > 0 && (
          <div className="card animate-fade-in">
            <div className="card-header">
              <span>📋 Sınıflar</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700 }}>
                {totalStudents} öğrenci
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {classes.map(c => (
                <div key={c.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '6px 10px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)', background: 'var(--bg-muted)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: classColors[c.name], display: 'inline-block',
                    }} />
                    <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{c.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      ({c.students.length} kişi)
                    </span>
                  </div>
                  <button onClick={() => removeClass(c.id)} style={{
                    background: 'none', border: 'none', color: '#ef4444',
                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
                  }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rooms Config */}
        <div className="card animate-fade-in">
          <div className="card-header">
            <span>🚪 Sınav Salonları</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {totalCapacity} kapasite
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {rooms.map((room, idx) => (
              <div key={room.id} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)', background: 'var(--bg-muted)',
              }}>
                <input
                  value={room.name}
                  onChange={e => {
                    const updated = [...rooms];
                    updated[idx] = { ...room, name: e.target.value };
                    setRooms(updated);
                  }}
                  style={{
                    flex: 1, border: 'none', background: 'transparent',
                    fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)',
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem' }}>
                  <button className="btn-stepper" onClick={() => {
                    const updated = [...rooms];
                    updated[idx] = { ...room, rows: Math.max(2, room.rows - 1), capacity: Math.max(2, room.rows - 1) * room.cols };
                    setRooms(updated);
                  }}>−</button>
                  <span style={{ fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>{room.rows}</span>
                  <button className="btn-stepper" onClick={() => {
                    const updated = [...rooms];
                    updated[idx] = { ...room, rows: room.rows + 1, capacity: (room.rows + 1) * room.cols };
                    setRooms(updated);
                  }}>+</button>
                  <span style={{ color: 'var(--text-muted)', margin: '0 2px' }}>×</span>
                  <button className="btn-stepper" onClick={() => {
                    const updated = [...rooms];
                    updated[idx] = { ...room, cols: Math.max(2, room.cols - 1), capacity: room.rows * Math.max(2, room.cols - 1) };
                    setRooms(updated);
                  }}>−</button>
                  <span style={{ fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>{room.cols}</span>
                  <button className="btn-stepper" onClick={() => {
                    const updated = [...rooms];
                    updated[idx] = { ...room, cols: room.cols + 1, capacity: room.rows * (room.cols + 1) };
                    setRooms(updated);
                  }}>+</button>
                </div>
                <button onClick={() => removeRoom(room.id)} style={{
                  background: 'none', border: 'none', color: '#ef4444',
                  cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
                }} disabled={rooms.length <= 1}>✕</button>
              </div>
            ))}
          </div>
          <button onClick={addRoom} style={{
            width: '100%', marginTop: '8px', padding: '6px',
            border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-sm)',
            background: 'transparent', color: 'var(--text-muted)',
            cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600,
          }}>
            + Salon Ekle
          </button>
        </div>

        {/* Run Button */}
        <button
          onClick={runKelebek}
          className="btn-primary"
          disabled={classes.length < 2 || totalStudents === 0}
          style={{
            width: '100%', padding: '14px', fontSize: '1rem',
            fontWeight: 800, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
          }}
        >
          🦋 Kelebek Düzeni Oluştur
        </button>

        {totalStudents > totalCapacity && (
          <div style={{
            padding: '8px 12px', borderRadius: 'var(--radius-sm)',
            background: '#fef2f2', border: '1px solid #fca5a5',
            fontSize: '0.72rem', color: '#dc2626', fontWeight: 600,
          }}>
            ⚠️ Kapasite yetersiz! {totalStudents} öğrenci / {totalCapacity} koltuk
          </div>
        )}
      </div>

      {/* ═══ Right Panel — Results ═══ */}
      <div>
        {results.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🦋</div>
            <p>
              En az <strong>2 sınıf</strong> ekleyin ve <strong>Kelebek Düzeni Oluştur</strong> butonuna tıklayın.
              <br /><br />
              Öğrenciler farklı sınıflardan gelen kişilerle karıştırılarak sınav salonlarına dağıtılacak.
              Aynı sınıftan iki öğrenci yan yana oturmayacak.
            </p>
          </div>
        ) : (
          <div>
            {/* Room Tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
              {results.map((ra, idx) => (
                <button
                  key={ra.room.id}
                  onClick={() => setSelectedRoom(idx)}
                  style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                    border: selectedRoom === idx ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                    background: selectedRoom === idx ? 'var(--primary-light)' : 'var(--bg-elevated)',
                    fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                    color: selectedRoom === idx ? 'var(--primary-dark)' : 'var(--text-muted)',
                  }}
                >
                  {ra.room.name} ({ra.seats.length} kişi)
                </button>
              ))}
            </div>

            {/* Active Room Grid */}
            {results[selectedRoom] && (
              <div className="card" style={{ padding: '24px' }}>
                <div className="card-header" style={{ marginBottom: '12px' }}>
                  <span>🏫 {results[selectedRoom].room.name} — Kelebek Düzeni</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                    {results[selectedRoom].seats.length} öğrenci
                  </span>
                </div>

                {/* Exam version legend */}
                <div style={{
                  display: 'flex', gap: '12px', justifyContent: 'center',
                  marginBottom: '12px', fontSize: '0.72rem', fontWeight: 600,
                }}>
                  {(['A', 'B', 'C', 'D'] as const).map(v => (
                    <span key={v} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{
                        width: '14px', height: '14px', borderRadius: '3px',
                        background: examVersionColors[v].bg,
                        border: `1.5px solid ${examVersionColors[v].border}`,
                        display: 'inline-block',
                      }} />
                      Sınav {v}
                    </span>
                  ))}
                </div>

                {/* Class color legend */}
                <div style={{
                  display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap',
                  marginBottom: '14px', fontSize: '0.65rem', fontWeight: 600,
                  color: 'var(--text-muted)',
                }}>
                  {classes.map(c => (
                    <span key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: classColors[c.name], display: 'inline-block',
                      }} />
                      {c.name}
                    </span>
                  ))}
                </div>

                {/* Teacher desk */}
                <div className="teacher-desk">🏫 Gözetmen Masası</div>

                {/* Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${results[selectedRoom].room.cols}, minmax(80px, 1fr))`,
                  gap: '6px', marginTop: '12px',
                }}>
                  {Array.from({ length: results[selectedRoom].room.rows }).map((_, rIdx) =>
                    Array.from({ length: results[selectedRoom].room.cols }).map((_, cIdx) => {
                      const seat = results[selectedRoom].seats.find(s => s.row === rIdx && s.col === cIdx);
                      const version = getExamVersion(rIdx, cIdx);
                      const vc = examVersionColors[version];

                      if (!seat) {
                        return (
                          <div key={`${rIdx}-${cIdx}`} style={{
                            padding: '8px', borderRadius: 'var(--radius-sm)',
                            border: `1.5px solid ${vc.border}`, background: vc.bg,
                            opacity: 0.2, minHeight: '55px', textAlign: 'center',
                          }}>
                            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: vc.text }}>{version}</span>
                          </div>
                        );
                      }

                      return (
                        <div key={`${rIdx}-${cIdx}`} style={{
                          padding: '8px 6px', borderRadius: 'var(--radius-sm)',
                          border: `2px solid ${vc.border}`, background: vc.bg,
                          textAlign: 'center', position: 'relative',
                          minHeight: '55px', display: 'flex', flexDirection: 'column',
                          justifyContent: 'center', gap: '3px',
                        }}>
                          <div style={{
                            position: 'absolute', top: '3px', right: '5px',
                            fontSize: '0.55rem', fontWeight: 800, color: vc.text,
                          }}>
                            {version}
                          </div>
                          <div style={{
                            fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {seat.studentName}
                          </div>
                          <div style={{
                            fontSize: '0.58rem', fontWeight: 700,
                            color: classColors[seat.className] || '#666',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px',
                          }}>
                            <span style={{
                              width: '6px', height: '6px', borderRadius: '50%',
                              background: classColors[seat.className] || '#666',
                              display: 'inline-block',
                            }} />
                            {seat.className}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Stats */}
                <div style={{
                  marginTop: '14px', paddingTop: '10px',
                  borderTop: '1px solid var(--border-light)',
                  display: 'flex', flexWrap: 'wrap', gap: '16px',
                  fontSize: '0.68rem', color: 'var(--text-muted)',
                }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>Sınıf Karışımı: </span>
                    {(() => {
                      const classesInRoom = new Set(results[selectedRoom].seats.map(s => s.className));
                      return `${classesInRoom.size} farklı sınıf`;
                    })()}
                  </div>
                  <div>
                    <span style={{ fontWeight: 700 }}>Çakışma: </span>
                    {(() => {
                      let conflicts = 0;
                      const seats = results[selectedRoom].seats;
                      seats.forEach(s1 => {
                        seats.forEach(s2 => {
                          if (s1 === s2) return;
                          const dr = Math.abs(s1.row - s2.row);
                          const dc = Math.abs(s1.col - s2.col);
                          if (dr <= 1 && dc <= 1 && s1.className === s2.className) conflicts++;
                        });
                      });
                      conflicts = conflicts / 2; // each pair counted twice
                      return conflicts === 0
                        ? '✅ Yok — mükemmel dağılım!'
                        : `⚠️ ${conflicts} aynı sınıf komşuluğu`;
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
