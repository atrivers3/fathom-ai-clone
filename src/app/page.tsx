'use client';

import React, { useState } from 'react';
import { MeetingProvider, useMeeting } from '@/context/MeetingContext';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import MeetingDashboard from '@/components/dashboard/MeetingDashboard';
import MeetingWorkspace from '@/components/workspace/MeetingWorkspace';
import TemplatesView from '@/components/views/TemplatesView';
import SettingsView from '@/components/views/SettingsView';
import SearchView from '@/components/views/SearchView';
import ShareClipModal from '@/components/workspace/ShareClipModal';
import RecordMeetingModal from '@/components/modals/RecordMeetingModal';

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { activeView, selectedMeeting } = useMeeting();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-900">
      {/* Navigation Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Navbar onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {selectedMeeting ? (
            <MeetingWorkspace meeting={selectedMeeting} />
          ) : activeView === 'meetings' ? (
            <MeetingDashboard />
          ) : activeView === 'search' ? (
            <SearchView />
          ) : activeView === 'templates' ? (
            <TemplatesView />
          ) : (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Modals */}
      <ShareClipModal />
      <RecordMeetingModal />
    </div>
  );
}

export default function HomePage() {
  return (
    <MeetingProvider>
      <AppContent />
    </MeetingProvider>
  );
}
