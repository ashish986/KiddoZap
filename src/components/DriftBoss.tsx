/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Star, Sparkles, Zap } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

interface RoadTile {
  x: number; // grid coordinate
  y: number; // grid coordinate
  hasCoin: boolean;
  collectedCoin: boolean;
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

const VEHICLES = [
  { id: 'kart', emoji: '🏎️', name: 'Speed Kart', color: '#ef4444' },
  { id: 'police', emoji: '🚓', name: 'Police Cruiser', color: '#3b82f6' },
  { id: 'taxi', emoji: '🚕', name: 'City Cab', color: '#eab308' },
  { id: 'cyber', emoji: '🛸', name: 'Cyber Hover', color: '#a855f7' },
];

export const DriftBoss: React.FC<Props> = ({ lang, onBack, onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('kiddozap_drift_highscore') || '0', 10);
  });
  const [selectedVehicle, setSelectedVehicle] = useState<number>(0);

  // Mutable Game Loop State
  const stateRef = useRef({
    gameState: 'ready' as 'ready' | 'playing' | 'gameover',
    score: 0,
    coins: 0,
    car: {
      gx: 0, // continuous grid pos x
      gy: 0, // continuous grid pos y
      dir: 'straight' as 'straight' | 'right', // 'straight' moves y+, 'right' moves x+
      speed: 3.2,
      isFalling: false,
      fallZ: 0,
      fallVz: 0,
      rotation: 0,
    },
    road: [] as RoadTile[],
    particles: [] as Particle[],
    skidmarks: [] as { x: number; y: number; alpha: number }[],
    isHolding: false,
    lastTime: 0,
  });

  // Generate initial zigzag road
  const generateInitialRoad = (): RoadTile[] => {
    const tiles: RoadTile[] = [];
    let curX = 0;
    let curY = 0;

    // First straight stretch (safe starting area)
    for (let i = 0; i < 8; i++) {
      tiles.push({ x: 0, y: i, hasCoin: false, collectedCoin: false });
      curY = i;
    }

    // Generate subsequent procedural zigzag segments
    let currentDir: 'straight' | 'right' = 'straight';
    for (let i = 0; i < 60; i++) {
      currentDir = currentDir === 'straight' ? 'right' : 'straight';
      const segmentLen = Math.floor(Math.random() * 4) + 2; // 2 to 5 tiles long

      for (let j = 0; j < segmentLen; j++) {
        if (currentDir === 'straight') {
          curY += 1;
        } else {
          curX += 1;
        }
        const hasCoin = Math.random() < 0.25;
        tiles.push({ x: curX, y: curY, hasCoin, collectedCoin: false });
      }
    }

    return tiles;
  };

  const extendRoad = () => {
    const s = stateRef.current;
    if (s.road.length === 0) return;
    const last = s.road[s.road.length - 1];
    let curX = last.x;
    let curY = last.y;

    let dir: 'straight' | 'right' = Math.random() > 0.5 ? 'straight' : 'right';
    for (let seg = 0; seg < 25; seg++) {
      dir = dir === 'straight' ? 'right' : 'straight';
      const len = Math.floor(Math.random() * 4) + 2;
      for (let j = 0; j < len; j++) {
        if (dir === 'straight') curY += 1;
        else curX += 1;
        const hasCoin = Math.random() < 0.28;
        s.road.push({ x: curX, y: curY, hasCoin, collectedCoin: false });
      }
    }
  };

  const startPlaying = () => {
    const s = stateRef.current;
    s.gameState = 'playing';
    s.score = 0;
    s.coins = 0;
    s.car = {
      gx: 0,
      gy: 1,
      dir: 'straight',
      speed: 3.2,
      isFalling: false,
      fallZ: 0,
      fallVz: 0,
      rotation: 0,
    };
    s.road = generateInitialRoad();
    s.particles = [];
    s.skidmarks = [];
    s.isHolding = false;
    s.lastTime = performance.now();

    setScore(0);
    setCoins(0);
    setGameState('playing');
  };

  const handleGameOver = () => {
    const s = stateRef.current;
    s.gameState = 'gameover';
    setGameState('gameover');
    sounds.playError();

    const finalScore = s.score + s.coins * 5;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('kiddozap_drift_highscore', finalScore.toString());
      confetti({ particleCount: 70, spread: 60 });
    }

    const stars = finalScore >= 200 ? 3 : finalScore >= 90 ? 2 : finalScore >= 30 ? 1 : 0;
    onGameComplete(stars, finalScore);
  };

  // Hold starts drift right; release returns to straight
  const handleHoldStart = () => {
    const s = stateRef.current;
    if (s.gameState === 'ready') {
      startPlaying();
      return;
    }
    if (s.gameState !== 'playing' || s.car.isFalling) return;

    s.isHolding = true;
    s.car.dir = 'right';
    sounds.playDrift();

    // Tire smoke particles
    for (let i = 0; i < 4; i++) {
      s.particles.push({
        x: s.car.gx,
        y: s.car.gy,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: 'rgba(255,255,255,0.7)',
        size: Math.random() * 4 + 3,
        alpha: 0.8,
        life: 0.3,
      });
    }
  };

  const handleHoldEnd = () => {
    const s = stateRef.current;
    if (s.gameState !== 'playing' || s.car.isFalling) return;

    s.isHolding = false;
    s.car.dir = 'straight';
    sounds.playDrift();
  };

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault();
        handleHoldStart();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault();
        handleHoldEnd();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    stateRef.current.lastTime = performance.now();

    // Isometric projection helpers
    const tileW = 54;
    const tileH = 30;

    const toScreen = (gx: number, gy: number, camGx: number, camGy: number) => {
      const dx = gx - camGx;
      const dy = gy - camGy;
      const screenX = canvas.width / 2 + (dx - dy) * (tileW / 2);
      const screenY = canvas.height * 0.65 + (dx + dy) * (tileH / 2);
      return { x: screenX, y: screenY };
    };

    const loop = (now: number) => {
      const dt = Math.min((now - stateRef.current.lastTime) / 1000, 0.04);
      stateRef.current.lastTime = now;

      const s = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;

      if (s.gameState === 'playing') {
        if (!s.car.isFalling) {
          // Increase speed slightly with score
          s.car.speed = Math.min(5.8, 3.4 + s.score * 0.015);

          // Move in current direction
          if (s.car.dir === 'straight') {
            s.car.gy += s.car.speed * dt;
          } else {
            s.car.gx += s.car.speed * dt;
          }

          // Check road boundary collision (Is car on any road tile?)
          // A tile is at grid coordinates (tile.x, tile.y) with size 1x1
          const carGx = s.car.gx;
          const carGy = s.car.gy;

          // Search nearby road tiles
          const onTile = s.road.some((t) => {
            const margin = 0.55;
            return (
              carGx >= t.x - margin &&
              carGx <= t.x + margin &&
              carGy >= t.y - margin &&
              carGy <= t.y + margin
            );
          });

          // Check coin collection
          s.road.forEach((t) => {
            if (t.hasCoin && !t.collectedCoin) {
              const dist = Math.hypot(carGx - t.x, carGy - t.y);
              if (dist < 0.6) {
                t.collectedCoin = true;
                s.coins += 1;
                setCoins(s.coins);
                sounds.playGem();
              }
            }
          });

          // Fall off road
          if (!onTile) {
            s.car.isFalling = true;
            s.car.fallVz = 0;
            sounds.playError();
          }

          // Update Score
          const newScore = Math.floor(carGx + carGy);
          if (newScore > s.score) {
            s.score = newScore;
            setScore(newScore);
          }

          // Keep extending road ahead
          if (s.road.length - (s.score) < 35) {
            extendRoad();
          }
        } else {
          // Falling physics
          s.car.fallVz += 28 * dt;
          s.car.fallZ += s.car.fallVz;
          s.car.rotation += 8 * dt;

          if (s.car.fallZ > 260) {
            handleGameOver();
          }
        }
      }

      // 3. Render Isometric World
      ctx.clearRect(0, 0, w, h);

      // Sky Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#0284c7'); // Sky blue
      skyGrad.addColorStop(0.5, '#38bdf8');
      skyGrad.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Floating fluffy clouds in background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(80, 100, 45, 0, Math.PI * 2);
      ctx.arc(130, 95, 60, 0, Math.PI * 2);
      ctx.arc(180, 105, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(w - 90, 160, 50, 0, Math.PI * 2);
      ctx.arc(w - 40, 150, 65, 0, Math.PI * 2);
      ctx.fill();

      const camGx = s.car.gx;
      const camGy = s.car.gy;

      // Draw Road Tiles
      s.road.forEach((tile) => {
        // Cull off-screen tiles
        const distToCar = Math.hypot(tile.x - camGx, tile.y - camGy);
        if (distToCar > 14) return;

        const p = toScreen(tile.x, tile.y, camGx, camGy);

        // Isometric diamond shape
        const hw = tileW / 2;
        const hh = tileH / 2;

        // 3D pillar side underneath
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(p.x - hw, p.y);
        ctx.lineTo(p.x, p.y + hh);
        ctx.lineTo(p.x, p.y + hh + 22);
        ctx.lineTo(p.x - hw, p.y + 22);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y + hh);
        ctx.lineTo(p.x + hw, p.y);
        ctx.lineTo(p.x + hw, p.y + 22);
        ctx.lineTo(p.x, p.y + hh + 22);
        ctx.closePath();
        ctx.fill();

        // Top Road Surface
        const isAlternating = (tile.x + tile.y) % 2 === 0;
        ctx.fillStyle = isAlternating ? '#64748b' : '#94a3b8';

        ctx.beginPath();
        ctx.moveTo(p.x, p.y - hh);
        ctx.lineTo(p.x + hw, p.y);
        ctx.lineTo(p.x, p.y + hh);
        ctx.lineTo(p.x - hw, p.y);
        ctx.closePath();
        ctx.fill();

        // Border edge
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw Gold Coin if present
        if (tile.hasCoin && !tile.collectedCoin) {
          const coinBounce = Math.sin(now * 0.007 + tile.x) * 4;
          ctx.save();
          ctx.translate(p.x, p.y - 10 + coinBounce);

          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.ellipse(0, 0, 7, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.ellipse(0, 0, 4, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      });

      // Draw Car
      const carPos = toScreen(s.car.gx, s.car.gy, camGx, camGy);
      ctx.save();
      ctx.translate(carPos.x, carPos.y + s.car.fallZ);
      ctx.rotate(s.car.rotation);

      // Car Shadow (if not fallen far)
      if (s.car.fallZ < 40) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.ellipse(0, 4, 14, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Vehicle Emoji
      ctx.font = '26px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Flip/rotate according to direction
      if (s.car.dir === 'right') {
        ctx.scale(-1, 1); // Face right/southeast
      }
      ctx.fillText(VEHICLES[selectedVehicle].emoji, 0, -8);

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [lang, highScore, selectedVehicle]);

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

          <div className="flex items-center gap-1 px-2.5 py-0.5 bg-sky-600 text-white rounded-xl text-xs font-black shadow-2xs">
            <span>🏁 {score}m</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-400 text-amber-950 rounded-xl text-[11px] font-black shadow-2xs">
            <span>🪙 {coins}</span>
          </div>
        </div>

        <button
          onClick={startPlaying}
          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all"
          title="Restart"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Vehicle Selector Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-sm">
        {VEHICLES.map((veh, idx) => (
          <button
            key={veh.id}
            onClick={() => {
              sounds.playPop();
              setSelectedVehicle(idx);
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all border ${
              selectedVehicle === idx
                ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{veh.emoji}</span>
            <span>{veh.name}</span>
          </button>
        ))}
      </div>

      {/* Main Drift Canvas */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center p-1 relative">
        <div
          className="relative h-full max-h-[min(68vh,480px)] aspect-[4/5.4] bg-sky-700 rounded-3xl overflow-hidden shadow-xl border-4 border-sky-900 touch-none cursor-pointer"
          onPointerDown={handleHoldStart}
          onPointerUp={handleHoldEnd}
          onPointerCancel={handleHoldEnd}
        >
          <canvas
            ref={canvasRef}
            width={380}
            height={520}
            className="w-full h-full block"
          />

          {/* Ready Overlay */}
          {gameState === 'ready' && (
            <div className="absolute inset-0 bg-black/55 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white">
              <div className="text-5xl mb-2">🏎️</div>
              <h3 className="text-xl font-black font-display drop-shadow-md">
                {lang === 'hi' ? 'ड्रिफ्ट बॉस - कर्व रेसर' : 'Sky Drift Curve Racer'}
              </h3>
              <p className="text-[11px] text-amber-200 font-bold mt-1 max-w-xs leading-tight">
                {lang === 'hi'
                  ? 'दाएं मोड़ने के लिए दबाकर रखें (Hold)। सीधा जाने के लिए छोड़ें (Release)।'
                  : 'Press & Hold to Drift Right. Release to Steer Straight.'}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startPlaying();
                }}
                className="mt-4 px-5 py-2.5 bg-gradient-to-r from-red-500 to-amber-500 text-white font-black text-xs rounded-xl shadow-lg active:scale-95 transition-all"
              >
                {lang === 'hi' ? 'ड्रिफ्ट शुरू करें' : 'Start Drifting'}
              </button>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center text-white">
              <div className="text-4xl mb-1">🏎️💨</div>
              <h3 className="text-xl font-black font-display text-red-400">
                {lang === 'hi' ? 'गाड़ी खाई में गिरी!' : 'Fell Off Track!'}
              </h3>

              <div className="bg-white/10 rounded-2xl p-3 my-2 w-full max-w-xs border border-white/20">
                <p className="text-[11px] text-slate-300 font-bold">{lang === 'hi' ? 'दूरी व सिक्के' : 'Distance & Coins'}</p>
                <p className="text-3xl font-black text-amber-300 my-0.5 font-display">
                  {score}m + {coins} 🪙
                </p>
                <p className="text-[10px] text-slate-300">
                  {lang === 'hi' ? `सर्वश्रेष्ठ: ${highScore}` : `Best: ${highScore}`}
                </p>
              </div>

              <div className="flex gap-2 w-full max-w-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startPlaying();
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow-md active:scale-95 transition-all"
                >
                  {lang === 'hi' ? 'फिर दौड़ें' : 'Drive Again'}
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

      {/* Hold button */}
      <button
        onPointerDown={handleHoldStart}
        onPointerUp={handleHoldEnd}
        onPointerCancel={handleHoldEnd}
        className="w-full max-w-sm h-11 bg-gradient-to-r from-red-500 via-amber-500 to-red-500 text-white font-black text-xs rounded-xl shadow-2xs active:scale-98 flex items-center justify-center gap-1.5 border border-amber-300"
      >
        <span>🏎️ {lang === 'hi' ? 'दबाकर रखें: दायां ड्रिफ्ट (HOLD TO DRIFT)' : 'HOLD TO DRIFT RIGHT'}</span>
      </button>
    </div>
  );
};
