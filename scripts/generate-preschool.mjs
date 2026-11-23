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
    <a href="/parents-guide">Parents</a><a href="/contact">Contact</a><a href="/privacypolicy">Privacy</a>
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

function publishInfo(slug, title, description, sections) {
  const dir = join('public', slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(title, description, '/' + slug, `
    <header class="info-hero"><h1>${title}</h1><p>${description}</p></header>
    ${sections}
  `, slug === 'tools' ? '<script type="module">document.querySelector(".print-action").addEventListener("click", () => window.print());</script>' : ''));
}

publishInfo('about', 'About KiddoZap', 'KiddoZap is an Android learning app with a browser play corner for young children and their grown-ups.', `
  <section class="grownup"><h2>What families can try here</h2>
    <p>Start with familiar pictures in ABC Garden, group fruit in Counting Basket, or compare shapes and patterns. Picture Pairs and Firefly Meadow offer a short play break. Each browser game has a simple activity for grown-ups to try with children away from the screen.</p>
    <p><a href="/games">Explore the browser games</a></p>
  </section>
  <section class="grownup"><h2>What’s in the Android app</h2>
    <p>The app includes English letters, Hindi वर्णमाला, numbers, colors, shapes and animals, plus learning activities and mini-games.</p>
    <a class="primary" href="https://play.google.com/store/apps/details?id=com.kiddozap.app">See KiddoZap on Google Play</a>
  </section>
  <section class="grownup"><h2>Music and sing-along</h2>
    <p>Play a tune on <a href="/piano">Rainbow Piano</a> or listen to recorded singing in the <a href="/rhymes">Nursery Sing-Along</a>.</p>
  </section>
`);

publishInfo('parents-guide', 'A grown-up’s guide to KiddoZap', 'Pick a short activity, play a round together, and follow it with something you can do away from the screen.', `
  <section class="grownup"><h2>Start with something familiar</h2>
    <p>Ask your child to name the picture in <a href="/games/abc-garden">ABC Garden</a>. Say the first sound slowly together. If the choice is tricky, point to two letters and say each one aloud.</p>
    <p>In <a href="/games/counting-basket">Counting Basket</a>, help them touch one fruit for each number they say. Ask “How many altogether?” after you reach the last fruit.</p>
  </section>
  <section class="grownup"><h2>Notice how they figured it out</h2>
    <p>In <a href="/games/shape-picnic">Shape Picnic</a>, notice the long edges and corners. In <a href="/games/pattern-picnic">Pattern Picnic</a>, clap once for each picture and say the repeating part together. Give your child time to make a second choice.</p>
  </section>
  <section class="grownup"><h2>Choose a stopping point together</h2>
    <p>Play one round or listen to one <a href="/rhymes">rhyme</a>, then use the <a href="/tools">off-screen activities</a> to keep the idea going. Let your child point to what they want to try next time.</p>
  </section>
`);

publishInfo('contact', 'Contact KiddoZap', 'For help with the website or Android app, email the KiddoZap support team.', `
  <section class="grownup"><h2>Support email</h2>
    <a class="primary" href="mailto:support@kiddozap.com">Email support@kiddozap.com</a>
    <h3>Reporting a website issue</h3><p>Include the game or page name, the device and browser you used, and what happened. For piano or rhyme audio, say whether other audio on your device plays normally.</p>
    <h3>Reporting an Android app issue</h3><p>Include the app version, Android version and the activity you were using. Leave out a child’s name and other personal details.</p>
  </section>
`);

publishInfo('articles', 'Learning ideas for families', 'Three ways to bring the skills from KiddoZap’s games and music into ordinary play.', `
  <section class="grownup" id="first-sounds"><h2>A tiny first-sound hunt</h2>
    <p>Pick a sound your child knows and find two objects that begin with it. Try a sock and a spoon for S. Say each word slowly. Let your child add a third object or draw one if it is hard to find.</p>
    <p>Next, try a word with a different first sound and ask your child to sort it into its own group. Try a round of <a href="/games/abc-garden">ABC Garden</a> together when they are ready.</p>
  </section>
  <section class="grownup" id="counting"><h2>Same count, different arrangement</h2>
    <p>Start with four cups in a row. Ask your child to touch each cup as they count. Move the cups into a circle and ask whether there are still four. Count again together to check.</p>
    <p>On another day, let your child move the cups while you guess the total. <a href="/games/counting-basket">Counting Basket</a> uses the same one-touch-per-object idea.</p>
  </section>
  <section class="grownup" id="music"><h2>Answer a tune with a clap</h2>
    <p>Listen to one line of a <a href="/rhymes">rhyme</a>. Pause the recording and clap its rhythm together, then replay the line to compare. On <a href="/piano">Rainbow Piano</a>, play C twice and let your child reply with any two notes.</p>
  </section>
`);

publishInfo('tools', 'Off-screen activity cards', 'Use these short activities after a KiddoZap game. Print the page for use away from the screen.', `
  <button type="button" class="primary print-action">Print activity cards</button>
  <div class="activity-sheets">
    <section class="grownup"><h2>Count the dots</h2><p>Point to each dot once as you count. Write or say the total for each line.</p>
      <p class="worksheet-dots">● ● ●</p><p class="worksheet-dots">● ● ● ● ●</p><p class="worksheet-dots">● ● ● ● ● ● ●</p>
      <p>Grown-ups: answers are 3, 5 and 7. Try the same idea with <a href="/games/counting-basket">Counting Basket</a>.</p>
    </section>
    <section class="grownup"><h2>Finish the pattern</h2><p>Say the shapes in order, then draw what you think comes next.</p>
      <p class="worksheet-dots">● ▲ ● ▲ ● ___</p><p class="worksheet-dots">■ ■ ● ■ ■ ___</p>
      <p>Grown-ups: answers are triangle and circle. Make another pattern together or try <a href="/games/pattern-picnic">Pattern Picnic</a>.</p>
    </section>
  </div>
`);
