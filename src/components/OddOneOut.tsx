import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Lightbulb, Trophy, Check, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/audio';
import { Language } from '../types';
import confetti from 'canvas-confetti';

interface OddOneOutProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (starsEarned: number, score: number) => void;
}

interface PuzzleQuestion {
  id: number;
  items: { id: string; emoji: string; nameEn: string; nameHi: string; isOdd: boolean }[];
  hintEn: string;
  hintHi: string;
  reasonEn: string;
  reasonHi: string;
}

const QUESTIONS: PuzzleQuestion[] = [
  {
    id: 1,
    items: [
      { id: 'apple', emoji: '🍎', nameEn: 'Apple', nameHi: 'सेब', isOdd: false },
      { id: 'banana', emoji: '🍌', nameEn: 'Banana', nameHi: 'केला', isOdd: false },
      { id: 'car', emoji: '🚗', nameEn: 'Car', nameHi: 'कार', isOdd: true },
      { id: 'grapes', emoji: '🍇', nameEn: 'Grapes', nameHi: 'अंगूर', isOdd: false },
    ],
    hintEn: 'Three of these are delicious fruits you can eat!',
    hintHi: 'इनमें से तीन चीजें खाने वाले मीठे फल हैं!',
    reasonEn: 'Car is a vehicle to drive, while the others are fruits!',
    reasonHi: 'कार एक गाड़ी है, जबकि बाकी तीनों फल हैं!',
  },
  {
    id: 2,
    items: [
      { id: 'plane', emoji: '✈️', nameEn: 'Airplane', nameHi: 'हवाई जहाज', isOdd: false },
      { id: 'rocket', emoji: '🚀', nameEn: 'Rocket', nameHi: 'रॉकेट', isOdd: false },
      { id: 'boat', emoji: '⛵', nameEn: 'Boat', nameHi: 'नाव', isOdd: true },
      { id: 'heli', emoji: '🚁', nameEn: 'Helicopter', nameHi: 'हेलिकॉप्टर', isOdd: false },
    ],
    hintEn: 'Three of these travel high up in the sky!',
    hintHi: 'तीन चीजें आसमान में उड़ती हैं!',
    reasonEn: 'Boat sails on water, while others fly in the sky!',
    reasonHi: 'नाव पानी पर चलती है, जबकि बाकी आसमान में उड़ते हैं!',
  },
  {
    id: 3,
    items: [
      { id: 'guitar', emoji: '🎸', nameEn: 'Guitar', nameHi: 'गिटार', isOdd: false },
      { id: 'drum', emoji: '🥁', nameEn: 'Drums', nameHi: 'ढोलक', isOdd: false },
      { id: 'pizza', emoji: '🍕', nameEn: 'Pizza', nameHi: 'पिज़्ज़ा', isOdd: true },
      { id: 'violin', emoji: '🎻', nameEn: 'Violin', nameHi: 'वायलिन', isOdd: false },
    ],
    hintEn: 'Three are musical instruments that make sweet melodies!',
    hintHi: 'तीन चीजें संगीत बजाने के बाजे हैं!',
    reasonEn: 'Pizza is delicious food, while others are musical instruments!',
    reasonHi: 'पिज़्ज़ा खाने की चीज है, बाकी तीनों वाद्य यंत्र (बाजे) हैं!',
  },
  {
    id: 4,
    items: [
      { id: 'soccer', emoji: '⚽', nameEn: 'Soccer', nameHi: 'फुटबॉल', isOdd: false },
      { id: 'basket', emoji: '🏀', nameEn: 'Basketball', nameHi: 'बास्केटबॉल', isOdd: false },
      { id: 'tennis', emoji: '🎾', nameEn: 'Tennis ball', nameHi: 'टेनिस गेंद', isOdd: false },
      { id: 'book', emoji: '📚', nameEn: 'Book', nameHi: 'किताब', isOdd: true },
    ],
    hintEn: 'Three of these are round balls for playing sports!',
    hintHi: 'तीन चीजें गोल गेंदें हैं जिनसे खेल खेला जाता है!',
    reasonEn: 'A book is for reading and learning, while others are round sports balls!',
    reasonHi: 'किताब पढ़ने के लिए होती है, बाकी सब खेल की गेंदें हैं!',
  },
  {
    id: 5,
    items: [
      { id: 'moon', emoji: '🌙', nameEn: 'Moon', nameHi: 'चांद', isOdd: false },
      { id: 'star', emoji: '⭐', nameEn: 'Star', nameHi: 'तारा', isOdd: false },
      { id: 'icecream', emoji: '🍦', nameEn: 'Ice Cream', nameHi: 'आइसक्रीम', isOdd: true },
      { id: 'saturn', emoji: '🪐', nameEn: 'Planet', nameHi: 'ग्रह', isOdd: false },
    ],
    hintEn: 'Look up! Three of these shine in the night space!',
    hintHi: 'ऊपर देखें! तीन चीजें रात के अंतरिक्ष में चमकती हैं!',
    reasonEn: 'Ice cream is a cold treat, while others are cosmic space objects!',
    reasonHi: 'आइसक्रीम एक मीठी मिठाई है, जबकि बाकी अंतरिक्ष के खगोलीय पिंड हैं!',
  },
];

