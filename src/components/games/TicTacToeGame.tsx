import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';

type SquareValue = 'X' | 'O' | null;

export const TicTacToeGame: React.FC<{ onGameOver?: (score: number) => void }> = () => {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState<'bot' | 'pvp'>('bot');
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);

  const calculateWinner = (squares: SquareValue[]): { winner: SquareValue; line: number[] | null } => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return { winner: null, line: null };
  };

  const { winner, line: winningLine } = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);

  const makeBotMove = (currentBoard: SquareValue[]) => {
    // 1. Try to win
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const copy = [...currentBoard];
        copy[i] = 'O';
        if (calculateWinner(copy).winner === 'O') {
          return i;
        }
      }
    }
    // 2. Block X from winning
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const copy = [...currentBoard];
        copy[i] = 'X';
        if (calculateWinner(copy).winner === 'X') {
          return i;
        }
      }
    }
    // 3. Take center
    if (!currentBoard[4]) return 4;
    // 4. Random available
    const available = currentBoard.map((val, idx) => (val === null ? idx : null)).filter(v => v !== null) as number[];
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }
    return -1;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || isDraw) return;

    soundManager.playPop();
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const winResult = calculateWinner(newBoard);
    if (winResult.winner) {
      soundManager.playWin();
      if (winResult.winner === 'X') setScoreX(s => s + 1);
      else setScoreO(s => s + 1);
      return;
    }

    if (newBoard.every(sq => sq !== null)) {
      soundManager.playCrash();
      return;
    }

    if (gameMode === 'bot' && isXNext) {
      setIsXNext(false);
      setTimeout(() => {
        const botIndex = makeBotMove(newBoard);
        if (botIndex !== -1) {
          soundManager.playPop();
          const botBoard = [...newBoard];
          botBoard[botIndex] = 'O';
          setBoard(botBoard);
          const botWin = calculateWinner(botBoard);
          if (botWin.winner) {
            soundManager.playCrash();
            setScoreO(s => s + 1);
          }
          setIsXNext(true);
        }
      }, 400);
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = () => {
    soundManager.playPop();
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-xs flex justify-between items-center mb-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm font-bold">
        <span className="text-cyan-400">Player (X): <strong className="text-white">{scoreX}</strong></span>
        <span className="text-rose-400">{gameMode === 'bot' ? 'Bot (O)' : 'P2 (O)'}: <strong className="text-white">{scoreO}</strong></span>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => { setGameMode('bot'); resetGame(); }}
          className={`px-3 py-1 rounded-lg text-xs font-bold ${
            gameMode === 'bot' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}
        >
          🤖 vs Computer
        </button>
        <button
          onClick={() => { setGameMode('pvp'); resetGame(); }}
          className={`px-3 py-1 rounded-lg text-xs font-bold ${
            gameMode === 'pvp' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}
        >
          👥 2 Players
        </button>
      </div>

      <div className="w-72 h-72 bg-slate-950 border-2 border-slate-800 rounded-2xl p-3 shadow-2xl grid grid-cols-3 gap-2.5">
        {board.map((val, idx) => {
          const isWinningSquare = winningLine?.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className={`rounded-xl flex items-center justify-center text-4xl font-black transition-all cursor-pointer ${
                val === 'X'
                  ? 'text-cyan-400 bg-slate-900'
                  : val === 'O'
                  ? 'text-rose-400 bg-slate-900'
                  : 'bg-slate-900/60 hover:bg-slate-800'
              } ${isWinningSquare ? 'ring-4 ring-emerald-400 bg-emerald-950/60 animate-pulse' : ''}`}
            >
              {val}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="text-sm font-bold">
          {winner ? (
            <span className="text-emerald-400">Winner: <strong>{winner}</strong>! 🎉</span>
          ) : isDraw ? (
            <span className="text-amber-400">It's a Draw! 🤝</span>
          ) : (
            <span className="text-slate-400">Turn: <strong className={isXNext ? 'text-cyan-400' : 'text-rose-400'}>{isXNext ? 'X' : 'O'}</strong></span>
          )}
        </div>
        <button
          onClick={resetGame}
          className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg cursor-pointer"
        >
          New Round ↻
        </button>
      </div>
    </div>
  );
};
