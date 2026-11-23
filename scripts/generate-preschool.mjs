import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const games = JSON.parse(readFileSync('src/data/preschool.json', 'utf8'));
const publisher = 'ca-pub-1249623486151192';

function page(title, description, route, content, script = '') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | KiddoZap</title>
  <meta name="description" content="${description}">
  <meta name="google-adsense-account" content="${publisher}">
  <meta name="theme-color" content="#f1eaff">
  <link rel="canonical" href="https://kiddozap.com${route}">
  <link rel="icon" href="/icon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/preschool.css">
${script ? "  " + script + "\n" : ""}</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-nav"><div class="wrap nav-row">
    <a href="/" aria-label="KiddoZap home"><img src="/assets/home/logo.webp" alt="KiddoZap" width="148" height="55"></a>
    <nav aria-label="Main navigation">
      <a href="/games">Games</a><a href="/rhymes">Rhymes</a><a href="/piano">Piano</a><a href="/#app">Get the app</a>
    </nav>
  </div></header>
  <main class="wrap" id="main">${content}</main>
  <footer class="site-footer"><div class="wrap nav-row"><strong>KiddoZap</strong><nav aria-label="Footer">
    <a href="/parents-guide">Parents</a><a href="/contact">Contact</a><a href="/privacypolicy">Website privacy</a><a href="/privacy">App privacy</a>
  </nav></div></footer>
</body>
</html>
`;
}

function tiles(items) {
  return `<div class="activity-list">${items.map(game => `
    <a class="activity-card ${game.color}" href="/games/${game.id}">
      <img src="${game.art}" alt="" loading="lazy" width="360" height="180">
      <div><span>${game.category}</span><h3>${game.title}</h3><p>${game.description}</p><strong>Play game</strong></div>
    </a>`).join('')}</div>`;
}

writeFileSync('public/games/index.html', page('Pre-nursery games', 'Play ABC Garden, Counting Basket, shape and pattern puzzles, Picture Pairs and Firefly Meadow. Free, untimed browser activities for early learners.', '/games', `
  <section class="catalog-hero">
    <div><h1>Little games for curious kids</h1><p>Practise letters, count fruit, solve a puzzle or light up a meadow. Play at your own pace.</p></div>
    <img src="/assets/preschool/letters.webp" width="350" height="210" alt="">
  </section>
  <section class="games-section"><h2>Learn through play</h2>${tiles(games.filter(game => game.group === 'Learn'))}</section>
  <section class="games-section"><h2>Just for fun</h2>${tiles(games.filter(game => game.group === 'Fun'))}</section>
  <section class="grownup"><h2>More to explore in the KiddoZap app</h2><p>The Android app includes English letters, Hindi वर्णमाला, counting, animals and mini-games.</p><a class="primary" href="/#app">Explore the Android app</a></section>
`));

for (const game of games) {
  const dir = join('public/games', game.id);
  mkdirSync(dir, { recursive: true });
  const next = games.find(candidate => candidate.id === game.next);
  writeFileSync(join(dir, 'index.html'), page(game.title, game.description, `/games/${game.id}`, `
    <a class="all-games" href="/games">All games</a>
    <header class="activity-intro"><div class="activity-emblem ${game.color}" aria-hidden="true">${game.icon}</div><div><p>${game.category}</p><h1>${game.title}</h1></div></header>
    <section class="play-board ${game.color}" aria-label="${game.title} game" data-game="${game.id}" data-instruction="${game.instruction}">
      <div class="game-loading" data-loading><img src="/assets/home/logo.webp" alt="" width="152" height="56"><p role="status">Getting your game ready…</p></div>
      <noscript><style>.game-loading{display:none}</style><p>Turn on JavaScript to play this game. You can try the activity below with a grown-up.</p></noscript>
    </section>
    <section class="grownup" aria-labelledby="grownup"><h2 id="grownup">For grown-ups</h2>
      <p>${game.skill}</p><h3>Try it together, away from the screen</h3><p>${game.parent}</p><p>${game.example}</p>
    </section>
    <section class="game-more"><h2>Keep playing</h2><a class="secondary" href="/games/${next.id}">Play ${next.title}</a><a class="secondary" href="/#app">Explore the Android app</a></section>
  `, '<script type="module" src="/preschool.js"></script>'));
}

const sitemapPath = 'public/sitemap.xml';
let sitemap = readFileSync(sitemapPath, 'utf8').replace(/\s*<url>\s*<loc>https:\/\/kiddozap\.com\/(?:games\/[^<]+|categories(?:\/[^<]+)?|piano|rhymes)<\/loc>[\s\S]*?<\/url>/g, '');
sitemap = sitemap.replace('</urlset>', [...games.map(game => '/games/' + game.id), '/piano', '/rhymes'].map(route =>
  `  <url><loc>https://kiddozap.com${route}</loc></url>`).join('\n') + '\n</urlset>');
writeFileSync(sitemapPath, sitemap);
