/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Globe,
  Smartphone,
  Star,
  Play,
  Flame,
  Award,
  Search,
  Zap,
  GraduationCap,
  Layers,
  Menu,
  Download,
} from 'lucide-react';
import { GAMES, BADGES, GRADE_TABS } from './data/games';
import { GameId, GradeLevel, Language, PlayerProfile } from './types';
import { sounds } from './utils/audio';
import { MemoryGame } from './components/MemoryGame';
import { MathQuest } from './components/MathQuest';
import { PatternMaster } from './components/PatternMaster';
import { ShadowMatch } from './components/ShadowMatch';
import { ColorLab } from './components/ColorLab';
import { OddOneOut } from './components/OddOneOut';
import { WordSparks } from './components/WordSparks';
import { KiddoRunner } from './components/KiddoRunner';
import { KnifeHit } from './components/KnifeHit';
import { MiniGolf } from './components/MiniGolf';
import { TowerStack } from './components/TowerStack';
import { TapDunkShots } from './components/TapDunkShots';
import { HelixJump } from './components/HelixJump';
import { DriftBoss } from './components/DriftBoss';
import { TrophyRoom } from './components/TrophyRoom';
import { ProfileModal } from './components/ProfileModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { KiddoZapLogo } from './components/KiddoZapLogo';
import { LegalPagesModal, LegalPageTab } from './components/LegalPagesModal';
import { TopUtilityNav, MobileMenuDrawer } from './components/AdSenseNavMenu';
import { Footer } from './components/Footer';
import { AdBanner } from './components/AdBanner';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'kiddozap_player_profile_v2';

const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Kiddo Champ',
  avatar: '🦁',
  totalStars: 15,
  unlockedBadges: ['starter'],
  soundEnabled: true,
  selectedGrade: 'all',
  gameStats: {
    memoryBestMoves: 999,
    mathHighScore: 0,
    patternBestRound: 0,
    shadowCompleted: 0,
    colorsCompleted: 0,
    logicScore: 0,
    wordScore: 0,
    runnerHighScore: 0,
    knifeHighScore: 0,
    golfHighScore: 0,
    stackHighScore: 0,
    basketHighScore: 0,
    helixHighScore: 0,
    driftHighScore: 0,
  },
};

