import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';

export const GeoDashGame: React.FC<{ onGameOver?: (score: number) => void }> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('kz_geodash_highscore') || '0', 10);
  });

  const stateRef = useRef({
    playerY: 260,
    velocityY: 0,
    gravity: 0.75,
    isGrounded: true,
    rotation: 0,
    speed: 4.5,
    obstacles: [] as { x: number; w: number; h: number; type: 'spike' | 'block' }[],
    frame: 0,
    score: 0,
    highScore: highScore,
  });

  const jump = () => {
    if (!isPlaying) {
      startGame();
      return;
    }
    const state = stateRef.current;
    if (state.isGrounded) {
      soundManager.playJump();
      state.velocityY = -11.5;
      state.isGrounded = false;
    }
  };

  const startGame = () => {
    soundManager.playPop();
    stateRef.current = {
      playerY: 260,
      velocityY: 0,
      gravity: 0.75,
      isGrounded: true,
      rotation: 0,
      speed: 4.8,
      obstacles: [
        { x: 400, w: 26, h: 26, type: 'spike' },
        { x: 650, w: 26, h: 26, type: 'spike' },
        { x: 900, w: 30, h: 30, type: 'block' },
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
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        jump();
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
      const floorY = 270;
      const playerSize = 28;

      if (isPlaying && !isGameOver) {
        state.frame++;
        state.score = Math.floor(state.frame / 6);
        setScore(state.score);

        if (state.score > state.highScore) {
          state.highScore = state.score;
          setHighScore(state.score);
          localStorage.setItem('kz_geodash_highscore', state.score.toString());
        }

        // Physics
        state.velocityY += state.gravity;
        state.playerY += state.velocityY;

        if (state.playerY >= floorY - playerSize) {
          state.playerY = floorY - playerSize;
          state.velocityY = 0;
          state.isGrounded = true;
          // Snap rotation to nearest 90 deg
          state.rotation = Math.round(state.rotation / (Math.PI / 2)) * (Math.PI / 2);
        } else {
          state.rotation += 0.14;
        }

        // Spawn obstacles
        if (state.frame % 85 === 0) {
          const type = Math.random() > 0.4 ? 'spike' : 'block';
          state.obstacles.push({
            x: canvas.width + 50,
            w: 26,
            h: 26,
            type,
          });
        }

        // Move obstacles
        const playerX = 70;
        for (const obs of state.obstacles) {
          obs.x -= state.speed;

          // Collision check
          if (
            obs.x < playerX + playerSize - 4 &&
            obs.x + obs.w > playerX + 4 &&
            state.playerY + playerSize > floorY - obs.h + 4
          ) {
            soundManager.playCrash();
            setIsGameOver(true);
            setIsPlaying(false);
          }
        }

        // Filter offscreen
        state.obstacles = state.obstacles.filter(o => o.x > -50);
      }

      // Render
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyber Grid Background
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridOffset = (state.frame * 2) % 40;
      for (let x = -gridOffset; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, floorY);
        ctx.stroke();
      }

      // Floor
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, floorY, canvas.width, canvas.height - floorY);
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.fillRect(0, floorY, canvas.width, 3);
      ctx.shadowBlur = 0;

      // Obstacles
      for (const obs of state.obstacles) {
        if (obs.type === 'spike') {
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(obs.x, floorY);
          ctx.lineTo(obs.x + obs.w / 2, floorY - obs.h);
          ctx.lineTo(obs.x + obs.w, floorY);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillStyle = '#8b5cf6';
          ctx.shadowColor = '#8b5cf6';
          ctx.shadowBlur = 8;
          ctx.fillRect(obs.x, floorY - obs.h, obs.w, obs.h);
        }
        ctx.shadowBlur = 0;
      }

      // Player Cube
      ctx.save();
      ctx.translate(70 + playerSize / 2, state.playerY + playerSize / 2);
      ctx.rotate(state.rotation);

      // Neon Cube
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 14;
      ctx.fillRect(-playerSize / 2, -playerSize / 2, playerSize, playerSize);
      ctx.shadowBlur = 0;

      // Inner Eye / Face
      ctx.fillStyle = '#000000';
      ctx.fillRect(-playerSize / 4, -playerSize / 4, 6, 6);
      ctx.fillRect(playerSize / 4 - 6, -playerSize / 4, 6, 6);
      ctx.fillRect(-playerSize / 4, playerSize / 6, playerSize / 2, 4);

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver]);

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-md flex justify-between items-center mb-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm font-bold">
        <span className="text-amber-400">Score: <strong className="text-white">{score}</strong></span>
        <span className="text-cyan-400">High: <strong className="text-white">{highScore}</strong></span>
      </div>

      <div
        onClick={jump}
        className="relative w-[340px] h-[340px] sm:w-[420px] bg-slate-950 border-2 border-amber-500/50 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
      >
        <canvas ref={canvasRef} width={420} height={340} className="w-full h-full block" />

        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            {isGameOver ? (
              <>
                <div className="text-4xl mb-2">💥</div>
                <h3 className="text-2xl font-black text-rose-400 mb-1">Crashed!</h3>
                <p className="text-slate-300 text-sm mb-4">Final Distance: <strong className="text-white">{score}m</strong></p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="text-2xl font-black text-amber-400 mb-1">Neon Rhythm Run</h3>
                <p className="text-slate-400 text-xs mb-4">Tap screen or Spacebar to jump over neon spikes!</p>
              </>
            )}

            <button
              onClick={e => {
                e.stopPropagation();
                startGame();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-xl shadow-lg cursor-pointer active:scale-95"
            >
              {isGameOver ? 'Try Again ↻' : 'Start Run ⚡'}
            </button>
          </div>
        )}
      </div>

      <p className="text-slate-500 text-xs mt-3">Click / Tap or Spacebar to Jump</p>
    </div>
  );
};
