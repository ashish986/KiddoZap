import React, { useEffect } from 'react';
import { GAMES, CATEGORIES, GameInfo } from '../data/games';

interface PageProps {
  onGoHome: () => void;
  onSelectGame: (game: GameInfo) => void;
  onSelectCategoryFilter: (catId: string) => void;
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'brain-puzzles': 'Pattern recognition, spatial constraints, and deductive logic puzzles.',
  'action-reflex': 'Kinetic motor precision, obstacle reaction timing, and hand-eye accuracy.',
  'arcade-retro': 'Classic arcade mechanics redesigned with non-violent cartoon physics.',
  'math': 'Mental addition, rapid multiplication sprints, and anxiety-free calculation drills.',
  'little-kids': 'Early childhood rhythm synchronization, melodic pitch, and gentle gameplay.',
};

export const CategoriesPage: React.FC<PageProps> = ({
  onGoHome,
  onSelectGame,
  onSelectCategoryFilter,
}) => {
  useEffect(() => {
    document.title = 'Game Categories & Curriculum Alignment | KiddoZap';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-slate-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-semibold">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onGoHome();
          }}
          className="text-cyan-400 hover:underline"
        >
          ⚡ KiddoZap Home
        </a>
        <span>/</span>
        <span className="text-slate-200">Categories</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-xs font-bold mb-4">
          <span>📂</span> 5 Curated Learning Domains
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Game Categories &amp; Cognitive Skills
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Every game on KiddoZap is mapped to a primary developmental focus: logical deduction, numerical reflexes, kinetic precision, or early childhood audio-visual harmony.
        </p>
      </div>

      {/* Category Sections */}
      <div className="space-y-8">
        {CATEGORIES.filter(c => c.id !== 'all').map(cat => {
          const categoryGames = GAMES.filter(g => g.category === cat.id);

          return (
            <div key={cat.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cat.icon}</span>
                  <div>
                    <h2 className="text-xl font-black text-white">{cat.name}</h2>
                    <p className="text-xs text-cyan-400 font-semibold">{CATEGORY_DESCRIPTIONS[cat.id] || 'Curated educational games'}</p>
                  </div>
                </div>
                <button
                  onClick={() => onSelectCategoryFilter(cat.id)}
                  className="px-4 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-extrabold cursor-pointer transition-colors"
                >
                  Filter Home by {cat.name}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categoryGames.map(game => (
                  <div
                    key={game.id}
                    onClick={() => onSelectGame(game)}
                    className="bg-slate-950 hover:bg-slate-800/80 p-4 rounded-2xl border border-slate-800/80 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl group-hover:scale-110 transition-transform">{game.icon}</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {game.age}
                        </span>
                      </div>
                      <h3 className="font-black text-white text-base group-hover:text-cyan-400 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {game.shortDesc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-bold text-cyan-400">
                      <span>Play Now</span>
                      <span>⚡</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Back Button */}
      <div className="mt-10 pt-6 border-t border-slate-800 flex justify-center">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onGoHome();
          }}
          className="inline-flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-extrabold rounded-2xl transition-colors"
        >
          <span>🎮</span> Back to KiddoZap Game Hub
        </a>
      </div>
    </div>
  );
};
