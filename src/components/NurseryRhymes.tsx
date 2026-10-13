import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, Music, Sparkles, Heart, Star } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface NurseryRhymesProps {
  lang: Language;
  onBack: () => void;
  onGameComplete?: (stars: number) => void;
}

interface Rhyme {
  id: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  themeColor: string;
  bgGradient: string;
  visualEmoji: string;
  linesEn: string[];
  linesHi: string[];
  notes: number[]; // musical frequencies for melodic playback
}

const RHYMES: Rhyme[] = [
  {
    id: 'twinkle',
    titleEn: 'Twinkle Twinkle Little Star',
    titleHi: 'ट्विंकल ट्विंकल लिटिल स्टार (चमकीला तारा)',
    subtitleEn: 'How I wonder what you are!',
    subtitleHi: 'ऊपर आसमान में जैसे हीरा!',
    themeColor: 'from-amber-400 via-yellow-400 to-amber-500',
    bgGradient: 'from-indigo-950 via-slate-900 to-purple-950',
    visualEmoji: '⭐',
    linesEn: [
      'Twinkle, twinkle, little star,',
      'How I wonder what you are!',
      'Up above the world so high,',
      'Like a diamond in the sky.',
      'Twinkle, twinkle, little star,',
      'How I wonder what you are!',
    ],
    linesHi: [
      'ट्विंकल, ट्विंकल, लिटिल स्टार,',
      'कितना सुंदर, कितना प्यारा यार!',
      'दूर गगन में चमके ऐसे,',
      'नीले नभ में हीरा जैसे।',
      'ट्विंकल, ट्विंकल, लिटिल स्टार,',
      'रोशन करता संसार!',
    ],
    // C C G G A A G | F F E E D D C
    notes: [261.6, 261.6, 392.0, 392.0, 440.0, 440.0, 392.0, 349.2, 349.2, 329.6, 329.6, 293.7, 293.7, 261.6],
  },
  {
    id: 'chanda_mama',
    titleEn: 'Chanda Mama Door Ke',
    titleHi: 'चंदा मामा दूर के (प्यारी लोरी)',
    subtitleEn: 'Pue pakaye boor ke, pyaari lori!',
    subtitleHi: 'पूए पकाएं बूर के, आप खाएं थाली में!',
    themeColor: 'from-cyan-400 via-sky-400 to-blue-500',
    bgGradient: 'from-blue-950 via-indigo-900 to-slate-900',
    visualEmoji: '🌙',
    linesEn: [
      'Chanda Mama door ke, pue pakaye boor ke,',
      'Aap khayein thaali mein, munne ko dein pyaali mein,',
      'Pyaali gayi toot, munna gaya rooth,',
      'Layenge nayi pyaaliyan, bajayein munna taaliyan!',
      'Udh kar aao Chanda Mama, hume sulao Chanda Mama!',
    ],
    linesHi: [
      'चंदा मामा दूर के, पूए पकाएं बूर के,',
      'आप खाएं थाली में, मुन्ने को दें प्याली में,',
      'प्याली गई टूट, मुन्ना गया रूठ,',
      'लाएंगे नई प्यालियां, बजाएं मुन्ना तालियां!',
      'उड़ कर आओ चंदा मामा, मीठी नींद सुलाओ मामा!',
    ],
    notes: [329.6, 349.2, 392.0, 440.0, 392.0, 349.2, 329.6, 293.7, 261.6, 293.7, 329.6, 349.2, 392.0],
  },
  {
    id: 'wheels_bus',
    titleEn: 'The Wheels on the Bus',
    titleHi: 'द व्हील्स ऑन द बस (बस का सफर)',
    subtitleEn: 'Go round and round, all through the town!',
    subtitleHi: 'पहिए घूमे गोल-गोल, पूरे शहर में!',
    themeColor: 'from-yellow-400 via-amber-500 to-orange-500',
    bgGradient: 'from-amber-950 via-slate-900 to-yellow-950',
    visualEmoji: '🚌',
    linesEn: [
      'The wheels on the bus go round and round,',
      'Round and round, round and round!',
      'The wipers on the bus go Swish, swish, swish,',
      'The horn on the bus goes Beep, beep, beep!',
      'The baby on the bus says Wah, wah, wah,',
      'The wheels on the bus go round and round!',
    ],
    linesHi: [
      'पीली बस के पहिए घूमे गोल-गोल-गोल,',
      'सारे बच्चे गाएं मिलकर ढोल-ढोल-ढोल!',
      'बस का हॉर्न बोले पो-पो-पो,',
      'खिड़की से हवा आए सर-सर-सर!',
      'चलो चलें हम सैर पर, खुशियों की डगर पर!',
    ],
    notes: [261.6, 349.2, 349.2, 349.2, 349.2, 392.0, 440.0, 349.2, 261.6, 349.2, 392.0, 261.6],
  },
  {
    id: 'machli_jal',
    titleEn: 'Machli Jal Ki Rani Hai',
    titleHi: 'मछली जल की रानी है (जीवन उसका पानी है)',
    subtitleEn: 'Jeevan uska paani hai, haath lagao toh dar jayegi!',
    subtitleHi: 'हाथ लगाओ तो डर जाएगी, बाहर निकालो तो मर जाएगी!',
    themeColor: 'from-emerald-400 via-teal-400 to-cyan-500',
    bgGradient: 'from-teal-950 via-emerald-950 to-slate-900',
    visualEmoji: '🐠',
    linesEn: [
      'Machli jal ki rani hai, jeevan uska paani hai,',
      'Haath lagao toh dar jayegi, bahar nikalo toh mar jayegi,',
      'Paani mein daalo toh tair jayegi, saara paani pee jayegi!',
      'Chham chham karti behti jaye, leharon sang wo gaati jaye!',
    ],
    linesHi: [
      'मछली जल की रानी है, जीवन उसका पानी है,',
      'हाथ लगाओ तो डर जाएगी, बाहर निकालो तो मर जाएगी,',
      'पानी में डालो तो तैर जाएगी, दाना डालो तो खा जाएगी!',
      'छम-छम करती तैरती जाए, नीले जल में मुस्कराए!',
    ],
    notes: [293.7, 329.6, 349.2, 392.0, 440.0, 392.0, 349.2, 329.6, 293.7, 261.6, 329.6, 392.0],
  },
  {
    id: 'old_macdonald',
    titleEn: 'Old MacDonald Had a Farm',
    titleHi: 'ओल्ड मैकडोनाल्ड का खेत (जानवरों की दुनिया)',
    subtitleEn: 'E-I-E-I-O, and on that farm he had some cows!',
    subtitleHi: 'खेत पर प्यारी गाय, बतख और भेड़!',
    themeColor: 'from-rose-400 via-pink-500 to-purple-500',
    bgGradient: 'from-purple-950 via-slate-900 to-rose-950',
    visualEmoji: '🐮',
    linesEn: [
      'Old MacDonald had a farm, E-I-E-I-O!',
      'And on his farm he had some cows, E-I-E-I-O!',
      'With a moo-moo here, and a moo-moo there,',
      'Here a moo, there a moo, everywhere a moo-moo!',
      'Old MacDonald had a farm, E-I-E-I-O!',
    ],
    linesHi: [
      'मैकडोनाल्ड दादा का प्यारा खेत, ई-आई-ई-आई-ओ!',
      'उस खेत में हरी-हरी घास और गाय, ई-आई-ई-आई-ओ!',
      'यहाँ भी मू-मू, वहाँ भी मू-मू, हर तरफ मू-मू!',
      'सारे पशु-पक्षी नाचें गाएं, मिलकर खुशियां मनाएं!',
    ],
    notes: [261.6, 261.6, 261.6, 392.0, 440.0, 440.0, 392.0, 349.2, 349.2, 329.6, 329.6, 293.7, 261.6],
  },
  {
    id: 'titli_rani',
    titleEn: 'Titli Udi Bus Pe Chadhi',
    titleHi: 'तितली उड़ी बस पे चढ़ी (रंग-बिरंगी तितली)',
    subtitleEn: 'Sheet na mili toh rone lagi!',
    subtitleHi: 'सीट ना मिली तो रोने लगी, ड्राइवर ने बोला आजा मेरे पास!',
    themeColor: 'from-purple-400 via-pink-400 to-rose-400',
    bgGradient: 'from-pink-950 via-purple-950 to-slate-900',
    visualEmoji: '🦋',
    linesEn: [
      'Titli udi, bus pe chadhi, seat na mili toh rone lagi,',
      'Driver ne bola aaja mere paas, titli boli na baba na,',
      'Mera ghar hai paas, phoolon ka hai baag!',
      'Pankh phadphada kar udd chali, aasmaan mein jhumti chali!',
    ],
    linesHi: [
      'तितली उड़ी, बस पे चढ़ी, सीट ना मिली तो रोने लगी,',
      'ड्राइवर ने बोला आजा मेरे पास, तितली बोली ना बाबा ना,',
      'मेरा घर है पास, फूलों का सुंदर बाग!',
      'पंख पसारे उड़ती जाए, बगिया में खुशियां बिखराए!',
    ],
    notes: [329.6, 392.0, 440.0, 523.2, 440.0, 392.0, 349.2, 329.6, 293.7, 349.2, 392.0],
  },
];

