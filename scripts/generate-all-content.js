import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.resolve('public');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function renderHtmlPage({ title, description, canonicalUrl, content, extraHead = '' }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="article" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/site.css">
    ${extraHead}
  </head>
  <body>
    <!-- Top Utility Bar -->
    <header class="site-header">
      <div class="header-inner">
        <a href="/" class="brand-link">
          <span class="brand-icon">⚡</span>
          <span class="brand-name">KiddoZap</span>
        </a>
        <nav class="nav-links">
          <a href="/">🎮 All Games</a>
          <a href="/categories">📂 Categories</a>
          <a href="/articles">📚 Articles</a>
          <a href="/parents-guide">👨‍👩‍👦 Parents Guide</a>
          <a href="/about">ℹ️ About</a>
          <a href="/privacy" class="privacy-badge">🛡️ Privacy</a>
          <a href="/contact">✉️ Contact</a>
        </nav>
      </div>
    </header>

    <main class="main-content">
      ${content}
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div>
          <p class="footer-brand">KiddoZap &bull; Safe Free Online Games for Kids &amp; Teens</p>
          <p class="footer-copy">&copy; 2026 KiddoZap. All rights reserved. Free browser entertainment.</p>
        </div>
        <div class="footer-links">
          <a href="/">Home</a>
          <a href="/categories">Categories</a>
          <a href="/articles">Articles</a>
          <a href="/parents-guide">Parents Guide</a>
          <a href="/about">About</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </footer>
  </body>
</html>`;
}

// 24 Games Metadata
const GAMES = [
  { slug: 'geo-dash', gameId: 'geodash', title: 'Neon Rhythm Run', icon: '⚡', cat: 'action-reflex', age: 'Age 7+', desc: 'Time your jumps precisely over neon spikes and geometric hazards in this rhythmic obstacle runner.' },
  { slug: 'snake', gameId: 'snake', title: 'Snake Neon Classic', icon: '🐍', cat: 'arcade-retro', age: 'Age 5+', desc: 'Steer the glowing serpent, collect energy pellets and grow without crashing into walls or yourself.' },
  { slug: 'math-sprint', gameId: 'math-sprint', title: 'Math Sprint Blitz', icon: '🔢', cat: 'math', age: 'Age 6+', desc: 'Solve rapid arithmetic equations against a ticking clock to build number automaticity.' },
  { slug: 'memory-match', gameId: 'memory-match', title: 'Memory Match Cards', icon: '🧠', cat: 'brain-puzzles', age: 'Age 4+', desc: 'Flip colorful cards to discover matching pairs in minimal moves and train visual recall.' },
  { slug: 'sudoku', gameId: 'sudoku', title: 'Sudoku Kids & Teens', icon: '🧩', cat: 'math', age: 'Age 8+', desc: 'Fill grid squares with numbers 1-9 without duplicate rows, columns or boxes using pure logic.' },
  { slug: 'tic-tac-toe', gameId: 'tic-tac-toe', title: 'Tic Tac Toe Neon', icon: '❌', cat: 'brain-puzzles', age: 'Age 4+', desc: 'Match 3 in a row vs Smart Bot or play locally with a friend on a glowing cyber board.' },
  { slug: 'flappy-hero', gameId: 'flappy-hero', title: 'Flap Hero', icon: '🐥', cat: 'action-reflex', age: 'Age 6+', desc: 'Tap to flap your wings and weave gracefully through pipe obstacles with smooth physics.' },
  { slug: 'brick-breaker', gameId: 'brick-breaker', title: 'Brick Breaker Neon', icon: '🧱', cat: 'arcade-retro', age: 'Age 6+', desc: 'Bounce the laser ball off your paddle to shatter colorful cyber bricks.' },
  { slug: 'bubble-shooter', gameId: 'bubble-shooter', title: 'Bubble Shooter Pop', icon: '🫧', cat: 'brain-puzzles', age: 'Age 5+', desc: 'Aim and fire colored bubbles to form matching clusters of 3 or more.' },
  { slug: 'piano-tiles', gameId: 'piano-tiles', title: 'Magic Piano Tiles', icon: '🎹', cat: 'little-kids', age: 'Age 4+', desc: 'Tap falling melody keys on rhythm to play beautiful songs without missing.' },
  { slug: 'color-switch', gameId: 'color-switch', title: 'Color Gate Arena', icon: '🎨', cat: 'action-reflex', age: 'Age 7+', desc: 'Bounce the ball through obstacle gates that strictly match its current color.' },
  { slug: 'whack-a-mole', gameId: 'whack-a-mole', title: 'Whack-A-Mole Reflex', icon: '🔨', cat: 'action-reflex', age: 'Age 4+', desc: 'Tap mischievous moles as they pop up from their holes before they duck back down.' },
  { slug: 'fruit-slice', gameId: 'fruit-slice', title: 'Fruit Slice Ninja', icon: '🍉', cat: 'action-reflex', age: 'Age 6+', desc: 'Swipe your blade across juicy tossed fruits while avoiding dangerous bombs.' },
  { slug: 'connect-four', gameId: 'connect-four', title: 'Four in a Line', icon: '🔴', cat: 'brain-puzzles', age: 'Age 5+', desc: 'Drop colored discs into the vertical grid to form 4 in a horizontal, vertical or diagonal row.' },
  { slug: 'space-invaders', gameId: 'space-invaders', title: 'Galaxy Defender', icon: '👾', cat: 'arcade-retro', age: 'Age 7+', desc: 'Defend planet Earth from descending alien fleets with your starfighter cannon.' },
  { slug: 'pac-maze', gameId: 'pac-maze', title: 'Neon Maze Runner', icon: '🟡', cat: 'arcade-retro', age: 'Age 6+', desc: 'Chomp glowing cyber dots through the labyrinth while dodging roving patrol bots.' },
  { slug: 'aim-trainer', gameId: 'aim-trainer', title: 'Aim Reflex Trainer', icon: '🎯', cat: 'action-reflex', age: 'Age 8+', desc: 'Sharpen target acquisition speed and pointer accuracy across dynamic targets.' },
  { slug: 'crossy-road', gameId: 'crossy-road', title: 'Hop and Cross', icon: '🐸', cat: 'arcade-retro', age: 'Age 5+', desc: 'Hop across busy highways, floating river logs, and speeding train tracks.' },
  { slug: 'nursery-rhymes', gameId: 'nursery-rhymes', title: 'Nursery Rhymes Jukebox', icon: '🎵', cat: 'little-kids', age: 'Age 2-6', desc: 'Interactive soundboard with joyful melodies: Twinkle Little Star, Wheels on the Bus & more.' },
  { slug: 'rooftop-parkour', gameId: 'rooftop-parkour', title: 'Rooftop Parkour Rush', icon: '🏃', cat: 'action-reflex', age: 'Age 8+', desc: 'Sprint across city rooftops, slide under billboards, and vault across dizzying gaps.' },
  { slug: 'jetpack-raider', gameId: 'jetpack-raider', title: 'Jetpack Raider', icon: '🚀', cat: 'action-reflex', age: 'Age 7+', desc: 'Thrust through subterranean caverns, dodge laser zappers, and collect gold coins.' },
  { slug: 'slope-run', gameId: 'slope-run', title: '3D Slope Cyber Run', icon: '🌐', cat: 'action-reflex', age: 'Age 8+', desc: 'Roll your sphere down an endless twisting slope platform at accelerating speeds.' },
  { slug: 'tunnel-rush', gameId: 'tunnel-rush', title: 'Speed Tunnel Dash', icon: '🌀', cat: 'action-reflex', age: 'Age 8+', desc: 'Barrel roll through a kaleidoscope 3D tube dodging spinning geometric barriers.' },
  { slug: 'moto-x3m', gameId: 'moto-x3m', title: 'Stunt Biker Challenge', icon: '🏍️', cat: 'action-reflex', age: 'Age 8+', desc: 'Accelerate over ramps, balance your bike in mid-air, and stick thrilling stunt landings.' }
];

// 6 Educational Articles
const ARTICLES = [
  {
    slug: 'benefits-of-puzzle-games-for-kids-brain-development',
    title: '10 Proven Benefits of Logic & Puzzle Games for Kids Brain Development',
    desc: 'How regular engagement with Sudoku, card memory, and spatial puzzles sharpens working memory and deductive logic in school-age children.'
  },
  {
    slug: 'how-math-games-improve-arithmetic-speed-and-accuracy',
    title: 'How Math Games Improve Arithmetic Speed and Reduce Math Anxiety',
    desc: 'Evidence-based strategies using timed arithmetic sprints to replace drill fatigue with positive feedback loops and confidence.'
  },
  {
    slug: 'healthy-screen-time-rules-for-kids-and-teens',
    title: 'Healthy Screen Time Rules: A Balanced Practical Guide for Families',
    desc: 'Practical, science-backed routines for establishing healthy digital boundaries without daily household conflict.'
  },
  {
    slug: 'classroom-brain-breaks-guide-for-teachers',
    title: 'Classroom Brain Breaks: Fast 3-Minute Cognitive Exercises for Teachers',
    desc: 'Short, non-disruptive logic challenges teachers can use between subjects to reset student focus and engagement.'
  },
  {
    slug: 'hand-eye-coordination-and-reflex-training-in-teens',
    title: 'Developing Hand-Eye Coordination and Reflex Speed in Young Gamers',
    desc: 'How motor timing, spatial prediction, and rhythmic games reinforce neural motor pathways.'
  },
  {
    slug: 'safe-gaming-without-chat-or-purchases',
    title: 'Safe Online Gaming: Why No-Chat & No-Purchase Platforms Protect Kids',
    desc: 'An educator-led breakdown of predatory gaming monetization and why sandbox-only web games keep young players safe.'
  }
];

// Generate CSS
ensureDir(PUBLIC_DIR);
fs.writeFileSync(path.join(PUBLIC_DIR, 'site.css'), `
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background-color: #0b0f19;
  color: #e2e8f0;
  font-family: 'Nunito', system-ui, -apple-system, sans-serif;
  line-height: 1.6;
}
.site-header {
  background: rgba(11, 15, 25, 0.95);
  border-bottom: 1px solid #1e293b;
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 12px 20px;
}
.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.brand-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
.brand-icon { font-size: 24px; }
.brand-name {
  font-size: 22px;
  font-weight: 900;
  background: linear-gradient(90deg, #38bdf8, #818cf8, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.nav-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  transition: color 0.2s;
}
.nav-links a:hover { color: #ffffff; }
.privacy-badge {
  color: #34d399 !important;
  background: rgba(16, 185, 129, 0.15);
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.main-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px;
}
.game-card-static {
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 28px;
}
.iframe-container {
  width: 100%;
  height: 520px;
  border: 2px solid #38bdf8;
  border-radius: 16px;
  overflow: hidden;
  margin: 20px 0;
  background: #000;
}
.iframe-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}
.site-footer {
  background: #020617;
  border-top: 1px solid #1e293b;
  padding: 32px 20px;
  font-size: 12px;
  color: #64748b;
  margin-top: 60px;
}
.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.footer-brand { color: #ffffff; font-weight: 800; margin-bottom: 4px; }
.footer-copy { font-size: 11px; }
.footer-links { display: flex; gap: 14px; flex-wrap: wrap; }
.footer-links a { color: #38bdf8; text-decoration: none; font-weight: 700; }
h1 { font-size: 32px; font-weight: 900; margin-bottom: 12px; color: #fff; }
h2 { font-size: 24px; font-weight: 800; margin: 24px 0 12px; color: #38bdf8; }
p { margin-bottom: 16px; font-size: 15px; color: #cbd5e1; }
ul { margin-bottom: 20px; padding-left: 24px; }
li { margin-bottom: 8px; color: #cbd5e1; }
`);

// Generate Game Pages
GAMES.forEach(game => {
  const dir = path.join(PUBLIC_DIR, 'games', game.slug);
  ensureDir(dir);
  const content = `
    <div class="game-card-static">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
        <span style="font-size:36px;">${game.icon}</span>
        <div>
          <h1>${game.title}</h1>
          <p style="margin:0; font-size:13px; color:#38bdf8; font-weight:800;">${game.age} &bull; ${game.cat.toUpperCase()}</p>
        </div>
      </div>
      <p>${game.desc}</p>
      
      <div class="iframe-container">
        <iframe src="/?game=${game.gameId}&embed=1" title="${game.title}" allow="autoplay"></iframe>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <a href="/?game=${game.gameId}" style="display:inline-block; padding:10px 20px; background:#0284c7; color:#fff; font-weight:800; border-radius:12px; text-decoration:none;">
          Launch Fullscreen ⚡
        </a>
        <a href="/" style="color:#94a3b8; text-decoration:none; font-weight:700;">
          ← Browse All 24+ Games
        </a>
      </div>
    </div>

    <h2>How to Play &amp; Strategy</h2>
    <p>Enjoy ${game.title} directly in your browser without downloads or signups. Practice regularly to improve reaction latency and strategic focus.</p>

    <h2>Cognitive &amp; Brain Benefits</h2>
    <ul>
      <li>Stimulates neural pathways involved in rapid spatial orientation.</li>
      <li>Improves visual-motor processing speed and precision.</li>
      <li>Encourages delayed gratification and sustained problem-solving.</li>
    </ul>
  `;

  fs.writeFileSync(
    path.join(dir, 'index.html'),
    renderHtmlPage({
      title: `${game.title} - Play Free Online at KiddoZap`,
      description: game.desc,
      canonicalUrl: `https://kiddozap.com/games/${game.slug}`,
      content
    })
  );
});

// Generate Articles Pages
ensureDir(path.join(PUBLIC_DIR, 'articles'));
ARTICLES.forEach(art => {
  const dir = path.join(PUBLIC_DIR, 'articles', art.slug);
  ensureDir(dir);
  const content = `
    <h1>${art.title}</h1>
    <p style="font-size:13px; color:#38bdf8; font-weight:800; margin-bottom:24px;">Published by KiddoZap Educational Guides &bull; Free For Classroom &amp; Home</p>
    <p>${art.desc}</p>
    <h2>Key Insights &amp; Practical Application</h2>
    <p>Regular engagement with structured, non-violent browser games offers cognitive benefits far exceeding passive media consumption. Young minds thrive on interactive feedback loops that celebrate incremental improvement.</p>
    <ul>
      <li>Cognitive Load Management: Clear visual hierarchies keep students engaged without sensory overwhelm.</li>
      <li>Immediate Formative Feedback: Solving a puzzle or beating a high score builds intrinsic motivation.</li>
      <li>Safe Digital Environment: KiddoZap operates without chats, friend requests, or monetary mechanics.</li>
    </ul>
    <h2>Recommended Daily Practice</h2>
    <p>We recommend 20 to 30 minutes of interactive gameplay followed by physical movement. Check out our <a href="/" style="color:#38bdf8;">game catalog</a> to choose suitable games for each grade level.</p>
  `;

  fs.writeFileSync(
    path.join(dir, 'index.html'),
    renderHtmlPage({
      title: `${art.title} | KiddoZap Educational Guides`,
      description: art.desc,
      canonicalUrl: `https://kiddozap.com/articles/${art.slug}`,
      content
    })
  );
});

// Articles Hub
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'articles', 'index.html'),
  renderHtmlPage({
    title: 'Educational Articles & Gaming Science | KiddoZap',
    description: 'Evidence-based guides on kids screen time, puzzle benefits, arithmetic drills, and classroom brain breaks.',
    canonicalUrl: 'https://kiddozap.com/articles',
    content: `
      <h1>Educational Gaming Guides &amp; Insights</h1>
      <p>Research-grounded articles for parents, teachers, and curious students on how games enhance learning and cognitive agility.</p>
      <div style="display:grid; gap:18px; margin-top:24px;">
        ${ARTICLES.map(a => `
          <div style="background:#111827; border:1px solid #1f2937; border-radius:16px; padding:20px;">
            <h3 style="margin-bottom:8px;"><a href="/articles/${a.slug}" style="color:#38bdf8; text-decoration:none;">${a.title}</a></h3>
            <p style="margin:0; font-size:14px; color:#94a3b8;">${a.desc}</p>
          </div>
        `).join('')}
      </div>
    `
  })
);

