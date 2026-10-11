'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
} from 'lucide-react';

interface PresetDefinition {
  title: string;
  category: 'Product' | 'Engineering' | 'Executive' | 'Design' | 'Sales' | 'Operations';
  platform: 'google-meet' | 'zoom' | 'microsoft-teams';
  oneSentenceSummary: string;
  keyDecisions: string[];
  actionItems: { text: string; assigneeName: string; dueDate: string }[];
  dialogue: { speaker: string; text: string }[];
}

const SAAS_PRESETS: PresetDefinition[] = [
  {
    title: 'Client Discovery — TechCorp Enterprise',
    category: 'Sales',
    platform: 'zoom',
    oneSentenceSummary:
      'Evaluated TechCorp\'s 850-seat migration to automated call intelligence, confirming SOC2 compliance sign-off and scheduling a 30-day proof of concept.',
    keyDecisions: [
      'Approved 30-day sandbox pilot for 50 sales leaders starting next Monday.',
      'Confirmed enterprise pricing tier of $24/seat with volume discount applied.',
      'Secured Chief Information Security Officer sign-off pending SOC2 Type II report.',
    ],
    actionItems: [
      {
        text: 'Deliver SOC2 Type II report and FINRA compliance whitepaper to TechCorp legal',
        assigneeName: 'Ayan Aslam',
        dueDate: 'Friday',
      },
      {
        text: 'Provision staging SSO tenant with Okta SAML 2.0 integration',
        assigneeName: 'Alex Vance',
        dueDate: 'Monday',
      },
    ],
    dialogue: [
      { speaker: 'Fathom Bot', text: 'Connected to live Zoom conference room (1080p HD stream).' },
      { speaker: 'Ayan Aslam', text: 'Hi Sarah, thank you for joining our discovery session today.' },
      { speaker: 'Sarah Jenkins', text: 'Excited to be here. Our 850 account execs lose almost two hours daily manually logging CRM notes.' },
      { speaker: 'Ayan Aslam', text: 'Fathom syncs action items and summaries directly to Salesforce and HubSpot within seconds after call completion.' },
      { speaker: 'Sarah Jenkins', text: 'That addresses our biggest pain point. How does your transcription pipeline handle proprietary terminology?' },
      { speaker: 'Ayan Aslam', text: 'We offer custom vocabulary injection with phonetic boosting for tickers, acronyms, and product SKUs.' },
      { speaker: 'Sarah Jenkins', text: 'Fantastic. If our security team approves the SOC2 package, we are ready to pilot 50 seats next week.' },
      { speaker: 'Ayan Aslam', text: 'I will personally send over our security audit report and pilot agreement by 5 PM today.' },
      { speaker: 'Fathom Bot', text: 'Synthesizing action items and commercial terms for export.' },
    ],
  },
  {
    title: 'Q3 Roadmap & Edge AI Acceleration',
    category: 'Engineering',
    platform: 'google-meet',
    oneSentenceSummary:
      'Finalized engineering benchmarks for the 8-bit quantized streaming engine and approved Thursday\'s four-phase canary rollout across primary clusters.',
    keyDecisions: [
      'Standardized on 8-bit quantized streaming diarization yielding 48 tokens/second.',
      'Approved four-phase canary rollout starting Thursday at 09:00 UTC.',
      'Mandated strict 12-second ephemeral RAM buffer zeroization for customer audio data.',
    ],
    actionItems: [
      {
        text: 'Deploy Datadog APM monitors with automated rollback alerts for P99 latency > 500ms',
        assigneeName: 'Marcus Thorne',
        dueDate: 'Wednesday',
      },
      {
        text: 'Complete chaos failover test between us-east-1 and us-west-2 clusters',
        assigneeName: 'David Kalu',
        dueDate: 'Thursday',
      },
    ],
    dialogue: [
      { speaker: 'Fathom Bot', text: 'Connected to Google Meet session (real-time 250ms ingest).' },
      { speaker: 'Alex Vance', text: 'Welcome everyone. Today we sign off on the Q3 real-time inference architecture.' },
      { speaker: 'Dr. Maya Lin', text: 'Quantizing our streaming model brought first-token latency under 120ms with 98.4% attribution accuracy.' },
      { speaker: 'Marcus Thorne', text: 'Our edge ingest proxy handles WebRTC chunking cleanly with zero packet loss in load tests.' },
      { speaker: 'David Kalu', text: 'Active-active multi-region failover tests recovered in 1.4 seconds with zero audio syllables dropped.' },
      { speaker: 'Alex Vance', text: 'Outstanding results. Let\'s proceed with the four-phase canary deployment on Thursday.' },
      { speaker: 'Priya Sharma', text: 'Security review is fully green; automated RAM zeroization passed all assertions.' },
      { speaker: 'Fathom Bot', text: 'Live session recorded; indexing key technical decisions.' },
    ],
  },
  {
    title: 'Customer Success Quarterly Business Review',
    category: 'Operations',
    platform: 'microsoft-teams',
    oneSentenceSummary:
      'Reviewed enterprise renewal rates reaching 96% net retention and agreed on a priority support SLA for tier-1 accounts.',
    keyDecisions: [
      'Celebrated 96% net retention across top 40 enterprise accounts.',
      'Committed to 15-minute response SLA for critical enterprise escalations.',
      'Expanded customer onboarding team by 3 technical customer engineers.',
    ],
    actionItems: [
      {
        text: 'Publish updated quarterly benchmark report to customer advisory board',
        assigneeName: 'Zoe Washington',
        dueDate: 'Tuesday',
      },
      {
        text: 'Schedule quarterly business reviews with top 10 expansion prospects',
        assigneeName: 'Ayan Aslam',
        dueDate: 'Next Friday',
      },
    ],
    dialogue: [
      { speaker: 'Fathom Bot', text: 'Connected to Microsoft Teams call.' },
      { speaker: 'Zoe Washington', text: 'Hello team, let us review our Q3 customer health and retention numbers.' },
      { speaker: 'Ayan Aslam', text: 'Our net dollar retention reached 124% this quarter, largely driven by executive meeting summary adoption.' },
      { speaker: 'Zoe Washington', text: 'Customer satisfaction scores rose to 4.9 out of 5 since we introduced instant template switching.' },
      { speaker: 'Sam Chen', text: 'We observed average daily time saved per sales rep increase to 68 minutes.' },
      { speaker: 'Zoe Washington', text: 'Let us standardize this success framework for our Q4 enterprise onboarding cohort.' },
      { speaker: 'Fathom Bot', text: 'Session concluding; compiling customer metrics overview.' },
    ],
  },
  {
    title: 'Product Design & Mobile Scrubber Review',
    category: 'Design',
    platform: 'zoom',
    oneSentenceSummary:
      'Approved high-precision haptic feedback for the mobile video scrubber and finalized token exports for iOS Safari and desktop web.',
    keyDecisions: [
      'Approved 44px minimum touch targets on mobile scrubber for iOS Safari.',
      'Integrated subtle haptic vibration when scrubbing across key AI highlight moments.',
      'Standardized design system token variables across Tailwind CSS v4 stylesheets.',
    ],
    actionItems: [
      {
        text: 'Export finalized Figma component tokens for mobile timeline widgets',
        assigneeName: 'Elena Rostova',
        dueDate: 'Monday',
      },
      {
        text: 'Verify 60fps HTML5 canvas rendering performance on low-power mobile devices',
        assigneeName: 'Marcus Thorne',
        dueDate: 'Wednesday',
      },
    ],
    dialogue: [
      { speaker: 'Fathom Bot', text: 'Connected to Zoom design review.' },
      { speaker: 'Elena Rostova', text: 'Let us walk through the updated mobile video player and interactive scrubber.' },
      { speaker: 'Alex Vance', text: 'The tactile vibration when scrubbing over smart highlights feels remarkably intuitive.' },
      { speaker: 'Elena Rostova', text: 'We tuned the minimum touch target to 44 pixels so one-handed scrubbing is effortless.' },
      { speaker: 'Marcus Thorne', text: 'Canvas rendering keeps frame rates pinned at 60 frames per second without memory leaks.' },
      { speaker: 'Elena Rostova', text: 'Wonderful, I will export the Figma variables into our Tailwind theme today.' },
      { speaker: 'Fathom Bot', text: 'Design review complete; logging UX deliverables.' },
    ],
  },
];