export const NurseryRhymes: React.FC<NurseryRhymesProps> = ({ lang, onBack, onGameComplete }) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentLineIdx, setCurrentLineIdx] = useState<number>(0);
  const [noteStep, setNoteStep] = useState<number>(0);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentRhyme = RHYMES[activeIdx];
  const lines = lang === 'hi' ? currentRhyme.linesHi : currentRhyme.linesEn;

  // Stop playback on change
  const stopPlayback = () => {
    setIsPlaying(false);
    if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }
  };

  const selectRhyme = (idx: number) => {
    stopPlayback();
    sounds.tap(1.1);
    setActiveIdx(idx);
    setCurrentLineIdx(0);
    setNoteStep(0);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      setIsPlaying(true);
      sounds.tap(1.3);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.5 } });

      let currentLine = 0;
      let currentNote = 0;

      playTimerRef.current = setInterval(() => {
        // Play melodious tone from rhyme
        const noteFreq = currentRhyme.notes[currentNote % currentRhyme.notes.length];
        sounds.playTone(noteFreq, 0.48, 'triangle');

        currentNote++;
        setNoteStep(currentNote);

        // Advance rhyme line every 3-4 beats
        if (currentNote % 3 === 0) {
          currentLine = (currentLine + 1) % lines.length;
          setCurrentLineIdx(currentLine);
        }
      }, 550);
    }
  };

  useEffect(() => {
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, []);

  const handleFavoriteClick = () => {
    sounds.tap(1.4);
    confetti({ particleCount: 20, spread: 45 });
    if (onGameComplete) {
      onGameComplete(3);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center select-none overflow-y-auto no-scrollbar pb-16">
      {/* Top Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-3 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 border border-amber-200 shadow-xs">
        <button
          onClick={() => {
            stopPlayback();
            sounds.tap(0.9);
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl">🎶</span>
          <div className="text-left">
            <h2 className="text-sm sm:text-base font-black text-slate-900 leading-tight font-display">
              {lang === 'hi' ? 'नर्सरी राइम्स और बाल कविताएं' : 'Magical Nursery Rhymes'}
            </h2>
            <p className="text-[10px] text-amber-700 font-bold hidden sm:block">
              {lang === 'hi' ? 'संगीत, एनीमेशन और रंगीन बोल!' : 'Animated Lyrics & Sweet Tunes for Young Learners'}
            </p>
          </div>
        </div>

        <button
          onClick={togglePlay}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-black text-xs text-white shadow-md active:scale-95 transition-all ${
            isPlaying ? 'bg-rose-500 hover:bg-rose-600 animate-pulse' : 'bg-emerald-500 hover:bg-emerald-600'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
          <span>{isPlaying ? (lang === 'hi' ? 'रोकें' : 'Pause') : (lang === 'hi' ? 'गाना सुनें' : 'Sing Along')}</span>
        </button>
      </div>

      {/* Rhymes Selector Tabs */}
      <div className="w-full max-w-4xl flex items-center gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
        {RHYMES.map((rhyme, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={rhyme.id}
              onClick={() => selectRhyme(idx)}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-black transition-all border ${
                isActive
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-102'
                  : 'bg-white/90 hover:bg-white text-slate-700 border-amber-200/80 shadow-2xs'
              }`}
            >
              <span className="text-base">{rhyme.visualEmoji}</span>
              <span className="truncate max-w-[130px] sm:max-w-none">
                {lang === 'hi' ? rhyme.titleHi.split('(')[0] : rhyme.titleEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stage: Animated Visual Rhyme Theater */}
      <div
        className={`w-full max-w-4xl rounded-3xl overflow-hidden shadow-xl border-4 border-amber-300 relative bg-gradient-to-b ${currentRhyme.bgGradient} p-6 sm:p-8 text-white min-h-[360px] sm:min-h-[400px] flex flex-col justify-between`}
      >
        {/* Animated Background Ambience */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="absolute top-10 left-10 text-6xl"
          >
            {currentRhyme.visualEmoji}
          </motion.div>
          <motion.div
            animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
            className="absolute bottom-12 right-12 text-7xl"
          >
            {currentRhyme.visualEmoji}
          </motion.div>
          <div className="absolute top-1/2 left-1/3 text-4xl animate-pulse">✨</div>
          <div className="absolute top-1/4 right-1/4 text-3xl animate-pulse">🎵</div>
          <div className="absolute bottom-1/3 left-1/4 text-5xl animate-bounce">🎶</div>
        </div>

        {/* Rhyme Header Info */}
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-black text-amber-300 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'hi' ? 'प्यारी बाल कविता' : 'Animated Nursery Sing-Along'}</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white drop-shadow-md">
            {lang === 'hi' ? currentRhyme.titleHi : currentRhyme.titleEn}
          </h3>

          <p className="text-xs sm:text-sm font-semibold text-amber-200/90 mt-1 max-w-md mx-auto">
            {lang === 'hi' ? currentRhyme.subtitleHi : currentRhyme.subtitleEn}
          </p>
        </div>

        {/* Central Animated Character Stage */}
        <div className="relative z-10 flex flex-col items-center justify-center my-6">
          <motion.div
            animate={
              isPlaying
                ? {
                    scale: [1, 1.22, 1],
                    rotate: [0, -8, 8, 0],
                    y: [0, -16, 0],
                  }
                : { scale: [1, 1.05, 1] }
            }
            transition={{ repeat: Infinity, duration: isPlaying ? 1.1 : 3, ease: 'easeInOut' }}
            className="text-8xl sm:text-9xl drop-shadow-2xl cursor-pointer"
            onClick={togglePlay}
          >
            {currentRhyme.visualEmoji}
          </motion.div>

          {/* Dancing Musical Notes */}
          {isPlaying && (
            <div className="flex gap-4 mt-3 text-2xl animate-pulse">
              <span>🎵</span>
              <span>🎶</span>
              <span>⭐</span>
              <span>🎶</span>
              <span>🎵</span>
            </div>
          )}
        </div>

        {/* Current Sing-Along Lyric Banner */}
        <div className="relative z-10 bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 text-center shadow-lg">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentLineIdx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="text-lg sm:text-2xl font-black text-amber-300 font-display tracking-wide drop-shadow-sm"
            >
              {lines[currentLineIdx]}
            </motion.p>
          </AnimatePresence>

          <p className="text-[11px] font-bold text-slate-300 mt-2">
            {isPlaying
              ? (lang === 'hi' ? 'सुरों की धुन पर साथ में गाएं...' : 'Singing along with gentle tunes...')
              : (lang === 'hi' ? 'गाने के लिए "गाना सुनें" पर टैप करें!' : 'Tap "Sing Along" to start the animated music!')}
          </p>
        </div>
      </div>

      {/* Complete Rhyme Lyrics Book */}
      <div className="w-full max-w-4xl mt-4 bg-white/90 backdrop-blur rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-amber-100 pb-2">
          <h4 className="font-black text-slate-800 text-sm sm:text-base font-display flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-500" />
            <span>{lang === 'hi' ? 'पूरी कविता के बोल (Full Lyrics)' : 'Complete Rhyme Lyrics'}</span>
          </h4>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
            {lang === 'hi' ? 'सीखें और गाएं' : 'Read & Learn'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lines.map((line, idx) => {
            const isHighlighted = idx === currentLineIdx;
            return (
              <div
                key={idx}
                onClick={() => {
                  sounds.tap(1.1);
                  setCurrentLineIdx(idx);
                }}
                className={`p-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                  isHighlighted
                    ? 'bg-amber-100/90 text-amber-950 border-amber-400 font-black shadow-xs scale-101'
                    : 'bg-amber-50/40 text-slate-700 border-amber-100 hover:bg-amber-100/50'
                }`}
              >
                <span className="text-amber-500 mr-2 font-black">{idx + 1}.</span>
                <span>{line}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
