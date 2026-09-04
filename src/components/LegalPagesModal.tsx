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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-amber-200 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Top Bar with Navigation Tabs */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <KiddoZapLogo size={42} variant="badge" className="shrink-0" />
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight leading-tight flex items-center gap-2">
                  KiddoZap Legal & Information Hub
                </h2>
                <p className="text-xs text-amber-100 font-medium">
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
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors shadow-xs"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex items-center gap-1.5 p-2 bg-amber-50/80 border-b border-amber-200 overflow-x-auto shrink-0">
            {[
              { id: 'about', label: lang === 'hi' ? 'हमारे बारे में' : 'About Us', icon: Info },
              { id: 'privacy', label: lang === 'hi' ? 'प्राइवेसी पॉलिसी' : 'Privacy Policy', icon: Lock },
              { id: 'terms', label: lang === 'hi' ? 'नियम व शर्तें' : 'Terms of Service', icon: FileText },
              { id: 'coppa', label: lang === 'hi' ? 'बाल सुरक्षा (COPPA)' : 'Child Safety (COPPA)', icon: ShieldCheck },
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
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-102'
                      : 'bg-white text-slate-700 hover:bg-amber-100/70 border border-amber-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-600'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
            
            {/* ABOUT US TAB */}
            {activeTab === 'about' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    ℹ️
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">
                      {lang === 'hi' ? 'KiddoZap के बारे में' : 'About KiddoZap'}
                    </h3>
                    <p className="text-xs text-amber-700 font-semibold">
                      https://kiddozap.com • Think • Play • Zap!
                    </p>
                  </div>
                </div>

                <p>
                  Welcome to <strong>KiddoZap (kiddozap.com)</strong>, a family-friendly educational gaming and brain training platform thoughtfully crafted for children, students (Class 1 to 12), and teens below 18 years of age.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 my-4">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      {lang === 'hi' ? 'हमारा उद्देश्य' : 'Our Mission'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600">
                      To empower young learners with cognitive brain training, logical reasoning, reflexes, and memory boosters through safe, interactive, non-violent HTML5 games.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                    <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-1">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      {lang === 'hi' ? 'बाल-हितैषी व सुरक्षित' : 'Safe & Non-Violent'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600">
                      KiddoZap contains zero toxic interactions, zero chat vulnerabilities, zero predatory microtransactions, and 100% wholesome challenges.
                    </p>
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-800 mt-4">
                  {lang === 'hi' ? 'हमारे गेम्स व पहेलियां' : 'Featured Game Categories'}
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                  <li><strong>Reflex & Arcade:</strong> Kiddo Run Dash, Knife Hit target master, Tap Dunk Shots, Helix Jump, Drift Boss.</li>
                  <li><strong>Brain & Logic:</strong> Memory Grid Match, Pattern Master, Shadow Puzzle, Priest & Devil River Riddle.</li>
                  <li><strong>Math & Education:</strong> Balloon Pop Mental Math, Word Sparks vocabulary builder, Color Mixing Lab.</li>
                </ul>

                <p className="text-xs text-slate-500 pt-3 border-t border-slate-100">
                  Operated by the KiddoZap Team. Official domain: <code>https://kiddozap.com</code>. Contact: <code>support@kiddozap.com</code>.
                </p>
              </div>
            )}

            {/* PRIVACY POLICY TAB */}
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold">
                    🔒
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">
                      {lang === 'hi' ? 'प्राइवेसी पॉलिसी (Privacy Policy)' : 'Privacy Policy'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Last Updated: September 2026 • Compliant with Google AdSense & COPPA
                    </p>
                  </div>
                </div>

                <p className="text-sm">
                  At <strong>KiddoZap (kiddozap.com)</strong>, accessible from https://kiddozap.com, one of our main priorities is the privacy of our young visitors and their families. This Privacy Policy document contains types of information that is collected and recorded by KiddoZap and how we use it.
                </p>

                <h4 className="font-bold text-slate-800">1. Information We Do NOT Collect</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  KiddoZap does NOT require registration, account logins, phone numbers, home addresses, or real identities. Player names and star achievements are stored <strong>strictly locally on your device (browser LocalStorage)</strong> and are never transmitted or sold to external servers.
                </p>

                <h4 className="font-bold text-slate-800">2. Google AdSense & Third-Party Advertising</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Google is a third-party vendor on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based on their visit to kiddozap.com and other sites on the internet.
                </p>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <strong>Important for Families:</strong> As a platform designed for children and learners below 18, we adhere to strict non-personalized and contextual advertising policies in accordance with Google Families Policy and COPPA. Visitors may choose to decline the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" className="text-amber-700 underline font-semibold">https://policies.google.com/technologies/ads</a>.
                </div>

                <h4 className="font-bold text-slate-800">3. Log Files & Analytics</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  KiddoZap follows standard logging procedures. These files log visitors when they visit websites (standard web server logs, including browser type, referring pages, timestamps). These logs are not linked to any personally identifiable information.
                </p>

                <h4 className="font-bold text-slate-800">4. CCPA & GDPR Privacy Rights</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Under the CCPA and GDPR, users have the right to request information, deletion, and portability. Since we do not harvest personal data or create user databases, no persistent private profiling occurs.
                </p>
              </div>
            )}

            {/* TERMS OF SERVICE TAB */}
            {activeTab === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    ⚖️
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">
                      {lang === 'hi' ? 'नियम और शर्तें (Terms of Service)' : 'Terms of Service'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      KiddoZap (kiddozap.com) Website Terms & Conditions
                    </p>
                  </div>
                </div>

                <p className="text-sm">
                  By accessing <strong>kiddozap.com</strong>, you agree to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws.
                </p>

                <h4 className="font-bold text-slate-800">1. Use License</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Permission is granted to freely play, learn, and interact with the games on KiddoZap for personal, non-commercial educational and entertainment purposes. You may not decompile, reverse engineer, or re-sell the games without written authorization.
                </p>

                <h4 className="font-bold text-slate-800">2. Free Access & Educational Guarantee</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  All games, brain puzzles, and quests on KiddoZap are 100% free to play. No subscription fees or paywalls are imposed on students or teachers.
                </p>

                <h4 className="font-bold text-slate-800">3. Disclaimer</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  All materials on KiddoZap are provided "as is". KiddoZap makes no warranties, expressed or implied, regarding continuous uptime or third-party internet connectivity.
                </p>
              </div>
            )}

            {/* COPPA CHILD SAFETY TAB */}
            {activeTab === 'coppa' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    🛡️
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">
                      {lang === 'hi' ? 'बाल सुरक्षा नीति (COPPA & Child Protection)' : 'Children\'s Privacy & COPPA Compliance'}
                    </h3>
                    <p className="text-xs text-rose-700 font-semibold">
                      Committed to safe digital spaces for kids and teens under 18
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <p className="text-xs sm:text-sm text-rose-950 font-medium">
                    KiddoZap strictly complies with the <strong>Children's Online Privacy Protection Act (COPPA)</strong> and international child safety standards.
                  </p>
                </div>

                <h4 className="font-bold text-slate-800">Our Commitments to Parents & Guardians:</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
                  <li><strong>No Personal Identifiers:</strong> We do not ask children to submit their full names, email addresses, phone numbers, or photographs.</li>
                  <li><strong>Zero Public Chatting:</strong> There are no unmoderated chat rooms or messaging channels where strangers can contact children.</li>
                  <li><strong>Family-Safe Advertising:</strong> Any advertisement served on KiddoZap via Google AdSense must adhere to Family Safe categories. Sensitive ad categories are strictly blocked.</li>
                  <li><strong>Parental Requests:</strong> Parents may contact us at any time at <code>support@kiddozap.com</code> with queries or requests.</li>
                </ul>
              </div>
            )}

            {/* CONTACT US TAB */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    ✉️
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">
                      {lang === 'hi' ? 'हमसे संपर्क करें (Contact Us)' : 'Contact Us'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Feedback, inquiries, developer support or game suggestions
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600 mb-3">
                      Have questions regarding game features, classroom usage, or AdSense compliance? Feel free to reach out to our team directly:
                    </p>

                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700 block">Official Website:</span>
                        <a href="https://kiddozap.com" target="_blank" rel="noreferrer" className="text-amber-600 font-semibold hover:underline">
                          https://kiddozap.com
                        </a>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700 block">Support Email:</span>
                        <a href="mailto:support@kiddozap.com" className="text-amber-600 font-semibold hover:underline">
                          support@kiddozap.com
                        </a>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700 block">Platform Type:</span>
                        <span className="text-slate-600">Interactive Brain & Reflex Games for Kids & Teens (Under 18)</span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Form */}
                  <form onSubmit={handleContactSubmit} className="space-y-3 p-4 bg-amber-50/70 rounded-2xl border border-amber-200">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-amber-600" />
                      {lang === 'hi' ? 'संदेश भेजें' : 'Send us a Message'}
                    </h4>

                    {isSubmitted ? (
                      <div className="p-4 bg-green-100 border border-green-300 rounded-xl text-green-800 text-center space-y-1">
                        <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto" />
                        <p className="font-bold text-sm">Thank You!</p>
                        <p className="text-xs">Your message has been received. Our team will review it shortly.</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {lang === 'hi' ? 'आपका नाम' : 'Your Name'}
                          </label>
                          <input
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="e.g. Ashish / Parent"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {lang === 'hi' ? 'ईमेल पता' : 'Email Address'}
                          </label>
                          <input
                            type="email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {lang === 'hi' ? 'संदेश' : 'Message'}
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            placeholder="Write your feedback, suggestion or inquiry here..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
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
          <div className="bg-slate-50 p-3 sm:p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Safe Kids Gaming Verified • KiddoZap 2026</span>
            </div>
            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
            >
              {lang === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
