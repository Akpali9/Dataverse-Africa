
import { createClient } from '@supabase/supabase-js';

// Use VITE_ prefix instead of REACT_APP_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: Check if variables are loaded (remove in production)
console.log('🔍 Checking Supabase environment variables:');
console.log('📌 VITE_SUPABASE_URL:', supabaseUrl ? '✅ Loaded' : '❌ Missing');
console.log('📌 VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Loaded' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(`
  ⚠️ Supabase credentials are missing!
  
  Please create a .env file in your project root with:
  
  VITE_SUPABASE_URL=https://your-project-id.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  
  You can find these in your Supabase project:
  Settings → API → Project URL & anon public key
  `);
  
  // Don't throw error in production, just log and show fallback UI
  if (import.meta.env.PROD) {
    console.warn('⚠️ Running in production without Supabase credentials.');
  }
}

// Only create client if credentials exist
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check if Supabase is available
export const isSupabaseAvailable = () => supabase !== null;
