import { useState, useRef, useCallback } from 'react';
import {
  ChevronDown, ChevronRight, CheckCircle, Clock, XCircle,
  Video, FileText, Download, Upload, RotateCcw, CalendarDays,
  PlusCircle, MinusCircle, ChevronDown as DropIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/courseData';
import { COURSE_LABELS } from '../data/otherCourses';
import { CourseDay, CourseKey, DayStatus, SubjectKey } from '../types';

const STATUS_CONFIG: Record<DayStatus, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  done: { icon: CheckCircle, label: 'Done', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  pending: { icon: Clock, label: 'Pending', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  skipped: { icon: XCircle, label: 'Skipped', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20' },
};

const SUBJECT_COLORS: Record<SubjectKey, string> = {
  'fundamentals': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  'data-interpretation': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  'arithmetic': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  'speed-distance': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  'advanced': 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
};

const COURSE_OPTIONS: { key: CourseKey; label: string; color: string }[] = [
  { key: 'quant', label: 'Quant', color: 'bg-blue-600 text-white' },
  { key: 'reasoning', label: 'Reasoning', color: 'bg-purple-600 text-white' },
  { key: 'english', label: 'English', color: 'bg-emerald-600 text-white' },
  { key: 'gs', label: 'General Studies', color: 'bg-amber-600 text-white' },
];

function cycleStatus(current: DayStatus): DayStatus {
  if (current === 'pending') return 'done';
  if (current === 'done') return 'skipped';
  return 'pending';
}

interface ConfirmDialog {
  type: 'add' | 'remove';
  day: CourseDay;
  courseKey: CourseKey;
}

// Tap counter hook: returns handler that calls onDouble/onTriple
function useTapHandler(onDouble: () => void, onTriple: () => void) {
  const state = useRef<{ count: number; timer: ReturnType<typeof setTimeout> | null }>({ count: 0, timer: null });

  return useCallback(() => {
    if (state.current.timer) clearTimeout(state.current.timer);
    state.current.count += 1;

    state.current.timer = setTimeout(() => {
      const n = state.current.count;
      state.current.count = 0;
      state.current.timer = null;
      if (n === 2) onDouble();
      else if (n >= 3) onTriple();
    }, 380);
  }, [onDouble, onTriple]);
}

interface DayRowProps {
  day: CourseDay;
  courseKey: CourseKey;
  onConfirm: (dialog: ConfirmDialog) => void;
}

function DayRow({ day, courseKey, onConfirm }: DayRowProps) {
  const { updateDayStatus, updateDayScore } = useApp();
  const [expanded, setExpanded] = useState(false);

  const handleDouble = useCallback(() => {
    onConfirm({ type: 'add', day, courseKey });
  }, [day, courseKey, onConfirm]);

  const handleTriple = useCallback(() => {
    onConfirm({ type: 'remove', day, courseKey });
  }, [day, courseKey, onConfirm]);

  const tapHandler = useTapHandler(handleDouble, handleTriple);
  const sc = STATUS_CONFIG[day.status];
  const Icon = sc.icon;

  return (
    <>
      <div className="grid grid-cols-[32px_80px_1fr_60px_100px_60px_36px] gap-2 items-center px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
        <span className="text-xs font-mono text-slate-400 dark:text-slate-500 text-right">{day.day}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{day.date}</span>

        {/* Topic — double/triple tap target */}
        <button
          onClick={tapHandler}
          className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate text-left cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          title="Double-tap to add a repeat day · Triple-tap to remove this day"
        >
          {day.topic}
        </button>

        <div className="hidden sm:flex items-center justify-center gap-1 text-xs text-slate-400 dark:text-slate-500">
          <span>{day.attempts1}</span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span>{day.attempts2}</span>
        </div>

        <button
          onClick={() => updateDayStatus(day.id, cycleStatus(day.status), courseKey)}
          className={`flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${sc.color} ${sc.bg}`}
        >
          <Icon size={12} />
          <span className="hidden sm:inline">{sc.label}</span>
        </button>

        <input
          type="text"
          value={day.score}
          onChange={(e) => updateDayScore(day.id, e.target.value, courseKey)}
          placeholder="—"
          className="text-xs text-center border border-slate-200 dark:border-slate-600 bg-transparent text-slate-600 dark:text-slate-300 rounded-lg px-2 py-1 w-full outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-300 dark:placeholder:text-slate-600"
        />

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {expanded && (
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Video size={13} className="text-blue-500" />
              <span>{day.videos} Videos</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <FileText size={13} className="text-emerald-500" />
              <span>{day.files} Files</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Clock size={13} className="text-amber-500" />
              <span>{(day.videos * 0.75 + day.files * 0.5 + 0.5).toFixed(1)}h estimated</span>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              {/* Tap hint */}
              <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 italic">
                <PlusCircle size={10} className="text-blue-400" /> 2-tap topic to add ·
                <MinusCircle size={10} className="text-rose-400" /> 3-tap to remove
              </span>
              {(['done', 'pending', 'skipped'] as DayStatus[]).map((s) => {
                const cfg = STATUS_CONFIG[s];
                const Ic = cfg.icon;
                return (
                  <button
                    key={s}
                    onClick={() => updateDayStatus(day.id, s, courseKey)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                      day.status === s
                        ? `${cfg.color} ${cfg.bg} border-current`
                        : 'text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Ic size={11} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface GroupSectionProps {
  title: string;
  badge?: string;
  badgeColor?: string;
  pct: number;
  days: CourseDay[];
  courseKey: CourseKey;
  onConfirm: (dialog: ConfirmDialog) => void;
  defaultOpen?: boolean;
}

function GroupSection({ title, badge, badgeColor, pct, days, courseKey, onConfirm, defaultOpen }: GroupSectionProps) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {open ? <ChevronDown size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />}
          <span className="text-sm font-bold text-slate-800 dark:text-white">{title}</span>
          {badge && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor || 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 ml-3">
          <div className="hidden sm:block w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-9 text-right">{pct}%</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 dark:border-slate-700">
          <div className="grid grid-cols-[32px_80px_1fr_60px_100px_60px_36px] gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span>#</span><span>Date</span><span>Topic</span>
            <span className="text-center hidden sm:block">% #</span>
            <span className="text-center">Status</span>
            <span className="text-center">Score</span>
            <span></span>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {days.map((day) => (
              <DayRow key={day.id} day={day} courseKey={courseKey} onConfirm={onConfirm} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoursePlan() {
  const { state, addDay, removeDay, handleExport, handleImport, handleReset, updateStartDate } = useApp();
  const [activeCourse, setActiveCourse] = useState<CourseKey>('quant');
  const [confirm, setConfirm] = useState<ConfirmDialog | null>(null);
  const [showDateInput, setShowDateInput] = useState(false);
  const [dateInput, setDateInput] = useState(state.startDate);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [courseDropOpen, setCourseDropOpen] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  const courseData: CourseDay[] =
    activeCourse === 'quant' ? state.course
    : activeCourse === 'reasoning' ? state.reasoningCourse
    : activeCourse === 'english' ? state.englishCourse
    : state.gsCourse;

  function handleConfirm(dialog: ConfirmDialog) {
    setConfirm(dialog);
  }

  function executeConfirm() {
    if (!confirm) return;
    if (confirm.type === 'add') {
      addDay(confirm.day.id, confirm.courseKey);
    } else {
      removeDay(confirm.day.id, confirm.courseKey);
    }
    setConfirm(null);
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleImport(file);
    e.target.value = '';
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

  function saveDate() {
    updateStartDate(dateInput);
    setShowDateInput(false);
  }

  const activeCourseOpt = COURSE_OPTIONS.find((c) => c.key === activeCourse)!;

  // For Quant: render by subject group. For others: render all as one group.
  function renderCourseContent() {
    if (activeCourse === 'quant') {
      return SUBJECTS.map((subject, i) => {
        const days = state.course.filter((d) => d.subject === subject.key);
        const done = days.filter((d) => d.status === 'done').length;
        const pct = Math.round((done / subject.total) * 100);
        return (
          <GroupSection
            key={subject.key}
            title={subject.label}
            badge={`${done}/${subject.total}`}
            badgeColor={SUBJECT_COLORS[subject.key]}
            pct={pct}
            days={days}
            courseKey="quant"
            onConfirm={handleConfirm}
            defaultOpen={i === 0}
          />
        );
      });
    }

    // For non-quant courses: one flat group
    const done = courseData.filter((d) => d.status === 'done').length;
    const pct = courseData.length > 0 ? Math.round((done / courseData.length) * 100) : 0;
    return (
      <GroupSection
        title={COURSE_LABELS[activeCourse]}
        badge={`${done}/${courseData.length}`}
        badgeColor="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
        pct={pct}
        days={courseData}
        courseKey={activeCourse}
        onConfirm={handleConfirm}
        defaultOpen
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header row: title + course dropdown */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <CheckCircle size={18} className="text-blue-500" />
          Course Plan
        </h2>

        {/* Subject/Course dropdown */}
        <div className="relative">
          <button
            onClick={() => setCourseDropOpen(!courseDropOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all ${activeCourseOpt.color}`}
          >
            <span>{activeCourseOpt.label}</span>
            <DropIcon size={14} className={`transition-transform ${courseDropOpen ? 'rotate-180' : ''}`} />
          </button>

          {courseDropOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setCourseDropOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden min-w-[160px]">
                {COURSE_OPTIONS.map((opt) => {
                  const isActive = opt.key === activeCourse;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => { setActiveCourse(opt.key); setCourseDropOpen(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-left transition-colors ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {isActive && <CheckCircle size={14} className="text-blue-500 flex-shrink-0" />}
                      {!isActive && <span className="w-3.5" />}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tap hint banner */}
      <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl px-4 py-2.5 text-xs text-blue-700 dark:text-blue-300">
        <PlusCircle size={14} className="flex-shrink-0" />
        <span><strong>Double-tap</strong> a topic name to add a repeat day after it</span>
        <span className="text-blue-300 dark:text-blue-700">·</span>
        <MinusCircle size={14} className="flex-shrink-0" />
        <span><strong>Triple-tap</strong> to remove that day</span>
      </div>

      {/* Course sections */}
      {renderCourseContent()}

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

      {/* Confirmation Dialog */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-700">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto ${
              confirm.type === 'add'
                ? 'bg-blue-100 dark:bg-blue-900/30'
                : 'bg-rose-100 dark:bg-rose-900/30'
            }`}>
              {confirm.type === 'add'
                ? <PlusCircle size={24} className="text-blue-600 dark:text-blue-400" />
                : <MinusCircle size={24} className="text-rose-600 dark:text-rose-400" />
              }
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white text-center mb-2">
              {confirm.type === 'add' ? 'Add Repeat Day?' : 'Remove This Day?'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-1">
              {confirm.type === 'add'
                ? 'A copy of this topic will be added after it:'
                : 'This day will be permanently removed:'}
            </p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 text-center bg-slate-50 dark:bg-slate-700 rounded-xl px-3 py-2 mb-5">
              Day {confirm.day.day} — {confirm.day.topic}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirm}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${
                  confirm.type === 'add'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {confirm.type === 'add' ? 'Yes, Add' : 'Yes, Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
