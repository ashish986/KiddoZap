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
  titleHi: string;
  category: 'math' | 'brain-puzzles' | 'action-reflex' | 'arcade-retro' | 'creative';
  categoryLabel: string;
  icon: string;
  age: string;
  grades: string;
  shortDesc: string;
  shortDescHi: string;
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
  { id: 'all', name: 'All games', icon: '🌟' },
  { id: 'math', name: 'Math & Numbers', icon: '🔢' },
  { id: 'brain-puzzles', name: 'Brain & Logic', icon: '🧩' },
  { id: 'action-reflex', name: 'Action & Reflex', icon: '🚀' },
  { id: 'arcade-retro', name: 'Arcade & Retro', icon: '👾' },
  { id: 'creative', name: 'Creative & Building', icon: '🏗️' },
] as const;

export const GAMES: GameInfo[] = [
  // 1. Math Sprint Blitz
  {
    id: 'math-sprint',
    slug: 'math-sprint',
    title: 'Math Sprint Blitz',
    titleHi: 'गणित स्प्रिंट (स्पीड मैथ)',
    category: 'math',
    categoryLabel: 'Math & Numbers',
    icon: '🔢',
    age: 'Age 5+',
    grades: 'Grades 1-8',
    shortDesc: 'Rapid-fire mental arithmetic speed quiz. Add, subtract, and multiply under a ticking clock!',
    shortDescHi: 'घड़ी की टिक-टिक के साथ फटाफट जोड़, घटाव और गुणा के सवालों के सही जवाब दें!',
    overview: 'Math Sprint Blitz turns mental math into an exciting high-speed race! Children solve quick addition, subtraction, multiplication, and division equations, building number fluency and eliminating math anxiety with joyful streak multipliers and star rewards.',
    howToPlay: [
      'Read the arithmetic problem displayed at the top.',
      'Tap the correct answer from the 4 multiple choice cards before time runs out.',
      'Answer correctly in a row to earn more points.',
      'Solve as many questions as you can before the 30-second timer runs out.'
    ],
    controlsDesktop: 'Click the correct answer or use Tab and Enter.',
    controlsMobile: 'Tap the correct number card directly on screen.',
    scoringGuide: 'Each correct answer earns 10 points plus 2 per previous answer in the streak. Correct answers add one second, up to 45 seconds. Incorrect answers cost two seconds and reset the streak.',
    proStrategies: [
      'Look at the last digit for quick estimation.',
      'Keep your streak alive for massive multiplier bonuses.',
      'Stay relaxed and trust your mental calculations.'
    ],
    cognitiveSkills: [
      { skill: 'Mental Arithmetic Speed', explanation: 'Fast numerical calculation and fact retrieval.' },
      { skill: 'Working Memory', explanation: 'Holding multiple numerical values in mind while operating.' },
      { skill: 'Stress Inoculation', explanation: 'Performing accurate calculations under timed conditions.' }
    ],
    classroomApplication: 'Used by elementary educators as a 3-minute warm-up before mathematics classes to activate numeracy pathways.',
    faqs: [
      { question: 'Is Math Sprint suitable for Class 1 kids?', answer: 'Yes! Easy mode starts with single-digit addition (e.g. 3 + 4) and gradually scales up.' },
      { question: 'Does it support multiplication?', answer: 'Yes, medium and hard tiers include times tables from 2x up to 12x.' }
    ],
    color: 'from-amber-500 to-orange-600',
    badge: 'Popular',
    estimatedPlayTime: '2 - 3 min',
    playerCount: 'Single Player'
  },

  // 2. Kiddo Sudoku
  {
    id: 'sudoku',
    slug: 'sudoku',
    title: 'Kiddo Sudoku 4×4',
    titleHi: 'दिमागी सुडोकू (तार्किक पहेली)',
    category: 'brain-puzzles',
    categoryLabel: 'Brain & Logic',
    icon: '🧩',
    age: 'Age 6+',
    grades: 'Grades 1-12',
    shortDesc: 'Fill a 4×4 grid with the numbers 1–4 using the clues.',
    shortDescHi: 'हर पंक्ति, कॉलम और 2×2 खाने में 1 से 4 तक की संख्याएँ भरें।',
    overview: 'Fill the empty squares so every row, column and 2×2 box contains each number from 1 to 4 once.',
    howToPlay: [
      'Select an empty cell on the grid.',
      'Choose a number from the keypad to place it in the cell.',
      'Ensure every horizontal row, vertical column, and sub-box has each symbol only once.',
      'Check the row, column and 2×2 box if you get stuck.'
    ],
    controlsDesktop: 'Click a cell, then click a digit on the keypad.',
    controlsMobile: 'Tap grid cell, then tap input piece at the bottom.',
    scoringGuide: 'The game counts incorrect entries and celebrates when the puzzle is solved.',
    proStrategies: [
      'Scan rows that already have 3 out of 4 symbols filled.',
      'The missing symbol is guaranteed by process of elimination.',
      'Double-check both row and column before placing.'
    ],
    cognitiveSkills: [
      { skill: 'Deductive Elimination', explanation: 'Narrowing down valid possibilities systematically.' },
      { skill: 'Spatial Pattern Scanning', explanation: 'Simultaneous 2D cross-referencing across rows and columns.' },
      { skill: 'Patience & Focus', explanation: 'Sustained deliberate attention to detail.' }
    ],
    classroomApplication: 'Recommended by STEM teachers for developing algorithmic thinking and structured problem decomposition.',
    faqs: [
      { question: 'Is there a time limit?', answer: 'There is no timer. Work through the clues at your own pace.' }
    ],
    color: 'from-blue-500 to-indigo-600',
    badge: 'Brain Booster',
    estimatedPlayTime: '3 - 6 min',
    playerCount: 'Single Player'
  },

  // 3. Memory Card Match
  {
    id: 'memory-match',
    slug: 'memory-match',
    title: 'Memory Card Match',
    titleHi: 'याददाश्त खेल (कार्ड मिलान)',
    category: 'brain-puzzles',
    categoryLabel: 'Brain & Logic',
    icon: '🃏',
    age: 'Age 4+',
    grades: 'Grades PreK-6',
    shortDesc: 'Flip colorful cards to find matching pairs of friendly animals and items. Sharpens recall!',
    shortDescHi: 'कार्ड्स पलटें और एक जैसे जानवरों के जोड़े खोजें। अपनी याददाश्त तेज़ करें!',
    overview: 'Memory Card Match trains visual recall, concentration, and focus. Players flip two cards at a time to find hidden pairs of cute animals, sea creatures, and toys, celebrating with confetti and joyful sound effects upon completion.',
    howToPlay: [
      'Tap any closed card to reveal what is hiding underneath.',
      'Tap a second card to see if it matches the first one.',
      'If they match, they stay open! If not, they flip back.',
      'Match all pairs with the lowest number of flips to earn 3 stars!'
    ],
    controlsDesktop: 'Click cards with left mouse button.',
    controlsMobile: 'Tap cards directly with finger.',
    scoringGuide: '3 Stars for finishing under 20 flips; 2 Stars for under 30 flips.',
    proStrategies: [
      'Say the name of each revealed animal out loud to engage auditory memory.',
      'Focus on remembering corners first to anchor your mental spatial map.'
    ],
    cognitiveSkills: [
      { skill: 'Visual Working Memory', explanation: 'Retaining card positions in short-term memory.' },
      { skill: 'Spatial Mapping', explanation: 'Remembering grid coordinates of previously revealed cards.' },
      { skill: 'Inhibitory Control', explanation: 'Resisting random guessing in favor of deliberate recall.' }
    ],
    classroomApplication: 'Ideal for preschool and early elementary morning circles to build sustained attention and working memory capacity.',
    faqs: [
      { question: 'What difficulty levels exist?', answer: 'Supports 2x3 (Easy for toddlers), 3x4 (Medium), and 4x4 (Challenging) grids.' }
    ],
    color: 'from-emerald-500 to-teal-600',
    badge: 'Kids Favorite',
    estimatedPlayTime: '2 - 4 min',
    playerCount: 'Single Player'
  },

  // 4. Little Builder World
  {
    id: 'builder',
    slug: 'builder-world',
    title: 'Little Builder World',
    titleHi: 'छोटा निर्माता संसार (बिल्डर)',
    category: 'creative',
    categoryLabel: 'Creative & Building',
    icon: '🏗️',
    age: 'Age 4+',
    grades: 'Grades PreK-8',
    shortDesc: 'Construct colorful villages, cottages, roads, windmills, gardens, and bridges in 2D grid.',
    shortDescHi: 'अपने सपनों का सुंदर गांव बनाएं! घर, सड़कें, पेड़, फूल, पवन चक्की और पुल सजाएं!',
    overview: 'Little Builder World inspires architectural imagination and spatial design. Children place bricks, pitched roofs, chimneys, flower beds, winding roads, stone bridges, and pets across progressive mission challenges or in infinite free sandbox mode.',
    howToPlay: [
      'Select a building category (Houses, Nature, Roads, Animals, Props) from the palette.',
      'Click or tap on the landscape grid to place your block.',
      'Use the eraser tool to remove or replace blocks anytime.',
      'Complete mission objectives or create anything you dream of in Sandbox mode!'
    ],
    controlsDesktop: 'Left click to place, Right click or Eraser to remove. Day/Night button to switch sky.',
    controlsMobile: 'Tap palette item, then tap grid tile to construct.',
    scoringGuide: 'Earn 3 stars per mission by meeting foundation and landscape requirements.',
    proStrategies: [
      'Place foundations before adding upper story rooms and gable roofs.',
      'Connect houses with paved roads and bridges over water channels.'
    ],
    cognitiveSkills: [
      { skill: 'Spatial Reasoning', explanation: 'Understanding 2D elevation, alignment, and coordinate grids.' },
      { skill: 'Goal Decomposition', explanation: 'Breaking complex structures into manageable construction phases.' },
      { skill: 'Creative Expression', explanation: 'Harmonizing colors, nature, and architectural structures.' }
    ],
    classroomApplication: 'Used by geometry educators for perimeter, area, and structural balance demonstrations.',
    faqs: [
      { question: 'Is there a free sandbox mode?', answer: 'Yes! Unlimited blocks and zero mission constraints in Creative Sandbox.' }
    ],
    color: 'from-amber-500 to-yellow-600',
    badge: 'Creative',
    estimatedPlayTime: '5 - 15 min',
    playerCount: 'Single Player'
  },

  // 5. Snake Neon Classic
  {
    id: 'snake',
    slug: 'snake',
    title: 'Snake Neon Classic',
    titleHi: 'नियॉन सांप (क्लासिक आर्केड)',
    category: 'arcade-retro',
    categoryLabel: 'Arcade & Retro',
    icon: '🐍',
    age: 'Age 5+',
    grades: 'Grades K-12',
    shortDesc: 'Guide the glowing serpent to eat shiny apples and grow longer without bumping into walls!',
    shortDescHi: 'चमकते हुए सेब खाएं, सांप को लंबा बनाएं और दीवारों व खुद से टकराने से बचें!',
    overview: 'Snake Neon Classic brings the timeless arcade puzzle into a glowing, colorful world. Players navigate a friendly serpent to collect delicious apples, navigating perimeter boundaries and practicing proactive escape routes as the snake grows longer.',
    howToPlay: [
      'Use Arrow keys, WASD, or on-screen directional buttons to steer.',
      'Collect glowing apples to score points and grow your tail.',
      'Avoid running into the outer fence or your own body.',
      'Keep going to beat the daily high score!'
    ],
    controlsDesktop: 'Arrow keys (Up, Down, Left, Right) or WASD.',
    controlsMobile: 'Swipe screen or tap on-screen D-pad buttons.',
    scoringGuide: '10 points per apple collected multiplied by speed tier.',
    proStrategies: [
      'Follow the perimeter edges to maximize open maneuvering area.',
      'Never make a tight U-turn into your own body.'
    ],
    cognitiveSkills: [
      { skill: 'Spatial Pathfinding', explanation: 'Visualizing escape corridors multiple moves ahead.' },
      { skill: 'Reflex Timing', explanation: 'Executing turns precisely at grid intersections.' }
    ],
    classroomApplication: 'Demonstrates algorithmic thinking, grid coordinates, and boundary condition logic.',
    faqs: [
      { question: 'Can I pause the game?', answer: 'Yes, press P or tap the Pause button anytime.' }
    ],
    color: 'from-emerald-400 to-green-600',
    badge: 'Classic',
    estimatedPlayTime: '2 - 5 min',
    playerCount: 'Single Player'
  },

  // 6. Neon Rhythm Run
  {
    id: 'geodash',
    slug: 'geo-dash',
    title: 'Neon Rhythm Run',
    titleHi: 'रिदम जंपर (जंप और ताल)',
    category: 'action-reflex',
    categoryLabel: 'Action & Reflex',
    icon: '⚡',
    age: 'Age 6+',
    grades: 'Grades 1-12',
    shortDesc: 'Time your jumps precisely over geometric hazards and spikes to the beat of lively music!',
    shortDescHi: 'संगीत की ताल पर कूदें और चमकीले कांटों और रुकावटों को पार करें!',
    overview: 'Neon Rhythm Run is an energetic obstacle platformer where kids guide a glowing neon cube over spikes, jump pads, and portals in sync with lively musical beats. It trains rapid sensory processing, rhythm timing, and determination.',
    howToPlay: [
      'Tap Spacebar, Up Arrow, or screen to jump over ground spikes.',
      'Bounce off yellow jump pads for super high leaps.',
      'Fly through gravity portals to alter upside-down perspectives.',
      'Reach 100% of the level to unlock the golden rhythm trophy!'
    ],
    controlsDesktop: 'Spacebar, Up Arrow, or Left Mouse Click to jump.',
    controlsMobile: 'Tap anywhere on the display to jump.',
    scoringGuide: 'Distance percentage reached (0-100%) plus completion bonus stars.',
    proStrategies: [
      'Listen to the musical rhythm: jump on the drum beats.',
      'Look slightly ahead of your cube rather than directly at it.'
    ],
    cognitiveSkills: [
      { skill: 'Auditory-Motor Synchronization', explanation: 'Timing physical movement to acoustic cues.' },
      { skill: 'Inhibitory Control', explanation: 'Suppressing premature finger impulses until the right moment.' }
    ],
    classroomApplication: 'Great 3-minute warm-up for music rhythm and physical education focus.',
    faqs: [
      { question: 'Is it too hard for young kids?', answer: 'Practice mode with checkpoints allows children to learn without restarting from 0.' }
    ],
    color: 'from-amber-400 to-rose-600',
    badge: 'High Energy',
    estimatedPlayTime: '2 - 4 min',
    playerCount: 'Single Player'
  },

  // 7. Whack-A-Mole Reflex
  {
    id: 'whack-a-mole',
    slug: 'whack-a-mole',
    title: 'Whack-A-Mole Garden',
    titleHi: 'तेज़ निगाहें (मोल को थपकी)',
    category: 'action-reflex',
    categoryLabel: 'Action & Reflex',
    icon: '🎯',
    age: 'Age 4+',
    grades: 'Grades PreK-6',
    shortDesc: 'Tap mischievous garden moles popping out of holes before they burrow back down!',
    shortDescHi: 'बगीचे में बिलों से बाहर आने वाले नटखट मोल को तुरंत टैप करके पॉइंट बनाएं!',
    overview: 'Whack-A-Mole Garden is a joyful, cartoon-style reflex game. Mischievous moles pop up from green lawn mounds wearing cute hats. Children test their visual alertness and reaction speed in a friendly 60-second celebration of speed.',
    howToPlay: [
      'Watch all 9 garden holes carefully.',
      'Tap or click a mole as soon as its head pops above the grass.',
      'Hit golden helmet moles for double bonus points.',
      'Score as many points as possible before the 60-second timer reaches zero!'
    ],
    controlsDesktop: 'Click popping moles with mouse cursor.',
    controlsMobile: 'Tap moles directly with finger.',
    scoringGuide: '10 points per regular mole; 25 points per golden mole.',
    proStrategies: [
      'Keep your eyes in the center of the 3x3 grid to detect peripheral movement fast.',
      'Do not tap blindly: waiting for full head visibility avoids misses.'
    ],
    cognitiveSkills: [
      { skill: 'Peripheral Visual Attention', explanation: 'Detecting unexpected movement across a wide visual field.' },
      { skill: 'Reaction Latency', explanation: 'Minimizing elapsed time between visual detection and motor tap.' }
    ],
    classroomApplication: 'Helps young students develop hand-eye coordination and mouse control fluency.',
    faqs: [
      { question: 'Are there bombs or negative points?', answer: 'No, purely encouraging and positive for young children.' }
    ],
    color: 'from-purple-500 to-pink-600',
    badge: 'Fun Reflex',
    estimatedPlayTime: '1 - 2 min',
    playerCount: 'Single Player'
  },

  // 8. Brick Breaker Arcade
  {
    id: 'brick-breaker',
    slug: 'brick-breaker',
    title: 'Brick Breaker Arcade',
    titleHi: 'ईंट तोड़ो (बॉल और पैडल)',
    category: 'arcade-retro',
    categoryLabel: 'Arcade & Retro',
    icon: '🧱',
    age: 'Age 6+',
    grades: 'Grades 1-10',
    shortDesc: 'Bounce the energetic ball off your sliding paddle to demolish colorful brick walls!',
    shortDescHi: 'पैडल से गेंद को उछालें और रंग-बिरंगी ईंटों को तोड़कर लेवल पार करें!',
    overview: 'Brick Breaker Arcade challenges children to control ball rebounds, angle trajectories, and paddle positioning. As colorful bricks shatter with delightful chimes, power-ups fall down granting laser blasts, multi-balls, and extended paddles.',
    howToPlay: [
      'Move your paddle left and right across the bottom of the screen.',
      'Bounce the energy ball up to shatter bricks overhead.',
      'Catch falling power-ups like Multi-Ball, Wide Paddle, and Sticky Catch.',
      'Clear all bricks to advance to the next exciting stage!'
    ],
    controlsDesktop: 'Mouse move or Left/Right Arrow keys.',
    controlsMobile: 'Drag finger horizontally along bottom bar.',
    scoringGuide: '20 points per regular brick; 50 points per reinforced brick.',
    proStrategies: [
      'Hitting the ball with the outer edge of your paddle creates steep angles.',
      'Drill a tunnel up the side of the wall to trap the ball on top for rapid bounces.'
    ],
    cognitiveSkills: [
      { skill: 'Angle Reflection Estimation', explanation: 'Predicting incidence and reflection angles intuitively.' },
      { skill: 'Continuous Tracking', explanation: 'Maintaining smooth ocular pursuit of fast-moving targets.' }
    ],
    classroomApplication: 'Reinforces physics concepts: kinetic velocity, angles of incidence, and elasticity.',
    faqs: [
      { question: 'What happens if the ball falls?', answer: 'You have 3 lives per round to keep the action going!' }
    ],
    color: 'from-cyan-500 to-blue-600',
    badge: 'Arcade Hit',
    estimatedPlayTime: '3 - 5 min',
    playerCount: 'Single Player'
  },

  // 9. Tic-Tac-Toe Strategy
  {
    id: 'tic-tac-toe',
    slug: 'tic-tac-toe',
    title: 'Tic-Tac-Toe Strategy',
    titleHi: 'जीरो-काटा (रणनीति मास्टर)',
    category: 'brain-puzzles',
    categoryLabel: 'Brain & Logic',
    icon: '⭕',
    age: 'Age 4+',
    grades: 'Grades PreK-8',
    shortDesc: 'The classic X and O strategy game! Play against smart robot AI or a friend side-by-side.',
    shortDescHi: 'क्लासिक X और O का खेल! रोबोट कंप्यूटर या अपने दोस्त के साथ खेलें और 3 की लाइन बनाएं!',
    overview: 'Tic-Tac-Toe Strategy teaches fundamental game theory, defensive blocking, and offensive forks. Children can challenge friendly robot AI across Easy, Medium, and Master difficulty tiers, or pass the device to play with a parent or classmate.',
    howToPlay: [
      'Choose X or O piece.',
      'Take turns placing your piece on an open square on the 3x3 grid.',
      'Align 3 of your symbols in a horizontal, vertical, or diagonal line to win!',
      'Block your opponent whenever they get 2 in a row!'
    ],
    controlsDesktop: 'Click any open square.',
    controlsMobile: 'Tap any open square.',
    scoringGuide: 'Win = 100 points, Draw = 50 points.',
    proStrategies: [
      'Claiming the center square gives you 4 possible winning paths.',
      'Corner openings allow you to create unstoppable two-way fork traps.'
    ],
    cognitiveSkills: [
      { skill: 'Strategic Forward Planning', explanation: 'Thinking one or two turns ahead of your opponent.' },
      { skill: 'Threat Detection', explanation: 'Recognizing opponent winning lines and executing defensive blocks.' }
    ],
    classroomApplication: 'Introduces early logic matrices, game theory, and turn-based decision making.',
    faqs: [
      { question: 'Can two kids play on the same phone or tablet?', answer: 'Yes! Select 2-Player mode to play side-by-side with a friend.' }
    ],
    color: 'from-pink-500 to-rose-600',
    badge: '2-Player Ready',
    estimatedPlayTime: '1 - 2 min',
    playerCount: '1 or 2 Players'
  },

  // 10. Fruit Slice Ninja
  {
    id: 'fruit-slice',
    slug: 'fruit-slice',
    title: 'Fruit Slice Ninja',
    titleHi: 'रसीले फल काटो (फ्रूट निंजा)',
    category: 'action-reflex',
    categoryLabel: 'Action & Reflex',
    icon: '🍉',
    age: 'Age 4+',
    grades: 'Grades PreK-12',
    shortDesc: 'Slice juicy watermelons, apples, and oranges flying across the screen. Avoid bombs!',
    shortDescHi: 'उड़ते हुए मीठे तरबूज, सेब और संतरे को स्वाइप करके काटें और बम से बचें!',
    overview: 'Fruit Slice Ninja is pure, delicious tactile fun! Watermelons, pineapples, oranges, and strawberries are tossed into the air. Children slice through them with colorful swipe trails, achieving multi-fruit combos while carefully steering clear of explosive bombs.',
    howToPlay: [
      'Swipe your finger or mouse across flying fruits to slice them in half.',
      'Slice 3 or more fruits in a single swipe for Combo Bonanza bonus points!',
      'Watch out for ticking black bombs — slicing a bomb ends the game!',
      'Do not let 3 fruits drop unsliced without scoring.'
    ],
    controlsDesktop: 'Click and drag mouse across fruits to create a slicing blade.',
    controlsMobile: 'Swipe finger across flying fruits on touch display.',
    scoringGuide: '1 point per fruit; 3x to 5x multipliers for multi-slice combos.',
    proStrategies: [
      'Wait for fruits to reach the apex of their parabolic arc before slicing.',
      'Slice in long diagonal strokes to catch multiple fruits in a single blade stroke.'
    ],
    cognitiveSkills: [
      { skill: 'Trajectory Anticipation', explanation: 'Predicting parabolic gravitational arcs in real time.' },
      { skill: 'Selective Attention', explanation: 'Prioritizing juicy fruit targets while actively avoiding bombs.' }
    ],
    classroomApplication: 'Delivers a fun, active sensory break that sharpens precision motor tracking and quick decision making.',
    faqs: [
      { question: 'Is it completely safe for small kids?', answer: 'Yes, 100% cartoon fruit splatter with zero violence.' }
    ],
    color: 'from-rose-500 to-red-600',
    badge: 'Super Fun',
    estimatedPlayTime: '2 - 3 min',
    playerCount: 'Single Player'
  }
];
