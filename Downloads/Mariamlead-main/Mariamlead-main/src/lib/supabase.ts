import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GenerationSession {
  id: string;
  location: string;
  industry: string;
  daily_target: number;
  batch_size: number;
  current_count: number;
  status: 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  session_id: string;
  business_name: string;
  phone_contact: string;
  location: string;
  industry: string;
  batch_number: number;
  is_downloaded: boolean;
  created_at: string;
}

export interface BatchDownload {
  id: string;
  session_id: string;
  batch_number: number;
  lead_count: number;
  downloaded_at: string;
}