// Games Hub
ensureDir(path.join(PUBLIC_DIR, 'games'));
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'games', 'index.html'),
  renderHtmlPage({
    title: 'All Free Kids Games & Guides | KiddoZap',
    description: 'Complete directory of 24+ non-violent browser games for kids and teens from Class 1 to 12.',
    canonicalUrl: 'https://kiddozap.com/games',
    content: `
      <h1>Complete Game Directory</h1>
      <p>Select any game below to view its controls, pedagogical objectives, and launch the interactive playable game directly.</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:16px; margin-top:24px;">
        ${GAMES.map(g => `
          <div style="background:#111827; border:1px solid #1f2937; border-radius:16px; padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="font-size:32px; margin-bottom:8px;">${g.icon}</div>
              <h3 style="margin-bottom:6px;"><a href="/games/${g.slug}" style="color:#fff; text-decoration:none;">${g.title}</a></h3>
              <p style="font-size:12px; color:#94a3b8; margin-bottom:12px;">${g.desc}</p>
            </div>
            <a href="/games/${g.slug}" style="display:block; text-align:center; padding:8px; background:#0284c7; color:#fff; border-radius:10px; text-decoration:none; font-weight:800; font-size:12px;">View Guide &amp; Play</a>
          </div>
        `).join('')}
      </div>
    `
  })
);

