import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import {
  DbMeetingRow,
  DbParticipantRow,
  DbTranscriptRow,
  DbActionItemRow,
  DbHighlightRow,
  toMeetingModel,
} from '@/lib/dbMapper';
import { getMeetingById } from '@/data/mockMeetings';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();

    if (!supabase || !isSupabaseConfigured()) {
      const fallback = getMeetingById(id);
      if (!fallback) {
        return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
      }
      return NextResponse.json({ data: fallback, source: 'local-fallback' });
    }

    // Fetch meeting row
    const { data: meetingData, error: meetingError } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single();

    if (meetingError || !meetingData) {
      // Fallback check
      const fallback = getMeetingById(id);
      if (fallback) {
        return NextResponse.json({ data: fallback, source: 'local-fallback' });
      }
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Fetch related records in parallel
    const [
      { data: participantsData },
      { data: transcriptData },
      { data: actionItemsData },
      { data: highlightsData },
    ] = await Promise.all([
      supabase.from('participants').select('*').eq('meeting_id', id),
      supabase
        .from('transcript_segments')
        .select('*')
        .eq('meeting_id', id)
        .order('start_time', { ascending: true }),
      supabase.from('action_items').select('*').eq('meeting_id', id),
      supabase.from('highlights').select('*').eq('meeting_id', id),
    ]);

    const meeting = toMeetingModel(
      meetingData as DbMeetingRow,
      (participantsData as DbParticipantRow[]) || [],
      (transcriptData as DbTranscriptRow[]) || [],
      (actionItemsData as DbActionItemRow[]) || [],
      (highlightsData as DbHighlightRow[]) || []
    );

    return NextResponse.json({ data: meeting, source: 'supabase' });
  } catch (error) {
    console.error('Unhandled GET /api/meetings/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();

    if (!supabase || !isSupabaseConfigured()) {
      return NextResponse.json(
        { success: true, message: 'Deleted locally from session' },
        { status: 200 }
      );
    }

    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Unhandled DELETE /api/meetings/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown server error' },
      { status: 500 }
    );
  }
}
