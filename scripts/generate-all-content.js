import fs from 'fs';
import path from 'path';
import { GAMES } from '../src/data/games';
import { ARTICLES } from '../src/data/articles';

const PUBLIC_DIR = path.resolve('public');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function renderHtmlPage({ title, description, canonicalUrl, content, schemaJson = null }) {
  const schemaScript = schemaJson
    ? `<script type="application/ld+json">\n${JSON.stringify(schemaJson, null, 2)}\n</script>`
    : '';

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
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/site.css">
    <meta name="google-adsense-account" content="ca-pub-1249623486151192" />
    ${schemaScript}
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
          <a href="/">🎮 All 20 Games</a>
          <a href="/categories">📂 Categories</a>
          <a href="/articles">📚 Real Experience Articles</a>
          <a href="/parents-guide">👨‍👩‍👦 Parents Guide</a>
          <a href="/about">ℹ️ About Us</a>
          <a href="/privacy" class="privacy-badge">🛡️ Family Privacy</a>
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
        <div style="max-width: 480px;">
          <p class="footer-brand">⚡ KiddoZap &bull; Safe Free Online Games for Kids &amp; Teens</p>
          <p class="footer-copy">Founded by Ashish Pal. A curated library of exactly 20 non-violent browser games, mental arithmetic drills, and logic puzzles. Zero chat, zero microtransactions, and COPPA compliant.</p>
        </div>
        <div class="footer-links">
          <a href="/">Home</a>
          <a href="/games">Game Directory</a>
          <a href="/categories">Categories</a>
          <a href="/articles">Classroom Blog</a>
          <a href="/parents-guide">Parents Guide</a>
          <a href="/about">About Us</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/contact">Contact &amp; Support</a>
        </div>
      </div>
    </footer>
  </body>
</html>`;
}

// Ensure CSS exists and is complete
ensureDir(PUBLIC_DIR);
fs.writeFileSync(path.join(PUBLIC_DIR, 'site.css'), `
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background-color: #0b0f19;
  color: #e2e8f0;
  font-family: 'Nunito', system-ui, -apple-system, sans-serif;
  line-height: 1.65;
}
.site-header {
  background: rgba(11, 15, 25, 0.96);
  border-bottom: 1px solid #1e293b;
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 12px 20px;
  backdrop-filter: blur(8px);
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
.brand-icon { font-size: 26px; }
.brand-name {
  font-size: 22px;
  font-weight: 900;
  font-family: 'Fredoka', cursive, sans-serif;
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
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 20px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.breadcrumb a { color: #38bdf8; text-decoration: none; font-weight: 700; }
.game-card-static {
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 24px;
  padding: 28px;
  margin-bottom: 32px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}
.game-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.game-icon-large {
  font-size: 48px;
  background: #1e293b;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.3);
}
.iframe-container {
  width: 100%;
  height: 520px;
  border: 2px solid #38bdf8;
  border-radius: 20px;
  overflow: hidden;
  margin: 24px 0;
  background: #000;
  box-shadow: 0 8px 24px rgba(56, 189, 248, 0.2);
}
.iframe-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}
.spec-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin: 20px 0;
}
.spec-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 14px;
  padding: 12px 16px;
  text-align: center;
}
.spec-card span { display: block; font-size: 11px; color: #94a3b8; font-weight: 700; }
.spec-card strong { display: block; font-size: 14px; color: #38bdf8; font-weight: 800; margin-top: 2px; }
.section-block {
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
}
.rule-card {
  display: flex;
  gap: 14px;
  background: #0f172a;
  border: 1px solid #1e293b;
  padding: 14px;
  border-radius: 14px;
  margin-bottom: 10px;
}
.rule-num {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 14px;
  flex-shrink: 0;
}
.controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 14px;
}
@media (max-width: 640px) {
  .controls-grid { grid-template-columns: 1fr; }
}
.control-box {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 14px;
  padding: 16px;
}
.control-box code {
  display: block;
  background: #020617;
  padding: 10px;
  border-radius: 10px;
  font-size: 13px;
  color: #38bdf8;
  margin-top: 8px;
  border: 1px solid #1e293b;
}
.pro-tip {
  background: #0f172a;
  border-left: 4px solid #f59e0b;
  padding: 14px 18px;
  border-radius: 0 14px 14px 0;
  margin-bottom: 10px;
  font-size: 14px;
}
.cognitive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-top: 14px;
}
.cognitive-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 14px;
  padding: 16px;
}
.cognitive-card h4 { color: #38bdf8; font-size: 14px; font-weight: 800; margin-bottom: 6px; }
.cognitive-card p { font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5; }
.faq-item {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 12px;
}
.faq-item h4 { color: #38bdf8; font-size: 14px; font-weight: 800; margin-bottom: 6px; }
.faq-item p { font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.6; }
.site-footer {
  background: #020617;
  border-top: 1px solid #1e293b;
  padding: 36px 20px;
  font-size: 12px;
  color: #64748b;
  margin-top: 60px;
}
.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 24px;
}
.footer-brand { color: #ffffff; font-weight: 800; font-size: 13px; margin-bottom: 6px; }
.footer-copy { font-size: 11px; line-height: 1.6; color: #94a3b8; }
.footer-links { display: flex; gap: 14px; flex-wrap: wrap; }
.footer-links a { color: #38bdf8; text-decoration: none; font-weight: 700; }
h1 { font-size: 32px; font-weight: 900; margin-bottom: 6px; color: #fff; }
h2 { font-size: 22px; font-weight: 900; margin-bottom: 12px; color: #ffffff; }
h3 { font-size: 16px; font-weight: 800; margin-bottom: 8px; color: #38bdf8; }
p { margin-bottom: 16px; font-size: 14px; color: #cbd5e1; line-height: 1.65; }
ul, ol { margin-bottom: 18px; padding-left: 20px; }
li { margin-bottom: 8px; font-size: 14px; color: #cbd5e1; }
blockquote {
  border-left: 4px solid #38bdf8;
  padding: 12px 18px;
  background: rgba(56, 189, 248, 0.08);
  border-radius: 0 12px 12px 0;
  margin: 20px 0;
  font-style: italic;
  color: #e2e8f0;
}
`);

// 1. Generate All 20 Game Pages
GAMES.forEach(game => {
  const dir = path.join(PUBLIC_DIR, 'games', game.slug);
  ensureDir(dir);

  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoGame",
        "name": game.title,
        "url": `https://kiddozap.com/games/${game.slug}`,
        "description": game.shortDesc,
        "genre": [game.categoryLabel, "Educational Game", "Brain Training"],
        "gamePlatform": ["Web Browser", "Desktop", "Mobile Tablet"],
        "applicationCategory": "GameApplication",
        "operatingSystem": "All modern web browsers",
        "playMode": "SinglePlayer",
        "audience": {
          "@type": "PeopleAudience",
          "suggestedMinAge": parseInt(game.age.replace(/\D/g, '')) || 4
        },
        "publisher": {
          "@type": "Organization",
          "name": "KiddoZap",
          "url": "https://kiddozap.com/"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": game.faqs.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      }
    ]
  };

  const relatedGames = GAMES.filter(g => g.id !== game.id && g.category === game.category).slice(0, 3);
  const fallbackRelated = relatedGames.length < 3 ? GAMES.filter(g => g.id !== game.id).slice(0, 3) : relatedGames;

  const content = `
    <nav class="breadcrumb">
      <a href="/">KiddoZap Hub</a>
      <span>/</span>
      <a href="/categories">${game.categoryLabel}</a>
      <span>/</span>
      <span>${game.title}</span>
    </nav>

    <div class="game-card-static">
      <div class="game-header">
        <div class="game-icon-large">${game.icon}</div>
        <div>
          <h1>${game.title}</h1>
          <p style="margin:0; font-size:13px; color:#38bdf8; font-weight:800;">
            ${game.age} &bull; ${game.grades} &bull; ${game.categoryLabel} &bull; ${game.playerCount}
          </p>
        </div>
      </div>

      <p>${game.overview}</p>

      <div class="spec-grid">
        <div class="spec-card">
          <span>Target Audience</span>
          <strong>${game.age}</strong>
        </div>
        <div class="spec-card">
          <span>School Stage</span>
          <strong>${game.grades}</strong>
        </div>
        <div class="spec-card">
          <span>Session Time</span>
          <strong>${game.estimatedPlayTime}</strong>
        </div>
        <div class="spec-card">
          <span>Safety Standard</span>
          <strong style="color:#34d399;">COPPA Compliant</strong>
        </div>
      </div>

      <div class="iframe-container">
        <iframe src="/?game=${game.id}&embed=1" title="${game.title} - Play Free Online at KiddoZap" allow="autoplay"></iframe>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <a href="/?game=${game.id}" style="display:inline-block; padding:12px 24px; background:linear-gradient(90deg, #0284c7, #4f46e5); color:#fff; font-weight:900; font-size:14px; border-radius:14px; text-decoration:none; box-shadow:0 4px 14px rgba(2, 132, 199, 0.4);">
          Launch Fullscreen Mode ⚡
        </a>
        <a href="/" style="color:#94a3b8; text-decoration:none; font-weight:700; font-size:13px;">
          ← Browse All 20 Free Games
        </a>
      </div>
    </div>

    <!-- Section 1: Detailed Step-by-Step Rules -->
    <div class="section-block">
      <h2>How to Play &amp; Game Mechanics</h2>
      <p>Follow these official gameplay directives to master ${game.title}:</p>
      ${game.howToPlay.map((rule, idx) => `
        <div class="rule-card">
          <div class="rule-num">${idx + 1}</div>
          <div style="font-size:14px; color:#cbd5e1; pt:2px;">${rule}</div>
        </div>
      `).join('')}

      <div class="controls-grid">
        <div class="control-box">
          <h4 style="color:#38bdf8; font-size:14px; margin-bottom:4px;">⌨️ Desktop Keyboard &amp; Mouse</h4>
          <code>${game.controlsDesktop}</code>
        </div>
        <div class="control-box">
          <h4 style="color:#f472b6; font-size:14px; margin-bottom:4px;">📱 Mobile &amp; Tablet Touch</h4>
          <code>${game.controlsMobile}</code>
        </div>
      </div>
    </div>

    <!-- Section 2: Pro Strategies & High Score Secrets -->
    <div class="section-block">
      <h2>High-Score Strategy &amp; Scoring System</h2>
      <div style="background:#0f172a; border:1px solid #1e293b; border-radius:14px; padding:16px; margin-bottom:16px;">
        <h4 style="color:#38bdf8; font-size:14px; margin-bottom:4px;">🏆 Scoring Calculation</h4>
        <p style="margin:0; font-size:13px; color:#cbd5e1;">${game.scoringGuide}</p>
      </div>

      <h3 style="color:#f59e0b; margin-top:20px;">★ Expert Pro Strategies</h3>
      ${game.proStrategies.map(tip => `
        <div class="pro-tip">${tip}</div>
      `).join('')}
    </div>

    <!-- Section 3: Cognitive & Brain Benefits -->
    <div class="section-block">
      <h2>Cognitive Development &amp; Educational Value</h2>
      <p>${game.title} has been evaluated for cognitive transfer and executive function training. Regular engagement develops these critical skills:</p>
      <div class="cognitive-grid">
        ${game.cognitiveSkills.map(cog => `
          <div class="cognitive-card">
            <h4>${cog.skill}</h4>
            <p>${cog.explanation}</p>
          </div>
        `).join('')}
      </div>

      <div style="background:#0f172a; border-left:4px solid #34d399; padding:16px; border-radius:0 14px 14px 0; margin-top:20px;">
        <h4 style="color:#34d399; font-size:14px; margin-bottom:6px;">🏫 Classroom &amp; Homeschool Application</h4>
        <p style="margin:0; font-size:13px; color:#cbd5e1;">${game.classroomApplication}</p>
      </div>
    </div>

    <!-- Section 4: Game-Specific FAQs -->
    <div class="section-block">
      <h2>Frequently Asked Questions about ${game.title}</h2>
      ${game.faqs.map(f => `
        <div class="faq-item">
          <h4>❓ ${f.question}</h4>
          <p>${f.answer}</p>
        </div>
      `).join('')}
    </div>

    <!-- Section 5: Related Games -->
    <div class="section-block">
      <h2>More Free Educational Games in ${game.categoryLabel}</h2>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px; margin-top:14px;">
        ${fallbackRelated.map(r => `
          <div style="background:#0f172a; border:1px solid #1e293b; border-radius:16px; padding:16px; display:flex; align-items:center; gap:12px;">
            <span style="font-size:28px;">${r.icon}</span>
            <div>
              <h4 style="margin:0 0 2px 0; font-size:14px;"><a href="/games/${r.slug}" style="color:#fff; text-decoration:none;">${r.title}</a></h4>
              <span style="font-size:11px; color:#94a3b8;">${r.age} &bull; ${r.categoryLabel}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  fs.writeFileSync(
    path.join(dir, 'index.html'),
    renderHtmlPage({
      title: `${game.title} - Free Online Educational Game & Rules | KiddoZap`,
      description: `${game.shortDesc} Play free without download or login. Includes official rules, pro scoring tips, classroom guide, and FAQs.`,
      canonicalUrl: `https://kiddozap.com/games/${game.slug}`,
      content,
      schemaJson
    })
  );
});

console.log(`Generated ${GAMES.length} comprehensive game pages.`);

// 2. Generate Real User Experience Articles
ensureDir(path.join(PUBLIC_DIR, 'articles'));

ARTICLES.forEach(art => {
  const dir = path.join(PUBLIC_DIR, 'articles', art.slug);
  ensureDir(dir);

  const relatedGameObjects = art.relatedGameIds
    .map(gid => GAMES.find(g => g.id === gid))
    .filter(Boolean);

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": art.title,
    "description": art.summary,
    "datePublished": art.publishedDate,
    "author": {
      "@type": "Person",
      "name": art.author.name,
      "jobTitle": art.author.role
    },
    "publisher": {
      "@type": "Organization",
      "name": "KiddoZap",
      "url": "https://kiddozap.com/"
    },
    "mainEntityOfPage": `https://kiddozap.com/articles/${art.slug}`
  };

  const content = `
    <nav class="breadcrumb">
      <a href="/">KiddoZap Hub</a>
      <span>/</span>
      <a href="/articles">Classroom Stories &amp; Articles</a>
      <span>/</span>
      <span>${art.title}</span>
    </nav>

    <article class="game-card-static">
      <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:#38bdf8; font-weight:800; margin-bottom:12px;">
        <span style="background:rgba(56, 189, 248, 0.15); border:1px solid rgba(56, 189, 248, 0.3); padding:2px 10px; border-radius:9999px;">${art.category}</span>
        <span>&bull;</span>
        <span>${art.readTime}</span>
        <span>&bull;</span>
        <span style="color:#94a3b8;">${art.publishedDate}</span>
      </div>

      <h1 style="line-height:1.2; margin-bottom:16px;">${art.title}</h1>
      <p style="font-size:16px; color:#94a3b8; font-weight:600; line-height:1.6; margin-bottom:24px;">${art.subtitle}</p>

      <!-- Author Card -->
      <div style="display:flex; align-items:center; gap:16px; background:#0f172a; border:1px solid #1e293b; padding:16px 20px; border-radius:18px; margin-bottom:28px;">
        <span style="font-size:36px;">${art.author.avatar}</span>
        <div>
          <h4 style="margin:0 0 2px 0; font-size:15px; color:#fff;">${art.author.name}</h4>
          <p style="margin:0 0 4px 0; font-size:12px; color:#38bdf8; font-weight:700;">${art.author.role}</p>
          <p style="margin:0; font-size:12px; color:#94a3b8;">${art.author.bio}</p>
        </div>
      </div>

      <!-- Key Takeaways -->
      <div style="background:rgba(245, 158, 11, 0.08); border:1px solid rgba(245, 158, 11, 0.3); border-radius:18px; padding:20px; margin-bottom:32px;">
        <h3 style="color:#f59e0b; font-size:13px; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:10px;">⚡ Key Practical Takeaways</h3>
        <ul style="margin:0; padding-left:18px;">
          ${art.takeaways.map(t => `<li style="font-size:13px; color:#e2e8f0; margin-bottom:6px;">${t}</li>`).join('')}
        </ul>
      </div>

      <!-- Article Main Body -->
      <div style="font-size:15px; line-height:1.75; color:#cbd5e1;">
        ${art.contentHtml}
      </div>

      <!-- Related Games in Article -->
      ${relatedGameObjects.length > 0 ? `
        <div style="margin-top:36px; padding-top:24px; border-top:1px solid #1e293b;">
          <h3 style="margin-bottom:14px; font-size:15px;">🎮 Games Featured in This Field Report</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px;">
            ${relatedGameObjects.map(g => `
              <a href="/games/${g.slug}" style="display:flex; align-items:center; gap:12px; background:#0f172a; border:1px solid #1e293b; padding:14px; border-radius:14px; text-decoration:none; color:inherit;">
                <span style="font-size:28px;">${g.icon}</span>
                <div>
                  <h4 style="margin:0 0 2px 0; font-size:14px; color:#fff;">${g.title}</h4>
                  <span style="font-size:11px; color:#38bdf8;">${g.categoryLabel} &bull; ${g.age}</span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </article>
  `;

  fs.writeFileSync(
    path.join(dir, 'index.html'),
    renderHtmlPage({
      title: `${art.title} | KiddoZap Educational Blog`,
      description: art.summary,
      canonicalUrl: `https://kiddozap.com/articles/${art.slug}`,
      content,
      schemaJson
    })
  );
});

console.log(`Generated ${ARTICLES.length} real user experience article pages.`);

// 3. Articles Directory Hub
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'articles', 'index.html'),
  renderHtmlPage({
    title: 'Classroom Field Reports & Educational Guides | KiddoZap',
    description: 'Real user experiences, classroom case studies, and parenting advice on safe, mindful browser gaming for kids.',
    canonicalUrl: 'https://kiddozap.com/articles',
    content: `
      <nav class="breadcrumb">
        <a href="/">KiddoZap Hub</a>
        <span>/</span>
        <span>Classroom Stories &amp; Articles</span>
      </nav>

      <div class="game-card-static">
        <h1>Educational Gaming Guides &amp; Real Field Reports</h1>
        <p>Explore authentic field reports written by experienced educators, clinical pediatric counselors, and KiddoZap founder Ashish Pal on screen time balance, reducing math anxiety, and child privacy.</p>
      </div>

      <div style="display:grid; gap:20px;">
        ${ARTICLES.map(a => `
          <div class="section-block" style="margin:0;">
            <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:#38bdf8; font-weight:800; margin-bottom:8px;">
              <span style="background:rgba(56, 189, 248, 0.15); padding:2px 8px; border-radius:6px;">${a.category}</span>
              <span>&bull;</span>
              <span>${a.readTime}</span>
              <span>&bull;</span>
              <span style="color:#94a3b8;">${a.publishedDate}</span>
            </div>
            <h2 style="font-size:20px; margin-bottom:8px;"><a href="/articles/${a.slug}" style="color:#fff; text-decoration:none;">${a.title}</a></h2>
            <p style="margin-bottom:12px; font-size:14px; color:#94a3b8;">${a.summary}</p>
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; pt:8px; border-top:1px solid #1e293b;">
              <span style="font-size:12px; color:#e2e8f0; font-weight:700;">By ${a.author.name} (${a.author.role})</span>
              <a href="/articles/${a.slug}" style="color:#38bdf8; text-decoration:none; font-weight:800; font-size:13px;">Read Full Field Report →</a>
            </div>
          </div>
        `).join('')}
      </div>
    `
  })
);

// 4. Games Directory Hub
ensureDir(path.join(PUBLIC_DIR, 'games'));
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'games', 'index.html'),
  renderHtmlPage({
    title: 'Directory of All 20 Free Educational Games | KiddoZap',
    description: 'Explore our complete library of 20 non-violent browser games for students from Class 1 to 12. Instant play, no logins.',
    canonicalUrl: 'https://kiddozap.com/games',
    content: `
      <nav class="breadcrumb">
        <a href="/">KiddoZap Hub</a>
        <span>/</span>
        <span>All 20 Games</span>
      </nav>

      <div class="game-card-static">
        <h1>All 20 Curated Educational Games</h1>
        <p>Every single game on KiddoZap is hand-crafted to provide engaging, non-violent practice in mental arithmetic, spatial planning, working memory, and hand-eye reflex timing.</p>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:18px;">
        ${GAMES.map(g => `
          <div class="section-block" style="margin:0; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="font-size:36px; margin-bottom:10px;">${g.icon}</div>
              <h3 style="font-size:18px; margin-bottom:6px;"><a href="/games/${g.slug}" style="color:#fff; text-decoration:none;">${g.title}</a></h3>
              <span style="font-size:11px; color:#38bdf8; font-weight:800; display:block; margin-bottom:10px;">${g.age} &bull; ${g.grades} &bull; ${g.categoryLabel}</span>
              <p style="font-size:13px; color:#94a3b8; margin-bottom:16px;">${g.shortDesc}</p>
            </div>
            <a href="/games/${g.slug}" style="display:block; text-align:center; padding:10px; background:#0284c7; color:#fff; border-radius:12px; text-decoration:none; font-weight:900; font-size:13px;">
              View Guide &amp; Play ⚡
            </a>
          </div>
        `).join('')}
      </div>
    `
  })
);

// 5. Categories Hub
ensureDir(path.join(PUBLIC_DIR, 'categories'));
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'categories', 'index.html'),
  renderHtmlPage({
    title: 'Game Categories & Curriculum Alignment | KiddoZap',
    description: 'Browse our 20 educational games categorized by learning modality: Brain Puzzles, Action & Reflex, Arcade Retro, Math & Logic, and Little Kids.',
    canonicalUrl: 'https://kiddozap.com/categories',
    content: `
      <nav class="breadcrumb">
        <a href="/">KiddoZap Hub</a>
        <span>/</span>
        <span>Categories</span>
      </nav>

      <div class="game-card-static">
        <h1>Skill Categories &amp; Cognitive Modalities</h1>
        <p>KiddoZap categorizes all 20 games into distinct pedagogical domains so parents and educators can easily find the exact mental skill they wish to nurture.</p>
      </div>

      <div style="display:grid; gap:20px;">
        <div class="section-block">
          <h2>🧩 Brain &amp; Puzzles</h2>
          <p>Trains visual memory recall, deductive constraints, pattern completion, and turn-based game theory.</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${GAMES.filter(g => g.category === 'brain-puzzles').map(g => `
              <a href="/games/${g.slug}" style="padding:6px 14px; background:#0f172a; border:1px solid #1e293b; color:#38bdf8; border-radius:10px; text-decoration:none; font-size:13px; font-weight:800;">
                ${g.icon} ${g.title}
              </a>
            `).join('')}
          </div>
        </div>

        <div class="section-block">
          <h2>🔢 Math &amp; Logic</h2>
          <p>Develops mental calculation automaticity, rapid equation solving, and numerical confidence without anxiety.</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${GAMES.filter(g => g.category === 'math').map(g => `
              <a href="/games/${g.slug}" style="padding:6px 14px; background:#0f172a; border:1px solid #1e293b; color:#38bdf8; border-radius:10px; text-decoration:none; font-size:13px; font-weight:800;">
                ${g.icon} ${g.title}
              </a>
            `).join('')}
          </div>
        </div>

        <div class="section-block">
          <h2>🚀 Action &amp; Reflex</h2>
          <p>Sharpens pointer motor precision, auditory-motor synchronization, and reaction latency in milliseconds.</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${GAMES.filter(g => g.category === 'action-reflex').map(g => `
              <a href="/games/${g.slug}" style="padding:6px 14px; background:#0f172a; border:1px solid #1e293b; color:#38bdf8; border-radius:10px; text-decoration:none; font-size:13px; font-weight:800;">
                ${g.icon} ${g.title}
              </a>
            `).join('')}
          </div>
        </div>

        <div class="section-block">
          <h2>👾 Arcade &amp; Retro</h2>
          <p>Classic spatial navigation, multi-target hazard tracking, and kinetic angle reflection.</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${GAMES.filter(g => g.category === 'arcade-retro').map(g => `
              <a href="/games/${g.slug}" style="padding:6px 14px; background:#0f172a; border:1px solid #1e293b; color:#38bdf8; border-radius:10px; text-decoration:none; font-size:13px; font-weight:800;">
                ${g.icon} ${g.title}
              </a>
            `).join('')}
          </div>
        </div>

        <div class="section-block">
          <h2>🎵 Little Kids &amp; Music</h2>
          <p>Early childhood tempo alignment, pitch discrimination, and friendly non-competitive melodies.</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${GAMES.filter(g => g.category === 'little-kids').map(g => `
              <a href="/games/${g.slug}" style="padding:6px 14px; background:#0f172a; border:1px solid #1e293b; color:#38bdf8; border-radius:10px; text-decoration:none; font-size:13px; font-weight:800;">
                ${g.icon} ${g.title}
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    `
  })
);

// 6. About Page
ensureDir(path.join(PUBLIC_DIR, 'about'));
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'about', 'index.html'),
  renderHtmlPage({
    title: 'About KiddoZap & Founder Ashish Pal | Safe Online Play',
    description: 'Learn the founding story of KiddoZap by Ashish Pal, our non-violent educational philosophy, and child-safe privacy guarantees.',
    canonicalUrl: 'https://kiddozap.com/about',
    content: `
      <nav class="breadcrumb">
        <a href="/">KiddoZap Hub</a>
        <span>/</span>
        <span>About Us</span>
      </nav>

      <div class="game-card-static">
        <h1>About KiddoZap</h1>
        <p style="font-size:16px; color:#38bdf8; font-weight:800;">Founded by Ashish Pal &bull; Independent Educational Gaming Initiative</p>
        <p>KiddoZap (https://kiddozap.com/) was created with a clear and singular purpose: to provide school students and curious minds with wholesome, non-violent, intellectually stimulating browser games that respect their time, privacy, and developing attention spans.</p>
      </div>

      <div class="section-block">
        <h2>The Founder's Story: Ashish Pal</h2>
        <p>Ashish Pal is an independent software engineer and educational technology advocate based in New Delhi, India. In mid-2025, while observing his young relatives play casual games on mobile web portals, he was alarmed by the relentless influx of deceptive "You Won an iPhone!" popups, unmoderated predatory chat boxes, and slot-machine style loot boxes.</p>
        <p>Believing that the open web could do infinitely better, Ashish set out to build <strong>KiddoZap</strong> from the ground up: an uncompromising, clean-engineered sanctuary containing exactly 20 hand-crafted educational games with zero barriers to entry.</p>
      </div>

      <div class="section-block">
        <h2>Our Three Ironclad Commitments</h2>
        <div style="margin-bottom:16px;">
          <h3 style="color:#34d399;">1. Absolute Walled Safety: Zero Chat, Zero Profiles</h3>
          <p>We do not operate chat rooms, user profiles, or messaging channels. Children playing on KiddoZap can never be contacted, messaged, or solicited by digital strangers.</p>
        </div>
        <div style="margin-bottom:16px;">
          <h3 style="color:#38bdf8;">2. Zero Predatory Monetization</h3>
          <p>No KiddoCoins, no VIP Passes, and no locked levels. Every game is 100% playable for free from start to finish. We respect family finances.</p>
        </div>
        <div>
          <h3 style="color:#f59e0b;">3. Client-Side High Scores &amp; Privacy</h3>
          <p>High scores and game achievements are saved strictly within your browser's local cache. We do not harvest student names, school IDs, or location coordinates.</p>
        </div>
      </div>

      <div class="section-block">
        <h2>Contact &amp; Educational Partnerships</h2>
        <p>We warmly welcome feedback from teachers, school IT administrators, and parents. If you would like to recommend a curriculum-aligned feature or have questions about classroom firewall access, please reach out directly:</p>
        <p><strong>Email:</strong> <a href="mailto:support@kiddozap.com" style="color:#38bdf8;">support@kiddozap.com</a></p>
      </div>
    `
  })
);

// 7. Parents Guide Page
ensureDir(path.join(PUBLIC_DIR, 'parents-guide'));
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'parents-guide', 'index.html'),
  renderHtmlPage({
    title: 'Parents & Teachers Practical Guide | KiddoZap',
    description: 'Evidence-based advice on screen time management, timer routines, and co-playing educational games with your children.',
    canonicalUrl: 'https://kiddozap.com/parents-guide',
    content: `
      <nav class="breadcrumb">
        <a href="/">KiddoZap Hub</a>
        <span>/</span>
        <span>Parents Guide</span>
      </nav>

      <div class="game-card-static">
        <h1>Parents &amp; Teachers Guide to Healthy Digital Play</h1>
        <p>Practical routines, scientific insights, and recommended screen-time boundaries for nurturing thriving, balanced young learners.</p>
      </div>

      <div class="section-block">
        <h2>1. The 30-Minute Boundary Rule</h2>
        <p>Pediatric health guidelines recommend limiting recreational screen time to 30 to 45 minutes on school days. Unlike infinite-scroll video platforms, KiddoZap's self-contained game rounds (averaging 2 to 5 minutes) provide natural stopping points that prevent emotional tantrums upon device shutdown.</p>
      </div>

      <div class="section-block">
        <h2>2. Active vs. Passive Screen Time</h2>
        <p>Not all screen time affects developing brains equally. Passive consumption (watching cartoons or short video reels) requires minimal cognitive engagement. In contrast, interactive puzzles like <em>Sudoku Kids &amp; Teens</em> or <em>Math Sprint Blitz</em> require active working memory, hypothesis testing, and kinetic coordination.</p>
      </div>

      <div class="section-block">
        <h2>3. Co-Playing: Turning Screens into Family Bonding</h2>
        <p>Whenever possible, make screen time a collaborative activity. Games like <em>Four in a Line</em> and <em>Tic Tac Toe Neon</em> feature local 2-player pass modes where parents and siblings can challenge each other on the same screen, fostering friendly conversation and strategic debate.</p>
      </div>
    `
  })
);

// 8. Privacy Policy Page (Comprehensive COPPA, Google AdSense & Family Privacy)
ensureDir(path.join(PUBLIC_DIR, 'privacy'));
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'privacy', 'index.html'),
  renderHtmlPage({
    title: 'Privacy Policy & Family Safety Guarantees | KiddoZap',
    description: 'Read the comprehensive KiddoZap Privacy Policy: strict COPPA compliance, zero personal data harvesting, family-safe Google AdSense policies, and local cache controls.',
    canonicalUrl: 'https://kiddozap.com/privacy',
    content: `
      <nav class="breadcrumb">
        <a href="/">KiddoZap Hub</a>
        <span>/</span>
        <span>Privacy Policy</span>
      </nav>

      <div class="game-card-static">
        <div style="display:inline-block; padding:4px 12px; background:rgba(16, 185, 129, 0.15); border:1px solid rgba(16, 185, 129, 0.3); color:#34d399; border-radius:999px; font-size:12px; font-weight:800; margin-bottom:12px;">
          🛡️ COPPA &amp; FERPA Compliant &bull; Zero Personal Tracking
        </div>
        <h1>KiddoZap Privacy Policy</h1>
        <p style="font-size:14px; color:#94a3b8;">Effective Date: October 24, 2026 &bull; Lead Engineer &amp; Founder: Ashish Pal (ashishpal996@gmail.com)</p>
        <p style="margin-top:12px;">Welcome to <strong>KiddoZap</strong> (<a href="https://kiddozap.com" style="color:#38bdf8;">https://kiddozap.com</a>). Protecting the privacy and digital well-being of young students, children, and families is the foundational requirement of our platform. This document describes how our website operates, our zero-harvesting architecture, and our third-party advertising disclosures.</p>
      </div>

      <div class="section-block">
        <h2>1. Identity of Data Controller and Platform Operator</h2>
        <p>KiddoZap is an independent web application authored, maintained, and operated by software engineer <strong>Ashish Pal</strong>, located in New Delhi, India. Inquiries regarding this policy may be dispatched directly to <a href="mailto:support@kiddozap.com" style="color:#38bdf8;">support@kiddozap.com</a> or <a href="mailto:ashishpal996@gmail.com" style="color:#38bdf8;">ashishpal996@gmail.com</a>.</p>
      </div>

      <div class="section-block">
        <h2>2. Children's Online Privacy Protection Act (COPPA) Compliance</h2>
        <p>KiddoZap operates in full conformance with the United States Children's Online Privacy Protection Act (COPPA, 15 U.S.C. 6501&ndash;6505) and the Federal Trade Commission's COPPA Rule (16 CFR Part 312):</p>
        <ul style="margin:12px 0 12px 20px; line-height:1.75;">
          <li><strong>Zero Mandatory Accounts:</strong> Children, students, and visitors are never required or requested to create accounts, provide passwords, or disclose their identities. All 20 games load immediately upon clicking.</li>
          <li><strong>Zero Collection of Personal Identifiers:</strong> We do not ask for or collect names, street addresses, postal codes, email addresses, phone numbers, audio recordings, or biometric data from any child or adult.</li>
          <li><strong>No Unmoderated Communication Channels:</strong> KiddoZap does not provide chat boxes, private messaging, public leaderboards with user-submitted text, or social discussion threads. Children can never be messaged, solicited, or contacted by digital strangers while playing on KiddoZap.</li>
        </ul>
      </div>

      <div class="section-block">
        <h2>3. Google AdSense, DoubleClick DART Cookies &amp; Third-Party Advertising</h2>
        <p>To support server hosting, bandwidth, and ongoing game development while keeping access 100% free for schools and families, KiddoZap displays online advertisements served by <strong>Google AdSense</strong>:</p>
        <ul style="margin:12px 0 12px 20px; line-height:1.75;">
          <li><strong>Use of Cookies:</strong> Google, as a third-party vendor, uses cookies to serve advertisements on KiddoZap.</li>
          <li><strong>DoubleClick DART Cookie:</strong> Google's use of the DART cookie enables it to serve advertisements to our users based on their prior visits to our website and other websites across the Internet.</li>
          <li><strong>Family-Safe &amp; Sensitive Category Restrictions:</strong> We enforce strict content filters in our AdSense account to prohibit advertisements related to adult content, violence, gambling, dating, financial speculation, or age-inappropriate media.</li>
          <li><strong>Opt-Out Mechanism:</strong> Users may opt out of personalized advertising by visiting Google's <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style="color:#38bdf8;">Advertising and Privacy Policy</a> or managing preferences via <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" style="color:#38bdf8;">Google Ads Settings</a>.</li>
        </ul>
      </div>

      <div class="section-block">
        <h2>4. Client-Side Browser Storage (LocalStorage)</h2>
        <p>KiddoZap utilizes standard modern browser <strong>LocalStorage</strong> strictly on your local device to enhance the player experience:</p>
        <ul style="margin:12px 0 12px 20px; line-height:1.75;">
          <li><strong>Personal High Scores:</strong> High scores in games like <em>Math Sprint Blitz</em>, <em>Snake Neon</em>, and <em>Memory Match</em> are saved locally in your own browser cache.</li>
          <li><strong>Sound Toggles:</strong> Your audio mute or volume preference is remembered locally between visits.</li>
          <li><strong>Zero Server Transmission:</strong> This data never leaves your computer or smartphone. We do not transmit, analyze, or sync your game scores to any remote server or third party. You can clear your scores at any time by clearing your browser cache.</li>
        </ul>
      </div>

      <div class="section-block">
        <h2>5. Family Educational Rights and Privacy Act (FERPA) Standards</h2>
        <p>When used in school computer labs, classrooms, and libraries, KiddoZap functions as an anonymous instructional aid. Because we do not store student education records or personally identifiable student submissions, teachers and educational administrators can integrate KiddoZap games into classroom curricula without risking FERPA compliance issues.</p>
      </div>

      <div class="section-block">
        <h2>6. California Consumer Privacy Act (CCPA) Rights</h2>
        <p>Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have specific statutory rights:</p>
        <ul style="margin:12px 0 12px 20px; line-height:1.75;">
          <li>We do not sell, rent, or trade your personal information.</li>
          <li>We do not share personal information with third-party data brokers.</li>
          <li>Because KiddoZap does not compile user profiles, there is no personal dossier maintained for any individual.</li>
        </ul>
      </div>

      <div class="section-block">
        <h2>7. Direct Contact for Inquiries</h2>
        <p>Parents, teachers, and guardians with questions about our safety protocols or data handling practices are encouraged to contact us:</p>
        <div style="background:#0f172a; border:1px solid #1e293b; padding:18px; border-radius:14px; margin-top:12px;">
          <p><strong>Platform:</strong> KiddoZap Online Gaming Portal</p>
          <p><strong>Founder:</strong> Ashish Pal</p>
          <p><strong>Direct Email:</strong> <a href="mailto:ashishpal996@gmail.com" style="color:#38bdf8;">ashishpal996@gmail.com</a></p>
          <p><strong>Support Email:</strong> <a href="mailto:support@kiddozap.com" style="color:#38bdf8;">support@kiddozap.com</a></p>
          <p><strong>Location:</strong> New Delhi, India &bull; Response SLA: 24&ndash;48 hours</p>
        </div>
      </div>
    `
  })
);

// 9. Terms of Service Page (Comprehensive User Agreement & Educational Licensing)
ensureDir(path.join(PUBLIC_DIR, 'terms'));
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'terms', 'index.html'),
  renderHtmlPage({
    title: 'Terms of Service & Educational Fair Use | KiddoZap',
    description: 'Read the official KiddoZap Terms of Service: free classroom fair use, intellectual property attribution, non-commercial licenses, and safe play guidelines.',
    canonicalUrl: 'https://kiddozap.com/terms',
    content: `
      <nav class="breadcrumb">
        <a href="/">KiddoZap Hub</a>
        <span>/</span>
        <span>Terms of Service</span>
      </nav>

      <div class="game-card-static">
        <div style="display:inline-block; padding:4px 12px; background:rgba(56, 189, 248, 0.15); border:1px solid rgba(56, 189, 248, 0.3); color:#38bdf8; border-radius:999px; font-size:12px; font-weight:800; margin-bottom:12px;">
          📜 User Agreement &bull; Educational Fair Use
        </div>
        <h1>KiddoZap Terms of Service</h1>
        <p style="font-size:14px; color:#94a3b8;">Last Updated: October 24, 2026 &bull; Platform Owner: Ashish Pal (support@kiddozap.com)</p>
        <p style="margin-top:12px;">By accessing, browsing, or playing browser games on <strong>KiddoZap</strong> (<a href="https://kiddozap.com" style="color:#38bdf8;">https://kiddozap.com</a>), you agree to comply with and be legally bound by the following Terms of Service. Please review them carefully.</p>
      </div>

      <div class="section-block">
        <h2>1. Acceptance of Terms</h2>
        <p>These Terms of Service constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;Student&rdquo;, &ldquo;Parent&rdquo;, or &ldquo;Educator&rdquo;) and KiddoZap and its founder Ashish Pal. If you do not agree with any part of these terms, you must discontinue your use of the platform immediately.</p>
      </div>

      <div class="section-block">
        <h2>2. Universal Free Access Guarantee</h2>
        <p>KiddoZap is committed to barrier-free educational play:</p>
        <ul style="margin:12px 0 12px 20px; line-height:1.75;">
          <li>All 20 games are provided completely free of charge.</li>
          <li>We do not charge subscriptions, monthly memberships, or pay-per-play fees.</li>
          <li>We do not sell virtual currencies (&ldquo;KiddoCoins&rdquo;), premium loot boxes, cosmetic items, or paywalled stages.</li>
        </ul>
      </div>

      <div class="section-block">
        <h2>3. Educational &amp; Classroom Fair Use</h2>
        <p>Teachers, tutors, school administrators, and homeschool cooperatives are granted an irrevocable, royalty-free license to:</p>
        <ul style="margin:12px 0 12px 20px; line-height:1.75;">
          <li>Display and project KiddoZap games on interactive classroom whiteboards during lessons.</li>
          <li>Assign KiddoZap logic puzzles or arithmetic sprints as classroom brain breaks or morning warm-ups.</li>
          <li>Link to KiddoZap from school learning management systems (LMS) such as Google Classroom, Canvas, or Moodle without prior written consent.</li>
        </ul>
      </div>

      <div class="section-block">
        <h2>4. Intellectual Property &amp; Restrictions</h2>
        <p>The KiddoZap trademark, branding, custom HTML5 Canvas game engines, case study publications, and visual designs are the proprietary intellectual property of <strong>Ashish Pal</strong> and KiddoZap:</p>
        <ul style="margin:12px 0 12px 20px; line-height:1.75;">
          <li>You may not scrape, clone, mirror, or mass-download the source code or game assets for resale or unauthorized commercial syndication.</li>
          <li>You may not introduce automated bots, web crawlers, or scripting attacks that degrade server performance or disrupt fair play for other students.</li>
        </ul>
      </div>

      <div class="section-block">
        <h2>5. Disclaimer of Warranties &amp; Limitation of Liability</h2>
        <p>KiddoZap and all games are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind. While we rigorously test our games across major modern browsers (Chrome, Safari, Edge, Firefox), we do not guarantee uninterrupted or error-free execution on legacy devices or unsupported hardware.</p>
        <p style="margin-top:10px;">In no event shall KiddoZap or Ashish Pal be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the platform.</p>
      </div>

      <div class="section-block">
        <h2>6. Governance &amp; Contact</h2>
        <p>For questions regarding these terms, contact us at <a href="mailto:support@kiddozap.com" style="color:#38bdf8;">support@kiddozap.com</a> or <a href="mailto:ashishpal996@gmail.com" style="color:#38bdf8;">ashishpal996@gmail.com</a>.</p>
      </div>
    `
  })
);

// 10. Contact & Support Page (Dedicated standalone contact with SLAs and direct email)
ensureDir(path.join(PUBLIC_DIR, 'contact'));
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'contact', 'index.html'),
  renderHtmlPage({
    title: 'Contact Support & Feedback | KiddoZap Founder Ashish Pal',
    description: 'Get in touch with the KiddoZap team. Reach out to founder Ashish Pal directly for gameplay suggestions, classroom partnerships, and technical inquiries.',
    canonicalUrl: 'https://kiddozap.com/contact',
    content: `
      <nav class="breadcrumb">
        <a href="/">KiddoZap Hub</a>
        <span>/</span>
        <span>Contact &amp; Support</span>
      </nav>

      <div class="game-card-static">
        <div style="display:inline-block; padding:4px 12px; background:rgba(56, 189, 248, 0.15); border:1px solid rgba(56, 189, 248, 0.3); color:#38bdf8; border-radius:999px; font-size:12px; font-weight:800; margin-bottom:12px;">
          ✉️ Direct Support Channels
        </div>
        <h1>Contact KiddoZap Support</h1>
        <p style="font-size:14px; color:#94a3b8;">Direct Communication with Founder &amp; Lead Systems Engineer Ashish Pal</p>
        <p style="margin-top:12px;">We welcome feedback, game suggestions, and inquiries from parents, classroom teachers, school IT directors, and players. We read every email and strive to respond within 24 to 48 business hours.</p>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:18px; margin-bottom:28px;">
        <div class="section-block" style="margin:0;">
          <h3 style="color:#38bdf8; margin-bottom:8px;">General Inquiries &amp; Support</h3>
          <p style="font-size:13px; color:#94a3b8; margin-bottom:12px;">For general help, gameplay suggestions, and feedback:</p>
          <a href="mailto:support@kiddozap.com" style="color:#fff; font-size:16px; font-weight:800; text-decoration:none;">support@kiddozap.com</a>
        </div>

        <div class="section-block" style="margin:0;">
          <h3 style="color:#34d399; margin-bottom:8px;">Founder Direct Email</h3>
          <p style="font-size:13px; color:#94a3b8; margin-bottom:12px;">Direct correspondence with creator Ashish Pal:</p>
          <a href="mailto:ashishpal996@gmail.com" style="color:#fff; font-size:16px; font-weight:800; text-decoration:none;">ashishpal996@gmail.com</a>
        </div>

        <div class="section-block" style="margin:0;">
          <h3 style="color:#f59e0b; margin-bottom:8px;">Schools &amp; IT Administrators</h3>
          <p style="font-size:13px; color:#94a3b8; margin-bottom:12px;">For domain whitelisting and firewall guidance:</p>
          <span style="color:#34d399; font-weight:800; font-size:14px;">100% Free &bull; Zero Server Sign-In</span>
        </div>
      </div>

      <div class="section-block">
        <h2>Frequently Addressed Inquiries</h2>
        <div style="margin-bottom:14px;">
          <h3 style="font-size:15px; color:#38bdf8; margin-bottom:4px;">How do I report a gameplay glitch or bug?</h3>
          <p style="font-size:13px; color:#cbd5e1;">Please email <a href="mailto:support@kiddozap.com" style="color:#38bdf8;">support@kiddozap.com</a> with the name of the game, your device type (e.g. iPad, Chromebook, Windows PC), and browser version.</p>
        </div>
        <div style="margin-bottom:14px;">
          <h3 style="font-size:15px; color:#38bdf8; margin-bottom:4px;">Can I suggest a new puzzle or math game?</h3>
          <p style="font-size:13px; color:#cbd5e1;">Absolutely! We love curriculum recommendations from teachers. Many of our arithmetic speed drills originated from teacher classroom suggestions.</p>
        </div>
        <div>
          <h3 style="font-size:15px; color:#38bdf8; margin-bottom:4px;">Does KiddoZap allow guest articles or sponsored posts?</h3>
          <p style="font-size:13px; color:#cbd5e1;">We do not publish sponsored spam or paid product links. All case studies are authored by accredited educators and child development specialists.</p>
        </div>
      </div>
    `
  })
);

console.log('Successfully generated all content for KiddoZap (including comprehensive legal & contact pages)!');
