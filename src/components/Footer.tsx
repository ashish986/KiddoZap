import React from 'react';
import { ShieldCheck, Heart, Mail, Lock, FileText, Info, Download } from 'lucide-react';
import { Language } from '../types';
import { LegalPageTab } from './LegalPagesModal';
import { KiddoZapLogo } from './KiddoZapLogo';
import { sounds } from '../utils/audio';

interface FooterProps {
  lang: Language;
  onOpenLegal: (tab: LegalPageTab) => void;
  onOpenInstall: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenLegal, onOpenInstall }) => {
  return (
    <footer className="mt-14 border-t border-slate-800 bg-slate-950 text-slate-300 py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        
        {/* Col 1: Brand & Mission */}
        <div className="space-y-3 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <KiddoZapLogo size={42} variant="badge" />
            <div>
              <h3 className="text-xl font-black text-white font-display tracking-tight">
                KiddoZap
              </h3>
              <p className="text-xs font-semibold text-cyan-400">
                {lang === 'hi'
                  ? 'बच्चों व किशोरों के लिए सुरक्षित दिमागी खेल'
                  : 'Fun & Safe Brain Games for Kids & Teens'}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === 'hi'
              ? 'KiddoZap (kiddozap.com) पर बच्चों और टीनएजर्स के लिए 50+ मुफ्त ब्राउज़र गेम्स और पहेलियां उपलब्ध हैं। साइन-अप की जरूरत नहीं।'
              : 'KiddoZap (kiddozap.com) offers 50+ free browser games and puzzles for kids and teens, from math and memory games to arcade runners. No sign-up needed.'}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'hi' ? 'प्राइवेसी व सुरक्षा' : 'Privacy & Safety'}</span>
            </span>
            <span className="text-[11px] bg-cyan-500/15 text-cyan-300 font-bold px-2.5 py-1 rounded-full border border-cyan-500/30">
              ⚡ Think • Play • Zap!
            </span>
          </div>
        </div>

        {/* Col 2: Educational Articles */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'hi' ? 'माता-पिता के लिए गाइड्स' : 'Guides for Parents'}</span>
          </h4>
          <ul className="space-y-2 text-xs font-medium text-slate-400">
            <li>
              <a href="/articles" className="hover:text-cyan-300 transition-colors block font-bold text-slate-300">
                {lang === 'hi' ? '📚 सभी आर्टिकल्स हब' : '📚 All Educational Articles'}
              </a>
            </li>
            <li>
              <a href="/articles/benefits-of-puzzle-games-for-kids-brain-development" className="hover:text-cyan-300 transition-colors block">
                {lang === 'hi' ? 'पहेलियां और सीखना' : 'Puzzles & Learning'}
              </a>
            </li>
            <li>
              <a href="/articles/how-math-games-improve-speed-and-accuracy" className="hover:text-cyan-300 transition-colors block">
                {lang === 'hi' ? 'मेंटल मैथ स्पीड ट्रेनिंग' : 'Math Drills vs. Worksheets'}
              </a>
            </li>
            <li>
              <a href="/articles/healthy-screen-time-rules-for-school-children" className="hover:text-cyan-300 transition-colors block">
                {lang === 'hi' ? '20-20-20 स्क्रीन टाइम गाइड' : '20-20-20 Screen Time Rules'}
              </a>
            </li>
            <li>
              <a href="/articles/classroom-brain-breaks-guide-for-teachers" className="hover:text-cyan-300 transition-colors block">
                {lang === 'hi' ? 'शिक्षकों के लिए ब्रेन ब्रेक्स' : 'Classroom Brain Breaks Playbook'}
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Categories & Guides */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? 'कैटेगरी व गेम्स' : 'Categories & Guides'}</span>
          </h4>
          <ul className="space-y-2 text-xs font-medium text-slate-400">
            <li>
              <a href="/categories" className="hover:text-amber-300 transition-colors block font-bold text-slate-300">
                {lang === 'hi' ? '📂 सभी 5 श्रेणियां' : '📂 All Game Categories'}
              </a>
            </li>
            <li>
              <a href="/categories/brain-puzzles" className="hover:text-amber-300 transition-colors block">
                {lang === 'hi' ? 'दिमागी व तर्क खेल' : 'Brain & Logic Puzzles'}
              </a>
            </li>
            <li>
              <a href="/categories/action-reflex" className="hover:text-amber-300 transition-colors block">
                {lang === 'hi' ? 'रिफ्लेक्स व एक्शन गेम्स' : 'Reflex & Action Runners'}
              </a>
            </li>
            <li>
              <a href="/games" className="hover:text-amber-300 transition-colors block">
                {lang === 'hi' ? 'गेम मैनुअल व कंट्रोल्स' : 'Game Manuals & Controls'}
              </a>
            </li>
            <li>
              <a href="/parents-guide" className="hover:text-amber-300 transition-colors block">
                {lang === 'hi' ? 'अभिभावक गाइड' : 'Parents & Teachers Guide'}
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Trust, Legal & Contact */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'hi' ? 'सुरक्षा व संपर्क' : 'Trust & Legal'}</span>
          </h4>
          <ul className="space-y-2 text-xs font-medium text-slate-400">
            <li>
              <a href="/privacy" className="hover:text-emerald-300 transition-colors block">
                {lang === 'hi' ? 'प्राइवेसी पॉलिसी (Privacy)' : 'Privacy Policy'}
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-emerald-300 transition-colors block">
                {lang === 'hi' ? 'नियम और शर्तें (Terms)' : 'Terms of Service'}
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-emerald-300 transition-colors block">
                {lang === 'hi' ? 'हमारे बारे में (About)' : 'About KiddoZap'}
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'hi' ? 'संपर्क करें (Contact)' : 'Contact Support'}</span>
              </a>
            </li>
            <li>
              <button
                onClick={() => {
                  sounds.playPop();
                  onOpenInstall();
                }}
                className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 text-cyan-400 font-bold"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install KiddoZap Web App'}</span>
              </button>
            </li>
            <li className="pt-1 text-[11px] text-slate-500">
              Email:{' '}
              <a href="mailto:support@kiddozap.com" className="text-slate-400 hover:text-cyan-300">
                support@kiddozap.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="max-w-6xl mx-auto pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <p>
          © 2026 <strong>KiddoZap (kiddozap.com)</strong>. All Rights Reserved. Built for safe, healthy kids gaming.
        </p>
        <p className="flex items-center gap-1 text-[11px]">
          <span>Made for young minds</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          <span>Non-Violent &amp; Educational</span>
        </p>
      </div>
    </footer>
  );
};
