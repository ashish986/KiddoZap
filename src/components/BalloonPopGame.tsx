import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Volume2 } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface BalloonPopProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

interface Balloon {
  id: number;
  x: number;
  speed: number;
  color: string;
  emoji: string;
  points: number;
  isPopped: boolean;
}

const BALLOON_STYLES = [
  { color: 'from-rose-400 to-red-500', emoji: '🎈', points: 1 },
  { color: 'from-sky-400 to-blue-500', emoji: '🎈', points: 1 },
  { color: 'from-amber-400 to-yellow-500', emoji: '⭐', points: 3 },
  { color: 'from-emerald-400 to-teal-500', emoji: '🎈', points: 1 },
  { color: 'from-purple-400 to-indigo-500', emoji: '🎈', points: 1 },
];

export const BalloonPopGame: React.FC<BalloonPopProps> = ({ lang, onBack, onGameComplete }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [nextId, setNextId] = useState<number>(1);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setBalloons([]);
    setIsPlaying(true);
    sounds.tap();
  };

  // Timer
  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);
      sounds.complete();
      const stars = Math.min(5, Math.max(1, Math.floor(score / 5)));
      onGameComplete(stars, score);
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score, onGameComplete]);

  // Balloon spawner
  useEffect(() => {
    if (!isPlaying) return;

    const spawner = setInterval(() => {
      setBalloons((prev) => {
        if (prev.length >= 8) return prev;
        const style = BALLOON_STYLES[Math.floor(Math.random() * BALLOON_STYLES.length)];
        const newBalloon: Balloon = {
          id: Date.now() + Math.random(),
          x: Math.floor(Math.random() * 80) + 10,
          speed: Math.random() * 2 + 3,
          color: style.color,
          emoji: style.emoji,
          points: style.points,
          isPopped: false,
        };
        return [...prev, newBalloon];
      });
    }, 700);

    return () => clearInterval(spawner);
  }, [isPlaying]);

  const popBalloon = (id: number, points: number) => {
    if (!isPlaying) return;
    sounds.correct();
    setScore((s) => s + points);
    setBalloons((prev) => prev.filter((b) => b.id !== id));

    if (points >= 3) {
      confetti({ particleCount: 20, spread: 45 });
    }
  };

  return (
    <div id="game-balloon" className="max-w-lg mx-auto p-4 flex flex-col items-center">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-4 bg-white/90 backdrop-blur px-4 py-2.5 rounded-2xl shadow-sm border border-sky-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'hi' ? 'वापस' : 'Back'}
        </button>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-sky-50 text-sky-700 rounded-xl border border-sky-200 font-black text-sm">
            🎈 {score}
          </div>
          <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 font-bold text-xs">
            ⏱️ {timeLeft}s
          </div>
        </div>

        <button
          onClick={startGame}
          className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Sky Canvas */}
      <div className="relative w-full max-w-sm h-96 bg-gradient-to-b from-sky-400 via-sky-300 to-amber-100 rounded-3xl shadow-xl overflow-hidden border-4 border-sky-400 flex flex-col justify-end">
        {/* Clouds */}
        <div className="absolute top-4 left-6 text-3xl opacity-70">☁️</div>
        <div className="absolute top-12 right-8 text-4xl opacity-75">☁️</div>

        {/* Floating Balloons */}
        {balloons.map((b) => (
          <motion.div
            key={b.id}
            initial={{ y: 380, opacity: 1 }}
            animate={{ y: -60 }}
            transition={{ duration: b.speed, ease: 'linear' }}
            onAnimationComplete={() => setBalloons((prev) => prev.filter((item) => item.id !== b.id))}
            onClick={() => popBalloon(b.id, b.points)}
            style={{ left: `${b.x}%` }}
            className="absolute -translate-x-1/2 cursor-pointer active:scale-125 transition-transform"
          >
            <div className={`w-14 h-16 rounded-full bg-gradient-to-br ${b.color} shadow-lg flex items-center justify-center text-xl text-white font-black border border-white/40`}>
              {b.emoji}
            </div>
            <div className="w-0.5 h-6 bg-white/70 mx-auto -mt-1" />
          </motion.div>
        ))}

        {/* Start / Finish screen */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <span className="text-5xl mb-2">🎈✨</span>
            <h3 className="text-2xl font-black text-sky-300 mb-1 font-fredoka">
              {timeLeft <= 0 ? (lang === 'hi' ? 'समय पूरा हुआ!' : 'Time Up!') : (lang === 'hi' ? 'रंग-बिरंगे गुब्बारे!' : 'Balloon Pop Party!')}
            </h3>
            <p className="text-slate-200 text-sm mb-4">
              {timeLeft <= 0
                ? lang === 'hi' ? `शानदार! आपने ${score} गुब्बारे फोड़े!` : `Amazing! You popped ${score} points!`
                : lang === 'hi' ? 'आसमान में उड़ते गुब्बारों को छूकर फोड़ें!' : 'Tap or click floating balloons before they fly away!'}
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-sky-400 to-blue-600 font-black rounded-2xl shadow-lg transition active:scale-95 text-white flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {lang === 'hi' ? 'खेल शुरू करें' : 'Start Popping'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
