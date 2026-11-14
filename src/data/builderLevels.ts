export interface LevelObjective {
  id: string;
  label: string;
  targetCount: number;
  blockCategory?: string; // e.g. 'wall', 'door', 'window', 'roof', 'nature', 'prop', 'any'
  blockIds?: string[];
  minHeight?: number;
  checkType: 'count' | 'height' | 'span_bridge' | 'total_blocks';
}

export interface StarterBlock {
  x: number;
  y: number;
  blockId: string;
  locked?: boolean;
}

export interface BuilderLevel {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  theme: 'day' | 'sunset' | 'night' | 'nature' | 'space';
  groundType: 'grass' | 'water_meadow' | 'cobblestone' | 'sand_ocean' | 'space_lunar';
  unlockedBlockIds: string[];
  objectives: LevelObjective[];
  story: string;
  architectureLesson: string;
  proTip: string;
  starterBlocks?: StarterBlock[];
  rewardBadge: string;
}

export interface BlockItem {
  id: string;
  name: string;
  category: 'structural' | 'roofs' | 'openings' | 'nature' | 'props' | 'characters';
  categoryLabel: string;
  icon: string;
  color: string;
  height: number; // in grid cells (1 or 2)
  width: number; // in grid cells (1 or 2)
  drawType: string;
}

