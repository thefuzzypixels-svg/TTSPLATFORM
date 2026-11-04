'use client';

import React from 'react';
import { Sliders, RotateCcw, Gauge, Volume2, Music2 } from 'lucide-react';

interface VoiceSettingsProps {
  rate: number;
  pitch: number;
  volume: number;
  onChangeRate: (val: number) => void;
  onChangePitch: (val: number) => void;
  onChangeVolume: (val: number) => void;
  onReset: () => void;
}

export default function VoiceSettings({
  rate,
  pitch,
  volume,
  onChangeRate,
  onChangePitch,
  onChangeVolume,
  onReset,
}: VoiceSettingsProps) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-lg">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <span>Voice Settings</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          title="Reset to default settings"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="space-y-4">
        {/* Speed / Rate Slider */}
        <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <span>Speed / Rate</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {rate >= 0 ? `+${rate}%` : `${rate}%`}
            </span>
          </div>
          <input
            type="range"
            min={-50}
            max={100}
            step={5}
            value={rate}
            onChange={(e) => onChangeRate(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Slower (-50%)</span>
            <span>Normal (0%)</span>
            <span>Faster (+100%)</span>
          </div>
        </div>

        {/* Pitch Slider */}
        <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Music2 className="w-4 h-4 text-cyan-400" />
              <span>Pitch</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {pitch >= 0 ? `+${pitch}Hz` : `${pitch}Hz`}
            </span>
          </div>
          <input
            type="range"
            min={-50}
            max={50}
            step={2}
            value={pitch}
            onChange={(e) => onChangePitch(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Deeper (-50Hz)</span>
            <span>Natural (0Hz)</span>
            <span>Higher (+50Hz)</span>
          </div>
        </div>

        {/* Volume Slider */}
        <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <span>Volume</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {volume >= 0 ? `+${volume}%` : `${volume}%`}
            </span>
          </div>
          <input
            type="range"
            min={-50}
            max={50}
            step={5}
            value={volume}
            onChange={(e) => onChangeVolume(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Softer (-50%)</span>
            <span>Normal (0%)</span>
            <span>Louder (+50%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
