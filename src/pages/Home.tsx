import { useEffect, useState } from 'react';
import {
  Play, Video, FileText, Clock, Pencil, Flame, Zap, Lightbulb, CheckCircle, Timer, XCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/courseData';

function getCountdown(targetDate: string) {
  const now = new Date();
  const target = new Date(targetDate);
  target.setHours(23, 59, 59, 999);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, mins, secs };
}

function CircularProgress({ percent }: { percent: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const stroke = circ - (percent / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="130" height="130" className="-rotate-90">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" className="dark:stroke-slate-700" />
        <circle
          cx="65"
          cy="65"
          r={r}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={stroke}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-slate-800 dark:text-white">{percent}%</span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">done</span>
      </div>
    </div>
  );
}

export default function Home() {
  const { state, updateDayStatus, updateExamTarget } = useApp();
  const [countdown, setCountdown] = useState(getCountdown(state.examTarget.date));
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState(state.examTarget.date);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(state.examTarget.date));
    }, 1000);
    return () => clearInterval(interval);
  }, [state.examTarget.date]);

  const totalDays = state.course.length;
  const doneDays = state.course.filter((d) => d.status === 'done').length;
  const pendingDays = state.course.filter((d) => d.status === 'pending').length;
  const percent = Math.round((doneDays / totalDays) * 100);

  const totalVideos = state.course.reduce((a, d) => a + d.videos, 0);
  const doneVideos = state.course.filter((d) => d.status === 'done').reduce((a, d) => a + d.videos, 0);
  const totalFiles = state.course.reduce((a, d) => a + d.files, 0);
  const doneFiles = state.course.filter((d) => d.status === 'done').reduce((a, d) => a + d.files, 0);

  const todayMission = state.course.find((d) => d.status === 'pending') || state.course[0];

  // Readiness: weighted by percent done + streak bonus
  const readiness = Math.min(100, Math.round(percent * 0.7 + (state.streak > 0 ? 15 : 0) + (doneDays > 0 ? 11 : 0)));

  const insightTips = [
    'Focus on building momentum — complete at least one task daily.',
    'Consistency beats intensity. Small daily efforts compound greatly.',
    'Review yesterday\'s topic before starting today\'s session.',
    'Track your score to identify weak areas early.',
    'Take mock tests every Sunday to simulate exam conditions.',
  ];
  const tipIdx = doneDays % insightTips.length;

  function saveTarget() {
    updateExamTarget(targetInput);
    setEditingTarget(false);
  }

  const subjectProgress = SUBJECTS.map((s) => {
    const days = state.course.filter((d) => d.subject === s.key);
    const done = days.filter((d) => d.status === 'done').length;
    return { ...s, done };
  });

  return (
    <div className="space-y-4">
      {/* Today's Mission */}
      <div className="bg-slate-900 rounded-2xl p-5 shadow-lg">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
              Today's Mission
            </p>
            <h2 className="text-white text-xl font-bold leading-tight">{todayMission.topic}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {todayMission.videos > 0 && (
                <span className="flex items-center gap-1 text-slate-300 text-xs">
                  <Video size={12} className="text-blue-400" />
                  {todayMission.videos} videos
                </span>
              )}
              {todayMission.files > 0 && (
                <span className="flex items-center gap-1 text-slate-300 text-xs">
                  <FileText size={12} className="text-emerald-400" />
                  {todayMission.files} files
                </span>
              )}
              <span className="flex items-center gap-1 text-slate-300 text-xs">
                <Clock size={12} className="text-amber-400" />
                {(todayMission.videos * 0.75 + todayMission.files * 0.5 + 0.5).toFixed(1)}h
              </span>
            </div>
          </div>
          <span className="bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full">
            Day {todayMission.day}
          </span>
        </div>
        <button
          onClick={() => updateDayStatus(todayMission.id, 'done')}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-md"
        >
          <Play size={15} fill="currentColor" />
          Start Study
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Exam Countdown */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SBI PO</p>
            </div>
            <button
              onClick={() => setEditingTarget(true)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
            >
              <Pencil size={13} />
            </button>
          </div>
          {editingTarget ? (
            <div className="space-y-2">
              <input
                type="date"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                className="w-full text-xs border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={saveTarget}
                className="w-full text-xs bg-blue-600 text-white rounded-lg py-1.5 font-semibold"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1">
              {[
                { val: countdown.days, label: 'DAYS' },
                { val: countdown.hours, label: 'HRS' },
                { val: countdown.mins, label: 'MINS' },
                { val: countdown.secs, label: 'SEC' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-extrabold text-slate-800 dark:text-white leading-none">
                    {String(val).padStart(2, '0')}
                  </p>
                  <p className="text-[9px] text-slate-400 font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Streak */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 mb-1">
            <Flame size={16} className="text-amber-400" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Streak</span>
          </div>
          <p className="text-4xl font-extrabold text-slate-800 dark:text-white">{state.streak}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Best: {state.bestStreak}</p>
        </div>
      </div>

      {/* Progress + Readiness + Insight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Progress Circle */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center">
          <CircularProgress percent={percent} />
          <div className="flex items-center gap-4 mt-3 text-center">
            <div>
              <p className="text-lg font-bold text-emerald-500">{doneDays}</p>
              <p className="text-xs text-slate-400">Done</p>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{totalDays}</p>
              <p className="text-xs text-slate-400">Total</p>
            </div>
            <div>
              <p className="text-lg font-bold text-amber-500">{pendingDays}</p>
              <p className="text-xs text-slate-400">Pending</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Video size={12} className="text-blue-400" />
              {doneVideos}/{totalVideos} Videos
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <FileText size={12} className="text-emerald-400" />
              {doneFiles}/{totalFiles} Files
            </div>
          </div>
        </div>

        {/* Readiness */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={18} className="text-amber-400" />
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Readiness</span>
          </div>
          <p className="text-5xl font-extrabold text-slate-800 dark:text-white mb-1">{readiness}%</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {readiness < 30 ? 'Keep pushing!' : readiness < 60 ? 'Good progress!' : readiness < 80 ? 'Almost there!' : 'Exam ready!'}
          </p>
          <div className="mt-3 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${readiness}%` }}
            />
          </div>

          {/* Mini subject progress */}
          <div className="mt-4 space-y-2">
            {subjectProgress.map((s) => (
              <div key={s.key}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[100px]">{s.label}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{s.done}/{s.total}</span>
                </div>
                <div className="h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(s.done / s.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Insight */}
        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={18} className="text-amber-400" />
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Smart Insight</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {insightTips[tipIdx]}
          </p>

          {/* Quick actions for today's mission */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Quick Actions</p>
            <div className="flex gap-2">
              <button
                onClick={() => updateDayStatus(todayMission.id, 'done')}
                className="flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
              >
                <CheckCircle size={12} />
                Done
              </button>
              <button
                onClick={() => updateDayStatus(todayMission.id, 'pending')}
                className="flex items-center gap-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
              >
                <Timer size={12} />
                Later
              </button>
              <button
                onClick={() => updateDayStatus(todayMission.id, 'skipped')}
                className="flex items-center gap-1 text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 px-3 py-1.5 rounded-lg font-medium hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
              >
                <XCircle size={12} />
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
