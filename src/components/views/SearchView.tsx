'use client';

import React, { useMemo } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import {
  Search,
  Play,
  ArrowRight,
} from 'lucide-react';

export default function SearchView() {
  const {
    meetings,
    searchQuery,
    setSearchQuery,
    setSelectedMeetingId,
    setActiveView,
    seekTo,
    setIsPlaying,
  } = useMeeting();

  // Search across meetings and transcripts
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { meetings: [], transcripts: [] };

    const q = searchQuery.toLowerCase();

    // Matching meetings
    const matchedMeetings = meetings.filter((m) => {
      const titleMatch = m.title.toLowerCase().includes(q);
      const summaryMatch = m.summary.overview.toLowerCase().includes(q);
      const participantMatch = m.participants.some((p) => p.name.toLowerCase().includes(q));
      return titleMatch || summaryMatch || participantMatch;
    });

    // Matching transcript dialogue segments across all meetings
    const matchedTranscripts: {
      meetingId: string;
      meetingTitle: string;
      segmentId: string;
      speakerName: string;
      startTime: number;
      formattedTime: string;
      text: string;
    }[] = [];

    meetings.forEach((m) => {
      m.transcript.forEach((t) => {
        if (
          t.text.toLowerCase().includes(q) ||
          t.speakerName.toLowerCase().includes(q)
        ) {
          matchedTranscripts.push({
            meetingId: m.id,
            meetingTitle: m.title,
            segmentId: t.id,
            speakerName: t.speakerName,
            startTime: t.startTime,
            formattedTime: t.formattedTime,
            text: t.text,
          });
        }
      });
    });

    return {
      meetings: matchedMeetings,
      transcripts: matchedTranscripts.slice(0, 50), // limit for high UI performance
    };
  }, [meetings, searchQuery]);

  const highlightMatches = (text: string, term: string) => {
    if (!term.trim()) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === term.toLowerCase() ? (
            <mark
              key={i}
              className="bg-amber-200 text-slate-950 font-semibold px-0.5 rounded-xs"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const handleJumpToTranscript = (meetingId: string, startTime: number) => {
    setSelectedMeetingId(meetingId);
    setActiveView('meetings');
    seekTo(startTime);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header & Big Search Input */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Global Search
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Search across meeting titles, AI summaries, participants, and deep transcript dialogue.
          </p>
        </div>

        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Try searching 'latency', 'Maya', 'PII', 'budget' or 'failover'..."
            className="w-full text-sm pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 outline-hidden transition-all"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick query tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span>Popular searches:</span>
          {['latency', 'speculative decoding', 'PII', 'VRAM', 'Sarah Jenkins', 'failover'].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition-colors"
              >
                {tag}
              </button>
            )
          )}
        </div>
      </div>

      {/* Results view */}
      {searchQuery.trim() ? (
        <div className="space-y-6">
          {/* Matched Meetings */}
          {searchResults.meetings.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Matching Meetings ({searchResults.meetings.length})
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {searchResults.meetings.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMeetingId(m.id);
                      setActiveView('meetings');
                    }}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <span className="capitalize">{m.platform.replace('-', ' ')}</span>
                        <span>•</span>
                        <span>{m.date}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-700 font-semibold">{m.durationFormatted}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {highlightMatches(m.title, searchQuery)}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-1">
                        {highlightMatches(m.summary.overview, searchQuery)}
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Transcript Lines */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Dialogue Matches in Transcripts ({searchResults.transcripts.length})
            </h3>

            {searchResults.transcripts.length === 0 ? (
              <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                No spoken dialogue found matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.transcripts.map((t, idx) => (
                  <div
                    key={`${t.segmentId}-${idx}`}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{t.speakerName}</span>
                        <span className="text-slate-400">in</span>
                        <span className="text-slate-600 font-medium truncate max-w-xs">
                          {t.meetingTitle}
                        </span>
                      </div>

                      <button
                        onClick={() => handleJumpToTranscript(t.meetingId, t.startTime)}
                        className="flex items-center gap-1 font-mono text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline bg-blue-50 px-2 py-0.5 rounded cursor-pointer"
                        title="Jump to this moment in recording"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>{t.formattedTime}</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-2 border-l-2 border-blue-500">
                      {highlightMatches(t.text, searchQuery)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 bg-white rounded-xl border border-dashed border-slate-300 text-center">
          <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">Type a query above to search transcripts</h4>
          <p className="text-xs text-slate-400 mt-1">
            Search spans both session metadata and the full verbatim 171-segment technical review dialogue.
          </p>
        </div>
      )}
    </div>
  );
}
