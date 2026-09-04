import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Trophy, Star, Sparkles, Play } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface FlappyHeroProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  width: number;
  passed: boolean;
  starCollected: boolean;
  starY: number;
}

export const FlappyHero: React.FC<FlappyHeroProps> = ({ lang, onBack, onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('kiddozap_flappy_highscore') || '0', 10);
  });
  const [starsEarned, setStarsEarned] = useState<number>(0);

  // Mutable Game Loop State
  const stateRef = useRef({
    bird: {
      x: 90,
      y: 200,
      vy: 0,
      radius: 18,
      rotation: 0,
      wingCycle: 0,
    },
    pipes: [] as Pipe[],
    pipeTimer: 0,
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number }[],
    clouds: [
      { x: 30, y: 50, s: 0.6, sp: 0.4 },
      { x: 180, y: 90, s: 0.8, sp: 0.6 },
      { x: 320, y: 40, s: 0.5, sp: 0.3 },
    ],
    width: 400,
    height: 540,
    score: 0,
  });

  const jump = () => {
    if (gameState === 'ready') {
      setGameState('playing');
      sounds.playJump();
      stateRef.current.bird.vy = -6.5;
      return;
    }
    if (gameState === 'playing') {
      sounds.playJump();
      stateRef.current.bird.vy = -6.5;

      // Spawn wing feather particles
      for (let i = 0; i < 4; i++) {
        stateRef.current.particles.push({
          x: stateRef.current.bird.x - 12,
          y: stateRef.current.bird.y + (Math.random() * 10 - 5),
          vx: -(Math.random() * 2 + 1),
          vy: Math.random() * 2 - 1,
          color: '#FDE047',
          life: 1.0,
        });
      }
    }
  };

  // Keyboard handler (Space or Arrow Up)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Main Canvas & Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const state = stateRef.current;

    // Reset Bird on Start
    if (gameState === 'ready') {
      state.bird.y = state.height / 2 - 30;
      state.bird.vy = 0;
      state.bird.rotation = 0;
      state.pipes = [];
      state.particles = [];
      state.score = 0;
      setScore(0);
    }

    const render = () => {
      // 1. Clear background (Sky gradient)
      const grad = ctx.createLinearGradient(0, 0, 0, state.height);
      grad.addColorStop(0, '#38BDF8'); // Sky Blue
      grad.addColorStop(0.7, '#BAE6FD');
      grad.addColorStop(1, '#86EFAC'); // Light green ground horizon
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, state.width, state.height);

      // 2. Draw Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      state.clouds.forEach((c) => {
        if (gameState === 'playing') {
          c.x -= c.sp;
          if (c.x < -100) c.x = state.width + 50;
        }
        ctx.beginPath();
        ctx.arc(c.x, c.y, 25 * c.s, 0, Math.PI * 2);
        ctx.arc(c.x + 20 * c.s, c.y - 10 * c.s, 30 * c.s, 0, Math.PI * 2);
        ctx.arc(c.x + 45 * c.s, c.y, 22 * c.s, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Ground Grass Line
      ctx.fillStyle = '#16A34A'; // Forest Green
      ctx.fillRect(0, state.height - 35, state.width, 35);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(0, state.height - 35, state.width, 6);

      // 4. Update & Render Pipes
      if (gameState === 'playing') {
        state.pipeTimer++;
        if (state.pipeTimer > 105) {
          state.pipeTimer = 0;
          const gap = 135;
          const minPipe = 60;
          const maxPipe = state.height - 35 - gap - minPipe;
          const topH = Math.floor(Math.random() * (maxPipe - minPipe + 1)) + minPipe;
          const bottomH = state.height - 35 - topH - gap;

          state.pipes.push({
            x: state.width + 20,
            topHeight: topH,
            bottomHeight: bottomH,
            width: 55,
            passed: false,
            starCollected: false,
            starY: topH + gap / 2,
          });
        }
      }

      // Render Pipes
      state.pipes.forEach((p, idx) => {
        if (gameState === 'playing') {
          p.x -= 2.2;
        }

        // Draw Pipe: Colorful candy green with highlight & rims
        // Top Pipe
        ctx.fillStyle = '#15803D';
        ctx.fillRect(p.x, 0, p.width, p.topHeight);
        ctx.fillStyle = '#22C55E';
        ctx.fillRect(p.x + 6, 0, p.width - 12, p.topHeight);
        // Top Pipe Rim
        ctx.fillStyle = '#166534';
        ctx.fillRect(p.x - 3, p.topHeight - 20, p.width + 6, 20);
        ctx.fillStyle = '#4ADE80';
        ctx.fillRect(p.x - 1, p.topHeight - 18, p.width + 2, 6);

        // Bottom Pipe
        const bottomY = state.height - 35 - p.bottomHeight;
        ctx.fillStyle = '#15803D';
        ctx.fillRect(p.x, bottomY, p.width, p.bottomHeight);
        ctx.fillStyle = '#22C55E';
        ctx.fillRect(p.x + 6, bottomY, p.width - 12, p.bottomHeight);
        // Bottom Pipe Rim
        ctx.fillStyle = '#166534';
        ctx.fillRect(p.x - 3, bottomY, p.width + 6, 20);
        ctx.fillStyle = '#4ADE80';
        ctx.fillRect(p.x - 1, bottomY, p.width + 2, 6);

        // Floating Bonus Star inside the Gap
        if (!p.starCollected) {
          ctx.font = '20px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⭐', p.x + p.width / 2, p.starY);

          // Star collection check
          const dist = Math.hypot(
            state.bird.x - (p.x + p.width / 2),
            state.bird.y - p.starY
          );
          if (dist < state.bird.radius + 14 && gameState === 'playing') {
            p.starCollected = true;
            sounds.playChime(1.3);
            state.score += 2;
            setScore(state.score);
            // Confetti sparkle
            for (let i = 0; i < 8; i++) {
              state.particles.push({
                x: state.bird.x,
                y: state.bird.y,
                vx: Math.cos((i / 8) * Math.PI * 2) * 3,
                vy: Math.sin((i / 8) * Math.PI * 2) * 3,
                color: '#FACC15',
                life: 1.0,
              });
            }
          }
        }

        // Score Passing check
        if (!p.passed && p.x + p.width < state.bird.x && gameState === 'playing') {
          p.passed = true;
          state.score += 1;
          setScore(state.score);
          sounds.playPop(1.4);
        }

        // Collision Check with Pipes
        if (gameState === 'playing') {
          const birdBox = {
            left: state.bird.x - state.bird.radius + 3,
            right: state.bird.x + state.bird.radius - 3,
            top: state.bird.y - state.bird.radius + 3,
            bottom: state.bird.y + state.bird.radius - 3,
          };

          const topPipeBox = { left: p.x, right: p.x + p.width, top: 0, bottom: p.topHeight };
          const botPipeBox = {
            left: p.x,
            right: p.x + p.width,
            top: bottomY,
            bottom: state.height - 35,
          };

          const hitsTop =
            birdBox.right > topPipeBox.left &&
            birdBox.left < topPipeBox.right &&
            birdBox.top < topPipeBox.bottom;

          const hitsBottom =
            birdBox.right > botPipeBox.left &&
            birdBox.left < botPipeBox.right &&
            birdBox.bottom > botPipeBox.top;

          if (hitsTop || hitsBottom) {
            handleGameOver();
          }
        }
      });

      // Filter out offscreen pipes
      state.pipes = state.pipes.filter((p) => p.x > -100);

      // 5. Update Bird Physics
      if (gameState === 'playing') {
        state.bird.vy += 0.32; // Gravity
        state.bird.y += state.bird.vy;
        state.bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, state.bird.vy * 0.08));
        state.bird.wingCycle += 0.2;

        // Ground or Ceiling Collision
        if (state.bird.y + state.bird.radius >= state.height - 35) {
          state.bird.y = state.height - 35 - state.bird.radius;
          handleGameOver();
        }
        if (state.bird.y - state.bird.radius <= 0) {
          state.bird.y = state.bird.radius;
          state.bird.vy = 0;
        }
      } else if (gameState === 'ready') {
        // Hovering bob animation
        state.bird.y = state.height / 2 - 20 + Math.sin(Date.now() / 250) * 8;
        state.bird.rotation = 0;
      }

      // 6. Render Bird (Kiddo Bird / Flying Hero)
      ctx.save();
      ctx.translate(state.bird.x, state.bird.y);
      ctx.rotate(state.bird.rotation);

      // Yellow Bird Body
      ctx.fillStyle = '#FBBF24'; // Warm Gold
      ctx.beginPath();
      ctx.arc(0, 0, state.bird.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Wing (Animated Flapping)
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      const wingOffset = Math.sin(state.bird.wingCycle) * 6;
      ctx.ellipse(-6, 2 + wingOffset, 10, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Big Friendly Eye
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(6, -6, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(8, -6, 3.5, 0, Math.PI * 2);
      ctx.fill();
      // Eye shine
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(9, -8, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Orange Beak
      ctx.fillStyle = '#F97316';
      ctx.beginPath();
      ctx.moveTo(12, -2);
      ctx.lineTo(24, 2);
      ctx.lineTo(12, 6);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#C2410C';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // 7. Render Particles
      state.particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 0.04;

        if (pt.life > 0) {
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.life;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      });
      state.particles = state.particles.filter((pt) => pt.life > 0);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState]);

  const handleGameOver = () => {
    if (gameState === 'gameover') return;
    sounds.playBuzz();
    setGameState('gameover');

    const finalScore = stateRef.current.score;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('kiddozap_flappy_highscore', finalScore.toString());
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }

    const earned = Math.min(3, Math.floor(finalScore / 5) + (finalScore >= 1 ? 1 : 0));
    setStarsEarned(earned);
    onGameComplete(earned, finalScore);
  };

  const restartGame = () => {
    sounds.playPop();
    setGameState('ready');
  };

  return (
    <div className="w-full max-w-md mx-auto p-3 sm:p-4 flex flex-col items-center">
      {/* Top Navigation */}
      <div className="w-full flex items-center justify-between gap-3 mb-3">
        <button
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-2xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-black text-slate-800 font-display flex items-center gap-1.5 justify-center">
            <span>🐦</span>
            <span>{lang === 'hi' ? 'फ़्लैपी किड्डो हीरो' : 'Flappy Hero'}</span>
          </h2>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 text-xs font-black text-amber-900">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>{highScore}</span>
        </div>
      </div>

      {/* Canvas Game Container */}
      <div
        onClick={jump}
        className="relative w-full max-w-[360px] aspect-[400/540] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 cursor-pointer select-none bg-sky-200"
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={540}
          className="w-full h-full block"
        />

        {/* Live Score Overlay during play */}
        {gameState === 'playing' && (
          <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none">
            <span className="text-4xl font-black text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] font-display">
              {score}
            </span>
          </div>
        )}

        {/* Ready Screen Overlay */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-3xl shadow-lg animate-bounce mb-3 border-2 border-white">
              🐦
            </div>
            <h3 className="text-2xl font-black font-display drop-shadow-md">
              {lang === 'hi' ? 'उड़ने के लिए टैप करें!' : 'Tap or Space to Fly!'}
            </h3>
            <p className="text-xs text-amber-100 font-bold mt-1 mb-5 max-w-[240px]">
              {lang === 'hi'
                ? 'हरे पाइपों से बचें और सुनहरे सितारे बटोरे!'
                : 'Dodge green pipes & collect shiny golden stars!'}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                jump();
              }}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-black text-base shadow-xl flex items-center gap-2 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{lang === 'hi' ? 'खेल शुरू करें' : 'Start Flying'}</span>
            </button>
          </div>
        )}

        {/* Game Over Screen Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white animate-fade-in">
            <div className="bg-white text-slate-800 rounded-3xl p-5 w-full max-w-[280px] shadow-2xl border-4 border-amber-300">
              <h3 className="text-xl font-black text-amber-900 font-display">
                {lang === 'hi' ? 'खेल समाप्त! 💥' : 'Game Over! 💥'}
              </h3>

              <div className="my-3 py-2 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="text-xs font-bold text-amber-800">
                  {lang === 'hi' ? 'आपका स्कोर' : 'Your Score'}
                </div>
                <div className="text-3xl font-black text-amber-950">{score}</div>
                <div className="text-[11px] font-bold text-slate-500 mt-1">
                  {lang === 'hi' ? `सर्वश्रेष्ठ: ${highScore}` : `Best: ${highScore}`}
                </div>
              </div>

              {starsEarned > 0 && (
                <div className="flex items-center justify-center gap-1 text-amber-500 mb-4">
                  {Array.from({ length: starsEarned }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  restartGame();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'hi' ? 'फिर से खेलें' : 'Play Again'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 text-center text-xs font-semibold text-slate-500">
        {lang === 'hi'
          ? '👆 स्क्रीन पर टैप करें या कीबोर्ड पर Spacebar दबाएं!'
          : '👆 Tap screen or press Spacebar to flap wings!'}
      </div>
    </div>
  );
};
