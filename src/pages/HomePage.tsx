import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Blocks, Gamepad2, HeartHandshake, Music2, Play, Smartphone, X } from 'lucide-react';
import { GAMES, type GameInfo } from '../data/games';
import type { Language } from '../types';
import './HomePage.css';

const NurseryRhymes = lazy(() => import('../components/NurseryRhymes').then(module => ({ default: module.NurseryRhymes })));
const PianoGame = lazy(() => import('../components/PianoGame').then(module => ({ default: module.PianoGame })));

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.kiddozap.app';
const ART = '/assets/home';
const featuredGames = [
  { id: 'math-sprint', title: 'Math Sprint', art: 'math', color: 'peach', skill: 'Numbers', desc: 'Practise quick sums in a timed challenge.' },
  { id: 'memory-match', title: 'Memory Match', art: 'memory', color: 'lilac', skill: 'Memory', desc: 'Flip the cards and remember where each pair is hiding.' },
  { id: 'sudoku', title: 'Kiddo Sudoku', art: 'puzzle', color: 'mint', skill: 'Logic', desc: 'Solve small number grids using clues and patterns.' },
  { id: 'builder', title: 'Little Builder World', art: 'builder', color: 'sky', skill: 'Creativity', desc: 'Put pieces together to build bridges, houses and more.' },
];

interface HomePageProps {
  onSelectGame: (game: GameInfo) => void;
}

type MusicActivity = 'piano' | 'rhymes';

