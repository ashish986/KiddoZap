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
  Palette,
} from 'lucide-react';
import { GAMES, BADGES, GRADE_TABS, CATEGORY_GROUPS } from './data/games';
import { GameId, GradeLevel, Language, PlayerProfile, GameCategoryGroup } from './types';
import { sounds } from './utils/audio';
import { THEMES, ThemeId } from './utils/theme';
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
import { TicTacToeGame } from './components/TicTacToeGame';
import { SudokuGame } from './components/SudokuGame';
import { FlappyHero } from './components/FlappyHero';
import { FruitSliceGame } from './components/FruitSliceGame';
import { SnakeGame } from './components/SnakeGame';
import { WhackAMoleGame } from './components/WhackAMoleGame';
import { PianoGame } from './components/PianoGame';
import { BalloonPopGame } from './components/BalloonPopGame';
import { ConnectFourGame } from './components/ConnectFourGame';
import { DinoRunGame } from './components/DinoRunGame';
import { BubbleShooterGame } from './components/BubbleShooterGame';
import { CardFlipMatchGame } from './components/CardFlipMatchGame';
import { NurseryRhymes } from './components/NurseryRhymes';
import GeoDashGame from './components/GeoDashGame';
import ColorSwitchGame from './components/ColorSwitchGame';
import PacMazeGame from './components/PacMazeGame';
import AimTrainerGame from './components/AimTrainerGame';
import RooftopParkourGame from './components/RooftopParkourGame';
import { SpaceInvadersGame } from './components/SpaceInvadersGame';
import { CrossyRoadGame } from './components/CrossyRoadGame';
import { MotoX3MGame } from './components/MotoX3MGame';
import { BrickBreakerGame } from './components/BrickBreakerGame';
import { JetpackJoyrideGame } from './components/JetpackJoyrideGame';
import Slope3DGame from './components/Slope3DGame';
import TunnelRush3DGame from './components/TunnelRush3DGame';
import { TrophyRoom } from './components/TrophyRoom';
import { ProfileModal } from './components/ProfileModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { KiddoZapLogo } from './components/KiddoZapLogo';
import { LegalPagesModal, LegalPageTab } from './components/LegalPagesModal';
import { TopUtilityNav, MobileMenuDrawer } from './components/AdSenseNavMenu';
import { Footer } from './components/Footer';
import { AdBanner } from './components/AdBanner';
import { EducationalHub } from './components/EducationalHub';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'kiddozap_player_profile_v2';

