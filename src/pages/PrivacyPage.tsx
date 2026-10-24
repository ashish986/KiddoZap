import React, { useEffect } from 'react';

interface PageProps {
  onGoHome: () => void;
}

export const PrivacyPage: React.FC<PageProps> = ({ onGoHome }) => {
  useEffect(() => {
    document.title = 'Privacy Policy & Family Safety Guarantees | KiddoZap';
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
        <span className="text-slate-200">Privacy Policy</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-bold mb-4">
          <span>🛡️</span> COPPA &amp; Family Privacy Compliant
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          KiddoZap Privacy Policy
        </h1>
        <p className="text-sm text-slate-400">
          Effective Date: October 24, 2026 &bull; Founder: Ashish Pal (<a href="mailto:ashishpal996@gmail.com" className="text-cyan-400 underline">ashishpal996@gmail.com</a>)
        </p>
      </div>

      {/* Privacy Guarantee Box */}
      <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 mb-8 text-emerald-100">
        <h2 className="text-lg font-black text-emerald-300 mb-2 flex items-center gap-2">
          <span>✅</span> Our Ironclad Privacy Pledge to Parents and Educators
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          KiddoZap is built specifically for young learners and classroom students. We do not require accounts, logins, passwords, email addresses, or phone numbers to play any of our 20 games.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold pt-2 border-t border-emerald-500/20">
          <div className="flex items-center gap-2">🚫 Zero User Accounts</div>
          <div className="flex items-center gap-2">🚫 Zero Personal Tracking</div>
          <div className="flex items-center gap-2">🚫 Zero Chat or Strangers</div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 text-sm leading-relaxed">
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">1. Identification of Platform and Data Controller</h2>
          <p className="mb-3">
            This Privacy Policy governs the online educational gaming portal <strong>KiddoZap</strong> (accessible via <a href="https://kiddozap.com" className="text-cyan-400 underline">https://kiddozap.com</a> and authorized mirror platforms).
          </p>
          <p>
            The platform is engineered and operated independently by <strong>Ashish Pal</strong>, located in New Delhi, India. If you have questions, feedback, or parental requests, contact us directly via email at <a href="mailto:support@kiddozap.com" className="text-cyan-400 underline">support@kiddozap.com</a> or <a href="mailto:ashishpal996@gmail.com" className="text-cyan-400 underline">ashishpal996@gmail.com</a>.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">2. Children&apos;s Online Privacy Protection Act (COPPA) Compliance</h2>
          <p className="mb-3">
            KiddoZap complies fully with the United States Children&apos;s Online Privacy Protection Act (COPPA, 15 U.S.C. 6501–6505) and the FTC COPPA Rule (16 CFR Part 312).
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-3">
            <li><strong>No Collection of Personal Identifiers:</strong> We do not knowingly collect, store, sell, or disclose personal identifying information (such as first and last name, home address, email, telephone number, or Social Security numbers) from children under the age of 13, or any users.</li>
            <li><strong>No Registration Required:</strong> All 20 browser games are immediately accessible without providing credentials or registering an account.</li>
            <li><strong>No Unmoderated Communication Channels:</strong> KiddoZap features zero public chatrooms, direct messaging features, forums, or user-generated profiles where personal data could be transmitted.</li>
          </ul>
        </section>

        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">3. Google AdSense, DoubleClick DART Cookies &amp; Advertising Policies</h2>
          <p className="mb-3">
            To provide free, universal access to educational games without subscription fees, KiddoZap displays advertisements served by <strong>Google AdSense</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-3">
            <li><strong>Third-Party Vendors:</strong> Google, as a third-party vendor, uses cookies to serve advertisements on our website.</li>
            <li><strong>DART Cookie:</strong> Google&apos;s use of the DoubleClick DART cookie enables it to serve ads to users based on their visit to our site and other sites on the Internet.</li>
            <li><strong>Family-Safe &amp; Non-Personalized Ad Restrictions:</strong> We configure our ad tags to restrict sensitive categories, predatory financial offers, violent media, and dating services. Ads served in school environments respect child-appropriate standards.</li>
            <li><strong>Opting Out:</strong> Users and parents may opt out of the use of the DART cookie by visiting the <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">Google Ad and Content Network Privacy Policy</a>. You can also customize your ad preferences via <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">Google Ad Settings</a>.</li>
          </ul>
        </section>

        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">4. Client-Side Browser Storage (LocalStorage)</h2>
          <p className="mb-3">
            KiddoZap utilizes standard modern browser technologies known as <strong>Web LocalStorage</strong> to enhance gameplay without identifying the individual player:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>High Scores:</strong> Your highest scores in games like <em>Math Sprint Blitz</em>, <em>Snake Neon</em>, and <em>Memory Match</em> are saved locally inside your browser cache.</li>
            <li><strong>Audio Preferences:</strong> Mute and volume toggles are remembered between sessions on your local browser.</li>
            <li><strong>No Server Transmission:</strong> This data remains strictly inside your computer or phone&apos;s browser sandbox and is never transmitted to our servers or third parties. Clearing your browser cookies/storage resets these local preferences.</li>
          </ul>
        </section>

        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">5. Family Educational Rights and Privacy Act (FERPA) Standards</h2>
          <p>
            When used in elementary, middle, or high school computer laboratories, KiddoZap acts as an anonymous curriculum supplement. Because we do not store student education records or personally identifiable student data, teachers and school districts can safely incorporate KiddoZap exercises into lesson plans without violating FERPA regulations.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">6. California Consumer Privacy Act (CCPA) and CPRA Rights</h2>
          <p className="mb-3">
            For visitors residing in California:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>We do not sell, rent, or lease your personal information.</li>
            <li>We do not share sensitive personal information with data brokers.</li>
            <li>Because we do not store customer records or personally identifiable profiles, there is no personal data dossier to delete or export.</li>
          </ul>
        </section>

        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">7. General Data Protection Regulation (GDPR) Notice</h2>
          <p className="mb-3">
            For individuals visiting from the European Economic Area (EEA) and the United Kingdom:
          </p>
          <p>
            KiddoZap processes anonymous technical data (such as anonymized IP headers for network packet routing and CDN security) strictly on the legal basis of legitimate interest to maintain system uptime, prevent DDoS attacks, and deliver interactive content.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-white mb-3">8. Contact Information for Parents &amp; Inquiries</h2>
          <p className="mb-3">
            If you have any questions or concerns regarding our privacy practices, or wish to submit feedback on parental controls:
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <p><strong>Platform:</strong> KiddoZap Online Gaming</p>
            <p><strong>Founder &amp; Data Officer:</strong> Ashish Pal</p>
            <p><strong>Direct Email:</strong> <a href="mailto:ashishpal996@gmail.com" className="text-cyan-400 underline">ashishpal996@gmail.com</a></p>
            <p><strong>Support Email:</strong> <a href="mailto:support@kiddozap.com" className="text-cyan-400 underline">support@kiddozap.com</a></p>
            <p><strong>Physical Region:</strong> New Delhi, India</p>
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
