import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Sparkles, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language } from '../types';

interface Slope3DGameProps {
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
  lang?: Language;
}

interface Platform3D {
  x: number; // center x (-width/2 to width/2)
  y: number; // height (downhill progression)
  z: number; // depth down the track
  width: number;
  length: number;
  type: 'normal' | 'booster' | 'narrow';
  hasLeftWall?: boolean;
  hasRightWall?: boolean;
}

interface Obstacle3D {
  x: number;
  y: number;
  z: number;
  size: number;
  type: 'cube' | 'pillar';
}

interface Gem3D {
  x: number;
  y: number;
  z: number;
  collected: boolean;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
  alpha: number;
}

export default function Slope3DGame({ onBack, onGameComplete, lang = 'en' }: Slope3DGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [gems, setGems] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('kiddozap_slope3d_high') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [soundOn, setSoundOn] = useState(true);

  const stateRef = useRef({
    ball: {
      x: 0,
      y: -15, // platform surface is y = 0
      z: 0,
      vx: 0,
      vy: 0,
      rollAngle: 0,
      radius: 12,
      onGround: true,
      tiltAngle: 0,
    },
    camera: {
      x: 0,
      y: -50,
      z: -100,
    },
    speed: 18,
    distance: 0,
    steerLeft: false,
    steerRight: false,
    boostTimer: 0,
    platforms: [] as Platform3D[],
    obstacles: [] as Obstacle3D[],
    gemsList: [] as Gem3D[],
    particles: [] as Particle3D[],
    nextPlatformZ: 0,
    nextObstacleZ: 380, // Safe runway for first 350m!
    nextGemZ: 60,
    invulnerableUntil: 0,
  });

  // Track generator helper
  const generateTrackChunk = (startZ: number, count: number) => {
    const s = stateRef.current;
    let currZ = startZ;
    let currX = s.platforms.length > 0 ? s.platforms[s.platforms.length - 1].x : 0;
    let currY = s.platforms.length > 0 ? s.platforms[s.platforms.length - 1].y : 0;

    for (let i = 0; i < count; i++) {
      const isBooster = Math.random() < 0.18 && currZ > 200;
      const width = isBooster ? 140 : currZ < 400 ? 160 : Math.max(90, 150 - Math.floor(currZ / 800) * 10);
      const length = 180;

      // Gentle curve in x
      if (currZ > 300 && Math.random() < 0.45) {
        currX += (Math.random() - 0.5) * 80;
        currX = Math.max(-120, Math.min(120, currX));
      }

      // Downhill slope in y
      currY += 15;

      const plat: Platform3D = {
        x: currX,
        y: currY,
        z: currZ,
        width,
        length,
        type: isBooster ? 'booster' : 'normal',
      };
      s.platforms.push(plat);

      // Add Gems
      if (Math.random() < 0.65) {
        s.gemsList.push({
          x: currX + (Math.random() - 0.5) * (width * 0.6),
          y: currY - 20,
          z: currZ + length * 0.5,
          collected: false,
        });
      }

      // Add Obstacles (Only after safe runway of 350m)
      if (currZ > 380 && Math.random() < 0.55) {
        const obsCount = Math.random() < 0.3 && width > 120 ? 2 : 1;
        for (let k = 0; k < obsCount; k++) {
          const offsetX = (k === 0 ? (Math.random() > 0.5 ? 1 : -1) : 0) * (width * 0.28);
          s.obstacles.push({
            x: currX + offsetX,
            y: currY - 14,
            z: currZ + 60 + k * 50,
            size: 24,
            type: 'cube',
          });
        }
      }

      currZ += length;
    }
    s.nextPlatformZ = currZ;
  };

  const startGame = () => {
    if (soundOn) sounds.tap(1.3);
    const s = stateRef.current;
    s.ball = {
      x: 0,
      y: -15,
      z: 0,
      vx: 0,
      vy: 0,
      rollAngle: 0,
      radius: 12,
      onGround: true,
      tiltAngle: 0,
    };
    s.speed = 19;
    s.distance = 0;
    s.boostTimer = 0;
    s.steerLeft = false;
    s.steerRight = false;
    s.platforms = [];
    s.obstacles = [];
    s.gemsList = [];
    s.particles = [];
    s.nextObstacleZ = 400; // Generous safe runway

    // Initial safe runway (first 600m has wide platforms)
    generateTrackChunk(0, 12);

    setScore(0);
    setGems(0);
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

  // Main 3D Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const FOCAL = 340;

    const render = () => {
      const s = stateRef.current;
      const b = s.ball;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H * 0.44;

      if (gameState === 'playing') {
        // Boost timer
        if (s.boostTimer > 0) {
          s.boostTimer--;
          s.speed = 28;
        } else {
          s.speed = Math.min(32, 19 + Math.floor(s.distance / 400) * 1.4);
        }

        // Steer physics
        const steerForce = 1.35;
        if (s.steerLeft) {
          b.vx -= steerForce;
          b.tiltAngle = Math.max(-0.4, b.tiltAngle - 0.08);
        } else if (s.steerRight) {
          b.vx += steerForce;
          b.tiltAngle = Math.min(0.4, b.tiltAngle + 0.08);
        } else {
          b.tiltAngle *= 0.85;
        }

        b.vx *= 0.88; // Lateral friction
        b.x += b.vx;

        // Forward motion down slope
        b.z += s.speed;
        s.distance = Math.floor(b.z);
        b.rollAngle += s.speed * 0.08;

        // Score update
        const currentScore = Math.floor(s.distance / 8) + s.gemsList.filter((g) => g.collected).length * 50;
        setScore(currentScore);

        // Find platform beneath ball
        let currentPlatform: Platform3D | null = null;
        for (const p of s.platforms) {
          if (b.z >= p.z && b.z <= p.z + p.length) {
            currentPlatform = p;
            break;
          }
        }

        if (currentPlatform) {
          const halfW = currentPlatform.width / 2;
          const leftEdge = currentPlatform.x - halfW;
          const rightEdge = currentPlatform.x + halfW;

          // Check if ball is on track or fell off
          if (b.x >= leftEdge && b.x <= rightEdge) {
            b.y = currentPlatform.y - b.radius;
            b.vy = 0;
            b.onGround = true;

            // Check speed booster pad
            if (currentPlatform.type === 'booster' && s.boostTimer <= 0) {
              s.boostTimer = 45;
              if (soundOn) sounds.powerup();
              for (let k = 0; k < 12; k++) {
                s.particles.push({
                  x: b.x,
                  y: b.y,
                  z: b.z,
                  vx: (Math.random() - 0.5) * 6,
                  vy: -Math.random() * 6,
                  vz: -10 - Math.random() * 10,
                  color: '#06b6d4',
                  alpha: 1,
                });
              }
            }
          } else {
            // Ball fell off the side edge!
            b.onGround = false;
            b.vy += 1.2;
            b.y += b.vy;
          }
        } else {
          // Ball is in air / gap
          b.onGround = false;
          b.vy += 1.2;
          b.y += b.vy;
        }

        // Collect Gems
        for (const gem of s.gemsList) {
          if (!gem.collected && Math.abs(b.z - gem.z) < 26 && Math.abs(b.x - gem.x) < 26) {
            gem.collected = true;
            if (soundOn) sounds.chime(1.4);
            setGems((prev) => prev + 1);
            for (let k = 0; k < 10; k++) {
              s.particles.push({
                x: gem.x,
                y: gem.y,
                z: gem.z,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                vz: (Math.random() - 0.5) * 8,
                color: '#10b981',
                alpha: 1,
              });
            }
          }
        }

        // Obstacle Collisions
        for (const obs of s.obstacles) {
          const dz = Math.abs(b.z - obs.z);
          const dx = Math.abs(b.x - obs.x);
          if (dz < 18 && dx < obs.size * 0.7 && b.onGround) {
            // Crash into red cube!
            if (soundOn) sounds.incorrect();
            setGameState('gameover');
            const finalScore = currentScore;
            setHighScore((prev) => Math.max(prev, finalScore));
            try {
              localStorage.setItem('kiddozap_slope3d_high', String(Math.max(highScore, finalScore)));
            } catch {}
            const stars = finalScore > 600 ? 3 : finalScore > 250 ? 2 : 1;
            confetti({ particleCount: 75, spread: 85 });
            onGameComplete(stars, finalScore);
            break;
          }
        }

        // Falling off into the cosmic abyss
        if (b.y > (currentPlatform ? currentPlatform.y + 120 : 350)) {
          if (soundOn) sounds.error();
          setGameState('gameover');
          const finalScore = currentScore;
          setHighScore((prev) => Math.max(prev, finalScore));
          try {
            localStorage.setItem('kiddozap_slope3d_high', String(Math.max(highScore, finalScore)));
          } catch {}
          const stars = finalScore > 600 ? 3 : finalScore > 250 ? 2 : 1;
          confetti({ particleCount: 60, spread: 70 });
          onGameComplete(stars, finalScore);
        }

        // Camera smoothly follows ball in 3D
        s.camera.x += (b.x - s.camera.x) * 0.15;
        s.camera.y += (b.y - 45 - s.camera.y) * 0.15;
        s.camera.z = b.z - 120;

        // Generate more track ahead
        if (b.z > s.nextPlatformZ - 1800) {
          generateTrackChunk(s.nextPlatformZ, 8);
        }

        // Prune distant passed platforms to keep zero memory leak & high FPS
        s.platforms = s.platforms.filter((p) => p.z + p.length > b.z - 300);
        s.obstacles = s.obstacles.filter((o) => o.z > b.z - 200);
        s.gemsList = s.gemsList.filter((g) => g.z > b.z - 200);

        // Update particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const pt = s.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.z += pt.vz;
          pt.alpha -= 0.04;
          if (pt.alpha <= 0) s.particles.splice(i, 1);
        }
      }

      // ---------------- 3D RENDERING ----------------
      // Space sky background with cosmic gradients
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#030712');
      sky.addColorStop(0.5, '#0b1329');
      sky.addColorStop(1, '#0f172a');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Starfield horizon
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 35; i++) {
        const sx = ((i * 73 + s.distance * 0.05) % W);
        const sy = (i * 37) % (H * 0.55);
        ctx.globalAlpha = 0.3 + (i % 5) * 0.12;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }
      ctx.globalAlpha = 1.0;

      // 3D Projection helper
      const project = (x: number, y: number, z: number) => {
        const relZ = z - s.camera.z;
        if (relZ <= 10) return null;
        const scale = FOCAL / relZ;
        return {
          sx: cx + (x - s.camera.x) * scale,
          sy: cy + (y - s.camera.y) * scale,
          scale,
        };
      };

      // 1. Draw 3D Platforms
      for (const p of s.platforms) {
        const relZStart = p.z - s.camera.z;
        const relZEnd = p.z + p.length - s.camera.z;
        if (relZEnd < 10 || relZStart > 1600) continue;

        const halfW = p.width / 2;
        const p1 = project(p.x - halfW, p.y, p.z);
        const p2 = project(p.x + halfW, p.y, p.z);
        const p3 = project(p.x + halfW, p.y + 12, p.z + p.length);
        const p4 = project(p.x - halfW, p.y + 12, p.z + p.length);

        if (p1 && p2 && p3 && p4) {
          // Platform top face
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.lineTo(p3.sx, p3.sy);
          ctx.lineTo(p4.sx, p4.sy);
          ctx.closePath();

          if (p.type === 'booster') {
            ctx.fillStyle = '#0e7490';
            ctx.fill();
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Booster center neon arrows
            const midP = project(p.x, p.y - 1, p.z + p.length * 0.5);
            if (midP) {
              ctx.fillStyle = '#67e8f9';
              ctx.font = `bold ${Math.max(12, 24 * midP.scale)}px sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('▲▲', midP.sx, midP.sy);
            }
          } else {
            // Cyber neon track face
            ctx.fillStyle = '#1e293b';
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = Math.max(1.5, 3 * p1.scale);
            ctx.stroke();

            // Grid stripes
            const mid = project(p.x, p.y, p.z + p.length * 0.5);
            if (mid) {
              ctx.strokeStyle = '#0284c7';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(cx + (p.x - s.camera.x) * p1.scale, p1.sy);
              ctx.lineTo(cx + (p.x - s.camera.x) * p3.scale, p3.sy);
              ctx.stroke();
            }
          }
        }
      }

      // 2. Draw 3D Gems
      for (const gem of s.gemsList) {
        if (gem.collected) continue;
        const pt = project(gem.x, gem.y, gem.z);
        if (pt) {
          const sz = Math.max(4, 16 * pt.scale);
          ctx.save();
          ctx.translate(pt.sx, pt.sy);
          ctx.rotate(Date.now() * 0.004);
          ctx.fillStyle = '#10b981';
          ctx.strokeStyle = '#6ee7b7';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, -sz);
          ctx.lineTo(sz * 0.7, 0);
          ctx.lineTo(0, sz);
          ctx.lineTo(-sz * 0.7, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
      }

      // 3. Draw 3D Red Obstacles
      for (const obs of s.obstacles) {
        const pt = project(obs.x, obs.y, obs.z);
        if (pt) {
          const sz = Math.max(6, obs.size * pt.scale);
          ctx.fillStyle = '#ef4444';
          ctx.strokeStyle = '#fca5a5';
          ctx.lineWidth = 2;

          // 3D Isometric cube projection
          ctx.beginPath();
          ctx.rect(pt.sx - sz / 2, pt.sy - sz, sz, sz);
          ctx.fill();
          ctx.stroke();

          // Top hazard cap
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.moveTo(pt.sx - sz / 2, pt.sy - sz);
          ctx.lineTo(pt.sx, pt.sy - sz * 1.3);
          ctx.lineTo(pt.sx + sz / 2, pt.sy - sz);
          ctx.closePath();
          ctx.fill();
        }
      }

      // 4. Draw 3D Particles
      for (const pt of s.particles) {
        const pPrj = project(pt.x, pt.y, pt.z);
        if (pPrj) {
          ctx.globalAlpha = Math.max(0, pt.alpha);
          ctx.fillStyle = pt.color;
          ctx.beginPath();
          ctx.arc(pPrj.sx, pPrj.sy, Math.max(2, 4 * pPrj.scale), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;

      // 5. Draw 3D Ball & Shadow
      const ballPrj = project(b.x, b.y, b.z);
      if (ballPrj) {
        const r = Math.max(6, b.radius * ballPrj.scale);

        // Shadow under ball on platform
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.ellipse(ballPrj.sx, ballPrj.sy + r * 0.8, r * 0.9, r * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3D Glowing sphere with radial gradient
        const ballGrad = ctx.createRadialGradient(
          ballPrj.sx - r * 0.35,
          ballPrj.sy - r * 0.35,
          r * 0.1,
          ballPrj.sx,
          ballPrj.sy,
          r
        );
        ballGrad.addColorStop(0, s.boostTimer > 0 ? '#67e8f9' : '#fef08a');
        ballGrad.addColorStop(0.4, s.boostTimer > 0 ? '#06b6d4' : '#eab308');
        ballGrad.addColorStop(1, s.boostTimer > 0 ? '#083344' : '#854d0e');

        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(ballPrj.sx, ballPrj.sy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = s.boostTimer > 0 ? '#a5f3fc' : '#fde047';
        ctx.lineWidth = Math.max(1, 2.5 * ballPrj.scale);
        ctx.stroke();

        // Roll rotation indicator lines
        ctx.save();
        ctx.translate(ballPrj.sx, ballPrj.sy);
        ctx.rotate(b.tiltAngle);
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const rollOffset = (b.rollAngle % (Math.PI * 2)) - Math.PI;
        ctx.arc(0, 0, r * 0.7, rollOffset, rollOffset + 1.2);
        ctx.stroke();
        ctx.restore();
      }

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

        {/* Live Score & Gems */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-black border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{score}</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-black border border-emerald-500/30">
            <span className="text-xs">💎</span>
            <span>{gems}</span>
          </div>

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
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-cyan-500/30 animate-pulse">
              ⚡
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-cyan-400 mb-1 tracking-wider uppercase font-display">
              {lang === 'hi' ? 'स्लोप 3D साइबर रन' : 'Slope 3D Cyber Run'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mb-4">
              {lang === 'hi'
                ? '3D ढलान पर तेजी से लुढ़कती गेंद को मोड़ें! लाल बाधाओं से बचें और हरे रत्न बटोरें!'
                : 'Roll downhill in high-speed 3D! Steer left/right, dodge red blocks, and collect green gems!'}
            </p>

            <button
              onClick={startGame}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-base transition-all active:scale-95 shadow-xl shadow-cyan-500/40 uppercase tracking-wider"
            >
              {lang === 'hi' ? '▶ खेल शुरू करें' : '▶ Play 3D Slope'}
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
              {lang === 'hi' ? 'खेल समाप्त!' : 'Run Finished!'}
            </h2>
            <div className="flex items-center gap-4 my-2">
              <div className="px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-400">{lang === 'hi' ? 'स्कोर' : 'Score'}</div>
                <div className="text-lg font-black text-cyan-400">{score}</div>
              </div>
              <div className="px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-400">{lang === 'hi' ? 'रत्न' : 'Gems'}</div>
                <div className="text-lg font-black text-emerald-400">💎 {gems}</div>
              </div>
              <div className="px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-400">{lang === 'hi' ? 'सर्वश्रेष्ठ' : 'Best'}</div>
                <div className="text-lg font-black text-amber-400">{highScore}</div>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition-all active:scale-95 shadow-md shadow-cyan-500/30"
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
          className="flex-1 py-3 px-4 rounded-2xl bg-cyan-950/80 hover:bg-cyan-900 active:bg-cyan-800 text-cyan-300 border border-cyan-700/60 font-black text-sm sm:text-base flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md select-none touch-none"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>{lang === 'hi' ? 'बायां मोड़ें' : 'STEER LEFT'}</span>
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
          className="flex-1 py-3 px-4 rounded-2xl bg-cyan-950/80 hover:bg-cyan-900 active:bg-cyan-800 text-cyan-300 border border-cyan-700/60 font-black text-sm sm:text-base flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md select-none touch-none"
        >
          <span>{lang === 'hi' ? 'दायां मोड़ें' : 'STEER RIGHT'}</span>
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}
