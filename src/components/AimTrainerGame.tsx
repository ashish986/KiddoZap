import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Target, Zap, Clock, Award, Crosshair } from 'lucide-react';
import { Language } from '../types';

interface AimTrainerGameProps {
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
  lang?: Language;
}

interface TargetCircle {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  createdAt: number;
  lifespan: number;
  color: string;
}

export default function AimTrainerGame({ onBack, onGameComplete, lang = 'en' }: AimTrainerGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<'gridshot' | 'precision' | 'reaction'>('gridshot');
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [soundOn, setSoundOn] = useState(true);
  const [reactionState, setReactionState] = useState<'wait' | 'ready' | 'clicked'>('wait');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('kiddozap_aim_high') || '0', 10);
    } catch {
      return 0;
    }
  });

  const stateRef = useRef({
    targets: [] as TargetCircle[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; alpha: number }[],
    score: 0,
    combo: 1,
    hits: 0,
    misses: 0,
    targetIdSeq: 1,
    reactionStart: 0,
    reactionTimeout: null as any,
  });

  const spawnRandomTarget = (W: number, H: number, lifespan = 1600): TargetCircle => {
    const s = stateRef.current;
    const padding = 50;
    const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#a855f7'];
    return {
      id: s.targetIdSeq++,
      x: padding + Math.random() * (W - padding * 2),
      y: padding + Math.random() * (H - padding * 2),
      radius: mode === 'precision' ? 24 : 32,
      maxRadius: mode === 'precision' ? 24 : 32,
      createdAt: Date.now(),
      lifespan,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  };

  const startGame = () => {
    if (soundOn) sounds.tap(1.2);
    const s = stateRef.current;
    s.score = 0;
    s.combo = 1;
    s.hits = 0;
    s.misses = 0;
    s.particles = [];
    s.targets = [];

    setScore(0);
    setCombo(1);
    setHits(0);
    setMisses(0);
    setTimeLeft(30);

    if (mode === 'reaction') {
      setReactionState('wait');
      setReactionTime(null);
      setGameState('playing');
      const delay = 1500 + Math.random() * 2500;
      if (s.reactionTimeout) clearTimeout(s.reactionTimeout);
      s.reactionTimeout = setTimeout(() => {
        setReactionState('ready');
        s.reactionStart = performance.now();
      }, delay);
      return;
    }

    // Spawn 3 initial targets for gridshot / precision
    const W = 600;
    const H = 400;
    for (let i = 0; i < 3; i++) {
      s.targets.push(spawnRandomTarget(W, H, mode === 'precision' ? 1400 : 2000));
    }

    setGameState('playing');
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing' || mode === 'reaction') return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, mode]);

  const finishGame = () => {
    const s = stateRef.current;
    if (soundOn) sounds.complete();
    setGameState('gameover');
    const finalScore = s.score;
    setHighScore((prev) => Math.max(prev, finalScore));
    try {
      localStorage.setItem('kiddozap_aim_high', String(Math.max(highScore, finalScore)));
    } catch {}
    confetti({ particleCount: 60, spread: 70 });
    onGameComplete(finalScore >= 3000 ? 3 : finalScore >= 1500 ? 2 : 1, finalScore);
  };

  const handleReactionClick = () => {
    const s = stateRef.current;
    if (reactionState === 'wait') {
      // Clicked too early
      if (soundOn) sounds.incorrect();
      clearTimeout(s.reactionTimeout);
      setReactionState('wait');
      alert(lang === 'hi' ? 'बहुत जल्दी! हरे रंग का इंतजार करें!' : 'Too early! Wait for GREEN!');
      startGame();
    } else if (reactionState === 'ready') {
      const elapsed = Math.round(performance.now() - s.reactionStart);
      setReactionTime(elapsed);
      setReactionState('clicked');
      if (soundOn) sounds.chime(1.5);
      const points = Math.max(100, 1000 - elapsed * 2);
      s.score = points;
      setScore(points);
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  // Handle canvas click / touch on target
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing' || mode === 'reaction') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const s = stateRef.current;
    let hitIndex = -1;

    // Check hit on targets (from top to bottom)
    for (let i = s.targets.length - 1; i >= 0; i--) {
      const t = s.targets[i];
      const dist = Math.hypot(clickX - t.x, clickY - t.y);
      if (dist <= t.radius) {
        hitIndex = i;
        break;
      }
    }

    if (hitIndex >= 0) {
      const target = s.targets[hitIndex];
      // Target hit!
      s.hits++;
      s.combo = Math.min(8, s.combo + 1);
      const points = 100 * s.combo;
      s.score += points;

      setHits(s.hits);
      setCombo(s.combo);
      setScore(s.score);

      if (soundOn) sounds.tap(1.2 + s.combo * 0.1);

      // Hit particles
      for (let p = 0; p < 12; p++) {
        s.particles.push({
          x: target.x,
          y: target.y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          color: target.color,
          alpha: 1,
        });
      }

      // Remove target and spawn replacement
      s.targets.splice(hitIndex, 1);
      s.targets.push(spawnRandomTarget(canvas.width, canvas.height, mode === 'precision' ? 1400 : 2000));
    } else {
      // Miss!
      s.misses++;
      s.combo = 1;
      setMisses(s.misses);
      setCombo(1);
      if (soundOn) sounds.incorrect();
    }
  };

  // Main Canvas Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      const s = stateRef.current;
      const now = Date.now();

      // Dark Tactical Background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, W, H);

      // Crosshair Grid Lines
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      if (gameState === 'playing' && mode !== 'reaction') {
        // Update Targets (shrink and expire in precision mode)
        for (let i = s.targets.length - 1; i >= 0; i--) {
          const t = s.targets[i];
          const age = now - t.createdAt;

          if (mode === 'precision') {
            const ratio = 1 - age / t.lifespan;
            t.radius = Math.max(6, t.maxRadius * ratio);
            if (age >= t.lifespan) {
              // Missed target timeout
              s.targets.splice(i, 1);
              s.misses++;
              s.combo = 1;
              setMisses(s.misses);
              setCombo(1);
              s.targets.push(spawnRandomTarget(W, H, 1400));
              continue;
            }
          }

          // Draw Bullseye Target
          ctx.save();
          ctx.translate(t.x, t.y);

          // Outer Ring
          ctx.beginPath();
          ctx.arc(0, 0, t.radius, 0, Math.PI * 2);
          ctx.fillStyle = t.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Middle Ring
          ctx.beginPath();
          ctx.arc(0, 0, t.radius * 0.65, 0, Math.PI * 2);
          ctx.fillStyle = '#0f172a';
          ctx.fill();

          // Center Bullseye Dot
          ctx.beginPath();
          ctx.arc(0, 0, t.radius * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = '#f43f5e';
          ctx.fill();

          ctx.restore();
        }

        // Draw Particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const p = s.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.04;
          if (p.alpha <= 0) {
            s.particles.splice(i, 1);
            continue;
          }

          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState, mode]);

  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 100;

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col bg-slate-950 text-white select-none">
      {/* Top Header HUD */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 z-10">
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

        {/* Stats Display */}
        {mode !== 'reaction' ? (
          <div className="flex items-center gap-4">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                {lang === 'hi' ? 'स्कोर' : 'Score'}
              </span>
              <span className="text-lg font-black text-rose-400 leading-none">{score}</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                {lang === 'hi' ? 'सटीकता' : 'Accuracy'}
              </span>
              <span className="text-sm font-black text-emerald-400 leading-none">{accuracy}%</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                {lang === 'hi' ? 'समय' : 'Time'}
              </span>
              <span className="text-sm font-black text-amber-400 leading-none">{timeLeft}s</span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
              {lang === 'hi' ? 'रिफ्लेक्स टेस्ट' : 'Reflex Speed Test'}
            </span>
          </div>
        )}

        {/* Audio & Restart */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
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

      {/* Main Canvas Viewport */}
      <div className="flex-1 min-h-0 relative flex items-center justify-center bg-slate-950 overflow-hidden cursor-crosshair">
        {mode === 'reaction' && gameState === 'playing' ? (
          <div
            onClick={handleReactionClick}
            className={`w-full h-full flex flex-col items-center justify-center p-6 transition-colors duration-150 cursor-pointer ${
              reactionState === 'ready'
                ? 'bg-emerald-600'
                : reactionState === 'clicked'
                ? 'bg-blue-900'
                : 'bg-rose-950'
            }`}
          >
            {reactionState === 'wait' && (
              <div className="text-center animate-pulse">
                <Clock className="w-16 h-16 text-rose-400 mx-auto mb-3" />
                <h3 className="text-2xl font-black uppercase tracking-wider">
                  {lang === 'hi' ? 'हरे रंग की प्रतीक्षा करें...' : 'WAIT FOR GREEN...'}
                </h3>
                <p className="text-xs text-rose-300 mt-2 font-semibold">
                  {lang === 'hi' ? 'अभी क्लिक न करें!' : 'Do NOT tap yet!'}
                </p>
              </div>
            )}

            {reactionState === 'ready' && (
              <div className="text-center">
                <Zap className="w-20 h-20 text-white mx-auto mb-2 animate-bounce" />
                <h3 className="text-4xl font-black text-white uppercase tracking-wider">
                  {lang === 'hi' ? 'अब टैप करें!' : 'TAP NOW!'}
                </h3>
              </div>
            )}

            {reactionState === 'clicked' && reactionTime && (
              <div className="text-center">
                <Award className="w-16 h-16 text-amber-400 mx-auto mb-2" />
                <h3 className="text-4xl font-black text-amber-400 font-display">
                  {reactionTime} ms
                </h3>
                <p className="text-sm text-slate-300 font-bold mt-2">
                  {reactionTime < 220
                    ? lang === 'hi'
                      ? '⚡ सुपरमैन रिफ्लेक्स!'
                      : '⚡ Superhuman Reflexes!'
                    : reactionTime < 280
                    ? lang === 'hi'
                      ? '🎯 उत्कृष्ट प्रतिक्रिया!'
                      : '🎯 Pro Esports Reflexes!'
                    : lang === 'hi'
                    ? '👍 अच्छा प्रयास!'
                    : '👍 Great Effort!'}
                </p>
                <button
                  onClick={startGame}
                  className="mt-5 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm"
                >
                  {lang === 'hi' ? 'फिर से टेस्ट करें' : 'Test Again'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            onPointerDown={handlePointerDown}
            className="w-full h-full max-w-2xl object-contain touch-none"
          />
        )}

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-rose-500/30 animate-pulse">
              🎯
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-rose-400 mb-1 tracking-wider uppercase font-display">
              {lang === 'hi' ? 'एम रिफ्लेक्स स्नाइपर' : 'Aim Reflex Sniper Pro'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs mb-4 leading-relaxed">
              {lang === 'hi'
                ? 'स्क्रीन पर आने वाले निशानों पर बिजली की गति से टैप करें और अपना रिफ्लेक्स रिकॉर्ड बनाएं!'
                : 'Pop rapid targets as fast as you can to build crazy combo multipliers!'}
            </p>

            {/* Mode Selectors */}
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setMode('gridshot')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border ${
                  mode === 'gridshot'
                    ? 'bg-rose-500 text-white border-rose-300 shadow-md'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                Gridshot (30s)
              </button>
              <button
                onClick={() => setMode('precision')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border ${
                  mode === 'precision'
                    ? 'bg-rose-500 text-white border-rose-300 shadow-md'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                Precision
              </button>
              <button
                onClick={() => setMode('reaction')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border ${
                  mode === 'reaction'
                    ? 'bg-rose-500 text-white border-rose-300 shadow-md'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                Reflex MS Test
              </button>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-black text-base transition-all active:scale-95 shadow-xl shadow-rose-500/40 uppercase tracking-wider"
            >
              {lang === 'hi' ? '▶ चैलेंज शुरू करें' : '▶ Start Aim Challenge'}
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && mode !== 'reaction' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-2xl mb-2">
              🏆
            </div>
            <h2 className="text-2xl font-black text-white mb-1 font-display">
              {lang === 'hi' ? 'चैलेंज पूरा!' : 'Challenge Completed!'}
            </h2>
            <div className="text-3xl font-black text-rose-400 mb-1">{score} Pts</div>
            <div className="flex gap-4 text-xs text-slate-300 mb-4">
              <span>🎯 Hits: {hits}</span>
              <span>⚡ Accuracy: {accuracy}%</span>
              <span>⭐ Best: {highScore}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-sm transition-all active:scale-95 shadow-md shadow-rose-500/30"
              >
                {lang === 'hi' ? 'फिर से खेलें' : 'Play Again'}
              </button>
              <button
                onClick={onBack}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 active:scale-95"
              >
                {lang === 'hi' ? 'मेन्यू' : 'Menu'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
