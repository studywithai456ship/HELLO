import { useEffect, useState } from 'react';
import { Trophy, Flame, CheckCircle, RefreshCw, AlertCircle, Crown, Medal } from 'lucide-react';
import { getLeaderboard, LeaderboardEntry } from '../lib/auth';
import { useApp } from '../context/AppContext';

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={18} className="text-amber-400" />;
  if (rank === 2) return <Medal size={18} className="text-slate-400" />;
  if (rank === 3) return <Medal size={18} className="text-amber-700" />;
  return <span className="text-sm font-bold text-slate-400 dark:text-slate-500 w-5 text-center">{rank}</span>;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function Leaderboard() {
  const { isGuest, loggedInUser } = useApp();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await getLeaderboard();
      setEntries(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const myEntry = loggedInUser
    ? entries.find((e) => e.telegram_id === loggedInUser.telegramId)
    : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Trophy size={18} className="text-amber-400" />
          Leaderboard
        </h2>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* My rank card */}
      {myEntry && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 shadow-md">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">Your Rank</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-lg">{myEntry.display_name}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-blue-100 text-sm">
                  <CheckCircle size={13} />
                  {myEntry.days_done} days done
                </span>
                <span className="flex items-center gap-1 text-blue-100 text-sm">
                  <Flame size={13} />
                  {myEntry.streak} streak
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-xs">Rank</p>
              <p className="text-white text-3xl font-extrabold">
                #{entries.findIndex((e) => e.telegram_id === loggedInUser?.telegramId) + 1}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Guest notice */}
      {isGuest && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>Login to appear on the leaderboard and track your rank.</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center py-16 gap-3">
          <RefreshCw size={28} className="text-blue-500 animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading rankings...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center py-12 gap-3 text-center">
          <AlertCircle size={32} className="text-rose-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
          <button onClick={load} className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">Try again</button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && entries.length === 0 && (
        <div className="flex flex-col items-center py-16 gap-3 text-center">
          <Trophy size={40} className="text-slate-300 dark:text-slate-600" />
          <p className="text-base font-semibold text-slate-600 dark:text-slate-400">No rankings yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">Be the first to register and appear here!</p>
        </div>
      )}

      {/* Rankings table */}
      {!loading && !error && entries.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[40px_1fr_80px_64px_80px] gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-700/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="text-center">#</span>
            <span>Student</span>
            <span className="text-center">Done</span>
            <span className="text-center">Streak</span>
            <span className="text-center">Active</span>
          </div>

          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {entries.map((entry, idx) => {
              const isMe = loggedInUser?.telegramId === entry.telegram_id;
              const rank = idx + 1;
              return (
                <div
                  key={entry.telegram_id}
                  className={`grid grid-cols-[40px_1fr_80px_64px_80px] gap-2 px-4 py-3 items-center transition-colors ${
                    isMe
                      ? 'bg-blue-50 dark:bg-blue-900/10'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <RankBadge rank={rank} />
                  </div>

                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${isMe ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-white'}`}>
                      {entry.display_name}
                      {isMe && <span className="ml-1 text-[10px] text-blue-500 font-bold">(You)</span>}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      @{entry.telegram_id.slice(0, 6)}···
                    </p>
                  </div>

                  <div className="text-center">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{entry.days_done}</span>
                    <p className="text-[10px] text-slate-400">days</p>
                  </div>

                  <div className="text-center flex flex-col items-center">
                    <span className="flex items-center gap-0.5 text-sm font-bold text-amber-500">
                      <Flame size={12} />
                      {entry.streak}
                    </span>
                    <p className="text-[10px] text-slate-400">streak</p>
                  </div>

                  <div className="text-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{timeAgo(entry.last_active)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-xs text-center text-slate-400 dark:text-slate-500">
        Rankings update in real-time · {entries.length} registered students
      </p>
    </div>
  );
}
