import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import confetti from 'canvas-confetti';
import { BUILDER_3D_LEVELS, BUILDER_3D_ITEMS, Builder3DLevel, Builder3DItem } from '../data/builder3DLevels';
import { soundManager } from '../utils/audio';

interface Placed3DItem {
  id: string;
  gridX: number;
  gridZ: number;
  itemId: string;
  rotationY: number;
}

export const LittleBuilderWorld3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Game & Level State
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [isSandbox, setIsSandbox] = useState<boolean>(false);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});

  // Building State
  const [placedItems, setPlacedItems] = useState<Placed3DItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<'houses' | 'nature' | 'roads' | 'animals' | 'props'>('houses');
  const [selectedItemId, setSelectedItemId] = useState<string>('house_cottage');
  const [toolMode, setToolMode] = useState<'build' | 'erase'>('build');
  const [currentRotation, setCurrentRotation] = useState<number>(0);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');
  const [showLevelModal, setShowLevelModal] = useState<boolean>(false);
  const [showWinModal, setShowWinModal] = useState<boolean>(false);
  const [driveMode, setDriveMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Pointer drag vs click disambiguation ref
  const pointerDownRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  const currentLevel: Builder3DLevel = BUILDER_3D_LEVELS.find(l => l.id === currentLevelId) || BUILDER_3D_LEVELS[0];
  const gridSize = isSandbox ? 12 : currentLevel.gridSize;

  // ALL 5 Categories and ALL 20+ Items are accessible across all levels and sandbox
  const availableItems = BUILDER_3D_ITEMS;
  const categoryItems = availableItems.filter(i => i.category === activeCategory);

  // References to Three.js elements
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const hoverMarkerRef = useRef<THREE.Mesh | null>(null);
  const itemsGroupRef = useRef<THREE.Group | null>(null);
  const animatedObjectsRef = useRef<Array<{ mesh: THREE.Object3D; type: string; speed?: number; basePos?: THREE.Vector3 }>>([]);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  // Drive Mode State (Car position & heading)
  const playerCarRef = useRef<{
    mesh: THREE.Group | null;
    x: number;
    z: number;
    angle: number;
    speed: number;
  }>({ mesh: null, x: 0, z: 0, angle: 0, speed: 0 });

  const keysPressed = useRef<Record<string, boolean>>({});

  // Category selection handler: updates category, resets eraser, and auto-selects first item!
  const handleSelectCategory = (category: 'houses' | 'nature' | 'roads' | 'animals' | 'props') => {
    setActiveCategory(category);
    setToolMode('build');
    soundManager.playPop();

    // Automatically switch selected item to the first item of this category
    const firstItem = BUILDER_3D_ITEMS.find(i => i.category === category);
    if (firstItem) {
      setSelectedItemId(firstItem.id);
    }
  };

  // Camera presets
  const handleCameraPreset = (preset: 'iso' | 'top' | 'street') => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const half = (gridSize / 2) * 2;
    if (preset === 'top') {
      camera.position.set(0, half * 2.8, 0.01);
      controls.target.set(0, 0, 0);
    } else if (preset === 'street') {
      camera.position.set(0, 2.5, half * 1.5);
      controls.target.set(0, 0.8, 0);
    } else {
      // Default isometric
      camera.position.set(half * 1.6, half * 1.5, half * 1.6);
      controls.target.set(0, 0, 0);
    }
    controls.update();
    soundManager.playPop();
  };

  // Load progress from LocalStorage
  useEffect(() => {
    try {
      const savedUnlocked = localStorage.getItem('kz_builder3d_unlocked');
      if (savedUnlocked) setUnlockedLevels(JSON.parse(savedUnlocked));
      const savedStars = localStorage.getItem('kz_builder3d_stars');
      if (savedStars) setLevelStars(JSON.parse(savedStars));
    } catch {
      // ignore
    }
  }, []);

  const saveProgress = (newUnlocked: number[], newStars: Record<number, number>) => {
    try {
      localStorage.setItem('kz_builder3d_unlocked', JSON.stringify(newUnlocked));
      localStorage.setItem('kz_builder3d_stars', JSON.stringify(newStars));
    } catch {
      // ignore
    }
  };

  // Sync theme on level change
  useEffect(() => {
    if (!isSandbox) {
      setTimeOfDay(currentLevel.theme);
      setPlacedItems([]);
      setShowWinModal(false);
      setDriveMode(false);
      // Default to house_cottage
      setSelectedItemId('house_cottage');
      setActiveCategory('houses');
    }
  }, [currentLevelId, isSandbox]);

  // Check goal fulfillment
  const checkGoals = useCallback(() => {
    if (isSandbox) return { allMet: true, progress: [] };

    const progress = currentLevel.goals.map(goal => {
      let currentCount = 0;
      if (goal.checkType === 'total') {
        currentCount = placedItems.length;
      } else {
        currentCount = placedItems.filter(p => {
          if (goal.itemTypes && goal.itemTypes.includes(p.itemId)) return true;
          if (goal.category) {
            const item = BUILDER_3D_ITEMS.find(i => i.id === p.itemId);
            return item && item.category === goal.category;
          }
          return false;
        }).length;
      }
      return {
        ...goal,
        currentCount,
        met: currentCount >= goal.targetCount,
      };
    });

    const allMet = progress.every(p => p.met);
    return { allMet, progress };
  }, [placedItems, currentLevel, isSandbox]);

  const { allMet, progress: goalProgress } = checkGoals();

  const handleValidateBuild = () => {
    if (allMet) {
      soundManager.playWin();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#38bdf8', '#34d399', '#ec4899', '#f43f5e'],
      });

      const nextId = currentLevelId + 1;
      const newUnlocked = Array.from(new Set([...unlockedLevels, nextId].filter(id => id <= BUILDER_3D_LEVELS.length)));
      const newStars = { ...levelStars, [currentLevelId]: 3 };

      setUnlockedLevels(newUnlocked);
      setLevelStars(newStars);
      saveProgress(newUnlocked, newStars);
      setShowWinModal(true);
    } else {
      soundManager.playError();
    }
  };

  const handleNextLevel = () => {
    setShowWinModal(false);
    if (currentLevelId < BUILDER_3D_LEVELS.length) {
      setCurrentLevelId(currentLevelId + 1);
    } else {
      setIsSandbox(true);
    }
  };

  // Keyboard controls for Drive Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Update lighting on timeOfDay change
  useEffect(() => {
    const scene = sceneRef.current;
    const dirLight = dirLightRef.current;
    const hemiLight = hemiLightRef.current;
    if (!scene || !dirLight || !hemiLight) return;

    if (timeOfDay === 'day') {
      scene.background = new THREE.Color(0xa5f3fc);
      scene.fog = new THREE.FogExp2(0xa5f3fc, 0.015);
      hemiLight.color.setHex(0xe0f2fe);
      hemiLight.groundColor.setHex(0x4ade80);
      hemiLight.intensity = 0.8;
      dirLight.color.setHex(0xfffaed);
      dirLight.intensity = 1.3;
      dirLight.position.set(20, 30, 20);
    } else if (timeOfDay === 'sunset') {
      scene.background = new THREE.Color(0xfdba74);
      scene.fog = new THREE.FogExp2(0xfdba74, 0.018);
      hemiLight.color.setHex(0xfed7aa);
      hemiLight.groundColor.setHex(0x9a3412);
      hemiLight.intensity = 0.6;
      dirLight.color.setHex(0xf97316);
      dirLight.intensity = 1.2;
      dirLight.position.set(25, 12, 10);
    } else if (timeOfDay === 'night') {
      scene.background = new THREE.Color(0x0f172a);
      scene.fog = new THREE.FogExp2(0x0f172a, 0.02);
      hemiLight.color.setHex(0x1e293b);
      hemiLight.groundColor.setHex(0x020617);
      hemiLight.intensity = 0.3;
      dirLight.color.setHex(0x38bdf8);
      dirLight.intensity = 0.4;
      dirLight.position.set(15, 25, 15);
    }
  }, [timeOfDay]);

  // ---------------------------------------------------------------------------
  // Procedural 3D Mesh Constructors (High Quality Low-Poly / Stylized Aesthetic)
  // ---------------------------------------------------------------------------
  const createItemMesh = (itemId: string): THREE.Group => {
    const group = new THREE.Group();

    switch (itemId) {
      case 'house_cottage': {
        // Main House Body (Beveled plaster look)
        const wallMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
        const wall = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.4), wallMat);
        wall.position.y = 0.6;
        wall.castShadow = true;
        wall.receiveShadow = true;
        group.add(wall);

        // Brick Foundation Trim
        const baseMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.8 });
        const base = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.2, 1.44), baseMat);
        base.position.y = 0.1;
        base.castShadow = true;
        group.add(base);

        // Red Gable Roof
        const roofMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
        const roofGeom = new THREE.ConeGeometry(1.3, 0.8, 4);
        const roof = new THREE.Mesh(roofGeom, roofMat);
        roof.position.y = 1.6;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        group.add(roof);

        // Wooden Door
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.6, 0.05), doorMat);
        door.position.set(0, 0.4, 0.72);
        group.add(door);

        // Glowing Windows
        const winMat = new THREE.MeshStandardMaterial({
          color: timeOfDay === 'night' ? 0xfef08a : 0x38bdf8,
          emissive: timeOfDay === 'night' ? 0xfef08a : 0x0284c7,
          emissiveIntensity: timeOfDay === 'night' ? 0.8 : 0.1,
          roughness: 0.2,
        });
        const winL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.05), winMat);
        winL.position.set(-0.45, 0.75, 0.72);
        group.add(winL);

        const winR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.05), winMat);
        winR.position.set(0.45, 0.75, 0.72);
        group.add(winR);

        // Brick Chimney
        const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.8 });
        const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 0.25), chimneyMat);
        chimney.position.set(0.4, 1.7, -0.2);
        chimney.castShadow = true;
        group.add(chimney);
        break;
      }

      case 'house_villa': {
        // 2-Story Modern Townhouse
        const wallMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
        const story1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 1.4), wallMat);
        story1.position.y = 0.5;
        story1.castShadow = true;
        group.add(story1);

        const story2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 1.2), wallMat);
        story2.position.y = 1.45;
        story2.castShadow = true;
        group.add(story2);

        // Blue Roof
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
        const roof = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.7, 4), roofMat);
        roof.position.y = 2.2;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        group.add(roof);

        // Balcony & Railing
        const railMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e });
        const balcony = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.3), railMat);
        balcony.position.set(0, 1.0, 0.75);
        group.add(balcony);
        break;
      }

      case 'house_castle': {
        // Stone Tower
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 });
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 2.0, 8), stoneMat);
        tower.position.y = 1.0;
        tower.castShadow = true;
        group.add(tower);

        // Castle Battlements (Crenelations)
        const topMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
        const battlements = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.8, 0.4, 8), topMat);
        battlements.position.y = 2.1;
        battlements.castShadow = true;
        group.add(battlements);

        // Flag Pole & Waving Flag
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 6), poleMat);
        pole.position.set(0, 2.7, 0);
        group.add(pole);

        const flagMat = new THREE.MeshStandardMaterial({ color: 0xef4444, side: THREE.DoubleSide });
        const flag = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.02), flagMat);
        flag.position.set(0.2, 2.9, 0);
        group.add(flag);
        break;
      }

      case 'house_windmill': {
        // Mill Tower
        const millMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.8, 1.8, 8), millMat);
        tower.position.y = 0.9;
        tower.castShadow = true;
        group.add(tower);

        const capMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
        const cap = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.6, 8), capMat);
        cap.position.y = 2.0;
        group.add(cap);

        // Rotating Propeller Blades
        const bladeGroup = new THREE.Group();
        bladeGroup.position.set(0, 1.7, 0.65);
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
        for (let i = 0; i < 4; i++) {
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 0.04), bladeMat);
          blade.rotation.z = (Math.PI / 2) * i;
          blade.castShadow = true;
          bladeGroup.add(blade);
        }
        group.add(bladeGroup);
        animatedObjectsRef.current.push({ mesh: bladeGroup, type: 'windmill_blade' });
        break;
      }

      case 'house_lighthouse': {
        // Lighthouse Cylindrical Tower
        const towerMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.7, 2.4, 12), towerMat);
        tower.position.y = 1.2;
        tower.castShadow = true;
        group.add(tower);

        // Red Stripes
        const redBandMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
        const band1 = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.62, 0.45, 12), redBandMat);
        band1.position.y = 0.8;
        group.add(band1);

        const band2 = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.52, 0.45, 12), redBandMat);
        band2.position.y = 1.7;
        group.add(band2);

        // Glowing Beacon Housing
        const beaconMat = new THREE.MeshStandardMaterial({
          color: 0xfef08a,
          emissive: 0xfef08a,
          emissiveIntensity: 1.0,
        });
        const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.35, 8), beaconMat);
        beacon.position.y = 2.5;
        group.add(beacon);

        const dome = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.35, 8), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
        dome.position.y = 2.8;
        group.add(dome);
        break;
      }

      case 'tree_oak': {
        // Oak Trunk
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.0, 6), trunkMat);
        trunk.position.y = 0.5;
        trunk.castShadow = true;
        group.add(trunk);

        // Multi-Sphere Foliage
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 });
        const foliage1 = new THREE.Mesh(new THREE.SphereGeometry(0.75, 7, 7), leafMat);
        foliage1.position.set(0, 1.4, 0);
        foliage1.castShadow = true;
        group.add(foliage1);

        const foliage2 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 6, 6), leafMat);
        foliage2.position.set(0.35, 1.6, 0.2);
        group.add(foliage2);
        break;
      }

      case 'tree_pine': {
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.8, 6), trunkMat);
        trunk.position.y = 0.4;
        group.add(trunk);

        // 3 Tiered Cones
        const pineMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
        const tier1 = new THREE.Mesh(new THREE.ConeGeometry(0.8, 0.8, 6), pineMat);
        tier1.position.y = 1.0;
        tier1.castShadow = true;
        group.add(tier1);

        const tier2 = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.7, 6), pineMat);
        tier2.position.y = 1.5;
        tier2.castShadow = true;
        group.add(tier2);

        const tier3 = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.6, 6), pineMat);
        tier3.position.y = 2.0;
        tier3.castShadow = true;
        group.add(tier3);
        break;
      }

      case 'garden_flowers': {
        const soilMat = new THREE.MeshStandardMaterial({ color: 0x15803d });
        const soil = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 1.6), soilMat);
        soil.position.y = 0.06;
        group.add(soil);

        // Flowers
        const colors = [0xec4899, 0xf43f5e, 0xfbbf24, 0xa855f7];
        for (let fx = -0.5; fx <= 0.5; fx += 0.5) {
          for (let fz = -0.5; fz <= 0.5; fz += 0.5) {
            const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 4), new THREE.MeshStandardMaterial({ color: 0x22c55e }));
            stem.position.set(fx, 0.2, fz);
            group.add(stem);

            const flower = new THREE.Mesh(
              new THREE.SphereGeometry(0.1, 5, 5),
              new THREE.MeshStandardMaterial({ color: colors[Math.floor(Math.random() * colors.length)] })
            );
            flower.position.set(fx, 0.32, fz);
            group.add(flower);
          }
        }
        break;
      }

      case 'garden_fence': {
        const woodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 });
        // Horizontal rails
        const rail1 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.06), woodMat);
        rail1.position.set(0, 0.2, 0);
        group.add(rail1);
        const rail2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.06), woodMat);
        rail2.position.set(0, 0.45, 0);
        group.add(rail2);

        // Posts
        for (let p = -0.7; p <= 0.7; p += 0.45) {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.08), woodMat);
          post.position.set(p, 0.3, 0);
          post.castShadow = true;
          group.add(post);
        }
        break;
      }

      case 'water_pond': {
        // Water Basin
        const rimMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.1, 6, 12), rimMat);
        rim.rotation.x = Math.PI / 2;
        rim.position.y = 0.08;
        group.add(rim);

        // Shimmering Water
        const waterMat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          roughness: 0.1,
          metalness: 0.2,
          transparent: true,
          opacity: 0.85,
        });
        const water = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.05, 12), waterMat);
        water.position.y = 0.06;
        group.add(water);
        break;
      }

      case 'road_straight': {
        // Dark Asphalt Tile
        const roadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
        const road = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.05, 1.9), roadMat);
        road.position.y = 0.03;
        road.receiveShadow = true;
        group.add(road);

        // Yellow Dashes
        const dashMat = new THREE.MeshStandardMaterial({ color: 0xfacc15 });
        const dash1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.6), dashMat);
        dash1.position.set(0, 0.04, -0.45);
        group.add(dash1);

        const dash2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.6), dashMat);
        dash2.position.set(0, 0.04, 0.45);
        group.add(dash2);
        break;
      }

      case 'road_cross': {
        const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
        const road = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.05, 1.9), roadMat);
        road.position.y = 0.03;
        road.receiveShadow = true;
        group.add(road);
        break;
      }

      case 'bridge_stone': {
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
        // Deck
        const deck = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.15, 1.2), stoneMat);
        deck.position.y = 0.45;
        deck.castShadow = true;
        group.add(deck);

        // Parapets
        const wallL = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.3, 0.1), stoneMat);
        wallL.position.set(0, 0.6, -0.55);
        group.add(wallL);

        const wallR = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.3, 0.1), stoneMat);
        wallR.position.set(0, 0.6, 0.55);
        group.add(wallR);

        // Arch pillars
        const pillar1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.45, 1.2), stoneMat);
        pillar1.position.set(-0.7, 0.22, 0);
        group.add(pillar1);
        const pillar2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.45, 1.2), stoneMat);
        pillar2.position.set(0.7, 0.22, 0);
        group.add(pillar2);
        break;
      }

      case 'vehicle_car': {
        // Red Cruiser Body
        const carMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3, metalness: 0.2 });
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.35, 0.65), carMat);
        body.position.y = 0.32;
        body.castShadow = true;
        group.add(body);

        const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.32, 0.58), carMat);
        cabin.position.set(-0.08, 0.55, 0);
        cabin.castShadow = true;
        group.add(cabin);

        // Windshield
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1 });
        const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.26, 0.5), glassMat);
        windshield.position.set(0.25, 0.55, 0);
        group.add(windshield);

        // 4 Wheels
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
        const positions = [
          [-0.32, 0.16, -0.32],
          [0.32, 0.16, -0.32],
          [-0.32, 0.16, 0.32],
          [0.32, 0.16, 0.32],
        ];
        positions.forEach(([wx, wy, wz]) => {
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 8), wheelMat);
          wheel.rotation.x = Math.PI / 2;
          wheel.position.set(wx, wy, wz);
          wheel.castShadow = true;
          group.add(wheel);
        });
        break;
      }

      case 'vehicle_truck': {
        // Yellow Builder Truck
        const truckMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
        const cab = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.7), truckMat);
        cab.position.set(0.35, 0.45, 0);
        cab.castShadow = true;
        group.add(cab);

        const bedMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
        const bed = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.4, 0.7), bedMat);
        bed.position.set(-0.35, 0.35, 0);
        group.add(bed);
        break;
      }

      case 'animal_cow': {
        // Spotted Cow
        const cowMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.5), cowMat);
        body.position.y = 0.55;
        body.castShadow = true;
        group.add(body);

        // Black spot on body
        const spotMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
        const spot = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.52), spotMat);
        spot.position.set(0.1, 0.6, 0);
        group.add(spot);

        // Head
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.38), cowMat);
        head.position.set(0.5, 0.78, 0);
        group.add(head);

        // 4 Legs
        for (const [lx, lz] of [[-0.28, -0.16], [0.28, -0.16], [-0.28, 0.16], [0.28, 0.16]]) {
          const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.35, 0.1), spotMat);
          leg.position.set(lx, 0.18, lz);
          group.add(leg);
        }
        animatedObjectsRef.current.push({ mesh: group, type: 'animal_idle' });
        break;
      }

      case 'animal_sheep': {
        // Fluffy Wool Body
        const woolMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9 });
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.4, 7, 7), woolMat);
        body.scale.set(1.1, 0.9, 0.9);
        body.position.y = 0.48;
        body.castShadow = true;
        group.add(body);

        // Black Face
        const faceMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), faceMat);
        head.position.set(0.4, 0.52, 0);
        group.add(head);
        break;
      }

      case 'animal_chicken': {
        const henMat = new THREE.MeshStandardMaterial({ color: 0xfef08a });
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), henMat);
        body.position.y = 0.25;
        group.add(body);

        const comb = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.04), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
        comb.position.set(0.08, 0.42, 0);
        group.add(comb);
        break;
      }

      case 'animal_duck': {
        const duckMat = new THREE.MeshStandardMaterial({ color: 0xfacc15 });
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 6), duckMat);
        body.position.y = 0.18;
        group.add(body);

        const beak = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.08), new THREE.MeshStandardMaterial({ color: 0xf97316 }));
        beak.position.set(0.2, 0.22, 0);
        group.add(beak);
        animatedObjectsRef.current.push({ mesh: group, type: 'duck_bob' });
        break;
      }

      case 'char_builder_kid': {
        // Kid Builder Figure with Yellow Safety Helmet!
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xfcd34d });
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 7, 7), skinMat);
        head.position.y = 0.85;
        group.add(head);

        // Yellow Hard Hat
        const helmetMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
        const helmet = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.12, 8), helmetMat);
        helmet.position.y = 1.0;
        group.add(helmet);

        // Blue Overalls
        const shirtMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.25), shirtMat);
        body.position.y = 0.52;
        body.castShadow = true;
        group.add(body);
        break;
      }

      case 'prop_streetlamp': {
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.8, 6), poleMat);
        pole.position.y = 0.9;
        group.add(pole);

        const lanternMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xf59e0b,
          emissiveIntensity: timeOfDay === 'night' ? 1.0 : 0.2,
        });
        const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.35, 0.25), lanternMat);
        lantern.position.y = 1.8;
        group.add(lantern);

        if (timeOfDay === 'night') {
          const lampLight = new THREE.PointLight(0xf59e0b, 1.5, 4);
          lampLight.position.set(0, 1.8, 0);
          group.add(lampLight);
        }
        break;
      }

      case 'prop_fountain': {
        const basinMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc });
        const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.9, 0.35, 12), basinMat);
        basin.position.y = 0.2;
        basin.castShadow = true;
        group.add(basin);

        const waterMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1 });
        const water = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.1, 12), waterMat);
        water.position.y = 0.32;
        group.add(water);

        const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.6, 6), basinMat);
        nozzle.position.y = 0.5;
        group.add(nozzle);
        break;
      }

      default: {
        const defMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
        const box = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), defMat);
        box.position.y = 0.6;
        box.castShadow = true;
        group.add(box);
        break;
      }
    }

    return group;
  };

  // ---------------------------------------------------------------------------
  // Three.js Mount & Animation Loop
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xa5f3fc);
    scene.fog = new THREE.FogExp2(0xa5f3fc, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(12, 16, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.15; // Don't go below ground
    controls.minDistance = 6;
    controls.maxDistance = 35;
    controls.target.set(0, 0, 0);

    // 3. Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x4ade80, 0.8);
    hemiLightRef.current = hemiLight;
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.3);
    dirLightRef.current = dirLight;
    dirLight.position.set(20, 30, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 80;
    const shadowDist = 18;
    dirLight.shadow.camera.left = -shadowDist;
    dirLight.shadow.camera.right = shadowDist;
    dirLight.shadow.camera.top = shadowDist;
    dirLight.shadow.camera.bottom = -shadowDist;
    scene.add(dirLight);

    // 4. Ground Grid & River Basin
    const groundGroup = new THREE.Group();
    scene.add(groundGroup);

    const halfGrid = gridSize / 2;
    const tileSize = 2;

    for (let gx = 0; gx < gridSize; gx++) {
      for (let gz = 0; gz < gridSize; gz++) {
        const posX = (gx - halfGrid + 0.5) * tileSize;
        const posZ = (gz - halfGrid + 0.5) * tileSize;

        // Base Grass Tile
        const tileGeom = new THREE.BoxGeometry(1.94, 0.4, 1.94);
        const tileMat = new THREE.MeshStandardMaterial({
          color: (gx + gz) % 2 === 0 ? 0x4ade80 : 0x22c55e,
          roughness: 0.8,
        });
        const tile = new THREE.Mesh(tileGeom, tileMat);
        tile.position.set(posX, -0.2, posZ);
        tile.receiveShadow = true;
        groundGroup.add(tile);
      }
    }

    // Outer Ground Skirt
    const skirtGeom = new THREE.BoxGeometry(gridSize * tileSize + 8, 0.3, gridSize * tileSize + 8);
    const skirtMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
    const skirt = new THREE.Mesh(skirtGeom, skirtMat);
    skirt.position.y = -0.36;
    skirt.receiveShadow = true;
    groundGroup.add(skirt);

    // 5. Placed Items Group
    const itemsGroup = new THREE.Group();
    itemsGroupRef.current = itemsGroup;
    scene.add(itemsGroup);

    // 6. Glowing Hover Marker (Raycast Indicator)
    const markerGeom = new THREE.BoxGeometry(1.98, 0.1, 1.98);
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.55,
      wireframe: false,
    });
    const hoverMarker = new THREE.Mesh(markerGeom, markerMat);
    hoverMarker.position.set(0, 0.05, 0);
    hoverMarker.visible = false;
    hoverMarkerRef.current = hoverMarker;
    scene.add(hoverMarker);

    // 7. Raycaster & Mouse Picking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hitPoint = new THREE.Vector3();
      const intersects = raycaster.ray.intersectPlane(groundPlane, hitPoint);

      if (intersects) {
        // Snap to grid
        const cellX = Math.floor((hitPoint.x + halfGrid * tileSize) / tileSize);
        const cellZ = Math.floor((hitPoint.z + halfGrid * tileSize) / tileSize);

        if (cellX >= 0 && cellX < gridSize && cellZ >= 0 && cellZ < gridSize) {
          hoverMarker.position.x = (cellX - halfGrid + 0.5) * tileSize;
          hoverMarker.position.z = (cellZ - halfGrid + 0.5) * tileSize;
          hoverMarker.position.y = 0.06;
          hoverMarker.visible = true;
        } else {
          hoverMarker.visible = false;
        }
      } else {
        hoverMarker.visible = false;
      }
    };

    renderer.domElement.addEventListener('mousemove', onPointerMove);

    // 8. Handle Window Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Render Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Rotate windmill blades & bob animals
      animatedObjectsRef.current.forEach(item => {
        if (item.type === 'windmill_blade') {
          item.mesh.rotation.z += 0.02;
        } else if (item.type === 'duck_bob') {
          item.mesh.position.y = Math.sin(elapsed * 4) * 0.05;
        } else if (item.type === 'animal_idle') {
          item.mesh.rotation.y = Math.sin(elapsed * 2) * 0.08;
        }
      });

      // Drive Mode: move player car if active
      if (driveMode && playerCarRef.current.mesh) {
        const car = playerCarRef.current;
        const moveSpeed = 6 * delta;
        const turnSpeed = 3 * delta;

        if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
          car.x += Math.sin(car.angle) * moveSpeed;
          car.z += Math.cos(car.angle) * moveSpeed;
        }
        if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
          car.x -= Math.sin(car.angle) * moveSpeed * 0.6;
          car.z -= Math.cos(car.angle) * moveSpeed * 0.6;
        }
        if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
          car.angle += turnSpeed;
        }
        if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
          car.angle -= turnSpeed;
        }

        // Clamp inside grid boundary
        const maxBoundary = (gridSize / 2) * tileSize - 1;
        car.x = Math.max(-maxBoundary, Math.min(maxBoundary, car.x));
        car.z = Math.max(-maxBoundary, Math.min(maxBoundary, car.z));

        car.mesh.position.set(car.x, 0, car.z);
        car.mesh.rotation.y = car.angle;

        // Smooth camera follow
        camera.position.x = car.x - Math.sin(car.angle) * 7;
        camera.position.z = car.z - Math.cos(car.angle) * 7;
        camera.position.y = 5.5;
        controls.target.set(car.x, 0.5, car.z);
      } else {
        controls.update();
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', onPointerMove);
      renderer.dispose();
    };
  }, [gridSize]);

  // ---------------------------------------------------------------------------
  // Sync 3D Scene with placedItems state
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const itemsGroup = itemsGroupRef.current;
    if (!itemsGroup) return;

    // Clear existing 3D objects in group
    while (itemsGroup.children.length > 0) {
      itemsGroup.remove(itemsGroup.children[0]);
    }
    animatedObjectsRef.current = [];

    const halfGrid = gridSize / 2;
    const tileSize = 2;

    placedItems.forEach(item => {
      const mesh = createItemMesh(item.itemId);
      const posX = (item.gridX - halfGrid + 0.5) * tileSize;
      const posZ = (item.gridZ - halfGrid + 0.5) * tileSize;

      mesh.position.set(posX, 0, posZ);
      mesh.rotation.y = item.rotationY || 0;
      itemsGroup.add(mesh);

      // If item is vehicle_car and driveMode is active, bind it to playerCarRef
      if (item.itemId === 'vehicle_car' && !playerCarRef.current.mesh) {
        playerCarRef.current.mesh = mesh;
        playerCarRef.current.x = posX;
        playerCarRef.current.z = posZ;
      }
    });
  }, [placedItems, gridSize, timeOfDay]);

  // ---------------------------------------------------------------------------
  // Pointer Down & Up: Disambiguate Camera Orbit Drag from Block Placement Click
  // ---------------------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerDownRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (driveMode) return; // In drive mode, clicks don't place items

    // If pointer moved more than 7px or was held > 500ms, it was an orbit/pan drag, NOT a click!
    const dx = e.clientX - pointerDownRef.current.x;
    const dy = e.clientY - pointerDownRef.current.y;
    const dist = Math.hypot(dx, dy);
    const duration = Date.now() - pointerDownRef.current.time;
    if (dist > 7 || duration > 500) return;

    const container = mountRef.current;
    const camera = cameraRef.current;
    if (!container || !camera) return;

    const rect = container.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hitPoint = new THREE.Vector3();
    const hit = raycaster.ray.intersectPlane(groundPlane, hitPoint);

    if (hit) {
      const tileSize = 2;
      const halfGrid = gridSize / 2;
      const cellX = Math.floor((hitPoint.x + halfGrid * tileSize) / tileSize);
      const cellZ = Math.floor((hitPoint.z + halfGrid * tileSize) / tileSize);

      if (cellX >= 0 && cellX < gridSize && cellZ >= 0 && cellZ < gridSize) {
        if (toolMode === 'erase') {
          const existingIdx = placedItems.findIndex(p => p.gridX === cellX && p.gridZ === cellZ);
          if (existingIdx !== -1) {
            soundManager.playPop(0.85);
            setPlacedItems(prev => prev.filter((_, idx) => idx !== existingIdx));
          }
        } else {
          // Place item with selected rotation
          soundManager.playPop(1.15);
          setPlacedItems(prev => {
            const filtered = prev.filter(p => !(p.gridX === cellX && p.gridZ === cellZ));
            return [
              ...filtered,
              {
                id: `item_${Date.now()}_${Math.random()}`,
                gridX: cellX,
                gridZ: cellZ,
                itemId: selectedItemId,
                rotationY: currentRotation,
              },
            ];
          });
        }
      }
    }
  };

  const handleClear = () => {
    if (placedItems.length === 0) return;
    setPlacedItems([]);
    soundManager.playCrash();
  };

  // Launch Drive Mode (ensure at least 1 car exists)
  const handleStartDriving = () => {
    if (!placedItems.some(i => i.itemId === 'vehicle_car')) {
      // Auto-place a red car at center of grid
      const center = Math.floor(gridSize / 2);
      setPlacedItems(prev => [
        ...prev.filter(p => !(p.gridX === center && p.gridZ === center)),
        {
          id: `item_car_${Date.now()}`,
          gridX: center,
          gridZ: center,
          itemId: 'vehicle_car',
          rotationY: 0,
        },
      ]);
    }
    setDriveMode(true);
    soundManager.playWin();
  };

  const selectedItem = BUILDER_3D_ITEMS.find(i => i.id === selectedItemId);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 font-sans">
      {/* Top Banner / HUD (Matching User's Reference Graphic) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
              🏗️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Kiddozap Little Builder - Build Your World
                </h1>
                <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                  {isSandbox ? 'Creative 3D Sandbox' : `Mission ${currentLevel.id}/6`}
                </span>
              </div>
              <p className="text-xs text-amber-300 font-bold mt-0.5">
                सोचो • बनाओ • अपना संसार सजाओ &bull; {isSandbox ? 'Infinite 3D Freedom' : currentLevel.titleHi}
              </p>
            </div>
          </div>

          {/* Quick HUD controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowLevelModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>🗺️</span> Missions ({Object.keys(levelStars).length}/6)
            </button>
            <button
              onClick={() => {
                const times: Array<'day' | 'sunset' | 'night'> = ['day', 'sunset', 'night'];
                const next = times[(times.indexOf(timeOfDay) + 1) % times.length];
                setTimeOfDay(next);
                soundManager.playPop();
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {timeOfDay === 'day' && '☀️ Day (दिन)'}
              {timeOfDay === 'sunset' && '🌅 Sunset (शाम)'}
              {timeOfDay === 'night' && '🌙 Night (रात)'}
            </button>
            <button
              onClick={() => {
                soundManager.toggleMute();
                setIsMuted(soundManager.isMuted());
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {isMuted ? '🔇 Muted' : '🔊 Sound'}
            </button>
          </div>
        </div>

        {/* Level Story & Objectives */}
        {!isSandbox && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="md:col-span-1 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
              <span className="text-[11px] font-black text-amber-400 block mb-1">📜 Mission Story (कहानी):</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {currentLevel.storyHi}
              </p>
            </div>

            <div className="md:col-span-2 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black text-emerald-400">🎯 Building Goals (लक्ष्य):</span>
                <span className="text-[10px] font-bold text-slate-400">
                  {goalProgress.filter(g => g.met).length} of {goalProgress.length} complete
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {goalProgress.map(goal => (
                  <div
                    key={goal.id}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                      goal.met
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{goal.met ? '✅' : '⚪'}</span>
                      <span>{goal.labelHi || goal.label}</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {goal.currentCount}/{goal.targetCount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Selected Tool & Helper Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl mb-4 shadow-lg">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active:</span>
          {toolMode === 'erase' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-black">
              🧹 Eraser (हटाने का टूल) &bull; Click any object to remove
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-black">
              <span className="text-base">{selectedItem?.icon}</span>
              <span>{selectedItem?.name}</span>
              <span className="text-amber-400/80 font-normal">({selectedItem?.nameHi})</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
            👉 Tap green grass square to place
          </span>
          <button
            onClick={() => {
              setCurrentRotation(r => (r + Math.PI / 2) % (Math.PI * 2));
              soundManager.playPop();
            }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-slate-700"
            title="Rotate Item 90 degrees"
          >
            🔄 Rotate ({Math.round((currentRotation * 180) / Math.PI)}°)
          </button>
          <button
            onClick={() => {
              setToolMode(toolMode === 'erase' ? 'build' : 'erase');
              soundManager.playPop();
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              toolMode === 'erase'
                ? 'bg-rose-600 border-rose-400 text-white font-black'
                : 'bg-slate-800 border-slate-700 text-rose-300 hover:bg-slate-700'
            }`}
          >
            🧹 {toolMode === 'erase' ? 'Exit Eraser' : 'Eraser'}
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Stage */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-3 sm:p-5 shadow-2xl mb-6 flex flex-col items-center">
        <div
          ref={mountRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="relative w-full aspect-[16/9] min-h-[380px] max-h-[560px] rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-inner bg-slate-950 cursor-crosshair select-none"
        />

        {/* 3D Drive Mode Overlay & Clear Controls */}
        <div className="absolute top-6 right-8 flex items-center gap-2">
          <button
            onClick={driveMode ? () => setDriveMode(false) : handleStartDriving}
            className={`px-3.5 py-2 rounded-xl text-xs font-black shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-1.5 ${
              driveMode
                ? 'bg-amber-400 text-slate-950 border border-amber-300 ring-2 ring-amber-400/50'
                : 'bg-slate-900/90 text-amber-300 border border-slate-700 hover:border-amber-400'
            }`}
          >
            <span>🚗</span> {driveMode ? 'Exit Drive Mode (ड्राइव रोकें)' : 'Drive Car (कार चलाएं)'}
          </button>

          <button
            onClick={handleClear}
            className="p-2 px-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-200 transition-colors cursor-pointer text-xs font-bold"
            title="Clear canvas"
          >
            🗑️ Clear
          </button>
        </div>

        {/* Camera Tip & Count Badge */}
        <div className="absolute bottom-6 left-8 px-3 py-1 bg-slate-950/85 backdrop-blur-xs rounded-full border border-slate-800 text-[11px] font-bold text-slate-300 flex items-center gap-2">
          <span>🔄 Drag to Orbit 3D view</span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-amber-400">{placedItems.length} Placed</span>
        </div>

        {/* On-screen Drive Arrows (When drive mode is active) */}
        {driveMode && (
          <div className="absolute bottom-6 right-8 flex flex-col items-center gap-1 p-2 bg-slate-950/90 rounded-2xl border border-amber-500/40 shadow-2xl backdrop-blur-xs">
            <span className="text-[10px] font-black text-amber-300 mb-0.5">🎮 Steer Car (W/A/S/D)</span>
            <button
              onMouseDown={() => { keysPressed.current['w'] = true; }}
              onMouseUp={() => { keysPressed.current['w'] = false; }}
              onTouchStart={() => { keysPressed.current['w'] = true; }}
              onTouchEnd={() => { keysPressed.current['w'] = false; }}
              className="w-10 h-10 bg-slate-800 active:bg-amber-500 active:text-slate-950 rounded-xl font-black text-lg flex items-center justify-center text-white border border-slate-700 select-none"
            >
              ⬆️
            </button>
            <div className="flex gap-2">
              <button
                onMouseDown={() => { keysPressed.current['a'] = true; }}
                onMouseUp={() => { keysPressed.current['a'] = false; }}
                onTouchStart={() => { keysPressed.current['a'] = true; }}
                onTouchEnd={() => { keysPressed.current['a'] = false; }}
                className="w-10 h-10 bg-slate-800 active:bg-amber-500 active:text-slate-950 rounded-xl font-black text-lg flex items-center justify-center text-white border border-slate-700 select-none"
              >
                ⬅️
              </button>
              <button
                onMouseDown={() => { keysPressed.current['s'] = true; }}
                onMouseUp={() => { keysPressed.current['s'] = false; }}
                onTouchStart={() => { keysPressed.current['s'] = true; }}
                onTouchEnd={() => { keysPressed.current['s'] = false; }}
                className="w-10 h-10 bg-slate-800 active:bg-amber-500 active:text-slate-950 rounded-xl font-black text-lg flex items-center justify-center text-white border border-slate-700 select-none"
              >
                ⬇️
              </button>
              <button
                onMouseDown={() => { keysPressed.current['d'] = true; }}
                onMouseUp={() => { keysPressed.current['d'] = false; }}
                onTouchStart={() => { keysPressed.current['d'] = true; }}
                onTouchEnd={() => { keysPressed.current['d'] = false; }}
                className="w-10 h-10 bg-slate-800 active:bg-amber-500 active:text-slate-950 rounded-xl font-black text-lg flex items-center justify-center text-white border border-slate-700 select-none"
              >
                ➡️
              </button>
            </div>
          </div>
        )}

        {/* Validation Button */}
        {!isSandbox && (
          <div className="mt-4 w-full flex justify-end">
            <button
              onClick={handleValidateBuild}
              className={`w-full sm:w-auto px-8 py-3 rounded-2xl font-black text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                allMet
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:scale-105 shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span>{allMet ? '🎉' : '🔍'}</span>
              <span>{allMet ? 'Check & Complete Mission (मिशन पूरा करें!)' : 'Check Mission Goals'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 5 Builder Category Cards (Matching User's Reference Graphic Exactly) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
        {/* 1. Build Houses */}
        <button
          onClick={() => handleSelectCategory('houses')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeCategory === 'houses' && toolMode === 'build'
              ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/25 scale-102'
              : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🏠</span>
            <span className="font-black text-sm">Build Houses</span>
          </div>
          <p className="text-[11px] opacity-90 leading-tight">अपने सपनों का घर बनाएं!</p>
        </button>

        {/* 2. Plant Trees & Garden */}
        <button
          onClick={() => handleSelectCategory('nature')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeCategory === 'nature' && toolMode === 'build'
              ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/25 scale-102'
              : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌿</span>
            <span className="font-black text-sm">Plant Trees</span>
          </div>
          <p className="text-[11px] opacity-90 leading-tight">पेड़ लगाएं, बगीचा सजाएं!</p>
        </button>

        {/* 3. Create Roads & Vehicles */}
        <button
          onClick={() => handleSelectCategory('roads')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeCategory === 'roads' && toolMode === 'build'
              ? 'bg-orange-600 border-orange-400 text-white shadow-lg shadow-orange-500/25 scale-102'
              : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🚗</span>
            <span className="font-black text-sm">Create Roads</span>
          </div>
          <p className="text-[11px] opacity-90 leading-tight">सड़क बनाएं, गाड़ियां चलाएं!</p>
        </button>

        {/* 4. Add Animals */}
        <button
          onClick={() => handleSelectCategory('animals')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeCategory === 'animals' && toolMode === 'build'
              ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/25 scale-102'
              : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🐾</span>
            <span className="font-black text-sm">Add Animals</span>
          </div>
          <p className="text-[11px] opacity-90 leading-tight">जानवरों को अपने संसार में लाएं!</p>
        </button>

        {/* 5. Explore & Play */}
        <button
          onClick={() => handleSelectCategory('props')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            activeCategory === 'props' && toolMode === 'build'
              ? 'bg-teal-600 border-teal-400 text-white shadow-lg shadow-teal-500/25 scale-102'
              : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⭐</span>
            <span className="font-black text-sm">Explore &amp; Play</span>
          </div>
          <p className="text-[11px] opacity-90 leading-tight">अपनी दुनिया में घूमिए और खेलिए!</p>
        </button>
      </div>

      {/* Item Palette Tray */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl mb-12">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
              {activeCategory === 'houses' && '🏠 Houses & Buildings (घर और इमारतें):'}
              {activeCategory === 'nature' && '🌿 Trees, Flowers & Water (पेड़ और बगीचा):'}
              {activeCategory === 'roads' && '🚗 Roads, Bridges & Vehicles (सड़क और वाहन):'}
              {activeCategory === 'animals' && '🐾 Farm Animals & Kids (जानवर और नन्हे साथी):'}
              {activeCategory === 'props' && '⭐ Landmarks & Interactive Explore (घूमिए और खेलिए):'}
            </span>
            <span className="text-[11px] text-slate-400 font-bold">
              ({categoryItems.length} items ready to place)
            </span>
          </div>

          {/* Quick Actions in Explore Tab */}
          {activeCategory === 'props' && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleStartDriving}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-md"
              >
                <span>🚗</span> Drive Car Now
              </button>
              <button
                onClick={() => handleCameraPreset('top')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-700"
              >
                📐 Top View
              </button>
              <button
                onClick={() => handleCameraPreset('iso')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-700"
              >
                👁️ 3D View
              </button>
              <button
                onClick={() => handleCameraPreset('street')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-700"
              >
                🚶 Ground
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categoryItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setToolMode('build');
                setSelectedItemId(item.id);
                soundManager.playPop();
              }}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                toolMode === 'build' && selectedItemId === item.id
                  ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/25 scale-103'
                  : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <span className="text-3xl">{item.icon}</span>
              <div className="overflow-hidden">
                <h5 className="font-bold text-white text-xs truncate">{item.name}</h5>
                <p className="text-[10px] text-amber-300/80 truncate font-semibold">{item.nameHi}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mission Selector Modal */}
      {showLevelModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowLevelModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-white">Select 3D Mission (मिशन चुनें)</h3>
                <p className="text-xs text-slate-400">Master all 6 architectural challenges or enter sandbox</p>
              </div>
              <button
                onClick={() => setShowLevelModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {BUILDER_3D_LEVELS.map(level => {
                const isUnlocked = unlockedLevels.includes(level.id);
                const stars = levelStars[level.id] || 0;

                return (
                  <div
                    key={level.id}
                    onClick={() => {
                      if (isUnlocked) {
                        setIsSandbox(false);
                        setCurrentLevelId(level.id);
                        setShowLevelModal(false);
                        soundManager.playPop();
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all ${
                      isUnlocked
                        ? 'bg-slate-950 hover:bg-slate-800 border-slate-800 cursor-pointer hover:border-amber-400/50'
                        : 'bg-slate-950/40 border-slate-900 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-amber-400">Mission {level.id}</span>
                      <span className="text-xs">{isUnlocked ? '⭐'.repeat(stars) || '⚪⚪⚪' : '🔒 Locked'}</span>
                    </div>
                    <h4 className="font-extrabold text-white text-sm mb-0.5">{level.titleHi}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{level.subtitle}</p>
                  </div>
                );
              })}
            </div>

            <div
              onClick={() => {
                setIsSandbox(true);
                setShowLevelModal(false);
                soundManager.playPop();
              }}
              className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 hover:border-amber-400 cursor-pointer flex items-center justify-between"
            >
              <div>
                <h4 className="font-black text-amber-300 text-sm">🎨 Free 3D Sandbox Mode (मुक्त निर्माण)</h4>
                <p className="text-xs text-slate-300">All 3D houses, roads, cars, and animals unlocked!</p>
              </div>
              <span className="px-4 py-2 bg-amber-400 text-slate-950 font-black rounded-xl text-xs">
                Launch ⚡
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Win Modal */}
      {showWinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl animate-bounce-short">
            <span className="text-5xl block mb-3">🎉</span>
            <h3 className="text-2xl font-black text-white mb-1">Mission Complete!</h3>
            <p className="text-xs text-amber-400 font-bold mb-4">{currentLevel.titleHi}</p>

            <div className="text-3xl mb-4 tracking-widest">⭐⭐⭐</div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left mb-6">
              <span className="text-[11px] font-black text-amber-400 block mb-1">
                🏆 Badge: {currentLevel.badge}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                बधाई हो! आपने इस स्तर को सफलतापूर्वक पूरा कर लिया है।
              </p>
            </div>

            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() => setShowWinModal(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Keep Exploring
              </button>
              <button
                onClick={handleNextLevel}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs transition-transform hover:scale-105 cursor-pointer shadow-lg shadow-amber-400/20"
              >
                Next Mission (अगला मिशन) →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
