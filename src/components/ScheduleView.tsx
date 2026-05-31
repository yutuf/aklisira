"use client";

import React, { useState } from 'react';
import { Lesson, DayOfWeek, WeeklySchedule } from '../types';

interface ScheduleViewProps {
  schedule: WeeklySchedule;
  classes: { id: string, name: string }[];
  onAddLesson: (lesson: Omit<Lesson, 'id'>) => void;
  onDeleteLesson: (id: string) => void;
}

const DAYS: { key: DayOfWeek, label: string }[] = [
  { key: 'monday', label: 'Pazartesi' },
  { key: 'tuesday', label: 'Salı' },
  { key: 'wednesday', label: 'Çarşamba' },
  { key: 'thursday', label: 'Perşembe' },
  { key: 'friday', label: 'Cuma' }
];

const HOURS = Array.from({ length: 9 }, (_, i) => `${i + 8}:00`);

export const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule, classes, onAddLesson, onDeleteLesson }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLesson, setNewLesson] = useState<Omit<Lesson, 'id'>>({
    subject: '',
    classId: classes[0]?.id || '',
    day: 'monday',
    startTime: '09:00',
    endTime: '09:40',
    color: '#4ade80'
  });

  const LESSON_COLORS = [
    '#4ade80', '#60a5fa', '#f87171', '#fbbf24', '#a78bfa', '#f472b6', '#2dd4bf'
  ];

  return (
    <div className="card animate-fade-in" style={{ padding: '24px' }}>
      <div className="card-header" style={{ marginBottom: '20px' }}>
        <span>📅 Ders Programı</span>
        <button 
          className="btn-primary" 
          onClick={() => setShowAddModal(true)}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          + Ders Ekle
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '800px', display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', gap: '1px', background: 'var(--border-light)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
          {/* Header */}
          <div style={{ background: 'var(--bg-muted)', padding: '12px', textAlign: 'center', fontWeight: 800, fontSize: '0.75rem' }}>SAAT</div>
          {DAYS.map(day => (
            <div key={day.key} style={{ background: 'var(--bg-muted)', padding: '12px', textAlign: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
              {day.label.toUpperCase()}
            </div>
          ))}

          {/* Grid Rows */}
          {HOURS.map(hour => (
            <React.Fragment key={hour}>
              <div style={{ background: 'white', padding: '12px', textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', borderRight: '1px solid var(--border-light)' }}>
                {hour}
              </div>
              {DAYS.map(day => {
                const lessonsAtThisTime = schedule.lessons.filter(l => l.day === day.key && l.startTime.startsWith(hour.split(':')[0]));
                return (
                  <div key={day.key} style={{ background: 'white', minHeight: '80px', padding: '4px', position: 'relative' }}>
                    {lessonsAtThisTime.map(lesson => (
                      <div 
                        key={lesson.id}
                        style={{
                          background: lesson.color || 'var(--primary-pale)',
                          color: 'white',
                          padding: '6px 8px',
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          marginBottom: '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span>{lesson.subject}</span>
                          <button 
                            onClick={() => onDeleteLesson(lesson.id)}
                            style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', borderRadius: '4px', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.6rem' }}
                          >
                            ×
                          </button>
                        </div>
                        <div style={{ fontSize: '0.6rem', opacity: 0.9, marginTop: '2px' }}>
                          {classes.find(c => c.id === lesson.classId)?.name || 'Sınıf Bilinmiyor'}
                        </div>
                        <div style={{ fontSize: '0.55rem', opacity: 0.8 }}>
                          {lesson.startTime} - {lesson.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Add Lesson Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600, padding: '16px' }}>
          <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1.2rem', fontWeight: 900 }}>Yeni Ders Ekle</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label>Ders Adı</label>
                <input 
                  type="text" className="form-input" placeholder="Örn: Matematik"
                  value={newLesson.subject} onChange={e => setNewLesson({...newLesson, subject: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Sınıf</label>
                <select 
                  className="form-input" 
                  value={newLesson.classId} 
                  onChange={e => setNewLesson({...newLesson, classId: e.target.value})}
                >
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  {classes.length === 0 && <option value="">Önce Sınıf Oluşturun</option>}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Gün</label>
                  <select 
                    className="form-input" 
                    value={newLesson.day} 
                    onChange={e => setNewLesson({...newLesson, day: e.target.value as DayOfWeek})}
                  >
                    {DAYS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Renk</label>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {LESSON_COLORS.map(c => (
                      <div 
                        key={c} 
                        onClick={() => setNewLesson({...newLesson, color: c})}
                        style={{ width: '20px', height: '20px', borderRadius: '50%', background: c, cursor: 'pointer', border: newLesson.color === c ? '2px solid black' : 'none' }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Başlangıç</label>
                  <input 
                    type="time" className="form-input" 
                    value={newLesson.startTime} onChange={e => setNewLesson({...newLesson, startTime: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Bitiş</label>
                  <input 
                    type="time" className="form-input" 
                    value={newLesson.endTime} onChange={e => setNewLesson({...newLesson, endTime: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button 
                  className="btn-primary" 
                  style={{ flex: 1 }}
                  onClick={() => {
                    if (!newLesson.subject || !newLesson.classId) return;
                    onAddLesson(newLesson);
                    setShowAddModal(false);
                    setNewLesson({...newLesson, subject: ''});
                  }}
                >
                  Kaydet
                </button>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>İptal</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
