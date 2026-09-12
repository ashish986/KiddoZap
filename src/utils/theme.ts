export type ThemeId = 'cyber_neon' | 'ocean_breeze' | 'candy_pop' | 'solar_amber';

export interface ThemeConfig {
  id: ThemeId;
  nameEn: string;
  nameHi: string;
  icon: string;
  // Body & background styles
  pageBg: string;
  headerBg: string;
  headerBorder: string;
  headerTitle: string;
  badgeBg: string;
  // Hero banner gradient
  heroGradient: string;
  heroBorder: string;
  heroShadow: string;
  // Active category button
  activeTabGradient: string;
  activeTabBorder: string;
  // Card styling
  cardBorder: string;
  cardHoverBorder: string;
  cardIconBg: string;
  cardBtnGradient: string;
  cardBadgeBg: string;
  accentText: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  cyber_neon: {
    id: 'cyber_neon',
    nameEn: 'Cyber Arcade',
    nameHi: 'साइबर आर्केड',
    icon: '⚡',
    pageBg: 'bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 text-slate-100 selection:bg-cyan-500/30',
    headerBg: 'bg-slate-900/95 backdrop-blur-md border-b border-indigo-500/30 shadow-lg shadow-indigo-950/50',
    headerBorder: 'border-indigo-500/30',
    headerTitle: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400',
    badgeBg: 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white',
    heroGradient: 'bg-gradient-to-r from-indigo-900 via-purple-900 to-cyan-900',
    heroBorder: 'border-cyan-500/40',
    heroShadow: 'shadow-2xl shadow-cyan-500/10',
    activeTabGradient: 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-cyan-500/30 shadow-md',
    activeTabBorder: 'border-cyan-400',
    cardBorder: 'border-slate-800 bg-slate-900/90 hover:border-cyan-400/80 shadow-md hover:shadow-cyan-500/10',
    cardHoverBorder: 'hover:border-cyan-400',
    cardIconBg: 'bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border-indigo-700/50 text-cyan-300',
    cardBtnGradient: 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20',
    cardBadgeBg: 'bg-indigo-950 text-cyan-300 border border-indigo-800',
    accentText: 'text-cyan-400',
  },
  ocean_breeze: {
    id: 'ocean_breeze',
    nameEn: 'Ocean Breeze',
    nameHi: 'ओशन ब्रीज़',
    icon: '🌊',
    pageBg: 'bg-gradient-to-b from-sky-50 via-teal-50/40 to-blue-50 text-slate-800 selection:bg-teal-200',
    headerBg: 'bg-white/95 backdrop-blur-md border-b border-sky-200 shadow-xs',
    headerBorder: 'border-sky-200',
    headerTitle: 'text-sky-950',
    badgeBg: 'bg-sky-600 text-white',
    heroGradient: 'bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-500',
    heroBorder: 'border-teal-400/50',
    heroShadow: 'shadow-xl shadow-sky-200',
    activeTabGradient: 'bg-gradient-to-r from-sky-600 to-teal-600 text-white',
    activeTabBorder: 'border-sky-700',
    cardBorder: 'border-sky-100 bg-white hover:border-sky-300 shadow-xs hover:shadow-md',
    cardHoverBorder: 'hover:border-sky-300',
    cardIconBg: 'bg-gradient-to-br from-sky-100 to-teal-100 border-sky-200 text-teal-800',
    cardBtnGradient: 'bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white',
    cardBadgeBg: 'bg-sky-100 text-sky-800',
    accentText: 'text-teal-600',
  },
  candy_pop: {
    id: 'candy_pop',
    nameEn: 'Candy Pop',
    nameHi: 'कैंडी पॉप',
    icon: '🍭',
    pageBg: 'bg-gradient-to-b from-pink-50 via-purple-50/40 to-rose-50 text-slate-800 selection:bg-pink-200',
    headerBg: 'bg-white/95 backdrop-blur-md border-b border-pink-200 shadow-xs',
    headerBorder: 'border-pink-200',
    headerTitle: 'text-purple-950',
    badgeBg: 'bg-pink-600 text-white',
    heroGradient: 'bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-500',
    heroBorder: 'border-pink-300',
    heroShadow: 'shadow-xl shadow-pink-200',
    activeTabGradient: 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white',
    activeTabBorder: 'border-pink-700',
    cardBorder: 'border-pink-100 bg-white hover:border-pink-300 shadow-xs hover:shadow-md',
    cardHoverBorder: 'hover:border-pink-300',
    cardIconBg: 'bg-gradient-to-br from-pink-100 to-purple-100 border-pink-200 text-fuchsia-800',
    cardBtnGradient: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white',
    cardBadgeBg: 'bg-pink-100 text-pink-800',
    accentText: 'text-pink-600',
  },
  solar_amber: {
    id: 'solar_amber',
    nameEn: 'Solar Gold',
    nameHi: 'सोलर गोल्ड',
    icon: '☀️',
    pageBg: 'bg-gradient-to-b from-amber-50/80 via-orange-50/30 to-yellow-50/70 text-slate-800 selection:bg-amber-200',
    headerBg: 'bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs',
    headerBorder: 'border-amber-200/80',
    headerTitle: 'text-amber-950',
    badgeBg: 'bg-amber-500 text-white',
    heroGradient: 'bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400',
    heroBorder: 'border-amber-300/60',
    heroShadow: 'shadow-xl shadow-amber-200/70',
    activeTabGradient: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white',
    activeTabBorder: 'border-orange-600',
    cardBorder: 'border-amber-100 bg-white hover:border-amber-300 shadow-xs hover:shadow-md',
    cardHoverBorder: 'hover:border-amber-300',
    cardIconBg: 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-200 text-amber-800',
    cardBtnGradient: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white',
    cardBadgeBg: 'bg-amber-100 text-amber-800',
    accentText: 'text-amber-600',
  },
};
