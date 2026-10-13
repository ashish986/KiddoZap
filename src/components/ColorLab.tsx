import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Sparkles, Trophy, Plus, Check, FlaskConical } from 'lucide-react';
import { sounds } from '../utils/audio';
import { Language } from '../types';
import confetti from 'canvas-confetti';

interface ColorLabProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (starsEarned: number) => void;
}

interface Recipe {
  id: string;
  nameEn: string;
  nameHi: string;
  targetHex: string;
  required: { red: number; blue: number; yellow: number; white: number };
  hintEn: string;
  hintHi: string;
}

const RECIPES: Recipe[] = [
  {
    id: 'green',
    nameEn: 'Emerald Green Potion',
    nameHi: 'पन्ना हरा काढ़ा',
    targetHex: '#10b981',
    required: { red: 0, blue: 1, yellow: 1, white: 0 },
    hintEn: 'Mix 1 Blue + 1 Yellow drop',
    hintHi: '1 नीला + 1 पीला रंग मिलाएं',
  },
  {
    id: 'purple',
    nameEn: 'Royal Purple Elixir',
    nameHi: 'शाही बैंगनी शरबत',
    targetHex: '#8b5cf6',
    required: { red: 1, blue: 1, yellow: 0, white: 0 },
    hintEn: 'Mix 1 Red + 1 Blue drop',
    hintHi: '1 लाल + 1 नीला रंग मिलाएं',
  },
  {
    id: 'orange',
    nameEn: 'Sunny Orange Juice',
    nameHi: 'धूप नारंगी रस',
    targetHex: '#f97316',
    required: { red: 1, blue: 0, yellow: 1, white: 0 },
    hintEn: 'Mix 1 Red + 1 Yellow drop',
    hintHi: '1 लाल + 1 पीला रंग मिलाएं',
  },
  {
    id: 'pink',
    nameEn: 'Cotton Candy Pink',
    nameHi: 'गुलाबी परी घोल',
    targetHex: '#f472b6',
    required: { red: 1, blue: 0, yellow: 0, white: 1 },
    hintEn: 'Mix 1 Red + 1 White drop',
    hintHi: '1 लाल + 1 सफेद रंग मिलाएं',
  },
  {
    id: 'sky',
    nameEn: 'Sky Blue Nectar',
    nameHi: 'आसमानी नीला अमृत',
    targetHex: '#38bdf8',
    required: { red: 0, blue: 1, yellow: 0, white: 1 },
    hintEn: 'Mix 1 Blue + 1 White drop',
    hintHi: '1 नीला + 1 सफेद रंग मिलाएं',
  },
];

