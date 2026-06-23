// src/services/dataService.ts
import { supabase, isSupabaseAvailable } from '../lib/supabase';

export interface AppData {
  schools: any[];
  klasses: any[];
  students: any[];
  asmts: any[];
  docs: any[];
}

const STORAGE_KEY = 'schooltrack_data';

const getLocalData = (): AppData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { schools: [], klasses: [], students: [], asmts: [], docs: [] };
  } catch {
    return { schools: [], klasses: [], students: [], asmts: [], docs: [] };
  }
};

export const dataService = {
  async loadAll(): Promise<AppData> {
    if (isSupabaseAvailable()) {
      try {
        console.log('📡 Loading data from Supabase...');
        const [schools, classes, students, assessments, docs] = await Promise.all([
          supabase!.from('schools').select('*').order('name'),
          supabase!.from('classes').select('*').order('name'),
          supabase!.from('students').select('*').order('last_name'),
          supabase!.from('assessments').select('*'),
          supabase!.from('documents').select('*').order('created_at', { ascending: false }),
        ]);

        const data = {
          schools: schools.data || [],
          klasses: classes.data || [],
          students: students.data || [],
          asmts: assessments.data || [],
          docs: docs.data || [],
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log('✅ Data loaded from Supabase');
        return data;
      } catch (error) {
        console.error('❌ Error loading from Supabase, falling back to localStorage:', error);
        return getLocalData();
      }
    } else {
      console.log('📡 Loading data from localStorage...');
      return getLocalData();
    }
  },

  async addSchool(school: any): Promise<boolean> {
    if (isSupabaseAvailable()) {
      try {
        const { error } = await supabase!.from('schools').insert([school]);
        if (error) throw error;
        return true;
      } catch (error) {
        console.error('❌ Error adding school to Supabase:', error);
      }
    }
    return false;
  },

  async deleteSchool(id: string): Promise<boolean> {
    if (isSupabaseAvailable()) {
      try {
        const { error } = await supabase!.from('schools').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (error) {
        console.error('❌ Error deleting school from Supabase:', error);
      }
    }
    return false;
  }
};
