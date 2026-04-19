export interface Module {
  code: string;
  name: string;
  grade: number;        // 0–100
  letter: string;       // e.g. "A", "B+"
  credits: number;
  progress: number;     // 0–100 completion %
  color: string;        // accent colour
}

export type Urgency = 'urgent' | 'this week' | 'on track';

export interface Assignment {
  name: string;
  moduleCode: string;
  due: string;          // human-readable, e.g. "Apr 18"
  urgency: Urgency;
}

export const urgencyColor: Record<Urgency, string> = {
  'urgent':    '#dc2626',
  'this week': '#d97706',
  'on track':  '#16a34a',
};

export const modules: Module[] = [
  { code: 'CS2101', name: 'Data Structures & Algorithms', grade: 72, letter: 'B+', credits: 5, progress: 70, color: '#1a1a18' },
  { code: 'CS2202', name: 'Software Engineering',          grade: 81, letter: 'A−', credits: 5, progress: 55, color: '#2563eb' },
  { code: 'CS2303', name: 'Database Systems',              grade: 64, letter: 'B',  credits: 5, progress: 60, color: '#d97706' },
  { code: 'CS2104', name: 'Web Development',               grade: 88, letter: 'A',  credits: 5, progress: 75, color: '#16a34a' },
  { code: 'MA2205', name: 'Mathematics for Computing',     grade: 58, letter: 'C+', credits: 5, progress: 50, color: '#dc2626' },
  { code: 'CS2406', name: 'Operating Systems',             grade: 74, letter: 'B+', credits: 5, progress: 45, color: '#7c3aed' },
];

export const assignments: Assignment[] = [
  { name: 'DSA — Binary Tree Lab Report',      moduleCode: 'CS2101', due: 'Apr 18', urgency: 'urgent'    },
  { name: 'SE — Sprint 2 Code Review',         moduleCode: 'CS2202', due: 'Apr 21', urgency: 'this week' },
  { name: 'DB — ERD Design Task',              moduleCode: 'CS2303', due: 'Apr 25', urgency: 'on track'  },
  { name: 'Web Dev — React Project Milestone', moduleCode: 'CS2104', due: 'Apr 28', urgency: 'on track'  },
];

export const moduleStats = {
  avgGrade:    Math.round(modules.reduce((s, m) => s + m.grade, 0) / modules.length),
  totalCredits: modules.reduce((s, m) => s + m.credits, 0),
  dueSoon:     assignments.filter(a => a.urgency === 'urgent' || a.urgency === 'this week').length,
};
