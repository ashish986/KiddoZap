import fs from 'fs';
import path from 'path';
import { renderPage, ensureDir, PUBLIC_DIR } from './render-base.js';

// 24 Detailed Games with Rich Educational & Gameplay Content
const GAMES_DATA = [
  {
    slug: 'neon-rhythm-run',
    gameId: 'geodash',
    title: 'Neon Rhythm Run',
    subtitle: 'Rhythm-Based Geometric Obstacle Platformer',
    icon: '⚡',
    badge: 'Reflex & Rhythm • Class 4-12',
    category: 'Rhythm Platformer',
    categorySlug: 'action-reflex',
    ageRange: 'Age 8-17 (Grades 3-12)',
    metaDescription: 'Play Neon Rhythm Run online for free on KiddoZap. Jump spikes, hit gravity flip portals, and master precision rhythm platforming to high-energy beats.',
    overview: 'Neon Rhythm Run is a high-octane 2D geometric runner engineered around musical synchronization and anticipatory motor control. Players navigate a luminous cyber cube across perilous terrain packed with triangular spikes, elevating launch pads, mid-air ring boosts, and inverted gravity portals. Because collision with any obstacle requires instant level restart, the game demands total mental concentration, rapid pattern absorption, and unwavering resilience.',
    controlsDesktop: 'Press [SPACEBAR], [UP ARROW], or Left Mouse Click to execute a jump. Hold spacebar after bouncing on continuous jump pads.',
    controlsMobile: 'Tap anywhere on the touchscreen to initiate jumps. Tap repeatedly during multi-ring air sequences.',
    strategies: [
      'Listen closely to the audio percussion: every spike cluster and platform jump coincides directly with the drum tempo.',
      'Anticipate three obstacles ahead rather than looking directly at your cube character to give your motor reflexes latency buffer.',
      'Treat yellow rings as timing gates: wait until your icon intersects the exact center of the ring before tapping.',
      'During inverted gravity portals, remember that spatial muscle memory reverses—train your focus on relative platform gaps.',
      'Take regular 30-second eye pauses between consecutive attempts to reset visual fatigue and maintain optimal reaction latency.'
    ],
    cognitiveBenefits: 'Neon Rhythm Run trains fine temporal motor synchronization, visual-spatial anticipation, and inhibitory impulse control. Rhythm games ask players to match their taps to a beat, which is a fun way to practise timing and hand-eye coordination.',
    classroomUtility: 'Teachers frequently utilize Neon Rhythm Run as a 5-minute energetic brain break between rigorous STEM examinations. It sharpens focus, recalibrates student alertness, and teaches persistence in overcoming difficult multi-step hurdles.',
    faqs: [
      {
        q: 'Can Neon Rhythm Run be played on school Chromebooks without lag?',
        a: 'Yes! KiddoZap’s Neon Rhythm Run is built with zero-overhead HTML5 Canvas code running at a silky 60 FPS, ensuring zero lag even on entry-level school Chromebooks and mobile tablets.'
      },
      {
        q: 'Does this game require downloading apps or Flash player?',
        a: 'No plugins or downloads are needed. It runs 100% natively in any modern web browser including Chrome, Safari, Firefox, and Edge.'
      },
      {
        q: 'How does rhythm gaming improve student concentration?',
        a: 'Rhythm games demand full auditory and visual motor engagement, shifting the brain into a hyper-focused "flow state" that improves sustained attention spans.'
      },
      {
        q: 'Are player scores or data tracked across the web?',
        a: 'Scores and stars are saved only in your own browser on your device. The site is supported by ads, so please see our Privacy Policy for details.'
      }
    ]
  },
  {
    slug: 'slope-run',
    gameId: 'slope3d',
    title: '3D Slope Cyber Run',
    subtitle: 'High-Velocity 3D Downhill Ball Runner',
    icon: '🌀',
    badge: '3D Spatial • Class 5-12',
    category: '3D Cyber Arcade',
    categorySlug: 'action-reflex',
    ageRange: 'Age 9-17 (Grades 4-12)',
    metaDescription: 'Roll down high-speed 3D cyber neon ramps in Slope Cyber Run. Dodge red barriers, balance on narrow beams, and test your 3D spatial reaction speed.',
    overview: '3D Slope Cyber Run immerses players in an exhilarating downhill course where a cybernetic sphere accelerates down narrow, twisting neon suspended tracks. As speed escalates exponentially, players must dodge stationary and shifting crimson barrier cubes, execute death-defying leap across platform voids, and stay centered on dizzying curved ramps high above a futuristic cyber grid.',
    controlsDesktop: 'Use [A] / [D] keys or [LEFT] / [RIGHT] Arrow keys to steer your ball along the slopes. Gentle taps are superior to holding down keys.',
    controlsMobile: 'Touch and hold the left or right halves of your mobile screen to steer gently in either direction.',
    strategies: [
      'Avoid oversteering: at high velocities, tiny micro-adjustments keep your ball centered on narrow platforms.',
      'Spot red barriers early by scanning the horizon rather than the ball itself.',
      'Prioritize staying on the platform over chasing optional high-risk speed boosters.',
      'When landing from elevated drops, keep the ball aligned straight forward to prevent rolling off steep edges.',
      'Maintain an upright posture and blink frequently to prevent digital eye strain during fast 60 FPS downhill motion.'
    ],
    cognitiveBenefits: 'Slope 3D cultivates 3D depth perception, rapid visual triage, dynamic balance estimation, and fine motor steering precision.',
    classroomUtility: 'Used in physics and computer science clubs to demonstrate velocity, momentum vectors, and procedural geometry generation.',
    faqs: [
      {
        q: 'Why does the ball accelerate as you travel farther?',
        a: 'The game simulates gravitational acceleration down infinite slopes, presenting an escalating cognitive challenge as player reflex limits are tested.'
      },
      {
        q: 'Is Slope 3D suitable for students in elementary school?',
        a: 'Yes, the game is completely non-violent and contains zero gore. However, due to speed, it is best enjoyed by students aged 8 and older.'
      },
      {
        q: 'Can students play Slope 3D with a keyboard or touchscreen?',
        a: 'Both! KiddoZap supports dual input seamlessly—keyboard arrows for desktop/Chromebooks and responsive touch zones for tablets.'
      },
      {
        q: 'Does Slope 3D require high-end graphics hardware?',
        a: 'No. Our WebGL canvas engine is heavily optimized to deliver 60 FPS gameplay on standard school computers.'
      }
    ]
  },
  {
    slug: 'tunnel-dash',
    gameId: 'tunnelrush3d',
    title: '3D Speed Tunnel Dash',
    subtitle: 'Supersonic 3D Cylindrical Reflex Challenge',
    icon: '🚀',
    badge: 'Hyper Reflex • Class 5-12',
    category: '3D Tunnel Racer',
    categorySlug: 'action-reflex',
    ageRange: 'Age 10-17 (Grades 5-12)',
    metaDescription: 'Play Speed Tunnel Dash 3D online on KiddoZap. Spin through neon polygonal tunnels at supersonic speed and dodge spinning hazard walls.',
    overview: 'Speed Tunnel Dash 3D launches players down a kaleidoscopic neon cylindrical conduit at breakneck speeds. The tunnel features flashing polygonal facets and rotating triangular wedges, semi-circular hazard walls, and shifting color barriers. Surviving this supersonic flight requires instantaneous peripheral vision assessment and synchronized circular rotation.',
    controlsDesktop: 'Press [LEFT] / [RIGHT] Arrow keys or [A] / [D] to rotate around the circular perimeter of the tunnel.',
    controlsMobile: 'Tap or hold the left/right sides of the touch display to spin around the tunnel wall.',
    strategies: [
      'Watch the tunnel center: oncoming obstacles cast faint shadows down the cylinder walls before fully appearing.',
      'Rotate continuously towards the widest opening rather than waiting until the last millisecond.',
      'Anticipate rotating obstacles: check whether the hazard is spinning clockwise or counterclockwise before passing.',
      'Keep your gaze relaxed and rely on peripheral vision to identify clear passage wedges.',
      'Take regular breathers between runs to recalibrate your optical reflex system.'
    ],
    cognitiveBenefits: 'Enhances circular rotational spatial awareness, millisecond optical decision-making, and peripheral motion sensitivity.',
    classroomUtility: 'Popular among student gamers looking to sharpen their visual tracking and reaction times for athletic and cognitive competitions.',
    faqs: [
      {
        q: 'How fast does Tunnel Dash get?',
        a: 'The flight velocity increases steadily with each tier cleared, topping out at thrilling supersonic speeds.'
      },
      {
        q: 'Is there any motion sickness risk?',
        a: 'The clean neon palette and smooth 60 FPS rendering reduce visual disorientation. Playing in a well-lit room is recommended.'
      },
      {
        q: 'Are there power-ups available in the tunnel?',
        a: 'Yes, collecting glowing protective energy shields grants immunity against single barrier impacts.'
      },
      {
        q: 'Is Tunnel Dash unblocked for school networks?',
        a: 'Yes! KiddoZap is dedicated to child-safe, education-friendly web protocols accessible on educational networks.'
      }
    ]
  },
  {
    slug: 'neon-maze-runner',
    gameId: 'pacmaze',
    title: 'Neon Maze Runner 2088',
    subtitle: 'Futuristic Neon Labyrinth Strategy Arcade',
    icon: '🟡',
    badge: 'Strategy & Maze • Class 2-12',
    category: 'Arcade Maze',
    categorySlug: 'arcade-retro',
    ageRange: 'Age 6-17 (Grades 1-12)',
    metaDescription: 'Play Neon Maze Runner 2088 free on KiddoZap. Eat neon energy dots, collect power energizers, and outmaneuver 4 intelligent AI cyber ghosts.',
    overview: 'Neon Maze Runner 2088 modernizes the classic labyrinth arcade genre with glowing cyberpunk visual aesthetics, synthwave audio landscapes, and intelligent multi-agent AI ghost behaviors. Players guide the cyber hero through intricate passageways, clearing glowing energy pellets while calculating safe evasive routes away from 4 predatory cyber phantom drones.',
    controlsDesktop: 'Use [ARROW KEYS] or [WASD] to direct your player through maze corridors. Pre-turning into corridors is supported for fluid steering.',
    controlsMobile: 'Swipe up, down, left, or right anywhere on your screen to change direction at the next available intersection.',
    strategies: [
      'Each ghost features distinct pursuit heuristics: the Red ghost pursues directly, Pink aims ahead, Cyan ambushes, and Orange roams.',
      'Save corner Power Energizers for moments when multiple ghosts converge on your quadrant.',
      'Use the side escape warp tunnels: ghosts move significantly slower through edge warp gates than your player.',
      'Clear perimeter pellets first before clearing the dangerous central maze zone.',
      'Never trap yourself in dead-end alleys without verifying the location of all 4 phantoms on your minimap.'
    ],
    cognitiveBenefits: 'Stimulates 2D route pathfinding, real-time risk-reward evaluation, tactical spatial escape planning, and working visual memory.',
    classroomUtility: 'Great for computer science classes discussing state machines, artificial intelligence pathfinding (A* / Dijkstra algorithms), and game design history.',
    faqs: [
      {
        q: 'What do the blinking power orbs do?',
        a: 'Grabbing a power orb temporarily disables ghost firewalls, turning them blue and allowing you to chomp them for massive bonus points!'
      },
      {
        q: 'Does Neon Maze Runner 2088 save your high score?',
        a: 'Yes, your best maze scores are saved directly in your device’s secure local browser storage.'
      },
      {
        q: 'Can young kids in 1st or 2nd grade play easily?',
        a: 'Absolutely! The simple 4-directional navigation is intuitive for all ages from kindergarten to high school.'
      },
      {
        q: 'Are there violent themes in Neon Maze Runner?',
        a: 'Zero violence. It is purely cartoon-styled cyber tag suitable for all ages.'
      }
    ]
  },
  {
    slug: 'color-gate-arena',
    gameId: 'colorswitch',
    title: 'Color Gate Arena',
    subtitle: 'Chromatic Reflex & Precision Timing Arcade',
    icon: '🎯',
    badge: 'Color Reflex • Class 1-12',
    category: 'Reflex Timing',
    categorySlug: 'action-reflex',
    ageRange: 'Age 5-17 (Grades K-12)',
    metaDescription: 'Play Color Gate Arena free on KiddoZap. Bounce the colored ball through matching segments of rotating shapes and master precision timing.',
    overview: 'Color Gate Arena tests rhythm, patience, and chromatic visual discrimination. Players bounce a colored orb upward through revolving geometric structures—including spinning circular rings, pulsing triangles, rotating squares, and multi-layered crosses. The fundamental rule: the ball can only pass through barrier segments that match its current hue.',
    controlsDesktop: 'Click Left Mouse Button or press [SPACEBAR] to perform a gentle upward bounce. Let gravity pull the ball down naturally between taps.',
    controlsMobile: 'Tap anywhere on the touchscreen to bounce the orb upward.',
    strategies: [
      'Rhythm is key: find a steady cadence of light taps to hover the ball safely inside open obstacle cavities.',
      'Never rush into an obstacle: wait for the correct color segment to rotate into position before making your ascent.',
      'Be prepared for Color Gate orbs: note the new hue immediately as soon as your ball passes through the color-changing prism.',
      'Watch out for multi-layered concentric rings where inner and outer circles rotate in opposite directions.',
      'Patience beats speed: waiting one extra rotation cycle prevents 90% of premature collisions.'
    ],
    cognitiveBenefits: 'Promotes chromatic visual discrimination, motor inhibition (resisting the urge to tap rapidly), and fine impulse control.',
    classroomUtility: 'Used in early childhood development to reinforce color recognition, and in elementary classrooms as a focus-training exercise.',
    faqs: [
      {
        q: 'What happens if you touch the wrong color?',
        a: 'Touching a non-matching color segment causes the orb to shatter into harmless confetti particles, restarting your climb.'
      },
      {
        q: 'How many different obstacle patterns are there?',
        a: 'The arena features dozens of procedurally randomized shapes: rings, stars, crosses, vertical bars, and nested gyroscopes.'
      },
      {
        q: 'Is Color Gate accessible for color-blind players?',
        a: 'Yes, our color palette uses high-contrast, vibrantly saturated hues (cyan, magenta, yellow, and violet) with high luminance differences.'
      },
      {
        q: 'Is there a time limit on each jump?',
        a: 'No time limit! You can hover patiently inside safe zones for as long as needed to time your jump.'
      }
    ]
  },
  {
    slug: 'aim-trainer',
    gameId: 'aimtrainer',
    title: 'Aim Reflex Sniper Pro',
    subtitle: 'Millisecond Precision & Esports Aim Training',
    icon: '🎯',
    badge: 'Millisecond Speed • Class 3-12',
    category: 'Precision Reaction',
    categorySlug: 'action-reflex',
    ageRange: 'Age 8-17 (Grades 3-12)',
    metaDescription: 'Improve reaction time and target precision with Aim Reflex Sniper Pro on KiddoZap. Measure your response time in milliseconds with Gridshot challenges.',
    overview: 'Aim Reflex Sniper Pro is a high-performance visual-motor training simulator created for aspiring gamers, competitive students, and athletes. Designed to benchmark and cultivate reaction latency down to the millisecond, players test their click accuracy across multiple challenging drills: Gridshot 30-Second Rush, Target Tracking, and Shrinking Target Precision.',
    controlsDesktop: 'Point mouse cursor and Left Click on targets as soon as they appear. Use comfortable DPI mouse settings.',
    controlsMobile: 'Tap targets directly with your index finger as rapidly as possible.',
    strategies: [
      'Focus on target center: hitting near dead-center yields precision multiplier scores.',
      'Keep your wrist relaxed and use fluid forearm adjustments for broad target spreads.',
      'Prioritize accuracy over pure flailing speed: consecutive hit streaks compound your score multipliers.',
      'Warm up with 2 rounds of Reaction Speed before attempting the high-intensity Gridshot 30s challenge.',
      'Blink between targets to maintain sharp visual contrast and prevent eye fatigue.'
    ],
    cognitiveBenefits: 'Significantly improves visual-motor latency, saccadic eye movements, hand-eye coordination, and split-second spatial targeting.',
    classroomUtility: 'Used in STEM sports science modules to measure human biological reaction times (averaging 200–250ms) and demonstrate motor learning curves.',
    faqs: [
      {
        q: 'What is a good reaction time score in Aim Reflex?',
        a: 'The global human average is 210–250 milliseconds. Exceptional reflex gamers score between 160–190 milliseconds!'
      },
      {
        q: 'Does practicing aim training improve real-world athletic reflexes?',
        a: 'Quick-reaction games can be a fun warm-up for sports like table tennis or badminton, but they are no substitute for real practice.'
      },
      {
        q: 'Can this be used on touchscreen tablets?',
        a: 'Yes, touchscreens offer a fantastic tap-reaction challenge that measures touch-reflex latency.'
      },
      {
        q: 'Are high scores saved?',
        a: 'Yes, your best reaction time and Gridshot high score are preserved on your local profile.'
      }
    ]
  },
  {
    slug: 'rooftop-parkour',
    gameId: 'parkour',
    title: 'Rooftop Parkour Rush',
    subtitle: 'High-Altitude Urban Rooftop Sprint & Slide',
    icon: '🏃',
    badge: 'Parkour Action • Class 3-12',
    category: 'Action Runner',
    categorySlug: 'action-reflex',
    ageRange: 'Age 8-17 (Grades 3-12)',
    metaDescription: 'Sprint across skyscraper rooftops in Rooftop Parkour Rush. Jump ventilations ducts, slide under neon signs, and leap huge city gaps on KiddoZap.',
    overview: 'Rooftop Parkour Rush puts you in the sneakers of a free-runner sprinting along the skyline of a bustling neon metropolis. Leap across dizzying vertical alleys, slide underneath low-hanging construction scaffolding, rebound off air vents, and chain acrobatic wall runs while collecting glowing energy sparks.',
    controlsDesktop: 'Press [UP ARROW] or [SPACEBAR] to jump. Press [DOWN ARROW] or [S] to slide under obstacles. Double-press jump for a double leap.',
    controlsMobile: 'Swipe UP to leap over gaps; swipe DOWN to slide under barriers.',
    strategies: [
      'Master the slide-jump combo: sliding directly into a ramp leap boosts your horizontal air clearance.',
      'Save your double jump until the midpoint of deep alley gaps to ensure you clear the opposite ledge.',
      'Keep an eye on roof transitions: sudden crane wires allow high-altitude zip transfers.',
      'Collect golden sparks to fill your momentum meter and unlock supersonic speed boosts.',
      'Time your slides early to avoid colliding with low steel girders and neon billboards.'
    ],
    cognitiveBenefits: 'Enhances multi-action motor coordination, spatial timing estimation, and forward momentum physics comprehension.',
    classroomUtility: 'An exhilarating reward break game that gets students excited about urban architecture, physics velocity, and kinetic movement.',
    faqs: [
      {
        q: 'How does the double jump mechanic work?',
        a: 'Tapping jump a second time while your runner is airborne executes an acrobatic mid-air roll that extends jump distance.'
      },
      {
        q: 'Is there any falling damage or violence?',
        a: 'No violence whatsoever. Missing a jump resets your runner smoothly back to the previous checkpoint with zero graphic animations.'
      },
      {
        q: 'Does the game work on mobile phones?',
        a: 'Yes, swipe gestures are fluidly optimized for all iPhone, Android, and iPad mobile screens.'
      },
      {
        q: 'Can you unlock new runner outfits?',
        a: 'Yes, collecting energy sparks lets you unlock stylish cyberpunk runner skins in your local profile.'
      }
    ]
  },
  {
    slug: 'stunt-biker',
    gameId: 'motox3m',
    title: 'Stunt Biker Challenge',
    subtitle: '2D Physics Stunt Racing & Flip Simulator',
    icon: '🏍️',
    badge: 'Physics Racing • Class 3-12',
    category: 'Physics Racing',
    categorySlug: 'action-reflex',
    ageRange: 'Age 8-17 (Grades 3-12)',
    metaDescription: 'Race dirt bikes on stunt hills in Stunt Biker Challenge on KiddoZap. Perform 360 flips, survive giant saws, and master realistic 2D motorcycle physics.',
    overview: 'Stunt Biker Challenge is a fun 2D physics motorcycle trial game. Players pilot a motocross dirt bike across wildly creative obstacle courses featuring looping wooden tracks, explosive TNT barrels, rotating steel buzz-saws, moving elevator platforms, and gigantic jumps over spikes.',
    controlsDesktop: 'Accelerate with [W] or [UP ARROW]. Brake/Reverse with [S] or [DOWN ARROW]. Tilt bike balance with [A]/[D] or [LEFT]/[RIGHT] arrows.',
    controlsMobile: 'On-screen virtual pedals: right arrows for throttle and brake, left arrows for tilting balance forward and backward.',
    strategies: [
      'Each 360-degree aerial flip shaves 0.5 seconds off your total stage timer, boosting your star rating.',
      'Always land on both wheels parallel to the ramp angle to avoid crashing your biker.',
      'Tap the brake gently before blind drops to maintain control over unpredictable terrain.',
      'Use steep downhill ramps to build maximum kinetic momentum for loop-the-loop sections.',
      'Lean back slightly while riding over rough spike beds to keep your front tire elevated.'
    ],
    cognitiveBenefits: 'Teens and students develop intuitive mastery over rotational torque, center of gravity, friction coefficients, and projectile trajectories.',
    classroomUtility: 'A fantastic demonstration of Newtonian mechanics, rotational momentum, and kinetic energy in high-school and middle-school science curricula.',
    faqs: [
      {
        q: 'How do you get a 3-star rating on every level?',
        a: 'Reach the finish flag under the target time limit! Perform backflips and frontflips in the air to deduct bonus seconds.'
      },
      {
        q: 'What happens when your bike crashes?',
        a: 'You instantly respawn at the most recent green checkpoint flag without penalty.'
      },
      {
        q: 'Are the physics realistic?',
        a: 'The game uses rigid-body spring suspension and angular momentum physics for an authentic trial-biking feel.'
      },
      {
        q: 'Is Stunt Biker free to play on KiddoZap?',
        a: '100% free with zero paywalls, microtransactions, or download requirements.'
      }
    ]
  },
  {
    slug: 'galaxy-defender',
    gameId: 'spaceinvaders',
    title: 'Galaxy Defender',
    subtitle: 'Retro Space Shooter & Alien Armada Defense',
    icon: '👾',
    badge: 'Retro Classic • Class 2-12',
    category: 'Retro Arcade',
    categorySlug: 'arcade-retro',
    ageRange: 'Age 6-17 (Grades 1-12)',
    metaDescription: 'Defend planet Earth in Galaxy Defender on KiddoZap. Shoot descending alien armada waves, dodge plasma lasers, and destroy UFO motherships.',
    overview: 'Galaxy Defender pays homage to the quintessential arcade classic that launched modern gaming culture. As alien armada fleets march methodically across the starry cosmos, descending lower with each sweep, players maneuver an Earth defense interceptor along the bottom baseline, firing laser cannons while dodging alien plasma volleys.',
    controlsDesktop: 'Move Left/Right with [A]/[D] or [ARROW KEYS]. Fire lasers with [SPACEBAR] or Left Mouse Click.',
    controlsMobile: 'Touch and drag along the bottom control bar to slide your starship; tap the fire button to loose plasma beams.',
    strategies: [
      'Preserve your green defensive bunkers: fire through narrow slit openings to snipe aliens while remaining protected.',
      'Focus on the outer columns of the alien armada first to slow down their overall descent rate across the screen.',
      'Shoot the mystery red flying saucer UFO that flies across the top screen for huge mystery bonus points (50 to 300 pts).',
      'As fewer invaders remain, their movement speed accelerates dramatically—anticipate their rapid strafing.',
      'Never stay stagnant in the center; keep continuously sliding to evade aimed enemy bombs.'
    ],
    cognitiveBenefits: 'Trains lateral visual tracking, defensive spatial positioning, prioritisation under escalating pressure, and predictive trajectory shooting.',
    classroomUtility: 'Used in video game history classes to illustrate the origins of computing entertainment and early microprocessor constraints.',
    faqs: [
      {
        q: 'Why do the invaders speed up as you shoot them?',
        a: 'In the original 1978 hardware, fewer aliens on screen reduced computer processing strain, making them move faster! This accidental glitch became an iconic gameplay mechanic.'
      },
      {
        q: 'How many defense shields do you get?',
        a: 'You start with 4 modular energy bunkers that slowly disintegrate as they absorb enemy and friendly laser fire.'
      },
      {
        q: 'Can this game be played on Chromebooks in school?',
        a: 'Yes, it is extremely lightweight, requires zero downloads, and runs flawlessly on all browser devices.'
      },
      {
        q: 'Is there sound effects and music?',
        a: 'Yes, featuring the iconic 4-beat heartbeat march that speeds up as the alien invaders descend.'
      }
    ]
  },
  {
    slug: 'hop-and-cross',
    gameId: 'crossyroad',
    title: 'Hop and Cross Adventure',
    subtitle: 'Endless Voxel Traffic & River Crossing Hop',
    icon: '🐔',
    badge: 'Arcade Adventure • Class 1-12',
    category: 'Arcade Runner',
    categorySlug: 'arcade-retro',
    ageRange: 'Age 5-17 (Grades K-12)',
    metaDescription: 'Hop across busy highways and floating river logs in Hop and Cross Adventure on KiddoZap. Dodge speeding cars, trains, and rivers in safe voxel style.',
    overview: 'Why did the chicken cross the road? In Hop and Cross Adventure, the answer is endless fun! Players navigate colorful voxel animals—chickens, ducks, and puppies—across treacherous multi-lane highways teeming with cars and trucks, high-speed railroad tracks with flashing signal lights, and rushing rivers with floating logs.',
    controlsDesktop: 'Hop Forward with [UP ARROW] or [W]. Step Left/Right with [A]/[D] or [LEFT]/[RIGHT]. Step Backward with [DOWN ARROW] or [S].',
    controlsMobile: 'Tap screen to hop forward. Swipe left, right, or down to step in respective directions.',
    strategies: [
      'Don’t hesitate too long: an eagle will swoop down if you idle in one spot for more than a few seconds!',
      'On highway lanes, move as soon as the rear bumper of a vehicle passes in front of your lane.',
      'When crossing rivers, hop upstream on floating logs to give yourself more time before floating off-screen.',
      'Watch railroad crossing signals: when red lights blink and bells chime, an express train will rocket across within 2 seconds.',
      'Look two lanes ahead to ensure you aren’t jumping straight into a fast-moving truck.'
    ],
    cognitiveBenefits: 'Enhances gap estimation, forward path planning, quick visual velocity judgments, and spatial situational awareness.',
    classroomUtility: 'A beloved classroom staple for elementary and middle school students during supervised recreational downtime.',
    faqs: [
      {
        q: 'Why does the eagle catch you if you wait?',
        a: 'The eagle mechanic prevents players from idling indefinitely and keeps the game moving with exciting forward momentum.'
      },
      {
        q: 'Can you unlock new animal characters?',
        a: 'Yes, collect shiny gold coins along your journey to unlock adorable farm and wild animal avatars.'
      },
      {
        q: 'Is Hop and Cross completely non-violent?',
        a: 'Yes! The game features cute voxel cartoon aesthetics with zero violence or gore.'
      },
      {
        q: 'Does it work offline?',
        a: 'Once loaded in your browser cache, the game runs smoothly even with intermittent internet connections.'
      }
    ]
  },
  {
    slug: 'brick-breaker',
    gameId: 'brickbreaker',
    title: 'Neon Brick Breaker',
    subtitle: 'Retro Paddle & Ball Arcade Classic',
    icon: '🧱',
    badge: 'Classic Arcade • Class 1-12',
    category: 'Arcade Classic',
    categorySlug: 'arcade-retro',
    ageRange: 'Age 5-17 (Grades K-12)',
    metaDescription: 'Shatter vibrant neon brick walls in Neon Brick Breaker on KiddoZap. Catch laser power-ups, multiballs, and paddle extenders in classic arcade style.',
    overview: 'Neon Brick Breaker brings modern neon flair to the timeless Breakout / Arkanoid genre. Players command a horizontal reflective paddle along the base of the arena, deflecting high-velocity bouncing spheres into intricate formations of color-coded bricks. Power-up capsules drop from shattered blocks, bestowing laser cannons, multi-ball storms, and magnetic paddle grips.',
    controlsDesktop: 'Glide paddle horizontally using the Mouse Cursor or [LEFT] / [RIGHT] Arrow Keys. Launch ball with [SPACEBAR].',
    controlsMobile: 'Drag your finger along the bottom screen slider to move the paddle smoothly underneath the descending ball.',
    strategies: [
      'Paddle deflection angle matters: hitting the ball with the outer edges of your paddle returns it at sharp, low angles to pierce back rows.',
      'Tunneling tactic: carve a single vertical channel up one side of the wall and send the ball above the ceiling for automatic multi-brick cascades.',
      'Prioritize catching the Multi-Ball power-up: juggling 3 or more balls dramatically increases brick clearance velocity.',
      'Watch out for skull power-downs that shrink your paddle or speed up the ball unexpectedly.',
      'Keep your eyes fixed on the ball trajectory rather than watching the falling bonuses.'
    ],
    cognitiveBenefits: 'Builds geometric angle calculation, visual tracking of multi-object trajectories, and spatial reflection physics comprehension.',
    classroomUtility: 'Math and physics instructors frequently reference brick breaker bounce geometry to illustrate angle of incidence equals angle of reflection.',
    faqs: [
      {
        q: 'What power-ups can you collect?',
        a: 'Exciting bonuses include Multi-Ball (3x spheres), Laser Blaster (shoot bricks directly), Paddle Expander, Fireball (pierces all blocks), and Slow-Motion.'
      },
      {
        q: 'How many unique brick levels are there?',
        a: 'The game features 20+ uniquely shaped levels ranging from pyramids and space invaders to neon butterflies.'
      },
      {
        q: 'Is Brick Breaker suitable for young children?',
        a: 'Yes, it provides intuitive, frustration-free fun for all ages with adjustable difficulty modes.'
      },
      {
        q: 'Does the ball bounce off walls correctly?',
        a: 'Yes, using precision 2D elastic collision physics matching real-world ray reflection.'
      }
    ]
  },
  {
    slug: 'jetpack-raider',
    gameId: 'jetpack',
    title: 'Jetpack Sky Raider',
    subtitle: 'Endless Bullet Jetpack Lab Escape',
    icon: '🚀',
    badge: 'Endless Action • Class 2-12',
    category: 'Action Arcade',
    categorySlug: 'action-reflex',
    ageRange: 'Age 7-17 (Grades 2-12)',
    metaDescription: 'Strap on a bullet-powered jetpack in Jetpack Sky Raider on KiddoZap. Dodge electric zappers, guided missiles, and laser fields in secret laboratories.',
    overview: 'Jetpack Sky Raider straps players into an experimental bullet-propelled jetpack as they blast through endless subterranean research laboratories. Dodge crackling high-voltage electric zappers, duck under red tracking laser grids, and evade incoming guided rockets while vacuuming up floating gold coins and piloting goofy vehicle morphs.',
    controlsDesktop: 'Press and hold [SPACEBAR] or Left Mouse Button to ignite thrusters and gain altitude. Release to descend with gravity.',
    controlsMobile: 'Touch and hold anywhere on the screen to ascend; lift your finger to fall smoothly toward the floor.',
    strategies: [
      'Maintain altitude near the center vertical corridor: this leaves you with equal escape distance whether obstacles spawn above or below.',
      'Feather your thruster: tap rapidly to hover steadily at a constant horizontal altitude.',
      'Watch warning exclamation marks on the right edge: they telegraph exactly where high-velocity missiles will streak across.',
      'Grab vehicle power capsules (like the Giant Mechanical Stomper or Bird Copter) for a free shield against one obstacle hit.',
      'Focus on obstacle evasion first, collecting coins only when the flight corridor is completely clear.'
    ],
    cognitiveBenefits: 'Strengthens gravitational equilibrium estimation, anticipatory hazard recognition, and steady finger motor pressure modulation.',
    classroomUtility: 'A fantastic, non-violent action title loved by elementary and middle schoolers for quick 3-minute mental breaks.',
    faqs: [
      {
        q: 'What do the red flashing alarms mean?',
        a: 'Flashing warning indicators notify you that an incoming rocket missile is locking onto your height. Move vertically to evade!'
      },
      {
        q: 'Can you upgrade your jetpack?',
        a: 'Yes, coins collected during runs can be redeemed in the gadget locker for cool neon rainbow jetpacks.'
      },
      {
        q: 'Is there any violence in Jetpack Sky Raider?',
        a: 'None! The game is pure lighthearted cartoon sci-fi comedy safe for classrooms and home devices.'
      },
      {
        q: 'Does it work with Chromebook keyboard controls?',
        a: 'Yes, simply hold down the spacebar to fly and release to fall.'
      }
    ]
  },
  {
    slug: 'sudoku',
    gameId: 'sudoku',
    title: 'Kiddo Sudoku 4x4 & 9x9',
    subtitle: 'Deductive Logic & Number Grid Reasoning',
    icon: '🧩',
    badge: 'Deductive Logic • Class 1-12',
    category: 'Brain & Logic',
    categorySlug: 'brain-puzzles',
    ageRange: 'Age 5-17 (Grades K-12)',
    metaDescription: 'Sharpen logic and deduction with Kiddo Sudoku on KiddoZap. Choose from beginner 4x4 animal/number grids to standard 9x9 challenges.',
    overview: 'Kiddo Sudoku provides a graduated, child-friendly pathway into the beloved art of deductive logic. Young beginners start with friendly 4x4 grids featuring numbers 1 to 4 or cute animal faces (lions, pandas, frogs, and foxes), before advancing to standard 9x9 grids that test advanced elimination techniques.',
    controlsDesktop: 'Click on any empty grid cell, then press the corresponding number key (1-4 or 1-9) or click the numeric keypad below.',
    controlsMobile: 'Tap an empty square, then tap your desired number from the floating circular number tray.',
    strategies: [
      'Process of Elimination: find rows, columns, or 2x2 boxes that already have 3 out of 4 cells filled. The final cell is guaranteed!',
      'Cross-hatching: look at a specific number and trace horizontal and vertical lines across the grid to reveal empty cells.',
      'Use the animal mode for pre-readers: recognizing symbols like foxes and pandas builds the same logical pathways as numerical digits.',
      'Check for duplicate entries: our smart grid automatically flags conflicting numbers in soft amber to guide learners.',
      'Take your time: Sudoku rewards calm, systematic thinking rather than rushed guessing.'
    ],
    cognitiveBenefits: 'Dramatically develops deductive reasoning, spatial working memory, systematic trial testing, and mathematical persistence.',
    classroomUtility: 'Teachers across primary and middle schools use Kiddo Sudoku as a premier cognitive exercise during math warm-ups and logic clubs.',
    faqs: [
      {
        q: 'Can young kids who don’t know big numbers play Sudoku?',
        a: 'Yes! Our 4x4 Animal Sudoku mode uses adorable animal faces, allowing children as young as 4 or 5 to master deduction effortlessly.'
      },
      {
        q: 'What is the rule of 4x4 Sudoku?',
        a: 'Every horizontal row, vertical column, and 2x2 square box must contain numbers 1, 2, 3, and 4 exactly once without repeating.'
      },
      {
        q: 'Does the game give hints if a student gets stuck?',
        a: 'Yes, players can click the friendly "Hint" button to illuminate a logical cell deduction.'
      },
      {
        q: 'Is there a timer on puzzles?',
        a: 'An optional friendly timer is displayed for tracking personal bests, but there is zero game-over countdown pressure.'
      }
    ]
  },
  {
    slug: 'math-sprint',
    gameId: 'math',
    title: 'Balloon Math Hero & Speed Drill',
    subtitle: 'Rapid-Fire Mental Arithmetic Fluency Drill',
    icon: '🎈',
    badge: 'Arithmetic Speed • Class 1-8',
    category: 'Mental Math',
    categorySlug: 'math-learning',
    ageRange: 'Age 5-14 (Grades K-8)',
    metaDescription: 'Boost mental math speed with Balloon Math Hero on KiddoZap. Pop balloons with correct addition, subtraction, and multiplication answers.',
    overview: 'Balloon Math Hero turns repetitive arithmetic homework drills into an electrifying carnival balloon challenge. Colorful balloons drift gracefully across a sunny sky, carrying potential answers to mathematical equations displayed in the central question banner. Students solve addition, subtraction, multiplication, and division problems before balloons drift off-screen.',
    controlsDesktop: 'Left Click on the balloon showing the correct numerical answer. Keyboard shortcuts (1, 2, 3, 4) can also select answers.',
    controlsMobile: 'Tap directly on the balloon containing the correct sum or product to pop it with a burst of stars.',
    strategies: [
      'Look at the units digit for quick estimation: for example, 38 + 24 must end in 2, instantly ruling out non-matching balloons.',
      'Build your streak multiplier: answering 5 consecutive questions correctly activates Double Star frenzy mode.',
      'Start with single-digit addition before testing multi-digit multiplication drills.',
      'If you are unsure between two balloons, use mental rounding (estimate 49 + 31 as 50 + 30 ≈ 80).',
      'Daily 5-minute practice sessions yield the greatest improvements in mental arithmetic automaticity.'
    ],
    cognitiveBenefits: 'Automates arithmetic recall, eliminates math test anxiety, reinforces numerical number sense, and accelerates working memory speed.',
    classroomUtility: 'Over 500 elementary teachers use Balloon Math Hero as a 3-minute math bell-ringer activity to activate computational neural pathways.',
    faqs: [
      {
        q: 'What grade levels does Balloon Math Hero cover?',
        a: 'Covers Kindergarten addition (1+1 to 10+10), Elementary subtraction and multiplication times tables (2 to 12), and Middle School division.'
      },
      {
        q: 'Can parents adjust the difficulty level?',
        a: 'Yes, select from Addition, Subtraction, Multiplication, Division, or Mixed Mode directly from the game lobby.'
      },
      {
        q: 'Does the game penalize wrong answers harshly?',
        a: 'No! If a student selects an incorrect balloon, gentle audio feedback sounds and the correct answer is briefly highlighted to encourage learning.'
      },
      {
        q: 'Is it safe for school use?',
        a: 'KiddoZap has no accounts, no chat and no in-game purchases, and scores are stored in your own browser. The site is supported by ads; see our Privacy Policy.'
      }
    ]
  },
  {
    slug: 'flap-hero',
    gameId: 'flappy',
    title: 'Flap Hero Bird',
    subtitle: 'Classic Precision Flap & Pipe Dodging Game',
    icon: '🐦',
    badge: 'Focus & Timing • Class 1-12',
    category: 'Arcade Classic',
    categorySlug: 'arcade-retro',
    ageRange: 'Age 4-17 (Grades K-12)',
    metaDescription: 'Guide the little flying hero through candy pipe obstacles in Flap Hero Bird on KiddoZap. Collect stars, flap wings, and beat high score records.',
    overview: 'Flap Hero Bird delivers wholesome, colorful arcade joy centered on gravitational rhythm and precision tapping. Guide a cheerful winged hero through narrow gaps between floating candy pillars. The secret lies in discovering the natural rhythmic beat of flapping wings to maintain a steady horizontal flight corridor.',
    controlsDesktop: 'Press [SPACEBAR], [UP ARROW], or Left Mouse Click to flap upward. Allow gravity to glide the bird down between flaps.',
    controlsMobile: 'Tap anywhere on your phone or tablet screen to flap upward.',
    strategies: [
      'Small, consistent taps are far easier to control than frantic, panicked tapping.',
      'Always aim to enter pipe gaps slightly from below: gravity naturally pulls you downward through the gap.',
      'Focus your eyes on the bottom pipe rim to maintain a safe altitude baseline.',
      'Maintain emotional composure: staying relaxed and breathing steadily prevents jerky over-tapping.',
      'Use the golden star collectables as visual waypoints marking the exact center of safe corridors.'
    ],
    cognitiveBenefits: 'Teaches fine rhythmic timing, micro-impulse motor control, emotional frustration tolerance, and sustained visual focus.',
    classroomUtility: 'A classic demonstration of gravitational parabolic flight arcs and game design balance in computer coding clubs.',
    faqs: [
      {
        q: 'Why is Flap Hero Bird so popular with students?',
        a: 'The immediate "one more try" gameplay loop provides instant feedback and tangible satisfaction as high scores climb.'
      },
      {
        q: 'Can younger kids play without getting frustrated?',
        a: 'Our KiddoZap edition features gentle pipe clearances optimized for fair play and wholesome fun for all age groups.'
      },
      {
        q: 'Are high scores saved?',
        a: 'Yes, personal best records persist in your device’s local browser storage.'
      },
      {
        q: 'Does it work smoothly on touchscreens?',
        a: 'Yes, with ultra-responsive sub-16ms touch input latency.'
      }
    ]
  },
  {
    slug: 'fruit-slice',
    gameId: 'fruitslice',
    title: 'Fruit Slice Frenzy',
    subtitle: 'Ninja Blade Swipe & Fruit Chopping Action',
    icon: '🍉',
    badge: 'Ninja Reflex • Class 1-12',
    category: 'Reflex Action',
    categorySlug: 'action-reflex',
    ageRange: 'Age 4-17 (Grades K-12)',
    metaDescription: 'Slice flying juicy watermelons and pineapples in Fruit Slice Frenzy on KiddoZap. Swipe ninja blades, dodge bombs, and trigger exciting combos.',
    overview: 'Fruit Slice Frenzy unleashes your inner kitchen ninja! Juicy watermelons, crisp apples, tropical pineapples, and sweet bananas are propelled upward into the air. Swipe your luminous energy blade across multiple fruits in a single fluid gesture to score massive combo multipliers while dodging ticking explosive bombs.',
    controlsDesktop: 'Click and drag the Mouse Cursor across flying fruits to slice them. Release to finish the blade stroke.',
    controlsMobile: 'Swipe your finger dynamically across the screen to slice multiple fruits in one motion.',
    strategies: [
      'Wait for fruits to reach the apex (highest point) of their parabolic arc where their velocity slows momentarily before slicing.',
      'Slice in long, sweeping diagonal strokes to catch 3 or 4 fruits in a single combo strike.',
      'Listen for the telltale ticking fuse audio of bombs and keep your blade far away from dark metallic orbs.',
      'Slice glowing rainbow fruit to activate Freeze Mode, which slows all airborne targets for easy combo harvesting.',
      'Never swipe wildly across the screen—deliberate, measured strokes prevent accidental bomb detonations.'
    ],
    cognitiveBenefits: 'Promotes trajectory prediction, fine motor swipe coordination, visual discernment under clutter, and impulse inhibition.',
    classroomUtility: 'Great for energetic brain breaks, fine motor physical therapy exercises, and touchscreen hand-eye coordination practice.',
    faqs: [
      {
        q: 'What happens if you slice a bomb?',
        a: 'Slicing a bomb ends your round immediately, tallying your final sliced fruit score and combo bonus.'
      },
      {
        q: 'How do you get combo points?',
        a: 'Slicing 3, 4, or 5 fruits with a single unbroken blade swipe awards combo badges and massive score multipliers.'
      },
      {
        q: 'Is there any blood or realistic weapons?',
        a: 'None! Sliced fruits burst into splashy fruit juice and colorful seed particles in 100% family-friendly cartoon style.'
      },
      {
        q: 'Does the game support multi-touch on iPads and tablets?',
        a: 'Yes! You can even slice with two fingers simultaneously on supported touchscreen devices.'
      }
    ]
  },
  {
    slug: 'snake',
    gameId: 'snake',
    title: 'Classic Retro Neon Snake',
    subtitle: 'Nostalgic Grid Slither & Apple Feast',
    icon: '🐍',
    badge: 'Spatial Strategy • Class 1-12',
    category: 'Arcade Classic',
    categorySlug: 'arcade-retro',
    ageRange: 'Age 4-17 (Grades K-12)',
    metaDescription: 'Play Classic Retro Neon Snake online on KiddoZap. Slither across the grid, eat juicy red apples, grow super long, and avoid crashing into your own tail.',
    overview: 'Classic Retro Neon Snake revives the iconic mobile arcade title that captivated millions in the late 1990s, updated with radiant neon grid aesthetics and smooth responsive controls. Guide the slithering serpent to devour glowing red apples, expanding your tail length with every bite while avoiding boundary walls and your own growing body.',
    controlsDesktop: 'Steer using [ARROW KEYS] or [W]/[A]/[S]/[D].',
    controlsMobile: 'Swipe in four directions (Up, Down, Left, Right) or use on-screen D-pad navigation arrows.',
    strategies: [
      'Adopt a perimeter patrol strategy: travel along the outer walls and zigzag inward to preserve open central maneuvering space.',
      'Never double back on your own neck: reversing direction into your own head causes an instant collision.',
      'As your snake grows longer, plan your path so you always leave an open escape route out of enclosed loops.',
      'Coil your body systematically in tight S-curves rather than making erratic turns across the grid.',
      'Be patient: rushing to grab an apple across a crowded screen is the #1 cause of self-collisions.'
    ],
    cognitiveBenefits: 'Develops spatial geometry navigation, perimeter containment awareness, heuristic planning, and future consequence prediction.',
    classroomUtility: 'Used in early coding curricula to introduce 2D grid coordinates, array data structures, and linked list concept models.',
    faqs: [
      {
        q: 'How does the snake grow?',
        a: 'Each apple consumed adds one glowing segment to the snake’s tail and increases your score.'
      },
      {
        q: 'Can the snake pass through borders in this edition?',
        a: 'Choose between Classic Bordered Arena (walls are solid) or Wrap-Around Portal Arena in the options lobby.'
      },
      {
        q: 'Is there a pause button during long runs?',
        a: 'Yes, press [P] or tap the pause icon to take a rest anytime during your marathon game.'
      },
      {
        q: 'Is Snake safe for kids of all ages?',
        a: '100% safe, non-violent, and beloved by players from preschool to adulthood.'
      }
    ]
  },
  {
    slug: 'whack-a-mole',
    gameId: 'whack',
    title: 'Whack-A-Mole Reflex Smash',
    subtitle: 'Fast-Paced Carnival Mole Popping Game',
    icon: '🐹',
    badge: 'Speed & Reflex • Class K-8',
    category: 'Reflex Action',
    categorySlug: 'action-reflex',
    ageRange: 'Age 3-13 (Grades PreK-8)',
    metaDescription: 'Test your reaction speed in Whack-A-Mole Reflex Smash on KiddoZap. Tap mischievous moles popping out of their garden burrows before they disappear.',
    overview: 'Whack-A-Mole Reflex Smash brings all the laughter and excitement of the boardwalk arcade straight to your browser. Cheeky cartoon moles pop their heads out of grassy garden burrows, wearing silly hats and making funny faces. Players must react with lightning speed to tap them before they vanish back underground.',
    controlsDesktop: 'Left Click on moles as soon as they emerge from their holes.',
    controlsMobile: 'Tap directly on moles with your fingers as quickly as they appear on screen.',
    strategies: [
      'Keep your eyes scanning the entire 3x3 garden grid rather than staring at a single hole.',
      'Gold crowned moles are worth triple bonus points—prioritize them whenever they pop up!',
      'Watch out for spiky helmet moles that require a quick double-tap.',
      'Avoid swinging at empty holes: consecutive hits build a golden hammer multiplier.',
      'Use both hands on tablets to cover the left and right sides of the garden field.'
    ],
    cognitiveBenefits: 'Sharpens optical target acquisition, speed of visual response, motor tapping precision, and broad peripheral attention.',
    classroomUtility: 'A favorite joyful warm-up game for kindergarten and early primary school children during computer lab orientation.',
    faqs: [
      {
        q: 'Are any animals hurt in the game?',
        a: 'Never! Smashed moles simply pop back underground with funny cartoon stars circling their heads, making kids giggle.'
      },
      {
        q: 'Can toddlers play on a touch screen?',
        a: 'Yes, the large, vibrant hitboxes are perfectly calibrated for little fingers developing motor skills.'
      },
      {
        q: 'How long does a standard round last?',
        a: 'Rounds last a quick, engaging 60 seconds, perfect for short attention spans.'
      },
      {
        q: 'Is the game free to play on KiddoZap?',
        a: '100% free with no downloads, subscriptions, or intrusive ads.'
      }
    ]
  },
  {
    slug: 'magic-piano',
    gameId: 'piano',
    title: 'Magic Piano Melody Tiles',
    subtitle: 'Interactive Musical Piano & Melody Creation',
    icon: '🎹',
    badge: 'Music & Creativity • Class PreK-8',
    category: 'Music & Creative',
    categorySlug: 'early-learning',
    ageRange: 'Age 3-12 (Grades PreK-6)',
    metaDescription: 'Play colorful musical tunes with Magic Piano Melody Tiles on KiddoZap. Tap rainbow piano keys, compose melodies, and learn popular nursery songs.',
    overview: 'Magic Piano Melody Tiles invites budding young musicians to explore musical harmony and rhythm. Featuring bright rainbow-colored piano keys labeled with musical notes (Do-Re-Mi / C-D-E), kids can play along with guided popular nursery rhymes like "Twinkle Twinkle Little Star" and "Für Elise", or freestyle compose their own original songs.',
    controlsDesktop: 'Click piano keys with the Mouse, or play notes using keyboard keys [A, S, D, F, G, H, J, K].',
    controlsMobile: 'Tap the vibrant rainbow piano keys directly with your fingers to play notes and chords.',
    strategies: [
      'Follow the falling glowing star notes in Guided Mode to learn your first complete musical melody.',
      'Notice how notes ascend in pitch from left (deep bass) to right (high treble).',
      'Try playing simple repeating sequences like C-D-E-C (Are You Sleeping, Brother John?).',
      'Switch between Grand Piano, Vibraphone, Flute, and Silly Animal Sound instruments in the sound menu.',
      'Sing the lyric words aloud while tapping keys to link phonetics with melodic pitch.'
    ],
    cognitiveBenefits: 'Nurtures auditory pitch discrimination, phonological memory, rhythmic pattern recognition, and creative self-expression.',
    classroomUtility: 'Used in early childhood music education to introduce elementary pitch concepts without requiring expensive acoustic instruments.',
    faqs: [
      {
        q: 'Do kids need prior piano experience to play?',
        a: 'Not at all! The color-coded keys and guided song modes make making music effortless from the very first tap.'
      },
      {
        q: 'What songs are included in the melody songbook?',
        a: 'Features beloved classics including Twinkle Twinkle, Happy Birthday, Old MacDonald, Mary Had a Little Lamb, and Ode to Joy.'
      },
      {
        q: 'Can multiple keys be pressed at the same time for chords?',
        a: 'Yes, full polyphonic audio synthesis allows playing rich 3-note chords on both keyboard and multi-touch screens.'
      },
      {
        q: 'Is the sound quality clean and safe for children’s ears?',
        a: 'Yes, all synthesized tones are digitally filtered to prevent harsh peaks or jarring acoustic spikes.'
      }
    ]
  },
  {
    slug: 'four-in-a-line',
    gameId: 'connect4',
    title: 'Four in a Line',
    subtitle: 'Vertical Grid Tactical Strategy & Four-in-a-Row',
    icon: '🔴',
    badge: 'Tactical Strategy • Class 1-12',
    category: 'Brain & Logic',
    categorySlug: 'brain-puzzles',
    ageRange: 'Age 5-17 (Grades K-12)',
    metaDescription: 'Play Four in a Line free on KiddoZap. Drop yellow and red discs, plan vertical, horizontal, and diagonal lines, and outsmart smart AI opponents.',
    overview: 'Four in a Line is a timeless vertical strategy game of mathematical depth and tactical cunning. Players take turns dropping colored checkers into a 7-column, 6-row suspended blue grid. The objective: be the first player to form an unbroken horizontal, vertical, or diagonal line of four matching discs while actively blocking your opponent’s tactical threats.',
    controlsDesktop: 'Hover mouse over your desired column and Left Click to drop a disc into that slot.',
    controlsMobile: 'Tap the column arrow above the grid where you want your checker to fall.',
    strategies: [
      'Control the center column (Column 4): discs in the middle column can participate in exponentially more potential 4-in-a-row winning lines than edge columns.',
      'Always look for opponent three-in-a-rows before making your move to prevent sudden game-ending surprises.',
      'Create "double threats" (forks) where your move creates two simultaneous winning lines that the opponent cannot block in one turn.',
      'Never place a disc directly underneath an opponent’s critical empty slot unless you are forcing an immediate defense.',
      'Think one move ahead: calculate which cell will open up for your opponent once your disc settles at the bottom of a column.'
    ],
    cognitiveBenefits: 'Strengthens non-verbal strategic planning, forward move calculation, spatial diagonal visualization, and inhibitory caution.',
    classroomUtility: 'A favorite staple for school chess and board game clubs, teaching game-tree analysis and combinatorial game theory.',
    faqs: [
      {
        q: 'Can you play with a friend on the same computer?',
        a: 'Yes! You can toggle between 1-Player vs Smart AI and 2-Player Pass-and-Play mode with friends or family.'
      },
      {
        q: 'Is there an unbeatable strategy in Four in a Line?',
        a: 'Mathematically, Four in a Line is a "solved game" where perfect play starting in the center column guarantees a win, making center control vital!'
      },
      {
        q: 'How smart is the computer AI?',
        a: 'We feature 3 difficulty settings: Easy (great for beginners), Medium (balanced), and Master (tests competitive teens).'
      },
      {
        q: 'Is Four in a Line free to play on KiddoZap?',
        a: '100% free with no downloads, subscriptions, or paywalls.'
      }
    ]
  },
  {
    slug: 'bubble-shooter',
    gameId: 'bubble',
    title: 'Neon Bubble Shooter Mania',
    subtitle: 'Color Match Cluster Pop & Angle Aim Arcade',
    icon: '🫧',
    badge: 'Arcade Puzzle • Class 1-12',
    category: 'Arcade Puzzle',
    categorySlug: 'brain-puzzles',
    ageRange: 'Age 5-17 (Grades K-12)',
    metaDescription: 'Aim and match vibrant bubbles in Neon Bubble Shooter Mania on KiddoZap. Bank angle shots off walls, trigger massive cluster drops, and clear ceilings.',
    overview: 'Neon Bubble Shooter Mania blends geometric angle physics with satisfying color-matching chain reactions. From the cannon at the bottom of the arena, players launch brightly colored bubbles toward descending clusters. Matching three or more identical colors pops the cluster, dropping any disconnected bubbles attached underneath.',
    controlsDesktop: 'Aim cannon using Mouse Cursor trajectory line. Left Click to shoot the loaded bubble.',
    controlsMobile: 'Drag your finger to aim the laser trajectory line; release finger to fire the bubble into the cluster.',
    strategies: [
      'Use bank shots off the side walls to curve bubbles into tight upper pockets that cannot be reached with direct straight shots.',
      'Aim for root clusters: popping a branch at its base causes all bubbles hanging below it to drop automatically (avalanche bonus!).',
      'Check your upcoming bubble queue shown next to the cannon so you can plan two shots in advance.',
      'Clear ceiling anchor connections early to prevent the entire ceiling from descending onto your launcher.',
      'When given an unhelpful color, fire it safely into an isolated corner rather than blocking your main matching target.'
    ],
    cognitiveBenefits: 'Enhances geometric bank angle calculation, cluster pattern recognition, visual-spatial planning, and trajectory anticipation.',
    classroomUtility: 'Excellent for science and math teachers illustrating reflective optical angles and physics collision models.',
    faqs: [
      {
        q: 'What causes the bubble ceiling to drop?',
        a: 'Missing several consecutive shots without popping bubbles causes the ceiling grid to descend one step closer to your launcher.'
      },
      {
        q: 'What is an avalanche drop?',
        a: 'When you pop a cluster that supports other bubbles, all unsupported bubbles drop into the score buckets below for massive bonus points!'
      },
      {
        q: 'Is Bubble Shooter accessible for young students?',
        a: 'Yes, intuitive aim guides and high-contrast color bubbles ensure smooth, fun gameplay for all age groups.'
      },
      {
        q: 'Can you swap between two loaded bubbles?',
        a: 'Yes, click the cannon swap icon to switch between your current and on-deck bubbles.'
      }
    ]
  },
  {
    slug: 'tic-tac-toe',
    gameId: 'tictactoe',
    title: 'Tic Tac Toe Brain AI',
    subtitle: 'Classic X & O Grid Strategy with Smart Robot',
    icon: '🧠',
    badge: 'Logic & AI • Class PreK-12',
    category: 'Brain Strategy',
    categorySlug: 'brain-puzzles',
    ageRange: 'Age 4-17 (Grades PreK-12)',
    metaDescription: 'Play Tic Tac Toe online free against Smart AI or in 2-Player mode on KiddoZap. Master classic X and O tactics and solve grid challenges.',
    overview: 'Tic Tac Toe Brain AI is the quintessential starter game of logic and strategy. Played on a 3x3 grid, players place their mark (X or O) turn by turn. The goal is simple yet deep: align three marks horizontally, vertically, or diagonally while preventing your opponent from doing the same. Play against our playful AI bot or challenge a classmate in 2-player local mode.',
    controlsDesktop: 'Click any empty grid square to place your symbol (X or O).',
    controlsMobile: 'Tap an empty square on your phone or tablet screen to mark your choice.',
    strategies: [
      'Claim the center square on your first turn whenever available: it gives you 4 possible winning paths (horizontal, vertical, and two diagonals).',
      'If your opponent takes the center first, always place your mark in one of the 4 corner squares to guarantee a draw.',
      'The Corner Trap: placing marks in opposite corners sets up an unblockable dual fork if your opponent misplays their edges.',
      'Always look for opponent two-in-a-rows before making your offensive move to block their instant win.',
      'Understand that perfect play from both players will always result in a well-fought draw (Cat’s Game).'
    ],
    cognitiveBenefits: 'Introduces fundamental game theory, conditional if-then reasoning, adversarial threat anticipation, and grid coordinate mapping.',
    classroomUtility: 'Used in early childhood classrooms and introductory coding clubs to explain basic algorithmic decision trees and minimax logic.',
    faqs: [
      {
        q: 'Can you beat the Smart AI on Hard mode?',
        a: 'The Hard AI uses the mathematical Minimax algorithm—meaning it will never make a mistake! The best possible outcome is a brilliant draw.'
      },
      {
        q: 'Can two kids play together on one Chromebook?',
        a: 'Yes! Select 2-Player Mode to take turns placing X and O on the same screen.'
      },
      {
        q: 'Is Tic Tac Toe suitable for preschool and kindergarten kids?',
        a: 'Yes, the simple rules and clean visual layout make it the perfect introductory strategy game for children aged 4 and up.'
      },
      {
        q: 'Are high score statistics saved?',
        a: 'Yes, your win, loss, and draw counts are stored locally on your device.'
      }
    ]
  },
  {
    slug: 'nursery-rhymes',
    gameId: 'rhymes',
    title: 'Animated Nursery Rhymes Sing-Along',
    subtitle: 'Interactive Musical Songs & Lyrics for Early Learners',
    icon: '🎵',
    badge: 'Pre-K & Music • Ages 2-7',
    category: 'Early Learning',
    categorySlug: 'early-learning',
    ageRange: 'Age 2-7 (Pre-K to Grade 2)',
    metaDescription: 'Sing along to animated nursery rhymes on KiddoZap: Twinkle Twinkle, Old MacDonald, Wheels on the Bus, and Baa Baa Black Sheep with lyrics.',
    overview: 'Animated Nursery Rhymes Sing-Along is a joyful interactive musical sandbox built specifically for toddlers, preschool, and kindergarten learners. Featuring beloved traditional melodies accompanied by whimsical, vibrant animations—such as a smiling yellow bus with spinning wheels, twinkling night sky stars, and cheerful farmyard animals—children sing along while lyrics illuminate word by word.',
    controlsDesktop: 'Click interactive animated characters and song cards using your Mouse.',
    controlsMobile: 'Tap characters, animals, and play buttons directly with your fingers to hear delightful sounds.',
    strategies: [
      'Sing aloud with your child while pointing at the illuminated lyric words to build early phonetic reading comprehension.',
      'Tap on the interactive farm animals (cows, ducks, sheep) to hear their authentic animal sounds and see cute dance animations.',
      'Encourage children to clap their hands to the steady beat of "Wheels on the Bus" to develop motor cadence.',
      'Replay "Twinkle Twinkle Little Star" during quiet time or bedtime wind-down routines.',
      'Ask your child what color animals or objects appear on screen to reinforce vocabulary and visual naming.'
    ],
    cognitiveBenefits: 'Builds early phonemic awareness, vocabulary acquisition, speech prosody, auditory sequencing, and joy of reading.',
    classroomUtility: 'Essential for preschool teachers, daycare providers, and kindergarten educators during circle time and sing-along transitions.',
    faqs: [
      {
        q: 'What popular songs are featured in this module?',
        a: 'Includes Twinkle Twinkle Little Star, The Wheels on the Bus, Old MacDonald Had a Farm, and Baa Baa Black Sheep, with lyrics displayed clearly.'
      },
      {
        q: 'Is the animation safe for young toddlers’ eyes?',
        a: 'Yes. Our animations use gentle frame transitions, warm friendly colors, and zero overstimulating strobe flashes.'
      },
      {
        q: 'Are there any ads that interrupt the songs?',
        a: 'No intrusive pop-ups or mid-song interruptions ever compromise the child’s musical flow.'
      },
      {
        q: 'Can children play on an iPad or tablet independently?',
        a: 'Yes, big friendly touch buttons allow even 2-year-olds to explore songs without adult assistance.'
      }
    ]
  },
  {
    slug: 'memory-match',
    gameId: 'cardflip',
    title: 'Animal Memory Match Cards',
    subtitle: 'Visual Working Memory & Card Flip Concentration',
    icon: '🦁',
    badge: 'Memory & Focus • Class PreK-5',
    category: 'Memory & Brain',
    categorySlug: 'brain-puzzles',
    ageRange: 'Age 3-10 (Grades PreK-5)',
    metaDescription: 'Boost working visual memory with Animal Memory Match on KiddoZap. Flip cards to reveal twin animal pairs in fun concentration challenges.',
    overview: 'Animal Memory Match is an enchanting card concentration game designed to train children’s working visual memory and spatial recall. A grid of mystery cards is laid face-down. Players flip two cards at a time, searching for matching pairs of friendly lions, pandas, foxes, monkeys, and dolphins while keeping track of card locations.',
    controlsDesktop: 'Left Click any face-down card to flip it over. Click a second card to test for a match.',
    controlsMobile: 'Tap face-down cards with your finger to flip them and uncover the cute animals.',
    strategies: [
      'Organize your search: systematically flip adjacent cards row by row rather than picking random cards across the board.',
      'Say the animal name aloud when flipping (e.g., "Panda in top-left corner") to engage both auditory and visual memory pathways.',
      'Create mental landmarks: remember that the roaring lion was next to the happy elephant.',
      'If you flip an animal you saw earlier, pause for a moment to recall its exact previous location before flipping your second card.',
      'Work to complete the board in the lowest number of total turns to earn a 3-star memory badge.'
    ],
    cognitiveBenefits: 'Strengthens working memory capacity, spatial recall encoding, focus retention, and non-verbal pattern recognition.',
    classroomUtility: 'Widely praised by early childhood specialists as a gold-standard diagnostic and developmental focus exercise.',
    faqs: [
      {
        q: 'How many cards are on the board?',
        a: 'Choose from Beginner (2x3 grid = 6 cards), Intermediate (3x4 grid = 12 cards), and Master (4x4 grid = 16 cards).'
      },
      {
        q: 'What happens when you find a matching pair?',
        a: 'The matched animal cards emit a cheerful chime, illuminate with golden sparkles, and remain face-up on the board.'
      },
      {
        q: 'Is Animal Memory Match suitable for children with ADHD or attention challenges?',
        a: 'Yes, the gentle pace and rewarding feedback help scaffold sustained attention in short, manageable sessions.'
      },
      {
        q: 'Is it completely free to play?',
        a: 'Yes, 100% free with no downloads, subscriptions, or paywalls.'
      }
    ]
  }
];