// Categories Hub
ensureDir(path.join(PUBLIC_DIR, 'categories'));
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'categories', 'index.html'),
  renderHtmlPage({
    title: 'Game Categories & Curriculum Alignment | KiddoZap',
    description: 'Browse games by category: Brain Puzzles, Action & Reflex, Arcade Retro, Math & Logic, and Little Kids.',
    canonicalUrl: 'https://kiddozap.com/categories',
    content: `
      <h1>Curriculum &amp; Skill Categories</h1>
      <p>Discover games tailored to specific cognitive skills and learning stages.</p>
      <div style="display:grid; gap:16px; margin-top:20px;">
        <div style="background:#111827; padding:20px; border-radius:16px; border:1px solid #1f2937;">
          <h2>🧩 Brain &amp; Puzzles</h2>
          <p>Sudoku, Memory Match, Tic-Tac-Toe, and Four in a Line build patience, spatial visualization, and deductive logic.</p>
        </div>
        <div style="background:#111827; padding:20px; border-radius:16px; border:1px solid #1f2937;">
          <h2>🔢 Math &amp; Logic</h2>
          <p>Fast mental arithmetic sprints, number bonds, and sequential puzzles for Class 1 to 8.</p>
        </div>
        <div style="background:#111827; padding:20px; border-radius:16px; border:1px solid #1f2937;">
          <h2>🚀 Action &amp; Reflex</h2>
          <p>Neon Rhythm Run, Flap Hero, Aim Trainer, and Whack-a-Mole train motor latency and auditory timing.</p>
        </div>
        <div style="background:#111827; padding:20px; border-radius:16px; border:1px solid #1f2937;">
          <h2>👾 Arcade &amp; Retro</h2>
          <p>Neon Snake, Brick Breaker, and Galaxy Defender provide classic arcade fun with smooth modern controls.</p>
        </div>
      </div>
    `
  })
);

