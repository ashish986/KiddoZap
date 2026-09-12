import React, { useState } from 'react';
import { 
  BookOpen, 
  Brain, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  CheckCircle2, 
  Gamepad2, 
  GraduationCap, 
  Users, 
  Heart,
  Target,
  Zap,
  Clock
} from 'lucide-react';
import { Language } from '../types';

interface EducationalHubProps {
  lang: Language;
}

export const EducationalHub: React.FC<EducationalHubProps> = ({ lang }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeGuideTab, setActiveGuideTab] = useState<'action' | 'brain' | 'math' | 'toddler'>('brain');

  const faqs = [
    {
      qEn: 'What makes KiddoZap 100% safe for kids and COPPA compliant?',
      qHi: 'KiddoZap बच्चों के लिए 100% सुरक्षित और COPPA अनुपालन वाला कैसे है?',
      aEn: 'KiddoZap strictly adheres to the Children’s Online Privacy Protection Act (COPPA) and international student privacy frameworks. We never collect Personal Identifiable Information (PII) like full names, home addresses, phone numbers, or GPS location from minors. Player profiles, star progression, and game high scores are stored locally in the browser’s LocalStorage on your device. No user tracking or behavioral profiling is conducted.',
      aHi: 'KiddoZap चिल्ड्रेन्स ऑनलाइन प्राइवेसी प्रोटेक्शन एक्ट (COPPA) का पूरी तरह पालन करता है। हम 18 वर्ष से कम उम्र के बच्चों से कोई भी व्यक्तिगत जानकारी (जैसे नाम, फोन नंबर, पता या लोकेशन) एकत्र नहीं करते हैं। सभी गेम प्रोग्रेस और हाई-स्कोर सीधे आपके डिवाइस के ब्राउज़र में सुरक्षित रहते हैं।'
    },
    {
      qEn: 'Do students or parents need to download apps or create paid accounts?',
      qHi: 'क्या बच्चों या माता-पिता को ऐप डाउनलोड करने या पैसे देने की जरूरत है?',
      aEn: 'No! All 32+ games on KiddoZap are completely browser-based and free to play. There are zero mandatory app downloads, zero paywalls, zero in-app purchases, and no credit card requirements. Kids can launch games instantly on Chromebooks, Windows PC, Mac, iPads, tablets, and mobile browsers with zero setup.',
      aHi: 'बिल्कुल नहीं! KiddoZap के सभी 32+ खेल सीधे वेब ब्राउज़र में बिना किसी शुल्क के चलते हैं। किसी ऐप को डाउनलोड करने या पैसे खर्च करने की कोई जरूरत नहीं है। बच्चे स्कूल क्रोमबुक, टैबलेट या मोबाइल पर तुरंत खेल सकते हैं।'
    },
    {
      qEn: 'How do cognitive puzzles (Sudoku, Math Sprint, Memory) boost school academic performance?',
      qHi: 'दिमागी खेल (सुडोकू, मैथ्स, मेमोरी) स्कूल की पढ़ाई में कैसे मदद करते हैं?',
      aEn: 'Peer-reviewed pedagogical studies show that structured logic puzzles and timed mental arithmetic strengthen neuroplasticity and executive brain function in school-age learners. Playing Kiddo Sudoku enhances non-verbal deductive reasoning; Math Sprint automates rapid mental addition/multiplication recall; and Memory Match expands working visual memory, helping children solve multi-step academic problems with greater focus and reduced anxiety.',
      aHi: 'शोध से साबित हुआ है कि लॉजिक पहेलियां और मेंटल मैथ बच्चों के मस्तिष्क के न्यूरल कनेक्शन को मजबूत करते हैं। सुडोकू से तर्कशक्ति बढ़ती है, मैथ स्प्रिंट से गुणा-भाग की गति तेज होती है, और मेमोरी गेम्स से याददाश्त और एकाग्रता में भारी सुधार होता है।'
    },
    {
      qEn: 'What is KiddoZap’s Non-Violence and Family-Friendly content policy?',
      qHi: 'KiddoZap की नॉन-वायलेंस और परिवार-अनुकूल सामग्री नीति क्या है?',
      aEn: 'Every single title in our catalog undergoes strict editorial review to eliminate gore, realistic violence, mature themes, weapons, gambling mechanics, and loot boxes. Our games focus purely on timing, rhythm, physics, cartoon-styled adventure, spatial navigation, and intellect. It is safe for classroom use, school libraries, and family living rooms.',
      aHi: 'हमारे हर एक खेल की बाल सुरक्षा विशेषज्ञों द्वारा जांच की जाती है। इसमें किसी भी तरह की हिंसा, बंदूकें, या अनुचित सामग्री नहीं होती। सभी खेल पूरी तरह सकारात्मक, प्रेरणादायक और स्कूल व परिवार के अनुकूल हैं।'
    },
    {
      qEn: 'Can KiddoZap be used by teachers in classrooms or computer labs?',
      qHi: 'क्या शिक्षक क्लासरूम या कंप्यूटर लैब में KiddoZap का उपयोग कर सकते हैं?',
      aEn: 'Yes! KiddoZap is optimized for classroom Chromebooks, smart boards, and school IT environments. Teachers regularly use our Math Sprint, 2048, Sudoku, and Geography/Pattern games as 5-minute cognitive warm-ups, reward activities, or brain breaks during study sessions.',
      aHi: 'हाँ! KiddoZap स्कूल के क्रोमबुक्स और स्मार्ट बोर्ड्स पर आसानी से चलता है। शिक्षक गणित की क्लास शुरू होने से पहले 5 मिनट के ब्रेन वार्म-अप या रिवॉर्ड एक्टिविटी के तौर पर इसका उपयोग कर सकते हैं।'
    },
    {
      qEn: 'How are game scores, stars, and achievement badges saved?',
      qHi: 'गेम स्कोर, सितारे और अचीवमेंट बैज कैसे सुरक्षित रहते हैं?',
      aEn: 'All progress is securely stored using HTML5 LocalStorage on the player’s device. When children achieve high scores, clear puzzle levels, or earn trophies in the Trophy Room, the data persists across sessions on that browser without requiring any login credentials.',
      aHi: 'खिलाड़ी की सारी उपलब्धियां, जीते गए सितारे और अनलॉक किए गए ट्रॉफी बैज डिवाइस के लोकल स्टोरेज में अपने आप सेव हो जाते हैं। अगले दिन आने पर भी आपका स्कोर सुरक्षित रहता है।'
    },
    {
      qEn: 'Are the advertisements shown on KiddoZap safe for children?',
      qHi: 'क्या KiddoZap पर दिखाई जाने वाले विज्ञापन बच्चों के लिए सुरक्षित हैं?',
      aEn: 'Yes. KiddoZap exclusively integrates child-directed and family-friendly ad configurations in compliance with Google AdSense Family Program policies. All ads are filtered to block sensitive, adult, political, or age-inappropriate categories. Only family-safe, non-personalized contextual ads are permitted.',
      aHi: 'हाँ। KiddoZap गूगल की फैमिली फ्रेंडली एडसेंस नीतियों का सख्ती से पालन करता है। संवेदनशील या अनुचित विज्ञापनों को पूरी तरह ब्लॉक किया जाता है और केवल बच्चों व परिवारों के लिए सुरक्षित विज्ञापन ही दिखाए जाते हैं।'
    },
    {
      qEn: 'What grade levels and age groups is KiddoZap designed for?',
      qHi: 'KiddoZap किस कक्षा और उम्र के बच्चों के लिए बनाया गया है?',
      aEn: 'Our catalog is scientifically partitioned into 5 developmental tiers: Pre-Nursery (Ages 2-3), Nursery & KG (Ages 4-5), Primary School (Classes 1-3, Ages 6-8), Middle School (Classes 4-8, Ages 9-13), and High School Teens (Classes 9-12, Ages 14-17). Each tier provides challenges tailored to their developmental and motor milestones.',
      aHi: 'हमारे खेल 5 वर्गों में विभाजित हैं: प्री-नर्सरी (2-3 वर्ष), नर्सरी व KG (4-5 वर्ष), कक्षा 1-3 (6-8 वर्ष), कक्षा 4-8 (9-13 वर्ष), और कक्षा 9-12 टीन्स (14-17 वर्ष)। हर उम्र के बच्चे के लिए उपयुक्त खेल मौजूद हैं।'
    }
  ];

  const gameManuals = {
    brain: [
      {
        title: 'Kiddo Sudoku 4x4',
        icon: '🧩',
        grade: 'Classes 1 - 8 (Ages 6-13)',
        objective: 'Fill the 4x4 grid so every row, column, and 2x2 sub-box contains unique numbers (1-4) or unique animal symbols without repeating.',
        controls: 'Mouse click / Tap cell, then tap number or animal piece.',
        tips: 'Always scan for rows or boxes that already have 3 filled cells. The missing 4th cell is guaranteed by process of elimination.',
        benefit: 'Fosters deductive reasoning, pattern analysis, and elimination logic.'
      },
      {
        title: 'Math Sprint Speed Drill',
        icon: '➗',
        grade: 'Classes 1 - 10 (Ages 6-15)',
        objective: 'Solve rapid-fire mental arithmetic equations (Addition, Subtraction, Multiplication, Division) before the countdown timer expires.',
        controls: 'Click / Tap correct answer from the 4 multiple choice options.',
        tips: 'Look at the last digit for quick estimation (e.g. 17 + 25 must end in 2). Build your streak multiplier for bonus stars.',
        benefit: 'Accelerates mental arithmetic calculation speed and working memory recall.'
      },
      {
        title: 'Memory Pair Matcher',
        icon: '🃏',
        grade: 'Pre-Nursery to Class 5 (Ages 3-10)',
        objective: 'Flip cards two at a time to discover matching pairs of animals, fruits, and shapes with minimal attempts.',
        controls: 'Click / Tap to flip cards.',
        tips: 'Assign mental spatial anchors to cards (e.g. "Panda is top-left, Lion is bottom-center") to remember hidden locations.',
        benefit: 'Enhances short-term visual memory retention and spatial mapping.'
      },
      {
        title: 'Tic Tac Toe Master',
        icon: '⭕',
        grade: 'All Classes (Ages 4-17)',
        objective: 'Place 3 markers (X or O) in a horizontal, vertical, or diagonal row before the opponent.',
        controls: 'Click / Tap empty cell.',
        tips: 'Taking the center grid space on move 1 provides the highest probability of creating fork attacks.',
        benefit: 'Builds strategic foresight and anticipating opponent counter-moves.'
      }
    ],
    action: [
      {
        title: 'Geo Dash Neon Rhythm',
        icon: '⚡',
        grade: 'Classes 3 - 12 (Ages 8-17)',
        objective: 'Guide your geometric hero across spike obstacles, jump pads, gravity portals, and orb rings to sync with the music beat.',
        controls: 'Spacebar, Up Arrow, or Tap Screen to jump.',
        tips: 'Jump slightly early on yellow jump pads for maximum trajectory. In gravity flip portals, your controls reverse orientation.',
        benefit: 'Refines micro-second sensory reaction time, rhythm synchronization, and persistence.'
      },
      {
        title: '3D Slope Cyber Run',
        icon: '🌀',
        grade: 'Classes 4 - 12 (Ages 9-17)',
        objective: 'Steer a rolling sphere down an infinite 3D cyber highway, avoiding red laser barriers and collecting acceleration boosts.',
        controls: 'A/D keys, Left/Right Arrow keys, or swipe on touchscreen.',
        tips: 'Stay centered on the slope platforms and anticipate turns 2-3 tiles ahead rather than looking right in front of the ball.',
        benefit: 'Improves spatial 3D depth perception, peripheral vision tracking, and motor fine control.'
      },
      {
        title: 'Rooftop Parkour Rush',
        icon: '🏃',
        grade: 'Classes 2 - 12 (Ages 7-17)',
        objective: 'Run across skyscraper rooftops, leaping ventilation shafts, sliding under neon signposts, and collecting energy sparks.',
        controls: 'Up Arrow / W to jump, Down Arrow / S to slide, or on-screen touch buttons.',
        tips: 'Slide early under low overhangs to maintain running momentum without losing speed.',
        benefit: 'Sharpens predictive reflexes and quick hand-eye decision making.'
      },
      {
        title: 'Moto X3M Stunt Racer',
        icon: '🏍️',
        grade: 'Classes 3 - 12 (Ages 8-17)',
        objective: 'Drive a trial stunt motorcycle through loops, elevator ramps, explosive barrels, and giant rotating saw blades to reach the finish line.',
        controls: 'Up arrow to accelerate, Down arrow to brake, Left/Right to lean and balance.',
        tips: 'Performing 360-degree backflips in mid-air shaves 0.5 seconds off your total stage completion time.',
        benefit: 'Teaches practical Newtonian physics (gravity, angular momentum, and kinetic energy).'
      }
    ],
    math: [
      {
        title: '2048 Number Merge Master',
        icon: '🔢',
        grade: 'Classes 3 - 12 (Ages 8-17)',
        objective: 'Slide numbered tiles on a 4x4 grid. When two tiles with the same number touch, they merge into their sum (2+2=4, 4+4=8... 2048).',
        controls: 'Arrow keys or Swipe in 4 directions.',
        tips: 'Keep your highest value tile anchored in one corner (e.g., bottom-right) and never swipe away from that corner.',
        benefit: 'Deepens understanding of exponential growth (powers of 2) and tactical resource planning.'
      },
      {
        title: 'Color Switch Arena',
        icon: '🎯',
        grade: 'Classes 1 - 12 (Ages 6-17)',
        objective: 'Tap to bounce the ball upward through rotating multi-colored geometric shapes, passing only through segments matching your ball’s color.',
        controls: 'Click / Tap to flap upward.',
        tips: 'Patience is key! Hover below a rotating wheel and wait for your matching color segment to rotate into position before hopping.',
        benefit: 'Develops selective visual inhibition, patience, and impulse control.'
      },
      {
        title: 'Aim Reflex Sniper Pro',
        icon: '🎯',
        grade: 'Classes 4 - 12 (Ages 9-17)',
        objective: 'Click rapidly appearing targets in 30 seconds to test flick accuracy and reaction time in milliseconds.',
        controls: 'Mouse click or Screen tap on targets.',
        tips: 'Focus on precision over speed. Missed clicks penalize your accuracy percentage significantly.',
        benefit: 'Enhances fine motor coordination and target acquisition speed.'
      },
      {
        title: 'Cyber Pac-Maze 2088',
        icon: '🟡',
        grade: 'All Classes (Ages 5-17)',
        objective: 'Traverse the neon labyrinth, consume energy dots, activate power pellets, and dodge 4 patrol AI cyber ghosts.',
        controls: 'Arrow Keys or Swipe to change direction.',
        tips: 'Corner smoothly by buffering directional turns just before entering intersections.',
        benefit: 'Fosters spatial pathfinding, escape route planning, and situational awareness.'
      }
    ],
    toddler: [
      {
        title: 'Animated Nursery Rhymes',
        icon: '🎵',
        grade: 'Pre-Nursery & KG (Ages 2-5)',
        objective: 'Sing along with classic rhymes: Twinkle Twinkle, Old MacDonald, Wheels on the Bus, and Baa Baa Black Sheep with cute animated visuals.',
        controls: 'Click any song button to play audio and animations.',
        tips: 'Singing together with parents reinforces phonological awareness and early vocabulary.',
        benefit: 'Cultivates rhythm, phonics, auditory discrimination, and early language acquisition.'
      },
      {
        title: 'Balloon Pop Sensory Fun',
        icon: '🎈',
        grade: 'Pre-Nursery (Ages 2-4)',
        objective: 'Tap floating colorful balloons to pop them with delightful sound effects and floating confetti stars.',
        controls: 'Tap or click floating balloons.',
        tips: 'Name the colors aloud as each balloon is popped to reinforce early color identification.',
        benefit: 'Builds cause-and-effect understanding and early touchscreen motor control.'
      },
      {
        title: 'Magic Piano Keyboard',
        icon: '🎹',
        grade: 'Pre-Nursery to Class 3 (Ages 3-8)',
        objective: 'Play real musical notes (Do, Re, Mi, Fa, Sol, La, Ti) on a vibrant rainbow piano with animal instruments.',
        controls: 'Click keys or press keys 1-7 on keyboard.',
        tips: 'Try playing simple melodies like "Mary Had a Little Lamb" using 3 adjacent notes.',
        benefit: 'Introduces pitch recognition, auditory sequencing, and creative expression.'
      },
      {
        title: 'Shadow Shape Matcher',
        icon: '🐾',
        grade: 'Nursery & KG (Ages 3-6)',
        objective: 'Identify which animal or fruit matches the mysterious silhouette shadow.',
        controls: 'Click or drag the correct item onto its shadow.',
        tips: 'Look closely at unique contours such as ears, tails, and stems.',
        benefit: 'Strengthens figure-ground visual discrimination and shape recognition.'
      }
    ]
  };

  return (
    <section className="mt-14 space-y-12 text-slate-800">
      
      {/* 1. Authority & Educational Mission Banner */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border-4 border-amber-200">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-white/30">
            <GraduationCap className="w-4 h-4" />
            <span>{lang === 'hi' ? 'बाल विकास व शिक्षा केंद्र' : 'Pedagogical Standards & Educational Mission'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight leading-tight mb-4">
            {lang === 'hi'
              ? 'खेल-खेल में सीखें: दिमागी विकास, एकाग्रता और तर्कशक्ति'
              : 'Empowering Young Minds Through Non-Violent Cognitive Play'}
          </h2>
          <p className="text-sm sm:text-base text-amber-50 font-medium leading-relaxed max-w-3xl mb-6">
            {lang === 'hi'
              ? 'KiddoZap केवल मनोरंजन का साधन नहीं है, बल्कि बच्चों के मस्तिष्क के विकास (Cognitive Development), त्वरित निर्णय लेने और समस्या-निवारण (Problem Solving) के लिए वैज्ञानिक रूप से तैयार किया गया सुरक्षित डिजिटल मंच है।'
              : 'KiddoZap is engineered as an enriching, wholesome gaming platform for students from Class 1 to 12. By fusing game mechanics with cognitive psychology, we turn screen time into an active brain-training session that enhances working memory, visual tracking, arithmetic fluency, and persistence.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/15 backdrop-blur rounded-2xl p-3 border border-white/20">
              <span className="text-xl">🛡️</span>
              <p className="text-xs font-bold mt-1 text-white">100% COPPA Safe</p>
              <p className="text-[11px] text-amber-100">Zero Data Tracking</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl p-3 border border-white/20">
              <span className="text-xl">🧠</span>
              <p className="text-xs font-bold mt-1 text-white">Cognitive Science</p>
              <p className="text-[11px] text-amber-100">Logic & Arithmetic</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl p-3 border border-white/20">
              <span className="text-xl">🚫</span>
              <p className="text-xs font-bold mt-1 text-white">Zero Violence</p>
              <p className="text-[11px] text-amber-100">School Lab Safe</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl p-3 border border-white/20">
              <span className="text-xl">⚡</span>
              <p className="text-xs font-bold mt-1 text-white">Instant Web Play</p>
              <p className="text-[11px] text-amber-100">Zero Download/Setup</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Grade-by-Grade Curriculum Framework (Class 1-12) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200/80 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
            📚
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display">
              {lang === 'hi' ? 'कक्षावार पाठ्यक्रम व विकास मार्गदर्शिका' : 'Developmental Curriculum & Age Tier Framework'}
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              {lang === 'hi' ? 'हर उम्र के बच्चे के लिए उपयुक्त बौद्धिक चुनौतियां' : 'How KiddoZap games align with early childhood to secondary school milestones'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-pink-50/70 border border-pink-200 flex flex-col justify-between">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-lg bg-pink-100 text-pink-800 text-[11px] font-black uppercase mb-2">
                Tier 1 &bull; Ages 2-5
              </span>
              <h4 className="text-base font-black text-pink-950 mb-1.5">Pre-Nursery &amp; Kindergarten</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Focuses on sensory-motor coordination, primary color discrimination, animal sound recognition, and rhyming phonics through Animated Rhymes and Balloon Pop.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-pink-200/60 text-[11px] font-bold text-pink-700">
              Key Outcome: Auditory Phonics &amp; Fine Motor
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-black uppercase mb-2">
                Tier 2 &bull; Ages 6-8
              </span>
              <h4 className="text-base font-black text-amber-950 mb-1.5">Primary (Classes 1 - 3)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Introduces basic number theory, addition/subtraction drills, short-term visual memory pairs, and introductory spatial symmetry through Sudoku 4x4 and Memory Match.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200/60 text-[11px] font-bold text-amber-700">
              Key Outcome: Number Fluency &amp; Memory Span
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase mb-2">
                Tier 3 &bull; Ages 9-13
              </span>
              <h4 className="text-base font-black text-emerald-950 mb-1.5">Middle School (Classes 4 - 8)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Develops multi-step tactical planning, mental arithmetic under time pressure, rhythm synchronization, and geometric spatial deduction via Geo Dash, 2048, and Math Sprint.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200/60 text-[11px] font-bold text-emerald-700">
              Key Outcome: Deductive Logic &amp; Reflex Speed
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-col justify-between">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 text-[11px] font-black uppercase mb-2">
                Tier 4 &bull; Ages 14-17
              </span>
              <h4 className="text-base font-black text-purple-950 mb-1.5">High School (Classes 9 - 12)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Advanced spatial reaction, millisecond precision flick aim, angular physics prediction, and algorithmic obstacle clearing in Slope 3D, Aim Sniper, and Moto X3M.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-200/60 text-[11px] font-bold text-purple-700">
              Key Outcome: Executive Focus &amp; Precision
            </div>
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Game Guides & Strategy Manual */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-xl">
              🎮
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 font-display">
                {lang === 'hi' ? 'गेम मार्गदर्शिका, नियम व रणनीतियां' : 'Game Knowledge Hub: Rules, Controls & Winning Strategies'}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                {lang === 'hi' ? 'उच्च स्कोर बनाने के टिप्स और वैज्ञानिक लाभ' : 'Comprehensive player manual and developmental benefits for every major title'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setActiveGuideTab('brain')}
              className={`px-3 py-1.5 rounded-xl transition-all ${activeGuideTab === 'brain' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              🧠 Brain &amp; Logic
            </button>
            <button
              onClick={() => setActiveGuideTab('action')}
              className={`px-3 py-1.5 rounded-xl transition-all ${activeGuideTab === 'action' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              ⚡ 3D &amp; Action
            </button>
            <button
              onClick={() => setActiveGuideTab('math')}
              className={`px-3 py-1.5 rounded-xl transition-all ${activeGuideTab === 'math' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              🔢 Math &amp; Reflex
            </button>
            <button
              onClick={() => setActiveGuideTab('toddler')}
              className={`px-3 py-1.5 rounded-xl transition-all ${activeGuideTab === 'toddler' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              🎵 Early Toddler
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {gameManuals[activeGuideTab].map((manual, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/70 hover:border-amber-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{manual.icon}</span>
                    <h4 className="text-base font-black text-slate-900">{manual.title}</h4>
                  </div>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    {manual.grade}
                  </span>
                </div>

                <div className="space-y-2 mt-3 text-xs text-slate-600">
                  <p>
                    <strong className="text-slate-800">🎯 Objective:</strong> {manual.objective}
                  </p>
                  <p>
                    <strong className="text-slate-800">⌨️ Controls:</strong> {manual.controls}
                  </p>
                  <p>
                    <strong className="text-slate-800">💡 Pro Strategy:</strong> {manual.tips}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50/80 p-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cognitive Benefit: {manual.benefit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Scientific Foundations of Cognitive Gaming */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border-2 border-slate-800">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400 mb-2">
            <Brain className="w-4 h-4" />
            <span>Cognitive Psychology &amp; Neuroscience</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white mb-3">
            {lang === 'hi' ? 'दिमागी खेलों के पीछे का विज्ञान' : 'The Scientific Foundations of Game-Based Learning'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Contemporary neuroscientific research demonstrates that intentional, low-distraction puzzle gaming activates multiple neural lobes simultaneously. By challenging the brain to adapt to dynamic stimuli, children develop robust cognitive reserves that translate directly to classroom learning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <h4 className="text-sm font-black text-amber-300 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Working Memory Expansion</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Games requiring pattern sequence retention (like Card Flip Match and Pattern Flash) condition the prefrontal cortex, enhancing the child’s capacity to hold multiple pieces of information simultaneously during complex math or reading comprehension tasks.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <h4 className="text-sm font-black text-amber-300 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Spatial-Temporal Reasoning</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Three-dimensional navigation and physics simulations (such as 3D Slope Run and Moto X3M) activate the parietal lobe, developing spatial rotation intuition that forms the foundation of STEM disciplines like geometry, engineering, and physics.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <h4 className="text-sm font-black text-amber-300 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Impulse Control &amp; Focus</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Games with strict timing constraints (Color Switch and Aim Reflex) train selective response inhibition. Children learn to suppress impulsive mistakes, fostering patient deliberation and sustained classroom attention.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Comprehensive Frequently Asked Questions (FAQ) Accordion */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200/80 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
            ❓
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display">
              {lang === 'hi' ? 'अक्सर पूछे जाने वाले सवाल (FAQ)' : 'Frequently Asked Questions (Parents & Educators FAQ)'}
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              {lang === 'hi' ? 'सुरक्षा, गोपनीयता और गेमप्ले से जुड़े सभी सवालों के जवाब' : 'Clear, transparent answers on child privacy, safety, and educational utility'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-slate-50/60 hover:bg-amber-50/50 transition-all"
              >
                <span className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                  {lang === 'hi' ? faq.qHi : faq.qEn}
                </span>
                <span className="text-amber-600 shrink-0">
                  {openFaq === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {openFaq === index && (
                <div className="p-4 sm:p-5 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                  {lang === 'hi' ? faq.aHi : faq.aEn}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 6. Editorial Standards & Review Board Guarantee */}
      <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/80 border-2 border-amber-300/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black border border-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Editorial Integrity &amp; Child Safety Guarantee</span>
          </div>
          <h4 className="text-lg sm:text-xl font-black text-amber-950 font-display">
            {lang === 'hi' ? 'हमारा संपादकीय वादा: 100% सुरक्षित और निःशुल्क' : 'Our Editorial Pledge: Safe, Constructive & Always Free'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Every interactive challenge on KiddoZap is hand-vetted by our review board for pedagogical enrichment, non-violence, zero loot-box mechanics, and strict child privacy. Have feedback or want to request a curriculum puzzle? Contact our educational team at <a href="mailto:support@kiddozap.com" className="text-amber-800 font-bold underline">support@kiddozap.com</a>.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2 bg-white px-5 py-4 rounded-2xl border border-amber-200 shadow-xs">
          <Award className="w-8 h-8 text-amber-600 shrink-0" />
          <div>
            <p className="text-xs font-black text-slate-900">Family Verified</p>
            <p className="text-[11px] font-semibold text-slate-500">COPPA &bull; Grades 1-12</p>
          </div>
        </div>
      </div>

    </section>
  );
};
