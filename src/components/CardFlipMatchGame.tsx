import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Star } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface CardFlipProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, moves: number) => void;
}

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ICONS = ['🐼', '🦁', '🐸', '🦊', '🦄', '🐰', '🐯', '🐨'];

export const CardFlipMatchGame: React.FC<CardFlipProps> = ({ lang, onBack, onGameComplete }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);

  const initGame = () => {
    const deck = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({
        id: idx,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(deck);
    setSelectedCards([]);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || selectedCards.length === 2) return;

    sounds.tap();
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newSelected;

      if (cards[firstIdx].emoji === cards[secondIdx].emoji) {
        sounds.correct();
        setTimeout(() => {
          setCards((prev) => {
            const matchedDeck = prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            );
            if (matchedDeck.every((c) => c.isMatched)) {
              setIsWon(true);
              sounds.complete();
              confetti({ particleCount: 30, spread: 60 });
              onGameComplete(3, moves + 1);
            }
            return matchedDeck;
          });
          setSelectedCards([]);
        }, 300);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setSelectedCards([]);
        }, 800);
      }
    }
  };

  return (
    <div id="game-cardflip" className="max-w-lg mx-auto p-4 flex flex-col items-center select-none">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-4 bg-white/90 backdrop-blur px-4 py-2.5 rounded-2xl shadow-sm border border-rose-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'hi' ? 'वापस' : 'Back'}
        </button>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 font-black text-sm">
            🎴 {moves} {lang === 'hi' ? 'चालें' : 'Moves'}
          </div>
        </div>

        <button onClick={initGame} className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700" title="Restart">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Grid */}
      <div className="w-full max-w-sm grid grid-cols-4 gap-2.5 bg-rose-50 p-4 rounded-3xl border-4 border-rose-200 shadow-xl">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(idx)}
            className={`aspect-square rounded-2xl flex items-center justify-center text-3xl font-black cursor-pointer shadow-md transition-all ${
              card.isFlipped || card.isMatched
                ? 'bg-white text-slate-800 ring-2 ring-rose-400'
                : 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-rose-300'
            }`}
          >
            {card.isFlipped || card.isMatched ? card.emoji : '❓'}
          </motion.div>
        ))}
      </div>

      {isWon && (
        <div className="mt-4 p-4 bg-white rounded-2xl shadow-lg border border-rose-200 flex flex-col items-center">
          <span className="text-4xl mb-1">🎉👏</span>
          <h4 className="text-lg font-black text-slate-800 font-fredoka">
            {lang === 'hi' ? 'कमाल कर दिया! आपने सभी जोड़े खोज लिए!' : 'Awesome! All pairs found!'}
          </h4>
          <button
            onClick={initGame}
            className="mt-2 px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-sm transition"
          >
            {lang === 'hi' ? 'फिर से खेलें' : 'Play Again'}
          </button>
        </div>
      )}
    </div>
  );
};
