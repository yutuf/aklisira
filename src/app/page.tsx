"use client";

import { useState, useEffect } from 'react';
import { Student, ClassroomLayout, SeatingAssignment } from '../types';
import { parseStudentsCSV } from '../utils/csv-parser';
import { parseNaturalLanguage } from '../utils/nlp-parser';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { GeneticSolver } from '../utils/genetic-solver';
import { SeatingGrid } from '../components/SeatingGrid';
import { generateLayoutExplanation } from '../utils/ai-explanation-service';
import { calculateMetrics } from '../utils/scoring-utils';

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [layout, setLayout] = useState<ClassroomLayout>({ rows: 5, cols: 6, seats: [] });
  const [assignments, setAssignments] = useState<SeatingAssignment[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [currentMetrics, setCurrentMetrics] = useState<any>(null);
  const [aiExplanation, setAiExplanation] = useState("");

  // Input state
  const [inputMode, setInputMode] = useState<'csv' | 'smart'>('smart');
  const [smartText, setSmartText] = useState("");
  const { isListening, transcript, startListening, isSupported, setTranscript } = useVoiceInput();

  // Voice → text
  useEffect(() => {
    if (transcript) {
      setSmartText(prev => prev + (prev ? "\n" : "") + transcript);
      setTranscript("");
    }
  }, [transcript, setTranscript]);

  const handleSmartParse = () => {
    if (!smartText.trim()) return;
    const parsed = parseNaturalLanguage(smartText);
    setStudents(prev => [...prev, ...parsed]);
    setSmartText("");
    const total = students.length + parsed.length;
    const rows = Math.ceil(total / 6);
    setLayout(prev => ({ ...prev, rows: Math.max(rows, 4) }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        try {
          const parsed = parseStudentsCSV(text);
          setStudents(parsed);
          const rows = Math.ceil(parsed.length / 6);
          setLayout(prev => ({ ...prev, rows: Math.max(rows, 4) }));
        } catch {
          alert("CSV dosyası okunamadı. Lütfen formatı kontrol edin.");
        }
      };
      reader.readAsText(file);
    }
  };

  const startOptimization = async () => {
    if (students.length === 0) return;
    setIsOptimizing(true);
    setGeneration(0);
    setAiExplanation("");

    const solver = new GeneticSolver(students, layout);
    solver.initialize();

    let gen = 0;
    const maxGens = 50;

    const interval = setInterval(() => {
      if (gen >= maxGens) {
        clearInterval(interval);
        setIsOptimizing(false);
        const finalMetrics = calculateMetrics(solver.evolve(0).assignments);
        setAiExplanation(generateLayoutExplanation(finalMetrics, solver.evolve(0).assignments));
        return;
      }

      const bestGenome = solver.nextGeneration();
      setAssignments([...bestGenome.assignments]);
      setCurrentMetrics(calculateMetrics(bestGenome.assignments));
      setGeneration(gen + 1);
      gen++;
    }, 100);
  };

  const exportResults = () => {
    const data = {
      project: "AklıSıra",
      timestamp: new Date().toISOString(),
      students: students.map(s => ({
        name: s.name,
        academicLevel: s.academicLevel,
        behaviorType: s.behaviorType,
        movementNeeds: s.movementNeeds,
        specialNeeds: s.specialNeeds,
      })),
      seatingOrder: assignments.map(a => ({
        name: a.student.name,
        row: a.row,
        col: a.col,
        seatIndex: a.seatIndex,
      })),
      metrics: currentMetrics,
      aiAnalysis: aiExplanation,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aklisira-sonuc.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearStudents = () => {
    setStudents([]);
    setAssignments([]);
    setCurrentMetrics(null);
    setAiExplanation("");
    setGeneration(0);
  };

  const loadDemoData = () => {
    const demoStudents: Student[] = [
      { id: 'd1', name: 'Ali', academicLevel: 'high', behaviorType: 'leader', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Mehmet'], avoidStudents: ['Burak'] },
      { id: 'd2', name: 'Elif', academicLevel: 'high', behaviorType: 'quiet', movementNeeds: 'low', specialNeeds: 'none', friends: ['Zeynep'], avoidStudents: [] },
      { id: 'd3', name: 'Mehmet', academicLevel: 'above_average', behaviorType: 'active', movementNeeds: 'high', specialNeeds: 'adhd', friends: ['Ali'], avoidStudents: [] },
      { id: 'd4', name: 'Ayşe', academicLevel: 'average', behaviorType: 'quiet', movementNeeds: 'low', specialNeeds: 'anxiety', friends: ['Fatma'], avoidStudents: ['Burak'] },
      { id: 'd5', name: 'Zeynep', academicLevel: 'struggling', behaviorType: 'quiet', movementNeeds: 'very_low', specialNeeds: 'none', friends: ['Elif'], avoidStudents: [] },
      { id: 'd6', name: 'Can', academicLevel: 'above_average', behaviorType: 'active', movementNeeds: 'high', specialNeeds: 'none', friends: ['Burak'], avoidStudents: [] },
      { id: 'd7', name: 'Fatma', academicLevel: 'average', behaviorType: 'follower', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Ayşe'], avoidStudents: [] },
      { id: 'd8', name: 'Ahmet', academicLevel: 'below_average', behaviorType: 'disruptive', movementNeeds: 'high', specialNeeds: 'none', friends: [], avoidStudents: ['Burak'] },
      { id: 'd9', name: 'Selin', academicLevel: 'high', behaviorType: 'leader', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Defne'], avoidStudents: [] },
      { id: 'd10', name: 'Burak', academicLevel: 'below_average', behaviorType: 'disruptive', movementNeeds: 'high', specialNeeds: 'none', friends: ['Can'], avoidStudents: ['Ali', 'Ahmet'] },
      { id: 'd11', name: 'Defne', academicLevel: 'above_average', behaviorType: 'active', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Selin'], avoidStudents: [] },
      { id: 'd12', name: 'Emre', academicLevel: 'struggling', behaviorType: 'quiet', movementNeeds: 'low', specialNeeds: 'vision', friends: [], avoidStudents: [] },
      { id: 'd13', name: 'Yağmur', academicLevel: 'average', behaviorType: 'follower', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Fatma'], avoidStudents: [] },
      { id: 'd14', name: 'Kerem', academicLevel: 'average', behaviorType: 'active', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Can'], avoidStudents: [] },
      { id: 'd15', name: 'Nil', academicLevel: 'high', behaviorType: 'quiet', movementNeeds: 'low', specialNeeds: 'none', friends: ['Elif', 'Zeynep'], avoidStudents: [] },
    ];
    setStudents(demoStudents);
    setAssignments([]);
    setCurrentMetrics(null);
    setAiExplanation("");
    setGeneration(0);
    setLayout({ rows: 5, cols: 6, seats: [] });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 24px' }}>

      {/* ─── Header ─── */}
      <header style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
            AklıSıra
          </h1>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            Sınıf Düzeni Önerici
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Öğrenci verilerini girin, yapay zeka ile en uygun oturma düzenini oluşturun.
        </p>
      </header>

      {/* ─── Main Grid: Sidebar | Content ─── */}
      <div className="dashboard-grid" style={{
        display: 'grid',
        gridTemplateColumns: '340px 1fr',
        gap: '24px',
        maxWidth: '1200px',
        alignItems: 'start',
      }}>

        {/* ═══ Left Sidebar — INPUTS ONLY ═══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' }}>

          {/* ── Student Input Card ── */}
          <div className="card animate-fade-in">
            <div className="card-header">
              <span>👩‍🎓 Öğrenci Ekle</span>
              <div className="toggle-group">
                <button
                  onClick={() => setInputMode('smart')}
                  className={`toggle-btn ${inputMode === 'smart' ? 'active' : ''}`}
                >
                  Akıllı
                </button>
                <button
                  onClick={() => setInputMode('csv')}
                  className={`toggle-btn ${inputMode === 'csv' ? 'active' : ''}`}
                >
                  CSV
                </button>
              </div>
            </div>

            {inputMode === 'csv' ? (
              <div className="animate-fade-in">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Dosya Yükle
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
              </div>
            ) : (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {isListening && (
                  <div className="recording-banner">
                    <div className="recording-dot" />
                    <span className="recording-text">🎤 Kayıt yapılıyor... Konuşun</span>
                  </div>
                )}
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder={"Öğrenci bilgilerini yazın veya sesle anlatın...\nÖrn: \"Ali gürültücü. Elif sessiz, 95 puan. Mehmet lider.\""}
                  value={smartText}
                  onChange={(e) => setSmartText(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleSmartParse} className="btn-primary" style={{ flex: 1 }}>
                    Metin Ekle
                  </button>
                  {isSupported && (
                    <button
                      onClick={startListening}
                      className={`voice-btn ${isListening ? 'listening' : ''}`}
                      title="Sesli Giriş"
                      disabled={isListening}
                    >
                      {isListening ? '⏹️' : '🎤'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Student count & list */}
            <div style={{
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
            }}>
              <span>Sınıf Mevcudu:</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{students.length} öğrenci</span>
            </div>

            {students.length > 0 && (
              <>
                <div style={{
                  marginTop: '6px',
                  maxHeight: '110px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 8px',
                  background: 'var(--bg-muted)',
                }}>
                  {students.map(s => (
                    <div key={s.id} className="student-list-item">
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{s.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {s.academicLevel === 'high' ? '▲' : s.academicLevel === 'struggling' ? '▽' : '—'} / {s.behaviorType === 'disruptive' ? 'Dd' : s.behaviorType === 'leader' ? 'Ld' : s.behaviorType === 'quiet' ? 'Ss' : s.behaviorType === 'active' ? 'Ak' : 'Tk'}
                      </span>
                    </div>
                  ))}
                </div>
                <button onClick={clearStudents} className="btn-secondary" style={{ marginTop: '6px', width: '100%', fontSize: '0.8rem' }}>
                  Listeyi Temizle
                </button>
              </>
            )}
          </div>

          {/* ── Optimize Card ── */}
          <div className="card animate-fade-in">
            <button
              onClick={startOptimization}
              disabled={isOptimizing || students.length === 0}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              {isOptimizing ? `Optimize Ediliyor (Nesil ${generation}/50)...` : '✨ Düzeni Oluştur'}
            </button>
            {students.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Önce öğrenci ekleyin veya demo verisi yükleyin
                </p>
                <button onClick={loadDemoData} className="btn-accent" style={{ width: '100%', fontSize: '0.85rem' }}>
                  🎓 Demo Sınıf Yükle (15 öğrenci)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ═══ Right Panel — GRID + RESULTS ═══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Seating Grid */}
          {assignments.length > 0 ? (
            <SeatingGrid layout={layout} assignments={assignments} />
          ) : (
            <div className="empty-state">
              <div className="icon">🏫</div>
              <p>
                Öğrenci bilgilerini girin ve <strong>Düzeni Oluştur</strong> butonuna tıklayarak yapay zeka destekli oturma planını görün.
              </p>
            </div>
          )}

          {/* Results row — Metrics + AI Analysis side by side */}
          {currentMetrics && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="animate-fade-in">

              {/* Metrics */}
              <div className="card" style={{ borderTop: '3px solid var(--primary)' }}>
                <div className="card-header">
                  <span>📊 Sonuçlar</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700 }}>Genel Uyum</span>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.3rem' }}>%{currentMetrics.overallScore}</span>
                  </div>
                  <div className="metric-bar-track">
                    <div className="metric-bar-fill" style={{ width: `${currentMetrics.overallScore}%` }} />
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Akademik Denge</span>
                      <span style={{ fontWeight: 700 }}>%{currentMetrics.academicBalance}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Sosyal Uyum</span>
                      <span style={{ fontWeight: 700 }}>%{currentMetrics.socialCompatibility}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Davranış Uyumu</span>
                      <span style={{ fontWeight: 700 }}>%{currentMetrics.behavioralHarmony}</span>
                    </div>
                  </div>

                  <button onClick={exportResults} className="btn-accent" style={{ width: '100%', marginTop: '8px' }}>
                    📥 Sonuçları Dışa Aktar
                  </button>
                </div>
              </div>

              {/* AI Analysis */}
              {aiExplanation && (
                <div className="ai-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                  <h3>💡 Yapay Zeka Analizi</h3>
                  <p>{aiExplanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer style={{
        marginTop: '48px',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        paddingBottom: '20px',
      }}>
        AklıSıra · Eğitimde Yapay Zekâ Zirvesi 2026
      </footer>
    </div>
  );
}
