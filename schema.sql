-- ============================================================================
-- Fathom AI Clone Database Schema for Supabase PostgreSQL
-- ============================================================================
-- Fully supports meetings, participants, timestamped transcript dialogues,
-- action items, highlights, and multi-template AI summaries.
-- Compatible with Supabase Row Level Security (RLS) and Next.js Route Handlers.
-- ============================================================================

-- 1. Meetings Table
CREATE TABLE IF NOT EXISTS public.meetings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  duration_formatted TEXT NOT NULL DEFAULT '0m',
  platform TEXT NOT NULL DEFAULT 'google-meet',
  category TEXT NOT NULL DEFAULT 'Engineering',
  overview TEXT NOT NULL DEFAULT '',
  key_decisions JSONB NOT NULL DEFAULT '[]'::jsonb,
  templates JSONB NOT NULL DEFAULT '{}'::jsonb,
  media_url TEXT
);

-- 2. Participants Table
CREATE TABLE IF NOT EXISTS public.participants (
  id TEXT NOT NULL,
  meeting_id TEXT NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'Participant',
  avatar TEXT NOT NULL DEFAULT 'SP',
  color TEXT NOT NULL DEFAULT '#3B82F6',
  PRIMARY KEY (meeting_id, id)
);

-- 3. Transcript Segments Table
CREATE TABLE IF NOT EXISTS public.transcript_segments (
  id TEXT NOT NULL,
  meeting_id TEXT NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  speaker_id TEXT NOT NULL,
  speaker_name TEXT NOT NULL,
  start_time DOUBLE PRECISION NOT NULL DEFAULT 0,
  end_time DOUBLE PRECISION NOT NULL DEFAULT 0,
  formatted_time TEXT NOT NULL DEFAULT '00:00',
  text TEXT NOT NULL,
  highlighted BOOLEAN NOT NULL DEFAULT FALSE,
  topic TEXT,
  PRIMARY KEY (meeting_id, id)
);

-- 4. Action Items Table
CREATE TABLE IF NOT EXISTS public.action_items (
  id TEXT NOT NULL,
  meeting_id TEXT NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  assignee_id TEXT NOT NULL DEFAULT '',
  assignee_name TEXT NOT NULL DEFAULT '',
  due_date TEXT NOT NULL DEFAULT '',
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  timestamp_seconds DOUBLE PRECISION DEFAULT 0,
  formatted_time TEXT DEFAULT '00:00',
  PRIMARY KEY (meeting_id, id)
);

-- 5. Highlights Table
CREATE TABLE IF NOT EXISTS public.highlights (
  id TEXT NOT NULL,
  meeting_id TEXT NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  quote TEXT NOT NULL,
  speaker_name TEXT NOT NULL,
  start_time DOUBLE PRECISION NOT NULL DEFAULT 0,
  formatted_time TEXT NOT NULL DEFAULT '00:00',
  category TEXT NOT NULL DEFAULT 'insight',
  PRIMARY KEY (meeting_id, id)
);

-- ============================================================================
-- Performance Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON public.meetings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_participants_meeting_id ON public.participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_transcript_segments_meeting_id ON public.transcript_segments(meeting_id, start_time ASC);
CREATE INDEX IF NOT EXISTS idx_action_items_meeting_id ON public.action_items(meeting_id);
CREATE INDEX IF NOT EXISTS idx_highlights_meeting_id ON public.highlights(meeting_id);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcript_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated and anonymous users
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on meetings') THEN
    CREATE POLICY "Allow public read access on meetings" ON public.meetings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public full access on meetings') THEN
    CREATE POLICY "Allow public full access on meetings" ON public.meetings FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on participants') THEN
    CREATE POLICY "Allow public read access on participants" ON public.participants FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public full access on participants') THEN
    CREATE POLICY "Allow public full access on participants" ON public.participants FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on transcript_segments') THEN
    CREATE POLICY "Allow public read access on transcript_segments" ON public.transcript_segments FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public full access on transcript_segments') THEN
    CREATE POLICY "Allow public full access on transcript_segments" ON public.transcript_segments FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on action_items') THEN
    CREATE POLICY "Allow public read access on action_items" ON public.action_items FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public full access on action_items') THEN
    CREATE POLICY "Allow public full access on action_items" ON public.action_items FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on highlights') THEN
    CREATE POLICY "Allow public read access on highlights" ON public.highlights FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public full access on highlights') THEN
    CREATE POLICY "Allow public full access on highlights" ON public.highlights FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
