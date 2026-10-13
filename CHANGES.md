# KiddoZap - kya badla gaya (11 Oct 2026)

## Kyun
AdSense ne "Low value content" bola tha. Neeche ke badlav us wajah ko theek karne ke liye hain.

## Content aur claims
- Nakli "KiddoZap Pedagogical Research Team", "Verified Editorial", "COPPA Verified", "Zero Data Tracking", "Ad-Friendly" hata diye.
- 6 articles dobara likhe (bina nakli statistics/neuroscience claims ke). "Child Safety Officer" aur nakli stats (42%, 68%) hata diye.
- Fake aggregateRating (4.9 / 128 ratings) structured data se hata diya.
- Fake contact form hata diya (wo kuch bhejta nahi tha). Ab seedha email.
- About, Contact, Privacy, Parents Guide, Terms ka text asli aur honest kiya. Contact page par naam: Ashish Pal.
- "32+ games" ki jagah sahi count (50+ games, 24 guides).

## Game naam (trademark se bachne ke liye)
Geo Dash -> Neon Rhythm Run, Moto X3M -> Stunt Biker Challenge, Crossy Road -> Hop and Cross, Color Switch -> Color Gate Arena,
Space Invaders -> Galaxy Defender, Pac-Maze -> Neon Maze Runner, Tunnel Rush -> Tunnel Dash, Connect 4 -> Four in a Line,
Flappy Hero -> Flap Hero, Piano Tiles slug -> magic-piano. SPA me Knife Hit, Drift Boss, Helix Jump, Dunk Shots, Simon bhi badle.
Purane /games/<slug> links vercel.json me redirect hain.

## Structure
- Har /games/<naam> page par ab game wahin iframe me khulta hai (?game=<id>&embed=1), text ke saath.
- Embed mode me header/footer/ads nahi dikhte. ?game= aur ?embed=1 URLs par AdSense script load nahi hota.
- About/Contact/Privacy/Parents/Terms ab generator (scripts/generate-all-content.js) se bante hain. Text scripts/pages/*.html me hai.

## Zyada asli value (low value content ke liye)
- Naye free tools: /tools, /tools/times-table-practice (chalta hua quiz), /tools/math-facts-practice (jod/ghata/bhag quiz), /tools/multiplication-chart (printable chart). Nav, footer aur sitemap me add.
- 5 category pages par asli intro text (pehle 110-200 words ke thin pages the).
- Har game guide ke neeche "More games you might like" aur related article/tool links (andar ki linking).
- Median page ab ~450 words ka hai.

## Design
- Nayi shared stylesheet: public/site.css (sab static pages ke liye). Sticky header, gradient brand, naye cards, better reading width.

## Pehle ye karein
1. `npm install && npm run build` chalakar check karein (maine build test nahi kiya, sirf syntax check kiya).
2. `node scripts/generate-all-content.js` agar text badalna ho to dobara chalayein.
3. Vercel preview par /games/sudoku kholkar dekhein ki game iframe me chalta hai.
4. support@kiddozap.com ka mailbox kaam karta hai ya nahi, check karein.
5. AdSense me child-directed (bachchon wali) setting ka faisla karein, aur agar lagayein to privacy policy ka section 3 update karein.
