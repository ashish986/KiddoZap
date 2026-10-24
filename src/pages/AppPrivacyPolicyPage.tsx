import React, { useEffect } from 'react';

export const AppPrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | KiddoZap';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#263244] font-sans antialiased text-left selection:bg-blue-100 selection:text-blue-900">
      <header className="bg-white py-6 px-4 text-center border-b border-[#e5eaf0]">
        <a
          href="https://kiddozap.com/"
          className="text-[#2563eb] no-underline text-[27px] font-bold hover:underline"
        >
          KiddoZap
        </a>
      </header>

      <main className="max-w-[850px] my-8 mx-auto p-6 sm:p-8 bg-white border border-[#e5eaf0] rounded-2xl shadow-sm leading-relaxed text-[15px]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#172554] mb-1">Privacy Policy</h1>
        <p className="text-[#64748b] text-sm mb-6">Last Updated: October 24, 2026</p>

        <p className="mb-4">
          KiddoZap is committed to protecting the
          privacy of children and families. This Privacy Policy explains
          how information may be handled when you use our website,
          mobile applications, and educational games.
        </p>

        <h2 className="text-xl font-bold text-[#1d4ed8] mt-7 mb-2">1. Information We Collect</h2>
        <p className="mb-3">
          KiddoZap provides educational and entertainment experiences
          for children. We do not require children to provide their
          names, email addresses, phone numbers, or other personal
          information to play basic games.
        </p>
        <p className="mb-3">
          Depending on the features and services enabled, limited
          technical information may be processed, including device
          information, diagnostic reports, crash data, advertising
          identifiers, and usage information.
        </p>
        <p className="mb-4">
          We collect or process information only as necessary for
          legitimate service purposes and as permitted by applicable law.
        </p>

        <h2 className="text-xl font-bold text-[#1d4ed8] mt-7 mb-2">2. Children&apos;s Privacy</h2>
        <p className="mb-3">
          KiddoZap is designed with children and families in mind.
          We aim to comply with applicable children&apos;s privacy laws
          and Google Play&apos;s Families Policy.
        </p>
        <p className="mb-3">
          We do not knowingly require children to create accounts or
          submit personal information to access basic learning games.
          If we learn that personal information has been collected
          inappropriately from a child, we will take reasonable steps
          to investigate and address the issue, including deletion
          where appropriate.
        </p>
        <p className="mb-4">
          Parents and guardians may contact us with questions or
          requests concerning children&apos;s privacy.
        </p>

        <h2 className="text-xl font-bold text-[#1d4ed8] mt-7 mb-2">3. Advertising and Google AdMob</h2>
        <p className="mb-3">
          Some versions of KiddoZap may display advertisements to
          support free games and educational content.
        </p>
        <p className="mb-3">
          If Google AdMob or another advertising provider is used,
          that provider may process certain device or usage information
          to deliver, measure, and maintain advertisements, subject
          to its privacy policy and applicable law.
        </p>
        <p className="mb-3">
          For apps intended for children, we will configure advertising
          services and use eligible advertising SDKs in accordance with
          applicable Google Play Families requirements. Where required,
          appropriate child-directed treatment, restrictions on
          personalized advertising, and other safeguards will be applied.
        </p>
        <p className="mb-4">
          Google Privacy Policy:{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2563eb] underline break-all"
          >
            https://policies.google.com/privacy
          </a>
        </p>

        <h2 className="text-xl font-bold text-[#1d4ed8] mt-7 mb-2">4. Cookies and Local Storage</h2>
        <p className="mb-3">
          Our website may use cookies, browser storage, or similar
          technologies to remember preferences, maintain functionality,
          and understand website performance.
        </p>
        <p className="mb-4">
          Some games may store scores, progress, or settings locally
          on your device or in your browser. The Android app may store
          information differently depending on its implementation.
        </p>

        <h2 className="text-xl font-bold text-[#1d4ed8] mt-7 mb-2">5. Third-Party Services</h2>
        <p className="mb-3">
          KiddoZap may use third-party services for hosting, advertising,
          analytics, crash reporting, or other app functionality.
          These providers may process information as necessary to
          provide their services and according to their own privacy
          policies.
        </p>
        <p className="mb-4">
          We do not control the independent privacy practices of
          third-party providers. We encourage parents and guardians
          to review the relevant providers&apos; privacy policies.
        </p>

        <h2 className="text-xl font-bold text-[#1d4ed8] mt-7 mb-2">6. Data Security and Retention</h2>
        <p className="mb-3">
          We take reasonable measures to protect information processed
          through KiddoZap. However, no method of electronic storage
          or transmission can be guaranteed to be completely secure.
        </p>
        <p className="mb-4">
          Information is retained only for as long as reasonably
          necessary for the purposes described in this policy,
          subject to applicable legal, operational, and security
          requirements. Third-party providers may have their own
          retention practices.
        </p>

        <h2 className="text-xl font-bold text-[#1d4ed8] mt-7 mb-2">7. Sharing of Information</h2>
        <p className="mb-3">
          We do not sell children&apos;s personal information.
          Information may be processed by service providers when
          necessary to operate, secure, or improve KiddoZap, provide
          advertisements, comply with legal obligations, or protect
          our users and services.
        </p>
        <p className="mb-4">
          Any such processing will be subject to applicable law and
          safeguards required for children&apos;s services.
        </p>

        <h2 className="text-xl font-bold text-[#1d4ed8] mt-7 mb-2">8. Parents&apos; and Guardians&apos; Rights</h2>
        <p className="mb-4">
          Parents and guardians may contact us with questions about
          information that may have been collected through KiddoZap.
          Where applicable law provides rights to access, correct,
          or delete personal information, we will review and respond
          to requests in accordance with that law.
        </p>

        <h2 className="text-xl font-bold text-[#1d4ed8] mt-7 mb-2">9. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy when our services,
          technology, or legal requirements change. Updates will be
          published on this page with a revised &quot;Last Updated&quot; date.
          We encourage parents and guardians to review this page
          periodically.
        </p>

        <h2 className="text-xl font-bold text-[#1d4ed8] mt-7 mb-2">10. Contact Us</h2>
        <p className="mb-2">
          If you have questions, concerns, or requests about this
          Privacy Policy, please contact us:
        </p>
        <p className="mb-1">
          <strong>Website:</strong>{' '}
          <a href="https://kiddozap.com/" className="text-[#2563eb] underline">
            https://kiddozap.com/
          </a>
        </p>
        <p>
          <strong>Email:</strong>{' '}
          <a href="mailto:support@kiddozap.com" className="text-[#2563eb] underline">
            support@kiddozap.com
          </a>
        </p>
      </main>

      <footer className="text-center py-6 px-4 text-[#64748b] text-sm">
        &copy; 2026 KiddoZap. All rights reserved.
      </footer>
    </div>
  );
};