export const BLOCKS_CATALOG: BlockItem[] = [
  // 1. Structural
  { id: 'wall_brick_red', name: 'Red Brick', category: 'structural', categoryLabel: 'Walls & Blocks', icon: '🧱', color: '#e11d48', width: 1, height: 1, drawType: 'brick_red' },
  { id: 'wall_brick_blue', name: 'Blue Stone', category: 'structural', categoryLabel: 'Walls & Blocks', icon: '🔷', color: '#0284c7', width: 1, height: 1, drawType: 'brick_blue' },
  { id: 'wall_wood_plank', name: 'Wood Plank', category: 'structural', categoryLabel: 'Walls & Blocks', icon: '🪵', color: '#b45309', width: 1, height: 1, drawType: 'wood_plank' },
  { id: 'wall_stone_castle', name: 'Castle Stone', category: 'structural', categoryLabel: 'Walls & Blocks', icon: '🏰', color: '#64748b', width: 1, height: 1, drawType: 'castle_stone' },
  { id: 'pillar_marble', name: 'Marble Pillar', category: 'structural', categoryLabel: 'Walls & Blocks', icon: '🏛️', color: '#f1f5f9', width: 1, height: 2, drawType: 'pillar' },
  { id: 'arch_stone', name: 'Stone Arch', category: 'structural', categoryLabel: 'Walls & Blocks', icon: '⛩️', color: '#94a3b8', width: 2, height: 1, drawType: 'arch' },
  { id: 'girder_metal', name: 'Steel Girder', category: 'structural', categoryLabel: 'Walls & Blocks', icon: '🔩', color: '#475569', width: 2, height: 1, drawType: 'girder' },

  // 2. Roofs & Tops
  { id: 'roof_gable_red', name: 'Red Gable Roof', category: 'roofs', categoryLabel: 'Roofs & Tops', icon: '🔺', color: '#dc2626', width: 2, height: 1, drawType: 'roof_red' },
  { id: 'roof_gable_blue', name: 'Blue Shingle', category: 'roofs', categoryLabel: 'Roofs & Tops', icon: '🔹', color: '#2563eb', width: 2, height: 1, drawType: 'roof_blue' },
  { id: 'roof_battlement', name: 'Castle Battlement', category: 'roofs', categoryLabel: 'Roofs & Tops', icon: '🛡️', color: '#475569', width: 1, height: 1, drawType: 'battlement' },
  { id: 'roof_dome_gold', name: 'Golden Dome', category: 'roofs', categoryLabel: 'Roofs & Tops', icon: '🟡', color: '#eab308', width: 2, height: 1, drawType: 'dome_gold' },
  { id: 'roof_chimney', name: 'Brick Chimney', category: 'roofs', categoryLabel: 'Roofs & Tops', icon: '🏭', color: '#991b1b', width: 1, height: 1, drawType: 'chimney' },

  // 3. Openings (Doors & Windows)
  { id: 'door_wood', name: 'Wood Door', category: 'openings', categoryLabel: 'Doors & Windows', icon: '🚪', color: '#78350f', width: 1, height: 1, drawType: 'door_wood' },
  { id: 'door_castle_gate', name: 'Castle Gate', category: 'openings', categoryLabel: 'Doors & Windows', icon: '🗝️', color: '#334155', width: 2, height: 2, drawType: 'castle_gate' },
  { id: 'window_square', name: 'Square Window', category: 'openings', categoryLabel: 'Doors & Windows', icon: '🪟', color: '#38bdf8', width: 1, height: 1, drawType: 'window_square' },
  { id: 'window_arched', name: 'Arched Window', category: 'openings', categoryLabel: 'Doors & Windows', icon: '✨', color: '#818cf8', width: 1, height: 1, drawType: 'window_arched' },
  { id: 'window_balcony', name: 'Flower Balcony', category: 'openings', categoryLabel: 'Doors & Windows', icon: '💐', color: '#f43f5e', width: 1, height: 1, drawType: 'balcony' },

  // 4. Nature & Flora
  { id: 'deco_tree_pine', name: 'Pine Tree', category: 'nature', categoryLabel: 'Nature & Garden', icon: '🌲', color: '#15803d', width: 1, height: 2, drawType: 'tree_pine' },
  { id: 'deco_tree_oak', name: 'Leafy Oak Tree', category: 'nature', categoryLabel: 'Nature & Garden', icon: '🌳', color: '#16a34a', width: 2, height: 2, drawType: 'tree_oak' },
  { id: 'deco_flower_bush', name: 'Flower Bush', category: 'nature', categoryLabel: 'Nature & Garden', icon: '🌸', color: '#ec4899', width: 1, height: 1, drawType: 'flowers' },
  { id: 'deco_water_pond', name: 'Water Pond', category: 'nature', categoryLabel: 'Nature & Garden', icon: '💧', color: '#06b6d4', width: 2, height: 1, drawType: 'water_pond' },
  { id: 'deco_fence_wood', name: 'Picket Fence', category: 'nature', categoryLabel: 'Nature & Garden', icon: '🪵', color: '#ca8a04', width: 1, height: 1, drawType: 'fence' },

  // 5. Props & Mechanics
  { id: 'deco_streetlamp', name: 'Warm Lantern', category: 'props', categoryLabel: 'Props & Wonders', icon: '🏮', color: '#f59e0b', width: 1, height: 2, drawType: 'streetlamp' },
  { id: 'prop_flag_red', name: 'Royal Banner', category: 'props', categoryLabel: 'Props & Wonders', icon: '🚩', color: '#ef4444', width: 1, height: 1, drawType: 'flag_red' },
  { id: 'prop_windmill', name: 'Windmill Blade', category: 'props', categoryLabel: 'Props & Wonders', icon: '💨', color: '#3b82f6', width: 2, height: 2, drawType: 'windmill' },
  { id: 'prop_solar_panel', name: 'Solar Cell', category: 'props', categoryLabel: 'Props & Wonders', icon: '⚡', color: '#0284c7', width: 2, height: 1, drawType: 'solar_panel' },
  { id: 'prop_rocket_thruster', name: 'Rocket Gantry', category: 'props', categoryLabel: 'Props & Wonders', icon: '🚀', color: '#f97316', width: 1, height: 2, drawType: 'rocket_thruster' },
  { id: 'prop_radar_dish', name: 'Radar Dish', category: 'props', categoryLabel: 'Props & Wonders', icon: '📡', color: '#94a3b8', width: 1, height: 1, drawType: 'radar_dish' },

  // 6. Cute Inhabitants
  { id: 'char_kid_builder', name: 'Little Builder', category: 'characters', categoryLabel: 'Inhabitants', icon: '👷', color: '#facc15', width: 1, height: 1, drawType: 'kid_builder' },
  { id: 'char_cat_pet', name: 'Tabby Kitten', category: 'characters', categoryLabel: 'Inhabitants', icon: '🐱', color: '#fb923c', width: 1, height: 1, drawType: 'cat' },
  { id: 'char_dog_pet', name: 'Happy Puppy', category: 'characters', categoryLabel: 'Inhabitants', icon: '🐶', color: '#fcd34d', width: 1, height: 1, drawType: 'dog' },
  { id: 'char_duck', name: 'Garden Duck', category: 'characters', categoryLabel: 'Inhabitants', icon: '🦆', color: '#a3e635', width: 1, height: 1, drawType: 'duck' },
];