export const OddOneOut: React.FC<OddOneOutProps> = ({ lang, onBack, onGameComplete }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [solved, setSolved] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [allFinished, setAllFinished] = useState<boolean>(false);

  const q = QUESTIONS[currentIdx];

  const handlePick = (isOdd: boolean) => {
    if (solved || allFinished) return;

    if (isOdd) {
      sounds.playChime();
      sounds.playPop(1.3);
      setSolved(true);
      const newScore = score + 20;
      setScore(newScore);

      if (currentIdx === QUESTIONS.length - 1) {
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
  };

  const nextQuestion = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSolved(false);
      setShowHint(false);
      sounds.playPop(1.1);
    }
  };

  const restartPuzzles = () => {
    setCurrentIdx(0);
    setSolved(false);
    setShowHint(false);
    setScore(0);
    setAllFinished(false);
    sounds.playPop(1);
  };

  return (
    <div id="odd-game-container" className="max-w-2xl mx-auto px-4 py-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur rounded-2xl p-3 border border-amber-100 shadow-sm">
        <button
          id="odd-back-btn"
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 font-semibold text-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {lang === 'hi' ? `पहेली ${currentIdx + 1} / ${QUESTIONS.length}` : `Puzzle ${currentIdx + 1} of ${QUESTIONS.length}`}
          </span>
          <span className="text-sm font-black text-amber-800">
            {lang === 'hi' ? 'अलग वस्तु खोजें!' : 'Spot the Odd One!'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="odd-hint-btn"
            onClick={() => {
              sounds.playPop(1.2);
              setShowHint(!showHint);
            }}
            className={`p-2 rounded-xl transition-all ${
              showHint ? 'bg-amber-400 text-white shadow-md' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
            }`}
            title="Hint"
          >
            <Lightbulb className="w-4 h-4" />
          </button>
          <button
            id="odd-restart-btn"
            onClick={restartPuzzles}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all active:rotate-180 duration-300"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hint Banner if toggled */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 bg-amber-50 border border-amber-300 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900 font-bold"
          >
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{lang === 'hi' ? q.hintHi : q.hintEn}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        {q.items.map((item) => {
          const isCorrectSelection = solved && item.isOdd;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePick(item.isOdd)}
              className={`aspect-square rounded-3xl p-4 flex flex-col items-center justify-center transition-all duration-300 relative shadow-md ${
                isCorrectSelection
                  ? 'bg-emerald-100 border-4 border-emerald-500 shadow-emerald-200 ring-4 ring-emerald-300/50'
                  : 'bg-white hover:bg-amber-50/50 border-2 border-slate-200'
              }`}
            >
              {isCorrectSelection && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}

              <span className="text-5xl sm:text-6xl mb-2 select-none">{item.emoji}</span>
              <span className="text-xs font-black text-slate-700">
                {lang === 'hi' ? item.nameHi : item.nameEn}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Solved Explanation Card */}
      <AnimatePresence>
        {solved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-5 border-2 border-emerald-300 shadow-lg text-center"
          >
            <div className="inline-flex items-center gap-1.5 text-emerald-700 font-black text-base mb-1">
              <Check className="w-5 h-5" />
              <span>{lang === 'hi' ? 'बिल्कुल सही!' : 'Spot On!'}</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mb-4 max-w-md mx-auto">
              {lang === 'hi' ? q.reasonHi : q.reasonEn}
            </p>

            {currentIdx < QUESTIONS.length - 1 ? (
              <button
                id="odd-next-puzzle-btn"
                onClick={nextQuestion}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl shadow active:scale-95 transition-all text-xs"
              >
                {lang === 'hi' ? 'अगली पहेली ➡️' : 'Next Puzzle ➡️'}
              </button>
            ) : (
              <div className="text-xs font-extrabold text-amber-600">
                {lang === 'hi' ? 'सभी पहेलियां सुलझा लीं! 🏆' : 'All puzzles solved! 🏆'}
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
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border-4 border-amber-300"
            >
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
              </div>

              <h3 className="text-2xl font-black text-slate-800">
                {lang === 'hi' ? 'तर्क शक्ति चैंपियन! 💡' : 'Logic Master! 💡'}
              </h3>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                {lang === 'hi'
                  ? `आपने सभी 5 पहेलियों में अलग वस्तु पहचान ली! स्कोर: ${score} अंक!`
                  : `You solved all logic puzzles with flying colors! Score: ${score} points!`}
              </p>

              <div className="flex gap-2 mt-5">
                <button
                  id="odd-play-again-btn"
                  onClick={restartPuzzles}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl shadow-md active:scale-95 transition-all text-sm"
                >
                  {lang === 'hi' ? 'फिर से खेलें' : 'Play Again'}
                </button>
                <button
                  id="odd-modal-menu-btn"
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
