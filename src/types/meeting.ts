export interface Participant {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  color: string;
}

export interface TranscriptSegment {
  id: string;
  speakerId: string;
  speakerName: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  formattedTime: string; // e.g., "04:15"
  text: string;
  highlighted?: boolean;
  topic?: string;
}

export interface ActionItem {
  id: string;
  text: string;
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  completed: boolean;
  timestampSeconds?: number;
  formattedTime?: string;
}

export interface Highlight {
  id: string;
  title: string;
  quote: string;
  speakerName: string;
  startTime: number;
  formattedTime: string;
  category: 'decision' | 'action' | 'insight' | 'risk' | 'milestone';
}

export type SummaryTemplateType =
  | 'executive-brief'
  | 'sales-discovery'
  | 'engineering-arch'
  | 'one-on-one'
  | 'customer-success';

export interface TemplateSection {
  title: string;
  items: string[];
}

export interface MeetingSummary {
  overview: string;
  templates: Record<SummaryTemplateType, {
    title: string;
    description: string;
    sections: TemplateSection[];
  }>;
  keyDecisions: string[];
}

export interface Meeting {
  id: string;
  title: string;
  date: string; // ISO date string or formatted date
  createdAt: string;
  durationSeconds: number; // e.g. 3600 for 60 min
  durationFormatted: string; // e.g. "60m" or "1h 00m"
  platform: 'google-meet' | 'zoom' | 'microsoft-teams' | 'in-person';
  category: 'Product' | 'Engineering' | 'Executive' | 'Design' | 'Sales' | 'Operations';
  participants: Participant[];
  summary: MeetingSummary;
  actionItems: ActionItem[];
  highlights: Highlight[];
  transcript: TranscriptSegment[];
  mediaUrl?: string; // audio/video source if available
}

export type ActiveView = 'meetings' | 'search' | 'templates' | 'settings';
