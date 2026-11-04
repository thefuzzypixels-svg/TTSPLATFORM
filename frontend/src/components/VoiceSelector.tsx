'use client';

import React, { useState, useMemo } from 'react';
import { Voice } from '../lib/api';
import { Mic, Search, Globe, User, Check, RefreshCw } from 'lucide-react';

interface VoiceSelectorProps {
  voices: Voice[];
  selectedVoice: string;
  onSelectVoice: (voiceShortName: string) => void;
  loading?: boolean;
  onRefreshVoices?: () => void;
}

export default function VoiceSelector({
  voices,
  selectedVoice,
  onSelectVoice,
  loading = false,
  onRefreshVoices,
}: VoiceSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Female' | 'Male'>('All');

  // Filter voices based on search and gender
  const filteredVoices = useMemo(() => {
    return voices.filter((v) => {
      const matchesSearch =
        v.friendlyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.locale.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGender =
        genderFilter === 'All' || v.gender.toLowerCase() === genderFilter.toLowerCase();

      return matchesSearch && matchesGender;
    });
  }, [voices, searchTerm, genderFilter]);

  const currentSelectedVoiceObj = useMemo(() => {
    return voices.find((v) => v.shortName === selectedVoice);
  }, [voices, selectedVoice]);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-lg">
          <Mic className="w-5 h-5 text-emerald-400" />
          <span>Voice Selection</span>
        </div>
        {onRefreshVoices && (
          <button
            onClick={onRefreshVoices}
            disabled={loading}
            className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
            title="Refresh voices"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}
      </div>

      {/* Selected Voice summary badge */}
      {currentSelectedVoiceObj && (
        <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              {currentSelectedVoiceObj.gender === 'Female' ? 'F' : 'M'}
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-200">
                {currentSelectedVoiceObj.friendlyName || currentSelectedVoiceObj.shortName}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>{currentSelectedVoiceObj.locale}</span>
                <span>•</span>
                <span>{currentSelectedVoiceObj.gender}</span>
              </p>
            </div>
          </div>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 font-medium px-2 py-0.5 rounded-full border border-emerald-500/30">
            Selected
          </span>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search voice, language (e.g. en-US, Urdu, Hindi)..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Gender Filter Tabs */}
        <div className="flex rounded-lg bg-slate-950/50 p-1 border border-slate-800/80">
          {(['All', 'Female', 'Male'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setGenderFilter(filter)}
              className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
                genderFilter === filter
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Voice list scroll area */}
      <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading voices from Edge TTS...</div>
        ) : filteredVoices.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">No voices matching your filter.</div>
        ) : (
          filteredVoices.map((v) => {
            const isSelected = v.shortName === selectedVoice;
            return (
              <button
                key={v.shortName}
                onClick={() => onSelectVoice(v.shortName)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-950/30 border-emerald-500/60 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/70 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {v.gender === 'Female' ? 'F' : 'M'}
                  </div>
                  <div className="truncate">
                    <p className={`text-xs font-medium truncate ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                      {v.friendlyName || v.shortName}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {v.locale} ({v.shortName})
                    </p>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
