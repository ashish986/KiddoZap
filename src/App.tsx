import React, { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Top10GamesHub } from './components/Top10GamesHub';
import { GameContainer } from './components/GameContainer';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ParentsGuidePage } from './pages/ParentsGuidePage';
import { AppPrivacyPolicyPage } from './pages/AppPrivacyPolicyPage';
import { GAMES, GameInfo } from './data/games';
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

  const [activeGame, setActiveGame] = useState<GameInfo | null>(() => {
    if (typeof window !== 'undefined') {
      const path = normalizePath(window.location.pathname);
      const match = path.match(/^\/games\/([a-zA-Z0-9_-]+)/);
      if (match) {
        return GAMES.find(g => g.slug === match[1] || g.id === match[1]) || null;
      }
      const params = new URLSearchParams(window.location.search);
      const gameParam = params.get('game');
      if (gameParam) {
        return GAMES.find(g => g.id === gameParam || g.slug === gameParam) || null;
      }
    }
    return null;
  });

  // Sync route and game on browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = normalizePath(window.location.pathname);
      setRoute(currentPath);

      const match = currentPath.match(/^\/games\/([a-zA-Z0-9_-]+)/);
      if (match) {
        const found = GAMES.find(g => g.slug === match[1] || g.id === match[1]);
        setActiveGame(found || null);
      } else {
        const params = new URLSearchParams(window.location.search);
        const gameParam = params.get('game');
        if (gameParam) {
          const found = GAMES.find(g => g.id === gameParam || g.slug === gameParam);
          setActiveGame(found || null);
        } else {
          setActiveGame(null);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (newRoute: string) => {
    soundManager.playPop();
    setActiveGame(null);
    setRoute(newRoute);
    window.history.pushState({}, '', newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHub = () => {
    soundManager.playPop();
    setActiveGame(null);
    setRoute('/');
    try {
      window.history.pushState({}, '', '/');
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectGame = (game: GameInfo) => {
    soundManager.playPop();
    setActiveGame(game);
    const gamePath = game.id === 'builder' ? '/' : `/games/${game.slug}`;
    const gameRoute = game.id === 'builder' ? '/?game=builder' : gamePath;
    setRoute(gamePath);
    try {
      window.history.pushState({}, '', gameRoute);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Standalone App Privacy Policy for Google Play Store
  // (Zero website menu/footer, accessible via direct URL /privacy - strictly preserved!)
  if (route === '/privacy' || route === '/privacy.html') {
    return <AppPrivacyPolicyPage />;
  }

  // Render standalone dedicated pages (Zero Dialog / Modal Popups)
  if (route === '/' && !activeGame) {
    return <HomePage onSelectGame={handleSelectGame} />;
  }

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

    // If an individual game is currently active, render the dedicated GameContainer
    if (activeGame) {
      return (
        <main className="flex-1">
          <GameContainer
            game={activeGame}
            onBack={handleBackToHub}
            onSelectGame={handleSelectGame}
          />
        </main>
      );
    }

    // Default: The Curated Top 10 Fun & Learning Games Hub
    return (
      <main className="flex-1">
        <Top10GamesHub
          onSelectGame={handleSelectGame}
          onNavigate={handleNavigate}
        />
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      <Navbar
        currentRoute={route}
        onNavigate={handleNavigate}
        onGoHome={handleBackToHub}
      />

      {renderCurrentPage()}

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
