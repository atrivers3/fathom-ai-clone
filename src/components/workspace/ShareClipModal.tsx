'use client';

import React, { useState } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import {
  X,
  Scissors,
  Copy,
  Check,
  Lock,
  Globe,
  Clock,
} from 'lucide-react';
import { Meeting, TranscriptSegment } from '@/types/meeting';

interface ModalContentProps {
  selectedMeeting: Meeting;
  clipInitialSegment: TranscriptSegment | null;
  onClose: () => void;
}

function ShareClipModalContent({
  selectedMeeting,
  clipInitialSegment,
  onClose,
}: ModalContentProps) {
  const defaultTitle = clipInitialSegment
    ? `Clip: ${clipInitialSegment.speakerName} — "${clipInitialSegment.text.slice(0, 45)}..."`
    : `Highlight from ${selectedMeeting.title}`;
  const defaultStart = clipInitialSegment ? clipInitialSegment.startTime : 0;
  const defaultEnd = clipInitialSegment
    ? Math.min(clipInitialSegment.startTime + 45, selectedMeeting.durationSeconds || 3600)
    : Math.min(60, selectedMeeting.durationSeconds);

  const [clipTitle, setClipTitle] = useState(defaultTitle);
  const [startSec, setStartSec] = useState(defaultStart);
  const [endSec, setEndSec] = useState(defaultEnd);
  const [copied, setCopied] = useState(false);
  const [sharePrivacy, setSharePrivacy] = useState<'public' | 'workspace'>('public');

  const clipDuration = Math.max(1, endSec - startSec);
  const generatedUrl = `https://fathom.video/share/clip-${selectedMeeting.id.slice(0, 8)}-${startSec}-${endSec}`;

  const formatSec = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Create & Share Video Clip</h3>
              <p className="text-[11px] text-slate-500">Trim key moments to share externally or in Slack</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {/* Clip Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Clip Title
            </label>
            <input
              type="text"
              value={clipTitle}
              onChange={(e) => setClipTitle(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:bg-white text-slate-900"
              placeholder="e.g. Maya explaining speculative decoding latency"
            />
          </div>

          {/* Time Trimmer */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Selected Interval</span>
              </span>
              <span className="font-mono text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                {formatSec(startSec)} → {formatSec(endSec)} ({clipDuration}s)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Start (Seconds): {formatSec(startSec)}
                </label>
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, endSec - 5)}
                  value={startSec}
                  onChange={(e) => setStartSec(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  End (Seconds): {formatSec(endSec)}
                </label>
                <input
                  type="range"
                  min={Math.min(startSec + 5, selectedMeeting.durationSeconds)}
                  max={selectedMeeting.durationSeconds}
                  value={endSec}
                  onChange={(e) => setEndSec(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Privacy setting */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-600 font-medium">Access Permissions:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setSharePrivacy('public')}
                className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                  sharePrivacy === 'public'
                    ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Globe className="w-3 h-3" />
                <span>Anyone with link</span>
              </button>
              <button
                onClick={() => setSharePrivacy('workspace')}
                className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                  sharePrivacy === 'workspace'
                    ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>Workspace only</span>
              </button>
            </div>
          </div>

          {/* Share Link Preview with Copy */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Shareable Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedUrl}
                className="flex-1 text-xs px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-mono select-all"
              />
              <button
                onClick={handleCopy}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Pre-sanitized HLS byte manifest • PII stripped
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShareClipModal() {
  const { clipModalOpen, setClipModalOpen, clipInitialSegment, selectedMeeting } = useMeeting();

  if (!clipModalOpen || !selectedMeeting) return null;

  return (
    <ShareClipModalContent
      key={clipInitialSegment ? clipInitialSegment.id : selectedMeeting.id}
      selectedMeeting={selectedMeeting}
      clipInitialSegment={clipInitialSegment}
      onClose={() => setClipModalOpen(false)}
    />
  );
}
