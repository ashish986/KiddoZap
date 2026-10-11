import React, { useState } from 'react';
import { GameInfo } from '../data/games';
import { soundManager } from '../utils/audio';
import { SnakeGame } from './games/SnakeGame';
import { MathSprintGame } from './games/MathSprintGame';
import { MemoryMatchGame } from './games/MemoryMatchGame';
import { TicTacToeGame } from './games/TicTacToeGame';
import { SudokuGame } from './games/SudokuGame';
import { FlappyHeroGame } from './games/FlappyHeroGame';
import { GeoDashGame } from './games/GeoDashGame';
import { WhackAMoleGame } from './games/WhackAMoleGame';
import { AimTrainerGame } from './games/AimTrainerGame';
import { BrickBreakerGame } from './games/BrickBreakerGame';
import { GenericArcadeGame } from './games/GenericArcadeGame';

interface GameContainerProps {
  game: GameInfo;
  onBack: () => void;
  embed?: boolean;
}

export const GameContainer: React.FC<GameContainerProps> = ({ game, onBack, embed = false }) => {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [showInfo, setShowInfo] = useState(false);

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const renderGameContent = () => {
    switch (game.id) {
      case 'snake':
        return <SnakeGame />;
      case 'math-sprint':
        return <MathSprintGame />;
      case 'memory-match':
        return <MemoryMatchGame />;
      case 'tic-tac-toe':
        return <TicTacToeGame />;
      case 'sudoku':
        return <SudokuGame />;
      case 'flappy-hero':
        return <FlappyHeroGame />;
      case 'geodash':
        return <GeoDashGame />;
      case 'whack-a-mole':
        return <WhackAMoleGame />;
      case 'aim-trainer':
        return <AimTrainerGame />;
      case 'brick-breaker':
        return <BrickBreakerGame />;
      default:
        return <GenericArcadeGame game={game} />;
    }
  };

  // If embed mode (e.g. ?game=sudoku&embed=1 in an iframe)
  if (embed) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 text-white">
        <div className="w-full max-w-lg flex items-center justify-between mb-2 px-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{game.icon}</span>
            <span className="font-extrabold text-sm text-cyan-300">{game.title}</span>
          </div>
          <button
            onClick={toggleSound}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
        {renderGameContent()}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <button
          onClick={() => {
            soundManager.playPop();
            onBack();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-cyan-400 font-extrabold text-sm rounded-xl transition-all cursor-pointer"
        >
          ← Back to Hub
        </button>

        <div className="flex items-center gap-3">
          <span className="text-2xl">{game.icon}</span>
          <div>
            <h2 className="text-lg font-black text-white">{game.title}</h2>
            <div className="flex gap-2 items-center text-xs text-slate-400 font-bold">
              <span className="text-cyan-400">{game.categoryLabel}</span>
              <span>•</span>
              <span className="text-emerald-400">{game.age}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-base transition-colors cursor-pointer"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {showInfo ? 'Hide Guide' : '📖 Guide'}
          </button>
        </div>
      </div>

      {/* Game Window Card */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center min-h-[460px] relative">
        {renderGameContent()}
      </div>

      {/* Educational & Controls Guide Panel */}
      {showInfo && (
        <div className="mt-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl animate-fade-in">
          <h3 className="text-base font-black text-white mb-2 flex items-center gap-2">
            <span>🎮</span> How to Play &amp; Controls
          </h3>
          <p className="text-slate-300 text-sm mb-4 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            {game.controls}
          </p>

          <h3 className="text-base font-black text-cyan-400 mb-2 flex items-center gap-2">
            <span>🧠</span> Cognitive &amp; Educational Benefits
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {game.educationalBenefits.map((benefit, i) => (
              <li
                key={i}
                className="bg-slate-950 text-slate-300 text-xs font-semibold p-3 rounded-xl border border-slate-800/80 flex items-center gap-2"
              >
                <span className="text-cyan-400">✔</span> {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
