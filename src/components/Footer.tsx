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
    <footer className="mt-16 bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Col */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⚡</span>
            <span className="text-lg font-black text-white">KiddoZap</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            Curated, safe, and brain-boosting online browser games for students and kids. Exactly 20 hand-crafted games with zero downloads, no passwords, and non-violent mechanics.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-[11px] font-bold">
            <span>🛡️</span> COPPA &amp; Family Safe
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-extrabold text-sm mb-3">Game Categories</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="/categories" onClick={(e) => handleLink(e, '/categories')} className="hover:text-cyan-400">
                🧩 Brain &amp; Puzzles
              </a>
            </li>
            <li>
              <a href="/categories" onClick={(e) => handleLink(e, '/categories')} className="hover:text-cyan-400">
                🚀 Action &amp; Reflex
              </a>
            </li>
            <li>
              <a href="/categories" onClick={(e) => handleLink(e, '/categories')} className="hover:text-cyan-400">
                👾 Arcade &amp; Retro
              </a>
            </li>
            <li>
              <a href="/categories" onClick={(e) => handleLink(e, '/categories')} className="hover:text-cyan-400">
                🔢 Math &amp; Logic
              </a>
            </li>
            <li>
              <a href="/categories" onClick={(e) => handleLink(e, '/categories')} className="hover:text-cyan-400">
                🎵 Little Kids &amp; Music
              </a>
            </li>
          </ul>
        </div>

        {/* Educational Guides */}
        <div>
          <h4 className="text-white font-extrabold text-sm mb-3">Educational Guides</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="/articles" onClick={(e) => handleLink(e, '/articles')} className="hover:text-cyan-400">
                Classroom Math Sprints (Anita Sharma)
              </a>
            </li>
            <li>
              <a href="/articles" onClick={(e) => handleLink(e, '/articles')} className="hover:text-cyan-400">
                Screen Time Without Tantrums (Verma Family)
              </a>
            </li>
            <li>
              <a href="/articles" onClick={(e) => handleLink(e, '/articles')} className="hover:text-cyan-400">
                Founder Manifesto: Why No Chat (Ashish Pal)
              </a>
            </li>
            <li>
              <a href="/articles" onClick={(e) => handleLink(e, '/articles')} className="hover:text-cyan-400">
                ADHD &amp; Rhythm Training (Dr. Mehta)
              </a>
            </li>
            <li>
              <a href="/articles" onClick={(e) => handleLink(e, '/articles')} className="hover:text-cyan-400">
                5 Classroom Brain Breaks
              </a>
            </li>
            <li>
              <a href="/articles" onClick={(e) => handleLink(e, '/articles')} className="hover:text-cyan-400">
                Arcade Physics &amp; Spatial Reasoning
              </a>
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
                🛡️ Privacy Policy (COPPA)
              </a>
            </li>
            <li>
              <a
                href="/terms"
                onClick={(e) => handleLink(e, '/terms')}
                className="hover:text-cyan-400 block"
              >
                📜 Terms of Service
              </a>
            </li>
            <li>
              <a
                href="/parents-guide"
                onClick={(e) => handleLink(e, '/parents-guide')}
                className="hover:text-cyan-400 block"
              >
                👨‍👩‍👦 Parents &amp; Teachers Guide
              </a>
            </li>
            <li>
              <a
                href="/about"
                onClick={(e) => handleLink(e, '/about')}
                className="hover:text-cyan-400 block"
              >
                ℹ️ About KiddoZap &amp; Founder
              </a>
            </li>
            <li>
              <a
                href="/contact"
                onClick={(e) => handleLink(e, '/contact')}
                className="hover:text-cyan-400 block"
              >
                ✉️ Contact &amp; Support
              </a>
            </li>
            <li className="pt-2 text-[11px] text-slate-500">
              Direct Contact: <a href="mailto:support@kiddozap.com" className="text-cyan-400 underline">support@kiddozap.com</a>
            </li>
            <li className="text-[11px] text-slate-500">
              Founder: <a href="mailto:ashishpal996@gmail.com" className="text-cyan-400 underline">ashishpal996@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-wrap justify-between items-center gap-4 text-[11px] text-slate-500">
        <p>&copy; 2026 KiddoZap &bull; Founded by Ashish Pal. All rights reserved. Free browser games for kids and teens.</p>
        <p>Built with ❤️ for school &amp; home education.</p>
      </div>
    </footer>
  );
};
