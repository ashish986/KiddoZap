import { useEffect, useRef, useState } from 'react';
import { Music2, Volume2 } from 'lucide-react';
import './MusicPage.css';

const songs = [
  {
    id: 'twinkle',
    title: 'Twinkle, Twinkle, Little Star',
    icon: '🌟',
    audio: '/assets/rhymes/twinkle.mp3',
    artist: 'Derrick Coetzee',
    source: 'https://commons.wikimedia.org/wiki/File:Twinkle_Twinkle_Little_Star_-_sung_with_full_lyrics.ogg',
    lines: [
      ['Twinkle, twinkle, little star,', 'How I wonder what you are!', 'Up above the world so high,', 'Like a diamond in the sky.'],
      ['When the blazing sun is gone,', 'When he nothing shines upon,', 'Then you show your little light,', 'Twinkle, twinkle, all the night.'],
      ['Then the traveller in the dark', 'Thanks you for your tiny spark,', 'How could he see where to go,', 'If you did not twinkle so?'],
      ['In the dark blue sky you keep,', 'Often through my curtains peep,', 'For you never shut your eye,', 'Till the sun is in the sky.'],
      ['As your bright and tiny spark', 'Lights the traveller in the dark,', 'Though I know not what you are,', 'Twinkle, twinkle, little star.'],
    ],
  },
  {
    id: 'birthday',
    title: 'Happy Birthday',
    icon: '🎂',
    audio: '/assets/rhymes/birthday.mp3',
    artist: 'beautifuldaymonster1968',
    source: 'https://freesound.org/people/beautifuldaymonster1968/sounds/770325/',
    lines: [['Happy birthday to you,', 'Happy birthday to you,', 'Happy birthday, dear friend,', 'Happy birthday to you!']],
  },
];

const keys = [
  { midi: 60, western: 'C', hindi: 'सा', keyboard: 'a' },
  { midi: 61, western: 'C♯', hindi: 'रे♭', keyboard: 'w', after: 0 },
  { midi: 62, western: 'D', hindi: 'रे', keyboard: 's' },
  { midi: 63, western: 'D♯', hindi: 'ग♭', keyboard: 'e', after: 1 },
  { midi: 64, western: 'E', hindi: 'ग', keyboard: 'd' },
  { midi: 65, western: 'F', hindi: 'म', keyboard: 'f' },
  { midi: 66, western: 'F♯', hindi: 'म♯', keyboard: 't', after: 3 },
  { midi: 67, western: 'G', hindi: 'प', keyboard: 'g' },
  { midi: 68, western: 'G♯', hindi: 'ध♭', keyboard: 'y', after: 4 },
  { midi: 69, western: 'A', hindi: 'ध', keyboard: 'h' },
  { midi: 70, western: 'A♯', hindi: 'नि♭', keyboard: 'u', after: 5 },
  { midi: 71, western: 'B', hindi: 'नि', keyboard: 'j' },
  { midi: 72, western: 'C′', hindi: 'सां', keyboard: 'k' },
];

function RainbowPiano() {
  const context = useRef<AudioContext | null>(null);
  const release = useRef<number | undefined>(undefined);
  const [active, setActive] = useState<number | null>(null);
  const [noteCount, setNoteCount] = useState(0);
  const [labels, setLabels] = useState<'western' | 'hindi'>('western');

  function play(midi: number) {
    window.clearTimeout(release.current);
    setActive(midi);
    setNoteCount(count => count + 1);
    release.current = window.setTimeout(() => setActive(null), 210);

    try {
      const Audio = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Audio) return;
      const audio = context.current ??= new Audio();
      if (audio.state === 'suspended') void audio.resume().catch(() => {});
      const start = audio.currentTime;
      const volume = audio.createGain();
      volume.gain.setValueAtTime(.001, start);
      volume.gain.linearRampToValueAtTime(.12, start + .018);
      volume.gain.exponentialRampToValueAtTime(.001, start + 1.05);
      volume.connect(audio.destination);
      const frequency = 440 * 2 ** ((midi - 69) / 12);
      for (const [index, harmonic] of [1, 2, 3].entries()) {
        const oscillator = audio.createOscillator();
        const mix = audio.createGain();
        oscillator.frequency.value = frequency * harmonic;
        mix.gain.value = [1, .21, .06][index];
        oscillator.connect(mix).connect(volume);
        oscillator.start(start);
        oscillator.stop(start + 1.07);
        oscillator.onended = () => {
          oscillator.disconnect();
          mix.disconnect();
          if (index === 2) volume.disconnect();
        };
      }
    } catch {
      // Keys still provide visual feedback when Web Audio is unavailable.
    }
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.target instanceof HTMLSelectElement) return;
      const note = keys.find(key => key.keyboard === event.key.toLowerCase());
      if (!note) return;
      event.preventDefault();
      play(note.midi);
    }
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(release.current);
      if (context.current) void context.current.close().catch(() => {});
      context.current = null;
    };
  }, []);

  function renderKey(key: (typeof keys)[number]) {
    return (
      <button type="button" key={key.midi} aria-label={key[labels]}
        className={`music-key ${key.after === undefined ? 'music-white' : 'music-black'} ${active === key.midi ? 'is-playing' : ''}`}
        style={key.after === undefined ? undefined : { left: `${(key.after + 1) * 12.5}%` }}
        onClick={() => play(key.midi)}>
        <span>{key[labels]}</span><kbd>{key.keyboard.toUpperCase()}</kbd>
      </button>
    );
  }

  return (
    <>
      <section className="music-instrument" aria-label="Playable piano">
        <div className="music-controls">
          <label>Note names <select value={labels} onChange={event => setLabels(event.target.value === 'hindi' ? 'hindi' : 'western')}><option value="western">C D E</option><option value="hindi">सा रे ग</option></select></label>
          <span className="music-display"><Volume2 size={19} aria-hidden="true" /> {noteCount} notes played</span>
        </div>
        <div className="music-keyboard">
          {keys.filter(key => key.after === undefined).map(renderKey)}
          {keys.filter(key => key.after !== undefined).map(renderKey)}
        </div>
      </section>
      <section className="music-tip">
        <h2>Play your first tune</h2>
        <p>Tap C C G G A A G, or press A A G G H H G on your keyboard. Hold the last beat in your head before you play the next line of “Twinkle, Twinkle.”</p>
        <p>In सा रे ग mode, play सा सा प प ध ध प.</p>
      </section>
    </>
  );
}

