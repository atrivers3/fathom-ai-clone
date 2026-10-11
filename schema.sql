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

-- 1. Grant Table Permissions to anon, authenticated, and service_role
GRANT ALL ON TABLE public.meetings TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.participants TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.transcript_segments TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.action_items TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.highlights TO anon, authenticated, service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 2. Explicit Permissive Policies for anon, authenticated, and service_role
CREATE POLICY "meetings_select_policy" ON public.meetings FOR SELECT TO anon, authenticated, service_role USING (true);
CREATE POLICY "meetings_insert_policy" ON public.meetings FOR INSERT TO anon, authenticated, service_role WITH CHECK (true);
CREATE POLICY "meetings_update_policy" ON public.meetings FOR UPDATE TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "meetings_delete_policy" ON public.meetings FOR DELETE TO anon, authenticated, service_role USING (true);

CREATE POLICY "participants_select_policy" ON public.participants FOR SELECT TO anon, authenticated, service_role USING (true);
CREATE POLICY "participants_insert_policy" ON public.participants FOR INSERT TO anon, authenticated, service_role WITH CHECK (true);
CREATE POLICY "participants_update_policy" ON public.participants FOR UPDATE TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "participants_delete_policy" ON public.participants FOR DELETE TO anon, authenticated, service_role USING (true);

CREATE POLICY "transcripts_select_policy" ON public.transcript_segments FOR SELECT TO anon, authenticated, service_role USING (true);
CREATE POLICY "transcripts_insert_policy" ON public.transcript_segments FOR INSERT TO anon, authenticated, service_role WITH CHECK (true);
CREATE POLICY "transcripts_update_policy" ON public.transcript_segments FOR UPDATE TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "transcripts_delete_policy" ON public.transcript_segments FOR DELETE TO anon, authenticated, service_role USING (true);

CREATE POLICY "action_items_select_policy" ON public.action_items FOR SELECT TO anon, authenticated, service_role USING (true);
CREATE POLICY "action_items_insert_policy" ON public.action_items FOR INSERT TO anon, authenticated, service_role WITH CHECK (true);
CREATE POLICY "action_items_update_policy" ON public.action_items FOR UPDATE TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "action_items_delete_policy" ON public.action_items FOR DELETE TO anon, authenticated, service_role USING (true);

CREATE POLICY "highlights_select_policy" ON public.highlights FOR SELECT TO anon, authenticated, service_role USING (true);
CREATE POLICY "highlights_insert_policy" ON public.highlights FOR INSERT TO anon, authenticated, service_role WITH CHECK (true);
CREATE POLICY "highlights_update_policy" ON public.highlights FOR UPDATE TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "highlights_delete_policy" ON public.highlights FOR DELETE TO anon, authenticated, service_role USING (true);
