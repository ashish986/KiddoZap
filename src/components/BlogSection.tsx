import React from 'react';
import { ARTICLES, Article } from '../data/articles';
import { GameInfo } from '../data/games';
import { soundManager } from '../utils/audio';

interface BlogSectionProps {
  onSelectGame: (game: GameInfo) => void;
  onOpenArticle: (slug: string) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onOpenArticle }) => {
  const handleOpenArticle = (e: React.MouseEvent, article: Article) => {
    e.preventDefault();
    soundManager.playPop();
    onOpenArticle(article.slug);
  };

  return (
    <section className="my-16">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-xs font-black mb-3">
            <span>📚</span> Real User Experience &amp; Editorial Blog
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Classroom Stories &amp; Parenting Guides
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Real field reports from educators, pediatric counselors, parents, and founder Ashish Pal on healthy screen time, math anxiety reduction, and child-safe gaming.
          </p>
        </div>
        <a
          href="/articles"
          onClick={(e) => {
            e.preventDefault();
            soundManager.playPop();
            onOpenArticle('');
          }}
          className="text-xs font-black text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          View Full Article Index →
        </a>
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTICLES.map(article => (
          <a
            key={article.slug}
            href={`/articles/${article.slug}`}
            onClick={(e) => handleOpenArticle(e, article)}
            className="group bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between text-left block"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-extrabold text-[10px] uppercase tracking-wider border border-cyan-500/30">
                  {article.category}
                </span>
                <span className="font-semibold">{article.readTime}</span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-cyan-400 transition-colors leading-snug mb-2">
                {article.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                {article.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{article.author.avatar}</span>
                <div>
                  <p className="text-xs font-black text-slate-200 leading-tight">
                    {article.author.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {article.publishedDate}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-cyan-400 group-hover:translate-x-1 transition-transform">
                Read Report →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
