import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Sparkles, Volume2, Check } from 'lucide-react';
import { sounds } from '../utils/audio';
import { Language } from '../types';
import confetti from 'canvas-confetti';

interface WordSparksProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (starsEarned: number, score: number) => void;
}

interface WordPuzzle {
  word: string;
  emoji: string;
  meaningEn: string;
  meaningHi: string;
}

const WORDS: WordPuzzle[] = [
  { word: 'CAT', emoji: '🐱', meaningEn: 'A playful pet cat', meaningHi: 'बिल्ली मौसी' },
  { word: 'SUN', emoji: '🌞', meaningEn: 'Bright golden sun', meaningHi: 'चमकता सूरज' },
  { word: 'LION', emoji: '🦁', meaningEn: 'The brave king of jungle', meaningHi: 'जंगल का राजा शेर' },
  { word: 'FROG', emoji: '🐸', meaningEn: 'Hoppy green frog', meaningHi: 'फुदकता मेंढक' },
  { word: 'STAR', emoji: '⭐', meaningEn: 'Twinkling night star', meaningHi: 'चमकता तारा' },
  { word: 'TRAIN', emoji: '🚂', meaningEn: 'Chug-chug steam train', meaningHi: 'छुक-छुक रेलगाड़ी' },
  { word: 'APPLE', emoji: '🍎', meaningEn: 'Crisp red apple', meaningHi: 'मीठा लाल सेब' },
];

