import { supabase } from './supabase';

export interface SFUser {
  telegramId: string;
  username: string;
  streak: number;
  bestStreak: number;
}

// ─── Registration ─────────────────────────────────────────────────────────────

export async function checkTelegramExists(telegramId: string): Promise<boolean> {
  const { data } = await supabase
    .from('sf_users')
    .select('telegram_id')
    .eq('telegram_id', telegramId)
    .maybeSingle();
  return !!data;
}

export async function sendOtp(telegramId: string): Promise<{ code: string; error?: string }> {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const { error } = await supabase.from('sf_otp').upsert({
    telegram_id: telegramId,
    code,
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  });
  if (error) return { code: '', error: error.message };
  // In a real app the bot sends the code to Telegram.
  // For demo, we return the code so it can be shown to the user.
  return { code };
}

export async function verifyOtp(telegramId: string, code: string): Promise<{ ok: boolean; error?: string }> {
  const { data } = await supabase
    .from('sf_otp')
    .select('code, expires_at')
    .eq('telegram_id', telegramId)
    .maybeSingle();

  if (!data) return { ok: false, error: 'OTP not found. Please request a new one.' };
  if (new Date(data.expires_at) < new Date()) return { ok: false, error: 'OTP has expired.' };
  if (data.code !== code) return { ok: false, error: 'Incorrect OTP.' };

  await supabase.from('sf_otp').delete().eq('telegram_id', telegramId);
  return { ok: true };
}

export async function registerUser(
  telegramId: string,
  password: string,
  username?: string
): Promise<{ user: SFUser | null; error?: string }> {
  const { error } = await supabase.from('sf_users').insert({
    telegram_id: telegramId,
    username: username || '',
    password_hash: password,
  });
  if (error) {
    if (error.code === '23505') return { user: null, error: 'This Telegram ID is already registered.' };
    return { user: null, error: error.message };
  }
  return { user: { telegramId, username: username || '', streak: 0, bestStreak: 0 } };
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginUser(
  telegramId: string,
  password: string
): Promise<{ user: SFUser | null; error?: string }> {
  const { data, error } = await supabase
    .from('sf_users')
    .select('telegram_id, username, password_hash, streak, best_streak')
    .eq('telegram_id', telegramId)
    .maybeSingle();

  if (error) return { user: null, error: error.message };
  if (!data) return { user: null, error: 'No account found for this Telegram ID.' };
  if (data.password_hash !== password) return { user: null, error: 'Incorrect password.' };

  return {
    user: {
      telegramId: data.telegram_id,
      username: data.username || '',
      streak: data.streak || 0,
      bestStreak: data.best_streak || 0,
    },
  };
}

// ─── Progress sync ────────────────────────────────────────────────────────────

export async function syncProgress(
  telegramId: string,
  courseKey: string,
  dayNumber: number,
  status: string,
  score: string
): Promise<void> {
  await supabase.from('sf_progress').upsert({
    telegram_id: telegramId,
    course_key: courseKey,
    day_number: dayNumber,
    status,
    score,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'telegram_id,course_key,day_number' });
}

export async function updateUserStreak(
  telegramId: string,
  streak: number,
  bestStreak: number
): Promise<void> {
  await supabase
    .from('sf_users')
    .update({ streak, best_streak: bestStreak, updated_at: new Date().toISOString() })
    .eq('telegram_id', telegramId);
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  telegram_id: string;
  display_name: string;
  days_done: number;
  days_skipped: number;
  streak: number;
  best_streak: number;
  last_active: string | null;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('sf_leaderboard')
    .select('*')
    .limit(50);
  if (error) throw error;
  return (data as LeaderboardEntry[]) || [];
}