interface ModalContentProps {
  initialPresetIndex: number;
  onClose: () => void;
  onSaved: () => void;
}

function RecordMeetingModalContent({
  initialPresetIndex,
  onClose,
  onSaved,
}: ModalContentProps) {
  const { addMeeting } = useMeeting();

  const [activePresetIndex, setActivePresetIndex] = useState(initialPresetIndex);
  const currentPreset = SAAS_PRESETS[activePresetIndex % SAAS_PRESETS.length];

  const [platform, setPlatform] = useState<'google-meet' | 'zoom' | 'microsoft-teams'>(
    currentPreset.platform
  );
  const [meetingTitle, setMeetingTitle] = useState(currentPreset.title);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [simulatedLiveDialogue, setSimulatedLiveDialogue] = useState<string[]>([
    `${currentPreset.dialogue[0].speaker}: ${currentPreset.dialogue[0].text}`,
  ]);

  const dialogueIndexRef = useRef(1);

  // Timer ticker and sequential incoming live transcript lines (no duplicates)
  useEffect(() => {
    if (!isRecording || isPaused) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        // Every 3 seconds, add next sequential dialogue line without repeating
        if (next > 0 && next % 3 === 0) {
          const preset = SAAS_PRESETS[activePresetIndex % SAAS_PRESETS.length];
          const currIdx = dialogueIndexRef.current;
          if (currIdx < preset.dialogue.length) {
            const lineObj = preset.dialogue[currIdx];
            dialogueIndexRef.current = currIdx + 1;
            setSimulatedLiveDialogue((prevLines) => [
              ...prevLines,
              `${lineObj.speaker}: "${lineObj.text}"`,
            ]);
          }
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording, isPaused, activePresetIndex]);

  const formatElapsed = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRecording(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    dialogueIndexRef.current = 1;
    const preset = SAAS_PRESETS[activePresetIndex % SAAS_PRESETS.length];
    setSimulatedLiveDialogue([`${preset.dialogue[0].speaker}: ${preset.dialogue[0].text}`]);
  };

  const handleCyclePreset = () => {
    const nextIdx = (activePresetIndex + 1) % SAAS_PRESETS.length;
    setActivePresetIndex(nextIdx);
    const nextPreset = SAAS_PRESETS[nextIdx];
    setMeetingTitle(nextPreset.title);
    setPlatform(nextPreset.platform);
    setSimulatedLiveDialogue([`${nextPreset.dialogue[0].speaker}: ${nextPreset.dialogue[0].text}`]);
  };

  const handleStopAndSave = () => {
    const duration = Math.max(60, elapsedSeconds);
    const newMeetingId = `meeting-sim-${Date.now()}`;
    const preset = SAAS_PRESETS[activePresetIndex % SAAS_PRESETS.length];

    // Compute realistic 1-sentence AI summary
    const summaryOverview =
      meetingTitle.trim() === preset.title
        ? preset.oneSentenceSummary
        : `Productive ${preset.category.toLowerCase()} session titled "${meetingTitle.trim()}" focused on key deliverables, aligning stakeholders, and confirming immediate execution milestones.`;

    const newMeeting: Meeting = {
      id: newMeetingId,
      title: meetingTitle.trim() || preset.title,
      date: `Today • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      createdAt: new Date().toISOString(),
      durationSeconds: duration,
      durationFormatted: `${Math.ceil(duration / 60)}m`,
      platform,
      category: preset.category,
      participants: [
        {
          id: 'spk-you',
          name: 'Ayan Aslam',
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
        {
          id: 'spk-guest',
          name: 'Sarah Jenkins',
          email: 'sarah@client.internal',
          role: 'VP Stakeholder',
          avatar: 'SJ',
          color: '#10B981',
        },
      ],
      summary: {
        overview: summaryOverview,
        keyDecisions: preset.keyDecisions,
        templates: {
          'executive-brief': {
            title: 'Executive Brief',
            description: 'Executive takeaways synthesized from live session.',
            sections: [
              {
                title: 'Key Outcomes',
                items: preset.keyDecisions,
              },
            ],
          },
          'engineering-arch': {
            title: 'Engineering & Delivery',
            description: 'Implementation specs and milestones.',
            sections: [
              {
                title: 'Technical Scope',
                items: [
                  'Validated WebRTC audio stream ingest with zero frame dropping.',
                  'Real-time diarization attribution mapped to verified participant profiles.',
                ],
              },
            ],
          },
          'sales-discovery': {
            title: 'Commercial Framework',
            description: 'Commercial and contractual terms.',
            sections: [
              {
                title: 'Next Milestones',
                items: [
                  'Deliver evaluation agreement to legal team.',
                  'Schedule executive sponsor briefing.',
                ],
              },
            ],
          },
          'one-on-one': {
            title: 'Team Notes',
            description: 'Internal sync notes.',
            sections: [
              {
                title: 'Action items',
                items: ['Follow up with attendees on key deliverables.'],
              },
            ],
          },
          'customer-success': {
            title: 'Account Health',
            description: 'Customer adoption notes.',
            sections: [
              {
                title: 'Health Score',
                items: ['Account in excellent standing with positive stakeholder feedback.'],
              },
            ],
          },
        },
      },
      actionItems: preset.actionItems.map((act, i) => ({
        id: `act-sim-${Date.now()}-${i}`,
        text: act.text,
        assigneeId: i === 0 ? 'spk-you' : 'spk-guest',
        assigneeName: act.assigneeName,
        dueDate: act.dueDate,
        completed: false,
        timestampSeconds: (i + 1) * 15,
        formattedTime: formatElapsed((i + 1) * 15),
      })),
      highlights: [
        {
          id: `hl-sim-${Date.now()}`,
          title: 'Key Strategic Alignment',
          quote: preset.dialogue[Math.min(3, preset.dialogue.length - 1)].text,
          speakerName: preset.dialogue[Math.min(3, preset.dialogue.length - 1)].speaker,
          startTime: 12,
          formattedTime: '00:12',
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
          speakerId: idx % 2 === 0 ? 'spk-you' : 'spk-guest',
          speakerName: speaker,
          startTime: timeSec,
          endTime: timeSec + 5,
          formattedTime: formatElapsed(timeSec),
          text,
        };
      }),
    };

    // Push new meeting to dashboard and select it
    addMeeting(newMeeting);
    onSaved();
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
            onClick={onClose}
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
            This is a local simulated recording workflow for demonstration. No microphone audio is accessed, and no third-party call connection is established.
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {!isRecording ? (
            /* Setup Phase */
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Meeting Title
                  </label>
                  <button
                    type="button"
                    onClick={handleCyclePreset}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Cycle SaaS Topic</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:bg-white text-slate-900"
                  placeholder="e.g. Client Discovery — TechCorp"
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
                  <span>Simulated AI Notetaker</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Topic: <span className="font-semibold text-slate-700">{currentPreset.category}</span>. Starting the recording simulates natural live speaker dialogue and automatically synthesizes a crisp 1-sentence AI summary upon conclusion.
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
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 h-36 overflow-y-auto space-y-1.5 text-xs text-slate-700 font-mono">
                {simulatedLiveDialogue.map((item, idx) => (
                  <div key={idx} className="animate-in fade-in duration-200 leading-relaxed">
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

export default function RecordMeetingModal() {
  const { recordModalOpen, setRecordModalOpen } = useMeeting();
  const [sessionCount, setSessionCount] = useState(0);

  if (!recordModalOpen) return null;

  return (
    <RecordMeetingModalContent
      key={sessionCount}
      initialPresetIndex={sessionCount}
      onClose={() => setRecordModalOpen(false)}
      onSaved={() => {
        setSessionCount((prev) => prev + 1);
        setRecordModalOpen(false);
      }}
    />
  );
}
