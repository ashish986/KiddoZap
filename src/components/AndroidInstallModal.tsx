import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, Download, Check, Sparkles, ArrowRight, ExternalLink, Code2, Rocket, Globe, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import { KiddoZapLogo } from './KiddoZapLogo';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenComposeCode: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenComposeCode,
}) => {
  const [activeTab, setActiveTab] = useState<'server' | 'publish' | 'install'>('server');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    sounds.playPop(1.2);
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl p-5 sm:p-6 max-w-xl w-full border-4 border-amber-300 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              sounds.playPop(0.9);
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <KiddoZapLogo size={48} variant="badge" className="shrink-0" />
            <div>
              <h3 className="text-xl font-black text-slate-800 font-display">
                {lang === 'hi' ? 'KiddoZap ऐप पब्लिश और इंस्टॉल गाइड' : 'KiddoZap Publish & Install'}
              </h3>
              <p className="text-xs font-bold text-amber-700">
                {lang === 'hi'
                  ? 'Play Store और Web पर लाइव करने के आसान चरण'
                  : 'Steps to publish on Google Play Store & Web'}
              </p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-2xl mb-4 text-[11px] font-black">
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('server');
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === 'server'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'hi' ? 'वेब सर्वर' : 'Web Server'}</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('publish');
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === 'publish'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Rocket className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'hi' ? 'Play Store' : 'Play Store'}</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('install');
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === 'install'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
              <span>{lang === 'hi' ? 'फ़ोन में इंस्टॉल' : 'Install'}</span>
            </button>
          </div>

          {activeTab === 'server' && (
            <div className="space-y-3 text-slate-700 text-xs">
              {/* Option 1: 1-Click Free Hosting (Vercel / Netlify / Render) */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[11px] flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-extrabold text-slate-800 text-sm">
                    {lang === 'hi' ? 'Vercel / Netlify (सबसे आसान & 100% मुफ़्त)' : 'Vercel / Netlify (Recommended & Free)'}
                  </h4>
                </div>
                <p className="text-slate-600 leading-relaxed pl-7">
                  {lang === 'hi'
                    ? '1. AI Studio से कोड GitHub पर Export करें (ऊपर Settings/Export से)।'
                    : '1. Export code to GitHub from the top settings menu.'}
                </p>
                <p className="text-slate-600 leading-relaxed pl-7">
                  {lang === 'hi'
                    ? '2. Vercel.com या Netlify.com पर लॉगिन करके "Import Repository" चुनें।'
                    : '2. Log into Vercel or Netlify and click "Import Project".'}
                </p>
                <p className="text-slate-600 leading-relaxed pl-7">
                  {lang === 'hi'
                    ? '3. "Deploy" पर क्लिक करें — 1 मिनट में आपकी वेबसाइट कस्टम डोमेन (जैसे mykidsgames.com) पर लाइव हो जाएगी!'
                    : '3. Click "Deploy" — your site is live instantly with free SSL and custom domain!'}
                </p>
              </div>

              {/* Option 2: cPanel / Shared Hosting (Hostinger, GoDaddy) */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-black text-[11px] flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-extrabold text-slate-800 text-sm">
                    {lang === 'hi' ? 'cPanel / Hostinger / GoDaddy सर्वर पर' : 'cPanel / Shared Hosting'}
                  </h4>
                </div>
                <p className="text-slate-600 leading-relaxed pl-7">
                  {lang === 'hi'
                    ? '1. अपने कंप्यूटर में `npm run build` कमांड चलाएं (इससे `dist` फ़ोल्डर तैयार होता है)।'
                    : '1. Run `npm run build` on your computer to produce the `dist` folder.'}
                </p>
                <p className="text-slate-600 leading-relaxed pl-7">
                  {lang === 'hi'
                    ? '2. cPanel के File Manager में `public_html` में जाएं।'
                    : '2. Open cPanel File Manager and go to `public_html`.'}
                </p>
                <p className="text-slate-600 leading-relaxed pl-7">
                  {lang === 'hi'
                    ? '3. `dist` फ़ोल्डर की सभी फाइलों (index.html, assets, manifest.json) को अपलोड कर दें!'
                    : '3. Upload all files inside `dist/` directly to `public_html`!'}
                </p>
              </div>

              {/* Option 3: VPS / Nginx Server */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-white font-black text-[11px] flex items-center justify-center">
                    3
                  </span>
                  <h4 className="font-extrabold text-slate-800 text-sm">
                    {lang === 'hi' ? 'VPS सर्वर (Ubuntu + Nginx)' : 'Linux VPS (Nginx / Apache)'}
                  </h4>
                </div>
                <div className="pl-7 text-[11px] font-mono bg-slate-900 text-slate-100 p-2.5 rounded-xl space-y-1 overflow-x-auto">
                  <p className="text-slate-400"># Nginx config inside /etc/nginx/sites-available/default:</p>
                  <p>location / &#123;</p>
                  <p className="pl-4">root /var/www/kids-games/dist;</p>
                  <p className="pl-4">try_files $uri $uri/ /index.html;</p>
                  <p>&#125;</p>
                </div>
              </div>

              {/* Option 4: AI Studio Cloud Run */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <h5 className="font-extrabold text-emerald-900 text-xs">
                    {lang === 'hi' ? 'Google Cloud Run (Direct AI Studio Deploy)' : 'Deploy directly to Google Cloud'}
                  </h5>
                  <p className="text-[11px] text-emerald-700">
                    {lang === 'hi' ? 'ऊपर मेन्यू में "Deploy" बटन दबाकर तुरंत Google Cloud पर होस्ट करें।' : 'Click "Deploy" in AI Studio top menu.'}
                  </p>
                </div>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-1 rounded-lg">
                  1-Click
                </span>
              </div>
            </div>
          )}

          {activeTab === 'publish' && (
            <div className="space-y-3.5 text-slate-700 text-xs">
              {/* Step 1 */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-black text-[11px] flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-extrabold text-slate-800 text-sm">
                    {lang === 'hi' ? 'तरीका 1: 5 मिनट में Play Store APK/AAB बनाएं (अनुशंसित)' : 'Method 1: Instant Play Store APK/AAB via PWABuilder'}
                  </h4>
                </div>
                <p className="text-slate-600 leading-relaxed pl-7">
                  {lang === 'hi'
                    ? 'हमने इस ऐप में manifest.json और Android आइकन पहले ही जोड़ दिया है। आप PWABuilder.com पर जाकर इस ऐप का URL डालेंगे, तो वह सीधे Google Play Store के लिए हस्ताक्षरित AAB (Android App Bundle) फ़ाइल जनरेट कर देगा!'
                    : 'Because PWA manifest and icons are configured, you can enter your app URL on PWABuilder.com, and it automatically generates a ready-to-upload Google Play Store AAB package!'}
                </p>
                <div className="mt-2 pl-7 flex items-center gap-2 text-[11px] font-bold text-amber-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'hi' ? 'Google Play Store 100% अनुपालित (Compliant)' : '100% Google Play Store Compliant'}</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-black text-[11px] flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-extrabold text-slate-800 text-sm">
                    {lang === 'hi' ? 'तरीका 2: Android Studio (Kotlin Jetpack Compose)' : 'Method 2: Native Android Studio Project'}
                  </h4>
                </div>
                <p className="text-slate-600 leading-relaxed pl-7">
                  {lang === 'hi'
                    ? 'यदि आप शुद्ध नेटिव कोड से APK बनाना चाहते हैं, तो ऐप के "Jetpack Compose" टैब से Kotlin कोड कॉपी करें, Android Studio में पेस्ट करें और Build > Generate Signed Bundle से रिलीज बनाएं।'
                    : 'If you prefer a pure native build, copy the Kotlin code from our Jetpack Compose tab, paste it into Android Studio, and use Build > Generate Signed Bundle.'}
                </p>
                <div className="mt-2.5 pl-7">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      onClose();
                      onOpenComposeCode();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs shadow-xs active:scale-95 transition-all"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'Kotlin कोड देखें' : 'View Kotlin Code'}</span>
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center">
                    3
                  </span>
                  <h4 className="font-extrabold text-slate-800 text-sm">
                    {lang === 'hi' ? 'Google Play Console पर पब्लिश करें' : 'Upload to Google Play Console'}
                  </h4>
                </div>
                <ol className="list-decimal list-inside text-slate-600 leading-relaxed pl-7 space-y-1 font-medium">
                  <li>{lang === 'hi' ? 'play.google.com/console पर डेवलपर अकाउंट में लॉगिन करें।' : 'Log in to play.google.com/console.'}</li>
                  <li>{lang === 'hi' ? '"Create App" पर क्लिक करके "KiddoZap" नाम दें।' : 'Click "Create App" and name it "KiddoZap".'}</li>
                  <li>{lang === 'hi' ? 'अपनी AAB फाइल अपलोड करें, स्टोर लिस्टिंग भरें और "Send for Review" दबाएं!' : 'Upload your AAB file, complete the store listing, and submit for review!'}</li>
                </ol>
              </div>

              {/* Web Share Banner */}
              <div className="bg-slate-100 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-600" />
                  <span className="text-[11px] font-bold text-slate-700">
                    {lang === 'hi' ? 'तुरंत दोस्तों व परिवार को लिंक भेजें:' : 'Share live link right now:'}
                  </span>
                </div>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-black">
                  AI Studio Share
                </span>
              </div>
            </div>
          )}

          {activeTab === 'install' && (
            <div>
              {/* Explanation 1: PWA (Install Directly on Android Phone) */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border-2 border-amber-200 mb-4 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <h4 className="text-sm font-black text-slate-800">
                    {lang === 'hi' ? 'मोबाइल पर ऐप की तरह इंस्टॉल करें (PWA)' : 'Install directly on Phone (PWA)'}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 font-medium mb-3 leading-relaxed">
                  {lang === 'hi'
                    ? 'प्ले स्टोर के बिना भी आप इसे अपने एंड्रॉयड फोन में असली ऐप की तरह चला सकते हैं। यह फुल स्क्रीन में बिना ब्राउज़र बार के एक ऐप आइकन के साथ खुलेगा!'
                    : 'You can install this directly onto your Android phone without Play Store. It launches full-screen from your home screen with its own app icon!'}
                </p>

                {deferredPrompt ? (
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black rounded-xl text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'अभी फोन में इंस्टॉल करें' : 'Install App Now'}</span>
                  </button>
                ) : (
                  <div className="bg-white/80 rounded-xl p-2.5 border border-amber-200/80 text-[11px] text-slate-700 font-bold space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-800">
                      <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                      <span>{lang === 'hi' ? 'एंड्रॉयड फोन में इंस्टॉल करने का तरीका:' : 'How to install on Android:'}</span>
                    </div>
                    <p className="font-normal text-slate-600">
                      {lang === 'hi'
                        ? '1. Chrome ब्राउज़र में ऊपर दाईं ओर तीन डॉट्स (⋮) पर टैप करें।'
                        : '1. In Chrome, tap the 3 dots (⋮) menu in top-right.'}
                    </p>
                    <p className="font-normal text-slate-600">
                      {lang === 'hi'
                        ? '2. "Install App" या "Add to Home screen" चुनें।'
                        : '2. Tap "Install App" or "Add to Home screen".'}
                    </p>
                    <p className="font-normal text-slate-600">
                      {lang === 'hi'
                        ? '3. आपके फोन की होम स्क्रीन पर "KiddoZap" ऐप आइकन आ जाएगा!'
                        : '3. An app icon "KiddoZap" will be added to your home screen!'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

