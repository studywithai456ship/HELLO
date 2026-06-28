import { Menu, Sun, Moon, LogIn, LogOut, TrendingUp, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme, isGuest, loggedInUser, setShowAuthModal, setIsGuest, setLoggedInUser, state } = useApp();

  const daysRemaining = state.course.filter((d) => d.status !== 'done').length;

  function handleAuthClick() {
    if (isGuest) {
      setShowAuthModal(true);
    } else {
      setIsGuest(true);
      setLoggedInUser(null);
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-700 shadow-lg">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-400" />
            <span className="text-white font-bold text-lg tracking-tight">
              Study<span className="text-blue-400">Flow</span>
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {daysRemaining}d
          </span>
          <span className="hidden sm:flex items-center bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            FREE
          </span>

          <button
            onClick={handleAuthClick}
            className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            {isGuest ? (
              <>
                <LogIn size={14} />
                <span className="hidden sm:inline">Guest / Login</span>
                <span className="sm:hidden">Login</span>
              </>
            ) : (
              <>
                <User size={14} className="text-blue-400" />
                <span className="hidden sm:inline max-w-[80px] truncate">
                  {loggedInUser?.username || loggedInUser?.telegramId || 'Account'}
                </span>
                <LogOut size={12} className="text-slate-400 ml-1" />
              </>
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
