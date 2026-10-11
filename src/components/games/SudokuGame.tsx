import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';

// 4x4 Mini Sudoku or 9x9 Sudoku
const INITIAL_4X4 = [
  [1, 0, 3, 0],
  [0, 3, 0, 1],
  [0, 1, 0, 2],
  [2, 0, 4, 0],
];

const SOLUTION_4X4 = [
  [1, 2, 3, 4],
  [4, 3, 2, 1],
  [3, 1, 4, 2],
  [2, 4, 1, 3],
];

export const SudokuGame: React.FC<{ onGameOver?: (score: number) => void }> = () => {
  const [board, setBoard] = useState<number[][]>(() => INITIAL_4X4.map(row => [...row]));
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [isWon, setIsWon] = useState(false);
  const [errors, setErrors] = useState<number>(0);

  const handleCellClick = (r: number, c: number) => {
    soundManager.playPop();
    setSelectedCell({ r, c });
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || isWon) return;
    const { r, c } = selectedCell;

    // Is it original cell?
    if (INITIAL_4X4[r][c] !== 0) return;

    soundManager.playPop();
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = num;
    setBoard(newBoard);

    // Check correctness
    if (num !== SOLUTION_4X4[r][c]) {
      soundManager.playCrash();
      setErrors(e => e + 1);
    } else {
      soundManager.playScore();
    }

    // Check if won
    let complete = true;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newBoard[i][j] !== SOLUTION_4X4[i][j]) {
          complete = false;
        }
      }
    }
    if (complete) {
      soundManager.playWin();
      setIsWon(true);
    }
  };

  const handleReset = () => {
    soundManager.playPop();
    setBoard(INITIAL_4X4.map(row => [...row]));
    setSelectedCell(null);
    setIsWon(false);
    setErrors(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-xs flex justify-between items-center mb-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm font-bold">
        <span className="text-indigo-400">Errors: <strong className="text-white">{errors}</strong></span>
        <button
          onClick={handleReset}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg cursor-pointer"
        >
          Reset ↻
        </button>
      </div>

      <div className="w-72 h-72 bg-slate-950 border-2 border-indigo-500/50 rounded-2xl p-3 shadow-2xl relative grid grid-cols-4 gap-2">
        {board.map((row, r) =>
          row.map((val, c) => {
            const isInitial = INITIAL_4X4[r][c] !== 0;
            const isSelected = selectedCell?.r === r && selectedCell?.c === c;
            const isWrong = val !== 0 && val !== SOLUTION_4X4[r][c];

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`rounded-xl flex items-center justify-center text-3xl font-black transition-all cursor-pointer ${
                  isInitial
                    ? 'bg-slate-900 text-slate-300 font-extrabold cursor-not-allowed'
                    : isWrong
                    ? 'bg-rose-950/80 text-rose-400 border border-rose-500'
                    : val !== 0
                    ? 'bg-indigo-950/80 text-cyan-300 border border-indigo-500/50'
                    : 'bg-slate-900/50 hover:bg-slate-800 text-transparent'
                } ${isSelected ? 'ring-3 ring-cyan-400 scale-105' : ''}`}
              >
                {val !== 0 ? val : ''}
              </button>
            );
          })
        )}

        {isWon && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center rounded-2xl">
            <div className="text-5xl mb-2">🎉</div>
            <h3 className="text-2xl font-black text-indigo-400 mb-1">Sudoku Solved!</h3>
            <p className="text-slate-300 text-sm mb-4">You solved all the numbers logically!</p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-black rounded-xl shadow-lg cursor-pointer"
            >
              Play Again ↻
            </button>
          </div>
        )}
      </div>

      {/* Number input bar */}
      <div className="mt-4 flex gap-3">
        {[1, 2, 3, 4].map(num => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            className="w-12 h-12 bg-slate-800 hover:bg-indigo-600 text-white text-xl font-black rounded-xl shadow-md border border-slate-700 active:scale-95 transition-all cursor-pointer"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};
