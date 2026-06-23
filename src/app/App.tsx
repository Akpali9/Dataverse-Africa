import { useState, useEffect, useCallback } from "react";
import {
  Building2, BookOpen, Users, ChevronRight, Plus, X,
  FileText, Github, Download, Trash2, GraduationCap,
  ExternalLink, Save, Pencil, Check, BarChart2, ClipboardList,
  User, Mail, Phone, MapPin, Calendar, Award, TrendingUp,
  Edit2, Camera, Upload, RefreshCw, Filter, Search,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type View = "schools" | "classes" | "students" | "student" | "docs" | "profile";
type Term = 1 | 2 | 3;
type AType = "test1" | "test2" | "test3" | "project" | "exam";
type Grade = "A+" | "A" | "B" | "C" | "D" | "F";

interface School {
  id: string; name: string; address: string;
  principal: string; email: string; phone: string; color: string;
}
interface Klass {
  id: string; schoolId: string; name: string; teacher: string; subject: string;
  academicYear: string;
}
interface Student {
  id: string; klassId: string; firstName: string; lastName: string;
  email: string; github: string; avatar?: string;
  phone?: string; address?: string; dateOfBirth?: string;
  guardianName?: string; guardianPhone?: string;
}
interface Asmt {
  id: string; studentId: string; term: Term; type: AType; score: number; max: number;
  year: string;
}
interface Doc {
  id: string; schoolId: string; klassId: string | null;
  term: Term; type: AType; title: string; content: string; createdAt: string;
  year: string;
}

interface TermGrade {
  term: Term;
  grade: Grade;
  percentage: number;
  year: string;
}

// ── Seed data ──────────────────────────────────────────────────────────────────
const CURRENT_YEAR = "2024-2025";
const S0: School[] = [
  { id: "s1", name: "Greenfield Academy", address: "14 Oak Lane, Springfield", principal: "Dr. Amara Osei", email: "info@greenfield.edu", phone: "+1 555-0101", color: "#166534" },
  { id: "s2", name: "Riverside High School", address: "88 River Road, Lakewood", principal: "Mr. James Mensah", email: "admin@riverside.edu", phone: "+1 555-0202", color: "#1e3a5f" },
  { id: "s3", name: "Sunridge STEM School", address: "22 Science Blvd, Techville", principal: "Ms. Nana Boateng", email: "contact@sunridge.edu", phone: "+1 555-0303", color: "#7c2d12" },
];

const K0: Klass[] = [
  { id: "c1", schoolId: "s1", name: "Grade 10A", teacher: "Ms. Efua Asante", subject: "Mathematics", academicYear: CURRENT_YEAR },
  { id: "c2", schoolId: "s1", name: "Grade 10B", teacher: "Mr. Kojo Appiah", subject: "Science", academicYear: CURRENT_YEAR },
  { id: "c3", schoolId: "s1", name: "Grade 11A", teacher: "Mrs. Ama Darko", subject: "English Literature", academicYear: CURRENT_YEAR },
  { id: "c4", schoolId: "s2", name: "Form 3 Alpha", teacher: "Mrs. Abena Darko", subject: "English", academicYear: CURRENT_YEAR },
  { id: "c5", schoolId: "s2", name: "Form 3 Beta", teacher: "Mr. Kwame Asare", subject: "Physics", academicYear: CURRENT_YEAR },
  { id: "c6", schoolId: "s3", name: "Year 11 Engineers", teacher: "Dr. Ama Frimpong", subject: "Computer Science", academicYear: CURRENT_YEAR },
  { id: "c7", schoolId: "s3", name: "Year 11 Sciences", teacher: "Mr. Yaw Boakye", subject: "Chemistry", academicYear: CURRENT_YEAR },
];

const ST0: Student[] = [
  { id: "st1", klassId: "c1", firstName: "Kofi", lastName: "Mensah", email: "kofi.mensah@std.edu", github: "kofi-mensah", phone: "+233 20 123 4567", address: "Accra, Ghana" },
  { id: "st2", klassId: "c1", firstName: "Akua", lastName: "Asante", email: "akua.asante@std.edu", github: "akua-asante", phone: "+233 24 234 5678", address: "Kumasi, Ghana" },
  { id: "st3", klassId: "c1", firstName: "Yaw", lastName: "Darko", email: "yaw.darko@std.edu", github: "yaw-darko" },
  { id: "st4", klassId: "c1", firstName: "Ama", lastName: "Boateng", email: "ama.boateng@std.edu", github: "ama-boateng" },
  { id: "st5", klassId: "c2", firstName: "Kwame", lastName: "Appiah", email: "kwame.appiah@std.edu", github: "kwame-appiah" },
  { id: "st6", klassId: "c2", firstName: "Efua", lastName: "Osei", email: "efua.osei@std.edu", github: "efua-osei" },
  { id: "st7", klassId: "c4", firstName: "James", lastName: "Frimpong", email: "james.f@std.edu", github: "james-frimpong" },
  { id: "st8", klassId: "c4", firstName: "Nana", lastName: "Adu", email: "nana.adu@std.edu", github: "nana-adu" },
  { id: "st9", klassId: "c6", firstName: "Abena", lastName: "Korsah", email: "abena.k@std.edu", github: "abena-korsah" },
  { id: "st10", klassId: "c6", firstName: "Kweku", lastName: "Asare", email: "kweku.asare@std.edu", github: "kweku-asare" },
];

function initAsmts(): Asmt[] {
  const types: AType[] = ["test1", "test2", "test3", "project", "exam"];
  const maxes: Record<AType, number> = { test1: 30, test2: 30, test3: 30, project: 50, exam: 100 };
  const r: Asmt[] = [];
  let n = 1;
  const rng = (m: number) => Math.floor(Math.random() * m * 0.42 + m * 0.54);
  for (const s of ST0)
    for (const term of [1, 2, 3] as Term[])
      for (const t of types)
        r.push({ id: `a${n++}`, studentId: s.id, term, type: t, score: rng(maxes[t]), max: maxes[t], year: CURRENT_YEAR });
  return r;
}
const A0 = initAsmts();

const D0: Doc[] = [
  {
    id: "d1", schoolId: "s1", klassId: "c1", term: 1, type: "exam",
    title: "Grade 10A — First Term Mathematics Exam",
    content: "SECTION A — Multiple Choice (40 marks)\n\n1. Solve for x: 3x + 7 = 22  [4 marks]\n2. Factorize completely: x² − 5x + 6  [4 marks]\n3. Find the area of a circle with radius 7 cm (π = 22/7).  [4 marks]\n4. What is the gradient of the line passing through (2, 3) and (6, 11)?  [4 marks]\n\nSECTION B — Structured Questions (60 marks)\n\n5. A car travels 240 km in 3 hours.\n   a) Calculate the average speed in km/h.  [3 marks]\n   b) How long will it take to travel 400 km at the same speed?  [4 marks]\n\n6. Prove that the sum of interior angles in a triangle equals 180°.  [10 marks]\n\n7. Construct a right-angled triangle with hypotenuse 10 cm and one acute angle of 30°. Measure and state the lengths of the other two sides.  [8 marks]\n\n8. A rectangular field is 120 m long and 85 m wide.\n   a) Calculate the perimeter.  [3 marks]\n   b) Calculate the area in hectares.  [4 marks]",
    createdAt: "2024-11-15", year: CURRENT_YEAR,
  },
  {
    id: "d2", schoolId: "s1", klassId: "c1", term: 1, type: "project",
    title: "Grade 10A — Term 1 Project Brief",
    content: "PROJECT TITLE: Real-World Geometry Application\n\nObjective:\nStudents will identify geometric shapes in their immediate community, apply measurement techniques, and use mathematical formulas to calculate areas and perimeters.\n\nRequirements:\n1. Identify at least 5 real-world examples of different geometric shapes (triangle, rectangle, circle, trapezium, and one other).\n2. Photograph or accurately sketch each shape with labels.\n3. Measure or estimate dimensions using appropriate tools (ruler, tape measure, or estimation techniques).\n4. Calculate the area and perimeter/circumference of each shape, showing all working.\n5. Write a structured report (minimum 4 pages) presenting your findings.\n6. Include a personal reflection section on where geometry appears in your daily life.\n\nSubmission Deadline: End of Week 8, Term 1\nTotal Marks: 50\n\nMARKING RUBRIC:\n• Accuracy of measurements and calculations: 20 marks\n• Quality and clarity of presentation: 15 marks\n• Depth of reflection and insight: 10 marks\n• Neatness, organisation, and referencing: 5 marks",
    createdAt: "2024-09-20", year: CURRENT_YEAR,
  },
  {
    id: "d3", schoolId: "s3", klassId: "c6", term: 2, type: "test1",
    title: "Year 11 Engineers — Term 2 Test 1 (Computer Science)",
    content: "COMPUTER SCIENCE TEST 1\nTime Allowed: 45 minutes | Total Marks: 30\nInstructions: Answer ALL questions. Show all working where applicable.\n\n1. Define the term 'algorithm'. List any two characteristics of a well-designed algorithm.  [4 marks]\n\n2. Write pseudocode to find the largest of three numbers entered by a user.  [6 marks]\n\n3. Trace the following code segment and state all values printed to the screen:\n   for i in range(1, 6):\n       if i % 2 == 0:\n           print(i * i)\n   [5 marks]\n\n4. Distinguish between a compiler and an interpreter. Give one real-world example of each.  [4 marks]\n\n5. Explain Big-O notation. Give one concrete example each of an algorithm with time complexity O(1), O(n), and O(n²).  [6 marks]\n\n6. Draw a labelled flowchart for a login system that allows a user 3 attempts before locking the account.  [5 marks]",
    createdAt: "2025-03-10", year: CURRENT_YEAR,
  },
];

// ── Utils ──────────────────────────────────────────────────────────────────────
let _n = 9000;
const uid = () => String(++_n);
const today = () => new Date().toISOString().slice(0, 10);

const pct = (s: number, m: number) => Math.round((s / m) * 100);

const badgeCls = (s: number, m: number) => {
  const p = pct(s, m);
  return p >= 80
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
    : p >= 60
    ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
    : "bg-red-50 text-red-700 ring-1 ring-red-200";
};
const barCls = (s: number, m: number) => {
  const p = pct(s, m);
  return p >= 80 ? "bg-emerald-500" : p >= 60 ? "bg-amber-500" : "bg-red-500";
};
const gradeStr = (s: number, m: number): Grade => {
  const p = pct(s, m);
  return p >= 90 ? "A+" : p >= 80 ? "A" : p >= 70 ? "B" : p >= 60 ? "C" : p >= 50 ? "D" : "F";
};
const avgPct = (asmts: Asmt[]) =>
  asmts.length ? Math.round(asmts.reduce((sum, a) => sum + pct(a.score, a.max), 0) / asmts.length) : null;

const TL: Record<Term, string> = { 1: "First Term", 2: "Second Term", 3: "Third Term" };
const AL: Record<AType, string> = { test1: "Test 1", test2: "Test 2", test3: "Test 3", project: "Project", exam: "Final Exam" };
const AMAX: Record<AType, number> = { test1: 30, test2: 30, test3: 30, project: 50, exam: 100 };
const ATYPES: AType[] = ["test1", "test2", "test3", "project", "exam"];

const GRADE_COLORS: Record<Grade, string> = {
  "A+": "text-emerald-600 bg-emerald-50",
  "A": "text-emerald-600 bg-emerald-50",
  "B": "text-blue-600 bg-blue-50",
  "C": "text-amber-600 bg-amber-50",
  "D": "text-orange-600 bg-orange-50",
  "F": "text-red-600 bg-red-50",
};

function dlDoc(doc: Doc) {
  const sep = "─".repeat(60);
  const txt = [
    doc.title, "=".repeat(60), "",
    `${AL[doc.type]}  |  ${TL[doc.term]}  |  Created: ${doc.createdAt}`,
    "", sep, "", doc.content, "", sep, "Generated by SchoolTrack — Academic Document System",
  ].join("\n");
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([txt], { type: "text/plain" })),
    download: `${doc.title.replace(/\W+/g, "_")}.txt`,
  });
  a.click();
}