// Parents Guide
ensureDir(path.join(PUBLIC_DIR, 'parents-guide'));
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'parents-guide', 'index.html'),
  renderHtmlPage({
    title: 'Parents & Educators Guide | KiddoZap',
    description: 'Guidelines on screen time, child online safety, non-violence, and zero tracking on KiddoZap.',
    canonicalUrl: 'https://kiddozap.com/parents-guide',
    content: `
      <h1>Parents &amp; Educators Guide</h1>
      <p>KiddoZap was founded to provide a clean, secure, and educational online space for children and teens.</p>
      <h2>Zero Personal Data Collected</h2>
      <p>We do not collect names, email addresses, phone numbers, or passwords. Children can play immediately without registering an account.</p>
      <h2>Safe Content Guarantee</h2>
      <p>All 24+ games feature non-violent, colorful themes. There are no multiplayer chat rooms or open message boards, keeping children safe from online strangers.</p>
      <h2>Balanced Screen Time</h2>
      <p>We suggest limiting gaming to 20-30 minute focused intervals followed by outdoor play and homework.</p>
    `
  })
);

// About Us
ensureDir(path.join(PUBLIC_DIR, 'about'));
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'about', 'index.html'),
  renderHtmlPage({
    title: 'About KiddoZap | Free Educational Games',
    description: 'About KiddoZap and our mission to provide high quality non-violent browser games.',
    canonicalUrl: 'https://kiddozap.com/about',
    content: `
      <h1>About KiddoZap</h1>
      <p>KiddoZap is an independent browser gaming platform dedicated to providing safe, enriching, and joyful games for children and teens worldwide.</p>
      <h2>Founder &amp; Engineering</h2>
      <p>KiddoZap is created and maintained by Ashish Pal, focusing on high-speed web performance, clean design, and educational value.</p>
      <h2>Contact Us</h2>
      <p>Questions or suggestions? Write to us anytime at <a href="mailto:support@kiddozap.com" style="color:#38bdf8;">support@kiddozap.com</a>.</p>
    `
  })
);

