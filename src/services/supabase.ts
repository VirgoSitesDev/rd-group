import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

export default supabase;