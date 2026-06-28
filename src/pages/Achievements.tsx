import { Sun, Flame, Zap, Calculator, BarChart2, FileText, Video, Trophy, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  condition: (doneDays: number, streak: number, bestStreak: number, videos: number, files: number) => boolean;
}

const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your first study day',
    icon: Sun,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-emerald-400',
    condition: (done) => done >= 1,
  },
  {
    id: '7-day-streak',
    title: '7-Day Streak',
    description: 'Study for 7 consecutive days',
    icon: Flame,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-400',
    condition: (_, streak) => streak >= 7,
  },
  {
    id: '30-day-streak',
    title: '30-Day Streak',
    description: 'Study for 30 consecutive days',
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-400',
    condition: (_, streak) => streak >= 30,
  },
  {
    id: 'arithmetic-master',
    title: 'Arithmetic Master',
    description: 'Complete all Arithmetic topics',
    icon: Calculator,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-400',
    condition: () => false,
  },
  {
    id: 'di-master',
    title: 'DI Master',
    description: 'Complete all Data Interpretation topics',
    icon: BarChart2,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-400',
    condition: () => false,
  },
  {
    id: 'file-collector',
    title: 'File Collector',
    description: 'Access 50 study files',
    icon: FileText,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderColor: 'border-emerald-400',
    condition: (_, _s, _b, _v, files) => files >= 50,
  },
  {
    id: 'video-learner',
    title: 'Video Learner',
    description: 'Watch 30 study videos',
    icon: Video,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20',
    borderColor: 'border-rose-400',
    condition: (_, _s, _b, videos) => videos >= 30,
  },
  {
    id: 'mock-warrior',
    title: 'Mock Warrior',
    description: 'Complete 5 mock tests',
    icon: Trophy,
    color: 'text-slate-500',
    bgColor: 'bg-slate-50 dark:bg-slate-800',
    borderColor: 'border-slate-400',
    condition: () => false,
  },
];

function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
}

export default function Achievements() {
  const { state } = useApp();

  const doneDays = state.course.filter((d) => d.status === 'done').length;
  const doneVideos = state.course.filter((d) => d.status === 'done').reduce((a, d) => a + d.videos, 0);
  const doneFiles = state.course.filter((d) => d.status === 'done').reduce((a, d) => a + d.files, 0);
  const today = formatDate(new Date());

  const unlocked = ACHIEVEMENTS.filter((a) =>
    a.condition(doneDays, state.streak, state.bestStreak, doneVideos, doneFiles)
  );
  const locked = ACHIEVEMENTS.filter((a) =>
    !a.condition(doneDays, state.streak, state.bestStreak, doneVideos, doneFiles)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Achievements</h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">{unlocked.length}/{ACHIEVEMENTS.length} unlocked</span>
      </div>

      {unlocked.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Unlocked</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {unlocked.map((a) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.id}
                  className={`${a.bgColor} border-2 ${a.borderColor} rounded-2xl p-4 flex flex-col items-center text-center shadow-sm`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${a.bgColor}`}>
                    <Icon size={24} className={a.color} />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{a.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{a.description}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-2">{today}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Locked</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {locked.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.id}
                className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center text-center opacity-60"
              >
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-3 relative">
                  <Icon size={24} className="text-slate-400 dark:text-slate-500" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                    <Lock size={10} className="text-slate-500 dark:text-slate-400" />
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-tight">{a.title}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-snug">{a.description}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-2">Locked</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
