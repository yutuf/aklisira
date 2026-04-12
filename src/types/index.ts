export type AcademicLevel = 'high' | 'above_average' | 'average' | 'below_average' | 'struggling';
export type BehaviorType = 'quiet' | 'active' | 'follower' | 'leader' | 'disruptive';
export type MovementNeeds = 'high' | 'moderate' | 'low' | 'very_low';
export type SpecialNeeds = 'none' | 'adhd' | 'anxiety' | 'vision' | 'hearing' | string;
export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'readwrite';
export type HeightCategory = 'short' | 'average' | 'tall';
export type VisionNeeds = 'none' | 'glasses' | 'front_required';
export type HearingNeeds = 'none' | 'partial' | 'front_required';

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
}

export interface SeatingAssignment {
  student: Student;
  seatIndex: number;
  row: number;
  col: number;
}

export type LayoutType = 'grid' | 'paired' | 'u-shape' | 'cluster' | 'chevron' | 'butterfly';
