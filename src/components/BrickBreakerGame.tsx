import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Play, Star, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface BrickBreakerProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  hits: number;
  points: number;
}

interface PowerUp {
  x: number;
  y: number;
  vy: number;
  type: 'wide' | 'multi' | 'slow';
}

export const BrickBreakerGame: React.FC<BrickBreakerProps> = ({ lang, onBack, onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover' | 'victory'>('ready');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [level, setLevel] = useState<number>(1);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('kiddozap_brick_high') || 0);
    } catch {
      return 0;
    }
  });

  const stateRef = useRef({
    paddle: {
      x: 200,
      w: 80,
      h: 12,
      speed: 7,
    },
    balls: [
      { x: 200, y: 440, vx: 3.5, vy: -4.5, radius: 7 },
    ],
    bricks: [] as Brick[],
    powerUps: [] as PowerUp[],
    score: 0,
    lives: 3,
    movingLeft: false,
    movingRight: false,
  });

  const initBricks = (lvl: number) => {
    const bricks: Brick[] = [];
    const rows = 5;
    const cols = 7;
    const brickW = 46;
    const brickH = 18;
    const paddingX = 8;
    const paddingY = 8;
    const offsetX = 16;
    const offsetY = 45;

    const rowColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: offsetX + c * (brickW + paddingX),
          y: offsetY + r * (brickH + paddingY),
          w: brickW,
          h: brickH,
          color: rowColors[r % rowColors.length],
          hits: 1,
          points: (rows - r) * 10,
        });
      }
    }
    stateRef.current.bricks = bricks;
    stateRef.current.balls = [{ x: 200, y: 440, vx: 3.2, vy: -4.2, radius: 7 }];
    stateRef.current.paddle = { x: 200, w: 80, h: 12, speed: 7 };
    stateRef.current.powerUps = [];
  };

  const startGame = () => {
    sounds.tap(1.2);
    const s = stateRef.current;
    s.score = 0;
    s.lives = 3;
    setScore(0);
    setLives(3);
    setLevel(1);
    initBricks(1);
    setGameState('playing');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') stateRef.current.movingLeft = true;
      if (e.key === 'ArrowRight' || e.key === 'd') stateRef.current.movingRight = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') stateRef.current.movingLeft = false;
      if (e.key === 'ArrowRight' || e.key === 'd') stateRef.current.movingRight = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Touch / Pointer Drag on Canvas
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const clientX = (e.clientX - rect.left) * scale;
    stateRef.current.paddle.x = Math.max(stateRef.current.paddle.w / 2, Math.min(canvas.width - stateRef.current.paddle.w / 2, clientX));
  };

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const s = stateRef.current;
      const W = canvas.width;
      const H = canvas.height;
      const p = s.paddle;

      if (gameState === 'playing') {
        // Paddle movement
        if (s.movingLeft && p.x - p.w / 2 > 0) p.x -= p.speed;
        if (s.movingRight && p.x + p.w / 2 < W) p.x += p.speed;

        // Check Victory (All bricks broken)
        if (s.bricks.length === 0) {
          sounds.complete();
          confetti({ particleCount: 60, spread: 80 });
          setLevel((l) => {
            const nextLvl = l + 1;
            initBricks(nextLvl);
            return nextLvl;
          });
        }

        // Update Powerups
        for (let i = s.powerUps.length - 1; i >= 0; i--) {
          const pu = s.powerUps[i];
          pu.y += pu.vy;

          // Catch powerup
          if (
            pu.y + 10 >= 475 &&
            pu.y <= 490 &&
            pu.x >= p.x - p.w / 2 &&
            pu.x <= p.x + p.w / 2
          ) {
            sounds.correct();
            if (pu.type === 'wide') {
              p.w = Math.min(130, p.w + 25);
            } else if (pu.type === 'multi') {
              s.balls.push({
                x: p.x,
                y: 450,
                vx: (Math.random() - 0.5) * 6,
                vy: -4.5,
                radius: 7,
              });
            }
            s.powerUps.splice(i, 1);
            continue;
          }

          if (pu.y > H) s.powerUps.splice(i, 1);
        }

        // Update Balls
        for (let i = s.balls.length - 1; i >= 0; i--) {
          const b = s.balls[i];
          b.x += b.vx;
          b.y += b.vy;

          // Wall bounces
          if (b.x - b.radius < 0) {
            b.x = b.radius;
            b.vx = Math.abs(b.vx);
            sounds.tap(1.1);
          }
          if (b.x + b.radius > W) {
            b.x = W - b.radius;
            b.vx = -Math.abs(b.vx);
            sounds.tap(1.1);
          }
          if (b.y - b.radius < 0) {
            b.y = b.radius;
            b.vy = Math.abs(b.vy);
            sounds.tap(1.1);
          }

          // Paddle bounce
          if (
            b.y + b.radius >= 476 &&
            b.y - b.radius <= 488 &&
            b.x >= p.x - p.w / 2 - 5 &&
            b.x <= p.x + p.w / 2 + 5
          ) {
            sounds.tap(1.3);
            b.vy = -Math.abs(b.vy);
            // Influence angle based on hit position
            const hitOffset = (b.x - p.x) / (p.w / 2);
            b.vx = hitOffset * 5.2;
            b.y = 475 - b.radius;
          }

          // Brick collision
          for (let k = s.bricks.length - 1; k >= 0; k--) {
            const brick = s.bricks[k];
            if (
              b.x + b.radius > brick.x &&
              b.x - b.radius < brick.x + brick.w &&
              b.y + b.radius > brick.y &&
              b.y - b.radius < brick.y + brick.h
            ) {
              // Hit brick!
              sounds.tap(1.6);
              b.vy *= -1;
              s.score += brick.points;
              setScore(s.score);

              // Chance of PowerUp
              if (Math.random() > 0.75) {
                s.powerUps.push({
                  x: brick.x + brick.w / 2,
                  y: brick.y,
                  vy: 2.5,
                  type: Math.random() > 0.5 ? 'wide' : 'multi',
                });
              }

              s.bricks.splice(k, 1);
              break;
            }
          }

          // Ball fell below screen
          if (b.y > H + 10) {
            s.balls.splice(i, 1);
          }
        }

        // If all balls lost
        if (s.balls.length === 0) {
          sounds.incorrect();
          s.lives -= 1;
          setLives(s.lives);

          if (s.lives <= 0) {
            setGameState('gameover');
            const finalScore = s.score;
            setHighScore((prev) => Math.max(prev, finalScore));
            try {
              localStorage.setItem('kiddozap_brick_high', String(Math.max(highScore, finalScore)));
            } catch {}
            onGameComplete(finalScore > 500 ? 3 : finalScore > 200 ? 2 : 1, finalScore);
          } else {
            // Respawn single ball
            s.balls = [{ x: p.x, y: 440, vx: 3.2, vy: -4.2, radius: 7 }];
          }
        }
      }

      // ---------------- RENDER ----------------
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, W, H);

      // Neon grid background
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }

      // Draw Bricks
      s.bricks.forEach((brick) => {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
        // Bevel highlight
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillRect(brick.x, brick.y, brick.w, 4);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(brick.x, brick.y + brick.h - 4, brick.w, 4);
      });

      // Draw Powerups
      s.powerUps.forEach((pu) => {
        ctx.fillStyle = pu.type === 'wide' ? '#38bdf8' : '#eab308';
        ctx.beginPath();
        ctx.arc(pu.x, pu.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(pu.type === 'wide' ? 'W' : '⭐', pu.x, pu.y + 3);
      });

      // Draw Paddle
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.roundRect(p.x - p.w / 2, 478, p.w, p.h, 6);
      ctx.fill();
      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(p.x - p.w / 4, 480, p.w / 2, 3);

      // Draw Balls
      s.balls.forEach((b) => {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div className="w-full h-full flex flex-col items-center select-none overflow-hidden pb-1">
      {/* Header Bar */}
      <div className="w-full max-w-[400px] flex items-center justify-between mb-2 bg-white/95 backdrop-blur rounded-2xl p-2 border border-amber-200 shadow-xs">
        <button
          onClick={() => {
            sounds.tap(0.9);
            onBack();
          }}
          className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Hearts */}
          <div className="flex gap-1 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 text-xs">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={i < lives ? 'text-rose-500' : 'text-slate-300'}>
                ❤️
              </span>
            ))}
          </div>

          <div className="px-2.5 py-0.5 bg-cyan-600 text-white font-black text-xs rounded-lg shadow-xs">
            <span>🧱 {score}</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg text-xs font-black">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>{highScore}</span>
          </div>
        </div>

        <button
          onClick={startGame}
          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95"
          title="Restart"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Canvas */}
      <div className="relative w-full max-w-[400px] aspect-[400/520] bg-slate-950 rounded-3xl overflow-hidden shadow-xl border-4 border-cyan-500 cursor-ew-resize">
        <canvas
          ref={canvasRef}
          width={400}
          height={520}
          onPointerMove={handlePointerMove}
          className="w-full h-full block touch-none"
        />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-4xl shadow-xl mb-3 animate-bounce">
              🧱
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-display text-cyan-300">
              {lang === 'hi' ? 'ब्रिक ब्रेकर (दीवार तोड़ो)' : 'Brick Breaker Neon'}
            </h3>
            <p className="text-xs text-slate-200 font-semibold max-w-xs mt-1 mb-5">
              {lang === 'hi'
                ? 'पैडल को खिसकाएं, गेंद को उछालें और सभी रंग-बिरंगी ईंटों को तोड़ें!'
                : 'Deflect the bouncing ball, grab power-ups, and smash through every brick wall!'}
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-2xl text-sm shadow-xl active:scale-95 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{lang === 'hi' ? 'खेल शुरू करें' : 'Start Smash'}</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <span className="text-5xl mb-2">💥</span>
            <h3 className="text-2xl font-black font-display text-rose-400">
              {lang === 'hi' ? 'गेंद गिर गई!' : 'Ball Lost!'}
            </h3>
            <div className="bg-white/10 rounded-2xl p-4 my-3 w-full max-w-xs border border-white/20">
              <p className="text-xs text-slate-300 font-bold">{lang === 'hi' ? 'अंतिम स्कोर' : 'Final Score'}</p>
              <p className="text-3xl font-black text-amber-300 my-1 font-display">{score}</p>
              <p className="text-xs text-slate-300">
                {lang === 'hi' ? `सर्वश्रेष्ठ: ${highScore}` : `Best: ${highScore}`}
              </p>
            </div>
            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={startGame}
                className="flex-1 py-3 bg-cyan-500 text-white font-black text-xs rounded-2xl active:scale-95 shadow-md"
              >
                {lang === 'hi' ? 'पुनः प्रयास' : 'Play Again'}
              </button>
              <button
                onClick={onBack}
                className="py-3 px-5 bg-white/20 text-white font-bold text-xs rounded-2xl active:scale-95"
              >
                {lang === 'hi' ? 'हब' : 'Hub'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch Left/Right Buttons */}
      <div className="w-full max-w-[400px] flex items-center justify-between gap-3 mt-2 px-1">
        <button
          onMouseDown={() => (stateRef.current.movingLeft = true)}
          onMouseUp={() => (stateRef.current.movingLeft = false)}
          onTouchStart={() => (stateRef.current.movingLeft = true)}
          onTouchEnd={() => (stateRef.current.movingLeft = false)}
          className="flex-1 py-3.5 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-black text-sm shadow-md active:translate-y-1 select-none"
        >
          ◀ {lang === 'hi' ? 'पैडल बाएं' : 'Paddle Left'}
        </button>

        <button
          onMouseDown={() => (stateRef.current.movingRight = true)}
          onMouseUp={() => (stateRef.current.movingRight = false)}
          onTouchStart={() => (stateRef.current.movingRight = true)}
          onTouchEnd={() => (stateRef.current.movingRight = false)}
          className="flex-1 py-3.5 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-black text-sm shadow-md active:translate-y-1 select-none"
        >
          {lang === 'hi' ? 'पैडल दाएं' : 'Paddle Right'} ▶
        </button>
      </div>
    </div>
  );
};
