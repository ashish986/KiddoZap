import React, { useState, useEffect, useRef } from 'react';
import { GameInfo } from '../../data/games';
import { soundManager } from '../../utils/audio';

interface GenericArcadeGameProps {
  game: GameInfo;
  onGameOver?: (score: number) => void;
}

export const GenericArcadeGame: React.FC<GenericArcadeGameProps> = ({ game, onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem(`kz_${game.id}_highscore`) || '0', 10);
  });

  const stateRef = useRef({
    posX: 150,
    posY: 220,
    speed: 3,
    entities: [] as { x: number; y: number; size: number; speed: number; icon: string }[],
    score: 0,
    frame: 0,
  });

  const startGame = () => {
    soundManager.playPop();
    stateRef.current = {
      posX: 150,
      posY: 220,
      speed: 3,
      entities: [],
      score: 0,
      frame: 0,
    };
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  const handleAction = () => {
    if (!isPlaying) {
      startGame();
      return;
    }
    soundManager.playJump();
    stateRef.current.posY = Math.max(40, stateRef.current.posY - 40);
  };

  const handleMove = (dx: number) => {
    if (!isPlaying || isGameOver) return;
    stateRef.current.posX = Math.max(30, Math.min(270, stateRef.current.posX + dx));
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        handleAction();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleMove(-25);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleMove(25);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  useEffect(() => {
    let animId: number;

    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const state = stateRef.current;

      if (isPlaying && !isGameOver) {
        state.frame++;
        if (state.frame % 5 === 0) {
          state.score += 1;
          setScore(state.score);
          if (state.score > highScore) {
            setHighScore(state.score);
            localStorage.setItem(`kz_${game.id}_highscore`, state.score.toString());
          }
        }

        // Natural gentle gravity
        if (state.posY < 240) {
          state.posY += 1.6;
        }

        // Spawn obstacles
        if (state.frame % 45 === 0) {
          state.entities.push({
            x: Math.floor(Math.random() * 260) + 20,
            y: -20,
            size: 24,
            speed: Math.random() * 2 + 3,
            icon: game.category === 'math' ? '⭐' : '💎',
          });
        }

        // Update entities
        for (const ent of state.entities) {
          ent.y += ent.speed;

          // Check pickup
          const dist = Math.hypot(ent.x - state.posX, ent.y - state.posY);
          if (dist < 26) {
            soundManager.playScore();
            state.score += 20;
            setScore(state.score);
            ent.y = 500; // remove
          }
        }

        state.entities = state.entities.filter(e => e.y < 350);
      }

      // Draw
      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyber lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Entities
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      for (const ent of state.entities) {
        ctx.fillText(ent.icon, ent.x, ent.y);
      }

      // Player Avatar
      ctx.font = '32px sans-serif';
      ctx.fillText(game.icon, state.posX, state.posY);

      // Floor indicator
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, 275, canvas.width, 3);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver, game, highScore]);

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-xs flex justify-between items-center mb-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm font-bold">
        <span className="text-cyan-400">Score: <strong className="text-white">{score}</strong></span>
        <span className="text-emerald-400">High: <strong className="text-white">{highScore}</strong></span>
      </div>

      <div
        onClick={handleAction}
        className="relative w-[300px] h-[320px] bg-slate-950 border-2 border-cyan-500/50 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
      >
        <canvas ref={canvasRef} width={300} height={320} className="w-full h-full block" />

        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            {isGameOver ? (
              <>
                <div className="text-4xl mb-2">💥</div>
                <h3 className="text-2xl font-black text-rose-400 mb-1">Round Completed!</h3>
                <p className="text-slate-300 text-sm mb-4">Final Score: <strong className="text-white">{score}</strong></p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">{game.icon}</div>
                <h3 className="text-2xl font-black text-cyan-400 mb-1">{game.title}</h3>
                <p className="text-slate-400 text-xs mb-4">{game.controls}</p>
              </>
            )}

            <button
              onClick={e => {
                e.stopPropagation();
                startGame();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-xl shadow-lg cursor-pointer active:scale-95"
            >
              {isGameOver ? 'Play Again ↻' : 'Start Play ⚡'}
            </button>
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => handleMove(-30)}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold rounded-xl text-lg shadow"
        >
          ◀ Left
        </button>
        <button
          onClick={handleAction}
          className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold rounded-xl text-lg shadow"
        >
          ▲ Action
        </button>
        <button
          onClick={() => handleMove(30)}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold rounded-xl text-lg shadow"
        >
          Right ▶
        </button>
      </div>
    </div>
  );
};