export const ColorLab: React.FC<ColorLabProps> = ({ lang, onBack, onGameComplete }) => {
  const [recipeIdx, setRecipeIdx] = useState<number>(0);
  const currentRecipe = RECIPES[recipeIdx];

  const [drops, setDrops] = useState({ red: 0, blue: 0, yellow: 0, white: 0 });
  const [cauldronColor, setCauldronColor] = useState<string>('#cbd5e1'); // neutral liquid
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const addDrop = (color: 'red' | 'blue' | 'yellow' | 'white') => {
    sounds.playPop(1.3);
    const updated = { ...drops, [color]: drops[color] + 1 };
    setDrops(updated);
    updateLiquidColor(updated);
  };

  const updateLiquidColor = (d: { red: number; blue: number; yellow: number; white: number }) => {
    // Dynamic color mixing simulation
    let r = 200, g = 200, b = 200;
    const total = d.red + d.blue + d.yellow + d.white;
    if (total === 0) {
      setCauldronColor('#cbd5e1');
      return;
    }

    let sumR = 0, sumG = 0, sumB = 0;
    // Red contribution
    sumR += d.red * 239;
    sumG += d.red * 68;
    sumB += d.red * 68;

    // Blue contribution
    sumR += d.blue * 59;
    sumG += d.blue * 130;
    sumB += d.blue * 246;

    // Yellow contribution
    sumR += d.yellow * 245;
    sumG += d.yellow * 158;
    sumB += d.yellow * 11;

    // White contribution
    sumR += d.white * 255;
    sumG += d.white * 255;
    sumB += d.white * 255;

    r = Math.round(sumR / total);
    g = Math.round(sumG / total);
    b = Math.round(sumB / total);

    setCauldronColor(`rgb(${r}, ${g}, ${b})`);
  };

  const clearCauldron = () => {
    sounds.playPop(0.9);
    setDrops({ red: 0, blue: 0, yellow: 0, white: 0 });
    setCauldronColor('#cbd5e1');
    setFeedback(null);
  };

  const handleTestPotion = () => {
    const isMatch =
      drops.red === currentRecipe.required.red &&
      drops.blue === currentRecipe.required.blue &&
      drops.yellow === currentRecipe.required.yellow &&
      drops.white === currentRecipe.required.white;

    if (isMatch) {
      sounds.playMagic();
      sounds.playFanfare();
      setIsSuccess(true);
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 },
      });
      onGameComplete(1);
    } else {
      sounds.playError();
      setFeedback(
        lang === 'hi'
          ? `गलत घोल! संकेत देखें: ${currentRecipe.hintHi}`
          : `Not quite! Hint: ${currentRecipe.hintEn}`
      );
    }
  };

  const nextPotion = () => {
    const nextIdx = (recipeIdx + 1) % RECIPES.length;
    setRecipeIdx(nextIdx);
    setDrops({ red: 0, blue: 0, yellow: 0, white: 0 });
    setCauldronColor('#cbd5e1');
    setIsSuccess(false);
    setFeedback(null);
    sounds.playPop(1.1);
  };

  return (
    <div id="color-lab-container" className="max-w-2xl mx-auto px-4 py-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur rounded-2xl p-3 border border-sky-100 shadow-sm">
        <button
          id="color-back-btn"
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-100 text-sky-700 hover:bg-sky-200 font-semibold text-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {lang === 'hi' ? `जादुई काढ़ा ${recipeIdx + 1} / ${RECIPES.length}` : `Potion ${recipeIdx + 1} of ${RECIPES.length}`}
          </span>
          <span className="text-sm font-black text-sky-800">
            {lang === 'hi' ? currentRecipe.nameHi : currentRecipe.nameEn}
          </span>
        </div>

        <button
          id="color-reset-btn"
          onClick={clearCauldron}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all active:rotate-180 duration-300"
          title="Empty Cauldron"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Target Potion Mission Card */}
      <div className="bg-white rounded-3xl p-4 mb-6 border-2 border-sky-200 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md border-2 border-white"
            style={{ backgroundColor: currentRecipe.targetHex }}
          >
            <FlaskConical className="w-8 h-8 text-white drop-shadow" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">
              {lang === 'hi' ? 'बनाना है:' : 'Target Color:'}
            </span>
            <h4 className="text-base font-black text-slate-800">
              {lang === 'hi' ? currentRecipe.nameHi : currentRecipe.nameEn}
            </h4>
            <span className="text-xs text-sky-600 font-semibold">
              {lang === 'hi' ? `💡 ${currentRecipe.hintHi}` : `💡 ${currentRecipe.hintEn}`}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 block">
            {lang === 'hi' ? 'बूंदें:' : 'Drops:'}
          </span>
          <span className="text-sm font-extrabold text-slate-700">
            {drops.red + drops.blue + drops.yellow + drops.white}
          </span>
        </div>
      </div>

      {/* Cauldron Center Area */}
      <div className="relative w-64 h-56 mx-auto flex flex-col items-center justify-center my-2">
        {/* Steam bubbles */}
        <div className="flex gap-2 mb-1">
          {[1, 2, 3].map((b) => (
            <motion.div
              key={b}
              animate={{ y: [-5, -20], opacity: [0.7, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: b * 0.4 }}
              className="w-3 h-3 rounded-full bg-sky-300/60"
            />
          ))}
        </div>

        {/* Cauldron Body */}
        <div className="relative w-52 h-44 bg-slate-800 rounded-b-full border-4 border-slate-700 shadow-2xl flex flex-col items-center justify-start pt-3 overflow-hidden">
          {/* Rim */}
          <div className="absolute top-0 w-48 h-6 bg-slate-700 rounded-full border border-slate-600 shadow-inner" />

          {/* Liquid */}
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-40 h-28 mt-2 rounded-b-full transition-colors duration-500 shadow-inner flex items-center justify-center relative"
            style={{ backgroundColor: cauldronColor }}
          >
            {/* Sparkles inside cauldron */}
            <Sparkles className="w-8 h-8 text-white/70 animate-spin duration-3000" />
          </motion.div>
        </div>

        {/* Stand feet */}
        <div className="flex justify-between w-36 -mt-2">
          <div className="w-4 h-6 bg-slate-900 rounded-b-md" />
          <div className="w-4 h-6 bg-slate-900 rounded-b-md" />
        </div>
      </div>

      {/* Feedback Banner if wrong */}
      {feedback && (
        <div className="text-center my-3 bg-rose-50 text-rose-700 px-4 py-2 rounded-2xl text-xs font-bold border border-rose-200">
          {feedback}
        </div>
      )}

      {/* Primary Droppers */}
      <div className="grid grid-cols-4 gap-2.5 mt-4">
        {/* Red */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => addDrop('red')}
          className="bg-rose-500 hover:bg-rose-600 text-white rounded-2xl p-3 flex flex-col items-center shadow-md active:scale-95 transition-all"
        >
          <span className="text-2xl">🔴</span>
          <span className="text-xs font-black mt-1">{lang === 'hi' ? 'लाल' : 'Red'}</span>
          <span className="text-[10px] bg-white/30 px-2 py-0.5 rounded-full font-bold mt-1">
            +{drops.red}
          </span>
        </motion.button>

        {/* Blue */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => addDrop('blue')}
          className="bg-sky-500 hover:bg-sky-600 text-white rounded-2xl p-3 flex flex-col items-center shadow-md active:scale-95 transition-all"
        >
          <span className="text-2xl">🔵</span>
          <span className="text-xs font-black mt-1">{lang === 'hi' ? 'नीला' : 'Blue'}</span>
          <span className="text-[10px] bg-white/30 px-2 py-0.5 rounded-full font-bold mt-1">
            +{drops.blue}
          </span>
        </motion.button>

        {/* Yellow */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => addDrop('yellow')}
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-2xl p-3 flex flex-col items-center shadow-md active:scale-95 transition-all"
        >
          <span className="text-2xl">🟡</span>
          <span className="text-xs font-black mt-1">{lang === 'hi' ? 'पीला' : 'Yellow'}</span>
          <span className="text-[10px] bg-black/10 px-2 py-0.5 rounded-full font-bold mt-1">
            +{drops.yellow}
          </span>
        </motion.button>

        {/* White */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => addDrop('white')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300 rounded-2xl p-3 flex flex-col items-center shadow-md active:scale-95 transition-all"
        >
          <span className="text-2xl">⚪</span>
          <span className="text-xs font-black mt-1">{lang === 'hi' ? 'सफेद' : 'White'}</span>
          <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full font-bold mt-1">
            +{drops.white}
          </span>
        </motion.button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          id="test-potion-btn"
          onClick={handleTestPotion}
          className="flex-1 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold rounded-2xl shadow-lg active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>{lang === 'hi' ? 'जादुई घोल जांचें!' : 'Test Magic Potion!'}</span>
        </button>
        <button
          id="clear-cauldron-btn"
          onClick={clearCauldron}
          className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl active:scale-95 transition-all text-sm"
        >
          {lang === 'hi' ? 'साफ करें' : 'Clear'}
        </button>
      </div>

      {/* Victory Dialog */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border-4 border-sky-300"
            >
              <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-sky-500 animate-bounce" />
              </div>

              <h3 className="text-2xl font-black text-slate-800">
                {lang === 'hi' ? 'जादू सफल हुआ! 🧪✨' : 'Potion Mastered! 🧪✨'}
              </h3>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                {lang === 'hi'
                  ? `वाह! आपने सही रंगों को मिलाकर "${currentRecipe.nameHi}" बना लिया!`
                  : `Hooray! You blended the right colors to brew the ${currentRecipe.nameEn}!`}
              </p>

              <div className="flex gap-2 mt-5">
                <button
                  id="potion-next-btn"
                  onClick={nextPotion}
                  className="flex-1 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold rounded-2xl shadow-md active:scale-95 transition-all text-sm flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'अगला काढ़ा' : 'Next Potion'}</span>
                </button>
                <button
                  id="potion-menu-btn"
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
