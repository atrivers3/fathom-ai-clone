'use client';

import React, { useState, useEffect } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { Meeting } from '@/types/meeting';
import MediaPlayer from './MediaPlayer';
import TranscriptViewer from './TranscriptViewer';
import SummaryViewer from './SummaryViewer';
import ActionItemList from './ActionItemList';
import HighlightsList from './HighlightsList';
import {
  Calendar,
  Clock,
  Users,
  Share2,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Scissors,
  Check,
} from 'lucide-react';

interface MeetingWorkspaceProps {
  meeting: Meeting;
}

export default function MeetingWorkspace({ meeting }: MeetingWorkspaceProps) {
  const {
    setSelectedMeetingId,
    setClipModalOpen,
    isPlaying,
    setIsPlaying,
    currentTime,
    seekTo,
  } = useMeeting();

  const [activeTab, setActiveTab] = useState<'summary' | 'actions' | 'highlights'>('summary');
  const [copiedLink, setCopiedLink] = useState(false);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      } else if (e.code === 'KeyJ') {
        e.preventDefault();
        seekTo(currentTime - 10);
      } else if (e.code === 'KeyL') {
        e.preventDefault();
        seekTo(currentTime + 10);
      } else if (e.code === 'KeyC') {
        e.preventDefault();
        setClipModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime, setIsPlaying, seekTo, setClipModalOpen]);

  const handleCopyMeetingLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isEightPerson = meeting.id === 'meeting-8p-60m';

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Workspace Header */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        {/* Back and Metadata row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setSelectedMeetingId(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Meetings</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setClipModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              title="Clip snippet (C)"
            >
              <Scissors className="w-3.5 h-3.5 text-blue-600" />
              <span>Share Clip</span>
            </button>

            <button
              onClick={handleCopyMeetingLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Title and Badges */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
              {meeting.platform.replace('-', ' ')}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {meeting.category}
            </span>
            {isEightPerson && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Featured 8-Speaker • 60-Minute Review
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
            {meeting.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {meeting.date}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {meeting.durationFormatted} ({meeting.durationSeconds}s)
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {meeting.participants.length} Distinct Speakers
            </span>
          </div>
        </div>

        {/* Speakers List Chips */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Speakers:
          </span>
          {meeting.participants.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700"
              title={`${p.name} — ${p.role}`}
            >
              <div
                style={{ backgroundColor: p.color }}
                className="w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
              >
                {p.avatar}
              </div>
              <span className="font-semibold text-slate-800">{p.name}</span>
              <span className="text-[10px] text-slate-400">({p.role.split(' ')[0]})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Two-Pane Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Media Player + Transcript (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <MediaPlayer meeting={meeting} />
          <TranscriptViewer meeting={meeting} />
        </div>

        {/* Right Column: AI Intelligence Tabs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tab Navigation Bar */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'summary'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Summary</span>
            </button>

            <button
              onClick={() => setActiveTab('actions')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'actions'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Actions ({meeting.actionItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('highlights')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'highlights'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Highlights ({meeting.highlights.length})</span>
            </button>
          </div>

          {/* Active Tab Content (fixed height to align with transcript viewer) */}
          <div className="h-[650px]">
            {activeTab === 'summary' && <SummaryViewer meeting={meeting} />}
            {activeTab === 'actions' && <ActionItemList meeting={meeting} />}
            {activeTab === 'highlights' && <HighlightsList meeting={meeting} />}
          </div>
        </div>
      </div>
    </div>
  );
}