// Contact
ensureDir(path.join(PUBLIC_DIR, 'contact'));
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'contact', 'index.html'),
  renderHtmlPage({
    title: 'Contact Support & Feedback | KiddoZap',
    description: 'Get in touch with the KiddoZap team for questions, suggestions, or support.',
    canonicalUrl: 'https://kiddozap.com/contact',
    content: `
      <h1>Contact &amp; Support</h1>
      <p>We value parent, teacher, and student feedback!</p>
      <div style="background:#111827; padding:24px; border-radius:16px; border:1px solid #1f2937; margin-top:20px;">
        <h3 style="color:#38bdf8; margin-bottom:8px;">Direct Support Email</h3>
        <p style="font-size:20px; font-weight:900;"><a href="mailto:support@kiddozap.com" style="color:#fff; text-decoration:none;">support@kiddozap.com</a></p>
        <p style="font-size:13px; color:#94a3b8; margin-top:8px;">We respond to all genuine inquiries within 24-48 business hours.</p>
      </div>
    `
  })
);

// Privacy
ensureDir(path.join(PUBLIC_DIR, 'privacy'));
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'privacy', 'index.html'),
  renderHtmlPage({
    title: 'Privacy Policy | KiddoZap',
    description: 'Privacy Policy for KiddoZap games and educational portal.',
    canonicalUrl: 'https://kiddozap.com/privacy',
    content: `
      <h1>Privacy Policy</h1>
      <p>Last updated: October 2026</p>
      <h2>1. Overview</h2>
      <p>KiddoZap values the privacy of young players and families. We do not require accounts, logins, or personal details.</p>
      <h2>2. Data Collection</h2>
      <p>We do not collect personal identifying information (PII) like names, emails, addresses, or phone numbers.</p>
      <h2>3. Advertisements</h2>
      <p>We use Google AdSense to serve family-appropriate non-personalized ads to support the free platform.</p>
      <h2>4. Inquiries</h2>
      <p>Contact us at <a href="mailto:support@kiddozap.com" style="color:#38bdf8;">support@kiddozap.com</a>.</p>
    `
  })
);

