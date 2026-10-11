import React, { useState, useEffect, useCallback, useRef } from 'react';
import { soundManager } from '../../utils/audio';

interface MathSprintProps {
  onGameOver?: (score: number) => void;
  embed?: boolean;
}

interface Question {
  text: string;
  answer: number;
  options: number[];
}

export const MathSprintGame: React.FC<MathSprintProps> = ({ onGameOver }) => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateQuestion = useCallback((diff: 'easy' | 'medium' | 'hard'): Question => {
    let a = 0;
    let b = 0;
    let op = '+';
    let ans = 0;

    if (diff === 'easy') {
      const ops = ['+', '-'];
      op = ops[Math.floor(Math.random() * ops.length)];
      if (op === '+') {
        a = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 20) + 1;
        ans = a + b;
      } else {
        a = Math.floor(Math.random() * 25) + 5;
        b = Math.floor(Math.random() * a) + 1;
        ans = a - b;
      }
    } else if (diff === 'medium') {
      const ops = ['+', '-', '×'];
      op = ops[Math.floor(Math.random() * ops.length)];
      if (op === '+') {
        a = Math.floor(Math.random() * 50) + 10;
        b = Math.floor(Math.random() * 50) + 10;
        ans = a + b;
      } else if (op === '-') {
        a = Math.floor(Math.random() * 80) + 20;
        b = Math.floor(Math.random() * a) + 5;
        ans = a - b;
      } else {
        a = Math.floor(Math.random() * 10) + 2;
        b = Math.floor(Math.random() * 10) + 2;
        ans = a * b;
      }
    } else {
      const ops = ['+', '-', '×', '÷'];
      op = ops[Math.floor(Math.random() * ops.length)];
      if (op === '÷') {
        b = Math.floor(Math.random() * 9) + 2;
        ans = Math.floor(Math.random() * 10) + 2;
        a = b * ans;
      } else if (op === '×') {
        a = Math.floor(Math.random() * 12) + 3;
        b = Math.floor(Math.random() * 12) + 3;
        ans = a * b;
      } else if (op === '+') {
        a = Math.floor(Math.random() * 100) + 20;
        b = Math.floor(Math.random() * 100) + 20;
        ans = a + b;
      } else {
        a = Math.floor(Math.random() * 150) + 50;
        b = Math.floor(Math.random() * a) + 10;
        ans = a - b;
      }
    }

    const optionsSet = new Set<number>([ans]);
    while (optionsSet.size < 4) {
      const offset = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const fake = ans + offset;
      if (fake >= 0) optionsSet.add(fake);
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    return {
      text: `${a} ${op} ${b}`,
      answer: ans,
      options,
    };
  }, []);

  const startGame = () => {
    soundManager.playPop();
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setIsGameOver(false);
    setIsPlaying(true);
    setQuestion(generateQuestion(difficulty));
  };

  const handleAnswer = (val: number) => {
    if (!isPlaying || isGameOver || !question) return;

    if (val === question.answer) {
      soundManager.playScore();
      setScore(s => s + 10 + streak * 2);
      setStreak(st => st + 1);
      // Give small time bonus
      setTimeLeft(t => Math.min(45, t + 1));
    } else {
      soundManager.playCrash();
      setStreak(0);
      setTimeLeft(t => Math.max(0, t - 2));
    }

    setQuestion(generateQuestion(difficulty));
  };

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          soundManager.playWin();
          setIsGameOver(true);
          setIsPlaying(false);
          if (onGameOver) onGameOver(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isGameOver, score, onGameOver]);

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto select-none">
      <div className="w-full flex justify-between items-center mb-4 text-sm font-bold bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-400">⏱️ Time:</span>
          <span className={`text-lg font-black ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
            {timeLeft}s
          </span>
        </div>
        <div>
          <span className="text-blue-400">Score: <strong className="text-white text-lg">{score}</strong></span>
        </div>
        <div>
          <span className="text-purple-400">Streak: <strong className="text-white text-lg">🔥{streak}</strong></span>
        </div>
      </div>

      <div className="w-full bg-slate-950 border-2 border-indigo-500/40 rounded-2xl p-6 shadow-2xl relative min-h-[320px] flex flex-col justify-center items-center">
        {!isPlaying ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">🔢</div>
            <h3 className="text-2xl font-black text-indigo-400 mb-2">Math Sprint Blitz</h3>
            <p className="text-slate-300 text-xs max-w-xs mb-6">
              Solve rapid arithmetic questions against the clock! Correct answers give points and extra time.
            </p>

            <div className="flex justify-center gap-2 mb-6">
              {(['easy', 'medium', 'hard'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    difficulty === d
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/50'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-extrabold rounded-xl shadow-lg shadow-indigo-500/30 active:scale-95 transition-all cursor-pointer"
            >
              Start Sprint ⚡
            </button>
          </div>
        ) : isGameOver ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-2">🏆</div>
            <h3 className="text-2xl font-black text-amber-400 mb-1">Time's Up!</h3>
            <p className="text-slate-300 text-sm mb-4">
              Final Sprint Score: <strong className="text-white text-xl">{score}</strong>
            </p>
            <p className="text-slate-400 text-xs mb-6">Highest Streak: 🔥{streak}</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Play Again ↻
            </button>
          </div>
        ) : (
          question && (
            <div className="w-full text-center">
              <div className="text-slate-400 text-xs uppercase font-extrabold tracking-wider mb-2">Solve this:</div>
              <div className="text-5xl font-black text-white mb-8 tracking-wide font-mono bg-slate-900/60 py-4 rounded-xl border border-slate-800">
                {question.text} = ?
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                {question.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="py-4 bg-slate-800/90 hover:bg-indigo-600 text-white text-2xl font-black rounded-xl border border-slate-700 hover:border-indigo-400 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
