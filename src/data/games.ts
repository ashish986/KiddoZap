export interface GameFaq {
  question: string;
  answer: string;
}

export interface CognitiveSkill {
  skill: string;
  explanation: string;
}

export interface GameInfo {
  id: string;
  slug: string;
  title: string;
  category: 'brain-puzzles' | 'action-reflex' | 'arcade-retro' | 'math' | 'little-kids';
  categoryLabel: string;
  icon: string;
  age: string;
  grades: string;
  shortDesc: string;
  overview: string;
  howToPlay: string[];
  controlsDesktop: string;
  controlsMobile: string;
  scoringGuide: string;
  proStrategies: string[];
  cognitiveSkills: CognitiveSkill[];
  classroomApplication: string;
  faqs: GameFaq[];
  color: string;
  badge?: string;
  estimatedPlayTime: string;
  playerCount: string;
}

export const CATEGORIES = [
  { id: 'all', name: 'All Games', icon: '⚡' },
  { id: 'brain-puzzles', name: 'Brain & Puzzles', icon: '🧩' },
  { id: 'action-reflex', name: 'Action & Reflex', icon: '🚀' },
  { id: 'arcade-retro', name: 'Arcade & Retro', icon: '👾' },
  { id: 'math', name: 'Math & Logic', icon: '🔢' },
  { id: 'little-kids', name: 'Little Kids & Music', icon: '🎵' },
] as const;