// 6 guides for parents and teachers
const ARTICLES_DATA = [
  {
    slug: 'benefits-of-puzzle-games-for-kids-brain-development',
    title: 'Why Logic Puzzles Are Good Practice for Young Minds',
    subtitle: 'How simple puzzle games help kids practise memory, focus and step-by-step thinking',
    metaDescription: 'How logic puzzles like Sudoku, Four in a Line and Tic Tac Toe help children practise memory, focus and step-by-step thinking, with tips for parents and teachers.',
    readTime: '4 min read',
    category: 'Learning & Puzzles',
    content: `
      <h2>Play is one of the ways children learn</h2>
      <p>Children learn a great deal through play, and puzzle games are a good example. A puzzle asks a child to hold a few facts in mind, try an idea, notice that it did not work, and try something else. Teachers often describe these habits as working memory, flexible thinking and self-control. None of this needs special equipment: a simple grid game is enough to practise all three.</p>
      <p>A puzzle game also gives instant feedback. When a child places a number in <a href="/games/sudoku">Kiddo Sudoku</a> or drops a disc in <a href="/games/four-in-a-line">Four in a Line</a>, they see the result straight away and can adjust. That quick loop of try, see, adjust is what makes puzzles satisfying for many kids.</p>

      <h2>1. Practising memory and planning</h2>
      <p>In a 4x4 Sudoku grid a child has to remember which numbers are already used in a row and column. In <a href="/games/tic-tac-toe">Tic Tac Toe</a> they have to think one move ahead. These are small, friendly exercises in keeping a few things in mind at once and planning a step before acting.</p>
      <div class="info-box">
        <h4>Three habits puzzles can help practise:</h4>
        <p><strong>• Remembering:</strong> keeping a few pieces of information in mind while solving.<br>
        <strong>• Switching plans:</strong> changing tactics when the first idea hits a dead end.<br>
        <strong>• Slowing down:</strong> checking a move before making it instead of guessing.</p>
      </div>

      <h2>2. Reasoning instead of guessing</h2>
      <p>Logic games reward "if this, then that" thinking. In Sudoku, a child might reason: "If this square is a 3, that row cannot have another 3, so the last cell must be a 4." Working this way is a gentle introduction to the kind of step-by-step reasoning used later in maths and science. Many teachers find that children who enjoy puzzles are more willing to keep trying when a problem is hard.</p>

      <h2>3. Learning to lose without giving up</h2>
      <p>In a low-stakes game, losing is not a big deal. After a defeat in Four in a Line, most children want to try again and often spot what they did wrong. That habit of reviewing a mistake and having another go is useful in schoolwork too.</p>

      <h2>A note on expectations</h2>
      <p>Researchers are still studying how much the skills practised in games carry over to schoolwork, so it is best to treat puzzles as good practice and a fun break, not as a guarantee of better grades. They work best alongside reading, outdoor play and time with family.</p>

      <h2>Tips for parents and teachers</h2>
      <ul>
        <li><strong>Keep sessions short:</strong> ten minutes of puzzles is plenty, for example a quick <a href="/games/sudoku">Sudoku</a> or <a href="/games/bubble-shooter">Bubble Shooter</a> round before homework.</li>
        <li><strong>Ask "why?":</strong> praise a child's explanation of their move more than how fast they finished.</li>
        <li><strong>Play together:</strong> two children solving one grid will naturally talk through their thinking.</li>
      </ul>
    `
  },
  {
    slug: 'how-math-games-improve-speed-and-accuracy',
    title: 'Making Mental Math Practice Fun with Games',
    subtitle: 'Short, low-pressure drills can make arithmetic feel less like homework',
    metaDescription: 'Simple ideas for using short math games such as Balloon Math Hero to practise addition, subtraction and times tables without the stress of a worksheet.',
    readTime: '4 min read',
    category: 'Math Practice',
    content: `
      <h2>Why practice feels hard for some children</h2>
      <p>For many children, arithmetic practice means worksheets and timed tests, and that can make maths feel stressful. When a child is worried about being wrong, it is harder to think clearly. A game does not remove the need to practise, but it can make the practice feel lighter: a wrong answer just means "try again", and the next question arrives straight away.</p>
      <p>In <a href="/games/math-sprint">Balloon Math Hero</a>, children pop balloons that show the correct answer. The questions are the same kind of addition, subtraction, multiplication and division they meet in class, just wrapped in a short, colourful challenge.</p>

      <h2>1. Why quick recall matters</h2>
      <p>When a child has to work out 35 - 14 from scratch in the middle of an algebra problem, the maths itself gets harder to follow. Knowing basic number facts quickly frees attention for the bigger idea. Practising those facts in short, repeated rounds is a simple way to build that fluency. A few minutes of rapid questions each day tends to work better than one long session once a week.</p>

      <h2>2. Instant feedback keeps practice active</h2>
      <p>On a paper worksheet, a child may not find out about a mistake until the page is marked days later. In a game, the answer is checked immediately, so a mistake can be corrected while the question is still fresh. Sounds, colours and streak counters also give small rewards for steady effort, which helps younger children stay interested.</p>

      <h2>3. Making mistakes feel safe</h2>
      <p>A gentle sound and another try feel very different from a red cross on a quiz. Children who are nervous about maths are often more willing to guess, estimate and experiment when nothing is at stake. That willingness to try is where progress starts.</p>

      <h2>Ideas for home and school</h2>
      <ol>
        <li><strong>Short, frequent rounds:</strong> two 5-minute sessions a day are easier to keep up than one long session.</li>
        <li><strong>Beat your own best:</strong> celebrate a child's longest streak of correct answers rather than comparing with others.</li>
        <li><strong>Mix in logic games:</strong> pair math drills with games like <a href="/games/four-in-a-line">Four in a Line</a> and <a href="/games/brick-breaker">Brick Breaker</a>, which use angles and planning in a playful way.</li>
        <li><strong>Keep real practice too:</strong> games work best as a warm-up, not as a replacement for working through problems on paper and talking about them.</li>
      </ol>
    `
  },
  {
    slug: 'healthy-screen-time-rules-for-school-children',
    title: 'Healthy Screen Time Habits for School Children: Simple Rules for Parents',
    subtitle: 'Practical habits for balancing games, schoolwork and offline play',
    metaDescription: 'Practical screen time habits for school-age children: short sessions, the 20-20-20 eye rule, a screen-free hour before bed and plenty of active play.',
    readTime: '5 min read',
    category: 'Parenting Tips',
    content: `
      <h2>It is about balance, not just hours</h2>
      <p>Debates about children and screens often swing between "screens are harmful" and "screens are educational". In practice, most families need something in the middle. What a child does on the screen, how long, and what it replaces (sleep, homework, outdoor play) all matter. Health organisations such as the World Health Organization and the American Academy of Pediatrics publish current guidance on screen time for different ages, and it is worth reading their latest advice directly because recommendations get updated.</p>
      <p>Active, goal-based play, like solving a <a href="/games/memory-match">Memory Match</a> board or learning the rhythm of <a href="/games/neon-rhythm-run">Neon Rhythm Run</a>, is generally a better use of screen time than endless scrolling through videos, because the child is making decisions rather than only watching.</p>

      <h2>1. Give the eyes regular breaks</h2>
      <p>Looking closely at a screen for a long time can make eyes feel tired and dry, partly because we blink less. A simple habit many eye doctors suggest is the <strong>20-20-20 rule</strong>:</p>
      <div class="info-box">
        <h4>The 20-20-20 rule</h4>
        <p><strong>• Every 20 minutes</strong> pause the game or lesson.<br>
        <strong>• Look at something 20 feet (about 6 metres) away</strong>, such as out of a window.<br>
        <strong>• For at least 20 seconds</strong>, and blink naturally before going back.</p>
      </div>
      <p>If a child often complains of headaches or sore eyes, a visit to an eye doctor is the right next step.</p>

      <h2>2. Keep the hour before bed screen-free</h2>
      <p>Many paediatric organisations suggest avoiding screens shortly before bedtime, because bright screens and exciting games can make it harder to wind down. A quiet routine such as reading a book, listening to a story or playing a board game helps most children fall asleep more easily.</p>

      <h2>3. Choose games that respect a child's time</h2>
      <p>Some commercial mobile games are designed to keep children playing with countdown timers, loot boxes and constant notifications. When choosing games, look for ones that are clear about what they are, with no hidden purchases and no pressure to come back. On KiddoZap the games are free to play and have no in-game purchases, so a child can finish a round of <a href="/games/slope-run">Slope Run</a> or <a href="/games/neon-maze-runner">Neon Maze Runner</a> and simply close the tab.</p>

      <h2>A simple family checklist</h2>
      <ul>
        <li><strong>Set screen-free zones:</strong> for example the dining table and bedrooms.</li>
        <li><strong>Protect active time:</strong> make sure there is daily outdoor play or exercise.</li>
        <li><strong>Play together sometimes:</strong> take turns at <a href="/games/tic-tac-toe">Tic Tac Toe</a> or <a href="/games/hop-and-cross">Hop and Cross</a> so screen time becomes shared time.</li>
        <li><strong>Agree on rules ahead of time:</strong> a fixed time and a clear stopping point avoid arguments later.</li>
      </ul>
    `
  },
  {
    slug: 'hand-eye-coordination-and-reflex-training-in-teens',
    title: 'Action Games, Reflexes and Hand-Eye Coordination: What Players Can Expect',
    subtitle: 'Why fast games feel good, what they practise, and how to play comfortably',
    metaDescription: 'A plain-language look at what fast action games practise, such as timing and hand-eye coordination, plus ergonomic tips for comfortable play.',
    readTime: '4 min read',
    category: 'Action Games',
    content: `
      <h2>What happens when you react to something on screen</h2>
      <p>When an obstacle appears on screen, your eyes spot it, your brain decides what to do, and your finger taps or clicks. That whole chain takes a fraction of a second. Fast action games turn this chain into a fun challenge: the more you play a level, the better you get at spotting patterns and timing your move.</p>
      <p>Reaction speed varies from person to person and also depends on tiredness and focus, so it is best to compare yourself with your own earlier scores rather than with anyone else.</p>

      <h2>1. Timing and scanning the screen</h2>
      <p>In games like <a href="/games/aim-trainer">Aim Reflex Sniper Pro</a>, <a href="/games/tunnel-dash">Speed Tunnel Dash</a> and <a href="/games/fruit-slice">Fruit Slice Frenzy</a>, players learn to look slightly ahead and to take in the whole screen instead of staring at one spot. In <a href="/games/neon-rhythm-run">Neon Rhythm Run</a>, listening to the beat helps with timing the jumps. These are simple, enjoyable ways to practise attention and timing.</p>

      <div class="info-box">
        <h4>Three kinds of quick decisions in games:</h4>
        <p><strong>• Simple reaction:</strong> one signal, one response, such as jumping over a spike in Neon Rhythm Run.<br>
        <strong>• Choice reaction:</strong> picking the right response, such as matching colours in <a href="/games/color-gate-arena">Color Gate Arena</a>.<br>
        <strong>• Spotting the hazard:</strong> telling safe things from dangerous ones, such as ignoring bombs while slicing fruit.</p>
      </div>

      <h2>2. Using both hands together</h2>
      <p>Games such as <a href="/games/stunt-biker">Stunt Biker Challenge</a> and <a href="/games/rooftop-parkour">Rooftop Parkour</a> ask players to control speed and balance or jumps at the same time. This is a friendly way to practise coordinating several actions, a skill that also helps in typing, drawing and sports. Games are not a substitute for actual sport or exercise, though, so keep time for real movement too.</p>

      <h2>3. Playing comfortably</h2>
      <p>Long sessions of fast tapping can tire the hands and eyes. A few simple habits help:</p>
      <ul>
        <li>Keep your wrists straight and your elbows bent at about a right angle.</li>
        <li>Place the screen at eye level so your neck stays relaxed.</li>
        <li>Stretch your fingers and wrists for half a minute every 15 minutes or so.</li>
        <li>Look away from the screen regularly, for example with the 20-20-20 rule.</li>
        <li>Stop if your hands, wrists or eyes hurt.</li>
      </ul>
    `
  },
  {
    slug: 'classroom-brain-breaks-guide-for-teachers',
    title: 'A Teacher\'s Guide to Quick 5-Minute Brain Breaks',
    subtitle: 'Ways teachers can use short browser games to reset attention between lessons',
    metaDescription: 'A practical guide for teachers on using short, timed browser-game brain breaks in class, with three simple formats and a few things to check first.',
    readTime: '5 min read',
    category: 'Classroom Tips',
    content: `
      <h2>Why a short break can help</h2>
      <p>Most teachers know the look students get after a long stretch of listening or test preparation: fidgeting, drifting attention, more mistakes. A short, structured pause often helps students settle back into work. A brain break does not have to involve a screen, but a quick, well-chosen game can be an easy option when you have a smartboard or a few devices available.</p>

      <h2>What makes a good brain break</h2>
      <div class="info-box">
        <h4>Four things to look for:</h4>
        <p><strong>1. A clear time limit (3 to 5 minutes):</strong> the activity needs a definite end.<br>
        <strong>2. No setup:</strong> it should open in the browser without logins or installs.<br>
        <strong>3. Suitable content:</strong> non-violent, clear and age-appropriate.<br>
        <strong>4. A change of mode:</strong> moving from reading and writing to something numerical, rhythmic or hands-on.</p>
      </div>

      <h2>Three simple formats</h2>

      <h3>A: The math warm-up (Grades 1 to 6)</h3>
      <p>Before a worksheet, open <a href="/games/math-sprint">Balloon Math Hero</a> on the smartboard and run a 3-minute round of addition or multiplication together. Students call out answers, which turns practice into a shared activity.</p>

      <h3>B: The movement reset (Grades 4 to 12)</h3>
      <p>After a long writing or reading task, give students 4 minutes with a quick action game such as <a href="/games/neon-rhythm-run">Neon Rhythm Run</a> or <a href="/games/hop-and-cross">Hop and Cross</a>. Agree on the timer first and stop when it ends.</p>

      <h3>C: The logic challenge at the board (all grades)</h3>
      <p>Show <a href="/games/sudoku">Kiddo Sudoku</a> or <a href="/games/four-in-a-line">Four in a Line</a> on the interactive whiteboard. Let student pairs come up one at a time to make a move and explain their reasoning to the class.</p>

      <h2>Before you use any game in class</h2>
      <ul>
        <li><strong>Play it yourself first</strong> to make sure it suits your students and your devices.</li>
        <li><strong>Check your school's policy</strong> on websites and online games, and ask your IT team if the site needs to be allowed on the school network.</li>
        <li><strong>Know that the site shows ads.</strong> KiddoZap is free and supported by advertising, so preview the page with students' ages in mind and use a school filter if you prefer.</li>
        <li><strong>Keep the timer visible</strong> so the break stays a break.</li>
      </ul>
    `
  },
  {
    slug: 'coppa-and-child-online-privacy-guide-for-parents',
    title: 'Children\'s Online Privacy: A Parent\'s Plain-Language Guide to COPPA',
    subtitle: 'What the law is about, what to look for in kids\' games, and how KiddoZap handles data',
    metaDescription: 'A plain-language overview of COPPA, red flags to watch for in kids\' games, and an honest description of how KiddoZap stores scores and shows ads.',
    readTime: '5 min read',
    category: 'Privacy & Safety',
    content: `
      <h2>What is COPPA?</h2>
      <p>The Children's Online Privacy Protection Act (COPPA) is a United States law enforced by the Federal Trade Commission. It sets rules for websites and apps that are aimed at children under 13, or that know they are collecting information from children under 13. In general it limits what personal information can be collected and requires parental consent in many cases. This page is a general overview, not legal advice, and laws in your own country may differ.</p>

      <h2>What counts as personal information?</h2>
      <p>Under COPPA, personal information includes more than just a name. Typical examples are:</p>
      <ul>
        <li>Names, home addresses, email addresses and phone numbers.</li>
        <li>Precise location data.</li>
        <li>Photos, audio or video of a child.</li>
        <li>Persistent identifiers such as cookies or advertising IDs that can be used to track a child across sites.</li>
      </ul>

      <h2>How KiddoZap handles data</h2>
      <div class="info-box">
        <h4>What we do</h4>
        <p>• There are <strong>no accounts, passwords or chat features</strong> on KiddoZap.<br>
        • Scores, stars and settings are saved in <strong>your own browser</strong> (local storage) on your device, not on our servers.<br>
        • We do not ask players for their name, email or location.</p>
        <h4>What you should know</h4>
        <p>• KiddoZap is supported by advertising. Google AdSense and its partners may use cookies on this site. Please read our <a href="/privacy">Privacy Policy</a> for details and for how to manage ad personalisation.<br>
        • We are a small independent site and we do not claim any official certification. If you have questions or concerns, write to <a href="mailto:support@kiddozap.com">support@kiddozap.com</a>.</p>
      </div>

      <h2>Five red flags in kids' games</h2>
      <ol>
        <li><strong>Forced sign-in:</strong> requiring a child to log in with a social account.</li>
        <li><strong>Open chat with strangers:</strong> especially without moderation.</li>
        <li><strong>Ads that look like game buttons:</strong> fake "Start" or "Download" buttons.</li>
        <li><strong>Loot boxes and constant purchase prompts:</strong> mechanics that push children to spend money.</li>
        <li><strong>A vague privacy policy:</strong> one that does not say what is collected or why.</li>
      </ol>

      <h2>Simple steps for parents</h2>
      <ul>
        <li>Review the ad settings on your child's device or account and limit ad personalisation where possible.</li>
        <li>Stay nearby when younger children are online, and talk about not clicking on unknown buttons or ads.</li>
        <li>Read the privacy policy of any site or app your child uses regularly.</li>
      </ul>
    `
  }
];

