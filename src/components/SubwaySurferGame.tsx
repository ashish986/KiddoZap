import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Play, Pause, Zap } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface SubwaySurferProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

interface Obstacle {
  id: number;
  lane: number; // -1 (left), 0 (center), 1 (right)
  z: number;    // distance ahead
  type: 'train' | 'barrier' | 'light';
  color: string;
}

interface Coin {
  id: number;
  lane: number;
  z: number;
  collected: boolean;
}

export const SubwaySurferGame: React.FC<SubwaySurferProps> = ({ lang, onBack, onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [lane, setLane] = useState<number>(0); // -1: Left, 0: Mid, 1: Right
  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('kiddozap_subway_high') || 0);
    } catch {
      return 0;
    }
  });

  const stateRef = useRef({
    lane: 0,
    targetLane: 0,
    laneX: 0,
    isJumping: false,
    jumpY: 0,
    jumpVelocity: 0,
    isRolling: false,
    speed: 18,
    distance: 0,
    score: 0,
    coins: 0,
    obstacles: [] as Obstacle[],
    coinsList: [] as Coin[],
    nextObstacleZ: 120,
    nextCoinZ: 80,
    nextId: 1,
  });

  const jump = () => {
    if (gameState !== 'playing') return;
    const s = stateRef.current;
    if (!s.isJumping && !s.isRolling) {
      sounds.tap(1.4);
      s.isJumping = true;
      s.jumpVelocity = 14;
    }
  };

  const roll = () => {
    if (gameState !== 'playing') return;
    const s = stateRef.current;
    if (s.isJumping) {
      // Fast drop
      s.jumpVelocity = -12;
    } else if (!s.isRolling) {
      sounds.tap(0.8);
      s.isRolling = true;
      setTimeout(() => {
        s.isRolling = false;
      }, 650);
    }
  };

  const moveLane = (dir: -1 | 1) => {
    if (gameState !== 'playing') return;
    const s = stateRef.current;
    const next = Math.max(-1, Math.min(1, s.targetLane + dir));
    if (next !== s.targetLane) {
      sounds.tap(1.1);
      s.targetLane = next;
      setLane(next);
    }
  };

  const startGame = () => {
    sounds.tap(1.2);
    const s = stateRef.current;
    s.lane = 0;
    s.targetLane = 0;
    s.laneX = 0;
    s.isJumping = false;
    s.jumpY = 0;
    s.isRolling = false;
    s.speed = 18;
    s.distance = 0;
    s.score = 0;
    s.coins = 0;
    s.obstacles = [];
    s.coinsList = [];
    s.nextObstacleZ = 420; // First 400m is safe runway with coins
    s.nextCoinZ = 50;

    // Seed welcoming coin trails on all 3 lanes for a fun start
    for (let i = 0; i < 15; i++) {
      const cLane = (i % 3) - 1;
      s.coinsList.push({
        id: s.nextId++,
        lane: cLane,
        z: 80 + i * 22,
        collected: false,
      });
    }

    setLane(0);
    setScore(0);
    setCoins(0);
    setGameState('playing');
  };

  // Touch and Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') moveLane(-1);
      if (e.key === 'ArrowRight' || e.key === 'd') moveLane(1);
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
        e.preventDefault();
        jump();
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        roll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Touch Swipe gestures
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !e.changedTouches[0]) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 25) {
      if (absDx > absDy) {
        if (dx > 0) moveLane(1);
        else moveLane(-1);
      } else {
        if (dy < 0) jump();
        else roll();
      }
    }
    touchStartRef.current = null;
  };

  // Main 3D Canvas Projection loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const renderLoop = () => {
      const s = stateRef.current;

      if (gameState === 'playing') {
        // Physics update
        s.distance += s.speed * 0.05;
        s.score = Math.floor(s.distance) + s.coins * 5;
        setScore(s.score);
        setCoins(s.coins);

        // Smooth lane interpolation
        s.laneX += (s.targetLane - s.laneX) * 0.22;

        // Jump physics
        if (s.isJumping) {
          s.jumpY += s.jumpVelocity;
          s.jumpVelocity -= 0.85; // Gravity
          if (s.jumpY <= 0) {
            s.jumpY = 0;
            s.isJumping = false;
          }
        }

        // Spawn obstacles (Only after distance > 350, with good spacing)
        if (s.distance > 350 && s.distance > s.nextObstacleZ - 300) {
          const l = Math.floor(Math.random() * 3) - 1;
          const type = Math.random() > 0.45 ? 'train' : 'barrier';
          s.obstacles.push({
            id: s.nextId++,
            lane: l,
            z: s.distance + 380,
            type,
            color: type === 'train' ? '#ef4444' : '#eab308',
          });
          s.nextObstacleZ = s.distance + 140 + Math.random() * 80;
        }

        // Spawn coins
        if (s.distance > s.nextCoinZ - 200) {
          const l = Math.floor(Math.random() * 3) - 1;
          for (let k = 0; k < 3; k++) {
            s.coinsList.push({
              id: s.nextId++,
              lane: l,
              z: s.distance + 240 + k * 20,
              collected: false,
            });
          }
          s.nextCoinZ += 70 + Math.random() * 40;
        }

        // Move items closer
        s.obstacles.forEach((obs) => {
          // Check collision at player z = 30
          const distZ = obs.z - s.distance;
          if (distZ > 10 && distZ < 28 && Math.abs(obs.lane - s.laneX) < 0.45) {
            // Collision logic
            if (obs.type === 'barrier' && s.isJumping && s.jumpY > 16) {
              // Safely jumped over barrier
            } else if (obs.type === 'barrier' && s.isRolling) {
              // Safely slid under barrier
            } else {
              // Crashed!
              sounds.incorrect();
              setGameState('gameover');
              const finalScore = s.score;
              setHighScore((prev) => Math.max(prev, finalScore));
              try {
                localStorage.setItem('kiddozap_subway_high', String(Math.max(highScore, finalScore)));
              } catch {}
              const stars = finalScore >= 250 ? 3 : finalScore >= 100 ? 2 : 1;
              sounds.complete();
              confetti({ particleCount: 70, spread: 80 });
              onGameComplete(stars, finalScore);
            }
          }
        });

        // Coins collection
        s.coinsList.forEach((c) => {
          if (!c.collected) {
            const distZ = c.z - s.distance;
            if (distZ > 5 && distZ < 35 && Math.abs(c.lane - s.laneX) < 0.6) {
              c.collected = true;
              sounds.correct();
              s.coins++;
            }
          }
        });

        // Clean up passed objects
        s.obstacles = s.obstacles.filter((o) => o.z - s.distance > -50);
        s.coinsList = s.coinsList.filter((c) => c.z - s.distance > -50);
      }

      // ---------------- RENDER 3D PROJECTION ----------------
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.45);
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(1, '#7dd3fc');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H * 0.45);

      // City Skyline in background
      ctx.fillStyle = '#0369a1';
      for (let i = 0; i < 9; i++) {
        const bh = 50 + ((i * 37) % 65);
        ctx.fillRect(i * 45, H * 0.45 - bh, 40, bh);
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(i * 45 + 8, H * 0.45 - bh + 10, 6, 8);
        ctx.fillRect(i * 45 + 24, H * 0.45 - bh + 10, 6, 8);
        ctx.fillStyle = '#0369a1';
      }

      // Ground / Track horizon
      const horizonY = H * 0.42;
      const trackGrad = ctx.createLinearGradient(0, horizonY, 0, H);
      trackGrad.addColorStop(0, '#334155');
      trackGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = trackGrad;
      ctx.fillRect(0, horizonY, W, H - horizonY);

      // 3 Perspective Subway Tracks
      const vpX = W * 0.5; // Vanishing point X
      const laneSpread = 145; // Bottom lane width spread

      // Track rails
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      for (let l = -1.5; l <= 1.5; l++) {
        ctx.beginPath();
        ctx.moveTo(vpX + l * 20, horizonY);
        ctx.lineTo(vpX + l * laneSpread, H);
        ctx.stroke();
      }

      // Wooden Railroad Ties (Moving)
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      const tieOffset = (s.distance * 2) % 40;
      for (let z = 20; z < 400; z += 35) {
        const depth = (z - tieOffset) / 400;
        if (depth > 0 && depth < 1) {
          const y = horizonY + (H - horizonY) * (depth * depth);
          const w = 40 + (laneSpread * 3 - 40) * depth;
          ctx.beginPath();
          ctx.moveTo(vpX - w / 2, y);
          ctx.lineTo(vpX + w / 2, y);
          ctx.stroke();
        }
      }

      // Draw Coins (Sorting by distance Z descending)
      s.coinsList
        .filter((c) => !c.collected)
        .forEach((c) => {
          const distZ = c.z - s.distance;
          if (distZ > 5 && distZ < 350) {
            const depth = Math.max(0.08, 1 - distZ / 350);
            const y = horizonY + (H - horizonY) * (depth * depth) - 18 * depth;
            const x = vpX + c.lane * (laneSpread * 0.7 * depth);
            const r = Math.max(4, 14 * depth);

            ctx.save();
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 2 * depth;
            ctx.stroke();
            ctx.fillStyle = '#78350f';
            ctx.font = `bold ${Math.floor(11 * depth)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', x, y);
            ctx.restore();
          }
        });

      // Draw Obstacles (Back to front)
      const sortedObs = [...s.obstacles].sort((a, b) => b.z - a.z);
      sortedObs.forEach((obs) => {
        const distZ = obs.z - s.distance;
        if (distZ > 5 && distZ < 350) {
          const depth = Math.max(0.08, 1 - distZ / 350);
          const groundY = horizonY + (H - horizonY) * (depth * depth);
          const x = vpX + obs.lane * (laneSpread * 0.7 * depth);

          if (obs.type === 'train') {
            const w = 70 * depth;
            const h = 95 * depth;
            const y = groundY - h;

            // Train 3D box
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(x - w / 2, y, w, h);
            ctx.fillStyle = '#991b1b';
            ctx.fillRect(x - w / 2 + 4 * depth, y + 6 * depth, w - 8 * depth, 25 * depth);

            // Train Windshield & Lights
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(x - w / 2 + 8 * depth, y + 10 * depth, w - 16 * depth, 18 * depth);
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(x - w * 0.28, y + h - 14 * depth, 5 * depth, 0, Math.PI * 2);
            ctx.arc(x + w * 0.28, y + h - 14 * depth, 5 * depth, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Hurdle / Barrier
            const w = 60 * depth;
            const h = 42 * depth;
            const y = groundY - h;

            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(x - w / 2, y, w, h);
            // Stripes
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(x - w / 2 + 10 * depth, y + 6 * depth, 12 * depth, h - 12 * depth);
            ctx.fillRect(x + w / 2 - 22 * depth, y + 6 * depth, 12 * depth, h - 12 * depth);
          }
        }
      });

      // ---------------- PLAYER RUNNER ----------------
      const playerGroundY = H - 35;
      const playerX = vpX + s.laneX * (laneSpread * 0.75);
      const playerY = playerGroundY - s.jumpY;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.ellipse(playerX, playerGroundY, 20 * (1 - s.jumpY / 150), 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Runner Body (Hero)
      ctx.save();
      ctx.translate(playerX, playerY);

      if (s.isRolling) {
        // Rolling sphere
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(0, -16, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(-12, -22, 24, 8);
      } else {
        // Standing / Running Hero
        // Legs animated
        const legSwing = Math.sin(s.distance * 0.8) * 8;
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-6, -14);
        ctx.lineTo(-8 + legSwing, 0);
        ctx.moveTo(6, -14);
        ctx.lineTo(8 - legSwing, 0);
        ctx.stroke();

        // Torso / Jacket
        ctx.fillStyle = '#f97316';
        ctx.fillRect(-12, -38, 24, 25);

        // Cap & Head
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(0, -46, 11, 0, Math.PI * 2);
        ctx.fill();

        // Cool Skater Cap
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(-12, -54, 24, 8);
        ctx.fillRect(-14, -50, 10, 4); // Visor backwards
      }
      ctx.restore();

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col items-center justify-between p-2 select-none overflow-hidden">
      {/* Top Header Bar */}
      <div className="w-full max-w-sm flex items-center justify-between bg-white/95 backdrop-blur rounded-2xl px-3 py-1.5 border border-amber-200 shadow-2xs">
        <button
          onClick={() => {
            sounds.tap(0.9);
            onBack();
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-[11px] font-black">
            <Trophy className="w-3 h-3 text-amber-500" />
            <span>{highScore}</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-0.5 bg-orange-600 text-white rounded-xl text-xs font-black shadow-2xs">
            <span>🏃 {score}m</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-400 text-yellow-950 rounded-xl text-xs font-black shadow-2xs">
            <span>🪙 {coins}</span>
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

      {/* Main 3D Canvas Stage - Fitted into available flex height */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center p-1 relative">
        <div
          className="relative h-full max-h-[min(65vh,480px)] aspect-[400/520] bg-slate-950 rounded-3xl overflow-hidden shadow-xl border-4 border-amber-400 cursor-pointer touch-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <canvas
            ref={canvasRef}
            width={400}
            height={520}
            className="w-full h-full block"
          />

          {/* Start Overlay */}
          {gameState === 'ready' && (
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white z-20">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-3xl shadow-xl mb-2 animate-bounce">
                🚇
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-display text-amber-300">
                {lang === 'hi' ? 'सबवे सर्फ 3D रनर' : 'Subway 3D Surfers'}
              </h3>
              <p className="text-[11px] text-amber-100/90 font-semibold max-w-xs mt-1 mb-4 leading-relaxed">
                {lang === 'hi'
                  ? 'ट्रैक बदलें, ट्रेनों से बचें! कूदने के लिए ऊपर और स्लाइड के लिए नीचे स्वाइप करें।'
                  : 'Dodge trains! Swipe or tap buttons: Left/Right to turn, Up to jump, Down to slide.'}
              </p>

              <button
                onClick={startGame}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black rounded-xl text-xs shadow-xl active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{lang === 'hi' ? 'दौड़ शुरू करें!' : 'Start Surfing!'}</span>
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center text-white z-20">
              <span className="text-4xl mb-1">💥</span>
              <h3 className="text-xl font-black font-display text-amber-300">
                {lang === 'hi' ? 'टकराव हो गया!' : 'Train Crash!'}
              </h3>
              <div className="bg-white/10 rounded-2xl p-3 my-2 w-full max-w-xs border border-white/20">
                <p className="text-[11px] text-slate-300 font-bold">{lang === 'hi' ? 'दूरी व सिक्के' : 'Distance & Coins'}</p>
                <p className="text-2xl font-black text-amber-300 my-0.5 font-display">
                  {score}m | {coins} 🪙
                </p>
                <p className="text-[10px] text-slate-300">
                  {lang === 'hi' ? `सर्वश्रेष्ठ: ${highScore}m` : `Personal Best: ${highScore}m`}
                </p>
              </div>

              <div className="flex gap-2 w-full max-w-xs">
                <button
                  onClick={startGame}
                  className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow-md active:scale-95"
                >
                  {lang === 'hi' ? 'फिर से दौड़ें' : 'Surf Again'}
                </button>
                <button
                  onClick={onBack}
                  className="py-2.5 px-4 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl active:scale-95"
                >
                  {lang === 'hi' ? 'हब' : 'Hub'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Touch D-Pad / Buttons for Easy Play on Mobile - Compact */}
      <div className="w-full max-w-sm flex items-center justify-between gap-1.5 pb-1 px-1">
        <button
          onClick={() => moveLane(-1)}
          className="flex-1 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-black text-xs shadow-xs active:translate-y-0.5"
        >
          ◀ {lang === 'hi' ? 'बाएं' : 'Left'}
        </button>

        <button
          onClick={jump}
          className="flex-1 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xs shadow-xs active:scale-95"
        >
          ▲ {lang === 'hi' ? 'कूदें' : 'Jump'}
        </button>

        <button
          onClick={roll}
          className="flex-1 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-xs shadow-xs active:scale-95"
        >
          ▼ {lang === 'hi' ? 'स्लाइड' : 'Slide'}
        </button>

        <button
          onClick={() => moveLane(1)}
          className="flex-1 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-black text-xs shadow-xs active:translate-y-0.5"
        >
          {lang === 'hi' ? 'दाएं' : 'Right'} ▶
        </button>
      </div>
    </div>
  );
};
