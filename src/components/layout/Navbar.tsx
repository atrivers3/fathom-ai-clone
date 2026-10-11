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
    setActiveView,
    selectedMeeting,
    setSelectedMeetingId,
    searchQuery,
    setSearchQuery,
    setRecordModalOpen,
  } = useMeeting();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMeeting) {
      setSelectedMeetingId(null);
    }
    setActiveView('search');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedMeeting) {
        setSelectedMeetingId(null);
      }
      setActiveView('search');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 flex items-center justify-between gap-4 transition-all">
      {/* Left section: Hamburger (mobile) or Breadcrumb / View Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {selectedMeeting ? (
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setSelectedMeetingId(null)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Meetings</span>
            </button>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-xs font-semibold text-slate-900 max-w-[160px] sm:max-w-xs truncate hidden sm:inline">
              {selectedMeeting.title}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 capitalize truncate">
              {activeView === 'meetings'
                ? 'Meetings & Recordings'
                : activeView === 'search'
                ? 'Search Transcripts'
                : activeView === 'templates'
                ? 'AI Summary Templates'
                : 'Settings & Integrations'}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium hidden sm:inline shrink-0">
              Workspace
            </span>
          </div>
        )}
      </div>

      {/* Middle/Right: Global Search + Primary Record Meeting Button */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <form onSubmit={handleSearchSubmit} className="relative w-40 sm:w-60 md:w-80">
          <button
            type="submit"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
            title="Search transcripts (Enter)"
          >
            <Search className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search & hit Enter..."
            className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm pl-9 pr-7 py-2 rounded-lg border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 placeholder:text-slate-400 transition-all outline-hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </form>

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