// 5 Curriculum Category Pages
const CATEGORIES_DATA = [
  {
    slug: 'brain-puzzles',
    title: 'Cognitive Brain & Logic Games for Students',
    subtitle: 'Deductive Reasoning, Sudoku, Memory & Pattern Recognition',
    badge: 'Cognitive & Mind',
    metaDescription: 'Free online brain and logic puzzles for kids and students. Play Sudoku 4x4, Memory Cards, Four in a Line, and pattern teasers on KiddoZap.',
    description: 'Our Brain & Logic collection features carefully selected puzzle titles designed to build deductive reasoning, spatial visualization, pattern analysis, and strategic foresight. Perfect for students from elementary to high school.',
    gameSlugs: ['sudoku', 'four-in-a-line', 'memory-match', 'bubble-shooter', 'tic-tac-toe', 'brick-breaker']
  },
  {
    slug: 'action-reflex',
    title: 'Reflex & Hand-Eye Coordination Action Games',
    subtitle: 'High-Speed Rhythm Runners, 3D Slopes & Aim Reflex Drills',
    badge: 'Reflex & Precision',
    metaDescription: 'Improve reaction time and hand-eye coordination with safe action games on KiddoZap. Play Neon Rhythm Run, Slope 3D, Aim Reflex, and Rooftop Parkour.',
    description: 'Engineered for students looking to test their reflexes and precision motor timing. These non-violent action runners challenge auditory rhythm, visual tracking, and millisecond decision-making.',
    gameSlugs: ['neon-rhythm-run', 'slope-run', 'tunnel-dash', 'aim-trainer', 'rooftop-parkour', 'color-gate-arena', 'stunt-biker', 'fruit-slice', 'whack-a-mole']
  },
  {
    slug: 'arcade-retro',
    title: 'Classic Retro & Nostalgic Arcade Games',
    subtitle: 'Neon Maze Runner, Galaxy Defender, Classic Snake & Hop and Cross',
    badge: 'Retro & Arcade',
    metaDescription: 'Play classic retro arcade games online on KiddoZap. Enjoy Neon Maze Runner, Galaxy Defender, Hop and Cross, and Neon Snake in 100% free format.',
    description: 'Celebrate the golden age of arcade gaming! From maze exploration to galactic defense and retro road crossing, these titles provide timeless, clean entertainment for kids and parents alike.',
    gameSlugs: ['neon-maze-runner', 'galaxy-defender', 'hop-and-cross', 'snake', 'brick-breaker', 'flap-hero', 'jetpack-raider']
  },
  {
    slug: 'math-learning',
    title: 'Mental Math & Arithmetic Fluency Games',
    subtitle: 'Rapid Addition, Subtraction, Multiplication & Number Sense',
    badge: 'Math & STEM',
    metaDescription: 'Practice mental arithmetic and number fluency with free educational math games on KiddoZap. Fast-paced math drills for Class 1-8 students.',
    description: 'Transform repetitive math homework into an exhilarating speed challenge! Practice addition, subtraction, multiplication times tables, and division in low-stress gamified environments.',
    gameSlugs: ['math-sprint', 'sudoku', 'tic-tac-toe']
  },
  {
    slug: 'early-learning',
    title: 'Early Childhood & Pre-K Learning Games',
    subtitle: 'Nursery Rhymes, Magic Piano, Colors & Shape Matching',
    badge: 'Pre-K & Early Years',
    metaDescription: 'Safe, delightful educational mini-games for toddlers and early learners Ages 2-7 on KiddoZap. Sing along to rhymes, play piano, and match shapes.',
    description: 'Tailored for our youngest learners (Ages 2 to 7). These colorful, gentle mini-games build phonological awareness, pitch harmony, color discrimination, and foundational hand-eye coordination.',
    gameSlugs: ['nursery-rhymes', 'magic-piano', 'memory-match', 'whack-a-mole', 'color-gate-arena']
  }
];

