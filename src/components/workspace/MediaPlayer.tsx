'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { Meeting } from '@/types/meeting';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Video,
  Mic,
  MicOff,
  Sparkles,
} from 'lucide-react';

interface MediaPlayerProps {
  meeting: Meeting;
}

export default function MediaPlayer({ meeting }: MediaPlayerProps) {
  const {
    currentTime,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    seekTo,
  } = useMeeting();

  const [isMuted, setIsMuted] = useState(false);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Format seconds into mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    const s = Math.max(0, Math.floor(secs));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = Math.floor(s % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const progressPercent =
    meeting.durationSeconds > 0
      ? (currentTime / meeting.durationSeconds) * 100
      : 0;

  // Determine current active speaker and current transcript line
  const currentSegment =
    meeting.transcript.find(
      (s) => currentTime >= s.startTime && currentTime <= s.endTime
    ) ||
    meeting.transcript.reduce(
      (prev, curr) => (curr.startTime <= currentTime ? curr : prev),
      meeting.transcript[0]
    ) ||
    meeting.transcript[0];

  const activeSpeaker =
    meeting.participants.find(
      (p) =>
        p.id === currentSegment?.speakerId ||
        p.name.toLowerCase() === currentSegment?.speakerName.toLowerCase()
    ) ||
    meeting.participants[0] || {
      id: 'spk-default',
      name: currentSegment?.speakerName || 'Speaker',
      role: 'Participant',
      avatar: 'SP',
      color: '#3B82F6',
    };

  // Other participants for gallery preview (excluding current speaker)
  const otherParticipants = meeting.participants
    .filter((p) => p.name !== activeSpeaker.name)
    .slice(0, 3);

  // Draw simulated dynamic waveform on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const barCount = 100;
    const barWidth = width / barCount;
    const currentProgressRatio = currentTime / (meeting.durationSeconds || 1);

    for (let i = 0; i < barCount; i++) {
      const positionRatio = i / barCount;
      // Deterministic waveform pattern
      const seed = Math.sin(i * 0.45) * Math.cos(i * 0.22) * 0.5 + 0.5;
      const baseHeight = 4 + seed * (height - 8);

      const x = i * barWidth;
      const y = (height - baseHeight) / 2;

      // Color active vs upcoming
      if (positionRatio <= currentProgressRatio) {
        ctx.fillStyle = '#60A5FA'; // vivid sky blue
      } else {
        ctx.fillStyle = '#475569'; // muted slate
      }

      ctx.beginPath();
      ctx.roundRect(x + 1, y, barWidth - 2, baseHeight, 1.5);
      ctx.fill();
    }
  }, [currentTime, meeting.durationSeconds]);

  // Handle scrubber click on waveform
  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(Math.floor(ratio * meeting.durationSeconds));
  };

  const handleWaveformMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setHoveredTime(Math.floor(ratio * meeting.durationSeconds));
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl select-none group">
      {/* Top Overlay Header: Watermark & Active Speaker Badge */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 sm:p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
        {/* Left: Watermark */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-wider font-semibold text-white/90 flex items-center gap-2 shadow-md">
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying ? 'bg-red-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span className="flex items-center gap-1.5">
              <Video className="w-3 h-3 text-blue-400" />
              SIMULATED VIDEO PLAYBACK
            </span>
            <span className="text-slate-400 text-[10px]">1080p HD</span>
          </div>
        </div>

        {/* Right: Active Speaker HUD */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-[11px] text-slate-200 flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              Speaking:
            </span>
            <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]">
              {activeSpeaker.name}
            </span>
          </div>
        </div>
      </div>

      {/* Center Simulated Video Viewport */}
      <div className="relative aspect-video w-full flex items-center justify-center bg-radial from-slate-900 to-slate-950 p-4 pt-12 pb-24 overflow-hidden">
        {/* Subtle grid background to simulate video conference stage */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* Active Speaker Main Video Tile */}
        <div className="relative w-full max-w-lg aspect-16/10 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/70 shadow-2xl flex flex-col items-center justify-center p-6 text-center transition-all">
          {/* Animated sound ripple behind avatar when playing */}
          <div className="relative mb-3">
            {isPlaying && (
              <div
                style={{ borderColor: activeSpeaker.color }}
                className="absolute -inset-2 rounded-full border-2 border-dashed opacity-40 animate-spin"
              />
            )}
            <div
              style={{ backgroundColor: activeSpeaker.color }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full text-white text-xl sm:text-2xl font-bold flex items-center justify-center ring-4 ring-white/10 shadow-xl select-none"
            >
              {activeSpeaker.avatar}
            </div>
            {/* Live Audio Indicator icon */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <Mic className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="font-bold text-white text-sm sm:text-base">
            {activeSpeaker.name}
          </div>
          <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">
            {activeSpeaker.role}
          </div>

          {/* Live Subtitle / Closed Caption overlay */}
          {currentSegment && (
            <div className="mt-4 max-w-[95%] px-3.5 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-white text-xs sm:text-sm font-medium leading-snug shadow-lg animate-in fade-in duration-200">
              <span className="text-blue-400 font-semibold mr-1.5">
                {currentSegment.speakerName.split(' ')[0]}:
              </span>
              &ldquo;{currentSegment.text}&rdquo;
            </div>
          )}
        </div>

        {/* Gallery Preview Strip on Right (Google Meet / Zoom style) */}
        {otherParticipants.length > 0 && (
          <div className="hidden md:flex flex-col gap-2 absolute right-4 top-14 bottom-26 justify-center z-10 pointer-events-none">
            {otherParticipants.map((p) => (
              <div
                key={p.id}
                className="w-24 sm:w-28 aspect-16/10 rounded-lg bg-slate-900/90 border border-slate-800 shadow-md p-1.5 flex flex-col items-center justify-center relative backdrop-blur-xs"
              >
                <div
                  style={{ backgroundColor: p.color }}
                  className="w-7 h-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center ring-1 ring-white/20"
                >
                  {p.avatar}
                </div>
                <span className="text-[10px] text-slate-300 font-medium truncate max-w-[85px] mt-1">
                  {p.name.split(' ')[0]}
                </span>
                <MicOff className="w-2.5 h-2.5 text-slate-500 absolute bottom-1 right-1" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Overlaid Glassmorphic Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-3 sm:p-4 bg-gradient-to-t from-black via-black/90 to-transparent pt-8 space-y-2.5">
        {/* Waveform Scrubber Surface */}
        <div
          onClick={handleWaveformClick}
          onMouseMove={handleWaveformMouseMove}
          onMouseLeave={() => setHoveredTime(null)}
          className="relative w-full h-8 bg-slate-900/80 hover:bg-slate-900 rounded-lg overflow-hidden cursor-pointer group/scrubber flex items-center px-1 border border-slate-800/80 transition-colors"
          title="Click or drag anywhere to seek video & transcript"
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={32}
            className="w-full h-full block"
          />

          {/* Current position scrubber needle & glow */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-blue-400 pointer-events-none transition-all duration-75"
            style={{ left: `${progressPercent}%` }}
          >
            <div className="w-3 h-3 -ml-1.25 -mt-0.5 rounded-full bg-blue-400 shadow-md shadow-blue-400/80 ring-2 ring-white" />
          </div>

          {/* Hover time tooltip */}
          {hoveredTime !== null && (
            <div
              className="absolute -top-7 px-1.5 py-0.5 rounded bg-black/90 text-[10px] font-mono text-white border border-slate-700 pointer-events-none -translate-x-1/2"
              style={{
                left: `${(hoveredTime / (meeting.durationSeconds || 1)) * 100}%`,
              }}
            >
              {formatTime(hoveredTime)}
            </div>
          )}
        </div>

        {/* Action Controls & Metadata Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Controls: Rewind, Play/Pause, Forward, Time Display */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => seekTo(currentTime - 10)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Jump back 10 seconds (J / Left Arrow)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 transition-transform active:scale-95 cursor-pointer"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => seekTo(currentTime + 10)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Jump forward 10 seconds (L / Right Arrow)"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Time display */}
            <div className="font-mono text-xs font-semibold text-slate-200 ml-1.5 sm:ml-3 flex items-center gap-1">
              <span>{formatTime(currentTime)}</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">
                {formatTime(meeting.durationSeconds)}
              </span>
            </div>
          </div>

          {/* Right Controls: Speed Selector, Mute, Quality */}
          <div className="flex items-center gap-2.5">
            {/* Speed Selector */}
            <div className="flex items-center gap-0.5 bg-slate-900/90 rounded-lg p-0.5 border border-slate-800">
              {[1, 1.25, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-1.5 sm:px-2 py-0.5 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    playbackSpeed === speed
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Mute button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* Quality pill */}
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-slate-300 font-semibold border border-white/10">
              <Sparkles className="w-2.5 h-2.5 text-blue-400" />
              HD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
