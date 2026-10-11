import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';

export const BrickBreakerGame: React.FC<{ onGameOver?: (score: number) => void }> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const stateRef = useRef({
    paddleX: 130,
    paddleW: 65,
    ballX: 160,
    ballY: 260,
    ballDX: 3,
    ballDY: -3,
    ballRadius: 6,
    bricks: [] as { x: number; y: number; w: number; h: number; alive: boolean; color: string }[],
    score: 0,
  });

  const startGame = () => {
    soundManager.playPop();
    const bricks = [];
    const colors = ['#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6'];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 6; c++) {
        bricks.push({
          x: 10 + c * 50,
          y: 30 + r * 20,
          w: 44,
          h: 14,
          alive: true,
          color: colors[r],
        });
      }
    }

    stateRef.current = {
      paddleX: 130,
      paddleW: 65,
      ballX: 160,
      ballY: 260,
      ballDX: (Math.random() > 0.5 ? 1 : -1) * 2.8,
      ballDY: -3.2,
      ballRadius: 6,
      bricks,
      score: 0,
    };
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    stateRef.current.paddleX = Math.max(0, Math.min(320 - stateRef.current.paddleW, x - stateRef.current.paddleW / 2));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    stateRef.current.paddleX = Math.max(0, Math.min(320 - stateRef.current.paddleW, x - stateRef.current.paddleW / 2));
  };

  useEffect(() => {
    let animId: number;

    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const state = stateRef.current;

      if (isPlaying && !isGameOver) {
        state.ballX += state.ballDX;
        state.ballY += state.ballDY;

        // Wall collisions
        if (state.ballX - state.ballRadius < 0 || state.ballX + state.ballRadius > canvas.width) {
          state.ballDX = -state.ballDX;
          soundManager.playPop();
        }
        if (state.ballY - state.ballRadius < 0) {
          state.ballDY = -state.ballDY;
          soundManager.playPop();
        }

        // Paddle collision
        const paddleY = canvas.height - 24;
        if (
          state.ballY + state.ballRadius >= paddleY &&
          state.ballY - state.ballRadius <= paddleY + 10 &&
          state.ballX >= state.paddleX &&
          state.ballX <= state.paddleX + state.paddleW
        ) {
          state.ballDY = -Math.abs(state.ballDY);
          // Angle modifier
          const hitOffset = (state.ballX - (state.paddleX + state.paddleW / 2)) / (state.paddleW / 2);
          state.ballDX = hitOffset * 4;
          soundManager.playJump();
        }

        // Brick collision
        for (const b of state.bricks) {
          if (b.alive) {
            if (
              state.ballX > b.x &&
              state.ballX < b.x + b.w &&
              state.ballY > b.y &&
              state.ballY < b.y + b.h
            ) {
              b.alive = false;
              state.ballDY = -state.ballDY;
              state.score += 15;
              soundManager.playScore();
              setScore(state.score);
              break;
            }
          }
        }

        // Bottom drop
        if (state.ballY > canvas.height) {
          soundManager.playCrash();
          setIsGameOver(true);
          setIsPlaying(false);
        }
      }

      // Draw
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bricks
      for (const b of state.bricks) {
        if (b.alive) {
          ctx.fillStyle = b.color;
          ctx.shadowColor = b.color;
          ctx.shadowBlur = 6;
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.shadowBlur = 0;
        }
      }

      // Paddle
      const paddleY = canvas.height - 24;
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(state.paddleX, paddleY, state.paddleW, 10, 5);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Ball
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, state.ballRadius, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver]);

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-xs flex justify-between items-center mb-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm font-bold">
        <span className="text-cyan-400">Score: <strong className="text-white">{score}</strong></span>
        <button
          onClick={startGame}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg cursor-pointer"
        >
          Restart ↻
        </button>
      </div>

      <div
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-[320px] h-[340px] bg-slate-950 border-2 border-cyan-500/50 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
      >
        <canvas ref={canvasRef} width={320} height={340} className="w-full h-full block" />

        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            {isGameOver ? (
              <>
                <div className="text-4xl mb-2">💥</div>
                <h3 className="text-2xl font-black text-rose-400 mb-1">Game Over!</h3>
                <p className="text-slate-300 text-sm mb-4">Score: <strong className="text-white">{score}</strong></p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">🧱</div>
                <h3 className="text-2xl font-black text-cyan-400 mb-1">Brick Breaker Neon</h3>
                <p className="text-slate-400 text-xs mb-4">Move your paddle to bounce the ball and break bricks!</p>
              </>
            )}

            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-xl shadow-lg cursor-pointer active:scale-95"
            >
              {isGameOver ? 'Play Again ↻' : 'Start Breaker ⚡'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