const CATEGORY_INTROS = {
  'brain-puzzles': `<h2>Why puzzle games are worth a few minutes</h2>
        <p>Puzzle games ask children to slow down, look at the whole board and think a step or two ahead. Sudoku and Tic Tac Toe are good first choices because the rules are short, while Four in a Line and Bubble Shooter add planning and aiming.</p>
        <p>A good way to use this category is to start with the easiest game, play a few rounds together, and talk about why a move worked or failed. Children who explain their thinking out loud usually get more out of a puzzle than children who simply play faster.</p>
        <h3>How to choose</h3>
        <ul>
          <li><strong>Ages 5 to 7:</strong> start with Tic Tac Toe and Memory Match.</li>
          <li><strong>Ages 8 to 11:</strong> try the 4x4 Sudoku and Four in a Line.</li>
          <li><strong>Ages 12 and up:</strong> move on to the 9x9 Sudoku and Bubble Shooter.</li>
        </ul>`,
  'action-reflex': `<h2>Fast games, short sessions</h2>
        <p>Action games ask players to react quickly: jump at the right moment, aim at a target or time a tap with a beat. They are fun, but they can also tire the eyes and hands, so shorter sessions work best.</p>
        <p>Try setting a timer for ten or fifteen minutes, looking away from the screen between rounds, and comparing your score with your own previous best rather than with other players.</p>
        <h3>Good places to start</h3>
        <ul>
          <li><strong>New to action games:</strong> Neon Rhythm Run and Whack-A-Mole have simple rules that are easy to understand.</li>
          <li><strong>Want more challenge:</strong> Slope Run, Tunnel Dash and Color Gate Arena reward careful timing.</li>
        </ul>`,
  'arcade-retro': `<h2>Classic arcade ideas with a modern look</h2>
        <p>Many arcade games are built on one simple idea that is easy to learn but hard to master: eat the dots, break the bricks, dodge the traffic. That makes them quick to start and easy to share with a parent or an older brother or sister.</p>
        <p>They also make a nice conversation starter. Ask your family which arcade games they played when they were young, and compare them with the versions here. The games in this category take well-known arcade ideas and give them a fresh look.</p>`,
  'math-learning': `<h2>Practice that feels like play</h2>
        <p>Number facts such as 7 plus 8 or 6 times 7 become easier when children see them often in short bursts. A game can make that repetition feel lighter, because a wrong answer just means another try.</p>
        <p>Short rounds of about five minutes work best. When your child gets stuck on a fact, write it down and come back to it the next day. For quiz-style and printable practice, see our free <a href="/tools/times-table-practice">times table practice</a> and <a href="/tools/multiplication-chart">multiplication chart</a>.</p>`,
  'early-learning': `<h2>Gentle games for the youngest players</h2>
        <p>For children aged about 2 to 7, the best games are slow, colourful and easy to understand. Nursery rhymes build listening and vocabulary, memory games practise matching, and tapping games build early hand-eye coordination.</p>
        <p>At this age, play together whenever you can: name the colours and animals, sing along and keep sessions short. Ten minutes is plenty, and the screen should go off well before bedtime. Our <a href="/articles/healthy-screen-time-rules-for-school-children">screen time guide</a> has simple habits to follow.</p>`
};

