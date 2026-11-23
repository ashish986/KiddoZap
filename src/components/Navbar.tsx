import { PlayStoreLink } from './PlayStoreLink';

interface NavbarProps {
  currentRoute: string;
}

export function Navbar({ currentRoute }: NavbarProps) {
  return (
    <header className="kz-interior-header">
      <div className="kz-interior-nav">
        <a href="/" aria-label="KiddoZap home"><img src="/assets/home/logo.webp" alt="KiddoZap" width="142" height="52" /></a>
        <nav aria-label="Main navigation">
          <a href="/play" aria-current={currentRoute === '/play' ? 'page' : undefined}>Games</a>
          <a href="/#music">Music</a>
          <a href="/parents-guide">Parents</a>
          <PlayStoreLink>Get the app</PlayStoreLink>
        </nav>
      </div>
    </header>
  );
}
