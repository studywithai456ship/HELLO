import { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Download, Upload, RotateCcw, CalendarDays, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/courseData';

export default function SubjectProgress() {
  const { state, handleExport, handleImport, handleReset, updateStartDate } = useApp();
  const [expanded, setExpanded] = useState<string | null>('fundamentals');
  const [showDateInput, setShowDateInput] = useState(false);
  const [dateInput, setDateInput] = useState(state.startDate);
  const [resetConfirm, setResetConfirm] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  function toggle(key: string) {
    setExpanded(expanded === key ? null : key);
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleImport(file);
    e.target.value = '';
  }

  function saveDate() {
    updateStartDate(dateInput);
    setShowDateInput(false);
  }

  function confirmReset() {
    if (resetConfirm) {
      handleReset();
      setResetConfirm(false);
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800 dark:text-white">Subject Progress</h2>

      {/* Subject tabs summary */}
      <div className="flex flex-wrap gap-2">
        {SUBJECTS.map((s) => {
          const days = state.course.filter((d) => d.subject === s.key);
          const done = days.filter((d) => d.status === 'done').length;
          const pct = Math.round((done / s.total) * 100);
          return (
            <button
              key={s.key}
              onClick={() => toggle(s.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                expanded === s.key
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'
              }`}
            >
              <span>{s.label}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${expanded === s.key ? 'bg-blue-500' : 'bg-slate-100 dark:bg-slate-700'}`}>
                {done}/{s.total}
              </span>
              <span className={expanded === s.key ? 'text-blue-200' : 'text-slate-400'}>{pct}%</span>
            </button>
          );
        })}
      </div>

      {/* Accordion */}
      <div className="space-y-2">
        {SUBJECTS.map((s) => {
          const days = state.course.filter((d) => d.subject === s.key);
          const done = days.filter((d) => d.status === 'done').length;
          const pct = Math.round((done / s.total) * 100);
          const isOpen = expanded === s.key;

          return (
            <div key={s.key} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => toggle(s.key)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-slate-800 dark:text-white">{s.label}</span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-4">
                        {done}/{s.total} · {pct}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-slate-400 dark:text-slate-500">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 dark:border-slate-700 divide-y divide-slate-50 dark:divide-slate-700/50">
                  {days.map((day) => (
                    <div
                      key={day.id}
                      className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono w-6 text-right flex-shrink-0">
                          {day.day}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{day.topic}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{day.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        {day.status === 'done' && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle size={14} />
                            Done
                          </span>
                        )}
                        {day.status === 'pending' && (
                          <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                            <Clock size={14} />
                            Pending
                          </span>
                        )}
                        {day.status === 'skipped' && (
                          <span className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                            <XCircle size={14} />
                            Skipped
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Download size={15} />
          Export
        </button>

        <button
          onClick={() => importRef.current?.click()}
          className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <Upload size={15} />
          Import
        </button>
        <input ref={importRef} type="file" accept=".json" className="hidden" onChange={onImport} />

        <button
          onClick={confirmReset}
          className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${
            resetConfirm
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <RotateCcw size={15} />
          {resetConfirm ? 'Confirm Reset?' : 'Reset'}
        </button>

        <button
          onClick={() => setShowDateInput(!showDateInput)}
          className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <CalendarDays size={15} />
          Set Start Date
        </button>
      </div>

      {showDateInput && (
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <input
            type="text"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            placeholder="DD-MM-YYYY"
            className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={saveDate}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