export const BUILDER_LEVELS: BuilderLevel[] = [
  {
    id: 1,
    slug: 'cozy-cottage',
    title: 'Level 1: The Cozy Cottage',
    subtitle: 'Learn the fundamentals of structural architecture & shelter building',
    theme: 'day',
    groundType: 'grass',
    unlockedBlockIds: ['wall_brick_red', 'door_wood', 'window_square', 'roof_gable_red', 'deco_flower_bush'],
    objectives: [
      { id: 'walls', label: 'Place at least 4 Brick Walls', targetCount: 4, blockIds: ['wall_brick_red'], checkType: 'count' },
      { id: 'door', label: 'Install 1 Wooden Front Door', targetCount: 1, blockIds: ['door_wood'], checkType: 'count' },
      { id: 'window', label: 'Add 1 Square Window', targetCount: 1, blockIds: ['window_square'], checkType: 'count' },
      { id: 'roof', label: 'Crown with 1 Red Gable Roof', targetCount: 1, blockIds: ['roof_gable_red'], checkType: 'count' },
    ],
    story: 'Welcome, young architect! A friendly kitten needs a warm home before sunset. Lay sturdy foundation walls, hang a front door, and top it with a weatherproof roof!',
    architectureLesson: 'Every building requires strong perimeter load-bearing walls before supporting an elevated roof structure.',
    proTip: 'Place your walls next to each other on the grassy ground, then put the roof right on top!',
    rewardBadge: 'Cottage Craftsman 🏡',
  },
  {
    id: 2,
    slug: 'garden-sanctuary',
    title: 'Level 2: The Garden Home',
    subtitle: 'Integrate landscape architecture with expanding residential spaces',
    theme: 'day',
    groundType: 'grass',
    unlockedBlockIds: ['wall_brick_red', 'wall_wood_plank', 'door_wood', 'window_square', 'roof_gable_red', 'deco_tree_oak', 'deco_flower_bush', 'deco_fence_wood'],
    objectives: [
      { id: 'walls', label: 'Build 6+ Walls (Brick or Wood)', targetCount: 6, blockIds: ['wall_brick_red', 'wall_wood_plank'], checkType: 'count' },
      { id: 'openings', label: 'Place 1 Door & 2 Windows', targetCount: 3, blockIds: ['door_wood', 'window_square'], checkType: 'count' },
      { id: 'roof', label: 'Install at least 1 Roof', targetCount: 1, blockIds: ['roof_gable_red'], checkType: 'count' },
      { id: 'flora', label: 'Plant 2+ Trees or Flower Bushes', targetCount: 2, blockIds: ['deco_tree_oak', 'deco_flower_bush'], checkType: 'count' },
    ],
    story: 'The town is growing! Construct an expanded family house surrounded by shade trees, flowering shrubs, and perimeter wooden fencing.',
    architectureLesson: 'Biophilic design connects indoor human environments with natural green foliage to lower stress and encourage biodiversity.',
    proTip: 'Wood planks combine beautifully with brick foundations for a rustic country style.',
    rewardBadge: 'Botanical Builder 🌳',
  },
  {
    id: 3,
    slug: 'sunset-watchtower',
    title: 'Level 3: The Lookout Watchtower',
    subtitle: 'Master vertical stacking physics and structural elevation',
    theme: 'sunset',
    groundType: 'cobblestone',
    unlockedBlockIds: ['wall_stone_castle', 'pillar_marble', 'window_arched', 'roof_battlement', 'prop_flag_red', 'deco_streetlamp'],
    objectives: [
      { id: 'height', label: 'Stack a Tower at least 4 Blocks High', targetCount: 4, checkType: 'height' },
      { id: 'window', label: 'Place 1+ High Arched Windows', targetCount: 1, blockIds: ['window_arched'], checkType: 'count' },
      { id: 'top', label: 'Crest with a Battlement or Roof', targetCount: 1, blockIds: ['roof_battlement'], checkType: 'count' },
      { id: 'flag', label: 'Hoist 1 Royal Banner Flag', targetCount: 1, blockIds: ['prop_flag_red'], checkType: 'count' },
    ],
    story: 'At sunset, town scouts need an elevated vantage point to spot ships across the bay. Stack durable castle stone blocks vertically and hoist our banner flag high into the evening breeze!',
    architectureLesson: 'Vertical structures must align their center of mass over their foundation base to prevent tilt and collapse.',
    proTip: 'Place stone blocks directly above one another, then finish with battlements and a waving flag at the peak.',
    rewardBadge: 'Tower Sentinel 🏰',
  },
  {
    id: 4,
    slug: 'river-crossing-bridge',
    title: 'Level 4: The River Bridge',
    subtitle: 'Engineering span structures and horizontal load distributions',
    theme: 'day',
    groundType: 'water_meadow',
    unlockedBlockIds: ['wall_stone_castle', 'arch_stone', 'girder_metal', 'deco_streetlamp', 'deco_water_pond', 'char_duck'],
    objectives: [
      { id: 'span', label: 'Construct a 6+ Block Span Across Water', targetCount: 6, blockIds: ['wall_stone_castle', 'arch_stone', 'girder_metal'], checkType: 'count' },
      { id: 'arches', label: 'Incorporate 1+ Stone Arches or Girders', targetCount: 1, blockIds: ['arch_stone', 'girder_metal'], checkType: 'count' },
      { id: 'lighting', label: 'Install 2 Warm Lanterns for Night Travel', targetCount: 2, blockIds: ['deco_streetlamp'], checkType: 'count' },
    ],
    story: 'A wide river cuts the village in two! Position stone piers, span across with archways, and install illuminated lantern posts so travelers can cross day or night.',
    architectureLesson: 'The Roman arch distributes compressive downward forces outwards to lateral abutments, allowing bridges to span wide waterways without middle sagging.',
    proTip: 'Build stone pillars on both shores and place arch pieces across the center water gap!',
    rewardBadge: 'Bridge Engineer 🌉',
  },
  {
    id: 5,
    slug: 'windmill-country-farm',
    title: 'Level 5: The Windmill Farm',
    subtitle: 'Harness kinetic energy through mechanical agrarian design',
    theme: 'day',
    groundType: 'grass',
    unlockedBlockIds: ['wall_brick_red', 'wall_wood_plank', 'door_wood', 'prop_windmill', 'roof_chimney', 'deco_fence_wood', 'deco_tree_pine'],
    objectives: [
      { id: 'tower', label: 'Erect a Mill Tower (3+ Blocks High)', targetCount: 3, checkType: 'height' },
      { id: 'mill', label: 'Mount 1 Rotating Windmill Prop', targetCount: 1, blockIds: ['prop_windmill'], checkType: 'count' },
      { id: 'fence', label: 'Build 2+ Farm Picket Fences', targetCount: 2, blockIds: ['deco_fence_wood'], checkType: 'count' },
    ],
    story: 'Gentle prairie winds sweep across the valley. Construct a tall grain mill, mount aerodynamic sails, and fence off the pasture for grazing animals.',
    architectureLesson: 'Windmills convert kinetic wind pressure into rotational mechanical power through gear shafts to grind grain and pump irrigation water.',
    proTip: 'Make the mill tower 3 blocks tall before mounting the windmill sail prop.',
    rewardBadge: 'Wind Harnesser 💨',
  },
  {
    id: 6,
    slug: 'two-story-townhouse',
    title: 'Level 6: Double-Decker Townhouse',
    subtitle: 'Multi-story zoning, floor slabs, and ventilation design',
    theme: 'day',
    groundType: 'cobblestone',
    unlockedBlockIds: ['wall_brick_blue', 'wall_wood_plank', 'door_wood', 'window_square', 'window_balcony', 'roof_gable_blue', 'roof_chimney'],
    objectives: [
      { id: 'total_walls', label: 'Place 8+ Wall Blocks for 2 Stories', targetCount: 8, blockIds: ['wall_brick_blue', 'wall_wood_plank'], checkType: 'count' },
      { id: 'windows', label: 'Add 3+ Windows (including Balcony)', targetCount: 3, blockIds: ['window_square', 'window_balcony'], checkType: 'count' },
      { id: 'chimney', label: 'Install 1 Smoking Brick Chimney', targetCount: 1, blockIds: ['roof_chimney'], checkType: 'count' },
      { id: 'roof', label: 'Top with a Blue Shingle Roof', targetCount: 1, blockIds: ['roof_gable_blue'], checkType: 'count' },
    ],
    story: 'Urban life calls for space-efficient living! Create a stylish two-story townhouse with flower balconies, glowing blue shingles, and a cozy smoking fireplace chimney.',
    architectureLesson: 'Multi-story buildings multiply usable interior square footage within a compact municipal footprint while concentrating heating infrastructure.',
    proTip: 'Stack two rows of walls, place a balcony window on the upper floor, and pop the chimney right on the roof edge!',
    rewardBadge: 'Urban Architect 🏙️',
  },
  {
    id: 7,
    slug: 'royal-kingdom-citadel',
    title: 'Level 7: The Royal Kingdom Castle',
    subtitle: 'Defensive masonry, symmetry, and imperial monumentalism',
    theme: 'sunset',
    groundType: 'cobblestone',
    unlockedBlockIds: ['wall_stone_castle', 'door_castle_gate', 'pillar_marble', 'roof_battlement', 'roof_dome_gold', 'prop_flag_red', 'deco_streetlamp'],
    objectives: [
      { id: 'castle_walls', label: 'Assemble 10+ Castle Stone Blocks', targetCount: 10, blockIds: ['wall_stone_castle'], checkType: 'count' },
      { id: 'gate', label: 'Install 1 Grand Castle Gate', targetCount: 1, blockIds: ['door_castle_gate'], checkType: 'count' },
      { id: 'battlements', label: 'Place 2+ Castle Battlements', targetCount: 2, blockIds: ['roof_battlement'], checkType: 'count' },
      { id: 'flags', label: 'Fly 2+ Royal Banners', targetCount: 2, blockIds: ['prop_flag_red'], checkType: 'count' },
    ],
    story: 'Hear ye, hear ye! The realm requests an impenetrable castle fortress. Flank the grand iron gate with fortified towers, crenelated battlements, and golden dome accents!',
    architectureLesson: 'Medieval battlements provided alternating teeth (merlons) and defensive slits (crenels) to shield defenders while allowing return archery fire.',
    proTip: 'Build twin stone towers on left and right, with the big castle gate centered between them.',
    rewardBadge: 'Castle Sovereign 👑',
  },
  {
    id: 8,
    slug: 'happy-city-park',
    title: 'Level 8: Happy Playground Park',
    subtitle: 'Recreational civic infrastructure and accessible public spaces',
    theme: 'day',
    groundType: 'grass',
    unlockedBlockIds: ['arch_stone', 'pillar_marble', 'deco_tree_oak', 'deco_tree_pine', 'deco_flower_bush', 'deco_water_pond', 'char_kid_builder', 'char_dog_pet'],
    objectives: [
      { id: 'nature', label: 'Plant 4+ Trees and Flower Bushes', targetCount: 4, blockIds: ['deco_tree_oak', 'deco_tree_pine', 'deco_flower_bush'], checkType: 'count' },
      { id: 'water', label: 'Excavate 1 Shimmering Pond', targetCount: 1, blockIds: ['deco_water_pond'], checkType: 'count' },
      { id: 'monument', label: 'Erect a Park Pavilion (Pillars or Arch)', targetCount: 2, blockIds: ['pillar_marble', 'arch_stone'], checkType: 'count' },
      { id: 'citizens', label: 'Invite 1 Little Builder & 1 Puppy', targetCount: 2, blockIds: ['char_kid_builder', 'char_dog_pet'], checkType: 'count' },
    ],
    story: 'Every vibrant city needs a green heart where children play, dogs frolic, and trees clean the air. Design a welcoming public park with a gazebo, duck pond, and shade trees!',
    architectureLesson: 'Urban public parks lower city heat island effects, improve physical health, and foster social equity across generations.',
    proTip: 'Place trees near the edges, create a central pond, and add the puppy right beside the path!',
    rewardBadge: 'Civic Planner 🌳',
  },
  {
    id: 9,
    slug: 'starry-night-lighthouse',
    title: 'Level 9: The Coastline Lighthouse',
    subtitle: 'Coastal navigation beacons and high-contrast night visibility',
    theme: 'night',
    groundType: 'sand_ocean',
    unlockedBlockIds: ['wall_brick_red', 'pillar_marble', 'window_arched', 'deco_streetlamp', 'roof_dome_gold', 'prop_flag_red'],
    objectives: [
      { id: 'lighthouse_height', label: 'Reach 5+ Blocks in Vertical Height', targetCount: 5, checkType: 'height' },
      { id: 'lamp', label: 'Mount 1 Beacon Lantern on the Peak', targetCount: 1, blockIds: ['deco_streetlamp'], checkType: 'count' },
      { id: 'dome', label: 'Cap with a Golden or Arched Cupola', targetCount: 1, blockIds: ['roof_dome_gold', 'window_arched'], checkType: 'count' },
    ],
    story: 'Thick fog envelopes the sea under a starry night! Stack alternating red and white masonry to build a towering marine lighthouse that cuts through darkness with warm golden light.',
    architectureLesson: 'Lighthouses utilize high tower elevation so their beam travels beyond the curvature of the Earth, warning mariners of treacherous reefs up to 20 nautical miles away.',
    proTip: 'Alternate between red brick and white marble blocks to get that classic striped lighthouse look!',
    rewardBadge: 'Harbor Beacon 🏮',
  },
  {
    id: 10,
    slug: 'rocket-launch-gantry',
    title: 'Level 10: Space Rocket Launchpad',
    subtitle: 'Aerospace engineering, launch towers, and telemetry systems',
    theme: 'space',
    groundType: 'space_lunar',
    unlockedBlockIds: ['girder_metal', 'pillar_marble', 'prop_rocket_thruster', 'prop_radar_dish', 'prop_solar_panel', 'char_kid_builder'],
    objectives: [
      { id: 'gantry', label: 'Build a 4+ High Steel Gantry Tower', targetCount: 4, blockIds: ['girder_metal', 'pillar_marble'], checkType: 'count' },
      { id: 'rocket', label: 'Assemble 1 Rocket Launch Booster', targetCount: 1, blockIds: ['prop_rocket_thruster'], checkType: 'count' },
      { id: 'radar', label: 'Equip 1 Deep Space Radar Dish', targetCount: 1, blockIds: ['prop_radar_dish'], checkType: 'count' },
    ],
    story: 'Destination: Mars! Engineers require a launch tower gantry to fuel our KiddoZap exploration rocket. Assemble high-tensile steel girders and link satellite communication dishes!',
    architectureLesson: 'Launch Umbilical Towers stabilize multi-stage rockets against crosswinds while delivering cryo-fuel, telemetry data, and astronaut access ramps.',
    proTip: 'Construct the steel girder tower on the left and position the rocket booster next to it ready for countdown!',
    rewardBadge: 'Cosmic Pioneer 🚀',
  },
  {
    id: 11,
    slug: 'eco-solar-villa',
    title: 'Level 11: Eco Green Solar Villa',
    subtitle: 'Renewable energy integration and sustainable architecture',
    theme: 'day',
    groundType: 'grass',
    unlockedBlockIds: ['wall_brick_blue', 'wall_wood_plank', 'door_wood', 'window_square', 'prop_solar_panel', 'deco_tree_pine', 'deco_flower_bush'],
    objectives: [
      { id: 'villa_walls', label: 'Build 8+ Walls of Clean Materials', targetCount: 8, blockIds: ['wall_brick_blue', 'wall_wood_plank'], checkType: 'count' },
      { id: 'solar', label: 'Install 2+ Rooftop Solar Panels', targetCount: 2, blockIds: ['prop_solar_panel'], checkType: 'count' },
      { id: 'gardens', label: 'Integrate 2+ Natural Trees/Plants', targetCount: 2, blockIds: ['deco_tree_pine', 'deco_flower_bush'], checkType: 'count' },
    ],
    story: 'The future of building is clean and green! Design a solar-powered modern villa that collects clean sunlight, harvests rain, and lives in harmony with surrounding pine groves.',
    architectureLesson: 'Net-zero energy buildings produce as much renewable energy on-site via photovoltaic solar cells as they consume over the annual calendar.',
    proTip: 'Angle your roof blocks towards the sun and top them with high-efficiency solar cells!',
    rewardBadge: 'Solar Pioneer ☀️',
  },
  {
    id: 12,
    slug: 'grand-wonder-citadel',
    title: 'Level 12: The Grand Wonder Citadel',
    subtitle: 'The ultimate synthesis: multi-tier architectural masterpiece',
    theme: 'sunset',
    groundType: 'cobblestone',
    unlockedBlockIds: BLOCKS_CATALOG.map(b => b.id),
    objectives: [
      { id: 'massive_count', label: 'Place at least 25 Total Blocks', targetCount: 25, checkType: 'total_blocks' },
      { id: 'master_height', label: 'Reach an Elevation of 5+ Blocks High', targetCount: 5, checkType: 'height' },
      { id: 'inhabitants', label: 'Populate with 2+ Inhabitants (Kids/Pets)', targetCount: 2, blockIds: ['char_kid_builder', 'char_cat_pet', 'char_dog_pet', 'char_duck'], checkType: 'count' },
    ],
    story: 'This is your graduation challenge, Master Architect! You have full access to the entire KiddoZap construction catalog. Build a breathtaking citadel incorporating towers, gardens, bridges, and bustling town life!',
    architectureLesson: 'Great architectural wonders endure across centuries because they balance function, structural durability, and emotional beauty in equal measure.',
    proTip: 'Unleash your full creativity! Blend classical stone with modern glass, waterfalls, and lively pet companions.',
    rewardBadge: 'Master Architect 🏆',
  },
];
