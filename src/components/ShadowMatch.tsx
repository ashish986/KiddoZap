import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Check, Sparkles, Trophy, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/audio';
import { Language } from '../types';
import confetti from 'canvas-confetti';

interface ShadowMatchProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (starsEarned: number) => void;
}

interface Item {
  id: string;
  emoji: string;
  nameEn: string;
  nameHi: string;
}

const PUZZLE_LEVELS: { themeEn: string; themeHi: string; items: Item[] }[] = [
  {
    themeEn: 'Friendly Animals',
    themeHi: 'प्यारे जानवर',
    items: [
      { id: 'cat', emoji: '🐱', nameEn: 'Cat', nameHi: 'बिल्ली' },
      { id: 'frog', emoji: '🐸', nameEn: 'Frog', nameHi: 'मेंढक' },
      { id: 'elephant', emoji: '🐘', nameEn: 'Elephant', nameHi: 'हाथी' },
      { id: 'bird', emoji: '🦜', nameEn: 'Parrot', nameHi: 'तोता' },
    ],
  },
  {
    themeEn: 'Vehicles & Space',
    themeHi: 'गाड़ियां और अंतरिक्ष',
    items: [
      { id: 'rocket', emoji: '🚀', nameEn: 'Rocket', nameHi: 'रॉकेट' },
      { id: 'car', emoji: '🚗', nameEn: 'Car', nameHi: 'कार' },
      { id: 'plane', emoji: '✈️', nameEn: 'Airplane', nameHi: 'हवाई जहाज' },
      { id: 'train', emoji: '🚂', nameEn: 'Train', nameHi: 'ट्रेन' },
    ],
  },
  {
    themeEn: 'Yummy Fruits & Treats',
    themeHi: 'फल और पकवान',
    items: [
      { id: 'apple', emoji: '🍎', nameEn: 'Apple', nameHi: 'सेब' },
      { id: 'banana', emoji: '🍌', nameEn: 'Banana', nameHi: 'केला' },
      { id: 'pizza', emoji: '🍕', nameEn: 'Pizza', nameHi: 'पिज़्ज़ा' },
      { id: 'icecream', emoji: '🍦', nameEn: 'Ice Cream', nameHi: 'आइसक्रीम' },
    ],
  },
];

