import React, { useState } from 'react';
import { GameInfo, GAMES } from '../data/games';
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
  onSelectGame?: (game: GameInfo) => void;
  embed?: boolean;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  game,
  onBack,
  onSelectGame,
  embed = false,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'rules' | 'strategy' | 'brain' | 'faq'>('guide');

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleShare = () => {
    try {
      const shareUrl = `${window.location.origin}/games/${game.slug}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
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
      <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 text-white font-sans">
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

  const relatedGames = GAMES.filter(g => g.id !== game.id && g.category === game.category).slice(0, 3);
  const fallbackRelated = relatedGames.length < 3 ? GAMES.filter(g => g.id !== game.id).slice(0, 3) : relatedGames;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 font-sans">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4 overflow-x-auto whitespace-nowrap">
        <button onClick={onBack} className="hover:text-cyan-400 text-slate-400 font-bold cursor-pointer">
          KiddoZap Hub
        </button>
        <span>/</span>
        <span className="text-slate-400">{game.categoryLabel}</span>
        <span>/</span>
        <span className="text-cyan-400 font-extrabold">{game.title}</span>
      </nav>

      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playPop();
              onBack();
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-cyan-400 font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
          >
            ← Back to Hub
          </button>
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-2xl shadow">
            {game.icon}
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-black text-white">{game.title}</h1>
            <div className="flex gap-2 items-center text-[11px] font-bold text-slate-400">
              <span className="text-cyan-400">{game.categoryLabel}</span>
              <span>•</span>
              <span className="text-emerald-400">{game.age}</span>
              <span>•</span>
              <span className="text-amber-400">{game.grades}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            title="Copy share link"
          >
            <span>🔗</span> {copied ? 'Link Copied!' : 'Share'}
          </button>
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-colors cursor-pointer"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center justify-center min-h-[460px] relative mb-8">
        {renderGameContent()}
      </div>

      {/* Quick Spec Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 text-center">
          <span className="text-xs text-slate-400 block font-bold">Recommended Age</span>
          <span className="text-sm font-black text-emerald-400">{game.age}</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 text-center">
          <span className="text-xs text-slate-400 block font-bold">School Level</span>
          <span className="text-sm font-black text-cyan-400">{game.grades}</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 text-center">
          <span className="text-xs text-slate-400 block font-bold">Session Duration</span>
          <span className="text-sm font-black text-amber-400">{game.estimatedPlayTime}</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 text-center">
          <span className="text-xs text-slate-400 block font-bold">Player Mode</span>
          <span className="text-sm font-black text-purple-400">{game.playerCount}</span>
        </div>
      </div>

      {/* Tab Navigation for Rich Content */}
      <div className="flex items-center gap-2 border-b border-slate-800 mb-6 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'guide'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          📖 Game Guide &amp; Overview
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'rules'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          📜 Step-by-Step Rules &amp; Controls
        </button>
        <button
          onClick={() => setActiveTab('strategy')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'strategy'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          💡 Pro Strategies &amp; Scoring
        </button>
        <button
          onClick={() => setActiveTab('brain')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'brain'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          🧠 Brain &amp; Educational Value
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'faq'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          ❓ FAQs &amp; Help
        </button>
      </div>

      {/* Content Section Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-10">
        {/* Tab 1: Overview */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider block mb-1">
                Official Guide
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                About {game.title}
              </h2>
            </div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {game.overview}
            </p>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-black text-amber-400 mb-2 flex items-center gap-2">
                <span>🏫</span> Classroom &amp; Homeschool Application
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {game.classroomApplication}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                <span className="text-xs font-black text-emerald-400 block mb-1">🛡️ Safety Promise</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  100% non-violent game engine. Zero chat rooms, zero user tracking, and no in-app purchases. High scores stay on your device.
                </p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                <span className="text-xs font-black text-cyan-400 block mb-1">⚡ Instant Play Tech</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Built with high-performance HTML5 Canvas and React. Instant load, lightweight footprint, and zero app-store download needed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Rules & Controls */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider block mb-1">
                Mechanics &amp; Directives
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                How to Play {game.title}
              </h2>
            </div>

            <div className="space-y-3">
              {game.howToPlay.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-black text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed pt-1">
                    {rule}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-sm font-black text-cyan-400 mb-2 flex items-center gap-2">
                  <span>⌨️</span> Desktop Controls
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm font-mono bg-slate-900 p-3 rounded-xl border border-slate-800">
                  {game.controlsDesktop}
                </p>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-sm font-black text-purple-400 mb-2 flex items-center gap-2">
                  <span>📱</span> Mobile &amp; Tablet Controls
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm font-mono bg-slate-900 p-3 rounded-xl border border-slate-800">
                  {game.controlsMobile}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Strategy & Scoring */}
        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider block mb-1">
                High-Score Mastery
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Pro Strategies &amp; Scoring System
              </h2>
            </div>

            <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-5">
              <h3 className="text-sm font-black text-cyan-400 mb-2 flex items-center gap-2">
                <span>🏆</span> Scoring Calculation
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {game.scoringGuide}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-black text-amber-400 mb-3 flex items-center gap-2">
                <span>💡</span> Tactical Pro Tips
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {game.proStrategies.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-start gap-3"
                  >
                    <span className="text-amber-400 text-base">★</span>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Brain Benefits */}
        {activeTab === 'brain' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider block mb-1">
                Cognitive Science &amp; E-E-A-T
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Mental &amp; Educational Development
              </h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Every game in the KiddoZap library is mapped against core cognitive and pedagogical frameworks. Playing {game.title} exercises key executive functions:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {game.cognitiveSkills.map((cog, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xl mb-2 block">🧠</span>
                    <h3 className="text-sm font-black text-cyan-400 mb-1.5">{cog.skill}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{cog.explanation}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-black text-emerald-400 mb-2 flex items-center gap-2">
                <span>📚</span> Curriculum &amp; Pedagogical Connection
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {game.classroomApplication}
              </p>
            </div>
          </div>
        )}

        {/* Tab 5: FAQs */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider block mb-1">
                Common Inquiries
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Frequently Asked Questions about {game.title}
              </h2>
            </div>

            <div className="space-y-4">
              {game.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5"
                >
                  <h3 className="text-sm font-black text-cyan-400 mb-2 flex items-center gap-2">
                    <span>❓</span> {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Games in this Category */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span>🎮</span> More Games in {game.categoryLabel}
          </h2>
          <button
            onClick={onBack}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
          >
            View All 20 Games →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {fallbackRelated.map(rel => (
            <div
              key={rel.id}
              onClick={() => {
                if (onSelectGame) {
                  onSelectGame(rel);
                }
              }}
              className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 cursor-pointer transition-all flex items-center gap-3 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rel.color} flex items-center justify-center text-2xl shadow group-hover:scale-105 transition-transform`}>
                {rel.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors truncate">
                  {rel.title}
                </h3>
                <span className="text-[11px] text-slate-400 font-bold block">
                  {rel.age} • {rel.categoryLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
