
-- StudyFlow users table
CREATE TABLE IF NOT EXISTS sf_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id text UNIQUE NOT NULL,
  username text DEFAULT '',
  password_hash text NOT NULL,
  streak integer DEFAULT 0,
  best_streak integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sf_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sf_users_select" ON sf_users FOR SELECT TO anon USING (true);
CREATE POLICY "sf_users_insert" ON sf_users FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "sf_users_update" ON sf_users FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- User progress table
CREATE TABLE IF NOT EXISTS sf_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id text NOT NULL REFERENCES sf_users(telegram_id) ON DELETE CASCADE,
  course_key text NOT NULL,
  day_number integer NOT NULL,
  status text DEFAULT 'pending',
  score text DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(telegram_id, course_key, day_number)
);

ALTER TABLE sf_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sf_progress_select" ON sf_progress FOR SELECT TO anon USING (true);
CREATE POLICY "sf_progress_insert" ON sf_progress FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "sf_progress_update" ON sf_progress FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- OTP table (temporary codes)
CREATE TABLE IF NOT EXISTS sf_otp (
  telegram_id text PRIMARY KEY,
  code text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '10 minutes')
);

ALTER TABLE sf_otp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sf_otp_select" ON sf_otp FOR SELECT TO anon USING (true);
CREATE POLICY "sf_otp_insert" ON sf_otp FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "sf_otp_update" ON sf_otp FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "sf_otp_delete" ON sf_otp FOR DELETE TO anon USING (true);

-- Leaderboard view
CREATE OR REPLACE VIEW sf_leaderboard AS
SELECT
  u.telegram_id,
  COALESCE(NULLIF(u.username, ''), 'User_' || substring(u.telegram_id, 1, 4)) AS display_name,
  COUNT(CASE WHEN p.status = 'done' THEN 1 END) AS days_done,
  COUNT(CASE WHEN p.status = 'skipped' THEN 1 END) AS days_skipped,
  u.streak,
  u.best_streak,
  u.created_at,
  MAX(p.updated_at) AS last_active
FROM sf_users u
LEFT JOIN sf_progress p ON u.telegram_id = p.telegram_id
GROUP BY u.telegram_id, u.username, u.streak, u.best_streak, u.created_at
ORDER BY days_done DESC, u.streak DESC;

-- Insert 2 sample accounts
INSERT INTO sf_users (telegram_id, username, password_hash) VALUES
  ('123456789', 'Demo_Student1', 'StudyFlow@123'),
  ('987654321', 'Demo_Student2', 'StudyFlow@456')
ON CONFLICT (telegram_id) DO NOTHING;
