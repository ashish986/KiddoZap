import React, { useState, useEffect, useMemo } from 'react';
import { GAMES, CATEGORIES, GameInfo } from './data/games';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GameContainer } from './components/GameContainer';
import { BlogSection } from './components/BlogSection';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ParentsGuidePage } from './pages/ParentsGuidePage';
import { ArticlesPage } from './pages/ArticlesPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AppPrivacyPolicyPage } from './pages/AppPrivacyPolicyPage';
import { soundManager } from './utils/audio';

function normalizePath(pathname: string): string {
  const clean = pathname.replace(/\/$/, '') || '/';
  return clean;
}

export const App: React.FC = () => {
  const [route, setRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });
  const [selectedGame, setSelectedGame] = useState<GameInfo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEmbed, setIsEmbed] = useState(false);

  // Sync route on browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = normalizePath(window.location.pathname);
      setRoute(currentPath);

      const params = new URLSearchParams(window.location.search);
      const gameParam = params.get('game');
      if (gameParam) {
        const found = GAMES.find(
          g => g.id.toLowerCase() === gameParam.toLowerCase() || g.slug.toLowerCase() === gameParam.toLowerCase()
        );
        setSelectedGame(found || null);
      } else {
        setSelectedGame(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initial load check for game param and embed
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

      // Handle legacy hash redirects to clean separate URLs
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['privacy', 'terms', 'about', 'contact'].includes(hash)) {
        handleNavigate(`/${hash}`);
      } else if (hash === 'parents') {
        handleNavigate('/parents-guide');
      }
    } catch {
      // ignore
    }
  }, []);

  const handleNavigate = (newRoute: string) => {
    setRoute(newRoute);
    setSelectedGame(null);
    window.history.pushState({}, '', newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    setRoute('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const url = new URL(window.location.href);
      url.pathname = '/';
      url.searchParams.set('game', game.id);
      window.history.pushState({}, '', url.toString());
    } catch {}
  };

  const handleBackToHub = () => {
    soundManager.playPop();
    setSelectedGame(null);
    setRoute('/');
    try {
      window.history.pushState({}, '', '/');
    } catch {}
  };

  // If in embed mode with a selected game, render only the game
  if (isEmbed && selectedGame) {
    return <GameContainer game={selectedGame} onBack={handleBackToHub} embed={true} />;
  }

  // Standalone App Privacy Policy for Google Play Store (Zero website menu/footer, accessible via direct URL /privacy)
  if (route === '/privacy' || route === '/privacy.html') {
    return <AppPrivacyPolicyPage />;
  }

  // Render standalone dedicated pages (Zero Dialog / Modal Popups)
  const renderCurrentPage = () => {
    if (route === '/privacypolicy' || route === '/privacypolicy.html') {
      return <PrivacyPage onGoHome={handleBackToHub} />;
    }
    if (route === '/terms') {
      return <TermsPage onGoHome={handleBackToHub} />;
    }
    if (route === '/about') {
      return <AboutPage onGoHome={handleBackToHub} />;
    }
    if (route === '/contact') {
      return <ContactPage onGoHome={handleBackToHub} />;
    }
    if (route === '/parents-guide') {
      return <ParentsGuidePage onGoHome={handleBackToHub} />;
    }
    if (route.startsWith('/articles')) {
      const articleSlug = route.replace('/articles/', '').replace(/\/$/, '');
      return (
        <ArticlesPage
          initialSlug={articleSlug !== '/articles' && articleSlug !== '' ? articleSlug : null}
          onGoHome={handleBackToHub}
          onSelectGame={handleSelectGame}
        />
      );
    }
    if (route.startsWith('/categories')) {
      return (
        <CategoriesPage
          onGoHome={handleBackToHub}
          onSelectGame={handleSelectGame}
          onSelectCategoryFilter={(catId) => {
            setSelectedCategory(catId);
            handleNavigate('/');
          }}
        />
      );
    }

    // Default: Game playing or Main Games Hub
    if (selectedGame) {
      return (
        <GameContainer
          game={selectedGame}
          onBack={handleBackToHub}
          onSelectGame={handleSelectGame}
        />
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border border-slate-800 p-8 sm:p-12 mb-10 shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-xs font-black mb-4">
              <span>⚡</span> Exactly 20 Curated Free Browser Mini-Games
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Play Free Online Games. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
                Sharpen Your Mind, Safely!
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-2xl">
              KiddoZap is an independent, non-violent browser gaming platform designed for students from Class 1 to 12. Arithmetic sprints, memory match, rhythm neon dashes, and classic arcades—with zero chat rooms, zero logins, and zero microtransactions.
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
              <button
                onClick={() => handleNavigate('/about')}
                className="px-5 py-3 bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-sm rounded-2xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>ℹ️</span> About KiddoZap
              </button>
              <button
                onClick={() => handleNavigate('/parents-guide')}
                className="px-5 py-3 bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-sm rounded-2xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>👨‍👩‍👦</span> Parents &amp; Teachers Guide
              </button>
            </div>
          </div>

          {/* Decorative shapes */}
          <div className="absolute -right-8 -bottom-8 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-12 top-10 text-8xl select-none opacity-20 hidden md:block">
            ⚡
          </div>
        </section>

        {/* Quick Guarantees Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🚫</span>
            <div>
              <h4 className="text-xs font-black text-white">No Chat Rooms</h4>
              <p className="text-[11px] text-slate-400">Zero contact with strangers</p>
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h4 className="text-xs font-black text-white">No Registration</h4>
              <p className="text-[11px] text-slate-400">Play immediately in browser</p>
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <h4 className="text-xs font-black text-white">100% Free</h4>
              <p className="text-[11px] text-slate-400">No loot boxes or coins</p>
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h4 className="text-xs font-black text-white">Non-Violent</h4>
              <p className="text-[11px] text-slate-400">Math, logic &amp; friendly reflex</p>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => {
                soundManager.playPop();
                setSelectedCategory(category.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === category.id
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/25 scale-105'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {selectedCategory === 'all'
                ? 'All 20 Curated Games'
                : CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Games'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-extrabold text-xs">
              {filteredGames.length}
            </span>
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-cyan-400 hover:underline font-bold cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Games Grid */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
            <span className="text-5xl block mb-3">🔍</span>
            <h3 className="text-lg font-bold text-white mb-1">No games found</h3>
            <p className="text-xs text-slate-400 mb-4">
              Try searching for something else like &ldquo;Math&rdquo;, &ldquo;Snake&rdquo;, or &ldquo;Sudoku&rdquo;
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Show All 20 Games
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredGames.map(game => (
              <div
                key={game.id}
                onClick={() => handleSelectGame(game)}
                className="group relative bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer overflow-hidden"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">
                    {game.icon}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors">
                    {game.age}
                  </span>
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-black text-white text-sm sm:text-base group-hover:text-cyan-400 transition-colors line-clamp-1 mb-1">
                    {game.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {game.shortDesc}
                  </p>
                </div>

                {/* Footer Tag */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span className="text-cyan-400 font-extrabold">{game.categoryLabel}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white flex items-center gap-0.5">
                    Play ⚡
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Real User Experience & Educational Blog Section */}
        <div className="mt-14">
          <BlogSection
            onSelectGame={handleSelectGame}
            onOpenArticle={(slug) => handleNavigate(`/articles/${slug}`)}
          />
        </div>

        {/* Comprehensive Platform FAQ */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl mt-14">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-xs font-black mb-2">
              <span>❓</span> Transparency &amp; Help
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-black text-cyan-400 mb-2">
                Are the 20 games completely free with no hidden charges?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Yes, 100% free. There are no subscriptions, in-game virtual currencies, locked levels, or pay-to-win items. All content is instantly accessible in modern web browsers.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-black text-cyan-400 mb-2">
                How does KiddoZap protect children from online strangers?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                By design, KiddoZap has no multiplayer chat rooms, direct messaging, user profiles, or friend request features. Children play in an insulated, safe sandbox.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-black text-cyan-400 mb-2">
                Can teachers use these games on school Chromebooks?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Yes! The website is lightweight, mobile-responsive, and runs smoothly on Chromebooks, Windows, Macs, iPads, and Android tablets without installing any software.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-black text-cyan-400 mb-2">
                How are high scores and puzzle progress saved?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Scores and stars are stored locally on your own computer or tablet via browser LocalStorage. We never upload your personal scores to external servers.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      <Navbar
        currentRoute={route}
        onNavigate={handleNavigate}
        onGoHome={handleBackToHub}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
