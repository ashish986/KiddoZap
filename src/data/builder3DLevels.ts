export interface Level3DGoal {
  id: string;
  label: string;
  labelHi: string;
  targetCount: number;
  category?: 'houses' | 'nature' | 'roads' | 'animals' | 'props';
  itemTypes?: string[];
  checkType: 'count' | 'total';
}

export interface Builder3DLevel {
  id: number;
  title: string;
  titleHi: string;
  subtitle: string;
  theme: 'day' | 'sunset' | 'night';
  gridSize: number; // e.g. 10x10 or 12x12
  goals: Level3DGoal[];
  story: string;
  storyHi: string;
  unlockedCategories: Array<'houses' | 'nature' | 'roads' | 'animals' | 'props'>;
  unlockedItemIds: string[];
  badge: string;
}

export interface Builder3DItem {
  id: string;
  name: string;
  nameHi: string;
  category: 'houses' | 'nature' | 'roads' | 'animals' | 'props';
  icon: string;
  color: string;
  desc: string;
}

export const BUILDER_3D_ITEMS: Builder3DItem[] = [
  // 1. Houses ("अपने सपनों का घर बनाएं!")
  {
    id: 'house_cottage',
    name: 'Red Cottage',
    nameHi: 'लाल छत वाला घर',
    category: 'houses',
    icon: '🏡',
    color: '#e11d48',
    desc: 'Cozy brick house with bright red pitched roof and window.',
  },
  {
    id: 'house_villa',
    name: 'Blue Villa',
    nameHi: 'सुंदर विला',
    category: 'houses',
    icon: '🏘️',
    color: '#0284c7',
    desc: 'Two-story residential townhouse with a sun balcony.',
  },
  {
    id: 'house_castle',
    name: 'Stone Castle',
    nameHi: 'शाही किला',
    category: 'houses',
    icon: '🏰',
    color: '#64748b',
    desc: 'Fortified stone castle tower with defensive battlements.',
  },
  {
    id: 'house_windmill',
    name: 'Dutch Windmill',
    nameHi: 'पवन चक्की (विंडमिल)',
    category: 'houses',
    icon: '💨',
    color: '#ca8a04',
    desc: 'Farmhouse tower with spinning aerodynamic windmill sails.',
  },
  {
    id: 'house_lighthouse',
    name: 'Lighthouse',
    nameHi: 'प्रकाश स्तम्भ',
    category: 'houses',
    icon: '🏮',
    color: '#ef4444',
    desc: 'Striped coastal lighthouse with rotating beacon light.',
  },

  // 2. Nature & Garden ("पेड़ लगाएं, बगीचा सजाएं!")
  {
    id: 'tree_oak',
    name: 'Oak Tree',
    nameHi: 'हरा भरा ओक का पेड़',
    category: 'nature',
    icon: '🌳',
    color: '#16a34a',
    desc: 'Lush leafy shade tree with rounded foliage.',
  },
  {
    id: 'tree_pine',
    name: 'Pine Tree',
    nameHi: 'देवदार का पेड़',
    category: 'nature',
    icon: '🌲',
    color: '#15803d',
    desc: 'Tall conical evergreen pine tree for mountain terrain.',
  },
  {
    id: 'garden_flowers',
    name: 'Flower Bed',
    nameHi: 'फूलों की क्यारी',
    category: 'nature',
    icon: '🌸',
    color: '#ec4899',
    desc: 'Vibrant flower garden with colorful blooming petals.',
  },
  {
    id: 'garden_fence',
    name: 'Wooden Fence',
    nameHi: 'लकड़ी की बाड़',
    category: 'nature',
    icon: '🪵',
    color: '#b45309',
    desc: 'Picket perimeter fencing to protect gardens and pastures.',
  },
  {
    id: 'water_pond',
    name: 'Water Pond',
    nameHi: 'नीला तालाब',
    category: 'nature',
    icon: '💧',
    color: '#06b6d4',
    desc: 'Clear blue reflecting pool where ducks swim.',
  },

  // 3. Roads & Vehicles ("सड़क बनाएं, गाड़ियां चलाएं!")
  {
    id: 'road_straight',
    name: 'Paved Road',
    nameHi: 'डामर की पक्की सड़क',
    category: 'roads',
    icon: '🛣️',
    color: '#334155',
    desc: 'Smooth asphalt road with yellow lane markings.',
  },
  {
    id: 'road_cross',
    name: '4-Way Junction',
    nameHi: 'चौराहा',
    category: 'roads',
    icon: '➕',
    color: '#1e293b',
    desc: 'Crossroad intersection connecting multiple neighborhoods.',
  },
  {
    id: 'bridge_stone',
    name: 'Stone Bridge',
    nameHi: 'पत्थर का पुल',
    category: 'roads',
    icon: '🌉',
    color: '#64748b',
    desc: 'Arched bridge crossing over rivers and valleys.',
  },
  {
    id: 'vehicle_car',
    name: 'Red Cruiser Car',
    nameHi: 'लाल कार',
    category: 'roads',
    icon: '🚗',
    color: '#dc2626',
    desc: 'Friendly red family car that drives on paved roads!',
  },
  {
    id: 'vehicle_truck',
    name: 'Builder Truck',
    nameHi: 'बिल्डर ट्रक',
    category: 'roads',
    icon: '🚚',
    color: '#f59e0b',
    desc: 'Yellow transport truck hauling construction supplies.',
  },

  // 4. Animals & Inhabitants ("जानवरों को अपने संसार में लाएं!")
  {
    id: 'animal_cow',
    name: 'Dairy Cow',
    nameHi: 'दूधिया गाय',
    category: 'animals',
    icon: '🐮',
    color: '#f8fafc',
    desc: 'Friendly black-and-white spotted dairy cow.',
  },
  {
    id: 'animal_sheep',
    name: 'Fluffy Sheep',
    nameHi: 'भेड़',
    category: 'animals',
    icon: '🐑',
    color: '#f1f5f9',
    desc: 'Soft fluffy wool sheep grazing in the pasture.',
  },
  {
    id: 'animal_chicken',
    name: 'Farm Chicken',
    nameHi: 'मुर्गी',
    category: 'animals',
    icon: '🐔',
    color: '#fef08a',
    desc: 'Clucking farm hen pecking for seeds.',
  },
  {
    id: 'animal_duck',
    name: 'Pond Duck',
    nameHi: 'बत्तख',
    category: 'animals',
    icon: '🦆',
    color: '#38bdf8',
    desc: 'Cute yellow-beaked duck swimming on water.',
  },
  {
    id: 'char_builder_kid',
    name: 'Little Builder Kid',
    nameHi: 'नन्हा बिल्डर',
    category: 'animals',
    icon: '👷',
    color: '#facc15',
    desc: 'Cheerful kid with yellow safety helmet exploring the town.',
  },

  // 5. Props & Decor
  {
    id: 'prop_streetlamp',
    name: 'Street Lantern',
    nameHi: 'स्ट्रीट लैंप',
    category: 'props',
    icon: '🏮',
    color: '#f59e0b',
    desc: 'Warm electric street lamp that casts amber light at night.',
  },
  {
    id: 'prop_fountain',
    name: 'Town Fountain',
    nameHi: 'फव्वारा',
    category: 'props',
    icon: '⛲',
    color: '#38bdf8',
    desc: 'Marble plaza fountain with sparkling water jets.',
  },
  {
    id: 'prop_windmill_tall',
    name: 'Wind Turbines',
    nameHi: 'पवन ऊर्जा टरबाइन',
    category: 'props',
    icon: '⚡',
    color: '#0284c7',
    desc: 'Eco-friendly clean wind power generator.',
  },
];

