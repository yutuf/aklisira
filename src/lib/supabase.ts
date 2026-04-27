import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface WaitlistEntry {
  id?: string;
  email: string;
  name?: string;
  created_at?: string;
}

export interface DbClassroom {
  id?: string;
  user_id?: string;
  name: string;
  grade?: string;
  layout_type: string;
  layout_config: object;
  created_at?: string;
  updated_at?: string;
}

export interface DbStudent {
  id?: string;
  classroom_id: string;
  name: string;
  profile: object; // full Student type as JSON
  created_at?: string;
}

export interface DbArrangement {
  id?: string;
  classroom_id: string;
  assignments: object; // SeatingAssignment[] as JSON
  metrics?: object;
  created_at?: string;
}
