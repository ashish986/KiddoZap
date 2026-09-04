import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Sparkles, Volume2 } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface WhackAMoleProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

const TOTAL_HOLES = 9;
const GAME_DURATION = 30; // 30 seconds

export const WhackAMoleGame: React.FC<WhackAMoleProps> = ({ lang, onBack, onGameComplete }) => {
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [isGolden, setIsGolden] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [whackedHoles, setWhackedHoles] = useState<{ [key: number]: boolean }>({});
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('kiddozap_whack_high') || 0);
    } catch {
      return 0;
    }
  });

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    sounds.tap();
  };

  // Timer
  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);
      setActiveHole(null);
      sounds.complete();
      const stars = Math.min(5, Math.max(1, Math.floor(score / 5)));
      onGameComplete(stars, score);
      if (score > highScore) {
        setHighScore(score);
        try {
          localStorage.setItem('kiddozap_whack_high', String(score));
        } catch {
          // ignore
        }
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score, highScore, onGameComplete]);

  // Mole pop loop
  useEffect(() => {
    if (!isPlaying) return;

    const popInterval = setInterval(() => {
      const nextHole = Math.floor(Math.random() * TOTAL_HOLES);
      const isLucky = Math.random() < 0.2; // 20% golden mole
      setActiveHole(nextHole);
      setIsGolden(isLucky);
      setWhackedHoles({});
    }, 850);

    return () => clearInterval(popInterval);
  }, [isPlaying]);

  const handleWhack = (index: number) => {
    if (!isPlaying) return;
    if (activeHole === index && !whackedHoles[index]) {
      sounds.correct();
      setWhackedHoles((prev) => ({ ...prev, [index]: true }));
      const pointsToAdd = isGolden ? 3 : 1;
      setScore((s) => s + pointsToAdd);

      if (isGolden) {
        confetti({ particleCount: 20, spread: 45 });
      }
    } else {
      sounds.tap();
    }
  };

  return (
    <div id="game-whack" className="max-w-lg mx-auto p-4 flex flex-col items-center">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-4 bg-white/90 backdrop-blur px-4 py-2.5 rounded-2xl shadow-sm border border-amber-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'hi' ? 'वापस' : 'Back'}
        </button>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 font-black text-sm">
            🐹 {score}
          </div>
          <div className="px-3 py-1 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 font-bold text-xs">
            ⏱️ {timeLeft}s
          </div>
        </div>

        <button
          onClick={startGame}
          className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Playing Board */}
      <div className="relative w-full max-w-sm aspect-square bg-gradient-to-b from-amber-800 to-amber-950 p-4 rounded-3xl shadow-2xl border-4 border-amber-600">
        <div className="grid grid-cols-3 gap-3 w-full h-full">
          {Array.from({ length: TOTAL_HOLES }).map((_, idx) => {
            const isMoleHere = activeHole === idx;
            const isHit = whackedHoles[idx];

            return (
              <div
                key={idx}
                onClick={() => handleWhack(idx)}
                className="relative bg-amber-900/90 rounded-2xl border-4 border-amber-950/80 overflow-hidden shadow-inner flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform"
              >
                {/* Hole Mound */}
                <div className="absolute bottom-0 inset-x-0 h-6 bg-amber-950/90 rounded-t-full" />

                {/* Mole */}
                <AnimatePresence>
                  {isMoleHere && (
                    <motion.div
                      initial={{ y: 50, scale: 0.5 }}
                      animate={{ y: 0, scale: 1 }}
                      exit={{ y: 50, scale: 0.5 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                      className="relative z-10 flex flex-col items-center"
                    >
                      <span className="text-4xl drop-shadow-md">
                        {isHit ? '😵' : isGolden ? '👑' : '🐹'}
                      </span>
                      {isGolden && !isHit && (
                        <span className="text-[10px] font-black text-amber-300 bg-amber-900/80 px-1 rounded-full mt-0.5">
                          +3
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Start / Finish Modal */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <span className="text-5xl mb-2">🐹🔨</span>
            <h3 className="text-2xl font-black text-amber-300 mb-1 font-fredoka">
              {timeLeft <= 0 ? (lang === 'hi' ? 'समय समाप्त!' : 'Time Up!') : (lang === 'hi' ? 'चूहे पकड़ो!' : 'Whack-A-Mole!')}
            </h3>
            <p className="text-slate-200 text-sm mb-4">
              {timeLeft <= 0
                ? lang === 'hi'
                  ? `शानदार! आपने ${score} पॉइंट्स बनाए!`
                  : `Well done! You scored ${score} points!`
                : lang === 'hi'
                ? 'बिल से बाहर आते ही चूहे पर टैप करें!'
                : 'Tap on the cute mole as soon as it pops up!'}
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-black rounded-2xl shadow-lg transition active:scale-95 text-white flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {lang === 'hi' ? 'खेल शुरू करें' : 'Start Whacking'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
