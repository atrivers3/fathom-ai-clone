'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Meeting, ActiveView, ActionItem, TranscriptSegment } from '@/types/meeting';
import { INITIAL_MEETINGS } from '@/data/mockMeetings';

interface MeetingContextType {
  meetings: Meeting[];
  isLoading: boolean;
  refreshMeetings: () => Promise<void>;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedMeetingId: string | null;
  setSelectedMeetingId: (id: string | null) => void;
  selectedMeeting: Meeting | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toggleActionItem: (meetingId: string, actionId: string) => void;
  addActionItem: (meetingId: string, text: string, assigneeName: string, dueDate: string) => void;
  addMeeting: (newMeeting: Meeting) => Promise<{ success: boolean; error?: string }>;
  // Playback state shared between player & transcript
  currentTime: number;
  setCurrentTime: (time: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  seekTo: (seconds: number) => void;
  // Clip modal state
  clipModalOpen: boolean;
  setClipModalOpen: (open: boolean) => void;
  clipInitialSegment: TranscriptSegment | null;
  openClipModalForSegment: (segment: TranscriptSegment) => void;
  // Recording modal state
  recordModalOpen: boolean;
  setRecordModalOpen: (open: boolean) => void;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export function MeetingProvider({ children }: { children: React.ReactNode }) {
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('meetings');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Media playback state
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Modals state
  const [clipModalOpen, setClipModalOpen] = useState(false);
  const [clipInitialSegment, setClipInitialSegment] = useState<TranscriptSegment | null>(null);
  const [recordModalOpen, setRecordModalOpen] = useState(false);

  // Fetch meetings from Next.js API / Supabase on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/meetings')
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((json) => {
        if (isMounted && Array.isArray(json?.data) && json.data.length > 0) {
          setMeetings(json.data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch meetings from /api/meetings:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshMeetings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/meetings');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          setMeetings(json.data);
        }
      }
    } catch (err) {
      console.warn('Could not refresh meetings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Find currently selected meeting
  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId) || null;

  const changeSelectedMeetingId = (id: string | null) => {
    setSelectedMeetingId(id);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Playback simulation ticker
  useEffect(() => {
    if (!isPlaying || !selectedMeeting) return;

    const intervalMs = 1000 / playbackSpeed;
    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= selectedMeeting.durationSeconds) {
          setIsPlaying(false);
          return selectedMeeting.durationSeconds;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, selectedMeeting]);

  const seekTo = (seconds: number) => {
    if (!selectedMeeting) return;
    const clamped = Math.max(0, Math.min(seconds, selectedMeeting.durationSeconds));
    setCurrentTime(clamped);
  };

  const toggleActionItem = (meetingId: string, actionId: string) => {
    let nextCompleted = false;

    // Optimistic UI update
    setMeetings((prev) =>
      prev.map((meeting) => {
        if (meeting.id !== meetingId) return meeting;
        return {
          ...meeting,
          actionItems: meeting.actionItems.map((item) => {
            if (item.id === actionId) {
              nextCompleted = !item.completed;
              return { ...item, completed: nextCompleted };
            }
            return item;
          }),
        };
      })
    );

    // Persist to backend route handler
    fetch(`/api/meetings/${meetingId}/actions`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionId, completed: nextCompleted }),
    }).catch((err) => {
      console.warn('Failed to persist action item update to API:', err);
    });
  };

  const addActionItem = (meetingId: string, text: string, assigneeName: string, dueDate: string) => {
    const newItemId = `act-custom-${Date.now()}`;
    const newItem: ActionItem = {
      id: newItemId,
      text,
      assigneeId: 'custom-user',
      assigneeName: assigneeName || 'You',
      dueDate: dueDate || 'Next Week',
      completed: false,
      timestampSeconds: currentTime,
      formattedTime: `${Math.floor(currentTime / 60)
        .toString()
        .padStart(2, '0')}:${(currentTime % 60).toString().padStart(2, '0')}`,
    };

    // Optimistic UI update
    setMeetings((prev) =>
      prev.map((meeting) => {
        if (meeting.id !== meetingId) return meeting;
        return {
          ...meeting,
          actionItems: [newItem, ...meeting.actionItems],
        };
      })
    );

    // Persist to backend route handler
    fetch(`/api/meetings/${meetingId}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        assigneeName: assigneeName || 'You',
        dueDate: dueDate || 'Next Week',
        timestampSeconds: currentTime,
        formattedTime: newItem.formattedTime,
      }),
    }).catch((err) => {
      console.warn('Failed to persist new action item to API:', err);
    });
  };

  const addMeeting = async (newMeeting: Meeting): Promise<{ success: boolean; error?: string }> => {
    try {
      // Persist to backend Route Handler before showing
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMeeting),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        const errMsg = errorJson?.error || `Server responded with status ${res.status}`;
        console.error('Failed to persist meeting to API:', errMsg);
        return { success: false, error: errMsg };
      }

      // Persisted successfully: commit to local React state and navigate
      setMeetings((prev) => [newMeeting, ...prev]);
      changeSelectedMeetingId(newMeeting.id);
      setActiveView('meetings');
      return { success: true };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Network error';
      console.error('Failed to persist meeting to API:', errMsg);
      return { success: false, error: errMsg };
    }
  };

  const openClipModalForSegment = (segment: TranscriptSegment) => {
    setClipInitialSegment(segment);
    setClipModalOpen(true);
  };

  return (
    <MeetingContext.Provider
      value={{
        meetings,
        isLoading,
        refreshMeetings,
        activeView,
        setActiveView,
        selectedMeetingId,
        setSelectedMeetingId: changeSelectedMeetingId,
        selectedMeeting,
        searchQuery,
        setSearchQuery,
        toggleActionItem,
        addActionItem,
        addMeeting,
        currentTime,
        setCurrentTime,
        isPlaying,
        setIsPlaying,
        playbackSpeed,
        setPlaybackSpeed,
        seekTo,
        clipModalOpen,
        setClipModalOpen,
        clipInitialSegment,
        openClipModalForSegment,
        recordModalOpen,
        setRecordModalOpen,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

export function useMeeting() {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
}
