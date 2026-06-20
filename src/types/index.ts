export type AcademicLevel = 'high' | 'above_average' | 'average' | 'below_average' | 'struggling';
export type BehaviorType = 'quiet' | 'active' | 'follower' | 'leader' | 'disruptive';
export type MovementNeeds = 'high' | 'moderate' | 'low' | 'very_low';
export type SpecialNeeds = 'none' | 'adhd' | 'anxiety' | 'vision' | 'hearing' | string;
export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'readwrite';
export type HeightCategory = 'short' | 'average' | 'tall';
export type VisionNeeds = 'none' | 'glasses' | 'front_required';
export type HearingNeeds = 'none' | 'partial' | 'front_required';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
}

export interface Observation {
  id: string;
  date: string;
  type: 'academic' | 'behavior' | 'parent' | 'general';
  text: string;
}

export interface Student {
  id: string;
  name: string;
  academicLevel: AcademicLevel;
  behaviorType: BehaviorType;
  movementNeeds: MovementNeeds;
  specialNeeds: SpecialNeeds;
  friends: string[];
  avoidStudents: string[];
  // v2 additions
  learningStyle?: LearningStyle;
  temperament?: string;
  height?: HeightCategory;
  visionNeeds?: VisionNeeds;
  hearingNeeds?: HearingNeeds;
  gender?: string;
  notes?: string;
  observations?: Observation[];
  attendance?: AttendanceRecord[];
  badges?: Badge[];
}

export interface Badge {
  id: string;
  type: 'star' | 'academic' | 'behavior' | 'helper';
  date: string;
  reason: string;
}

export interface Seat {
  id: string;
  row: number;
  col: number;
  studentId?: string | null;
}

export interface ClassroomLayout {
  rows: number;
  cols: number;
  seats: Seat[];
  windowSide?: 'left' | 'right' | 'both' | 'none';
  doorPosition?: 'front-left' | 'front-right' | 'back' | 'none';
}

export interface SeatingAssignment {
  student: Student;
  seatIndex: number;
  row: number;
  col: number;
}

export type LayoutType = 'grid' | 'paired' | 'u-shape' | 'cluster' | 'chevron';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Lesson {
  id: string;
  subject: string;
  classId: string;
  day: DayOfWeek;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  color?: string;
}

export interface WeeklySchedule {
  lessons: Lesson[];
}

export interface ParentMeeting {
  id: string;
  studentId: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  topic: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}
