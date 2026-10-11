'use client';

import React from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { Meeting, Highlight } from '@/types/meeting';
import {
  Sparkles,
  Play,
  Scissors,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Milestone,
} from 'lucide-react';

interface HighlightsListProps {
  meeting: Meeting;
}

export default function HighlightsList({ meeting }: HighlightsListProps) {
  const { seekTo, setIsPlaying, openClipModalForSegment } = useMeeting();

  const getCategoryBadge = (category: Highlight['category']) => {
    switch (category) {
      case 'decision':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            Decision
          </span>
        );
      case 'milestone':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Milestone className="w-2.5 h-2.5 text-amber-600" />
            Milestone
          </span>
        );
      case 'risk':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
            Risk
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
            <Lightbulb className="w-2.5 h-2.5 text-blue-600" />
            Insight
          </span>
        );
    }
  };

  const handleOpenClipForHighlight = (hl: Highlight) => {
    // Find matching segment or create synthetic segment
    const segment = meeting.transcript.find(
      (s) => Math.abs(s.startTime - hl.startTime) < 30
    ) || {
      id: `seg-hl-${hl.id}`,
      speakerId: 'speaker',
      speakerName: hl.speakerName,
      startTime: hl.startTime,
      endTime: hl.startTime + 30,
      formattedTime: hl.formattedTime,
      text: hl.quote,
    };

    openClipModalForSegment(segment);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Highlights Header */}
      <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">Key Moments & Highlights</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
            {meeting.highlights.length} captured
          </span>
        </div>
      </div>

      {/* Highlights List */}
      <div className="p-4 overflow-y-auto space-y-3 flex-1">
        {meeting.highlights.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No highlights marked yet.
          </div>
        ) : (
          meeting.highlights.map((hl) => (
            <div
              key={hl.id}
              className="p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-300 bg-white hover:bg-slate-50/50 transition-all space-y-2 group shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getCategoryBadge(hl.category)}
                  <span className="text-xs font-bold text-slate-900">{hl.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      seekTo(hl.startTime);
                      setIsPlaying(true);
                    }}
                    className="flex items-center gap-1 text-xs font-mono font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    title="Play this highlight"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>{hl.formattedTime}</span>
                  </button>

                  <button
                    onClick={() => handleOpenClipForHighlight(hl)}
                    className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Share this moment as clip"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <blockquote className="text-xs sm:text-sm text-slate-700 italic border-l-2 border-amber-300 pl-3 leading-relaxed">
                &ldquo;{hl.quote}&rdquo;
              </blockquote>

              <div className="text-[11px] text-slate-400 font-medium">
                Attributed to <span className="text-slate-600 font-semibold">{hl.speakerName}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
