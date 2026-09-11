import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Play, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface MotoX3MProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

export const MotoX3MGame: React.FC<MotoX3MProps> = ({ lang, onBack, onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover' | 'victory'>('ready');
  const [score, setScore] = useState<number>(0);
  const [flips, setFlips] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('kiddozap_motox_high') || 0);
    } catch {
      return 0;
    }
  });

  const stateRef = useRef({
    bike: {
      x: 60,
      y: 350,
      vx: 0,
      vy: 0,
      angle: 0,
      angularVelocity: 0,
      radius: 14,
    },
    gas: false,
    brake: false,
    tiltLeft: false,
    tiltRight: false,
    totalRotation: 0,
    flipsCount: 0,
    cameraX: 0,
    distance: 0,
    finishX: 2600,
    score: 0,
  });

  // Procedural 2D Terrain Height generator
  const getGroundY = (worldX: number) => {
    // Base rolling hills with ramps and smooth landings
    const base = 380;
    const hill1 = Math.sin(worldX * 0.004) * 35;
    const hill2 = Math.sin(worldX * 0.012) * 18;

    // Smooth stunt ramps with curved takeoffs and gentle landing transitions
    let ramp = 0;
    const makeRamp = (start: number, peak: number, end: number, height: number) => {
      if (worldX >= start && worldX <= peak) {
        const t = (worldX - start) / (peak - start);
        return -Math.sin(t * (Math.PI / 2)) * height;
      } else if (worldX > peak && worldX <= end) {
        const t = (worldX - peak) / (end - peak);
        return -(1 - Math.sin(t * (Math.PI / 2))) * height;
      }
      return 0;
    };

    ramp += makeRamp(400, 580, 850, 75);
    ramp += makeRamp(1100, 1300, 1600, 90);
    ramp += makeRamp(1900, 2100, 2400, 85);

    return base + hill1 + hill2 + ramp;
  };

  const getGroundSlope = (worldX: number) => {
    const delta = 4;
    const y1 = getGroundY(worldX - delta);
    const y2 = getGroundY(worldX + delta);
    return Math.atan2(y2 - y1, delta * 2);
  };

  const startGame = () => {
    sounds.tap(1.2);
    const s = stateRef.current;
    s.bike = {
      x: 60,
      y: 320,
      vx: 0,
      vy: 0,
      angle: 0,
      angularVelocity: 0,
      radius: 14,
    };
    s.gas = false;
    s.brake = false;
    s.tiltLeft = false;
    s.tiltRight = false;
    s.totalRotation = 0;
    s.flipsCount = 0;
    s.cameraX = 0;
    s.distance = 0;
    s.score = 0;

    setScore(0);
    setFlips(0);
    setGameState('playing');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === 'ArrowUp' || e.key === 'w') s.gas = true;
      if (e.key === 'ArrowDown' || e.key === 's') s.brake = true;
      if (e.key === 'ArrowLeft' || e.key === 'a') s.tiltLeft = true;
      if (e.key === 'ArrowRight' || e.key === 'd') s.tiltRight = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === 'ArrowUp' || e.key === 'w') s.gas = false;
      if (e.key === 'ArrowDown' || e.key === 's') s.brake = false;
      if (e.key === 'ArrowLeft' || e.key === 'a') s.tiltLeft = false;
      if (e.key === 'ArrowRight' || e.key === 'd') s.tiltRight = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Main Physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const s = stateRef.current;
      const b = s.bike;
      const W = canvas.width;
      const H = canvas.height;

      if (gameState === 'playing') {
        // Apply Gravity
        b.vy += 0.42;

        // Apply Player Accelerations
        if (s.gas) {
          b.vx += Math.cos(b.angle) * 0.65;
          b.vy += Math.sin(b.angle) * 0.4;
        }
        if (s.brake) {
          b.vx *= 0.94;
        }

        // Tilt controls (Stunt rotations in air)
        if (s.tiltLeft) b.angularVelocity -= 0.007;
        if (s.tiltRight) b.angularVelocity += 0.007;

        // Friction
        b.vx *= 0.992;
        b.angularVelocity *= 0.96;

        // Update Position
        b.x += b.vx;
        b.y += b.vy;
        b.angle += b.angularVelocity;

        // Check flips in air
        s.totalRotation += b.angularVelocity;
        if (Math.abs(s.totalRotation) >= Math.PI * 2) {
          s.flipsCount += 1;
          s.totalRotation = 0;
          sounds.correct();
          confetti({ particleCount: 25, spread: 50 });
          setFlips(s.flipsCount);
        }

        // Ground collision
        const groundY = getGroundY(b.x);
        const slope = getGroundSlope(b.x);

        if (b.y >= groundY - b.radius) {
          // Bike is on ground
          b.y = groundY - b.radius;
          b.vy = 0;

          // Align with terrain slope
          const angleDiff = slope - b.angle;
          b.angle += angleDiff * 0.28;

          // Check for head crash (only if landing sharply inverted)
          const normAngle = ((b.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          if (normAngle > Math.PI * 0.72 && normAngle < Math.PI * 1.28) {
            // Severe upside down head crash on ground
            sounds.incorrect();
            setGameState('gameover');
            const finalScore = Math.floor(b.x) + s.flipsCount * 250;
            setHighScore((prev) => Math.max(prev, finalScore));
            try {
              localStorage.setItem('kiddozap_motox_high', String(Math.max(highScore, finalScore)));
            } catch {}
            onGameComplete(finalScore > 1500 ? 3 : finalScore > 800 ? 2 : 1, finalScore);
          }
        }

        // Camera follow
        s.cameraX += (b.x - W * 0.3 - s.cameraX) * 0.12;
        s.score = Math.floor(b.x) + s.flipsCount * 250;
        setScore(s.score);

        // Check victory at finish line
        if (b.x >= s.finishX) {
          sounds.complete();
          confetti({ particleCount: 80, spread: 90 });
          setGameState('victory');
          const finalScore = s.score + 500;
          setHighScore((prev) => Math.max(prev, finalScore));
          try {
            localStorage.setItem('kiddozap_motox_high', String(Math.max(highScore, finalScore)));
          } catch {}
          onGameComplete(3, finalScore);
        }
      }

      // ---------------- RENDER ----------------
      ctx.clearRect(0, 0, W, H);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, '#f97316');
      skyGrad.addColorStop(0.5, '#fbbf24');
      skyGrad.addColorStop(1, '#fef08a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Distant mountains
      ctx.fillStyle = 'rgba(217, 119, 6, 0.4)';
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 30) {
        const mx = x + s.cameraX * 0.2;
        const my = 260 + Math.sin(mx * 0.008) * 50;
        ctx.lineTo(x, my);
      }
      ctx.lineTo(W, H);
      ctx.fill();

      // Terrain Draw
      ctx.save();
      ctx.translate(-s.cameraX, 0);

      // Ground path
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.moveTo(s.cameraX - 40, H);
      for (let wx = s.cameraX - 40; wx <= s.cameraX + W + 40; wx += 15) {
        ctx.lineTo(wx, getGroundY(wx));
      }
      ctx.lineTo(s.cameraX + W + 40, H);
      ctx.closePath();
      ctx.fill();

      // Dirt bottom layer
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Finish Banner
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(s.finishX, getGroundY(s.finishX) - 120, 10, 120);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(s.finishX + 10, getGroundY(s.finishX) - 120, 60, 35);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('FINISH', s.finishX + 16, getGroundY(s.finishX) - 98);

      // ---------------- DRAW MOTORBIKE ----------------
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);

      // Wheels
      const wheelDist = 20;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-wheelDist, 8, 8, 0, Math.PI * 2);
      ctx.arc(wheelDist, 8, 8, 0, Math.PI * 2);
      ctx.fill();

      // Bike Chassis / Frame
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-wheelDist, 8);
      ctx.lineTo(0, -6);
      ctx.lineTo(wheelDist, 8);
      ctx.moveTo(0, -6);
      ctx.lineTo(8, -14); // Handlebars
      ctx.stroke();

      // Motor Exhaust Fire if Gas
      if (s.gas) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-wheelDist - 4, 6);
        ctx.lineTo(-wheelDist - 18, 9);
        ctx.lineTo(-wheelDist - 4, 12);
        ctx.fill();
      }

      // Stunt Rider Body
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(-6, -20, 10, 14);

      // Helmet
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(0, -26, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(2, -28, 5, 4); // Visor

      ctx.restore(); // Bike restore
      ctx.restore(); // Camera restore

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div className="w-full h-full flex flex-col items-center select-none overflow-hidden pb-1">
      {/* Header Bar */}
      <div className="w-full max-w-[420px] flex items-center justify-between mb-2 bg-white/95 backdrop-blur rounded-2xl p-2 border border-amber-200 shadow-xs">
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
          <div className="px-2.5 py-0.5 bg-red-600 text-white font-black text-xs rounded-lg shadow-xs">
            <span>🏍️ {score}m</span>
          </div>

          <div className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs rounded-lg">
            <span>🌀 {flips} Flips</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg text-xs font-black">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>{highScore}</span>
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
      <div className="relative w-full max-w-[420px] aspect-[420/520] bg-slate-900 rounded-3xl overflow-hidden shadow-xl border-4 border-amber-500">
        <canvas ref={canvasRef} width={420} height={520} className="w-full h-full block" />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-red-500 to-amber-500 flex items-center justify-center text-4xl shadow-xl mb-3 animate-bounce">
              🏍️
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-display text-amber-300">
              {lang === 'hi' ? 'मोटो X3M बाइक रेसर' : 'Moto X3M Bike Stunt'}
            </h3>
            <p className="text-xs text-slate-200 font-semibold max-w-xs mt-1 mb-5">
              {lang === 'hi'
                ? 'बाइक को दौड़ाएं, हवा में कलाबाजी (Flips) खाएं और सुरक्षित फिनिश लाइन तक पहुंचें!'
                : 'Accelerate through dirt ramps, perform high-flying backflips, and stick clean landings!'}
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-amber-500 text-white font-black rounded-2xl text-sm shadow-xl active:scale-95 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{lang === 'hi' ? 'स्टंट शुरू करें' : 'Start Moto Stunt'}</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <span className="text-5xl mb-2">💥🏍️</span>
            <h3 className="text-2xl font-black font-display text-rose-400">
              {lang === 'hi' ? 'बाइक पलट गई!' : 'Stunt Crash!'}
            </h3>
            <div className="bg-white/10 rounded-2xl p-4 my-3 w-full max-w-xs border border-white/20">
              <p className="text-xs text-slate-300 font-bold">{lang === 'hi' ? 'स्कोर व कलाबाजी' : 'Score & Flips'}</p>
              <p className="text-3xl font-black text-amber-300 my-1 font-display">{score}</p>
              <p className="text-xs text-slate-300">
                {lang === 'hi' ? `सर्वश्रेष्ठ: ${highScore}` : `Best: ${highScore}`}
              </p>
            </div>
            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={startGame}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-amber-500 text-white font-black text-xs rounded-2xl active:scale-95 shadow-md"
              >
                {lang === 'hi' ? 'पुनः प्रयास' : 'Try Again'}
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

        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <span className="text-5xl mb-2">🏆🏁</span>
            <h3 className="text-2xl font-black font-display text-emerald-400">
              {lang === 'hi' ? 'जीत गए! चैंपियन!' : 'Victory Champion!'}
            </h3>
            <div className="bg-white/10 rounded-2xl p-4 my-3 w-full max-w-xs border border-white/20">
              <p className="text-xs text-slate-300 font-bold">{lang === 'hi' ? 'विजय स्कोर' : 'Victory Score'}</p>
              <p className="text-3xl font-black text-amber-300 my-1 font-display">{score}</p>
              <p className="text-xs text-slate-300">
                {lang === 'hi' ? `फ्लिप्स: ${flips}` : `Stunt Flips: ${flips}`}
              </p>
            </div>
            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={startGame}
                className="flex-1 py-3 bg-emerald-500 text-white font-black text-xs rounded-2xl active:scale-95 shadow-md"
              >
                {lang === 'hi' ? 'फिर से खेलें' : 'Race Again'}
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

      {/* Touch Action Controls for Mobile */}
      <div className="w-full max-w-[420px] flex items-center justify-between gap-2 mt-2 px-1">
        {/* Tilt Left */}
        <button
          onMouseDown={() => (stateRef.current.tiltLeft = true)}
          onMouseUp={() => (stateRef.current.tiltLeft = false)}
          onTouchStart={() => (stateRef.current.tiltLeft = true)}
          onTouchEnd={() => (stateRef.current.tiltLeft = false)}
          className="flex-1 py-3 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-black text-sm shadow-md active:translate-y-1"
        >
          🔄 {lang === 'hi' ? 'झुकाव बाएं' : 'Tilt L'}
        </button>

        {/* Tilt Right */}
        <button
          onMouseDown={() => (stateRef.current.tiltRight = true)}
          onMouseUp={() => (stateRef.current.tiltRight = false)}
          onTouchStart={() => (stateRef.current.tiltRight = true)}
          onTouchEnd={() => (stateRef.current.tiltRight = false)}
          className="flex-1 py-3 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-black text-sm shadow-md active:translate-y-1"
        >
          {lang === 'hi' ? 'झुकाव दाएं' : 'Tilt R'} 🔁
        </button>

        {/* Brake */}
        <button
          onMouseDown={() => (stateRef.current.brake = true)}
          onMouseUp={() => (stateRef.current.brake = false)}
          onTouchStart={() => (stateRef.current.brake = true)}
          onTouchEnd={() => (stateRef.current.brake = false)}
          className="flex-1 py-3 rounded-2xl bg-slate-200 text-slate-800 font-black text-sm shadow-md active:translate-y-1"
        >
          🛑 {lang === 'hi' ? 'ब्रेक' : 'Brake'}
        </button>

        {/* Gas */}
        <button
          onMouseDown={() => (stateRef.current.gas = true)}
          onMouseUp={() => (stateRef.current.gas = false)}
          onTouchStart={() => (stateRef.current.gas = true)}
          onTouchEnd={() => (stateRef.current.gas = false)}
          className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-amber-500 text-white font-black text-sm shadow-md active:scale-95"
        >
          ⚡ {lang === 'hi' ? 'रेस' : 'GAS!'}
        </button>
      </div>
    </div>
  );
};
