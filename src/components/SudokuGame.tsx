import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Lightbulb, Trophy, Star, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface SudokuProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, puzzles: number) => void;
}

// 4x4 Sudoku Puzzles (0 represents empty cell)
interface PuzzlePreset {
  initial: number[];
  solution: number[];
  difficulty: 'easy' | 'medium';
}

const PUZZLES: PuzzlePreset[] = [
  {
    // Easy: 8 prefilled
    initial: [
      1, 0, 0, 4,
      0, 4, 1, 0,
      0, 1, 4, 0,
      4, 0, 0, 1,
    ],
    solution: [
      1, 2, 3, 4,
      3, 4, 1, 2,
      2, 1, 4, 3,
      4, 3, 2, 1,
    ],
    difficulty: 'easy',
  },
  {
    // Easy: 8 prefilled
    initial: [
      0, 2, 4, 0,
      1, 0, 0, 3,
      4, 0, 0, 2,
      0, 1, 3, 0,
    ],
    solution: [
      3, 2, 4, 1,
      1, 4, 2, 3,
      4, 3, 1, 2,
      2, 1, 3, 4,
    ],
    difficulty: 'easy',
  },
  {
    // Medium: 6 prefilled
    initial: [
      0, 0, 3, 0,
      2, 0, 0, 4,
      0, 0, 0, 1,
      4, 1, 0, 0,
    ],
    solution: [
      1, 4, 3, 2,
      2, 3, 1, 4,
      3, 2, 4, 1,
      4, 1, 2, 3,
    ],
    difficulty: 'medium',
  },
  {
    // Medium: 6 prefilled
    initial: [
      2, 0, 0, 1,
      0, 0, 2, 0,
      0, 1, 0, 0,
      4, 0, 0, 3,
    ],
    solution: [
      2, 3, 4, 1,
      1, 4, 2, 3,
      3, 1, 4, 2,
      4, 2, 1, 3,
    ],
    difficulty: 'medium',
  },
];

const ANIMAL_SYMBOLS: Record<number, string> = {
  1: '🦁',
  2: '🐼',
  3: '🦊',
  4: '🐸',
};

