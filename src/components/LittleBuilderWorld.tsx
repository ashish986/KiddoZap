import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { BUILDER_LEVELS, BLOCKS_CATALOG, BuilderLevel, BlockItem } from '../data/builderLevels';
import { soundManager } from '../utils/audio';

interface PlacedBlock {
  id: string;
  gridX: number;
  gridY: number;
  blockId: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

const GRID_COLS = 16;
const GRID_ROWS = 10;
const CELL_SIZE = 50; // 16 * 50 = 800 width, 10 * 50 = 500 height

export const LittleBuilderWorld: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game Progress State
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [isSandbox, setIsSandbox] = useState<boolean>(false);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});

  // Building State
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlock[]>([]);
  const [history, setHistory] = useState<PlacedBlock[][]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string>('wall_brick_red');
  const [activeCategory, setActiveCategory] = useState<string>('structural');
  const [toolMode, setToolMode] = useState<'build' | 'erase'>('build');
  const [themeMode, setThemeMode] = useState<'day' | 'sunset' | 'night' | 'space'>('day');
  const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);
  const [showWinModal, setShowWinModal] = useState<boolean>(false);
  const [lastStarsEarned, setLastStarsEarned] = useState<number>(3);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Current active level object
  const currentLevel: BuilderLevel = BUILDER_LEVELS.find(l => l.id === currentLevelId) || BUILDER_LEVELS[0];

  // Available blocks in current mode
  const availableBlocks = isSandbox
    ? BLOCKS_CATALOG
    : BLOCKS_CATALOG.filter(b => currentLevel.unlockedBlockIds.includes(b.id));

  // Filtered by selected tray category
  const trayBlocks = availableBlocks.filter(b => b.category === activeCategory);

  // Particles for smoke, water, and celebration
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const windAngleRef = useRef<number>(0);

  // Load progress from LocalStorage
  useEffect(() => {
    try {
      const savedUnlocked = localStorage.getItem('kz_builder_unlocked');
      if (savedUnlocked) {
        setUnlockedLevels(JSON.parse(savedUnlocked));
      }
      const savedStars = localStorage.getItem('kz_builder_stars');
      if (savedStars) {
        setLevelStars(JSON.parse(savedStars));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save progress on change
  const saveProgress = (newUnlocked: number[], newStars: Record<number, number>) => {
    try {
      localStorage.setItem('kz_builder_unlocked', JSON.stringify(newUnlocked));
      localStorage.setItem('kz_builder_stars', JSON.stringify(newStars));
    } catch {
      // ignore
    }
  };

  // Sync theme with level on change
  useEffect(() => {
    if (!isSandbox) {
      setThemeMode(currentLevel.theme === 'nature' ? 'day' : currentLevel.theme);
      // Select first available block for level
      const firstBlock = BLOCKS_CATALOG.find(b => currentLevel.unlockedBlockIds.includes(b.id));
      if (firstBlock) {
        setSelectedBlockId(firstBlock.id);
        setActiveCategory(firstBlock.category);
      }
      // Reset blocks when level switches (keep starter blocks if any)
      const starter = (currentLevel.starterBlocks || []).map((sb, idx) => ({
        id: `starter_${idx}`,
        gridX: sb.x,
        gridY: sb.y,
        blockId: sb.blockId,
      }));
      setPlacedBlocks(starter);
      setHistory([]);
      setShowWinModal(false);
    }
  }, [currentLevelId, isSandbox]);

  // Push history
  const pushHistory = (newBlocks: PlacedBlock[]) => {
    setHistory(prev => [...prev.slice(-15), placedBlocks]);
    setPlacedBlocks(newBlocks);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setPlacedBlocks(previous);
    soundManager.playPop(0.9);
  };

  const handleClear = () => {
    if (placedBlocks.length === 0) return;
    pushHistory([]);
    soundManager.playCrash();
  };

  // Canvas Coordinate Mapping
  const getGridCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 500 / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const gridX = Math.floor(mouseX / CELL_SIZE);
    const gridY = Math.floor(mouseY / CELL_SIZE);

    if (gridX >= 0 && gridX < GRID_COLS && gridY >= 0 && gridY < GRID_ROWS) {
      return { gridX, gridY };
    }
    return null;
  };

  // Handle canvas click / block placement
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getGridCoords(e);
    if (!coords) return;
    const { gridX, gridY } = coords;

    if (toolMode === 'erase') {
      const existingIdx = placedBlocks.findIndex(b => b.gridX === gridX && b.gridY === gridY);
      if (existingIdx !== -1) {
        soundManager.playPop(0.8);
        const next = placedBlocks.filter((_, idx) => idx !== existingIdx);
        pushHistory(next);
      }
      return;
    }

    // Build mode: verify if cell is occupied
    const existingIdx = placedBlocks.findIndex(b => b.gridX === gridX && b.gridY === gridY);
    const selectedItem = BLOCKS_CATALOG.find(b => b.id === selectedBlockId);
    if (!selectedItem) return;

    if (existingIdx !== -1) {
      // Replace existing block
      const next = [...placedBlocks];
      next[existingIdx] = {
        id: `block_${Date.now()}_${Math.random()}`,
        gridX,
        gridY,
        blockId: selectedBlockId,
      };
      pushHistory(next);
      soundManager.playPop(1.1);
    } else {
      // Add new block
      const next = [
        ...placedBlocks,
        {
          id: `block_${Date.now()}_${Math.random()}`,
          gridX,
          gridY,
          blockId: selectedBlockId,
        },
      ];
      pushHistory(next);
      soundManager.playPop(1.2);
    }
  };

  // Check objective completion
  const checkObjectives = useCallback(() => {
    if (isSandbox) return { allMet: true, progress: [] };

    const progress = currentLevel.objectives.map(obj => {
      let currentCount = 0;

      if (obj.checkType === 'count') {
        currentCount = placedBlocks.filter(b => {
          if (obj.blockIds && obj.blockIds.includes(b.blockId)) return true;
          if (obj.blockCategory) {
            const item = BLOCKS_CATALOG.find(i => i.id === b.blockId);
            return item && item.category === obj.blockCategory;
          }
          return false;
        }).length;
      } else if (obj.checkType === 'height') {
        // Height is measured from bottom (row 9) upwards
        const occupiedY = placedBlocks.map(b => 9 - b.gridY);
        currentCount = occupiedY.length > 0 ? Math.max(...occupiedY) + 1 : 0;
      } else if (obj.checkType === 'total_blocks') {
        currentCount = placedBlocks.length;
      }

      const met = currentCount >= obj.targetCount;
      return {
        ...obj,
        currentCount,
        met,
      };
    });

    const allMet = progress.every(p => p.met);
    return { allMet, progress };
  }, [placedBlocks, currentLevel, isSandbox]);

  const { allMet, progress: objectiveProgress } = checkObjectives();

  // Test / Win validation
  const handleValidateBuild = () => {
    if (allMet) {
      soundManager.playWin();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#34d399', '#ec4899', '#818cf8'],
      });

      // Calculate stars (3 stars default, 2 stars if tight count)
      const stars = placedBlocks.length >= currentLevel.objectives.reduce((acc, o) => acc + o.targetCount, 0) + 2 ? 3 : 2;
      setLastStarsEarned(stars);

      // Unlock next level
      const nextId = currentLevelId + 1;
      const newUnlocked = Array.from(new Set([...unlockedLevels, nextId].filter(id => id <= BUILDER_LEVELS.length)));
      const newStars = { ...levelStars, [currentLevelId]: Math.max(levelStars[currentLevelId] || 0, stars) };

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
    if (currentLevelId < BUILDER_LEVELS.length) {
      setCurrentLevelId(currentLevelId + 1);
    } else {
      setIsSandbox(true);
    }
  };

  // Render Canvas Scene Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cloudX = 0;

    const render = () => {
      windAngleRef.current += 0.03;
      cloudX += 0.2;
      if (cloudX > 800) cloudX = -200;

      // 1. Draw Sky Background
      ctx.clearRect(0, 0, 800, 500);

      if (themeMode === 'day') {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 420);
        skyGrad.addColorStop(0, '#7dd3fc');
        skyGrad.addColorStop(1, '#e0f2fe');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 800, 500);

        // Sun
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(710, 80, 45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(254, 240, 138, 0.3)';
        ctx.beginPath();
        ctx.arc(710, 80, 60, 0, Math.PI * 2);
        ctx.fill();

        // Puffy Clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        const drawCloud = (cx: number, cy: number, scale: number) => {
          ctx.beginPath();
          ctx.arc(cx, cy, 24 * scale, 0, Math.PI * 2);
          ctx.arc(cx + 25 * scale, cy - 10 * scale, 30 * scale, 0, Math.PI * 2);
          ctx.arc(cx + 55 * scale, cy, 26 * scale, 0, Math.PI * 2);
          ctx.arc(cx + 80 * scale, cy + 5 * scale, 18 * scale, 0, Math.PI * 2);
          ctx.fill();
        };
        drawCloud(cloudX, 90, 1);
        drawCloud(cloudX - 450, 140, 0.8);
        drawCloud(cloudX + 400, 70, 0.9);
      } else if (themeMode === 'sunset') {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 420);
        skyGrad.addColorStop(0, '#f97316');
        skyGrad.addColorStop(0.5, '#fb923c');
        skyGrad.addColorStop(1, '#fde047');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 800, 500);

        // Setting Sun
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(400, 360, 60, 0, Math.PI * 2);
        ctx.fill();
      } else if (themeMode === 'night') {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 420);
        skyGrad.addColorStop(0, '#090d16');
        skyGrad.addColorStop(0.7, '#1e1b4b');
        skyGrad.addColorStop(1, '#312e81');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 800, 500);

        // Stars
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 40; i++) {
          const sx = (i * 97) % 800;
          const sy = (i * 53) % 320;
          const twinkle = Math.sin(windAngleRef.current * 2 + i) * 0.4 + 0.6;
          ctx.globalAlpha = twinkle;
          ctx.fillRect(sx, sy, 2, 2);
        }
        ctx.globalAlpha = 1.0;

        // Crescent Moon
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.arc(680, 80, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.arc(692, 74, 28, 0, Math.PI * 2);
        ctx.fill();
      } else if (themeMode === 'space') {
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, 800, 500);

        // Constellations
        ctx.fillStyle = '#38bdf8';
        for (let i = 0; i < 50; i++) {
          const sx = (i * 123) % 800;
          const sy = (i * 71) % 360;
          ctx.fillRect(sx, sy, 2, 2);
        }

        // Distant Blue Earth
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(120, 100, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(115, 95, 18, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Distant Hills / Background silhouettes
      if (themeMode !== 'space') {
        ctx.fillStyle = themeMode === 'night' ? '#111827' : '#86efac';
        ctx.beginPath();
        ctx.ellipse(200, 440, 350, 90, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = themeMode === 'night' ? '#0f172a' : '#4ade80';
        ctx.beginPath();
        ctx.ellipse(650, 430, 300, 80, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Ground Layer (Bottom Row Y=9)
      const groundY = 450;
      if (currentLevel.groundType === 'water_meadow') {
        // Left grass
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(0, groundY, 250, 50);
        // Center river
        const riverGrad = ctx.createLinearGradient(0, groundY, 0, 500);
        riverGrad.addColorStop(0, '#38bdf8');
        riverGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = riverGrad;
        ctx.fillRect(250, groundY, 300, 50);
        // Water ripples
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const rip = Math.sin(windAngleRef.current * 3) * 6;
        ctx.moveTo(280, groundY + 15 + rip);
        ctx.lineTo(340, groundY + 15 + rip);
        ctx.moveTo(420, groundY + 30 - rip);
        ctx.lineTo(490, groundY + 30 - rip);
        ctx.stroke();
        // Right grass
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(550, groundY, 250, 50);
      } else if (currentLevel.groundType === 'cobblestone') {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(0, groundY, 800, 50);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        for (let col = 0; col < 16; col++) {
          ctx.strokeRect(col * 50, groundY, 50, 50);
        }
      } else if (currentLevel.groundType === 'sand_ocean') {
        ctx.fillStyle = '#fde047';
        ctx.fillRect(0, groundY, 800, 50);
      } else if (currentLevel.groundType === 'space_lunar') {
        ctx.fillStyle = '#374151';
        ctx.fillRect(0, groundY, 800, 50);
        ctx.fillStyle = '#1f2937';
        ctx.beginPath();
        ctx.ellipse(300, groundY + 25, 40, 15, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Standard vibrant grass ground
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(0, groundY, 800, 50);
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(0, groundY, 800, 8); // Darker grass rim
      }

      // 4. Subtle Placement Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let c = 0; c <= GRID_COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * CELL_SIZE, 0);
        ctx.lineTo(c * CELL_SIZE, 500);
        ctx.stroke();
      }
      for (let r = 0; r <= GRID_ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * CELL_SIZE);
        ctx.lineTo(800, r * CELL_SIZE);
        ctx.stroke();
      }

      // 5. Draw Placed Blocks
      // Sort blocks so lower blocks and background walls render first, then roofs, decorations, and characters
      const sortedBlocks = [...placedBlocks].sort((a, b) => {
        if (a.gridY !== b.gridY) return a.gridY - b.gridY;
        return a.gridX - b.gridX;
      });

      sortedBlocks.forEach(block => {
        const px = block.gridX * CELL_SIZE;
        const py = block.gridY * CELL_SIZE;
        const item = BLOCKS_CATALOG.find(i => i.id === block.blockId);
        if (!item) return;

        ctx.save();

        switch (item.drawType) {
          case 'brick_red':
            ctx.fillStyle = '#e11d48';
            ctx.fillRect(px + 1, py + 1, 48, 48);
            // Brick pattern
            ctx.fillStyle = '#f43f5e';
            ctx.fillRect(px + 3, py + 4, 20, 18);
            ctx.fillRect(px + 27, py + 4, 20, 18);
            ctx.fillRect(px + 14, py + 26, 22, 18);
            ctx.strokeStyle = '#9f1239';
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 1, py + 1, 48, 48);
            break;

          case 'brick_blue':
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(px + 1, py + 1, 48, 48);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(px + 3, py + 4, 42, 18);
            ctx.strokeStyle = '#0369a1';
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 1, py + 1, 48, 48);
            break;

          case 'wood_plank':
            ctx.fillStyle = '#b45309';
            ctx.fillRect(px + 1, py + 1, 48, 48);
            ctx.fillStyle = '#d97706';
            ctx.fillRect(px + 2, py + 6, 46, 10);
            ctx.fillRect(px + 2, py + 20, 46, 10);
            ctx.fillRect(px + 2, py + 34, 46, 10);
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 1;
            ctx.strokeRect(px + 1, py + 1, 48, 48);
            break;

          case 'castle_stone':
            ctx.fillStyle = '#64748b';
            ctx.fillRect(px + 1, py + 1, 48, 48);
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 1, py + 1, 48, 48);
            ctx.beginPath();
            ctx.moveTo(px + 25, py);
            ctx.lineTo(px + 25, py + 25);
            ctx.moveTo(px, py + 25);
            ctx.lineTo(px + 50, py + 25);
            ctx.stroke();
            break;

          case 'pillar':
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(px + 8, py + 1, 34, 48);
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(px + 12, py + 4, 6, 40);
            ctx.fillRect(px + 32, py + 4, 6, 40);
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 4, py + 1, 42, 8);
            ctx.strokeRect(px + 4, py + 41, 42, 8);
            break;

          case 'arch':
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(px + 1, py + 1, 48, 14);
            ctx.fillRect(px + 1, py + 14, 12, 35);
            ctx.fillRect(px + 37, py + 14, 12, 35);
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 1, py + 1, 48, 48);
            break;

          case 'girder':
            ctx.fillStyle = '#475569';
            ctx.fillRect(px + 2, py + 10, 46, 10);
            ctx.fillRect(px + 2, py + 30, 46, 10);
            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(px + 5, py + 15);
            ctx.lineTo(px + 45, py + 35);
            ctx.moveTo(px + 45, py + 15);
            ctx.lineTo(px + 5, py + 35);
            ctx.stroke();
            break;

          case 'roof_red':
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.moveTo(px - 4, py + 49);
            ctx.lineTo(px + 25, py + 2);
            ctx.lineTo(px + 54, py + 49);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#991b1b';
            ctx.lineWidth = 3;
            ctx.stroke();
            break;

          case 'roof_blue':
            ctx.fillStyle = '#2563eb';
            ctx.beginPath();
            ctx.moveTo(px - 4, py + 49);
            ctx.lineTo(px + 25, py + 2);
            ctx.lineTo(px + 54, py + 49);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#1d4ed8';
            ctx.lineWidth = 3;
            ctx.stroke();
            break;

          case 'battlement':
            ctx.fillStyle = '#475569';
            ctx.fillRect(px + 2, py + 18, 46, 31);
            ctx.fillRect(px + 2, py + 4, 12, 16);
            ctx.fillRect(px + 36, py + 4, 12, 16);
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 2, py + 18, 46, 31);
            break;

          case 'dome_gold':
            ctx.fillStyle = '#eab308';
            ctx.beginPath();
            ctx.arc(px + 25, py + 40, 24, Math.PI, 0);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#ca8a04';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillRect(px + 23, py + 8, 4, 10);
            break;

          case 'chimney':
            ctx.fillStyle = '#991b1b';
            ctx.fillRect(px + 14, py + 10, 22, 39);
            ctx.fillStyle = '#b91c1c';
            ctx.fillRect(px + 10, py + 6, 30, 8);
            // Spawn smoke particle occasionally
            if (Math.random() < 0.25) {
              particlesRef.current.push({
                x: px + 25,
                y: py + 6,
                vx: (Math.random() - 0.5) * 0.4 + 0.3,
                vy: -0.8 - Math.random() * 0.5,
                size: 4 + Math.random() * 4,
                color: '#cbd5e1',
                alpha: 0.6,
                life: 0,
                maxLife: 60,
              });
            }
            break;

          case 'door_wood':
            ctx.fillStyle = '#78350f';
            ctx.beginPath();
            ctx.arc(px + 25, py + 20, 18, Math.PI, 0);
            ctx.rect(px + 7, py + 20, 36, 29);
            ctx.fill();
            ctx.fillStyle = '#f59e0b'; // Gold handle
            ctx.beginPath();
            ctx.arc(px + 34, py + 32, 3, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'castle_gate':
            ctx.fillStyle = '#334155';
            ctx.fillRect(px + 4, py + 4, 42, 45);
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2;
            for (let g = 0; g < 4; g++) {
              ctx.strokeRect(px + 8 + g * 9, py + 6, 6, 42);
            }
            break;

          case 'window_square':
            ctx.fillStyle = themeMode === 'night' ? '#fef08a' : '#38bdf8';
            ctx.fillRect(px + 10, py + 10, 30, 30);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 10, py + 10, 30, 30);
            ctx.beginPath();
            ctx.moveTo(px + 25, py + 10);
            ctx.lineTo(px + 25, py + 40);
            ctx.moveTo(px + 10, py + 25);
            ctx.lineTo(px + 40, py + 25);
            ctx.stroke();
            break;

          case 'window_arched':
            ctx.fillStyle = themeMode === 'night' ? '#fef08a' : '#818cf8';
            ctx.beginPath();
            ctx.arc(px + 25, py + 20, 14, Math.PI, 0);
            ctx.rect(px + 11, py + 20, 28, 20);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            break;

          case 'balcony':
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(px + 10, py + 4, 30, 30);
            // Railing & flowers
            ctx.fillStyle = '#f43f5e';
            ctx.fillRect(px + 4, py + 34, 42, 12);
            ctx.fillStyle = '#fb7185';
            ctx.beginPath();
            ctx.arc(px + 12, py + 34, 4, 0, Math.PI * 2);
            ctx.arc(px + 25, py + 34, 5, 0, Math.PI * 2);
            ctx.arc(px + 38, py + 34, 4, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'tree_pine':
            ctx.fillStyle = '#78350f';
            ctx.fillRect(px + 21, py + 32, 8, 17);
            ctx.fillStyle = '#15803d';
            ctx.beginPath();
            ctx.moveTo(px + 25, py + 2);
            ctx.lineTo(px + 6, py + 34);
            ctx.lineTo(px + 44, py + 34);
            ctx.closePath();
            ctx.fill();
            break;

          case 'tree_oak':
            ctx.fillStyle = '#78350f';
            ctx.fillRect(px + 20, py + 30, 10, 19);
            ctx.fillStyle = '#16a34a';
            ctx.beginPath();
            ctx.arc(px + 25, py + 20, 22, 0, Math.PI * 2);
            ctx.arc(px + 12, py + 18, 14, 0, Math.PI * 2);
            ctx.arc(px + 38, py + 18, 14, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'flowers':
            ctx.fillStyle = '#15803d';
            ctx.fillRect(px + 8, py + 35, 34, 14);
            // Blossoms
            const blossomColors = ['#ec4899', '#f43f5e', '#fbbf24', '#a855f7'];
            for (let f = 0; f < 4; f++) {
              ctx.fillStyle = blossomColors[f % blossomColors.length];
              ctx.beginPath();
              ctx.arc(px + 12 + f * 9, py + 32 + (f % 2) * 4, 5, 0, Math.PI * 2);
              ctx.fill();
            }
            break;

          case 'water_pond':
            ctx.fillStyle = '#06b6d4';
            ctx.beginPath();
            ctx.ellipse(px + 25, py + 30, 22, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#67e8f9';
            ctx.lineWidth = 2;
            ctx.stroke();
            break;

          case 'fence':
            ctx.fillStyle = '#ca8a04';
            ctx.fillRect(px + 6, py + 22, 38, 5);
            ctx.fillRect(px + 6, py + 38, 38, 5);
            for (let fc = 0; fc < 3; fc++) {
              ctx.fillRect(px + 10 + fc * 14, py + 12, 6, 36);
            }
            break;

          case 'streetlamp':
            ctx.fillStyle = '#334155';
            ctx.fillRect(px + 23, py + 12, 4, 37);
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(px + 25, py + 12, 8, 0, Math.PI * 2);
            ctx.fill();
            if (themeMode === 'night') {
              ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
              ctx.beginPath();
              ctx.arc(px + 25, py + 12, 32, 0, Math.PI * 2);
              ctx.fill();
            }
            break;

          case 'flag_red':
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(px + 10, py + 4, 3, 45);
            const wave = Math.sin(windAngleRef.current * 2) * 4;
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(px + 13, py + 6);
            ctx.lineTo(px + 40, py + 14 + wave);
            ctx.lineTo(px + 13, py + 22);
            ctx.closePath();
            ctx.fill();
            break;

          case 'windmill':
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(px + 23, py + 25, 4, 24);
            ctx.save();
            ctx.translate(px + 25, py + 25);
            ctx.rotate(windAngleRef.current);
            ctx.fillStyle = '#3b82f6';
            for (let blade = 0; blade < 4; blade++) {
              ctx.rotate(Math.PI / 2);
              ctx.fillRect(-3, -24, 6, 24);
            }
            ctx.restore();
            break;

          case 'solar_panel':
            ctx.fillStyle = '#0284c7';
            ctx.beginPath();
            ctx.moveTo(px + 4, py + 40);
            ctx.lineTo(px + 12, py + 12);
            ctx.lineTo(px + 44, py + 12);
            ctx.lineTo(px + 44, py + 40);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#e0f2fe';
            ctx.lineWidth = 1;
            ctx.stroke();
            break;

          case 'rocket_thruster':
            ctx.fillStyle = '#f1f5f9';
            ctx.fillRect(px + 14, py + 6, 22, 38);
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.moveTo(px + 25, py + 2);
            ctx.lineTo(px + 14, py + 16);
            ctx.lineTo(px + 36, py + 16);
            ctx.closePath();
            ctx.fill();
            break;

          case 'radar_dish':
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(px + 23, py + 25, 4, 24);
            ctx.beginPath();
            ctx.arc(px + 25, py + 18, 16, Math.PI * 1.2, Math.PI * 1.8);
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#cbd5e1';
            ctx.stroke();
            break;

          case 'kid_builder':
            // Cute animated kid builder
            const bounce = Math.sin(windAngleRef.current * 3) * 2;
            ctx.fillStyle = '#facc15'; // Helmet
            ctx.beginPath();
            ctx.arc(px + 25, py + 22 + bounce, 10, Math.PI, 0);
            ctx.fill();
            ctx.fillStyle = '#fed7aa'; // Face
            ctx.beginPath();
            ctx.arc(px + 25, py + 26 + bounce, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0284c7'; // Overalls
            ctx.fillRect(px + 18, py + 32 + bounce, 14, 15);
            break;

          case 'cat':
            ctx.fillStyle = '#fb923c';
            ctx.beginPath();
            ctx.ellipse(px + 24, py + 38, 10, 7, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(px + 32, py + 33, 6, 0, Math.PI * 2);
            ctx.fill();
            // Tail
            ctx.strokeStyle = '#ea580c';
            ctx.lineWidth = 2;
            ctx.beginPath();
            const tailWag = Math.sin(windAngleRef.current * 4) * 3;
            ctx.moveTo(px + 14, py + 36);
            ctx.quadraticCurveTo(px + 10, py + 26 + tailWag, px + 8, py + 30);
            ctx.stroke();
            break;

          case 'dog':
            ctx.fillStyle = '#fcd34d';
            ctx.beginPath();
            ctx.ellipse(px + 25, py + 36, 12, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(px + 34, py + 31, 7, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'duck':
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.ellipse(px + 25, py + 38, 9, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f97316';
            ctx.fillRect(px + 32, py + 36, 4, 3);
            break;

          default:
            ctx.fillStyle = item.color;
            ctx.fillRect(px + 2, py + 2, 46, 46);
            break;
        }

        ctx.restore();
      });

      // 6. Draw Smoke / Sparkle Particles
      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;
        p.alpha = 1 - p.life / p.maxLife;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(idx, 1);
        }
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [placedBlocks, themeMode, currentLevel.groundType]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 font-sans">
      {/* Top Banner / HUD */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
              🏗️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  KiddoZap&apos;s Little Builder World
                </h1>
                <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded uppercase">
                  {isSandbox ? 'Free Creative Mode' : `Campaign Level ${currentLevel.id}/12`}
                </span>
              </div>
              <p className="text-xs text-amber-300 font-bold mt-0.5">
                {isSandbox ? 'Infinite Sandbox: Build any architectural wonder you imagine!' : currentLevel.title}
              </p>
            </div>
          </div>

          {/* Quick HUD controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowLevelSelect(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>🗺️</span> Levels ({Object.keys(levelStars).length}/12)
            </button>
            <button
              onClick={() => {
                const themes: Array<'day' | 'sunset' | 'night' | 'space'> = ['day', 'sunset', 'night', 'space'];
                const nextIdx = (themes.indexOf(themeMode) + 1) % themes.length;
                setThemeMode(themes[nextIdx]);
                soundManager.playPop();
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="Toggle Day/Sunset/Night lighting"
            >
              {themeMode === 'day' && '☀️ Day'}
              {themeMode === 'sunset' && '🌅 Sunset'}
              {themeMode === 'night' && '🌙 Night'}
              {themeMode === 'space' && '🚀 Space'}
            </button>
            <button
              onClick={() => {
                soundManager.toggleMute();
                setIsMuted(soundManager.isMuted());
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="Toggle Sound"
            >
              {isMuted ? '🔇 Muted' : '🔊 Sound'}
            </button>
          </div>
        </div>

        {/* Level Story & Objectives Box */}
        {!isSandbox && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Story */}
            <div className="md:col-span-1 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
              <span className="text-[11px] font-black text-amber-400 block mb-1">📜 Mission Story:</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {currentLevel.story}
              </p>
            </div>

            {/* Checklist */}
            <div className="md:col-span-2 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black text-emerald-400">🎯 Building Objectives:</span>
                <span className="text-[10px] font-bold text-slate-400">
                  {objectiveProgress.filter(p => p.met).length} of {objectiveProgress.length} complete
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {objectiveProgress.map(obj => (
                  <div
                    key={obj.id}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                      obj.met
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{obj.met ? '✅' : '⚪'}</span>
                      <span>{obj.label}</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {obj.currentCount}/{obj.targetCount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-3 sm:p-5 shadow-2xl mb-6 flex flex-col items-center">
        <div className="relative w-full aspect-[8/5] max-h-[520px] rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-inner bg-slate-950">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            onClick={handleCanvasClick}
            className={`w-full h-full block ${toolMode === 'erase' ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
          />

          {/* Quick Floating Actions overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white disabled:opacity-40 transition-colors cursor-pointer text-xs font-bold"
              title="Undo last block"
            >
              ↩️ Undo
            </button>
            <button
              onClick={handleClear}
              className="p-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-200 transition-colors cursor-pointer text-xs font-bold"
              title="Clear entire canvas"
            >
              🗑️ Clear
            </button>
          </div>

          {/* Mode Badge in Canvas */}
          <div className="absolute bottom-3 left-3 px-3 py-1 bg-slate-950/85 backdrop-blur-xs rounded-full border border-slate-800 text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <span>{toolMode === 'build' ? '✏️ Build Active' : '🧹 Eraser Active'}</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-amber-400">{placedBlocks.length} Blocks Placed</span>
          </div>
        </div>

        {/* Validate / Finish Button */}
        {!isSandbox && (
          <div className="mt-4 w-full flex justify-end">
            <button
              onClick={handleValidateBuild}
              className={`w-full sm:w-auto px-8 py-3 rounded-2xl font-black text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                allMet
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:scale-105 shadow-emerald-500/30 animate-pulse'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span>{allMet ? '🎉' : '🔍'}</span>
              <span>{allMet ? 'Objectives Met! Check & Complete Level' : 'Check Level Goals'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Building Tray & Palette */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl mb-12">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 border-b border-slate-800/80 scrollbar-none">
          <button
            onClick={() => {
              setToolMode('build');
              setActiveCategory('structural');
              soundManager.playPop();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              toolMode === 'build' && activeCategory === 'structural'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🧱 Walls &amp; Blocks
          </button>

          <button
            onClick={() => {
              setToolMode('build');
              setActiveCategory('roofs');
              soundManager.playPop();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              toolMode === 'build' && activeCategory === 'roofs'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🏠 Roofs &amp; Tops
          </button>

          <button
            onClick={() => {
              setToolMode('build');
              setActiveCategory('openings');
              soundManager.playPop();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              toolMode === 'build' && activeCategory === 'openings'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🚪 Doors &amp; Windows
          </button>

          <button
            onClick={() => {
              setToolMode('build');
              setActiveCategory('nature');
              soundManager.playPop();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              toolMode === 'build' && activeCategory === 'nature'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🌳 Nature &amp; Garden
          </button>

          <button
            onClick={() => {
              setToolMode('build');
              setActiveCategory('props');
              soundManager.playPop();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              toolMode === 'build' && activeCategory === 'props'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🏮 Props &amp; Special
          </button>

          <button
            onClick={() => {
              setToolMode('build');
              setActiveCategory('characters');
              soundManager.playPop();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              toolMode === 'build' && activeCategory === 'characters'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🐶 Characters &amp; Pets
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1 flex-shrink-0" />

          {/* Eraser Toggle */}
          <button
            onClick={() => {
              setToolMode('erase');
              soundManager.playPop();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              toolMode === 'erase'
                ? 'bg-rose-500 text-white font-black shadow-lg shadow-rose-500/20 scale-105'
                : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
            }`}
          >
            🧹 Eraser Tool
          </button>
        </div>

        {/* Blocks Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {trayBlocks.length === 0 ? (
            <div className="col-span-full py-6 text-center text-xs text-slate-400">
              No items unlocked in this category for this level yet. Complete missions to unlock! 🌟
            </div>
          ) : (
            trayBlocks.map(block => (
              <button
                key={block.id}
                onClick={() => {
                  setToolMode('build');
                  setSelectedBlockId(block.id);
                  soundManager.playPop();
                }}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  toolMode === 'build' && selectedBlockId === block.id
                    ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <span className="text-2xl">{block.icon}</span>
                <span className="text-[11px] font-bold text-center leading-tight truncate w-full">
                  {block.name}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Level Select Modal */}
      {showLevelSelect && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowLevelSelect(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-white">Select Builder Mission</h3>
                <p className="text-xs text-slate-400">Master all 12 progressive architectural levels</p>
              </div>
              <button
                onClick={() => setShowLevelSelect(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Campaign Levels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {BUILDER_LEVELS.map(level => {
                const isUnlocked = unlockedLevels.includes(level.id);
                const stars = levelStars[level.id] || 0;

                return (
                  <div
                    key={level.id}
                    onClick={() => {
                      if (isUnlocked) {
                        setIsSandbox(false);
                        setCurrentLevelId(level.id);
                        setShowLevelSelect(false);
                        soundManager.playPop();
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all ${
                      isUnlocked
                        ? 'bg-slate-950 hover:bg-slate-800 border-slate-800 cursor-pointer hover:border-amber-400/50'
                        : 'bg-slate-950/40 border-slate-900 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-amber-400">Level {level.id}</span>
                      <div className="flex items-center text-xs">
                        {isUnlocked ? (
                          <span>{'⭐'.repeat(stars) || '⚪⚪⚪'}</span>
                        ) : (
                          <span className="text-slate-600">🔒 Locked</span>
                        )}
                      </div>
                    </div>
                    <h4 className="font-extrabold text-white text-sm mb-1">{level.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{level.subtitle}</p>
                  </div>
                );
              })}
            </div>

            {/* Free Sandbox Banner */}
            <div
              onClick={() => {
                setIsSandbox(true);
                setShowLevelSelect(false);
                soundManager.playPop();
              }}
              className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 hover:border-amber-400 cursor-pointer flex items-center justify-between"
            >
              <div>
                <h4 className="font-black text-amber-300 text-sm">🎨 Free Creative Sandbox Mode</h4>
                <p className="text-xs text-slate-300">All 30+ blocks unlocked. No objectives or time limits!</p>
              </div>
              <span className="px-4 py-2 bg-amber-400 text-slate-950 font-black rounded-xl text-xs">
                Launch Sandbox ⚡
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
            <h3 className="text-2xl font-black text-white mb-1">Level Complete!</h3>
            <p className="text-xs text-amber-400 font-bold mb-4">{currentLevel.title}</p>

            <div className="text-3xl mb-4 tracking-widest">
              {'⭐'.repeat(lastStarsEarned)}
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left mb-6">
              <span className="text-[11px] font-black text-amber-400 block mb-1">
                🏆 Badge Awarded: {currentLevel.rewardBadge}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Architectural Insight:</strong> {currentLevel.architectureLesson}
              </p>
            </div>

            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() => setShowWinModal(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Keep Admiring Build
              </button>
              <button
                onClick={handleNextLevel}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs transition-transform hover:scale-105 cursor-pointer shadow-lg shadow-amber-400/20"
              >
                Next Mission →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
