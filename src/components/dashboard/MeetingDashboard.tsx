'use client';

import React, { useState, useMemo } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { Meeting } from '@/types/meeting';
import {
  Clock,
  Calendar,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  Sparkles,
  Video,
  ArrowUpRight,
} from 'lucide-react';

export default function MeetingDashboard() {
  const { meetings, setSelectedMeetingId, searchQuery, setSearchQuery } = useMeeting();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'duration' | 'actions'>('newest');

  // Categories list
  const categories = ['All', 'Engineering', 'Product', 'Sales', 'Design'];

  // Calculate overview metrics
  const totalDurationMinutes = useMemo(() => {
    return Math.round(meetings.reduce((acc, m) => acc + m.durationSeconds, 0) / 60);
  }, [meetings]);

  const totalActionItems = useMemo(() => {
    return meetings.reduce((acc, m) => acc + m.actionItems.length, 0);
  }, [meetings]);

  const completedActionItems = useMemo(() => {
    return meetings.reduce(
      (acc, m) => acc + m.actionItems.filter((a) => a.completed).length,
      0
    );
  }, [meetings]);

  const totalHighlights = useMemo(() => {
    return meetings.reduce((acc, m) => acc + m.highlights.length, 0);
  }, [meetings]);

  // Filter & sort meetings
  const filteredMeetings = useMemo(() => {
    return meetings
      .filter((meeting) => {
        // Search filter (searches title, summary, participant names, and transcript)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const titleMatch = meeting.title.toLowerCase().includes(q);
          const summaryMatch = meeting.summary.overview.toLowerCase().includes(q);
          const participantMatch = meeting.participants.some((p) =>
            p.name.toLowerCase().includes(q)
          );
          const transcriptMatch = meeting.transcript.some((t) =>
            t.text.toLowerCase().includes(q)
          );
          if (!titleMatch && !summaryMatch && !participantMatch && !transcriptMatch) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All' && meeting.category !== selectedCategory) {
          return false;
        }

        // Platform filter
        if (selectedPlatform !== 'All' && meeting.platform !== selectedPlatform) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'duration') {
          return b.durationSeconds - a.durationSeconds;
        }
        if (sortBy === 'actions') {
          return b.actionItems.length - a.actionItems.length;
        }
        // newest first (default)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [meetings, searchQuery, selectedCategory, selectedPlatform, sortBy]);

  const getPlatformIcon = (platform: Meeting['platform']) => {
    switch (platform) {
      case 'google-meet':
        return <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Google Meet" />;
      case 'zoom':
        return <span className="inline-block w-2 h-2 rounded-full bg-blue-500" title="Zoom" />;
      case 'microsoft-teams':
        return <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" title="Teams" />;
      default:
        return <span className="inline-block w-2 h-2 rounded-full bg-slate-400" title="Meeting" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Calls</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{meetings.length}</div>
          <div className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <span>All AI indexed</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Time Recorded</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {Math.floor(totalDurationMinutes / 60)}h {totalDurationMinutes % 60}m
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Across {meetings.length} sessions
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Action Items</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalActionItems}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            {completedActionItems} completed • {totalActionItems - completedActionItems} open
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">AI Highlights</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalHighlights}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Key moments clipped
          </div>
        </div>
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Platform and Sort Dropdowns */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="All">All Platforms</option>
              <option value="google-meet">Google Meet</option>
              <option value="zoom">Zoom</option>
              <option value="microsoft-teams">Microsoft Teams</option>
            </select>

            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'duration' | 'actions')}
              className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="newest">Most Recent</option>
              <option value="duration">Longest Duration</option>
              <option value="actions">Most Action Items</option>
            </select>
          </div>
        </div>
      </div>

      {/* Meeting Cards List */}
      <div className="space-y-3">
        {filteredMeetings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-dashed border-slate-300">
            <Search className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900">No meetings match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, clearing filters, or simulate a new recording.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-semibold text-xs hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredMeetings.map((meeting) => {
            const isEightPerson = meeting.id === 'meeting-8p-60m';
            return (
              <div
                key={meeting.id}
                onClick={() => setSelectedMeetingId(meeting.id)}
                className={`bg-white rounded-xl border transition-all duration-200 p-4 sm:p-5 hover:shadow-md cursor-pointer group ${
                  isEightPerson
                    ? 'border-indigo-200 hover:border-indigo-400 bg-gradient-to-r from-white via-white to-indigo-50/20'
                    : 'border-slate-200/90 hover:border-blue-400'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Header info */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        {getPlatformIcon(meeting.platform)}
                        <span className="capitalize">{meeting.platform.replace('-', ' ')}</span>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {meeting.date}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {meeting.category}
                      </span>
                      {isEightPerson && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300/50 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          Featured 8-Speaker • 60m Call
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                      <span>{meeting.title}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                    </h3>

                    {/* Summary preview */}
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {meeting.summary.overview}
                    </p>
                  </div>

                  {/* Right metadata / participants */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-2 overflow-hidden py-1">
                        {meeting.participants.slice(0, 5).map((p) => (
                          <div
                            key={p.id}
                            title={`${p.name} (${p.role})`}
                            style={{ backgroundColor: p.color }}
                            className="inline-block h-7 w-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-xs"
                          >
                            {p.avatar}
                          </div>
                        ))}
                        {meeting.participants.length > 5 && (
                          <div className="inline-block h-7 w-7 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-xs">
                            +{meeting.participants.length - 5}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-500 ml-1">
                        {meeting.participants.length} speakers
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1 font-mono text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {meeting.durationFormatted}
                      </span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {meeting.actionItems.length} actions
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
