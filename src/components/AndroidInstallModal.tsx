import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Smartphone,
  Download,
  Check,
  Sparkles,
  Monitor,
  Apple,
  Zap,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import { KiddoZapLogo } from './KiddoZapLogo';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenComposeCode?: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [deviceTab, setDeviceTab] = useState<'android' | 'ios' | 'pc'>('android');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Detect if already installed / standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Auto-detect device platform
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(userAgent)) {
        setDeviceTab('ios');
      } else if (/android/.test(userAgent)) {
        setDeviceTab('android');
      } else {
        setDeviceTab('pc');
      }
    }

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    sounds.playPop(1.2);
    if (!deferredPrompt) {
      // Fallback alert/guidance if native prompt not ready
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        sounds.playFanfare();
        setInstallSuccess(true);
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } catch {
      // Browser didn't allow prompt
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full border-4 border-amber-300 shadow-2xl relative max-h-[92vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              sounds.playPop(0.9);
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* App Badge & Header */}
          <div className="flex items-center gap-3 mb-5">
            <KiddoZapLogo size={52} variant="badge" className="shrink-0 drop-shadow-sm" />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xl font-black text-slate-800 font-display">
                  {lang === 'hi' ? 'KiddoZap ऐप इंस्टॉल करें' : 'Install KiddoZap App'}
                </h3>
                <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  FREE
                </span>
              </div>
              <p className="text-xs font-bold text-amber-700">
                {lang === 'hi'
                  ? 'सीधे अपने फ़ोन या ब्राउज़र में इंस्टॉल करें (बिना किसी झंझट)'
                  : 'Install directly on your phone or browser (1-Tap Play)'}
              </p>
            </div>
          </div>

          {/* Direct 1-Click Install Button (Shown prominently) */}
          {installSuccess || isInstalled ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 mb-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-emerald-900 text-sm">
                  {lang === 'hi' ? 'KiddoZap पहले से इंस्टॉल है! 🎉' : 'KiddoZap is Installed! 🎉'}
                </h4>
                <p className="text-xs text-emerald-700">
                  {lang === 'hi'
                    ? 'आप इसे अपने फ़ोन की होम स्क्रीन या ऐप लिस्ट से सीधे खोल सकते हैं।'
                    : 'You can launch it directly from your home screen or apps list anytime.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 p-4 sm:p-5 rounded-2xl text-white shadow-lg shadow-amber-200/60 mb-5 border-2 border-amber-300">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="text-base font-black flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-yellow-200" />
                    <span>
                      {lang === 'hi' ? '1-क्लिक डायरेक्ट ऐप इंस्टॉल' : '1-Click Direct App Install'}
                    </span>
                  </h4>
                  <p className="text-xs text-amber-50/90 font-medium mt-0.5">
                    {lang === 'hi'
                      ? 'फुल स्क्रीन, बिना लोडिंग इंतज़ार और आसान होम स्क्रीन एक्सेस।'
                      : 'Fast fullscreen play, instant load, no app store download required.'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleDirectInstall}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-amber-50 text-slate-900 font-black text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 transition-all"
              >
                <Download className="w-4 h-4 text-orange-600 animate-bounce" />
                <span>
                  {deferredPrompt
                    ? lang === 'hi'
                      ? '📲 अभी KiddoZap ऐप इंस्टॉल करें'
                      : '📲 Install KiddoZap App Now'
                    : lang === 'hi'
                      ? '📲 फ़ोन की होम स्क्रीन पर जोड़ें'
                      : '📲 Add to Home Screen'}
                </span>
              </button>
            </div>
          )}

          {/* Platform Selector Tabs */}
          <div className="mb-4">
            <p className="text-xs font-bold text-slate-500 mb-2">
              {lang === 'hi'
                ? 'अपने डिवाइस के अनुसार आसान तरीक़ा देखें:'
                : 'Select your device for quick installation steps:'}
            </p>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-black">
              <button
                onClick={() => {
                  sounds.playPop();
                  setDeviceTab('android');
                }}
                className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  deviceTab === 'android'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Android / Chrome</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setDeviceTab('ios');
                }}
                className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  deviceTab === 'ios'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Apple className="w-3.5 h-3.5 text-slate-800" />
                <span>iPhone / iPad</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setDeviceTab('pc');
                }}
                className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  deviceTab === 'pc'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 text-blue-600" />
                <span>PC / Laptop</span>
              </button>
            </div>
          </div>

          {/* Step-by-Step Device Instructions */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-3 mb-5">
            {deviceTab === 'android' && (
              <>
                <h5 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>
                    {lang === 'hi'
                      ? 'Android फ़ोन (Chrome / Samsung Internet):'
                      : 'Android Phone (Chrome / Samsung Internet):'}
                  </span>
                </h5>

                <div className="space-y-2 text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <p className="leading-relaxed">
                      {lang === 'hi'
                        ? 'अपने ब्राउज़र में ऊपर दाईं ओर 3 डॉट्स (⋮) मेन्यू पर टैप करें।'
                        : 'Tap the 3 dots menu (⋮) in the top-right corner of Chrome.'}
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <p className="leading-relaxed">
                      {lang === 'hi' ? (
                        <>
                          <strong className="text-slate-900">"ऐप इंस्टॉल करें"</strong> या{' '}
                          <strong className="text-slate-900">"होम स्क्रीन पर जोड़ें"</strong> (Add
                          to Home screen) पर टैप करें।
                        </>
                      ) : (
                        <>
                          Tap <strong className="text-slate-900">"Install App"</strong> or{' '}
                          <strong className="text-slate-900">"Add to Home screen"</strong>.
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <p className="leading-relaxed">
                      {lang === 'hi'
                        ? 'KiddoZap का ऐप आइकन आपके मोबाइल की होम स्क्रीन पर आ जाएगा — सीधे खेलें!'
                        : 'The KiddoZap icon is added to your mobile home screen. Ready to play!'}
                    </p>
                  </div>
                </div>
              </>
            )}

            {deviceTab === 'ios' && (
              <>
                <h5 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <Apple className="w-4 h-4 text-slate-800" />
                  <span>
                    {lang === 'hi' ? 'Apple iPhone / iPad (Safari):' : 'Apple iPhone / iPad (Safari):'}
                  </span>
                </h5>

                <div className="space-y-2 text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <p className="leading-relaxed">
                      {lang === 'hi'
                        ? 'सफारी ब्राउज़र में नीचे "Share" बटन (तीर वाला आइकन ⎋) दबाएं।'
                        : 'Tap the "Share" button (icon with up arrow ⎋) at the bottom of Safari.'}
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <p className="leading-relaxed">
                      {lang === 'hi' ? (
                        <>
                          नीचे स्क्रॉल करें और{' '}
                          <strong className="text-slate-900">"Add to Home Screen"</strong> (होम
                          स्क्रीन पर जोड़ें) चुनें।
                        </>
                      ) : (
                        <>
                          Scroll down and tap{' '}
                          <strong className="text-slate-900">"Add to Home Screen"</strong>.
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <p className="leading-relaxed">
                      {lang === 'hi'
                        ? 'ऊपर "Add" पर टैप करें। ऐप आपके iPhone पर तैयार है!'
                        : 'Tap "Add" in the top right. KiddoZap is now installed!'}
                    </p>
                  </div>
                </div>
              </>
            )}

            {deviceTab === 'pc' && (
              <>
                <h5 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <span>
                    {lang === 'hi' ? 'कंप्यूटर / लैपटॉप (Chrome / Edge):' : 'Computer / Laptop (Chrome / Edge):'}
                  </span>
                </h5>

                <div className="space-y-2 text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <p className="leading-relaxed">
                      {lang === 'hi'
                        ? 'ब्राउज़र के एड्रेस बार (Address Bar) में ऊपर दाईं ओर [⊕ Install] आइकन पर क्लिक करें।'
                        : 'Click the [⊕ Install] button in the browser address bar.'}
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <p className="leading-relaxed">
                      {lang === 'hi'
                        ? '"Install" बटन दबाएं — KiddoZap बिना ब्राउज़र बार के फुल स्क्रीन में खुलेगा!'
                        : 'Click "Install" — KiddoZap will launch as a dedicated desktop game window!'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Safe & Kids-Friendly Badges */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{lang === 'hi' ? '100% सुरक्षित & फ़्री' : '100% Safe & Free'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{lang === 'hi' ? 'सुपर फ़ास्ट लोडिंग' : 'Ultra Fast Loading'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