// ── Input helpers ─────────────────────────────────────────────────────────────
const inputCls =
  "w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";
const labelCls = "text-xs font-semibold text-muted-foreground mb-1 block uppercase tracking-wide";

// ── Avatar Component ──────────────────────────────────────────────────────────
function Avatar({ student, size = "md", editable = false, onUpload }: { 
  student: Student; 
  size?: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
  onUpload?: (file: File) => void;
}) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-12 h-12 text-sm", lg: "w-16 h-16 text-lg", xl: "w-24 h-24 text-2xl" };
  const [isHovering, setIsHovering] = useState(false);

  const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 overflow-hidden bg-gradient-to-br from-primary/80 to-primary`}>
        {student.avatar ? (
          <img src={student.avatar} alt={initials} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {editable && (
        <label 
          className={`absolute inset-0 rounded-full cursor-pointer flex items-center justify-center bg-black/50 transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}
        >
          <Camera size={size === "sm" ? 12 : size === "md" ? 16 : 20} className="text-white" />
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
}

// ── Modal: Add School ──────────────────────────────────────────────────────────
function AddSchoolModal({ onSave, onClose }: { onSave: (s: School) => void; onClose: () => void }) {
  const [f, setF] = useState({ name: "", address: "", principal: "", email: "", phone: "", color: "#1e3a5f" });
  const COLORS = ["#1e3a5f", "#166534", "#7c2d12", "#5b21b6", "#0e7490", "#92400e", "#b45309", "#065f46"];
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold text-base">Add New School</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className={labelCls}>School Name *</label>
            <input value={f.name} onChange={set("name")} placeholder="e.g. Greenfield Academy" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Address</label>
            <input value={f.address} onChange={set("address")} placeholder="14 Oak Lane, Springfield" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Principal</label>
              <input value={f.principal} onChange={set("principal")} placeholder="Dr. Name" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input value={f.phone} onChange={set("phone")} placeholder="+1 555-0000" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input value={f.email} onChange={set("email")} type="email" placeholder="info@school.edu" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>School Colour</label>
            <div className="flex gap-2.5 flex-wrap mt-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setF((p) => ({ ...p, color: c }))}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                  style={{ background: c, boxShadow: f.color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : undefined }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-sm hover:bg-muted transition-colors">
            Cancel
          </button>
          <button
            onClick={() => {
              if (!f.name.trim()) return;
              onSave({ id: uid(), ...f });
              onClose();
            }}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Save School
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal: Add Class ───────────────────────────────────────────────────────────
function AddClassModal({ schoolId, onSave, onClose }: { schoolId: string; onSave: (k: Klass) => void; onClose: () => void }) {
  const [f, setF] = useState({ name: "", teacher: "", subject: "", academicYear: CURRENT_YEAR });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));
  
  const years = ["2023-2024", "2024-2025", "2025-2026"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold text-base">Add New Class</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className={labelCls}>Class Name *</label>
            <input value={f.name} onChange={set("name")} placeholder="e.g. Grade 10A" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Subject</label>
            <input value={f.subject} onChange={set("subject")} placeholder="e.g. Mathematics" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Class Teacher</label>
            <input value={f.teacher} onChange={set("teacher")} placeholder="Ms. Name" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Academic Year</label>
            <select value={f.academicYear} onChange={set("academicYear")} className={inputCls}>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-sm hover:bg-muted transition-colors">Cancel</button>
          <button
            onClick={() => { if (!f.name.trim()) return; onSave({ id: uid(), schoolId, ...f }); onClose(); }}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Save Class
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal: Add Student ─────────────────────────────────────────────────────────
function AddStudentModal({ klassId, onSave, onClose }: { klassId: string; onSave: (s: Student) => void; onClose: () => void }) {
  const [f, setF] = useState({ firstName: "", lastName: "", email: "", github: "", phone: "", address: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold text-base">Add New Student</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>First Name *</label>
              <input value={f.firstName} onChange={set("firstName")} placeholder="Kofi" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Last Name *</label>
              <input value={f.lastName} onChange={set("lastName")} placeholder="Mensah" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input value={f.email} onChange={set("email")} type="email" placeholder="student@school.edu" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>GitHub Username</label>
            <input value={f.github} onChange={set("github")} placeholder="github-username" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input value={f.phone} onChange={set("phone")} placeholder="+233 20 123 4567" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Address</label>
            <input value={f.address} onChange={set("address")} placeholder="City, Country" className={inputCls} />
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-sm hover:bg-muted transition-colors">Cancel</button>
          <button
            onClick={() => { if (!f.firstName.trim()) return; onSave({ id: uid(), klassId, ...f }); onClose(); }}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Add Student
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal: Edit Student Profile ──────────────────────────────────────────────
function EditProfileModal({ student, onSave, onClose }: { 
  student: Student; 
  onSave: (updated: Student) => void; 
  onClose: () => void;
}) {
  const [f, setF] = useState(student);
  const set = (k: keyof Student) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white z-10">
          <h2 className="font-bold text-base">Edit Profile</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex justify-center mb-4">
            <Avatar student={f} size="xl" editable={false} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>First Name *</label>
              <input value={f.firstName} onChange={set("firstName")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Last Name *</label>
              <input value={f.lastName} onChange={set("lastName")} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input value={f.email} onChange={set("email")} type="email" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>GitHub Username</label>
            <input value={f.github} onChange={set("github")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input value={f.phone || ""} onChange={set("phone")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Address</label>
            <input value={f.address || ""} onChange={set("address")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Date of Birth</label>
            <input value={f.dateOfBirth || ""} onChange={set("dateOfBirth")} type="date" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Guardian Name</label>
            <input value={f.guardianName || ""} onChange={set("guardianName")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Guardian Phone</label>
            <input value={f.guardianPhone || ""} onChange={set("guardianPhone")} className={inputCls} />
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-5 sticky bottom-0 bg-white pt-4 border-t border-border">
          <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-sm hover:bg-muted transition-colors">Cancel</button>
          <button
            onClick={() => { onSave(f); onClose(); }}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal: Add Document ────────────────────────────────────────────────────────
function AddDocModal({
  schools, klasses, onSave, onClose,
}: {
  schools: School[]; klasses: Klass[]; onSave: (d: Doc) => void; onClose: () => void;
}) {
  const [f, setF] = useState({ schoolId: "", klassId: "", term: "1", type: "exam" as AType, title: "", content: "", year: CURRENT_YEAR });
  const filteredK = klasses.filter((k) => k.schoolId === f.schoolId);
  const years = ["2023-2024", "2024-2025", "2025-2026"];

  const setS = (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <h2 className="font-bold text-base">Create Document</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>School *</label>
              <select value={f.schoolId} onChange={setS("schoolId")} className={inputCls + " cursor-pointer"}>
                <option value="">— Select school —</option>
                {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Class</label>
              <select value={f.klassId} onChange={setS("klassId")} disabled={!f.schoolId} className={inputCls + " cursor-pointer disabled:opacity-50"}>
                <option value="">— Select class —</option>
                {filteredK.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Term</label>
              <select value={f.term} onChange={setS("term")} className={inputCls + " cursor-pointer"}>
                <option value="1">First Term</option>
                <option value="2">Second Term</option>
                <option value="3">Third Term</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select value={f.type} onChange={setS("type")} className={inputCls + " cursor-pointer"}>
                {ATYPES.map((t) => <option key={t} value={t}>{AL[t]}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Academic Year</label>
            <select value={f.year} onChange={setS("year")} className={inputCls + " cursor-pointer"}>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Document Title *</label>
            <input value={f.title} onChange={setS("title")} placeholder="e.g. Grade 10A First Term Exam Questions" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Questions / Content</label>
            <textarea
              value={f.content}
              onChange={setS("content")}
              rows={12}
              placeholder={"Write your questions here...\n\n1. Question one [marks]\n2. Question two [marks]"}
              className="w-full border border-border rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground font-mono resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-5 border-t border-border pt-4 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-sm hover:bg-muted transition-colors">Cancel</button>
          <button
            onClick={() => {
              if (!f.title.trim() || !f.schoolId) return;
              onSave({
                id: uid(), schoolId: f.schoolId, klassId: f.klassId || null,
                term: Number(f.term) as Term, type: f.type,
                title: f.title, content: f.content, createdAt: today(),
                year: f.year,
              });
              onClose();
            }}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Create Document
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Schools view ───────────────────────────────────────────────────────────────
function SchoolsView({
  schools, onOpen, onAdd, onDelete,
}: { schools: School[]; onOpen: (s: School) => void; onAdd: () => void; onDelete: (id: string) => void }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Schools</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {schools.length} registered {schools.length === 1 ? "school" : "schools"}
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus size={16} /> Add School
        </button>
      </div>
      {schools.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <Building2 size={44} className="mx-auto mb-4 opacity-20" />
          <p className="font-medium">No schools yet</p>
          <p className="text-sm mt-1">Add your first school to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {schools.map((school) => (
            <div key={school.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-1.5" style={{ background: school.color }} />
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ background: school.color }}
                    >
                      {school.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm leading-tight truncate">{school.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{school.principal}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(school.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">{school.address}</p>
                <div className="text-xs text-muted-foreground space-y-1 font-mono truncate">
                  <div className="truncate">{school.email}</div>
                  <div>{school.phone}</div>
                </div>
                <button
                  onClick={() => onOpen(school)}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-xl transition-colors border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary"
                >
                  View Classes <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Classes view ───────────────────────────────────────────────────────────────
function ClassesView({
  school, klasses, students, onOpen, onAdd, onBack, onDelete,
}: {
  school: School; klasses: Klass[]; students: Student[];
  onOpen: (k: Klass) => void; onAdd: () => void; onBack: () => void; onDelete: (id: string) => void;
}) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 sm:mb-6 overflow-x-auto">
        <button onClick={onBack} className="hover:text-foreground transition-colors whitespace-nowrap">Schools</button>
        <ChevronRight size={14} className="flex-shrink-0" />
        <span className="text-foreground font-semibold truncate">{school.name}</span>
      </nav>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: school.color }}
          >
            {school.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{school.name}</h1>
            <p className="text-sm text-muted-foreground truncate">
              {klasses.length} {klasses.length === 1 ? "class" : "classes"} · {school.principal}
            </p>
          </div>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus size={16} /> Add Class
        </button>
      </div>
      {klasses.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <BookOpen size={44} className="mx-auto mb-4 opacity-20" />
          <p className="font-medium">No classes yet</p>
          <p className="text-sm mt-1">Add the first class to this school.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {klasses.map((k) => {
            const count = students.filter((s) => s.klassId === k.id).length;
            return (
              <div key={k.id} className="bg-card rounded-2xl border border-border p-4 sm:p-5 hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen size={16} className="text-primary" />
                  </div>
                  <button
                    onClick={() => onDelete(k.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <h3 className="font-bold text-sm truncate">{k.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{k.subject}</p>
                <p className="text-xs text-muted-foreground truncate">{k.teacher}</p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">{k.academicYear}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">
                    {count} {count !== 1 ? "students" : "student"}
                  </span>
                  <button
                    onClick={() => onOpen(k)}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    View Students <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Students view ──────────────────────────────────────────────────────────────
function StudentsView({
  school, klass, students, asmts, onOpen, onAdd, onBack, onBackSchool, onDelete,
}: {
  school: School; klass: Klass; students: Student[]; asmts: Asmt[];
  onOpen: (s: Student) => void; onAdd: () => void;
  onBack: () => void; onBackSchool: () => void; onDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  
  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 sm:mb-6 overflow-x-auto">
        <button onClick={onBackSchool} className="hover:text-foreground transition-colors whitespace-nowrap">Schools</button>
        <ChevronRight size={14} className="flex-shrink-0" />
        <button onClick={onBack} className="hover:text-foreground transition-colors whitespace-nowrap truncate max-w-[120px]">{school.name}</button>
        <ChevronRight size={14} className="flex-shrink-0" />
        <span className="text-foreground font-semibold truncate">{klass.name}</span>
      </nav>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{klass.name}</h1>
          <p className="text-sm text-muted-foreground truncate">
            {klass.subject} · {klass.teacher} · {students.length} {students.length === 1 ? "student" : "students"}
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus size={16} /> Add Student
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students..."
          className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <Users size={44} className="mx-auto mb-4 opacity-20" />
          <p className="font-medium">No students found</p>
          <p className="text-sm mt-1">{students.length > 0 ? "Try adjusting your search" : "Add the first student to this class."}</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-3 sm:px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Student</th>
                  <th className="text-left px-3 sm:px-4 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="text-left px-3 sm:px-4 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">GitHub</th>
                  <th className="text-left px-3 sm:px-4 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg</th>
                  <th className="px-3 sm:px-4 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStudents.map((st) => {
                  const stAsmts = asmts.filter((a) => a.studentId === st.id && a.year === klass.academicYear);
                  const avg = avgPct(stAsmts);
                  return (
                    <tr key={st.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-3 sm:px-5 py-3.5">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar student={st} size="sm" />
                          <span className="font-semibold text-sm truncate max-w-[120px] sm:max-w-none">{st.firstName} {st.lastName}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3.5 text-muted-foreground text-xs font-mono hidden sm:table-cell truncate max-w-[150px]">{st.email}</td>
                      <td className="px-3 sm:px-4 py-3.5 hidden lg:table-cell">
                        {st.github && (
                          <a
                            href={`https://github.com/${st.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Github size={12} />
                            <span className="truncate max-w-[100px]">{st.github}</span>
                          </a>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-3.5">
                        {avg !== null && (
                          <span className={`text-xs font-mono font-bold px-2 py-1 rounded-full ${avg >= 80 ? "bg-emerald-50 text-emerald-700" : avg >= 60 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
                            {avg}%
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => onDelete(st.id)}
                            className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                          <button
                            onClick={() => onOpen(st)}
                            className="px-2 sm:px-3.5 py-1.5 text-xs font-semibold text-primary border border-primary/20 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
                          >
                            View Profile
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Student detail view ────────────────────────────────────────────────────────
function StudentDetailView({
  school, klass, student, asmts, onUpdateScore, onBack, onBackClass, onBackSchool,
  onUpdateStudent,
}: {
  school: School; klass: Klass; student: Student; asmts: Asmt[];
  onUpdateScore: (id: string, score: number) => void;
  onBack: () => void; onBackClass: () => void; onBackSchool: () => void;
  onUpdateStudent: (student: Student) => void;
}) {
  const [term, setTerm] = useState<Term>(1);
  const [editId, setEditId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  const termAsmts = asmts.filter((a) => a.term === term && a.year === selectedYear);
  const getAsmt = (t: AType) => termAsmts.find((a) => a.type === t);
  const overall = avgPct(asmts.filter(a => a.year === selectedYear));
  const termAvg = avgPct(termAsmts);

  const yearAsmts = asmts.filter(a => a.year === selectedYear);
  const termGrades: TermGrade[] = [1, 2, 3].map(t => {
    const tAsmts = yearAsmts.filter(a => a.term === t);
    const p = avgPct(tAsmts);
    return {
      term: t as Term,
      grade: p !== null ? gradeStr(p, 100) : "F",
      percentage: p || 0,
      year: selectedYear,
    };
  });

  const years = Array.from(new Set(asmts.map(a => a.year))).sort();

  const commitEdit = (a: Asmt) => {
    const v = parseFloat(editVal);
    if (!isNaN(v) && v >= 0 && v <= a.max) onUpdateScore(a.id, Math.round(v));
    setEditId(null);
  };

  const typeIcons: Record<AType, React.ReactNode> = {
    test1: <ClipboardList size={14} />,
    test2: <ClipboardList size={14} />,
    test3: <ClipboardList size={14} />,
    project: <GraduationCap size={14} />,
    exam: <BarChart2 size={14} />,
  };

  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onUpdateStudent({ ...student, avatar: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 sm:mb-6 flex-wrap">
        <button onClick={onBackSchool} className="hover:text-foreground transition-colors whitespace-nowrap">Schools</button>
        <ChevronRight size={14} className="flex-shrink-0" />
        <button onClick={onBack} className="hover:text-foreground transition-colors whitespace-nowrap truncate max-w-[100px]">{school.name}</button>
        <ChevronRight size={14} className="flex-shrink-0" />
        <button onClick={onBackClass} className="hover:text-foreground transition-colors whitespace-nowrap truncate max-w-[100px]">{klass.name}</button>
        <ChevronRight size={14} className="flex-shrink-0" />
        <span className="text-foreground font-semibold truncate">{student.firstName} {student.lastName}</span>
      </nav>

      {/* Profile header */}
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Avatar student={student} size="lg" editable onUpload={handleAvatarUpload} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight truncate">{student.firstName} {student.lastName}</h1>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                >
                  <Edit2 size={14} className="text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground truncate">{klass.name} · {klass.subject} · {school.name}</p>
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                <span className="text-xs text-muted-foreground font-mono truncate max-w-[150px] sm:max-w-none">{student.email}</span>
                {student.github && (
                  <a
                    href={`https://github.com/${student.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github size={12} />
                    <span className="truncate max-w-[80px]">{student.github}</span>
                    <ExternalLink size={9} />
                  </a>
                )}
              </div>
            </div>
          </div>
          {overall !== null && (
            <div className="text-right flex-shrink-0 w-full sm:w-auto">
              <div className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${overall >= 80 ? "text-emerald-600" : overall >= 60 ? "text-amber-600" : "text-red-600"}`}>
                {overall}%
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Overall Avg</div>
            </div>
          )}
        </div>

        {/* Year Selector */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Academic Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-border rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {years.length > 0 ? years.map(y => (
                <option key={y} value={y}>{y}</option>
              )) : <option value={CURRENT_YEAR}>{CURRENT_YEAR}</option>}
            </select>
          </div>
        </div>
      </div>

      {/* Term tabs */}
      <div className="flex flex-wrap gap-1 mb-6 bg-muted/40 rounded-xl p-1 w-fit border border-border">
        {([1, 2, 3] as Term[]).map((t) => {
          const grade = termGrades.find(tg => tg.term === t);
          return (
            <button
              key={t}
              onClick={() => setTerm(t)}
              className={`px-3 sm:px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${term === t ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {TL[t]}
              {grade && grade.percentage > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded ${GRADE_COLORS[grade.grade]}`}>
                  {grade.grade}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Assessments grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        {ATYPES.map((type) => {
          const a = getAsmt(type);
          if (!a) return null;
          const isEditing = editId === a.id;
          const p = pct(a.score, a.max);
          return (
            <div key={type} className="bg-card rounded-2xl border border-border p-4 group hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {typeIcons[type]}
                  <span className="text-xs font-bold uppercase tracking-wide">{AL[type]}</span>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${p >= 80 ? "bg-emerald-50 text-emerald-700" : p >= 60 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
                  {gradeStr(a.score, a.max)}
                </span>
              </div>
              {isEditing ? (
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="number"
                    min={0}
                    max={a.max}
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") commitEdit(a); if (e.key === "Escape") setEditId(null); }}
                    className="w-20 border border-border rounded-lg px-2.5 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                    autoFocus
                  />
                  <span className="text-xs text-muted-foreground">/ {a.max}</span>
                  <button onClick={() => commitEdit(a)} className="p-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                    <Check size={12} />
                  </button>
                  <button onClick={() => setEditId(null)} className="p-1.5 hover:bg-muted rounded-lg">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-2xl font-bold font-mono tabular-nums leading-none">{a.score}</span>
                  <span className="text-sm text-muted-foreground mb-0.5">/ {a.max}</span>
                  <span className={`ml-auto text-xs font-mono px-2 py-0.5 rounded ${badgeCls(a.score, a.max)}`}>{p}%</span>
                  <button
                    onClick={() => { setEditId(a.id); setEditVal(String(a.score)); }}
                    className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Pencil size={11} />
                  </button>
                </div>
              )}
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barCls(a.score, a.max)}`}
                  style={{ width: `${p}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Term summary row */}
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h3 className="text-sm font-bold">{TL[term]} Summary</h3>
          {termAvg !== null && (
            <span className={`text-sm font-bold font-mono tabular-nums px-3 py-1 rounded-full ${termAvg >= 80 ? "bg-emerald-50 text-emerald-700" : termAvg >= 60 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
              Term Avg: {termAvg}%
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
          {ATYPES.map((type) => {
            const a = getAsmt(type);
            if (!a) return null;
            return (
              <div key={type} className="text-center py-2 sm:py-3 bg-muted/30 rounded-xl">
                <div className="text-sm font-bold font-mono">{gradeStr(a.score, a.max)}</div>
                <div className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{AL[type]}</div>
                <div className="text-xs font-mono text-muted-foreground">{pct(a.score, a.max)}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          student={student}
          onSave={onUpdateStudent}
          onClose={() => setShowEditProfile(false)}
        />
      )}
    </div>
  );
}

// ── Documents view ─────────────────────────────────────────────────────────────
function DocsView({
  docs, schools, klasses, onAdd, onUpdate, onDelete,
}: {
  docs: Doc[]; schools: School[]; klasses: Klass[];
  onAdd: () => void; onUpdate: (id: string, content: string) => void; onDelete: (id: string) => void;
}) {
  const [selected, setSelected] = useState<Doc | null>(null);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [fSchool, setFSchool] = useState("");
  const [fTerm, setFTerm] = useState("");
  const [fType, setFType] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filtered = docs.filter(
    (d) =>
      (!fSchool || d.schoolId === fSchool) &&
      (!fTerm || d.term === Number(fTerm)) &&
      (!fType || d.type === fType)
  );

  const schoolName = (id: string) => schools.find((s) => s.id === id)?.name ?? id;
  const klassName = (id: string | null) => (id ? klasses.find((k) => k.id === id)?.name : null);

  const saveEdit = () => {
    if (selected) {
      onUpdate(selected.id, editContent);
      setSelected({ ...selected, content: editContent });
    }
    setEditing(false);
  };

  const typeBadge = (t: AType) => {
    const map: Record<AType, string> = {
      test1: "bg-blue-50 text-blue-700",
      test2: "bg-blue-50 text-blue-700",
      test3: "bg-blue-50 text-blue-700",
      project: "bg-purple-50 text-purple-700",
      exam: "bg-primary/10 text-primary",
    };
    return map[t];
  };

  // Mobile view
  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base">Documents</h2>
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={13} /> New
            </button>
          </div>
          <div className="space-y-2">
            <select value={fSchool} onChange={(e) => setFSchool(e.target.value)} className="w-full border border-border rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none">
              <option value="">All Schools</option>
              {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <select value={fTerm} onChange={(e) => setFTerm(e.target.value)} className="border border-border rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none">
                <option value="">All Terms</option>
                <option value="1">First Term</option>
                <option value="2">Second Term</option>
                <option value="3">Third Term</option>
              </select>
              <select value={fType} onChange={(e) => setFType(e.target.value)} className="border border-border rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none">
                <option value="">All Types</option>
                {ATYPES.map((t) => <option key={t} value={t}>{AL[t]}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText size={32} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm">No documents found</p>
            </div>
          ) : (
            filtered.map((doc) => (
              <div
                key={doc.id}
                className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{doc.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{schoolName(doc.schoolId)}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{TL[doc.term]}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${typeBadge(doc.type)}`}>{AL[doc.type]}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => { setSelected(doc); setEditing(false); }}
                      className="p-1.5 text-primary hover:bg-primary/10 rounded-lg"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border flex-shrink-0">
                <h3 className="font-bold text-sm truncate">{selected.title}</h3>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-muted rounded-lg">
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {editing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-full min-h-[300px] font-mono text-sm border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none bg-white leading-relaxed"
                  />
                ) : (
                  <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-white rounded-xl p-4 min-h-[300px] border border-border shadow-sm">
                    {selected.content}
                  </pre>
                )}
              </div>
              <div className="flex flex-wrap gap-2 px-4 sm:px-6 py-4 border-t border-border flex-shrink-0">
                {editing ? (
                  <>
                    <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 border border-border px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                      <X size={14} /> Cancel
                    </button>
                    <button onClick={saveEdit} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-semibold hover:opacity-90">
                      <Save size={14} /> Save
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditing(true); setEditContent(selected.content); }} className="flex items-center gap-1.5 border border-border px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => dlDoc(selected)} className="flex items-center gap-1.5 border border-border px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                      <Download size={14} /> Download
                    </button>
                    <button
                      onClick={() => { onDelete(selected.id); setSelected(null); }}
                      className="flex items-center gap-1.5 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop view
  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className="w-72 border-r border-border flex flex-col flex-shrink-0 bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm">Documents</h2>
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={13} /> New
            </button>
          </div>
          <div className="space-y-2">
            <select value={fSchool} onChange={(e) => setFSchool(e.target.value)} className="w-full border border-border rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none">
              <option value="">All Schools</option>
              {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <select value={fTerm} onChange={(e) => setFTerm(e.target.value)} className="border border-border rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none">
                <option value="">All Terms</option>
                <option value="1">First Term</option>
                <option value="2">Second Term</option>
                <option value="3">Third Term</option>
              </select>
              <select value={fType} onChange={(e) => setFType(e.target.value)} className="border border-border rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none">
                <option value="">All Types</option>
                {ATYPES.map((t) => <option key={t} value={t}>{AL[t]}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <FileText size={28} className="mx-auto mb-2 opacity-20" />
              <p className="text-xs">No documents found</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => { setSelected(doc); setEditing(false); }}
                  className={`w-full text-left px-4 py-3.5 hover:bg-muted/30 transition-colors ${selected?.id === doc.id ? "bg-primary/5 border-r-2 border-primary" : ""}`}
                >
                  <div className="flex items-start gap-2.5">
                    <FileText size={13} className="mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight line-clamp-2">{doc.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{schoolName(doc.schoolId)}</p>
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full font-medium">{TL[doc.term]}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${typeBadge(doc.type)}`}>{AL[doc.type]}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
        {selected ? (
          <>
            <div className="px-6 py-4 border-b border-border bg-card flex items-start justify-between gap-4 flex-shrink-0 flex-wrap">
              <div className="min-w-0">
                <h2 className="font-bold text-sm leading-tight">{selected.title}</h2>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs text-muted-foreground">{schoolName(selected.schoolId)}</span>
                  {klassName(selected.klassId) && (
                    <span className="text-xs text-muted-foreground">{klassName(selected.klassId)}</span>
                  )}
                  <span className="text-xs text-muted-foreground">{TL[selected.term]}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge(selected.type)}`}>{AL[selected.type]}</span>
                  <span className="text-xs text-muted-foreground font-mono">{selected.createdAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                {editing ? (
                  <>
                    <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-lg text-xs hover:bg-muted transition-colors">
                      <X size={12} /> Cancel
                    </button>
                    <button onClick={saveEdit} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90">
                      <Save size={12} /> Save
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditing(true); setEditContent(selected.content); }} className="flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-lg text-xs hover:bg-muted transition-colors">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => dlDoc(selected)} className="flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-lg text-xs hover:bg-muted transition-colors">
                      <Download size={12} /> Download
                    </button>
                    <button
                      onClick={() => { onDelete(selected.id); setSelected(null); }}
                      className="flex items-center gap-1.5 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              {editing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-full min-h-[500px] font-mono text-sm border border-border rounded-xl p-5 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none bg-white leading-relaxed"
                />
              ) : (
                <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-white rounded-xl p-6 min-h-[500px] border border-border shadow-sm">
                  {selected.content}
                </pre>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-3">
            <FileText size={44} className="opacity-15" />
            <p className="text-sm font-medium">Select a document to view or edit</p>
            <p className="text-xs opacity-60">Or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<View>("schools");
  const [school, setSchool] = useState<School | null>(null);
  const [klass, setKlass] = useState<Klass | null>(null);
  const [student, setStudent] = useState<Student | null>(null);

  const [schools, setSchools] = useState(S0);
  const [klasses, setKlasses] = useState(K0);
  const [students, setStudents] = useState(ST0);
  const [asmts, setAsmts] = useState(A0);
  const [docs, setDocs] = useState(D0);

  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddDoc, setShowAddDoc] = useState(false);

  // Navigation
  const goSchools = () => { setView("schools"); setSchool(null); setKlass(null); setStudent(null); };
  const goClasses = (s: School) => { setSchool(s); setKlass(null); setStudent(null); setView("classes"); };
  const goStudents = (k: Klass) => { setKlass(k); setStudent(null); setView("students"); };
  const goStudent = (s: Student) => { setStudent(s); setView("student"); };
  const goDocs = () => setView("docs");

  // CRUD
  const addSchool = (s: School) => setSchools((p) => [...p, s]);
  const delSchool = (id: string) => setSchools((p) => p.filter((s) => s.id !== id));

  const addKlass = (k: Klass) => setKlasses((p) => [...p, k]);
  const delKlass = (id: string) => setKlasses((p) => p.filter((k) => k.id !== id));

  const addStudent = (s: Student) => {
    setStudents((p) => [...p, s]);
    const newAsmts: Asmt[] = [];
    const year = klasses.find(k => k.id === s.klassId)?.academicYear || CURRENT_YEAR;
    for (const term of [1, 2, 3] as Term[])
      for (const type of ATYPES)
        newAsmts.push({ id: uid(), studentId: s.id, term, type, score: 0, max: AMAX[type], year });
    setAsmts((p) => [...p, ...newAsmts]);
  };
  const delStudent = (id: string) => {
    setStudents((p) => p.filter((s) => s.id !== id));
    setAsmts((p) => p.filter((a) => a.studentId !== id));
  };
  const updateScore = (id: string, score: number) =>
    setAsmts((p) => p.map((a) => (a.id === id ? { ...a, score } : a)));
  const updateStudent = (updated: Student) => {
    setStudents((p) => p.map((s) => (s.id === updated.id ? updated : s)));
  };

  const addDoc = (d: Doc) => setDocs((p) => [...p, d]);
  const updateDoc = (id: string, content: string) =>
    setDocs((p) => p.map((d) => (d.id === id ? { ...d, content } : d)));
  const delDoc = (id: string) => setDocs((p) => p.filter((d) => d.id !== id));

  const schoolKlasses = klasses.filter((k) => k.schoolId === school?.id);
  const klassStudents = students.filter((s) => s.klassId === klass?.id);
  const studentAsmts = asmts.filter((a) => a.studentId === student?.id);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-primary flex flex-col flex-shrink-0 shadow-xl hidden md:flex">
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
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${view !== "docs" ? "bg-white/15 text-white" : "text-white/55 hover:text-white hover:bg-white/10"}`}
          >
            <Building2 size={15} />
            Schools
          </button>
          <button
            onClick={goDocs}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${view === "docs" ? "bg-white/15 text-white" : "text-white/55 hover:text-white hover:bg-white/10"}`}
          >
            <FileText size={15} />
            Documents
          </button>
        </nav>

        {/* Stats */}
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
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs ${view !== "docs" ? "text-primary" : "text-muted-foreground"}`}
        >
          <Building2 size={20} />
          <span>Schools</span>
        </button>
        <button
          onClick={goDocs}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs ${view === "docs" ? "text-primary" : "text-muted-foreground"}`}
        >
          <FileText size={20} />
          <span>Docs</span>
        </button>
      </nav>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 pb-16 md:pb-0">
        {view === "docs" ? (
          <DocsView
            docs={docs}
            schools={schools}
            klasses={klasses}
            onAdd={() => setShowAddDoc(true)}
            onUpdate={updateDoc}
            onDelete={delDoc}
          />
        ) : (
          <div className="flex-1 overflow-y-auto">
            {view === "schools" && (
              <SchoolsView schools={schools} onOpen={goClasses} onAdd={() => setShowAddSchool(true)} onDelete={delSchool} />
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
                onUpdateStudent={updateStudent}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddSchool && <AddSchoolModal onSave={addSchool} onClose={() => setShowAddSchool(false)} />}
      {showAddClass && school && <AddClassModal schoolId={school.id} onSave={addKlass} onClose={() => setShowAddClass(false)} />}
      {showAddStudent && klass && <AddStudentModal klassId={klass.id} onSave={addStudent} onClose={() => setShowAddStudent(false)} />}
      {showAddDoc && <AddDocModal schools={schools} klasses={klasses} onSave={addDoc} onClose={() => setShowAddDoc(false)} />}
    </div>
  );
}
