import React, { useEffect } from 'react';

interface PageProps {
  onGoHome: () => void;
}

export const ParentsGuidePage: React.FC<PageProps> = ({ onGoHome }) => {
  useEffect(() => {
    document.title = 'Parents & Teachers Practical Guide | KiddoZap Healthy Screen Time';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-slate-300">
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
        <span className="text-slate-200">Parents &amp; Teachers Guide</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-bold mb-4">
          <span>👨‍👩‍👦</span> Educational Play &amp; Screen Health
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Parents &amp; Educators Guide
        </h1>
        <p className="text-sm text-slate-400">
          How to integrate wholesome browser gaming into daily learning routines while safeguarding attention spans and eyesight.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">1. Active vs. Passive Screen Time</h2>
          <p className="mb-3">
            Child psychologists and pediatricians emphasize that not all digital experiences affect neurodevelopment in the same manner. Passive media consumption (mindlessly bingeing algorithmic short videos) creates passive dopamine loops without requiring problem-solving.
          </p>
          <p>
            In contrast, <strong>interactive cognitive gaming</strong>—such as finding optimal parity in <em>Four in a Line</em>, evaluating prime numbers in <em>Math Sprint Blitz</em>, or memorizing grid cards in <em>Memory Match</em>—actively recruits prefrontal cortex working memory, hypothesis formulation, and fine motor precision.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">2. The 30-Minute Screen Time Routine</h2>
          <p className="mb-3">
            To prevent screen fatigue and emotional friction when powering down, we recommend the following 3-step routine:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xl font-black text-cyan-400 mb-1 block">Step 1: Set Intention</span>
              <p className="text-xs text-slate-400">
                Agree beforehand on 2 to 3 specific games (e.g. 1 puzzle game + 1 arcade run).
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xl font-black text-emerald-400 mb-1 block">Step 2: 25-Min Timer</span>
              <p className="text-xs text-slate-400">
                Use a physical kitchen timer or device timer so the cutoff is neutral and objective.
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xl font-black text-indigo-400 mb-1 block">Step 3: 20-20-20 Rule</span>
              <p className="text-xs text-slate-400">
                Every 20 minutes, look at an object 20 feet away for 20 seconds to relax ocular muscles.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">3. Co-Playing for Family Connection</h2>
          <p className="mb-3">
            Digital games are a powerful vehicle for bonding when parents participate. Several KiddoZap titles feature local pass-and-play mechanics:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Four in a Line:</strong> Discuss diagonal traps and spatial foresight with your child.</li>
            <li><strong>Tic Tac Toe Neon:</strong> Introduce game theory, center-square advantage, and unwinnable draws.</li>
            <li><strong>Sudoku Kids &amp; Teens:</strong> Solve a 4x4 or 6x6 grid cooperatively by eliminating possibilities aloud.</li>
          </ul>
        </section>

        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">4. Classroom Integration for Educators</h2>
          <p className="mb-3">
            Over 500 teachers use KiddoZap during the school week for:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Morning Warm-Ups (5 mins):</strong> Students complete two rounds of <em>Math Sprint Blitz</em> to activate arithmetic recall before math instruction.</li>
            <li><strong>Rainy Day Indoor Recess:</strong> Safe, moderated browser games that require zero logins and cannot lead students into social media or violent websites.</li>
            <li><strong>Early-Finisher Rewards:</strong> Productive logic enrichment for fast workers while classmates complete assessments.</li>
          </ul>
        </section>
      </div>

      {/* Back Button */}
      <div className="mt-10 pt-6 border-t border-slate-800 flex justify-center">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onGoHome();
          }}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-lg transition-transform hover:scale-105"
        >
          <span>🎮</span> Explore All 20 Games
        </a>
      </div>
    </div>
  );
};
