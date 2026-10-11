import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id: meetingId } = await params;
    const body = await request.json();
    const { actionId, completed } = body;

    if (!actionId || typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing actionId or boolean completed flag' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    if (!supabase || !isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        actionId,
        completed,
        source: 'local-fallback',
      });
    }

    const { error } = await supabase
      .from('action_items')
      .update({ completed })
      .eq('meeting_id', meetingId)
      .eq('id', actionId);

    if (error) {
      console.error('Error updating action item in Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      actionId,
      completed,
      source: 'supabase',
    });
  } catch (error) {
    console.error('Unhandled PATCH /api/meetings/[id]/actions error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id: meetingId } = await params;
    const body = await request.json();
    const { text, assigneeName, dueDate, timestampSeconds, formattedTime } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Missing action item text' },
        { status: 400 }
      );
    }

    const newId = `act-${Date.now()}`;
    const newActionItem = {
      id: newId,
      meeting_id: meetingId,
      text,
      assignee_id: 'user-custom',
      assignee_name: assigneeName || 'You',
      due_date: dueDate || 'Next Week',
      completed: false,
      timestamp_seconds: timestampSeconds ?? 0,
      formatted_time: formattedTime ?? '00:00',
    };

    const supabase = getSupabaseClient();

    if (!supabase || !isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        data: {
          id: newId,
          text,
          assigneeId: 'user-custom',
          assigneeName: assigneeName || 'You',
          dueDate: dueDate || 'Next Week',
          completed: false,
          timestampSeconds: timestampSeconds ?? 0,
          formattedTime: formattedTime ?? '00:00',
        },
        source: 'local-fallback',
      });
    }

    const { error } = await supabase
      .from('action_items')
      .insert(newActionItem);

    if (error) {
      console.error('Error inserting action item in Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newId,
          text,
          assigneeId: 'user-custom',
          assigneeName: assigneeName || 'You',
          dueDate: dueDate || 'Next Week',
          completed: false,
          timestampSeconds: timestampSeconds ?? 0,
          formattedTime: formattedTime ?? '00:00',
        },
        source: 'supabase',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unhandled POST /api/meetings/[id]/actions error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown server error' },
      { status: 500 }
    );
  }
}