export default function App() {
  const [currentView, setCurrentView] = useState<GameId | 'hub' | 'trophy'>('hub');
  const [lang, setLang] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem('kiddozap_lang');
      if (savedLang === 'hi' || savedLang === 'en') return savedLang;
    } catch {
      // ignore
    }
    return 'en';
  });
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [activeLegalTab, setActiveLegalTab] = useState<LegalPageTab>('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<'all' | GradeLevel>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          gameStats: { ...DEFAULT_PROFILE.gameStats, ...parsed.gameStats },
        };
      }
    } catch {
      // storage error fallback
    }
    return DEFAULT_PROFILE;
  });

  // Keep sound manager in sync
  useEffect(() => {
    sounds.enabled = profile.soundEnabled;
  }, [profile.soundEnabled]);

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  const toggleSound = () => {
    const next = !profile.soundEnabled;
    sounds.enabled = next;
    if (next) sounds.playPop();
    setProfile((prev) => ({ ...prev, soundEnabled: next }));
  };

  const toggleLanguage = () => {
    sounds.playPop(1.1);
    setLang((prev) => {
      const next = prev === 'hi' ? 'en' : 'hi';
      try {
        localStorage.setItem('kiddozap_lang', next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  const checkBadgeUnlocks = (updatedStats: PlayerProfile['gameStats'], totalStars: number) => {
    const currentBadges = new Set(profile.unlockedBadges);
    currentBadges.add('starter');

    if (updatedStats.runnerHighScore >= 100) {
      currentBadges.add('speed_runner');
    }
    if ((updatedStats.knifeHighScore || 0) >= 25) {
      currentBadges.add('knife_master');
    }
    if ((updatedStats.golfHighScore || 0) > 0) {
      currentBadges.add('golf_pro');
    }
    if (updatedStats.stackHighScore >= 12) {
      currentBadges.add('tower_architect');
    }
    if ((updatedStats.basketHighScore || 0) >= 10) {
      currentBadges.add('dunk_master');
    }
    if ((updatedStats.helixHighScore || 0) >= 150) {
      currentBadges.add('helix_crusher');
    }
    if ((updatedStats.driftHighScore || 0) >= 80) {
      currentBadges.add('drift_legend');
    }
    if (updatedStats.memoryBestMoves <= 20 && updatedStats.memoryBestMoves > 0) {
      currentBadges.add('memory_master');
    }
    if (updatedStats.mathHighScore >= 60) {
      currentBadges.add('math_wizard');
    }
    if (updatedStats.patternBestRound >= 5) {
      currentBadges.add('rhythm_star');
    }
    if (updatedStats.shadowCompleted >= 1) {
      currentBadges.add('detective');
    }
    if (updatedStats.colorsCompleted >= 2) {
      currentBadges.add('alchemist');
    }
    if (totalStars >= 30) {
      currentBadges.add('mind_genius');
    }

    return Array.from(currentBadges);
  };

  const addStarsAndStats = (
    starsWon: number,
    statUpdate: Partial<PlayerProfile['gameStats']>
  ) => {
    setProfile((prev) => {
      const newStars = prev.totalStars + starsWon;
      const newStats = { ...prev.gameStats, ...statUpdate };
      const newBadges = checkBadgeUnlocks(newStats, newStars);

      if (newBadges.length > prev.unlockedBadges.length) {
        sounds.playFanfare();
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
        });
      }

      return {
        ...prev,
        totalStars: newStars,
        gameStats: newStats,
        unlockedBadges: newBadges,
      };
    });
  };

  // Filter games by Grade/Class and Search
  const filteredGames = GAMES.filter((g) => {
    if (selectedGrade !== 'all') {
      if (!g.gradeLevels.includes(selectedGrade)) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEn = g.titleEn.toLowerCase().includes(q) || g.subtitleEn.toLowerCase().includes(q) || g.categoryEn.toLowerCase().includes(q);
      const matchHi = g.titleHi.toLowerCase().includes(q) || g.subtitleHi.toLowerCase().includes(q) || g.categoryHi.toLowerCase().includes(q);
      return matchEn || matchHi;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-orange-50/30 to-yellow-50/70 text-slate-800 font-body selection:bg-amber-200">
      {/* 1. TOP HORIZONTAL UTILITY BAR (AdSense Menus & Controls) */}
      <TopUtilityNav
        lang={lang}
        soundEnabled={profile.soundEnabled}
        onToggleSound={toggleSound}
        onToggleLang={toggleLanguage}
        onOpenLegal={(tab) => {
          setActiveLegalTab(tab);
          setIsLegalModalOpen(true);
        }}
        onGoHome={() => setCurrentView('hub')}
        onOpenInstall={() => setIsInstallModalOpen(true)}
      />

      {/* 2. MAIN BRAND & PLAYER ROW */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs px-3 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Left: KiddoZap Logo & Brand */}
          <button
            id="header-home-btn"
            onClick={() => {
              sounds.playPop();
              setCurrentView('hub');
            }}
            className="text-left flex items-center gap-3 group shrink-0"
          >
            <KiddoZapLogo size={42} variant="header" />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-amber-900 leading-tight font-display group-hover:text-amber-800 transition-colors">
                  KiddoZap
                </h1>
                <span className="text-[10px] bg-amber-500 text-white font-black px-2 py-0.5 rounded-lg uppercase tracking-wider hidden sm:inline shadow-2xs">
                  {lang === 'hi' ? 'किड्स गेम्स' : 'Fun & Mind Games'}
                </span>
              </div>
              <p className="text-[11px] text-amber-700/80 font-bold hidden md:block">
                {lang === 'hi'
                  ? 'कक्षा 1-12 व 18 वर्ष से कम के मजेदार खेल'
                  : 'Puzzles, Run & Brain Games (Class 1-12 & Below 18)'}
              </p>
            </div>
          </button>

          {/* Right Action Icons: Profile, Stars, Trophies, Compose, Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Kid Avatar & Name */}
            <button
              id="header-profile-btn"
              onClick={() => {
                sounds.playPop(1.1);
                setIsProfileOpen(true);
              }}
              className="flex items-center gap-2 p-1.5 sm:pr-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-slate-800 transition-all border border-amber-300/80 active:scale-95 shadow-2xs"
              title={lang === 'hi' ? 'अवतार बदलें' : 'Change Avatar'}
            >
              <span className="w-8 h-8 rounded-xl bg-white shadow-2xs flex items-center justify-center text-xl">
                {profile.avatar}
              </span>
              <span className="font-extrabold text-xs sm:text-sm hidden sm:inline max-w-[100px] truncate">
                {profile.name}
              </span>
            </button>

            {/* Stars counter pill */}
            <div
              id="stars-badge"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400/20 text-amber-900 rounded-xl font-black text-xs border border-amber-300/80 shadow-2xs"
              title={lang === 'hi' ? 'कुल सितारे' : 'Total Stars'}
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
              <span>{profile.totalStars}</span>
            </div>

            {/* Trophy Room Button */}
            <button
              id="view-trophy-btn"
              onClick={() => {
                sounds.playPop();
                setCurrentView('trophy');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border active:scale-95 shadow-2xs flex items-center gap-1.5 ${
                currentView === 'trophy'
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
              }`}
              title={lang === 'hi' ? 'ट्रॉफी व मेडल' : 'Trophies'}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">
                {lang === 'hi' ? 'मेडल' : 'Trophies'}
              </span>
            </button>

            {/* 1-Tap App Install Button for End Users */}
            <button
              id="header-install-app-btn"
              onClick={() => {
                sounds.playPop(1.1);
                setIsInstallModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all border active:scale-95 shadow-2xs bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white border-orange-400"
              title={lang === 'hi' ? 'सीधे ऐप इंस्टॉल करें' : 'Install KiddoZap App'}
            >
              <Download className="w-3.5 h-3.5 text-yellow-200 animate-bounce" />
              <span>{lang === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>
            </button>

            {/* Mobile Drawer Menu Button (Small Screens) */}
            <button
              id="mobile-menu-drawer-btn"
              onClick={() => {
                sounds.playPop();
                setIsMobileMenuOpen(true);
              }}
              className="md:hidden p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 active:scale-95 transition-all shadow-2xs"
              title="Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main View Router */}
      <main className="pb-16 pt-4">
        {currentView === 'hub' && (
          <div id="games-hub-view" className="max-w-6xl mx-auto px-3 sm:px-4">
            {/* Daily Brain Quest Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 p-5 sm:p-7 text-white shadow-xl shadow-amber-200/70 mb-5 border-2 border-amber-300/60">
              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 text-white border border-white/20">
                  <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                  <span>
                    {lang === 'hi' ? 'KiddoZap • थिंक • प्ले • ज़ैप!' : "KiddoZap • Think • Play • Zap!"}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-display drop-shadow-xs">
                  {lang === 'hi'
                    ? `नमस्ते ${profile.name}! आज क्या खेलना पसंद करोगे?`
                    : `Hey ${profile.name}! What would you like to play today?`}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-white/95 mt-1 max-w-lg leading-relaxed">
                  {lang === 'hi'
                    ? 'किड्डो रन डैश, नाइफ हिट, मिनी गोल्फ, टैप डंक शॉट्स, हेलिक्स जंप और दिमागी पहेलियां! अपनी कक्षा या उम्र चुनें।'
                    : 'Kiddo Run Dash, Knife Hit, Mini Golf, Tap Dunk Shots, Helix Jump & Brain Puzzles! Filter by grade & age.'}
                </p>

                <div className="flex flex-wrap items-center gap-2.5 mt-4">
                  <button
                    id="hero-play-runner-btn"
                    onClick={() => {
                      sounds.playPop(1.2);
                      setCurrentView('runner');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-amber-50 text-amber-900 rounded-2xl font-black text-xs shadow-md active:scale-95 transition-all"
                  >
                    <span>🏃‍♂️ {lang === 'hi' ? 'RunGame खेलें' : 'Play Run Dash'}</span>
                  </button>

                  <button
                    id="hero-play-knife-btn"
                    onClick={() => {
                      sounds.playPop(1.2);
                      setCurrentView('knife');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs shadow-md active:scale-95 transition-all"
                  >
                    <span>🎯 {lang === 'hi' ? 'नाइफ हिट' : 'Knife Hit'}</span>
                  </button>

                  <button
                    id="hero-play-golf-btn"
                    onClick={() => {
                      sounds.playPop(1.2);
                      setCurrentView('golf');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-xs shadow-md active:scale-95 transition-all"
                  >
                    <span>⛳ {lang === 'hi' ? 'मिनी गोल्फ' : 'Mini Golf'}</span>
                  </button>
                </div>
              </div>

              {/* KiddoZap Brand Logo Badge showcase on Hero */}
              <div className="absolute right-2 sm:right-6 -bottom-6 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 flex items-center justify-center pointer-events-none opacity-85 sm:opacity-100 transform rotate-3 hover:rotate-0 transition-transform">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-yellow-300/30 blur-xl animate-pulse" />
                  <KiddoZapLogo size={180} variant="badge" className="w-32 h-32 sm:w-44 sm:h-44" />
                </div>
              </div>
            </div>

            {/* Grade / Class Level Category Tabs (Below 18) */}
            <div className="bg-white rounded-3xl p-3 sm:p-4 border-2 border-amber-200/80 shadow-xs mb-5">
              <div className="flex items-center justify-between gap-2 mb-2 px-1">
                <div className="flex items-center gap-1.5 text-slate-800 font-black text-xs">
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'hi' ? 'कक्षा व उम्र के अनुसार खेल (Standard / Age Below 18):' : 'Select Grade / Standard (Below 18):'}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
                  {filteredGames.length} {lang === 'hi' ? 'उपलब्ध खेल' : 'games available'}
                </span>
              </div>

              {/* Grade Tabs Slider */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {GRADE_TABS.map((tab) => {
                  const isSelected = selectedGrade === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        sounds.playPop(1.1);
                        setSelectedGrade(tab.id as 'all' | GradeLevel);
                      }}
                      className={`flex flex-col items-center px-3 py-2 rounded-2xl transition-all whitespace-nowrap text-left border ${
                        isSelected
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs scale-102 font-black'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 font-bold'
                      }`}
                    >
                      <span className="text-xs">
                        {lang === 'hi' ? tab.labelHi : tab.labelEn}
                      </span>
                      <span className={`text-[10px] ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                        {lang === 'hi' ? tab.ageHi : tab.ageEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Bar & Games Count */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>
                  {selectedGrade === 'all'
                    ? lang === 'hi' ? 'सभी 11 मनोरंजक व दिमागी खेल' : 'All 11 Kids & Mind Games'
                    : lang === 'hi' ? `चुनी गई कक्षा के लिए खेल (${filteredGames.length})` : `Games for Selected Grade (${filteredGames.length})`}
                </span>
              </div>

              <div className="relative w-48 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'hi' ? 'खेल खोजें...' : 'Search games...'}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-amber-400 shadow-2xs"
                />
              </div>
            </div>

            {/* Games Grid (11 Fun & Brainy Mini-Games) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, type: 'spring', stiffness: 350, damping: 25 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-100 hover:border-amber-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
                >
                  {/* Background glow circle */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-amber-50/80 group-hover:scale-125 transition-transform duration-300 pointer-events-none" />

                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform">
                        {game.icon}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">
                          {lang === 'hi' ? game.categoryHi : game.categoryEn}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                          {lang === 'hi' ? game.ageLabelHi : game.recommendedAge}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight font-display">
                      {lang === 'hi' ? game.titleHi : game.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">
                      {lang === 'hi' ? game.subtitleHi : game.subtitleEn}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? '3 सितारे' : 'Earn Stars'}</span>
                    </div>

                    <button
                      id={`play-game-${game.id}-btn`}
                      onClick={() => {
                        sounds.playPop(1.2);
                        setCurrentView(game.id);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-xs active:scale-95 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{lang === 'hi' ? 'खेलें' : 'Play'}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Google AdSense Compliant Family Safe Banner */}
            <AdBanner />
          </div>
        )}

        {/* 1. Kiddo Run Dash (RunGame) */}
        {currentView === 'runner' && (
          <KiddoRunner
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                runnerHighScore: Math.max(profile.gameStats.runnerHighScore, score),
              });
            }}
          />
        )}

        {/* 2. Knife Hit Target Master (CrazyGames inspired) */}
        {currentView === 'knife' && (
          <KnifeHit
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                knifeHighScore: Math.max(profile.gameStats.knifeHighScore || 0, score),
              });
            }}
          />
        )}

        {/* 3. Mini Golf Club (CrazyGames inspired) */}
        {currentView === 'golf' && (
          <MiniGolf
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                golfHighScore: profile.gameStats.golfHighScore ? Math.min(profile.gameStats.golfHighScore, score) : score,
              });
            }}
          />
        )}

        {/* 4. Tower Block Crafter */}
        {currentView === 'stack' && (
          <TowerStack
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                stackHighScore: Math.max(profile.gameStats.stackHighScore, score),
              });
            }}
          />
        )}

        {/* 5. Tap-Tap Dunk Shots (CrazyGames inspired) */}
        {currentView === 'basket' && (
          <TapDunkShots
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                basketHighScore: Math.max(profile.gameStats.basketHighScore || 0, score),
              });
            }}
          />
        )}

        {/* 6. Helix Spiral Jump (CrazyGames inspired) */}
        {currentView === 'helix' && (
          <HelixJump
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                helixHighScore: Math.max(profile.gameStats.helixHighScore || 0, score),
              });
            }}
          />
        )}

        {/* 7. Drift Boss Highway (CrazyGames inspired) */}
        {currentView === 'drift' && (
          <DriftBoss
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                driftHighScore: Math.max(profile.gameStats.driftHighScore || 0, score),
              });
            }}
          />
        )}

        {/* 5. Animal Memory Match */}
        {currentView === 'memory' && (
          <MemoryGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, moves) => {
              addStarsAndStats(stars, {
                memoryBestMoves: Math.min(profile.gameStats.memoryBestMoves, moves),
              });
            }}
          />
        )}

        {/* 6. Balloon Math Hero */}
        {currentView === 'math' && (
          <MathQuest
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                mathHighScore: Math.max(profile.gameStats.mathHighScore, score),
              });
            }}
          />
        )}

        {/* 7. Simon Sound Spark */}
        {currentView === 'pattern' && (
          <PatternMaster
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, roundReached) => {
              addStarsAndStats(stars, {
                patternBestRound: Math.max(profile.gameStats.patternBestRound, roundReached),
              });
            }}
          />
        )}

        {/* 8. Shadow Detective */}
        {currentView === 'shadow' && (
          <ShadowMatch
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars) => {
              addStarsAndStats(stars, {
                shadowCompleted: profile.gameStats.shadowCompleted + 1,
              });
            }}
          />
        )}

        {/* 9. Magic Potion Color Lab */}
        {currentView === 'colors' && (
          <ColorLab
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars) => {
              addStarsAndStats(stars, {
                colorsCompleted: profile.gameStats.colorsCompleted + 1,
              });
            }}
          />
        )}

        {/* 10. Odd One Out Logic Teaser */}
        {currentView === 'logic' && (
          <OddOneOut
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                logicScore: Math.max(profile.gameStats.logicScore, score),
              });
            }}
          />
        )}

        {/* 11. Word Builder Spelling Sparks */}
        {currentView === 'word' && (
          <WordSparks
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                wordScore: Math.max(profile.gameStats.wordScore, score),
              });
            }}
          />
        )}

        {/* Trophy & Badges Hall */}
        {currentView === 'trophy' && (
          <TrophyRoom
            lang={lang}
            profile={profile}
            onBack={() => setCurrentView('hub')}
          />
        )}
      </main>

      {/* Profile & Avatar Customization Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        lang={lang}
        onSave={(name, avatar) => {
          setProfile((prev) => ({ ...prev, name, avatar }));
        }}
      />

      {/* Direct App Install Modal */}
      <AndroidInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        lang={lang}
      />

      {/* AdSense Mandatory Legal Pages Modal */}
      <LegalPagesModal
        isOpen={isLegalModalOpen}
        activeTab={activeLegalTab}
        onClose={() => setIsLegalModalOpen(false)}
        lang={lang}
        onTabChange={(tab) => setActiveLegalTab(tab)}
      />

      {/* Responsive Mobile Drawer Menu */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        lang={lang}
        onOpenLegal={(tab) => {
          setActiveLegalTab(tab);
          setIsLegalModalOpen(true);
        }}
        onGoHome={() => setCurrentView('hub')}
        onOpenTrophies={() => setCurrentView('trophy')}
        onOpenInstall={() => setIsInstallModalOpen(true)}
      />

      {/* Google AdSense Compliant Footer */}
      <Footer
        lang={lang}
        onOpenLegal={(tab) => {
          setActiveLegalTab(tab);
          setIsLegalModalOpen(true);
        }}
        onOpenInstall={() => setIsInstallModalOpen(true)}
      />
    </div>
  );
}
