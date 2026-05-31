"use client";

import React, { useState } from 'react';
import { ParentMeeting, Student } from '../types';

interface MeetingManagerProps {
  meetings: ParentMeeting[];
  students: Student[];
  onAddMeeting: (meeting: Omit<ParentMeeting, 'id'>) => void;
  onUpdateMeeting: (id: string, updates: Partial<ParentMeeting>) => void;
  onDeleteMeeting: (id: string) => void;
}

export const MeetingManager: React.FC<MeetingManagerProps> = ({ 
  meetings, students, onAddMeeting, onUpdateMeeting, onDeleteMeeting 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null);
  const [newMeeting, setNewMeeting] = useState<Omit<ParentMeeting, 'id'>>({
    studentId: students[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '15:30',
    topic: 'Genel Durum Değerlendirmesi',
    status: 'scheduled'
  });

  const activeMeeting = meetings.find(m => m.id === activeMeetingId);
  const activeStudent = students.find(s => s.id === activeMeeting?.studentId);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: activeMeeting ? '300px 1fr' : '1fr', gap: '24px' }}>
      
      {/* ─── Meeting List ─── */}
      <div className="card animate-fade-in" style={{ padding: '20px' }}>
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <span>📅 Veli Görüşmeleri</span>
          <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>+ Yeni Randevu</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {meetings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🤝</div>
              <p style={{ fontSize: '0.85rem' }}>Henüz planlanmış bir görüşme yok.</p>
            </div>
          ) : (
            meetings.sort((a,b) => a.date.localeCompare(b.date)).map(m => {
              const student = students.find(s => s.id === m.studentId);
              return (
                <div 
                  key={m.id} 
                  onClick={() => setActiveMeetingId(m.id)}
                  style={{ 
                    padding: '12px', borderRadius: '12px', border: `2px solid ${activeMeetingId === m.id ? 'var(--primary)' : 'var(--border-light)'}`,
                    background: activeMeetingId === m.id ? 'var(--primary-pale)' : 'white',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{student?.name || 'Bilinmeyen'}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)' }}>{m.time}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.date}</div>
                  <div style={{ fontSize: '0.7rem', marginTop: '4px', fontStyle: 'italic' }}>{m.topic}</div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ─── Active Meeting Detail (Meeting Mode) ─── */}
      {activeMeeting && activeStudent && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ borderLeft: '6px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>{activeStudent.name} - Veli Görüşmesi</h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{activeMeeting.date} | {activeMeeting.time}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                 <button onClick={() => onUpdateMeeting(activeMeeting.id, { status: 'completed' })} className="btn-primary" style={{ background: '#22c55e', border: 'none', padding: '8px 16px' }}>✓ Tamamlandı</button>
                 <button onClick={() => setActiveMeetingId(null)} className="btn-secondary">Kapat</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Student Overview */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px' }}>📊 ÖĞRENCİ ÖZETİ</h4>
                <div className="card" style={{ background: 'var(--bg-muted)', border: 'none', padding: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Akademik Seviye:</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{activeStudent.academicLevel.toUpperCase()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Devamsızlık:</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{activeStudent.attendance?.filter(a => a.status === 'absent').length || 0} Gün</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Toplam Gözlem:</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{activeStudent.observations?.length || 0} Kayıt</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Behavior & Traits */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px' }}>🧠 DAVRANIŞ & MİZAÇ</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'var(--primary-pale)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700 }}>{activeStudent.behaviorType}</span>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'var(--accent-pale)', color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 700 }}>{activeStudent.learningStyle || 'Genel'}</span>
                  {activeStudent.specialNeeds !== 'none' && <span style={{ padding: '4px 10px', borderRadius: '20px', background: '#fee2e2', color: '#ef4444', fontSize: '0.7rem', fontWeight: 700 }}>Özel: {activeStudent.specialNeeds}</span>}
                </div>
              </div>
            </div>

            {/* Observation History */}
            <div style={{ marginTop: '24px' }}>
               <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px' }}>✍️ GÖZLEM GEÇMİŞİ</h4>
               <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 {activeStudent.observations?.map(obs => (
                   <div key={obs.id} style={{ padding: '10px', borderRadius: '8px', background: 'white', border: '1px solid var(--border-light)' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '4px' }}>
                       <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{obs.type.toUpperCase()}</span>
                       <span style={{ color: 'var(--text-muted)' }}>{obs.date}</span>
                     </div>
                     <div style={{ fontSize: '0.75rem' }}>{obs.text}</div>
                   </div>
                 ))}
                 {(!activeStudent.observations || activeStudent.observations.length === 0) && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Henüz gözlem kaydı bulunmuyor.</p>}
               </div>
            </div>

            {/* Meeting Notes */}
            <div style={{ marginTop: '24px' }}>
               <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px' }}>📝 GÖRÜŞME NOTLARI (Veliye İletilecek)</h4>
               <textarea 
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.85rem', minHeight: '100px' }}
                  placeholder="Görüşme sırasında aldığınız notları buraya ekleyin..."
                  value={activeMeeting.notes || ''}
                  onChange={(e) => onUpdateMeeting(activeMeeting.id, { notes: e.target.value })}
               />
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600, padding: '16px' }}>
          <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1.2rem', fontWeight: 900 }}>Randevu Oluştur</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label>Öğrenci</label>
                <select className="form-input" value={newMeeting.studentId} onChange={e => setNewMeeting({...newMeeting, studentId: e.target.value})}>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Tarih</label>
                  <input type="date" className="form-input" value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Saat</label>
                  <input type="time" className="form-input" value={newMeeting.time} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Konu</label>
                <input type="text" className="form-input" value={newMeeting.topic} onChange={e => setNewMeeting({...newMeeting, topic: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button 
                  className="btn-primary" style={{ flex: 1 }}
                  onClick={() => { onAddMeeting(newMeeting); setShowAddModal(false); }}
                >Randevuyu Kaydet</button>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>İptal</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
