import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.resolve('public');

// Helper to ensure dir exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Common HTML Template Generator
function renderPage({
  title,
  description,
  canonicalUrl,
  breadcrumbs,
  structuredData,
  contentHtml,
  activeNav = 'games'
}) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} • KiddoZap</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <link rel="icon" type="image/svg+xml" href="/icon.svg" />
  <meta name="robots" content="index, follow" />
  
  <!-- Google AdSense Verification & Auto-Ads Integration Tag -->
  <meta name="google-adsense-account" content="ca-pub-1249623486151192" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1249623486151192" crossorigin="anonymous"></script>

  <!-- Open Graph -->
  <meta property="og:title" content="${title} • KiddoZap" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="/logo.svg" />
  <meta name="twitter:card" content="summary_large_image" />

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">

  <!-- Schema.org JSON-LD Structured Data -->
  <script type="application/ld+json">
  ${JSON.stringify(structuredData, null, 2)}
  </script>

  <meta name="theme-color" content="#0a0e1a" />
  <link rel="stylesheet" href="/site.css" />
</head>
<body>
  <!-- Top Utility Strip -->
  <div class="top-strip">
    <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
      <span style="color:#38bdf8; font-weight:800;">⚡ KiddoZap Hub</span>
      <span>•</span>
      <a href="/games">🎮 All Games</a>
      <span>•</span>
      <a href="/categories">📂 Categories</a>
      <span>•</span>
      <a href="/articles">📚 Guides</a>
      <span>•</span>
      <a href="/parents-guide">👨‍👩‍👦 Parents Guide</a>
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
      <a href="/privacy" style="color:#34d399; font-weight:800;">🛡️ Kid-Friendly</a>
    </div>
  </div>

  <!-- Header -->
  <header class="header">
    <a href="/" class="logo-box">
      <div class="logo-icon">⚡</div>
      <div>
        <div class="logo-text">KiddoZap</div>
        <div style="font-size:10px; color:#94a3b8; font-weight:700;">Free games for kids &amp; teens</div>
      </div>
    </a>
    <nav class="nav-links">
      <a href="/" class="${activeNav === 'home' ? 'active' : ''}">▶ Play Hub</a>
      <a href="/games" class="${activeNav === 'games' ? 'active' : ''}">Game Guides</a>
      <a href="/categories" class="${activeNav === 'categories' ? 'active' : ''}">Categories</a>
      <a href="/tools" class="${activeNav === 'tools' ? 'active' : ''}">Free Tools</a>
      <a href="/articles" class="${activeNav === 'articles' ? 'active' : ''}">Guides for Parents</a>
      <a href="/parents-guide" class="${activeNav === 'parents' ? 'active' : ''}">Parents Guide</a>
      <a href="/about" class="${activeNav === 'about' ? 'active' : ''}">About</a>
      <a href="/contact" class="${activeNav === 'contact' ? 'active' : ''}">Contact</a>
    </nav>
  </header>

  <!-- Main Container -->
  <main class="container">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span>/</span>
      ${breadcrumbs.map((b, idx) => {
        if (idx === breadcrumbs.length - 1) {
          return `<span class="current">${b.name}</span>`;
        }
        return `<a href="${b.url}">${b.name}</a> <span>/</span>`;
      }).join(' ')}
    </nav>

    ${contentHtml}
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-links-grid">
        <div class="footer-col">
          <h5>KiddoZap Portal</h5>
          <p style="font-size:12px; color:#94a3b8; margin:0 0 10px 0;">KiddoZap is a small independent website with free browser games and puzzles for kids and teens. Games are free to play, and the site is supported by ads.</p>
          <span style="display:inline-block; background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.3); padding:3px 10px; border-radius:9999px; font-size:11px; font-weight:800;">🛡️ Family-Friendly Games</span>
        </div>
        <div class="footer-col">
          <h5>Game Categories</h5>
          <ul>
            <li><a href="/categories/brain-puzzles">Brain &amp; Logic Puzzles</a></li>
            <li><a href="/tools">Free Learning Tools</a></li>
            <li><a href="/categories/action-reflex">Action &amp; Reflex Runners</a></li>
            <li><a href="/categories/arcade-retro">Classic Retro &amp; Arcade</a></li>
            <li><a href="/categories/math-learning">Mental Math &amp; Arithmetic</a></li>
            <li><a href="/categories/early-learning">Early Learning &amp; Rhymes</a></li>
            <li><a href="/categories">All Game Categories</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Guides</h5>
          <ul>
            <li><a href="/articles/benefits-of-puzzle-games-for-kids-brain-development">Benefits of Logic Puzzles</a></li>
            <li><a href="/articles/how-math-games-improve-speed-and-accuracy">Math Practice with Games</a></li>
            <li><a href="/articles/healthy-screen-time-rules-for-school-children">Healthy Screen Time Habits</a></li>
            <li><a href="/articles/hand-eye-coordination-and-reflex-training-in-teens">Reflex &amp; Hand-Eye Coordination</a></li>
            <li><a href="/articles/classroom-brain-breaks-guide-for-teachers">Classroom Brain Breaks</a></li>
            <li><a href="/articles/coppa-and-child-online-privacy-guide-for-parents">Children's Privacy Guide</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Trust &amp; Legal</h5>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/parents-guide">Parents &amp; Teachers Guide</a></li>
            <li><a href="/contact">Contact Support</a></li>
            <li><a href="mailto:support@kiddozap.com">support@kiddozap.com</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div>&copy; 2026 KiddoZap. All rights reserved. Built with love for curious young minds.</div>
        <div style="display:flex; gap:14px;">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Support</a>
        </div>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

export { renderPage, ensureDir, PUBLIC_DIR };
