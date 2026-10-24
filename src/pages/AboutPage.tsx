import React, { useEffect } from 'react';

interface PageProps {
  onGoHome: () => void;
}

export const AboutPage: React.FC<PageProps> = ({ onGoHome }) => {
  useEffect(() => {
    document.title = 'About KiddoZap & Founder Ashish Pal | Educational Gaming Mission';
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
        <span className="text-slate-200">About Us</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-full text-xs font-bold mb-4">
          <span>⚡</span> Independent Educational Initiative
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          About KiddoZap
        </h1>
        <p className="text-base text-cyan-300 font-bold mb-2">
          Founded by Ashish Pal &bull; Dedicated to Mindful, Non-Violent Play
        </p>
        <p className="text-sm text-slate-400">
          Clean engineering, zero dark patterns, and pure cognitive fun for kids, teens, and schools worldwide.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        {/* Founder Story */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">
              👨‍💻
            </div>
            <div>
              <h2 className="text-xl font-black text-white">The Founder&apos;s Story: Ashish Pal</h2>
              <p className="text-xs text-cyan-400 font-bold">Creator &amp; Lead Systems Architect, KiddoZap</p>
            </div>
          </div>
          <p className="mb-3">
            In early 2025, software engineer <strong>Ashish Pal</strong> observed a troubling trend while watching his younger cousins and friends&apos; children play online web games. Almost every popular casual gaming site had degenerated into a minefield of disruptive full-screen popups, misleading &ldquo;You won a prize!&rdquo; alerts, violent themes, and unmoderated chat boxes with digital strangers.
          </p>
          <p className="mb-3">
            Ashish asked a fundamental question: <em>&ldquo;Can we create a gaming portal where parents and teachers can hand a tablet or laptop to a child with 100% peace of mind?&rdquo;</em>
          </p>
          <p>
            From that conviction, <strong>KiddoZap</strong> was born: an uncompromising digital playground of exactly <strong>20 curated mini-games</strong> focused entirely on mental arithmetic, spatial planning, visual memory, and hand-eye dexterity.
          </p>
        </section>

        {/* Core Pillars */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-4">The Three Pillars of KiddoZap</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-2xl mb-2 block">🧠</span>
              <h3 className="font-black text-white text-base mb-1">Cognitive Value</h3>
              <p className="text-xs text-slate-400">
                Every game exercises a real mental faculty: working memory, deductive logic, motor timing, or rapid mental math calculation.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-2xl mb-2 block">🛡️</span>
              <h3 className="font-black text-white text-base mb-1">Absolute Child Safety</h3>
              <p className="text-xs text-slate-400">
                No user accounts, no chat rooms, no friend lists, and zero personal tracking. Complete COPPA and FERPA adherence.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-2xl mb-2 block">🚫</span>
              <h3 className="font-black text-white text-base mb-1">Zero Exploitation</h3>
              <p className="text-xs text-slate-400">
                No loot boxes, no paid coin packs, no pay-to-win, and no artificial wait timers designed to induce anxiety in children.
              </p>
            </div>
          </div>
        </section>

        {/* Editorial & Pedagogical Philosophy */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">Our Pedagogical Philosophy</h2>
          <p className="mb-3">
            We reject the notion that online games must be mindless time sinks. When games feature tight feedback loops, clean geometric physics, and escalating mental challenges, they cultivate:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-3">
            <li><strong>Growth Mindset:</strong> Learning that a loss is simply data to inform the next attempt (e.g. <em>Brick Breaker Galaxy</em> and <em>Geo Dash Neon</em>).</li>
            <li><strong>Pattern Recognition:</strong> Scanning multiple variables simultaneously to discover logical shortcuts (e.g. <em>Sudoku Kids &amp; Teens</em> and <em>Pac Maze Retro</em>).</li>
            <li><strong>Math Fluency:</strong> Demystifying mental addition, multiplication, and subtraction under friendly time pressure (e.g. <em>Math Sprint Blitz</em>).</li>
          </ul>
        </section>

        {/* Contact info */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">Get in Touch with Ashish Pal</h2>
          <p className="mb-3">
            We are always listening to suggestions from classroom teachers, pediatric clinicians, and homeschool families.
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <p className="font-bold text-white mb-1">Contact Email:</p>
            <a href="mailto:support@kiddozap.com" className="text-cyan-400 font-black text-lg underline">
              support@kiddozap.com
            </a>
            <span className="text-slate-500 mx-2">&bull;</span>
            <a href="mailto:ashishpal996@gmail.com" className="text-cyan-400 font-bold underline text-sm">
              ashishpal996@gmail.com
            </a>
            <p className="text-xs text-slate-400 mt-2">New Delhi, India &bull; Typically responds within 24 to 48 hours.</p>
          </div>
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
