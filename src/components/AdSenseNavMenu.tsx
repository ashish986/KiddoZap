import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  Home,
  Info,
  Lock,
  FileText,
  Mail,
  ShieldCheck,
  Trophy,
  Smartphone,
  Download,
  Volume2,
  VolumeX,
  Globe,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';
import { LegalPageTab } from './LegalPagesModal';
import { sounds } from '../utils/audio';
import { KiddoZapLogo } from './KiddoZapLogo';

interface TopNavProps {
  lang: Language;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onToggleLang: () => void;
  onOpenLegal: (tab: LegalPageTab) => void;
  onGoHome: () => void;
  onOpenInstall: () => void;
}

export const TopUtilityNav: React.FC<TopNavProps> = ({
  lang,
  soundEnabled,
  onToggleSound,
  onToggleLang,
  onOpenLegal,
  onGoHome,
  onOpenInstall,
}) => {
  return (
    <div className="w-full bg-slate-900 text-slate-300 text-xs border-b border-slate-800 py-1.5 px-3 sm:px-6 select-none relative z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left Side: Horizontal Menu Links */}
        <nav className="flex items-center gap-1 sm:gap-2 font-medium shrink min-w-0">
          <button
            onClick={() => {
              sounds.playPop();
              onGoHome();
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
          >
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? 'होम' : 'Home'}</span>
          </button>

          <span className="text-slate-700 hidden sm:inline">•</span>

          <a
            href="/games"
            className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>{lang === 'hi' ? 'गेम गाइड्स' : 'Game Guides'}</span>
          </a>

          <span className="text-slate-700 hidden sm:inline">•</span>

          <a
            href="/categories"
            className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
          >
            <span>📂</span>
            <span>{lang === 'hi' ? 'श्रेणियां' : 'Categories'}</span>
          </a>

          <span className="text-slate-700 hidden md:inline">•</span>

          <a
            href="/articles"
            className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
          >
            <span>📚</span>
            <span>{lang === 'hi' ? 'आर्टिकल्स' : 'Articles'}</span>
          </a>

          <span className="text-slate-700 hidden sm:inline">•</span>

          <a
            href="/about"
            className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
          >
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span>{lang === 'hi' ? 'हमारे बारे में' : 'About'}</span>
          </a>

          <span className="text-slate-700 hidden sm:inline">•</span>

          {/* Policy & Legal Direct Opener Button */}
          <a
            href="/privacy"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-emerald-300 hover:text-white hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors whitespace-nowrap shrink-0"
            title={lang === 'hi' ? 'प्राइवेसी व सुरक्षा नीतियां' : 'Privacy & Safety Policies'}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'hi' ? 'पॉलिसी' : 'Policy & Legal'}</span>
          </a>

          <span className="text-slate-700 hidden lg:inline">•</span>

          <a
            href="/contact"
            className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-md hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
          >
            <Mail className="w-3.5 h-3.5 text-rose-400" />
            <span>{lang === 'hi' ? 'संपर्क' : 'Contact'}</span>
          </a>
        </nav>

        {/* Right Side: Language, Sound, Android pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors text-xs font-semibold ${
              soundEnabled ? 'text-emerald-400 hover:bg-white/10' : 'text-slate-500 hover:bg-white/10'
            }`}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{soundEnabled ? 'Sound ON' : 'Muted'}</span>
          </button>

          <span className="text-slate-700">|</span>

          {/* Language Switch */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            title={lang === 'en' ? 'Switch to Hindi (हिंदी)' : 'Switch to English'}
          >
            <Globe className="w-3 h-3 text-sky-400" />
            <span>{lang === 'hi' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Quick Direct Install App Button */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenInstall();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/25 text-amber-300 hover:bg-amber-500/35 border border-amber-400/40 text-[11px] font-bold transition-all"
            title={lang === 'hi' ? 'सीधे ऐप इंस्टॉल करें' : 'Direct Install App'}
          >
            <Download className="w-3 h-3 text-amber-300" />
            <span>{lang === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenLegal: (tab: LegalPageTab) => void;
  onGoHome: () => void;
  onOpenTrophies: () => void;
  onOpenInstall: () => void;
  onOpenCompose?: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenLegal,
  onGoHome,
  onOpenTrophies,
  onOpenInstall,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="w-full max-w-xs sm:max-w-sm bg-slate-900 h-full shadow-2xl flex flex-col overflow-y-auto border-l border-indigo-500/40 text-slate-100"
        >
          {/* Drawer Header */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border-b border-indigo-500/30 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <KiddoZapLogo size={36} variant="header" />
              <div>
                <h3 className="font-black font-display text-base tracking-tight leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400">KiddoZap</span> Menu
                </h3>
                <p className="text-[11px] text-cyan-400">kiddozap.com</p>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="p-4 space-y-4 flex-1">
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-cyan-400 mb-2 px-2">
                {lang === 'hi' ? 'गेम नेविगेशन' : 'Navigation'}
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    sounds.playPop();
                    onGoHome();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors"
                >
                  <Home className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'hi' ? 'गेम्स हब (सभी खेल)' : 'Games Hub (All Games)'}</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playPop();
                    onOpenTrophies();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'hi' ? 'ट्रॉफी रूम व बैज' : 'Trophy Room & Badges'}</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playPop();
                    onOpenInstall();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-black transition-all shadow-md shadow-indigo-950 active:scale-98"
                >
                  <Download className="w-4 h-4 text-yellow-300 animate-bounce" />
                  <span>{lang === 'hi' ? '📲 KiddoZap ऐप इंस्टॉल करें' : '📲 Install KiddoZap App'}</span>
                </button>
              </div>
            </div>

            {/* Google AdSense Mandatory Pages */}
            <div className="pt-2 border-t border-slate-800">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-400 mb-2 px-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'hi' ? 'नीति व जानकारी' : 'Policies & Guides'}</span>
              </h4>
              <div className="space-y-1">
                <a
                  href="/games"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>{lang === 'hi' ? 'गेम गाइड्स (Game Guides)' : 'Game Guides & Manuals'}</span>
                </a>

                <a
                  href="/categories"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  <span className="text-base">📂</span>
                  <span>{lang === 'hi' ? 'गेम श्रेणियां (Categories)' : 'Game Categories (5 Tiers)'}</span>
                </a>

                <a
                  href="/articles"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  <span className="text-base">📚</span>
                  <span>{lang === 'hi' ? 'रिसर्च आर्टिकल्स (Articles)' : 'Educational Research Hub'}</span>
                </a>

                <a
                  href="/parents-guide"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'hi' ? 'अभिभावक गाइड (Parents Guide)' : 'Parents & Teachers Guide'}</span>
                </a>

                <a
                  href="/about"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  <Info className="w-4 h-4 text-sky-400" />
                  <span>{lang === 'hi' ? 'हमारे बारे में (About Us)' : 'About KiddoZap'}</span>
                </a>

                <a
                  href="/privacy"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'hi' ? 'प्राइवेसी पॉलिसी (Privacy Policy)' : 'Privacy Policy & COPPA'}</span>
                </a>

                <a
                  href="/terms"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>{lang === 'hi' ? 'नियम और शर्तें (Terms of Service)' : 'Terms of Service'}</span>
                </a>

                <a
                  href="/contact"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  <Mail className="w-4 h-4 text-rose-400" />
                  <span>{lang === 'hi' ? 'संपर्क करें (Contact Us)' : 'Contact Us'}</span>
                </a>
              </div>
            </div>

            {/* Safe Kids Badge */}
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-indigo-500/30 text-center space-y-1">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Safe Kids Web Platform</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Compliant with Google AdSense Families Policy & COPPA
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500">
            KiddoZap • kiddozap.com © 2026
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
