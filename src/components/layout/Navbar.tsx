'use client';

import React from 'react';
import { useMeeting } from '@/context/MeetingContext';
import {
  Menu,
  Search,
  Radio,
  Bell,
  ArrowLeft,
} from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const {
    activeView,
    selectedMeeting,
    setSelectedMeetingId,
    searchQuery,
    setSearchQuery,
    setRecordModalOpen,
  } = useMeeting();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 flex items-center justify-between gap-4 transition-all">
      {/* Left section: Hamburger (mobile) or Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {selectedMeeting ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedMeetingId(null)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Meetings</span>
            </button>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-xs font-semibold text-slate-900 max-w-[200px] sm:max-w-xs truncate hidden sm:inline">
              {selectedMeeting.title}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 capitalize">
              {activeView === 'meetings'
                ? 'Meetings & Recordings'
                : activeView === 'search'
                ? 'Search Transcripts'
                : activeView === 'templates'
                ? 'AI Summary Templates'
                : 'Settings & Integrations'}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium hidden sm:inline">
              Workspace
            </span>
          </div>
        )}
      </div>

      {/* Middle/Right: Global Search + Simulate Record */}
      <div className="flex items-center gap-3">
        {!selectedMeeting && (
          <div className="relative w-48 sm:w-64 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meetings, speakers, transcripts..."
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm pl-9 pr-4 py-2 rounded-lg border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 placeholder:text-slate-400 transition-all outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        )}

        <button
          onClick={() => setRecordModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Radio className="w-3.5 h-3.5 text-red-300 animate-pulse" />
          <span className="hidden sm:inline">Record Meeting</span>
          <span className="sm:hidden">Record</span>
        </button>

        <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer transition-colors">
            <Bell className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </header>
  );
}