// 1. GENERATE ALL INDIVIDUAL GAME PAGES
function buildGamePages() {
  console.log('Generating 24 Dedicated Game Pages...');
  GAMES_DATA.forEach(game => {
    const gameDir = path.join(PUBLIC_DIR, 'games', game.slug);
    ensureDir(gameDir);

    const canonicalUrl = `https://kiddozap.com/games/${game.slug}`;
    const breadcrumbs = [
      { name: 'Game Guides', url: '/games' },
      { name: game.title, url: canonicalUrl }
    ];

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "@id": `${canonicalUrl}#app`,
          "name": game.title,
          "description": game.metaDescription,
          "applicationCategory": "GameApplication, EducationalApplication",
          "operatingSystem": "All modern web browsers",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kiddozap.com/" },
            { "@type": "ListItem", "position": 2, "name": "Game Guides", "item": "https://kiddozap.com/games" },
            { "@type": "ListItem", "position": 3, "name": game.title, "item": canonicalUrl }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": `${canonicalUrl}#faq`,
          "mainEntity": game.faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        }
      ]
    };

    const REL_ARTICLE = { 'action-reflex': 'hand-eye-coordination-and-reflex-training-in-teens', 'arcade-retro': 'healthy-screen-time-rules-for-school-children', 'brain-puzzles': 'benefits-of-puzzle-games-for-kids-brain-development', 'early-learning': 'healthy-screen-time-rules-for-school-children', 'math-learning': 'how-math-games-improve-speed-and-accuracy' };
    let relatedGames = GAMES_DATA.filter(g => g.categorySlug === game.categorySlug && g.slug !== game.slug);
    GAMES_DATA.forEach(g => { if (relatedGames.length < 4 && g.slug !== game.slug && !relatedGames.includes(g)) relatedGames.push(g); });
    relatedGames = relatedGames.slice(0, 4);
    const relArt = ARTICLES_DATA.find(a => a.slug === REL_ARTICLE[game.categorySlug]) || ARTICLES_DATA[0];
    const toolLine = (game.categorySlug === 'math-learning' || game.categorySlug === 'brain-puzzles') ? ' You can also try our free <a href="/tools/times-table-practice">times table practice</a>.' : '';

    const contentHtml = `
      <div class="card">
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:12px; flex-wrap:wrap;">
          <div style="width:64px; height:64px; border-radius:18px; background:linear-gradient(135deg, #06b6d4, #4f46e5); display:flex; align-items:center; justify-content:center; font-size:36px; box-shadow:0 6px 18px rgba(6,182,212,0.35);">
            ${game.icon}
          </div>
          <div>
            <h1>${game.title}</h1>
            <p style="margin:0; font-size:14px; color:#38bdf8; font-weight:800;">${game.subtitle}</p>
          </div>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:8px; margin: 16px 0 24px 0;">
          <span class="badge">${game.badge}</span>
          <span class="badge badge-amber">🎯 ${game.ageRange}</span>
          <span class="badge badge-emerald">🛡️ Free to Play &bull; No Sign-up</span>
        </div>

        <!-- Playable game, embedded on its own guide page -->
        <div style="margin:0 0 8px 0;">
          <iframe src="/?game=${game.gameId}&embed=1" title="Play ${game.title}" loading="lazy" allow="fullscreen; autoplay" allowfullscreen style="width:100%; height:min(78vh, 640px); min-height:420px; border:2px solid #1e293b; border-radius:18px; background:#0b0f19; display:block;"></iframe>
          <p style="margin:10px 0 0 0; font-size:13px; color:#94a3b8; text-align:center;">
            Game not loading? <a href="/?game=${game.gameId}">Open ${game.title} in full screen</a>.
          </p>
        </div>

        <h2>📖 Game Overview &amp; Lore</h2>
        <p>${game.overview}</p>

        <h2>🎮 Complete Game Controls Guide</h2>
        <div class="grid-2">
          <div class="info-box">
            <h4>⌨️ Desktop &amp; Chromebook</h4>
            <p>${game.controlsDesktop}</p>
          </div>
          <div class="info-box">
            <h4>📱 Touchscreen &amp; Tablet</h4>
            <p>${game.controlsMobile}</p>
          </div>
        </div>

        <h2>🏆 Master Strategies &amp; Pro Tips</h2>
        <ul>
          ${game.strategies.map(s => `<li>${s}</li>`).join('\n')}
        </ul>

        <h2>🧠 Cognitive &amp; Educational Skill Outcomes</h2>
        <p>${game.cognitiveBenefits}</p>

        <h2>🏫 Classroom &amp; Educator Utility</h2>
        <p>${game.classroomUtility}</p>

        <h2>❓ Frequently Asked Questions (FAQ)</h2>
        ${game.faqs.map(f => `
          <div class="faq-item">
            <h4>${f.q}</h4>
            <p>${f.a}</p>
          </div>
        `).join('\n')}

        <h2>More games you might like</h2>
        <div class="grid-2">
          ${relatedGames.map(g => `
            <div class="info-box">
              <h4><a href="/games/${g.slug}">${g.title}</a></h4>
              <p style="margin:0;">${g.subtitle}</p>
            </div>
          `).join('\n')}
        </div>
        <p>Related reading: <a href="/articles/${relArt.slug}">${relArt.title}</a>.${toolLine}</p>

        <div style="margin-top:36px; padding-top:24px; border-top:1px solid #1e293b; text-align:center;">
          <a href="/?game=${game.gameId}" class="btn-play-hero">
            <span>🎮</span> Launch ${game.title} Now
          </a>
          <p style="margin-top:12px; font-size:13px; color:#64748b;">
            Looking for more challenges? Explore our <a href="/categories/${game.categorySlug}">full ${game.category} catalog</a> or check out <a href="/games">all game guides</a>.
          </p>
        </div>
      </div>
    `;

    const html = renderPage({
      title: `${game.title} - Free Online Game & Guide`,
      description: game.metaDescription,
      canonicalUrl,
      breadcrumbs,
      structuredData,
      contentHtml,
      activeNav: 'games'
    });

    fs.writeFileSync(path.join(gameDir, 'index.html'), html, 'utf-8');
  });
}