function RhymePlayer() {
  const [songIndex, setSongIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const song = songs[songIndex];

  return (
    <>
      <div className="rhyme-choices" aria-label="Choose a song">
        {songs.map((track, index) => <button type="button" className="music-link" key={track.id} aria-pressed={songIndex === index} onClick={() => {
          if (songIndex !== index) {
            setPlaying(false);
            setSongIndex(index);
          }
        }}>{track.icon} {track.title}</button>)}
      </div>
      <section className={`rhyme-player ${playing ? 'rhyme-playing' : ''}`} aria-label={song.title}>
        <div className="rhyme-art" aria-hidden="true"><span>{song.icon}</span><i>♫</i><b>✦</b></div>
        <div className="rhyme-content">
          <h2>{song.title}</h2>
          <audio key={song.id} controls preload="metadata" src={song.audio} aria-label={`Sing along to ${song.title}`} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}>
            <a href={song.audio}>Download the song</a>
          </audio>
          <div className="rhyme-lyrics" aria-label="Lyrics">
            {song.lines.map(verse => <p key={verse[0]}>{verse.map(line => <span key={line}>{line}</span>)}</p>)}
          </div>
          <p className="music-credit">Sung recording by {song.artist}. <a href={song.source}>Source and CC0 licence</a>.</p>
        </div>
      </section>
      <section className="music-tip" lang="hi"><h2>हिन्दी में साथ पढ़ें</h2>
        <p>चमको चमको प्यारे तारे,<br />झिलमिल करते दूर हमारे।<br />नीले नभ में दीप जलाओ,<br />सपनों में मुस्कान सजाओ।</p>
        <p>ट्विंकल की धुन पर इन पंक्तियों को साथ गाकर देखें।</p>
      </section>
    </>
  );
}

export function MusicPage({ kind }: { kind: 'piano' | 'rhymes' }) {
  const piano = kind === 'piano';
  useEffect(() => {
    document.title = piano ? 'Rainbow Piano | KiddoZap' : 'Sing-along Nursery Rhymes | KiddoZap';
  }, [piano]);

  return (
    <div className="music-page">
      <header className="music-header">
        <div className="music-wrap music-nav">
          <a href="/" aria-label="KiddoZap home"><img src="/assets/home/logo.webp" alt="KiddoZap" width="145" height="54" /></a>
          <nav aria-label="Music navigation"><a href="/games">Games</a><a href={piano ? '/rhymes' : '/piano'}>{piano ? 'Rhymes' : 'Piano'}</a><a href="/#app">Get the app</a></nav>
        </div>
      </header>
      <main className="music-wrap">
        <div className="music-hero">
          <Music2 size={32} aria-hidden="true" />
          <h1>{piano ? 'Rainbow Piano' : 'Nursery Sing-Along'}</h1>
          <p>{piano ? 'Tap the keys to make a tune. Try the black keys for extra notes.' : 'Press play to hear the singing, then follow the words at your own pace.'}</p>
        </div>
        {piano ? <RainbowPiano /> : <RhymePlayer />}
      </main>
      <footer className="music-wrap music-footer"><a href="/parents-guide">Parents’ guide</a><a href="/privacy">App privacy</a><a href="/contact">Contact</a></footer>
    </div>
  );
}
