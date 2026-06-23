
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
console.log('🔍 Environment Variables Check:');
console.log('📌 VITE_SUPABASE_URL:', supabaseUrl ? '✅ Loaded' : '❌ Missing');
console.log('📌 VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Loaded' : '❌ Missing');

// Validate credentials
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL is missing!');
  console.error('Please add to .env: VITE_SUPABASE_URL=https://yiymjiefemecrlumimhq.supabase.co');
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is missing!');
  console.error('Please add to .env: VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
}

// Only create client if both credentials exist
let supabaseInstance = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client initialized successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error);
    supabaseInstance = null;
  }
} else {
  console.warn('⚠️ Supabase client not initialized - missing credentials');
}

export const supabase = supabaseInstance;
export const isSupabaseAvailable = () => supabase !== null;

// Helper function to check if we're connected
export const checkSupabaseConnection = async () => {
  if (!supabase) return false;
  try {
    const { data, error } = await supabase.from('schools').select('count', { count: 'exact', head: true });
    return !error;
  } catch {
    return false;
  }
};
