import { CourseDay } from '../types';

function buildCourse(
  startDate: string,
  entries: { topic: string; videos: number; files: number; attempts1: number; attempts2: number }[]
): CourseDay[] {
  const base = new Date(startDate);
  return entries.map((e, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    return {
      id: i + 1,
      day: i + 1,
      date,
      topic: e.topic,
      videos: e.videos,
      files: e.files,
      subject: 'fundamentals',
      status: 'pending',
      score: '',
      attempts1: e.attempts1,
      attempts2: e.attempts2,
    };
  });
}

// ─── Reasoning (38 days) ───────────────────────────────────────────────────────
const REASONING_START = '2026-06-22';

export const DEFAULT_REASONING_COURSE: CourseDay[] = buildCourse(REASONING_START, [
  { topic: 'Order & Ranking (1-3)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Order & Ranking (4-5)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Direction Sense (1-3)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Direction Sense (4-5)', videos: 1, files: 2, attempts1: 1, attempts2: 2 },
  { topic: 'Blood Relations (1-3)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Blood Relations (4-5)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Revision: OR + DR + BR', videos: 0, files: 1, attempts1: 0, attempts2: 1 },
  { topic: 'Coding-Decoding (1-3)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Coding-Decoding (4-6)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Alpha-Numeric Series (1-3)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Alpha-Numeric Series (4-5)', videos: 1, files: 3, attempts1: 1, attempts2: 3 },
  { topic: 'Inequalities (1-3)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Inequalities (4-5)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Revision: Coding + Series + Ineq.', videos: 0, files: 2, attempts1: 0, attempts2: 2 },
  { topic: 'Syllogism (1-3)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Syllogism (4-6)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Syllogism (7-8)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Revision: Syllogism', videos: 0, files: 1, attempts1: 0, attempts2: 1 },
  { topic: 'Linear Seating Arrangement (1-3)', videos: 3, files: 5, attempts1: 3, attempts2: 5 },
  { topic: 'Linear Seating Arrangement (4-6)', videos: 3, files: 5, attempts1: 3, attempts2: 5 },
  { topic: 'Circular Arrangement (1-3)', videos: 3, files: 5, attempts1: 3, attempts2: 5 },
  { topic: 'Circular Arrangement (4-5)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Floor & Box Puzzle (1-3)', videos: 3, files: 5, attempts1: 3, attempts2: 5 },
  { topic: 'Floor & Box Puzzle (4-6)', videos: 3, files: 5, attempts1: 3, attempts2: 5 },
  { topic: 'Complex Puzzles (1-3)', videos: 3, files: 6, attempts1: 3, attempts2: 6 },
  { topic: 'Complex Puzzles (4-5)', videos: 2, files: 5, attempts1: 2, attempts2: 5 },
  { topic: 'Revision: Puzzles & Arrangements', videos: 0, files: 2, attempts1: 0, attempts2: 2 },
  { topic: 'Input-Output (1-3)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Input-Output (4-5)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Data Sufficiency (1-3)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Critical Reasoning (1-3)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Critical Reasoning (4-5)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Logical Reasoning (1-3)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Logical Reasoning (4-5)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Revision: DS + CR + LR', videos: 0, files: 2, attempts1: 0, attempts2: 2 },
  { topic: 'Full Mock Test (Reasoning)', videos: 0, files: 1, attempts1: 0, attempts2: 1 },
  { topic: 'Revision: Phase 2', videos: 0, files: 1, attempts1: 0, attempts2: 1 },
  { topic: 'Final Mock - Reasoning', videos: 0, files: 0, attempts1: 0, attempts2: 0 },
]);

// ─── English (30 days) ────────────────────────────────────────────────────────
const ENGLISH_START = '2026-06-22';