// 2. GENERATE ALL 6 EDUCATIONAL ARTICLES
function buildArticlePages() {
  console.log('Generating 6 In-Depth Educational Articles...');
  ARTICLES_DATA.forEach(article => {
    const articleDir = path.join(PUBLIC_DIR, 'articles', article.slug);
    ensureDir(articleDir);

    const canonicalUrl = `https://kiddozap.com/articles/${article.slug}`;
    const breadcrumbs = [
      { name: 'Guides', url: '/articles' },
      { name: article.title, url: canonicalUrl }
    ];

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.metaDescription,
      "image": "https://kiddozap.com/logo.svg",
      "author": {
        "@type": "Organization",
        "name": "KiddoZap",
        "url": "https://kiddozap.com/about"
      },
      "publisher": {
        "@type": "Organization",
        "name": "KiddoZap",
        "logo": { "@type": "ImageObject", "url": "https://kiddozap.com/logo.svg" }
      },
      "datePublished": "2026-10-11",
      "dateModified": "2026-10-11"
    };

    const contentHtml = `
      <article class="card">
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <span class="badge">${article.category}</span>
          <span class="badge badge-amber">⏱️ ${article.readTime}</span>
        </div>

        <h1>${article.title}</h1>
        <p style="font-size:16px; color:#38bdf8; font-weight:700; margin-bottom:24px;">${article.subtitle}</p>

        <div style="padding:14px 18px; background:rgba(30,41,59,0.7); border-radius:14px; border:1px solid #334155; margin-bottom:28px; font-size:13px; color:#94a3b8; display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;">
          <span>✍️ By <strong>KiddoZap</strong></span>
          <span>📅 Updated October 2026</span>
        </div>

        ${article.content}

        <div style="margin-top:40px; padding:24px; background:linear-gradient(135deg,#1e1b4b,#0f172a); border:1px solid #334155; border-radius:18px; text-align:center;">
          <h3 style="margin-top:0; color:#ffffff; font-family:'Fredoka', cursive; font-size:20px;">Put Cognitive Theory into Practice!</h3>
          <p style="color:#cbd5e1; font-size:14px; max-width:600px; margin:0 auto 18px auto;">
            Explore our curated catalog of 50+ non-violent, cognitive browser puzzles and educational math drills.
          </p>
          <a href="/" class="btn-play-hero">
            <span>🎮</span> Visit KiddoZap Game Hub
          </a>
        </div>
      </article>
    `;

    const html = renderPage({
      title: article.title,
      description: article.metaDescription,
      canonicalUrl,
      breadcrumbs,
      structuredData,
      contentHtml,
      activeNav: 'articles'
    });

    fs.writeFileSync(path.join(articleDir, 'index.html'), html, 'utf-8');
  });

  // Articles Hub Index Page
  const articlesIndexDir = path.join(PUBLIC_DIR, 'articles');
  ensureDir(articlesIndexDir);
  const articlesIndexUrl = 'https://kiddozap.com/articles';
  const articlesIndexBreadcrumbs = [{ name: 'Educational Articles Hub', url: articlesIndexUrl }];

  const articlesIndexStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "KiddoZap Guides for Parents & Teachers",
    "description": "Short guides on puzzle games, math practice, screen time habits, classroom brain breaks and children\'s privacy."
  };

  const articlesIndexContent = `
    <div class="card">
      <h1>KiddoZap Guides for Parents &amp; Teachers</h1>
      <span class="badge">📚 Plain-language guides for parents &amp; teachers</span>
      <p>
        Short, practical guides on puzzles, math practice, screen time habits, classroom brain breaks and children's privacy. They are written as general advice for families and teachers, not as medical or legal advice.
      </p>

      <h2>Our Guides</h2>
      <div style="display:flex; flex-direction:column; gap:20px; margin-top:24px;">
        ${ARTICLES_DATA.map(art => `
          <div style="background:#1e293b; border:1px solid #334155; border-radius:18px; padding:24px; transition:border-color 0.2s;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
              <span class="badge" style="margin:0;">${art.category}</span>
              <span style="font-size:12px; color:#94a3b8; font-weight:700;">⏱️ ${art.readTime}</span>
            </div>
            <h3 style="margin:8px 0; font-size:18px; color:#ffffff;">
              <a href="/articles/${art.slug}" style="color:#ffffff; text-decoration:none;">${art.title}</a>
            </h3>
            <p style="margin:0 0 14px 0; font-size:13.5px; color:#cbd5e1; line-height:1.6;">${art.subtitle}</p>
            <a href="/articles/${art.slug}" style="font-size:13px; font-weight:800; color:#38bdf8; display:inline-flex; align-items:center; gap:6px;">
              Read Full Article <span>&rarr;</span>
            </a>
          </div>
        `).join('\n')}
      </div>
    </div>
  `;

  const articlesIndexHtml = renderPage({
    title: 'Guides for Parents & Teachers',
    description: 'Plain-language guides on puzzle games, math practice, healthy screen time habits, classroom brain breaks and children\'s privacy from KiddoZap.',
    canonicalUrl: articlesIndexUrl,
    breadcrumbs: articlesIndexBreadcrumbs,
    structuredData: articlesIndexStructuredData,
    contentHtml: articlesIndexContent,
    activeNav: 'articles'
  });

  fs.writeFileSync(path.join(articlesIndexDir, 'index.html'), articlesIndexHtml, 'utf-8');
}

