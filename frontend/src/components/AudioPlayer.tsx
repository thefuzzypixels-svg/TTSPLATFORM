'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Volume2, Music, CheckCircle2 } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string | null;
  fileName?: string;
  voiceName?: string;
}

export default function AudioPlayer({ audioUrl, fileName, voiceName }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.error('Audio play error:', err));
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  if (!audioUrl) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center shadow-lg">
        <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-500 mx-auto flex items-center justify-center mb-3">
          <Music className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-300">No Audio Generated Yet</h4>
        <p className="text-xs text-slate-500 mt-1">
          Type your text above, choose a voice and settings, then click &ldquo;Generate Speech&rdquo;.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 truncate max-w-xs md:max-w-md">
              {fileName || 'Generated Speech Audio'}
            </h4>
            <p className="text-xs text-slate-400">Voice: {voiceName || 'Microsoft Neural Voice'}</p>
          </div>
        </div>

        <a
          href={audioUrl}
          download={fileName || 'speech.mp3'}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download MP3</span>
        </a>
      </div>

      {/* Player Controls */}
      <div className="space-y-3">
        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <span className="text-xs font-mono text-slate-400 w-10">
            {formatTime(duration)}
          </span>
        </div>

        {/* Buttons and volume */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <span className="text-xs font-medium text-slate-300">
              {isPlaying ? 'Playing Audio' : 'Click Play to Listen'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
