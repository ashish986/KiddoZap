import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Star, Heart, Flame, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface FruitSliceProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

interface FruitItem {
  id: number;
  type: 'fruit' | 'bomb';
  emoji: string;
  color: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  radius: number;
  sliced: boolean;
  half1?: { x: number; y: number; vx: number; vy: number; rot: number };
  half2?: { x: number; y: number; vx: number; vy: number; rot: number };
  alpha: number;
}

interface BladePoint {
  x: number;
  y: number;
  time: number;
}

const FRUIT_TYPES = [
  { emoji: '🍉', color: '#EF4444', name: 'Watermelon', radius: 30 },
  { emoji: '🍎', color: '#DC2626', name: 'Apple', radius: 26 },
  { emoji: '🍌', color: '#FBBF24', name: 'Banana', radius: 26 },
  { emoji: '🍊', color: '#F97316', name: 'Orange', radius: 25 },
  { emoji: '🍓', color: '#E11D48', name: 'Strawberry', radius: 22 },
  { emoji: '🍍', color: '#EAB308', name: 'Pineapple', radius: 32 },
];

export const FruitSliceGame: React.FC<FruitSliceProps> = ({ lang, onBack, onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('kiddozap_fruitslice_highscore') || '0', 10);
  });
  const [lives, setLives] = useState<number>(3);
  const [comboText, setComboText] = useState<string | null>(null);

  // Mutable Game Loop State
  const stateRef = useRef({
    fruits: [] as FruitItem[],
    bladeTrail: [] as BladePoint[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number; size: number }[],
    isSwiping: false,
    spawnTimer: 0,
    score: 0,
    lives: 3,
    sliceCountThisSwipe: 0,
    width: 440,
    height: 560,
  });

  // Handle Swipe Interactions
  const updateBlade = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    stateRef.current.bladeTrail.push({ x, y, time: Date.now() });

    // Limit blade trail length
    if (stateRef.current.bladeTrail.length > 12) {
      stateRef.current.bladeTrail.shift();
    }

    // Check collision with fruits
    if (stateRef.current.bladeTrail.length >= 2 && gameState === 'playing') {
      const p1 = stateRef.current.bladeTrail[stateRef.current.bladeTrail.length - 2];
      const p2 = stateRef.current.bladeTrail[stateRef.current.bladeTrail.length - 1];

      stateRef.current.fruits.forEach((fruit) => {
        if (fruit.sliced) return;

        // Line-circle intersection test
        const dist = distToSegment({ x: fruit.x, y: fruit.y }, p1, p2);
        if (dist < fruit.radius) {
          sliceFruit(fruit);
        }
      });
    }
  };

  const distToSegment = (p: { x: number; y: number }, v: { x: number; y: number }, w: { x: number; y: number }) => {
    const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  };

  const sliceFruit = (fruit: FruitItem) => {
    fruit.sliced = true;

    if (fruit.type === 'bomb') {
      sounds.playBuzz();
      stateRef.current.lives -= 1;
      setLives(stateRef.current.lives);

      // Bomb explosion particles
      for (let i = 0; i < 20; i++) {
        stateRef.current.particles.push({
          x: fruit.x,
          y: fruit.y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          color: '#EF4444',
          life: 1.0,
          size: 6,
        });
      }

      if (stateRef.current.lives <= 0) {
        handleGameOver();
      }
      return;
    }

    // Fruit Slice Success
    sounds.playPop(1.5);
    stateRef.current.score += 1;
    stateRef.current.sliceCountThisSwipe += 1;
    setScore(stateRef.current.score);

    // Multi-slice combo banner
    if (stateRef.current.sliceCountThisSwipe >= 3) {
      setComboText(`Combo x${stateRef.current.sliceCountThisSwipe}! 🔥`);
      sounds.playChime(1.4);
      setTimeout(() => setComboText(null), 1000);
    }

    // Create 2 half fragments that burst apart
    fruit.half1 = {
      x: fruit.x - 10,
      y: fruit.y,
      vx: fruit.vx - 3,
      vy: fruit.vy - 1,
      rot: fruit.rot,
    };
    fruit.half2 = {
      x: fruit.x + 10,
      y: fruit.y,
      vx: fruit.vx + 3,
      vy: fruit.vy + 1,
      rot: fruit.rot,
    };

    // Splash particles in fruit color
    for (let i = 0; i < 15; i++) {
      stateRef.current.particles.push({
        x: fruit.x,
        y: fruit.y,
        vx: (Math.random() - 0.5) * 7,
        vy: (Math.random() - 0.5) * 7,
        color: fruit.color,
        life: 1.0,
        size: Math.random() * 5 + 3,
      });
    }
  };

  const spawnFruitWave = () => {
    const isBomb = Math.random() < 0.15;
    const type = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];

    const spawnX = Math.random() * (stateRef.current.width - 120) + 60;
    const targetX = stateRef.current.width / 2 + (Math.random() - 0.5) * 100;
    const vx = (targetX - spawnX) * 0.02;
    const vy = -(Math.random() * 3 + 12.5); // Upward velocity

    stateRef.current.fruits.push({
      id: Date.now() + Math.random(),
      type: isBomb ? 'bomb' : 'fruit',
      emoji: isBomb ? '💣' : type.emoji,
      color: isBomb ? '#475569' : type.color,
      name: isBomb ? 'Bomb' : type.name,
      x: spawnX,
      y: stateRef.current.height + 30,
      vx,
      vy,
      rot: 0,
      vRot: (Math.random() - 0.5) * 0.1,
      radius: isBomb ? 25 : type.radius,
      sliced: false,
      alpha: 1.0,
    });
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const state = stateRef.current;

    const render = () => {
      // 1. Background (Vibrant Wooden Board)
      const grad = ctx.createLinearGradient(0, 0, 0, state.height);
      grad.addColorStop(0, '#78350F');
      grad.addColorStop(1, '#451A03');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, state.width, state.height);

      // Wood Grain subtle lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 2;
      for (let y = 30; y < state.height; y += 45) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(state.width, y);
        ctx.stroke();
      }

      // 2. Spawn Fruits if playing
      if (gameState === 'playing') {
        state.spawnTimer++;
        if (state.spawnTimer > 65) {
          state.spawnTimer = 0;
          spawnFruitWave();
          if (Math.random() < 0.4) spawnFruitWave(); // double wave
        }
      }

      // 3. Update and Render Fruits
      state.fruits.forEach((fruit) => {
        if (!fruit.sliced) {
          fruit.vy += 0.32; // Gravity
          fruit.x += fruit.vx;
          fruit.y += fruit.vy;
          fruit.rot += fruit.vRot;

          // Render Whole Fruit
          ctx.save();
          ctx.translate(fruit.x, fruit.y);
          ctx.rotate(fruit.rot);
          ctx.font = `${fruit.radius * 1.5}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(fruit.emoji, 0, 0);
          ctx.restore();
        } else {
          // Render Sliced Halves
          if (fruit.half1 && fruit.half2) {
            fruit.half1.vy += 0.35;
            fruit.half1.x += fruit.half1.vx;
            fruit.half1.y += fruit.half1.vy;
            fruit.half1.rot -= 0.08;

            fruit.half2.vy += 0.35;
            fruit.half2.x += fruit.half2.vx;
            fruit.half2.y += fruit.half2.vy;
            fruit.half2.rot += 0.08;

            fruit.alpha -= 0.02;

            // Half 1
            ctx.save();
            ctx.globalAlpha = Math.max(0, fruit.alpha);
            ctx.translate(fruit.half1.x, fruit.half1.y);
            ctx.rotate(fruit.half1.rot);
            ctx.font = `${fruit.radius * 1.2}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(fruit.emoji, 0, 0);
            ctx.restore();

            // Half 2
            ctx.save();
            ctx.globalAlpha = Math.max(0, fruit.alpha);
            ctx.translate(fruit.half2.x, fruit.half2.y);
            ctx.rotate(fruit.half2.rot);
            ctx.font = `${fruit.radius * 1.2}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(fruit.emoji, 0, 0);
            ctx.restore();
          }
        }
      });

      // Filter out off-screen fruits
      state.fruits = state.fruits.filter(
        (f) => f.y < state.height + 60 && (!f.sliced || f.alpha > 0)
      );

      // 4. Update & Render Particles
      state.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life -= 0.035;

        if (p.life > 0) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      });
      state.particles = state.particles.filter((p) => p.life > 0);

      // 5. Render Blade Swipe Trail
      const now = Date.now();
      state.bladeTrail = state.bladeTrail.filter((pt) => now - pt.time < 180);

      if (state.bladeTrail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(state.bladeTrail[0].x, state.bladeTrail[0].y);
        for (let i = 1; i < state.bladeTrail.length; i++) {
          ctx.lineTo(state.bladeTrail[i].x, state.bladeTrail[i].y);
        }
        ctx.strokeStyle = '#FDE047'; // Glowing Yellow Blade
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#EAB308';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  const handleGameOver = () => {
    sounds.playBuzz();
    setGameState('gameover');

    const finalScore = stateRef.current.score;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('kiddozap_fruitslice_highscore', finalScore.toString());
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }

    const earned = Math.min(3, Math.floor(finalScore / 10) + (finalScore >= 3 ? 1 : 0));
    onGameComplete(earned, finalScore);
  };

  const startGame = () => {
    sounds.playPop();
    stateRef.current.score = 0;
    stateRef.current.lives = 3;
    stateRef.current.fruits = [];
    stateRef.current.particles = [];
    stateRef.current.bladeTrail = [];
    setScore(0);
    setLives(3);
    setGameState('playing');
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
            <span>🍉</span>
            <span>{lang === 'hi' ? 'फ्रूट स्लाइस उन्माद' : 'Fruit Slice Frenzy'}</span>
          </h2>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 text-xs font-black text-amber-900">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>{highScore}</span>
        </div>
      </div>

      {/* Lives & Score Bar */}
      <div className="w-full max-w-[380px] flex items-center justify-between bg-white px-4 py-2 rounded-2xl border border-amber-200 shadow-xs mb-3">
        {/* Lives */}
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((heart) => (
            <Heart
              key={heart}
              className={`w-5 h-5 transition-all ${
                heart <= lives
                  ? 'text-rose-500 fill-rose-500 animate-pulse'
                  : 'text-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Current Score */}
        <div className="flex items-center gap-1.5 text-sm font-black text-amber-900 font-display">
          <span>{lang === 'hi' ? 'स्कोर:' : 'Score:'}</span>
          <span className="text-xl text-emerald-600">{score}</span>
        </div>
      </div>

      {/* Game Canvas Container */}
      <div
        className="relative w-full max-w-[380px] aspect-[440/560] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 select-none touch-none cursor-crosshair bg-amber-950"
        onMouseDown={() => {
          stateRef.current.isSwiping = true;
          stateRef.current.sliceCountThisSwipe = 0;
        }}
        onMouseUp={() => {
          stateRef.current.isSwiping = false;
        }}
        onMouseMove={(e) => {
          if (stateRef.current.isSwiping || gameState === 'playing') {
            updateBlade(e.clientX, e.clientY);
          }
        }}
        onTouchStart={(e) => {
          stateRef.current.isSwiping = true;
          stateRef.current.sliceCountThisSwipe = 0;
          if (e.touches[0]) {
            updateBlade(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchEnd={() => {
          stateRef.current.isSwiping = false;
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) {
            updateBlade(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
      >
        <canvas
          ref={canvasRef}
          width={440}
          height={560}
          className="w-full h-full block"
        />

        {/* Combo Multiplier Text */}
        {comboText && (
          <div className="absolute top-6 left-0 right-0 flex justify-center pointer-events-none animate-bounce">
            <span className="px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-sm shadow-xl">
              {comboText}
            </span>
          </div>
        )}

        {/* Ready Overlay */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-lg animate-bounce mb-3 border-2 border-white">
              🍉
            </div>
            <h3 className="text-2xl font-black font-display drop-shadow-md">
              {lang === 'hi' ? 'स्वाइप करें और फल काटें!' : 'Swipe to Slice Fruits!'}
            </h3>
            <p className="text-xs text-amber-100 font-bold mt-1 mb-5 max-w-[240px]">
              {lang === 'hi'
                ? 'उड़ते फलों पर उंगली चलाएं, लेकिन बम 💣 से बचें!'
                : 'Drag your finger or mouse to slice fruits. Dodge bombs 💣!'}
            </p>
            <button
              onClick={startGame}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-900 font-black text-base shadow-xl active:scale-95 transition-all"
            >
              {lang === 'hi' ? 'काटना शुरू करें! 🔪' : 'Start Slicing! 🔪'}
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white animate-fade-in">
            <div className="bg-white text-slate-800 rounded-3xl p-5 w-full max-w-[280px] shadow-2xl border-4 border-amber-300">
              <h3 className="text-xl font-black text-amber-900 font-display">
                {lang === 'hi' ? 'खेल समाप्त! 💥' : 'Game Over! 💥'}
              </h3>

              <div className="my-3 py-2 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="text-xs font-bold text-amber-800">
                  {lang === 'hi' ? 'कटे हुए फल' : 'Fruits Sliced'}
                </div>
                <div className="text-3xl font-black text-amber-950">{score}</div>
                <div className="text-[11px] font-bold text-slate-500 mt-1">
                  {lang === 'hi' ? `सर्वश्रेष्ठ: ${highScore}` : `Best: ${highScore}`}
                </div>
              </div>

              <button
                onClick={startGame}
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
          ? '👆 फलों को काटने के लिए स्क्रीन पर स्वाइप करें!'
          : '👆 Swipe across screen or drag mouse to slice!'}
      </div>
    </div>
  );
};
