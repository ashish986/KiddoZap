import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';

export const WhackAMoleGame: React.FC<{ onGameOver?: (score: number) => void }> = () => {
  const [moles, setMoles] = useState<boolean[]>(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const moleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    soundManager.playPop();
    setMoles(Array(9).fill(false));
    setScore(0);
    setTimeLeft(25);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  const whack = (index: number) => {
    if (!isPlaying || isGameOver || !moles[index]) return;
    soundManager.playScore();
    setScore(s => s + 10);
    setMoles(prev => {
      const copy = [...prev];
      copy[index] = false;
      return copy;
    });
  };

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          clearInterval(moleTimerRef.current as NodeJS.Timeout);
          soundManager.playWin();
          setIsGameOver(true);
          setIsPlaying(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    moleTimerRef.current = setInterval(() => {
      setMoles(prev => {
        const copy = Array(9).fill(false);
        const count = Math.random() > 0.6 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          const randomIndex = Math.floor(Math.random() * 9);
          copy[randomIndex] = true;
        }
        return copy;
      });
    }, 750);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (moleTimerRef.current) clearInterval(moleTimerRef.current);
    };
  }, [isPlaying, isGameOver]);

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-xs flex justify-between items-center mb-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm font-bold">
        <span className="text-amber-400">Time: <strong className="text-white">{timeLeft}s</strong></span>
        <span className="text-cyan-400">Score: <strong className="text-white">{score}</strong></span>
      </div>

      <div className="w-72 h-72 bg-slate-950 border-2 border-amber-600/50 rounded-2xl p-3 shadow-2xl relative grid grid-cols-3 gap-3">
        {moles.map((isUp, idx) => (
          <button
            key={idx}
            onClick={() => whack(idx)}
            className={`rounded-2xl flex items-center justify-center text-4xl transition-all cursor-pointer ${
              isUp
                ? 'bg-amber-600 border-2 border-yellow-400 shadow-lg shadow-amber-500/50 scale-105 active:scale-90 animate-bounce'
                : 'bg-slate-900 border border-slate-800'
            }`}
          >
            {isUp ? '🦔' : '🕳️'}
          </button>
        ))}

        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center rounded-2xl">
            {isGameOver ? (
              <>
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="text-2xl font-black text-amber-400 mb-1">Time Up!</h3>
                <p className="text-slate-300 text-sm mb-4">Total Whacks: <strong className="text-white">{score} pts</strong></p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">🔨</div>
                <h3 className="text-2xl font-black text-amber-400 mb-1">Whack-A-Mole</h3>
                <p className="text-slate-400 text-xs mb-4">Tap moles quickly as they pop out!</p>
              </>
            )}

            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-xl shadow-lg cursor-pointer active:scale-95"
            >
              {isGameOver ? 'Play Again ↻' : 'Start Whack ⚡'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
