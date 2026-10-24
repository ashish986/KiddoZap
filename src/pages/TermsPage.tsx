import React, { useEffect } from 'react';

interface PageProps {
  onGoHome: () => void;
}

export const TermsPage: React.FC<PageProps> = ({ onGoHome }) => {
  useEffect(() => {
    document.title = 'Terms of Service | KiddoZap Educational Games';
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
        <span className="text-slate-200">Terms of Service</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-xs font-bold mb-4">
          <span>📜</span> Legal &amp; User Agreement
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-400">
          Last Updated: October 24, 2026 &bull; Platform Owner: Ashish Pal (<a href="mailto:support@kiddozap.com" className="text-cyan-400 underline">support@kiddozap.com</a>)
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">1. Acceptance of Terms</h2>
          <p className="mb-3">
            By visiting, accessing, or playing games on <strong>KiddoZap</strong> (<a href="https://kiddozap.com" className="text-cyan-400 underline">kiddozap.com</a>), you (&ldquo;User&rdquo;, &ldquo;Student&rdquo;, &ldquo;Parent&rdquo;, or &ldquo;Educator&rdquo;) agree to be legally bound by these Terms of Service and all applicable local, national, and international laws.
          </p>
          <p>
            If you do not agree with any of these terms, your sole remedy is to discontinue using the platform.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">2. Description of Service &amp; Free Universal Access</h2>
          <p className="mb-3">
            KiddoZap is a web-based educational entertainment platform offering 20 curated browser mini-games, logic puzzles, arithmetic sprints, and cognitive skill trainers.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Zero Cost:</strong> All 20 games are provided 100% free of charge. We do not sell subscriptions, tokens, coins, VIP tiers, or locked level expansions.</li>
            <li><strong>No Software Downloads:</strong> Games execute natively in standard HTML5 Canvas/WebGL web browsers without requiring software installation or plugins.</li>
          </ul>
        </section>

        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">3. Educational &amp; Classroom Fair-Use License</h2>
          <p className="mb-3">
            We actively support teachers, STEM clubs, homeschool parents, and academic institutions:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>K-12 educators may freely display, project, and use KiddoZap games during instructional periods, math warm-ups, or cognitive brain breaks.</li>
            <li>Educational institutions do not need prior written consent to link to KiddoZap from school learning management systems (e.g. Google Classroom, Canvas, Schoology).</li>
          </ul>
        </section>

        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">4. Intellectual Property &amp; Restrictions</h2>
          <p className="mb-3">
            The KiddoZap brand, logo, original gameplay code, custom artwork, educational guides, case study articles, and website architecture are the intellectual property of <strong>Ashish Pal</strong> and KiddoZap.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You may not mirror, scrape, bulk-download, or redistribute the website content or game assets for commercial resale.</li>
            <li>You may not attempt to reverse engineer, decompile, or inject malicious scripts into the game canvas engines.</li>
          </ul>
        </section>

        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">5. Disclaimer of Warranties &amp; Service Availability</h2>
          <p className="mb-3">
            The games and services are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied.
          </p>
          <p>
            While we strive for 99.9% uptime and smooth 60fps performance across modern devices, KiddoZap does not warrant that the website will be completely error-free, uninterrupted, or compatible with legacy or obsolete browser hardware.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">6. Limitation of Liability</h2>
          <p>
            Under no circumstances shall KiddoZap, its founder Ashish Pal, or its contributors be held liable for any indirect, incidental, special, consequential, or punitive damages arising from your access to or inability to access the website or its games.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">7. Contact &amp; Governance</h2>
          <p className="mb-2">
            These terms are governed in accordance with applicable laws. Inquiries concerning these terms should be addressed to:
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <p><strong>Founder:</strong> Ashish Pal</p>
            <p><strong>Email:</strong> <a href="mailto:support@kiddozap.com" className="text-cyan-400 underline">support@kiddozap.com</a> / <a href="mailto:ashishpal996@gmail.com" className="text-cyan-400 underline">ashishpal996@gmail.com</a></p>
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
          <span>🎮</span> Back to KiddoZap Game Hub
        </a>
      </div>
    </div>
  );
};
