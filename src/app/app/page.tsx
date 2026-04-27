"use client";

import { useState, useEffect, useRef } from 'react';
import { Student, ClassroomLayout, SeatingAssignment } from '../../types';
import { parseStudentsCSV } from '../../utils/csv-parser';
import { parseNaturalLanguage } from '../../utils/nlp-parser';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { useClassrooms } from '../../hooks/useClassrooms';
import { GeneticSolver } from '../../utils/genetic-solver';
import { SeatingGrid } from '../../components/SeatingGrid';
import { ExamMode } from '../../components/ExamMode';
import { TeamBuilder } from '../../components/TeamBuilder';
import { generateLayoutExplanation } from '../../utils/ai-explanation-service';
import { calculateMetrics } from '../../utils/scoring-utils';

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
  const {
    classes, activeClass, activeClassId,
    setActiveClassId, createClass, updateClass, deleteClass, duplicateClass, loaded,
  } = useClassrooms();

  const [students, setStudents] = useState<Student[]>([]);
  const [layout, setLayout] = useState<ClassroomLayout>({
    rows: 5, cols: 6, seats: [], windowSide: 'left', doorPosition: 'front-right'
  });
  const [assignments, setAssignments] = useState<SeatingAssignment[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [currentMetrics, setCurrentMetrics] = useState<any>(null);
  const [aiExplanation, setAiExplanation] = useState("");
  const [optimizationDone, setOptimizationDone] = useState(false);
  const [demoCount, setDemoCount] = useState(0);
  const [layoutType, setLayoutType] = useState<string>('grid');
  const [activeTab, setActiveTab] = useState<'classroom' | 'exam' | 'teams'>('classroom');
  const [showNewClassModal, setShowNewClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('');
  const syncPending = useRef(false);

  // Input state
  const [inputMode, setInputMode] = useState<'csv' | 'smart'>('smart');
  const [smartText, setSmartText] = useState("");
  const { isListening, isProcessing, transcript, startListening, stopListening, isSupported, setTranscript } = useVoiceInput();

  // Load active class into local state when it changes
  useEffect(() => {
    if (!loaded) return;
    if (activeClass) {
      setStudents(activeClass.students);
      setLayout(activeClass.layout);
      setAssignments(activeClass.assignments);
      setLayoutType(activeClass.layoutType);
      setCurrentMetrics(null);
      setAiExplanation('');
      setOptimizationDone(false);
    } else {
      setStudents([]);
      setAssignments([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClassId, loaded]);

  // Auto-save: sync local state back to active class
  useEffect(() => {
    if (!activeClassId || !loaded) return;
    syncPending.current = true;
    const t = setTimeout(() => {
      updateClass(activeClassId, { students, layout, assignments, layoutType });
      syncPending.current = false;
    }, 800);
    return () => clearTimeout(t);
  }, [students, layout, assignments, layoutType]);

  const handleCreateClass = () => {
    const name = newClassName.trim() || 'Yeni Sınıf';
    createClass(name, undefined, newClassGrade.trim() || undefined);
    setNewClassName('');
    setNewClassGrade('');
    setShowNewClassModal(false);
    setStudents([]);
    setAssignments([]);
    setCurrentMetrics(null);
    setAiExplanation('');
  };

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
      { id: 'd1', name: 'Ali', academicLevel: 'high', behaviorType: 'leader', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Mehmet'], avoidStudents: ['Burak'], learningStyle: 'visual', height: 'tall' },
      { id: 'd2', name: 'Elif', academicLevel: 'high', behaviorType: 'quiet', movementNeeds: 'low', specialNeeds: 'none', friends: ['Zeynep'], avoidStudents: [], learningStyle: 'readwrite', height: 'short' },
      { id: 'd3', name: 'Mehmet', academicLevel: 'above_average', behaviorType: 'active', movementNeeds: 'high', specialNeeds: 'adhd', friends: ['Ali'], avoidStudents: [], learningStyle: 'kinesthetic', height: 'average' },
      { id: 'd4', name: 'Ayşe', academicLevel: 'average', behaviorType: 'quiet', movementNeeds: 'low', specialNeeds: 'anxiety', friends: ['Fatma'], avoidStudents: ['Burak'], learningStyle: 'auditory' },
      { id: 'd5', name: 'Zeynep', academicLevel: 'struggling', behaviorType: 'quiet', movementNeeds: 'very_low', specialNeeds: 'none', friends: ['Elif'], avoidStudents: [], visionNeeds: 'front_required', height: 'short' },
      { id: 'd6', name: 'Can', academicLevel: 'above_average', behaviorType: 'active', movementNeeds: 'high', specialNeeds: 'none', friends: ['Burak'], avoidStudents: [], learningStyle: 'kinesthetic', height: 'tall' },
      { id: 'd7', name: 'Fatma', academicLevel: 'average', behaviorType: 'follower', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Ayşe'], avoidStudents: [], learningStyle: 'visual' },
      { id: 'd8', name: 'Ahmet', academicLevel: 'below_average', behaviorType: 'disruptive', movementNeeds: 'high', specialNeeds: 'none', friends: [], avoidStudents: ['Burak'], height: 'tall' },
      { id: 'd9', name: 'Selin', academicLevel: 'high', behaviorType: 'leader', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Defne'], avoidStudents: [], learningStyle: 'auditory' },
      { id: 'd10', name: 'Burak', academicLevel: 'below_average', behaviorType: 'disruptive', movementNeeds: 'high', specialNeeds: 'none', friends: ['Can'], avoidStudents: ['Ali', 'Ahmet'], height: 'average' },
      { id: 'd11', name: 'Defne', academicLevel: 'above_average', behaviorType: 'active', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Selin'], avoidStudents: [], learningStyle: 'visual', height: 'short' },
      { id: 'd12', name: 'Emre', academicLevel: 'struggling', behaviorType: 'quiet', movementNeeds: 'low', specialNeeds: 'vision', friends: [], avoidStudents: [], visionNeeds: 'front_required', height: 'short' },
      { id: 'd13', name: 'Yağmur', academicLevel: 'average', behaviorType: 'follower', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Fatma'], avoidStudents: [], learningStyle: 'readwrite' },
      { id: 'd14', name: 'Kerem', academicLevel: 'average', behaviorType: 'active', movementNeeds: 'moderate', specialNeeds: 'none', friends: ['Can'], avoidStudents: [], hearingNeeds: 'partial', height: 'average' },
      { id: 'd15', name: 'Nil', academicLevel: 'high', behaviorType: 'quiet', movementNeeds: 'low', specialNeeds: 'none', friends: ['Elif', 'Zeynep'], avoidStudents: [], learningStyle: 'readwrite', height: 'short' },
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


      {/* ─── Class Selector Bar ─── */}
      <div style={{ background: 'var(--primary-dark)', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>SINIFLARIM:</span>
        {classes.length === 0 && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>Henüz sınıf yok</span>}
        {classes.map(cls => (
          <button key={cls.id} onClick={() => setActiveClassId(cls.id)} style={{ padding: '5px 14px', borderRadius: '50px', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', background: cls.id === activeClassId ? 'white' : 'rgba(255,255,255,0.12)', color: cls.id === activeClassId ? 'var(--primary-dark)' : 'rgba(255,255,255,0.8)', transition: 'all 0.15s' }}>
            {cls.name}{cls.grade ? ` · ${cls.grade}` : ''}
          </button>
        ))}
        <button onClick={() => setShowNewClassModal(true)} style={{ padding: '5px 12px', borderRadius: '50px', border: '1.5px dashed rgba(255,255,255,0.3)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + Yeni Sınıf
        </button>
      </div>

      {showNewClassModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '420px', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ margin: '0 0 20px', fontWeight: 900 }}>Yeni Sınıf Oluştur</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input autoFocus type="text" placeholder="Sınıf adı (örn: 9-A Matematik)" value={newClassName} onChange={e => setNewClassName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreateClass()} style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none' }} />
              <input type="text" placeholder="Şube (isteğe bağlı)" value={newClassGrade} onChange={e => setNewClassGrade(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreateClass()} style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none' }} />
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button onClick={() => setShowNewClassModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>İptal</button>
                <button onClick={handleCreateClass} style={{ flex: 2, padding: '12px', borderRadius: '10px', background: 'var(--primary-gradient)', color: 'white', border: 'none', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>Oluştur ✓</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab Switcher ─── */}
      <div style={{ padding: '0 24px', maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{
          display: 'flex', gap: '0', marginBottom: '0',
          borderBottom: '2px solid var(--border-light)',
        }}>
          <button
            onClick={() => setActiveTab('classroom')}
            style={{
              padding: '12px 24px', fontSize: '0.88rem', fontWeight: 700,
              border: 'none', cursor: 'pointer',
              borderBottom: activeTab === 'classroom' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'classroom' ? 'var(--primary-dark)' : 'var(--text-muted)',
              background: 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            🏫 Sınıf Düzeni
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            style={{
              padding: '12px 24px', fontSize: '0.88rem', fontWeight: 700,
              border: 'none', cursor: 'pointer',
              borderBottom: activeTab === 'exam' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'exam' ? 'var(--primary-dark)' : 'var(--text-muted)',
              background: 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            🦋 Sınav Modu (Kelebek)
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            style={{
              padding: '12px 24px', fontSize: '0.88rem', fontWeight: 700,
              border: 'none', cursor: 'pointer',
              borderBottom: activeTab === 'teams' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'teams' ? 'var(--primary-dark)' : 'var(--text-muted)',
              background: 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            🎯 Takım Oluştur
          </button>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div style={{ padding: '16px 24px 32px' }}>

      {activeTab === 'exam' ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <ExamMode />
        </div>
      ) : activeTab === 'teams' ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <TeamBuilder students={students} />
        </div>
      ) : (
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
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Öğrenci Listesi Yükle (.csv)</label>
                  <input type="file" accept=".csv" onChange={handleFileUpload} />
                  <div style={{ marginTop: '4px' }}>
                    <a href="data:text/csv;charset=utf-8,Ad Soyad,Akademik Başarı,Davranış,Boy,Görme Durumu,Öğrenme Stili,Yanına Oturmak İstediği,Uzak Durmak İstediği%0AAli Yılmaz,Yüksek,Sakin,Uzun,Ön Sıra Şart,Görsel,Elif;Mehmet,%0AElif Kaya,Orta,Aktif,Kısa,Gözlük,İşitsel,Ali,Burak" 
                       download="aklisira_sablon.csv" 
                       style={{ fontSize: '0.72rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      📥 Örnek Şablon İndir
                    </a>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {isListening && (
                    <div className="recording-banner">
                      <div className="recording-dot" />
                      <span className="recording-text">🎤 Kayıt yapılıyor... Bitirmek için mikrofona tekrar tıklayın</span>
                    </div>
                  )}
                  {isProcessing && (
                    <div className="recording-banner processing">
                      <div className="spinner-dot" />
                      <span className="recording-text">⏳ Sesiniz yazıya dökülüyor (Yapay Zeka)...</span>
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
                        onClick={isListening ? stopListening : startListening}
                        className={`voice-btn ${isListening ? 'listening' : ''} ${isProcessing ? 'processing' : ''}`}
                        title={isListening ? "Kaydı Bitir" : "Sesli Giriş"}
                        disabled={isProcessing}
                      >
                        {isProcessing ? '⏳' : isListening ? '⏹️' : '🎤'}
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
                <span>📐 Düzen Tipi</span>
              </div>
              {/* Layout presets */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '12px' }}>
                {[
                  { id: 'grid', icon: '▦', label: 'Düz Sıra' },
                  { id: 'paired', icon: '‖', label: 'İkili Sıra' },
                  { id: 'u-shape', icon: '⊔', label: 'U-Düzen' },
                  { id: 'cluster', icon: '⊞', label: 'Küme' },
                  { id: 'chevron', icon: '⟨⟩', label: 'Chevron' },
                ].map(lt => (
                  <button
                    key={lt.id}
                    onClick={() => setLayoutType(lt.id)}
                    className={`layout-preset-btn ${layoutType === lt.id ? 'active' : ''}`}
                  >
                    <span style={{ fontSize: '1rem' }}>{lt.icon}</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>{lt.label}</span>
                  </button>
                ))}
              </div>
              {/* Row/Col Config */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Sıra</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <button className="btn-stepper" onClick={() => setLayout(p => ({ ...p, rows: Math.max(2, p.rows - 1) }))} disabled={layout.rows <= 2}>−</button>
                      <span style={{ fontWeight: 700, fontSize: '1rem', minWidth: '24px', textAlign: 'center' }}>{layout.rows}</span>
                      <button className="btn-stepper" onClick={() => setLayout(p => ({ ...p, rows: Math.min(10, p.rows + 1) }))}>+</button>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Sütun</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <button className="btn-stepper" onClick={() => setLayout(p => ({ ...p, cols: Math.max(2, p.cols - 1) }))} disabled={layout.cols <= 2}>−</button>
                      <span style={{ fontWeight: 700, fontSize: '1rem', minWidth: '24px', textAlign: 'center' }}>{layout.cols}</span>
                      <button className="btn-stepper" onClick={() => setLayout(p => ({ ...p, cols: Math.min(10, p.cols + 1) }))}>+</button>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '6px', fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  {layout.rows}×{layout.cols} = {layout.rows * layout.cols} koltuk
                </div>
              </div>

              {/* Classroom Environment Config */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px', marginTop: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Sınıf Ortamı</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pencere Yönü</label>
                    <select 
                      value={layout.windowSide || 'none'} 
                      onChange={e => setLayout(p => ({ ...p, windowSide: e.target.value as any }))}
                      style={{ width: '100%', padding: '6px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                    >
                      <option value="none">Yok / Fark Etmez</option>
                      <option value="left">Sol Taraf</option>
                      <option value="right">Sağ Taraf</option>
                      <option value="both">İki Taraf</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)' }}>Kapı Konumu</label>
                    <select 
                      value={layout.doorPosition || 'none'} 
                      onChange={e => setLayout(p => ({ ...p, doorPosition: e.target.value as any }))}
                      style={{ width: '100%', padding: '6px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                    >
                      <option value="none">Yok / Fark Etmez</option>
                      <option value="front-left">Ön Sol</option>
                      <option value="front-right">Ön Sağ</option>
                      <option value="back">Arka Taraf</option>
                    </select>
                  </div>
                </div>
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
                <SeatingGrid layout={layout} assignments={assignments} layoutType={layoutType} />
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
                      {currentMetrics.physicalAccessibility < 100 && (
                        <div className="metric-row">
                          <span className="metric-label">Fiziksel Erişim</span>
                          <span className="metric-value">%{currentMetrics.physicalAccessibility}</span>
                        </div>
                      )}
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
      )}
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
