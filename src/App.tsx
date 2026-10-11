import React, { useState, useEffect, useMemo } from 'react';
import { GAMES, CATEGORIES, GameInfo } from './data/games';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GameContainer } from './components/GameContainer';
import { LegalModal, LegalDocType } from './components/LegalModal';
import { soundManager } from './utils/audio';

export const App: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameInfo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [legalModal, setLegalModal] = useState<LegalDocType>(null);
  const [isEmbed, setIsEmbed] = useState(false);

  // Check URL parameters for direct game launching and embed mode
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const gameParam = params.get('game');
      const embedParam = params.get('embed');

      if (embedParam === '1') {
        setIsEmbed(true);
      }

      if (gameParam) {
        const found = GAMES.find(
          g => g.id.toLowerCase() === gameParam.toLowerCase() || g.slug.toLowerCase() === gameParam.toLowerCase()
        );
        if (found) {
          setSelectedGame(found);
        }
      }

      // Check URL hash for modal
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['privacy', 'terms', 'parents', 'about', 'contact'].includes(hash)) {
        setLegalModal(hash as LegalDocType);
      }
    } catch {
      // ignore
    }
  }, []);

  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectGame = (game: GameInfo) => {
    soundManager.playPop();
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Update URL query without reload
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('game', game.id);
      window.history.pushState({}, '', url.toString());
    } catch {}
  };

  const handleBackToHub = () => {
    soundManager.playPop();
    setSelectedGame(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('game');
      url.searchParams.delete('embed');
      window.history.pushState({}, '', url.toString());
    } catch {}
  };

  // If in embed mode with a selected game, render only the game
  if (isEmbed && selectedGame) {
    return <GameContainer game={selectedGame} onBack={handleBackToHub} embed={true} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      <Navbar
        onOpenLegal={setLegalModal}
        onGoHome={handleBackToHub}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1">
        {selectedGame ? (
          <GameContainer game={selectedGame} onBack={handleBackToHub} />
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border border-slate-800 p-8 sm:p-10 mb-8 shadow-2xl">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-xs font-black mb-4">
                  <span>⚡</span> 24+ Instant Browser Mini-Games
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
                  Play Free Games. <br />
                  <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                    Sharpen Your Mind!
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                  Non-violent games for kids and teens from Class 1 to 12. Arithmetic sprints, memory match, rhythm neon dashes, and classic arcades. No downloads or logins required.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const randomGame = GAMES[Math.floor(Math.random() * GAMES.length)];
                      handleSelectGame(randomGame);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>🎲</span> Quick Random Play
                  </button>
                  <a
                    href="/parents-guide"
                    className="px-5 py-3 bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold text-sm rounded-2xl border border-slate-700 transition-all flex items-center gap-2"
                  >
                    <span>👨‍👩‍👦</span> Parents Guide
                  </a>
                </div>
              </div>

              {/* Decorative shapes */}
              <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute right-12 top-8 text-7xl select-none opacity-20 hidden md:block">
                🎮
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
              {CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundManager.playPop();
                      setSelectedCategory(cat.id);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-105'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Game Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredGames.map(game => (
                <div
                  key={game.id}
                  onClick={() => handleSelectGame(game)}
                  className="group relative bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-5 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Icon & Badges */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                        {game.icon}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {game.badge && (
                          <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                            {game.badge}
                          </span>
                        )}
                        <span className="text-[11px] font-extrabold text-slate-400">
                          {game.age}
                        </span>
                      </div>
                    </div>

                    {/* Title & Category */}
                    <h3 className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors mb-1">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                      {game.shortDesc}
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-cyan-400">
                      {game.categoryLabel}
                    </span>
                    <button className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 group-hover:bg-cyan-400 group-hover:text-slate-950 text-white font-black text-xs rounded-xl transition-all shadow-md">
                      Play ⚡
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredGames.length === 0 && (
              <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-black text-white mb-1">No Games Found</h3>
                <p className="text-xs text-slate-400 mb-4">No results matched &ldquo;{searchQuery}&rdquo;</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer onOpenLegal={setLegalModal} />
      <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
    </div>
  );
};
