import { CourseDay, SubjectKey } from '../types';

const START_DATE = '2026-06-22';

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
}

interface RawDay {
  topic: string;
  videos: number;
  files: number;
  subject: SubjectKey;
  attempts1: number;
  attempts2: number;
}

const rawDays: RawDay[] = [
  // Fundamentals (33 days)
  { topic: 'Number System (1-2)', videos: 2, files: 3, subject: 'fundamentals', attempts1: 2, attempts2: 3 },
  { topic: 'Number System (3-4)', videos: 2, files: 3, subject: 'fundamentals', attempts1: 2, attempts2: 3 },
  { topic: 'Number System (5-6)', videos: 2, files: 3, subject: 'fundamentals', attempts1: 2, attempts2: 3 },
  { topic: 'Number System (7-8)', videos: 2, files: 3, subject: 'fundamentals', attempts1: 2, attempts2: 3 },
  { topic: 'Vedic Math (1-3)', videos: 2, files: 5, subject: 'fundamentals', attempts1: 2, attempts2: 5 },
  { topic: 'Revision: NS + Vedic', videos: 0, files: 1, subject: 'fundamentals', attempts1: 0, attempts2: 1 },
  { topic: 'Speed Test - NS & Vedic', videos: 0, files: 1, subject: 'fundamentals', attempts1: 0, attempts2: 1 },
  { topic: 'Simplification (1-2)', videos: 2, files: 3, subject: 'fundamentals', attempts1: 2, attempts2: 3 },
  { topic: 'Simplification (3-4)', videos: 2, files: 3, subject: 'fundamentals', attempts1: 2, attempts2: 3 },
  { topic: 'Simplification (5)', videos: 1, files: 2, subject: 'fundamentals', attempts1: 1, attempts2: 2 },
  { topic: 'Simplification (6)', videos: 1, files: 3, subject: 'fundamentals', attempts1: 1, attempts2: 3 },
  { topic: 'Simplification (7)', videos: 1, files: 3, subject: 'fundamentals', attempts1: 1, attempts2: 3 },
  { topic: 'Revision: Simplification', videos: 0, files: 0, subject: 'fundamentals', attempts1: 0, attempts2: 0 },
  { topic: 'Speed Drill - Simplification', videos: 0, files: 2, subject: 'fundamentals', attempts1: 0, attempts2: 2 },
  { topic: 'Quadratic Eq. (1-2)', videos: 2, files: 4, subject: 'fundamentals', attempts1: 2, attempts2: 4 },
  { topic: 'Quadratic Eq. (3-4)', videos: 2, files: 4, subject: 'fundamentals', attempts1: 2, attempts2: 4 },
  { topic: 'Number Series (1-2)', videos: 2, files: 4, subject: 'fundamentals', attempts1: 2, attempts2: 4 },
  { topic: 'Number Series (3-4)', videos: 2, files: 4, subject: 'fundamentals', attempts1: 2, attempts2: 4 },
  { topic: 'Revision: QE + NS', videos: 0, files: 6, subject: 'fundamentals', attempts1: 0, attempts2: 6 },
  { topic: 'Mixed Test', videos: 0, files: 8, subject: 'fundamentals', attempts1: 0, attempts2: 8 },
  { topic: 'Analysis + Doubt Clearing', videos: 0, files: 8, subject: 'fundamentals', attempts1: 0, attempts2: 8 },
  { topic: 'Percentage (1-2)', videos: 2, files: 3, subject: 'fundamentals', attempts1: 2, attempts2: 3 },
  { topic: 'Percentage (3-4)', videos: 2, files: 3, subject: 'fundamentals', attempts1: 2, attempts2: 3 },
  { topic: 'Percentage (5)', videos: 1, files: 2, subject: 'fundamentals', attempts1: 1, attempts2: 2 },
  { topic: 'Percentage (6-7)', videos: 2, files: 3, subject: 'fundamentals', attempts1: 2, attempts2: 3 },
  { topic: 'Revision: Percentage', videos: 0, files: 0, subject: 'fundamentals', attempts1: 0, attempts2: 0 },
  { topic: 'Chapter Test - Percentage', videos: 0, files: 2, subject: 'fundamentals', attempts1: 0, attempts2: 2 },
  { topic: 'Ratio & Proportion (1-2)', videos: 2, files: 4, subject: 'fundamentals', attempts1: 2, attempts2: 4 },
  { topic: 'Ratio & Proportion (3-4)', videos: 2, files: 4, subject: 'fundamentals', attempts1: 2, attempts2: 4 },
  { topic: 'Average (1-3)', videos: 2, files: 4, subject: 'fundamentals', attempts1: 2, attempts2: 4 },
  { topic: 'Average (4-5)', videos: 2, files: 4, subject: 'fundamentals', attempts1: 2, attempts2: 4 },
  { topic: 'Revision: R&P + Average', videos: 0, files: 0, subject: 'fundamentals', attempts1: 0, attempts2: 0 },
  { topic: 'Mock Test - Arithmetic', videos: 0, files: 0, subject: 'fundamentals', attempts1: 0, attempts2: 0 },

  // Data Interpretation (6 days)
  { topic: 'Prelims DI (1-3)', videos: 3, files: 5, subject: 'data-interpretation', attempts1: 3, attempts2: 5 },
  { topic: 'Prelims DI (4-6)', videos: 2, files: 3, subject: 'data-interpretation', attempts1: 2, attempts2: 3 },
  { topic: 'Prelims DI (7-9)', videos: 3, files: 3, subject: 'data-interpretation', attempts1: 3, attempts2: 3 },
  { topic: 'Prelims DI (10-15)', videos: 4, files: 10, subject: 'data-interpretation', attempts1: 4, attempts2: 10 },
  { topic: 'Caselet DI (1-4)', videos: 3, files: 7, subject: 'data-interpretation', attempts1: 3, attempts2: 7 },
  { topic: 'Caselet DI (5-7)', videos: 3, files: 7, subject: 'data-interpretation', attempts1: 3, attempts2: 7 },

  // Arithmetic (12 days)
  { topic: 'Mixture & Alligation (1-3)', videos: 3, files: 4, subject: 'arithmetic', attempts1: 3, attempts2: 4 },
  { topic: 'Mixture & Alligation (4-5)', videos: 2, files: 4, subject: 'arithmetic', attempts1: 2, attempts2: 4 },
  { topic: 'Ages (1-5)', videos: 2, files: 3, subject: 'arithmetic', attempts1: 2, attempts2: 3 },
  { topic: 'Partnership (1-3)', videos: 3, files: 3, subject: 'arithmetic', attempts1: 3, attempts2: 3 },
  { topic: 'Partnership (4-5)', videos: 2, files: 3, subject: 'arithmetic', attempts1: 2, attempts2: 3 },
  { topic: 'Profit, Loss & Discount (1-3)', videos: 3, files: 5, subject: 'arithmetic', attempts1: 3, attempts2: 5 },
  { topic: 'Profit, Loss & Discount (4-5)', videos: 1, files: 3, subject: 'arithmetic', attempts1: 1, attempts2: 3 },
  { topic: 'SI & CI (1-3)', videos: 3, files: 7, subject: 'arithmetic', attempts1: 3, attempts2: 7 },
  { topic: 'SI & CI (4-6)', videos: 2, files: 4, subject: 'arithmetic', attempts1: 2, attempts2: 4 },
  { topic: 'Time & Work (1-3)', videos: 3, files: 4, subject: 'arithmetic', attempts1: 3, attempts2: 4 },
  { topic: 'Time & Work (4-5)', videos: 2, files: 4, subject: 'arithmetic', attempts1: 2, attempts2: 4 },
  { topic: 'Pipes & Cisterns (1-3)', videos: 3, files: 6, subject: 'arithmetic', attempts1: 3, attempts2: 6 },

  // Speed & Distance (4 days)
  { topic: 'Time, Speed & Dist. (1-3)', videos: 2, files: 3, subject: 'speed-distance', attempts1: 2, attempts2: 3 },
  { topic: 'Time, Speed & Dist. (4-5)', videos: 2, files: 3, subject: 'speed-distance', attempts1: 2, attempts2: 3 },
  { topic: 'Trains (1-5)', videos: 2, files: 3, subject: 'speed-distance', attempts1: 2, attempts2: 3 },
  { topic: 'Boat & Stream (1-3)', videos: 3, files: 3, subject: 'speed-distance', attempts1: 3, attempts2: 3 },

  // Advanced (14 days)
  { topic: 'Mensuration (1-4)', videos: 4, files: 6, subject: 'advanced', attempts1: 4, attempts2: 6 },
  { topic: 'Permutation & Comb. (1-3)', videos: 3, files: 3, subject: 'advanced', attempts1: 3, attempts2: 3 },
  { topic: 'Permutation & Comb. (4-5)', videos: 2, files: 4, subject: 'advanced', attempts1: 2, attempts2: 4 },
  { topic: 'Probability (1)', videos: 1, files: 3, subject: 'advanced', attempts1: 1, attempts2: 3 },
  { topic: 'Revision: Phase 1', videos: 0, files: 1, subject: 'advanced', attempts1: 0, attempts2: 1 },
  { topic: 'Mock Test - Phase 2 (D6)', videos: 0, files: 1, subject: 'advanced', attempts1: 0, attempts2: 1 },
  { topic: 'Mock Test - Full', videos: 0, files: 1, subject: 'advanced', attempts1: 0, attempts2: 1 },
  { topic: 'Revision: Phase 3', videos: 0, files: 0, subject: 'advanced', attempts1: 0, attempts2: 0 },
  { topic: 'Mock Test - Full', videos: 0, files: 0, subject: 'advanced', attempts1: 0, attempts2: 0 },
  { topic: 'Revision: Phase 4', videos: 0, files: 0, subject: 'advanced', attempts1: 0, attempts2: 0 },
  { topic: 'Mock Test - Full', videos: 0, files: 0, subject: 'advanced', attempts1: 0, attempts2: 0 },
  { topic: 'Revision: Phase 5', videos: 0, files: 0, subject: 'advanced', attempts1: 0, attempts2: 0 },
  { topic: 'Grand Mock Test', videos: 0, files: 0, subject: 'advanced', attempts1: 0, attempts2: 0 },
  { topic: 'Final Revision & Analysis', videos: 0, files: 0, subject: 'advanced', attempts1: 0, attempts2: 0 },
];

export const DEFAULT_COURSE: CourseDay[] = rawDays.map((raw, idx) => ({
  id: idx + 1,
  day: idx + 1,
  date: addDays(START_DATE, idx),
  topic: raw.topic,
  videos: raw.videos,
  files: raw.files,
  subject: raw.subject,
  status: idx === 0 ? 'done' : 'pending',
  score: '',
  attempts1: raw.attempts1,
  attempts2: raw.attempts2,
}));

export const SUBJECTS = [
  { key: 'fundamentals' as SubjectKey, label: 'Fundamentals', total: 33 },
  { key: 'data-interpretation' as SubjectKey, label: 'Data Interpretation', total: 6 },
  { key: 'arithmetic' as SubjectKey, label: 'Arithmetic', total: 12 },
  { key: 'speed-distance' as SubjectKey, label: 'Speed & Distance', total: 4 },
  { key: 'advanced' as SubjectKey, label: 'Advanced', total: 14 },
];

export const EXAM_TARGET_DATE = '2026-07-31';
export const START_DATE_DISPLAY = '22-06-2026';
