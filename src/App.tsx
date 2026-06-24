import { useState, useEffect, useCallback, useRef } from "react";
import {
  Building2, BookOpen, Users, ChevronRight, Plus, X,
  FileText, Github, Download, Trash2, GraduationCap,
  ExternalLink, Save, Pencil, Check, BarChart2, ClipboardList,
  Edit2, Camera, Loader2, RefreshCw, Search, AlertCircle,
  Wifi, WifiOff, Clipboard, Edit3, Save as SaveIcon
} from "lucide-react";
import { supabase, isSupabaseAvailable } from './lib/supabase';

// ── Types ─────────────────────────────────────────────────────────────────────
type View = "schools" | "classes" | "students" | "student" | "docs" | "scores";
type Term = 1 | 2 | 3;
type AType = "test1" | "test2" | "test3" | "project" | "exam";
type Grade = "A+" | "A" | "B" | "C" | "D" | "F";

// ... [All interfaces and constants remain the same as before]

// ── ScoreInputModal Component ──────────────────────────────────────────────
function ScoreInputModal({ 
  klass, 
  students, 
  asmts, 
  onSave,
  onClose 
}: { 
  klass: any; 
  students: any[]; 
  asmts: any[]; 
  onSave: (id: string, score: number) => void;
  onClose: () => void;
}) {
  const [selectedTerm, setSelectedTerm] = useState<Term>(1);
  const [selectedType, setSelectedType] = useState<AType>("test1");
  const [scores, setScores] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const existingScores: Record<string, string> = {};
    students.forEach((student: any) => {
      const assessment = asmts.find((a: any) => 
        a.student_id === student.id && 
        a.term === selectedTerm && 
        a.type === selectedType &&
        a.year === klass.academic_year
      );
      if (assessment) {
        existingScores[student.id] = String(assessment.score);
      } else {
        existingScores[student.id] = "";
      }
    });
    setScores(existingScores);
  }, [students, asmts, selectedTerm, selectedType, klass.academic_year]);

  const handleScoreChange = (studentId: string, value: string) => {
    setScores(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const savePromises = students.map((student: any) => {
        const scoreValue = scores[student.id];
        if (scoreValue !== undefined && scoreValue !== "") {
          const score = parseFloat(scoreValue);
          if (!isNaN(score) && score >= 0) {
            const existing = asmts.find((a: any) => 
              a.student_id === student.id && 
              a.term === selectedTerm && 
              a.type === selectedType &&
              a.year === klass.academic_year
            );
            if (existing) {
              return onSave(existing.id, Math.round(score));
            }
          }
        }
        return Promise.resolve();
      });
      await Promise.all(savePromises);
      onClose();
    } catch (error) {
      console.error('Error saving scores:', error);
    } finally {
      setSaving(false);
    }
  };

  const maxScore = AMAX[selectedType];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div>
            <h2 className="font-bold text-lg">Input Scores</h2>
            <p className="text-sm text-muted-foreground">{klass.name} · {klass.subject}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X size={18} /></button>
        </div>
        
        <div className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className={labelCls}>Term</label>
              <select 
                value={selectedTerm} 
                onChange={(e) => setSelectedTerm(Number(e.target.value) as Term)}
                className={inputCls + " w-40"}
              >
                <option value={1}>First Term</option>
                <option value={2}>Second Term</option>
                <option value={3}>Third Term</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Assessment Type</label>
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value as AType)}
                className={inputCls + " w-40"}
              >
                {ATYPES.map(t => <option key={t} value={t}>{AL[t]} (Max: {AMAX[t]})</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <span className="text-sm text-muted-foreground">
                Max Score: <span className="font-bold">{maxScore}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">#</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Student</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Score</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Grade</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((student: any, index: number) => {
                const scoreVal = parseFloat(scores[student.id] || "0");
                const isValid = !isNaN(scoreVal) && scoreVal >= 0 && scoreVal <= maxScore;
                const grade = isValid ? gradeStr(scoreVal, maxScore) : "N/A";
                const percentage = isValid ? pct(scoreVal, maxScore) : 0;
                
                return (
                  <tr key={student.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground font-mono">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar student={student} size="sm" />
                        <span className="font-medium">{student.first_name} {student.last_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        max={maxScore}
                        value={scores[student.id] || ""}
                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                        className="w-24 border border-border rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="-"
                      />
                      <span className="text-xs text-muted-foreground ml-2">/ {maxScore}</span>
                    </td>
                    <td className="px-4 py-3">
                      {scores[student.id] && scores[student.id] !== "" && (
                        <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${GRADE_COLORS[grade as Grade] || "bg-gray-100 text-gray-600"}`}>
                          {grade}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {scores[student.id] && scores[student.id] !== "" && isValid && (
                        <span className={`text-sm font-mono ${percentage >= 80 ? "text-emerald-600" : percentage >= 60 ? "text-amber-600" : "text-red-600"}`}>
                          {percentage}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-sm hover:bg-muted transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSaveAll}
            disabled={saving}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <SaveIcon size={16} />}
            {saving ? 'Saving...' : 'Save All Scores'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<View>("schools");
  const [school, setSchool] = useState<any | null>(null);
  const [klass, setKlass] = useState<any | null>(null);
  const [student, setStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(isSupabaseAvailable());
  const [refreshing, setRefreshing] = useState(false);

  const [schools, setSchools] = useState<any[]>([]);
  const [klasses, setKlasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [asmts, setAsmts] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);

  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  
  const [editingSchool, setEditingSchool] = useState<any | null>(null);
  const [editingClass, setEditingClass] = useState<any | null>(null);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);

  const isRefreshing = useRef(false);

  // ── Load Data ──────────────────────────────────────────────────────────────
  const loadData = useCallback(async (showLoading = true) => {
    if (isRefreshing.current) return;
    
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    
    if (!isSupabaseAvailable()) {
      setError('Cannot connect to database. Please check your connection.');
      if (showLoading) setLoading(false);
      setIsOnline(false);
      return;
    }

    try {
      isRefreshing.current = true;
      setRefreshing(true);
      setIsOnline(true);
      
      const [schoolsRes, classesRes, studentsRes, assessmentsRes, docsRes] = await Promise.all([
        supabase!.from('schools').select('*').order('name'),
        supabase!.from('classes').select('*').order('name'),
        supabase!.from('students').select('*').order('last_name'),
        supabase!.from('assessments').select('*'),
        supabase!.from('documents').select('*').order('created_at', { ascending: false }),
      ]);

      if (schoolsRes.error) throw new Error(schoolsRes.error.message);
      if (classesRes.error) throw new Error(classesRes.error.message);
      if (studentsRes.error) throw new Error(studentsRes.error.message);
      if (assessmentsRes.error) throw new Error(assessmentsRes.error.message);
      if (docsRes.error) throw new Error(docsRes.error.message);

      setSchools(schoolsRes.data || []);
      setKlasses(classesRes.data || []);
      setStudents(studentsRes.data || []);
      setAsmts(assessmentsRes.data || []);
      setDocs(docsRes.data || []);
      
      console.log('✅ Data loaded successfully!');
    } catch (err: any) {
      console.error('❌ Error loading data:', err);
      if (showLoading) {
        setError(`Failed to load data: ${err.message}`);
      }
    } finally {
      isRefreshing.current = false;
      setRefreshing(false);
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  // ── Initial Load ──────────────────────────────────────────────────────────
  useEffect(() => {
    loadData(true);
  }, []);

  // ── Real-time Subscriptions ──────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseAvailable()) return;

    const channels = [
      supabase!.channel('schools_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'schools' }, () => {
          if (!isRefreshing.current) loadData(false);
        })
        .subscribe(),
      supabase!.channel('classes_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'classes' }, () => {
          if (!isRefreshing.current) loadData(false);
        })
        .subscribe(),
      supabase!.channel('students_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
          if (!isRefreshing.current) loadData(false);
        })
        .subscribe(),
      supabase!.channel('assessments_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'assessments' }, () => {
          if (!isRefreshing.current) loadData(false);
        })
        .subscribe(),
      supabase!.channel('documents_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'documents' }, () => {
          if (!isRefreshing.current) loadData(false);
        })
        .subscribe(),
    ];

    const interval = setInterval(() => {
      setIsOnline(isSupabaseAvailable());
    }, 30000);

    return () => {
      channels.forEach(ch => ch.unsubscribe());
      clearInterval(interval);
    };
  }, [loadData]);

  // ── CRUD Operations ──────────────────────────────────────────────────────

  const addSchool = async (newSchool: any) => {
    if (!isSupabaseAvailable()) {
      setError('Cannot save: Database not available');
      return;
    }
    try {
      const { error } = await supabase!.from('schools').insert([newSchool]);
      if (error) throw error;
    } catch (err: any) {
      console.error('Error adding school:', err);
      setError(`Failed to save school: ${err.message}`);
    }
  };

  const editSchool = async (updated: any) => {
    if (!isSupabaseAvailable()) {
      setError('Cannot update: Database not available');
      return;
    }
    try {
      const { error } = await supabase!.from('schools').update(updated).eq('id', updated.id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Error updating school:', err);
      setError(`Failed to update school: ${err.message}`);
    }
  };

  const delSchool = async (id: string) => {
    if (!isSupabaseAvailable()) {
      setError('Cannot delete: Database not available');
      return;
    }
    try {
      const { error } = await supabase!.from('schools').delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Error deleting school:', err);
      setError(`Failed to delete school: ${err.message}`);
    }
  };

  const addKlass = async (newKlass: any) => {
    if (!isSupabaseAvailable()) {
      setError('Cannot save: Database not available');
      return;
    }
    try {
      const { error } = await supabase!.from('classes').insert([newKlass]);
      if (error) throw error;
    } catch (err: any) {
      console.error('Error adding class:', err);
      setError(`Failed to save class: ${err.message}`);
    }
  };

  const editKlass = async (updated: any) => {
    if (!isSupabaseAvailable()) {
      setError('Cannot update: Database not available');
      return;
    }
    try {
      const { error } = await supabase!.from('classes').update(updated).eq('id', updated.id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Error updating class:', err);
      setError(`Failed to update class: ${err.message}`);
    }
  };

  const delKlass = async (id: string) => {
    if (!isSupabaseAvailable()) {
      setError('Cannot delete: Database not available');
      return;
    }
    try {
      const { error } = await supabase!.from('classes').delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Error deleting class:', err);
      setError(`Failed to delete class: ${err.message}`);
    }
  };

  const addStudent = async (newStudent: any) => {
    if (!isSupabaseAvailable()) {
      setError('Cannot save: Database not available');
      return;
    }
    try {
      const { error } = await supabase!.from('students').insert([newStudent]);
      if (error) throw error;

      const year = klasses.find((k: any) => k.id === newStudent.class_id)?.academic_year || CURRENT_YEAR;
      const newAsmts: any[] = [];
      for (const term of [1, 2, 3] as Term[])
        for (const type of ATYPES)
          newAsmts.push({ id: uid(), student_id: newStudent.id, term, type, score: 0, max: AMAX[type], year });
      
      const { error: asmtError } = await supabase!.from('assessments').insert(newAsmts);
      if (asmtError) throw asmtError;
    } catch (err: any) {
      console.error('Error adding student:', err);
      setError(`Failed to save student: ${err.message}`);
    }
  };

  const editStudent = async (updated: any) => {
    if (!isSupabaseAvailable()) {
      setError('Cannot update: Database not available');
      return;
    }
    try {
      const { error } = await supabase!.from('students').update(updated).eq('id', updated.id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Error updating student:', err);
      setError(`Failed to update student: ${err.message}`);
    }
  };

  const delStudent = async (id: string) => {
    if (!isSupabaseAvailable()) {
      setError('Cannot delete: Database not available');
      return;
    }
    try {
      const { error } = await supabase!.from('students').delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Error deleting student:', err);
      setError(`Failed to delete student: ${err.message}`);
    }
  };

  const updateScore = async (id: string, score: number) => {
    if (!isSupabaseAvailable()) {
      setError('Cannot update: Database not available');
      return;
    }
    try {
      const { error } = await supabase!.from('assessments').update({ score }).eq('id', id);
      if (error) throw error;
      console.log('✅ Score updated successfully:', id, score);
    } catch (err: any) {
      console.error('Error updating score:', err);
      setError(`Failed to update score: ${err.message}`);
    }
  };

  const addDoc = async (newDoc: any) => {
    if (!isSupabaseAvailable()) {
      setError('Cannot save: Database not available');
      return;
    }
    try {
      const { error } = await supabase!.from('documents').insert([newDoc]);
      if (error) throw error;
    } catch (err: any) {
      console.error('Error adding document:', err);
      setError(`Failed to save document: ${err.message}`);
    }
  };

  const updateDoc = async (id: string, content: string) => {
    if (!isSupabaseAvailable()) {
      setError('Cannot update: Database not available');
      return;
    }
    try {
      const { error } = await supabase!.from('documents').update({ content }).eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Error updating document:', err);
      setError(`Failed to update document: ${err.message}`);
    }
  };

  const delDoc = async (id: string) => {
    if (!isSupabaseAvailable()) {
      setError('Cannot delete: Database not available');
      return;
    }
    try {
      const { error } = await supabase!.from('documents').delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Error deleting document:', err);
      setError(`Failed to delete document: ${err.message}`);
    }
  };

  // ── Navigation ──────────────────────────────────────────────────────────────
  const goSchools = () => { setView("schools"); setSchool(null); setKlass(null); setStudent(null); };
  const goClasses = (s: any) => { setSchool(s); setKlass(null); setStudent(null); setView("classes"); };
  const goStudents = (k: any) => { setKlass(k); setStudent(null); setView("students"); };
  const goStudent = (s: any) => { setStudent(s); setView("student"); };
  const goDocs = () => setView("docs");
  const goScores = (k: any) => { setKlass(k); setView("scores"); };

  const schoolKlasses = klasses.filter((k: any) => k.school_id === school?.id);
  const klassStudents = students.filter((s: any) => s.class_id === klass?.id);
  const studentAsmts = asmts.filter((a: any) => a.student_id === student?.id);

  const handleManualRefresh = () => {
    if (!isRefreshing.current) loadData(true);
  };

  // ── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  // ── Error State ─────────────────────────────────────────────────────────────
  if (error && error.includes('Cannot connect')) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center max-w-md p-6 bg-card rounded-2xl shadow-lg">
          <WifiOff size={56} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button onClick={handleManualRefresh} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 mx-auto">
            <RefreshCw size={18} /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center max-w-md p-6 bg-card rounded-2xl shadow-lg">
          <AlertCircle size={56} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button onClick={handleManualRefresh} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 mx-auto">
            <RefreshCw size={18} /> Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Connection Status Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-1.5 text-xs text-center font-medium flex items-center justify-between ${isOnline ? 'bg-emerald-50 text-emerald-700 border-b border-emerald-200' : 'bg-amber-50 text-amber-700 border-b border-amber-200'}`}>
        <span className="flex items-center gap-2">
          {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
          {isOnline ? 'Connected' : 'Offline'}
        </span>
        <span className="flex items-center gap-2">
          {refreshing ? (
            <Loader2 size={14} className="animate-spin text-primary" />
          ) : (
            <RefreshCw size={14} className="text-muted-foreground" />
          )}
          {refreshing ? 'Refreshing...' : 'Manual refresh'}
        </span>
        <button 
          onClick={handleManualRefresh} 
          className="text-xs font-semibold hover:underline flex items-center gap-1"
          disabled={refreshing}
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Sidebar */}
      <aside className="w-56 bg-primary flex flex-col flex-shrink-0 shadow-xl hidden md:flex mt-8">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center">
              <GraduationCap size={17} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-sm tracking-wide">SchoolTrack</span>
              <div className="text-white/40 text-[10px] font-mono">Academic Manager</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 pt-4 overflow-y-auto">
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">Navigation</p>
          <button
            onClick={goSchools}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${view !== "docs" && view !== "scores" ? "bg-white/15 text-white" : "text-white/55 hover:text-white hover:bg-white/10"}`}
          >
            <Building2 size={15} /> Schools
          </button>
          <button
            onClick={goDocs}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${view === "docs" ? "bg-white/15 text-white" : "text-white/55 hover:text-white hover:bg-white/10"}`}
          >
            <FileText size={15} /> Documents
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Schools</span>
            <span className="text-white/70 font-mono font-bold">{schools.length}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Classes</span>
            <span className="text-white/70 font-mono font-bold">{klasses.length}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Students</span>
            <span className="text-white/70 font-mono font-bold">{students.length}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Documents</span>
            <span className="text-white/70 font-mono font-bold">{docs.length}</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 flex justify-around py-2">
        <button
          onClick={goSchools}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs ${view !== "docs" && view !== "scores" ? "text-primary" : "text-muted-foreground"}`}
        >
          <Building2 size={20} /> Schools
        </button>
        <button
          onClick={goDocs}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs ${view === "docs" ? "text-primary" : "text-muted-foreground"}`}
        >
          <FileText size={20} /> Docs
        </button>
      </nav>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 pb-16 md:pb-0 mt-8">
        {view === "docs" ? (
          <DocsView
            docs={docs}
            schools={schools}
            klasses={klasses}
            onAdd={() => setShowAddDoc(true)}
            onUpdate={updateDoc}
            onDelete={delDoc}
          />
        ) : view === "scores" && klass ? (
          <ScoreManagementView
            school={school!}
            klass={klass}
            students={klassStudents}
            asmts={asmts}
            onUpdateScore={updateScore}
            onBack={() => goClasses(school!)}
            onBackSchool={goSchools}
          />
        ) : (
          <div className="flex-1 overflow-y-auto">
            {view === "schools" && (
              <SchoolsView
                schools={schools}
                onOpen={goClasses}
                onAdd={() => setShowAddSchool(true)}
                onDelete={delSchool}
                onEdit={(s: any) => setEditingSchool(s)}
              />
            )}
            {view === "classes" && school && (
              <ClassesView
                school={school}
                klasses={schoolKlasses}
                students={students}
                onOpen={goStudents}
                onAdd={() => setShowAddClass(true)}
                onBack={goSchools}
                onDelete={delKlass}
                onEdit={(k: any) => setEditingClass(k)}
                onScores={goScores}
              />
            )}
            {view === "students" && school && klass && (
              <StudentsView
                school={school}
                klass={klass}
                students={klassStudents}
                asmts={asmts}
                onOpen={goStudent}
                onAdd={() => setShowAddStudent(true)}
                onBack={() => goClasses(school)}
                onBackSchool={goSchools}
                onDelete={delStudent}
                onEdit={(s: any) => setEditingStudent(s)}
              />
            )}
            {view === "student" && school && klass && student && (
              <StudentDetailView
                school={school}
                klass={klass}
                student={student}
                asmts={studentAsmts}
                onUpdateScore={updateScore}
                onBack={() => goStudents(klass)}
                onBackClass={() => goClasses(school)}
                onBackSchool={goSchools}
                onUpdateStudent={editStudent}
              />
            )}
          </div>
        )}
      </main>

      {/* Add Modals */}
      {showAddSchool && <AddSchoolModal onSave={addSchool} onClose={() => setShowAddSchool(false)} />}
      {showAddClass && school && <AddClassModal schoolId={school.id} onSave={addKlass} onClose={() => setShowAddClass(false)} />}
      {showAddStudent && klass && <AddStudentModal classId={klass.id} onSave={addStudent} onClose={() => setShowAddStudent(false)} />}
      {showAddDoc && <AddDocModal schools={schools} klasses={klasses} onSave={addDoc} onClose={() => setShowAddDoc(false)} />}
      {showScoreModal && klass && (
        <ScoreInputModal
          klass={klass}
          students={klassStudents}
          asmts={asmts}
          onSave={updateScore}
          onClose={() => setShowScoreModal(false)}
        />
      )}

      {/* Edit Modals */}
      {editingSchool && <EditSchoolModal school={editingSchool} onSave={editSchool} onClose={() => setEditingSchool(null)} />}
      {editingClass && <EditClassModal klass={editingClass} onSave={editKlass} onClose={() => setEditingClass(null)} />}
      {editingStudent && <EditStudentModal student={editingStudent} onSave={editStudent} onClose={() => setEditingStudent(null)} />}
    </div>
  );
}