// 3. GENERATE CATEGORIES PAGES
function buildCategoryPages() {
  console.log('Generating Category Hub Pages...');
  CATEGORIES_DATA.forEach(cat => {
    const catDir = path.join(PUBLIC_DIR, 'categories', cat.slug);
    ensureDir(catDir);

    const canonicalUrl = `https://kiddozap.com/categories/${cat.slug}`;
    const breadcrumbs = [
      { name: 'Categories', url: '/categories' },
      { name: cat.title, url: canonicalUrl }
    ];

    const categoryGames = GAMES_DATA.filter(g => cat.gameSlugs.includes(g.slug));

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": cat.title,
      "description": cat.metaDescription
    };

    const contentHtml = `
      <div class="card">
        <h1>${cat.title}</h1>
        <p style="font-size:15px; color:#38bdf8; font-weight:700; margin-bottom:16px;">${cat.subtitle}</p>
        <span class="badge">${cat.badge}</span>
        <p>${cat.description}</p>

        ${CATEGORY_INTROS[cat.slug] || ''}

        ${cat.slug === 'math-learning' ? `<h2>Free practice tools</h2>
        <ul>
          <li><a href="/tools/times-table-practice">Times Table Practice</a>: quiz yourself on any table from 2 to 12.</li>
          <li><a href="/tools/math-facts-practice">Math Facts Practice</a>: addition, subtraction and division in short rounds.</li>
          <li><a href="/tools/multiplication-chart">Multiplication Chart</a>: a printable 1 to 12 chart.</li>
        </ul>` : ''}

        <h2>Games in this category</h2>
        <div class="grid-2">
          ${categoryGames.map(cg => `
            <div class="info-box">
              <div style="font-size:32px; margin-bottom:8px;">${cg.icon}</div>
              <h4>${cg.title}</h4>
              <p style="margin-bottom:12px;">${cg.subtitle}</p>
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                <a href="/games/${cg.slug}" style="font-size:13px; font-weight:800;">📖 Read Guide</a>
                <a href="/?game=${cg.gameId}" style="background:linear-gradient(135deg,#06b6d4,#4f46e5); color:#fff; font-size:12px; font-weight:800; padding:6px 14px; border-radius:8px; text-decoration:none;">▶ Play Now</a>
              </div>
            </div>
          `).join('\n')}
        </div>
      </div>
    `;

    const html = renderPage({
      title: `${cat.title} • Free Educational Games`,
      description: cat.metaDescription,
      canonicalUrl,
      breadcrumbs,
      structuredData,
      contentHtml,
      activeNav: 'categories'
    });

    fs.writeFileSync(path.join(catDir, 'index.html'), html, 'utf-8');
  });

  // Main Categories Index Page
  const catIndexDir = path.join(PUBLIC_DIR, 'categories');
  ensureDir(catIndexDir);
  const catIndexUrl = 'https://kiddozap.com/categories';
  const catIndexBreadcrumbs = [{ name: 'Categories Directory', url: catIndexUrl }];

  const catIndexStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "KiddoZap Game Categories & Age Directories",
    "description": "Browse games by curriculum focus: Brain Puzzles, Action & Reflex, Retro Arcade, Math Learning, and Early Childhood."
  };

  const catIndexContent = `
    <div class="card">
      <h1>Curriculum Categories &amp; Age Directories</h1>
      <span class="badge">📂 5 Categories &bull; Pre-K to Teens</span>
      <p>
        Every game on KiddoZap is indexed across 5 distinct developmental frameworks to ensure safe, age-appropriate, and cognitively enriching gameplay for all students.
      </p>

      <h2>Select a Learning Category</h2>
      <div style="display:flex; flex-direction:column; gap:18px; margin-top:20px;">
        ${CATEGORIES_DATA.map(c => `
          <div style="background:#1e293b; border:1px solid #334155; border-radius:18px; padding:22px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap;">
              <h3 style="margin:0; font-size:18px; color:#ffffff;">
                <a href="/categories/${c.slug}" style="color:#ffffff; text-decoration:none;">${c.title}</a>
              </h3>
              <span class="badge" style="margin:0;">${c.badge}</span>
            </div>
            <p style="margin:0 0 12px 0; font-size:13.5px; color:#cbd5e1;">${c.description}</p>
            <a href="/categories/${c.slug}" style="font-size:13px; font-weight:800; color:#38bdf8;">
              View Category Games &rarr;
            </a>
          </div>
        `).join('\n')}
      </div>
    </div>
  `;

  const catIndexHtml = renderPage({
    title: 'Game Categories & Curriculum Directories',
    description: 'Browse safe kids games and brain puzzles by category: Brain Puzzles, Reflex Action, Retro Arcade, Math, and Early Learning.',
    canonicalUrl: catIndexUrl,
    breadcrumbs: catIndexBreadcrumbs,
    structuredData: catIndexStructuredData,
    contentHtml: catIndexContent,
    activeNav: 'categories'
  });

  fs.writeFileSync(path.join(catIndexDir, 'index.html'), catIndexHtml, 'utf-8');
}

// 4. GENERATE UPDATED /GAMES/INDEX.HTML WITH LINKS TO ALL 24 GAME PAGES
function updateGamesIndexPage() {
  console.log('Updating /games/index.html with links to all 24 dedicated game pages...');
  const gamesIndexDir = path.join(PUBLIC_DIR, 'games');
  ensureDir(gamesIndexDir);
  const gamesIndexUrl = 'https://kiddozap.com/games';
  const gamesIndexBreadcrumbs = [{ name: 'Game Guides & Manuals', url: gamesIndexUrl }];

  const gamesIndexStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "KiddoZap Game Guides & Controls",
    "description": "Complete gameplay guides, keyboard/touch controls, and learning objectives for 50+ safe online games on KiddoZap."
  };

  const gamesIndexContent = `
    <div class="card">
      <h1>KiddoZap Game Guides &amp; Controls</h1>
      <span class="badge">🕹️ 24 Game Guides &bull; 50+ Games in the Hub &bull; 100% Free</span>
      <p>
        Welcome to the KiddoZap Game Manuals Directory! Each of our titles is engineered for quick, non-violent, cognitively enriching entertainment. Click any game below to read its comprehensive how-to-play instructions, control mappings for desktop and mobile, master tips, and cognitive learning objectives.
      </p>

      <h2>Complete Game Library (Instant Guides &amp; Play)</h2>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:18px; margin-top:20px;">
        ${GAMES_DATA.map(g => `
          <div style="background:#1e293b; border:1px solid #334155; border-radius:18px; padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="font-size:32px; margin-bottom:8px;">${g.icon}</div>
              <h3 style="margin:0 0 6px 0; font-size:16px; color:#ffffff;">
                <a href="/games/${g.slug}" style="color:#ffffff; text-decoration:none;">${g.title}</a>
              </h3>
              <p style="margin:0 0 10px 0; font-size:12px; color:#38bdf8; font-weight:700;">${g.badge}</p>
              <p style="margin:0 0 14px 0; font-size:12.5px; color:#94a3b8; line-height:1.5;">${g.subtitle}</p>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; padding-top:12px; border-top:1px solid #334155;">
              <a href="/games/${g.slug}" style="font-size:12.5px; font-weight:800; color:#38bdf8;">📖 Guide &amp; FAQ</a>
              <a href="/?game=${g.gameId}" style="background:linear-gradient(135deg,#06b6d4,#4f46e5); color:#fff; font-size:11.5px; font-weight:800; padding:6px 12px; border-radius:8px; text-decoration:none;">▶ Play</a>
            </div>
          </div>
        `).join('\n')}
      </div>
    </div>
  `;

  const gamesIndexHtml = renderPage({
    title: 'Game Guides, Controls & Educational Manuals',
    description: 'Complete gameplay manuals, control instructions, and cognitive learning objectives for 50+ safe online games on KiddoZap.',
    canonicalUrl: gamesIndexUrl,
    breadcrumbs: gamesIndexBreadcrumbs,
    structuredData: gamesIndexStructuredData,
    contentHtml: gamesIndexContent,
    activeNav: 'games'
  });

  fs.writeFileSync(path.join(gamesIndexDir, 'index.html'), gamesIndexHtml, 'utf-8');
}

