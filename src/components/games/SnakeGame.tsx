import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundManager } from '../../utils/audio';

interface SnakeGameProps {
  onGameOver?: (score: number) => void;
  embed?: boolean;
}

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;

export const SnakeGame: React.FC<SnakeGameProps> = ({ onGameOver }) => {
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('kz_snake_highscore') || '0', 10);
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const directionRef = useRef<Direction>(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    while (true) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      if (!currentSnake.some(seg => seg.x === x && seg.y === y)) {
        return { x, y };
      }
    }
  }, []);

  const startGame = () => {
    soundManager.playPop();
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ]);
    setDirection('UP');
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setFood(generateFood([{ x: 10, y: 10 }]));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) {
        if (e.code === 'Space' || e.key === 'Enter') {
          startGame();
        }
        return;
      }
      const current = directionRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && current !== 'DOWN') {
        setDirection('UP');
        e.preventDefault();
      } else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && current !== 'UP') {
        setDirection('DOWN');
        e.preventDefault();
      } else if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && current !== 'RIGHT') {
        setDirection('LEFT');
        e.preventDefault();
      } else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && current !== 'LEFT') {
        setDirection('RIGHT');
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, generateFood]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        const dir = directionRef.current;

        if (dir === 'UP') head.y -= 1;
        if (dir === 'DOWN') head.y += 1;
        if (dir === 'LEFT') head.x -= 1;
        if (dir === 'RIGHT') head.x += 1;

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          soundManager.playCrash();
          setIsGameOver(true);
          setIsPlaying(false);
          if (onGameOver) onGameOver(score);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
          soundManager.playCrash();
          setIsGameOver(true);
          setIsPlaying(false);
          if (onGameOver) onGameOver(score);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          soundManager.playScore();
          const nextScore = score + 10;
          setScore(nextScore);
          if (nextScore > highScore) {
            setHighScore(nextScore);
            localStorage.setItem('kz_snake_highscore', nextScore.toString());
          }
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, food, score, highScore, onGameOver, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-md flex justify-between items-center mb-3 text-sm font-bold bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2">
        <span className="text-cyan-400">Score: <strong className="text-white text-base">{score}</strong></span>
        <span className="text-emerald-400">High: <strong className="text-white text-base">{highScore}</strong></span>
      </div>

      <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] bg-slate-950 border-2 border-cyan-500/50 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-950/40">
        {/* Grid cells */}
        <div 
          className="w-full h-full grid"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={index}
                className={`transition-all duration-75 ${
                  isHead
                    ? 'bg-cyan-400 rounded-sm shadow-md shadow-cyan-400/50'
                    : isSnake
                    ? 'bg-teal-500 rounded-xs'
                    : isFood
                    ? 'bg-rose-500 rounded-full animate-pulse shadow-md shadow-rose-500/80'
                    : 'border-[0.5px] border-slate-900/40'
                }`}
              />
            );
          })}
        </div>

        {/* Start / Game Over overlay */}
        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            {isGameOver ? (
              <>
                <div className="text-3xl mb-1">💥</div>
                <h3 className="text-2xl font-black text-rose-400 mb-1">Game Over!</h3>
                <p className="text-slate-300 text-sm mb-4">Final Score: <strong className="text-white">{score}</strong></p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">🐍</div>
                <h3 className="text-2xl font-black text-cyan-400 mb-1">Snake Neon</h3>
                <p className="text-slate-400 text-xs mb-4">Use Arrow Keys or WASD to turn. Eat glowing pellets to grow!</p>
              </>
            )}

            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold rounded-xl shadow-lg shadow-cyan-500/30 transform active:scale-95 transition-all cursor-pointer"
            >
              {isGameOver ? 'Play Again ↻' : 'Start Game ⚡'}
            </button>
          </div>
        )}
      </div>

      {/* Touch D-Pad for Mobile */}
      <div className="mt-4 grid grid-cols-3 gap-2 w-48 sm:hidden">
        <div />
        <button
          onClick={() => directionRef.current !== 'DOWN' && setDirection('UP')}
          className="p-3 bg-slate-800 active:bg-cyan-600 rounded-xl font-bold text-white shadow"
        >
          ▲
        </button>
        <div />
        <button
          onClick={() => directionRef.current !== 'RIGHT' && setDirection('LEFT')}
          className="p-3 bg-slate-800 active:bg-cyan-600 rounded-xl font-bold text-white shadow"
        >
          ◀
        </button>
        <button
          onClick={() => directionRef.current !== 'UP' && setDirection('DOWN')}
          className="p-3 bg-slate-800 active:bg-cyan-600 rounded-xl font-bold text-white shadow"
        >
          ▼
        </button>
        <button
          onClick={() => directionRef.current !== 'LEFT' && setDirection('RIGHT')}
          className="p-3 bg-slate-800 active:bg-cyan-600 rounded-xl font-bold text-white shadow"
        >
          ▶
        </button>
      </div>
    </div>
  );
};
