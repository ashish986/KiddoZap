import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Star, Sparkles, User, Bot, Users } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface TicTacToeProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, wins: number) => void;
}

type CellValue = 'X' | 'O' | null;
type GameMode = 'ai' | 'pvp';
type AIDifficulty = 'easy' | 'medium' | 'master';
type MarkerTheme = 'classic' | 'stars' | 'elements';

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const TicTacToeGame: React.FC<TicTacToeProps> = ({ lang, onBack, onGameComplete }) => {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<CellValue | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medium');
  const [theme, setTheme] = useState<MarkerTheme>('stars');
  const [scores, setScores] = useState({ x: 0, o: 0, draws: 0 });
  const [stars, setStars] = useState<number>(0);

  // Symbol renderer
  const renderMarker = (val: CellValue) => {
    if (!val) return null;
    if (theme === 'stars') {
      return val === 'X' ? '⭐' : '🌙';
    }
    if (theme === 'elements') {
      return val === 'X' ? '🔥' : '💧';
    }
    return val;
  };

  const checkWinner = (squares: CellValue[]) => {
    for (let i = 0; i < WINNING_COMBOS.length; i++) {
      const [a, b, c] = WINNING_COMBOS[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    if (squares.every((s) => s !== null)) {
      return { winner: 'draw' as const, line: null };
    }
    return null;
  };

  // AI Move calculation
  const getBestMove = (squares: CellValue[], diff: AIDifficulty): number => {
    const available = squares
      .map((val, idx) => (val === null ? idx : null))
      .filter((v): v is number => v !== null);

    if (available.length === 0) return -1;

    // Easy: pure random
    if (diff === 'easy') {
      return available[Math.floor(Math.random() * available.length)];
    }

    // Medium: Win if can, block opponent if in danger (65% smart)
    // 1. Check if AI ('O') can win this turn
    for (const idx of available) {
      const copy = [...squares];
      copy[idx] = 'O';
      if (checkWinner(copy)?.winner === 'O') return idx;
    }

    // 2. Check if Opponent ('X') could win next turn and block
    for (const idx of available) {
      const copy = [...squares];
      copy[idx] = 'X';
      if (checkWinner(copy)?.winner === 'X') return idx;
    }

    if (diff === 'medium' && Math.random() < 0.35) {
      return available[Math.floor(Math.random() * available.length)];
    }

    // 3. Center square is best
    if (squares[4] === null) return 4;

    // 4. Corners
    const corners = [0, 2, 6, 8].filter((idx) => squares[idx] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    return available[Math.floor(Math.random() * available.length)];
  };

  // Handle player click
  const handleCellClick = (idx: number) => {
    if (board[idx] || winner) return;

    sounds.playPop(isXNext ? 1.2 : 0.9);
    const newBoard = [...board];
    newBoard[idx] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      handleEndGame(result.winner, result.line);
      return;
    }

    setIsXNext(!isXNext);
  };

  // Trigger AI move when it's O's turn in AI mode
  useEffect(() => {
    if (gameMode === 'ai' && !isXNext && !winner) {
      const timer = setTimeout(() => {
        const move = getBestMove(board, difficulty);
        if (move !== -1) {
          sounds.playPop(0.9);
          const newBoard = [...board];
          newBoard[move] = 'O';
          setBoard(newBoard);

          const result = checkWinner(newBoard);
          if (result) {
            handleEndGame(result.winner, result.line);
          } else {
            setIsXNext(true);
          }
        }
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [isXNext, gameMode, winner, board, difficulty]);

  const handleEndGame = (gameWinner: CellValue | 'draw', line: number[] | null) => {
    setWinner(gameWinner);
    setWinningLine(line);

    if (gameWinner === 'draw') {
      sounds.playPop(0.8);
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
    } else if (gameWinner === 'X') {
      sounds.playFanfare();
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      setScores((prev) => {
        const nextX = prev.x + 1;
        const earned = Math.min(3, nextX);
        setStars(earned);
        onGameComplete(earned, nextX);
        return { ...prev, x: nextX };
      });
    } else {
      sounds.playBuzz();
      setScores((prev) => ({ ...prev, o: prev.o + 1 }));
    }
  };

  const resetRound = () => {
    sounds.playPop();
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col items-center justify-between p-2 sm:p-3 select-none overflow-hidden">
      {/* Top Header */}
      <div className="w-full max-w-md flex items-center justify-between gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-amber-200/80 shadow-xs">
        <button
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shadow-2xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-1 font-black text-xs text-slate-800">
          <span>🧠</span>
          <span>{lang === 'hi' ? 'टिक-टैक-टो' : 'Tic Tac Toe'}</span>
        </div>

        {/* Mode Toggle & Reset */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => {
                sounds.playPop();
                setGameMode('ai');
                resetRound();
              }}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] transition-all ${
                gameMode === 'ai' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              <Bot className="w-3 h-3 text-indigo-600" />
              <span>AI</span>
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setGameMode('pvp');
                resetRound();
              }}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] transition-all ${
                gameMode === 'pvp' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              <Users className="w-3 h-3 text-emerald-600" />
              <span>2P</span>
            </button>
          </div>

          <button
            onClick={resetRound}
            className="p-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-all active:scale-95"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Score & Status Bar */}
      <div className="w-full max-w-md flex items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2 bg-amber-50/80 px-2.5 py-1 rounded-xl border border-amber-200 text-amber-900 font-bold">
          <span>{renderMarker('X')} {scores.x}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">🤝 {scores.draws}</span>
          <span className="text-slate-300">|</span>
          <span className="text-indigo-900">{renderMarker('O')} {scores.o}</span>
        </div>

        {/* Turn status */}
        <div className="font-bold text-xs">
          {winner === 'draw' ? (
            <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800">
              🤝 {lang === 'hi' ? 'बराबरी' : 'Draw'}
            </span>
          ) : winner ? (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{winner === 'X' ? (gameMode === 'ai' ? 'You Won! 🎉' : 'P1 Won! 🎉') : (gameMode === 'ai' ? 'AI Won!' : 'P2 Won!')}</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-slate-700">
              {isXNext ? `${renderMarker('X')} Turn` : `${renderMarker('O')} Turn`}
            </span>
          )}
        </div>
      </div>

      {/* 3x3 Tic Tac Toe Grid - Centered & Responsive */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center p-1 relative">
        <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 p-2 sm:p-3 rounded-3xl shadow-xl border-4 border-amber-300 h-full max-h-[min(48vh,290px)] aspect-square flex flex-col justify-center">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full h-full">
            {board.map((val, idx) => {
              const isWinningCell = winningLine?.includes(idx);
              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: val ? 1 : 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCellClick(idx)}
                  disabled={Boolean(val) || Boolean(winner) || (gameMode === 'ai' && !isXNext)}
                  className={`w-full h-full rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl select-none transition-all shadow-sm ${
                    isWinningCell
                      ? 'bg-emerald-400 text-white ring-4 ring-white animate-pulse'
                      : val
                        ? 'bg-white text-slate-800'
                        : 'bg-white/90 hover:bg-white text-transparent cursor-pointer'
                  }`}
                >
                  {val ? renderMarker(val) : ''}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Controls / Play Again */}
      <div className="w-full max-w-xs flex items-center justify-center gap-2 pb-1">
        {winner ? (
          <button
            onClick={resetRound}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'अगला राउंड खेलें' : 'Play Next Round'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 bg-white/80 backdrop-blur px-3 py-1 rounded-xl border border-amber-200 text-xs">
            <span className="text-[11px] font-bold text-slate-500">{lang === 'hi' ? 'थीम:' : 'Theme:'}</span>
            {(['stars', 'elements', 'classic'] as MarkerTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  sounds.playPop();
                  setTheme(t);
                }}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  theme === t ? 'bg-amber-100 text-amber-900 font-black' : 'text-slate-500'
                }`}
              >
                {t === 'stars' ? '⭐/🌙' : t === 'elements' ? '🔥/💧' : 'X/O'}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
