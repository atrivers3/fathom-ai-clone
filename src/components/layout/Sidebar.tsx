'use client';

import React from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { ActiveView } from '@/types/meeting';
import {
  Video,
  Search,
  FileText,
  Settings,
  CircleDot,
  Radio,
  HardDrive,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const {
    activeView,
    setActiveView,
    selectedMeetingId,
    setSelectedMeetingId,
    meetings,
    setRecordModalOpen,
  } = useMeeting();

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setSelectedMeetingId(null);
    setMobileOpen(false);
  };

  const navItems: { view: ActiveView; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      view: 'meetings',
      label: 'Meetings',
      icon: <Video className="w-4 h-4" />,
      badge: `${meetings.length}`,
    },
    {
      view: 'search',
      label: 'Search Transcripts',
      icon: <Search className="w-4 h-4" />,
    },
    {
      view: 'templates',
      label: 'AI Templates',
      icon: <FileText className="w-4 h-4" />,
      badge: '5',
    },
    {
      view: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <button
            onClick={() => handleNavClick('meetings')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-base">
                Fathom <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">AI</span>
              </div>
              <p className="text-[11px] text-slate-400">Meeting Intelligence</p>
            </div>
          </button>
        </div>

        {/* Record New Call Button */}
        <div className="p-3">
          <button
            onClick={() => {
              setRecordModalOpen(true);
              setMobileOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm shadow-md shadow-blue-500/20 transition-all hover:shadow-indigo-500/30 active:scale-[0.98] cursor-pointer"
          >
            <Radio className="w-4 h-4 animate-pulse text-red-300" />
            <span>Simulate Recording</span>
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Workspace
          </div>

          {navItems.map((item) => {
            const isActive = activeView === item.view && !selectedMeetingId;
            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-blue-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-blue-500/30 text-blue-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Meetings Section */}
          <div className="pt-5 pb-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
              <span>Recent Calls</span>
              <button
                onClick={() => handleNavClick('meetings')}
                className="text-[10px] text-blue-400 hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>
            <div className="space-y-1">
              {meetings.slice(0, 4).map((meeting) => {
                const isSelected = selectedMeetingId === meeting.id;
                return (
                  <button
                    key={meeting.id}
                    onClick={() => {
                      setSelectedMeetingId(meeting.id);
                      setActiveView('meetings');
                      setMobileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-2 group ${
                      isSelected
                        ? 'bg-slate-800 text-white font-medium border-l-2 border-blue-500 pl-2.5'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <CircleDot
                      className={`w-2.5 h-2.5 shrink-0 ${
                        meeting.id === 'meeting-8p-60m'
                          ? 'text-amber-400'
                          : 'text-slate-500 group-hover:text-slate-400'
                      }`}
                    />
                    <span className="truncate flex-1">{meeting.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {meeting.durationFormatted}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Plan / Storage Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-3">
          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1.5">
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                <span>Audio Storage</span>
              </div>
              <span className="text-[11px] text-blue-400 font-semibold">Pro Plan</span>
            </div>
            <div className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full w-2/5" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              4.2 of 20 hours recorded this month
            </p>
          </div>

          {/* User Profile */}
          <div className="flex items-center justify-between px-1.5 pt-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white ring-2 ring-indigo-400/30">
                AA
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-200">Ayan Aslam</div>
                <div className="text-[10px] text-slate-400">ayan@fanthom.ai</div>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" title="Bot Connected" />
          </div>
        </div>
      </aside>
    </>
  );
}
