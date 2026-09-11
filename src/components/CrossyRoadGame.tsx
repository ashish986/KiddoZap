import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Play } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface CrossyRoadProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

type LaneType = 'grass' | 'road' | 'river' | 'train';

interface Lane {
  id: number;
  yIndex: number;
  type: LaneType;
  speed: number;
  direction: 1 | -1;
  color: string;
  items: { x: number; width: number; type: string }[];
}

export const CrossyRoadGame: React.FC<CrossyRoadProps> = ({ lang, onBack, onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('kiddozap_crossy_high') || 0);
    } catch {
      return 0;
    }
  });

  const stateRef = useRef({
    chicken: {
      gridX: 4,
      gridY: 0,
      animX: 4,
      animY: 0,
      targetY: 0,
      hopAnim: 0,
    },
    cameraY: 0,
    maxRowReached: 0,
    lanes: [] as Lane[],
    score: 0,
    coins: 0,
    nextLaneY: 0,
  });

  const GRID_COLS = 9;
  const CELL_SIZE = 44;

  const generateLane = (yIndex: number): Lane => {
    if (yIndex <= 4) {
      return {
        id: yIndex,
        yIndex,
        type: 'grass',
        speed: 0,
        direction: 1,
        color: '#4ade80',
        items: [],
      };
    }

    const rand = Math.random();
    if (rand < 0.38) {
      // Grass / Safe zone
      return {
        id: yIndex,
        yIndex,
        type: 'grass',
        speed: 0,
        direction: 1,
        color: '#4ade80',
        items: Math.random() > 0.7 ? [{ x: Math.floor(Math.random() * GRID_COLS), width: 1, type: 'tree' }] : [],
      };
    } else if (rand < 0.75) {
      // Road with cars
      const dir = Math.random() > 0.5 ? 1 : -1;
      const speed = 0.8 + Math.min(yIndex * 0.03, 1.2) + Math.random() * 0.5;
      const carCount = Math.floor(Math.random() * 2) + 1;
      const items = [];
      for (let i = 0; i < carCount; i++) {
        items.push({
          x: (i * (GRID_COLS / carCount) + Math.random() * 1.5) % GRID_COLS,
          width: 1.5,
          type: 'car',
        });
      }
      return {
        id: yIndex,
        yIndex,
        type: 'road',
        speed,
        direction: dir,
        color: '#334155',
        items,
      };
    } else {
      // River with floating logs
      const dir = Math.random() > 0.5 ? 1 : -1;
      const speed = 0.8 + Math.random() * 0.6;
      const logCount = 2;
      const items = [];
      for (let i = 0; i < logCount; i++) {
        items.push({
          x: i * 4.5,
          width: 2.5,
          type: 'log',
        });
      }
      return {
        id: yIndex,
        yIndex,
        type: 'river',
        speed,
        direction: dir,
        color: '#0284c7',
        items,
      };
    }
  };

  const moveChicken = (dx: number, dy: number) => {
    if (gameState !== 'playing') return;
    const s = stateRef.current;
    let newX = Math.max(0, Math.min(GRID_COLS - 1, s.chicken.gridX + dx));
    const newY = Math.max(0, s.chicken.gridY + dy);

    // If moving onto grass or road, snap to nearest integer column
    const targetLane = s.lanes.find((l) => l.yIndex === newY);
    if (targetLane && targetLane.type !== 'river') {
      newX = Math.round(newX);
    }

    // Can't move into trees
    if (targetLane && targetLane.type === 'grass') {
      const treeHit = targetLane.items.some((it) => it.type === 'tree' && Math.round(it.x) === newX);
      if (treeHit) {
        sounds.tap(0.6);
        return;
      }
    }

    sounds.tap(1.3);
    s.chicken.gridX = newX;
    s.chicken.gridY = newY;
    s.chicken.hopAnim = 1.0;

    if (newY > s.maxRowReached) {
      s.maxRowReached = newY;
      s.score = newY;
      setScore(s.score);
    }
  };

  const startGame = () => {
    sounds.tap(1.1);
    const s = stateRef.current;
    s.chicken.gridX = 4;
    s.chicken.gridY = 0;
    s.chicken.animX = 4;
    s.chicken.animY = 0;
    s.cameraY = 0;
    s.maxRowReached = 0;
    s.score = 0;

    // Generate first 20 lanes
    const initLanes: Lane[] = [];
    for (let i = 0; i < 25; i++) {
      initLanes.push(generateLane(i));
    }
    s.lanes = initLanes;
    s.nextLaneY = 25;

    setScore(0);
    setGameState('playing');
  };

  // Touch and Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        moveChicken(0, 1);
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        moveChicken(0, -1);
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') moveChicken(-1, 0);
      if (e.key === 'ArrowRight' || e.key === 'd') moveChicken(1, 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const s = stateRef.current;
      const W = canvas.width;
      const H = canvas.height;

      if (gameState === 'playing') {
        // Smooth camera follow chicken
        s.cameraY += (s.chicken.gridY * CELL_SIZE - s.cameraY) * 0.1;
        s.chicken.animX += (s.chicken.gridX - s.chicken.animX) * 0.25;
        s.chicken.animY += (s.chicken.gridY - s.chicken.animY) * 0.25;

        if (s.chicken.hopAnim > 0) s.chicken.hopAnim -= 0.12;

        // Add more lanes as player advances
        while (s.nextLaneY < s.chicken.gridY + 16) {
          s.lanes.push(generateLane(s.nextLaneY));
          s.nextLaneY++;
        }

        // Update items in lanes
        s.lanes.forEach((lane) => {
          if (lane.speed > 0) {
            lane.items.forEach((item) => {
              item.x += (lane.speed * lane.direction * 0.04);
              if (item.x > GRID_COLS + 2) item.x = -item.width - 1;
              if (item.x < -item.width - 2) item.x = GRID_COLS + 1;
            });
          }
        });

        // Collision Check with current lane
        const currentLane = s.lanes.find((l) => l.yIndex === s.chicken.gridY);
        if (currentLane) {
          if (currentLane.type === 'road') {
            // Check car collision
            const hitCar = currentLane.items.some((car) => {
              return s.chicken.gridX >= car.x - 0.5 && s.chicken.gridX <= car.x + car.width;
            });
            if (hitCar) {
              sounds.incorrect();
              setGameState('gameover');
              const finalScore = s.score;
              setHighScore((prev) => Math.max(prev, finalScore));
              try {
                localStorage.setItem('kiddozap_crossy_high', String(Math.max(highScore, finalScore)));
              } catch {}
              onGameComplete(finalScore > 30 ? 3 : finalScore > 15 ? 2 : 1, finalScore);
            }
          } else if (currentLane.type === 'river') {
            // Must be standing on a log!
            const onLog = currentLane.items.find((log) => {
              return s.chicken.gridX >= log.x - 0.3 && s.chicken.gridX <= log.x + log.width - 0.2;
            });
            if (onLog) {
              // Move along with log
              s.chicken.gridX += currentLane.speed * currentLane.direction * 0.04;
              if (s.chicken.gridX < 0 || s.chicken.gridX > GRID_COLS - 1) {
                // Fell off screen
                sounds.incorrect();
                setGameState('gameover');
              }
            } else {
              // Splash in water!
              sounds.incorrect();
              setGameState('gameover');
              const finalScore = s.score;
              setHighScore((prev) => Math.max(prev, finalScore));
              try {
                localStorage.setItem('kiddozap_crossy_high', String(Math.max(highScore, finalScore)));
              } catch {}
              onGameComplete(finalScore > 30 ? 3 : finalScore > 15 ? 2 : 1, finalScore);
            }
          }
        }
      }

      // ---------------- RENDER ----------------
      ctx.clearRect(0, 0, W, H);

      ctx.save();
      // Camera translation
      const viewOffsetY = H - 120 + s.cameraY;
      ctx.translate(0, viewOffsetY);

      // Draw visible lanes
      s.lanes.forEach((lane) => {
        const laneScreenY = -lane.yIndex * CELL_SIZE;
        // Lane background
        ctx.fillStyle = lane.color;
        ctx.fillRect(0, laneScreenY, W, CELL_SIZE);

        if (lane.type === 'road') {
          // Dash lane stripe
          ctx.strokeStyle = '#f8fafc';
          ctx.lineWidth = 2;
          ctx.setLineDash([10, 10]);
          ctx.beginPath();
          ctx.moveTo(0, laneScreenY + CELL_SIZE / 2);
          ctx.lineTo(W, laneScreenY + CELL_SIZE / 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw items
        lane.items.forEach((item) => {
          const itemScreenX = item.x * CELL_SIZE;

          if (item.type === 'car') {
            // Car body
            ctx.fillStyle = lane.direction === 1 ? '#ef4444' : '#3b82f6';
            ctx.fillRect(itemScreenX, laneScreenY + 7, item.width * CELL_SIZE, CELL_SIZE - 14);
            // Windshield
            ctx.fillStyle = '#bae6fd';
            ctx.fillRect(itemScreenX + 10, laneScreenY + 11, item.width * CELL_SIZE - 20, 10);
            // Wheels
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(itemScreenX + 6, laneScreenY + 4, 8, 4);
            ctx.fillRect(itemScreenX + item.width * CELL_SIZE - 14, laneScreenY + 4, 8, 4);
            ctx.fillRect(itemScreenX + 6, laneScreenY + CELL_SIZE - 8, 8, 4);
            ctx.fillRect(itemScreenX + item.width * CELL_SIZE - 14, laneScreenY + CELL_SIZE - 8, 8, 4);
          } else if (item.type === 'log') {
            // Wooden Log
            ctx.fillStyle = '#92400e';
            ctx.fillRect(itemScreenX, laneScreenY + 8, item.width * CELL_SIZE, CELL_SIZE - 16);
            ctx.fillStyle = '#b45309';
            ctx.fillRect(itemScreenX + 4, laneScreenY + 12, item.width * CELL_SIZE - 8, 4);
          } else if (item.type === 'tree') {
            // Pine tree
            ctx.fillStyle = '#15803d';
            ctx.beginPath();
            ctx.arc(itemScreenX + CELL_SIZE / 2, laneScreenY + CELL_SIZE / 2, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#166534';
            ctx.beginPath();
            ctx.arc(itemScreenX + CELL_SIZE / 2, laneScreenY + CELL_SIZE / 2, 8, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });

      // Draw Chicken (Player)
      const chX = s.chicken.animX * CELL_SIZE + CELL_SIZE / 2;
      const chY = -s.chicken.animY * CELL_SIZE + CELL_SIZE / 2 - Math.sin(s.chicken.hopAnim * Math.PI) * 12;

      // Chicken shadow
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.ellipse(chX, -s.chicken.animY * CELL_SIZE + CELL_SIZE / 2 + 8, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Chicken Body
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(chX, chY, 13, 0, Math.PI * 2);
      ctx.fill();

      // Wing
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.arc(chX - 4, chY + 2, 6, 0, Math.PI * 2);
      ctx.fill();

      // Comb (Red crown)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(chX, chY - 12, 4, 0, Math.PI * 2);
      ctx.fill();

      // Beak (Yellow cone)
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(chX + 10, chY - 2);
      ctx.lineTo(chX + 17, chY);
      ctx.lineTo(chX + 10, chY + 3);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(chX + 6, chY - 4, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div className="w-full h-full flex flex-col items-center select-none overflow-hidden pb-1">
      {/* Header Bar */}
      <div className="w-full max-w-[400px] flex items-center justify-between mb-2 bg-white/95 backdrop-blur rounded-2xl p-2 border border-amber-200 shadow-xs">
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
          <div className="px-2.5 py-0.5 bg-amber-500 text-white font-black text-xs rounded-lg">
            <span>🐔 {score}</span>
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
      <div className="relative w-full max-w-[400px] aspect-[400/520] bg-slate-900 rounded-3xl overflow-hidden shadow-xl border-4 border-emerald-500">
        <canvas ref={canvasRef} width={396} height={520} className="w-full h-full block" />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-400 to-green-600 flex items-center justify-center text-4xl shadow-xl mb-3 animate-bounce">
              🐔
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-display text-emerald-300">
              {lang === 'hi' ? 'क्रॉसी रोड (सड़क पार करो)' : 'Crossy Road Adventure'}
            </h3>
            <p className="text-xs text-slate-200 font-semibold max-w-xs mt-1 mb-5">
              {lang === 'hi'
                ? 'मुर्गी को कूदने में मदद करें! तेज रफ्तार कारों और बहती नदी के लट्ठों से सुरक्षित आगे बढ़ें।'
                : 'Hop through heavy traffic, rivers, and train tracks! Tap buttons to cross safely.'}
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-2xl text-sm shadow-xl active:scale-95 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{lang === 'hi' ? 'सड़क पार करें' : 'Start Hopping'}</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <span className="text-5xl mb-2">🚗💥</span>
            <h3 className="text-2xl font-black font-display text-rose-400">
              {lang === 'hi' ? 'खेल समाप्त!' : 'Squashed!'}
            </h3>
            <div className="bg-white/10 rounded-2xl p-4 my-3 w-full max-w-xs border border-white/20">
              <p className="text-xs text-slate-300 font-bold">{lang === 'hi' ? 'दूरी तय की' : 'Hops Reached'}</p>
              <p className="text-3xl font-black text-amber-300 my-1 font-display">{score}</p>
              <p className="text-xs text-slate-300">
                {lang === 'hi' ? `सर्वश्रेष्ठ: ${highScore}` : `Best: ${highScore}`}
              </p>
            </div>
            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={startGame}
                className="flex-1 py-3 bg-emerald-500 text-white font-black text-xs rounded-2xl active:scale-95 shadow-md"
              >
                {lang === 'hi' ? 'पुनः प्रयास' : 'Hop Again'}
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

      {/* Touch D-Pad for Mobile */}
      <div className="w-full max-w-[400px] flex items-center justify-between gap-2 mt-2 px-1">
        <button
          onClick={() => moveChicken(-1, 0)}
          className="flex-1 py-3 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-black text-sm shadow-md active:translate-y-1"
        >
          ◀ {lang === 'hi' ? 'बाएं' : 'Left'}
        </button>

        <button
          onClick={() => moveChicken(0, 1)}
          className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-sm shadow-md active:scale-95"
        >
          ▲ {lang === 'hi' ? 'आगे कूदो' : 'Hop Up'}
        </button>

        <button
          onClick={() => moveChicken(0, -1)}
          className="flex-1 py-3 rounded-2xl bg-slate-100 border-2 border-slate-200 text-slate-700 font-black text-sm shadow-md active:translate-y-1"
        >
          ▼ {lang === 'hi' ? 'पीछे' : 'Back'}
        </button>

        <button
          onClick={() => moveChicken(1, 0)}
          className="flex-1 py-3 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-black text-sm shadow-md active:translate-y-1"
        >
          {lang === 'hi' ? 'दाएं' : 'Right'} ▶
        </button>
      </div>
    </div>
  );
};
