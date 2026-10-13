import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, Info, Mail, Send, CheckCircle2, HeartHandshake, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { KiddoZapLogo } from './KiddoZapLogo';
import { sounds } from '../utils/audio';

export type LegalPageTab = 'about' | 'privacy' | 'terms' | 'contact' | 'coppa';

interface LegalPagesModalProps {
  isOpen: boolean;
  activeTab: LegalPageTab;
  onClose: () => void;
  lang: Language;
  onTabChange: (tab: LegalPageTab) => void;
}

export const LegalPagesModal: React.FC<LegalPagesModalProps> = ({
  isOpen,
  activeTab,
  onClose,
  lang,
  onTabChange,
}) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playChime();
    setIsSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-slate-900 rounded-3xl shadow-2xl border-2 border-indigo-500/40 overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        >
          {/* Top Bar with Navigation Tabs */}
          <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border-b border-indigo-500/30 p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <KiddoZapLogo size={42} variant="badge" className="shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight leading-tight flex items-center gap-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400">KiddoZap</span> Legal & Information Hub
                </h2>
                <p className="text-xs text-indigo-200 font-medium">
                  {lang === 'hi'
                    ? 'गूगल ऐडसेंस व चाइल्ड सेफ़्टी अनुपालन केंद्र'
                    : 'Google AdSense & Child Privacy Compliant Center'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10 shadow-xs"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex items-center gap-1.5 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto shrink-0">
            {[
              { id: 'about', label: lang === 'hi' ? 'हमारे बारे में' : 'About Us', icon: Info },
              { id: 'privacy', label: lang === 'hi' ? 'प्राइवेसी पॉलिसी' : 'Privacy Policy', icon: Lock },
              { id: 'terms', label: lang === 'hi' ? 'नियम व शर्तें' : 'Terms of Service', icon: FileText },
              { id: 'coppa', label: lang === 'hi' ? 'बच्चे व प्राइवेसी' : 'Children & Privacy', icon: ShieldCheck },
              { id: 'contact', label: lang === 'hi' ? 'संपर्क करें' : 'Contact Us', icon: Mail },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playPop();
                    onTabChange(tab.id as LegalPageTab);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20 scale-102 border border-cyan-400/40'
                      : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
            
            {/* ABOUT US TAB */}
            {activeTab === 'about' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/60 text-cyan-300 flex items-center justify-center font-bold">
                    ℹ️
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">
                      {lang === 'hi' ? 'KiddoZap के बारे में' : 'About KiddoZap'}
                    </h3>
                    <p className="text-xs text-cyan-400 font-semibold">
                      https://kiddozap.com • Think • Play • Zap!
                    </p>
                  </div>
                </div>

                <p>
                  Welcome to <strong className="text-white">KiddoZap (kiddozap.com)</strong>, a family-friendly educational gaming and brain training platform thoughtfully crafted for children, students (Class 1 to 12), and teens below 18 years of age.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 my-4">
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/30">
                    <h4 className="font-bold text-amber-300 flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      {lang === 'hi' ? 'हमारा उद्देश्य' : 'Our Mission'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      To empower young learners with cognitive brain training, logical reasoning, reflexes, and memory boosters through safe, interactive, non-violent HTML5 games.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/30">
                    <h4 className="font-bold text-cyan-300 flex items-center gap-2 mb-1">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      {lang === 'hi' ? 'बाल-हितैषी व सुरक्षित' : 'Safe & Non-Violent'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      KiddoZap contains zero toxic interactions, zero chat vulnerabilities, zero predatory microtransactions, and 100% wholesome challenges.
                    </p>
                  </div>
                </div>

                <h4 className="text-base font-bold text-white mt-4">
                  {lang === 'hi' ? 'हमारे गेम्स व पहेलियां' : 'Featured Game Categories'}
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-300">
                  <li><strong className="text-white">Reflex & Arcade:</strong> Kiddo Run Dash, Log Knife target master, Tap Hoop Shots, Spiral Jump, Sky Drift.</li>
                  <li><strong className="text-white">Brain & Logic:</strong> Memory Grid Match, Pattern Master, Shadow Puzzle, Priest & Devil River Riddle.</li>
                  <li><strong className="text-white">Math & Education:</strong> Balloon Pop Mental Math, Word Sparks vocabulary builder, Color Mixing Lab.</li>
                </ul>

                <p className="text-xs text-slate-400 pt-3 border-t border-slate-800">
                  Operated by the KiddoZap Team. Official domain: <code className="text-cyan-300">https://kiddozap.com</code>. Contact: <code className="text-cyan-300">support@kiddozap.com</code>.
                </p>
              </div>
            )}

            {/* PRIVACY POLICY TAB */}
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-300 flex items-center justify-center font-bold">
                    🔒
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">
                      {lang === 'hi' ? 'प्राइवेसी पॉलिसी (Privacy Policy)' : 'Privacy Policy'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Last Updated: October 2026
                    </p>
                  </div>
                </div>

                <p className="text-sm">
                  At <strong className="text-white">KiddoZap (kiddozap.com)</strong>, accessible from https://kiddozap.com, one of our main priorities is the privacy of our young visitors and their families. This Privacy Policy document contains types of information that is collected and recorded by KiddoZap and how we use it.
                </p>

                <h4 className="font-bold text-white">1. Information We Do NOT Collect</h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  KiddoZap does NOT require registration, account logins, phone numbers, home addresses, or real identities. Player names and star achievements are stored <strong className="text-white">strictly locally on your device (browser LocalStorage)</strong> and are never transmitted or sold to external servers.
                </p>

                <h4 className="font-bold text-white">2. Google AdSense & Third-Party Advertising</h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Google is a third-party vendor on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based on their visit to kiddozap.com and other sites on the internet.
                </p>
                <div className="p-3.5 bg-amber-950/40 rounded-xl border border-amber-500/40 text-xs text-amber-200">
                  <strong className="text-amber-300">Important for Families:</strong> KiddoZap is supported by advertising, and Google and its partners may use cookies. You can manage ad personalisation in Google Ads Settings, or decline the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-semibold">https://policies.google.com/technologies/ads</a>.
                </div>

                <h4 className="font-bold text-white">3. Log Files & Analytics</h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  KiddoZap follows standard logging procedures. These files log visitors when they visit websites (standard web server logs, including browser type, referring pages, timestamps). These logs are not linked to any personally identifiable information.
                </p>

                <h4 className="font-bold text-white">4. CCPA & GDPR Privacy Rights</h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Under the CCPA and GDPR, users have the right to request information, deletion, and portability. Since we do not harvest personal data or create user databases, no persistent private profiling occurs.
                </p>
              </div>
            )}

            {/* TERMS OF SERVICE TAB */}
            {activeTab === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-700/60 text-purple-300 flex items-center justify-center font-bold">
                    ⚖️
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">
                      {lang === 'hi' ? 'नियम और शर्तें (Terms of Service)' : 'Terms of Service'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      KiddoZap (kiddozap.com) Website Terms & Conditions
                    </p>
                  </div>
                </div>

                <p className="text-sm">
                  By accessing <strong className="text-white">kiddozap.com</strong>, you agree to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws.
                </p>

                <h4 className="font-bold text-white">1. Use License</h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Permission is granted to freely play, learn, and interact with the games on KiddoZap for personal, non-commercial educational and entertainment purposes. You may not decompile, reverse engineer, or re-sell the games without written authorization.
                </p>

                <h4 className="font-bold text-white">2. Free Access</h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  All games, brain puzzles, and quests on KiddoZap are 100% free to play. No subscription fees or paywalls are imposed on students or teachers.
                </p>

                <h4 className="font-bold text-white">3. Disclaimer</h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  All materials on KiddoZap are provided "as is". KiddoZap makes no warranties, expressed or implied, regarding continuous uptime or third-party internet connectivity.
                </p>
              </div>
            )}

            {/* COPPA CHILD SAFETY TAB */}
            {activeTab === 'coppa' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-700/60 text-rose-300 flex items-center justify-center font-bold">
                    🛡️
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">
                      {lang === 'hi' ? 'बच्चों की प्राइवेसी' : 'Children\'s Privacy'}
                    </h3>
                    <p className="text-xs text-rose-400 font-semibold">
                      Free games with no accounts or chat
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40">
                  <p className="text-xs sm:text-sm text-rose-200 font-medium">
                    KiddoZap does not knowingly collect personal information from children under 13, and it has no accounts, chat or messaging features. This page is a general overview of how we handle children's data, not legal advice.
                  </p>
                </div>

                <h4 className="font-bold text-white">Our Commitments to Parents & Guardians:</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300 list-disc list-inside">
                  <li><strong className="text-white">No Personal Identifiers:</strong> We do not ask children to submit their full names, email addresses, phone numbers, or photographs.</li>
                  <li><strong className="text-white">No Public Chatting:</strong> There are no chat rooms or messaging channels where strangers can contact children.</li>
                  <li><strong className="text-white">Advertising:</strong> KiddoZap is supported by Google AdSense ads, which may use cookies. We do not control exactly which ads are shown, so parents may wish to review their device ad settings.</li>
                  <li><strong className="text-white">Parental Requests:</strong> Parents may contact us at any time at <code className="text-cyan-300">support@kiddozap.com</code> with queries or requests.</li>
                </ul>
              </div>
            )}

            {/* CONTACT US TAB */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-700/60 text-sky-300 flex items-center justify-center font-bold">
                    ✉️
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">
                      {lang === 'hi' ? 'हमसे संपर्क करें (Contact Us)' : 'Contact Us'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Feedback, inquiries, developer support or game suggestions
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-300 mb-3">
                      Have questions about game features, classroom usage or privacy? Feel free to reach out to us directly:
                    </p>

                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                        <span className="font-bold text-white block">Official Website:</span>
                        <a href="https://kiddozap.com" target="_blank" rel="noreferrer" className="text-cyan-400 font-semibold hover:underline">
                          https://kiddozap.com
                        </a>
                      </div>

                      <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                        <span className="font-bold text-white block">Support Email:</span>
                        <a href="mailto:support@kiddozap.com" className="text-cyan-400 font-semibold hover:underline">
                          support@kiddozap.com
                        </a>
                      </div>

                      <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                        <span className="font-bold text-white block">Website Owner:</span>
                        <span className="text-slate-300">Ashish Pal</span>
                      </div>

                      <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                        <span className="font-bold text-white block">Platform Type:</span>
                        <span className="text-slate-300">Interactive Brain & Reflex Games for Kids & Teens (Under 18)</span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Form */}
                  <form onSubmit={handleContactSubmit} className="space-y-3 p-4 bg-slate-950/80 rounded-2xl border border-indigo-500/30">
                    <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      {lang === 'hi' ? 'संदेश भेजें' : 'Send us a Message'}
                    </h4>

                    {isSubmitted ? (
                      <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-200 text-center space-y-1">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                        <p className="font-bold text-sm text-white">Thank You!</p>
                        <p className="text-xs">Your message has been received. Our team will review it shortly.</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            {lang === 'hi' ? 'आपका नाम' : 'Your Name'}
                          </label>
                          <input
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="e.g. Ashish / Parent"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            {lang === 'hi' ? 'ईमेल पता' : 'Email Address'}
                          </label>
                          <input
                            type="email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            {lang === 'hi' ? 'संदेश' : 'Message'}
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            placeholder="Write your feedback, suggestion or inquiry here..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{lang === 'hi' ? 'संदेश भेजें' : 'Submit Inquiry'}</span>
                        </button>
                      </>
                    )}
                  </form>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="bg-slate-950 p-3 sm:p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Free Games for Kids • KiddoZap 2026</span>
            </div>
            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-lg transition-colors"
            >
              {lang === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
