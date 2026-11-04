'use client';

import React, { useState, useEffect } from 'react';
import TextEditor from '../components/TextEditor';
import VoiceSelector from '../components/VoiceSelector';
import VoiceSettings from '../components/VoiceSettings';
import AudioPlayer from '../components/AudioPlayer';
import { getVoices, synthesizeSpeech, Voice, SynthesisResponse } from '../lib/api';
import { Radio, Loader2, Sparkles, History, Volume2, AlertCircle } from 'lucide-react';

interface GenerationHistoryItem {
  id: string;
  text: string;
  voice: string;
  audioUrl: string;
  fileName: string;
  time: string;
}

export default function Home() {
  const [text, setText] = useState('Welcome to our Edge TTS Platform. Experience natural, high-fidelity neural speech synthesis powered by Microsoft Edge Read Aloud technology.');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('en-US-AriaNeural');
  const [loadingVoices, setLoadingVoices] = useState(true);

  // Settings
  const [rate, setRate] = useState(0); // 0%
  const [pitch, setPitch] = useState(0); // 0Hz
  const [volume, setVolume] = useState(0); // 0%

  // Synthesis state
  const [synthesizing, setSynthesizing] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<{
    audioUrl: string;
    fileName: string;
    voiceName: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);

  // Fetch voices on mount
  useEffect(() => {
    fetchVoicesList();
  }, []);

  const fetchVoicesList = async () => {
    setLoadingVoices(true);
    setError(null);
    try {
      const voiceList = await getVoices();
      setVoices(voiceList);
      if (voiceList.length > 0 && !voiceList.some((v) => v.shortName === selectedVoice)) {
        setSelectedVoice(voiceList[0].shortName);
      }
    } catch (err: unknown) {
      console.warn('Backend not responding yet or failed to load voices, using fallback presets.', err);
      // Fallback curated voices
      const fallbackList: Voice[] = [
        { name: 'Aria', shortName: 'en-US-AriaNeural', gender: 'Female', locale: 'en-US', friendlyName: 'Aria (US English)' },
        { name: 'Guy', shortName: 'en-US-GuyNeural', gender: 'Male', locale: 'en-US', friendlyName: 'Guy (US English)' },
        { name: 'Jenny', shortName: 'en-US-JennyNeural', gender: 'Female', locale: 'en-US', friendlyName: 'Jenny (US English)' },
        { name: 'Uzma', shortName: 'ur-PK-UzmaNeural', gender: 'Female', locale: 'ur-PK', friendlyName: 'Uzma (Urdu - Pakistan)' },
        { name: 'Asad', shortName: 'ur-PK-AsadNeural', gender: 'Male', locale: 'ur-PK', friendlyName: 'Asad (Urdu - Pakistan)' },
        { name: 'Swara', shortName: 'hi-IN-SwaraNeural', gender: 'Female', locale: 'hi-IN', friendlyName: 'Swara (Hindi - India)' },
        { name: 'Sonia', shortName: 'en-GB-SoniaNeural', gender: 'Female', locale: 'en-GB', friendlyName: 'Sonia (UK English)' },
      ];
      setVoices(fallbackList);
    } finally {
      setLoadingVoices(false);
    }
  };

  const handleResetSettings = () => {
    setRate(0);
    setPitch(0);
    setVolume(0);
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Please enter some text to synthesize.');
      return;
    }

    setSynthesizing(true);
    setError(null);

    try {
      const response: SynthesisResponse = await synthesizeSpeech({
        text,
        voice: selectedVoice,
        rate,
        pitch,
        volume,
      });

      if (response.success && response.data) {
        const newAudio = {
          audioUrl: response.data.audioUrl,
          fileName: response.data.fileName,
          voiceName: selectedVoice,
        };
        setCurrentAudio(newAudio);

        // Add to history
        const newItem: GenerationHistoryItem = {
          id: Date.now().toString(),
          text: text.slice(0, 70) + (text.length > 70 ? '...' : ''),
          voice: selectedVoice,
          audioUrl: response.data.audioUrl,
          fileName: response.data.fileName,
          time: new Date().toLocaleTimeString(),
        };
        setHistory((prev) => [newItem, ...prev.slice(0, 9)]);
      } else {
        throw new Error(response.message || 'Generation failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to TTS backend server.';
      setError(
        `${msg} (Make sure your backend server is running on http://localhost:5000)`
      );
    } finally {
      setSynthesizing(false);
    }
  };

  return (
    <main className="min-h-screen pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Top Navbar / Header */}
      <header className="py-6 border-b border-slate-800/80 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Radio className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-white bg-clip-text text-transparent">
              Edge TTS Platform
            </h1>
            <p className="text-xs text-slate-400">
              High quality Microsoft Edge Neural Text-to-Speech Studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Backend: <strong className="text-emerald-400 font-medium">localhost:5000</strong></span>
        </div>
      </header>

      {/* Error alert */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Text Input & Audio Player */}
        <div className="lg:col-span-7 space-y-6">
          <TextEditor
            text={text}
            onChange={setText}
            disabled={synthesizing}
          />

          {/* Generate Button Action */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={synthesizing || !text.trim()}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99]"
            >
              {synthesizing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Speech...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 fill-slate-950" />
                  <span>Generate Speech</span>
                </>
              )}
            </button>
          </div>

          {/* Audio Player Component */}
          <AudioPlayer
            audioUrl={currentAudio?.audioUrl || null}
            fileName={currentAudio?.fileName}
            voiceName={currentAudio?.voiceName}
          />

          {/* Generation History */}
          {history.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold mb-3">
                <History className="w-4 h-4 text-emerald-400" />
                <span>Recent Generations</span>
              </div>
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      setCurrentAudio({
                        audioUrl: item.audioUrl,
                        fileName: item.fileName,
                        voiceName: item.voice,
                      })
                    }
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-xs text-slate-200 truncate">{item.text}</p>
                      <p className="text-[10px] text-slate-500">
                        {item.voice} • {item.time}
                      </p>
                    </div>
                    <Volume2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Voice Selector & Settings */}
        <div className="lg:col-span-5 space-y-6">
          <VoiceSelector
            voices={voices}
            selectedVoice={selectedVoice}
            onSelectVoice={setSelectedVoice}
            loading={loadingVoices}
            onRefreshVoices={fetchVoicesList}
          />

          <VoiceSettings
            rate={rate}
            pitch={pitch}
            volume={volume}
            onChangeRate={setRate}
            onChangePitch={setPitch}
            onChangeVolume={setVolume}
            onReset={handleResetSettings}
          />
        </div>
      </div>
    </main>
  );
}
