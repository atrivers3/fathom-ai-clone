'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Meeting, ActiveView, ActionItem, TranscriptSegment } from '@/types/meeting';
import { INITIAL_MEETINGS } from '@/data/mockMeetings';

interface MeetingContextType {
  meetings: Meeting[];
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedMeetingId: string | null;
  setSelectedMeetingId: (id: string | null) => void;
  selectedMeeting: Meeting | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toggleActionItem: (meetingId: string, actionId: string) => void;
  addActionItem: (meetingId: string, text: string, assigneeName: string, dueDate: string) => void;
  addMeeting: (newMeeting: Meeting) => void;
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
    setMeetings((prev) =>
      prev.map((meeting) => {
        if (meeting.id !== meetingId) return meeting;
        return {
          ...meeting,
          actionItems: meeting.actionItems.map((item) =>
            item.id === actionId ? { ...item, completed: !item.completed } : item
          ),
        };
      })
    );
  };

  const addActionItem = (meetingId: string, text: string, assigneeName: string, dueDate: string) => {
    setMeetings((prev) =>
      prev.map((meeting) => {
        if (meeting.id !== meetingId) return meeting;
        const newItem: ActionItem = {
          id: `act-custom-${Date.now()}`,
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
        return {
          ...meeting,
          actionItems: [newItem, ...meeting.actionItems],
        };
      })
    );
  };

  const addMeeting = (newMeeting: Meeting) => {
    setMeetings((prev) => [newMeeting, ...prev]);
    changeSelectedMeetingId(newMeeting.id);
    setActiveView('meetings');
  };

  const openClipModalForSegment = (segment: TranscriptSegment) => {
    setClipInitialSegment(segment);
    setClipModalOpen(true);
  };

  return (
    <MeetingContext.Provider
      value={{
        meetings,
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
