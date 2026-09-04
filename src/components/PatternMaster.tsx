import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Volume2, Trophy, Sparkles, Play } from 'lucide-react';
import { sounds } from '../utils/audio';
import { Language } from '../types';
import confetti from 'canvas-confetti';

interface PatternMasterProps {
  lang: Language;
  onBack: () => void;
  onGameComplete: (starsEarned: number, roundReached: number) => void;
}

interface Pad {
  id: number;
  colorName: string;
  nameEn: string;
  nameHi: string;
  freq: number;
  bgNormal: string;
  bgActive: string;
  ringColor: string;
}

const PADS: Pad[] = [
  {
    id: 0,
    colorName: 'green',
    nameEn: 'Green',
    nameHi: 'हरा',
    freq: 329.63, // E4
    bgNormal: 'bg-emerald-500 hover:bg-emerald-400 border-emerald-600',
    bgActive: 'bg-emerald-300 ring-8 ring-emerald-300/60 scale-105',
    ringColor: 'border-emerald-300',
  },
  {
    id: 1,
    colorName: 'red',
    nameEn: 'Red',
    nameHi: 'लाल',
    freq: 440.0, // A4
    bgNormal: 'bg-rose-500 hover:bg-rose-400 border-rose-600',
    bgActive: 'bg-rose-300 ring-8 ring-rose-300/60 scale-105',
    ringColor: 'border-rose-300',
  },
  {
    id: 2,
    colorName: 'yellow',
    nameEn: 'Yellow',
    nameHi: 'पीला',
    freq: 554.37, // C#5
    bgNormal: 'bg-amber-400 hover:bg-amber-300 border-amber-500',
    bgActive: 'bg-yellow-200 ring-8 ring-yellow-200/60 scale-105',
    ringColor: 'border-yellow-300',
  },
  {
    id: 3,
    colorName: 'blue',
    nameEn: 'Blue',
    nameHi: 'नीला',
    freq: 659.25, // E5
    bgNormal: 'bg-sky-500 hover:bg-sky-400 border-sky-600',
    bgActive: 'bg-sky-300 ring-8 ring-sky-300/60 scale-105',
    ringColor: 'border-sky-300',
  },
];

