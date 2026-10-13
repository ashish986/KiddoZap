import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Star } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Connect4Props {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, wins: number) => void;
}

const ROWS = 6;
const COLS = 7;
type Player = 'red' | 'yellow' | null;

export const ConnectFourGame: React.FC<Connect4Props> = ({ lang, onBack, onGameComplete }) => {
  const [grid, setGrid] = useState<Player[][]>(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const [turn, setTurn] = useState<'red' | 'yellow'>('red'); // Red = Player, Yellow = AI / P2
  const [winner, setWinner] = useState<'red' | 'yellow' | 'draw' | null>(null);
  const [isAiMode, setIsAiMode] = useState<boolean>(true);
  const [wins, setWins] = useState<number>(0);

  const resetBoard = () => {
    setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setTurn('red');
    setWinner(null);
  };

  const checkWin = (board: Player[][], player: 'red' | 'yellow') => {
    // Check horizontal
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (
          board[r][c] === player &&
          board[r][c + 1] === player &&
          board[r][c + 2] === player &&
          board[r][c + 3] === player
        ) return true;
      }
    }
    // Check vertical
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 0; c < COLS; c++) {
        if (
          board[r][c] === player &&
          board[r + 1][c] === player &&
          board[r + 2][c] === player &&
          board[r + 3][c] === player
        ) return true;
      }
    }
    // Check diagonal (down-right)
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (
          board[r][c] === player &&
          board[r + 1][c + 1] === player &&
          board[r + 2][c + 2] === player &&
          board[r + 3][c + 3] === player
        ) return true;
      }
    }
    // Check diagonal (up-right)
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (
          board[r][c] === player &&
          board[r - 1][c + 1] === player &&
          board[r - 2][c + 2] === player &&
          board[r - 3][c + 3] === player
        ) return true;
      }
    }
    return false;
  };

  const dropDisc = (colIndex: number) => {
    if (winner) return;

    // Find lowest empty row in column
    let rowIndex = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!grid[r][colIndex]) {
        rowIndex = r;
        break;
      }
    }

    if (rowIndex === -1) return; // Column full

    sounds.tap();
    const newGrid = grid.map((row) => [...row]);
    newGrid[rowIndex][colIndex] = turn;
    setGrid(newGrid);

    if (checkWin(newGrid, turn)) {
      setWinner(turn);
      sounds.complete();
      if (turn === 'red') {
        confetti({ particleCount: 35, spread: 60 });
        setWins((w) => w + 1);
        onGameComplete(3, wins + 1);
      }
      return;
    }

    // Check draw
    if (newGrid.every((row) => row.every((cell) => cell !== null))) {
      setWinner('draw');
      return;
    }

    setTurn(turn === 'red' ? 'yellow' : 'red');
  };

  // AI Turn
  useEffect(() => {
    if (isAiMode && turn === 'yellow' && !winner) {
      const timer = setTimeout(() => {
        // AI selects valid column
        const validCols: number[] = [];
        for (let c = 0; c < COLS; c++) {
          if (!grid[0][c]) validCols.push(c);
        }
        if (validCols.length > 0) {
          const chosenCol = validCols[Math.floor(Math.random() * validCols.length)];
          dropDisc(chosenCol);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [turn, isAiMode, winner, grid]);

  return (
    <div id="game-connect4" className="max-w-xl mx-auto p-4 flex flex-col items-center">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-4 bg-white/90 backdrop-blur px-4 py-2.5 rounded-2xl shadow-sm border border-blue-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'hi' ? 'वापस' : 'Back'}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsAiMode((m) => !m);
              resetBoard();
            }}
            className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-xl border border-blue-200 text-xs font-bold"
          >
            {isAiMode ? (lang === 'hi' ? 'रोबोट vs आप' : 'vs Smart AI') : (lang === 'hi' ? 'दोस्त vs आप' : '2-Player')}
          </button>
          <div className="px-3 py-1 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 font-black text-sm">
            🏆 {wins}
          </div>
        </div>

        <button onClick={resetBoard} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700" title="Restart">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Four in a Line Board */}
      <div className="w-full max-w-md bg-blue-600 p-3 sm:p-4 rounded-3xl shadow-2xl border-4 border-blue-700">
        {/* Column selectors */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {Array.from({ length: COLS }).map((_, c) => (
            <button
              key={c}
              onClick={() => dropDisc(c)}
              className="h-8 rounded-xl bg-blue-500 hover:bg-blue-400 active:bg-blue-300 text-white font-black text-xs transition flex items-center justify-center shadow"
            >
              ▼
            </button>
          ))}
        </div>

        {/* Holes Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 bg-blue-700 p-2 rounded-2xl">
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                onClick={() => dropDisc(c)}
                className="aspect-square bg-blue-900/80 rounded-full shadow-inner flex items-center justify-center cursor-pointer p-0.5"
              >
                {cell && (
                  <motion.div
                    initial={{ y: -50, scale: 0.8 }}
                    animate={{ y: 0, scale: 1 }}
                    className={`w-full h-full rounded-full shadow-md flex items-center justify-center text-sm ${
                      cell === 'red'
                        ? 'bg-gradient-to-br from-red-400 to-rose-600 ring-2 ring-red-300'
                        : 'bg-gradient-to-br from-amber-300 to-yellow-500 ring-2 ring-yellow-200'
                    }`}
                  >
                    {cell === 'red' ? '🔴' : '🟡'}
                  </motion.div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Winner Overlay Modal */}
      {winner && (
        <div className="mt-4 p-4 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col items-center">
          <span className="text-3xl mb-1">{winner === 'red' ? '🎉' : winner === 'yellow' ? '🤖' : '🤝'}</span>
          <h4 className="text-lg font-black text-slate-800 font-fredoka">
            {winner === 'draw'
              ? (lang === 'hi' ? 'बराबरी (Draw)!' : 'It is a Draw!')
              : winner === 'red'
              ? (lang === 'hi' ? 'शानदार! लाल रंग जीत गया!' : 'Hooray! Red Player Won!')
              : (lang === 'hi' ? 'पीला रंग (रोबोट) जीत गया!' : 'Yellow Won!')}
          </h4>
          <button
            onClick={resetBoard}
            className="mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition"
          >
            {lang === 'hi' ? 'फिर से खेलें' : 'Play Again'}
          </button>
        </div>
      )}
    </div>
  );
};
