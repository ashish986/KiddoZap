/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Star, Sparkles, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

interface DiscSector {
  startAngle: number;
  endAngle: number;
  type: 'safe' | 'hazard' | 'gap';
}

interface DiscFloor {
  y: number;
  sectors: DiscSector[];
  color: string;
  hazardColor: string;
  isShattered: boolean;
}

interface Splat {
  angle: number;
  radius: number;
  color: string;
  size: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

export const HelixJump: React.FC<Props> = ({ lang, onBack, onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover' | 'levelcomplete'>('ready');
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('kiddozap_helix_highscore') || '0', 10);
  });
  const [combo, setCombo] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  // Mutable Game Loop State
  const stateRef = useRef({
    gameState: 'ready' as 'ready' | 'playing' | 'gameover' | 'levelcomplete',
    level: 1,
    score: 0,
    towerAngle: 0, // Tower rotation in radians
    targetTowerAngle: 0,
    cameraY: 0, // Vertical camera scroll tracking ball
    ball: {
      y: 0, // relative to tower world
      vy: 0,
      radius: 12,
      isFalling: false,
      consecutiveDrops: 0,
      isFireball: false,
      squash: 1,
    },
    floors: [] as DiscFloor[],
    splats: new Map<number, Splat[]>(), // floorIndex -> splats
    particles: [] as Particle[],
    isDragging: false,
    lastMouseX: 0,
    lastTime: 0,
  });

  // Generate Floors for a level
  const generateLevelFloors = (lvl: number): DiscFloor[] => {
    const totalFloors = 8 + lvl * 3;
    const floors: DiscFloor[] = [];
    const floorSpacing = 110;

    const themes = [
      { safe: '#06b6d4', hazard: '#ef4444' }, // Cyan & Red
      { safe: '#8b5cf6', hazard: '#f97316' }, // Purple & Orange
      { safe: '#10b981', hazard: '#dc2626' }, // Emerald & Crimson
      { safe: '#f59e0b', hazard: '#e11d48' }, // Amber & Rose
    ];
    const theme = themes[(lvl - 1) % themes.length];

    for (let i = 0; i < totalFloors; i++) {
      const y = i * floorSpacing;

      // Bottom floor is goal platform with no gaps
      if (i === totalFloors - 1) {
        floors.push({
          y,
          sectors: [{ startAngle: 0, endAngle: Math.PI * 2, type: 'safe' }],
          color: '#fbbf24', // Gold goal
          hazardColor: theme.hazard,
          isShattered: false,
        });
        continue;
      }

      // First floor has a safe opening and no hazards
      const sectors: DiscSector[] = [];
      const numSlices = 8;
      const sliceAngle = (Math.PI * 2) / numSlices;

      // Decide gap locations (1 to 2 gaps)
      const gapIndex = Math.floor(Math.random() * numSlices);
      const gapIndex2 = Math.random() > 0.6 ? (gapIndex + 4) % numSlices : -1;

      // Hazard count increases with level
      const hazardCount = i === 0 ? 0 : Math.min(2 + Math.floor(lvl / 2), 3);
      const hazardIndices = new Set<number>();
      while (hazardIndices.size < hazardCount) {
        const candidate = Math.floor(Math.random() * numSlices);
        if (candidate !== gapIndex && candidate !== gapIndex2) {
          hazardIndices.add(candidate);
        }
      }

      for (let s = 0; s < numSlices; s++) {
        const start = s * sliceAngle;
        const end = (s + 1) * sliceAngle;
        if (s === gapIndex || s === gapIndex2) {
          sectors.push({ startAngle: start, endAngle: end, type: 'gap' });
        } else if (hazardIndices.has(s)) {
          sectors.push({ startAngle: start, endAngle: end, type: 'hazard' });
        } else {
          sectors.push({ startAngle: start, endAngle: end, type: 'safe' });
        }
      }

      floors.push({
        y,
        sectors,
        color: theme.safe,
        hazardColor: theme.hazard,
        isShattered: false,
      });
    }

    return floors;
  };

  const startLevel = (lvl: number) => {
    const s = stateRef.current;
    s.level = lvl;
    s.towerAngle = 0;
    s.targetTowerAngle = 0;
    s.floors = generateLevelFloors(lvl);
    s.splats.clear();
    s.particles = [];
    s.ball = {
      y: -25, // Start slightly above first floor
      vy: 0,
      radius: 12,
      isFalling: false,
      consecutiveDrops: 0,
      isFireball: false,
      squash: 1,
    };
    s.cameraY = -25;
    s.gameState = 'playing';
    s.lastTime = performance.now();

    setLevel(lvl);
    setCombo(0);
    setProgress(0);
    setGameState('playing');
  };

  const resetAll = () => {
    setScore(0);
    stateRef.current.score = 0;
    startLevel(1);
  };

  // User input to rotate the tower
  const rotateTower = (deltaAngle: number) => {
    const s = stateRef.current;
    if (s.gameState !== 'playing') return;
    s.targetTowerAngle += deltaAngle;
  };

  const handleGameOver = () => {
    const s = stateRef.current;
    s.gameState = 'gameover';
    setGameState('gameover');
    sounds.playError();

    const finalScore = s.score;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('kiddozap_helix_highscore', finalScore.toString());
    }

    const stars = finalScore >= 300 ? 3 : finalScore >= 150 ? 2 : finalScore >= 50 ? 1 : 0;
    onGameComplete(stars, finalScore);
  };

  const handleLevelWon = () => {
    const s = stateRef.current;
    s.gameState = 'levelcomplete';
    setGameState('levelcomplete');
    sounds.playFanfare();
    confetti({ particleCount: 80, spread: 70 });

    const stars = 3;
    onGameComplete(stars, s.score + 100);
  };

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        rotateTower(0.28);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        rotateTower(-0.28);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    stateRef.current.lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - stateRef.current.lastTime) / 1000, 0.04);
      stateRef.current.lastTime = now;

      const s = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Smooth tower rotation towards target
      s.towerAngle += (s.targetTowerAngle - s.towerAngle) * 0.25;

      if (s.gameState === 'playing') {
        // Physics update for ball
        const gravity = 480;
        s.ball.vy += gravity * dt;
        s.ball.y += s.ball.vy * dt;

        // Smooth camera follow
        const targetCamY = s.ball.y - 120;
        s.cameraY += (targetCamY - s.cameraY) * 0.18;

        // Find nearest floor below or at ball
        const floorSpacing = 110;
        const totalFloors = s.floors.length;
        const goalY = (totalFloors - 1) * floorSpacing;
        const currentProgress = Math.min(100, Math.max(0, (s.ball.y / goalY) * 100));
        setProgress(currentProgress);

        // Check if ball reached goal platform
        if (s.ball.y >= goalY - 10) {
          handleLevelWon();
        }

        // Check floor collision
        s.floors.forEach((floor, fIdx) => {
          if (floor.isShattered) return;

          const floorTopY = floor.y;
          // Ball crosses top surface of disc
          if (s.ball.y >= floorTopY - 2 && s.ball.y - s.ball.vy * dt <= floorTopY + 14 && s.ball.vy > 0) {
            // Normalize angle to find which sector is currently right in front (at angle PI / 2)
            // Ball is always at 6 o'clock position (downwards on screen relative to center)
            const ballAngleOnDisc = ((Math.PI / 2 - s.towerAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);

            // Find sector under ball
            let hitSector: DiscSector | null = null;
            for (const sec of floor.sectors) {
              if (ballAngleOnDisc >= sec.startAngle && ballAngleOnDisc < sec.endAngle) {
                hitSector = sec;
                break;
              }
            }

            if (!hitSector || hitSector.type === 'gap') {
              // Falling through gap!
              s.ball.consecutiveDrops += 1;
              s.score += 10 * s.ball.consecutiveDrops;
              setScore(s.score);
              setCombo(s.ball.consecutiveDrops);
              sounds.playBounce(380 + s.ball.consecutiveDrops * 40);

              if (s.ball.consecutiveDrops >= 3) {
                s.ball.isFireball = true;
              }
            } else if (hitSector.type === 'hazard') {
              if (s.ball.isFireball) {
                // Fireball smashes right through hazard!
                floor.isShattered = true;
                sounds.playSmash();
                s.score += 50;
                setScore(s.score);
                // Create shatter explosion particles
                for (let p = 0; p < 25; p++) {
                  s.particles.push({
                    x: w / 2 + (Math.random() - 0.5) * 160,
                    y: floor.y - s.cameraY,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8 - 2,
                    color: floor.hazardColor,
                    size: Math.random() * 6 + 3,
                    alpha: 1,
                    life: 0.6,
                  });
                }
              } else {
                // Hit hazard - game over!
                handleGameOver();
              }
            } else {
              // Safe bounce!
              if (s.ball.isFireball) {
                // Fireball smashes the safe platform too!
                floor.isShattered = true;
                sounds.playSmash();
                s.score += 40;
                setScore(s.score);
                for (let p = 0; p < 20; p++) {
                  s.particles.push({
                    x: w / 2 + (Math.random() - 0.5) * 160,
                    y: floor.y - s.cameraY,
                    vx: (Math.random() - 0.5) * 7,
                    vy: (Math.random() - 0.5) * 7 - 2,
                    color: floor.color,
                    size: Math.random() * 5 + 3,
                    alpha: 1,
                    life: 0.5,
                  });
                }
              } else {
                // Normal bounce
                s.ball.y = floorTopY;
                s.ball.vy = -260; // Upward bounce velocity
                s.ball.squash = 0.6;
                s.ball.consecutiveDrops = 0;
                s.ball.isFireball = false;
                setCombo(0);
                sounds.playBounce(290);

                // Add paint splat to floor
                const splatList = s.splats.get(fIdx) || [];
                splatList.push({
                  angle: ballAngleOnDisc,
                  radius: 45,
                  color: '#f59e0b',
                  size: Math.random() * 6 + 8,
                });
                s.splats.set(fIdx, splatList);
              }
            }
          }
        });

        // Recover squash/stretch
        s.ball.squash += (1 - s.ball.squash) * 0.15;
      }

      // Update particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= dt / p.life;
        if (p.alpha <= 0) s.particles.splice(i, 1);
      }

      // 3. Render 3D-styled Cylinder & Perspective Discs
      ctx.clearRect(0, 0, w, h);

      // Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const centerX = w / 2;
      const cylinderRadius = 26;
      const discRadiusX = 135;
      const discRadiusY = 38; // Perspective squash

      // Draw Center Pillar (Cylinder)
      const pillarGrad = ctx.createLinearGradient(centerX - cylinderRadius, 0, centerX + cylinderRadius, 0);
      pillarGrad.addColorStop(0, '#334155');
      pillarGrad.addColorStop(0.5, '#64748b');
      pillarGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = pillarGrad;
      ctx.fillRect(centerX - cylinderRadius, 0, cylinderRadius * 2, h);

      // Draw Floors from Top to Bottom relative to Camera
      s.floors.forEach((floor, fIdx) => {
        if (floor.isShattered) return;

        const screenY = floor.y - s.cameraY;
        // Skip if outside viewport
        if (screenY < -80 || screenY > h + 80) return;

        // Draw sectors of the disc
        floor.sectors.forEach((sec) => {
          if (sec.type === 'gap') return; // Don't draw gaps

          ctx.save();
          ctx.beginPath();

          // Apply tower rotation
          const start = sec.startAngle + s.towerAngle;
          const end = sec.endAngle + s.towerAngle;

          // Draw perspective elliptical slice
          ctx.ellipse(centerX, screenY, discRadiusX, discRadiusY, 0, start, end);
          ctx.ellipse(centerX, screenY, cylinderRadius, cylinderRadius * 0.35, 0, end, start, true);
          ctx.closePath();

          ctx.fillStyle = sec.type === 'hazard' ? floor.hazardColor : floor.color;
          ctx.fill();

          ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
          ctx.lineWidth = 2;
          ctx.stroke();

          // 3D thickness lip underneath
          ctx.beginPath();
          ctx.ellipse(centerX, screenY + 12, discRadiusX, discRadiusY, 0, start, end);
          ctx.strokeStyle = sec.type === 'hazard' ? '#991b1b' : '#0e7490';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.restore();
        });

        // Draw Splats on this floor
        const splatList = s.splats.get(fIdx);
        if (splatList) {
          splatList.forEach((spl) => {
            const rotAngle = spl.angle + s.towerAngle;
            const sx = centerX + Math.cos(rotAngle) * (spl.radius * (discRadiusX / 100));
            const sy = screenY + Math.sin(rotAngle) * (spl.radius * (discRadiusY / 100));
            ctx.beginPath();
            ctx.ellipse(sx, sy, spl.size, spl.size * 0.4, 0, 0, Math.PI * 2);
            ctx.fillStyle = spl.color;
            ctx.fill();
          });
        }
      });

      // Draw Ball (Always at centerX, situated slightly in front of pillar)
      const ballScreenY = s.ball.y - s.cameraY;
      const ballX = centerX;
      const r = s.ball.radius;

      ctx.save();
      ctx.translate(ballX, ballScreenY);

      // Fireball trail / aura
      if (s.ball.isFireball) {
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 24;
      }

      // Ball Body with Squash & Stretch
      ctx.scale(1 / s.ball.squash, s.ball.squash);

      const ballGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, r);
      if (s.ball.isFireball) {
        ballGrad.addColorStop(0, '#fef08a');
        ballGrad.addColorStop(0.7, '#f97316');
        ballGrad.addColorStop(1, '#dc2626');
      } else {
        ballGrad.addColorStop(0, '#fef08a');
        ballGrad.addColorStop(0.6, '#f59e0b');
        ballGrad.addColorStop(1, '#b45309');
      }

      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Draw Explosion Particles
      s.particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [lang, highScore]);

  // Touch & Mouse Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    stateRef.current.isDragging = true;
    stateRef.current.lastMouseX = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!stateRef.current.isDragging) return;
    const dx = e.clientX - stateRef.current.lastMouseX;
    stateRef.current.lastMouseX = e.clientX;
    rotateTower(-dx * 0.015);
  };

  const handlePointerUp = () => {
    stateRef.current.isDragging = false;
  };

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 flex flex-col items-center">
      {/* Top Controls Header */}
      <div className="w-full flex items-center justify-between mb-3 bg-white/90 backdrop-blur rounded-2xl p-3 border border-amber-200 shadow-xs">
        <button
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-black">
            Lvl {level}
          </span>

          <div className="flex items-center gap-1 px-3 py-1 bg-amber-500 text-white rounded-xl text-sm font-black shadow-xs">
            <span>⭐ {score}</span>
          </div>

          {combo >= 2 && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-500 text-white rounded-lg text-xs font-black animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-yellow-200" />
              <span>x{combo}</span>
            </div>
          )}
        </div>

        <button
          onClick={resetAll}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Progress to Goal Bar */}
      <div className="w-full max-w-[380px] mb-2 px-1">
        <div className="flex items-center justify-between text-[10px] font-black text-slate-600 mb-1">
          <span>{lang === 'hi' ? 'मंजिल की दूरी' : 'Descent to Goal'}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-indigo-600 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Helix Interactive Canvas */}
      <div
        className="relative w-full max-w-[380px] aspect-[4/5.4] bg-slate-950 rounded-3xl overflow-hidden shadow-xl border-4 border-slate-800 select-none touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <canvas
          ref={canvasRef}
          width={380}
          height={520}
          className="w-full h-full block"
        />

        {/* Ready Screen */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="text-6xl mb-3">🌀</div>
            <h3 className="text-2xl font-black font-display drop-shadow-md">
              {lang === 'hi' ? 'हेलिक्स स्पाइरल जंप' : 'Helix Spiral Jump'}
            </h3>
            <p className="text-xs text-cyan-200 font-bold mt-1 max-w-xs leading-relaxed">
              {lang === 'hi'
                ? 'टावर को घुमाएं, गेंद को खाली जगहों से नीचे गिराएं। लाल खतरे से बचें!'
                : 'Spin the tower to drop the bouncing ball through gaps. Avoid red hazard tiles!'}
            </p>
            <button
              onClick={() => startLevel(1)}
              className="mt-5 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-sm rounded-2xl shadow-lg active:scale-95 transition-all"
            >
              {lang === 'hi' ? 'खेल शुरू करें' : 'Start Jump'}
            </button>
          </div>
        )}

        {/* Level Won Overlay */}
        {gameState === 'levelcomplete' && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="text-5xl mb-2">🎉</div>
            <h3 className="text-2xl font-black font-display text-amber-400">
              {lang === 'hi' ? 'लेवल पार! शाबाश!' : 'Level Complete!'}
            </h3>
            <p className="text-xs text-slate-300 font-bold mt-1">
              {lang === 'hi' ? `शानदार! लेवल ${level} पूरा किया` : `Awesome! Level ${level} cleared`}
            </p>

            <button
              onClick={() => startLevel(level + 1)}
              className="mt-5 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs rounded-2xl shadow-md active:scale-95 transition-all"
            >
              {lang === 'hi' ? 'अगला लेवल खेलें' : 'Next Level'}
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="text-5xl mb-2">💥</div>
            <h3 className="text-2xl font-black font-display text-red-400">
              {lang === 'hi' ? 'खतरे से टकराए!' : 'Hazard Hit!'}
            </h3>

            <div className="bg-white/10 rounded-2xl p-4 my-4 w-full max-w-xs border border-white/20">
              <p className="text-xs text-slate-300 font-bold">{lang === 'hi' ? 'कुल स्कोर' : 'Total Score'}</p>
              <p className="text-3xl font-black text-amber-300 my-1 font-display">{score}</p>
              <p className="text-xs text-slate-400 font-medium">
                {lang === 'hi' ? `सर्वश्रेष्ठ स्कोर: ${highScore}` : `High Score: ${highScore}`}
              </p>
            </div>

            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={() => startLevel(level)}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black text-xs rounded-2xl shadow-md active:scale-95 transition-all"
              >
                {lang === 'hi' ? 'दोबारा कोशिश करें' : 'Try Again'}
              </button>
              <button
                onClick={onBack}
                className="py-3 px-4 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-2xl active:scale-95 transition-all"
              >
                {lang === 'hi' ? 'हब' : 'Hub'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* On-screen Left & Right Spin Buttons */}
      <div className="flex items-center justify-center gap-4 w-full max-w-[380px] mt-3">
        <button
          onClick={() => rotateTower(0.35)}
          className="flex-1 py-3 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl font-black text-xs shadow-xs border border-slate-200 active:scale-95 flex items-center justify-center gap-1"
        >
          <ChevronLeft className="w-5 h-5 text-indigo-600" />
          <span>{lang === 'hi' ? 'बाएं घुमाएं' : 'Turn Left'}</span>
        </button>

        <button
          onClick={() => rotateTower(-0.35)}
          className="flex-1 py-3 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl font-black text-xs shadow-xs border border-slate-200 active:scale-95 flex items-center justify-center gap-1"
        >
          <span>{lang === 'hi' ? 'दाएं घुमाएं' : 'Turn Right'}</span>
          <ChevronRight className="w-5 h-5 text-indigo-600" />
        </button>
      </div>

      <p className="text-center text-xs text-slate-500 font-bold mt-2">
        {lang === 'hi'
          ? 'टिप: लगातार 3 मंजिल बिना उछले गिरने पर गेंद "फायरबॉल" बनकर खतरे को तोड़ देती है!'
          : 'Tip: Dropping 3 floors in a row creates a Fireball that smashes through hazards!'}
      </p>
    </div>
  );
};
