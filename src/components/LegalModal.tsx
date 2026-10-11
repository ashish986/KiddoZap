import React from 'react';

export type LegalDocType = 'privacy' | 'terms' | 'parents' | 'about' | 'contact' | null;

interface LegalModalProps {
  type: LegalDocType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto text-slate-300">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center transition-colors cursor-pointer"
        >
          ✕
        </button>

        {type === 'privacy' && (
          <div>
            <h2 className="text-2xl font-black text-white mb-2">Privacy Policy</h2>
            <p className="text-xs text-slate-400 mb-4">Last Updated: October 2026</p>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                Welcome to <strong>KiddoZap</strong> (kiddozap.com). We are committed to providing a safe, fun, and educational gaming environment for children, students, and families.
              </p>
              <h3 className="text-base font-bold text-cyan-400">1. No Personal Data Collected</h3>
              <p>
                KiddoZap does not require user registration or logins. We do not ask for or collect names, email addresses, phone numbers, physical locations, or chat messages from players.
              </p>
              <h3 className="text-base font-bold text-cyan-400">2. Local Storage</h3>
              <p>
                High scores and game preferences (such as audio mute) are stored locally on your device via standard browser LocalStorage. This data never leaves your device.
              </p>
              <h3 className="text-base font-bold text-cyan-400">3. Advertising &amp; Third-Party Cookies</h3>
              <p>
                We use Google AdSense to serve non-personalized and family-appropriate advertisements. Google and its partners may use cookies to serve ads based on prior visits. You may opt out of personalized advertising by visiting Google Ad Settings.
              </p>
              <h3 className="text-base font-bold text-cyan-400">4. Contact</h3>
              <p>
                If parents or educators have any questions or feedback, please email us directly at{' '}
                <a href="mailto:support@kiddozap.com" className="text-cyan-400 underline">support@kiddozap.com</a>.
              </p>
            </div>
          </div>
        )}

        {type === 'terms' && (
          <div>
            <h2 className="text-2xl font-black text-white mb-2">Terms of Service</h2>
            <p className="text-xs text-slate-400 mb-4">Last Updated: October 2026</p>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                By using KiddoZap, you agree to these Terms of Service. KiddoZap offers free educational and casual browser mini-games for kids and students of all ages.
              </p>
              <h3 className="text-base font-bold text-cyan-400">1. Free &amp; Fair Use</h3>
              <p>
                All games on KiddoZap are completely free to play directly in your modern web browser. No software installation or downloads are required.
              </p>
              <h3 className="text-base font-bold text-cyan-400">2. Classroom &amp; Home Usage</h3>
              <p>
                Teachers, schools, and homeschool educators are welcome to use KiddoZap games as classroom warm-ups, logic exercises, and reward breaks.
              </p>
              <h3 className="text-base font-bold text-cyan-400">3. Disclaimers</h3>
              <p>
                Games are provided &ldquo;as is&rdquo; without warranties. We strive for high uptime and smooth performance across all standard mobile and desktop browsers.
              </p>
            </div>
          </div>
        )}

        {type === 'parents' && (
          <div>
            <h2 className="text-2xl font-black text-white mb-2">Parents &amp; Educators Guide</h2>
            <p className="text-xs text-slate-400 mb-4">Safety, Cognitive Value, and Screen-Time Balance</p>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                KiddoZap was created to offer an antidote to violent games and predatory in-app purchase mechanics. Every game on our platform is hand-crafted to encourage quick mental math, spatial orientation, reflex agility, and logic.
              </p>
              <h3 className="text-base font-bold text-emerald-400">✨ Safety Highlights:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>No chat rooms, direct messaging, or online stranger interactions.</li>
                <li>Zero microtransactions, loot boxes, or paywalls.</li>
                <li>Non-violent, family-friendly cartoon themes and music.</li>
              </ul>
              <h3 className="text-base font-bold text-emerald-400">💡 Recommended Screen-Time Habits:</h3>
              <p>
                We recommend 20-30 minute focused play sessions followed by 5-minute eye breaks. Puzzles like Sudoku and Math Sprint make ideal homework warm-ups!
              </p>
            </div>
          </div>
        )}

        {type === 'about' && (
          <div>
            <h2 className="text-2xl font-black text-white mb-2">About KiddoZap</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                <strong>KiddoZap</strong> is an independent web gaming hub founded with a simple mission: to make high-quality, safe, brain-boosting browser mini-games accessible to every kid and student without mandatory logins or downloads.
              </p>
              <p>
                Our collection spans arithmetic speed challenges, card memory tests, geometric reaction runners, and timeless arcade classics redesigned with crisp modern physics and vibrant neon visuals.
              </p>
              <p>
                Created and maintained by <strong>Ashish Pal</strong> and the KiddoZap team.
              </p>
            </div>
          </div>
        )}

        {type === 'contact' && (
          <div>
            <h2 className="text-2xl font-black text-white mb-2">Contact &amp; Support</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                We love hearing from parents, teachers, and young players! Whether you have game ideas, bug reports, or partnership inquiries, feel free to reach out.
              </p>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <p className="font-bold text-white mb-1">Direct Support Email:</p>
                <a href="mailto:support@kiddozap.com" className="text-cyan-400 text-lg font-black underline">
                  support@kiddozap.com
                </a>
                <p className="text-xs text-slate-400 mt-2">
                  Founder &amp; Lead Engineer: <strong>Ashish Pal</strong>
                </p>
                <p className="text-xs text-slate-400">Response time: Usually within 24-48 business hours.</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
