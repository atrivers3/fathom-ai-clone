import { NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { toDbMeetingPayload } from '@/lib/dbMapper';
import { INITIAL_MEETINGS } from '@/data/mockMeetings';

export async function POST() {
  try {
    const supabase = getSupabaseClient();

    if (!supabase || !isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error:
            'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local first.',
        },
        { status: 400 }
      );
    }

    let seededMeetingsCount = 0;
    let seededSegmentsCount = 0;
    let seededParticipantsCount = 0;

    for (const meeting of INITIAL_MEETINGS) {
      const {
        meetingRow,
        participantRows,
        transcriptRows,
        actionItemRows,
        highlightRows,
      } = toDbMeetingPayload(meeting);

      // Upsert meeting
      const { error: mError } = await supabase
        .from('meetings')
        .upsert(meetingRow, { onConflict: 'id' });

      if (mError) {
        console.error(`Error seeding meeting ${meeting.id}:`, mError);
        return NextResponse.json({ error: mError.message }, { status: 500 });
      }

      seededMeetingsCount++;

      // Upsert participants
      if (participantRows.length > 0) {
        const { error: pError } = await supabase
          .from('participants')
          .upsert(participantRows, { onConflict: 'meeting_id,id' });
        if (pError) console.error('Error seeding participants:', pError);
        else seededParticipantsCount += participantRows.length;
      }

      // Upsert transcript segments
      if (transcriptRows.length > 0) {
        // Chunk transcript rows in batches of 50 to avoid payload limits
        const chunkSize = 50;
        for (let i = 0; i < transcriptRows.length; i += chunkSize) {
          const chunk = transcriptRows.slice(i, i + chunkSize);
          const { error: tError } = await supabase
            .from('transcript_segments')
            .upsert(chunk, { onConflict: 'meeting_id,id' });
          if (tError) console.error('Error seeding transcript chunk:', tError);
          else seededSegmentsCount += chunk.length;
        }
      }

      // Upsert action items
      if (actionItemRows.length > 0) {
        const { error: aError } = await supabase
          .from('action_items')
          .upsert(actionItemRows, { onConflict: 'meeting_id,id' });
        if (aError) console.error('Error seeding action items:', aError);
      }

      // Upsert highlights
      if (highlightRows.length > 0) {
        const { error: hError } = await supabase
          .from('highlights')
          .upsert(highlightRows, { onConflict: 'meeting_id,id' });
        if (hError) console.error('Error seeding highlights:', hError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Seeding completed successfully.',
      seeded: {
        meetings: seededMeetingsCount,
        participants: seededParticipantsCount,
        transcriptSegments: seededSegmentsCount,
      },
    });
  } catch (error) {
    console.error('Unhandled POST /api/seed error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown server error' },
      { status: 500 }
    );
  }
}
