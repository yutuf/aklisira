import { useState, useEffect, useCallback } from 'react';
import { Student, ClassroomLayout, SeatingAssignment } from '../types';

export interface SavedClass {
  id: string;
  name: string;
  subject?: string;
  grade?: string;
  students: Student[];
  layout: ClassroomLayout;
  assignments: SeatingAssignment[];
  layoutType: string;
  lastModified: string;
  createdAt: string;
}

const STORAGE_KEY = 'aklisira_classes_v2';

function generateId() {
  return `cls_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function loadFromStorage(): SavedClass[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(classes: SavedClass[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  } catch {}
}

export function useClassrooms() {
  const [classes, setClasses] = useState<SavedClass[]>([]);
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromStorage();
    setClasses(saved);
    if (saved.length > 0) {
      setActiveClassId(saved[0].id);
    }
    setLoaded(true);
  }, []);

  // Save to localStorage whenever classes change
  useEffect(() => {
    if (loaded) {
      saveToStorage(classes);
    }
  }, [classes, loaded]);

  const activeClass = classes.find(c => c.id === activeClassId) ?? null;

  const createClass = useCallback((name: string, subject?: string, grade?: string): string => {
    const id = generateId();
    const now = new Date().toISOString();
    const newClass: SavedClass = {
      id,
      name,
      subject,
      grade,
      students: [],
      layout: { rows: 5, cols: 6, seats: [], windowSide: 'left', doorPosition: 'front-right' },
      assignments: [],
      layoutType: 'grid',
      lastModified: now,
      createdAt: now,
    };
    setClasses(prev => [newClass, ...prev]);
    setActiveClassId(id);
    return id;
  }, []);

  const updateClass = useCallback((id: string, updates: Partial<SavedClass>) => {
    setClasses(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, ...updates, lastModified: new Date().toISOString() }
          : c
      )
    );
  }, []);

  const deleteClass = useCallback((id: string) => {
    setClasses(prev => {
      const next = prev.filter(c => c.id !== id);
      if (activeClassId === id) {
        setActiveClassId(next[0]?.id ?? null);
      }
      return next;
    });
  }, [activeClassId]);

  const duplicateClass = useCallback((id: string) => {
    const src = classes.find(c => c.id === id);
    if (!src) return;
    const newId = generateId();
    const now = new Date().toISOString();
    const copy: SavedClass = {
      ...src,
      id: newId,
      name: `${src.name} (Kopya)`,
      assignments: [],
      createdAt: now,
      lastModified: now,
    };
    setClasses(prev => [copy, ...prev]);
    setActiveClassId(newId);
  }, [classes]);

  return {
    classes,
    activeClass,
    activeClassId,
    setActiveClassId,
    createClass,
    updateClass,
    deleteClass,
    duplicateClass,
    loaded,
  };
}
