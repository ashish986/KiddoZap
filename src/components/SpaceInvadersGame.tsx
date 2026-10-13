import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Play, Heart, Zap } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface SpaceInvadersProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

interface Alien {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
  type: number;
  points: number;
}

interface Bullet {
  x: number;
  y: number;
  vy: number;
  fromPlayer: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
}

export const SpaceInvadersGame: React.FC<SpaceInvadersProps> = ({ lang, onBack, onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover' | 'victory'>('ready');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [wave, setWave] = useState<number>(1);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('kiddozap_space_high') || 0);
    } catch {
      return 0;
    }
  });

  const stateRef = useRef({
    playerX: 200,
    playerWidth: 44,
    playerSpeed: 7,
    aliens: [] as Alien[],
    alienDir: 1,
    alienSpeedX: 1.1,
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    lastPlayerShot: 0,
    lastAlienShot: 0,
    score: 0,
    lives: 3,
    movingLeft: false,
    movingRight: false,
  });

  const initAliens = (currentWave: number) => {
    const aliens: Alien[] = [];
    const rows = 4;
    const cols = 7;
    const startX = 35;
    const startY = 40;
    const spacingX = 48;
    const spacingY = 32;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        aliens.push({
          x: startX + c * spacingX,
          y: startY + r * spacingY,
          width: 32,
          height: 22,
          alive: true,
          type: r,
          points: (4 - r) * 10,
        });
      }
    }
    stateRef.current.aliens = aliens;
    stateRef.current.alienDir = 1;
    stateRef.current.alienSpeedX = 0.9 + currentWave * 0.25;
    stateRef.current.bullets = [];
  };

  const startGame = () => {
    sounds.tap(1.2);
    const s = stateRef.current;
    s.playerX = 200;
    s.score = 0;
    s.lives = 3;
    setScore(0);
    setLives(3);
    setWave(1);
    initAliens(1);
    setGameState('playing');
  };

  const shootBullet = () => {
    if (gameState !== 'playing') return;
    const now = Date.now();
    const s = stateRef.current;
    if (now - s.lastPlayerShot > 280) {
      sounds.tap(1.5);
      s.bullets.push({
        x: s.playerX,
        y: 480,
        vy: -9,
        fromPlayer: true,
      });
      s.lastPlayerShot = now;
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') stateRef.current.movingLeft = true;
      if (e.key === 'ArrowRight' || e.key === 'd') stateRef.current.movingRight = true;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        shootBullet();
      }
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

      if (gameState === 'playing') {
        // Player movement
        if (s.movingLeft && s.playerX > 25) s.playerX -= s.playerSpeed;
        if (s.movingRight && s.playerX < W - 25) s.playerX += s.playerSpeed;

        // Move Aliens
        let hitEdge = false;
        const livingAliens = s.aliens.filter((a) => a.alive);

        if (livingAliens.length === 0) {
          // Wave complete!
          sounds.complete();
          confetti({ particleCount: 50, spread: 70 });
          setWave((w) => {
            const nw = w + 1;
            initAliens(nw);
            return nw;
          });
        }

        livingAliens.forEach((a) => {
          a.x += s.alienSpeedX * s.alienDir;
          if (a.x < 15 || a.x + a.width > W - 15) {
            hitEdge = true;
          }
          // Alien reaches bottom
          if (a.y + a.height > 470) {
            sounds.incorrect();
            setGameState('gameover');
          }
        });

        if (hitEdge) {
          s.alienDir *= -1;
          livingAliens.forEach((a) => {
            a.y += 14;
          });
        }

        // Alien shooting
        const now = Date.now();
        if (now - s.lastAlienShot > 900 && livingAliens.length > 0) {
          const randomAlien = livingAliens[Math.floor(Math.random() * livingAliens.length)];
          s.bullets.push({
            x: randomAlien.x + randomAlien.width / 2,
            y: randomAlien.y + randomAlien.height,
            vy: 4.5,
            fromPlayer: false,
          });
          s.lastAlienShot = now;
        }

        // Update Bullets
        for (let i = s.bullets.length - 1; i >= 0; i--) {
          const b = s.bullets[i];
          b.y += b.vy;

          // Out of screen
          if (b.y < 0 || b.y > H) {
            s.bullets.splice(i, 1);
            continue;
          }

          if (b.fromPlayer) {
            // Hit Alien
            for (const a of livingAliens) {
              if (
                b.x > a.x &&
                b.x < a.x + a.width &&
                b.y > a.y &&
                b.y < a.y + a.height
              ) {
                a.alive = false;
                s.bullets.splice(i, 1);
                s.score += a.points;
                setScore(s.score);
                sounds.correct();

                // Spark particles
                for (let p = 0; p < 8; p++) {
                  s.particles.push({
                    x: a.x + 16,
                    y: a.y + 11,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5,
                    color: '#facc15',
                    alpha: 1,
                  });
                }
                break;
              }
            }
          } else {
            // Alien bullet hit Player
            if (
              b.x > s.playerX - 22 &&
              b.x < s.playerX + 22 &&
              b.y > 480 &&
              b.y < 515
            ) {
              s.bullets.splice(i, 1);
              sounds.incorrect();
              s.lives -= 1;
              setLives(s.lives);

              for (let p = 0; p < 12; p++) {
                s.particles.push({
                  x: s.playerX,
                  y: 500,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  color: '#ef4444',
                  alpha: 1,
                });
              }

              if (s.lives <= 0) {
                setGameState('gameover');
                setHighScore((prev) => Math.max(prev, s.score));
                try {
                  localStorage.setItem('kiddozap_space_high', String(Math.max(highScore, s.score)));
                } catch {}
                onGameComplete(s.score > 300 ? 3 : s.score > 150 ? 2 : 1, s.score);
              }
            }
          }
        }

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
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, W, H);

      // Starfield
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 47) % W);
        const sy = ((i * 73 + (gameState === 'playing' ? Date.now() * 0.04 : 0)) % H);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw Aliens
      s.aliens
        .filter((a) => a.alive)
        .forEach((a) => {
          ctx.save();
          if (a.type === 0) {
            // UFO / Top alien
            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.ellipse(a.x + a.width / 2, a.y + a.height / 2, a.width / 2, a.height / 2.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(a.x + 8, a.y + 7, 5, 5);
            ctx.fillRect(a.x + a.width - 13, a.y + 7, 5, 5);
          } else if (a.type === 1) {
            // Crab alien
            ctx.fillStyle = '#a855f7';
            ctx.fillRect(a.x + 4, a.y + 4, a.width - 8, a.height - 8);
            ctx.fillStyle = '#f87171';
            ctx.fillRect(a.x, a.y, 4, 10);
            ctx.fillRect(a.x + a.width - 4, a.y, 4, 10);
          } else {
            // Squid alien
            ctx.fillStyle = '#06b6d4';
            ctx.fillRect(a.x + 4, a.y + 2, a.width - 8, a.height - 4);
            ctx.fillStyle = '#1e1b4b';
            ctx.fillRect(a.x + 8, a.y + 6, 4, 4);
            ctx.fillRect(a.x + a.width - 12, a.y + 6, 4, 4);
          }
          ctx.restore();
        });

      // Draw Bullets
      s.bullets.forEach((b) => {
        if (b.fromPlayer) {
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.fillRect(b.x - 2, b.y, 4, 12);
        } else {
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 8;
          ctx.fillRect(b.x - 2.5, b.y, 5, 10);
        }
        ctx.shadowBlur = 0;
      });

      // Draw Particles
      s.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, 3, 3);
      });
      ctx.globalAlpha = 1;

      // Draw Player Cannon Spaceship
      ctx.save();
      ctx.translate(s.playerX, 500);

      // Ship thruster flame
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(-8, 14);
      ctx.lineTo(0, 22 + Math.random() * 5);
      ctx.lineTo(8, 14);
      ctx.fill();

      // Ship hull
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(20, 14);
      ctx.lineTo(-20, 14);
      ctx.closePath();
      ctx.fill();

      // Cockpit
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.arc(0, -4, 6, 0, Math.PI * 2);
      ctx.fill();

      // Cannons
      ctx.fillStyle = '#0f766e';
      ctx.fillRect(-18, 2, 4, 12);
      ctx.fillRect(14, 2, 4, 12);
      ctx.restore();

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
          {/* Lives */}
          <div className="flex items-center gap-0.5 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-3.5 h-3.5 ${h <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-300'}`}
              />
            ))}
          </div>

          <div className="px-2.5 py-0.5 bg-amber-500 text-white font-black text-xs rounded-lg">
            <span>👾 {score}</span>
          </div>

          <div className="px-2 py-0.5 bg-indigo-50 text-indigo-800 font-black text-xs rounded-lg border border-indigo-200">
            <span>W:{wave}</span>
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
      <div className="relative w-full max-w-[400px] aspect-[400/520] bg-slate-950 rounded-3xl overflow-hidden shadow-xl border-4 border-emerald-500/50 cursor-crosshair">
        <canvas ref={canvasRef} width={400} height={520} className="w-full h-full block" />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-4xl shadow-xl mb-3 animate-bounce">
              👾
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-display text-emerald-300">
              {lang === 'hi' ? 'गैलेक्सी डिफेंडर (गैलेक्सी वॉर)' : 'Galaxy Defender'}
            </h3>
            <p className="text-xs text-slate-200 font-semibold max-w-xs mt-1 mb-5">
              {lang === 'hi'
                ? 'एलियंस को अपनी लेजर तोप से नष्ट करें और धरती की रक्षा करें!'
                : 'Blast incoming alien squadrons with laser beams and protect the planet!'}
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-2xl text-sm shadow-xl active:scale-95 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{lang === 'hi' ? 'लड़ाई शुरू करें' : 'Launch Space Attack'}</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <span className="text-5xl mb-2">🚀💥</span>
            <h3 className="text-2xl font-black font-display text-rose-400">
              {lang === 'hi' ? 'मिशन समाप्त!' : 'Mission Failed!'}
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
                className="flex-1 py-3 bg-emerald-500 text-white font-black text-xs rounded-2xl active:scale-95 shadow-md"
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

      {/* Mobile Touch Controls */}
      <div className="w-full max-w-[400px] flex items-center justify-between gap-3 mt-2 px-1">
        <button
          onMouseDown={() => (stateRef.current.movingLeft = true)}
          onMouseUp={() => (stateRef.current.movingLeft = false)}
          onTouchStart={() => (stateRef.current.movingLeft = true)}
          onTouchEnd={() => (stateRef.current.movingLeft = false)}
          className="flex-1 py-3 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-black text-sm shadow-md active:translate-y-1 select-none"
        >
          ◀ {lang === 'hi' ? 'बाएं' : 'Left'}
        </button>

        <button
          onClick={shootBullet}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-amber-500 text-white font-black text-sm shadow-md active:scale-95 flex items-center justify-center gap-1 select-none"
        >
          <span>⚡ {lang === 'hi' ? 'फायर!' : 'FIRE!'}</span>
        </button>

        <button
          onMouseDown={() => (stateRef.current.movingRight = true)}
          onMouseUp={() => (stateRef.current.movingRight = false)}
          onTouchStart={() => (stateRef.current.movingRight = true)}
          onTouchEnd={() => (stateRef.current.movingRight = false)}
          className="flex-1 py-3 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-black text-sm shadow-md active:translate-y-1 select-none"
        >
          {lang === 'hi' ? 'दाएं' : 'Right'} ▶
        </button>
      </div>
    </div>
  );
};
