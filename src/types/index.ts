export type Page = 'home' | 'achievements' | 'subject-progress' | 'course-plan' | 'leaderboard' | 'settings' | 'about';

export type Theme = 'light' | 'dark';

export type DayStatus = 'done' | 'pending' | 'skipped';

export type CourseKey = 'quant' | 'reasoning' | 'english' | 'gs';

export interface CourseDay {
  id: number;
  day: number;
  date: string;
  topic: string;
  videos: number;
  files: number;
  subject: SubjectKey;
  status: DayStatus;
  score: string;
  attempts1: number;
  attempts2: number;
}

export type SubjectKey = 'fundamentals' | 'data-interpretation' | 'arithmetic' | 'speed-distance' | 'advanced';

export interface Subject {
  key: SubjectKey;
  label: string;
  total: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  date?: string;
}

export interface UserProfile {
  username: string;
  fullName: string;
  age: string;
  telegramUsername: string;
  telegramUserId: string;
}

export interface AppState {
  course: CourseDay[];
  reasoningCourse: CourseDay[];
  englishCourse: CourseDay[];
  gsCourse: CourseDay[];
  examTarget: { date: string };
  startDate: string;
  streak: number;
  bestStreak: number;
  lastStudyDate: string;
  profile: UserProfile;
}

export interface User {
  id: string;
  telegramId: string;
  username?: string;
  isGuest: boolean;
}