export const SudokuGame: React.FC<SudokuProps> = ({ lang, onBack, onGameComplete }) => {
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const [grid, setGrid] = useState<number[]>([]);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [mode, setMode] = useState<'numbers' | 'animals'>('animals');
  const [completed, setCompleted] = useState<boolean>(false);
  const [errorCell, setErrorCell] = useState<number | null>(null);
  const [hintsLeft, setHintsLeft] = useState<number>(3);
  const [puzzlesSolved, setPuzzlesSolved] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);

  const currentPuzzle = PUZZLES[puzzleIndex];

  // Initialize Puzzle
  useEffect(() => {
    setGrid([...currentPuzzle.initial]);
    setSelectedCell(null);
    setCompleted(false);
    setErrorCell(null);
    setTimer(0);
  }, [puzzleIndex]);

  // Timer
  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [completed]);

  const isInitialCell = (idx: number) => {
    return currentPuzzle.initial[idx] !== 0;
  };

  const handleCellSelect = (idx: number) => {
    if (isInitialCell(idx) || completed) return;
    sounds.playPop(1.1);
    setSelectedCell(idx);
    setErrorCell(null);
  };

  // Place number into selected cell
  const handleInputNumber = (val: number) => {
    if (selectedCell === null || completed) return;

    sounds.playPop(1.2);
    const newGrid = [...grid];
    newGrid[selectedCell] = val;
    setGrid(newGrid);

    // Check if right number according to solution
    if (val !== currentPuzzle.solution[selectedCell]) {
      sounds.playBuzz();
      setErrorCell(selectedCell);
      setTimeout(() => setErrorCell(null), 1200);
    } else {
      sounds.playChime(1.1);
    }

    // Check if entire puzzle is correctly filled
    const allFilled = newGrid.every((cell) => cell !== 0);
    const isAllCorrect = newGrid.every((cell, i) => cell === currentPuzzle.solution[i]);

    if (allFilled && isAllCorrect) {
      handlePuzzleWin();
    }
  };

  const handleClearCell = () => {
    if (selectedCell === null || isInitialCell(selectedCell) || completed) return;
    sounds.playPop(0.9);
    const newGrid = [...grid];
    newGrid[selectedCell] = 0;
    setGrid(newGrid);
    setErrorCell(null);
  };

  const handleHint = () => {
    if (hintsLeft <= 0 || completed) return;

    // Find first empty or wrong cell
    const emptyIndices = grid
      .map((val, idx) => (val !== currentPuzzle.solution[idx] ? idx : null))
      .filter((v): v is number => v !== null && !isInitialCell(v));

    if (emptyIndices.length > 0) {
      sounds.playChime(1.3);
      const targetIdx = emptyIndices[0];
      const newGrid = [...grid];
      newGrid[targetIdx] = currentPuzzle.solution[targetIdx];
      setGrid(newGrid);
      setSelectedCell(targetIdx);
      setHintsLeft((h) => h - 1);

      // Check win
      if (newGrid.every((cell, i) => cell === currentPuzzle.solution[i])) {
        handlePuzzleWin();
      }
    }
  };

  const handlePuzzleWin = () => {
    sounds.playFanfare();
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    setCompleted(true);
    setPuzzlesSolved((p) => p + 1);
    onGameComplete(3, puzzlesSolved + 1);
  };

  const nextPuzzle = () => {
    sounds.playPop();
    setPuzzleIndex((prev) => (prev + 1) % PUZZLES.length);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const renderSymbol = (val: number) => {
    if (val === 0) return '';
    return mode === 'animals' ? ANIMAL_SYMBOLS[val] : val;
  };

  return (
    <div className="w-full max-w-xl mx-auto p-3 sm:p-5 flex flex-col items-center">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between gap-3 mb-4">
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
            <span>🧩</span>
            <span>{lang === 'hi' ? 'किड्डो सुडोकू (4x4)' : 'Kiddo Sudoku 4x4'}</span>
          </h2>
          <p className="text-[11px] font-bold text-amber-700">
            {lang === 'hi'
              ? 'हर लाइन और 2x2 ब्लॉक में 1-4 अलग प्रतीक भरें!'
              : 'Fill 1-4 without repeating in rows or 2x2 boxes!'}
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            setGrid([...currentPuzzle.initial]);
            setCompleted(false);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-2xs active:scale-95 transition-all"
          title={lang === 'hi' ? 'रीसेट' : 'Reset'}
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">{lang === 'hi' ? 'रीसेट' : 'Reset'}</span>
        </button>
      </div>

      {/* Control Bar: Theme toggle, timer, hints */}
      <div className="w-full bg-white rounded-2xl p-3 border border-amber-200/80 shadow-xs mb-4 flex items-center justify-between gap-2 flex-wrap text-xs">
        {/* Mode Toggle (Animals / Numbers) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => {
              sounds.playPop();
              setMode('animals');
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              mode === 'animals' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🦁</span>
            <span>{lang === 'hi' ? 'जानवर' : 'Animals'}</span>
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setMode('numbers');
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              mode === 'numbers' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>123</span>
            <span>{lang === 'hi' ? 'संख्या' : 'Numbers'}</span>
          </button>
        </div>

        {/* Timer & Level */}
        <div className="flex items-center gap-2 font-bold text-slate-600">
          <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
            ⏱️ {formatTime(timer)}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 uppercase text-[10px]">
            {currentPuzzle.difficulty === 'easy'
              ? lang === 'hi'
                ? 'आसान (Easy)'
                : 'Easy'
              : lang === 'hi'
                ? 'मध्यम (Med)'
                : 'Medium'}
          </span>
        </div>

        {/* Hint Button */}
        <button
          onClick={handleHint}
          disabled={hintsLeft <= 0 || completed}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 disabled:opacity-50"
        >
          <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
          <span>{lang === 'hi' ? `संकेत (${hintsLeft})` : `Hint (${hintsLeft})`}</span>
        </button>
      </div>

      {/* 4x4 Sudoku Board */}
      <div className="bg-amber-400 p-3 sm:p-4 rounded-3xl shadow-xl border-4 border-amber-300 w-full max-w-sm aspect-square mb-4">
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full h-full bg-amber-600/30 p-1.5 rounded-2xl">
          {grid.map((val, idx) => {
            const isInitial = isInitialCell(idx);
            const isSelected = selectedCell === idx;
            const isError = errorCell === idx;

            // 2x2 Box border styling
            const row = Math.floor(idx / 4);
            const col = idx % 4;
            const isRightBorder = col === 1;
            const isBottomBorder = row === 1;

            return (
              <button
                key={idx}
                onClick={() => handleCellSelect(idx)}
                className={`rounded-xl flex items-center justify-center font-black select-none text-2xl sm:text-3xl transition-all shadow-2xs ${
                  isRightBorder ? 'mr-1 sm:mr-1.5' : ''
                } ${isBottomBorder ? 'mb-1 sm:mb-1.5' : ''} ${
                  isError
                    ? 'bg-rose-400 text-white ring-4 ring-rose-500 animate-bounce'
                    : isSelected
                      ? 'bg-amber-100 text-amber-950 ring-4 ring-amber-500 scale-102'
                      : isInitial
                        ? 'bg-white text-slate-900 font-black cursor-default'
                        : val !== 0
                          ? 'bg-amber-50 text-indigo-900'
                          : 'bg-white/80 hover:bg-white text-transparent cursor-pointer'
                }`}
              >
                {renderSymbol(val)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Palette (Values 1-4 and Clear) */}
      {!completed && (
        <div className="w-full max-w-sm flex items-center justify-between gap-2 bg-white p-3 rounded-2xl border border-amber-200 shadow-xs">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => handleInputNumber(num)}
              className="flex-1 py-3 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-slate-900 font-black text-xl sm:text-2xl shadow-xs active:scale-95 transition-all flex items-center justify-center"
            >
              {renderSymbol(num)}
            </button>
          ))}
          <button
            onClick={handleClearCell}
            className="py-3 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs shadow-xs active:scale-95 transition-all"
            title="Clear Cell"
          >
            ✕
          </button>
        </div>
      )}

      {/* Celebration Card */}
      {completed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 rounded-2xl text-center shadow-lg border-2 border-emerald-400 mt-2"
        >
          <div className="flex items-center justify-center gap-1 text-yellow-300 text-xl mb-1">
            <Star className="w-6 h-6 fill-current" />
            <Star className="w-6 h-6 fill-current" />
            <Star className="w-6 h-6 fill-current" />
          </div>
          <h3 className="text-lg font-black font-display">
            {lang === 'hi' ? 'शानदार! सुडोकू पूरा हुआ! 🎉' : 'Awesome! Sudoku Solved! 🎉'}
          </h3>
          <p className="text-xs text-emerald-100 mt-1 mb-3">
            {lang === 'hi' ? `समय लगा: ${formatTime(timer)}` : `Time taken: ${formatTime(timer)}`}
          </p>
          <button
            onClick={nextPuzzle}
            className="w-full py-2.5 rounded-xl bg-white text-emerald-900 font-black text-xs shadow-md hover:bg-emerald-50 active:scale-95 transition-all"
          >
            {lang === 'hi' ? 'अगली पहेली खेलें ➔' : 'Play Next Puzzle ➔'}
          </button>
        </motion.div>
      )}
    </div>
  );
};
