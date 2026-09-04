import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Star, Sparkles, Play, Pause } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface SnakeProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

const GRID_SIZE = 18;
type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const FOOD_EMOJIS = ['🍎', '🍓', '🍇', '🍒', '🍕', '🧁', '⭐'];

export const SnakeGame: React.FC<SnakeProps> = ({ lang, onBack, onGameComplete }) => {
  const [snake, setSnake] = useState<Point[]>([
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 },
  ]);
  const [food, setFood] = useState<Point>({ x: 13, y: 9 });
  const [foodEmoji, setFoodEmoji] = useState<string>('🍎');
  const [dir, setDir] = useState<Direction>('RIGHT');
  const dirRef = useRef<Direction>('RIGHT');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('kiddozap_snake_high') || 0);
    } catch {
      return 0;
    }
  });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameSpeed, setGameSpeed] = useState<number>(140);

  const getRandomFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const initSnake: Point[] = [
      { x: 9, y: 9 },
      { x: 8, y: 9 },
      { x: 7, y: 9 },
    ];
    setSnake(initSnake);
    setFood(getRandomFood(initSnake));
    setFoodEmoji(FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)]);
    setDir('RIGHT');
    dirRef.current = 'RIGHT';
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setGameSpeed(140);
  };

  const changeDirection = (newDir: Direction) => {
    const current = dirRef.current;
    if (
      (newDir === 'UP' && current === 'DOWN') ||
      (newDir === 'DOWN' && current === 'UP') ||
      (newDir === 'LEFT' && current === 'RIGHT') ||
      (newDir === 'RIGHT' && current === 'LEFT')
    ) {
      return;
    }
    sounds.tap();
    setDir(newDir);
    dirRef.current = newDir;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        changeDirection('UP');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        changeDirection('DOWN');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        changeDirection('LEFT');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        changeDirection('RIGHT');
      } else if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Game Loop
  useEffect(() => {
    if (isGameOver || isPaused) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        const currentDir = dirRef.current;

        if (currentDir === 'UP') head.y -= 1;
        if (currentDir === 'DOWN') head.y += 1;
        if (currentDir === 'LEFT') head.x -= 1;
        if (currentDir === 'RIGHT') head.x += 1;

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          sounds.incorrect();
          setIsGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          sounds.incorrect();
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          sounds.correct();
          const nextScore = score + 1;
          setScore(nextScore);
          if (nextScore > highScore) {
            setHighScore(nextScore);
            try {
              localStorage.setItem('kiddozap_snake_high', String(nextScore));
            } catch {
              // ignore
            }
          }

          if (nextScore % 5 === 0) {
            confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
            setGameSpeed((s) => Math.max(80, s - 10));
          }

          setFood(getRandomFood(newSnake));
          setFoodEmoji(FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)]);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, gameSpeed);

    return () => clearInterval(interval);
  }, [isGameOver, isPaused, food, score, highScore, gameSpeed, getRandomFood]);

  useEffect(() => {
    if (isGameOver && score > 0) {
      const starsEarned = Math.min(5, Math.max(1, Math.floor(score / 3)));
      onGameComplete(starsEarned, score);
    }
  }, [isGameOver, score, onGameComplete]);

  return (
    <div id="game-snake" className="max-w-xl mx-auto p-4 flex flex-col items-center">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-3 bg-white/90 backdrop-blur px-4 py-2.5 rounded-2xl shadow-sm border border-emerald-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'hi' ? 'वापस' : 'Back'}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 font-black text-sm">
            <span>🐍</span>
            <span>{score}</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 font-bold text-xs">
            <Trophy className="w-3.5 h-3.5" />
            <span>{highScore}</span>
          </div>
        </div>

        <button
          onClick={() => setIsPaused((p) => !p)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
          title="Pause"
        >
          {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4" />}
        </button>
      </div>

      {/* Grid Canvas */}
      <div
        className="relative bg-emerald-950/90 rounded-3xl p-3 shadow-xl border-4 border-emerald-500/40 w-full max-w-[360px] aspect-square flex flex-col"
        style={{ touchAction: 'none' }}
      >
        <div
          className="grid gap-[1px] w-full h-full bg-emerald-900/60 rounded-2xl p-1 overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
            const isFoodItem = food.x === x && food.y === y;

            return (
              <div
                key={idx}
                className={`rounded-sm flex items-center justify-center transition-colors ${
                  isHead
                    ? 'bg-emerald-400 shadow-md ring-2 ring-emerald-300 z-10'
                    : isBody
                    ? 'bg-emerald-500/90'
                    : 'bg-emerald-900/20'
                }`}
              >
                {isHead && <span className="text-[10px] leading-none">👀</span>}
                {isFoodItem && <span className="text-sm leading-none animate-bounce">{foodEmoji}</span>}
              </div>
            );
          })}
        </div>

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <span className="text-5xl mb-2">💥</span>
            <h3 className="text-2xl font-black text-amber-300 mb-1 font-fredoka">
              {lang === 'hi' ? 'खेल समाप्त!' : 'Game Over!'}
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              {lang === 'hi' ? `आपका स्कोर: ${score}` : `Your Delicious Score: ${score}`}
            </p>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-black rounded-2xl shadow-lg transition active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              {lang === 'hi' ? 'फिर से खेलें' : 'Play Again'}
            </button>
          </div>
        )}
      </div>

      {/* D-Pad Controls for Mobile */}
      <div className="mt-4 flex flex-col items-center gap-2 select-none">
        <button
          onClick={() => changeDirection('UP')}
          className="w-14 h-12 bg-white rounded-2xl shadow-md border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 flex items-center justify-center text-xl font-black text-slate-700"
        >
          ▲
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => changeDirection('LEFT')}
            className="w-14 h-12 bg-white rounded-2xl shadow-md border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 flex items-center justify-center text-xl font-black text-slate-700"
          >
            ◀
          </button>
          <button
            onClick={() => changeDirection('DOWN')}
            className="w-14 h-12 bg-white rounded-2xl shadow-md border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 flex items-center justify-center text-xl font-black text-slate-700"
          >
            ▼
          </button>
          <button
            onClick={() => changeDirection('RIGHT')}
            className="w-14 h-12 bg-white rounded-2xl shadow-md border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 flex items-center justify-center text-xl font-black text-slate-700"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};