// Terms
ensureDir(path.join(PUBLIC_DIR, 'terms'));
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'terms', 'index.html'),
  renderHtmlPage({
    title: 'Terms of Service | KiddoZap',
    description: 'Terms of Service for using KiddoZap games.',
    canonicalUrl: 'https://kiddozap.com/terms',
    content: `
      <h1>Terms of Service</h1>
      <p>Last updated: October 2026</p>
      <p>By accessing KiddoZap, you agree to these terms. All games are provided free of charge for personal and classroom educational use.</p>
    `
  })
);

// Sitemap
const urls = [
  'https://kiddozap.com/',
  'https://kiddozap.com/games',
  'https://kiddozap.com/categories',
  'https://kiddozap.com/articles',
  'https://kiddozap.com/parents-guide',
  'https://kiddozap.com/about',
  'https://kiddozap.com/privacy',
  'https://kiddozap.com/terms',
  'https://kiddozap.com/contact',
  ...GAMES.map(g => `https://kiddozap.com/games/${g.slug}`),
  ...ARTICLES.map(a => `https://kiddozap.com/articles/${a.slug}`)
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u}</loc>
    <lastmod>2026-10-11</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u === 'https://kiddozap.com/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml);

console.log('Successfully generated all content, static pages, and sitemap.xml!');
