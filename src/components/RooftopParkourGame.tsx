import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Sparkles, ChevronUp, ChevronDown, Zap } from 'lucide-react';
import { Language } from '../types';

interface RooftopParkourGameProps {
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
  lang?: Language;
}

interface Building {
  x: number;
  width: number;
  height: number;
  color: string;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'air_duct' | 'billboard_low' | 'spark';
  collected?: boolean;
}

export default function RooftopParkourGame({ onBack, onGameComplete, lang = 'en' }: RooftopParkourGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [distance, setDistance] = useState(0);
  const [score, setScore] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('kiddozap_parkour_high') || '0', 10);
    } catch {
      return 0;
    }
  });

  const stateRef = useRef({
    runner: {
      x: 100,
      y: 260,
      width: 28,
      height: 48,
      vy: 0,
      isGrounded: true,
      isSliding: false,
      slideTimer: 0,
    },
    cameraX: 0,
    speed: 6.5,
    distance: 0,
    score: 0,
    buildings: [] as Building[],
    obstacles: [] as Obstacle[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; alpha: number }[],
  });

  const jump = () => {
    const r = stateRef.current.runner;
    if (gameState === 'start' || gameState === 'gameover') {
      startGame();
      return;
    }
    if (r.isGrounded && !r.isSliding) {
      r.vy = -13.8;
      r.isGrounded = false;
      if (soundOn) sounds.tap(1.4);
      // Jump particles
      for (let i = 0; i < 6; i++) {
        stateRef.current.particles.push({
          x: r.x + r.width / 2,
          y: r.y + r.height,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 3,
          color: '#38bdf8',
          alpha: 1,
        });
      }
    }
  };

  const slide = () => {
    const r = stateRef.current.runner;
    if (r.isGrounded && !r.isSliding) {
      r.isSliding = true;
      r.slideTimer = 35; // ~35 frames of slide
      r.height = 24; // Lower hitbox
      r.y += 24;
      if (soundOn) sounds.tap(0.8);
    }
  };

  const startGame = () => {
    if (soundOn) sounds.tap(1.2);
    const s = stateRef.current;
    s.speed = 6.5;
    s.distance = 0;
    s.score = 0;
    s.cameraX = 0;
    s.particles = [];
    s.runner = {
      x: 100,
      y: 260,
      width: 28,
      height: 48,
      vy: 0,
      isGrounded: true,
      isSliding: false,
      slideTimer: 0,
    };

    // Build first batch of buildings
    s.buildings = [];
    s.obstacles = [];

    let currentX = 0;
    // First building is wide and safe
    s.buildings.push({
      x: currentX,
      width: 700,
      height: 180,
      color: '#1e293b',
    });
    // Add golden sparks along the safe runway
    for (let c = 200; c < 600; c += 80) {
      s.obstacles.push({
        x: c,
        y: 450 - 180 - 45,
        width: 18,
        height: 18,
        type: 'spark',
      });
    }
    currentX += 700;

    // Generate subsequent rooftops
    for (let b = 0; b < 10; b++) {
      const gap = 120 + Math.random() * 80;
      const bWidth = 400 + Math.random() * 300;
      const bHeight = 160 + Math.random() * 50;
      const bColor = ['#0f172a', '#1e1b4b', '#18181b', '#172554'][Math.floor(Math.random() * 4)];

      s.buildings.push({
        x: currentX + gap,
        width: bWidth,
        height: bHeight,
        color: bColor,
      });

      const roofY = 450 - bHeight;

      // Add obstacle on rooftop
      const obsRand = Math.random();
      if (obsRand < 0.45) {
        // Air Duct to jump over
        s.obstacles.push({
          x: currentX + gap + 160,
          y: roofY - 32,
          width: 32,
          height: 32,
          type: 'air_duct',
        });
      } else {
        // Overhead Billboard to slide under
        s.obstacles.push({
          x: currentX + gap + 160,
          y: roofY - 56,
          width: 50,
          height: 32,
          type: 'billboard_low',
        });
      }

      // Add sparks
      s.obstacles.push({
        x: currentX + gap + 80,
        y: roofY - 40,
        width: 18,
        height: 18,
        type: 'spark',
      });

      currentX += gap + bWidth;
    }

    setDistance(0);
    setScore(0);
    setGameState('playing');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        jump();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        slide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, soundOn]);

  // Main Canvas Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      const s = stateRef.current;
      const r = s.runner;

      if (gameState === 'playing') {
        // Speed scaling slowly
        s.speed = Math.min(11, 6.5 + s.distance * 0.002);
        r.x += s.speed;
        s.cameraX = r.x - 120;

        s.distance = Math.floor(r.x / 10);
        setDistance(s.distance);

        // Slide timer
        if (r.isSliding) {
          r.slideTimer--;
          if (r.slideTimer <= 0) {
            r.isSliding = false;
            r.height = 48;
            r.y -= 24;
          }
        }

        // Gravity physics
        r.vy += 0.65;
        r.y += r.vy;

        // Rooftop ground check
        let onRoof = false;
        for (const b of s.buildings) {
          const roofY = H - b.height;
          if (r.x + r.width > b.x && r.x < b.x + b.width) {
            if (r.y + r.height >= roofY && r.y + r.height - r.vy <= roofY + 12) {
              r.y = roofY - r.height;
              r.vy = 0;
              r.isGrounded = true;
              onRoof = true;
              break;
            }
          }
        }

        if (!onRoof && r.vy > 0) {
          r.isGrounded = false;
        }

        // Fall into gap death
        if (r.y > H + 50) {
          triggerGameOver();
          return;
        }

        // Obstacles collision
        for (const obs of s.obstacles) {
          if (obs.collected) continue;
          const hit =
            r.x + r.width > obs.x + 4 &&
            r.x < obs.x + obs.width - 4 &&
            r.y + r.height > obs.y + 4 &&
            r.y < obs.y + obs.height - 4;

          if (obs.type === 'spark') {
            if (hit) {
              obs.collected = true;
              s.score += 50;
              setScore(s.score);
              if (soundOn) sounds.chime(1.5);
              for (let i = 0; i < 8; i++) {
                s.particles.push({
                  x: obs.x,
                  y: obs.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  color: '#facc15',
                  alpha: 1,
                });
              }
            }
          } else {
            // Hazard collision (air duct or low billboard)
            if (hit) {
              triggerGameOver();
              return;
            }
          }
        }

        // Procedural generation of more rooftops ahead
        const lastB = s.buildings[s.buildings.length - 1];
        if (lastB && lastB.x + lastB.width - r.x < 1200) {
          const gap = 120 + Math.random() * 90;
          const bWidth = 400 + Math.random() * 320;
          const bHeight = 160 + Math.random() * 60;
          const bColor = ['#0f172a', '#1e1b4b', '#18181b', '#172554'][Math.floor(Math.random() * 4)];
          const newBx = lastB.x + lastB.width + gap;

          s.buildings.push({
            x: newBx,
            width: bWidth,
            height: bHeight,
            color: bColor,
          });

          const roofY = H - bHeight;
          if (Math.random() < 0.5) {
            s.obstacles.push({
              x: newBx + 180,
              y: roofY - 32,
              width: 32,
              height: 32,
              type: 'air_duct',
            });
          } else {
            s.obstacles.push({
              x: newBx + 180,
              y: roofY - 56,
              width: 52,
              height: 32,
              type: 'billboard_low',
            });
          }

          s.obstacles.push({
            x: newBx + 90,
            y: roofY - 40,
            width: 18,
            height: 18,
            type: 'spark',
          });
        }

        // Cleanup offscreen items
        s.buildings = s.buildings.filter((b) => b.x + b.width - s.cameraX > -200);
        s.obstacles = s.obstacles.filter((o) => o.x + o.width - s.cameraX > -200);

        // Update particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const p = s.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.04;
          if (p.alpha <= 0) s.particles.splice(i, 1);
        }
      }

      // ---------------- RENDER ----------------
      // Sunset Neon Gradient Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.6, '#311042');
      skyGrad.addColorStop(1, '#6b21a8');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Distant Parallax City Skyline
      ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
      const parOffset = -(s.cameraX * 0.15) % 80;
      for (let x = parOffset - 80; x < W + 80; x += 70) {
        ctx.fillRect(x, H - 280, 50, 280);
      }

      // Draw Buildings
      for (const b of s.buildings) {
        const sx = b.x - s.cameraX;
        if (sx + b.width < -50 || sx > W + 50) continue;

        ctx.fillStyle = b.color;
        ctx.fillRect(sx, H - b.height, b.width, b.height);

        // Rooftop glowing edge line
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(sx, H - b.height, b.width, 3);

        // Windows
        ctx.fillStyle = 'rgba(254, 240, 138, 0.15)';
        for (let wy = H - b.height + 25; wy < H - 20; wy += 35) {
          for (let wx = sx + 25; wx < sx + b.width - 25; wx += 35) {
            ctx.fillRect(wx, wy, 16, 20);
          }
        }
      }

      // Draw Obstacles
      for (const obs of s.obstacles) {
        if (obs.collected) continue;
        const sx = obs.x - s.cameraX;
        if (sx + obs.width < -50 || sx > W + 50) continue;

        if (obs.type === 'air_duct') {
          // Metal air duct box to vault over
          ctx.fillStyle = '#64748b';
          ctx.fillRect(sx, obs.y, obs.width, obs.height);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx, obs.y, obs.width, obs.height);
          // Warning stripes
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(sx + 4, obs.y + 4, obs.width - 8, 6);
        } else if (obs.type === 'billboard_low') {
          // Neon Billboard to slide under
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(sx, obs.y, obs.width, obs.height);
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx, obs.y, obs.width, obs.height);
          // Neon glow text
          ctx.fillStyle = '#f43f5e';
          ctx.font = 'bold 10px sans-serif';
          ctx.fillText('NEO', sx + 8, obs.y + 20);
        } else if (obs.type === 'spark') {
          // Glowing energy spark
          ctx.save();
          ctx.translate(sx + obs.width / 2, obs.y + obs.height / 2);
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(0, 0, obs.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Draw Particles
      for (const p of s.particles) {
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - s.cameraX, p.y, 4, 4);
      }
      ctx.globalAlpha = 1.0;

      // Draw Parkour Runner
      const rx = r.x - s.cameraX;
      ctx.save();
      ctx.translate(rx, r.y);

      if (r.isSliding) {
        // Sliding horizontal pose
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(0, 4, r.width * 1.3, r.height - 4);
        // Head
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(r.width * 1.3 - 4, 8, 7, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Running / jumping upright pose
        ctx.fillStyle = '#38bdf8';
        // Torso
        ctx.fillRect(4, 14, r.width - 8, 22);
        // Head
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(r.width / 2, 8, 8, 0, Math.PI * 2);
        ctx.fill();
        // Legs
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(6, 36, 6, 12);
        ctx.fillRect(16, 36, 6, 12);
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    const triggerGameOver = () => {
      const s = stateRef.current;
      if (soundOn) sounds.incorrect();
      setGameState('gameover');
      const totalScore = s.distance + s.score;
      setHighScore((prev) => Math.max(prev, totalScore));
      try {
        localStorage.setItem('kiddozap_parkour_high', String(Math.max(highScore, totalScore)));
      } catch {}
      confetti({ particleCount: 40, spread: 60 });
      onGameComplete(totalScore > 500 ? 3 : totalScore > 200 ? 2 : 1, totalScore);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState, soundOn, highScore]);

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col bg-slate-950 text-white select-none">
      {/* Header HUD */}
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

        {/* Distance & Score */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {lang === 'hi' ? 'दूरी' : 'Distance'}
            </span>
            <span className="text-lg font-black text-sky-400 leading-none">{distance}m</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {lang === 'hi' ? 'स्कोर' : 'Score'}
            </span>
            <span className="text-sm font-black text-amber-400 leading-none">{score}</span>
          </div>
        </div>

        {/* Audio & Restart */}
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

      {/* Main Canvas Viewport */}
      <div className="flex-1 min-h-0 relative flex items-center justify-center bg-slate-950 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={700}
          height={450}
          className="w-full h-full max-w-3xl object-contain touch-none"
        />

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20">
            <div className="w-16 h-16 rounded-3xl bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-sky-500/30 animate-pulse">
              🏃
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-sky-400 mb-1 tracking-wider uppercase font-display">
              {lang === 'hi' ? 'रूफटॉप पार्कौर रश' : 'Rooftop Parkour Rush'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs mb-5 leading-relaxed">
              {lang === 'hi'
                ? 'इमारतों की छतों पर दौड़ें, बाधाओं के ऊपर से कूदें और बिलबोर्ड के नीचे स्लाइड करें!'
                : 'Sprint across city rooftops! Jump air ducts, slide under low signs & cross skyscraper gaps!'}
            </p>

            <button
              onClick={startGame}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 hover:from-sky-300 hover:to-indigo-500 text-white font-black text-base transition-all active:scale-95 shadow-xl shadow-sky-500/40 uppercase tracking-wider"
            >
              {lang === 'hi' ? '▶ दौड़ शुरू करें' : '▶ Start Parkour'}
            </button>

            <p className="text-[11px] text-slate-400 mt-3 font-semibold">
              {lang === 'hi' ? '[Up Arrow / Space] कूदें • [Down Arrow] स्लाइड करें' : '[Up / Space] to Jump • [Down Arrow] to Slide'}
            </p>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-2xl mb-2">
              💥
            </div>
            <h2 className="text-2xl font-black text-white mb-1 font-display">
              {lang === 'hi' ? 'दौड़ समाप्त!' : 'Run Ended!'}
            </h2>
            <div className="text-3xl font-black text-sky-400 mb-1">{distance}m</div>
            <p className="text-xs text-slate-400 mb-4">
              {lang === 'hi' ? 'सर्वोत्तम स्कोर:' : 'Best Distance:'} {highScore}m
            </p>

            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-black text-sm transition-all active:scale-95 shadow-md shadow-sky-500/30"
              >
                {lang === 'hi' ? 'फिर से दौड़ें' : 'Run Again'}
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

      {/* Bottom Jump and Slide Buttons for Mobile */}
      <div className="shrink-0 p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-3 z-10">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            jump();
          }}
          onClick={jump}
          className="flex-1 max-w-xs py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 active:from-sky-700 active:to-blue-700 text-white font-black text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-sky-500/20 select-none touch-none"
        >
          <ChevronUp className="w-5 h-5" />
          <span>{lang === 'hi' ? 'कूदें (JUMP)' : 'JUMP (VAULT)'}</span>
        </button>

        <button
          onTouchStart={(e) => {
            e.preventDefault();
            slide();
          }}
          onClick={slide}
          className="flex-1 max-w-xs py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:from-indigo-700 active:to-violet-700 text-white font-black text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-indigo-500/20 select-none touch-none"
        >
          <ChevronDown className="w-5 h-5" />
          <span>{lang === 'hi' ? 'स्लाइड करें' : 'SLIDE'}</span>
        </button>
      </div>
    </div>
  );
}
