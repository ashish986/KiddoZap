import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  Home,
  Brain,
  Zap,
  GraduationCap,
  Info,
  Lock,
  FileText,
  Mail,
  ShieldCheck,
  ChevronDown,
  Trophy,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { Language, GameId } from '../types';
import { LegalPageTab } from './LegalPagesModal';
import { sounds } from '../utils/audio';
import { KiddoZapLogo } from './KiddoZapLogo';

interface AdSenseNavMenuProps {
  lang: Language;
  onOpenLegal: (tab: LegalPageTab) => void;
  onSelectCategory?: (category: string) => void;
  onGoHome: () => void;
  onOpenTrophies: () => void;
  onOpenInstall: () => void;
}

export const AdSenseNavMenu: React.FC<AdSenseNavMenuProps> = ({
  lang,
  onOpenLegal,
  onSelectCategory,
  onGoHome,
  onOpenTrophies,
  onOpenInstall,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLegalDropdownOpen, setIsLegalDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLegalDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-700">
        <button
          onClick={() => {
            sounds.playPop();
            onGoHome();
          }}
          className="px-3 py-1.5 rounded-xl hover:bg-amber-100 hover:text-amber-900 transition-colors flex items-center gap-1"
        >
          <Home className="w-3.5 h-3.5 text-amber-600" />
          <span>{lang === 'hi' ? 'होम' : 'Home'}</span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            onOpenLegal('about');
          }}
          className="px-3 py-1.5 rounded-xl hover:bg-amber-100 hover:text-amber-900 transition-colors flex items-center gap-1"
        >
          <Info className="w-3.5 h-3.5 text-amber-600" />
          <span>{lang === 'hi' ? 'हमारे बारे में' : 'About'}</span>
        </button>

        {/* Legal & Policies Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              sounds.playPop();
              setIsLegalDropdownOpen(!isLegalDropdownOpen);
            }}
            className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 border ${
              isLegalDropdownOpen
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'hover:bg-amber-100 hover:text-amber-900 border-transparent'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'पॉलिसी व सुरक्षा' : 'Policy & Legal'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isLegalDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isLegalDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-amber-200 py-1.5 z-40"
              >
                <button
                  onClick={() => {
                    sounds.playPop();
                    setIsLegalDropdownOpen(false);
                    onOpenLegal('privacy');
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-amber-50 flex items-center gap-2 text-xs font-semibold text-slate-700"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{lang === 'hi' ? 'प्राइवेसी पॉलिसी (Privacy)' : 'Privacy Policy'}</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playPop();
                    setIsLegalDropdownOpen(false);
                    onOpenLegal('terms');
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-amber-50 flex items-center gap-2 text-xs font-semibold text-slate-700"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>{lang === 'hi' ? 'नियम व शर्तें (Terms)' : 'Terms of Service'}</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playPop();
                    setIsLegalDropdownOpen(false);
                    onOpenLegal('coppa');
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-amber-50 flex items-center gap-2 text-xs font-semibold text-slate-700"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                  <span>{lang === 'hi' ? 'बाल सुरक्षा (COPPA)' : 'Child Safety (COPPA)'}</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={() => {
                    sounds.playPop();
                    setIsLegalDropdownOpen(false);
                    onOpenLegal('contact');
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-amber-50 flex items-center gap-2 text-xs font-semibold text-slate-700"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>{lang === 'hi' ? 'संपर्क करें (Contact)' : 'Contact Support'}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            onOpenLegal('contact');
          }}
          className="px-3 py-1.5 rounded-xl hover:bg-amber-100 hover:text-amber-900 transition-colors flex items-center gap-1"
        >
          <Mail className="w-3.5 h-3.5 text-amber-600" />
          <span>{lang === 'hi' ? 'संपर्क' : 'Contact'}</span>
        </button>
      </div>

      {/* Main Hamburger Menu Button (Accessible on Mobile & Desktop) */}
      <button
        onClick={() => {
          sounds.playPop();
          setIsOpen(!isOpen);
        }}
        className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-100/90 hover:bg-amber-200 text-amber-900 font-black text-xs flex items-center gap-1.5 border border-amber-300 shadow-2xs transition-all active:scale-95"
        title="Open Navigation Menu"
        aria-label="Navigation Menu"
      >
        <Menu className="w-4 h-4 text-amber-700" />
        <span className="hidden sm:inline">{lang === 'hi' ? 'मेन्यू' : 'Menu'}</span>
      </button>

      {/* Slide-over Mobile / Fullscreen Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-y-auto border-l-4 border-amber-400"
            >
              {/* Drawer Header */}
              <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <KiddoZapLogo size={36} variant="header" />
                  <div>
                    <h3 className="font-black font-display text-base tracking-tight leading-tight">
                      KiddoZap Menu
                    </h3>
                    <p className="text-[11px] text-amber-100">kiddozap.com</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setIsOpen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="p-4 space-y-4 flex-1">
                {/* Main Navigation */}
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-800 mb-2 px-2">
                    {lang === 'hi' ? 'नेविगेशन' : 'Navigation'}
                  </h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        sounds.playPop();
                        onGoHome();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50 text-slate-700 text-xs font-bold transition-colors"
                    >
                      <Home className="w-4 h-4 text-amber-600" />
                      <span>{lang === 'hi' ? 'गेम्स हब (सभी खेल)' : 'Games Hub (All Games)'}</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playPop();
                        onOpenTrophies();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50 text-slate-700 text-xs font-bold transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>{lang === 'hi' ? 'ट्रॉफी रूम व बैज' : 'Trophy Room & Badges'}</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playPop();
                        onOpenInstall();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-900 text-xs font-bold transition-colors border border-orange-200"
                    >
                      <Smartphone className="w-4 h-4 text-orange-600" />
                      <span>{lang === 'hi' ? 'एंड्रॉयड ऐप (APK) डाउनलोड' : 'Android App (APK) Setup'}</span>
                    </button>
                  </div>
                </div>

                {/* Google AdSense Mandatory Pages */}
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2 px-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                    <span>{lang === 'hi' ? 'ऐडसेंस व लीगल नीतियां' : 'AdSense & Legal'}</span>
                  </h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        sounds.playPop();
                        onOpenLegal('about');
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-amber-50 text-slate-700 text-xs font-semibold"
                    >
                      <Info className="w-4 h-4 text-amber-600" />
                      <span>{lang === 'hi' ? 'हमारे बारे में (About Us)' : 'About KiddoZap'}</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playPop();
                        onOpenLegal('privacy');
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-amber-50 text-slate-700 text-xs font-semibold"
                    >
                      <Lock className="w-4 h-4 text-emerald-600" />
                      <span>{lang === 'hi' ? 'प्राइवेसी पॉलिसी (Privacy Policy)' : 'Privacy Policy'}</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playPop();
                        onOpenLegal('terms');
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-amber-50 text-slate-700 text-xs font-semibold"
                    >
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span>{lang === 'hi' ? 'नियम और शर्तें (Terms of Service)' : 'Terms of Service'}</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playPop();
                        onOpenLegal('coppa');
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-amber-50 text-slate-700 text-xs font-semibold"
                    >
                      <ShieldCheck className="w-4 h-4 text-rose-600" />
                      <span>{lang === 'hi' ? 'बाल सुरक्षा नीति (COPPA Child Safety)' : 'Child Safety & COPPA'}</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playPop();
                        onOpenLegal('contact');
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-amber-50 text-slate-700 text-xs font-semibold"
                    >
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>{lang === 'hi' ? 'संपर्क करें (Contact Us)' : 'Contact Us'}</span>
                    </button>
                  </div>
                </div>

                {/* Safe Kids Badge */}
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-1">
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                    <span>Safe Kids Web Platform</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Compliant with Google AdSense Families Policy & COPPA
                  </p>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400">
                KiddoZap • kiddozap.com © 2026
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
