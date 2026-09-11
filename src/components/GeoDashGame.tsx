import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Sparkles, Zap, Award, Flame } from 'lucide-react';
import { Language } from '../types';

interface GeoDashGameProps {
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
  lang?: Language;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'spike' | 'block' | 'pad' | 'orb' | 'gravity_portal_up' | 'gravity_portal_down';
}

export default function GeoDashGame({ onBack, onGameComplete, lang = 'en' }: GeoDashGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'levelcomplete'>('start');
  const [attempts, setAttempts] = useState(1);
  const [levelIndex, setLevelIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [highPercent, setHighPercent] = useState(() => {
    try {
      return parseInt(localStorage.getItem('kiddozap_geodash_high') || '0', 10);
    } catch {
      return 0;
    }
  });

  const LEVELS = [
    {
      name: 'Stereo Neon',
      nameHi: 'स्टीरियो नियॉन',
      difficulty: 'Easy',
      diffColor: 'text-emerald-400',
      speed: 7.2,
      length: 5000,
      bg: '#041527',
      accent: '#06b6d4',
    },
    {
      name: 'Cyber Pulse',
      nameHi: 'साइबर पल्स',
      difficulty: 'Medium',
      diffColor: 'text-amber-400',
      speed: 8.5,
      length: 6200,
      bg: '#18042b',
      accent: '#c084fc',
    },
    {
      name: 'Electro Havoc',
      nameHi: 'इलेक्ट्रो हैवक',
      difficulty: 'Hard Challenge',
      diffColor: 'text-rose-400',
      speed: 9.8,
      length: 7500,
      bg: '#2b040e',
      accent: '#fb7185',
    },
  ];

  const stateRef = useRef({
    cube: {
      x: 120,
      y: 350,
      size: 36,
      vy: 0,
      rotation: 0,
      onGround: true,
      gravityDir: 1, // 1 is normal (down), -1 is inverted (up)
      particles: [] as { x: number; y: number; vx: number; vy: number; color: string; alpha: number }[],
    },
    cameraX: 0,
    obstacles: [] as Obstacle[],
    inputHeld: false,
    canOrbJump: false,
    levelLength: 5000,
    speed: 7.2,
  });

  // Level Generator helper
  const buildLevel = (lvlIdx: number) => {
    const lvl = LEVELS[lvlIdx];
    const obs: Obstacle[] = [];
    const floorY = 380;
    const len = lvl.length;

    let x = 650; // Safe runway before first obstacle
    while (x < len - 300) {
      const patternRand = Math.random();

      if (patternRand < 0.35) {
        // Single or Double Spike
        const count = Math.random() < 0.4 && lvlIdx > 0 ? 2 : 1;
        for (let k = 0; k < count; k++) {
          obs.push({
            x: x + k * 36,
            y: floorY - 36,
            width: 36,
            height: 36,
            type: 'spike',
          });
        }
        x += count * 36 + 220 + Math.random() * 120;
      } else if (patternRand < 0.62) {
        // Platform Step with a spike or jump pad
        obs.push({
          x,
          y: floorY - 40,
          width: 80,
          height: 40,
          type: 'block',
        });
        if (Math.random() < 0.5) {
          obs.push({
            x: x + 20,
            y: floorY - 40 - 36,
            width: 36,
            height: 36,
            type: 'spike',
          });
        }
        x += 80 + 200 + Math.random() * 100;
      } else if (patternRand < 0.8) {
        // Jump Pad / Jump Ring Orb
        if (Math.random() < 0.5) {
          obs.push({
            x,
            y: floorY - 14,
            width: 44,
            height: 14,
            type: 'pad',
          });
          // Spikes right after pad requiring high arc
          obs.push({
            x: x + 90,
            y: floorY - 36,
            width: 36,
            height: 36,
            type: 'spike',
          });
        } else {
          obs.push({
            x,
            y: floorY - 110,
            width: 36,
            height: 36,
            type: 'orb',
          });
          obs.push({
            x: x - 20,
            y: floorY - 36,
            width: 72,
            height: 36,
            type: 'spike',
          });
        }
        x += 260 + Math.random() * 120;
      } else if (lvlIdx === 2 && Math.random() < 0.5) {
        // Gravity Portal in Hard level!
        obs.push({
          x,
          y: floorY - 140,
          width: 30,
          height: 100,
          type: 'gravity_portal_up',
        });
        x += 180;
        // Spikes on ceiling
        obs.push({
          x: x + 100,
          y: 70,
          width: 36,
          height: 36,
          type: 'spike',
        });
        x += 350;
        // Gravity restore portal
        obs.push({
          x,
          y: 110,
          width: 30,
          height: 100,
          type: 'gravity_portal_down',
        });
        x += 280;
      } else {
        // Triple block staircase
        for (let s = 0; s < 2; s++) {
          obs.push({
            x: x + s * 45,
            y: floorY - (s + 1) * 36,
            width: 45,
            height: (s + 1) * 36,
            type: 'block',
          });
        }
        x += 90 + 240;
      }
    }

    return obs;
  };

  const jump = () => {
    const s = stateRef.current;
    const c = s.cube;

    // Normal jump off ground
    if (c.onGround) {
      c.vy = -13.5 * c.gravityDir;
      c.onGround = false;
      if (soundOn) sounds.tap(1.4);
      // Particle puff
      for (let i = 0; i < 8; i++) {
        c.particles.push({
          x: c.x,
          y: c.gravityDir === 1 ? c.y + c.size : c.y,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 3 * c.gravityDir,
          color: '#06b6d4',
          alpha: 1,
        });
      }
    } else if (s.canOrbJump) {
      // Hit mid-air orb!
      c.vy = -14.5 * c.gravityDir;
      s.canOrbJump = false;
      if (soundOn) sounds.chime(1.5);
      for (let i = 0; i < 12; i++) {
        c.particles.push({
          x: c.x,
          y: c.y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          color: '#fbbf24',
          alpha: 1,
        });
      }
    }
  };

  const startGame = () => {
    if (soundOn) sounds.tap(1.2);
    const lvl = LEVELS[levelIndex];
    const s = stateRef.current;
    s.speed = lvl.speed;
    s.levelLength = lvl.length;
    s.cameraX = 0;
    s.obstacles = buildLevel(levelIndex);
    s.cube = {
      x: 120,
      y: 380 - 36,
      size: 36,
      vy: 0,
      rotation: 0,
      onGround: true,
      gravityDir: 1,
      particles: [],
    };
    setProgressPercent(0);
    setGameState('playing');
  };

  const restartAfterCrash = () => {
    setAttempts((a) => a + 1);
    startGame();
  };

  // Keyboard & spacebar listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        stateRef.current.inputHeld = true;
        if (gameState === 'playing') {
          jump();
        } else if (gameState === 'start' || gameState === 'gameover') {
          startGame();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        stateRef.current.inputHeld = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, levelIndex, soundOn]);

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const floorY = 380;
    const ceilY = 70;

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      const s = stateRef.current;
      const c = s.cube;
      const lvl = LEVELS[levelIndex];

      if (gameState === 'playing') {
        // Forward motion
        c.x += s.speed;
        s.cameraX = c.x - 140;

        // Progress
        const pct = Math.min(100, Math.floor((c.x / s.levelLength) * 100));
        setProgressPercent(pct);

        // Win Condition: 100% reached
        if (pct >= 100) {
          setGameState('levelcomplete');
          if (soundOn) sounds.complete();
          confetti({ particleCount: 100, spread: 80 });
          setHighPercent(100);
          try {
            localStorage.setItem('kiddozap_geodash_high', '100');
          } catch {}
          onGameComplete(3, 1000 * (levelIndex + 1));
          return;
        }

        // Gravity physics
        const gravity = 0.9 * c.gravityDir;
        c.vy += gravity;
        c.y += c.vy;

        // Cube rotation in air (smooth 90 degree increments)
        if (!c.onGround) {
          c.rotation += (Math.PI / 18) * c.gravityDir;
        } else {
          // Snap to nearest 90 deg when on surface
          const snap = Math.round(c.rotation / (Math.PI / 2)) * (Math.PI / 2);
          c.rotation += (snap - c.rotation) * 0.3;
        }

        // Check Floor collision (normal gravity)
        if (c.gravityDir === 1) {
          if (c.y >= floorY - c.size) {
            c.y = floorY - c.size;
            c.vy = 0;
            c.onGround = true;
          } else {
            c.onGround = false;
          }
        } else {
          // Inverted gravity (ceiling is floor)
          if (c.y <= ceilY) {
            c.y = ceilY;
            c.vy = 0;
            c.onGround = true;
          } else {
            c.onGround = false;
          }
        }

        s.canOrbJump = false;

        // Check Obstacles Collisions
        for (const obs of s.obstacles) {
          // Skip offscreen
          if (obs.x + obs.width < c.x - 100 || obs.x > c.x + 200) continue;

          // Box collision with cube
          const hit =
            c.x + c.size > obs.x + 6 &&
            c.x < obs.x + obs.width - 6 &&
            c.y + c.size > obs.y + 6 &&
            c.y < obs.y + obs.height - 6;

          if (obs.type === 'spike') {
            if (hit) {
              // Crash on spike!
              if (soundOn) sounds.incorrect();
              setGameState('gameover');
              const finalPct = pct;
              setHighPercent((prev) => Math.max(prev, finalPct));
              try {
                localStorage.setItem('kiddozap_geodash_high', String(Math.max(highPercent, finalPct)));
              } catch {}
              confetti({ particleCount: 35, spread: 60 });
              onGameComplete(finalPct > 70 ? 2 : 1, finalPct * 10);
              break;
            }
          } else if (obs.type === 'block') {
            if (hit) {
              // Landing on top vs hitting side
              const hitTop = c.gravityDir === 1 && c.vy >= 0 && c.y + c.size - c.vy <= obs.y + 12;
              const hitBottom = c.gravityDir === -1 && c.vy <= 0 && c.y - c.vy >= obs.y + obs.height - 12;

              if (hitTop) {
                c.y = obs.y - c.size;
                c.vy = 0;
                c.onGround = true;
              } else if (hitBottom) {
                c.y = obs.y + obs.height;
                c.vy = 0;
                c.onGround = true;
              } else {
                // Crash into wall of block!
                if (soundOn) sounds.incorrect();
                setGameState('gameover');
                const finalPct = pct;
                setHighPercent((prev) => Math.max(prev, finalPct));
                try {
                  localStorage.setItem('kiddozap_geodash_high', String(Math.max(highPercent, finalPct)));
                } catch {}
                onGameComplete(finalPct > 70 ? 2 : 1, finalPct * 10);
                break;
              }
            }
          } else if (obs.type === 'pad') {
            // Jump Pad auto launch
            if (hit && c.gravityDir === 1) {
              c.vy = -18;
              c.onGround = false;
              if (soundOn) sounds.powerup();
              for (let i = 0; i < 10; i++) {
                c.particles.push({
                  x: obs.x + obs.width / 2,
                  y: obs.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: -Math.random() * 8,
                  color: '#eab308',
                  alpha: 1,
                });
              }
            }
          } else if (obs.type === 'orb') {
            // Jump Ring / Orb in air
            const dist = Math.hypot(
              c.x + c.size / 2 - (obs.x + obs.width / 2),
              c.y + c.size / 2 - (obs.y + obs.height / 2)
            );
            if (dist < 45) {
              s.canOrbJump = true;
              if (s.inputHeld) {
                jump();
              }
            }
          } else if (obs.type === 'gravity_portal_up') {
            if (hit && c.gravityDir === 1) {
              c.gravityDir = -1;
              c.vy = -6;
              if (soundOn) sounds.powerup();
            }
          } else if (obs.type === 'gravity_portal_down') {
            if (hit && c.gravityDir === -1) {
              c.gravityDir = 1;
              c.vy = 6;
              if (soundOn) sounds.powerup();
            }
          }
        }

        // Particle trail
        if (Math.random() < 0.6) {
          c.particles.push({
            x: c.x,
            y: c.y + c.size * 0.5,
            vx: -3 - Math.random() * 2,
            vy: (Math.random() - 0.5) * 2,
            color: lvl.accent,
            alpha: 0.8,
          });
        }

        // Update particles
        for (let i = c.particles.length - 1; i >= 0; i--) {
          const p = c.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.04;
          if (p.alpha <= 0) c.particles.splice(i, 1);
        }
      }

      // ---------------- RENDER ----------------
      // Background with pulse effect
      ctx.fillStyle = lvl.bg;
      ctx.fillRect(0, 0, W, H);

      // Neon grid background
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      const gridOffset = -(s.cameraX * 0.4) % 40;
      for (let x = gridOffset; x < W; x += 40) {
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

      // Ceiling and Floor
      const floorGrad = ctx.createLinearGradient(0, floorY, 0, H);
      floorGrad.addColorStop(0, '#0f172a');
      floorGrad.addColorStop(1, '#020617');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, floorY, W, H - floorY);

      // Floor neon top bar
      ctx.fillStyle = lvl.accent;
      ctx.fillRect(0, floorY, W, 4);

      // Ceiling neon bar (for gravity flip levels)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, W, ceilY);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(0, ceilY, W, 3);

      // Draw Obstacles
      for (const obs of s.obstacles) {
        const sx = obs.x - s.cameraX;
        if (sx + obs.width < -50 || sx > W + 50) continue;

        if (obs.type === 'spike') {
          // Sharp neon hazard spike
          ctx.save();
          ctx.translate(sx, obs.y);
          ctx.beginPath();
          if (obs.y > 100) {
            // Pointing up from floor
            ctx.moveTo(0, obs.height);
            ctx.lineTo(obs.width / 2, 0);
            ctx.lineTo(obs.width, obs.height);
          } else {
            // Pointing down from ceiling
            ctx.moveTo(0, 0);
            ctx.lineTo(obs.width / 2, obs.height);
            ctx.lineTo(obs.width, 0);
          }
          ctx.closePath();
          ctx.fillStyle = '#ef4444';
          ctx.fill();
          ctx.strokeStyle = '#fca5a5';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.restore();
        } else if (obs.type === 'block') {
          // Solid geometric platform
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(sx, obs.y, obs.width, obs.height);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx, obs.y, obs.width, obs.height);
          // Inner detail cross
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 1;
          ctx.strokeRect(sx + 4, obs.y + 4, obs.width - 8, obs.height - 8);
        } else if (obs.type === 'pad') {
          // Yellow launch pad
          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.roundRect(sx, obs.y, obs.width, obs.height, [6, 6, 0, 0]);
          ctx.fill();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (obs.type === 'orb') {
          // Jump ring orb
          ctx.save();
          ctx.translate(sx + obs.width / 2, obs.y + obs.height / 2);
          ctx.beginPath();
          ctx.arc(0, 0, obs.width / 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(234, 179, 8, 0.25)';
          ctx.fill();
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Inner pulsing core
          ctx.beginPath();
          ctx.arc(0, 0, (obs.width / 2) * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = '#fef08a';
          ctx.fill();
          ctx.restore();
        } else if (obs.type === 'gravity_portal_up') {
          // Blue portal
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(sx, obs.y, obs.width, obs.height);
          ctx.strokeStyle = '#93c5fd';
          ctx.lineWidth = 3;
          ctx.strokeRect(sx, obs.y, obs.width, obs.height);
        } else if (obs.type === 'gravity_portal_down') {
          // Orange portal
          ctx.fillStyle = '#f97316';
          ctx.fillRect(sx, obs.y, obs.width, obs.height);
          ctx.strokeStyle = '#fdba74';
          ctx.lineWidth = 3;
          ctx.strokeRect(sx, obs.y, obs.width, obs.height);
        }
      }

      // Draw Particles
      for (const p of c.particles) {
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - s.cameraX, p.y, 4, 4);
      }
      ctx.globalAlpha = 1.0;

      // Draw Player Cube
      const cubeSx = c.x - s.cameraX;
      ctx.save();
      ctx.translate(cubeSx + c.size / 2, c.y + c.size / 2);
      ctx.rotate(c.rotation);

      // Glowing Cube Body
      ctx.fillStyle = '#10b981';
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
      ctx.strokeStyle = '#a7f3d0';
      ctx.lineWidth = 3;
      ctx.strokeRect(-c.size / 2, -c.size / 2, c.size, c.size);

      // Cute Neo Face / Eyes
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(-8, -8, 6, 6);
      ctx.fillRect(4, -8, 6, 6);
      ctx.fillRect(-4, 4, 10, 4);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState, levelIndex, soundOn, highPercent]);

  const currentLevel = LEVELS[levelIndex];

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col bg-slate-950 text-white select-none">
      {/* Top Header */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 z-10">
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

        {/* Level Name & Progress */}
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-xs font-black tracking-wider uppercase flex items-center gap-1 text-teal-300">
              <Zap className="w-3.5 h-3.5 fill-teal-400 text-teal-400" />
              <span>{lang === 'hi' ? currentLevel.nameHi : currentLevel.name}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold">
              Attempt #{attempts}
            </div>
          </div>

          {/* Live Progress Bar */}
          <div className="w-28 sm:w-40 flex flex-col items-center">
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full transition-all duration-75"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-black text-emerald-400 mt-0.5">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Audio & Level Selector */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={restartAfterCrash}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        className="flex-1 min-h-0 relative flex items-center justify-center bg-black overflow-hidden cursor-pointer"
        onMouseDown={jump}
        onTouchStart={jump}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          className="w-full h-full object-contain touch-none"
        />

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-3xl bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-teal-500/30 animate-pulse">
              ⚡
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-teal-400 mb-1 tracking-wider uppercase font-display">
              {lang === 'hi' ? 'ज्यामिति डैश रिदम रन' : 'Geo Dash Rhythm Run'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mb-4">
              {lang === 'hi'
                ? 'कांटों के ऊपर से कूदें, हवा में जंप ऑब्स छुएं और 100% फिनिश लाइन तक पहुंचें!'
                : 'Jump over razor spikes, hit yellow jump rings in mid-air, and reach 100%!'}
            </p>

            {/* Level Difficulty Tabs */}
            <div className="flex gap-2 mb-5">
              {LEVELS.map((lvl, idx) => (
                <button
                  key={lvl.name}
                  onClick={() => setLevelIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border ${
                    levelIndex === idx
                      ? 'bg-teal-500 text-slate-950 border-teal-300 shadow-md'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {lvl.name}
                </button>
              ))}
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-black text-base transition-all active:scale-95 shadow-xl shadow-teal-500/40 uppercase tracking-wider"
            >
              {lang === 'hi' ? '▶ खेल शुरू करें' : '▶ Play Level'}
            </button>

            <p className="text-[11px] text-slate-400 mt-3 font-semibold">
              {lang === 'hi' ? '[Space / Up Arrow] या स्क्रीन पर कहीं भी टैप करें' : '[Space / Up Arrow] or Tap anywhere to jump'}
            </p>
          </div>
        )}

        {/* Crash Game Over Overlay */}
        {gameState === 'gameover' && (
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-2xl mb-2">
              💥
            </div>
            <h2 className="text-2xl font-black text-white mb-1 font-display">
              {progressPercent}% Complete
            </h2>
            <p className="text-xs text-slate-400 mb-3">
              Attempt #{attempts} • High: {highPercent}%
            </p>

            <div className="flex gap-2">
              <button
                onClick={restartAfterCrash}
                className="px-6 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-sm transition-all active:scale-95 shadow-md shadow-teal-500/30"
              >
                {lang === 'hi' ? 'फिर से प्रयास करें' : 'Retry (Attempt Again)'}
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

        {/* Level 100% Complete Victory */}
        {gameState === 'levelcomplete' && (
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-amber-500/30 animate-bounce">
              🏆
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-400 mb-1 font-display">
              100% COMPLETE!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mb-4">
              {lang === 'hi'
                ? `अद्भुत! आपने ${attempts} प्रयासों में पूरा स्तर पार कर लिया!`
                : `Phenomenal! You conquered ${currentLevel.name} in ${attempts} attempts!`}
            </p>

            <div className="flex gap-2">
              {levelIndex < LEVELS.length - 1 && (
                <button
                  onClick={() => {
                    setLevelIndex((i) => i + 1);
                    setAttempts(1);
                    startGame();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black text-sm transition-all active:scale-95 shadow-md shadow-teal-500/30"
                >
                  {lang === 'hi' ? 'अगला स्तर खेलें' : 'Next Level'}
                </button>
              )}
              <button
                onClick={restartAfterCrash}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 active:scale-95"
              >
                {lang === 'hi' ? 'पुनः खेलें' : 'Replay'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Giant Touch Control Bar */}
      <div className="shrink-0 p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-center z-10">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            jump();
          }}
          onClick={jump}
          className="w-full max-w-md py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 active:from-teal-700 active:to-emerald-700 text-slate-950 font-black text-base flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-teal-500/20 select-none touch-none"
        >
          <Zap className="w-5 h-5 fill-slate-950" />
          <span>{lang === 'hi' ? 'कूदें (JUMP)' : 'TAP TO JUMP'}</span>
        </button>
      </div>
    </div>
  );
}
