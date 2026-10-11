import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';

export const FlappyHeroGame: React.FC<{ onGameOver?: (score: number) => void }> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('kz_flappy_highscore') || '0', 10);
  });

  const stateRef = useRef({
    birdY: 150,
    velocity: 0,
    gravity: 0.38,
    jump: -6.5,
    pipes: [] as { x: number; top: number; bottom: number; passed: boolean }[],
    frame: 0,
    score: 0,
    highScore: highScore,
  });

  const jump = () => {
    if (!isPlaying) {
      startGame();
      return;
    }
    soundManager.playJump();
    stateRef.current.velocity = stateRef.current.jump;
  };

  const startGame = () => {
    soundManager.playPop();
    stateRef.current = {
      birdY: 150,
      velocity: 0,
      gravity: 0.38,
      jump: -6.5,
      pipes: [
        { x: 340, top: 100, bottom: 200, passed: false },
        { x: 500, top: 140, bottom: 240, passed: false },
      ],
      frame: 0,
      score: 0,
      highScore: highScore,
    };
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    let animId: number;

    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const state = stateRef.current;

      // Update
      if (isPlaying && !isGameOver) {
        state.velocity += state.gravity;
        state.birdY += state.velocity;
        state.frame++;

        // Add pipes
        if (state.frame % 90 === 0) {
          const topH = Math.floor(Math.random() * 140) + 40;
          const gap = 110;
          state.pipes.push({
            x: canvas.width,
            top: topH,
            bottom: topH + gap,
            passed: false,
          });
        }

        // Move pipes
        for (let i = 0; i < state.pipes.length; i++) {
          const p = state.pipes[i];
          p.x -= 2.2;

          // Check pass
          if (!p.passed && p.x + 40 < 60) {
            p.passed = true;
            state.score++;
            soundManager.playScore();
            setScore(state.score);
            if (state.score > state.highScore) {
              state.highScore = state.score;
              setHighScore(state.score);
              localStorage.setItem('kz_flappy_highscore', state.score.toString());
            }
          }

          // Check collision
          const birdX = 60;
          const birdSize = 14;
          if (
            birdX + birdSize > p.x &&
            birdX - birdSize < p.x + 40 &&
            (state.birdY - birdSize < p.top || state.birdY + birdSize > p.bottom)
          ) {
            soundManager.playCrash();
            setIsGameOver(true);
            setIsPlaying(false);
          }
        }

        // Clean offscreen pipes
        state.pipes = state.pipes.filter(p => p.x > -60);

        // Ground / Ceiling collision
        if (state.birdY > canvas.height - 20 || state.birdY < 10) {
          soundManager.playCrash();
          setIsGameOver(true);
          setIsPlaying(false);
        }
      }

      // Draw
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars background
      ctx.fillStyle = '#334155';
      for (let i = 0; i < 20; i++) {
        const sx = ((i * 37) + state.frame * 0.2) % canvas.width;
        const sy = (i * 29) % (canvas.height - 40);
        ctx.fillRect(canvas.width - sx, sy, 2, 2);
      }

      // Pipes
      for (const p of state.pipes) {
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#059669';
        ctx.shadowBlur = 8;
        // Top pipe
        ctx.fillRect(p.x, 0, 40, p.top);
        // Bottom pipe
        ctx.fillRect(p.x, p.bottom, 40, canvas.height - p.bottom);
        ctx.shadowBlur = 0;
      }

      // Bird
      ctx.save();
      ctx.translate(60, state.birdY);
      const rot = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, state.velocity * 0.08));
      ctx.rotate(rot);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();

      // Wing
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(-4, 2, 7, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(6, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(8, -4, 2, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(18, 2);
      ctx.lineTo(10, 6);
      ctx.fill();
      ctx.restore();

      // Ground
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(0, canvas.height - 20, canvas.width, 2);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver]);

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm flex justify-between items-center mb-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm font-bold">
        <span className="text-amber-400">Score: <strong className="text-white">{score}</strong></span>
        <span className="text-emerald-400">High: <strong className="text-white">{highScore}</strong></span>
      </div>

      <div
        onClick={jump}
        className="relative w-[320px] h-[380px] bg-slate-950 border-2 border-amber-500/50 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
      >
        <canvas ref={canvasRef} width={320} height={380} className="w-full h-full block" />

        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            {isGameOver ? (
              <>
                <div className="text-4xl mb-2">💥</div>
                <h3 className="text-2xl font-black text-rose-400 mb-1">Game Over!</h3>
                <p className="text-slate-300 text-sm mb-4">Score: <strong className="text-white">{score}</strong></p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">🐥</div>
                <h3 className="text-2xl font-black text-amber-400 mb-1">Flap Hero</h3>
                <p className="text-slate-400 text-xs mb-4">Tap screen or press Spacebar to flap wings!</p>
              </>
            )}

            <button
              onClick={e => {
                e.stopPropagation();
                startGame();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-xl shadow-lg cursor-pointer"
            >
              {isGameOver ? 'Play Again ↻' : 'Start Flap ⚡'}
            </button>
          </div>
        )}
      </div>

      <p className="text-slate-500 text-xs mt-3">Click / Tap or Spacebar to flap</p>
    </div>
  );
};
