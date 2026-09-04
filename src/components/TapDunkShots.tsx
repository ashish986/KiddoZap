/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Flame, Trophy, Star, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
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

interface Hoop {
  side: 'left' | 'right';
  x: number;
  y: number;
  width: number;
  height: number;
  baseY: number;
  moving: boolean;
  moveSpeed: number;
  scored: boolean;
}

export const TapDunkShots: React.FC<Props> = ({ lang, onBack, onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('kiddozap_tapdunk_highscore') || '0', 10);
  });
  const [streak, setStreak] = useState<number>(0);
  const [isFire, setIsFire] = useState<boolean>(false);
  const [bannerText, setBannerText] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(5.0);

  // Mutable Game Loop State
  const stateRef = useRef({
    ball: {
      x: 80,
      y: 350,
      vx: 0,
      vy: 0,
      radius: 16,
      rotation: 0,
    },
    hoop: {
      side: 'right' as 'left' | 'right',
      x: 320,
      y: 260,
      width: 64,
      height: 12,
      baseY: 260,
      moving: false,
      moveSpeed: 1,
      scored: false,
    },
    prevHoop: null as Hoop | null,
    shotTimer: 5.0,
    maxTime: 5.0,
    lastTime: 0,
    score: 0,
    streak: 0,
    isFire: false,
    hitRim: false,
    netSway: 0,
    particles: [] as Particle[],
    trail: [] as { x: number; y: number; alpha: number }[],
    gameState: 'ready' as 'ready' | 'playing' | 'gameover',
  });

  const triggerBanner = (text: string) => {
    setBannerText(text);
    setTimeout(() => setBannerText(null), 1200);
  };

  const spawnNextHoop = (currentSide: 'left' | 'right', scoreVal: number): Hoop => {
    const nextSide = currentSide === 'left' ? 'right' : 'left';
    const canvas = canvasRef.current;
    const w = canvas ? canvas.width : 380;
    const h = canvas ? canvas.height : 540;

    const hoopWidth = 64;
    const x = nextSide === 'right' ? w - hoopWidth - 16 : 16;
    // Vary height between 160 and 340
    const minY = 160;
    const maxY = Math.min(360, h - 180);
    const targetY = minY + Math.random() * (maxY - minY);

    return {
      side: nextSide,
      x,
      y: targetY,
      width: hoopWidth,
      height: 12,
      baseY: targetY,
      moving: scoreVal >= 5 && Math.random() > 0.4,
      moveSpeed: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.min(scoreVal * 0.1, 1.8)),
      scored: false,
    };
  };

  // Jump / Tap impulse
  const jumpBall = () => {
    const s = stateRef.current;
    if (s.gameState === 'gameover') return;

    if (s.gameState === 'ready') {
      s.gameState = 'playing';
      setGameState('playing');
    }

    // Determine horizontal push towards target hoop
    const targetX = s.hoop.x + s.hoop.width / 2;
    const dir = targetX > s.ball.x ? 1 : -1;
    const hBoost = Math.abs(targetX - s.ball.x) * 0.016 + 2.4;

    s.ball.vy = -8.2;
    s.ball.vx = dir * Math.min(hBoost, 5.2);
    s.ball.rotation += dir * 0.3;

    sounds.playBounce(320);

    // Spawn push particles
    for (let i = 0; i < 6; i++) {
      s.particles.push({
        x: s.ball.x,
        y: s.ball.y + s.ball.radius,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 2 + 1,
        color: s.isFire ? '#f97316' : '#fbbf24',
        size: Math.random() * 4 + 2,
        alpha: 1,
        life: 0.3,
      });
    }
  };

  const handleGameOver = () => {
    const s = stateRef.current;
    s.gameState = 'gameover';
    setGameState('gameover');
    sounds.playError();

    const finalScore = s.score;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('kiddozap_tapdunk_highscore', finalScore.toString());
      confetti({ particleCount: 70, spread: 60 });
    }

    let stars = 0;
    if (finalScore >= 12) stars = 3;
    else if (finalScore >= 6) stars = 2;
    else if (finalScore >= 2) stars = 1;

    onGameComplete(stars, finalScore);
  };

  const resetGame = () => {
    const canvas = canvasRef.current;
    const w = canvas ? canvas.width : 380;
    const h = canvas ? canvas.height : 540;

    const initialHoop: Hoop = {
      side: 'right',
      x: w - 80,
      y: 250,
      width: 64,
      height: 12,
      baseY: 250,
      moving: false,
      moveSpeed: 1,
      scored: false,
    };

    stateRef.current = {
      ball: {
        x: 90,
        y: 360,
        vx: 0,
        vy: 0,
        radius: 16,
        rotation: 0,
      },
      hoop: initialHoop,
      prevHoop: null,
      shotTimer: 5.0,
      maxTime: 5.0,
      lastTime: performance.now(),
      score: 0,
      streak: 0,
      isFire: false,
      hitRim: false,
      netSway: 0,
      particles: [],
      trail: [],
      gameState: 'ready',
    };

    setScore(0);
    setStreak(0);
    setIsFire(false);
    setTimeLeft(5.0);
    setGameState('ready');
  };

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jumpBall();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    stateRef.current.lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - stateRef.current.lastTime) / 1000, 0.05);
      stateRef.current.lastTime = now;

      const s = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Update Game Physics
      if (s.gameState === 'playing') {
        // Shot timer countdown
        s.shotTimer -= dt;
        setTimeLeft(Math.max(0, s.shotTimer));
        if (s.shotTimer <= 0) {
          handleGameOver();
        }

        // Hoop vertical movement
        if (s.hoop.moving) {
          s.hoop.y += s.hoop.moveSpeed;
          if (s.hoop.y > s.hoop.baseY + 50 || s.hoop.y < s.hoop.baseY - 50) {
            s.hoop.moveSpeed *= -1;
          }
        }

        // Ball gravity & motion
        const gravity = 18.5;
        s.ball.vy += gravity * dt;
        s.ball.x += s.ball.vx;
        s.ball.y += s.ball.vy;
        s.ball.rotation += s.ball.vx * 0.05;

        // Bounce on floor
        if (s.ball.y + s.ball.radius > h - 30) {
          s.ball.y = h - 30 - s.ball.radius;
          s.ball.vy = -s.ball.vy * 0.55;
          s.ball.vx *= 0.8;
          sounds.playBounce(220);
        }

        // Bounce on left & right walls
        if (s.ball.x - s.ball.radius < 0) {
          s.ball.x = s.ball.radius;
          s.ball.vx = -s.ball.vx * 0.65;
          sounds.playBounce(260);
        } else if (s.ball.x + s.ball.radius > w) {
          s.ball.x = w - s.ball.radius;
          s.ball.vx = -s.ball.vx * 0.65;
          sounds.playBounce(260);
        }

        // Trail effect
        s.trail.push({ x: s.ball.x, y: s.ball.y, alpha: 0.8 });
        if (s.trail.length > 8) s.trail.shift();

        // 2. Hoop Collision & Scoring Logic
        const hoop = s.hoop;
        const rimLeftX = hoop.x;
        const rimRightX = hoop.x + hoop.width;
        const rimY = hoop.y;

        // Check rim collisions (left peg & right peg)
        const checkPeg = (pegX: number, pegY: number) => {
          const dx = s.ball.x - pegX;
          const dy = s.ball.y - pegY;
          const dist = Math.hypot(dx, dy);
          if (dist < s.ball.radius + 4) {
            s.hitRim = true;
            sounds.playRim();
            const angle = Math.atan2(dy, dx);
            s.ball.vx = Math.cos(angle) * 3.5;
            s.ball.vy = Math.sin(angle) * 3.5;
          }
        };

        checkPeg(rimLeftX + 3, rimY);
        checkPeg(rimRightX - 3, rimY);

        // Check if ball passed downwards through the hoop net
        const isWithinHoopX = s.ball.x > rimLeftX + 4 && s.ball.x < rimRightX - 4;
        const isCrossingY = s.ball.y >= rimY && s.ball.y - s.ball.vy * dt < rimY && s.ball.vy > 0;

        if (!hoop.scored && isWithinHoopX && isCrossingY) {
          hoop.scored = true;
          const isCleanSwish = !s.hitRim;
          const pts = isCleanSwish ? (s.isFire ? 3 : 2) : 1;

          s.score += pts;
          setScore(s.score);
          s.netSway = 18;

          if (isCleanSwish) {
            s.streak += 1;
            setStreak(s.streak);
            sounds.playSwish();
            sounds.playChime(1.3);

            if (s.streak >= 2) {
              s.isFire = true;
              setIsFire(true);
              triggerBanner(lang === 'hi' ? '🔥 शानदार स्वाइप! ऑन फायर!' : '🔥 HOT STREAK! ON FIRE!');
            } else {
              triggerBanner(lang === 'hi' ? '✨ स्वच्छ शॉट! +2' : '✨ CLEAN SWISH! +2');
            }
          } else {
            s.streak = 0;
            s.isFire = false;
            setIsFire(false);
            setStreak(0);
            sounds.playSwish();
            triggerBanner('+1 DUNK!');
          }

          // Reset shot timer with extra grace
          s.shotTimer = Math.max(3.8, 5.0 - Math.min(s.score * 0.05, 1.2));
          s.maxTime = s.shotTimer;

          // Confetti / Sparks on score
          for (let i = 0; i < 20; i++) {
            s.particles.push({
              x: hoop.x + hoop.width / 2,
              y: hoop.y + 10,
              vx: (Math.random() - 0.5) * 6,
              vy: Math.random() * -5 - 1,
              color: s.isFire ? '#f97316' : '#eab308',
              size: Math.random() * 5 + 3,
              alpha: 1,
              life: 0.6,
            });
          }

          // Spawn next hoop smoothly
          s.prevHoop = { ...hoop };
          s.hoop = spawnNextHoop(hoop.side, s.score);
          s.hitRim = false;
        }

        // Net sway dampening
        s.netSway *= 0.92;
      }

      // Update Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= dt / p.life;
        if (p.alpha <= 0) {
          s.particles.splice(i, 1);
        }
      }

      // 3. Render Canvas
      ctx.clearRect(0, 0, w, h);

      // Background Gradient Court
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#1e1b4b');
      bgGrad.addColorStop(0.6, '#312e81');
      bgGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Court Lines & Glow
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 70, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Floor Platform
      ctx.fillStyle = '#4338ca';
      ctx.fillRect(0, h - 30, w, 30);
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(0, h - 30, w, 4);

      // Draw Hoops (Previous fading hoop + Active hoop)
      const drawHoop = (target: Hoop, isCurrent: boolean) => {
        const hx = target.x;
        const hy = target.y;
        const hw = target.width;

        // Backboard
        const bbX = target.side === 'right' ? hx + hw + 2 : hx - 14;
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(bbX, hy - 40, 12, 56);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(bbX + 2, hy - 25, 8, 22);

        // Net Strings (animated sway)
        ctx.strokeStyle = isCurrent ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1.8;
        const sway = isCurrent ? s.netSway : 0;
        const netDepth = 28;

        for (let i = 0; i <= 4; i++) {
          const startX = hx + (i * hw) / 4;
          const endX = hx + (hw / 2) + ((i - 2) * hw * 0.2) + sway;
          ctx.beginPath();
          ctx.moveTo(startX, hy);
          ctx.lineTo(endX, hy + netDepth);
          ctx.stroke();
        }

        // Net horizontal cords
        ctx.beginPath();
        ctx.moveTo(hx + 4, hy + 12);
        ctx.lineTo(hx + hw - 4, hy + 12);
        ctx.moveTo(hx + 8, hy + 22);
        ctx.lineTo(hx + hw - 8, hy + 22);
        ctx.stroke();

        // Rim Circle / Bar
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.roundRect(hx, hy - 3, hw, 7, 3);
        ctx.fill();

        // Target pulse marker if active
        if (isCurrent) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(hx + hw / 2, hy + 8, 14 + Math.sin(now * 0.008) * 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      };

      if (s.prevHoop && s.prevHoop.scored) {
        drawHoop(s.prevHoop, false);
      }
      drawHoop(s.hoop, true);

      // Draw Ball Trail
      s.trail.forEach((t, idx) => {
        const ratio = (idx + 1) / s.trail.length;
        ctx.beginPath();
        ctx.arc(t.x, t.y, s.ball.radius * ratio * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = s.isFire
          ? `rgba(249, 115, 22, ${0.4 * ratio})`
          : `rgba(251, 191, 36, ${0.3 * ratio})`;
        ctx.fill();
      });

      // Draw Ball (Basketball with rib lines)
      ctx.save();
      ctx.translate(s.ball.x, s.ball.y);
      ctx.rotate(s.ball.rotation);

      // Fire aura if hot streak
      if (s.isFire) {
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 24;
      }

      // Ball Body
      const ballGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, s.ball.radius);
      ballGrad.addColorStop(0, s.isFire ? '#fef08a' : '#fdba74');
      ballGrad.addColorStop(0.7, s.isFire ? '#f97316' : '#ea580c');
      ballGrad.addColorStop(1, s.isFire ? '#c2410c' : '#9a3412');

      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.arc(0, 0, s.ball.radius, 0, Math.PI * 2);
      ctx.fill();

      // Basketball Ribs
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, s.ball.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-s.ball.radius, 0);
      ctx.lineTo(s.ball.radius, 0);
      ctx.moveTo(0, -s.ball.radius);
      ctx.lineTo(0, s.ball.radius);
      ctx.stroke();

      ctx.restore();

      // Draw Particles
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

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 flex flex-col items-center">
      {/* Top Header Controls */}
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

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-300 rounded-xl text-xs font-black text-amber-900">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{highScore}</span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded-xl text-sm font-black shadow-xs">
            <span>🏀 {score}</span>
          </div>

          {isFire && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-red-500 to-amber-500 text-white rounded-lg text-xs font-black uppercase tracking-wider"
            >
              <Flame className="w-3.5 h-3.5 fill-yellow-200 text-yellow-200" />
              <span>Fire x2</span>
            </motion.div>
          )}
        </div>

        <button
          onClick={resetGame}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Shot Clock Progress Bar */}
      <div className="w-full max-w-[400px] mb-2 px-1">
        <div className="flex items-center justify-between text-[11px] font-black text-slate-600 mb-1">
          <span>{lang === 'hi' ? 'शॉट क्लॉक' : 'Shot Clock'}</span>
          <span className={timeLeft < 2 ? 'text-red-600 font-extrabold animate-pulse' : 'text-slate-700'}>
            {timeLeft.toFixed(1)}s
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-75 ${
              timeLeft < 1.8 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'
            }`}
            style={{ width: `${Math.min(100, (timeLeft / 5.0) * 100)}%` }}
          />
        </div>
      </div>

      {/* Interactive Canvas Container */}
      <div
        className="relative w-full max-w-[400px] aspect-[4/5.4] bg-slate-900 rounded-3xl overflow-hidden shadow-xl border-4 border-indigo-900 select-none cursor-pointer touch-none"
        onClick={jumpBall}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={540}
          className="w-full h-full block"
        />

        {/* Floating Banner announcement for SWISH / FIRE */}
        <AnimatePresence>
          {bannerText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="absolute top-16 inset-x-0 mx-auto w-fit px-4 py-2 rounded-2xl bg-amber-400 text-amber-950 font-black text-sm sm:text-base tracking-wider shadow-lg border-2 border-white pointer-events-none"
            >
              {bannerText}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ready Overlay */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="text-6xl mb-3"
            >
              🏀
            </motion.div>
            <h3 className="text-2xl font-black font-display drop-shadow-md">
              {lang === 'hi' ? 'टैप-टैप डंक शॉट्स' : 'Tap-Tap Dunk Shots'}
            </h3>
            <p className="text-xs text-amber-200 font-bold mt-1 max-w-xs">
              {lang === 'hi'
                ? 'स्क्रीन पर टैप करें या स्पेसबार दबाएं। गेंद को उछालकर बास्केट में डालें!'
                : 'Tap screen or press Spacebar to bounce the ball into the hoop!'}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                jumpBall();
              }}
              className="mt-5 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm rounded-2xl shadow-lg active:scale-95 transition-all"
            >
              {lang === 'hi' ? 'टैप करके शुरू करें' : 'Tap to Start'}
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="text-5xl mb-2">⏰</div>
            <h3 className="text-2xl font-black font-display text-red-400">
              {lang === 'hi' ? 'समय समाप्त!' : "Time's Up!"}
            </h3>

            <div className="bg-white/10 rounded-2xl p-4 my-4 w-full max-w-xs border border-white/20">
              <p className="text-xs text-slate-300 font-bold">{lang === 'hi' ? 'आपका स्कोर' : 'Your Score'}</p>
              <p className="text-4xl font-black text-amber-300 my-1 font-display">{score}</p>
              <p className="text-xs text-amber-100/80 font-semibold">
                {lang === 'hi' ? `सर्वश्रेष्ठ: ${highScore}` : `Best: ${highScore}`}
              </p>
            </div>

            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                }}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs rounded-2xl shadow-md active:scale-95 transition-all"
              >
                {lang === 'hi' ? 'फिर खेलें' : 'Play Again'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBack();
                }}
                className="py-3 px-4 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-2xl active:scale-95 transition-all"
              >
                {lang === 'hi' ? 'हब' : 'Hub'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tap control action button for mobile */}
      <button
        onClick={jumpBall}
        className="w-full max-w-[400px] mt-3 py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-white font-black rounded-2xl shadow-md active:scale-98 flex items-center justify-center gap-2 border border-amber-300 sm:hidden"
      >
        <span>🏀 {lang === 'hi' ? 'टैप करके उछालें (TAP)' : 'TAP TO BOUNCE'}</span>
      </button>

      {/* Quick instructions */}
      <p className="text-center text-xs text-slate-500 font-bold mt-2">
        {lang === 'hi'
          ? 'टिप: बिना रिम छुए सीधा जाल में डालने पर +2 और आग (Fire Combo) मिलता है!'
          : 'Tip: Clean swishes without touching the rim award +2 and activate Fire Streak!'}
      </p>
    </div>
  );
};
