import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local if present
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      if (!process.env[key]) process.env[key] = value.trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

async function seed() {
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
    console.error('❌ Supabase credentials not found in environment.');
    console.error('Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.');
    console.error('Alternatively, copy and run seed.sql directly in the Supabase SQL Editor.');
    process.exit(1);
  }

  console.log(`Connecting to Supabase at: ${supabaseUrl}`);
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Read mockMeetings.ts
  const mockPath = path.resolve(process.cwd(), 'src/data/mockMeetings.ts');
  const content = fs.readFileSync(mockPath, 'utf-8');
  const prefix = 'export const INITIAL_MEETINGS: Meeting[] = ';
  const start = content.find(prefix) + prefix.length;
  const end = content.lastIndexOf('];') + 1;
  const meetings = JSON.parse(content.slice(start, end).trim());

  console.log(`Found ${meetings.length} meetings to seed.`);

  for (const m of meetings) {
    console.log(`Seeding meeting: ${m.id} (${m.title})`);

    // 1. Meeting row
    const { error: mErr } = await supabase.from('meetings').upsert({
      id: m.id,
      title: m.title,
      date: m.date,
      created_at: m.createdAt || new Date().toISOString(),
      duration_seconds: m.durationSeconds,
      duration_formatted: m.durationFormatted,
      platform: m.platform,
      category: m.category,
      overview: m.summary.overview,
      key_decisions: m.summary.keyDecisions,
      templates: m.summary.templates,
      media_url: m.mediaUrl || null,
    }, { onConflict: 'id' });

    if (mErr) {
      console.error(`Error inserting meeting ${m.id}:`, mErr.message);
      continue;
    }

    // 2. Participants
    if (m.participants?.length) {
      const pRows = m.participants.map((p) => ({
        id: p.id,
        meeting_id: m.id,
        name: p.name,
        email: p.email || '',
        role: p.role || 'Participant',
        avatar: p.avatar || 'SP',
        color: p.color || '#3B82F6',
      }));
      const { error: pErr } = await supabase.from('participants').upsert(pRows, { onConflict: 'meeting_id,id' });
      if (pErr) console.error(`Error inserting participants for ${m.id}:`, pErr.message);
    }

    // 3. Transcript Segments (in batches)
    if (m.transcript?.length) {
      const tRows = m.transcript.map((t) => ({
        id: t.id,
        meeting_id: m.id,
        speaker_id: t.speakerId,
        speaker_name: t.speakerName,
        start_time: t.startTime,
        end_time: t.endTime,
        formatted_time: t.formattedTime,
        text: t.text,
        highlighted: Boolean(t.highlighted),
        topic: t.topic || null,
      }));

      const batchSize = 50;
      for (let i = 0; i < tRows.length; i += batchSize) {
        const batch = tRows.slice(i, i + batchSize);
        const { error: tErr } = await supabase.from('transcript_segments').upsert(batch, { onConflict: 'meeting_id,id' });
        if (tErr) console.error(`Error inserting transcript batch for ${m.id}:`, tErr.message);
      }
      console.log(`  Seeded ${tRows.length} transcript segments.`);
    }

    // 4. Action items
    if (m.actionItems?.length) {
      const aRows = m.actionItems.map((a) => ({
        id: a.id,
        meeting_id: m.id,
        text: a.text,
        assignee_id: a.assigneeId || '',
        assignee_name: a.assigneeName || '',
        due_date: a.dueDate || '',
        completed: Boolean(a.completed),
        timestamp_seconds: a.timestampSeconds ?? null,
        formatted_time: a.formattedTime ?? null,
      }));
      const { error: aErr } = await supabase.from('action_items').upsert(aRows, { onConflict: 'meeting_id,id' });
      if (aErr) console.error(`Error inserting action items for ${m.id}:`, aErr.message);
    }

    // 5. Highlights
    if (m.highlights?.length) {
      const hRows = m.highlights.map((h) => ({
        id: h.id,
        meeting_id: m.id,
        title: h.title,
        quote: h.quote,
        speaker_name: h.speakerName,
        start_time: h.startTime,
        formatted_time: h.formattedTime,
        category: h.category,
      }));
      const { error: hErr } = await supabase.from('highlights').upsert(hRows, { onConflict: 'meeting_id,id' });
      if (hErr) console.error(`Error inserting highlights for ${m.id}:`, hErr.message);
    }
  }

  console.log('✅ Supabase seeding completed successfully!');
}

seed().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
