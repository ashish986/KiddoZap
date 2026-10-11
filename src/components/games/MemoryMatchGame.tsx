import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/audio';

interface MemoryCard {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_ICONS = ['🦁', '🚀', '⭐', '🎈', '🍕', '🎮', '🦄', '🐬'];

export const MemoryMatchGame: React.FC<{ onGameOver?: (score: number) => void }> = ({ onGameOver }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const initGame = () => {
    soundManager.playPop();
    const deck: MemoryCard[] = [];
    const iconPairs = [...CARD_ICONS, ...CARD_ICONS];
    // Shuffle
    for (let i = iconPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [iconPairs[i], iconPairs[j]] = [iconPairs[j], iconPairs[i]];
    }

    iconPairs.forEach((icon, idx) => {
      deck.push({
        id: idx,
        icon,
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(deck);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsWon(false);
    setIsBusy(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (isBusy) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    soundManager.playPop();
    const newCards = cards.map(c => (c.id === id ? { ...c, isFlipped: true } : c));
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsBusy(true);

      const [firstId, secondId] = newFlipped;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.icon === secondCard.icon) {
        soundManager.playScore();
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCards([]);
          setMatches(m => {
            const next = m + 1;
            if (next === CARD_ICONS.length) {
              soundManager.playWin();
              setIsWon(true);
              if (onGameOver) onGameOver(100 - moves * 2);
            }
            return next;
          });
          setIsBusy(false);
        }, 300);
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
          setIsBusy(false);
        }, 900);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm flex justify-between items-center mb-4 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold">
        <span className="text-purple-400">Moves: <strong className="text-white">{moves}</strong></span>
        <span className="text-emerald-400">Pairs: <strong className="text-white">{matches} / {CARD_ICONS.length}</strong></span>
        <button
          onClick={initGame}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg cursor-pointer"
        >
          Reset ↻
        </button>
      </div>

      <div className="relative w-full max-w-sm bg-slate-950 border-2 border-purple-500/40 rounded-2xl p-4 shadow-2xl">
        <div className="grid grid-cols-4 gap-3">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched || card.isFlipped}
              className={`h-18 sm:h-20 rounded-xl flex items-center justify-center text-3xl font-black transition-all duration-300 transform cursor-pointer ${
                card.isFlipped || card.isMatched
                  ? 'bg-slate-800 border-2 border-purple-400 text-white rotate-0 shadow-lg shadow-purple-500/20'
                  : 'bg-gradient-to-br from-purple-600 to-indigo-800 hover:brightness-110 active:scale-95 text-transparent border border-purple-400/30'
              } ${card.isMatched ? 'opacity-60 scale-95 border-emerald-400 text-emerald-300' : ''}`}
            >
              {(card.isFlipped || card.isMatched) ? card.icon : '❓'}
            </button>
          ))}
        </div>

        {isWon && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center rounded-2xl">
            <div className="text-5xl mb-2">🎉</div>
            <h3 className="text-2xl font-black text-purple-400 mb-1">Brilliant Memory!</h3>
            <p className="text-slate-300 text-sm mb-4">Completed in <strong className="text-white">{moves}</strong> moves!</p>
            <button
              onClick={initGame}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-black rounded-xl shadow-lg cursor-pointer active:scale-95"
            >
              Play Again ↻
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
