import React from 'react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onGoHome: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onGoHome,
  searchQuery,
  setSearchQuery,
}) => {
  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, route: string) => {
    e.preventDefault();
    soundManager.playPop();
    onNavigate(route);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Utility Bar */}
      <div className="bg-slate-950/95 border-b border-slate-900 px-4 py-1.5 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 overflow-x-auto py-0.5">
          <a
            href="/"
            onClick={(e) => handleLink(e, '/')}
            className="text-cyan-400 font-extrabold flex items-center gap-1 hover:underline"
          >
            ⚡ KiddoZap Hub
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="/"
            onClick={(e) => handleLink(e, '/')}
            className={`font-bold transition-colors ${currentRoute === '/' ? 'text-white underline' : 'text-slate-300 hover:text-white'}`}
          >
            🎮 20 Games
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="/categories"
            onClick={(e) => handleLink(e, '/categories')}
            className={`font-bold transition-colors ${currentRoute === '/categories' ? 'text-white underline' : 'text-slate-300 hover:text-white'}`}
          >
            📂 Categories
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="/articles"
            onClick={(e) => handleLink(e, '/articles')}
            className={`font-bold transition-colors ${currentRoute === '/articles' ? 'text-white underline' : 'text-slate-300 hover:text-white'}`}
          >
            📚 Articles
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="/parents-guide"
            onClick={(e) => handleLink(e, '/parents-guide')}
            className={`font-bold transition-colors ${currentRoute === '/parents-guide' ? 'text-white underline' : 'text-slate-300 hover:text-white'}`}
          >
            👨‍👩‍👦 Parents Guide
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="/about"
            onClick={(e) => handleLink(e, '/about')}
            className={`font-bold transition-colors ${currentRoute === '/about' ? 'text-white underline' : 'text-slate-300 hover:text-white'}`}
          >
            ℹ️ About
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="/privacy"
            onClick={(e) => handleLink(e, '/privacy')}
            className="text-emerald-400 hover:text-emerald-300 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30"
          >
            🛡️ Privacy Policy
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="/contact"
            onClick={(e) => handleLink(e, '/contact')}
            className={`font-bold transition-colors ${currentRoute === '/contact' ? 'text-white underline' : 'text-slate-300 hover:text-white'}`}
          >
            ✉️ Contact
          </a>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold">
            Class 1 - 12 • 100% Free
          </span>
        </div>
      </div>

      {/* Main Brand & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            soundManager.playPop();
            onGoHome();
          }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent leading-none">
                KiddoZap
              </span>
              <span className="bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                Fun &amp; Mind
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-bold leading-tight mt-0.5">
              Free Browser Games &amp; Brain Puzzles for Kids &amp; Teens
            </p>
          </div>
        </a>

        {/* Search */}
        <div className="flex-1 max-w-xs sm:max-w-md">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 20 games (Math, Snake, Rhythm...)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 pl-9 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
