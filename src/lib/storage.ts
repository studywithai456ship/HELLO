import { AppState } from '../types';
import { DEFAULT_COURSE, EXAM_TARGET_DATE } from '../data/courseData';
import { DEFAULT_REASONING_COURSE, DEFAULT_ENGLISH_COURSE, DEFAULT_GS_COURSE } from '../data/otherCourses';

const STORAGE_KEY = 'studyflow-state';

const DEFAULT_STATE: AppState = {
  course: DEFAULT_COURSE,
  reasoningCourse: DEFAULT_REASONING_COURSE,
  englishCourse: DEFAULT_ENGLISH_COURSE,
  gsCourse: DEFAULT_GS_COURSE,
  examTarget: { date: EXAM_TARGET_DATE },
  startDate: '22-06-2026',
  streak: 0,
  bestStreak: 0,
  lastStudyDate: '',
  profile: {
    username: '',
    fullName: '',
    age: '',
    telegramUsername: '',
    telegramUserId: '',
  },
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      reasoningCourse: parsed.reasoningCourse ?? DEFAULT_REASONING_COURSE,
      englishCourse: parsed.englishCourse ?? DEFAULT_ENGLISH_COURSE,
      gsCourse: parsed.gsCourse ?? DEFAULT_GS_COURSE,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function resetState(): AppState {
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_STATE;
}

export function exportState(state: AppState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'studyflow-backup.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importState(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string) as AppState;
        resolve({ ...DEFAULT_STATE, ...parsed });
      } catch {
        reject(new Error('Invalid backup file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
