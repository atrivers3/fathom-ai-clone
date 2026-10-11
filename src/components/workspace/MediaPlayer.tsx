'use client';

import React, { useRef, useEffect } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { Meeting } from '@/types/meeting';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Info,
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

  const [isMuted, setIsMuted] = React.useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Format seconds into mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = Math.floor(secs % 60);

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

  // Draw simulated dynamic waveform on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const barCount = 120;
    const barWidth = width / barCount;
    const currentProgressRatio = currentTime / (meeting.durationSeconds || 1);

    for (let i = 0; i < barCount; i++) {
      // Deterministic waveform pattern with gentle fluctuation
      const positionRatio = i / barCount;
      const seed = Math.sin(i * 0.35) * Math.cos(i * 0.15) * 0.5 + 0.5;
      const baseHeight = 6 + seed * (height - 12);
      
      const x = i * barWidth;
      const y = (height - baseHeight) / 2;

      // Color active vs upcoming
      if (positionRatio <= currentProgressRatio) {
        ctx.fillStyle = '#3B82F6'; // active blue
      } else {
        ctx.fillStyle = '#CBD5E1'; // inactive slate
      }

      ctx.beginPath();
      ctx.roundRect(x + 1, y, barWidth - 2, baseHeight, 2);
      ctx.fill();
    }
  }, [currentTime, meeting.durationSeconds]);

  // Handle scrubber click on canvas/waveform
  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(Math.floor(ratio * meeting.durationSeconds));
  };

  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm border border-slate-800 space-y-3">
      {/* Simulation disclosure banner */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-1.5 text-blue-400">
          <Info className="w-3.5 h-3.5" />
          <span className="font-medium">Simulated Audio Playback</span>
        </div>
        <span className="text-slate-400">
          Synchronized to live transcript below
        </span>
      </div>

      {/* Waveform Scrubber Surface */}
      <div
        onClick={handleWaveformClick}
        className="relative w-full h-12 bg-slate-950/60 rounded-lg overflow-hidden cursor-pointer group flex items-center px-1"
        title="Click anywhere to seek"
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={48}
          className="w-full h-full block"
        />

        {/* Current position scrubber needle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-blue-400 pointer-events-none transition-all duration-75"
          style={{ left: `${progressPercent}%` }}
        >
          <div className="w-2.5 h-2.5 -ml-1 rounded-full bg-blue-400 shadow-md shadow-blue-500/50" />
        </div>
      </div>

      {/* Controls & Time display */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Play / Skip Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => seekTo(currentTime - 10)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Jump back 10 seconds (J)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-600/30 transition-transform active:scale-95 cursor-pointer"
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Jump forward 10 seconds (L)"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Time display */}
          <div className="font-mono text-xs font-semibold text-slate-300 ml-2">
            <span>{formatTime(currentTime)}</span>
            <span className="text-slate-400 mx-1">/</span>
            <span className="text-slate-400">
              {formatTime(meeting.durationSeconds)}
            </span>
          </div>
        </div>

        {/* Right side: Speed and Volume */}
        <div className="flex items-center gap-3">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
            {[1, 1.25, 1.5, 2].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
