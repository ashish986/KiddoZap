import React from 'react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onGoHome,
}) => {
  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, route: string) => {
    e.preventDefault();
    soundManager.playPop();
    onNavigate(route);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Utility Bar */}
      <div className="bg-slate-950/95 border-b border-slate-900 px-4 py-1.5 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 overflow-x-auto py-0.5">
          <a
            href="/"
            onClick={(e) => handleLink(e, '/')}
            className="text-amber-400 font-extrabold flex items-center gap-1 hover:underline"
          >
            ⚡ KiddoZap: 10 Games
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="/"
            onClick={(e) => handleLink(e, '/')}
            className={`font-bold transition-colors ${currentRoute === '/' ? 'text-amber-300 underline' : 'text-slate-300 hover:text-white'}`}
          >
            🎮 10 Fun &amp; Learning Games
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
            ℹ️ About Us
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="/privacypolicy"
            onClick={(e) => handleLink(e, '/privacypolicy')}
            className={`text-emerald-400 hover:text-emerald-300 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 ${currentRoute === '/privacypolicy' ? 'ring-1 ring-emerald-400' : ''}`}
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
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold">
            10 Curated Games &bull; 100% Free &bull; Child-Safe
          </span>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            🏗️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200 bg-clip-text text-transparent leading-none">
                KiddoZap
              </span>
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                Little Builder World
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-bold leading-tight mt-0.5">
              Architectural STEM Building &amp; Creative Puzzle World for Kids
            </p>
          </div>
        </a>

        {/* Quick Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-amber-300 text-xs font-black rounded-xl hidden sm:inline-flex items-center gap-1.5">
            <span>🌟</span> 12 Progressive Engineering Levels
          </span>
        </div>
      </div>
    </header>
  );
};