export const PatternMaster: React.FC<PatternMasterProps> = ({ lang, onBack, onGameComplete }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIdx, setPlayerIdx] = useState<number>(0);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [isPlayingSeq, setIsPlayingSeq] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [bestRound, setBestRound] = useState<number>(0);

  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach((t) => clearTimeout(t));
    timeoutRefs.current = [];
  };

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  const flashPad = (padId: number, duration = 300) => {
    setActivePad(padId);
    sounds.playSimonTone(PADS[padId].freq, duration / 1000);
    const timer = setTimeout(() => {
      setActivePad(null);
    }, duration);
    timeoutRefs.current.push(timer);
  };

  const playSequence = (seq: number[]) => {
    setIsPlayingSeq(true);
    clearAllTimeouts();

    seq.forEach((padId, index) => {
      const delay = (index + 1) * 650;
      const timer = setTimeout(() => {
        flashPad(padId, 380);
        if (index === seq.length - 1) {
          const endTimer = setTimeout(() => {
            setIsPlayingSeq(false);
            setPlayerIdx(0);
          }, 450);
          timeoutRefs.current.push(endTimer);
        }
      }, delay);
      timeoutRefs.current.push(timer);
    });
  };

  const startNewGame = () => {
    clearAllTimeouts();
    const firstPad = Math.floor(Math.random() * 4);
    const newSeq = [firstPad];
    setSequence(newSeq);
    setPlayerIdx(0);
    setGameStarted(true);
    setGameOver(false);
    playSequence(newSeq);
  };

  const handlePadClick = (padId: number) => {
    if (isPlayingSeq || gameOver || !gameStarted) return;

    flashPad(padId, 250);

    if (padId === sequence[playerIdx]) {
      const nextIdx = playerIdx + 1;
      setPlayerIdx(nextIdx);

      // Completed full sequence of current round!
      if (nextIdx === sequence.length) {
        sounds.playChime();
        const currentRound = sequence.length;
        if (currentRound > bestRound) {
          setBestRound(currentRound);
        }

        if (currentRound % 3 === 0) {
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.6 },
          });
        }

        const nextPad = Math.floor(Math.random() * 4);
        const updatedSeq = [...sequence, nextPad];
        setSequence(updatedSeq);

        const nextTimer = setTimeout(() => {
          playSequence(updatedSeq);
        }, 900);
        timeoutRefs.current.push(nextTimer);
      }
    } else {
      // Wrong pad tapped
      sounds.playError();
      setGameOver(true);
      const finalRound = sequence.length - 1;
      let stars = 1;
      if (finalRound >= 7) stars = 3;
      else if (finalRound >= 4) stars = 2;

      onGameComplete(stars, Math.max(bestRound, finalRound));
    }
  };

  return (
    <div id="pattern-game-container" className="max-w-xl mx-auto px-4 py-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur rounded-2xl p-3 border border-violet-100 shadow-sm">
        <button
          id="pattern-back-btn"
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200 font-semibold text-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-slate-700">
            <span>{lang === 'hi' ? 'राउंड: ' : 'Round: '}</span>
            <span className="text-violet-600 font-extrabold text-base">
              {gameStarted ? sequence.length : 0}
            </span>
          </div>

          <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            <span>{lang === 'hi' ? 'सर्वश्रेष्ठ: ' : 'Best: '}</span>
            <span className="text-slate-800 font-black">{bestRound}</span>
          </div>
        </div>

        <button
          id="pattern-restart-btn"
          onClick={startNewGame}
          className="p-2 rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200 transition-all active:rotate-180 duration-300"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Instruction Banner */}
      <div className="text-center mb-6">
        {!gameStarted ? (
          <div className="bg-white/90 p-6 rounded-3xl border border-violet-100 shadow-sm text-center">
            <Sparkles className="w-8 h-8 text-violet-500 mx-auto mb-2 animate-bounce" />
            <h3 className="text-lg font-black text-slate-800">
              {lang === 'hi' ? 'रंग और सुर याद रखें!' : 'Follow the Sound & Light!'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {lang === 'hi'
                ? 'कंप्यूटर जो क्रम बजाएगा, उसे ध्यान से देखें और उसी क्रम में बटन दबाएं।'
                : 'Watch the sequence light up and repeat the exact musical pattern.'}
            </p>
            <button
              id="pattern-start-game-btn"
              onClick={startNewGame}
              className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-md active:scale-95 transition-all text-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{lang === 'hi' ? 'खेल शुरू करें' : 'Start Game'}</span>
            </button>
          </div>
        ) : isPlayingSeq ? (
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-800 px-4 py-1.5 rounded-full text-xs font-bold animate-pulse">
            <Volume2 className="w-4 h-4" />
            <span>{lang === 'hi' ? 'ध्यान से देखें और सुनें...' : 'Listen & watch carefully...'}</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-black">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>
              {lang === 'hi'
                ? `आपकी बारी! (${playerIdx} / ${sequence.length})`
                : `Your Turn! (${playerIdx} / ${sequence.length})`}
            </span>
          </div>
        )}
      </div>

      {/* 4 Simon Pads Circle Layout */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto p-3 bg-slate-900 rounded-full shadow-2xl shadow-violet-900/30 border-4 border-slate-800 flex items-center justify-center">
        {/* Center hub */}
        <div className="absolute z-10 w-24 h-24 sm:w-28 sm:h-28 bg-slate-900 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center shadow-inner text-white">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-violet-400">
            {lang === 'hi' ? 'साइमन' : 'SPARK'}
          </span>
          <span className="text-2xl font-black">
            {gameStarted ? sequence.length : '✨'}
          </span>
        </div>

        {/* 4 Quarter Pads */}
        <div className="grid grid-cols-2 gap-3 w-full h-full">
          {PADS.map((pad) => {
            const isActive = activePad === pad.id;
            return (
              <motion.button
                key={pad.id}
                whileTap={!isPlayingSeq && gameStarted ? { scale: 0.94 } : {}}
                onClick={() => handlePadClick(pad.id)}
                disabled={isPlayingSeq || !gameStarted}
                className={`relative rounded-2xl transition-all duration-150 cursor-pointer ${
                  pad.id === 0 ? 'rounded-tl-full' : ''
                } ${pad.id === 1 ? 'rounded-tr-full' : ''} ${
                  pad.id === 2 ? 'rounded-bl-full' : ''
                } ${pad.id === 3 ? 'rounded-br-full' : ''} ${
                  isActive ? pad.bgActive : pad.bgNormal
                } border-2 ${
                  isActive ? 'brightness-125' : 'opacity-90 hover:opacity-100'
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xs font-black text-white/90 drop-shadow">
                    {lang === 'hi' ? pad.nameHi : pad.nameEn}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Game Over Screen */}
      {gameOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 bg-white rounded-3xl p-5 border-2 border-rose-200 text-center shadow-lg max-w-sm mx-auto"
        >
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <Trophy className="w-6 h-6 text-rose-500" />
          </div>
          <h4 className="text-xl font-black text-slate-800">
            {lang === 'hi' ? 'खेल समाप्त!' : 'Game Over!'}
          </h4>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {lang === 'hi'
              ? `आपने राउंड ${sequence.length - 1} तक सही क्रम पूरा किया!`
              : `You reached round ${sequence.length - 1}! Great memory!`}
          </p>
          <button
            id="pattern-try-again-btn"
            onClick={startNewGame}
            className="mt-3 px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs shadow active:scale-95 transition-all"
          >
            {lang === 'hi' ? 'दोबारा खेलें' : 'Try Again'}
          </button>
        </motion.div>
      )}
    </div>
  );
};
