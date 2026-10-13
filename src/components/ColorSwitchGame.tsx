import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Sparkles, Trophy, Zap } from 'lucide-react';
import { Language } from '../types';

interface ColorSwitchGameProps {
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
  lang?: Language;
}

const COLORS = ['#f43f5e', '#06b6d4', '#eab308', '#a855f7']; // Pink, Cyan, Yellow, Purple

type ObstacleType = 'circle' | 'square' | 'cross';

interface Obstacle {
  y: number;
  type: ObstacleType;
  radius: number;
  rotation: number;
  rotSpeed: number;
  starCollected: boolean;
}

interface ColorSwitcher {
  y: number;
  collected: boolean;
}

export default function ColorSwitchGame({ onBack, onGameComplete, lang = 'en' }: ColorSwitchGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('kiddozap_colorswitch_high') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [soundOn, setSoundOn] = useState(true);

  const stateRef = useRef({
    ball: {
      y: 500,
      vy: 0,
      radius: 12,
      colorIndex: 0,
    },
    cameraY: 0,
    obstacles: [] as Obstacle[],
    switchers: [] as ColorSwitcher[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; alpha: number }[],
    score: 0,
  });

  const bounce = () => {
    if (gameState === 'start') {
      startGame();
      return;
    }
    if (gameState === 'gameover') {
      startGame();
      return;
    }

    const b = stateRef.current.ball;
    b.vy = -7.8;
    if (soundOn) sounds.tap(1.3);

    // Particle splash
    for (let i = 0; i < 5; i++) {
      stateRef.current.particles.push({
        x: 200,
        y: b.y + b.radius,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3,
        color: COLORS[b.colorIndex],
        alpha: 0.8,
      });
    }
  };

  const spawnObstacle = (y: number): Obstacle => {
    const types: ObstacleType[] = ['circle', 'square', 'cross'];
    const type = types[Math.floor(Math.random() * types.length)];
    const rotSpeed = (Math.random() > 0.5 ? 1 : -1) * (0.02 + Math.random() * 0.015);
    return {
      y,
      type,
      radius: 80,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed,
      starCollected: false,
    };
  };

  const startGame = () => {
    if (soundOn) sounds.tap(1.2);
    const s = stateRef.current;
    s.ball = {
      y: 500,
      vy: -7.5,
      radius: 12,
      colorIndex: Math.floor(Math.random() * 4),
    };
    s.cameraY = 0;
    s.score = 0;
    s.particles = [];

    // Generate initial obstacle tower
    s.obstacles = [
      spawnObstacle(260),
      spawnObstacle(-40),
      spawnObstacle(-340),
      spawnObstacle(-640),
      spawnObstacle(-940),
    ];

    s.switchers = [
      { y: 110, collected: false },
      { y: -190, collected: false },
      { y: -490, collected: false },
      { y: -790, collected: false },
    ];

    setScore(0);
    setGameState('playing');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        bounce();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, soundOn]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const centerX = 200;

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      const s = stateRef.current;
      const b = s.ball;

      if (gameState === 'playing') {
        // Ball gravity
        b.vy += 0.35;
        b.y += b.vy;

        // Smooth camera follow
        const targetCamY = b.y - H * 0.65;
        if (targetCamY < s.cameraY) {
          s.cameraY += (targetCamY - s.cameraY) * 0.15;
        }

        // Bottom boundary death
        if (b.y - s.cameraY > H + 50) {
          triggerGameOver();
          return;
        }

        // Update obstacles
        for (const obs of s.obstacles) {
          obs.rotation += obs.rotSpeed;

          // Star collection
          if (!obs.starCollected) {
            const distToCenter = Math.hypot(centerX - centerX, b.y - obs.y);
            if (distToCenter < 25) {
              obs.starCollected = true;
              s.score += 1;
              setScore(s.score);
              if (soundOn) sounds.chime(1.5);
              for (let i = 0; i < 10; i++) {
                s.particles.push({
                  x: centerX,
                  y: obs.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  color: '#fbbf24',
                  alpha: 1,
                });
              }
            }
          }

          // Collision Check
          // Check if ball is touching obstacle ring/edges
          if (obs.type === 'circle') {
            const dy = Math.abs(b.y - obs.y);
            // Circle inner and outer boundary
            const innerR = obs.radius - 10;
            const outerR = obs.radius + 10;
            if (dy >= innerR - b.radius && dy <= outerR + b.radius) {
              // Exact angle from center of obstacle to ball
              let angle = Math.atan2(b.y - obs.y, 0) - obs.rotation;
              angle = (angle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
              // Each quadrant is Math.PI / 2
              const segmentIndex = Math.floor(angle / (Math.PI / 2)) % 4;
              if (segmentIndex !== b.colorIndex) {
                triggerGameOver();
                return;
              }
            }
          } else if (obs.type === 'square') {
            // Distance check to square perimeter
            const dy = Math.abs(b.y - obs.y);
            if (dy >= obs.radius - 12 - b.radius && dy <= obs.radius + 12 + b.radius) {
              let angle = Math.atan2(b.y - obs.y, 0) - obs.rotation;
              angle = (angle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
              const segmentIndex = Math.floor(angle / (Math.PI / 2)) % 4;
              if (segmentIndex !== b.colorIndex) {
                triggerGameOver();
                return;
              }
            }
          } else if (obs.type === 'cross') {
            const dy = Math.abs(b.y - obs.y);
            if (dy < obs.radius) {
              // Cross arm angle check
              for (let arm = 0; arm < 4; arm++) {
                const armAngle = obs.rotation + arm * (Math.PI / 2);
                const armY = obs.y + Math.sin(armAngle) * (obs.radius * 0.6);
                const armX = centerX + Math.cos(armAngle) * (obs.radius * 0.6);
                if (Math.hypot(centerX - armX, b.y - armY) < 16 + b.radius) {
                  if (arm !== b.colorIndex) {
                    triggerGameOver();
                    return;
                  }
                }
              }
            }
          }
        }

        // Check Color Gate orbs
        for (const sw of s.switchers) {
          if (!sw.collected && Math.abs(b.y - sw.y) < b.radius + 14) {
            sw.collected = true;
            // Pick different color
            const otherColors = [0, 1, 2, 3].filter((c) => c !== b.colorIndex);
            b.colorIndex = otherColors[Math.floor(Math.random() * otherColors.length)];
            if (soundOn) sounds.powerup();
            for (let i = 0; i < 12; i++) {
              s.particles.push({
                x: centerX,
                y: sw.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: COLORS[Math.floor(Math.random() * 4)],
                alpha: 1,
              });
            }
          }
        }

        // Endless generation
        const highestObs = s.obstacles[s.obstacles.length - 1];
        if (highestObs && b.y - highestObs.y < 800) {
          const newY = highestObs.y - 300;
          s.obstacles.push(spawnObstacle(newY));
          s.switchers.push({ y: newY + 150, collected: false });
        }

        // Cleanup offscreen obstacles
        s.obstacles = s.obstacles.filter((o) => o.y - s.cameraY < H + 200);
        s.switchers = s.switchers.filter((sw) => sw.y - s.cameraY < H + 200);

        // Update particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const p = s.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.035;
          if (p.alpha <= 0) s.particles.splice(i, 1);
        }
      }

      // ----------------- RENDER -----------------
      // Dark space backdrop
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, W, H);

      // Subtle background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const camOffsetY = -(s.cameraY * 0.3) % 40;
      for (let y = camOffsetY; y < H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Draw Obstacles
      for (const obs of s.obstacles) {
        const oy = obs.y - s.cameraY;
        if (oy < -150 || oy > H + 150) continue;

        ctx.save();
        ctx.translate(centerX, oy);
        ctx.rotate(obs.rotation);

        if (obs.type === 'circle') {
          // 4 Quarters arc
          const r = obs.radius;
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(0, 0, r, i * (Math.PI / 2), (i + 1) * (Math.PI / 2));
            ctx.strokeStyle = COLORS[i];
            ctx.lineWidth = 16;
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        } else if (obs.type === 'square') {
          // 4 Edges of Square
          const s = obs.radius * 1.3;
          const half = s / 2;
          const edges = [
            [-half, -half, half, -half], // Top
            [half, -half, half, half],   // Right
            [half, half, -half, half],   // Bottom
            [-half, half, -half, -half], // Left
          ];
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(edges[i][0], edges[i][1]);
            ctx.lineTo(edges[i][2], edges[i][3]);
            ctx.strokeStyle = COLORS[i];
            ctx.lineWidth = 15;
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        } else if (obs.type === 'cross') {
          // 4 Arms of plus/cross
          const len = obs.radius;
          for (let i = 0; i < 4; i++) {
            ctx.save();
            ctx.rotate(i * (Math.PI / 2));
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(len, 0);
            ctx.strokeStyle = COLORS[i];
            ctx.lineWidth = 15;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.restore();
          }
        }

        ctx.restore();

        // Draw Star in center of obstacle if not collected
        if (!obs.starCollected) {
          ctx.save();
          ctx.translate(centerX, oy);
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          // Draw 5-pointed star
          const spikes = 5;
          const outerR = 12;
          const innerR = 5;
          let rot = (Math.PI / 2) * 3;
          const step = Math.PI / spikes;
          ctx.moveTo(0, -outerR);
          for (let i = 0; i < spikes; i++) {
            ctx.lineTo(Math.cos(rot) * outerR, Math.sin(rot) * outerR);
            rot += step;
            ctx.lineTo(Math.cos(rot) * innerR, Math.sin(rot) * innerR);
            rot += step;
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      // Draw Color Gate orbs
      for (const sw of s.switchers) {
        if (sw.collected) continue;
        const swY = sw.y - s.cameraY;
        if (swY < -50 || swY > H + 50) continue;

        ctx.save();
        ctx.translate(centerX, swY);
        // Multi-colored 4-slice orb
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, 14, i * (Math.PI / 2), (i + 1) * (Math.PI / 2));
          ctx.fillStyle = COLORS[i];
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw Particles
      for (const p of s.particles) {
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y - s.cameraY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Draw Player Ball
      const ballScreenY = b.y - s.cameraY;
      ctx.save();
      ctx.translate(centerX, ballScreenY);
      ctx.beginPath();
      ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[b.colorIndex];
      ctx.fill();

      // Glowing border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    const triggerGameOver = () => {
      const s = stateRef.current;
      if (soundOn) sounds.incorrect();
      setGameState('gameover');
      const finalScore = s.score;
      setHighScore((prev) => Math.max(prev, finalScore));
      try {
        localStorage.setItem('kiddozap_colorswitch_high', String(Math.max(highScore, finalScore)));
      } catch {}
      confetti({ particleCount: 30, spread: 60 });
      onGameComplete(finalScore >= 10 ? 3 : finalScore >= 5 ? 2 : 1, finalScore * 100);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState, soundOn, highScore]);

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col bg-slate-950 text-white select-none">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 z-10">
        <button
          onClick={() => {
            if (soundOn) sounds.tap(0.9);
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 active:scale-95 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        {/* Score & High Score */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {lang === 'hi' ? 'स्कोर' : 'Score'}
            </span>
            <span className="text-xl font-black text-amber-400 leading-none">{score}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {lang === 'hi' ? 'सर्वोत्तम' : 'Best'}
            </span>
            <span className="text-sm font-black text-slate-300 leading-none">{highScore}</span>
          </div>
        </div>

        {/* Sounds & Restart */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={startGame}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Game Viewport */}
      <div
        className="flex-1 min-h-0 relative flex items-center justify-center bg-slate-950 overflow-hidden cursor-pointer"
        onMouseDown={bounce}
        onTouchStart={bounce}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={600}
          className="w-full h-full max-w-md object-contain touch-none"
        />

        {/* Start Screen Overlay */}
        {gameState === 'start' && (
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-3xl bg-fuchsia-500/20 border-2 border-fuchsia-400 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-fuchsia-500/30 animate-pulse">
              🎯
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-fuchsia-400 mb-1 tracking-wider uppercase font-display">
              {lang === 'hi' ? 'कलर स्विच एरीना' : 'Color Gate Arena'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs mb-5 leading-relaxed">
              {lang === 'hi'
                ? 'गेंद को उछालें और केवल अपने रंग से मेल खाने वाले हिस्से से होकर निकलें!'
                : 'Tap to bounce! Pass through shapes ONLY where the color matches your ball!'}
            </p>

            <button
              onClick={startGame}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 hover:from-fuchsia-400 hover:to-indigo-400 text-white font-black text-base transition-all active:scale-95 shadow-xl shadow-fuchsia-500/40 uppercase tracking-wider"
            >
              {lang === 'hi' ? '▶ खेल शुरू करें' : '▶ Tap to Play'}
            </button>

            <p className="text-[11px] text-slate-400 mt-3 font-semibold">
              {lang === 'hi' ? '[Space / Click] या स्क्रीन पर टैप करें' : '[Space / Click] or Tap screen to bounce'}
            </p>
          </div>
        )}

        {/* Game Over Screen Overlay */}
        {gameState === 'gameover' && (
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/40 flex items-center justify-center text-2xl mb-2">
              💥
            </div>
            <h2 className="text-2xl font-black text-white mb-1 font-display">
              {lang === 'hi' ? 'खेल समाप्त!' : 'Game Over!'}
            </h2>
            <div className="text-3xl font-black text-amber-400 mb-1">{score} Stars</div>
            <p className="text-xs text-slate-400 mb-4">
              {lang === 'hi' ? 'सर्वोत्तम स्कोर:' : 'Best Score:'} {highScore}
            </p>

            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-black text-sm transition-all active:scale-95 shadow-md shadow-fuchsia-500/30"
              >
                {lang === 'hi' ? 'फिर से खेलें' : 'Play Again'}
              </button>
              <button
                onClick={onBack}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 active:scale-95"
              >
                {lang === 'hi' ? 'मेन्यू' : 'Menu'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Giant Tap Area */}
      <div className="shrink-0 p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-center z-10">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            bounce();
          }}
          onClick={bounce}
          className="w-full max-w-md py-3.5 px-6 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 active:from-fuchsia-700 active:to-indigo-700 text-white font-black text-base flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-fuchsia-500/20 select-none touch-none"
        >
          <Zap className="w-5 h-5 fill-white" />
          <span>{lang === 'hi' ? 'उछालें (BOUNCE)' : 'TAP TO BOUNCE'}</span>
        </button>
      </div>
    </div>
  );
}
