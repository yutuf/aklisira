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

// ─── Visitor Log ───
function logVisitorAction(action: string, data: Record<string, any> = {}) {
  try {
    const logs = JSON.parse(localStorage.getItem('aklisira_logs') || '[]');
    logs.push({ action, ...data, timestamp: new Date().toISOString() });
    localStorage.setItem('aklisira_logs', JSON.stringify(logs));
  } catch {}
}

function getVisitorCount(): number {
  try {
    const logs = JSON.parse(localStorage.getItem('aklisira_logs') || '[]');
    return logs.filter((l: any) => l.action === 'optimize_complete').length;
  } catch { return 0; }
}

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [layout, setLayout] = useState<ClassroomLayout>({ rows: 5, cols: 6, seats: [] });
  const [assignments, setAssignments] = useState<SeatingAssignment[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [currentMetrics, setCurrentMetrics] = useState<any>(null);
  const [aiExplanation, setAiExplanation] = useState("");
  const [optimizationDone, setOptimizationDone] = useState(false);
  const [demoCount, setDemoCount] = useState(0);

  // Input state
  const [inputMode, setInputMode] = useState<'csv' | 'smart'>('smart');
  const [smartText, setSmartText] = useState("");
  const { isListening, transcript, startListening, isSupported, setTranscript } = useVoiceInput();

  useEffect(() => {
    setDemoCount(getVisitorCount());
  }, []);

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
    const rows = Math.ceil(total / layout.cols);
    setLayout(prev => ({ ...prev, rows: Math.max(rows, prev.rows) }));
    logVisitorAction('text_parse', { studentCount: parsed.length });
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
          setLayout(prev => {
            const rows = Math.ceil(parsed.length / prev.cols);
            return { ...prev, rows: Math.max(rows, 3) };
          });
          logVisitorAction('csv_upload', { studentCount: parsed.length });
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
    setOptimizationDone(false);

    const solver = new GeneticSolver(students, layout);
    solver.initialize();

    let gen = 0;
    const maxGens = 50;
    const startTime = Date.now();

    const interval = setInterval(() => {
      if (gen >= maxGens) {
        clearInterval(interval);
        setIsOptimizing(false);
        setOptimizationDone(true);
        const finalResult = solver.evolve(0);
        const finalMetrics = calculateMetrics(finalResult.assignments);
        setAiExplanation(generateLayoutExplanation(finalMetrics, finalResult.assignments));
        
        // Log completion
        const duration = Date.now() - startTime;
        logVisitorAction('optimize_complete', {
          studentCount: students.length,
          score: finalMetrics.overallScore,
          duration: Math.round(duration / 1000),
        });
        setDemoCount(prev => prev + 1);
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
      version: "1.0",
      timestamp: new Date().toISOString(),
      students: students.map(s => ({
        name: s.name, academicLevel: s.academicLevel,
        behaviorType: s.behaviorType, movementNeeds: s.movementNeeds,
        specialNeeds: s.specialNeeds,
      })),
      seatingOrder: assignments.map(a => ({
        name: a.student.name, row: a.row, col: a.col, seatIndex: a.seatIndex,
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
    logVisitorAction('export');
  };

  const clearStudents = () => {
    setStudents([]);
    setAssignments([]);
    setCurrentMetrics(null);
    setAiExplanation("");
    setGeneration(0);
    setOptimizationDone(false);
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
    setOptimizationDone(false);
    setLayout({ rows: 5, cols: 6, seats: [] });
    logVisitorAction('demo_load');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ─── Premium Header ─── */}
      <div className="app-header" style={{ padding: '32px 24px' }}>
        <div className="header-content" style={{ maxWidth: '1200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 className="app-title">AklıSıra</h1>
              <p className="app-subtitle">Yapay Zeka Destekli Sınıf Oturma Düzeni Önerici</p>
              <div className="summit-badge">🏆 III. Eğitimde Yapay Zekâ Zirvesi 2026</div>
            </div>
            {demoCount > 0 && (
              <div className="visitor-counter" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>
                <div className="visitor-dot" style={{ background: '#4ade80' }} />
                {demoCount} optimizasyon tamamlandı
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div style={{ padding: '0 24px 32px' }}>
        <div className="dashboard-grid" style={{
          display: 'grid',
          gridTemplateColumns: '340px 1fr',
          gap: '24px',
          maxWidth: '1200px',
          alignItems: 'start',
        }}>

          {/* ═══ Left Sidebar ═══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Student Input Card */}
            <div className="card animate-fade-in">
              <div className="card-header">
                <span>👩‍🎓 Öğrenci Ekle</span>
                <div className="toggle-group">
                  <button onClick={() => setInputMode('smart')} className={`toggle-btn ${inputMode === 'smart' ? 'active' : ''}`}>Akıllı</button>
                  <button onClick={() => setInputMode('csv')} className={`toggle-btn ${inputMode === 'csv' ? 'active' : ''}`}>CSV</button>
                </div>
              </div>

              {inputMode === 'csv' ? (
                <div className="animate-fade-in">
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Dosya Yükle</label>
                  <input type="file" accept=".csv" onChange={handleFileUpload} />
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
                    placeholder={"Öğrenci bilgilerini yazın veya sesle anlatın...\nÖrn: \"Ali gürültücü. Elif sessiz, 95 puan.\""}
                    value={smartText}
                    onChange={(e) => setSmartText(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleSmartParse} className="btn-primary" style={{ flex: 1 }}>Metin Ekle</button>
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
                marginTop: '12px', paddingTop: '10px',
                borderTop: '1px solid var(--border-light)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: '0.82rem', color: 'var(--text-secondary)',
              }}>
                <span>Sınıf Mevcudu:</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{students.length} öğrenci</span>
              </div>

              {students.length > 0 && (
                <>
                  <div style={{
                    marginTop: '6px', maxHeight: '120px', overflowY: 'auto',
                    border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)',
                    padding: '6px 8px', background: 'var(--bg-muted)',
                  }}>
                    {students.map(s => (
                      <div key={s.id} className="student-list-item">
                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{s.name}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {s.academicLevel === 'high' ? '▲' : s.academicLevel === 'struggling' ? '▽' : '—'} / {s.behaviorType === 'disruptive' ? 'Dd' : s.behaviorType === 'leader' ? 'Ld' : s.behaviorType === 'quiet' ? 'Ss' : s.behaviorType === 'active' ? 'Ak' : 'Tk'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button onClick={clearStudents} className="btn-secondary" style={{ marginTop: '6px', width: '100%', fontSize: '0.78rem' }}>
                    Listeyi Temizle
                  </button>
                </>
              )}
            </div>

            {/* Layout Config Card */}
            <div className="card animate-fade-in">
              <div className="card-header">
                <span>📐 Sınıf Düzeni</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>{layout.rows}×{layout.cols}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Sıra Sayısı</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button className="btn-stepper" onClick={() => setLayout(p => ({ ...p, rows: Math.max(2, p.rows - 1) }))} disabled={layout.rows <= 2}>−</button>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', minWidth: '28px', textAlign: 'center' }}>{layout.rows}</span>
                    <button className="btn-stepper" onClick={() => setLayout(p => ({ ...p, rows: Math.min(10, p.rows + 1) }))}>+</button>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Sütun Sayısı</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button className="btn-stepper" onClick={() => setLayout(p => ({ ...p, cols: Math.max(2, p.cols - 1) }))} disabled={layout.cols <= 2}>−</button>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', minWidth: '28px', textAlign: 'center' }}>{layout.cols}</span>
                    <button className="btn-stepper" onClick={() => setLayout(p => ({ ...p, cols: Math.min(10, p.cols + 1) }))}>+</button>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Toplam kapasite: {layout.rows * layout.cols} koltuk
              </div>
            </div>

            {/* Optimize Card */}
            <div className="card animate-fade-in">
              {/* Live optimization progress */}
              {isOptimizing && (
                <div className="opt-progress" style={{ marginBottom: '12px' }}>
                  <div className="opt-gen">{generation}</div>
                  <div className="opt-gen-label">Nesil / 50</div>
                  <div className="opt-bar">
                    <div className="opt-bar-fill" style={{ width: `${(generation / 50) * 100}%` }} />
                  </div>
                </div>
              )}

              <button
                onClick={startOptimization}
                disabled={isOptimizing || students.length === 0}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                {isOptimizing ? '⚡ Optimize Ediliyor...' : '✨ Düzeni Oluştur'}
              </button>

              {students.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Önce öğrenci ekleyin veya demo verisi yükleyin
                  </p>
                  <button onClick={loadDemoData} className="btn-demo" style={{ width: '100%' }}>
                    🎓 Demo Sınıf Yükle (15 öğrenci)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ═══ Right Panel ═══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Seating Grid */}
            {assignments.length > 0 ? (
              <div className={optimizationDone ? 'success-flash' : ''}>
                <SeatingGrid layout={layout} assignments={assignments} />
              </div>
            ) : (
              <div className="empty-state">
                <div className="icon">🏫</div>
                <p>Öğrenci bilgilerini girin ve <strong>Düzeni Oluştur</strong> butonuna tıklayarak yapay zeka destekli oturma planını görün.</p>
              </div>
            )}

            {/* Results */}
            {currentMetrics && (
              <div className="results-grid animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                {/* Metrics Card */}
                <div className="card" style={{ borderTop: '3px solid var(--primary)' }}>
                  <div className="card-header">
                    <span>📊 Sonuçlar</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ textAlign: 'center', padding: '8px 0 12px' }}>
                      <div className="score-big">%{currentMetrics.overallScore}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>Genel Uyum Puanı</div>
                    </div>

                    <div className="metric-bar-track">
                      <div className="metric-bar-fill" style={{ width: `${currentMetrics.overallScore}%` }} />
                    </div>

                    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div className="metric-row">
                        <span className="metric-label">Akademik Denge</span>
                        <span className="metric-value">%{currentMetrics.academicBalance}</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">Sosyal Uyum</span>
                        <span className="metric-value">%{currentMetrics.socialCompatibility}</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">Davranış Uyumu</span>
                        <span className="metric-value">%{currentMetrics.behavioralHarmony}</span>
                      </div>
                    </div>

                    <button onClick={exportResults} className="btn-accent" style={{ width: '100%', marginTop: '8px' }}>
                      📥 Sonuçları Dışa Aktar
                    </button>
                  </div>
                </div>

                {/* AI Analysis */}
                {aiExplanation && (
                  <div className="ai-box animate-slide-up">
                    <h3>💡 Yapay Zeka Analizi</h3>
                    <p>{aiExplanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer style={{
        textAlign: 'center', fontSize: '0.72rem',
        color: 'var(--text-muted)', padding: '16px 24px 24px',
        borderTop: '1px solid var(--border-light)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span>AklıSıra · Baykar Fen Lisesi</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>III. Eğitimde Yapay Zekâ Zirvesi 2026</span>
          {demoCount > 0 && (
            <>
              <span style={{ opacity: 0.4 }}>|</span>
              <span className="visitor-counter">
                <div className="visitor-dot" />
                {demoCount} demo
              </span>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
