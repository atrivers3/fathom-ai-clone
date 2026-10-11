'use client';

import React, { useState } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { Meeting } from '@/types/meeting';
import {
  CheckCircle2,
  Circle,
  Plus,
  Calendar,
  User,
  Play,
} from 'lucide-react';

interface ActionItemListProps {
  meeting: Meeting;
}

export default function ActionItemList({ meeting }: ActionItemListProps) {
  const { toggleActionItem, addActionItem, seekTo, setIsPlaying } = useMeeting();

  const [newText, setNewText] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newDate, setNewDate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const completedCount = meeting.actionItems.filter((a) => a.completed).length;
  const totalCount = meeting.actionItems.length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    addActionItem(meeting.id, newText.trim(), newAssignee.trim(), newDate.trim());
    setNewText('');
    setNewAssignee('');
    setNewDate('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Action Items Header */}
      <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">Action Items</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
            {completedCount} of {totalCount} done
          </span>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Inline Add Task Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="p-3.5 bg-blue-50/40 border-b border-blue-100 space-y-2.5"
        >
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full text-xs p-2 bg-white rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-hidden"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              placeholder="Assignee (e.g. Alex)"
              className="flex-1 text-xs p-2 bg-white rounded-lg border border-slate-300 focus:border-blue-500 outline-hidden"
            />
            <input
              type="text"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              placeholder="Due date (e.g. Friday)"
              className="flex-1 text-xs p-2 bg-white rounded-lg border border-slate-300 focus:border-blue-500 outline-hidden"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2.5 py-2 text-slate-500 hover:text-slate-700 text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Action Items List */}
      <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
        {meeting.actionItems.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No action items extracted from this meeting.
          </div>
        ) : (
          meeting.actionItems.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border transition-all flex items-start gap-3 group ${
                item.completed
                  ? 'bg-slate-50/80 border-slate-200/60 opacity-75'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* Working interactive checkbox */}
              <button
                type="button"
                onClick={() => toggleActionItem(meeting.id, item.id)}
                className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                title={item.completed ? 'Mark uncompleted' : 'Mark completed'}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 hover:text-emerald-500" />
                )}
              </button>

              {/* Task Details */}
              <div className="flex-1 min-w-0 space-y-1">
                <p
                  className={`text-xs sm:text-sm font-medium leading-relaxed ${
                    item.completed
                      ? 'line-through text-slate-400'
                      : 'text-slate-800'
                  }`}
                >
                  {item.text}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{item.assigneeName}</span>
                  </span>

                  {item.dueDate && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{item.dueDate}</span>
                    </span>
                  )}

                  {item.timestampSeconds !== undefined && item.formattedTime && (
                    <button
                      type="button"
                      onClick={() => {
                        seekTo(item.timestampSeconds!);
                        setIsPlaying(true);
                      }}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline font-mono ml-auto cursor-pointer"
                      title="Play moment where this was assigned"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>{item.formattedTime}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
