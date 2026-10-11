'use client';

import React, { useState } from 'react';
import { Meeting, SummaryTemplateType } from '@/types/meeting';
import {
  Copy,
  Check,
  Sparkles,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface SummaryViewerProps {
  meeting: Meeting;
}

export default function SummaryViewer({ meeting }: SummaryViewerProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<SummaryTemplateType>('executive-brief');
  const [copied, setCopied] = useState(false);

  const templateOptions: { id: SummaryTemplateType; label: string; icon: string }[] = [
    { id: 'executive-brief', label: 'Executive Brief', icon: '📄' },
    { id: 'engineering-arch', label: 'Engineering & Architecture', icon: '⚙️' },
    { id: 'sales-discovery', label: 'Sales Discovery (BANT)', icon: '💼' },
    { id: 'one-on-one', label: '1-on-1 Feedback & Growth', icon: '👥' },
    { id: 'customer-success', label: 'Customer Success & Ops', icon: '🤝' },
  ];

  // Active template data fallback
  const activeTemplateData =
    meeting.summary.templates[selectedTemplate] ||
    meeting.summary.templates['executive-brief'];

  const handleCopySummary = () => {
    let text = `# ${meeting.title}\n${meeting.date}\n\n## Overview\n${meeting.summary.overview}\n\n## Key Decisions\n`;
    meeting.summary.keyDecisions.forEach((d) => (text += `- ${d}\n`));
    text += `\n## ${activeTemplateData.title}\n`;
    activeTemplateData.sections.forEach((sec) => {
      text += `\n### ${sec.title}\n`;
      sec.items.forEach((item) => (text += `- ${item}\n`));
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Top Template Switcher Toolbar */}
      <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Template:</span>
          </div>

          {/* Template Dropdown */}
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value as SummaryTemplateType)}
            className="text-xs bg-white font-semibold text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-blue-500 cursor-pointer shadow-2xs"
          >
            {templateOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.icon} {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Copy Summary Action */}
        <button
          onClick={handleCopySummary}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600">Copied Markdown!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Content Body */}
      <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
        {/* Template Description Banner */}
        <div className="bg-blue-50/60 border border-blue-200/60 rounded-lg p-3 flex items-start gap-2.5 text-xs text-blue-900">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">{activeTemplateData.title}: </span>
            <span className="text-blue-800">{activeTemplateData.description}</span>
          </div>
        </div>

        {/* Meeting Overview */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Executive Overview
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200/60">
            {meeting.summary.overview}
          </p>
        </div>

        {/* Key Decisions Callout */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Key Decisions ({meeting.summary.keyDecisions.length})</span>
          </div>
          <div className="space-y-2">
            {meeting.summary.keyDecisions.map((decision, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 bg-emerald-50/40 border border-emerald-200/60 rounded-lg p-3"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </div>
                <span className="leading-relaxed font-medium">{decision}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Template Sections */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Template Breakdown: {activeTemplateData.title}
          </div>

          {activeTemplateData.sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-2">
              <h5 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>{section.title}</span>
              </h5>
              <ul className="space-y-1.5 pl-3 border-l-2 border-slate-200">
                {section.items.map((item, iIdx) => (
                  <li
                    key={iIdx}
                    className="text-xs sm:text-sm text-slate-700 leading-relaxed list-disc list-inside pl-1"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
