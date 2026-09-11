import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Shield, Zap, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface TunnelRush3DGameProps {
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
  lang?: Language;
}

interface Obstacle3D {
  z: number;
  sectorStart: number; // 0 to 7
  sectorSpan: number; // number of sectors it blocks (e.g. 2 or 3)
  rotationSpeed: number; // in rad/sec
  currentAngle: number;
  color: string;
  passed: boolean;
}

interface Item3D {
  z: number;
  sector: number;
  type: 'shield' | 'star';
  collected: boolean;
}

export default function TunnelRush3DGame({ onBack, onGameComplete, lang = 'en' }: TunnelRush3DGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [shieldActive, setShieldActive] = useState(false);
  const [stage, setStage] = useState(1);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('kiddozap_tunnel3d_high') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [soundOn, setSoundOn] = useState(true);

  const stateRef = useRef({
    playerAngle: 0, // 0 to 2*PI around tunnel perimeter
    turnSpeed: 0,
    speed: 16,
    distance: 0,
    hasShield: false,
    steerLeft: false,
    steerRight: false,
    obstacles: [] as Obstacle3D[],
    items: [] as Item3D[],
    nextObstacleZ: 450, // Safe runway for first 400m!
    nextItemZ: 80,
    themeIndex: 0,
  });

  const THEMES = [
    { name: 'Neon Cyber', wall: '#09152e', edge: '#38bdf8', obs: '#f43f5e', glow: '#0284c7' },
    { name: 'Solar Flare', wall: '#1c1004', edge: '#f59e0b', obs: '#ef4444', glow: '#ea580c' },
    { name: 'Matrix Emerald', wall: '#022c22', edge: '#10b981', obs: '#f97316', glow: '#059669' },
    { name: 'Nebula Violet', wall: '#1e082b', edge: '#a855f7', obs: '#e11d48', glow: '#7c3aed' },
  ];

  const startGame = () => {
    if (soundOn) sounds.tap(1.3);
    const s = stateRef.current;
    s.playerAngle = 0;
    s.turnSpeed = 0;
    s.speed = 16;
    s.distance = 0;
    s.hasShield = false;
    s.steerLeft = false;
    s.steerRight = false;
    s.obstacles = [];
    s.items = [];
    s.nextObstacleZ = 450; // First 400m is safe runway!
    s.nextItemZ = 80;
    s.themeIndex = 0;

    // Seed initial safe collectible stars down the tunnel
    for (let i = 0; i < 8; i++) {
      s.items.push({
        z: 100 + i * 50,
        sector: (i * 2) % 8,
        type: i === 4 ? 'shield' : 'star',
        collected: false,
      });
    }

    setScore(0);
    setShieldActive(false);
    setStage(1);
    setGameState('playing');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        stateRef.current.steerLeft = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        stateRef.current.steerRight = true;
      }
      if (e.key === ' ' && gameState === 'start') {
        startGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        stateRef.current.steerLeft = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        stateRef.current.steerRight = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Main 3D Canvas Tunnel Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const NUM_SECTORS = 8;
    const SECTOR_ANGLE = (Math.PI * 2) / NUM_SECTORS;
    const FOCAL = 300;

    const render = () => {
      const s = stateRef.current;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      if (gameState === 'playing') {
        // Player rotation steering physics
        const steerPower = 0.055;
        if (s.steerLeft) {
          s.turnSpeed = Math.max(-0.08, s.turnSpeed - steerPower);
        } else if (s.steerRight) {
          s.turnSpeed = Math.min(0.08, s.turnSpeed + steerPower);
        } else {
          s.turnSpeed *= 0.82; // damping
        }

        s.playerAngle = (s.playerAngle + s.turnSpeed + Math.PI * 2) % (Math.PI * 2);

        // Distance & Speed
        s.distance += s.speed;
        s.speed = Math.min(26, 16 + Math.floor(s.distance / 500) * 1.2);
        const currentScore = Math.floor(s.distance / 10);
        setScore(currentScore);

        // Stage progression
        const currentStage = Math.floor(s.distance / 1200) + 1;
        setStage(currentStage);
        s.themeIndex = (currentStage - 1) % THEMES.length;

        // Spawn Items
        if (s.distance > s.nextItemZ - 800) {
          const sec = Math.floor(Math.random() * NUM_SECTORS);
          s.items.push({
            z: s.distance + 800,
            sector: sec,
            type: Math.random() < 0.25 ? 'shield' : 'star',
            collected: false,
          });
          s.nextItemZ = s.distance + 160 + Math.random() * 120;
        }

        // Spawn Obstacles (Only after safe runway of 400m)
        if (s.distance > 400 && s.distance > s.nextObstacleZ - 800) {
          const secStart = Math.floor(Math.random() * NUM_SECTORS);
          const span = Math.random() < 0.35 ? 3 : 2;
          const rot = (Math.random() - 0.5) * (0.015 + currentStage * 0.005);
          s.obstacles.push({
            z: s.distance + 850,
            sectorStart: secStart,
            sectorSpan: span,
            rotationSpeed: rot,
            currentAngle: secStart * SECTOR_ANGLE,
            color: THEMES[s.themeIndex].obs,
            passed: false,
          });
          s.nextObstacleZ = s.distance + 220 + Math.random() * 90;
        }

        // Update items & check collection
        for (const it of s.items) {
          if (!it.collected) {
            const dz = Math.abs(it.z - s.distance);
            if (dz < 35) {
              const itemAngle = it.sector * SECTOR_ANGLE;
              let angleDiff = Math.abs(s.playerAngle - itemAngle);
              if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;

              if (angleDiff < SECTOR_ANGLE * 0.8) {
                it.collected = true;
                if (it.type === 'shield') {
                  s.hasShield = true;
                  setShieldActive(true);
                  if (soundOn) sounds.powerup();
                } else {
                  if (soundOn) sounds.chime(1.4);
                }
              }
            }
          }
        }

        // Check Obstacle Collisions
        for (const obs of s.obstacles) {
          obs.currentAngle = (obs.currentAngle + obs.rotationSpeed) % (Math.PI * 2);
          const dz = Math.abs(obs.z - s.distance);

          // Collision window at z ~ distance
          if (dz < 22 && !obs.passed) {
            // Check if player's angle falls into the obstacle's blocked arc
            const obsStart = (obs.currentAngle + Math.PI * 2) % (Math.PI * 2);
            const obsEnd = (obsStart + obs.sectorSpan * SECTOR_ANGLE) % (Math.PI * 2);

            let inHazardZone = false;
            if (obsStart < obsEnd) {
              inHazardZone = s.playerAngle >= obsStart && s.playerAngle <= obsEnd;
            } else {
              inHazardZone = s.playerAngle >= obsStart || s.playerAngle <= obsEnd;
            }

            if (inHazardZone) {
              if (s.hasShield) {
                // Shield saves the player!
                s.hasShield = false;
                setShieldActive(false);
                obs.passed = true;
                if (soundOn) sounds.tap(1.6);
              } else {
                // Crash!
                if (soundOn) sounds.incorrect();
                setGameState('gameover');
                const finalScore = currentScore;
                setHighScore((prev) => Math.max(prev, finalScore));
                try {
                  localStorage.setItem('kiddozap_tunnel3d_high', String(Math.max(highScore, finalScore)));
                } catch {}
                const stars = finalScore > 450 ? 3 : finalScore > 200 ? 2 : 1;
                confetti({ particleCount: 75, spread: 80 });
                onGameComplete(stars, finalScore);
                break;
              }
            }
          }

          if (obs.z < s.distance - 100) {
            obs.passed = true;
          }
        }

        // Prune passed objects
        s.obstacles = s.obstacles.filter((o) => o.z > s.distance - 200);
        s.items = s.items.filter((i) => i.z > s.distance - 200);
      }

      // ---------------- 3D TUNNEL RENDERING ----------------
      const theme = THEMES[s.themeIndex];
      ctx.fillStyle = theme.wall;
      ctx.fillRect(0, 0, W, H);

      // Tunnel Slices from back (far) to front (near)
      const numRings = 14;
      const ringStep = 65;
      const baseDistOffset = s.distance % ringStep;

      // Draw concentric octagonal tunnel rings
      for (let i = numRings; i >= 1; i--) {
        const ringZ = i * ringStep - baseDistOffset;
        if (ringZ <= 5) continue;
        const scale = FOCAL / ringZ;
        const radius = Math.min(W, H) * 0.48 * scale;

        // Vertices of this ring
        const pts: { x: number; y: number }[] = [];
        for (let sec = 0; sec < NUM_SECTORS; sec++) {
          const ang = sec * SECTOR_ANGLE;
          pts.push({
            x: cx + Math.cos(ang) * radius,
            y: cy + Math.sin(ang) * radius,
          });
        }

        // Draw ring polygon outline
        ctx.beginPath();
        for (let j = 0; j < pts.length; j++) {
          if (j === 0) ctx.moveTo(pts[j].x, pts[j].y);
          else ctx.lineTo(pts[j].x, pts[j].y);
        }
        ctx.closePath();
        ctx.strokeStyle = theme.edge;
        ctx.lineWidth = Math.max(1, 3 * scale);
        ctx.globalAlpha = Math.min(1, Math.max(0.15, 1.2 - (i / numRings)));
        ctx.stroke();

        // Longitudinal ribs connecting to center
        if (i === 1) {
          for (const pt of pts) {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(pt.x, pt.y);
            ctx.strokeStyle = theme.glow;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.25;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1.0;

      // Draw 3D Items in tunnel
      for (const it of s.items) {
        if (it.collected) continue;
        const relZ = it.z - s.distance;
        if (relZ < 10 || relZ > 900) continue;
        const scale = FOCAL / relZ;
        const radius = Math.min(W, H) * 0.44 * scale;
        const ang = it.sector * SECTOR_ANGLE;
        const ix = cx + Math.cos(ang) * radius;
        const iy = cy + Math.sin(ang) * radius;
        const sz = Math.max(4, 14 * scale);

        ctx.save();
        ctx.translate(ix, iy);
        ctx.rotate(Date.now() * 0.005);
        if (it.type === 'shield') {
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(0, 0, sz, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#a5f3fc';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(0, 0, sz * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw 3D Obstacles
      for (const obs of s.obstacles) {
        const relZ = obs.z - s.distance;
        if (relZ < 10 || relZ > 900) continue;
        const scale = FOCAL / relZ;
        const outerR = Math.min(W, H) * 0.48 * scale;
        const innerR = outerR * 0.2;

        const startA = obs.currentAngle;
        const endA = obs.currentAngle + obs.sectorSpan * SECTOR_ANGLE;

        ctx.beginPath();
        ctx.arc(cx, cy, outerR, startA, endA);
        ctx.arc(cx, cy, innerR, endA, startA, true);
        ctx.closePath();
        ctx.fillStyle = obs.color;
        ctx.globalAlpha = Math.min(0.9, Math.max(0.3, 1.2 - relZ / 900));
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1.5, 3 * scale);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // Draw Player Ship / Craft on inner perimeter
      const playerRadius = Math.min(W, H) * 0.44 * (FOCAL / 40);
      const px = cx + Math.cos(s.playerAngle) * playerRadius;
      const py = cy + Math.sin(s.playerAngle) * playerRadius;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(s.playerAngle + Math.PI / 2);

      // Player Arrow Ship
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(12, 12);
      ctx.lineTo(0, 7);
      ctx.lineTo(-12, 12);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Shield Aura Bubble
      if (s.hasShield) {
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState, soundOn, highScore]);

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col bg-slate-950 text-white select-none">
      {/* Top HUD Bar */}
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

        {/* Live Score & Stage */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-black border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{score}</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-xs font-black border border-cyan-500/30">
            <span>Stage {stage}</span>
          </div>

          {shieldActive && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-sky-500 text-slate-950 font-black rounded-md text-[10px] animate-pulse">
              <Shield className="w-3 h-3" />
              <span>SHIELD</span>
            </div>
          )}

          <div className="text-[11px] text-slate-400 hidden sm:block font-bold">
            Best: <span className="text-white font-black">{highScore}</span>
          </div>
        </div>

        {/* Sound & Restart */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Sound"
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

      {/* 3D Canvas Viewport */}
      <div className="flex-1 min-h-0 relative flex items-center justify-center bg-black overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full object-contain touch-none"
        />

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-amber-500/30 animate-pulse">
              🌀
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-400 mb-1 tracking-wider uppercase font-display">
              {lang === 'hi' ? 'स्पीड टनल रश 3D' : 'Speed Tunnel Rush 3D'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mb-4">
              {lang === 'hi'
                ? '3D टनल में घूमते हुए अवरोधों से बचें! शील्ड पावर-अप इकट्ठा करें और उच्च गति का सामना करें!'
                : 'Speed through rotating 3D tunnels! Steer around barriers and collect shields to survive!'}
            </p>

            <button
              onClick={startGame}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-base transition-all active:scale-95 shadow-xl shadow-orange-500/40 uppercase tracking-wider"
            >
              {lang === 'hi' ? '▶ टनल में उतरें' : '▶ Enter Tunnel'}
            </button>

            <p className="text-[11px] text-slate-400 mt-3 font-semibold">
              {lang === 'hi' ? 'कंट्रोल: [A/D] या [बायां/दायां तीर] या नीचे के बटन' : 'Controls: [A/D] or [Left/Right Arrows] or On-Screen Buttons'}
            </p>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-2xl mb-2">
              💥
            </div>
            <h2 className="text-2xl font-black text-white mb-1 font-display">
              {lang === 'hi' ? 'टकराव हो गया!' : 'Crash Impact!'}
            </h2>
            <div className="flex items-center gap-4 my-2">
              <div className="px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-400">{lang === 'hi' ? 'स्कोर' : 'Score'}</div>
                <div className="text-lg font-black text-amber-400">{score}</div>
              </div>
              <div className="px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-400">Stage</div>
                <div className="text-lg font-black text-cyan-400">{stage}</div>
              </div>
              <div className="px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-400">{lang === 'hi' ? 'सर्वश्रेष्ठ' : 'Best'}</div>
                <div className="text-lg font-black text-emerald-400">{highScore}</div>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all active:scale-95 shadow-md shadow-amber-500/30"
              >
                {lang === 'hi' ? 'फिर से खेलें' : 'Play Again'}
              </button>
              <button
                onClick={onBack}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 active:scale-95"
              >
                {lang === 'hi' ? 'मेन्यू' : 'Menu'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom On-Screen Steer Controls for Mobile */}
      <div className="shrink-0 p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 max-w-lg mx-auto w-full z-10">
        <button
          onTouchStart={() => {
            stateRef.current.steerLeft = true;
            if (soundOn) sounds.tap(1.1);
          }}
          onTouchEnd={() => {
            stateRef.current.steerLeft = false;
          }}
          onMouseDown={() => {
            stateRef.current.steerLeft = true;
          }}
          onMouseUp={() => {
            stateRef.current.steerLeft = false;
          }}
          onMouseLeave={() => {
            stateRef.current.steerLeft = false;
          }}
          className="flex-1 py-3 px-4 rounded-2xl bg-amber-950/80 hover:bg-amber-900 active:bg-amber-800 text-amber-300 border border-amber-700/60 font-black text-sm sm:text-base flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md select-none touch-none"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>{lang === 'hi' ? 'बाएं घूमें' : 'ROTATE LEFT'}</span>
        </button>

        <button
          onTouchStart={() => {
            stateRef.current.steerRight = true;
            if (soundOn) sounds.tap(1.1);
          }}
          onTouchEnd={() => {
            stateRef.current.steerRight = false;
          }}
          onMouseDown={() => {
            stateRef.current.steerRight = true;
          }}
          onMouseUp={() => {
            stateRef.current.steerRight = false;
          }}
          onMouseLeave={() => {
            stateRef.current.steerRight = false;
          }}
          className="flex-1 py-3 px-4 rounded-2xl bg-amber-950/80 hover:bg-amber-900 active:bg-amber-800 text-amber-300 border border-amber-700/60 font-black text-sm sm:text-base flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md select-none touch-none"
        >
          <span>{lang === 'hi' ? 'दाएं घूमें' : 'ROTATE RIGHT'}</span>
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}
