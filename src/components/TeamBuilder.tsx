"use client";

import React, { useState } from 'react';
import { Student } from '../types';

interface TeamBuilderProps {
  students: Student[];
}

export const TeamBuilder: React.FC<TeamBuilderProps> = ({ students }) => {
  const [teamCount, setTeamCount] = useState<number>(4);
  const [teams, setTeams] = useState<Student[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Group strategy
  const [strategy, setStrategy] = useState<'mixed' | 'similar'>('mixed');

  const generateTeams = () => {
    setIsGenerating(true);

    setTimeout(() => {
      // Very basic team builder. Real one should use GeneticSolver logic.
      // We will sort students by academic level as a proxy for distributing them evenly
      const academicRank = (level: string) => {
        switch (level) {
          case 'high': return 5;
          case 'above_average': return 4;
          case 'average': return 3;
          case 'below_average': return 2;
          case 'struggling': return 1;
          default: return 3;
        }
      };

      const sortedStudents = [...students].sort((a, b) => 
        academicRank(b.academicLevel) - academicRank(a.academicLevel)
      );

      // Initialize empty teams
      const newTeams: Student[][] = Array.from({ length: teamCount }, () => []);

      if (strategy === 'mixed') {
        // Snake distribution to balance teams
        sortedStudents.forEach((student, index) => {
          // Go 0, 1, 2, 3, 3, 2, 1, 0, 0, 1...
          const cycle = Math.floor(index / teamCount);
          let assignedTeam = index % teamCount;
          if (cycle % 2 !== 0) {
            assignedTeam = teamCount - 1 - assignedTeam;
          }
          newTeams[assignedTeam].push(student);
        });
      } else {
        // Similar levels together
        newTeams.forEach((team, teamIndex) => {
          const startIndex = Math.floor((teamIndex * sortedStudents.length) / teamCount);
          const endIndex = Math.floor(((teamIndex + 1) * sortedStudents.length) / teamCount);
          for (let i = startIndex; i < endIndex; i++) {
            team.push(sortedStudents[i]);
          }
        });
      }

      // Quick shuffle inside teams just so it looks random
      newTeams.forEach(team => team.sort(() => Math.random() - 0.5));

      setTeams(newTeams);
      setIsGenerating(false);
    }, 400); // Fake delay for UX
  };

  const getAcademicColor = (level: string) => {
    switch(level) {
      case 'high': return '#22c55e'; // green
      case 'above_average': return '#84cc16';
      case 'average': return '#eab308'; // yellow
      case 'below_average': return '#f97316'; // orange
      case 'struggling': return '#ef4444'; // red
      default: return '#94a3b8';
    }
  };

  if (students.length === 0) {
    return (
        <div className="empty-state">
            <div className="icon">👥</div>
            <p>
                Takım oluşturmak için önce <strong>Sınıf Düzeni</strong> sekmesinden öğrencileri yükleyin.
            </p>
        </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>
      
      {/* ═══ Left Sidebar ═══ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="card animate-fade-in">
          <div className="card-header">
            <span>⚙️ Takım Kuralları</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700 }}>
              {students.length} öğrenci
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Takım Sayısı</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input 
                  type="range" 
                  min="2" 
                  max="10" 
                  value={teamCount} 
                  onChange={(e) => setTeamCount(parseInt(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontWeight: 800, width: '20px', textAlign: 'center' }}>{teamCount}</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Takım başına ortalama {(students.length / teamCount).toFixed(1)} kişi
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Dağıtım Stratejisi</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px', marginTop: '6px' }}>
                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', 
                  border: `1.5px solid ${strategy === 'mixed' ? 'var(--primary)' : 'var(--border)'}`, 
                  borderRadius: '6px', cursor: 'pointer', background: strategy === 'mixed' ? 'var(--primary-light)' : 'transparent' 
                }}>
                  <input type="radio" checked={strategy === 'mixed'} onChange={() => setStrategy('mixed')} style={{ margin: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: strategy === 'mixed' ? 'var(--primary-dark)' : 'var(--text)' }}>Dengeli Dağılım</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Her takımda farklı akademik seviyeden öğrenciler olur.</div>
                  </div>
                </label>

                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', 
                  border: `1.5px solid ${strategy === 'similar' ? 'var(--primary)' : 'var(--border)'}`, 
                  borderRadius: '6px', cursor: 'pointer', background: strategy === 'similar' ? 'var(--primary-light)' : 'transparent' 
                }}>
                  <input type="radio" checked={strategy === 'similar'} onChange={() => setStrategy('similar')} style={{ margin: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: strategy === 'similar' ? 'var(--primary-dark)' : 'var(--text)' }}>Benzer Seviyeler</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Aynı akademik seviyedeki öğrenciler aynı takıma atanır.</div>
                  </div>
                </label>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={generateTeams} 
              disabled={isGenerating}
              style={{ padding: '12px', fontWeight: 800, marginTop: '8px' }}
            >
              {isGenerating ? '⏳ Takımlar Kuruluyor...' : '🎯 Takımları Oluştur'}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Right Content ═══ */}
      <div>
        {teams.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🤝</div>
            <p>Sol taraftan kuralları belirleyip takım oluşturabilirsiniz.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {teams.map((team, idx) => {
              // Calculate avg academic score for the team
              const ranks = team.map(t => {
                switch (t.academicLevel) {
                  case 'high': return 100;
                  case 'above_average': return 80;
                  case 'average': return 60;
                  case 'below_average': return 40;
                  case 'struggling': return 20;
                  default: return 60;
                }
              });
              const avgScore = ranks.length > 0 ? ranks.reduce((a, b) => a + b, 0) / ranks.length : 0;
              
              return (
                <div key={idx} className="card animate-fade-in" style={{ 
                  padding: '16px', 
                  borderTop: `4px solid hsl(${(idx * 360 / teamCount)}, 70%, 50%)`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Takım {idx + 1}</h3>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', background: 'var(--bg-muted)', padding: '2px 6px', borderRadius: '4px' }}>
                      Puan: {Math.round(avgScore)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {team.map((student, sIdx) => (
                      <div key={sIdx} style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '6px 8px', background: 'var(--bg-muted)', borderRadius: '6px',
                        border: '1px solid var(--border-light)'
                      }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{student.name}</div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                           <span style={{ 
                              width: '8px', height: '8px', borderRadius: '50%', 
                              background: getAcademicColor(student.academicLevel),
                              marginTop: '4px'
                           }} title={`Akademik: ${student.academicLevel}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
