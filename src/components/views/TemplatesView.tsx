'use client';

import React, { useState } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import {
  FileText,
  Layers,
  ArrowRight,
  Code,
  Briefcase,
  Users,
  HeartHandshake,
} from 'lucide-react';
import { SummaryTemplateType } from '@/types/meeting';

export default function TemplatesView() {
  const { setSelectedMeetingId, setActiveView } = useMeeting();
  const [selectedTemplate, setSelectedTemplate] = useState<SummaryTemplateType>('executive-brief');

  const templatesList: {
    id: SummaryTemplateType;
    title: string;
    icon: React.ReactNode;
    badge: string;
    description: string;
    sections: { name: string; detail: string }[];
  }[] = [
    {
      id: 'executive-brief',
      title: 'Executive Brief',
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      badge: 'Most Popular',
      description:
        'Synthesizes high-level strategy, key decisions made, critical risks or blockers, and next steps for C-suite and leadership.',
      sections: [
        { name: 'Executive Overview', detail: 'Concise 3-sentence summary of the meeting objective and conclusions.' },
        { name: 'Key Decisions', detail: 'Firm decisions agreed upon by all participants with owner attribution.' },
        { name: 'Risks & Blockers', detail: 'Potential vulnerabilities, compliance concerns, or timeline risks.' },
        { name: 'Next Steps', detail: 'High priority deliverables and immediate milestones.' },
      ],
    },
    {
      id: 'engineering-arch',
      title: 'Engineering & Architecture',
      icon: <Code className="w-5 h-5 text-indigo-600" />,
      badge: 'Technical',
      description:
        'Focuses on technical decisions, latency budgets, API contracts, deployment schedules, and architectural diagrams.',
      sections: [
        { name: 'Technical Decisions', detail: 'Quantization choices, protocols, database changes, and framework picks.' },
        { name: 'Latency & Throughput Targets', detail: 'P95/P99 latency thresholds, GPU VRAM allocations, and RPS soak test results.' },
        { name: 'Failover & Disaster Recovery', detail: 'Active-active region specifications and automated rollback triggers.' },
        { name: 'Pull Requests & Deployments', detail: 'Staging canary progression and monitoring alert configs.' },
      ],
    },
    {
      id: 'sales-discovery',
      title: 'Sales Discovery (BANT Framework)',
      icon: <Briefcase className="w-5 h-5 text-emerald-600" />,
      badge: 'Revenue',
      description:
        'Standard qualification framework for enterprise sales calls: Budget, Authority, Need, and Timeline.',
      sections: [
        { name: 'Budget', detail: 'Approved funds, procurement timeline, and contract value estimates.' },
        { name: 'Authority', detail: 'Decision makers, economic buyers, legal approvers, and champions.' },
        { name: 'Need & Pain Points', detail: 'Current workflow bottlenecks and operational costs of doing nothing.' },
        { name: 'Timeline & Next Steps', detail: 'Pilot start date, security review deadlines, and target go-live.' },
      ],
    },
    {
      id: 'one-on-one',
      title: '1-on-1 Feedback & Growth',
      icon: <Users className="w-5 h-5 text-purple-600" />,
      badge: 'People',
      description:
        'Structures manager-report check-ins around wins, roadblocks, professional development, and mutual feedback.',
      sections: [
        { name: 'Wins & Progress', detail: 'Key accomplishments achieved during the previous sprint.' },
        { name: 'Roadblocks & Support Needed', detail: 'Interdepartmental dependencies and resource asks.' },
        { name: 'Career & Coaching', detail: 'Long-term leadership trajectory and skill growth targets.' },
        { name: 'Mutual Commitments', detail: 'Agreed action items for both parties before the next check-in.' },
      ],
    },
    {
      id: 'customer-success',
      title: 'Customer Success & Ops QBR',
      icon: <HeartHandshake className="w-5 h-5 text-rose-600" />,
      badge: 'Client Retention',
      description:
        'Tracks client health metrics, adoption feedback, feature requests, and renewal readiness.',
      sections: [
        { name: 'Account Health', detail: 'Active user seat count, usage frequency, and ROI benchmarks.' },
        { name: 'Feature Requests', detail: 'High priority feature enhancements logged for the product team.' },
        { name: 'Support SLA Review', detail: 'Ticket resolution velocity and operational war-room coverage.' },
        { name: 'Renewal Strategy', detail: 'Expansion opportunities and contract amendment terms.' },
      ],
    },
  ];

  const activeTemplate = templatesList.find((t) => t.id === selectedTemplate)!;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Fathom Intelligence Presets</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          AI Summary Templates
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Fathom automatically extracts an entity graph of decisions, commitments, and metrics from every meeting. Switch between templates instantly without paying extra token latency or re-prompting.
        </p>
      </div>

      {/* Grid: Templates list on left, template details on right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Template Selector Cards (5 cols) */}
        <div className="md:col-span-5 space-y-2.5">
          {templatesList.map((tmpl) => {
            const isSelected = selectedTemplate === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      {tmpl.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {tmpl.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {tmpl.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 pl-9">
                  {tmpl.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Template Preview Inspector (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                {activeTemplate.icon}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {activeTemplate.title}
                </h3>
                <span className="text-xs text-slate-400">Template Specification</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedMeetingId('meeting-8p-60m');
                setActiveView('meetings');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Test on 8-Person Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200/60">
            {activeTemplate.description}
          </p>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Generated Document Sections ({activeTemplate.sections.length})
            </h4>

            <div className="space-y-2.5">
              {activeTemplate.sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span>{sec.name}</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-3.5 leading-relaxed">
                    {sec.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
