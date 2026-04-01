export type AcademicLevel = 'high' | 'above_average' | 'average' | 'below_average' | 'struggling';
export type BehaviorType = 'quiet' | 'active' | 'follower' | 'leader' | 'disruptive';
export type MovementNeeds = 'high' | 'moderate' | 'low' | 'very_low';
export type SpecialNeeds = 'none' | 'adhd' | 'anxiety' | 'vision' | 'hearing' | string;

export interface Student {
  id: string;
  name: string;
  academicLevel: AcademicLevel;
  behaviorType: BehaviorType;
  movementNeeds: MovementNeeds;
  specialNeeds: SpecialNeeds;
  friends: string[]; // List of student names (or IDs if we upgrade)
  avoidStudents: string[]; // List of student names
}

export interface Seat {
  id: string; // e.g. "r0-c1"
  row: number;
  col: number;
  studentId?: string | null; // Occupant
}

export interface ClassroomLayout {
  rows: number;
  cols: number;
  seats: Seat[];
}

export interface SeatingAssignment {
  student: Student;
  seatIndex: number; // For compatibility with old logic
  row: number;
  col: number;
}