// 5. GENERATE COMPREHENSIVE SITEMAP.XML
function buildSitemap() {
  console.log('Generating updated /public/sitemap.xml with 40+ URLs...');
  const baseUrl = 'https://kiddozap.com';
  const today = '2026-10-11';

  const urls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/games`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/categories`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/articles`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/parents-guide`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/about`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/privacy`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/terms`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/contact`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/tools`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/tools/times-table-practice`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/tools/multiplication-chart`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/tools/math-facts-practice`, priority: '0.8', changefreq: 'monthly' },
  ];

  // Add 5 Categories
  CATEGORIES_DATA.forEach(c => {
    urls.push({ loc: `${baseUrl}/categories/${c.slug}`, priority: '0.85', changefreq: 'weekly' });
  });

  // Add 6 Articles
  ARTICLES_DATA.forEach(a => {
    urls.push({ loc: `${baseUrl}/articles/${a.slug}`, priority: '0.85', changefreq: 'monthly' });
  });

  // Add 24 Games
  GAMES_DATA.forEach(g => {
    urls.push({ loc: `${baseUrl}/games/${g.slug}`, priority: '0.8', changefreq: 'weekly' });
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log(`Generated sitemap with ${urls.length} rich indexable URLs!`);
}


// 7. STATIC PAGES (about, contact, privacy, parents guide, terms) built from fragments in scripts/pages/
function buildStaticPages() {
  console.log('Generating static pages from scripts/pages/ ...');
  const PAGES = [
    { dir: 'about', title: 'About Us', description: 'Learn what KiddoZap is: a small independent website with free browser games and puzzles for kids and teens, why it was made, and how ads and privacy work.', nav: 'about', type: 'AboutPage', crumb: 'About' },
    { dir: 'contact', title: 'Contact Us', description: 'Contact KiddoZap to report a bug, suggest a game or ask a question. Email support@kiddozap.com.', nav: 'contact', type: 'ContactPage', crumb: 'Contact' },
    { dir: 'privacy', title: 'Privacy Policy', description: 'The KiddoZap privacy policy: what is and is not collected, how scores are saved in your browser, how ads and cookies work, and how to contact us.', nav: 'privacy', type: 'WebPage', crumb: 'Privacy Policy' },
    { dir: 'parents-guide', title: 'Parents & Teachers Guide', description: 'Simple tips for parents and teachers: the 20-20-20 eye habit, which games suit which ages, and ideas for short classroom brain breaks.', nav: 'parents', type: 'WebPage', crumb: 'Parents & Teachers Guide' },
    { dir: 'terms', title: 'Terms of Service', description: 'Terms of Service and acceptable use for the KiddoZap games website.', nav: 'terms', type: 'WebPage', crumb: 'Terms of Service' }
  ];
  PAGES.forEach(pg => {
    const dir = path.join(PUBLIC_DIR, pg.dir);
    ensureDir(dir);
    const url = `https://kiddozap.com/${pg.dir}`;
    const contentHtml = fs.readFileSync(path.join(path.resolve('scripts'), 'pages', `${pg.dir}.html`), 'utf-8');
    const html = renderPage({
      title: pg.title,
      description: pg.description,
      canonicalUrl: url,
      breadcrumbs: [{ name: pg.crumb, url }],
      structuredData: { "@context": "https://schema.org", "@type": pg.type, "name": pg.title, "url": url, "description": pg.description, "isPartOf": { "@type": "WebSite", "name": "KiddoZap", "url": "https://kiddozap.com/" } },
      contentHtml,
      activeNav: pg.nav
    });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
  });
}

// 8. FREE LEARNING TOOLS (/tools): real, useful utilities, not just game descriptions
function buildToolPages() {
  console.log('Generating free learning tool pages...');
  const base = 'https://kiddozap.com';

  const appSchema = (name, url, description) => ({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "url": url,
    "description": description,
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Any modern web browser",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  });

  // ---- Times table practice ----
  const ttDir = path.join(PUBLIC_DIR, 'tools', 'times-table-practice');
  ensureDir(ttDir);
  const ttUrl = `${base}/tools/times-table-practice`;
  const ttDesc = 'Free times table practice for kids: choose a table from 1 to 12 or mixed, answer 10 or 20 questions, and review the ones you missed. No sign-up.';
  const ttContent = `
      <div class="card">
        <span class="badge">🧮 Free tool &bull; No sign-up</span>
        <h1>Times Table Practice</h1>
        <p>Pick a times table, answer a short round of questions and see which facts need more practice. Nothing is saved or sent anywhere: the quiz runs entirely in your browser.</p>

        <div class="tool-panel" id="tt-app">
          <div id="tt-setup">
            <div class="tool-row">
              <label for="tt-table">Times table</label>
              <select id="tt-table" class="tool-select">
                <option value="mixed">Mixed (2 to 12)</option>
                <option value="2">2 times table</option><option value="3">3 times table</option><option value="4">4 times table</option>
                <option value="5">5 times table</option><option value="6">6 times table</option><option value="7">7 times table</option>
                <option value="8">8 times table</option><option value="9">9 times table</option><option value="10">10 times table</option>
                <option value="11">11 times table</option><option value="12">12 times table</option>
              </select>
            </div>
            <div class="tool-row">
              <label for="tt-count">Number of questions</label>
              <select id="tt-count" class="tool-select">
                <option value="10">10 questions</option>
                <option value="20">20 questions</option>
              </select>
            </div>
            <button type="button" id="tt-start" class="btn-submit">Start practice</button>
          </div>

          <div id="tt-play" hidden>
            <p id="tt-progress" class="tool-progress"></p>
            <p id="tt-question" class="tool-question" aria-live="polite"></p>
            <div class="tool-row">
              <input id="tt-answer" class="tool-input" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" aria-label="Your answer" />
              <button type="button" id="tt-check" class="btn-submit">Check</button>
            </div>
            <p id="tt-feedback" class="tool-feedback" aria-live="polite"></p>
          </div>

          <div id="tt-done" hidden>
            <h2 style="margin-top:0;">Round finished</h2>
            <p id="tt-result" class="tool-question"></p>
            <div id="tt-review"></div>
            <button type="button" id="tt-again" class="btn-submit">Practise again</button>
          </div>
        </div>

        <h2>How to use this practice tool</h2>
        <ol>
          <li>Choose one times table to focus on, or choose Mixed for a general check.</li>
          <li>Pick 10 questions for a quick round or 20 for a longer one.</li>
          <li>Type each answer and press Enter or tap Check.</li>
          <li>At the end, look at the facts you missed and practise those again.</li>
        </ol>

        <h2>Tips for learning the times tables</h2>
        <ul>
          <li><strong>Start with the easy ones.</strong> The 2s are doubles, the 10s just add a zero, and the 5s always end in 0 or 5.</li>
          <li><strong>Use the swap trick.</strong> 3 &times; 7 and 7 &times; 3 give the same answer, so every fact you learn is really two facts.</li>
          <li><strong>Check the 9s with the digit trick.</strong> The digits of any 9 times answer add up to 9 (for example 9 &times; 7 = 63, and 6 + 3 = 9).</li>
          <li><strong>Notice patterns in the 11s.</strong> From 11 &times; 2 to 11 &times; 9 the answer repeats the digit: 22, 33, 44 and so on.</li>
          <li><strong>Save the tricky ones for last.</strong> Most children find 6 &times; 7, 6 &times; 8, 7 &times; 8 and 7 &times; 9 the hardest, so give those extra short rounds.</li>
          <li><strong>Skip count out loud.</strong> Counting 4, 8, 12, 16 helps the pattern stick.</li>
        </ul>

        <h2>A simple practice plan</h2>
        <p>Five minutes a day is enough for most children, and it works better than one long session each week. One easy plan is to cover the 2, 5 and 10 tables in the first week, the 3 and 4 tables in the second, the 6 and 9 tables in the third, and the 7, 8, 11 and 12 tables in the fourth. After that, use the Mixed option to keep everything fresh. Stop while it is still fun.</p>

        <h2>Questions</h2>
        <div class="faq-item"><h4>Does the tool save my results?</h4><p>No. Nothing is stored or sent to a server. When you close or reload the page, the results are gone.</p></div>
        <div class="faq-item"><h4>Which ages is it for?</h4><p>Children usually learn the times tables between about ages 7 and 11, but anyone can use it for a quick refresher.</p></div>
        <div class="faq-item"><h4>Can teachers use it in class?</h4><p>Yes. It works on any phone, tablet or computer with a browser, so it can be used as a short warm-up. A printable <a href="/tools/multiplication-chart">multiplication chart</a> is also available.</p></div>

        <p>Want a more playful way to practise? Try <a href="/games/math-sprint">Balloon Math Hero</a>.</p>
      </div>
      <script>
      (function () {
        var $ = function (id) { return document.getElementById(id); };
        var state = null, timer = null;
        function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
        function show(id, on) { $(id).hidden = !on; }
        function makeQuestions(table, count) {
          var qs = [], i, a, b;
          for (i = 0; i < count; i++) {
            a = table === 'mixed' ? rnd(2, 12) : parseInt(table, 10);
            b = rnd(1, 12);
            qs.push({ a: a, b: b });
          }
          return qs;
        }
        function showQuestion() {
          var q = state.qs[state.i];
          $('tt-question').textContent = q.a + ' \u00d7 ' + q.b + ' = ?';
          $('tt-progress').textContent = 'Question ' + (state.i + 1) + ' of ' + state.qs.length;
          $('tt-answer').value = '';
          $('tt-answer').disabled = false;
          $('tt-check').disabled = false;
          $('tt-answer').focus();
        }
        function finish() {
          var secs = Math.round((Date.now() - state.start) / 1000);
          show('tt-play', false); show('tt-done', true);
          $('tt-result').textContent = 'You got ' + state.score + ' out of ' + state.qs.length + ' right in ' + secs + ' seconds.';
          var box = $('tt-review');
          if (state.wrong.length === 0) {
            box.innerHTML = '<p>Perfect round! Try a harder table or the Mixed option.</p>';
          } else {
            var seen = {}, items = [];
            state.wrong.forEach(function (w) { if (!seen[w]) { seen[w] = 1; items.push('<li>' + w + '</li>'); } });
            box.innerHTML = '<p>Facts to practise again:</p><ul>' + items.join('') + '</ul>';
          }
        }
        function submit() {
          if (!state) return;
          var q = state.qs[state.i];
          var v = parseInt($('tt-answer').value, 10);
          if (isNaN(v)) return;
          var right = q.a * q.b;
          $('tt-answer').disabled = true; $('tt-check').disabled = true;
          if (v === right) { state.score++; $('tt-feedback').textContent = 'Correct!'; }
          else { state.wrong.push(q.a + ' \u00d7 ' + q.b + ' = ' + right); $('tt-feedback').textContent = 'Not quite: ' + q.a + ' \u00d7 ' + q.b + ' = ' + right; }
          state.i++;
          clearTimeout(timer);
          timer = setTimeout(function () {
            $('tt-feedback').textContent = '';
            if (state.i >= state.qs.length) finish(); else showQuestion();
          }, 900);
        }
        $('tt-start').addEventListener('click', function () {
          state = { qs: makeQuestions($('tt-table').value, parseInt($('tt-count').value, 10)), i: 0, score: 0, wrong: [], start: Date.now() };
          show('tt-setup', false); show('tt-done', false); show('tt-play', true);
          showQuestion();
        });
        $('tt-check').addEventListener('click', submit);
        $('tt-answer').addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
        $('tt-again').addEventListener('click', function () { show('tt-done', false); show('tt-setup', true); });
      })();
      </script>
  `;
  fs.writeFileSync(path.join(ttDir, 'index.html'), renderPage({
    title: 'Times Table Practice (Free Quiz)',
    description: ttDesc,
    canonicalUrl: ttUrl,
    breadcrumbs: [{ name: 'Free Tools', url: '/tools' }, { name: 'Times Table Practice', url: ttUrl }],
    structuredData: appSchema('Times Table Practice', ttUrl, ttDesc),
    contentHtml: ttContent,
    activeNav: 'tools'
  }), 'utf-8');

  // ---- Multiplication chart ----
  const mcDir = path.join(PUBLIC_DIR, 'tools', 'multiplication-chart');
  ensureDir(mcDir);
  const mcUrl = `${base}/tools/multiplication-chart`;
  const mcDesc = 'Free printable multiplication chart from 1 to 12. Tap a square to highlight its row and column, spot number patterns, and print it for home or class.';
  let rows = '<tr><th scope="col">&times;</th>';
  for (let c = 1; c <= 12; c++) rows += `<th scope="col">${c}</th>`;
  rows += '</tr>';
  for (let r = 1; r <= 12; r++) {
    rows += `<tr><th scope="row">${r}</th>`;
    for (let c = 1; c <= 12; c++) rows += `<td data-r="${r}" data-c="${c}"${r === c ? ' class="sq"' : ''}>${r * c}</td>`;
    rows += '</tr>';
  }
  const mcContent = `
      <div class="card">
        <span class="badge">🖨️ Free &amp; printable</span>
        <h1>Multiplication Chart (1 to 12)</h1>
        <p>Use this chart to look up any multiplication fact from 1 &times; 1 to 12 &times; 12. Tap or click a square to highlight its row and column, and press Print to get a clean copy for home or class.</p>

        <p class="no-print"><button type="button" class="btn-submit" id="mc-print">Print this chart</button></p>
        <div class="mult-wrap"><table class="mult-chart" id="mc-table" aria-label="Multiplication chart from 1 to 12">${rows}</table></div>
        <p class="no-print" style="font-size:13px; color:#94a3b8;">Tip: the shaded squares on the diagonal are the square numbers (1, 4, 9, 16 and so on).</p>

        <h2>How to read the chart</h2>
        <p>Find the first number along the left side and the second number along the top. The square where the row and column meet shows the answer. For example, to find 6 &times; 8, go to row 6 and column 8: the answer is 48. Because 8 &times; 6 gives the same answer, you will find 48 in two places.</p>

        <h2>Patterns to look for</h2>
        <ul>
          <li><strong>The chart is a mirror.</strong> It looks the same on both sides of the diagonal, because the order of the numbers does not change the answer.</li>
          <li><strong>The 5s end in 0 or 5</strong>, and the 10s always end in 0.</li>
          <li><strong>The 2s, 4s, 6s and 8s are all even.</strong></li>
          <li><strong>The 9s have digits that add up to 9</strong> (18, 27, 36, 45 and so on).</li>
          <li><strong>The diagonal shows square numbers</strong> such as 25 (5 &times; 5) and 49 (7 &times; 7).</li>
        </ul>

        <h2>Ideas for using it at home or in class</h2>
        <ul>
          <li>Print one copy and cover half the squares with sticky notes, then ask your child to work out the hidden answers.</li>
          <li>Colour all the multiples of one number (for example 3) and talk about what pattern appears.</li>
          <li>Use it as a reference while doing homework, then gradually stop looking as the facts stick.</li>
          <li>Pair it with the <a href="/tools/times-table-practice">times table practice quiz</a> to check what has been learned.</li>
        </ul>

        <h2>Questions</h2>
        <div class="faq-item"><h4>Can I print it on one page?</h4><p>Yes. The print layout is designed to fit on a single page in landscape or portrait. Use your browser's print preview to check.</p></div>
        <div class="faq-item"><h4>Is it free to use in school?</h4><p>Yes, it is free for personal and classroom use.</p></div>
      </div>
      <script>
      (function () {
        var table = document.getElementById('mc-table');
        var cells = table.querySelectorAll('td');
        function clear() { for (var i = 0; i < cells.length; i++) { cells[i].classList.remove('hl'); cells[i].classList.remove('hl-main'); } }
        table.addEventListener('click', function (e) {
          var td = e.target.closest('td'); if (!td) return;
          clear();
          var r = td.getAttribute('data-r'), c = td.getAttribute('data-c');
          for (var i = 0; i < cells.length; i++) {
            if (cells[i].getAttribute('data-r') === r || cells[i].getAttribute('data-c') === c) cells[i].classList.add('hl');
          }
          td.classList.add('hl-main');
        });
        document.getElementById('mc-print').addEventListener('click', function () { window.print(); });
      })();
      </script>
  `;
  fs.writeFileSync(path.join(mcDir, 'index.html'), renderPage({
    title: 'Printable Multiplication Chart 1 to 12',
    description: mcDesc,
    canonicalUrl: mcUrl,
    breadcrumbs: [{ name: 'Free Tools', url: '/tools' }, { name: 'Multiplication Chart', url: mcUrl }],
    structuredData: appSchema('Multiplication Chart (1 to 12)', mcUrl, mcDesc),
    contentHtml: mcContent,
    activeNav: 'tools'
  }), 'utf-8');

  // ---- Tools index ----
  const tiDir = path.join(PUBLIC_DIR, 'tools');
  ensureDir(tiDir);
  const tiUrl = `${base}/tools`;
  const tiDesc = 'Free learning tools from KiddoZap: times table practice, math facts practice and a printable multiplication chart.';
  const tiContent = `
      <div class="card">
        <span class="badge">🧰 Free tools</span>
        <h1>Free Learning Tools</h1>
        <p>Besides games, KiddoZap has a few simple tools for practising skills at home or in class. They are free, need no sign-up, and nothing you type is stored or sent anywhere.</p>
        <div class="grid-2">
          <div class="info-box">
            <h3 style="margin-top:0;"><a href="/tools/times-table-practice">Times Table Practice</a></h3>
            <p>Choose a times table, answer 10 or 20 questions and see which facts to practise again. Good for ages 7 to 11.</p>
            <p style="margin:0;"><a href="/tools/times-table-practice">Start practising &rarr;</a></p>
          </div>
          <div class="info-box">
            <h3 style="margin-top:0;"><a href="/tools/multiplication-chart">Multiplication Chart</a></h3>
            <p>A clean 1 to 12 chart you can print. Tap a square to highlight its row and column, and look for number patterns.</p>
            <p style="margin:0;"><a href="/tools/multiplication-chart">Open the chart &rarr;</a></p>
          </div>
          <div class="info-box">
            <h3 style="margin-top:0;"><a href="/tools/math-facts-practice">Math Facts Practice</a></h3>
            <p>Short rounds of addition, subtraction and division with numbers up to 10, 20 or 100.</p>
            <p style="margin:0;"><a href="/tools/math-facts-practice">Start practising &rarr;</a></p>
          </div>
        </div>
        <h2>Looking for something more playful?</h2>
        <p>Our <a href="/categories/math-learning">math learning games</a> and <a href="/categories/brain-puzzles">brain puzzles</a> give extra practice in a game format. For tips on using them well, read the <a href="/parents-guide">Parents &amp; Teachers Guide</a>.</p>
        <p>Have an idea for another tool? Write to <a href="mailto:support@kiddozap.com">support@kiddozap.com</a>.</p>
      </div>
  `;
  fs.writeFileSync(path.join(tiDir, 'index.html'), renderPage({
    title: 'Free Learning Tools',
    description: tiDesc,
    canonicalUrl: tiUrl,
    breadcrumbs: [{ name: 'Free Tools', url: tiUrl }],
    structuredData: { "@context": "https://schema.org", "@type": "CollectionPage", "name": "Free Learning Tools", "url": tiUrl, "description": tiDesc },
    contentHtml: tiContent,
    activeNav: 'tools'
  }), 'utf-8');
}

// 9. MATH FACTS PRACTICE TOOL
function buildMathFactsTool() {
  const dir = path.join(PUBLIC_DIR, 'tools', 'math-facts-practice');
  ensureDir(dir);
  const url = 'https://kiddozap.com/tools/math-facts-practice';
  const desc = 'Free mental math practice for kids: addition, subtraction and division with numbers up to 10, 20 or 100. Short rounds, instant feedback and a list of facts to review.';
  const content = `
      <div class="card">
        <span class="badge">➕ Free tool &bull; No sign-up</span>
        <h1>Math Facts Practice</h1>
        <p>Practise addition, subtraction and division in short rounds. Choose the kind of questions and how big the numbers should be, then see which facts need another try. Nothing is saved or sent anywhere.</p>

        <div class="tool-panel">
          <div id="mf-setup">
            <div class="tool-row">
              <label for="mf-op">Type of questions</label>
              <select id="mf-op" class="tool-select">
                <option value="add">Addition</option>
                <option value="sub">Subtraction</option>
                <option value="div">Division</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div class="tool-row">
              <label for="mf-max">Size of numbers</label>
              <select id="mf-max" class="tool-select">
                <option value="10">Up to 10</option>
                <option value="20">Up to 20</option>
                <option value="100">Up to 100</option>
              </select>
            </div>
            <div class="tool-row">
              <label for="mf-count">Number of questions</label>
              <select id="mf-count" class="tool-select">
                <option value="10">10 questions</option>
                <option value="20">20 questions</option>
              </select>
            </div>
            <button type="button" id="mf-start" class="btn-submit">Start practice</button>
          </div>

          <div id="mf-play" hidden>
            <p id="mf-progress" class="tool-progress"></p>
            <p id="mf-question" class="tool-question" aria-live="polite"></p>
            <div class="tool-row">
              <input id="mf-answer" class="tool-input" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" aria-label="Your answer" />
              <button type="button" id="mf-check" class="btn-submit">Check</button>
            </div>
            <p id="mf-feedback" class="tool-feedback" aria-live="polite"></p>
          </div>

          <div id="mf-done" hidden>
            <h2 style="margin-top:0;">Round finished</h2>
            <p id="mf-result" class="tool-question"></p>
            <div id="mf-review"></div>
            <button type="button" id="mf-again" class="btn-submit">Practise again</button>
          </div>
        </div>

        <h2>How to use it</h2>
        <ol>
          <li>Start small: numbers up to 10 for early learners, up to 20 once those feel easy, and up to 100 for older children.</li>
          <li>Pick one type of question at a time until it feels comfortable, then try Mixed.</li>
          <li>Type each answer and press Enter or tap Check.</li>
          <li>Look at the facts you missed at the end and practise those again tomorrow.</li>
        </ol>

        <h2>Mental math tricks worth teaching</h2>
        <ul>
          <li><strong>Make 10.</strong> To add 8 + 5, take 2 from the 5 to make 8 + 2 = 10, then add the remaining 3 to get 13.</li>
          <li><strong>Use doubles.</strong> If 6 + 6 = 12, then 6 + 7 is just one more, which is 13.</li>
          <li><strong>Count up for subtraction.</strong> To work out 15 &minus; 9, start at 9 and count up to 15: that is 6 steps.</li>
          <li><strong>Think of division as sharing.</strong> 24 &divide; 6 asks &quot;how many sixes fit in 24?&quot; and the times tables give the answer: 4.</li>
          <li><strong>Check with the opposite operation.</strong> If 13 &minus; 5 = 8, then 8 + 5 should give 13 again.</li>
        </ul>

        <h2>A gentle practice routine</h2>
        <p>Five minutes a day is plenty. Try one type of question for a few days, and celebrate a personal best (more correct answers or a faster round) rather than comparing with anyone else. If your child is getting frustrated, drop back to smaller numbers: confidence matters more than speed.</p>

        <h2>Questions</h2>
        <div class="faq-item"><h4>Does it keep track of my score?</h4><p>No. Results disappear when you close or reload the page, and nothing is sent to a server.</p></div>
        <div class="faq-item"><h4>Why does division only use whole numbers?</h4><p>The questions are built from the times tables, so every division question has a whole-number answer. This keeps the practice focused on number facts.</p></div>
        <p>For times tables, try the <a href="/tools/times-table-practice">times table practice</a> and the printable <a href="/tools/multiplication-chart">multiplication chart</a>. For a game version, play <a href="/games/math-sprint">Balloon Math Hero</a>.</p>
      </div>
      <script>
      (function () {
        var $ = function (id) { return document.getElementById(id); };
        var state = null, timer = null;
        var SYM = { add: '+', sub: '\u2212', div: '\u00f7' };
        function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
        function show(id, on) { $(id).hidden = !on; }
        function makeOne(op, max) {
          var a, b, ans;
          if (op === 'add') { a = rnd(0, max); b = rnd(0, max); ans = a + b; }
          else if (op === 'sub') { a = rnd(0, max); b = rnd(0, a); ans = a - b; }
          else {
            b = rnd(2, Math.min(12, Math.max(2, Math.floor(max / 2))));
            ans = rnd(1, Math.max(1, Math.floor(max / b)));
            a = ans * b;
          }
          return { op: op, a: a, b: b, ans: ans };
        }
        function makeQuestions(op, max, count) {
          var qs = [], i, o;
          for (i = 0; i < count; i++) {
            o = op === 'mixed' ? ['add', 'sub', 'div'][rnd(0, 2)] : op;
            qs.push(makeOne(o, max));
          }
          return qs;
        }
        function text(q) { return q.a + ' ' + SYM[q.op] + ' ' + q.b; }
        function showQuestion() {
          var q = state.qs[state.i];
          $('mf-question').textContent = text(q) + ' = ?';
          $('mf-progress').textContent = 'Question ' + (state.i + 1) + ' of ' + state.qs.length;
          $('mf-answer').value = '';
          $('mf-answer').disabled = false;
          $('mf-check').disabled = false;
          $('mf-answer').focus();
        }
        function finish() {
          var secs = Math.round((Date.now() - state.start) / 1000);
          show('mf-play', false); show('mf-done', true);
          $('mf-result').textContent = 'You got ' + state.score + ' out of ' + state.qs.length + ' right in ' + secs + ' seconds.';
          var box = $('mf-review');
          if (state.wrong.length === 0) {
            box.innerHTML = '<p>Perfect round! Try bigger numbers or the Mixed option.</p>';
          } else {
            var seen = {}, items = [];
            state.wrong.forEach(function (w) { if (!seen[w]) { seen[w] = 1; items.push('<li>' + w + '</li>'); } });
            box.innerHTML = '<p>Facts to practise again:</p><ul>' + items.join('') + '</ul>';
          }
        }
        function submit() {
          if (!state) return;
          var q = state.qs[state.i];
          var v = parseInt($('mf-answer').value, 10);
          if (isNaN(v)) return;
          $('mf-answer').disabled = true; $('mf-check').disabled = true;
          if (v === q.ans) { state.score++; $('mf-feedback').textContent = 'Correct!'; }
          else { state.wrong.push(text(q) + ' = ' + q.ans); $('mf-feedback').textContent = 'Not quite: ' + text(q) + ' = ' + q.ans; }
          state.i++;
          clearTimeout(timer);
          timer = setTimeout(function () {
            $('mf-feedback').textContent = '';
            if (state.i >= state.qs.length) finish(); else showQuestion();
          }, 900);
        }
        $('mf-start').addEventListener('click', function () {
          state = { qs: makeQuestions($('mf-op').value, parseInt($('mf-max').value, 10), parseInt($('mf-count').value, 10)), i: 0, score: 0, wrong: [], start: Date.now() };
          show('mf-setup', false); show('mf-done', false); show('mf-play', true);
          showQuestion();
        });
        $('mf-check').addEventListener('click', submit);
        $('mf-answer').addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
        $('mf-again').addEventListener('click', function () { show('mf-done', false); show('mf-setup', true); });
      })();
      </script>
  `;
  fs.writeFileSync(path.join(dir, 'index.html'), renderPage({
    title: 'Math Facts Practice (Addition, Subtraction, Division)',
    description: desc,
    canonicalUrl: url,
    breadcrumbs: [{ name: 'Free Tools', url: 'https://kiddozap.com/tools' }, { name: 'Math Facts Practice', url }],
    structuredData: { "@context": "https://schema.org", "@type": "WebApplication", "name": "Math Facts Practice", "url": url, "description": desc, "applicationCategory": "EducationalApplication", "operatingSystem": "Any modern web browser", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
    contentHtml: content,
    activeNav: 'tools'
  }), 'utf-8');
}

// RUN GENERATION
buildGamePages();
buildArticlePages();
buildCategoryPages();
updateGamesIndexPage();
buildStaticPages();
buildToolPages();
buildMathFactsTool();
buildSitemap();
console.log('All AdSense content successfully generated!');
