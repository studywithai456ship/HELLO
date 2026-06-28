import { useState } from 'react';
import { User, Send, Save, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const { state, updateProfile } = useApp();
  const [form, setForm] = useState({ ...state.profile });
  const [saved, setSaved] = useState(false);

  function handleChange(key: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSave() {
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <User size={18} className="text-blue-500" />
        Settings
      </h2>

      {/* Profile Information */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <User size={16} className="text-blue-500" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Profile Information</h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Full Name</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Age</label>
          <input
            type="text"
            inputMode="numeric"
            value={form.age}
            onChange={(e) => handleChange('age', e.target.value)}
            placeholder="Enter your age"
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Telegram Information */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Send size={16} className="text-blue-500" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Telegram Information</h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Telegram Username</label>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-1.5">Linked to your Telegram account</p>
          <input
            type="text"
            value={form.telegramUsername}
            onChange={(e) => handleChange('telegramUsername', e.target.value)}
            placeholder="Not linked"
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Telegram User ID</label>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-1.5">Your unique Telegram identifier</p>
          <input
            type="text"
            inputMode="numeric"
            value={form.telegramUserId}
            onChange={(e) => handleChange('telegramUserId', e.target.value)}
            placeholder="Not linked"
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-sm ${
          saved
            ? 'bg-emerald-500 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {saved ? <CheckCircle size={16} /> : <Save size={16} />}
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  );
}
