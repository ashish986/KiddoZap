import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Star, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface TowerStackProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

interface BlockLayer {
  y: number;
  x: number;
  width: number;
  color: string;
}

const COLORS = [
  'bg-red-400',
  'bg-orange-400',
  'bg-amber-400',
  'bg-emerald-400',
  'bg-teal-400',
  'bg-cyan-400',
  'bg-blue-400',
  'bg-indigo-400',
  'bg-purple-400',
  'bg-pink-400',
];

export const TowerStack: React.FC<TowerStackProps> = ({
  lang,
  onBack,
  onGameComplete,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [blocks, setBlocks] = useState<BlockLayer[]>([]);

  // Current sliding block
  const [sliderX, setSliderX] = useState<number>(50); // percentage
  const [sliderWidth, setSliderWidth] = useState<number>(40); // percentage
  const [sliderDirection, setSliderDirection] = useState<number>(1);
  const animRef = useRef<number | null>(null);

  const initGame = () => {
    sounds.playPop(1.1);
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setSliderWidth(40);
    setSliderX(50);
    setSliderDirection(1);

    // Initial base block
    setBlocks([
      {
        y: 0,
        x: 50,
        width: 40,
        color: 'bg-emerald-500',
      },
    ]);
  };

  // Sliding animation loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    let lastTime = performance.now();
    const speed = 40 + Math.min(score * 2.5, 45); // percent per second

    const updateSlider = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      setSliderX((prev) => {
        let next = prev + sliderDirection * speed * dt;
        if (next + sliderWidth / 2 >= 95) {
          next = 95 - sliderWidth / 2;
          setSliderDirection(-1);
        } else if (next - sliderWidth / 2 <= 5) {
          next = 5 + sliderWidth / 2;
          setSliderDirection(1);
        }
        return next;
      });

      animRef.current = requestAnimationFrame(updateSlider);
    };

    animRef.current = requestAnimationFrame(updateSlider);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, isGameOver, sliderDirection, sliderWidth, score]);

  const dropBlock = () => {
    if (!isPlaying || isGameOver) return;

    const topBlock = blocks[blocks.length - 1];
    const diff = sliderX - topBlock.x;
    const absDiff = Math.abs(diff);

    // If missed entirely
    if (absDiff >= topBlock.width) {
      sounds.playError();
      handleGameOver();
      return;
    }

    // Perfect placement check (< 3.2% deviation)
    if (absDiff < 3.2) {
      sounds.playChime(1.5);
      const newLayer: BlockLayer = {
        y: blocks.length,
        x: topBlock.x, // snapped to center
        width: topBlock.width,
        color: COLORS[blocks.length % COLORS.length],
      };
      setBlocks((prev) => [...prev, newLayer]);
      setScore((s) => s + 2); // bonus for perfect
    } else {
      // Sliced block
      const newWidth = topBlock.width - absDiff;
      if (newWidth < 4) {
        sounds.playError();
        handleGameOver();
        return;
      }
      sounds.playPop(1.2);
      const newX = topBlock.x + diff / 2;

      const newLayer: BlockLayer = {
        y: blocks.length,
        x: newX,
        width: newWidth,
        color: COLORS[blocks.length % COLORS.length],
      };
      setBlocks((prev) => [...prev, newLayer]);
      setSliderWidth(newWidth);
      setScore((s) => s + 1);
    }
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsPlaying(false);
    sounds.playFanfare();
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    const stars = score >= 15 ? 3 : score >= 8 ? 2 : 1;
    onGameComplete(stars, score * 10);
  };

  return (
    <div className="max-w-md mx-auto px-3 sm:px-4 py-2">
      {/* Top Header */}
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

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-600 text-white rounded-xl font-black text-xs shadow-xs">
            <Trophy className="w-3.5 h-3.5" />
            <span>{score} {lang === 'hi' ? 'ब्लॉक' : 'Blocks'}</span>
          </div>
        </div>
      </div>

      {/* Main Tower Stacking Arena */}
      <div
        onClick={dropBlock}
        className="relative w-full h-[380px] rounded-3xl overflow-hidden shadow-lg border-4 border-cyan-300 bg-gradient-to-b from-indigo-900 via-sky-800 to-cyan-700 cursor-pointer select-none flex flex-col justify-end p-4"
      >
        {/* Sky Stars Background */}
        <div className="absolute top-6 left-8 text-xl opacity-60">✨</div>
        <div className="absolute top-14 right-12 text-2xl opacity-70">⭐</div>
        <div className="absolute top-24 left-1/2 text-sm opacity-50">✨</div>

        {/* The Current Sliding Block */}
        {isPlaying && (
          <div
            style={{
              bottom: `${(blocks.length) * 24 + 16}px`,
              left: `${sliderX - sliderWidth / 2}%`,
              width: `${sliderWidth}%`,
            }}
            className={`absolute h-6 rounded-lg shadow-md border-2 border-white/60 ${
              COLORS[blocks.length % COLORS.length]
            } transition-all duration-75`}
          />
        )}

        {/* The Tower Stack so far (Scrolls visually if high) */}
        <div className="relative w-full flex flex-col-reverse items-center">
          {blocks.map((b, i) => (
            <div
              key={i}
              style={{
                left: `${b.x - b.width / 2}%`,
                width: `${b.width}%`,
                bottom: `${i * 24}px`,
              }}
              className={`absolute h-6 rounded-lg shadow-sm border border-white/40 ${b.color}`}
            />
          ))}
        </div>

        {/* Start Game Screen */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center z-30">
            <div className="text-5xl mb-2 animate-bounce">🏗️</div>
            <h3 className="text-2xl font-black font-display text-cyan-300">
              {lang === 'hi' ? 'टावर ब्लॉक क्रैफ्टर' : 'Tower Block Crafter'}
            </h3>
            <p className="text-xs text-cyan-100 font-bold max-w-xs mt-1 mb-5">
              {lang === 'hi'
                ? 'हवा में चलते ब्लॉक को ठीक टावर के ऊपर रोकने के लिए कहीं भी टैप करें!'
                : 'Tap anywhere to drop the sliding block onto the tower with perfect precision!'}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                initGame();
              }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black rounded-2xl text-sm shadow-lg active:scale-95 transition-all"
            >
              <span>{lang === 'hi' ? 'टावर बनाएं!' : 'Start Stacking!'}</span>
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center z-30">
            <div className="text-5xl mb-2">🏰</div>
            <h3 className="text-2xl font-black font-display text-cyan-300">
              {lang === 'hi' ? 'शानदार टावर!' : 'Tower Complete!'}
            </h3>
            <div className="my-3 bg-white/10 px-5 py-2.5 rounded-2xl border border-white/20">
              <span className="text-xs text-white/80 block">
                {lang === 'hi' ? 'कुल ऊंचाई' : 'Total Height'}
              </span>
              <span className="text-3xl font-black text-cyan-300">
                {score} {lang === 'hi' ? 'मंजिलें' : 'Floors'}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  initGame();
                }}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
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

      {/* Tap Instruction */}
      {isPlaying && (
        <div className="mt-2 text-center text-xs font-bold text-slate-500">
          {lang === 'hi' ? 'ब्लॉक गिराने के लिए स्क्रीन पर कहीं भी टैप करें' : 'Tap anywhere to drop the block!'}
        </div>
      )}
    </div>
  );
};
