'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { Meeting, TranscriptSegment } from '@/types/meeting';
import {
  Search,
  Scissors,
  Sparkles,
  Copy,
  Check,
  Play,
} from 'lucide-react';

interface TranscriptViewerProps {
  meeting: Meeting;
}

export default function TranscriptViewer({ meeting }: TranscriptViewerProps) {
  const { currentTime, seekTo, setIsPlaying, openClipModalForSegment } = useMeeting();

  const [query, setQuery] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeSegmentRef = useRef<HTMLDivElement | null>(null);

  // Distinct speakers list
  const speakers = useMemo(() => {
    return meeting.participants;
  }, [meeting]);

  // Filtered segments based on speaker and query
  const filteredSegments = useMemo(() => {
    return meeting.transcript.filter((seg) => {
      if (selectedSpeaker !== 'all' && seg.speakerId !== selectedSpeaker) {
        return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        const textMatch = seg.text.toLowerCase().includes(q);
        const nameMatch = seg.speakerName.toLowerCase().includes(q);
        return textMatch || nameMatch;
      }
      return true;
    });
  }, [meeting.transcript, selectedSpeaker, query]);

  // Find active segment based on current playback time
  const activeSegmentId = useMemo(() => {
    const active = meeting.transcript.find(
      (s) => currentTime >= s.startTime && currentTime < s.endTime
    );
    return active ? active.id : null;
  }, [meeting.transcript, currentTime]);

  // Auto-scroll to active segment if enabled
  useEffect(() => {
    if (!autoScroll || !activeSegmentRef.current || !containerRef.current) return;
    activeSegmentRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [activeSegmentId, autoScroll]);

  const handleCopyQuote = (seg: TranscriptSegment) => {
    const quoteText = `"${seg.text}" — ${seg.speakerName} (${seg.formattedTime})`;
    navigator.clipboard.writeText(quoteText);
    setCopiedId(seg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col h-[650px] overflow-hidden">
      {/* Transcript Header & Filters */}
      <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/70 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Transcript</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
              {filteredSegments.length} of {meeting.transcript.length} lines
            </span>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span>Auto-scroll to audio</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          {/* Transcript Search */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search words in transcript..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-white rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-slate-800 placeholder:text-slate-400 outline-hidden"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Speaker Filter */}
          <select
            value={selectedSpeaker}
            onChange={(e) => setSelectedSpeaker(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden focus:border-blue-500 cursor-pointer max-w-[150px] truncate"
          >
            <option value="all">All Speakers ({speakers.length})</option>
            {speakers.map((spk) => (
              <option key={spk.id} value={spk.id}>
                {spk.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transcript List Scroll Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3.5 divide-y divide-slate-100"
      >
        {filteredSegments.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No dialogue matching &quot;{query}&quot;
          </div>
        ) : (
          filteredSegments.map((seg) => {
            const isActive = activeSegmentId === seg.id;
            const speakerInfo = speakers.find((s) => s.id === seg.speakerId);

            return (
              <div
                key={seg.id}
                ref={isActive ? activeSegmentRef : null}
                className={`pt-3.5 group rounded-lg p-2.5 transition-colors ${
                  isActive
                    ? 'bg-blue-50/70 border-l-4 border-blue-600 shadow-xs'
                    : 'hover:bg-slate-50/80 border-l-4 border-transparent'
                }`}
              >
                {/* Speaker Header + Timestamp + Quick Actions */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      style={{ backgroundColor: speakerInfo?.color || '#3B82F6' }}
                      className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0 shadow-xs"
                    >
                      {speakerInfo?.avatar || seg.speakerName.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {seg.speakerName}
                    </span>
                    <button
                      onClick={() => {
                        seekTo(seg.startTime);
                        setIsPlaying(true);
                      }}
                      className="flex items-center gap-1 text-[11px] font-mono font-semibold text-slate-600 hover:text-blue-700 hover:underline px-1 py-0.5 rounded cursor-pointer transition-colors"
                      title="Click to play from this moment"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>{seg.formattedTime}</span>
                    </button>
                    {seg.highlighted && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                        Key Moment
                      </span>
                    )}
                  </div>

                  {/* Hover Actions Bar */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      onClick={() => openClipModalForSegment(seg)}
                      className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors text-[11px] flex items-center gap-1 font-medium cursor-pointer"
                      title="Create clip from this dialogue"
                    >
                      <Scissors className="w-3 h-3" />
                      <span>Clip</span>
                    </button>
                    <button
                      onClick={() => handleCopyQuote(seg)}
                      className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors text-[11px] flex items-center gap-1 font-medium cursor-pointer"
                      title="Copy verbatim quote"
                    >
                      {copiedId === seg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Dialogue Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-7">
                  {highlightMatches(seg.text, query)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
