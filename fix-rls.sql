-- ============================================================================
-- Fix RLS Policies & Table Grants for Supabase PostgreSQL
-- ============================================================================
-- Run this in the Supabase SQL Editor if you already ran schema.sql.
-- Ensures the 'anon' role (and authenticated) has full SELECT, INSERT, UPDATE,
-- and DELETE permissions on all tables.
-- ============================================================================

-- 1. Grant Table Permissions to anon, authenticated, and service_role
GRANT ALL ON TABLE public.meetings TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.participants TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.transcript_segments TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.action_items TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.highlights TO anon, authenticated, service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 2. Drop any previous conflicting policies
DROP POLICY IF EXISTS "Allow public read access on meetings" ON public.meetings;
DROP POLICY IF EXISTS "Allow public full access on meetings" ON public.meetings;
DROP POLICY IF EXISTS "Allow public read access on participants" ON public.participants;
DROP POLICY IF EXISTS "Allow public full access on participants" ON public.participants;
DROP POLICY IF EXISTS "Allow public read access on transcript_segments" ON public.transcript_segments;
DROP POLICY IF EXISTS "Allow public full access on transcript_segments" ON public.transcript_segments;
DROP POLICY IF EXISTS "Allow public read access on action_items" ON public.action_items;
DROP POLICY IF EXISTS "Allow public full access on action_items" ON public.action_items;
DROP POLICY IF EXISTS "Allow public read access on highlights" ON public.highlights;
DROP POLICY IF EXISTS "Allow public full access on highlights" ON public.highlights;

DROP POLICY IF EXISTS "meetings_select_policy" ON public.meetings;
DROP POLICY IF EXISTS "meetings_insert_policy" ON public.meetings;
DROP POLICY IF EXISTS "meetings_update_policy" ON public.meetings;
DROP POLICY IF EXISTS "meetings_delete_policy" ON public.meetings;

DROP POLICY IF EXISTS "participants_select_policy" ON public.participants;
DROP POLICY IF EXISTS "participants_insert_policy" ON public.participants;
DROP POLICY IF EXISTS "participants_update_policy" ON public.participants;
DROP POLICY IF EXISTS "participants_delete_policy" ON public.participants;

DROP POLICY IF EXISTS "transcripts_select_policy" ON public.transcript_segments;
DROP POLICY IF EXISTS "transcripts_insert_policy" ON public.transcript_segments;
DROP POLICY IF EXISTS "transcripts_update_policy" ON public.transcript_segments;
DROP POLICY IF EXISTS "transcripts_delete_policy" ON public.transcript_segments;

DROP POLICY IF EXISTS "action_items_select_policy" ON public.action_items;
DROP POLICY IF EXISTS "action_items_insert_policy" ON public.action_items;
DROP POLICY IF EXISTS "action_items_update_policy" ON public.action_items;
DROP POLICY IF EXISTS "action_items_delete_policy" ON public.action_items;

DROP POLICY IF EXISTS "highlights_select_policy" ON public.highlights;
DROP POLICY IF EXISTS "highlights_insert_policy" ON public.highlights;
DROP POLICY IF EXISTS "highlights_update_policy" ON public.highlights;
DROP POLICY IF EXISTS "highlights_delete_policy" ON public.highlights;

-- 3. Create explicit, unrestricted permissive policies for anon and authenticated
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
