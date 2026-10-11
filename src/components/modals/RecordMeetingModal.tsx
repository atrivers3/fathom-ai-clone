'use client';

import React, { useState, useEffect } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { Meeting } from '@/types/meeting';
import {
  X,
  Radio,
  Square,
  Play,
  Pause,
  AlertCircle,
  Video,
  Bot,
} from 'lucide-react';

export default function RecordMeetingModal() {
  const { recordModalOpen, setRecordModalOpen, addMeeting } = useMeeting();

  const [platform, setPlatform] = useState<'google-meet' | 'zoom' | 'microsoft-teams'>('google-meet');
  const [meetingTitle, setMeetingTitle] = useState('Product Strategy & Edge AI Alignment');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [simulatedLiveDialogue, setSimulatedLiveDialogue] = useState<string[]>([
    'Fathom Bot: Connected to simulated audio stream.',
  ]);

  // Timer ticker
  // Timer ticker and simulated incoming live transcript lines
  useEffect(() => {
    if (!isRecording || isPaused) return;

    const liveQuotes = [
      'Alex Vance: "Let\'s make sure our edge proxy handles low latency gracefully."',
      'Elena Rostova: "The user experience for transcript scrubbing feels very snappy."',
      'Dr. Maya Lin: "Quantizing the model brought our latency down under 120 milliseconds."',
      'Marcus Thorne: "Failover tests in staging show 1.4 second reconnection time."',
      'Priya Sharma: "Confirming PII scrubbing is running on all ingest workers."',
      'Zoe Washington: "Enterprise clients are eager for the 90-second turnaround SLA."',
    ];

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next > 0 && next % 4 === 0) {
          const nextQuote = liveQuotes[Math.floor(next / 4) % liveQuotes.length];
          setSimulatedLiveDialogue((lines) => [...lines, nextQuote]);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording, isPaused]);

  if (!recordModalOpen) return null;

  const formatElapsed = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRecording(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    setSimulatedLiveDialogue(['Fathom Bot: Connected to simulated audio stream.']);
  };

  const handleStopAndSave = () => {
    // Generate processed meeting
    const duration = Math.max(60, elapsedSeconds);
    const newMeetingId = `meeting-sim-${Date.now()}`;

    const newMeeting: Meeting = {
      id: newMeetingId,
      title: meetingTitle.trim() || 'Simulated Live Meeting',
      date: `Today • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      createdAt: new Date().toISOString(),
      durationSeconds: duration,
      durationFormatted: `${Math.ceil(duration / 60)}m`,
      platform,
      category: 'Product',
      participants: [
        {
          id: 'spk-you',
          name: 'Ayan Aslam (You)',
          email: 'ayan@fathom.ai',
          role: 'Host',
          avatar: 'AA',
          color: '#3B82F6',
        },
        {
          id: 'spk-bot',
          name: 'Fathom Notetaker',
          email: 'notetaker@fathom.ai',
          role: 'AI Assistant',
          avatar: 'FN',
          color: '#8B5CF6',
        },
      ],
      summary: {
        overview: `Simulated recording captured via live mock flow. Meeting titled "${meetingTitle}" ran for ${formatElapsed(
          duration
        )} with real-time transcription and automatic action item synthesis.`,
        keyDecisions: [
          'Approved live edge proxy deployment configuration.',
          'Confirmed 90-second executive summary SLA target for clients.',
          'Verified simulated audio capture and real-time streaming pipeline.',
        ],
        templates: {
          'executive-brief': {
            title: 'Executive Brief',
            description: 'Executive summary generated from simulated session.',
            sections: [
              {
                title: 'Outcomes',
                items: [
                  'Simulated recording completed with zero audio packet loss.',
                  'Transcript processed and formatted according to Fathom schema.',
                ],
              },
            ],
          },
          'engineering-arch': {
            title: 'Engineering & Architecture',
            description: 'Technical notes.',
            sections: [
              {
                title: 'Live Ingest',
                items: ['Simulated 250ms WebRTC ingest frames received successfully.'],
              },
            ],
          },
          'sales-discovery': {
            title: 'Sales Notes',
            description: 'Commercial notes.',
            sections: [
              {
                title: 'Notes',
                items: ['Simulated meeting recorded in mock workspace.'],
              },
            ],
          },
          'one-on-one': {
            title: 'Team Notes',
            description: 'General notes.',
            sections: [
              {
                title: 'Notes',
                items: ['Simulated 1-on-1 capture completed.'],
              },
            ],
          },
          'customer-success': {
            title: 'Customer Ops',
            description: 'Ops notes.',
            sections: [
              {
                title: 'Notes',
                items: ['Simulated session completed.'],
              },
            ],
          },
        },
      },
      actionItems: [
        {
          id: `act-sim-1`,
          text: `Review post-meeting executive brief for ${meetingTitle}`,
          assigneeId: 'spk-you',
          assigneeName: 'Ayan Aslam',
          dueDate: 'Tomorrow',
          completed: false,
          timestampSeconds: 5,
          formattedTime: '00:05',
        },
      ],
      highlights: [
        {
          id: `hl-sim-1`,
          title: 'Live Call Recording Verification',
          quote: 'Simulated audio frames captured successfully with automated diarization.',
          speakerName: 'Fathom Notetaker',
          startTime: 10,
          formattedTime: '00:10',
          category: 'milestone',
        },
      ],
      transcript: simulatedLiveDialogue.map((line, idx) => {
        const parts = line.split(': ');
        const speaker = parts[0] || 'Speaker';
        const text = parts[1]?.replace(/"/g, '') || line;
        const timeSec = idx * 6;
        return {
          id: `seg-sim-${idx}`,
          speakerId: idx % 2 === 0 ? 'spk-you' : 'spk-bot',
          speakerName: speaker,
          startTime: timeSec,
          endTime: timeSec + 5,
          formattedTime: formatElapsed(timeSec),
          text,
        };
      }),
    };

    addMeeting(newMeeting);
    setRecordModalOpen(false);
  };

  const handleClose = () => {
    setIsRecording(false);
    setRecordModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <Radio className={`w-4 h-4 ${isRecording ? 'animate-pulse text-red-600' : ''}`} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Live Recording Assistant</h3>
              <p className="text-[11px] text-slate-500">Simulate Fathom bot joining a conference call</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mandatory Simulation Disclosure Banner */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold">Simulated Assistant Disclosure: </span>
            This is a local simulated recording workflow for demonstration. No microphone audio is accessed, and no third-party call connection (Zoom/Meet/Teams) is established.
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {!isRecording ? (
            /* Setup Phase */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:bg-white text-slate-900"
                  placeholder="e.g. Core Infrastructure Review"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Platform
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'google-meet', label: 'Google Meet', color: 'emerald' },
                    { id: 'zoom', label: 'Zoom', color: 'blue' },
                    { id: 'microsoft-teams', label: 'MS Teams', color: 'indigo' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p.id as 'google-meet' | 'zoom' | 'microsoft-teams')}
                      className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        platform === p.id
                          ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Bot Behavior</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  When you start recording, the simulated Fathom bot will enter the mock session, simulate incoming speaker dialogue, and compile an AI summary upon conclusion.
                </p>
              </div>

              <button
                type="button"
                onClick={handleStart}
                className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Start Simulated Recording</span>
              </button>
            </div>
          ) : (
            /* Active Recording Phase */
            <div className="space-y-4">
              {/* Live HUD */}
              <div className="bg-slate-950 text-white rounded-xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-ping inline-block" />
                    <span className="font-bold text-xs tracking-wider text-red-400 uppercase">
                      {isPaused ? 'REC PAUSED' : 'LIVE RECORDING'}
                    </span>
                  </div>
                  <div className="font-mono text-base font-bold text-white">
                    {formatElapsed(elapsedSeconds)}
                  </div>
                </div>

                {/* Animated Audio Waveform Bars */}
                <div className="h-10 flex items-center justify-center gap-1 bg-slate-900/60 rounded-lg px-2 overflow-hidden">
                  {[...Array(24)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-blue-500 rounded-full transition-all duration-150"
                      style={{
                        height: isPaused
                          ? '4px'
                          : `${Math.max(4, Math.sin(i * 0.5 + elapsedSeconds * 2) * 28 + 12)}px`,
                        opacity: isPaused ? 0.3 : 0.8,
                      }}
                    />
                  ))}
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Bot: Fathom Notetaker</span>
                  <span>Audio Ingest: 250ms chunks</span>
                </div>
              </div>

              {/* Streaming Dialogue Box */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 h-32 overflow-y-auto space-y-1.5 text-xs text-slate-700 font-mono">
                {simulatedLiveDialogue.map((item, idx) => (
                  <div key={idx} className="animate-in fade-in duration-200">
                    {item}
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="flex-1 py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleStopAndSave}
                  className="flex-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current text-red-400" />
                  <span>End & Generate Summary</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
