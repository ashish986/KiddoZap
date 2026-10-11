import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';

export const AimTrainerGame: React.FC<{ onGameOver?: (score: number) => void }> = () => {
  const [target, setTarget] = useState<{ x: number; y: number; size: number } | null>(null);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const spawnTarget = () => {
    // Inside 300x300 container
    const size = Math.floor(Math.random() * 20) + 36;
    const x = Math.floor(Math.random() * (280 - size)) + 10;
    const y = Math.floor(Math.random() * (280 - size)) + 10;
    setTarget({ x, y, size });
  };

  const startGame = () => {
    soundManager.playPop();
    setHits(0);
    setMisses(0);
    setTimeLeft(20);
    setIsGameOver(false);
    setIsPlaying(true);
    spawnTarget();
  };

  const handleHit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPlaying || isGameOver) return;
    soundManager.playScore();
    setHits(h => h + 1);
    spawnTarget();
  };

  const handleMiss = () => {
    if (!isPlaying || isGameOver) return;
    soundManager.playCrash();
    setMisses(m => m + 1);
  };

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          soundManager.playWin();
          setIsGameOver(true);
          setIsPlaying(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isGameOver]);

  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 100;

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-xs flex justify-between items-center mb-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm font-bold">
        <span className="text-amber-400">Time: <strong className="text-white">{timeLeft}s</strong></span>
        <span className="text-emerald-400">Hits: <strong className="text-white">{hits}</strong></span>
        <span className="text-cyan-400">Acc: <strong className="text-white">{accuracy}%</strong></span>
      </div>

      <div
        onClick={handleMiss}
        className="w-[300px] h-[300px] bg-slate-950 border-2 border-emerald-500/50 rounded-2xl relative shadow-2xl overflow-hidden cursor-crosshair"
      >
        {isPlaying && !isGameOver && target && (
          <button
            onClick={handleHit}
            style={{
              left: `${target.x}px`,
              top: `${target.y}px`,
              width: `${target.size}px`,
              height: `${target.size}px`,
            }}
            className="absolute rounded-full bg-rose-500 border-3 border-white shadow-lg shadow-rose-500/80 active:scale-90 flex items-center justify-center transition-transform cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-yellow-300" />
          </button>
        )}

        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            {isGameOver ? (
              <>
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="text-2xl font-black text-emerald-400 mb-1">Great Shooting!</h3>
                <p className="text-slate-300 text-sm mb-1">Targets Hit: <strong className="text-white">{hits}</strong></p>
                <p className="text-slate-400 text-xs mb-4">Accuracy: <strong className="text-white">{accuracy}%</strong></p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="text-2xl font-black text-emerald-400 mb-1">Aim Reflex Trainer</h3>
                <p className="text-slate-400 text-xs mb-4">Click red bullseye targets as fast as they appear!</p>
              </>
            )}

            <button
              onClick={e => {
                e.stopPropagation();
                startGame();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-xl shadow-lg cursor-pointer active:scale-95"
            >
              {isGameOver ? 'Try Again ↻' : 'Start Training ⚡'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
