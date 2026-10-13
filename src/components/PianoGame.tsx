import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Volume2, Sparkles, Music } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface PianoProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

interface KeyNote {
  note: string;
  hindi: string;
  freq: number;
  color: string;
  keyBind: string;
}

const PIANO_KEYS: KeyNote[] = [
  { note: 'Sa (C)', hindi: 'सा', freq: 261.63, color: 'bg-rose-500', keyBind: '1' },
  { note: 'Re (D)', hindi: 'रे', freq: 293.66, color: 'bg-orange-500', keyBind: '2' },
  { note: 'Ga (E)', hindi: 'ग', freq: 329.63, color: 'bg-amber-400', keyBind: '3' },
  { note: 'Ma (F)', hindi: 'म', freq: 349.23, color: 'bg-emerald-500', keyBind: '4' },
  { note: 'Pa (G)', hindi: 'प', freq: 392.0, color: 'bg-sky-500', keyBind: '5' },
  { note: 'Dha (A)', hindi: 'ध', freq: 440.0, color: 'bg-indigo-500', keyBind: '6' },
  { note: 'Ni (B)', hindi: 'नि', freq: 493.88, color: 'bg-purple-500', keyBind: '7' },
  { note: 'Sa+ (C2)', hindi: 'सां', freq: 523.25, color: 'bg-pink-500', keyBind: '8' },
];

export const PianoGame: React.FC<PianoProps> = ({ lang, onBack, onGameComplete }) => {
  const [activeKey, setActiveKey] = useState<number | null>(null);
  const [notesPlayed, setNotesPlayed] = useState<number>(0);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  const playTone = (freq: number, index: number) => {
    setActiveKey(index);
    setTimeout(() => setActiveKey(null), 250);
    setNotesPlayed((n) => {
      const next = n + 1;
      if (next === 20) {
        confetti({ particleCount: 30, spread: 60 });
        onGameComplete(3, next);
      }
      return next;
    });

    try {
      const ctx = audioCtx || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      if (!audioCtx) setAudioCtx(ctx);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      sounds.tap();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: { [k: string]: number } = {
        '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7,
      };
      if (keyMap[e.key] !== undefined) {
        const idx = keyMap[e.key];
        playTone(PIANO_KEYS[idx].freq, idx);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioCtx]);

  return (
    <div id="game-piano" className="max-w-xl mx-auto p-4 flex flex-col items-center">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between mb-4 bg-white/90 backdrop-blur px-4 py-2.5 rounded-2xl shadow-sm border border-purple-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'hi' ? 'वापस' : 'Back'}
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-xl border border-purple-200 font-black text-sm">
            <Music className="w-4 h-4" />
            <span>{notesPlayed} {lang === 'hi' ? 'धुन' : 'Notes'}</span>
          </div>
        </div>

        <button
          onClick={() => setNotesPlayed(0)}
          className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Piano Layout */}
      <div className="w-full bg-slate-900 rounded-3xl p-6 shadow-2xl border-4 border-purple-500/30 flex flex-col items-center">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-black text-purple-300 font-fredoka flex items-center justify-center gap-2">
            <span>🎹</span> {lang === 'hi' ? 'जादुई सुर पियानो' : 'Rainbow Magic Piano'}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {lang === 'hi' ? 'सुरों को छूकर अपनी मनपसंद धुन बनाएं!' : 'Tap keys or press 1-8 to create melodious tunes!'}
          </p>
        </div>

        {/* Piano Keys */}
        <div className="grid grid-cols-8 gap-1.5 sm:gap-2 w-full max-w-md h-56 sm:h-64 bg-slate-950 p-3 rounded-2xl border-2 border-slate-800 shadow-inner">
          {PIANO_KEYS.map((k, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.95 }}
              onClick={() => playTone(k.freq, idx)}
              className={`relative rounded-xl flex flex-col justify-between items-center py-3 select-none shadow-lg transition-colors ${
                activeKey === idx ? `${k.color} text-white shadow-xl ring-2 ring-white` : 'bg-white hover:bg-slate-100 text-slate-800'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400">{k.keyBind}</span>
              <div className="flex flex-col items-center">
                <span className="font-fredoka font-black text-sm sm:text-base">
                  {lang === 'hi' ? k.hindi : k.note.split(' ')[0]}
                </span>
                <span className="text-[9px] text-slate-500 font-bold">
                  {lang === 'hi' ? k.note.split(' ')[0] : k.hindi}
                </span>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${k.color}`} />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
