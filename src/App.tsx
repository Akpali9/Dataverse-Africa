// ── ADD SCHOOL MODAL ─────────────────────────────────────────────────────────
function AddSchoolModal({ onSave, onClose }: { onSave: (school: any) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", address: "", principal: "", email: "", phone: "", color: "#6366f1" });

  const handleSubmit = async () => {
    await onSave({ ...form, id: uid(), created_at: today() });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Add School</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="School name" />
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} placeholder="Address" />
          <input value={form.principal} onChange={(e) => setForm({ ...form, principal: e.target.value })} className={inputCls} placeholder="Principal name" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="Email" type="email" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="Phone" />
          <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={inputCls} placeholder="Color" type="color" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSubmit} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold hover:opacity-90">Save</button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/70">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── EDIT SCHOOL MODAL ────────────────────────────────────────────────────────
function EditSchoolModal({ school, onSave, onClose }: { school: School; onSave: (school: any) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState(school);

  const handleSubmit = async () => {
    await onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Edit School</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="School name" />
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} placeholder="Address" />
          <input value={form.principal} onChange={(e) => setForm({ ...form, principal: e.target.value })} className={inputCls} placeholder="Principal name" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="Email" type="email" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="Phone" />
          <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={inputCls} placeholder="Color" type="color" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSubmit} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold hover:opacity-90">Save</button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/70">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── ADD CLASS MODAL ──────────────────────────────────────────────────────────
function AddClassModal({ schoolId, onSave, onClose }: { schoolId: string; onSave: (klass: any) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", teacher: "", subject: "", academic_year: CURRENT_YEAR });

  const handleSubmit = async () => {
    await onSave({ ...form, id: uid(), school_id: schoolId, created_at: today() });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Add Class</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Class name (e.g., 5A)" />
          <input value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} className={inputCls} placeholder="Teacher name" />
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputCls} placeholder="Subject" />
          <input value={form.academic_year} onChange={(e) => setForm({ ...form, academic_year: e.target.value })} className={inputCls} placeholder="Academic year" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSubmit} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold hover:opacity-90">Save</button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/70">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── EDIT CLASS MODAL ─────────────────────────────────────────────────────────
function EditClassModal({ klass, onSave, onClose }: { klass: Klass; onSave: (klass: any) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState(klass);

  const handleSubmit = async () => {
    await onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Edit Class</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Class name" />
          <input value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} className={inputCls} placeholder="Teacher name" />
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputCls} placeholder="Subject" />
          <input value={form.academic_year} onChange={(e) => setForm({ ...form, academic_year: e.target.value })} className={inputCls} placeholder="Academic year" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSubmit} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold hover:opacity-90">Save</button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/70">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── ADD STUDENT MODAL ────────────────────────────────────────────────────────
function AddStudentModal({ classId, onSave, onClose }: { classId: string; onSave: (student: any) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", github: "", phone: "", address: "", date_of_birth: "", guardian_name: "", guardian_phone: "" });

  const handleSubmit = async () => {
    await onSave({ ...form, id: uid(), class_id: classId, created_at: today() });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Add Student</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg"><X size={20} /></button>
        </div>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className={inputCls} placeholder="First name" />
            <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className={inputCls} placeholder="Last name" />
          </div>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="Email" type="email" />
          <input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} className={inputCls} placeholder="GitHub URL" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="Phone" />
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} placeholder="Address" />
          <input value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} className={inputCls} placeholder="Date of birth" type="date" />
          <input value={form.guardian_name} onChange={(e) => setForm({ ...form, guardian_name: e.target.value })} className={inputCls} placeholder="Guardian name" />
          <input value={form.guardian_phone} onChange={(e) => setForm({ ...form, guardian_phone: e.target.value })} className={inputCls} placeholder="Guardian phone" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSubmit} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold hover:opacity-90">Save</button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/70">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── EDIT STUDENT MODAL ──────────────────────────────────────────────────────
function EditStudentModal({ student, onSave, onClose }: { student: Student; onSave: (student: any) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState(student);

  const handleSubmit = async () => {
    await onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Edit Student</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg"><X size={20} /></button>
        </div>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className={inputCls} placeholder="First name" />
            <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className={inputCls} placeholder="Last name" />
          </div>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="Email" type="email" />
          <input value={form.github || ""} onChange={(e) => setForm({ ...form, github: e.target.value })} className={inputCls} placeholder="GitHub URL" />
          <input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="Phone" />
          <input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} placeholder="Address" />
          <input value={form.date_of_birth || ""} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} className={inputCls} placeholder="Date of birth" type="date" />
          <input value={form.guardian_name || ""} onChange={(e) => setForm({ ...form, guardian_name: e.target.value })} className={inputCls} placeholder="Guardian name" />
          <input value={form.guardian_phone || ""} onChange={(e) => setForm({ ...form, guardian_phone: e.target.value })} className={inputCls} placeholder="Guardian phone" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSubmit} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold hover:opacity-90">Save</button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/70">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── ADD DOCUMENT MODAL ──────────────────────────────────────────────────────
function AddDocModal({ schools, klasses, onSave, onClose }: { schools: School[]; klasses: Klass[]; onSave: (doc: any) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState({ school_id: "", class_id: "", term: 1 as Term, type: "test1" as AType, title: "", content: "", year: CURRENT_YEAR });

  const handleSubmit = async () => {
    await onSave({ ...form, id: uid(), created_at: today() });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Add Document</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg"><X size={20} /></button>
        </div>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          <select value={form.school_id} onChange={(e) => setForm({ ...form, school_id: e.target.value })} className={inputCls}>
            <option value="">Select school</option>
            {schools.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={form.class_id || ""} onChange={(e) => setForm({ ...form, class_id: e.target.value || null })} className={inputCls}>
            <option value="">General (no class)</option>
            {klasses.filter((k: any) => k.school_id === form.school_id).map((k: any) => <option key={k.id} value={k.id}>{k.name}</option>)}
          </select>
          <select value={form.term} onChange={(e) => setForm({ ...form, term: Number(e.target.value) as Term })} className={inputCls}>
            <option value={1}>First Term</option>
            <option value={2}>Second Term</option>
            <option value={3}>Third Term</option>
          </select>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AType })} className={inputCls}>
            {ATYPES.map(t => <option key={t} value={t}>{AL[t]}</option>)}
          </select>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Document title" />
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={inputCls + " min-h-[100px]"} placeholder="Document content" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSubmit} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold hover:opacity-90">Save</button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/70">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── SCORE INPUT MODAL ───────────────────────────────────────────────────────
function ScoreInputModal({ klass, students, asmts, onSave, onClose }: {
  klass: Klass;
  students: Student[];
  asmts: Asmt[];
  onSave: (id: string, score: number) => Promise<void>;
  onClose: () => void;
}) {
  const [term, setTerm] = useState<Term>(1);
  const [type, setType] = useState<AType>("test1");
  const [scores, setScores] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const maxScore = AMAX[type];

  const handleSubmit = async () => {
    setSaving(true);
    const promises = Object.entries(scores).map(([studentId, scoreStr]) => {
      const score = parseFloat(scoreStr);
      if (!isNaN(score) && score >= 0 && score <= maxScore) {
        const assessment = asmts.find((a: any) => 
          a.student_id === studentId && a.term === term && a.type === type && a.year === klass.academic_year
        );
        if (assessment) return onSave(assessment.id, Math.round(score));
      }
      return Promise.resolve();
    });
    await Promise.all(promises);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Enter Scores</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg"><X size={20} /></button>
        </div>
        <div className="flex gap-4 mb-4">
          <select value={term} onChange={(e) => setTerm(Number(e.target.value) as Term)} className={inputCls + " w-40"}>
            <option value={1}>First Term</option>
            <option value={2}>Second Term</option>
            <option value={3}>Third Term</option>
          </select>
          <select value={type} onChange={(e) => setType(e.target.value as AType)} className={inputCls + " w-48"}>
            {ATYPES.map(t => <option key={t} value={t}>{AL[t]} (Max: {AMAX[t]})</option>)}
          </select>
        </div>
        <div className="max-h-[50vh] overflow-y-auto space-y-2">
          {students.map((student) => {
            const assessment = asmts.find((a: any) => 
              a.student_id === student.id && a.term === term && a.type === type && a.year === klass.academic_year
            );
            return (
              <div key={student.id} className="flex items-center gap-3 p-2 hover:bg-muted/20 rounded-lg">
                <Avatar student={student} size="sm" />
                <span className="flex-1 text-sm font-medium">{student.first_name} {student.last_name}</span>
                <input
                  type="number"
                  min={0}
                  max={maxScore}
                  value={scores[student.id] || (assessment ? String(assessment.score) : "")}
                  onChange={(e) => setScores(prev => ({ ...prev, [student.id]: e.target.value }))}
                  className="w-24 border border-border rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Score"
                />
                <span className="text-xs text-muted-foreground">/ {maxScore}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSubmit} disabled={saving} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Saving..." : "Save All Scores"}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/70">Cancel</button>
        </div>
      </div>
    </div>
  );
}
