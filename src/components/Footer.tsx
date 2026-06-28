import { Database } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { state } = useApp();

  return (
    <footer className="py-3 px-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <Database size={12} />
        <span>Auto-saves · {state.startDate} start</span>
      </div>
    </footer>
  );
}
