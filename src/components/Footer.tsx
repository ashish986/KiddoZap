import React from 'react';
import { LegalDocType } from './LegalModal';

interface FooterProps {
  onOpenLegal: (type: LegalDocType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
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
            Free, safe, and brain-boosting online browser games for students and kids. No downloads, no passwords, no violent mechanics.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-[11px] font-bold">
            <span>🛡️</span> Non-Violent &amp; Family Friendly
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-extrabold text-sm mb-3">Game Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/categories/brain-puzzles" className="hover:text-cyan-400">🧩 Brain &amp; Puzzles</a></li>
            <li><a href="/categories/action-reflex" className="hover:text-cyan-400">🚀 Action &amp; Reflex</a></li>
            <li><a href="/categories/arcade-retro" className="hover:text-cyan-400">👾 Arcade &amp; Retro</a></li>
            <li><a href="/categories/math" className="hover:text-cyan-400">🔢 Math &amp; Logic</a></li>
            <li><a href="/categories/little-kids" className="hover:text-cyan-400">🎵 Little Kids &amp; Music</a></li>
          </ul>
        </div>

        {/* Educational Guides */}
        <div>
          <h4 className="text-white font-extrabold text-sm mb-3">Educational Guides</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/articles/benefits-of-puzzle-games-for-kids-brain-development" className="hover:text-cyan-400">Benefits of Puzzle Games</a></li>
            <li><a href="/articles/how-math-games-improve-arithmetic-speed-and-accuracy" className="hover:text-cyan-400">Math Games &amp; Speed</a></li>
            <li><a href="/articles/healthy-screen-time-rules-for-kids-and-teens" className="hover:text-cyan-400">Healthy Screen Time Rules</a></li>
            <li><a href="/articles/classroom-brain-breaks-guide-for-teachers" className="hover:text-cyan-400">Classroom Brain Breaks</a></li>
            <li><a href="/articles/hand-eye-coordination-and-reflex-training-in-teens" className="hover:text-cyan-400">Reflex &amp; Coordination</a></li>
          </ul>
        </div>

        {/* Legal & Contact */}
        <div>
          <h4 className="text-white font-extrabold text-sm mb-3">Trust &amp; Transparency</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onOpenLegal('privacy')} className="hover:text-emerald-400 font-bold cursor-pointer text-left">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegal('terms')} className="hover:text-cyan-400 cursor-pointer text-left">
                Terms of Service
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegal('parents')} className="hover:text-cyan-400 cursor-pointer text-left">
                Parents &amp; Teachers Guide
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegal('about')} className="hover:text-cyan-400 cursor-pointer text-left">
                About KiddoZap
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegal('contact')} className="hover:text-cyan-400 cursor-pointer text-left">
                Contact &amp; Support
              </button>
            </li>
            <li className="pt-2 text-[11px] text-slate-500">
              Direct Contact: <a href="mailto:support@kiddozap.com" className="text-cyan-400 underline">support@kiddozap.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-wrap justify-between items-center gap-4 text-[11px] text-slate-500">
        <p>&copy; 2026 KiddoZap. All rights reserved. Free browser games for kids and teens.</p>
        <p>Built with ❤️ for school &amp; home entertainment.</p>
      </div>
    </footer>
  );
};
