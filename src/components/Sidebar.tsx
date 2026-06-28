import { X, Home, Trophy, PieChart, BookOpen, BarChart2, Settings, Info, TrendingUp, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Page } from '../types';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS: { icon: React.ElementType; label: string; page: Page }[] = [
  { icon: Home, label: 'Home', page: 'home' },
  { icon: Trophy, label: 'Achievements', page: 'achievements' },
  { icon: PieChart, label: 'Subject Progress', page: 'subject-progress' },
  { icon: BookOpen, label: 'Course Plan', page: 'course-plan' },
  { icon: BarChart2, label: 'Leaderboard', page: 'leaderboard' },
  { icon: Settings, label: 'Settings', page: 'settings' },
  { icon: Info, label: 'About Us', page: 'about' },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { page, setPage, isGuest, loggedInUser } = useApp();

  function navigate(p: Page) {
    setPage(p);
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-slate-900 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-400" />
            <span className="text-white font-bold text-base">Study<span className="text-blue-400">Flow</span></span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate max-w-[150px]">
                {isGuest ? 'Guest User' : (loggedInUser?.username || loggedInUser?.telegramId || 'Account')}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isGuest ? 'Not logged in' : 'Synced with Supabase'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ icon: Icon, label, page: p }) => (
              <li key={p}>
                <button
                  onClick={() => navigate(p)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    page === p
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}