const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Kiddo Champ',
  avatar: '🦁',
  totalStars: 15,
  unlockedBadges: ['starter'],
  soundEnabled: true,
  selectedGrade: 'all',
  theme: 'cyber_neon',
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
    flappyHighScore: 0,
    fruitsliceHighScore: 0,
    tictactoeWins: 0,
    sudokuCompleted: 0,
    slopeHighScore: 0,
    tunnelHighScore: 0,
    geodashHighScore: 0,
    colorSwitchHighScore: 0,
    pacmazeHighScore: 0,
    aimHighScore: 0,
    parkourHighScore: 0,
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
  const [selectedCategory, setSelectedCategory] = useState<GameCategoryGroup>('all');
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

  // Direct URL Pathname & Hash routing for Search Console, AdSense Review, and Direct Links
  useEffect(() => {
    try {
      const path = (window.location.pathname || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();
      const combined = `${path} ${hash}`;

      if (combined.includes('privacy')) {
        setActiveLegalTab('privacy');
        setIsLegalModalOpen(true);
      } else if (combined.includes('terms')) {
        setActiveLegalTab('terms');
        setIsLegalModalOpen(true);
      } else if (combined.includes('about')) {
        setActiveLegalTab('about');
        setIsLegalModalOpen(true);
      } else if (combined.includes('contact')) {
        setActiveLegalTab('contact');
        setIsLegalModalOpen(true);
      } else if (combined.includes('coppa')) {
        setActiveLegalTab('coppa');
        setIsLegalModalOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

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

  // Filter games by Grade/Class, Category, and Search
  const filteredGames = GAMES.filter((g) => {
    if (selectedCategory !== 'all' && g.categoryGroup !== selectedCategory) {
      return false;
    }
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

  const isPlayingGame = currentView !== 'hub' && currentView !== 'trophy';

  const currentThemeId = (profile.theme as ThemeId) || 'cyber_neon';
  const activeTheme = THEMES[currentThemeId] || THEMES.cyber_neon;

  const cycleTheme = () => {
    sounds.playPop(1.2);
    const themeKeys: ThemeId[] = ['cyber_neon', 'ocean_breeze', 'candy_pop', 'solar_amber'];
    const currentIndex = themeKeys.indexOf(currentThemeId);
    const nextTheme = themeKeys[(currentIndex + 1) % themeKeys.length];
    setProfile((prev) => ({ ...prev, theme: nextTheme }));
  };

  return (
    <div className={isPlayingGame ? `h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col ${activeTheme.pageBg} font-body` : `min-h-screen ${activeTheme.pageBg} font-body`}>
      {/* 1. TOP HORIZONTAL UTILITY BAR (AdSense Menus & Controls - shown on hub or when not in full gameplay) */}
      {currentView === 'hub' && (
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
      )}

      {/* 2. MAIN BRAND & PLAYER ROW (Shown only on Hub & Trophy pages to preserve 100% screen resolution for games) */}
      {!isPlayingGame && (
        <header className={`sticky top-0 z-40 ${activeTheme.headerBg} px-3 sm:px-6 ${currentView === 'hub' ? 'py-2.5' : 'py-1.5'}`}>
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            {/* Left: KiddoZap Logo & Brand */}
            <button
              id="header-home-btn"
              onClick={() => {
                sounds.playPop();
                setCurrentView('hub');
              }}
              className="text-left flex items-center gap-2 sm:gap-3 group shrink-0"
            >
              <KiddoZapLogo size={currentView === 'hub' ? 42 : 32} variant="header" />

              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className={`${currentView === 'hub' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'} font-black tracking-tight ${activeTheme.headerTitle} leading-tight font-display group-hover:opacity-90 transition-colors`}>
                    KiddoZap
                  </h1>
                  <span className={`text-[10px] ${activeTheme.badgeBg} font-black px-2 py-0.5 rounded-lg uppercase tracking-wider hidden sm:inline shadow-2xs`}>
                    {lang === 'hi' ? 'किड्स गेम्स' : 'Fun & Mind Games'}
                  </span>
                </div>
                <p className="text-[11px] opacity-80 font-bold hidden md:block">
                  {lang === 'hi'
                    ? 'कक्षा 1-12 व 18 वर्ष से कम के मजेदार खेल'
                    : 'Puzzles, Run & Brain Games (Class 1-12 & Below 18)'}
                </p>
              </div>
            </button>

            {/* Right Action Icons: Profile, Theme, Stars, Trophies, Compose, Mobile Menu */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Kid Avatar & Name */}
              <button
                id="header-profile-btn"
                onClick={() => {
                  sounds.playPop(1.1);
                  setIsProfileOpen(true);
                }}
                className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 sm:pr-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/20 active:scale-95 shadow-2xs"
                title={lang === 'hi' ? 'अवतार बदलें' : 'Change Avatar'}
              >
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white shadow-2xs flex items-center justify-center text-lg sm:text-xl">
                  {profile.avatar}
                </span>
                <span className="font-extrabold text-xs sm:text-sm hidden sm:inline max-w-[100px] truncate">
                  {profile.name}
                </span>
              </button>

              {/* Theme Cycler Button */}
              <button
                id="header-theme-toggle-btn"
                onClick={cycleTheme}
                className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-black transition-all border border-white/20 active:scale-95 shadow-2xs ${activeTheme.badgeBg}`}
                title={lang === 'hi' ? 'थीम बदलें (Theme)' : 'Switch Theme'}
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="text-sm">{activeTheme.icon}</span>
                <span className="hidden sm:inline font-bold">
                  {lang === 'hi' ? activeTheme.nameHi : activeTheme.nameEn}
                </span>
              </button>

              {/* Stars counter pill */}
              <div
                id="stars-badge"
                className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-amber-400/20 rounded-xl font-black text-xs border border-amber-300/40 shadow-2xs"
                title={lang === 'hi' ? 'कुल सितारे' : 'Total Stars'}
              >
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span>{profile.totalStars}</span>
              </div>

              {/* Trophy Room Button */}
              <button
                id="view-trophy-btn"
                onClick={() => {
                  sounds.playPop();
                  setCurrentView('trophy');
                }}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition-all border active:scale-95 shadow-2xs flex items-center gap-1.5 ${
                  currentView === 'trophy'
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white/10 hover:bg-white/20 border-white/20'
                }`}
                title={lang === 'hi' ? 'ट्रॉफी व मेडल' : 'Trophies'}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
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
                className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-black transition-all border border-white/20 active:scale-95 shadow-2xs ${activeTheme.cardBtnGradient}`}
                title={lang === 'hi' ? 'सीधे ऐप इंस्टॉल करें' : 'Install KiddoZap App'}
              >
                <Download className="w-3.5 h-3.5 text-white animate-bounce" />
                <span className="hidden sm:inline">{lang === 'hi' ? 'ऐप इंस्टॉल' : 'Install App'}</span>
              </button>

              {/* Mobile Drawer Menu Button (Small Screens) */}
              <button
                id="mobile-menu-drawer-btn"
                onClick={() => {
                  sounds.playPop();
                  setIsMobileMenuOpen(true);
                }}
                className="md:hidden p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 active:scale-95 transition-all shadow-2xs"
                title="Menu"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main View Router - Viewport locked during gameplay */}
      <main className={isPlayingGame ? 'flex-1 min-h-0 w-full overflow-hidden flex flex-col items-center justify-center p-0.5 sm:p-1' : currentView === 'hub' ? 'pb-16 pt-4' : 'px-2 py-2 max-w-4xl mx-auto flex flex-col items-center justify-center'}>
        {currentView === 'hub' && (
          <div id="games-hub-view" className="max-w-6xl mx-auto px-3 sm:px-4">
            {/* Daily Brain Quest Banner */}
            <div className={`relative overflow-hidden rounded-3xl ${activeTheme.heroGradient} p-5 sm:p-7 text-white ${activeTheme.heroShadow} mb-5 border-2 ${activeTheme.heroBorder}`}>
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
                    id="hero-play-tictactoe-btn"
                    onClick={() => {
                      sounds.playPop(1.2);
                      setCurrentView('tictactoe');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-slate-900 rounded-2xl font-black text-xs shadow-md active:scale-95 transition-all"
                  >
                    <span>🧠 {lang === 'hi' ? 'टिक-टैक-टो (Mind)' : 'Tic Tac Toe (Mind)'}</span>
                  </button>

                  <button
                    id="hero-play-flappy-btn"
                    onClick={() => {
                      sounds.playPop(1.2);
                      setCurrentView('flappy');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-black text-xs shadow-md active:scale-95 transition-all"
                  >
                    <span>🐦 {lang === 'hi' ? 'फ्लैपी बर्ड (Fun)' : 'Flappy Hero (Fun)'}</span>
                  </button>

                  <button
                    id="hero-play-fruitslice-btn"
                    onClick={() => {
                      sounds.playPop(1.2);
                      setCurrentView('fruitslice');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-xs shadow-md active:scale-95 transition-all"
                  >
                    <span>🍉 {lang === 'hi' ? 'फ्रूट स्लाइस (Action)' : 'Fruit Slice'}</span>
                  </button>

                  <button
                    id="hero-play-geodash-btn"
                    onClick={() => {
                      sounds.playPop(1.2);
                      setCurrentView('geodash');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-black text-xs shadow-md active:scale-95 transition-all"
                  >
                    <span>⚡ {lang === 'hi' ? 'ज्यामिति डैश' : 'Geo Dash'}</span>
                  </button>

                  <button
                    id="hero-play-rhymes-btn"
                    onClick={() => {
                      sounds.playPop(1.2);
                      setCurrentView('rhymes');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs shadow-md active:scale-95 transition-all"
                  >
                    <span>🎶 {lang === 'hi' ? 'बाल कविताएं' : 'Rhymes Sing'}</span>
                  </button>
                </div>
              </div>

              {/* KiddoZap Brand Logo Badge showcase on Hero */}
              <div className="absolute right-2 sm:right-6 -bottom-6 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 flex items-center justify-center pointer-events-none opacity-85 sm:opacity-100 transform rotate-3 hover:rotate-0 transition-transform">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-cyan-400/20 blur-xl animate-pulse" />
                  <KiddoZapLogo size={180} variant="badge" className="w-32 h-32 sm:w-44 sm:h-44" />
                </div>
              </div>
            </div>

            {/* Category Filter Bar */}
            <div className={`rounded-3xl p-3 sm:p-4 border-2 shadow-xs mb-3 ${activeTheme.cardBorder}`}>
              <div className="flex items-center justify-between gap-2 mb-2 px-1">
                <div className="flex items-center gap-1.5 font-black text-xs">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>
                    {lang === 'hi'
                      ? 'गेम कैटेगरी चुनें (Mind & Fun Games):'
                      : 'Game Categories (Mind, Fun & Brain):'}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTheme.cardBadgeBg}`}>
                  {CATEGORY_GROUPS.find((c) => c.id === selectedCategory)?.[lang === 'hi' ? 'labelHi' : 'labelEn']}
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORY_GROUPS.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const count =
                    cat.id === 'all'
                      ? GAMES.length
                      : GAMES.filter((g) => g.categoryGroup === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      id={`category-btn-${cat.id}`}
                      onClick={() => {
                        sounds.playPop(1.1);
                        setSelectedCategory(cat.id as GameCategoryGroup);
                      }}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl transition-all whitespace-nowrap border text-xs ${
                        isSelected
                          ? `${activeTheme.activeTabGradient} ${activeTheme.activeTabBorder} scale-102 font-black shadow-xs`
                          : 'bg-white/10 hover:bg-white/20 border-white/20 font-bold'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span>{lang === 'hi' ? cat.labelHi : cat.labelEn}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                          isSelected ? 'bg-white/25 text-white' : 'bg-white/20'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grade / Class Level Category Tabs (Below 18) */}
            <div className={`rounded-3xl p-3 sm:p-4 border-2 shadow-xs mb-5 ${activeTheme.cardBorder}`}>
              <div className="flex items-center justify-between gap-2 mb-2 px-1">
                <div className="flex items-center gap-1.5 font-black text-xs">
                  <GraduationCap className={`w-4 h-4 ${activeTheme.accentText}`} />
                  <span>{lang === 'hi' ? 'कक्षा व उम्र के अनुसार खेल (Standard / Age Below 18):' : 'Select Grade / Standard (Below 18):'}</span>
                </div>
                <span className="text-[10px] font-bold opacity-60 hidden sm:inline">
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
                          ? `${activeTheme.activeTabGradient} ${activeTheme.activeTabBorder} scale-102 font-black shadow-xs`
                          : 'bg-white/10 hover:bg-white/20 border-white/20 font-bold'
                      }`}
                    >
                      <span className="text-xs">
                        {lang === 'hi' ? tab.labelHi : tab.labelEn}
                      </span>
                      <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'opacity-60'}`}>
                        {lang === 'hi' ? tab.ageHi : tab.ageEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Bar & Games Count */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="text-xs font-black flex items-center gap-1.5">
                <Layers className={`w-4 h-4 ${activeTheme.accentText}`} />
                <span>
                  {selectedGrade === 'all' && selectedCategory === 'all'
                    ? lang === 'hi'
                      ? `सभी ${filteredGames.length} मनोरंजक व दिमागी खेल`
                      : `All ${filteredGames.length} Kids & Mind Games`
                    : lang === 'hi'
                    ? `फ़िल्टर किए गए खेल (${filteredGames.length})`
                    : `Filtered Games (${filteredGames.length})`}
                </span>
              </div>

              <div className="relative w-48 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 opacity-50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'hi' ? 'खेल खोजें...' : 'Search games...'}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-white/20 bg-white/10 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-2xs placeholder:opacity-60"
                />
              </div>
            </div>

            {/* Games Grid (32+ Fun & Brainy Mini-Games) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, type: 'spring', stiffness: 350, damping: 25 }}
                  whileHover={{ y: -4 }}
                  className={`rounded-3xl p-4 sm:p-5 border-2 ${activeTheme.cardBorder} ${activeTheme.cardHoverBorder} transition-all flex flex-col justify-between relative overflow-hidden group`}
                >
                  {/* Background glow circle */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-cyan-500/10 group-hover:scale-125 transition-transform duration-300 pointer-events-none" />

                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-13 h-13 rounded-2xl ${activeTheme.cardIconBg} flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform`}>
                        {game.icon}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-lg ${activeTheme.cardBadgeBg}`}>
                          {lang === 'hi' ? game.categoryHi : game.categoryEn}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 opacity-90">
                          {lang === 'hi' ? game.ageLabelHi : game.recommendedAge}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-black tracking-tight font-display">
                      {lang === 'hi' ? game.titleHi : game.titleEn}
                    </h3>
                    <p className="text-xs opacity-75 font-semibold mt-1 leading-relaxed">
                      {lang === 'hi' ? game.subtitleHi : game.subtitleEn}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className={`flex items-center gap-1 text-xs font-bold ${activeTheme.accentText}`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? '3 सितारे' : 'Earn Stars'}</span>
                    </div>

                    <button
                      id={`play-game-${game.id}-btn`}
                      onClick={() => {
                        sounds.playPop(1.2);
                        setCurrentView(game.id);
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 ${activeTheme.cardBtnGradient} font-extrabold text-xs rounded-xl shadow-xs active:scale-95 transition-all`}
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

            {/* High-Value Educational Knowledge Hub, Game Manuals, Grade Tiers, Scientific Research & FAQs (AdSense Compliance) */}
            <EducationalHub lang={lang} />
          </div>
        )}

        {/* Mind & Strategy Game 1: Tic Tac Toe Brain */}
        {currentView === 'tictactoe' && (
          <TicTacToeGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, wins) => {
              addStarsAndStats(stars, {
                tictactoeWins: (profile.gameStats.tictactoeWins || 0) + wins,
              });
            }}
          />
        )}

        {/* Mind & Strategy Game 2: Kiddo Sudoku 4x4 */}
        {currentView === 'sudoku' && (
          <SudokuGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, puzzles) => {
              addStarsAndStats(stars, {
                sudokuCompleted: (profile.gameStats.sudokuCompleted || 0) + puzzles,
              });
            }}
          />
        )}

        {/* Fun & Action Game 1: Flappy Hero Bird */}
        {currentView === 'flappy' && (
          <FlappyHero
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                flappyHighScore: Math.max(profile.gameStats.flappyHighScore || 0, score),
              });
            }}
          />
        )}

        {/* Fun & Action Game 2: Fruit Slice Frenzy */}
        {currentView === 'fruitslice' && (
          <FruitSliceGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                fruitsliceHighScore: Math.max(profile.gameStats.fruitsliceHighScore || 0, score),
              });
            }}
          />
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

        {/* 12. Classic Snake Feast */}
        {currentView === 'snake' && (
          <SnakeGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars) => addStarsAndStats(stars, {})}
          />
        )}

        {/* 13. Whack-A-Mole Smash */}
        {currentView === 'whack' && (
          <WhackAMoleGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars) => addStarsAndStats(stars, {})}
          />
        )}

        {/* 14. Rainbow Magic Piano */}
        {currentView === 'piano' && (
          <PianoGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars) => addStarsAndStats(stars, {})}
          />
        )}

        {/* 15. Sky Balloon Popper */}
        {currentView === 'balloon' && (
          <BalloonPopGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars) => addStarsAndStats(stars, {})}
          />
        )}

        {/* 16. Connect 4 in a Line */}
        {currentView === 'connect4' && (
          <ConnectFourGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars) => addStarsAndStats(stars, {})}
          />
        )}

        {/* 17. Dino Desert Jump */}
        {currentView === 'dino' && (
          <DinoRunGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars) => addStarsAndStats(stars, {})}
          />
        )}

        {/* 18. Bubble Pop Mania */}
        {currentView === 'bubble' && (
          <BubbleShooterGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars) => addStarsAndStats(stars, {})}
          />
        )}

        {/* 19. Animal Card Match */}
        {currentView === 'cardflip' && (
          <CardFlipMatchGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars) => addStarsAndStats(stars, {})}
          />
        )}

        {/* 20. Nursery Rhymes Sing-Along */}
        {currentView === 'rhymes' && (
          <NurseryRhymes
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars) => addStarsAndStats(stars, {})}
          />
        )}

        {/* 21. Crossy Road Adventure */}
        {currentView === 'crossyroad' && (
          <CrossyRoadGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars) => addStarsAndStats(stars, {})}
          />
        )}

        {/* 23. Space Invaders Galaxy */}
        {currentView === 'spaceinvaders' && (
          <SpaceInvadersGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars) => addStarsAndStats(stars, {})}
          />
        )}

        {/* 24. Moto X3M Stunt Biker */}
        {currentView === 'motox3m' && (
          <MotoX3MGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars) => addStarsAndStats(stars, {})}
          />
        )}

        {/* 25. Brick Breaker Neon */}
        {currentView === 'brickbreaker' && (
          <BrickBreakerGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars) => addStarsAndStats(stars, {})}
          />
        )}

        {/* 26. Jetpack Sky Raider */}
        {currentView === 'jetpack' && (
          <JetpackJoyrideGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars) => addStarsAndStats(stars, {})}
          />
        )}

        {/* 27. Slope 3D Cyber Run */}
        {currentView === 'slope3d' && (
          <Slope3DGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                slopeHighScore: Math.max(profile.gameStats.slopeHighScore || 0, score),
              });
            }}
          />
        )}

        {/* 27. Speed Tunnel Rush 3D */}
        {currentView === 'tunnelrush3d' && (
          <TunnelRush3DGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                tunnelHighScore: Math.max(profile.gameStats.tunnelHighScore || 0, score),
              });
            }}
          />
        )}

        {/* 28. Geo Dash Neon Rhythm */}
        {currentView === 'geodash' && (
          <GeoDashGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                geodashHighScore: Math.max(profile.gameStats.geodashHighScore || 0, score),
              });
            }}
          />
        )}

        {/* 29. Color Switch Arena */}
        {currentView === 'colorswitch' && (
          <ColorSwitchGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                colorSwitchHighScore: Math.max(profile.gameStats.colorSwitchHighScore || 0, score),
              });
            }}
          />
        )}

        {/* 30. Cyber Pac-Maze 2088 */}
        {currentView === 'pacmaze' && (
          <PacMazeGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                pacmazeHighScore: Math.max(profile.gameStats.pacmazeHighScore || 0, score),
              });
            }}
          />
        )}

        {/* 31. Aim Reflex Sniper Pro */}
        {currentView === 'aimtrainer' && (
          <AimTrainerGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                aimHighScore: Math.max(profile.gameStats.aimHighScore || 0, score),
              });
            }}
          />
        )}

        {/* 32. Rooftop Parkour Rush */}
        {currentView === 'parkour' && (
          <RooftopParkourGame
            lang={lang}
            onBack={() => setCurrentView('hub')}
            onGameComplete={(stars, score) => {
              addStarsAndStats(stars, {
                parkourHighScore: Math.max(profile.gameStats.parkourHighScore || 0, score),
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
        onSave={(name, avatar, theme) => {
          setProfile((prev) => ({ ...prev, name, avatar, ...(theme ? { theme } : {}) }));
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

      {/* Google AdSense Compliant Footer - Shown on Hub & Trophy pages */}
      {currentView === 'hub' && (
        <Footer
          lang={lang}
          onOpenLegal={(tab) => {
            setActiveLegalTab(tab);
            setIsLegalModalOpen(true);
          }}
          onOpenInstall={() => setIsInstallModalOpen(true)}
        />
      )}
    </div>
  );
}
