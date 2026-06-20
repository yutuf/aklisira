"use client";

import { useState, useEffect, useRef } from 'react';
import { Student, ClassroomLayout, SeatingAssignment, AttendanceStatus, WeeklySchedule, Lesson, DayOfWeek, ParentMeeting, Badge } from '../../types';
import { parseStudentsCSV } from '../../utils/csv-parser';
import { parseNaturalLanguage } from '../../utils/nlp-parser';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { useClassrooms } from '../../hooks/useClassrooms';
import { GeneticSolver } from '../../utils/genetic-solver';
import { SeatingGrid } from '../../components/SeatingGrid';
import { ExamMode } from '../../components/ExamMode';
import { TeamBuilder } from '../../components/TeamBuilder';
import { ScheduleView } from '../../components/ScheduleView';
import { MeetingManager } from '../../components/MeetingManager';
import { generateLayoutExplanation } from '../../utils/ai-explanation-service';
import { calculateMetrics } from '../../utils/scoring-utils';
import { createBrowserClient } from '@supabase/ssr';
import ClassStats from '../../components/ClassStats';

// ─── Constants ───
const AVATAR_COLORS = [
  'linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%)',
  'linear-gradient(135deg, #4834D4 0%, #686DE0 100%)',
  'linear-gradient(135deg, #6AB04C 0%, #BADB73 100%)',
  'linear-gradient(135deg, #F0932B 0%, #FFBE76 100%)',
  'linear-gradient(135deg, #EB4D4B 0%, #FF7979 100%)',
  'linear-gradient(135deg, #22A6B3 0%, #7ED6DF 100%)',
  'linear-gradient(135deg, #BE2EDD 0%, #E056FD 100%)'
];

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
  const [fitnessHistory, setFitnessHistory] = useState<number[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<any>(null);
  const [aiExplanation, setAiExplanation] = useState("");
  const [optimizationDone, setOptimizationDone] = useState(false);
  const [demoCount, setDemoCount] = useState(0);
  const [layoutType, setLayoutType] = useState<string>('grid');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'classroom' | 'attendance' | 'students' | 'exam' | 'teams' | 'schedule' | 'meetings'>('dashboard');
  const [showNewClassModal, setShowNewClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('');
  const syncPending = useRef(false);
  const [user, setUser] = useState<any>(null);

  const [inputMode, setInputMode] = useState<'csv' | 'smart'>('smart');
  const [smartText, setSmartText] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalTab, setModalTab] = useState<'info' | 'observations'>('info');
  const [newObsText, setNewObsText] = useState("");
  const [newObsType, setNewObsType] = useState<'academic' | 'behavior' | 'parent' | 'general'>('general');
  
  // AI Rate Limit State
  const [aiUsage, setAiUsage] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const aiLimit = user ? 50 : 10;
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");
  const [schedule, setSchedule] = useState<WeeklySchedule>({ lessons: [] });
  const [meetings, setMeetings] = useState<ParentMeeting[]>([]);
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
    
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
    
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
      }
    });

    // Initialize Schedule
    try {
      const savedSchedule = localStorage.getItem('aklisira_schedule');
      if (savedSchedule) setSchedule(JSON.parse(savedSchedule));
    } catch {}

    // Initialize Meetings
    try {
      const savedMeetings = localStorage.getItem('aklisira_meetings');
      if (savedMeetings) setMeetings(JSON.parse(savedMeetings));
    } catch {}
  }, []);

  // Save Schedule & Meetings
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('aklisira_schedule', JSON.stringify(schedule));
      localStorage.setItem('aklisira_meetings', JSON.stringify(meetings));
    }
  }, [schedule, meetings, loaded]);

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  // Voice → text
  useEffect(() => {
    if (transcript) {
      setSmartText(prev => prev + (prev ? "\n" : "") + transcript);
      setTranscript("");
    }
  }, [transcript, setTranscript]);

  const handleSmartParse = async () => {
    if (!smartText.trim()) return;
    
    if (aiUsage >= aiLimit) {
      setShowLimitModal(true);
      return;
    }

    setIsOptimizing(true); // Re-using this for loading state
    
    try {
      const response = await fetch('/api/parse-students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: smartText })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Fallback to local parser if API fails or no key
        console.warn("API failed, falling back to local parser", data);
        alert(`Yapay zeka servisi meşgul (Hata ${response.status}). Basit ayrıştırıcı kullanılıyor.`);
        const parsed = parseNaturalLanguage(smartText);
        setStudents(prev => [...prev, ...parsed]);
        const total = students.length + parsed.length;
        const rows = Math.ceil(total / layout.cols);
        setLayout(prev => ({ ...prev, rows: Math.max(rows, prev.rows) }));
        logVisitorAction('text_parse_fallback', { studentCount: parsed.length });
      } else if (data.students) {
        setStudents(prev => [...prev, ...data.students]);
        const total = students.length + data.students.length;
        const rows = Math.ceil(total / layout.cols);
        setLayout(prev => ({ ...prev, rows: Math.max(rows, prev.rows) }));
        logVisitorAction('text_parse_gemini', { studentCount: data.students.length });
        
        // Increment usage
        const newUsage = aiUsage + 1;
        setAiUsage(newUsage);
        localStorage.setItem('aklisira_ai_usage', JSON.stringify({ date: new Date().toDateString(), count: newUsage }));
      }
      setSmartText("");
    } catch (err) {
      console.error(err);
      alert("Çözümleme sırasında bir hata oluştu.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    // No longer closing modal immediately to allow continuous editing
  };

  const handleAddObservation = () => {
    if (!selectedStudent || !newObsText.trim()) return;
    
    const newObs = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('tr-TR'),
      type: newObsType,
      text: newObsText.trim()
    };
    
    const updatedStudent = {
      ...selectedStudent,
      observations: [newObs, ...(selectedStudent.observations || [])]
    };
    
    handleUpdateStudent(updatedStudent);
    setSelectedStudent(updatedStudent);
    setNewObsText("");
  };

  const handleDeleteObservation = (obsId: string) => {
    if (!selectedStudent) return;
    const updatedStudent = {
      ...selectedStudent,
      observations: (selectedStudent.observations || []).filter(o => o.id !== obsId)
    };
    handleUpdateStudent(updatedStudent);
    setSelectedStudent(updatedStudent);
  };

  const handleAttendanceUpdate = (studentId: string, status: AttendanceStatus) => {
    const today = new Date().toLocaleDateString('tr-TR');
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const otherAttendance = (s.attendance || []).filter(a => a.date !== today);
        return {
          ...s,
          attendance: [{ date: today, status }, ...otherAttendance]
        };
      }
      return s;
    }));
    // Assignments rely on student objects, so we need to update them too
    setAssignments(prev => prev.map(a => {
      if (a.student.id === studentId) {
        const otherAttendance = (a.student.attendance || []).filter(r => r.date !== today);
        return {
          ...a,
          student: {
            ...a.student,
            attendance: [{ date: today, status }, ...otherAttendance]
          }
        };
      }
      return a;
    }));
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

  const handleAddLesson = (lesson: Omit<Lesson, 'id'>) => {
    const id = `les_${Date.now()}`;
    setSchedule(prev => ({ lessons: [...prev.lessons, { ...lesson, id }] }));
  };

  const handleDeleteLesson = (id: string) => {
    setSchedule(prev => ({ lessons: prev.lessons.filter(l => l.id !== id) }));
  };

  const getNextLesson = () => {
    if (schedule.lessons.length === 0) return null;
    const now = new Date();
    const dayNames: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = dayNames[now.getDay()];
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Sort lessons by time
    const todayLessons = schedule.lessons
      .filter(l => l.day === today)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    const next = todayLessons.find(l => l.startTime > currentTime);
    const current = todayLessons.find(l => l.startTime <= currentTime && l.endTime >= currentTime);
    
    return { current, next };
  };

  const handleAddMeeting = (meeting: Omit<ParentMeeting, 'id'>) => {
    const id = `mtg_${Date.now()}`;
    setMeetings(prev => [...prev, { ...meeting, id }]);
  };

  const handleUpdateMeeting = (id: string, updates: Partial<ParentMeeting>) => {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
  };

  const getStudentOfTheWeek = () => {
    if (students.length === 0) return null;
    const scores = students.map(s => {
      const pos = (s.observations || []).filter(o => o.type === 'academic' || o.type === 'behavior').length;
      return { student: s, score: pos };
    });
    const winner = scores.sort((a,b) => b.score - a.score)[0];
    return winner.score > 0 ? winner.student : null;
  };

  const startOptimization = async () => {
    if (students.length === 0) return;
    setIsOptimizing(true);
    setGeneration(0);
    setFitnessHistory([]);
    setAiExplanation("");
    setOptimizationDone(false);

    const solver = new GeneticSolver(students, layout);
    solver.initialize();
    const initialBest = solver.getBestGenome();
    setFitnessHistory([initialBest.fitness]);
    setAssignments([...initialBest.assignments]);
    setCurrentMetrics(calculateMetrics(initialBest.assignments));

    let gen = 0;
    const maxGens = 60;
    const startTime = Date.now();

    const interval = setInterval(() => {
      if (gen >= maxGens) {
        clearInterval(interval);
        setIsOptimizing(false);
        setOptimizationDone(true);
        const finalResult = solver.getBestGenome();
        setAssignments([...finalResult.assignments]);
        const finalMetrics = calculateMetrics(finalResult.assignments);
        setCurrentMetrics(finalMetrics);
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
      setFitnessHistory(prev => [...prev, bestGenome.fitness]);
      setGeneration(gen + 1);
      gen++;
    }, 100);
  };

  const handleOptimize = () => {
    startOptimization();
  };

  const handleSeatMove = (sourceStudentId: string, targetRow: number, targetCol: number) => {
    setAssignments(prev => {
      const sourceAssignment = prev.find(a => a.student.id === sourceStudentId);
      if (!sourceAssignment) return prev;
      
      const targetAssignmentIndex = prev.findIndex(a => a.row === targetRow && a.col === targetCol);
      const newAssignments = [...prev];
      
      const sourceIndex = newAssignments.findIndex(a => a.student.id === sourceStudentId);
      
      if (targetAssignmentIndex !== -1) {
        // Swap seats
        const tempRow = newAssignments[sourceIndex].row;
        const tempCol = newAssignments[sourceIndex].col;
        
        newAssignments[sourceIndex] = { ...newAssignments[sourceIndex], row: targetRow, col: targetCol };
        newAssignments[targetAssignmentIndex] = { ...newAssignments[targetAssignmentIndex], row: tempRow, col: tempCol };
      } else {
        // Move to empty seat
        newAssignments[sourceIndex] = { ...newAssignments[sourceIndex], row: targetRow, col: targetCol };
      }
      
      return newAssignments;
    });
  };

  const handleSaveAssignments = () => {
    if (!activeClassId) return;
    updateClass(activeClassId, { assignments, layout, layoutType });
    alert("Sınıf düzeni başarıyla kaydedildi! ✓");
    logVisitorAction('save_layout', { studentCount: students.length });
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
    <div className="app-layout">
      {/* ─── SIDEBAR ─── */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <span style={{ fontSize: '1.8rem' }}>🧠</span>
          AklıSıra
        </div>
        
        <div className="sidebar-menu">
          <button 
            className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="icon">🏠</span> Pano (Özet)
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <span className="icon">👩‍🎓</span> Öğrenci Rehberi
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'classroom' ? 'active' : ''}`}
            onClick={() => setActiveTab('classroom')}
          >
            <span className="icon">🏫</span> Sınıf & Düzen
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <span className="icon">📋</span> Yoklama
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <span className="icon">📅</span> Ders Programı
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'meetings' ? 'active' : ''}`}
            onClick={() => setActiveTab('meetings')}
          >
            <span className="icon">🤝</span> Veli Görüşmeleri
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => setActiveTab('teams')}
          >
            <span className="icon">👥</span> Takım Kur
          </button>
          <button 
            className={`sidebar-item ${activeTab === 'exam' ? 'active' : ''}`}
            onClick={() => setActiveTab('exam')}
          >
            <span className="icon">📝</span> Sınav Modu
          </button>
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {user.user_metadata?.avatar_url && (
                  <img src={user.user_metadata.avatar_url} alt="Profil" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                )}
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </div>
              <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, width: '100%' }}>
                Çıkış Yap
              </button>
            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Misafir Kullanıcı
            </div>
          )}
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="main-content">
        
        {/* Class Selector Bar (Top Bar) */}
        <div style={{ background: 'var(--bg-card)', padding: '12px 24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 800, whiteSpace: 'nowrap' }}>SINIF SEÇİMİ:</span>
          {classes.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Henüz sınıf yok</span>}
          {classes.map(cls => (
            <button
              key={cls.id}
              onClick={() => setActiveClassId(cls.id)}
              style={{
                padding: '6px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.2s ease',
                background: activeClassId === cls.id ? 'var(--primary-gradient)' : 'var(--bg-muted)',
                color: activeClassId === cls.id ? 'white' : 'var(--text-secondary)',
                boxShadow: activeClassId === cls.id ? '0 4px 12px rgba(13, 110, 100, 0.3)' : 'none'
              }}
            >
              {cls.name} ({cls.grade}. Sınıf)
            </button>
          ))}
          <button 
            onClick={() => setShowNewClassModal(true)} 
            style={{ padding: '6px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', border: '1.5px dashed var(--border)', background: 'transparent', color: 'var(--text-secondary)' }}
          >
            + Yeni Sınıf
          </button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              style={{ 
                padding: '6px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, 
                border: '1.5px solid var(--border)', background: isPrivacyMode ? 'var(--primary-pale)' : 'white', 
                color: isPrivacyMode ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              {isPrivacyMode ? '👁️ Gizlilik: AÇIK' : '👁️ Gizlilik: KAPALI'}
            </button>
            <button onClick={loadDemoData} style={{ padding: '6px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, border: 'none', background: 'var(--accent-pale)', color: 'var(--accent)' }}>
              🎁 Demo Yükle
            </button>
          </div>
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

        {/* ─── VIEWS ─── */}
        
        {activeTab === 'dashboard' ? (
          <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text)', margin: 0 }}>
                  Günaydın{user ? `, ${user.user_metadata?.full_name?.split(' ')[0] || 'Hocam'}` : ' Hocam'}! ☀️
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
                  AklıSıra asistanınız bugün için hazır.
                </p>
              </div>
              
              {/* AI Power-Up Bar (Gamification) */}
              <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', minWidth: '240px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>GÜNLÜK ANALİZ HEDEFİ</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900 }}>{aiUsage}/{aiLimit}</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-muted)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(aiUsage/aiLimit)*100}%`, background: 'var(--primary-gradient)', borderRadius: '10px', transition: 'width 1s ease' }}></div>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'right', fontWeight: 600 }}>
                  {aiUsage >= aiLimit ? '🎉 Bugün harikaydınız!' : `${aiLimit - aiUsage} analiz daha yaparak hedefi tamamla!`}
                </div>
              </div>
            </div>

            {/* ─── GÜNLÜK AKIŞ (DAILY FLOW) ─── */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>📅</span> Günlük Akış
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {/* Task 1: Attendance */}
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--border-light)', padding: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-pale)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    📋
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>Sınıf Yoklaması</h4>
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Bugün henüz yoklama alınmadı.</p>
                  </div>
                  <button onClick={() => setActiveTab('attendance')} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Başlat</button>
                </div>

                {/* Task 2: Observations */}
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--border-light)', padding: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-pale)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    ✍️
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>Gözlem Notları</h4>
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Kritik öğrencileri incele.</p>
                  </div>
                  <button onClick={() => setShowQuickNote(true)} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: 'white', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Hızlı Not</button>
                </div>

                {/* Task 3: Next Lesson */}
                {(() => {
                  const { current, next } = getNextLesson() || {};
                  return (
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--border-light)', padding: '16px', background: current ? 'var(--primary-pale)' : 'white' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: current ? 'white' : 'var(--primary-pale)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                        ⏰
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>
                          {current ? `Şu An: ${current.subject}` : next ? `Sıradaki: ${next.subject}` : 'Bugün Başka Ders Yok'}
                        </h4>
                        <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {current ? `${current.startTime} - ${current.endTime}` : next ? `${next.startTime} itibariyle` : 'İyi dinlenmeler!'}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Task 4: Parent Meetings & Reward */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Today's Meetings */}
                  <div className="card" style={{ padding: '16px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '1.5rem' }}>🤝</div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800 }}>Bugünkü Randevular</h4>
                      <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                        {meetings.filter(m => m.date === new Date().toISOString().split('T')[0]).length} Görüşme Bekliyor
                      </p>
                    </div>
                  </div>
                  
                  {/* Student of the Week */}
                  {(() => {
                    const star = getStudentOfTheWeek();
                    return (
                      <div className="card" style={{ padding: '16px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px', background: 'linear-gradient(135deg, #fffbeb, #fff)' }}>
                        <div style={{ fontSize: '1.5rem' }}>⭐</div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800 }}>Haftanın Yıldızı</h4>
                          <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                            {star ? star.name : 'Henüz Seçilmedi'}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.2s', border: '2px solid transparent' }} 
                   onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                   onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                   onClick={() => setActiveTab('attendance')}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📋</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px 0' }}>Yoklama Al</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1 }}>{activeClassId ? `${students.length} öğrencinin bulunduğu aktif sınıfınızın bugünkü yoklamasını saniyeler içinde tamamlayın.` : 'Önce bir sınıf seçin ve yoklama işlemlerine hızlıca başlayın.'}</p>
                <div style={{ marginTop: '16px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>Yoklamaya Git →</div>
              </div>

              <div className="card" style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.2s', border: '2px solid transparent' }}
                   onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                   onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                   onClick={() => setActiveTab('classroom')}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✨</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px 0' }}>Sınıfı Düzenle</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1 }}>Öğrenci profillerini analiz ederek en ideal oturma planını oluşturun ve yeni oturma düzenleri deneyin.</p>
                <div style={{ marginTop: '16px', color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem' }}>Yeni Düzen Oluştur →</div>
              </div>

              <div className="card" style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.2s', border: '2px solid transparent' }}
                   onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
                   onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                   onClick={() => setActiveTab('students')}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>👩‍🎓</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px 0' }}>Öğrenci Rehberi</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1 }}>Yeni öğrenciler ekleyin, listeyi Excel'den aktarın veya öğrencilerin gözlem defterlerine not düşün.</p>
                <div style={{ marginTop: '16px', color: '#3b82f6', fontWeight: 700, fontSize: '0.85rem' }}>Rehberi Aç →</div>
              </div>
            </div>
            {activeClassId && (
              <div className="card" style={{ marginTop: '32px', background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', color: 'white', border: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 800 }}>Şu anki sınıfınız: {classes.find(c => c.id === activeClassId)?.name}</h3>
                    <div style={{ opacity: 0.8, fontSize: '0.85rem' }}>{students.length} Öğrenci | Son optimizasyon: {assignments.length > 0 ? 'Tamamlandı' : 'Bekliyor'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'students' ? (
          <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="card-header">
                <span>👩‍🎓 Öğrenci Rehberi ve Gözlem Defteri</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{students.length} Öğrenci Kayıtlı</span>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1, background: 'var(--bg-muted)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Toplu Öğrenci Yükle (CSV)</h4>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="file" accept=".csv" onChange={handleFileUpload} />
                    <a href="/template.csv" download style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>Şablon İndir</a>
                  </div>
                </div>
              </div>

              {/* Student List */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>Sınıf Listesi</h4>
                {students.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Bu sınıfa henüz öğrenci eklenmemiş.</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                    {students.map((s, idx) => (
                      <div key={s.id} onClick={() => setSelectedStudent(s)} style={{ background: 'var(--bg-muted)', padding: '12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s', border: '1px solid transparent' }} onMouseEnter={e=>e.currentTarget.style.borderColor='var(--primary-light)'} onMouseLeave={e=>e.currentTarget.style.borderColor='transparent'}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{idx+1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.observations?.length || 0} Gözlem Kaydı</div>
                        </div>
                        <div style={{ color: 'var(--text-muted)' }}>→</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'exam' ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <ExamMode 
            activeClass={{ 
              id: activeClassId || '', 
              name: classes.find(c => c.id === activeClassId)?.name || 'Aktif Sınıf', 
              students: students.map(s => s.name) 
            }} 
          />
        </div>
      ) : activeTab === 'schedule' ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <ScheduleView 
            schedule={schedule} 
            classes={classes.map(c => ({ id: c.id, name: c.name }))} 
            onAddLesson={handleAddLesson}
            onDeleteLesson={handleDeleteLesson}
          />
        </div>
      ) : activeTab === 'meetings' ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <MeetingManager 
            meetings={meetings}
            students={students}
            onAddMeeting={handleAddMeeting}
            onUpdateMeeting={handleUpdateMeeting}
            onDeleteMeeting={handleDeleteMeeting}
          />
        </div>
      ) : activeTab === 'teams' ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <TeamBuilder students={students} />
        </div>
      ) : activeTab === 'attendance' ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="card animate-fade-in" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>Günlük Yoklama</h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Öğrenci yerlerine sağ tıklayarak yoklama durumunu güncelleyebilirsiniz.</p>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
              📅 {new Date().toLocaleDateString('tr-TR')}
            </div>
          </div>
          <SeatingGrid 
            layout={layout} 
            assignments={assignments} 
            layoutType={layoutType} 
            onAttendanceUpdate={handleAttendanceUpdate}
            isPrivacyMode={isPrivacyMode}
            onSeatMove={handleSeatMove}
          />
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
            <ClassStats students={students} />

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
                    <a href="data:text/csv;charset=utf-8,Ad Soyad,Akademik Ba%C5%9Far%C4%B1,Davran%C4%B1%C5%9F,Boy,G%C3%B6rme Durumu,%C3%96%C4%9Frenme Stili,Yan%C4%B1na Oturmak %C4%B0stedi%C4%9Fi,Uzak Durmak %C4%B0stedi%C4%9Fi"
                       download="aklisira_sablon.csv" 
                       style={{ fontSize: '0.72rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                      📥 Örnek Şablon İndir
                    </a>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Yapay Zeka Asistanı</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: aiUsage >= aiLimit ? 'var(--danger)' : 'var(--primary)', background: aiUsage >= aiLimit ? 'rgba(239,68,68,0.1)' : 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: '50px' }}>
                      ⚡ {Math.max(0, aiLimit - aiUsage)} / {aiLimit} Hak
                    </span>
                  </div>
                  {isListening && (
                    <div className="recording-banner">
                      <div className="recording-dot" />
                      <span className="recording-text">🎤 Kayıt yapılıyor... Bitirmek için mikrofona tekrar tıklayın</span>
                    </div>
                  )}
                  {isProcessing && (
                    <div className="recording-banner processing">
                      <div className="spinner-dot" />
                      <span className="recording-text">⏳ Sesiniz yazıya dökülüyor...</span>
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
                    <button onClick={handleSmartParse} disabled={isOptimizing} className="btn-primary" style={{ flex: 1 }}>
                      {isOptimizing ? '⏳ Çözümleniyor...' : 'Metin Ekle'}
                    </button>
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

              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <span>Sınıf Mevcudu:</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{students.length} öğrenci</span>
              </div>

              {students.length > 0 && (
                <>
                  <div style={{ marginTop: '6px', maxHeight: '120px', overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '6px 8px', background: 'var(--bg-muted)' }}>
                    {students.map(s => (
                      <div 
                        key={s.id} 
                        className="student-list-item" 
                        onClick={() => setSelectedStudent(s)}
                        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', padding: '4px', borderRadius: '4px' }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{s.name}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {s.academicLevel === 'high' ? '▲' : s.academicLevel === 'struggling' ? '▽' : '—'}
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
                    className={`layout-type-btn ${layoutType === lt.id ? 'active' : ''}`}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{lt.icon}</span>
                    <span style={{ fontSize: '0.65rem' }}>{lt.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label>Sıra</label>
                  <input type="number" value={layout.rows} onChange={e => setLayout({...layout, rows: parseInt(e.target.value) || 1})} min="1" max="10" />
                </div>
                <div className="form-group">
                  <label>Sütun</label>
                  <input type="number" value={layout.cols} onChange={e => setLayout({...layout, cols: parseInt(e.target.value) || 1})} min="1" max="10" />
                </div>
              </div>
            </div>

            {/* Optimize Button */}
            <div className="card animate-fade-in" style={{ background: 'var(--primary-pale)', border: '1.5px solid var(--primary-light)' }}>
              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                onClick={handleOptimize}
                disabled={isOptimizing || students.length === 0}
              >
                {isOptimizing ? '✨ Optimizasyon Sürüyor...' : '✨ Düzeni Optimize Et'}
              </button>
              {assignments.length > 0 && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <button onClick={handleSaveAssignments} className="btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }}>Kaydet</button>
                  <button onClick={exportResults} className="btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }}>Dışa Aktar</button>
                </div>
              )}
            </div>
          </div>

          {/* ═══ Right Panel ═══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {assignments.length > 0 ? (
              <div className={optimizationDone ? 'success-flash' : ''}>
                <SeatingGrid 
                  layout={layout} 
                  assignments={assignments} 
                  layoutType={layoutType} 
                  isPrivacyMode={isPrivacyMode}
                  onSeatMove={handleSeatMove}
                />
              </div>
            ) : (
              <div className="empty-state">
                <div className="icon">🏫</div>
                <p>Öğrenci bilgilerini girin ve <strong>Düzeni Oluştur</strong> butonuna tıklayarak yapay zeka destekli oturma planını görün.</p>
              </div>
            )}

            {currentMetrics && (
              <div className="results-grid animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="card" style={{ borderTop: '3px solid var(--primary)' }}>
                  <div className="card-header">
                    <span>📊 Sonuçlar</span>
                    {isOptimizing && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700 }}>
                        Nesil {generation}/60
                      </span>
                    )}
                  </div>
                  {(fitnessHistory.length > 1 || isOptimizing) && (
                    <div className="gen-chart" aria-label="Nesil bazlı uyum grafiği">
                      <div className="gen-chart-header">
                        <span className="gen-chart-title">Optimizasyon İlerlemesi</span>
                        <span className="gen-chart-value">%{fitnessHistory[fitnessHistory.length - 1] ?? 0}</span>
                      </div>
                      <svg className="gen-chart-svg" viewBox="0 0 280 72" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="genChartFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(20, 184, 166, 0.35)" />
                            <stop offset="100%" stopColor="rgba(20, 184, 166, 0.02)" />
                          </linearGradient>
                        </defs>
                        {[25, 50, 75].map(y => (
                          <line key={y} x1="0" y1={72 - (y / 100) * 72} x2="280" y2={72 - (y / 100) * 72} className="gen-chart-grid" />
                        ))}
                        {fitnessHistory.length > 1 && (() => {
                          const max = Math.max(...fitnessHistory, 100);
                          const min = Math.min(...fitnessHistory, 0);
                          const range = Math.max(max - min, 8);
                          const points = fitnessHistory.map((v, i) => {
                            const x = (i / Math.max(fitnessHistory.length - 1, 1)) * 280;
                            const y = 72 - ((v - min) / range) * 64 - 4;
                            return `${x},${y}`;
                          }).join(' ');
                          const area = `0,72 ${points} 280,72`;
                          return (
                            <>
                              <polygon points={area} fill="url(#genChartFill)" />
                              <polyline points={points} className="gen-chart-line" />
                            </>
                          );
                        })()}
                      </svg>
                      <div className="gen-chart-axis">
                        <span>0</span>
                        <span>Nesil {generation || fitnessHistory.length - 1}</span>
                      </div>
                    </div>
                  )}
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
                  </div>
                </div>

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
        </div>
      </footer>
      {/* ─── Student Profile Modal (Professional Tabbed Notebook) ─── */}
      {selectedStudent && (
        <div className="modal-overlay">
          <div className="student-modal">
            <div className="student-modal-hero">
              <div className="student-avatar" style={{ background: AVATAR_COLORS[selectedStudent.name.length % AVATAR_COLORS.length] }}>
                {selectedStudent.name[0]}
              </div>
              <div>
                <h2 className="student-modal-name">{selectedStudent.name}</h2>
                <div className="student-modal-meta">ÖĞRENCİ PROFİLİ VE GÖZLEM DEFTERİ</div>
              </div>
              <button onClick={() => { setSelectedStudent(null); setModalTab('info'); }} className="modal-close-btn">×</button>
            </div>

            <div className="modal-tabs">
              <button onClick={() => setModalTab('info')} className={`modal-tab ${modalTab === 'info' ? 'active' : ''}`}>📑 BİLGİLER</button>
              <button onClick={() => setModalTab('observations')} className={`modal-tab ${modalTab === 'observations' ? 'active' : ''}`}>🔍 GÖZLEMLER ({selectedStudent.observations?.length || 0})</button>
            </div>
            
            <div className="modal-body">
              {modalTab === 'info' ? (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Akademik Seviye</label>
                      <select 
                        className="form-textarea" style={{ padding: '8px' }}
                        value={selectedStudent.academicLevel}
                        onChange={e => setSelectedStudent({...selectedStudent, academicLevel: e.target.value as any})}
                      >
                        <option value="high">Yüksek (Başarılı)</option>
                        <option value="above_average">Ortalama Üstü</option>
                        <option value="average">Ortalama</option>
                        <option value="below_average">Ortalama Altı</option>
                        <option value="struggling">Zorlanan (Zayıf)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Davranış</label>
                      <select 
                        className="form-textarea" style={{ padding: '8px' }}
                        value={selectedStudent.behaviorType}
                        onChange={e => setSelectedStudent({...selectedStudent, behaviorType: e.target.value as any})}
                      >
                        <option value="quiet">Sessiz / Sakin</option>
                        <option value="follower">Uyumlu / Takipçi</option>
                        <option value="active">Aktif / Katılımcı</option>
                        <option value="leader">Lider / Dominant</option>
                        <option value="disruptive">Gürültücü / Haylaz</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Yanına Oturmak İstediği</label>
                      <input 
                        className="form-textarea" style={{ padding: '8px' }}
                        type="text" 
                        value={selectedStudent.friends.join(', ')} 
                        onChange={e => setSelectedStudent({...selectedStudent, friends: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                        placeholder="İsimleri virgülle ayırın"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Uzak Durması Gereken</label>
                      <input 
                        className="form-textarea" style={{ padding: '8px' }}
                        type="text" 
                        value={selectedStudent.avoidStudents.join(', ')} 
                        onChange={e => setSelectedStudent({...selectedStudent, avoidStudents: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                        placeholder="İsimleri virgülle ayırın"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Öğrenme Stili</label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      {['visual', 'auditory', 'kinesthetic', 'readwrite'].map(style => (
                        <button 
                          key={style}
                          onClick={() => setSelectedStudent({...selectedStudent, learningStyle: style as any})}
                          style={{ 
                            flex: 1, padding: '8px 4px', fontSize: '0.65rem', borderRadius: '6px', border: '1.5px solid var(--border)',
                            background: selectedStudent.learningStyle === style ? 'var(--primary-pale)' : 'white',
                            color: selectedStudent.learningStyle === style ? 'var(--primary)' : 'var(--text-secondary)',
                            fontWeight: 700
                          }}
                        >
                          {style.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in">
                  {/* Add New Observation */}
                  <div className="obs-add-area">
                    <div className="obs-type-selector">
                      <button onClick={() => setNewObsType('academic')} className={`obs-type-btn ${newObsType === 'academic' ? 'sel-academic' : ''}`}>AKADEMİK</button>
                      <button onClick={() => setNewObsType('behavior')} className={`obs-type-btn ${newObsType === 'behavior' ? 'sel-behavior' : ''}`}>DAVRANIŞ</button>
                      <button onClick={() => setNewObsType('parent')} className={`obs-type-btn ${newObsType === 'parent' ? 'sel-parent' : ''}`}>VELİ NOTU</button>
                      <button onClick={() => setNewObsType('general')} className={`obs-type-btn ${newObsType === 'general' ? 'sel-general' : ''}`}>GENEL</button>
                    </div>
                    <textarea 
                      className="form-textarea" rows={2}
                      placeholder="Yeni gözlem veya not ekleyin..."
                      value={newObsText}
                      onChange={e => setNewObsText(e.target.value)}
                    />
                    <button onClick={handleAddObservation} className="btn-primary" style={{ padding: '8px' }}>Ekle ✓</button>
                  </div>

                  {/* Observation History */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(!selectedStudent.observations || selectedStudent.observations.length === 0) ? (
                      <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Henüz kayıtlı gözlem yok.</div>
                    ) : (
                      selectedStudent.observations.map(obs => (
                        <div key={obs.id} className="obs-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className={`obs-type-badge obs-type-${obs.type}`}>{obs.type}</span>
                            <span className="obs-card-date">{obs.date}</span>
                          </div>
                          <div className="obs-card-text">{obs.text}</div>
                          <button onClick={() => handleDeleteObservation(obs.id)} className="obs-delete-btn" title="Sil">×</button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => handleUpdateStudent(selectedStudent)} className="btn-primary" style={{ flex: 1 }}>Değişiklikleri Uygula</button>
              <button onClick={() => { setSelectedStudent(null); setModalTab('info'); }} className="btn-secondary">Kapat</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── AI Limit Reached Modal ─── */}
      {showLimitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400, padding: '16px' }}>
          <div className="animate-slide-up" style={{ background: 'white', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '420px', boxShadow: 'var(--shadow-xl)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚡</div>
            <h2 style={{ margin: '0 0 12px', fontWeight: 900, color: 'var(--text-dark)', fontSize: '1.4rem' }}>
              Yapay Zeka Hakkınız Doldu
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '24px' }}>
              {!user 
                ? "Misafir kullanıcılar için günlük 10 olan yapay zeka analiz hakkınızı doldurdunuz. Sınırsız özellikler ve günlük 50 hak için hemen ücretsiz kayıt olun!"
                : "Günlük 50 olan ücretsiz yapay zeka analiz hakkınızı doldurdunuz. Sınırsız kullanım için çok yakında Pro pakete geçebileceksiniz!"}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {!user && (
                <button 
                  onClick={() => window.location.href = '/login'}
                  style={{ width: '100%', padding: '14px', background: 'var(--primary-gradient)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(74, 222, 128, 0.3)' }}
                >
                  Ücretsiz Kayıt Ol
                </button>
              )}
              <button 
                onClick={() => setShowLimitModal(false)}
                style={{ width: '100%', padding: '14px', background: 'transparent', color: 'var(--text-muted)', border: '2px solid var(--border-light)', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ─── QUICK NOTE MODAL ─── */}
      {showQuickNote && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: '16px' }}>
          <div className="animate-slide-up" style={{ background: 'white', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>Hızlı Gözlem Notu</h2>
              <button onClick={() => setShowQuickNote(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <input 
                type="text" className="form-input" placeholder="Öğrenci ara..." 
                value={quickSearch} onChange={e => setQuickSearch(e.target.value)}
                style={{ marginBottom: '12px' }}
              />
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '4px' }}>
                {students.filter(s => s.name.toLowerCase().includes(quickSearch.toLowerCase())).map(s => (
                  <button 
                    key={s.id}
                    onClick={() => { setSelectedStudent(s); setModalTab('observations'); setShowQuickNote(false); setQuickSearch(""); }}
                    style={{ 
                      width: '100%', padding: '10px 12px', textAlign: 'left', border: 'none', background: 'transparent',
                      borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--bg-muted)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span>{s.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Gözlem Yaz →</span>
                  </button>
                ))}
                {students.length === 0 && <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', padding: '12px' }}>Önce öğrenci eklemelisiniz.</p>}
              </div>
            </div>
            
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Öğrenciyi seçtiğinizde gözlem defteri otomatik açılacaktır.
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
