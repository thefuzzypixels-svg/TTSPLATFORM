'use client';

import React from 'react';
import { Type, Sparkles, Trash2 } from 'lucide-react';

interface TextEditorProps {
  text: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PRESETS = [
  {
    title: 'Welcome Prompt',
    content: 'Welcome to our Edge TTS Platform. Experience natural, high-fidelity neural speech synthesis powered by Microsoft Edge Read Aloud technology.',
  },
  {
    title: 'Audiobook Narration',
    content: 'The old clock tower echoed across the quiet valley. As the evening fog rolled in, a faint golden light flickered in the abandoned library window.',
  },
  {
    title: 'Urdu / Multilingual',
    content: 'خوش آمدید! یہ ایک جدید ٹیکسٹ ٹو اسپیچ پلیٹ فارم ہے جس سے آپ باآسانی بہترین آواز میں آڈیو بنا سکتے ہیں۔',
  },
];

export default function TextEditor({ text, onChange, disabled }: TextEditorProps) {
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-lg">
          <Type className="w-5 h-5 text-emerald-400" />
          <span>Input Text</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
          {text.length > 0 && (
            <button
              onClick={() => onChange('')}
              disabled={disabled}
              className="ml-2 text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
              title="Clear text"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Type, write or paste the script you want to convert to voiceover..."
        rows={6}
        className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-y transition-all text-sm leading-relaxed"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Samples:</span>
        </div>
        {PRESETS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onChange(preset.content)}
            className="text-xs bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/50 transition-colors"
          >
            {preset.title}
          </button>
        ))}
      </div>
    </div>
  );
}
