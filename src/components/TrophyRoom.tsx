import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Star, Sparkles, Award, CheckCircle2 } from 'lucide-react';
import { BADGES } from '../data/games';
import { Language, PlayerProfile } from '../types';
import { sounds } from '../utils/audio';

interface TrophyRoomProps {
  lang: Language;
  profile: PlayerProfile;
  onBack: () => void;
}

export const TrophyRoom: React.FC<TrophyRoomProps> = ({ lang, profile, onBack }) => {
  return (
    <div id="trophy-room-container" className="max-w-3xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur rounded-2xl p-3 border border-amber-100 shadow-sm">
        <button
          id="trophy-back-btn"
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 hover:bg-amber-200 font-semibold text-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-black text-slate-800">
            {lang === 'hi' ? 'ट्रॉफी व मेडल कक्ष' : 'Trophy & Medal Hall'}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-400/20 text-amber-800 px-3 py-1 rounded-xl text-xs font-black">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>{profile.totalStars}</span>
        </div>
      </div>

      {/* Hero Stats Card */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-6 text-white mb-6 shadow-lg shadow-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/30">
            {profile.avatar}
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-100">
              {lang === 'hi' ? 'खिलाड़ी' : 'Player'}
            </span>
            <h2 className="text-2xl font-black">{profile.name}</h2>
            <div className="flex items-center gap-1 text-xs font-bold text-white/90 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lang === 'hi'
                  ? `${profile.unlockedBadges.length} मेडल जीते`
                  : `${profile.unlockedBadges.length} Badges Unlocked`}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid Pill */}
        <div className="grid grid-cols-3 gap-2 bg-black/15 p-3 rounded-2xl backdrop-blur text-center text-xs">
          <div>
            <span className="block text-amber-200 text-[10px] font-bold">
              {lang === 'hi' ? 'सितारे' : 'Stars'}
            </span>
            <span className="text-base font-black">{profile.totalStars}</span>
          </div>
          <div>
            <span className="block text-amber-200 text-[10px] font-bold">
              {lang === 'hi' ? 'गणित रिकॉर्ड' : 'Math Rec'}
            </span>
            <span className="text-base font-black">{profile.gameStats.mathHighScore}</span>
          </div>
          <div>
            <span className="block text-amber-200 text-[10px] font-bold">
              {lang === 'hi' ? 'मेमोरी चालें' : 'Mem Moves'}
            </span>
            <span className="text-base font-black">
              {profile.gameStats.memoryBestMoves === 999 ? '-' : profile.gameStats.memoryBestMoves}
            </span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <h4 className="text-sm font-black text-slate-700 mb-3 px-1 flex items-center gap-1.5">
        <Award className="w-4 h-4 text-amber-500" />
        <span>{lang === 'hi' ? 'उपलब्धि मेडल (Badges):' : 'Achievement Badges:'}</span>
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BADGES.map((badge) => {
          const isUnlocked = profile.unlockedBadges.includes(badge.id);

          return (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.02 }}
              className={`rounded-2xl p-4 border transition-all flex items-start gap-3.5 ${
                isUnlocked
                  ? 'bg-white border-amber-300 shadow-sm'
                  : 'bg-slate-100/70 border-slate-200 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${
                  isUnlocked ? 'bg-amber-100' : 'bg-slate-200 grayscale'
                }`}
              >
                {badge.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-black text-slate-800 truncate">
                    {lang === 'hi' ? badge.titleHi : badge.titleEn}
                  </h5>
                  {isUnlocked && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                </div>

                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {lang === 'hi' ? badge.descHi : badge.descEn}
                </p>

                <div className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                  {badge.requirement}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
