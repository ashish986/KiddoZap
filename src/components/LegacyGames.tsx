import { lazy, Suspense } from 'react';
import { GameStage } from './GameStage';

const olderGames = [
  { keys: ['cardflip'], title: 'Card Flip Match', icon: '🃏', Game: lazy(() => import('./CardFlipMatchGame').then(m => ({ default: m.CardFlipMatchGame }))) },
  { keys: ['rhymes'], title: 'Nursery Rhymes', icon: '🎶', Game: lazy(() => import('./NurseryRhymes').then(m => ({ default: m.NurseryRhymes }))) },
  { keys: ['slope3d'], title: 'Slope 3D', icon: '🟢', Game: lazy(() => import('./Slope3DGame')) },
  { keys: ['flap-hero', 'flappy-hero', 'flappy'], title: 'Flap Hero', icon: '🐦', Game: lazy(() => import('./FlappyHero').then(m => ({ default: m.FlappyHero }))) },
  { keys: ['bubble-shooter', 'bubble'], title: 'Bubble Shooter', icon: '🫧', Game: lazy(() => import('./BubbleShooterGame').then(m => ({ default: m.BubbleShooterGame }))) },
  { keys: ['color-gate-arena', 'color-switch', 'colorswitch'], title: 'Color Gate Arena', icon: '🎨', Game: lazy(() => import('./ColorSwitchGame')) },
  { keys: ['four-in-a-line', 'connect-four', 'connect4'], title: 'Four in a Line', icon: '🔴', Game: lazy(() => import('./ConnectFourGame').then(m => ({ default: m.ConnectFourGame }))) },
  { keys: ['galaxy-defender', 'space-invaders', 'spaceinvaders'], title: 'Galaxy Defender', icon: '🚀', Game: lazy(() => import('./SpaceInvadersGame').then(m => ({ default: m.SpaceInvadersGame }))) },
  { keys: ['neon-maze-runner', 'pac-maze', 'pacmaze'], title: 'Neon Maze Runner', icon: '👻', Game: lazy(() => import('./PacMazeGame')) },
  { keys: ['aim-trainer', 'aimtrainer'], title: 'Aim Reflex Trainer', icon: '🎯', Game: lazy(() => import('./games/AimTrainerGame').then(m => ({ default: m.AimTrainerGame }))) },
  { keys: ['hop-and-cross', 'crossy-road', 'crossyroad'], title: 'Hop and Cross', icon: '🐸', Game: lazy(() => import('./CrossyRoadGame').then(m => ({ default: m.CrossyRoadGame }))) },
  { keys: ['rooftop-parkour', 'parkour'], title: 'Rooftop Parkour', icon: '🏙️', Game: lazy(() => import('./RooftopParkourGame')) },
  { keys: ['jetpack-raider', 'jetpack'], title: 'Jetpack Raider', icon: '🛸', Game: lazy(() => import('./JetpackJoyrideGame').then(m => ({ default: m.JetpackJoyrideGame }))) },
  { keys: ['magic-piano', 'piano-tiles', 'piano'], title: 'Magic Piano', icon: '🎹', Game: lazy(() => import('./PianoGame').then(m => ({ default: m.PianoGame }))) },
  { keys: ['stunt-biker', 'moto-x3m', 'motox3m'], title: 'Stunt Biker', icon: '🏁', Game: lazy(() => import('./MotoX3MGame').then(m => ({ default: m.MotoX3MGame }))) },
  { keys: ['tunnel-dash', 'tunnel-rush', 'tunnelrush3d'], title: 'Tunnel Dash', icon: '🌈', Game: lazy(() => import('./TunnelRush3DGame')) },
];

export function findOlderGame(key: string | null) {
  return olderGames.find(game => key && game.keys.includes(key));
}

export function OlderGamePlayer({ game, embed }: { game: (typeof olderGames)[number]; embed: boolean }) {
  const { Game, title, keys } = game;
  const goBack = () => (window.top ?? window).location.assign('/play');
  return (
    <main className="min-h-screen bg-[#241844] text-white px-2 py-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-3 py-3 px-2">
          <h1 className="text-xl">{game.icon} {title}</h1>
          <a className="text-violet-200 font-bold underline" href="/play" target={embed ? '_top' : undefined}>All games</a>
        </div>
        <GameStage id={keys[0]}>
          <Suspense fallback={<p className="p-8 text-center" role="status">Loading {title}…</p>}>
            <Game lang="en" onBack={goBack} onGameComplete={() => {}} />
          </Suspense>
        </GameStage>
      </div>
    </main>
  );
}

export function searchOlderGames(search: string) {
  const term = search.trim().toLowerCase();
  return olderGames.filter(game => game.title.toLowerCase().includes(term));
}

export function OlderGameLinks({ matches }: { matches: typeof olderGames }) {
  if (!matches.length) return null;
  return (
    <section className="mb-12" aria-labelledby="more-games">
      <h2 id="more-games" className="text-2xl font-black mb-4">More arcade games</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {matches.map(({ keys, title, icon }) => (
          <a className="kz-arcade-link" key={keys[0]} href={`/?game=${keys[0]}`}>
            <span aria-hidden="true">{icon}</span> {title}
          </a>
        ))}
      </div>
    </section>
  );
}
