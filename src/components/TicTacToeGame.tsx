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
    <div className="w-full max-w-2xl mx-auto p-3 sm:p-5 flex flex-col items-center">
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
            <span>🧠</span>
            <span>{lang === 'hi' ? 'टिक-टैक-टो (X & O)' : 'Tic Tac Toe Brain'}</span>
          </h2>
          <p className="text-[11px] font-bold text-amber-700">
            {lang === 'hi' ? '3 का जोड़ा बनाएं और जीतें!' : 'Match 3 in a row to win!'}
          </p>
        </div>

        <button
          onClick={resetRound}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-2xs active:scale-95 transition-all"
          title={lang === 'hi' ? 'नया राउंड' : 'New Round'}
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">{lang === 'hi' ? 'रीसेट' : 'Reset'}</span>
        </button>
      </div>

      {/* Mode & Theme Controls */}
      <div className="w-full bg-white rounded-2xl p-3 border border-amber-200/80 shadow-xs mb-4 flex flex-wrap items-center justify-between gap-2">
        {/* Game Mode (AI vs 2-Player) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => {
              sounds.playPop();
              setGameMode('ai');
              resetRound();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              gameMode === 'ai' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-600" />
            <span>{lang === 'hi' ? 'बॉट AI' : 'Vs AI'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setGameMode('pvp');
              resetRound();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              gameMode === 'pvp' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'hi' ? '2 खिलाड़ी' : '2-Player'}</span>
          </button>
        </div>

        {/* AI Difficulty (if in AI mode) */}
        {gameMode === 'ai' && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[11px] font-bold text-slate-500 mr-1">
              {lang === 'hi' ? 'स्तर:' : 'Level:'}
            </span>
            {(['easy', 'medium', 'master'] as AIDifficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  sounds.playPop();
                  setDifficulty(d);
                  resetRound();
                }}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold capitalize transition-all ${
                  difficulty === d
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d === 'easy' ? (lang === 'hi' ? 'सरल' : 'Easy') : d === 'medium' ? (lang === 'hi' ? 'मध्यम' : 'Medium') : (lang === 'hi' ? 'मास्टर' : 'Master')}
              </button>
            ))}
          </div>
        )}

        {/* Theme Marker Selector */}
        <div className="flex items-center gap-1">
          {(['stars', 'elements', 'classic'] as MarkerTheme[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                sounds.playPop();
                setTheme(t);
              }}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                theme === t ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-50 text-slate-500'
              }`}
            >
              {t === 'stars' ? '⭐/🌙' : t === 'elements' ? '🔥/💧' : 'X/O'}
            </button>
          ))}
        </div>
      </div>

      {/* Scoreboard Cards */}
      <div className="w-full grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5">
          <span className="text-base">{renderMarker('X')}</span>
          <div className="text-[10px] font-bold text-amber-800 uppercase mt-0.5">
            {gameMode === 'ai' ? (lang === 'hi' ? 'आप (खिलाड़ी)' : 'You (P1)') : 'Player 1'}
          </div>
          <div className="text-xl font-black text-amber-900">{scores.x}</div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5">
          <span className="text-base">🤝</span>
          <div className="text-[10px] font-bold text-slate-600 uppercase mt-0.5">
            {lang === 'hi' ? 'बराबरी' : 'Ties'}
          </div>
          <div className="text-xl font-black text-slate-800">{scores.draws}</div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-2.5">
          <span className="text-base">{renderMarker('O')}</span>
          <div className="text-[10px] font-bold text-indigo-800 uppercase mt-0.5">
            {gameMode === 'ai' ? (lang === 'hi' ? 'कंप्यूटर AI' : 'Smart AI') : 'Player 2'}
          </div>
          <div className="text-xl font-black text-indigo-900">{scores.o}</div>
        </div>
      </div>

      {/* Current Turn Status Banner */}
      <div className="mb-4 text-center font-bold text-sm">
        {winner === 'draw' ? (
          <span className="px-4 py-1.5 rounded-full bg-slate-200 text-slate-800 animate-pulse">
            {lang === 'hi' ? '🤝 खेल बराबर रहा!' : '🤝 Match Draw!'}
          </span>
        ) : winner ? (
          <span className="px-4 py-1.5 rounded-full bg-emerald-500 text-white shadow-md animate-bounce flex items-center gap-1.5 justify-center">
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span>
              {winner === 'X'
                ? lang === 'hi'
                  ? '🎉 बधाई! आप जीत गए!'
                  : '🎉 Player 1 / You Won!'
                : lang === 'hi'
                  ? '🤖 कंप्यूटर AI जीता!'
                  : '🤖 AI / Player 2 Won!'}
            </span>
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1.5 justify-center">
            <span>{isXNext ? renderMarker('X') : renderMarker('O')}</span>
            <span>
              {isXNext
                ? lang === 'hi'
                  ? 'आपकी बारी (Player 1)'
                  : "Player 1's Turn"
                : gameMode === 'ai'
                  ? lang === 'hi'
                    ? 'कंप्यूटर सोच रहा है...'
                    : 'AI is thinking...'
                  : lang === 'hi'
                    ? "Player 2 की बारी"
                    : "Player 2's Turn"}
            </span>
          </span>
        )}
      </div>

      {/* 3x3 Tic Tac Toe Grid */}
      <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 p-3 sm:p-4 rounded-3xl shadow-xl border-4 border-amber-300 w-full max-w-sm aspect-square">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full h-full">
          {board.map((val, idx) => {
            const isWinningCell = winningLine?.includes(idx);
            return (
              <motion.button
                key={idx}
                whileHover={{ scale: val ? 1 : 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCellClick(idx)}
                disabled={Boolean(val) || Boolean(winner) || (gameMode === 'ai' && !isXNext)}
                className={`w-full h-full rounded-2xl flex items-center justify-center font-black text-3xl sm:text-4xl select-none transition-all shadow-md ${
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

      {/* Play Again Button on Game End */}
      {winner && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5"
        >
          <button
            onClick={resetRound}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-lg active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === 'hi' ? 'अगला राउंड खेलें' : 'Play Next Round'}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
