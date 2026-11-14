import React from 'react';
import { soundManager } from '../utils/audio';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, route: string) => {
    e.preventDefault();
    soundManager.playPop();
    onNavigate(route);
  };

  return (
    <footer className="mt-16 bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-12 px-4 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Col */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⚡</span>
            <span className="text-lg font-black text-white">KiddoZap: 10 Fun Games</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            Safe, wholesome, and brain-boosting games for kids, elementary students, and teens. 10 curated math, logic, memory, reflex, and creative challenges. Zero chat, zero microtransactions, and COPPA compliant.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-[11px] font-bold">
            <span>🛡️</span> 100% Free &amp; Child Safe
          </div>
        </div>

        {/* 10 Curated Games List */}
        <div>
          <h4 className="text-white font-extrabold text-sm mb-3">Top 10 Learning Games</h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li>🔢 Math Sprint Blitz</li>
            <li>🧩 Kiddo Sudoku 4x4 &amp; 6x6</li>
            <li>🃏 Memory Card Match</li>
            <li>🏗️ Little Builder World</li>
            <li>🐍 Snake Neon Classic</li>
            <li>⚡ Neon Rhythm Run</li>
            <li>🎯 Whack-A-Mole Garden</li>
            <li>🧱 Brick Breaker Arcade</li>
            <li>⭕ Tic-Tac-Toe Strategy</li>
            <li>🍉 Fruit Slice Ninja</li>
          </ul>
        </div>

        {/* Educational Guides */}
        <div>
          <h4 className="text-white font-extrabold text-sm mb-3">Learning &amp; Curriculum</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="/parents-guide" onClick={(e) => handleLink(e, '/parents-guide')} className="hover:text-amber-400">
                👨‍👩‍👦 Parents &amp; Screen Time Guide
              </a>
            </li>
            <li>
              <a href="/about" onClick={(e) => handleLink(e, '/about')} className="hover:text-amber-400">
                ℹ️ Founder Manifesto by Ashish Pal
              </a>
            </li>
            <li className="pt-2 text-slate-400 leading-relaxed">
              Designed for classroom Chromebooks and home tablets to foster spatial intelligence and structural problem solving.
            </li>
          </ul>
        </div>

        {/* Legal & Trust - All real separate pages */}
        <div>
          <h4 className="text-white font-extrabold text-sm mb-3">Trust &amp; Transparency</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="/privacypolicy"
                onClick={(e) => handleLink(e, '/privacypolicy')}
                className="hover:text-emerald-400 font-bold block"
              >
                🛡️ Website Privacy Policy (COPPA)
              </a>
            </li>
            <li>
              <a
                href="/terms"
                onClick={(e) => handleLink(e, '/terms')}
                className="hover:text-amber-400 block"
              >
                📜 Terms of Service &amp; Fair Use
              </a>
            </li>
            <li>
              <a
                href="/parents-guide"
                onClick={(e) => handleLink(e, '/parents-guide')}
                className="hover:text-amber-400 block"
              >
                👨‍👩‍👦 Parents &amp; Teachers Guide
              </a>
            </li>
            <li>
              <a
                href="/about"
                onClick={(e) => handleLink(e, '/about')}
                className="hover:text-amber-400 block"
              >
                ℹ️ About KiddoZap &amp; Founder
              </a>
            </li>
            <li>
              <a
                href="/contact"
                onClick={(e) => handleLink(e, '/contact')}
                className="hover:text-amber-400 block"
              >
                ✉️ Contact &amp; Classroom Inquiries
              </a>
            </li>
            <li className="pt-2 text-[11px] text-slate-500">
              Founder: <a href="mailto:ashishpal996@gmail.com" className="text-amber-400 underline">ashishpal996@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-wrap justify-between items-center gap-4 text-[11px] text-slate-500">
        <p>&copy; 2026 KiddoZap &bull; Founded by Ashish Pal. All rights reserved. KiddoZap&apos;s Little Builder World.</p>
        <p>Built with ❤️ for school &amp; home creative education.</p>
      </div>
    </footer>
  );
};
