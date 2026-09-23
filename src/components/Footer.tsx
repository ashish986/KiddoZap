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
    <footer className="mt-14 border-t-2 border-amber-200/80 bg-gradient-to-b from-amber-50/60 to-amber-100/70 text-slate-700 py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Col 1: Brand & Mission */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-3">
            <KiddoZapLogo size={42} variant="badge" />
            <div>
              <h3 className="text-xl font-black text-amber-900 font-display tracking-tight">
                KiddoZap
              </h3>
              <p className="text-xs font-semibold text-amber-700">
                {lang === 'hi'
                  ? 'बच्चों व किशोरों के लिए मजेदार व सुरक्षित दिमागी खेल'
                  : 'Fun & Safe Brain Games for Kids & Teens (Below 18)'}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 max-w-md leading-relaxed">
            {lang === 'hi'
              ? 'KiddoZap (kiddozap.com) पर कक्षा 1 से 12 और 18 वर्ष से कम उम्र के बच्चों के लिए रोमांचक नॉन-वायलेंट पहेलियां, रिफ्लेक्स गेम्स और मेंटल मैथ एक्टिविटीज उपलब्ध हैं। 100% फ्री और सुरक्षित।'
              : 'KiddoZap (kiddozap.com) provides non-violent, cognitive, reflex, and puzzle challenges specifically designed for students Class 1-12 and all learners under 18. 100% free to play.'}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'hi' ? 'चाइल्ड सेफ़्टी अनुपालन (COPPA)' : 'COPPA Child-Safe Platform'}</span>
            </span>
            <span className="text-[11px] bg-amber-200/80 text-amber-900 font-bold px-2.5 py-1 rounded-full">
              ⚡ Think • Play • Zap!
            </span>
          </div>
        </div>

        {/* Col 2: Legal & AdSense Pages */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 mb-3 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === 'hi' ? 'नीति व नियम (Policies)' : 'Legal & Policies'}</span>
          </h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-600">
            <li>
              <a
                href="/privacy"
                className="hover:text-amber-700 hover:underline transition-colors block"
              >
                {lang === 'hi' ? 'प्राइवेसी पॉलिसी (Privacy Policy)' : 'Privacy Policy'}
              </a>
            </li>
            <li>
              <a
                href="/terms"
                className="hover:text-amber-700 hover:underline transition-colors block"
              >
                {lang === 'hi' ? 'नियम और शर्तें (Terms of Service)' : 'Terms of Service'}
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="hover:text-amber-700 hover:underline transition-colors block"
              >
                {lang === 'hi' ? 'हमारे बारे में (About KiddoZap)' : 'About KiddoZap'}
              </a>
            </li>
            <li>
              <a
                href="/parents-guide"
                className="hover:text-amber-700 hover:underline transition-colors block"
              >
                {lang === 'hi' ? 'अभिभावक गाइड (Parents Guide)' : 'Parents & Teachers Guide'}
              </a>
            </li>
            <li>
              <a
                href="/games"
                className="hover:text-amber-700 hover:underline transition-colors block"
              >
                {lang === 'hi' ? 'गेम मैनुअल व गाइड (Game Guides)' : 'Game Manuals & Guides'}
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Support & App Download */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 mb-3 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === 'hi' ? 'सहायता व संपर्क' : 'Support & Contact'}</span>
          </h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-600">
            <li>
              <a
                href="/contact"
                className="hover:text-amber-700 hover:underline transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3 h-3 text-amber-600" />
                <span>{lang === 'hi' ? 'संपर्क करें (Contact Us)' : 'Contact Us'}</span>
              </a>
            </li>
            <li>
              <button
                onClick={() => {
                  sounds.playPop();
                  onOpenInstall();
                }}
                className="hover:text-amber-700 hover:underline transition-colors flex items-center gap-1.5 text-amber-900 font-bold"
              >
                <Download className="w-3.5 h-3.5 text-orange-600" />
                <span>{lang === 'hi' ? 'KiddoZap ऐप इंस्टॉल करें' : 'Install KiddoZap App'}</span>
              </button>
            </li>
            <li className="pt-2 text-[11px] text-slate-500">
              Email:{' '}
              <a href="mailto:support@kiddozap.com" className="text-amber-700 font-bold hover:underline">
                support@kiddozap.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="max-w-6xl mx-auto pt-6 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <p>
          © 2026 <strong>KiddoZap (kiddozap.com)</strong>. All Rights Reserved. Designed for safe, healthy kids gaming.
        </p>
        <p className="flex items-center gap-1 text-[11px]">
          <span>Made for young minds</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          <span>Non-Violent & Educational</span>
        </p>
      </div>
    </footer>
  );
};
