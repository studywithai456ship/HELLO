import { useState } from 'react';
import { X, Send, Eye, EyeOff, CheckCircle, User, Lock, ExternalLink, Copy, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sendOtp, verifyOtp, registerUser, loginUser } from '../lib/auth';

type Tab = 'login' | 'register';
type Step = 1 | 2 | 3;

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, setIsGuest, setLoggedInUser } = useApp();
  const [tab, setTab] = useState<Tab>('register');
  const [step, setStep] = useState<Step>(1);

  // Register
  const [telegramId, setTelegramId] = useState('');
  const [username, setUsername] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Login
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!showAuthModal) return null;

  function close() {
    setShowAuthModal(false);
    setError('');
    setStep(1);
    setGeneratedOtp('');
  }

  function switchTab(t: Tab) {
    setTab(t);
    setError('');
    setStep(1);
    setGeneratedOtp('');
  }

  async function handleSendOtp() {
    const tid = telegramId.trim();
    if (!tid || !/^\d{5,15}$/.test(tid)) {
      setError('Enter a valid numeric Telegram User ID (5-15 digits)');
      return;
    }
    setLoading(true);
    setError('');
    const { code, error: e } = await sendOtp(tid);
    setLoading(false);
    if (e) { setError(e); return; }
    setGeneratedOtp(code);
    setStep(2);
  }

  async function handleVerifyOtp() {
    if (!otpInput.trim() || otpInput.trim().length !== 6) {
      setError('Enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    const { ok, error: e } = await verifyOtp(telegramId.trim(), otpInput.trim());
    setLoading(false);
    if (!ok) { setError(e || 'Invalid OTP'); return; }
    setStep(3);
  }

  async function handleCreateAccount() {
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    const { user, error: e } = await registerUser(telegramId.trim(), password, username.trim() || undefined);
    setLoading(false);
    if (e) { setError(e); return; }
    if (user) {
      setLoggedInUser({ telegramId: user.telegramId, username: user.username });
      setIsGuest(false);
    }
    close();
  }

  async function handleLogin() {
    const tid = loginId.trim();
    if (!tid || !loginPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    const { user, error: e } = await loginUser(tid, loginPassword.trim());
    setLoading(false);
    if (e) { setError(e); return; }
    if (user) {
      setLoggedInUser({ telegramId: user.telegramId, username: user.username });
      setIsGuest(false);
    }
    close();
  }

  function handleGuestMode() {
    setIsGuest(true);
    setLoggedInUser(null);
    close();
  }

  function copyOtp() {
    navigator.clipboard.writeText(generatedOtp).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const stepLabels: { label: string; num: Step }[] = [
    { label: 'TELEGRAM', num: 1 },
    { label: 'OTP', num: 2 },
    { label: 'PASSWORD', num: 3 },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Tabs */}
        <div className="flex items-center p-4 gap-2 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => switchTab('login')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${tab === 'login' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Login
          </button>
          <button
            onClick={() => switchTab('register')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${tab === 'register' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Register
          </button>
          <button onClick={close} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {/* ── REGISTER ── */}
          {tab === 'register' && (
            <>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white text-center mb-5">Create Your Account</h2>

              {/* Step indicators */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {stepLabels.map(({ label, num }, idx) => (
                  <div key={num} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= num ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                        {step > num ? <CheckCircle size={14} /> : num}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 font-medium">{label}</span>
                    </div>
                    {idx < stepLabels.length - 1 && (
                      <div className={`h-px w-8 mx-1 mb-4 ${step > num ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Telegram ID */}
              {step === 1 && (
                <div className="space-y-4">
                  <a
                    href="https://t.me/userinfobot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                  >
                    <ExternalLink size={16} />
                    Find My Telegram ID
                  </a>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-sm text-slate-600 dark:text-slate-400 space-y-1.5">
                    <p><span className="text-blue-500 font-medium">&gt;</span> Open the bot above &amp; press Start</p>
                    <p><span className="text-blue-500 font-medium">&gt;</span> Copy your numeric User ID</p>
                    <p><span className="text-blue-500 font-medium">&gt;</span> Paste below and request OTP</p>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={telegramId}
                    onChange={(e) => setTelegramId(e.target.value.replace(/\D/g, ''))}
                    placeholder="Numeric Telegram User ID"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username (optional)"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  {error && <p className="text-red-500 text-xs bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Send size={15} />
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </div>
              )}

              {/* Step 2: OTP */}
              {step === 2 && (
                <div className="space-y-4">
                  {/* Demo OTP display */}
                  {generatedOtp && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                      <div className="flex items-start gap-2 mb-3">
                        <Info size={15} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          <strong>Demo mode:</strong> In production the OTP is sent via Telegram bot. Your OTP for this session:
                        </p>
                      </div>
                      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg px-4 py-3">
                        <span className="text-2xl font-mono font-bold tracking-widest text-slate-800 dark:text-white">{generatedOtp}</span>
                        <button onClick={copyOtp} className="text-blue-600 dark:text-blue-400 hover:text-blue-800">
                          {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition text-center text-xl tracking-widest font-mono"
                  />
                  {error && <p className="text-red-500 text-xs bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    onClick={() => { setStep(1); setGeneratedOtp(''); setError(''); }}
                    className="w-full text-sm text-slate-500 dark:text-slate-400 hover:underline"
                  >
                    ← Back
                  </button>
                </div>
              )}

              {/* Step 3: Password */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center">Set a secure password for your account</p>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password (min 6 chars)"
                      className="w-full pl-9 pr-10 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full pl-9 pr-10 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-xs bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
                  <button
                    onClick={handleCreateAccount}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── LOGIN ── */}
          {tab === 'login' && (
            <>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white text-center mb-5">Welcome Back</h2>

              {/* Sample credentials hint */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-5 text-xs text-amber-800 dark:text-amber-300">
                <p className="font-semibold mb-1">Sample accounts for testing:</p>
                <p>ID: <span className="font-mono font-bold">123456789</span> · PW: <span className="font-mono font-bold">StudyFlow@123</span></p>
                <p>ID: <span className="font-mono font-bold">987654321</span> · PW: <span className="font-mono font-bold">StudyFlow@456</span></p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value.replace(/\D/g, ''))}
                    placeholder="Telegram User ID"
                    className="w-full pl-9 pr-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showLoginPw ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-9 pr-10 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showLoginPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {error && <p className="text-red-500 text-xs bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </>
          )}

          {/* Footer links */}
          <div className="mt-5 text-center space-y-2">
            {tab === 'register' ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <button onClick={() => switchTab('login')} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Login</button>
              </p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <button onClick={() => switchTab('register')} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Register</button>
              </p>
            )}
            <button onClick={handleGuestMode} className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold">
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
