// src/services/dataService.ts
import { supabase, isSupabaseAvailable } from '../lib/supabase';
import { School, Klass, Student, Asmt, Doc } from '../types';

// Type definitions
export interface AppData {
  schools: School[];
  klasses: Klass[];
  students: Student[];
  asmts: Asmt[];
  docs: Doc[];
}

const STORAGE_KEY = 'schooltrack_data';

// Local storage functions
const getLocalData = (): AppData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { schools: [], klasses: [], students: [], asmts: [], docs: [] };
  } catch {
    return { schools: [], klasses: [], students: [], asmts: [], docs: [] };
  }
};

const saveLocalData = (data: AppData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Data Service
export const dataService = {
  // Load all data
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

        // Sync to localStorage as backup
        saveLocalData(data);
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

  // Schools
  async saveSchools(schools: School[]) {
    if (isSupabaseAvailable()) {
      // For simplicity in the demo, we'll handle individual operations
      // This is a batch save for the entire array
      try {
        // Delete all existing schools
        await supabase!.from('schools').delete().neq('id', '');
        // Insert new schools
        if (schools.length > 0) {
          await supabase!.from('schools').insert(schools);
        }
        console.log('✅ Schools saved to Supabase');
      } catch (error) {
        console.error('❌ Error saving schools to Supabase:', error);
      }
    }
    // Always save to localStorage as backup
    const data = getLocalData();
    data.schools = schools;
    saveLocalData(data);
  },

  // Classes
  async saveClasses(klasses: Klass[]) {
    if (isSupabaseAvailable()) {
      try {
        await supabase!.from('classes').delete().neq('id', '');
        if (klasses.length > 0) {
          await supabase!.from('classes').insert(klasses);
        }
        console.log('✅ Classes saved to Supabase');
      } catch (error) {
        console.error('❌ Error saving classes to Supabase:', error);
      }
    }
    const data = getLocalData();
    data.klasses = klasses;
    saveLocalData(data);
  },

  // Students
  async saveStudents(students: Student[]) {
    if (isSupabaseAvailable()) {
      try {
        await supabase!.from('students').delete().neq('id', '');
        if (students.length > 0) {
          await supabase!.from('students').insert(students);
        }
        console.log('✅ Students saved to Supabase');
      } catch (error) {
        console.error('❌ Error saving students to Supabase:', error);
      }
    }
    const data = getLocalData();
    data.students = students;
    saveLocalData(data);
  },

  // Assessments
  async saveAssessments(asmts: Asmt[]) {
    if (isSupabaseAvailable()) {
      try {
        await supabase!.from('assessments').delete().neq('id', '');
        if (asmts.length > 0) {
          await supabase!.from('assessments').insert(asmts);
        }
        console.log('✅ Assessments saved to Supabase');
      } catch (error) {
        console.error('❌ Error saving assessments to Supabase:', error);
      }
    }
    const data = getLocalData();
    data.asmts = asmts;
    saveLocalData(data);
  },

  // Documents
  async saveDocuments(docs: Doc[]) {
    if (isSupabaseAvailable()) {
      try {
        await supabase!.from('documents').delete().neq('id', '');
        if (docs.length > 0) {
          await supabase!.from('documents').insert(docs);
        }
        console.log('✅ Documents saved to Supabase');
      } catch (error) {
        console.error('❌ Error saving documents to Supabase:', error);
      }
    }
    const data = getLocalData();
    data.docs = docs;
    saveLocalData(data);
  },

  // Individual CRUD operations with fallback
  async addSchool(school: School): Promise<boolean> {
    if (isSupabaseAvailable()) {
      try {
        const { error } = await supabase!.from('schools').insert([school]);
        if (error) throw error;
        console.log('✅ School added to Supabase');
        return true;
      } catch (error) {
        console.error('❌ Error adding school to Supabase:', error);
      }
    }
    // Fallback to localStorage
    const data = getLocalData();
    data.schools.push(school);
    saveLocalData(data);
    return true;
  },

  async deleteSchool(id: string): Promise<boolean> {
    if (isSupabaseAvailable()) {
      try {
        const { error } = await supabase!.from('schools').delete().eq('id', id);
        if (error) throw error;
        console.log('✅ School deleted from Supabase');
        return true;
      } catch (error) {
        console.error('❌ Error deleting school from Supabase:', error);
      }
    }
    // Fallback to localStorage
    const data = getLocalData();
    data.schools = data.schools.filter(s => s.id !== id);
    saveLocalData(data);
    return true;
  },

  // Add more individual CRUD operations as needed...
};

export default dataService;
