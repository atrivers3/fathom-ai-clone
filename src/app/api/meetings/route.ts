import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import {
  DbMeetingRow,
  DbParticipantRow,
  DbTranscriptRow,
  DbActionItemRow,
  DbHighlightRow,
  toMeetingModel,
  toDbMeetingPayload,
} from '@/lib/dbMapper';
import { INITIAL_MEETINGS } from '@/data/mockMeetings';
import { Meeting } from '@/types/meeting';

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    if (!supabase || !isSupabaseConfigured()) {
      return NextResponse.json({
        data: INITIAL_MEETINGS,
        source: 'local-fallback',
        message: 'Supabase credentials not configured. Serving default mock meetings.',
      });
    }

    // Fetch meetings
    const { data: meetingsData, error: meetingsError } = await supabase
      .from('meetings')
      .select('*')
      .order('created_at', { ascending: false });

    if (meetingsError) {
      console.error('Error fetching meetings from Supabase:', meetingsError);
      return NextResponse.json({
        data: INITIAL_MEETINGS,
        source: 'local-fallback',
        error: meetingsError.message,
      });
    }

    if (!meetingsData || meetingsData.length === 0) {
      return NextResponse.json({
        data: INITIAL_MEETINGS,
        source: 'local-fallback',
        message: 'Database is empty. Please run seed script or use Supabase SQL editor.',
      });
    }

    // Fetch child entities for all meetings
    const meetingIds = meetingsData.map((m: DbMeetingRow) => m.id);

    const [
      { data: participantsData },
      { data: transcriptData },
      { data: actionItemsData },
      { data: highlightsData },
    ] = await Promise.all([
      supabase.from('participants').select('*').in('meeting_id', meetingIds),
      supabase.from('transcript_segments').select('*').in('meeting_id', meetingIds).order('start_time', { ascending: true }),
      supabase.from('action_items').select('*').in('meeting_id', meetingIds),
      supabase.from('highlights').select('*').in('meeting_id', meetingIds),
    ]);

    const participantsByMeeting = (participantsData || []).reduce(
      (acc: Record<string, DbParticipantRow[]>, row: DbParticipantRow) => {
        if (!acc[row.meeting_id]) acc[row.meeting_id] = [];
        acc[row.meeting_id].push(row);
        return acc;
      },
      {}
    );

    const transcriptByMeeting = (transcriptData || []).reduce(
      (acc: Record<string, DbTranscriptRow[]>, row: DbTranscriptRow) => {
        if (!acc[row.meeting_id]) acc[row.meeting_id] = [];
        acc[row.meeting_id].push(row);
        return acc;
      },
      {}
    );

    const actionItemsByMeeting = (actionItemsData || []).reduce(
      (acc: Record<string, DbActionItemRow[]>, row: DbActionItemRow) => {
        if (!acc[row.meeting_id]) acc[row.meeting_id] = [];
        acc[row.meeting_id].push(row);
        return acc;
      },
      {}
    );

    const highlightsByMeeting = (highlightsData || []).reduce(
      (acc: Record<string, DbHighlightRow[]>, row: DbHighlightRow) => {
        if (!acc[row.meeting_id]) acc[row.meeting_id] = [];
        acc[row.meeting_id].push(row);
        return acc;
      },
      {}
    );

    const meetings: Meeting[] = meetingsData.map((row: DbMeetingRow) =>
      toMeetingModel(
        row,
        participantsByMeeting[row.id] || [],
        transcriptByMeeting[row.id] || [],
        actionItemsByMeeting[row.id] || [],
        highlightsByMeeting[row.id] || []
      )
    );

    return NextResponse.json({
      data: meetings,
      source: 'supabase',
    });
  } catch (error) {
    console.error('Unhandled GET /api/meetings error:', error);
    return NextResponse.json({
      data: INITIAL_MEETINGS,
      source: 'local-fallback',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const meeting: Meeting = await request.json();

    if (!meeting || !meeting.id || !meeting.title) {
      return NextResponse.json(
        { error: 'Invalid meeting payload. Missing id or title.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    if (!supabase || !isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: true,
          data: meeting,
          source: 'in-memory-fallback',
          message: 'Supabase credentials not configured. Meeting kept in application session.',
        },
        { status: 201 }
      );
    }

    const {
      meetingRow,
      participantRows,
      transcriptRows,
      actionItemRows,
      highlightRows,
    } = toDbMeetingPayload(meeting);

    // Upsert meeting record
    const { error: meetingError } = await supabase
      .from('meetings')
      .upsert(meetingRow);

    if (meetingError) {
      console.error('Error saving meeting to Supabase:', meetingError);
      return NextResponse.json(
        { error: meetingError.message },
        { status: 500 }
      );
    }

    // Upsert related records
    if (participantRows.length > 0) {
      await supabase.from('participants').upsert(participantRows, {
        onConflict: 'meeting_id,id',
      });
    }

    if (transcriptRows.length > 0) {
      await supabase.from('transcript_segments').upsert(transcriptRows, {
        onConflict: 'meeting_id,id',
      });
    }

    if (actionItemRows.length > 0) {
      await supabase.from('action_items').upsert(actionItemRows, {
        onConflict: 'meeting_id,id',
      });
    }

    if (highlightRows.length > 0) {
      await supabase.from('highlights').upsert(highlightRows, {
        onConflict: 'meeting_id,id',
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: meeting,
        source: 'supabase',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unhandled POST /api/meetings error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown server error' },
      { status: 500 }
    );
  }
}
