import { Blocks, Gamepad2, HeartHandshake, Music2, Play, Smartphone } from 'lucide-react';
import preschool from '../data/preschool.json';
import './HomePage.css';


const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.kiddozap.app';
const ART = '/assets/home';
const featuredGames = preschool.filter(game => game.group === 'Learn');

export function HomePage() {
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
              <p>Discover KiddoZap for Android. Try letters, counting and puzzles in your browser, then explore more learning activities in the app.</p>
              <div className="kz-actions">
                <a className="kz-button" href="#app"><Smartphone size={19} /> Explore the app</a>
                <a className="kz-button kz-secondary" href="#games"><Play size={18} fill="currentColor" /> Try free games</a>
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
              <p className="kz-kicker"><Blocks size={17} /> PRE-NURSERY GAMES</p>
              <h2 id="kz-games-title">Try a learning game</h2>
            </div>
            <a className="kz-button kz-secondary" href="/games">All games</a>
          </div>
          <div className="kz-game-grid">
            {featuredGames.map(card => (
              <a className={'kz-game-card kz-' + card.color} key={card.id} href={'/games/' + card.id}>
                <div className="kz-game-picture"><img src={card.art} alt="" loading="lazy" /></div>
                <div className="kz-game-copy">
                  <p className="kz-skill">{card.category}</p>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <span className="kz-play-label"><Play size={14} fill="currentColor" /> Play now</span>
                </div>
              </a>
            ))}
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
                  <p>Make a tune on a rainbow keyboard with white and black keys.</p>
                  <a className="kz-button" href="/piano">Play piano</a>
                </div>
                <img src={ART + '/piano.webp'} alt="" loading="lazy" />
              </article>
              <article className="kz-music-card kz-rhyme-card">
                <div>
                  <h3>Nursery Rhymes</h3>
                  <p>Listen to sung recordings and follow the lyrics. Try a Hindi read-along too.</p>
                  <a className="kz-button" href="/rhymes">Explore rhymes</a>
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
            <a href="/games">Games</a>
            <a href="/articles">Articles</a>
            <a href="/tools">Tools</a>
            <a href="/about">About</a>
            <a href="/privacypolicy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      </footer>

    </div>
  );
}
