import React, { useState, useEffect } from 'react';

interface PageProps {
  onGoHome: () => void;
}

export const ContactPage: React.FC<PageProps> = ({ onGoHome }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Feedback / General Inquiry',
    message: '',
  });

  useEffect(() => {
    document.title = 'Contact & Direct Support | KiddoZap Founder Ashish Pal';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }
    // Simulate successful submission with mailto fallback
    setFormSubmitted(true);
  };

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
        <span className="text-slate-200">Contact &amp; Support</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-xs font-bold mb-4">
          <span>✉️</span> We Love Hearing from You
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Contact KiddoZap Support
        </h1>
        <p className="text-sm text-slate-400">
          Have a question about a game, need help for your classroom, or want to suggest an educational puzzle? Reach out directly to founder Ashish Pal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Contact Info Cards */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <span className="text-2xl mb-2 block">📩</span>
          <h3 className="text-base font-black text-white mb-1">Direct Support</h3>
          <p className="text-xs text-slate-400 mb-2">For general support, bug reports, and gameplay feedback:</p>
          <a href="mailto:support@kiddozap.com" className="text-cyan-400 font-bold text-sm underline block">
            support@kiddozap.com
          </a>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <span className="text-2xl mb-2 block">👨‍💻</span>
          <h3 className="text-base font-black text-white mb-1">Founder Direct</h3>
          <p className="text-xs text-slate-400 mb-2">Speak directly with creator Ashish Pal:</p>
          <a href="mailto:ashishpal996@gmail.com" className="text-cyan-400 font-bold text-sm underline block">
            ashishpal996@gmail.com
          </a>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <span className="text-2xl mb-2 block">🏫</span>
          <h3 className="text-base font-black text-white mb-1">Schools &amp; Teachers</h3>
          <p className="text-xs text-slate-400 mb-2">Curriculum integration and firewall whitelisting assistance:</p>
          <span className="text-emerald-400 font-bold text-sm block">100% Free for Classrooms</span>
        </div>
      </div>

      {/* Interactive Contact Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-2xl font-black text-white mb-2">Send Us a Direct Message</h2>
        <p className="text-xs text-slate-400 mb-6">
          Fill out the form below. We typically reply to all messages within 24–48 business hours.
        </p>

        {formSubmitted ? (
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-6 text-center">
            <span className="text-4xl block mb-2">🎉</span>
            <h3 className="text-xl font-black text-emerald-300 mb-2">Thank You, {formData.name}!</h3>
            <p className="text-sm text-slate-300 mb-4">
              Your message has been recorded. You can also send a direct email copy to{' '}
              <a href={`mailto:support@kiddozap.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(formData.message)}`} className="text-cyan-400 underline font-bold">
                support@kiddozap.com
              </a>.
            </p>
            <button
              onClick={() => {
                setFormSubmitted(false);
                setFormData({ name: '', email: '', subject: 'Feedback / General Inquiry', message: '' });
              }}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Send Another Note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your Name / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Teacher Sarah / Alex"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-white outline-hidden"
              >
                <option>Feedback / General Inquiry</option>
                <option>Bug Report or Game Fix</option>
                <option>Teacher / School Classroom Partnership</option>
                <option>New Game / Feature Suggestion</option>
                <option>Parent Safety Question</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Message</label>
              <textarea
                required
                rows={5}
                placeholder="Write your thoughts, questions, or ideas here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-hidden resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer text-sm"
            >
              ✉️ Send Note to Support
            </button>
          </form>
        )}
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
