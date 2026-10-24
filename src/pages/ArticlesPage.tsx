import React, { useEffect, useState } from 'react';
import { ARTICLES, Article } from '../data/articles';
import { GAMES, GameInfo } from '../data/games';

interface PageProps {
  initialSlug?: string | null;
  onGoHome: () => void;
  onSelectGame: (game: GameInfo) => void;
}

export const ArticlesPage: React.FC<PageProps> = ({ initialSlug, onGoHome, onSelectGame }) => {
  const [activeArticle, setActiveArticle] = useState<Article | null>(() => {
    if (initialSlug) {
      return ARTICLES.find(a => a.slug === initialSlug) || null;
    }
    return null;
  });

  useEffect(() => {
    if (activeArticle) {
      document.title = `${activeArticle.title} | KiddoZap Articles`;
    } else {
      document.title = 'Educational Guides & Real Field Reports | KiddoZap';
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeArticle]);

  if (activeArticle) {
    const relatedGames = GAMES.filter(g => activeArticle.relatedGameIds.includes(g.id));

    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-slate-300">
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-semibold flex-wrap">
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
          <button
            onClick={() => setActiveArticle(null)}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            All Articles
          </button>
          <span>/</span>
          <span className="text-slate-200 truncate max-w-xs">{activeArticle.title}</span>
        </nav>

        <article className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-3 text-xs text-cyan-400 font-bold mb-4">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              {activeArticle.category}
            </span>
            <span>&bull;</span>
            <span className="text-slate-400">{activeArticle.readTime}</span>
            <span>&bull;</span>
            <span className="text-slate-400">{activeArticle.publishedDate}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white mb-3 leading-tight">
            {activeArticle.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-400 mb-6 leading-relaxed">
            {activeArticle.subtitle}
          </p>

          {/* Author Card */}
          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-8">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl flex-shrink-0">
              {activeArticle.author.avatar}
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">{activeArticle.author.name}</p>
              <p className="text-xs text-cyan-400 font-semibold">{activeArticle.author.role}</p>
              <p className="text-xs text-slate-400 mt-1">{activeArticle.author.bio}</p>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8 text-amber-200">
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <span>⚡</span> Key Practical Takeaways
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm pl-4 list-disc text-slate-200">
              {activeArticle.takeaways.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>

          {/* Body Html */}
          <div
            className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: activeArticle.contentHtml }}
          />

          {/* Related Games */}
          {relatedGames.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-800">
              <h3 className="text-base font-black text-white mb-4">🎮 Games Featured in This Field Report</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedGames.map(game => (
                  <div
                    key={game.id}
                    onClick={() => onSelectGame(game)}
                    className="flex items-center gap-4 bg-slate-950 hover:bg-slate-800/80 p-4 rounded-2xl border border-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="text-3xl">{game.icon}</span>
                    <div>
                      <h4 className="font-black text-white text-sm">{game.title}</h4>
                      <p className="text-xs text-cyan-400 font-semibold">{game.categoryLabel} &bull; {game.age}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => setActiveArticle(null)}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            ← Back to All Articles
          </button>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onGoHome();
            }}
            className="text-xs text-cyan-400 hover:underline font-bold"
          >
            Play Games 🎮
          </a>
        </div>
      </div>
    );
  }

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
        <span className="text-slate-200">Articles &amp; Field Reports</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-xs font-bold mb-4">
          <span>📚</span> Educational Research &amp; User Experience
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          KiddoZap Educational Blog
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Authentic field studies, teacher guides, clinical pediatric insights, and founder manifestos on safe, healthy, brain-boosting browser play.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ARTICLES.map(art => (
          <div
            key={art.slug}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-colors shadow-lg"
          >
            <div>
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold mb-3">
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                  {art.category}
                </span>
                <span>&bull;</span>
                <span className="text-slate-400">{art.readTime}</span>
              </div>
              <h2 className="text-xl font-black text-white mb-2 leading-snug">
                <button
                  onClick={() => setActiveArticle(art)}
                  className="hover:text-cyan-400 text-left transition-colors cursor-pointer"
                >
                  {art.title}
                </button>
              </h2>
              <p className="text-xs text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                {art.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-bold flex items-center gap-2">
                <span>{art.author.avatar}</span>
                <span>{art.author.name}</span>
              </span>
              <button
                onClick={() => setActiveArticle(art)}
                className="text-xs text-cyan-400 font-black hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                Read Report →
              </button>
            </div>
          </div>
        ))}
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
