import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { AppState, CourseDay, CourseKey, DayStatus, Page, Theme, UserProfile } from '../types';
import { loadState, saveState, resetState, exportState, importState } from '../lib/storage';

interface LoggedInUser {
  telegramId: string;
  username: string;
}

interface AppContextValue {
  state: AppState;
  page: Page;
  theme: Theme;
  isGuest: boolean;
  loggedInUser: LoggedInUser | null;
  showAuthModal: boolean;
  setPage: (page: Page) => void;
  toggleTheme: () => void;
  setIsGuest: (v: boolean) => void;
  setLoggedInUser: (u: LoggedInUser | null) => void;
  setShowAuthModal: (v: boolean) => void;
  updateDayStatus: (id: number, status: DayStatus, courseKey?: CourseKey) => void;
  updateDayScore: (id: number, score: string, courseKey?: CourseKey) => void;
  updateExamTarget: (date: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateStartDate: (date: string) => void;
  addDay: (afterId: number, courseKey: CourseKey) => void;
  removeDay: (id: number, courseKey: CourseKey) => void;
  handleExport: () => void;
  handleImport: (file: File) => Promise<void>;
  handleReset: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── helpers ──────────────────────────────────────────────────────────────────

function parseDDMMYYYY(s: string): Date | null {
  const parts = s.trim().split('-');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
}

function recomputeDates(days: CourseDay[], startDateStr: string): CourseDay[] {
  const base = parseDDMMYYYY(startDateStr);
  if (!base) return days;
  return days.map((d) => {
    const dt = new Date(base);
    dt.setDate(base.getDate() + (d.day - 1));
    return { ...d, date: formatDate(dt) };
  });
}

function getCourseArray(state: AppState, key: CourseKey): CourseDay[] {
  switch (key) {
    case 'quant': return state.course;
    case 'reasoning': return state.reasoningCourse;
    case 'english': return state.englishCourse;
    case 'gs': return state.gsCourse;
  }
}

function setCourseArray(state: AppState, key: CourseKey, arr: CourseDay[]): AppState {
  switch (key) {
    case 'quant': return { ...state, course: arr };
    case 'reasoning': return { ...state, reasoningCourse: arr };
    case 'english': return { ...state, englishCourse: arr };
    case 'gs': return { ...state, gsCourse: arr };
  }
}

function renumber(arr: CourseDay[]): CourseDay[] {
  return arr.map((d, i) => ({ ...d, id: i + 1, day: i + 1 }));
}

// ─── reducer ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'UPDATE_DAY_STATUS'; id: number; status: DayStatus; courseKey: CourseKey }
  | { type: 'UPDATE_DAY_SCORE'; id: number; score: string; courseKey: CourseKey }
  | { type: 'UPDATE_EXAM_TARGET'; date: string }
  | { type: 'UPDATE_PROFILE'; profile: Partial<UserProfile> }
  | { type: 'UPDATE_START_DATE'; date: string }
  | { type: 'ADD_DAY'; afterId: number; courseKey: CourseKey }
  | { type: 'REMOVE_DAY'; id: number; courseKey: CourseKey };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;

    case 'UPDATE_DAY_STATUS': {
      const today = new Date().toISOString().split('T')[0];
      const arr = getCourseArray(state, action.courseKey).map((d) =>
        d.id === action.id ? { ...d, status: action.status } : d
      );
      let { streak, bestStreak, lastStudyDate } = state;
      if (action.status === 'done') {
        if (lastStudyDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yd = yesterday.toISOString().split('T')[0];
          streak = lastStudyDate === yd ? streak + 1 : 1;
          bestStreak = Math.max(bestStreak, streak);
          lastStudyDate = today;
        }
      }
      return setCourseArray({ ...state, streak, bestStreak, lastStudyDate }, action.courseKey, arr);
    }

    case 'UPDATE_DAY_SCORE': {
      const arr = getCourseArray(state, action.courseKey).map((d) =>
        d.id === action.id ? { ...d, score: action.score } : d
      );
      return setCourseArray(state, action.courseKey, arr);
    }

    case 'ADD_DAY': {
      const arr = getCourseArray(state, action.courseKey);
      const idx = arr.findIndex((d) => d.id === action.afterId);
      if (idx === -1) return state;
      const src = arr[idx];
      const copy: CourseDay = { ...src, id: 0, day: 0, status: 'pending', score: '' };
      const next = renumber([...arr.slice(0, idx + 1), copy, ...arr.slice(idx + 1)]);
      return setCourseArray(state, action.courseKey, next);
    }

    case 'REMOVE_DAY': {
      const arr = renumber(getCourseArray(state, action.courseKey).filter((d) => d.id !== action.id));
      return setCourseArray(state, action.courseKey, arr);
    }

    case 'UPDATE_EXAM_TARGET':
      return { ...state, examTarget: { date: action.date } };

    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.profile } };

    case 'UPDATE_START_DATE': {
      const d = action.date;
      // Recompute dates for all 4 courses based on the new start date
      return {
        ...state,
        startDate: d,
        course: recomputeDates(state.course, d),
        reasoningCourse: recomputeDates(state.reasoningCourse, d),
        englishCourse: recomputeDates(state.englishCourse, d),
        gsCourse: recomputeDates(state.gsCourse, d),
      };
    }

    default:
      return state;
  }
}

// ─── provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, loadState());
  const [page, setPage] = React.useState<Page>('home');
  const [theme, setTheme] = React.useState<Theme>('light');
  const [isGuest, setIsGuest] = React.useState(true);
  const [loggedInUser, setLoggedInUser] = React.useState<LoggedInUser | null>(null);
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  useEffect(() => { saveState(state); }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), []);

  const updateDayStatus = useCallback((id: number, status: DayStatus, courseKey: CourseKey = 'quant') => {
    dispatch({ type: 'UPDATE_DAY_STATUS', id, status, courseKey });
  }, []);

  const updateDayScore = useCallback((id: number, score: string, courseKey: CourseKey = 'quant') => {
    dispatch({ type: 'UPDATE_DAY_SCORE', id, score, courseKey });
  }, []);

  const addDay = useCallback((afterId: number, courseKey: CourseKey) => {
    dispatch({ type: 'ADD_DAY', afterId, courseKey });
  }, []);

  const removeDay = useCallback((id: number, courseKey: CourseKey) => {
    dispatch({ type: 'REMOVE_DAY', id, courseKey });
  }, []);

  const updateExamTarget = useCallback((date: string) => {
    dispatch({ type: 'UPDATE_EXAM_TARGET', date });
  }, []);

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE_PROFILE', profile });
  }, []);

  const updateStartDate = useCallback((date: string) => {
    dispatch({ type: 'UPDATE_START_DATE', date });
  }, []);

  const handleExport = useCallback(() => exportState(state), [state]);

  const handleImport = useCallback(async (file: File) => {
    const newState = await importState(file);
    dispatch({ type: 'SET_STATE', payload: newState });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'SET_STATE', payload: resetState() });
  }, []);

  return (
    <AppContext.Provider value={{
      state, page, theme, isGuest, loggedInUser, showAuthModal,
      setPage, toggleTheme, setIsGuest, setLoggedInUser, setShowAuthModal,
      updateDayStatus, updateDayScore, updateExamTarget, updateProfile, updateStartDate,
      addDay, removeDay, handleExport, handleImport, handleReset,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
