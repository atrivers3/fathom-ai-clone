'use client';

import React, { useState } from 'react';
import {
  Settings,
  Calendar,
  Bot,
  Zap,
  Check,
  Info,
} from 'lucide-react';

export default function SettingsView() {
  const [autoJoin, setAutoJoin] = useState(true);
  const [sendSummaryEmail, setSendSummaryEmail] = useState(true);
  const [piiRedaction, setPiiRedaction] = useState(true);
  const [defaultTemplate, setDefaultTemplate] = useState('executive-brief');
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
          <Settings className="w-4 h-4" />
          <span>Workspace Preferences</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Settings & Integrations
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Configure meeting assistant bot behaviors, calendar syncing, privacy compliance, and default intelligence templates.
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {/* Integrations Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Calendar & Video Integrations</span>
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">Google Calendar</div>
                <div className="text-slate-500">Connected as ayan@fanthom.ai</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                Connected (Simulated)
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">Google Meet & Zoom</div>
                <div className="text-slate-500">Auto-join scheduled video calls</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                Authorized
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">Slack & Notion Sync</div>
                <div className="text-slate-500">Auto-publish summaries to designated team channels</div>
              </div>
              <button
                type="button"
                onClick={handleSave}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] cursor-pointer"
              >
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Bot Recording Behavior */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-600" />
            <span>Notetaker Bot Behavior</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 block">
                  Automatically join all calendar meetings
                </span>
                <span className="text-slate-500 text-[11px]">
                  Bot joins with the name &quot;Fathom Notetaker (Ayan Aslam)&quot;
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoJoin}
                onChange={(e) => setAutoJoin(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 block">
                  Automated PII Redaction
                </span>
                <span className="text-slate-500 text-[11px]">
                  Scrub credit card numbers, passwords, and tokens before storage
                </span>
              </div>
              <input
                type="checkbox"
                checked={piiRedaction}
                onChange={(e) => setPiiRedaction(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 block">
                  Email Executive Brief upon meeting conclusion
                </span>
                <span className="text-slate-500 text-[11px]">
                  Guaranteed 90-second turnaround after call ends
                </span>
              </div>
              <input
                type="checkbox"
                checked={sendSummaryEmail}
                onChange={(e) => setSendSummaryEmail(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* AI Model Intelligence */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>AI Model & Summary Settings</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Default Summary Preset
              </label>
              <select
                value={defaultTemplate}
                onChange={(e) => setDefaultTemplate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:border-blue-500 outline-hidden cursor-pointer"
              >
                <option value="executive-brief">Executive Brief (Standard)</option>
                <option value="engineering-arch">Engineering & Architecture</option>
                <option value="sales-discovery">Sales Discovery (BANT)</option>
                <option value="one-on-one">1-on-1 Feedback & Growth</option>
                <option value="customer-success">Customer Success QBR</option>
              </select>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200/60 text-[11px] text-blue-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Fathom uses quantized 8-bit diarization embeddings with 70B speculative decoding to deliver sub-second summary generation and verified grounding citations.
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500">
            {savedNotification ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Settings saved successfully!
              </span>
            ) : (
              'Changes are saved to your local session.'
            )}
          </span>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
