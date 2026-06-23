// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Get environment variables with VITE_ prefix
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
console.log('🔍 Supabase Configuration:');
console.log('📌 URL:', supabaseUrl ? '✅ Loaded' : '❌ Missing');
console.log('📌 Key:', supabaseAnonKey ? '✅ Loaded' : '❌ Missing');

// Validate credentials
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(`
  ⚠️ Supabase credentials are missing!
  
  Please create a .env file in your project root with:
  
  VITE_SUPABASE_URL=https://yiymjiefemecrlumimhq.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpeW1qaWVmZW1lY3JsdW1pbWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMzY2MTIsImV4cCI6MjA5NzgxMjYxMn0.fDFSrB_XkpVsfy7vXH0vQunUksy7-SDPypzMaj846ko
  
  You can find these in your Supabase project:
  Settings → API → Project URL & anon public key
  `);
}

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => supabase !== null;
