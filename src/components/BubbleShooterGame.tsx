import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Star } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface BubbleShooterProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

const BUBBLE_COLORS = [
  { id: 'red', emoji: '🔴', bg: 'bg-red-500' },
  { id: 'blue', emoji: '🔵', bg: 'bg-blue-500' },
  { id: 'green', emoji: '🟢', bg: 'bg-emerald-500' },
  { id: 'yellow', emoji: '🟡', bg: 'bg-amber-400' },
  { id: 'purple', emoji: '🟣', bg: 'bg-purple-500' },
];

export const BubbleShooterGame: React.FC<BubbleShooterProps> = ({ lang, onBack, onGameComplete }) => {
  const [grid, setGrid] = useState<string[]>([]);
  const [currentBubble, setCurrentBubble] = useState<string>('red');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('kiddozap_bubble_high') || 0);
    } catch {
      return 0;
    }
  });

  const initGrid = () => {
    const bubbles: string[] = [];
    for (let i = 0; i < 30; i++) {
      const col = BUBBLE_COLORS[Math.floor(Math.random() * 4)].id;
      bubbles.push(col);
    }
    setGrid(bubbles);
    setCurrentBubble(BUBBLE_COLORS[Math.floor(Math.random() * 4)].id);
    setScore(0);
  };

  useEffect(() => {
    initGrid();
  }, []);

  const shootAt = (index: number) => {
    sounds.tap();
    const targetColor = grid[index];

    // If matches current bubble color, pop all adjacent matching
    if (targetColor === currentBubble) {
      sounds.correct();
      const newGrid = [...grid];
      newGrid[index] = '';
      // Also pop next and prev if matching
      if (index > 0 && newGrid[index - 1] === currentBubble) newGrid[index - 1] = '';
      if (index < newGrid.length - 1 && newGrid[index + 1] === currentBubble) newGrid[index + 1] = '';

      setGrid(newGrid);
      const points = 3;
      setScore((s) => {
        const next = s + points;
        if (next > highScore) setHighScore(next);
        return next;
      });

      confetti({ particleCount: 20, spread: 45 });
      onGameComplete(Math.min(5, Math.floor((score + points) / 6)), score + points);
    } else {
      // replace or set
      const newGrid = [...grid];
      newGrid[index] = currentBubble;
      setGrid(newGrid);
    }

    // Pick new random shooter bubble
    setCurrentBubble(BUBBLE_COLORS[Math.floor(Math.random() * 4)].id);
  };

  return (
    <div id="game-bubble" className="max-w-lg mx-auto p-4 flex flex-col items-center select-none">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-4 bg-white/90 backdrop-blur px-4 py-2.5 rounded-2xl shadow-sm border border-purple-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'hi' ? 'वापस' : 'Back'}
        </button>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-purple-50 text-purple-800 rounded-xl border border-purple-200 font-black text-sm">
            🫧 {score}
          </div>
          <div className="px-3 py-1 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 font-bold text-xs flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            <span>{highScore}</span>
          </div>
        </div>

        <button onClick={initGrid} className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800" title="Restart">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Bubble Grid */}
      <div className="w-full max-w-sm bg-slate-900 p-4 rounded-3xl shadow-xl border-4 border-purple-400 flex flex-col items-center">
        <div className="grid grid-cols-6 gap-2 w-full mb-6">
          {grid.map((colorId, idx) => {
            const colorObj = BUBBLE_COLORS.find((b) => b.id === colorId);
            return (
              <button
                key={idx}
                onClick={() => shootAt(idx)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-transform active:scale-125 shadow-md ${
                  colorObj ? colorObj.bg : 'bg-slate-800/40 opacity-20'
                }`}
              >
                {colorObj?.emoji || '⚪'}
              </button>
            );
          })}
        </div>

        {/* Shooter Cannon */}
        <div className="flex flex-col items-center bg-slate-800/80 px-6 py-3 rounded-2xl border border-slate-700">
          <span className="text-xs text-purple-300 font-bold mb-1">
            {lang === 'hi' ? 'अगला रंग (Next Bubble)' : 'Current Bubble to Pop'}
          </span>
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg ring-4 ring-white/50 animate-pulse bg-slate-700">
            {BUBBLE_COLORS.find((b) => b.id === currentBubble)?.emoji}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500 font-bold">
        {lang === 'hi' ? '💡 एक जैसे रंग के बुलबुलों पर टैप करके फोड़ें!' : '💡 Tap matching colored bubbles to pop combos!'}
      </p>
    </div>
  );
};