export const BUILDER_3D_LEVELS: Builder3DLevel[] = [
  {
    id: 1,
    title: 'Mission 1: The Sunny Village Starter',
    titleHi: 'मिशन 1: सपनों का पहला घर',
    subtitle: 'Learn to place 3D houses, roofs, and garden fencing',
    theme: 'day',
    gridSize: 8,
    unlockedCategories: ['houses', 'nature', 'roads', 'animals', 'props'],
    unlockedItemIds: BUILDER_3D_ITEMS.map(i => i.id),
    goals: [
      { id: 'houses', label: 'Build 2 Red Cottages', labelHi: '2 लाल छत वाले घर बनाएं', targetCount: 2, itemTypes: ['house_cottage'], checkType: 'count' },
      { id: 'trees', label: 'Plant 2 Oak Trees', labelHi: '2 हरे पेड़ लगाएं', targetCount: 2, itemTypes: ['tree_oak'], checkType: 'count' },
      { id: 'flowers', label: 'Add 1 Flower Bed', labelHi: '1 फूलों की क्यारी लगाएं', targetCount: 1, itemTypes: ['garden_flowers'], checkType: 'count' },
    ],
    story: 'Welcome to KiddoZap Little Builder 3D! Let us lay the foundation for a peaceful village. Place two cozy red-roof cottages and plant shade trees for the villagers.',
    storyHi: 'किडोज़ैप लिटिल बिल्डर 3D में आपका स्वागत है! चलिए एक सुंदर गांव की शुरुआत करें। 2 प्यारे घर बनाएं और उनके पास सुंदर पेड़ और फूल लगाएं!',
    badge: 'Village Founder 🏡',
  },
  {
    id: 2,
    title: 'Mission 2: Roads & The Little Cruiser',
    titleHi: 'मिशन 2: पक्की सड़क और लाल कार',
    subtitle: 'Lay asphalt roads and introduce rolling 3D vehicles',
    theme: 'day',
    gridSize: 8,
    unlockedCategories: ['houses', 'nature', 'roads', 'animals', 'props'],
    unlockedItemIds: BUILDER_3D_ITEMS.map(i => i.id),
    goals: [
      { id: 'roads', label: 'Lay 4 Paved Road Segments', labelHi: 'कम से कम 4 सड़क बनाएं', targetCount: 4, itemTypes: ['road_straight', 'road_cross'], checkType: 'count' },
      { id: 'car', label: 'Place 1 Red Car on the Road', labelHi: '1 लाल कार सड़क पर रखें', targetCount: 1, itemTypes: ['vehicle_car'], checkType: 'count' },
      { id: 'villa', label: 'Construct 1 Blue Villa', labelHi: '1 सुंदर विला बनाएं', targetCount: 1, itemTypes: ['house_villa'], checkType: 'count' },
    ],
    story: 'Cars need smooth roads to travel! Connect your buildings with paved roads and place a mini red cruiser to begin exploring.',
    storyHi: 'अब गाड़ियां चलाने का समय है! घरों को जोड़ने के लिए पक्की सड़क बनाएं और उस पर अपनी प्यारी लाल कार चलाएं!',
    badge: 'Road Master 🚗',
  },
  {
    id: 3,
    title: 'Mission 3: The Countryside Animal Farm',
    titleHi: 'मिशन 3: जानवरों का प्यारा फार्म',
    subtitle: 'Construct fenced pastures, windmill towers, and care for animals',
    theme: 'day',
    gridSize: 9,
    unlockedCategories: ['houses', 'nature', 'roads', 'animals', 'props'],
    unlockedItemIds: BUILDER_3D_ITEMS.map(i => i.id),
    goals: [
      { id: 'windmill', label: 'Build 1 Rotating Windmill', labelHi: '1 पवन चक्की बनाएं', targetCount: 1, itemTypes: ['house_windmill'], checkType: 'count' },
      { id: 'animals', label: 'Add 3 Farm Animals (Cows/Sheep)', labelHi: '3 प्यारे जानवर (गाय/भेड़) लाएं', targetCount: 3, itemTypes: ['animal_cow', 'animal_sheep'], checkType: 'count' },
      { id: 'pond', label: 'Dig 1 Pond for the Duck', labelHi: '1 पानी का तालाब बनाएं', targetCount: 1, itemTypes: ['water_pond'], checkType: 'count' },
    ],
    story: 'Moo and Baa! The countryside farm is ready for life. Build a spinning grain windmill and populate green pastures with happy cows, sheep, and swimming ducks.',
    storyHi: 'खेतों में खुशहाली लाने के लिए एक बड़ी पवन चक्की लगाएं और बाड़े में गाय, भेड़ और बत्तखों को लाएं!',
    badge: 'Farm Pioneer 🐮',
  },
  {
    id: 4,
    title: 'Mission 4: The River Bridge Crossing',
    titleHi: 'मिशन 4: नदी के ऊपर का पुल',
    subtitle: 'Span horizontal bridge arches over flowing river waters',
    theme: 'sunset',
    gridSize: 9,
    unlockedCategories: ['houses', 'nature', 'roads', 'animals', 'props'],
    unlockedItemIds: BUILDER_3D_ITEMS.map(i => i.id),
    goals: [
      { id: 'bridge', label: 'Place 2 Bridge or River Segments', labelHi: '2 पुल या नदी के ब्लॉक जोड़ें', targetCount: 2, itemTypes: ['bridge_stone', 'water_pond'], checkType: 'count' },
      { id: 'lamps', label: 'Install 2 Street Lamps for Night Lighting', labelHi: '2 स्ट्रीट लैंप लगाएं', targetCount: 2, itemTypes: ['prop_streetlamp'], checkType: 'count' },
      { id: 'vehicles', label: 'Deploy 2 Vehicles (Car/Truck)', labelHi: '2 गाड़ियां (कार/ट्रक) तैनात करें', targetCount: 2, itemTypes: ['vehicle_car', 'vehicle_truck'], checkType: 'count' },
    ],
    story: 'At sunset, the river must be bridged! Assemble an arched stone bridge so cars and trucks can deliver timber and supplies safely to the other side.',
    storyHi: 'शाम के समय नदी के ऊपर एक मजबूत पत्थर का पुल बनाएं ताकि गाड़ियां नदी पार कर सकें और रोशनी के लिए लैंप लगाएं!',
    badge: 'Bridge Architect 🌉',
  },
  {
    id: 5,
    title: 'Mission 5: Starry Coast & Lighthouse',
    titleHi: 'मिशन 5: रात की रोशनी और प्रकाश स्तम्भ',
    subtitle: 'Build illuminated maritime navigation beacons in night mode',
    theme: 'night',
    gridSize: 10,
    unlockedCategories: ['houses', 'nature', 'roads', 'animals', 'props'],
    unlockedItemIds: BUILDER_3D_ITEMS.map(i => i.id),
    goals: [
      { id: 'lighthouse', label: 'Build 1 Coastal Lighthouse', labelHi: '1 प्रकाश स्तम्भ (लाइटहाउस) बनाएं', targetCount: 1, itemTypes: ['house_lighthouse'], checkType: 'count' },
      { id: 'castle', label: 'Build 1 Castle Tower', labelHi: '1 किला टावर बनाएं', targetCount: 1, itemTypes: ['house_castle'], checkType: 'count' },
      { id: 'fountain', label: 'Place 1 Town Fountain & Lanterns', labelHi: '1 फव्वारा और लैंप लगाएं', targetCount: 1, itemTypes: ['prop_fountain', 'prop_streetlamp'], checkType: 'count' },
    ],
    story: 'Under a blanket of twinkling stars, guide sailors home safely! Construct a glowing marine lighthouse and a mountain fortress overlooking the bay.',
    storyHi: 'तारों भरी रात में समुद्र के जहाजों को रास्ता दिखाने के लिए एक चमकदार लाइटहाउस और किला बनाएं!',
    badge: 'Harbor Guardian 🏮',
  },
  {
    id: 6,
    title: 'Mission 6: Little Builder Grand Metropolis',
    titleHi: 'मिशन 6: हमारी सुंदर 3D दुनिया (महानगर)',
    subtitle: 'The master challenge: combine all 5 disciplines into a living world',
    theme: 'day',
    gridSize: 10,
    unlockedCategories: ['houses', 'nature', 'roads', 'animals', 'props'],
    unlockedItemIds: BUILDER_3D_ITEMS.map(i => i.id),
    goals: [
      { id: 'total', label: 'Place 12+ Total 3D Items Across the World', labelHi: 'कम से कम 12 वस्तुएं दुनिया में लगाएं', targetCount: 12, checkType: 'total' },
      { id: 'houses', label: 'Include at least 3 Houses/Towers', labelHi: 'कम से कम 3 घर या इमारतें बनाएं', targetCount: 3, category: 'houses', checkType: 'count' },
      { id: 'nature', label: 'Include at least 3 Trees/Gardens', labelHi: 'कम से कम 3 पेड़ या पौधे लगाएं', targetCount: 3, category: 'nature', checkType: 'count' },
      { id: 'roads', label: 'Include Roads & at least 1 Vehicle', labelHi: 'सड़क बनाएं और 1 गाड़ी चलाएं', targetCount: 2, category: 'roads', checkType: 'count' },
      { id: 'animals', label: 'Include at least 2 Happy Animals', labelHi: 'कम से कम 2 प्यारे जानवर लाएं', targetCount: 2, category: 'animals', checkType: 'count' },
    ],
    story: 'You are now a certified Master Builder! Bring together houses, paved roads, cruising cars, blooming gardens, and pasture animals into one thriving 3D community.',
    storyHi: 'बधाई हो, आप मास्टर बिल्डर बन चुके हैं! अब घर, सड़कें, कारें, हरियाली और जानवर सब मिलाकर अपनी सपनों की 3D दुनिया बनाएं!',
    badge: 'Master 3D Architect 👑',
  },
];
