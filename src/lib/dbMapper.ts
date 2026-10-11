import { Meeting, Highlight } from '@/types/meeting';

export interface DbMeetingRow {
  id: string;
  title: string;
  date: string;
  created_at: string;
  duration_seconds: number;
  duration_formatted: string;
  platform: Meeting['platform'];
  category: Meeting['category'];
  overview: string;
  key_decisions: string[];
  templates: Meeting['summary']['templates'];
  media_url?: string | null;
}

export interface DbParticipantRow {
  id: string;
  meeting_id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  color: string;
}

export interface DbTranscriptRow {
  id: string;
  meeting_id: string;
  speaker_id: string;
  speaker_name: string;
  start_time: number;
  end_time: number;
  formatted_time: string;
  text: string;
  highlighted: boolean;
  topic?: string | null;
}

export interface DbActionItemRow {
  id: string;
  meeting_id: string;
  text: string;
  assignee_id: string;
  assignee_name: string;
  due_date: string;
  completed: boolean;
  timestamp_seconds?: number | null;
  formatted_time?: string | null;
}

export interface DbHighlightRow {
  id: string;
  meeting_id: string;
  title: string;
  quote: string;
  speaker_name: string;
  start_time: number;
  formatted_time: string;
  category: Highlight['category'];
}

export function toMeetingModel(
  row: DbMeetingRow,
  participants: DbParticipantRow[] = [],
  transcript: DbTranscriptRow[] = [],
  actionItems: DbActionItemRow[] = [],
  highlights: DbHighlightRow[] = []
): Meeting {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    createdAt: row.created_at,
    durationSeconds: row.duration_seconds,
    durationFormatted: row.duration_formatted,
    platform: row.platform,
    category: row.category,
    summary: {
      overview: row.overview,
      keyDecisions: Array.isArray(row.key_decisions) ? row.key_decisions : [],
      templates: row.templates || {},
    },
    participants: participants.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      avatar: p.avatar,
      color: p.color,
    })),
    transcript: transcript
      .sort((a, b) => a.start_time - b.start_time)
      .map((t) => ({
        id: t.id,
        speakerId: t.speaker_id,
        speakerName: t.speaker_name,
        startTime: t.start_time,
        endTime: t.end_time,
        formattedTime: t.formatted_time,
        text: t.text,
        highlighted: Boolean(t.highlighted),
        topic: t.topic || undefined,
      })),
    actionItems: actionItems.map((a) => ({
      id: a.id,
      text: a.text,
      assigneeId: a.assignee_id,
      assigneeName: a.assignee_name,
      dueDate: a.due_date,
      completed: Boolean(a.completed),
      timestampSeconds: a.timestamp_seconds ?? undefined,
      formattedTime: a.formatted_time ?? undefined,
    })),
    highlights: highlights.map((h) => ({
      id: h.id,
      title: h.title,
      quote: h.quote,
      speakerName: h.speaker_name,
      startTime: h.start_time,
      formattedTime: h.formatted_time,
      category: h.category,
    })),
    mediaUrl: row.media_url || undefined,
  };
}

export function toDbMeetingPayload(meeting: Meeting) {
  const meetingRow: DbMeetingRow = {
    id: meeting.id,
    title: meeting.title,
    date: meeting.date,
    created_at: meeting.createdAt || new Date().toISOString(),
    duration_seconds: meeting.durationSeconds,
    duration_formatted: meeting.durationFormatted,
    platform: meeting.platform,
    category: meeting.category,
    overview: meeting.summary.overview,
    key_decisions: meeting.summary.keyDecisions,
    templates: meeting.summary.templates,
    media_url: meeting.mediaUrl || null,
  };

  const participantRows: DbParticipantRow[] = meeting.participants.map((p) => ({
    id: p.id,
    meeting_id: meeting.id,
    name: p.name,
    email: p.email || '',
    role: p.role || 'Participant',
    avatar: p.avatar || 'SP',
    color: p.color || '#3B82F6',
  }));

  const transcriptRows: DbTranscriptRow[] = meeting.transcript.map((t) => ({
    id: t.id,
    meeting_id: meeting.id,
    speaker_id: t.speakerId,
    speaker_name: t.speakerName,
    start_time: t.startTime,
    end_time: t.endTime,
    formatted_time: t.formattedTime,
    text: t.text,
    highlighted: Boolean(t.highlighted),
    topic: t.topic || null,
  }));

  const actionItemRows: DbActionItemRow[] = meeting.actionItems.map((a) => ({
    id: a.id,
    meeting_id: meeting.id,
    text: a.text,
    assignee_id: a.assigneeId || '',
    assignee_name: a.assigneeName || '',
    due_date: a.dueDate || '',
    completed: Boolean(a.completed),
    timestamp_seconds: a.timestampSeconds ?? null,
    formatted_time: a.formattedTime ?? null,
  }));

  const highlightRows: DbHighlightRow[] = meeting.highlights.map((h) => ({
    id: h.id,
    meeting_id: meeting.id,
    title: h.title,
    quote: h.quote,
    speaker_name: h.speakerName,
    start_time: h.startTime,
    formatted_time: h.formattedTime,
    category: h.category,
  }));

  return {
    meetingRow,
    participantRows,
    transcriptRows,
    actionItemRows,
    highlightRows,
  };
}