export const DEFAULT_ENGLISH_COURSE: CourseDay[] = buildCourse(ENGLISH_START, [
  { topic: 'Reading Comprehension (1-3)', videos: 3, files: 5, attempts1: 3, attempts2: 5 },
  { topic: 'Reading Comprehension (4-6)', videos: 3, files: 5, attempts1: 3, attempts2: 5 },
  { topic: 'Reading Comprehension (7-9)', videos: 3, files: 5, attempts1: 3, attempts2: 5 },
  { topic: 'Reading Comprehension (10-12)', videos: 3, files: 5, attempts1: 3, attempts2: 5 },
  { topic: 'Vocabulary: Fill in the Blanks (1-3)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Vocabulary: Fill in the Blanks (4-6)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Cloze Test (1-3)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Cloze Test (4-6)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Revision: RC + FIB + Cloze', videos: 0, files: 2, attempts1: 0, attempts2: 2 },
  { topic: 'Error Detection (1-3)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Error Detection (4-6)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Sentence Improvement (1-3)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Sentence Improvement (4-5)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Para-jumbles (1-3)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Para-jumbles (4-5)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Revision: Grammar + Para-jumbles', videos: 0, files: 2, attempts1: 0, attempts2: 2 },
  { topic: 'Sentence Connectors (1-3)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Word Rearrangement (1-3)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Column-Based Questions (1-3)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Idioms & Phrases (1-3)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'One Word Substitution (1-3)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Synonyms & Antonyms (1-3)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Revision: Vocabulary Chapter', videos: 0, files: 2, attempts1: 0, attempts2: 2 },
  { topic: 'Sectional Mock 1 (English)', videos: 0, files: 1, attempts1: 0, attempts2: 1 },
  { topic: 'Sectional Mock 2 (English)', videos: 0, files: 1, attempts1: 0, attempts2: 1 },
  { topic: 'Sectional Mock 3 (English)', videos: 0, files: 1, attempts1: 0, attempts2: 1 },
  { topic: 'Revision: Phase 2 English', videos: 0, files: 1, attempts1: 0, attempts2: 1 },
  { topic: 'Full Mock - English', videos: 0, files: 1, attempts1: 0, attempts2: 1 },
  { topic: 'Revision: Phase 3', videos: 0, files: 0, attempts1: 0, attempts2: 0 },
  { topic: 'Final English Mock', videos: 0, files: 0, attempts1: 0, attempts2: 0 },
]);

// ─── General Studies (25 days) ────────────────────────────────────────────────
const GS_START = '2026-06-22';

export const DEFAULT_GS_COURSE: CourseDay[] = buildCourse(GS_START, [
  { topic: 'Banking & Financial Awareness (1-3)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Banking & Financial Awareness (4-6)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'RBI & Monetary Policy', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Indian Economy (1-3)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Indian Economy (4-6)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Budget & Five Year Plans', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Revision: Banking + Economy', videos: 0, files: 2, attempts1: 0, attempts2: 2 },
  { topic: 'Indian Polity (1-3)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Indian Polity (4-6)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Indian History - Ancient & Medieval', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Indian History - Modern', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Geography - Physical & Political', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Revision: Polity + History + Geo', videos: 0, files: 2, attempts1: 0, attempts2: 2 },
  { topic: 'Science & Technology (1-3)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Computer Awareness (1-3)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Computer Awareness (4-5)', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Static GK: National & International', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Static GK: Sports & Awards', videos: 2, files: 3, attempts1: 2, attempts2: 3 },
  { topic: 'Current Affairs - June 2026 (1-3)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Current Affairs - June 2026 (4-6)', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Current Affairs - July 2026', videos: 2, files: 4, attempts1: 2, attempts2: 4 },
  { topic: 'Revision: GS Full Syllabus', videos: 0, files: 2, attempts1: 0, attempts2: 2 },
  { topic: 'GS Mock Test 1', videos: 0, files: 1, attempts1: 0, attempts2: 1 },
  { topic: 'GS Mock Test 2', videos: 0, files: 1, attempts1: 0, attempts2: 1 },
  { topic: 'Final GS Revision', videos: 0, files: 0, attempts1: 0, attempts2: 0 },
]);

export const COURSE_LABELS: Record<string, string> = {
  quant: 'Quant',
  reasoning: 'Reasoning',
  english: 'English',
  gs: 'General Studies',
};