export function HomePage({ onSelectGame }: HomePageProps) {
  const [activity, setActivity] = useState<MusicActivity | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const musicDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = musicDialog.current;
    if (activity && dialog && !dialog.open) dialog.showModal();
  }, [activity]);

  function closeMusic() {
    musicDialog.current?.close();
  }

  return (
    <div className="kz-home">
      <a className="kz-skip" href="#main-content">Skip to content</a>
      <header className="kz-header">
        <div className="kz-wrap kz-header-inner">
          <a href="/" aria-label="KiddoZap home"><img className="kz-logo" src={ART + '/logo.webp'} alt="KiddoZap" width="154" height="57" /></a>
          <nav aria-label="Main navigation">
            <a href="#games">Games</a>
            <a href="#music">Music</a>
            <a href="#parents">Parents</a>
          </nav>
          <a className="kz-button kz-header-app" href="#app">Get the app</a>
        </div>
      </header>

      <main id="main-content">
        <div className="kz-wrap">
          <section className="kz-hero" aria-labelledby="kz-title">
            <div className="kz-hero-copy">
              <p className="kz-kicker"><Gamepad2 size={18} /> LEARN THROUGH PLAY</p>
              <h1 id="kz-title">Little games.<br /><em>Big discoveries.</em></h1>
              <p>Match cards, build your own world, or make a little music. There’s something new to try every time you play.</p>
              <div className="kz-actions">
                <a className="kz-button" href="#games"><Play size={18} fill="currentColor" /> Play games</a>
                <a className="kz-button kz-secondary" href="#app"><Smartphone size={19} /> Explore the app</a>
              </div>
            </div>
            <div className="kz-hero-art" aria-hidden="true">
              <span className="kz-orbit" />
              <div className="kz-phone"><img src={ART + '/hero.webp'} alt="" fetchPriority="high" width="412" height="730" /></div>
              <span className="kz-sticker kz-sticker-math"><img src={ART + '/math.webp'} alt="" /></span>
              <span className="kz-sticker kz-sticker-piano"><img src={ART + '/piano.webp'} alt="" /></span>
              <span className="kz-sparkle">✦</span>
              <span className="kz-sparkle kz-sparkle-small">✦</span>
            </div>
          </section>
        </div>

        <section id="games" className="kz-wrap kz-section" aria-labelledby="kz-games-title">
          <div className="kz-section-top">
            <div>
              <p className="kz-kicker"><Blocks size={17} /> BROWSER GAMES</p>
              <h2 id="kz-games-title">Pick a game and play</h2>
            </div>
            <a className="kz-button kz-secondary" href="/play">All games</a>
          </div>
          <div className="kz-game-grid">
            {featuredGames.map(card => {
              const game = GAMES.find(item => item.id === card.id);
              if (!game) return null;

              return (
                <a className={'kz-game-card kz-' + card.color} key={card.id} href={'/?game=' + game.id} onClick={event => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  onSelectGame(game);
                }}>
                  <div className="kz-game-picture"><img src={ART + '/' + card.art + '.webp'} alt="" loading="lazy" /></div>
                  <div className="kz-game-copy">
                    <p className="kz-skill">{card.skill}</p>
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                    <span className="kz-play-label"><Play size={14} fill="currentColor" /> Play now</span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <section id="music" className="kz-music" aria-labelledby="kz-music-title">
          <div className="kz-wrap kz-section">
            <p className="kz-kicker"><Music2 size={18} /> MUSIC CORNER</p>
            <h2 id="kz-music-title">Make a little music</h2>
            <div className="kz-music-grid">
              <article className="kz-music-card kz-piano-card">
                <div>
                  <h3>Rainbow Piano</h3>
                  <p>Tap eight colorful keys to make your own tune, from Sa to high Sa.</p>
                  <button className="kz-button" type="button" onClick={() => setActivity('piano')}>Play piano</button>
                </div>
                <img src={ART + '/piano.webp'} alt="" loading="lazy" />
              </article>
              <article className="kz-music-card kz-rhyme-card">
                <div>
                  <h3>Nursery Rhymes</h3>
                  <p>Read along in English or Hindi while the melodies play.</p>
                  <button className="kz-button" type="button" onClick={() => setActivity('rhymes')}>Explore rhymes</button>
                </div>
                <span className="kz-moon" aria-hidden="true">☾</span>
              </article>
            </div>
          </div>
        </section>

        <section id="app" className="kz-wrap kz-section" aria-labelledby="kz-app-title">
          <div className="kz-app">
            <img className="kz-app-logo" src={ART + '/logo.webp'} alt="" loading="lazy" />
            <div>
              <p className="kz-kicker"><Smartphone size={18} /> KIDDOZAP ON ANDROID</p>
              <h2 id="kz-app-title">Take playtime with you</h2>
              <p>Explore the English alphabet, Hindi वर्णमाला, counting, colors, shapes and animals. Then try puzzles and mini-games at your own pace.</p>
              <a className="kz-button" href={PLAY_STORE}>Get it on Google Play</a>
            </div>
          </div>
        </section>

        <section id="parents" className="kz-wrap kz-parents" aria-labelledby="kz-parents-title">
          <HeartHandshake aria-hidden="true" size={35} />
          <div>
            <h2 id="kz-parents-title">For parents and teachers</h2>
            <p>Find tips for choosing games and sharing short play breaks at home or in class.</p>
          </div>
          <a className="kz-button kz-secondary" href="/parents-guide">Read the parents’ guide</a>
        </section>
      </main>

      <footer className="kz-footer">
        <div className="kz-wrap kz-footer-inner">
          <a href="/" aria-label="KiddoZap home"><img className="kz-logo" src={ART + '/logo.webp'} alt="KiddoZap" width="154" height="57" loading="lazy" /></a>
          <nav aria-label="Footer navigation">
            <a href="/games">Game guides</a>
            <a href="/categories">Categories</a>
            <a href="/articles">Articles</a>
            <a href="/tools">Tools</a>
            <a href="/about">About</a>
            <a href="/privacypolicy">Website privacy</a>
            <a href="/privacy">App privacy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      </footer>

      <dialog className="kz-dialog" ref={musicDialog} aria-labelledby="kz-dialog-title" onClose={() => setActivity(null)}>
        {activity && (
          <>
            <div className="kz-dialog-bar">
              <h2 id="kz-dialog-title">{activity === 'piano' ? 'Rainbow Piano' : 'Nursery Rhymes'}</h2>
              <label className="kz-language">
                <span className="sr-only">Activity language</span>
                <select value={language} onChange={event => setLanguage(event.target.value === 'hi' ? 'hi' : 'en')}>
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </label>
              <button type="button" onClick={closeMusic} aria-label="Close music activity"><X size={25} /></button>
            </div>
            <Suspense fallback={<p role="status">Loading activity…</p>}>
              {activity === 'piano'
                ? <PianoGame lang={language} onBack={closeMusic} />
                : <NurseryRhymes key={language} lang={language} onBack={closeMusic} />}
            </Suspense>
          </>
        )}
      </dialog>
    </div>
  );
}
