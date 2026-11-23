import { lazy, Suspense } from 'react';
import { HomePage } from './pages/HomePage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AppPrivacyPolicyPage } from './pages/AppPrivacyPolicyPage';

const MusicPage = lazy(() => import('./pages/MusicPage').then(module => ({ default: module.MusicPage })));

function MusicLoader() {
  return (
    <div className="kiddo-loader" role="status">
      <div className="kiddo-loader-art" aria-hidden="true"><span>✦</span><span>♪</span><span>✧</span></div>
      <div className="kiddo-loader-content"><img src="/assets/home/logo.webp" alt="KiddoZap" width="220" height="80" /><p>Getting music ready…</p></div>
    </div>
  );
}

export function App() {
  const route = window.location.pathname.replace(/\/$/, '') || '/';
  if (route === '/privacy' || route === '/privacy.html') return <AppPrivacyPolicyPage />;
  if (route === '/privacypolicy' || route === '/privacypolicy.html') return <PrivacyPage onGoHome={() => window.location.assign('/')} />;
  if (route === '/rhymes' || route === '/piano') {
    return <Suspense fallback={<MusicLoader />}><MusicPage kind={route === '/piano' ? 'piano' : 'rhymes'} /></Suspense>;
  }
  if (route === '/play' || new URLSearchParams(window.location.search).has('game')) {
    return <main className="kiddo-loading-fallback"><h1>KiddoZap games</h1><a href="/games">Open the game catalog</a></main>;
  }
  return <HomePage />;
}

export default App;
