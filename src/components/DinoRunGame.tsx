import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface DinoRunProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

export const DinoRunGame: React.FC<DinoRunProps> = ({ lang, onBack, onGameComplete }) => {
  const [dinoY, setDinoY] = useState<number>(0);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [cactusX, setCactusX] = useState<number>(360);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('kiddozap_dino_high') || 0);
    } catch {
      return 0;
    }
  });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const jump = () => {
    if (isJumping || !isPlaying || isGameOver) return;
    sounds.tap();
    setIsJumping(true);

    let up = true;
    let height = 0;
    const jumpInterval = setInterval(() => {
      if (up) {
        height += 8;
        if (height >= 85) up = false;
      } else {
        height -= 8;
        if (height <= 0) {
          clearInterval(jumpInterval);
          setIsJumping(false);
          height = 0;
        }
      }
      setDinoY(height);
    }, 20);
  };

  const startGame = () => {
    setDinoY(0);
    setCactusX(360);
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  // Obstacle loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const interval = setInterval(() => {
      setCactusX((x) => {
        if (x <= -30) {
          setScore((s) => {
            const next = s + 1;
            if (next > highScore) {
              setHighScore(next);
              try {
                localStorage.setItem('kiddozap_dino_high', String(next));
              } catch {
                // ignore
              }
            }
            if (next % 10 === 0) confetti({ particleCount: 15, spread: 40 });
            return next;
          });
          return 360;
        }
        return x - 6;
      });
    }, 24);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, highScore]);

  // Collision detection
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    // Dino is around X = 40 with width 35. Cactus is at cactusX with width 25.
    if (cactusX > 25 && cactusX < 65 && dinoY < 35) {
      sounds.incorrect();
      setIsGameOver(true);
      setIsPlaying(false);
      const stars = Math.min(5, Math.max(1, Math.floor(score / 4)));
      onGameComplete(stars, score);
    }
  }, [cactusX, dinoY, isPlaying, isGameOver, score, onGameComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        if (!isPlaying) startGame();
        else jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver, isJumping]);

  return (
    <div id="game-dino" className="max-w-lg mx-auto p-4 flex flex-col items-center select-none">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-4 bg-white/90 backdrop-blur px-4 py-2.5 rounded-2xl shadow-sm border border-emerald-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'hi' ? 'वापस' : 'Back'}
        </button>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-black text-sm">
            🦖 {score}
          </div>
          <div className="px-3 py-1 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 font-bold text-xs flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            <span>{highScore}</span>
          </div>
        </div>

        <button onClick={startGame} className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800" title="Restart">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Game Runway */}
      <div
        onClick={jump}
        className="relative w-full max-w-md h-56 bg-gradient-to-b from-amber-100/60 to-amber-200/90 rounded-3xl shadow-xl overflow-hidden border-4 border-amber-300 cursor-pointer flex flex-col justify-end"
      >
        {/* Clouds & Sun */}
        <div className="absolute top-4 left-10 text-2xl opacity-60">☁️</div>
        <div className="absolute top-2 right-12 text-3xl">☀️</div>

        {/* Dino */}
        <div
          className="absolute left-10 text-4xl leading-none transition-all duration-75"
          style={{ bottom: `${28 + dinoY}px` }}
        >
          🦖
        </div>

        {/* Cactus Obstacle */}
        <div
          className="absolute text-3xl leading-none"
          style={{ left: `${cactusX}px`, bottom: '26px' }}
        >
          🌵
        </div>

        {/* Ground Line */}
        <div className="w-full h-7 bg-emerald-600 border-t-4 border-emerald-700 flex items-center justify-around text-xs text-emerald-200 overflow-hidden">
          <span>🌿</span>
          <span>🌱</span>
          <span>🌿</span>
          <span>🌱</span>
          <span>🌿</span>
        </div>

        {/* Start / Game Over Modal */}
        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <span className="text-5xl mb-1">🦖🌵</span>
            <h3 className="text-2xl font-black text-amber-300 font-fredoka">
              {isGameOver ? (lang === 'hi' ? 'खेल समाप्त!' : 'Game Over!') : (lang === 'hi' ? 'डाइनो जंप रन!' : 'Dino Jump & Run!')}
            </h3>
            <p className="text-slate-300 text-xs mb-3">
              {lang === 'hi' ? 'कूदने के लिए स्क्रीन पर टैप करें या Space दबाएं!' : 'Tap screen or press Spacebar to jump over cacti!'}
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 font-black rounded-2xl shadow-lg transition active:scale-95 text-white"
            >
              {lang === 'hi' ? 'खेलें' : 'Jump Now'}
            </button>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-500 font-bold">
        {lang === 'hi' ? '💡 कूदने के लिए कहीं भी टच करें' : '💡 Tap anywhere on screen to jump'}
      </p>
    </div>
  );
};
