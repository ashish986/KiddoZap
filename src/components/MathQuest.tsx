import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Zap, Trophy, Heart, Flame } from 'lucide-react';
import { sounds } from '../utils/audio';
import { Language } from '../types';
import confetti from 'canvas-confetti';

interface MathQuestProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (starsEarned: number, score: number) => void;
}

interface Question {
  num1: number;
  num2: number;
  op: '+' | '-' | '×';
  answer: number;
  options: number[];
}

const BALLOON_COLORS = [
  'bg-gradient-to-t from-red-500 to-rose-400 text-white shadow-rose-200',
  'bg-gradient-to-t from-blue-500 to-cyan-400 text-white shadow-cyan-200',
  'bg-gradient-to-t from-emerald-500 to-teal-400 text-white shadow-emerald-200',
  'bg-gradient-to-t from-amber-500 to-yellow-400 text-slate-900 shadow-yellow-200',
  'bg-gradient-to-t from-purple-500 to-violet-400 text-white shadow-purple-200',
];

export const MathQuest: React.FC<MathQuestProps> = ({ lang, onBack, onGameComplete }) => {
  const [level, setLevel] = useState<'junior' | 'explorer' | 'master'>('junior');
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [streak, setStreak] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [maxRounds] = useState<number>(10);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);

  const generateQuestion = (lvl: 'junior' | 'explorer' | 'master'): Question => {
    let num1 = 1;
    let num2 = 1;
    let op: '+' | '-' | '×' = '+';

    if (lvl === 'junior') {
      op = Math.random() > 0.4 ? '+' : '-';
      if (op === '+') {
        num1 = Math.floor(Math.random() * 6) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
      } else {
        num1 = Math.floor(Math.random() * 6) + 4;
        num2 = Math.floor(Math.random() * num1) + 1;
      }
    } else if (lvl === 'explorer') {
      op = Math.random() > 0.5 ? '+' : '-';
      if (op === '+') {
        num1 = Math.floor(Math.random() * 12) + 4;
        num2 = Math.floor(Math.random() * 10) + 2;
      } else {
        num1 = Math.floor(Math.random() * 15) + 6;
        num2 = Math.floor(Math.random() * (num1 - 2)) + 1;
      }
    } else {
      const ops: ('+' | '-' | '×')[] = ['+', '-', '×'];
      op = ops[Math.floor(Math.random() * ops.length)];
      if (op === '×') {
        num1 = Math.floor(Math.random() * 5) + 2;
        num2 = Math.floor(Math.random() * 5) + 2;
      } else if (op === '+') {
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 15) + 5;
      } else {
        num1 = Math.floor(Math.random() * 25) + 10;
        num2 = Math.floor(Math.random() * 15) + 2;
      }
    }

    let answer = 0;
    if (op === '+') answer = num1 + num2;
    if (op === '-') answer = num1 - num2;
    if (op === '×') answer = num1 * num2;

    // Generate 3 unique wrong options near the answer
    const opts = new Set<number>([answer]);
    while (opts.size < 4) {
      const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const fake = Math.max(0, answer + offset);
      if (fake !== answer) opts.add(fake);
    }

    const shuffledOpts = Array.from(opts).sort(() => Math.random() - 0.5);

    return { num1, num2, op, answer, options: shuffledOpts };
  };

  const startNewGame = () => {
    setScore(0);
    setLives(3);
    setStreak(0);
    setRound(1);
    setIsCompleted(false);
    setFeedback(null);
    setCurrentQ(generateQuestion(level));
    sounds.playPop(1);
  };

  useEffect(() => {
    startNewGame();
  }, [level]);

  const handleSelectOption = (choice: number) => {
    if (!currentQ || isCompleted) return;

    if (choice === currentQ.answer) {
      sounds.playChime();
      sounds.playPop(1.4);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore((s) => s + 10 * Math.min(newStreak, 3));

      setFeedback({
        text: lang === 'hi' ? 'शाबाश! सही जवाब!' : 'Super! Correct!',
        isCorrect: true,
      });

      if (round >= maxRounds) {
        // Finished game!
        setTimeout(() => {
          finishGame(score + 10 * Math.min(newStreak, 3));
        }, 600);
      } else {
        setTimeout(() => {
          setRound((r) => r + 1);
          setFeedback(null);
          setCurrentQ(generateQuestion(level));
        }, 700);
      }
    } else {
      sounds.playError();
      setStreak(0);
      const newLives = lives - 1;
      setLives(newLives);

      setFeedback({
        text: lang === 'hi' ? `ओह! सही उत्तर था ${currentQ.answer}` : `Oops! Answer was ${currentQ.answer}`,
        isCorrect: false,
      });

      if (newLives <= 0) {
        setTimeout(() => {
          finishGame(score);
        }, 1000);
      } else {
        setTimeout(() => {
          setRound((r) => r + 1);
          setFeedback(null);
          setCurrentQ(generateQuestion(level));
        }, 1200);
      }
    }
  };

  const finishGame = (finalScore: number) => {
    setIsCompleted(true);
    let stars = 1;
    if (finalScore >= 100) stars = 3;
    else if (finalScore >= 60) stars = 2;

    sounds.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onGameComplete(stars, finalScore);
  };

  return (
    <div id="math-quest-container" className="w-full h-full max-h-[100dvh] flex flex-col items-center justify-between p-2 select-none overflow-hidden">
      {/* Top Controls Bar */}
      <div className="w-full max-w-md flex items-center justify-between bg-white/95 backdrop-blur rounded-2xl px-3 py-1.5 border border-rose-200 shadow-2xs">
        <button
          id="math-back-btn"
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        {/* Lives & Streak */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 items-center">
            {[1, 2, 3].map((l) => (
              <Heart
                key={l}
                className={`w-4 h-4 transition-all ${
                  l <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-200'
                }`}
              />
            ))}
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-0.5 bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full text-[10px] font-black animate-pulse">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{streak}x</span>
            </div>
          )}

          <div className="text-xs font-bold text-slate-700">
            <span className="text-rose-600 font-extrabold">{score}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Level selector small */}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as any)}
            className="text-[11px] font-bold bg-slate-100 text-slate-700 rounded-lg px-1.5 py-1 border border-slate-200"
          >
            <option value="junior">1-10</option>
            <option value="explorer">1-20</option>
            <option value="master">Mix</option>
          </select>

          <button
            id="math-reset-btn"
            onClick={startNewGame}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all active:scale-95"
            title="Restart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Middle Question Card - Sits in flex container */}
      <div className="w-full max-w-sm my-auto">
        <motion.div
          key={round}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white p-4 rounded-3xl text-center shadow-lg shadow-rose-200/60 relative overflow-hidden"
        >
          <div className="flex justify-between items-center text-[11px] text-rose-100 font-bold mb-1">
            <span>{lang === 'hi' ? `सवाल ${round} / ${maxRounds}` : `Question ${round} of ${maxRounds}`}</span>
            <span>{lang === 'hi' ? 'सही गुब्बारा फोड़ें! 🎈' : 'Pop the balloon! 🎈'}</span>
          </div>

          <div className="text-4xl sm:text-5xl font-black tracking-wider drop-shadow my-2 font-display">
            {currentQ ? `${currentQ.num1} ${currentQ.op} ${currentQ.num2} = ?` : '...'}
          </div>

          {/* Feedback pill */}
          {feedback && (
            <motion.div
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`inline-block px-3 py-0.5 rounded-full text-xs font-extrabold ${
                feedback.isCorrect
                  ? 'bg-emerald-400 text-emerald-950'
                  : 'bg-white text-rose-600'
              }`}
            >
              {feedback.text}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Floating Balloons Grid - 4 Balloons fitting nicely */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-sm pb-2">
        {currentQ?.options.map((option, idx) => (
          <motion.button
            key={`${round}-${option}-${idx}`}
            initial={{ y: 15, opacity: 0 }}
            animate={{
              y: [0, -4, 0],
              opacity: 1,
            }}
            transition={{
              y: {
                repeat: Infinity,
                duration: 2 + (idx % 2) * 0.5,
                ease: 'easeInOut',
              },
              opacity: { duration: 0.2 },
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleSelectOption(option)}
            className={`aspect-[3/3.8] rounded-[45%] flex flex-col items-center justify-center p-2 relative shadow-md cursor-pointer ${
              BALLOON_COLORS[idx % BALLOON_COLORS.length]
            } border-2 border-white/50 active:scale-95 transition-transform`}
          >
            {/* Balloon shine effect */}
            <div className="absolute top-2 left-2.5 w-3 h-5 bg-white/40 rounded-full rotate-[-25deg] blur-[0.5px]" />

            <span className="text-2xl sm:text-3xl font-black drop-shadow-sm font-display">
              {option}
            </span>

            {/* Balloon string knot */}
            <div className="absolute -bottom-1.5 w-2.5 h-1.5 bg-rose-600 rounded-xs" />
          </motion.button>
        ))}
      </div>

      {/* Game Over / Success Modal */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-5 max-w-xs w-full text-center shadow-2xl border-4 border-rose-300"
            >
              <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-7 h-7 text-rose-500 animate-bounce" />
              </div>

              <h3 className="text-xl font-black text-slate-800">
                {lives > 0
                  ? lang === 'hi' ? 'गणित मास्टर! 🚀' : 'Math Rocket! 🚀'
                  : lang === 'hi' ? 'अच्छा प्रयास! 👏' : 'Great Try! 👏'}
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                {lang === 'hi'
                  ? `कुल स्कोर: ${score} अंक!`
                  : `Final score: ${score} points!`}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  id="math-play-again-btn"
                  onClick={startNewGame}
                  className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-md active:scale-95 transition-all text-xs"
                >
                  {lang === 'hi' ? 'फिर से खेलें' : 'Play Again'}
                </button>
                <button
                  id="math-modal-back-btn"
                  onClick={onBack}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl active:scale-95 transition-all text-xs"
                >
                  {lang === 'hi' ? 'होम' : 'Menu'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