export const GAMES: GameInfo[] = [
  {
    id: 'geodash',
    slug: 'geo-dash',
    title: 'Neon Rhythm Run',
    category: 'action-reflex',
    categoryLabel: 'Action & Reflex',
    icon: '⚡',
    age: 'Age 7+',
    grades: 'Grades 2-12',
    shortDesc: 'Time your jumps precisely over neon spikes, pads, and geometric hazards in rhythm.',
    overview: 'Neon Rhythm Run is a rhythm-synchronized obstacle platformer where players maneuver a glowing geometric cube across a neon soundtrack-driven landscape. Every jump, gravity portal, and hazard corresponds to the acoustic tempo of high-energy electronic music. Players must calculate jump arcs, react to rapid changes in altitude, and maintain focus through continuous obstacle sequences.',
    howToPlay: [
      'Tap or press Space to initiate a single jump when approaching ground-based geometric spikes.',
      'Hold down the jump input when landing on yellow jump pads for an amplified vertical leap.',
      'Pass through glowing portal gates to invert gravity or alter speed multiplier in real time.',
      'Survive each sector without colliding with obstacles; any impact resets the current trial.'
    ],
    controlsDesktop: 'Spacebar, Up Arrow key, or Left Mouse Click to jump.',
    controlsMobile: 'Tap anywhere on the touch display to initiate jump impulse.',
    scoringGuide: 'Points accrue based on distance traveled (10 pts per meter) plus 250 bonus points for clearing rhythmic hazard gates without hesitation.',
    proStrategies: [
      'Listen to the percussion rhythm: the soundtrack beats signal spike intervals 0.2 seconds before visual contact.',
      'Avoid panic-jumping: wait until the leading edge of your cube crosses the hazard warning marker before triggering jump.',
      'Focus your gaze 2 to 3 grid tiles ahead of your current avatar rather than looking directly at your cube.'
    ],
    cognitiveSkills: [
      { skill: 'Auditory-Motor Synchronization', explanation: 'Aligning muscle contraction timing with external acoustic cadence.' },
      { skill: 'Inhibitory Control', explanation: 'Suppressing premature finger impulses until the optimal jump window opens.' },
      { skill: 'Spatial Distance Estimation', explanation: 'Rapid mental projection of parabolic jump trajectories.' }
    ],
    classroomApplication: 'Used by physical education and music educators as a 3-minute warm-up to train auditory-motor coordination and sharpen temporal pacing before instrumental practice.',
    faqs: [
      { question: 'Does Neon Rhythm Run require internet during gameplay?', answer: 'No, once the game engine assets load into your web browser cache, all physics calculations run locally on your device with zero data usage.' },
      { question: 'Is this game suitable for children in Grade 2?', answer: 'Yes, the gameplay involves zero violence or distressing imagery. Younger children typically enjoy the early levels and naturally develop improved rhythm-timing over repeated attempts.' },
      { question: 'Can I play with an external game controller or keyboard?', answer: 'Yes, any standard desktop keyboard (Spacebar or Up Arrow) as well as touchscreens and mouse clicks are fully supported out of the box.' }
    ],
    color: 'from-amber-500 to-orange-600',
    badge: 'Popular',
    estimatedPlayTime: '3 - 5 min per run',
    playerCount: 'Single Player'
  },
  {
    id: 'snake',
    slug: 'snake',
    title: 'Snake Neon Classic',
    category: 'arcade-retro',
    categoryLabel: 'Arcade & Retro',
    icon: '🐍',
    age: 'Age 5+',
    grades: 'Grades K-12',
    shortDesc: 'Steer the glowing serpent, collect energy pellets, and grow without crashing.',
    overview: 'Snake Neon Classic modernizes the quintessential 1970s arcade puzzle with luminous neon styling, responsive turn buffers, and progressive difficulty tiers. Players guide an ever-extending luminous serpent across a defined grid, consuming energy pellets while strategically leaving escape corridors to avoid crashing into perimeter walls or their own growing tail.',
    howToPlay: [
      'Direct the snake up, down, left, or right using directional keys or touchscreen swipes.',
      'Guide the head directly over glowing energy pellets to increase score and snake segment length.',
      'Plan your movement paths carefully to prevent your head from colliding with your trailing body.',
      'Survive as long as possible while the game engine gradually accelerates movement speed.'
    ],
    controlsDesktop: 'Arrow Keys (Up, Down, Left, Right) or WASD keys.',
    controlsMobile: 'Swipe in any cardinal direction or tap on-screen directional buttons.',
    scoringGuide: 'Each energy pellet grants 10 base points multiplied by the current speed tier (up to 5x multiplier). Golden bonus pellets grant 100 extra points.',
    proStrategies: [
      'Adopt the perimeter coil strategy: circle the outer boundaries and sweep inward along serpentine S-curves.',
      'Never execute a 180-degree turn toward your own tail unless you have verified at least 2 tiles of clearance.',
      'Use the turn buffer: press your next turn direction slightly before reaching the grid intersection for instant execution.'
    ],
    cognitiveSkills: [
      { skill: 'Spatial Planning & Pathfinding', explanation: 'Visualizing open corridors and avoiding dead-end traps multiple moves in advance.' },
      { skill: 'Delayed Gratification', explanation: 'Resisting immediate food targets to maintain a safe, sustainable loop trajectory.' },
      { skill: 'Working Memory', explanation: 'Keeping mental track of current snake length relative to available arena dimensions.' }
    ],
    classroomApplication: 'Ideal for elementary logic classes to illustrate algorithmic thinking, loops, spatial constraints, and boundary rule verification.',
    faqs: [
      { question: 'How is the high score saved in Snake Neon?', answer: 'Your personal best score is preserved securely in your browser local storage, so your record remains intact whenever you return.' },
      { question: 'Can the snake pass through borders or walls?', answer: 'In Classic Neon Mode, boundaries are solid energetic barriers that reset the run on contact, encouraging tight spatial discipline.' },
      { question: 'Is there a pause button if I need to step away?', answer: 'Yes, pressing the P key or clicking the pause icon freezes the board immediately without score loss.' }
    ],
    color: 'from-emerald-500 to-teal-700',
    badge: 'Classic',
    estimatedPlayTime: '2 - 7 min per round',
    playerCount: 'Single Player'
  },
  {
    id: 'math-sprint',
    slug: 'math-sprint',
    title: 'Math Sprint Blitz',
    category: 'math',
    categoryLabel: 'Math & Logic',
    icon: '🔢',
    age: 'Age 6+',
    grades: 'Grades 1-8',
    shortDesc: 'Solve rapid arithmetic equations against a ticking clock to build number fluency.',
    overview: 'Math Sprint Blitz is an educational arithmetic speed drill designed to convert math anxiety into dynamic competence. Players race through randomized addition, subtraction, multiplication, and division equations under a friendly ticking timer. Instant visual feedback, streak multipliers, and positive reinforcement cultivate rapid mental number retrieval.',
    howToPlay: [
      'Read the arithmetic problem displayed at the top of the interface (e.g., 14 + 19 = ?).',
      'Select the correct solution among the four dynamic option choices.',
      'Answer consecutive questions correctly to activate blazing score combo streaks.',
      'Complete as many correct equations as possible before the 60-second sprint timer expires.'
    ],
    controlsDesktop: 'Click answer buttons with mouse or press keyboard number keys 1, 2, 3, or 4.',
    controlsMobile: 'Tap the large, high-contrast answer button on your smartphone or tablet.',
    scoringGuide: '100 points per correct answer plus 25 streak points for every consecutive win. Time bonus awarded for answers given within 1.5 seconds.',
    proStrategies: [
      'Use estimation heuristics: round numbers to the nearest multiple of 10 to eliminate incorrect options rapidly.',
      'Identify parity rules: odd plus odd must yield an even number, eliminating 50% of false distractors.',
      'Stay calm when a mistake occurs: the game does not deduct points, allowing you to instantly regain rhythm.'
    ],
    cognitiveSkills: [
      { skill: 'Arithmetic Automaticity', explanation: 'Retaining and recalling numerical math facts without mechanical paper computation.' },
      { skill: 'Cognitive Processing Speed', explanation: 'Minimizing latency between visual equation intake and motor response.' },
      { skill: 'Resilience under Time Constraints', explanation: 'Maintaining analytical clarity without succumbing to performance panic.' }
    ],
    classroomApplication: 'Extensively utilized by CBSE, ICSE, and US elementary teachers as a 3-minute morning bell-ringer activity to boost daily mental calculation readiness.',
    faqs: [
      { question: 'Which math operations are covered in Math Sprint Blitz?', answer: 'The sprint dynamically balances addition, subtraction, multiplication tables (1-12), and clean integer division.' },
      { question: 'Can teachers track student scores?', answer: 'Students view their exact accuracy percentage, total solved problems, and highest combo streak on the post-round score card.' },
      { question: 'Is this game free of advertisements during gameplay?', answer: 'Yes, gameplay rounds run in a distraction-free sandbox with zero banner interruptions during the active timer.' }
    ],
    color: 'from-blue-500 to-indigo-700',
    badge: 'Educational',
    estimatedPlayTime: '1 - 3 min',
    playerCount: 'Single Player'
  },
  {
    id: 'memory-match',
    slug: 'memory-match',
    title: 'Memory Match Cards',
    category: 'brain-puzzles',
    categoryLabel: 'Brain & Puzzles',
    icon: '🧠',
    age: 'Age 4+',
    grades: 'Preschool - Grade 6',
    shortDesc: 'Flip colorful cards to discover matching pairs in minimal moves.',
    overview: 'Memory Match Cards is an engaging visual recall puzzle featuring vibrant themes: friendly wildlife, cosmic planets, precious gems, and glowing shapes. By flipping two cards at a time and tracking their positions, children strengthen short-term visual working memory, attentional focus, and systematic search heuristics.',
    howToPlay: [
      'Tap any face-down card to reveal its hidden visual icon.',
      'Tap a second card to see if it matches the first card revealed.',
      'If both cards match, they illuminate and remain face-up on the board.',
      'If they do not match, both flip face-down again after a brief 1-second retention window.',
      'Uncover all pairs across the grid in the fewest total flips to achieve three stars.'
    ],
    controlsDesktop: 'Click any card with mouse pointer.',
    controlsMobile: 'Tap any card with finger on touchscreen.',
    scoringGuide: 'Maximum 1000 points minus 15 points per redundant card flip. Extra star ratings awarded for clearing the board under 20 total turns.',
    proStrategies: [
      'Establish a visual scan order: systematically open cards row by row rather than randomly picking scattered locations.',
      'Assign mental labels: verbalize the card name aloud (e.g., "blue rocket, top-left") to reinforce dual acoustic-visual memory encoding.',
      'Group unrevealed cards by quadrant to narrow down unknown coordinates.'
    ],
    cognitiveSkills: [
      { skill: 'Visual Working Memory', explanation: 'Retaining spatial coordinates and image identities simultaneously.' },
      { skill: 'Attentional Focus', explanation: 'Filtering out extraneous visual stimuli to concentrate on board status.' },
      { skill: 'Systematic Search Heuristics', explanation: 'Replacing trial-and-error guessing with ordered methodological discovery.' }
    ],
    classroomApplication: 'Widely recommended by pediatric occupational therapists and kindergarten teachers for developing visual discrimination and memory retention.',
    faqs: [
      { question: 'Are there difficulty levels for younger children?', answer: 'Yes, players can choose between beginner 4x3 grids (6 pairs) and advanced 6x4 grids (12 pairs).' },
      { question: 'Can preschoolers play independently?', answer: 'Absolutely. The card icons are large, distinct, and accompanied by gentle celebratory chimes on each successful pair.' },
      { question: 'Does the game time out?', answer: 'No, there is no punishing countdown timer, allowing children to think and memorize at their own comfortable tempo.' }
    ],
    color: 'from-purple-500 to-fuchsia-700',
    badge: 'Brain Booster',
    estimatedPlayTime: '2 - 4 min',
    playerCount: 'Single Player'
  },
  {
    id: 'sudoku',
    slug: 'sudoku',
    title: 'Sudoku Kids & Teens',
    category: 'math',
    categoryLabel: 'Math & Logic',
    icon: '🧩',
    age: 'Age 8+',
    grades: 'Grades 3-12',
    shortDesc: 'Fill grid squares with numbers 1-9 without duplicate rows, columns or boxes.',
    overview: 'Sudoku Kids & Teens brings the globally celebrated Japanese logic puzzle into an approachable, interactive digital format. Designed for young minds, it features both introductory 4x4 grids for beginners and standard 9x9 grids for advanced students. Built-in smart hint highlights, conflict indicators, and pencil note-taking support methodical deductive problem solving.',
    howToPlay: [
      'Examine the grid with pre-placed starting clue numbers.',
      'Fill empty cells so that every row contains unique numbers 1 through 9 with no repeats.',
      'Ensure every vertical column contains unique numbers 1 through 9 with no repeats.',
      'Ensure every 3x3 sub-grid box contains numbers 1 through 9 without duplicates.',
      'Complete all empty squares using pure deductive logic—no guessing needed.'
    ],
    controlsDesktop: 'Click a cell and type numbers 1-9 on keyboard, or click the on-screen keypad.',
    controlsMobile: 'Tap a grid cell, then tap your desired digit from the numerical input pad.',
    scoringGuide: 'Points awarded for each correctly deduced number, with bonus points for completing entire rows and columns without triggering conflict warnings.',
    proStrategies: [
      'Employ the "Scanning Technique": look across 3 parallel rows to identify which column must contain a missing number.',
      'Use pencil marks: write candidate numbers in corner notations before making permanent placements.',
      'Look for "Naked Singles": cells where 8 of the 9 possible digits are already ruled out by intersecting rows, columns, and boxes.'
    ],
    cognitiveSkills: [
      { skill: 'Deductive Logic', explanation: 'Eliminating possibilities systematically until only one valid outcome remains.' },
      { skill: 'Pattern Elimination', explanation: 'Correlating simultaneous horizontal, vertical, and block constraints.' },
      { skill: 'Sustained Patience', explanation: 'Working through multi-step logic challenges without impulsive rushing.' }
    ],
    classroomApplication: 'Used by middle school mathematics educators to teach proof-like reasoning, set theory, and constraint satisfaction logic.',
    faqs: [
      { question: 'What if my child has never solved Sudoku before?', answer: 'We recommend starting with the Junior 4x4 mode, which uses numbers 1-4 and teaches the fundamental rules in less than 2 minutes.' },
      { question: 'Does the game reveal errors immediately?', answer: 'Yes, an optional auto-check feature highlights conflicting numbers in red so learners can see where their logic diverted.' },
      { question: 'Are all generated puzzles guaranteed to have a unique solution?', answer: 'Yes, every board is mathematically validated to possess exactly one unique logical resolution path.' }
    ],
    color: 'from-indigo-500 to-violet-700',
    badge: 'Logic Master',
    estimatedPlayTime: '5 - 12 min',
    playerCount: 'Single Player'
  },
  {
    id: 'tic-tac-toe',
    slug: 'tic-tac-toe',
    title: 'Tic Tac Toe Neon',
    category: 'brain-puzzles',
    categoryLabel: 'Brain & Puzzles',
    icon: '❌',
    age: 'Age 4+',
    grades: 'Preschool - Grade 12',
    shortDesc: 'Match 3 in a row vs Smart Bot or play locally with a friend on a glowing cyber board.',
    overview: 'Tic Tac Toe Neon takes the timeless noughts-and-crosses strategic challenge and wraps it in a cyberpunk neon interface. Featuring dual game modes—solo play against an adaptive AI bot or 2-player local pass-and-play on the same screen—it serves as the ultimate introduction to turn-based game theory and spatial defense.',
    howToPlay: [
      'Player 1 places glowing cyan X marks; Player 2 (or AI Bot) places neon pink O marks.',
      'Take turns placing one symbol into any unoccupied grid square on the 3x3 board.',
      'The first player to align 3 consecutive marks horizontally, vertically, or diagonally wins.',
      'If all 9 cells are filled with no 3-in-a-row alignment, the game results in a friendly draw.'
    ],
    controlsDesktop: 'Click any empty cell with your mouse.',
    controlsMobile: 'Tap any empty cell with your finger.',
    scoringGuide: 'Wins against AI grant 100 points; draws grant 30 points. Win-streak badges unlock for 3, 5, and 10 consecutive victories.',
    proStrategies: [
      'The Center Control Opening: placing your first mark in the center cell grants 4 potential winning lines (horizontal, vertical, both diagonals).',
      'The Corner Trap (Fork Strategy): capture two opposite corners to force two simultaneous winning threats that your opponent cannot block together.',
      'Defensive Vigilance: always check if your opponent has 2 marks aligned before making your own offensive placement.'
    ],
    cognitiveSkills: [
      { skill: 'Turn-Based Game Theory', explanation: 'Anticipating an opponent reaction before finalizing your own action.' },
      { skill: 'Forking & Dual-Threat Creation', explanation: 'Formulating scenarios with multiple concurrent victory pathways.' },
      { skill: 'Defensive Spatial Awareness', explanation: 'Monitoring opposing trajectories to neutralize incoming threats.' }
    ],
    classroomApplication: 'A favorite pairing tool for teachers to teach turn-taking, good sportsmanship, and foundational decision trees.',
    faqs: [
      { question: 'Can two siblings play on the same phone or tablet?', answer: 'Yes! Simply toggle "2-Player Pass & Play" mode at the top of the game to alternate turns on one screen.' },
      { question: 'Is the computer AI impossible to beat?', answer: 'The AI features three distinct difficulty modes: Easy (makes occasional mistakes), Medium, and Master (plays optimal game theory).' },
      { question: 'Are matches fast enough for quick classroom breaks?', answer: 'Each match takes under 30 seconds, making it ideal for fast micro-breaks between study subjects.' }
    ],
    color: 'from-rose-500 to-pink-700',
    badge: 'Classic',
    estimatedPlayTime: '1 - 2 min',
    playerCount: '1 or 2 Players'
  },
  {
    id: 'flappy-hero',
    slug: 'flappy-hero',
    title: 'Flap Hero',
    category: 'action-reflex',
    categoryLabel: 'Action & Reflex',
    icon: '🐥',
    age: 'Age 6+',
    grades: 'Grades 1-12',
    shortDesc: 'Tap to flap your wings and weave gracefully through pipe obstacles.',
    overview: 'Flap Hero is a physics-based flight timing game where players pilot a plucky feathered hero through narrow vertical pipe gaps. Featuring balanced gravity physics, smooth collision hitboxes, and satisfying sound effects, it challenges players to calibrate tap cadence and build emotional composure in high-stakes timing situations.',
    howToPlay: [
      'Press Spacebar or tap the screen to flap your wings and produce a brief vertical boost.',
      'Allow gravity to naturally pull the bird downward between flaps to descend.',
      'Time your altitude carefully to navigate cleanly through the vertical openings between green pipes.',
      'Score 1 point for every pipe pair successfully passed without brushing edges.'
    ],
    controlsDesktop: 'Spacebar, Up Arrow, or Left Mouse Click to flap.',
    controlsMobile: 'Tap anywhere on the screen to flap.',
    scoringGuide: '1 point per cleared pipe gate. High-score medals awarded at 10 (Bronze), 25 (Silver), 50 (Gold), and 100 (Platinum).',
    proStrategies: [
      'Establish a steady rhythm: tap in small, controlled pulses rather than making erratic double-taps.',
      'Aim for the lower lip of the top pipe rather than the middle; gravity ensures you clear the bottom effortlessly.',
      'Keep your eyes on the next approaching gap while using peripheral vision to manage your current altitude.'
    ],
    cognitiveSkills: [
      { skill: 'Fine Motor Tap Cadence', explanation: 'Regulating finger impulse force and timing intervals within fractions of a second.' },
      { skill: 'Kinesthetic Trajectory Estimation', explanation: 'Anticipating gravitational acceleration curves.' },
      { skill: 'Frustration Tolerance', explanation: 'Managing emotional balance through repeated instant-restart challenges.' }
    ],
    classroomApplication: 'Used by counselors and teachers as a fun exercise to demonstrate growth mindset and resilience after instant mistakes.',
    faqs: [
      { question: 'Why does Flap Hero feel challenging at first?', answer: 'The physics engine simulates realistic parabolic gravity, meaning momentum increases the longer you fall. Rhythm practice quickly makes it intuitive.' },
      { question: 'Is there any violence in Flap Hero?', answer: 'None whatsoever. When the bird bumps into a pipe, it simply tumbles with a playful cartoon chirp and prompts an instant retry.' },
      { question: 'Can I play this on mobile without lag?', answer: 'Yes, the lightweight 60fps canvas engine is optimized for instant response even on budget smartphones.' }
    ],
    color: 'from-yellow-500 to-amber-600',
    badge: 'Trending',
    estimatedPlayTime: '1 - 3 min',
    playerCount: 'Single Player'
  },
  {
    id: 'brick-breaker',
    slug: 'brick-breaker',
    title: 'Brick Breaker Neon',
    category: 'arcade-retro',
    categoryLabel: 'Arcade & Retro',
    icon: '🧱',
    age: 'Age 6+',
    grades: 'Grades 1-12',
    shortDesc: 'Bounce the laser ball off your paddle to shatter colorful cyber bricks.',
    overview: 'Brick Breaker Neon is a modernized tribute to the classic breakout arcade genre. Players steer a horizontal energy paddle across the base of the screen, ricocheting a high-velocity laser sphere to shatter rows of multi-colored neon bricks. Featuring power-ups such as wide paddle extensions, multi-ball splits, and laser blasters, it provides deep kinematic fun.',
    howToPlay: [
      'Move your paddle left and right across the bottom of the screen.',
      'Launch the laser ball and rebound it toward the brick formations overhead.',
      'Catch falling glowing capsules to activate power-ups like Multi-Ball, Laser Paddle, and Shields.',
      'Prevent the ball from dropping beneath your paddle; you have 3 energy lives per match.'
    ],
    controlsDesktop: 'Left/Right Arrow keys, A/D keys, or drag with mouse pointer.',
    controlsMobile: 'Touch and slide your finger along the bottom paddle track.',
    scoringGuide: '10 to 50 points per shattered brick based on color durability. Multipliers awarded for continuous bounces without touching paddle.',
    proStrategies: [
      'Angle control: striking the ball with the outer edges of your paddle returns it at sharper angles, ideal for piercing top rows.',
      'The "Ceiling Break" maneuver: carve a tunnel through one column and bounce the ball on top of the bricks for massive passive destruction.',
      'Prioritize paddle power-ups: multi-ball gives exponential clearing speed, but keep your primary eye on the lowest ball.'
    ],
    cognitiveSkills: [
      { skill: 'Angle of Reflection Prediction', explanation: 'Understanding that angle of incidence equals angle of reflection in real time.' },
      { skill: 'Visual Tracking', explanation: 'Maintaining ocular focus on small fast-moving objects across complex backgrounds.' },
      { skill: 'Hand-Eye Motor Coordination', explanation: 'Synchronizing lateral hand movements to catch arriving trajectories.' }
    ],
    classroomApplication: 'Frequently referenced by science and mathematics instructors to demonstrate reflection angles, vector bounces, and kinetic energy.',
    faqs: [
      { question: 'How many levels are included in Brick Breaker Neon?', answer: 'The game features 15 progressively challenging geometric brick layouts with varying armor strengths.' },
      { question: 'What do the different colored power-up capsules do?', answer: 'Green expands your paddle width, Blue spawns 3 extra balls, Red equips laser blasters, and Gold awards bonus points.' },
      { question: 'Can I pause the ball during play?', answer: 'Pressing Escape or the on-screen Pause button suspends the ball in mid-flight.' }
    ],
    color: 'from-cyan-500 to-blue-600',
    badge: 'Retro Hit',
    estimatedPlayTime: '3 - 8 min',
    playerCount: 'Single Player'
  },
  {
    id: 'bubble-shooter',
    slug: 'bubble-shooter',
    title: 'Bubble Shooter Pop',
    category: 'brain-puzzles',
    categoryLabel: 'Brain & Puzzles',
    icon: '🫧',
    age: 'Age 5+',
    grades: 'Grades K-8',
    shortDesc: 'Aim and fire colored bubbles to form matching clusters of 3 or more.',
    overview: 'Bubble Shooter Pop is a calm yet deeply strategic arcade puzzle. Players operate a rotating bubble cannon at the bottom of the arena, aiming and firing colored orbs toward a descending ceiling of vibrant spheres. Forming clusters of three or more matching colors pops them, causing unsupported bubbles underneath to tumble into bonus jars.',
    howToPlay: [
      'Aim the trajectory pointer line using your mouse or finger toward the cluster you wish to hit.',
      'Release or click to shoot the loaded bubble up into the playing grid.',
      'Match 3 or more bubbles of identical color to pop them and clear space.',
      'Clear the entire board before the descending ceiling presses bubbles past the bottom foul line.'
    ],
    controlsDesktop: 'Move mouse to aim trajectory line, Left Click to fire bubble.',
    controlsMobile: 'Drag finger on screen to aim laser sights, lift finger to launch.',
    scoringGuide: '10 points per popped bubble. Dropping disconnected bubble avalanches awards 100 points per falling sphere.',
    proStrategies: [
      'Bank shots: bounce bubbles off the side walls to reach deep corners that direct straight shots cannot hit.',
      'Root disconnection: target the narrow stem connecting a large cluster to the ceiling to trigger massive avalanche drops.',
      'Check your launcher hopper: observe the upcoming bubble color in the queue to plan two shots ahead.'
    ],
    cognitiveSkills: [
      { skill: 'Geometric Bank Angle Prediction', explanation: 'Calculating rebound vectors off boundary walls to reach concealed pockets.' },
      { skill: 'Color Discrimination & Grouping', explanation: 'Quickly scanning large multi-hued arrays for cluster density.' },
      { skill: 'Strategic Clearing Order', explanation: 'Choosing high-impact root targets over low-value surface clusters.' }
    ],
    classroomApplication: 'A relaxing classroom reward activity that exercises geometric visualization and color classification without sensory overstimulation.',
    faqs: [
      { question: 'Does Bubble Shooter Pop have a timer?', answer: 'No, you have unlimited time to aim each shot carefully, making it ideal for relaxed, thoughtful play.' },
      { question: 'What happens when I miss several shots in a row?', answer: 'Every 5 non-popping shots causes the bubble ceiling to step downward by one row.' },
      { question: 'Can colorblind players distinguish the bubbles?', answer: 'Yes, each bubble features unique internal geometric glyphs (stars, diamonds, circles) in addition to colors.' }
    ],
    color: 'from-emerald-400 to-teal-600',
    badge: 'Relaxing',
    estimatedPlayTime: '4 - 10 min',
    playerCount: 'Single Player'
  },
  {
    id: 'color-switch',
    slug: 'color-switch',
    title: 'Color Gate Arena',
    category: 'action-reflex',
    categoryLabel: 'Action & Reflex',
    icon: '🎨',
    age: 'Age 7+',
    grades: 'Grades 2-12',
    shortDesc: 'Bounce the ball through obstacle gates that strictly match its current color.',
    overview: 'Color Gate Arena challenges mental agility and reflex timing. Players tap to bounce a colored sphere upward through spinning geometric obstacles—circles, squares, and crossbars—each split into four colored sections. You may only pass through the segment that matches your ball color. Touching any mismatched hue resets the trial immediately.',
    howToPlay: [
      'Tap repeatedly to make your colored ball bounce upward against gravity.',
      'Observe the spinning obstacle overhead and wait for your matching color segment to align.',
      'Pass smoothly through the matching color section into the safe central chamber.',
      'Collect multi-color prism orbs to change your ball to a new randomized color hue.',
      'Continue climbing vertically through increasingly intricate rotating patterns.'
    ],
    controlsDesktop: 'Spacebar, Up Arrow, or Mouse Click to bounce.',
    controlsMobile: 'Tap anywhere on the touchscreen to bounce.',
    scoringGuide: '1 point per completed obstacle gate cleared, plus 5 bonus points for each color prism orb collected.',
    proStrategies: [
      'Hovering technique: tap lightly at a steady frequency to keep the ball floating in place while waiting for your color to rotate into position.',
      'Look ahead after color switch: the moment your ball shifts hue, immediately scan the upcoming obstacle for your new color.',
      'Do not rush: patience is rewarded far more than speed in this game.'
    ],
    cognitiveSkills: [
      { skill: 'Inhibitory Motor Control', explanation: 'Suppressing the urge to jump until the exact chromatic match rotates into view.' },
      { skill: 'Dynamic Color Discrimination', explanation: 'Identifying hue alignment under continuous rotational motion.' },
      { skill: 'Patience & Emotional Regulation', explanation: 'Staying composed while waiting through full rotations.' }
    ],
    classroomApplication: 'Used in psychology and motor development workshops to demonstrate response inhibition and visual-motor gating.',
    faqs: [
      { question: 'Why does the ball change color after an obstacle?', answer: 'Passing through color prism orbs resets your color, forcing your brain to re-calibrate its target segment for the next challenge.' },
      { question: 'Can the ball fall off the bottom of the screen?', answer: 'Yes, if you stop tapping, gravity will cause the ball to drop below the viewport, ending the run.' },
      { question: 'Are rotating speeds constant?', answer: 'Obstacles rotate at steady, predictable speeds so that success is entirely a matter of timing and patience.' }
    ],
    color: 'from-pink-500 to-purple-600',
    badge: 'Reflex Test',
    estimatedPlayTime: '2 - 5 min',
    playerCount: 'Single Player'
  },
  {
    id: 'whack-a-mole',
    slug: 'whack-a-mole',
    title: 'Whack-A-Mole Reflex',
    category: 'action-reflex',
    categoryLabel: 'Action & Reflex',
    icon: '🔨',
    age: 'Age 4+',
    grades: 'Preschool - Grade 6',
    shortDesc: 'Tap mischievous moles as they pop up from their holes before they duck back down.',
    overview: 'Whack-A-Mole Reflex brings the carnival classic into the digital browser. Mischievous glowing moles pop up randomly from a 3x3 subterranean burrow grid. Players must react with lightning speed to tap or click them before they submerge, while avoiding decoy bomb moles that deduct precious points.',
    howToPlay: [
      'Keep your eyes scanning across all 9 burrow holes on the screen.',
      'When a friendly brown mole pops up, click or tap it immediately for points.',
      'If a golden crown mole appears, whack it quickly for triple bonus score.',
      'Do NOT tap the red helmet or bomb moles, which deduct 50 points from your total.',
      'Whack as many valid targets as possible before the 45-second timer runs out.'
    ],
    controlsDesktop: 'Click moles with mouse cursor.',
    controlsMobile: 'Tap moles directly with your fingers on touchscreen.',
    scoringGuide: 'Standard mole: 10 pts. Golden mole: 30 pts. Bomb mole penalty: -50 pts. Speed bonus for hits under 300ms.',
    proStrategies: [
      'Rest your visual focus in the center of the grid to maximize peripheral vision coverage.',
      'On touchscreens, use two hands—left thumb for left holes, right thumb for right holes.',
      'Wait a microsecond to verify the mole type before tapping to prevent hitting decoy bomb moles.'
    ],
    cognitiveSkills: [
      { skill: 'Reaction Latency Reduction', explanation: 'Accelerating ocular perception to finger tap response speed down to 250 milliseconds.' },
      { skill: 'Peripheral Field Monitoring', explanation: 'Detecting subtle movements outside central focal vision.' },
      { skill: 'Go / No-Go Discrimination', explanation: 'Selecting target stimuli while inhibiting taps on decoy distractors.' }
    ],
    classroomApplication: 'Excellent for early childhood physical education classes to warm up hand agility, spatial reaction, and attentional readiness.',
    faqs: [
      { question: 'Is Whack-A-Mole violent in any way?', answer: 'Not at all. The moles wear cute glasses or crowns, and when tapped they make a cheerful squeak and duck back into their holes with twinkling stars.' },
      { question: 'What is a good score for an 8-year-old?', answer: 'A score of 350+ points in 45 seconds indicates exceptional hand-eye reaction speed.' },
      { question: 'Can multiple children take turns?', answer: 'Yes, the 45-second round duration makes it the perfect pass-and-play party or classroom station activity.' }
    ],
    color: 'from-amber-600 to-amber-800',
    badge: 'Fast Action',
    estimatedPlayTime: '1 min',
    playerCount: 'Single Player'
  },
  {
    id: 'fruit-slice',
    slug: 'fruit-slice',
    title: 'Fruit Slice Ninja',
    category: 'action-reflex',
    categoryLabel: 'Action & Reflex',
    icon: '🍉',
    age: 'Age 6+',
    grades: 'Grades 1-12',
    shortDesc: 'Swipe your blade across juicy tossed fruits while avoiding dangerous bombs.',
    overview: 'Fruit Slice Ninja turns your cursor or finger into a precision katana blade. Fresh watermelons, ripe bananas, oranges, and strawberries are launched into the air from below. Players swipe across them in fluid arcs to slice them into halves, earning combo multipliers for multi-fruit slices while dodging flying explosive bombs.',
    howToPlay: [
      'Click and drag your mouse or swipe your finger across tossed fruit to slice them.',
      'Slice 3 or more fruits in a single unbroken swipe to trigger combo multipliers.',
      'Never slice the black ticking bombs; hitting a bomb causes an instant explosion and game over.',
      'Do not let 3 uncut fruits fall off the bottom of the screen un-sliced.'
    ],
    controlsDesktop: 'Click and drag mouse cursor across screen to slash.',
    controlsMobile: 'Swipe finger continuously across touchscreen.',
    scoringGuide: '1 point per fruit sliced. Combos: 3 fruits = 3x pts, 4 fruits = 4x pts, 5+ fruits = Blitz Bonus (50 extra pts).',
    proStrategies: [
      'Wait for the apex: slice fruits right when they reach the peak of their toss arc, where their velocity briefly drops to zero.',
      'Short, controlled slices: avoid wild full-screen swipes that might accidentally clip a nearby bomb.',
      'Line up diagonal cuts that intersect two fruits on their upward journey and a third on its downward path.'
    ],
    cognitiveSkills: [
      { skill: 'Continuous Vector Swiping', explanation: 'Coordinating smooth continuous hand trajectory paths.' },
      { skill: 'Threat Identification & Avoidance', explanation: 'Rapidly categorizing targets as safe or hazardous under high visual clutter.' },
      { skill: 'Multi-Target Prioritization', explanation: 'Selecting the most efficient slashing arc to maximize simultaneous hits.' }
    ],
    classroomApplication: 'Helps students practice fluid motor control and threat discrimination, often used as a fun sensory break in computer lab periods.',
    faqs: [
      { question: 'How do combos work in Fruit Slice Ninja?', answer: 'A combo is awarded when a single uninterrupted swipe connects with 3 or more separate fruits in less than 0.3 seconds.' },
      { question: 'Can I play this with a trackpad on a laptop?', answer: 'Yes, dragging with one finger on a modern laptop trackpad works smoothly, though a mouse or touchscreen offers even higher precision.' },
      { question: 'Is there a zen mode without bombs?', answer: 'Yes, players can toggle "Practice Zen Mode" to slice fruit peacefully without bomb hazards or life limits.' }
    ],
    color: 'from-red-500 to-orange-600',
    badge: 'Popular',
    estimatedPlayTime: '2 - 4 min',
    playerCount: 'Single Player'
  },
  {
    id: 'connect-four',
    slug: 'connect-four',
    title: 'Four in a Line',
    category: 'brain-puzzles',
    categoryLabel: 'Brain & Puzzles',
    icon: '🔴',
    age: 'Age 5+',
    grades: 'Grades K-12',
    shortDesc: 'Drop colored discs into the vertical grid to form 4 in a horizontal, vertical or diagonal row.',
    overview: 'Four in a Line (Four Up) is a masterclass in spatial foresight and strategic connection. Players drop red and yellow checkers into a 7-column, 6-row vertical suspended grid. Discs drop straight down, occupying the lowest available space in the chosen column. The objective is to be the first to form a horizontal, vertical, or diagonal line of four checkers.',
    howToPlay: [
      'Choose to play against the computer AI or challenge a friend in 2-Player mode.',
      'Click or tap above any of the 7 columns to drop your colored disc into that slot.',
      'The disc slides down to the lowest unoccupied cell in that column.',
      'Alternate turns attempting to align 4 consecutive discs of your color while blocking your opponent.',
      'The first player to connect four discs in a row wins the round.'
    ],
    controlsDesktop: 'Click above any column with mouse cursor.',
    controlsMobile: 'Tap above any column on touchscreen.',
    scoringGuide: '100 points for a victory. Bonus 50 points for winning in under 15 moves. Match streak records preserved.',
    proStrategies: [
      'Control column 4 (the center column): discs placed in the center column can participate in exponentially more winning 4-in-a-row lines than outer columns.',
      'Look for "Double Threats" (Forks): set up two separate 3-in-a-row lines where your opponent can only block one, guaranteeing victory on your next turn.',
      'Never drop a disc beneath a space that would allow your opponent to immediately win on top of you.'
    ],
    cognitiveSkills: [
      { skill: 'Spatial Foresight (2-3 Moves Ahead)', explanation: 'Simulating future board states before making a current move.' },
      { skill: 'Defensive Threat Neutralization', explanation: 'Balancing offensive expansion against immediate opponent containment.' },
      { skill: 'Diagonal Pattern Recognition', explanation: 'Tracking non-orthogonal alignment threats that are easy to overlook.' }
    ],
    classroomApplication: 'A staple of logic and chess clubs, teaching youth the principles of tempo, board control, and defensive anticipation.',
    faqs: [
      { question: 'Can I play this locally against my parent or classmate?', answer: 'Yes, select 2-Player mode to pass the tablet or alternate clicks on the same laptop.' },
      { question: 'Does the game explain how someone won?', answer: 'Yes, when a player achieves four in a line, the winning sequence glows brightly with an animated connecting line.' },
      { question: 'What happens if the entire grid fills with no winner?', answer: 'If all 42 slots are occupied without 4 in a line, the game declares a respectful stalemate draw.' }
    ],
    color: 'from-blue-600 to-indigo-800',
    badge: 'Strategy',
    estimatedPlayTime: '3 - 6 min',
    playerCount: '1 or 2 Players'
  },
  {
    id: 'space-invaders',
    slug: 'space-invaders',
    title: 'Galaxy Defender',
    category: 'arcade-retro',
    categoryLabel: 'Arcade & Retro',
    icon: '👾',
    age: 'Age 7+',
    grades: 'Grades 2-12',
    shortDesc: 'Defend planet Earth from descending alien fleets with your starfighter cannon.',
    overview: 'Galaxy Defender brings the golden age of vertical arcade shooters to modern web browsers. Command a high-tech starfighter across the lower perimeter of Earth orbit, firing plasma cannons to neutralize advancing alien armada formations. Take tactical shelter behind depleting energy shields, shoot bonus UFO command ships, and prevent the fleet from landing.',
    howToPlay: [
      'Steer your starfighter left and right along the bottom of the screen.',
      'Press Spacebar to fire your plasma cannon upward toward the descending alien rows.',
      'Use the 3 green defensive bunkers for cover against enemy laser bolts.',
      'Shoot the high-altitude red Mystery Command Ship when it glides across the top for big bonus points.',
      'Eliminate all alien invaders before they march down to the bottom defense baseline.'
    ],
    controlsDesktop: 'Left/Right Arrow keys or A/D to steer, Spacebar to shoot.',
    controlsMobile: 'Touchscreen left/right steering arrows and fire button.',
    scoringGuide: 'Bottom invaders: 10 pts. Middle invaders: 20 pts. Top invaders: 30 pts. Red Mystery Ship: 100 - 300 randomized bonus pts.',
    proStrategies: [
      'Clear from the edges inward: trimming the outer columns slows down the fleet horizontal march across the screen.',
      'Preserve your bunkers: shoot through narrow holes in your own shields rather than obliterating them completely.',
      'Focus fire on the lowest invaders first to prevent them from reaching your baseline.'
    ],
    cognitiveSkills: [
      { skill: 'Multi-Target Hazard Tracking', explanation: 'Tracking both your cannon projectile trajectory and dozens of enemy laser bolts simultaneously.' },
      { skill: 'Tactical Prioritization', explanation: 'Choosing between immediate threats and high-value distant targets.' },
      { skill: 'Resource & Shelter Management', explanation: 'Pacing defensive bunker wear to maximize survival.' }
    ],
    classroomApplication: 'Demonstrates historical milestones in software engineering and video game history while building hand-eye coordination.',
    faqs: [
      { question: 'Do the aliens speed up as their numbers decrease?', answer: 'Yes! True to classic arcade physics, each destroyed invader reduces fleet weight, accelerating the remaining ships.' },
      { question: 'How many lives does the player start with?', answer: 'You start with 3 starfighters. An extra reserve ship is awarded upon clearing wave 3.' },
      { question: 'Is the game non-violent for young children?', answer: 'Yes, the enemy sprites are retro pixel graphics and dissolve into friendly glowing sparks when tagged.' }
    ],
    color: 'from-indigo-600 to-slate-900',
    badge: 'Retro Hit',
    estimatedPlayTime: '3 - 6 min',
    playerCount: 'Single Player'
  },
  {
    id: 'pac-maze',
    slug: 'pac-maze',
    title: 'Neon Maze Runner',
    category: 'arcade-retro',
    categoryLabel: 'Arcade & Retro',
    icon: '🟡',
    age: 'Age 6+',
    grades: 'Grades 1-12',
    shortDesc: 'Chomp glowing cyber dots through the labyrinth while dodging roving patrol bots.',
    overview: 'Neon Maze Runner drops players into a glowing cybernetic labyrinth. Navigate winding neon corridors, consuming radiant energy pellets to score points while using spatial memory to evade four autonomous patrol bots. Grab pulsing Power Orbs to turn the tables, sending the bots into retreat and clearing the sector for ultimate victory.',
    howToPlay: [
      'Direct your hero through maze passages using directional keys or touchscreen swipes.',
      'Consume all glowing yellow energy pellets scattered throughout the labyrinth.',
      'Avoid colliding with the colored patrol bots while they are in search mode.',
      'Consume glowing corner Power Orbs to temporarily turn patrol bots vulnerable (blue), allowing you to tag them for bonus score.',
      'Clear every last pellet in the maze to advance to the next labyrinth sector.'
    ],
    controlsDesktop: 'Arrow keys (Up, Down, Left, Right) or W, A, S, D keys.',
    controlsMobile: 'Swipe in any cardinal direction or use the on-screen D-pad buttons.',
    scoringGuide: 'Regular energy pellets: 10 pts. Power Orbs: 50 pts. Chasing bots during vulnerability: 200, 400, 800, 1600 pts consecutive.',
    proStrategies: [
      'Clear the lower half first: bots tend to scatter upward from their central base early in each round.',
      'Do not consume Power Orbs immediately: save them for emergency escapes when patrol bots corner you.',
      'Use the side escape warp tunnels: bots move at half speed through side tunnels, giving you a safe escape route.'
    ],
    cognitiveSkills: [
      { skill: 'Mental Spatial Mapping', explanation: 'Retaining the complete maze layout in mind while focused on local corridors.' },
      { skill: 'Pathfinding Optimization', explanation: 'Formulating movement routes that minimize redundant backtracking.' },
      { skill: 'Risk vs Reward Evaluation', explanation: 'Weighing the point value of distant pellets against the proximity of pursuers.' }
    ],
    classroomApplication: 'Used in robotics and computer science clubs to explain autonomous agent pathfinding, state machines, and maze-solving algorithms.',
    faqs: [
      { question: 'Do the patrol bots have different personality behaviors?', answer: 'Yes! The red bot chases directly, pink predicts your future position, cyan seeks ambushes, and orange wanders unpredictably.' },
      { question: 'What happens when I use the side warp tunnels?', answer: 'Entering the left tunnel immediately transports you to the right side of the maze, providing a clever tactical escape.' },
      { question: 'Can I pause if my teacher calls on me?', answer: 'Yes, pressing P or clicking Pause freezes the bots immediately.' }
    ],
    color: 'from-yellow-400 to-amber-700',
    badge: 'Arcade',
    estimatedPlayTime: '3 - 7 min',
    playerCount: 'Single Player'
  },
  {
    id: 'aim-trainer',
    slug: 'aim-trainer',
    title: 'Aim Reflex Trainer',
    category: 'action-reflex',
    categoryLabel: 'Action & Reflex',
    icon: '🎯',
    age: 'Age 8+',
    grades: 'Grades 3-12',
    shortDesc: 'Sharpen target acquisition speed and pointer accuracy across dynamic targets.',
    overview: 'Aim Reflex Trainer is a dedicated digital gymnasium for hand-eye precision and pointer motor calibration. Target spheres appear in random spatial coordinates across a clean digital canvas, shrinking over time. Players must acquire, track, and click each target with maximum speed and accuracy, measuring their reaction latency in exact milliseconds.',
    howToPlay: [
      'Click the Start Training button to begin the 30-second target acquisition drill.',
      'Target spheres will materialize across random positions on the screen.',
      'Click each sphere as close to its center as possible before it shrinks and despawns.',
      'Avoid clicking blank empty space, which reduces your overall accuracy percentage.',
      'Review your post-round performance report: total targets hit, average reaction time (ms), and accuracy rating.'
    ],
    controlsDesktop: 'Point and click with mouse cursor or trackpad.',
    controlsMobile: 'Tap targets directly with your fingers on touchscreen.',
    scoringGuide: '100 base points per target hit plus up to 50 speed points based on reaction latency. Penalty of -20 points for missed clicks.',
    proStrategies: [
      'Maintain steady mouse sensitivity: do not jerk your wrist wildly; use smooth forearm transitions.',
      'Target acquisition sequence: hit targets that are closest to shrinking away first, then acquire newer spawns.',
      'Accuracy over raw speed: landing 95% of targets at 350ms yields a far higher score than rushing with 60% accuracy.'
    ],
    cognitiveSkills: [
      { skill: 'Pointer Motor Precision', explanation: 'Executing micro-adjustments of hand muscles to position a cursor exactly on small targets.' },
      { skill: 'Fitts Law Optimization', explanation: 'Minimizing the trade-off between target acquisition speed and target size.' },
      { skill: 'Reaction Latency Calibration', explanation: 'Measuring and trimming milliseconds from ocular-motor reaction circuits.' }
    ],
    classroomApplication: 'Popular in school esports clubs and technology classes to teach ergonomics, proper mouse grip, and hand-eye calibration.',
    faqs: [
      { question: 'What is considered a good reaction time on this trainer?', answer: 'An average reaction time between 250ms and 320ms with >90% accuracy is considered excellent for school-age students.' },
      { question: 'Does playing with a mouse give better results than a trackpad?', answer: 'Yes, a standard optical mouse allows natural arm movement, though trackpad play is great for training fine finger dexterity.' },
      { question: 'Are there different target modes?', answer: 'Yes: Gridshot (steady 3 targets), Precision (tiny targets), and Reflex Speed (single rapid target).' }
    ],
    color: 'from-emerald-500 to-cyan-700',
    badge: 'Esports Drill',
    estimatedPlayTime: '1 - 2 min',
    playerCount: 'Single Player'
  },
  {
    id: 'crossy-road',
    slug: 'crossy-road',
    title: 'Hop and Cross',
    category: 'arcade-retro',
    categoryLabel: 'Arcade & Retro',
    icon: '🐸',
    age: 'Age 5+',
    grades: 'Grades K-12',
    shortDesc: 'Hop across busy highways, floating river logs, and speeding train tracks.',
    overview: 'Hop and Cross tests patient timing and obstacle clearance in an endless procedural world. Guide an intrepid little hopper across multi-lane highways filled with colorful cars and trucks, leap across rushing river rapids using floating timber logs and water lilies, and sprint across high-speed railway lines before warning lights flash red.',
    howToPlay: [
      'Press Up Arrow or tap forward to hop one tile forward.',
      'Use Left, Right, or Back controls to reposition sideways or retreat when needed.',
      'Time your street crossings to step into safe gaps between passing vehicles.',
      'Ride floating river logs to cross water rapids without falling into the water.',
      'Do not linger in one spot too long: the screen gently scrolls forward, encouraging steady progress.'
    ],
    controlsDesktop: 'Arrow keys (Up, Down, Left, Right) or WASD to hop.',
    controlsMobile: 'Tap screen to hop forward; swipe left, right, or down to change direction.',
    scoringGuide: '1 point for every vertical lane advanced forward. Golden coins scattered across paths grant 10 bonus points each.',
    proStrategies: [
      'Log surfing: step onto logs traveling in the direction you wish to head to gain free lateral positioning.',
      'Listen for audio cues: train tracks emit a rhythmic clacking sound and flashing signal 1.5 seconds before an express train speeds past.',
      'Do not rush moving lanes: wait patiently on grass medians until two adjacent lanes clear simultaneously.'
    ],
    cognitiveSkills: [
      { skill: 'Velocity Differential Calculation', explanation: 'Estimating when two vehicles moving at different speeds will create an open crossing window.' },
      { skill: 'Patience & Situational Awareness', explanation: 'Resisting premature movements until multi-lane conditions align safely.' },
      { skill: 'Rapid Spatial Repositioning', explanation: 'Stepping laterally to avoid obstacles while maintaining forward momentum.' }
    ],
    classroomApplication: 'A wonderful tool for teaching children road safety concepts, crossing rules, looking both ways, and traffic awareness.',
    faqs: [
      { question: 'What happens if my character falls into the river?', answer: 'Your hopper makes a playful splash and the round concludes, displaying your total lanes crossed and high score.' },
      { question: 'Can I unlock different characters?', answer: 'Yes! Collecting golden coins during runs allows you to unlock fun friendly avatars like ducklings, puppies, and robots.' },
      { question: 'Is the game endless?', answer: 'Yes, terrain generates procedurally as long as you survive, offering limitless replayability.' }
    ],
    color: 'from-teal-500 to-emerald-700',
    badge: 'Endless Fun',
    estimatedPlayTime: '2 - 5 min',
    playerCount: 'Single Player'
  },
  {
    id: 'rooftop-parkour',
    slug: 'rooftop-parkour',
    title: 'Rooftop Parkour Rush',
    category: 'action-reflex',
    categoryLabel: 'Action & Reflex',
    icon: '🏃',
    age: 'Age 8+',
    grades: 'Grades 3-12',
    shortDesc: 'Sprint across city rooftops, slide under billboards, and vault across dizzying gaps.',
    overview: 'Rooftop Parkour Rush is a high-speed lateral parkour runner set against a vibrant neon cityscape sunset. Sprint across skyscraper roofs, leap over ventilation ducts, slide under low billboard scaffolding, and execute precision gap vaults. Dynamic obstacle sequences demand dual-state motor timing between jumping and sliding.',
    howToPlay: [
      'Your athlete sprints forward automatically across skyscraper rooftops.',
      'Press Up Arrow or tap upper screen to jump over air conditioners, gaps, and barriers.',
      'Press Down Arrow or tap lower screen to perform a low slide under steel pipes and neon signboards.',
      'Collect golden sparks along rooftop paths to charge your sprint boost multiplier.',
      'Survive as far as possible across the city skyline to set new distance records.'
    ],
    controlsDesktop: 'Up Arrow / Space to Jump, Down Arrow / S to Slide.',
    controlsMobile: 'Tap top half of screen to Jump, tap bottom half of screen to Slide.',
    scoringGuide: '10 points per rooftop meter sprinted. Golden sparks award 50 pts each. Sliding under billboards awards style points.',
    proStrategies: [
      'Learn the dual-jump rhythm: when approaching two obstacles close together, jump immediately upon landing from the first.',
      'Slide early: you can initiate a slide 2 tiles before an obstacle and slide smoothly underneath without clipping.',
      'Watch building heights: adjust your jump timing depending on whether the next rooftop is higher or lower than your current elevation.'
    ],
    cognitiveSkills: [
      { skill: 'Dual-State Motor Timing', explanation: 'Switching rapidly between upward jump commands and downward slide commands.' },
      { skill: 'Visual Flow Processing', explanation: 'Parsing fast-scrolling background and foreground layers without sensory disorientation.' },
      { skill: 'Dynamic Obstacle Anticipation', explanation: 'Recognizing hazard silhouettes at the far right border of the viewport.' }
    ],
    classroomApplication: 'Provides an exhilarating visual reset that builds quick mental state switching and rapid stimulus response.',
    faqs: [
      { question: 'Is there any violence or falling injury shown?', answer: 'None. If an athlete clips an obstacle, they perform a harmless tumble with a cartoon puff of dust and an encouraging "Try Again" card.' },
      { question: 'Does the game get faster over time?', answer: 'Yes, the running velocity gently accelerates every 250 meters to test seasoned players.' },
      { question: 'Can I play this with arrow keys or Spacebar?', answer: 'Both work interchangeably, allowing you to use whichever hand configuration feels most comfortable.' }
    ],
    color: 'from-orange-500 to-red-600',
    badge: 'High Speed',
    estimatedPlayTime: '2 - 4 min',
    playerCount: 'Single Player'
  },
  {
    id: 'jetpack-raider',
    slug: 'jetpack-raider',
    title: 'Jetpack Raider',
    category: 'action-reflex',
    categoryLabel: 'Action & Reflex',
    icon: '🚀',
    age: 'Age 7+',
    grades: 'Grades 2-12',
    shortDesc: 'Thrust through subterranean caverns, dodge laser zappers, and collect gold coins.',
    overview: 'Jetpack Raider straps players into an experimental anti-gravity thruster pack inside a high-tech science laboratory. Holding down the thrust button engages continuous upward propulsion, while releasing it allows gravity to pull you gently downward. Navigate through electro-zapper barriers, rocket warning corridors, and laser grids while collecting golden science coins.',
    howToPlay: [
      'Hold down Mouse Click, Spacebar, or touchscreen to activate upward jetpack thrust.',
      'Release the input to allow gravity to pull you smoothly back toward the floor.',
      'Weave between static electric zappers and rotating laser beams.',
      'Watch for exclamation mark warnings on the right side of the screen, signaling incoming tracking rockets.',
      'Travel as many meters as possible into the laboratory to achieve new high scores.'
    ],
    controlsDesktop: 'Hold Left Mouse Button, Spacebar, or Up Arrow to fly upward; release to descend.',
    controlsMobile: 'Hold finger on touchscreen to fly upward; lift finger to descend.',
    scoringGuide: '1 point per meter traveled. Science coins grant 5 points each. Shield bubbles grant one free hazard collision.',
    proStrategies: [
      'Master the "Gentle Feathering" technique: use rapid short pulses instead of holding the button down continuously to hover at a steady height.',
      'Stay near the vertical middle: cruising through the center gives you the most reaction room whether an obstacle appears high or low.',
      'When you see a red rocket warning, immediately check which vertical lane it is tracking and shift away before it fires.'
    ],
    cognitiveSkills: [
      { skill: 'Continuous Gravity Modeling', explanation: 'Developing intuitive mental models of thrust power vs gravitational acceleration.' },
      { skill: 'Fine Trajectory Control', explanation: 'Maintaining a stable hover altitude through micro-adjustments of input duration.' },
      { skill: 'Multi-Hazard Warning Response', explanation: 'Reacting to early warning indicators before active hazards enter the arena.' }
    ],
    classroomApplication: 'Used by middle school science teachers to intuitively illustrate Newton laws of motion, thrust vs gravity, and equilibrium.',
    faqs: [
      { question: 'What powers the jetpack?', answer: 'The jetpack has unlimited clean energy—no fuel gauges or pay-to-refuel mechanics ever!' },
      { question: 'Can I collect shields to survive hits?', answer: 'Yes, translucent blue shield bubbles appear occasionally and absorb a single hazard impact without ending the run.' },
      { question: 'Does the game save my longest distance?', answer: 'Yes, your all-time furthest distance record is preserved in your local browser profile.' }
    ],
    color: 'from-cyan-600 to-blue-800',
    badge: 'Popular',
    estimatedPlayTime: '2 - 5 min',
    playerCount: 'Single Player'
  },
  {
    id: 'piano-tiles',
    slug: 'piano-tiles',
    title: 'Magic Piano Tiles',
    category: 'little-kids',
    categoryLabel: 'Little Kids & Music',
    icon: '🎹',
    age: 'Age 4+',
    grades: 'Preschool - Grade 8',
    shortDesc: 'Tap falling melody keys on rhythm to play beautiful songs without missing.',
    overview: 'Magic Piano Tiles introduces children to the joy of music performance through interactive rhythm play. Black melody keys cascade down four vertical tracks in synchronization with classical masterpieces, nursery rhymes, and uplifting tunes. By tapping keys precisely as they cross the baseline, players produce harmonious piano chords while training musical rhythm.',
    howToPlay: [
      'Select a song from the track library (e.g., Fur Elise, Twinkle Little Star, Ode to Joy).',
      'Watch as black melody tiles descend down the 4 vertical musical lanes.',
      'Tap each black tile right when it reaches the bottom strike line.',
      'For elongated note tiles, hold down until the tail completes its passage.',
      'Never tap an empty white tile space, and do not let a black tile scroll past the bottom untouched.'
    ],
    controlsDesktop: 'Keys D, F, J, K or 1, 2, 3, 4, or click falling tiles with mouse.',
    controlsMobile: 'Tap the descending black tiles directly on the touchscreen.',
    scoringGuide: 'Perfect Hit: 3 pts. Great Hit: 2 pts. Good Hit: 1 pt. Completing a song earns a 3-star rating and master crown.',
    proStrategies: [
      'Use both hands on touchscreens: dedicate your left thumb to lanes 1-2 and your right thumb to lanes 3-4.',
      'Listen to the melody: your ears will tell you when the next note should sound before your eyes process it.',
      'Relax your posture: stiff fingers tire quickly; maintain light, flexible taps.'
    ],
    cognitiveSkills: [
      { skill: 'Musical Tempo Synchronization', explanation: 'Connecting acoustic melody tempo to visual motor timing.' },
      { skill: 'Bimanual Multi-Finger Coordination', explanation: 'Operating independent fingers across four separate spatial lanes.' },
      { skill: 'Active Auditory Discrimination', explanation: 'Associating pitch changes with corresponding track positions.' }
    ],
    classroomApplication: 'Recommended by music teachers and early childhood educators for introducing pitch, tempo, melody, and rhythm without requiring physical instrument purchases.',
    faqs: [
      { question: 'What songs are included in Magic Piano Tiles?', answer: 'The library includes classic favorites like Twinkle Twinkle Little Star, Beethoven Ode to Joy, Mozart Lullaby, and joyful folk melodies.' },
      { question: 'Is this game suitable for preschoolers?', answer: 'Yes! Junior mode slows down note velocity and provides cheerful audio cues on every successful tap.' },
      { question: 'Does the game require headphones?', answer: 'Headphones provide a wonderful acoustic experience, but device speakers also work beautifully.' }
    ],
    color: 'from-slate-700 to-slate-900',
    badge: 'Musical',
    estimatedPlayTime: '2 - 4 min',
    playerCount: 'Single Player'
  }
];
