import React from 'react';
import { BUILDER_3D_LEVELS, BUILDER_3D_ITEMS } from '../data/builder3DLevels';

export const BuilderWorldDetails: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-slate-300 font-sans leading-relaxed">
      {/* Educational Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-orange-950/40 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-10 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-black mb-4">
          <span>🏗️</span> STEM &amp; 3D Creative World Guide
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
          KiddoZap&apos;s Little Builder World 3D (छोटा निर्माता संसार)
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed mb-4">
          <strong>सोचो • बनाओ • अपना संसार सजाओ!</strong> KiddoZap&apos;s Little Builder World 3D brings young imaginations to life in full interactive three-dimensional space. Children explore houses, nature, roads, animals, and drivable vehicles in a safe, peaceful, and pedagogical environment with zero ads, zero unmoderated chat, and 100% kid-safe creative freedom.
        </p>
        <div className="flex flex-wrap gap-4 text-xs font-bold text-amber-300/90 pt-2 border-t border-slate-800">
          <span>✅ 3D Orbit, Zoom &amp; Pan Controls</span>
          <span>&bull;</span>
          <span>🚗 Drivable Vehicle Mode (सड़क पर कार चलाएं)</span>
          <span>&bull;</span>
          <span>🌅 Day, Sunset &amp; Night Cycles</span>
          <span>&bull;</span>
          <span>🐾 20+ Animated 3D Objects</span>
          <span>&bull;</span>
          <span>👶 Designed for Ages 4–8 &bull; COPPA Safe</span>
        </div>
      </div>

      {/* 5 Core Image Categories */}
      <section className="mb-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400">Core Experience</span>
          <h3 className="text-2xl font-black text-white mt-1">
            5 Ways Children Build &amp; Play
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Matching the five visual interactive pillars of KiddoZap&apos;s Little Builder World.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-900/90 border border-blue-500/30 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-3xl mb-2 block">🏠</span>
              <h4 className="font-black text-white text-base mb-1">Build Houses</h4>
              <p className="text-xs font-bold text-blue-400 mb-2">अपने सपनों का घर बनाएं!</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Place red cottages, modern villas, stone castles, tall watchtowers, and spinning windmills.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/30 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-3xl mb-2 block">🌿</span>
              <h4 className="font-black text-white text-base mb-1">Plant Trees &amp; Garden</h4>
              <p className="text-xs font-bold text-emerald-400 mb-2">पेड़ लगाएं, बगीचा सजाएं!</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Nurture oak trees, pine conifers, sunflower patches, apple orchards, and mushroom clusters.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-orange-500/30 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-3xl mb-2 block">🚗</span>
              <h4 className="font-black text-white text-base mb-1">Roads &amp; Vehicles</h4>
              <p className="text-xs font-bold text-orange-400 mb-2">सड़क बनाएं, गाड़ियां चलाएं!</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Lay down paved streets, crossroads, stone bridges, and drive red roadsters across your town!
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-purple-500/30 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-3xl mb-2 block">🐾</span>
              <h4 className="font-black text-white text-base mb-1">Add Animals</h4>
              <p className="text-xs font-bold text-purple-400 mb-2">जानवरों को अपने संसार में लाएं!</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Bring playful spotted dairy cows, fluffy sheep, and waddling ducks to peaceful village ponds.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-amber-500/30 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-3xl mb-2 block">⭐</span>
              <h4 className="font-black text-white text-base mb-1">Explore &amp; Play</h4>
              <p className="text-xs font-bold text-amber-400 mb-2">अपनी दुनिया में घूमिए और खेलिए!</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Hop behind the wheel in Drivable Car mode or freely orbit, rotate, and zoom into every creation!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Learning Outcomes from Banner Graphic */}
      <section className="mb-12 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">Curriculum Values</span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              इस गेम में बच्चे क्या सीखेंगे? (What Kids Will Learn)
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black">
            Bilingual STEM Framework
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-3xl mb-2 block">🧠</span>
            <h4 className="text-xs font-black text-white">रचनात्मकता</h4>
            <span className="text-[11px] text-amber-400 font-bold block mt-0.5">(Creativity)</span>
            <p className="text-[10px] text-slate-400 mt-2">
              Unrestricted 3D sandbox thinking and open design exploration.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-3xl mb-2 block">⚙️</span>
            <h4 className="text-xs font-black text-white">समस्या समाधान</h4>
            <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">(Problem Solving)</span>
            <p className="text-[10px] text-slate-400 mt-2">
              Aligning road grids, fitting houses, and reaching level milestones.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-3xl mb-2 block">🎯</span>
            <h4 className="text-xs font-black text-white">योजना बनाना</h4>
            <span className="text-[11px] text-orange-400 font-bold block mt-0.5">(Planning)</span>
            <p className="text-[10px] text-slate-400 mt-2">
              Zoning residential districts, green pastures, and transit paths.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-3xl mb-2 block">🎨</span>
            <h4 className="text-xs font-black text-white">रंग और आकार पहचान</h4>
            <span className="text-[11px] text-pink-400 font-bold block mt-0.5">(Colors &amp; Shapes)</span>
            <p className="text-[10px] text-slate-400 mt-2">
              Geometric pyramids, cylinders, arches, and high-contrast hues.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-3xl mb-2 block">🔢</span>
            <h4 className="text-xs font-black text-white">गिनती और गणित</h4>
            <span className="text-[11px] text-cyan-400 font-bold block mt-0.5">(Counting &amp; Math)</span>
            <p className="text-[10px] text-slate-400 mt-2">
              Quantifying goals: 3 houses, 4 trees, coordinate coordinates.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-3xl mb-2 block">💬</span>
            <h4 className="text-xs font-black text-white">हिंदी + English</h4>
            <span className="text-[11px] text-indigo-400 font-bold block mt-0.5">(दोनों भाषा में)</span>
            <p className="text-[10px] text-slate-400 mt-2">
              Dual-language prompts promoting vocabulary and comfort in both.
            </p>
          </div>
        </div>
      </section>

      {/* 3D Missions Guide */}
      <section className="mb-12 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              The 3D Engineering Missions (मिशन सूची)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Each mission introduces distinct architectural concepts and unlocks new 3D builder elements.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black">
            Progressive 3D Missions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BUILDER_3D_LEVELS.map(lvl => (
            <div key={lvl.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-amber-400">Level {lvl.id}</span>
                  <span className="text-[11px] font-bold text-slate-400">{lvl.badge}</span>
                </div>
                <h4 className="text-base font-black text-white mb-0.5">{lvl.title}</h4>
                <p className="text-xs text-amber-400 font-bold mb-2">{lvl.titleHi}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {lvl.story}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-900 text-[10px] text-amber-300/80 font-bold flex items-center justify-between">
                <span>Theme: {lvl.theme.toUpperCase()}</span>
                <span>{lvl.goals.length} Goals</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3D Item Catalog */}
      <section className="mb-12">
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
          3D Elements Catalog (3D निर्माण सामग्री)
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Hand-crafted procedural 3D models with rotating windmill blades, glowing lanterns, and animated animals.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {BUILDER_3D_ITEMS.map(item => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div className="overflow-hidden">
                <h5 className="font-bold text-white text-xs truncate">{item.name}</h5>
                <span className="text-[10px] text-amber-400/90 block truncate">{item.nameHi}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-xl font-black text-white mb-6">
          Frequently Asked Questions (FAQ)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="font-black text-amber-400 mb-1">Is KiddoZap&apos;s Little Builder World 3D free?</h4>
            <p className="text-slate-300 leading-relaxed">
              Yes, 100% free with no in-app purchases, no microtransactions, and no locked paywalls. All missions and the 3D sandbox are open for kids and classrooms.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="font-black text-amber-400 mb-1">How do I control the 3D camera?</h4>
            <p className="text-slate-300 leading-relaxed">
              Click &amp; drag with left mouse button (or one finger on mobile) to rotate/orbit around your world. Right-click or two fingers drag to pan. Mouse scroll wheel or pinch to zoom.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="font-black text-amber-400 mb-1">How does the Drivable Car mode work?</h4>
            <p className="text-slate-300 leading-relaxed">
              Click the &quot;🚗 Drive (कार चलाएं)&quot; button in the 3D bottom bar. Use your W, A, S, D keys, arrow keys, or on-screen touch arrows to steer your roadster throughout the roads and bridges you built!
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="font-black text-amber-400 mb-1">How is progress saved?</h4>
            <p className="text-slate-300 leading-relaxed">
              Unlocked levels and stars are automatically saved in browser local storage. No account registration or email submission is ever required.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
