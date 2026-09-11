/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Star, Sparkles, Zap, Target } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

interface EmbeddedKnife {
  angle: number; // Angle in radians on the target
  type: string;
}

interface AppleTarget {
  angle: number;
  sliced: boolean;
}

interface WoodParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  vRot: number;
}

const KNIFE_STYLES = [
  { id: 'dagger', name: 'Hunter Dagger', emoji: '🗡️', bladeColor: '#cbd5e1', hiltColor: '#78350f' },
  { id: 'kunai', name: 'Ninja Kunai', emoji: '⚔️', bladeColor: '#64748b', hiltColor: '#dc2626' },
  { id: 'golden', name: 'Golden Saber', emoji: '🪄', bladeColor: '#fbbf24', hiltColor: '#92400e' },
  { id: 'cyber', name: 'Cyber Blade', emoji: '⚡', bladeColor: '#38bdf8', hiltColor: '#6366f1' },
];

export const KnifeHit: React.FC<Props> = ({ lang, onBack, onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover' | 'stageclear'>('ready');
  const [stage, setStage] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [apples, setApples] = useState<number>(() => {
    return parseInt(localStorage.getItem('kiddozap_knife_apples') || '0', 10);
  });
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('kiddozap_knife_highscore') || '0', 10);
  });
  const [knivesRemaining, setKnivesRemaining] = useState<number>(7);
  const [selectedKnife, setSelectedKnife] = useState<number>(0);
  const [isBoss, setIsBoss] = useState<boolean>(false);

  // Mutable game state for the 60fps canvas loop
  const stateRef = useRef({
    gameState: 'ready' as 'ready' | 'playing' | 'gameover' | 'stageclear',
    stage: 1,
    score: 0,
    applesCount: 0,
    targetAngle: 0,
    rotationSpeed: 1.6, // rad / sec
    speedVariationTimer: 0,
    targetRadius: 75,
    knivesNeeded: 7,
    knivesLeft: 7,
    embeddedKnives: [] as EmbeddedKnife[],
    apples: [] as AppleTarget[],
    activeKnife: null as {
      y: number;
      vy: number;
      isFlying: boolean;
      failed: boolean;
      rotSpeed: number;
      rot: number;
    } | null,
    particles: [] as WoodParticle[],
    shake: 0,
    lastTime: 0,
  });

  // Setup Stage (Regular log or Boss target)
  const initStage = (stg: number) => {
    const s = stateRef.current;
    s.stage = stg;
    const isBossStage = stg % 4 === 0;
    setIsBoss(isBossStage);

    // Number of knives to throw
    const needed = isBossStage ? 9 : Math.min(6 + Math.floor(stg / 2), 10);
    s.knivesNeeded = needed;
    s.knivesLeft = needed;
    setKnivesRemaining(needed);

    // Initial pre-embedded obstacle knives
    const preKnives: EmbeddedKnife[] = [];
    const preCount = isBossStage ? 3 : Math.min(1 + Math.floor(stg / 3), 4);
    for (let i = 0; i < preCount; i++) {
      preKnives.push({
        angle: (Math.PI * 2 * i) / preCount + Math.random() * 0.4,
        type: 'dagger',
      });
    }
    s.embeddedKnives = preKnives;

    // Apples on the log
    const stageApples: AppleTarget[] = [];
    if (Math.random() > 0.3 || isBossStage) {
      const appleCount = isBossStage ? 2 : 1;
      for (let i = 0; i < appleCount; i++) {
        stageApples.push({
          angle: Math.random() * Math.PI * 2,
          sliced: false,
        });
      }
    }
    s.apples = stageApples;

    s.activeKnife = null;
    s.targetAngle = 0;
    s.rotationSpeed = (Math.random() > 0.5 ? 1 : -1) * (1.6 + Math.min(stg * 0.15, 2.2));
    s.speedVariationTimer = 0;
    s.particles = [];
    s.shake = 0;
    s.lastTime = performance.now();
    s.gameState = 'playing';

    setStage(stg);
    setGameState('playing');
  };

  const startGame = () => {
    stateRef.current.score = 0;
    setScore(0);
    initStage(1);
  };

  // Throw knife handler
  const throwKnife = () => {
    const s = stateRef.current;
    if (s.gameState === 'ready') {
      startGame();
      return;
    }
    if (s.gameState !== 'playing') return;
    if (s.activeKnife && s.activeKnife.isFlying) return; // knife in flight
    if (s.knivesLeft <= 0) return;

    // Launch knife upwards from bottom
    const canvas = canvasRef.current;
    const h = canvas ? canvas.height : 520;

    s.activeKnife = {
      y: h - 90,
      vy: -1500, // fast knife flight
      isFlying: true,
      failed: false,
      rotSpeed: 0,
      rot: 0,
    };

    sounds.playBounce(540); // swish swoosh
  };

  const handleGameOver = () => {
    const s = stateRef.current;
    s.gameState = 'gameover';
    setGameState('gameover');
    sounds.playError();

    const finalScore = s.score;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('kiddozap_knife_highscore', finalScore.toString());
      confetti({ particleCount: 70, spread: 60 });
    }

    const stars = finalScore >= 35 ? 3 : finalScore >= 18 ? 2 : finalScore >= 6 ? 1 : 0;
    onGameComplete(stars, finalScore);
  };

  // Keyboard support (Spacebar or ArrowUp to throw)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        throwKnife();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Main Canvas Loop
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
      const targetCenter = { x: w / 2, y: 190 };

      // Screen shake decay
      if (s.shake > 0) {
        s.shake = Math.max(0, s.shake - dt * 25);
      }

      if (s.gameState === 'playing') {
        // Target dynamic rotation patterns
        s.speedVariationTimer += dt;
        if (s.speedVariationTimer > 1.8 + Math.random()) {
          s.speedVariationTimer = 0;
          // Randomly change speed, reverse, or pause briefly
          const rand = Math.random();
          if (rand < 0.25) {
            s.rotationSpeed = -s.rotationSpeed * (0.9 + Math.random() * 0.3);
          } else if (rand < 0.45) {
            s.rotationSpeed = (Math.random() > 0.5 ? 1 : -1) * (2.2 + Math.min(s.stage * 0.2, 2.5));
          }
        }
        s.targetAngle += s.rotationSpeed * dt;

        // Active Knife Flight Physics
        if (s.activeKnife && s.activeKnife.isFlying) {
          if (!s.activeKnife.failed) {
            s.activeKnife.y += s.activeKnife.vy * dt;

            // Check if knife tip reached target boundary
            const knifeTipY = s.activeKnife.y - 32;
            const targetBottomY = targetCenter.y + s.targetRadius;

            if (knifeTipY <= targetBottomY) {
              // The knife reached the wood!
              // Calculate collision angle on the rotating target
              // Knife arrives at the very bottom (angle = PI / 2)
              const hitAngle = ((Math.PI / 2 - s.targetAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);

              // Check collision with already embedded knives
              const minAngularDiff = 0.22; // approx 12.6 degrees
              let hitOtherKnife = false;

              for (const emb of s.embeddedKnives) {
                const normEmb = ((emb.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
                let diff = Math.abs(normEmb - hitAngle);
                if (diff > Math.PI) diff = Math.PI * 2 - diff;

                if (diff < minAngularDiff) {
                  hitOtherKnife = true;
                  break;
                }
              }

              if (hitOtherKnife) {
                // Hit existing knife! Ricochet & Game Over
                s.activeKnife.failed = true;
                s.activeKnife.vy = 400; // bounce back downward
                s.activeKnife.rotSpeed = (Math.random() > 0.5 ? 1 : -1) * 15;
                s.shake = 12;
                sounds.playMetalClang();

                // Metallic sparks
                for (let p = 0; p < 18; p++) {
                  s.particles.push({
                    x: targetCenter.x + (Math.random() - 0.5) * 10,
                    y: targetBottomY,
                    vx: (Math.random() - 0.5) * 350,
                    vy: (Math.random() - 0.5) * 300,
                    size: Math.random() * 3 + 2,
                    color: '#fef08a',
                    alpha: 1,
                    rotation: 0,
                    vRot: 0,
                  });
                }

                setTimeout(() => handleGameOver(), 700);
              } else {
                // Successfully struck the wood!
                s.activeKnife.isFlying = false;
                s.embeddedKnives.push({
                  angle: hitAngle,
                  type: KNIFE_STYLES[selectedKnife].id,
                });
                s.knivesLeft -= 1;
                setKnivesRemaining(s.knivesLeft);

                s.score += 1;
                setScore(s.score);
                s.shake = 7;
                sounds.playWoodHit();

                // Wood splinters
                for (let p = 0; p < 12; p++) {
                  s.particles.push({
                    x: targetCenter.x + (Math.random() - 0.5) * 12,
                    y: targetBottomY,
                    vx: (Math.random() - 0.5) * 200,
                    vy: (Math.random() * -150) - 50,
                    size: Math.random() * 4 + 2,
                    color: '#b45309',
                    alpha: 1,
                    rotation: Math.random() * 6,
                    vRot: (Math.random() - 0.5) * 10,
                  });
                }

                // Check apple slice collision
                s.apples.forEach((ap) => {
                  if (!ap.sliced) {
                    const normAp = ((ap.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
                    let diff = Math.abs(normAp - hitAngle);
                    if (diff > Math.PI) diff = Math.PI * 2 - diff;

                    if (diff < 0.35) {
                      ap.sliced = true;
                      s.applesCount += 2;
                      const nextApples = apples + 2;
                      setApples(nextApples);
                      localStorage.setItem('kiddozap_knife_apples', nextApples.toString());
                      sounds.playAppleSlice();

                      // Apple juice splash particles
                      for (let a = 0; a < 16; a++) {
                        s.particles.push({
                          x: targetCenter.x,
                          y: targetBottomY,
                          vx: (Math.random() - 0.5) * 250,
                          vy: (Math.random() - 0.5) * 250,
                          size: Math.random() * 5 + 3,
                          color: '#ef4444',
                          alpha: 1,
                          rotation: 0,
                          vRot: 0,
                        });
                      }
                    }
                  }
                });

                // Check if stage cleared (all knives embedded)
                if (s.knivesLeft <= 0) {
                  s.gameState = 'stageclear';
                  setGameState('stageclear');
                  sounds.playFanfare();
                  confetti({ particleCount: 60, spread: 55 });

                  // Log shatter explosion particles
                  for (let p = 0; p < 35; p++) {
                    s.particles.push({
                      x: targetCenter.x + (Math.random() - 0.5) * 100,
                      y: targetCenter.y + (Math.random() - 0.5) * 100,
                      vx: (Math.random() - 0.5) * 450,
                      vy: (Math.random() - 0.5) * 450,
                      size: Math.random() * 8 + 4,
                      color: isBoss ? '#f59e0b' : '#78350f',
                      alpha: 1,
                      rotation: Math.random() * 6,
                      vRot: (Math.random() - 0.5) * 15,
                    });
                  }

                  // Advance to next stage after 1 second
                  setTimeout(() => {
                    initStage(s.stage + 1);
                  }, 1100);
                }
              }
            }
          } else {
            // Failed falling knife tumbling away
            s.activeKnife.y += s.activeKnife.vy * dt;
            s.activeKnife.rot += s.activeKnife.rotSpeed * dt;
          }
        }
      }

      // Update particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.vRot * dt;
        p.alpha -= dt * 2.2;
        if (p.alpha <= 0) s.particles.splice(i, 1);
      }

      // 3. Render Canvas
      ctx.clearRect(0, 0, w, h);

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.5, '#1e1b4b');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      // Apply screen shake
      if (s.shake > 0) {
        ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake);
      }

      // Draw Rotating Target in Center (Unless just shattered in stageclear)
      if (s.gameState !== 'stageclear') {
        ctx.save();
        ctx.translate(targetCenter.x, targetCenter.y);
        ctx.rotate(s.targetAngle);

        // Outer Target Disc (Wood / Boss texture)
        const rad = s.targetRadius;
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 2);

        if (isBoss) {
          // Boss: Golden Shield or Fiery Orange
          const bossGrad = ctx.createRadialGradient(0, 0, rad * 0.2, 0, 0, rad);
          bossGrad.addColorStop(0, '#fef08a');
          bossGrad.addColorStop(0.6, '#f59e0b');
          bossGrad.addColorStop(1, '#b45309');
          ctx.fillStyle = bossGrad;
          ctx.fill();

          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 6;
          ctx.stroke();

          // Boss emblem star
          ctx.fillStyle = '#78350f';
          ctx.font = '32px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('👑', 0, 0);
        } else {
          // Standard Wooden Trunk Log
          const woodGrad = ctx.createRadialGradient(0, 0, rad * 0.2, 0, 0, rad);
          woodGrad.addColorStop(0, '#d97706');
          woodGrad.addColorStop(0.5, '#b45309');
          woodGrad.addColorStop(0.85, '#92400e');
          woodGrad.addColorStop(1, '#78350f');
          ctx.fillStyle = woodGrad;
          ctx.fill();

          // Tree Bark Edge
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 6;
          ctx.stroke();

          // Wood Grain Rings
          ctx.strokeStyle = 'rgba(69, 26, 3, 0.35)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, rad * 0.72, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, rad * 0.44, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, rad * 0.18, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw Embedded Knives on the Target
        s.embeddedKnives.forEach((k) => {
          ctx.save();
          ctx.rotate(k.angle);

          // Knife stuck pointing inward towards center
          const bladeLength = 48;
          const bladeWidth = 9;

          // Blade tip embedded at radius edge
          ctx.fillStyle = '#cbd5e1';
          ctx.beginPath();
          ctx.moveTo(0, rad - 6);
          ctx.lineTo(-bladeWidth / 2, rad + bladeLength * 0.6);
          ctx.lineTo(bladeWidth / 2, rad + bladeLength * 0.6);
          ctx.closePath();
          ctx.fill();

          // Hilt & Handle
          ctx.fillStyle = '#78350f';
          ctx.fillRect(-bladeWidth, rad + bladeLength * 0.6, bladeWidth * 2, 4);
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(-bladeWidth / 3, rad + bladeLength * 0.6 + 4, (bladeWidth * 2) / 3, 20);

          ctx.restore();
        });

        // Draw Apples on Target
        s.apples.forEach((ap) => {
          if (!ap.sliced) {
            ctx.save();
            ctx.rotate(ap.angle);

            // Apple situated right on the perimeter
            const apY = rad + 14;
            ctx.font = '22px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🍎', 0, apY);

            ctx.restore();
          }
        });

        ctx.restore();
      }

      // Draw Active Flying / Ready Knife
      if (s.activeKnife && s.activeKnife.isFlying) {
        ctx.save();
        ctx.translate(targetCenter.x, s.activeKnife.y);
        ctx.rotate(s.activeKnife.rot);

        // Draw knife flying upwards
        const currentBlade = KNIFE_STYLES[selectedKnife];
        ctx.fillStyle = currentBlade.bladeColor;
        ctx.beginPath();
        ctx.moveTo(0, -32); // pointed tip
        ctx.lineTo(-6, 8);
        ctx.lineTo(6, 8);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Hilt
        ctx.fillStyle = currentBlade.hiltColor;
        ctx.fillRect(-10, 8, 20, 5);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-4, 13, 8, 20);

        ctx.restore();
      } else if (s.gameState === 'playing' && s.knivesLeft > 0) {
        // Ready Knife sitting at launcher position
        const launcherY = h - 90;
        ctx.save();
        ctx.translate(targetCenter.x, launcherY);

        const currentBlade = KNIFE_STYLES[selectedKnife];
        ctx.fillStyle = currentBlade.bladeColor;
        ctx.beginPath();
        ctx.moveTo(0, -32);
        ctx.lineTo(-6, 8);
        ctx.lineTo(6, 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = currentBlade.hiltColor;
        ctx.fillRect(-10, 8, 20, 5);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-4, 13, 8, 20);

        ctx.restore();
      }

      // Draw Particles (splinters, sparks, apple bits)
      s.particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      ctx.globalAlpha = 1;

      ctx.restore(); // restore shake

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [lang, highScore, selectedKnife, isBoss, apples]);

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col items-center justify-between p-2 select-none overflow-hidden">
      {/* Top Header Controls */}
      <div className="w-full max-w-sm flex items-center justify-between bg-white/95 backdrop-blur rounded-2xl px-3 py-1.5 border border-amber-200 shadow-2xs">
        <button
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-300 rounded-xl text-[11px] font-black text-amber-900">
            <Trophy className="w-3 h-3 text-amber-500" />
            <span>{highScore}</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-0.5 bg-red-600 text-white rounded-xl text-xs font-black shadow-2xs">
            <span>🎯 {score}</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-[11px] font-black shadow-2xs">
            <span>🍎 {apples}</span>
          </div>
        </div>

        <button
          onClick={startGame}
          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all"
          title="Restart"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stage Badge Banner & Ammo */}
      <div className="flex items-center justify-between w-full max-w-sm px-1">
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
          isBoss ? 'bg-amber-500 text-amber-950 animate-pulse' : 'bg-indigo-600 text-white'
        }`}>
          {isBoss ? '👑 BOSS' : `STAGE ${stage}`}
        </span>

        {/* Ammo Knife Icons Queue */}
        <div className="flex items-center gap-1">
          {Array.from({ length: stateRef.current.knivesNeeded || 7 }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-4.5 rounded-xs transition-all ${
                idx < knivesRemaining
                  ? 'bg-amber-400 shadow-xs'
                  : 'bg-slate-700 opacity-30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Knife Hit Canvas Area */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center p-1 relative">
        <div
          className="relative h-full max-h-[min(68vh,480px)] aspect-[4/5.4] bg-slate-950 rounded-3xl overflow-hidden shadow-xl border-4 border-slate-800 touch-none cursor-pointer"
          onClick={throwKnife}
        >
          <canvas
            ref={canvasRef}
            width={380}
            height={520}
            className="w-full h-full block"
          />

          {/* Ready Overlay */}
          {gameState === 'ready' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white">
              <div className="text-5xl mb-2">🎯</div>
              <h3 className="text-xl font-black font-display drop-shadow-md">
                {lang === 'hi' ? 'नाइफ हिट - टार्गेट मास्टर' : 'Knife Hit Target Master'}
              </h3>
              <p className="text-[11px] text-amber-200 font-bold mt-1 max-w-xs leading-tight">
                {lang === 'hi'
                  ? 'घूमती लकड़ी पर चाकू फेंकें। लगे चाकुओं से न टकराएं!'
                  : 'Throw knives into the target. Avoid hitting existing knives!'}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="mt-4 px-5 py-2.5 bg-gradient-to-r from-red-500 to-amber-500 text-white font-black text-xs rounded-xl shadow-lg active:scale-95 transition-all"
              >
                {lang === 'hi' ? 'चाकू फेंकना शुरू करें' : 'Start Throwing'}
              </button>
            </div>
          )}

          {/* Stage Clear Banner */}
          {gameState === 'stageclear' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                className="px-5 py-2 bg-amber-400 text-amber-950 font-black text-base rounded-xl shadow-xl border-2 border-white"
              >
                {lang === 'hi' ? 'लकड़ी टूट गई! शानदार!' : 'TARGET BROKEN! NICE!'}
              </motion.div>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center text-white">
              <div className="text-4xl mb-1">💥</div>
              <h3 className="text-xl font-black font-display text-red-400">
                {lang === 'hi' ? 'चाकू टकरा गया!' : 'Knife Deflected!'}
              </h3>

              <div className="bg-white/10 rounded-2xl p-3 my-2 w-full max-w-xs border border-white/20">
                <p className="text-[11px] text-slate-300 font-bold">{lang === 'hi' ? 'स्कोर व सेब' : 'Score & Apples'}</p>
                <p className="text-3xl font-black text-amber-300 my-0.5 font-display">
                  {score} 🎯 | {apples} 🍎
                </p>
                <p className="text-[10px] text-slate-400">
                  {lang === 'hi' ? `सर्वश्रेष्ठ: ${highScore}` : `Best: ${highScore}`}
                </p>
              </div>

              <div className="flex gap-2 w-full max-w-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startGame();
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow-md active:scale-95 transition-all"
                >
                  {lang === 'hi' ? 'फिर खेलें' : 'Play Again'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBack();
                  }}
                  className="py-2.5 px-4 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl active:scale-95 transition-all"
                >
                  {lang === 'hi' ? 'हब' : 'Hub'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Throw Action Button */}
      <button
        onClick={throwKnife}
        className="w-full max-w-sm h-11 bg-gradient-to-r from-red-500 via-amber-500 to-red-500 text-white font-black text-xs rounded-xl shadow-2xs active:scale-98 flex items-center justify-center gap-1.5 border border-amber-300"
      >
        <span>🎯 {lang === 'hi' ? 'टैप करके चाकू फेंकें (THROW)' : 'TAP TO THROW KNIFE'}</span>
      </button>
    </div>
  );
};
