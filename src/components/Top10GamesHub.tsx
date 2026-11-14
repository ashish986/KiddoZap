import React, { useState } from 'react';
import { GAMES, CATEGORIES, GameInfo } from '../data/games';
import { soundManager } from '../utils/audio';

interface Top10GamesHubProps {
  onSelectGame: (game: GameInfo) => void;
  onNavigate: (route: string) => void;
}

export const Top10GamesHub: React.FC<Top10GamesHubProps> = ({ onSelectGame, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredGames = GAMES.filter(game => {
    const matchesCat = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCardClick = (game: GameInfo) => {
    soundManager.playPop();
    onSelectGame(game);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 font-sans">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950/60 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded-full text-xs font-black mb-4">
            <span>⭐</span> KiddoZap Top 10 Curated Collection
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-3">
            10 Best Fun &amp; Learning Games
          </h1>
          <p className="text-base sm:text-lg text-amber-300 font-bold mb-4">
            मज़ेदार खेल • दिमागी कसरत • 100% फ्री, सुरक्षित और शिक्षाप्रद!
          </p>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed mb-6">
            बच्चे खेलते-खेलते सीखें! गणित की फुर्ती, दिमागी सुडोकू, याददाश्त कार्ड, चमकीला सांप, ताल और जंप, गार्डन मोल और रचनात्मक निर्माण — 10 सबसे लोकप्रिय, मजेदार और ज्ञानवर्धक खेल एक ही जगह।
          </p>

          <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-300 pt-3 border-t border-slate-800/80">
            <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
              <span className="text-emerald-400">✅</span> 100% Free Forever
            </span>
            <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
              <span className="text-emerald-400">✅</span> Zero Chat / Child-Safe
            </span>
            <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
              <span className="text-emerald-400">✅</span> Ages 4–14 &bull; Chromebook Ready
            </span>
            <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
              <span className="text-emerald-400">✅</span> COPPA Compliant
            </span>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playPop();
                setSelectedCategory(cat.id);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25 scale-102'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search 10 games... (खोजें)"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2 text-slate-500 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 10 Games Grid */}
      <section className="mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game, index) => (
            <div
              key={game.id}
              onClick={() => handleCardClick(game)}
              className="group relative bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-400/50 rounded-3xl p-6 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Header Row: Icon, Number Rank, and Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${game.color} flex items-center justify-center text-3xl shadow-lg shadow-black/40 group-hover:scale-110 transition-transform duration-300`}>
                    {game.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">#{index + 1}</span>
                    {game.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/15 border border-amber-500/30 text-amber-300">
                        {game.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Game Title & Hindi Title */}
                <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors mb-0.5">
                  {game.title}
                </h3>
                <h4 className="text-xs font-bold text-amber-400/90 mb-3">
                  {game.titleHi}
                </h4>

                {/* Short Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {game.shortDesc}
                </p>
                <p className="text-[11px] text-slate-400 font-semibold mb-4 leading-relaxed">
                  {game.shortDescHi}
                </p>
              </div>

              <div>
                {/* Cognitive Skills & Details */}
                <div className="pt-3 border-t border-slate-800/80 mb-4 flex flex-wrap gap-2 items-center text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-bold">
                    🎯 {game.cognitiveSkills[0]?.skill || 'Focus & Reflex'}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 font-semibold">
                    👶 {game.age}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 font-semibold">
                    ⏱️ {game.estimatedPlayTime}
                  </span>
                </div>

                {/* Play Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(game);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 group-hover:from-amber-300 group-hover:to-orange-400 text-slate-950 font-black rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  <span>▶</span> Play Now (अभी खेलें)
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <span className="text-4xl block mb-2">🔍</span>
            <p className="text-slate-300 text-sm font-bold">No games found matching your search.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 bg-amber-400 text-slate-950 font-black rounded-xl text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 4 Cognitive & Learning Pillars */}
      <section className="mb-14 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400">Pedagogical Framework</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            इन 10 खेलों से बच्चे क्या सीखते हैं?
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Every game is scientifically designed to exercise essential cognitive domains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-3xl mb-3 block">🔢</span>
              <h3 className="font-black text-white text-base mb-1">Mental Math &amp; Fluency</h3>
              <p className="text-amber-400 font-bold mb-2">गणित और तेज़ गणना</p>
              <p className="text-slate-300 leading-relaxed">
                Math Sprint transforms number facts into instant reflexes, eliminating calculation hesitation and building math confidence.
              </p>
            </div>
            <span className="text-[10px] font-bold text-amber-300 mt-4 block">Game: Math Sprint Blitz</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-3xl mb-3 block">🧩</span>
              <h3 className="font-black text-white text-base mb-1">Deductive Logic &amp; Puzzles</h3>
              <p className="text-blue-400 font-bold mb-2">तार्किक सोच और सुडोकू</p>
              <p className="text-slate-300 leading-relaxed">
                Kiddo Sudoku and Tic-Tac-Toe exercise elimination logic, step-by-step reasoning, and forward planning matrices.
              </p>
            </div>
            <span className="text-[10px] font-bold text-blue-300 mt-4 block">Games: Sudoku &amp; Tic-Tac-Toe</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-3xl mb-3 block">🃏</span>
              <h3 className="font-black text-white text-base mb-1">Working Memory &amp; Recall</h3>
              <p className="text-emerald-400 font-bold mb-2">याददाश्त और एकाग्रता</p>
              <p className="text-slate-300 leading-relaxed">
                Memory Card Match strengthens visual memory retention and spatial mapping as children keep track of hidden animal pairs.
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-300 mt-4 block">Game: Memory Card Match</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-3xl mb-3 block">⚡</span>
              <h3 className="font-black text-white text-base mb-1">Reflexes &amp; Coordination</h3>
              <p className="text-rose-400 font-bold mb-2">रिफ्लेक्स और हाथ-आंख का तालमेल</p>
              <p className="text-slate-300 leading-relaxed">
                Neon Rhythm Run, Whack-A-Mole, and Fruit Slice sharpen reaction latency, kinetic tracking, and auditory-motor synchronization.
              </p>
            </div>
            <span className="text-[10px] font-bold text-rose-300 mt-4 block">Games: Rhythm Run, Mole, Fruit Slice</span>
          </div>
        </div>
      </section>

      {/* Safety & Parents FAQ */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-black text-white mb-6">
          Frequently Asked Questions (FAQ) &bull; अक्सर पूछे जाने वाले सवाल
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-black text-amber-400 mb-1">क्या ये सभी 10 खेल 100% फ्री हैं?</h3>
            <p className="text-slate-300 leading-relaxed">
              हाँ, KiddoZap के सभी 10 खेल पूरी तरह मुफ्त हैं। कोई भी हिडन चार्ज, सब्सक्रिप्शन या इन-गेम खरीदारी नहीं है।
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-black text-amber-400 mb-1">क्या बच्चों का स्कोर और प्रोग्रेस सेव रहता है?</h3>
            <p className="text-slate-300 leading-relaxed">
              हाँ! सभी हाई स्कोर और अनलॉक किए गए स्टार्स आपके डिवाइस के ब्राउज़र (LocalStorage) में सुरक्षित रूप से सेव होते हैं। किसी भी ईमेल या पासवर्ड की जरूरत नहीं है।
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-black text-amber-400 mb-1">क्या यह स्कूल क्रोमबुक और टैबलेट पर चलता है?</h3>
            <p className="text-slate-300 leading-relaxed">
              हाँ! सभी खेल हल्के और सीधे वेब ब्राउज़र पर चलते हैं। iPad, Android टैबलेट, स्कूल क्रोमबुक और लैपटॉप पर यह बिना किसी ऐप डाउनलोड के स्मूद चलता है।
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-black text-amber-400 mb-1">KiddoZap बच्चों की सुरक्षा कैसे सुनिश्चित करता है?</h3>
            <p className="text-slate-300 leading-relaxed">
              KiddoZap पर कोई भी अनमॉडरेटेड चैट रूम, मैसेजिंग या व्यक्तिगत डेटा संग्रह नहीं होता। खेल पूरी तरह अहिंसक और COPPA दिशानिर्देशों के अनुरूप हैं।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
