import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Volume2, Sparkles, Star, Trophy, Heart, Play, Zap } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface KiddoRunnerProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

interface Obstacle {
  x: number;
  type: 'rock' | 'spike' | 'log';
  width: number;
  height: number;
}

interface Collectible {
  x: number;
  y: number;
  type: 'apple' | 'star' | 'gem';
  collected: boolean;
}

export const KiddoRunner: React.FC<KiddoRunnerProps> = ({
  lang,
  onBack,
  onGameComplete,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [distance, setDistance] = useState<number>(0);

  // Player physics
  const [playerY, setPlayerY] = useState<number>(0); // 0 is ground
  const velocityYRef = useRef<number>(0);
  const isGroundedRef = useRef<boolean>(true);
  const jumpsLeftRef = useRef<number>(2); // Double jump!

  // Game elements
  const obstaclesRef = useRef<Obstacle[]>([]);
  const collectiblesRef = useRef<Collectible[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);

  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const speedRef = useRef<number>(300); // pixels per sec

  const jump = () => {
    if (!isPlaying || isGameOver) return;
    if (jumpsLeftRef.current > 0) {
      sounds.playPop(1.4 - (2 - jumpsLeftRef.current) * 0.2);
      velocityYRef.current = 580; // Jump impulse
      isGroundedRef.current = false;
      jumpsLeftRef.current -= 1;
    }
  };

  const startGame = () => {
    sounds.playPop(1.1);
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setLives(3);
    setDistance(0);
    setPlayerY(0);
    velocityYRef.current = 0;
    isGroundedRef.current = true;
    jumpsLeftRef.current = 2;
    speedRef.current = 320;
    obstaclesRef.current = [
      { x: 700, type: 'rock', width: 36, height: 36 },
      { x: 1200, type: 'log', width: 44, height: 32 },
    ];
    collectiblesRef.current = [
      { x: 450, y: 70, type: 'apple', collected: false },
      { x: 850, y: 110, type: 'star', collected: false },
      { x: 1350, y: 80, type: 'gem', collected: false },
    ];
    setObstacles([...obstaclesRef.current]);
    setCollectibles([...collectiblesRef.current]);
    lastTimeRef.current = performance.now();
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        if (!isPlaying && !isGameOver) {
          startGame();
        } else {
          jump();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver]);

  // Main game loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const loop = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      // Update player physics (Gravity)
      velocityYRef.current -= 1400 * dt; // Gravity
      setPlayerY((prev) => {
        const nextY = prev + velocityYRef.current * dt;
        if (nextY <= 0) {
          velocityYRef.current = 0;
          isGroundedRef.current = true;
          jumpsLeftRef.current = 2;
          return 0;
        }
        return nextY;
      });

      // Increase speed gradually
      speedRef.current = Math.min(650, speedRef.current + 8 * dt);
      const currentSpeed = speedRef.current;

      setDistance((prev) => prev + currentSpeed * dt * 0.05);

      // Move obstacles
      const currentObstacles = obstaclesRef.current;
      for (let i = 0; i < currentObstacles.length; i++) {
        currentObstacles[i].x -= currentSpeed * dt;
      }

      // Filter and spawn new obstacles
      if (currentObstacles.length === 0 || currentObstacles[currentObstacles.length - 1].x < 700) {
        const types: ('rock' | 'spike' | 'log')[] = ['rock', 'spike', 'log'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const lastX = currentObstacles.length > 0 ? currentObstacles[currentObstacles.length - 1].x : 400;
        const newX = Math.max(750, lastX + 280 + Math.random() * 250);
        currentObstacles.push({
          x: newX,
          type: randomType,
          width: randomType === 'log' ? 44 : 36,
          height: randomType === 'spike' ? 42 : 36,
        });
      }

      // Move collectibles
      const currentCollectibles = collectiblesRef.current;
      for (let i = 0; i < currentCollectibles.length; i++) {
        currentCollectibles[i].x -= currentSpeed * dt;
      }

      // Spawn new collectibles
      if (currentCollectibles.length === 0 || currentCollectibles[currentCollectibles.length - 1].x < 700) {
        const lastX = currentCollectibles.length > 0 ? currentCollectibles[currentCollectibles.length - 1].x : 400;
        const types: ('apple' | 'star' | 'gem')[] = ['apple', 'star', 'gem'];
        currentCollectibles.push({
          x: lastX + 220 + Math.random() * 200,
          y: 40 + Math.random() * 90,
          type: types[Math.floor(Math.random() * types.length)],
          collected: false,
        });
      }

      // Keep only on-screen items
      obstaclesRef.current = currentObstacles.filter((o) => o.x > -80);
      collectiblesRef.current = currentCollectibles.filter((c) => c.x > -80 && !c.collected);

      // Check collision with obstacles (Player is at x = 70, width = 45, height = 55)
      const playerBox = {
        left: 75,
        right: 115,
        bottom: playerY,
        top: playerY + 55,
      };

      for (let i = 0; i < obstaclesRef.current.length; i++) {
        const obs = obstaclesRef.current[i];
        const obsBox = {
          left: obs.x + 4,
          right: obs.x + obs.width - 4,
          bottom: 0,
          top: obs.height - 4,
        };

        // AABB Collision test
        if (
          playerBox.right > obsBox.left &&
          playerBox.left < obsBox.right &&
          playerBox.bottom < obsBox.top
        ) {
          // Hit obstacle!
          sounds.playError();
          // Remove this obstacle so no multiple hits
          obstaclesRef.current.splice(i, 1);
          setLives((prev) => {
            const next = prev - 1;
            if (next <= 0) {
              handleGameOver();
            }
            return next;
          });
          break;
        }
      }

      // Check collection
      for (let i = 0; i < collectiblesRef.current.length; i++) {
        const item = collectiblesRef.current[i];
        if (!item.collected) {
          const itemBox = {
            left: item.x,
            right: item.x + 30,
            bottom: item.y,
            top: item.y + 30,
          };

          if (
            playerBox.right > itemBox.left &&
            playerBox.left < itemBox.right &&
            playerBox.top > itemBox.bottom &&
            playerBox.bottom < itemBox.top
          ) {
            item.collected = true;
            sounds.playChime();
            const points = item.type === 'gem' ? 25 : item.type === 'star' ? 15 : 10;
            setScore((s) => s + points);
          }
        }
      }

      setObstacles([...obstaclesRef.current]);
      setCollectibles([...collectiblesRef.current]);

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, isGameOver, playerY]);

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsPlaying(false);
    if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);

    const finalScore = score + Math.floor(distance);
    setHighScore((prev) => Math.max(prev, finalScore));

    const stars = finalScore >= 200 ? 3 : finalScore >= 80 ? 2 : 1;
    sounds.playFanfare();
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    onGameComplete(stars, finalScore);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          onClick={() => {
            sounds.playPop(0.9);
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-black border border-slate-200 shadow-2xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Lives */}
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-rose-200 shadow-2xs">
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                className={`w-4 h-4 ${
                  heart <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-xl font-black text-xs shadow-xs">
            <Trophy className="w-3.5 h-3.5" />
            <span>{score + Math.floor(distance)}</span>
          </div>
        </div>
      </div>

      {/* Main Runner Stage */}
      <div
        onClick={jump}
        className="relative w-full h-[320px] sm:h-[360px] rounded-3xl overflow-hidden shadow-lg border-4 border-amber-300 bg-gradient-to-b from-sky-300 via-sky-100 to-amber-50 cursor-pointer select-none"
      >
        {/* Animated Sky Clouds */}
        <div className="absolute top-4 left-10 text-3xl opacity-80 animate-pulse">☁️</div>
        <div className="absolute top-8 right-16 text-4xl opacity-70">☁️</div>
        <div className="absolute top-3 left-1/2 text-2xl opacity-60">☁️</div>
        <div className="absolute top-4 right-1/3 text-3xl opacity-50">☀️</div>

        {/* Distance Scenery Mountains / Trees */}
        <div className="absolute bottom-14 left-0 right-0 flex justify-around opacity-40 pointer-events-none text-3xl">
          <span>🌲</span>
          <span>🌳</span>
          <span>🌲</span>
          <span>🌳</span>
          <span>🌲</span>
          <span>🌳</span>
        </div>

        {/* Ground Surface */}
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-amber-800 to-emerald-600 border-t-4 border-emerald-400">
          <div className="w-full h-2 bg-emerald-300/80" />
          <div className="p-1 text-[10px] text-amber-200/70 font-black tracking-widest text-center">
            {lang === 'hi' ? 'कूदने के लिए टैप करें / SPACE दबाएं' : 'TAP TO JUMP OR PRESS SPACE'}
          </div>
        </div>

        {/* Collectibles */}
        {collectibles.map((item, idx) => (
          <div
            key={idx}
            style={{
              left: `${item.x}px`,
              bottom: `${item.y + 56}px`,
            }}
            className="absolute text-2xl transition-transform duration-75 animate-bounce pointer-events-none"
          >
            {item.type === 'apple' ? '🍎' : item.type === 'star' ? '⭐' : '💎'}
          </div>
        ))}

        {/* Obstacles */}
        {obstacles.map((obs, idx) => (
          <div
            key={idx}
            style={{
              left: `${obs.x}px`,
              bottom: '56px',
              width: `${obs.width}px`,
              height: `${obs.height}px`,
            }}
            className="absolute flex items-center justify-center text-2xl pointer-events-none"
          >
            {obs.type === 'rock' ? '🪨' : obs.type === 'spike' ? '🌵' : '🪵'}
          </div>
        ))}

        {/* Player Character */}
        <div
          style={{
            left: '80px',
            bottom: `${playerY + 56}px`,
            transform: `rotate(${playerY > 10 ? -12 : 0}deg)`,
          }}
          className="absolute text-4xl select-none transition-transform duration-75 z-20"
        >
          🏃‍♂️
        </div>

        {/* Jump Hint / Double Jump Indicator */}
        {isPlaying && (
          <div className="absolute top-3 left-4 bg-black/20 backdrop-blur px-2.5 py-1 rounded-full text-white text-[11px] font-black flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>{jumpsLeftRef.current > 0 ? (jumpsLeftRef.current === 2 ? 'Double Jump Ready!' : '1 Jump Left!') : 'In Air!'}</span>
          </div>
        )}

        {/* Start Overlay */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center z-30">
            <div className="w-16 h-16 rounded-3xl bg-amber-500 flex items-center justify-center text-4xl shadow-lg mb-3 animate-bounce">
              🏃‍♂️
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-display drop-shadow">
              {lang === 'hi' ? 'किड्डो रन डैश (RunGame)' : 'Kiddo Run Dash'}
            </h3>
            <p className="text-xs font-bold text-amber-100 max-w-sm mt-1 mb-5">
              {lang === 'hi'
                ? 'पत्थरों और कांटों से बचें, फल और सितारे इकट्ठा करें! हवा में दोबारा कूदने के लिए डबल टैप करें।'
                : 'Dodge rocks & hurdles, collect shiny stars and fruits! Double tap to perform a super double jump.'}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black rounded-2xl text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{lang === 'hi' ? 'दौड़ शुरू करें!' : 'Start Running!'}</span>
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center z-30">
            <div className="text-5xl mb-2">🏆</div>
            <h3 className="text-2xl font-black font-display text-amber-300">
              {lang === 'hi' ? 'शानदार दौड़!' : 'Awesome Run!'}
            </h3>
            <div className="my-3 bg-white/10 px-5 py-2.5 rounded-2xl border border-white/20">
              <span className="text-xs text-white/80 block">
                {lang === 'hi' ? 'अंतिम स्कोर' : 'Final Score'}
              </span>
              <span className="text-3xl font-black text-amber-400">
                {score + Math.floor(distance)}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'hi' ? 'दोबारा खेलें' : 'Play Again'}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBack();
                }}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-black rounded-xl text-xs active:scale-95 transition-all"
              >
                <span>{lang === 'hi' ? 'मेन्यू' : 'Menu'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch Jump Big Button for Mobile */}
      <div className="mt-3 flex justify-center sm:hidden">
        <button
          onClick={jump}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm rounded-2xl shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>{lang === 'hi' ? 'छलांग लगाएं (JUMP!)' : 'JUMP NOW!'}</span>
        </button>
      </div>
    </div>
  );
};
