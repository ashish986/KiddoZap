import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Play, Zap } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface JetpackProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

interface Zapper {
  x: number;
  y: number;
  length: number;
  angle: number;
}

interface Laser {
  y: number;
  state: 'warning' | 'firing';
  timer: number;
}

interface Coin {
  x: number;
  y: number;
  collected: boolean;
}

export const JetpackJoyrideGame: React.FC<JetpackProps> = ({ lang, onBack, onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('kiddozap_jetpack_high') || 0);
    } catch {
      return 0;
    }
  });

  const stateRef = useRef({
    player: {
      x: 75,
      y: 350,
      vy: 0,
      isFiringJetpack: false,
    },
    gravity: 0.52,
    thrust: -0.92,
    speed: 6.5,
    distance: 0,
    coinsCollected: 0,
    zappers: [] as Zapper[],
    coins: [] as Coin[],
    particles: [] as { x: number; y: number; vx: number; vy: number; alpha: number }[],
    nextObstacleDist: 200,
  });

  const startGame = () => {
    sounds.tap(1.2);
    const s = stateRef.current;
    s.player = {
      x: 75,
      y: 350,
      vy: 0,
      isFiringJetpack: false,
    };
    s.speed = 6.5;
    s.distance = 0;
    s.coinsCollected = 0;
    s.zappers = [];
    s.coins = [];
    s.particles = [];
    s.nextObstacleDist = 200;

    setScore(0);
    setCoins(0);
    setGameState('playing');
  };

  const setThrust = (active: boolean) => {
    stateRef.current.player.isFiringJetpack = active;
    if (active && gameState === 'playing') {
      sounds.tap(1.4);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        setThrust(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        setThrust(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Main Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const s = stateRef.current;
      const p = s.player;
      const W = canvas.width;
      const H = canvas.height;

      if (gameState === 'playing') {
        // Jetpack Physics
        if (p.isFiringJetpack) {
          p.vy += s.thrust;
          // Spawn jetpack bullet / spark particles
          for (let k = 0; k < 2; k++) {
            s.particles.push({
              x: p.x - 10,
              y: p.y + 14,
              vx: (Math.random() - 0.5) * 3,
              vy: 7 + Math.random() * 4,
              alpha: 1,
            });
          }
        } else {
          p.vy += s.gravity;
        }

        // Clamp speed
        p.vy = Math.max(-9, Math.min(10, p.vy));
        p.y += p.vy;

        // Ceiling & Floor boundaries
        if (p.y < 30) {
          p.y = 30;
          p.vy = 0;
        }
        if (p.y > H - 45) {
          p.y = H - 45;
          p.vy = 0;
        }

        // Distance & score
        s.distance += s.speed * 0.1;
        setScore(Math.floor(s.distance) + s.coinsCollected * 5);
        s.speed = Math.min(14, 6.5 + s.distance * 0.004);

        // Spawn Zappers
        if (s.distance > s.nextObstacleDist - 400) {
          const zY = 70 + Math.random() * (H - 180);
          s.zappers.push({
            x: W + 50,
            y: zY,
            length: 65 + Math.random() * 30,
            angle: Math.random() > 0.5 ? 0 : Math.PI / 3,
          });
          // Also spawn coin ring
          for (let c = 0; c < 4; c++) {
            s.coins.push({
              x: W + 120 + c * 24,
              y: zY > H / 2 ? zY - 60 : zY + 60,
              collected: false,
            });
          }
          s.nextObstacleDist += 160 + Math.random() * 80;
        }

        // Move Zappers
        for (let i = s.zappers.length - 1; i >= 0; i--) {
          const z = s.zappers[i];
          z.x -= s.speed;

          // Check Collision with player (box approx around zapper)
          const dx = p.x - z.x;
          const dy = p.y - z.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 26) {
            // Zapped!
            sounds.incorrect();
            setGameState('gameover');
            const finalScore = Math.floor(s.distance) + s.coinsCollected * 5;
            setHighScore((prev) => Math.max(prev, finalScore));
            try {
              localStorage.setItem('kiddozap_jetpack_high', String(Math.max(highScore, finalScore)));
            } catch {}
            onGameComplete(finalScore > 350 ? 3 : finalScore > 150 ? 2 : 1, finalScore);
          }

          if (z.x < -100) s.zappers.splice(i, 1);
        }

        // Move Coins
        for (let i = s.coins.length - 1; i >= 0; i--) {
          const coin = s.coins[i];
          coin.x -= s.speed;

          // Collection
          if (!coin.collected && Math.abs(p.x - coin.x) < 22 && Math.abs(p.y - coin.y) < 22) {
            coin.collected = true;
            sounds.correct();
            s.coinsCollected += 1;
            setCoins(s.coinsCollected);
          }

          if (coin.x < -30) s.coins.splice(i, 1);
        }

        // Update jet particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const part = s.particles[i];
          part.x += part.vx;
          part.y += part.vy;
          part.alpha -= 0.05;
          if (part.alpha <= 0) s.particles.splice(i, 1);
        }
      }

      // ---------------- RENDER ----------------
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, W, H);

      // Scrolling Laboratory Sci-Fi grid walls
      const bgOffset = (s.distance * 15) % 40;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      for (let x = -bgOffset; x < W + 40; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Metal Floor and Ceiling
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, W, 22);
      ctx.fillRect(0, H - 24, W, 24);
      // Hazard yellow stripes
      ctx.fillStyle = '#eab308';
      for (let x = 0; x < W; x += 30) {
        ctx.fillRect(x, 18, 12, 4);
        ctx.fillRect(x, H - 24, 12, 4);
      }

      // Draw Zappers (Electric Lasers)
      s.zappers.forEach((z) => {
        ctx.save();
        ctx.translate(z.x, z.y);
        ctx.rotate(z.angle);

        // Zap terminals
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(-z.length / 2, 0, 9, 0, Math.PI * 2);
        ctx.arc(z.length / 2, 0, 9, 0, Math.PI * 2);
        ctx.fill();

        // Glowing electric spark beam
        ctx.strokeStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 14;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-z.length / 2, 0);
        // Jitter lightning
        const segments = 4;
        for (let j = 1; j < segments; j++) {
          const sx = -z.length / 2 + (z.length / segments) * j;
          const sy = (Math.random() - 0.5) * 8;
          ctx.lineTo(sx, sy);
        }
        ctx.lineTo(z.length / 2, 0);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
      });

      // Draw Coins
      s.coins
        .filter((c) => !c.collected)
        .forEach((c) => {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2;
          ctx.stroke();
        });

      // Draw Jetpack bullet sparks
      s.particles.forEach((part) => {
        ctx.fillStyle = '#f97316';
        ctx.globalAlpha = part.alpha;
        ctx.beginPath();
        ctx.arc(part.x, part.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Draw Player Hero Barry with Jetpack
      ctx.save();
      ctx.translate(p.x, p.y);

      // Jetpack tank on back
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-16, -14, 10, 22);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-14, -10, 6, 8); // Danger core

      // Hero Body / Suit
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(-6, -16, 15, 24);

      // Head / Helmet
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(2, -22, 9, 0, Math.PI * 2);
      ctx.fill();
      // Cool aviator goggles
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(3, -24, 7, 5);

      // Legs
      ctx.fillStyle = '#1e293b';
      if (p.isFiringJetpack) {
        // Legs dangling back
        ctx.fillRect(-8, 8, 5, 12);
        ctx.fillRect(-2, 8, 5, 12);
      } else {
        // Running on ground
        ctx.fillRect(-4, 8, 5, 12);
        ctx.fillRect(3, 8, 5, 12);
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div className="w-full h-full flex flex-col items-center select-none overflow-hidden pb-1">
      {/* Header Bar */}
      <div className="w-full max-w-[420px] flex items-center justify-between mb-2 bg-white/95 backdrop-blur rounded-2xl p-2 border border-amber-200 shadow-xs">
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
          <div className="px-2.5 py-0.5 bg-orange-600 text-white font-black text-xs rounded-lg shadow-xs">
            <span>🚀 {score}m</span>
          </div>

          <div className="px-2 py-0.5 bg-yellow-400 text-yellow-950 font-black text-xs rounded-lg shadow-xs">
            <span>🪙 {coins}</span>
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
      <div
        className="relative w-full max-w-[420px] aspect-[420/520] bg-slate-950 rounded-3xl overflow-hidden shadow-xl border-4 border-orange-500 cursor-pointer touch-none"
        onMouseDown={() => setThrust(true)}
        onMouseUp={() => setThrust(false)}
        onTouchStart={() => setThrust(true)}
        onTouchEnd={() => setThrust(false)}
      >
        <canvas ref={canvasRef} width={420} height={520} className="w-full h-full block" />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-4xl shadow-xl mb-3 animate-bounce">
              🚀
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-display text-amber-300">
              {lang === 'hi' ? 'जेटपैक जॉयराइड' : 'Jetpack Sky Raider'}
            </h3>
            <p className="text-xs text-slate-200 font-semibold max-w-xs mt-1 mb-5">
              {lang === 'hi'
                ? 'उड़ने के लिए स्क्रीन को दबाकर रखें! इलेक्ट्रिक जैपर से बचें और हवा में तैरते सिक्के एकत्र करें।'
                : 'Hold screen to ignite your jetpack! Dodge electric zappers and collect shiny lab coins.'}
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-2xl text-sm shadow-xl active:scale-95 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{lang === 'hi' ? 'उड़ान भरें' : 'Ignite Jetpack'}</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <span className="text-5xl mb-2">⚡💥</span>
            <h3 className="text-2xl font-black font-display text-rose-400">
              {lang === 'hi' ? 'करंट लग गया!' : 'Zapped!'}
            </h3>
            <div className="bg-white/10 rounded-2xl p-4 my-3 w-full max-w-xs border border-white/20">
              <p className="text-xs text-slate-300 font-bold">{lang === 'hi' ? 'दूरी व सिक्के' : 'Distance & Coins'}</p>
              <p className="text-3xl font-black text-amber-300 my-1 font-display">
                {score}m | {coins} 🪙
              </p>
              <p className="text-xs text-slate-300">
                {lang === 'hi' ? `सर्वश्रेष्ठ: ${highScore}m` : `Best: ${highScore}m`}
              </p>
            </div>
            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={startGame}
                className="flex-1 py-3 bg-orange-500 text-white font-black text-xs rounded-2xl active:scale-95 shadow-md"
              >
                {lang === 'hi' ? 'पुनः उड़ान' : 'Fly Again'}
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

      {/* Large Hold-To-Fly Button for Mobile */}
      <div className="w-full max-w-[420px] mt-2 px-1">
        <button
          onMouseDown={() => setThrust(true)}
          onMouseUp={() => setThrust(false)}
          onTouchStart={() => setThrust(true)}
          onTouchEnd={() => setThrust(false)}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-white font-black text-sm shadow-md active:scale-98 flex items-center justify-center gap-2 select-none border border-amber-300"
        >
          <span>🚀 {lang === 'hi' ? 'दबाकर रखें (उड़ने के लिए)' : 'HOLD TO FLY JETPACK'}</span>
        </button>
      </div>
    </div>
  );
};
