import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  RotateCcw,
  Volume2,
  VolumeX,
  Heart,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';

interface PacMazeGameProps {
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
  lang?: Language;
}

// 19x21 Grid
// 1 = Wall, 0 = Dot, 2 = Power Pellet, 3 = Empty, 4 = Ghost House
const INITIAL_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 3, 1, 3, 1, 1, 1, 0, 1, 1, 1, 1],
  [3, 3, 3, 1, 0, 1, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 3, 3, 3],
  [1, 1, 1, 1, 0, 1, 3, 1, 1, 4, 1, 1, 3, 1, 0, 1, 1, 1, 1],
  [3, 3, 3, 3, 0, 3, 3, 1, 4, 4, 4, 1, 3, 3, 0, 3, 3, 3, 3],
  [1, 1, 1, 1, 0, 1, 3, 1, 1, 1, 1, 1, 3, 1, 0, 1, 1, 1, 1],
  [3, 3, 3, 1, 0, 1, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 3, 3, 3],
  [1, 1, 1, 1, 0, 1, 3, 1, 1, 1, 1, 1, 3, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 2, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0, 2, 1],
  [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

interface Ghost {
  x: number;
  y: number;
  dirX: number;
  dirY: number;
  color: string;
  name: string;
  targetX: number;
  targetY: number;
}

export default function PacMazeGame({ onBack, onGameComplete, lang = 'en' }: PacMazeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'victory'>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [soundOn, setSoundOn] = useState(true);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('kiddozap_pacmaze_high') || '0', 10);
    } catch {
      return 0;
    }
  });

  const stateRef = useRef({
    grid: JSON.parse(JSON.stringify(INITIAL_MAP)) as number[][],
    dotsLeft: 0,
    pac: {
      x: 9,
      y: 16,
      dirX: 0,
      dirY: 0,
      nextDirX: 0,
      nextDirY: 0,
      mouthAngle: 0.2,
      mouthDir: 1,
    },
    ghosts: [
      { x: 9, y: 9, dirX: 0, dirY: -1, color: '#ef4444', name: 'Blinky', targetX: 9, targetY: 9 },
      { x: 8, y: 10, dirX: 0, dirY: 1, color: '#f472b6', name: 'Pinky', targetX: 8, targetY: 10 },
      { x: 10, y: 10, dirX: 1, dirY: 0, color: '#06b6d4', name: 'Inky', targetX: 10, targetY: 10 },
      { x: 9, y: 10, dirX: -1, dirY: 0, color: '#f97316', name: 'Clyde', targetX: 9, targetY: 10 },
    ] as Ghost[],
    frightenedTimer: 0,
    score: 0,
    ghostCombo: 1,
  });

  // Count dots
  const countDots = (grid: number[][]) => {
    let count = 0;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === 0 || grid[r][c] === 2) count++;
      }
    }
    return count;
  };

  const setNextDirection = (dx: number, dy: number) => {
    stateRef.current.pac.nextDirX = dx;
    stateRef.current.pac.nextDirY = dy;
  };

  const startGame = () => {
    if (soundOn) sounds.tap(1.2);
    const s = stateRef.current;
    s.grid = JSON.parse(JSON.stringify(INITIAL_MAP));
    s.dotsLeft = countDots(s.grid);
    s.pac = {
      x: 9,
      y: 16,
      dirX: 0,
      dirY: 0,
      nextDirX: 0,
      nextDirY: 0,
      mouthAngle: 0.2,
      mouthDir: 1,
    };
    s.ghosts = [
      { x: 9, y: 9, dirX: 0, dirY: -1, color: '#ef4444', name: 'Blinky', targetX: 9, targetY: 9 },
      { x: 8, y: 10, dirX: 0, dirY: 1, color: '#f472b6', name: 'Pinky', targetX: 8, targetY: 10 },
      { x: 10, y: 10, dirX: 1, dirY: 0, color: '#06b6d4', name: 'Inky', targetX: 10, targetY: 10 },
      { x: 9, y: 10, dirX: -1, dirY: 0, color: '#f97316', name: 'Clyde', targetX: 9, targetY: 10 },
    ];
    s.frightenedTimer = 0;
    s.score = 0;
    s.ghostCombo = 1;
    setScore(0);
    setLives(3);
    setGameState('playing');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') setNextDirection(0, -1);
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') setNextDirection(0, 1);
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setNextDirection(-1, 0);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setNextDirection(1, 0);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const canMoveTo = (grid: number[][], r: number, c: number) => {
      // Screen wrap
      if (c < 0 || c >= 19) return true;
      if (r < 0 || r >= 21) return false;
      return grid[r][c] !== 1;
    };

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      const s = stateRef.current;
      const pac = s.pac;
      const rows = 21;
      const cols = 19;
      const cellSize = Math.min(W / cols, H / rows);
      const offsetX = (W - cols * cellSize) / 2;
      const offsetY = (H - rows * cellSize) / 2;

      tick++;

      if (gameState === 'playing') {
        // Update every 8 frames
        const moveInterval = level === 1 ? 8 : level === 2 ? 7 : 6;
        if (tick % moveInterval === 0) {
          // Check desired direction
          const nextR = Math.round(pac.y + pac.nextDirY);
          const nextC = Math.round(pac.x + pac.nextDirX);
          if (canMoveTo(s.grid, nextR, nextC)) {
            pac.dirX = pac.nextDirX;
            pac.dirY = pac.nextDirY;
          }

          // Move Pac
          const newR = Math.round(pac.y + pac.dirY);
          let newC = Math.round(pac.x + pac.dirX);

          // Wrap tunnel
          if (newC < 0) newC = cols - 1;
          else if (newC >= cols) newC = 0;

          if (canMoveTo(s.grid, newR, newC)) {
            pac.x = newC;
            pac.y = newR;

            // Eat Dot / Pellet
            const cell = s.grid[newR]?.[newC];
            if (cell === 0) {
              s.grid[newR][newC] = 3;
              s.score += 10;
              s.dotsLeft--;
              setScore(s.score);
              if (soundOn && tick % 16 === 0) sounds.tap(1.8);
            } else if (cell === 2) {
              // Power Pellet!
              s.grid[newR][newC] = 3;
              s.score += 50;
              s.dotsLeft--;
              s.frightenedTimer = 60; // ~60 moves of fright
              s.ghostCombo = 1;
              setScore(s.score);
              if (soundOn) sounds.powerup();
            }

            // Check Victory
            if (s.dotsLeft <= 0) {
              setGameState('victory');
              if (soundOn) sounds.complete();
              confetti({ particleCount: 100, spread: 80 });
              onGameComplete(3, s.score + 1000);
              return;
            }
          }

          // Decrease frightened timer
          if (s.frightenedTimer > 0) {
            s.frightenedTimer--;
          }

          // Update Ghosts AI
          for (const g of s.ghosts) {
            // Find valid neighboring cells
            const dirs = [
              { dx: 0, dy: -1 },
              { dx: 0, dy: 1 },
              { dx: -1, dy: 0 },
              { dx: 1, dy: 0 },
            ];
            // Filter out reverse direction to prevent twitching
            const validDirs = dirs.filter((d) => {
              if (d.dx === -g.dirX && d.dy === -g.dirY) return false;
              const gr = Math.round(g.y + d.dy);
              const gc = Math.round(g.x + d.dx);
              return canMoveTo(s.grid, gr, gc);
            });

            if (validDirs.length > 0) {
              let chosen = validDirs[0];
              if (s.frightenedTimer > 0) {
                // Run away from pac
                chosen = validDirs.reduce((best, curr) => {
                  const dCurr = Math.hypot(g.x + curr.dx - pac.x, g.y + curr.dy - pac.y);
                  const dBest = Math.hypot(g.x + best.dx - pac.x, g.y + best.dy - pac.y);
                  return dCurr > dBest ? curr : best;
                }, validDirs[0]);
              } else {
                // Chase Pacman with randomness based on ghost personality
                if (Math.random() < 0.75) {
                  chosen = validDirs.reduce((best, curr) => {
                    const dCurr = Math.hypot(g.x + curr.dx - pac.x, g.y + curr.dy - pac.y);
                    const dBest = Math.hypot(g.x + best.dx - pac.x, g.y + best.dy - pac.y);
                    return dCurr < dBest ? curr : best;
                  }, validDirs[0]);
                } else {
                  chosen = validDirs[Math.floor(Math.random() * validDirs.length)];
                }
              }

              g.dirX = chosen.dx;
              g.dirY = chosen.dy;
              g.x = Math.round(g.x + g.dirX);
              g.y = Math.round(g.y + g.dirY);

              // Tunnel wrap for ghosts
              if (g.x < 0) g.x = cols - 1;
              else if (g.x >= cols) g.x = 0;
            }

            // Ghost & Pac Collision Check
            if (Math.hypot(g.x - pac.x, g.y - pac.y) < 0.75) {
              if (s.frightenedTimer > 0) {
                // Eat ghost!
                const points = 200 * s.ghostCombo;
                s.score += points;
                s.ghostCombo *= 2;
                setScore(s.score);
                if (soundOn) sounds.chime(1.5);
                // Reset eaten ghost to house
                g.x = 9;
                g.y = 10;
              } else {
                // Pacman Dies!
                if (soundOn) sounds.incorrect();
                setLives((l) => {
                  const remaining = l - 1;
                  if (remaining <= 0) {
                    setGameState('gameover');
                    setHighScore((prev) => Math.max(prev, s.score));
                    try {
                      localStorage.setItem('kiddozap_pacmaze_high', String(Math.max(highScore, s.score)));
                    } catch {}
                    onGameComplete(s.score > 800 ? 2 : 1, s.score);
                  } else {
                    // Reset positions
                    pac.x = 9;
                    pac.y = 16;
                    pac.dirX = 0;
                    pac.dirY = 0;
                    pac.nextDirX = 0;
                    pac.nextDirY = 0;
                  }
                  return remaining;
                });
                break;
              }
            }
          }
        }

        // Mouth animation
        pac.mouthAngle += 0.04 * pac.mouthDir;
        if (pac.mouthAngle > 0.45) pac.mouthDir = -1;
        if (pac.mouthAngle < 0.05) pac.mouthDir = 1;
      }

      // ---------------- RENDER ----------------
      // Dark arcade backdrop
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, W, H);

      // Draw Grid Maze
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const val = s.grid[r][c];
          const x = offsetX + c * cellSize;
          const y = offsetY + r * cellSize;

          if (val === 1) {
            // Neon Maze Wall
            ctx.fillStyle = '#1e1b4b';
            ctx.fillRect(x, y, cellSize, cellSize);
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
          } else if (val === 0) {
            // Neon Dot
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.15, 0, Math.PI * 2);
            ctx.fill();
          } else if (val === 2) {
            // Energizer Power Pellet (pulsing)
            const pulse = 1 + Math.sin(tick * 0.15) * 0.2;
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.38 * pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#e0f2fe';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      }

      // Draw Ghosts
      for (const g of s.ghosts) {
        const gx = offsetX + g.x * cellSize + cellSize / 2;
        const gy = offsetY + g.y * cellSize + cellSize / 2;
        const r = cellSize * 0.42;

        ctx.save();
        ctx.translate(gx, gy);

        // Frightened Ghost Color vs Normal
        if (s.frightenedTimer > 0) {
          ctx.fillStyle = s.frightenedTimer < 15 && tick % 6 < 3 ? '#ffffff' : '#3b82f6';
        } else {
          ctx.fillStyle = g.color;
        }

        // Ghost Body dome
        ctx.beginPath();
        ctx.arc(0, -r * 0.2, r, Math.PI, 0, false);
        ctx.lineTo(r, r * 0.8);
        // Wavy skirt tentacles
        ctx.lineTo(r * 0.5, r * 0.5);
        ctx.lineTo(0, r * 0.8);
        ctx.lineTo(-r * 0.5, r * 0.5);
        ctx.lineTo(-r, r * 0.8);
        ctx.closePath();
        ctx.fill();

        // Ghost Eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-r * 0.35, -r * 0.2, r * 0.25, 0, Math.PI * 2);
        ctx.arc(r * 0.35, -r * 0.2, r * 0.25, 0, Math.PI * 2);
        ctx.fill();

        // Blue Pupils
        ctx.fillStyle = s.frightenedTimer > 0 ? '#ef4444' : '#1e3a8a';
        ctx.beginPath();
        ctx.arc(-r * 0.35 + g.dirX * 2, -r * 0.2 + g.dirY * 2, r * 0.12, 0, Math.PI * 2);
        ctx.arc(r * 0.35 + g.dirX * 2, -r * 0.2 + g.dirY * 2, r * 0.12, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Draw Pacman
      const px = offsetX + pac.x * cellSize + cellSize / 2;
      const py = offsetY + pac.y * cellSize + cellSize / 2;
      const pr = cellSize * 0.44;

      ctx.save();
      ctx.translate(px, py);

      // Calculate facing rotation
      let angle = 0;
      if (pac.dirX === 1) angle = 0;
      else if (pac.dirX === -1) angle = Math.PI;
      else if (pac.dirY === 1) angle = Math.PI / 2;
      else if (pac.dirY === -1) angle = -Math.PI / 2;
      ctx.rotate(angle);

      // Glowing Yellow Pac Body with Chomping Mouth
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(0, 0, pr, pac.mouthAngle * Math.PI, (2 - pac.mouthAngle) * Math.PI);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();

      // Eye
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(0, -pr * 0.45, pr * 0.14, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState, level, soundOn, highScore]);

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col bg-slate-950 text-white select-none">
      {/* Top Header */}
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

        {/* Score & Lives HUD */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {lang === 'hi' ? 'स्कोर' : 'Score'}
            </span>
            <span className="text-lg font-black text-yellow-400 leading-none">{score}</span>
          </div>

          {/* Lives */}
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                className={`w-4 h-4 ${
                  heart <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Sound & Restart */}
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
      <div className="flex-1 min-h-0 relative flex items-center justify-center bg-slate-950 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={460}
          height={520}
          className="w-full h-full max-w-lg object-contain touch-none"
        />

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20">
            <div className="w-16 h-16 rounded-3xl bg-yellow-500/20 border-2 border-yellow-400 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-yellow-500/30 animate-pulse">
              🟡
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-yellow-400 mb-1 tracking-wider uppercase font-display">
              {lang === 'hi' ? 'साइबर पैक-मेज 2088' : 'Cyber Pac-Maze 2088'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs mb-5 leading-relaxed">
              {lang === 'hi'
                ? 'नियॉन भूलभुलैया के सारे डॉट्स खाएं, नीले पावर ओरब से भूतों का शिकार करें!'
                : 'Chomp all neon dots in the maze, grab blue energizers to hunt vulnerable ghosts!'}
            </p>

            <button
              onClick={startGame}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-slate-950 font-black text-base transition-all active:scale-95 shadow-xl shadow-yellow-500/40 uppercase tracking-wider"
            >
              {lang === 'hi' ? '▶ खेल शुरू करें' : '▶ Start Maze'}
            </button>

            <p className="text-[11px] text-slate-400 mt-3 font-semibold">
              {lang === 'hi' ? 'तीर कुंजियां (Arrow Keys) या नीचे दिए गए बटनों का उपयोग करें' : 'Use Arrow Keys / WASD or D-Pad below'}
            </p>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-2xl mb-2">
              👾
            </div>
            <h2 className="text-2xl font-black text-white mb-1 font-display">
              {lang === 'hi' ? 'गेम ओवर!' : 'Game Over!'}
            </h2>
            <div className="text-3xl font-black text-yellow-400 mb-1">{score} Pts</div>
            <p className="text-xs text-slate-400 mb-4">
              {lang === 'hi' ? 'सर्वोत्तम स्कोर:' : 'High Score:'} {highScore}
            </p>

            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-sm transition-all active:scale-95 shadow-md shadow-yellow-500/30"
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

        {/* Victory Level Clear Overlay */}
        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-amber-500/30 animate-bounce">
              🏆
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-400 mb-1 font-display">
              {lang === 'hi' ? 'भूलभुलैया जीत ली!' : 'MAZE CLEARED!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mb-4">
              {lang === 'hi'
                ? `शानदार! आपने सारे डॉट्स खाकर ${score} अंक अर्जित किए!`
                : `Phenomenal! You cleared the entire neon maze with ${score} points!`}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setLevel((l) => l + 1);
                  startGame();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-sm transition-all active:scale-95 shadow-md shadow-yellow-500/30"
              >
                {lang === 'hi' ? 'अगला स्तर (तेज)' : 'Next Faster Level'}
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

      {/* Mobile Sleek D-Pad Controls */}
      <div className="shrink-0 p-2 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-2 z-10">
        <div className="grid grid-cols-3 gap-1.5 w-44">
          <div />
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              setNextDirection(0, -1);
            }}
            onClick={() => setNextDirection(0, -1)}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-yellow-500 active:text-slate-950 border border-slate-700 flex items-center justify-center"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <div />

          <button
            onTouchStart={(e) => {
              e.preventDefault();
              setNextDirection(-1, 0);
            }}
            onClick={() => setNextDirection(-1, 0)}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-yellow-500 active:text-slate-950 border border-slate-700 flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              setNextDirection(0, 1);
            }}
            onClick={() => setNextDirection(0, 1)}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-yellow-500 active:text-slate-950 border border-slate-700 flex items-center justify-center"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              setNextDirection(1, 0);
            }}
            onClick={() => setNextDirection(1, 0)}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-yellow-500 active:text-slate-950 border border-slate-700 flex items-center justify-center"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
