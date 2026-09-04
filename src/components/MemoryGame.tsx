import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Star, Trophy, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';
import { Language } from '../types';
import confetti from 'canvas-confetti';

interface MemoryGameProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (starsEarned: number, moves: number) => void;
}

interface CardItem {
  id: number;
  emoji: string;
  nameEn: string;
  nameHi: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ALL_CARDS = [
  { emoji: '🦁', nameEn: 'Lion', nameHi: 'शेर' },
  { emoji: '🐼', nameEn: 'Panda', nameHi: 'पांडा' },
  { emoji: '🐵', nameEn: 'Monkey', nameHi: 'बंदर' },
  { emoji: '🐘', nameEn: 'Elephant', nameHi: 'हाथी' },
  { emoji: '🦒', nameEn: 'Giraffe', nameHi: 'जिराफ' },
  { emoji: '🦊', nameEn: 'Fox', nameHi: 'लोमड़ी' },
  { emoji: '🐸', nameEn: 'Frog', nameHi: 'मेंढक' },
  { emoji: '🐨', nameEn: 'Koala', nameHi: 'कोआला' },
];

export const MemoryGame: React.FC<MemoryGameProps> = ({ lang, onBack, onGameComplete }) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium'>('easy');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [stars, setStars] = useState<number>(0);

  const pairCount = difficulty === 'easy' ? 6 : 8;

  const initGame = () => {
    const selected = ALL_CARDS.slice(0, pairCount);
    const deck: CardItem[] = [];
    selected.forEach((item, idx) => {
      deck.push({ id: idx * 2, ...item, isFlipped: false, isMatched: false });
      deck.push({ id: idx * 2 + 1, ...item, isFlipped: false, isMatched: false });
    });

    // Shuffle
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setIsLocked(false);
    setIsCompleted(false);
    setStars(0);
    sounds.playPop(1.1);
  };

  useEffect(() => {
    initGame();
  }, [difficulty]);

  const handleCardClick = (index: number) => {
    if (isLocked) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    sounds.playPop(1.2);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsLocked(true);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.emoji === secondCard.emoji) {
        // Match found!
        sounds.playChime();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setFlippedIndices([]);
          setIsLocked(false);

          // Check if all matched
          const matchedCount = newCards.filter((c) => c.isMatched).length + 2;
          if (matchedCount === cards.length) {
            handleVictory(moves + 1);
          }
        }, 500);
      } else {
        // Not a match
        sounds.playError();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  const handleVictory = (finalMoves: number) => {
    setIsCompleted(true);
    let earnedStars = 1;
    if (difficulty === 'easy') {
      if (finalMoves <= 9) earnedStars = 3;
      else if (finalMoves <= 14) earnedStars = 2;
    } else {
      if (finalMoves <= 14) earnedStars = 3;
      else if (finalMoves <= 20) earnedStars = 2;
    }
    setStars(earnedStars);
    sounds.playFanfare();

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });

    onGameComplete(earnedStars, finalMoves);
  };

  return (
    <div id="memory-game-container" className="max-w-3xl mx-auto px-4 py-4">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur rounded-2xl p-3 border border-orange-100 shadow-sm">
        <button
          id="memory-back-btn"
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100 text-orange-700 hover:bg-orange-200 font-semibold text-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-slate-700">
            <span>{lang === 'hi' ? 'चालें: ' : 'Moves: '}</span>
            <span className="text-orange-600 font-extrabold text-base">{moves}</span>
          </div>

          <div className="flex gap-1">
            <button
              id="diff-easy-btn"
              onClick={() => setDifficulty('easy')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                difficulty === 'easy'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lang === 'hi' ? 'सरल (12)' : 'Easy (12)'}
            </button>
            <button
              id="diff-med-btn"
              onClick={() => setDifficulty('medium')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                difficulty === 'medium'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lang === 'hi' ? 'मध्यम (16)' : 'Medium (16)'}
            </button>
          </div>
        </div>

        <button
          id="memory-reset-btn"
          onClick={initGame}
          className="p-2 rounded-xl bg-amber-100 text-amber-800 hover:bg-amber-200 transition-all active:rotate-180 duration-300"
          title={lang === 'hi' ? 'फिर से शुरू करें' : 'Restart'}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Cards */}
      <div
        className={`grid gap-3 select-none ${
          difficulty === 'easy'
            ? 'grid-cols-3 sm:grid-cols-4'
            : 'grid-cols-4'
        }`}
      >
        {cards.map((card, idx) => (
          <motion.div
            key={`${card.id}-${idx}`}
            whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.04 } : {}}
            whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.95 } : {}}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={() => handleCardClick(idx)}
            className="aspect-square cursor-pointer perspective-1000"
          >
            <div
              className={`w-full h-full relative rounded-2xl transition-all duration-300 transform-style-3d shadow-sm ${
                card.isMatched
                  ? 'bg-emerald-100 border-2 border-emerald-400 ring-2 ring-emerald-300/40'
                  : card.isFlipped
                  ? 'bg-white border-2 border-orange-300'
                  : 'bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 border-2 border-amber-300 shadow-orange-200/50 shadow-md'
              } flex flex-col items-center justify-center p-2`}
            >
              {card.isFlipped || card.isMatched ? (
                <motion.div
                  initial={{ scale: 0.5, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="flex flex-col items-center justify-center"
                >
                  <span className="text-4xl sm:text-5xl">{card.emoji}</span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-600 mt-1 tracking-wide">
                    {lang === 'hi' ? card.nameHi : card.nameEn}
                  </span>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center text-white/90">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse text-amber-100" />
                  <span className="text-[10px] font-bold tracking-widest mt-1 opacity-80 uppercase">
                    {lang === 'hi' ? 'खोजें' : 'FIND'}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {isCompleted && (
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
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
              </div>

              <h3 className="text-2xl font-black text-slate-800">
                {lang === 'hi' ? 'शानदार जीत! 🎉' : 'Awesome Job! 🎉'}
              </h3>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                {lang === 'hi'
                  ? `आपने ${moves} चालों में सभी जोड़ियां खोज लीं!`
                  : `You matched all pairs in ${moves} moves!`}
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-2 my-4">
                {[1, 2, 3].map((s) => (
                  <motion.div
                    key={s}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: s * 0.2 }}
                  >
                    <Star
                      className={`w-9 h-9 ${
                        s <= stars
                          ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                          : 'text-slate-200'
                      }`}
                    />
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  id="memory-play-again-btn"
                  onClick={initGame}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-md active:scale-95 transition-all text-sm"
                >
                  {lang === 'hi' ? 'फिर से खेलें' : 'Play Again'}
                </button>
                <button
                  id="memory-modal-back-btn"
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