export const ShadowMatch: React.FC<ShadowMatchProps> = ({ lang, onBack, onGameComplete }) => {
  const [levelIdx, setLevelIdx] = useState<number>(0);
  const currentLevel = PUZZLE_LEVELS[levelIdx];

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  // Shuffled shadow order
  const [shadowOrder, setShadowOrder] = useState<Item[]>(() =>
    [...currentLevel.items].sort(() => Math.random() - 0.5)
  );
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);
  const [wiggleId, setWiggleId] = useState<string | null>(null);

  const resetCurrentLevel = () => {
    setSelectedItemId(null);
    setMatchedIds([]);
    setIsLevelComplete(false);
    setShadowOrder([...currentLevel.items].sort(() => Math.random() - 0.5));
    sounds.playPop();
  };

  const handleItemClick = (item: Item) => {
    if (matchedIds.includes(item.id)) return;
    sounds.playPop(1.1);
    setSelectedItemId(item.id);
  };

  const handleShadowClick = (shadowItem: Item) => {
    if (matchedIds.includes(shadowItem.id)) return;

    if (!selectedItemId) {
      sounds.playPop(0.9);
      return;
    }

    if (selectedItemId === shadowItem.id) {
      // Correct Match!
      sounds.playChime();
      const updated = [...matchedIds, shadowItem.id];
      setMatchedIds(updated);
      setSelectedItemId(null);

      if (updated.length === currentLevel.items.length) {
        // Level complete!
        sounds.playFanfare();
        setIsLevelComplete(true);
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });

        if (levelIdx === PUZZLE_LEVELS.length - 1) {
          onGameComplete(3);
        } else {
          onGameComplete(1);
        }
      }
    } else {
      // Wrong match
      sounds.playError();
      setWiggleId(shadowItem.id);
      setTimeout(() => setWiggleId(null), 500);
    }
  };

  const goToNextLevel = () => {
    if (levelIdx < PUZZLE_LEVELS.length - 1) {
      const nextLvl = levelIdx + 1;
      setLevelIdx(nextLvl);
      setSelectedItemId(null);
      setMatchedIds([]);
      setIsLevelComplete(false);
      setShadowOrder([...PUZZLE_LEVELS[nextLvl].items].sort(() => Math.random() - 0.5));
      sounds.playPop(1.2);
    } else {
      resetCurrentLevel();
    }
  };

  return (
    <div id="shadow-game-container" className="max-w-2xl mx-auto px-4 py-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur rounded-2xl p-3 border border-emerald-100 shadow-sm">
        <button
          id="shadow-back-btn"
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-semibold text-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {lang === 'hi' ? `स्तर ${levelIdx + 1} / ${PUZZLE_LEVELS.length}` : `Level ${levelIdx + 1} of ${PUZZLE_LEVELS.length}`}
          </span>
          <span className="text-sm font-extrabold text-emerald-700">
            {lang === 'hi' ? currentLevel.themeHi : currentLevel.themeEn}
          </span>
        </div>

        <button
          id="shadow-reset-btn"
          onClick={resetCurrentLevel}
          className="p-2 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all active:rotate-180 duration-300"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Guide Banner */}
      <div className="text-center mb-6 bg-white/90 p-3 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-center gap-2">
        <HelpCircle className="w-4 h-4 text-emerald-600" />
        <span className="text-xs font-bold text-slate-600">
          {lang === 'hi'
            ? 'ऊपर से किसी वस्तु पर टैप करें, फिर नीचे उसकी सही परछाईं पर टैप करें!'
            : 'Tap an item above, then tap its matching dark shadow below!'}
        </span>
      </div>

      {/* Top Row: Colored Real Items */}
      <div className="mb-8">
        <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2 px-1">
          {lang === 'hi' ? '1. वस्तु चुनें:' : '1. Select an item:'}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {currentLevel.items.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedItemId === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={!isMatched ? { scale: 1.05 } : {}}
                whileTap={!isMatched ? { scale: 0.95 } : {}}
                onClick={() => handleItemClick(item)}
                disabled={isMatched}
                className={`aspect-square rounded-2xl p-3 flex flex-col items-center justify-center relative transition-all duration-200 ${
                  isMatched
                    ? 'bg-emerald-100/70 border-2 border-emerald-300 opacity-60'
                    : isSelected
                    ? 'bg-amber-100 border-3 border-amber-500 shadow-md ring-4 ring-amber-300/50 scale-105'
                    : 'bg-white hover:bg-slate-50 border-2 border-slate-200 shadow-sm'
                }`}
              >
                {isMatched && (
                  <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white rounded-full p-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <span className="text-4xl sm:text-5xl">{item.emoji}</span>
                <span className="text-[11px] font-bold text-slate-700 mt-1.5">
                  {lang === 'hi' ? item.nameHi : item.nameEn}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom Row: Dark Silhouettes / Shadows */}
      <div>
        <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2 px-1">
          {lang === 'hi' ? '2. सही परछाईं पहचानें:' : '2. Match to its shadow:'}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {shadowOrder.map((shadow) => {
            const isMatched = matchedIds.includes(shadow.id);
            const isWiggling = wiggleId === shadow.id;

            return (
              <motion.button
                key={`shadow-${shadow.id}`}
                animate={isWiggling ? { x: [-8, 8, -6, 6, 0] } : {}}
                transition={{ duration: 0.35 }}
                whileHover={!isMatched ? { scale: 1.05 } : {}}
                whileTap={!isMatched ? { scale: 0.95 } : {}}
                onClick={() => handleShadowClick(shadow)}
                disabled={isMatched}
                className={`aspect-square rounded-2xl p-3 flex flex-col items-center justify-center relative transition-all duration-200 ${
                  isMatched
                    ? 'bg-emerald-50 border-2 border-emerald-400 shadow-emerald-100'
                    : 'bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 shadow-md'
                }`}
              >
                {isMatched ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <span className="text-4xl sm:text-5xl">{shadow.emoji}</span>
                    <span className="text-[11px] font-extrabold text-emerald-700 mt-1.5 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {lang === 'hi' ? 'मैच!' : 'Matched!'}
                    </span>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    {/* Dark silhouette filter on emoji */}
                    <span className="text-4xl sm:text-5xl brightness-0 opacity-85 select-none">
                      {shadow.emoji}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 mt-1.5">
                      {lang === 'hi' ? 'परछाईं' : 'Shadow'}
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Level Success Modal */}
      <AnimatePresence>
        {isLevelComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border-4 border-emerald-300"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-emerald-500 animate-bounce" />
              </div>

              <h3 className="text-2xl font-black text-slate-800">
                {lang === 'hi' ? 'जासूस की जीत! 🔍' : 'Detective Triumph! 🔍'}
              </h3>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                {lang === 'hi'
                  ? 'आपने सभी परछाइयों को सही पहचान लिया!'
                  : 'You matched all the silhouettes perfectly!'}
              </p>

              <div className="flex gap-2 mt-5">
                {levelIdx < PUZZLE_LEVELS.length - 1 ? (
                  <button
                    id="shadow-next-lvl-btn"
                    onClick={goToNextLevel}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl shadow-md active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'अगला स्तर' : 'Next Level'}</span>
                  </button>
                ) : (
                  <button
                    id="shadow-replay-btn"
                    onClick={resetCurrentLevel}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl text-sm"
                  >
                    {lang === 'hi' ? 'फिर से खेलें' : 'Play Again'}
                  </button>
                )}
                <button
                  id="shadow-modal-menu-btn"
                  onClick={onBack}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl active:scale-95 transition-all text-sm"
                >
                  {lang === 'hi' ? 'होम' : 'Menu'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