export const WordSparks: React.FC<WordSparksProps> = ({ lang, onBack, onGameComplete }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const currentPuzzle = WORDS[currentIdx];

  // Available letter tiles (scrambled)
  const [availableLetters, setAvailableLetters] = useState<{ id: number; char: string }[]>(() =>
    currentPuzzle.word
      .split('')
      .map((c, idx) => ({ id: idx, char: c }))
      .sort(() => Math.random() - 0.5)
  );

  // User spelled letters
  const [selectedLetters, setSelectedLetters] = useState<{ id: number; char: string }[]>([]);
  const [isWordCorrect, setIsWordCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [allFinished, setAllFinished] = useState<boolean>(false);

  const initPuzzle = (idx: number) => {
    const p = WORDS[idx];
    const letters = p.word
      .split('')
      .map((c, i) => ({ id: i, char: c }))
      .sort(() => Math.random() - 0.5);

    setAvailableLetters(letters);
    setSelectedLetters([]);
    setIsWordCorrect(false);
  };

  const handlePickLetter = (tile: { id: number; char: string }) => {
    if (isWordCorrect) return;

    sounds.playPop(1.2);
    const newSelected = [...selectedLetters, tile];
    setSelectedLetters(newSelected);
    setAvailableLetters((prev) => prev.filter((item) => item.id !== tile.id));

    // Check if word completed
    if (newSelected.length === currentPuzzle.word.length) {
      const spelled = newSelected.map((l) => l.char).join('');
      if (spelled === currentPuzzle.word) {
        // Correct word!
        sounds.playChime();
        setIsWordCorrect(true);
        const newScore = score + 15;
        setScore(newScore);

        if (currentIdx === WORDS.length - 1) {
          sounds.playFanfare();
          setAllFinished(true);
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
          onGameComplete(3, newScore);
        }
      } else {
        sounds.playError();
      }
    }
  };

  const handleRemoveLetter = (tile: { id: number; char: string }) => {
    if (isWordCorrect) return;

    sounds.playPop(0.9);
    setSelectedLetters((prev) => prev.filter((item) => item.id !== tile.id));
    setAvailableLetters((prev) => [...prev, tile]);
  };

  const nextWord = () => {
    if (currentIdx < WORDS.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      initPuzzle(nextIdx);
      sounds.playPop(1.1);
    }
  };

  const restartWords = () => {
    setCurrentIdx(0);
    setScore(0);
    setAllFinished(false);
    initPuzzle(0);
    sounds.playPop(1);
  };

  return (
    <div id="word-game-container" className="max-w-2xl mx-auto px-4 py-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur rounded-2xl p-3 border border-lime-100 shadow-sm">
        <button
          id="word-back-btn"
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-100 text-lime-700 hover:bg-lime-200 font-semibold text-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {lang === 'hi' ? `शब्द ${currentIdx + 1} / ${WORDS.length}` : `Word ${currentIdx + 1} of ${WORDS.length}`}
          </span>
          <span className="text-sm font-black text-lime-800">
            {lang === 'hi' ? 'सही वर्तनी बनाएं' : 'Spell the Word'}
          </span>
        </div>

        <button
          id="word-reset-btn"
          onClick={() => initPuzzle(currentIdx)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all active:rotate-180 duration-300"
          title="Reset Word"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Picture Card */}
      <div className="bg-gradient-to-b from-lime-50 to-emerald-50 rounded-3xl p-6 border-2 border-lime-200 shadow-sm text-center mb-6">
        <motion.div
          key={currentPuzzle.word}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-6xl sm:text-7xl mb-2 select-none filter drop-shadow"
        >
          {currentPuzzle.emoji}
        </motion.div>

        <div className="text-xs font-bold text-lime-800 uppercase tracking-wider">
          {lang === 'hi' ? currentPuzzle.meaningHi : currentPuzzle.meaningEn}
        </div>
      </div>

      {/* Word Slots (Target Drop / Tap Targets) */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-6">
        {currentPuzzle.word.split('').map((_, index) => {
          const filled = selectedLetters[index];
          return (
            <motion.button
              key={`slot-${index}`}
              onClick={() => filled && handleRemoveLetter(filled)}
              className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl transition-all ${
                filled
                  ? isWordCorrect
                    ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-lg scale-105 border-2 border-emerald-400'
                    : 'bg-white text-slate-800 border-2 border-lime-500 shadow-md'
                  : 'bg-white/60 border-2 border-dashed border-slate-300'
              }`}
            >
              {filled ? filled.char : ''}
            </motion.button>
          );
        })}
      </div>

      {/* Available Letter Tiles to Tap */}
      <div className="text-center mb-2">
        <span className="text-xs font-bold text-slate-500">
          {lang === 'hi' ? 'अक्षरों पर टैप करें:' : 'Tap letters in order:'}
        </span>
      </div>

      <div className="flex justify-center flex-wrap gap-2.5 max-w-sm mx-auto mb-6">
        {availableLetters.map((tile) => (
          <motion.button
            key={tile.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePickLetter(tile)}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-white hover:bg-lime-50 text-slate-800 border-2 border-slate-200 hover:border-lime-400 rounded-2xl shadow-md font-black text-xl sm:text-2xl flex items-center justify-center cursor-pointer transition-all"
          >
            {tile.char}
          </motion.button>
        ))}
      </div>

      {/* Word Success celebration card */}
      <AnimatePresence>
        {isWordCorrect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-5 border-2 border-emerald-300 shadow-lg text-center"
          >
            <div className="inline-flex items-center gap-2 text-emerald-600 font-black text-lg mb-1">
              <Check className="w-6 h-6" />
              <span>{lang === 'hi' ? 'शाबाश! सही शब्द!' : 'Awesome! Correct!'}</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mb-3">
              {lang === 'hi'
                ? `आपने "${currentPuzzle.word}" शब्द बिल्कुल सही बनाया!`
                : `You spelled "${currentPuzzle.word}" perfectly!`}
            </p>

            {currentIdx < WORDS.length - 1 ? (
              <button
                id="word-next-btn"
                onClick={nextWord}
                className="px-6 py-2.5 bg-gradient-to-r from-lime-500 to-emerald-500 text-white font-bold rounded-2xl shadow active:scale-95 transition-all text-xs flex items-center gap-1.5 mx-auto"
              >
                <span>{lang === 'hi' ? 'अगला शब्द' : 'Next Word'}</span>
                <Sparkles className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-xs font-extrabold text-lime-600">
                {lang === 'hi' ? 'सभी शब्द पूरे हुए! 🏆' : 'All words completed! 🏆'}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* All finished modal */}
      <AnimatePresence>
        {allFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border-4 border-lime-300"
            >
              <div className="w-16 h-16 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-lime-500 animate-bounce" />
              </div>

              <h3 className="text-2xl font-black text-slate-800">
                {lang === 'hi' ? 'शब्द सम्राट! 🔤' : 'Word Master! 🔤'}
              </h3>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                {lang === 'hi'
                  ? `शानदार! आपने सभी शब्द सही स्पेलिंग के साथ सुलझाए! स्कोर: ${score}!`
                  : `Terrific! You spelled all words like a true champion! Score: ${score}!`}
              </p>

              <div className="flex gap-2 mt-5">
                <button
                  id="word-play-again-btn"
                  onClick={restartWords}
                  className="flex-1 py-3 bg-gradient-to-r from-lime-500 to-emerald-500 text-white font-bold rounded-2xl shadow-md active:scale-95 transition-all text-sm"
                >
                  {lang === 'hi' ? 'फिर से खेलें' : 'Play Again'}
                </button>
                <button
                  id="word-modal-menu-btn"
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
