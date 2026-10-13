/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Trophy, Flag, Sparkles, Volume2 } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  lang: Language;
  onBack: () => void;
  onGameComplete: (stars: number, score: number) => void;
}

interface Wall {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  bounce?: number;
}

interface Hazard {
  type: 'sand' | 'water';
  x: number;
  y: number;
  w: number;
  h: number;
  radius?: number;
}

interface CourseHole {
  name: string;
  nameHi: string;
  par: number;
  ballStart: { x: number; y: number };
  holePos: { x: number; y: number };
  walls: Wall[];
  hazards: Hazard[];
}

const HOLES: CourseHole[] = [
  // Hole 1: Warmup Straightaway
  {
    name: 'Green Oasis',
    nameHi: 'हरित मैदान',
    par: 2,
    ballStart: { x: 190, y: 440 },
    holePos: { x: 190, y: 110 },
    walls: [
      { x1: 50, y1: 50, x2: 330, y2: 50 },
      { x1: 330, y1: 50, x2: 330, y2: 470 },
      { x1: 330, y1: 470, x2: 50, y2: 470 },
      { x1: 50, y1: 470, x2: 50, y2: 50 },
      // Obstacle bumper in center
      { x1: 150, y1: 260, x2: 230, y2: 260 },
      { x1: 230, y1: 260, x2: 230, y2: 280 },
      { x1: 230, y1: 280, x2: 150, y2: 280 },
      { x1: 150, y1: 280, x2: 150, y2: 260 },
    ],
    hazards: [
      { type: 'sand', x: 70, y: 180, w: 70, h: 80 },
      { type: 'sand', x: 240, y: 180, w: 70, h: 80 },
    ],
  },
  // Hole 2: Angled Dogleg
  {
    name: 'Dogleg Corner',
    nameHi: 'घुमावदार मोड़',
    par: 3,
    ballStart: { x: 90, y: 440 },
    holePos: { x: 280, y: 90 },
    walls: [
      { x1: 40, y1: 200, x2: 200, y2: 200 },
      { x1: 200, y1: 200, x2: 200, y2: 50 },
      { x1: 200, y1: 50, x2: 340, y2: 50 },
      { x1: 340, y1: 50, x2: 340, y2: 320 },
      { x1: 340, y1: 320, x2: 180, y2: 320 },
      { x1: 180, y1: 320, x2: 180, y2: 470 },
      { x1: 180, y1: 470, x2: 40, y2: 470 },
      { x1: 40, y1: 470, x2: 40, y2: 200 },
    ],
    hazards: [
      { type: 'sand', x: 215, y: 170, w: 100, h: 60 },
    ],
  },
  // Hole 3: Sand Bunkers Island
  {
    name: 'Bunker Maze',
    nameHi: 'रेत की भूलभुलैया',
    par: 3,
    ballStart: { x: 190, y: 440 },
    holePos: { x: 190, y: 90 },
    walls: [
      { x1: 50, y1: 50, x2: 330, y2: 50 },
      { x1: 330, y1: 50, x2: 330, y2: 470 },
      { x1: 330, y1: 470, x2: 50, y2: 470 },
      { x1: 50, y1: 470, x2: 50, y2: 50 },
      // Left chevron
      { x1: 50, y1: 220, x2: 140, y2: 250 },
      { x1: 140, y1: 250, x2: 50, y2: 280 },
      // Right chevron
      { x1: 330, y1: 220, x2: 240, y2: 250 },
      { x1: 240, y1: 250, x2: 330, y2: 280 },
    ],
    hazards: [
      { type: 'sand', x: 150, y: 160, w: 80, h: 50 },
      { type: 'water', x: 160, y: 310, w: 60, h: 60 },
    ],
  },
  // Hole 4: Narrow Bridge over Blue Water
  {
    name: 'Water Canyon',
    nameHi: 'जल खाई पुल',
    par: 3,
    ballStart: { x: 190, y: 440 },
    holePos: { x: 190, y: 80 },
    walls: [
      { x1: 50, y1: 50, x2: 330, y2: 50 },
      { x1: 330, y1: 50, x2: 330, y2: 470 },
      { x1: 330, y1: 470, x2: 50, y2: 470 },
      { x1: 50, y1: 470, x2: 50, y2: 50 },
      // Funnel guiding to center
      { x1: 50, y1: 200, x2: 130, y2: 250 },
      { x1: 130, y1: 250, x2: 130, y2: 290 },
      { x1: 330, y1: 200, x2: 250, y2: 250 },
      { x1: 250, y1: 250, x2: 250, y2: 290 },
    ],
    hazards: [
      { type: 'water', x: 50, y: 200, w: 80, h: 100 },
      { type: 'water', x: 250, y: 200, w: 80, h: 100 },
      { type: 'sand', x: 160, y: 130, w: 60, h: 40 },
    ],
  },
  // Hole 5: Diamond Chamber
  {
    name: 'Diamond Chamber',
    nameHi: 'हीरा कक्ष',
    par: 4,
    ballStart: { x: 190, y: 440 },
    holePos: { x: 190, y: 90 },
    walls: [
      { x1: 50, y1: 50, x2: 330, y2: 50 },
      { x1: 330, y1: 50, x2: 330, y2: 470 },
      { x1: 330, y1: 470, x2: 50, y2: 470 },
      { x1: 50, y1: 470, x2: 50, y2: 50 },
      // Diamond center obstacle
      { x1: 190, y1: 210, x2: 240, y2: 260 },
      { x1: 240, y1: 260, x2: 190, y2: 310 },
      { x1: 190, y1: 310, x2: 140, y2: 260 },
      { x1: 140, y1: 260, x2: 190, y2: 210 },
    ],
    hazards: [
      { type: 'sand', x: 80, y: 120, w: 50, h: 50 },
      { type: 'sand', x: 250, y: 120, w: 50, h: 50 },
    ],
  },
  // Hole 6: The Championship Cup
  {
    name: 'Grand Finale Cup',
    nameHi: 'ग्रैंड फिनाले कप',
    par: 4,
    ballStart: { x: 80, y: 440 },
    holePos: { x: 300, y: 80 },
    walls: [
      { x1: 40, y1: 40, x2: 340, y2: 40 },
      { x1: 340, y1: 40, x2: 340, y2: 480 },
      { x1: 340, y1: 480, x2: 40, y2: 480 },
      { x1: 40, y1: 480, x2: 40, y2: 40 },
      // Staggered horizontal barriers
      { x1: 40, y1: 350, x2: 240, y2: 350 },
      { x1: 140, y1: 230, x2: 340, y2: 230 },
      { x1: 40, y1: 140, x2: 220, y2: 140 },
    ],
    hazards: [
      { type: 'sand', x: 260, y: 365, w: 60, h: 50 },
      { type: 'water', x: 55, y: 245, w: 70, h: 60 },
    ],
  },
];

export const MiniGolf: React.FC<Props> = ({ lang, onBack, onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [currentHoleIdx, setCurrentHoleIdx] = useState<number>(0);
  const [holeStrokes, setHoleStrokes] = useState<number>(0);
  const [totalStrokes, setTotalStrokes] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('kiddozap_golf_best') || '0', 10);
  });
  const [holeResult, setHoleResult] = useState<string | null>(null);
  const [isAiming, setIsAiming] = useState<boolean>(false);
  const [aimPower, setAimPower] = useState<number>(0);
  const [courseCompleted, setCourseCompleted] = useState<boolean>(false);

  // Ball & Physics in ref
  const simRef = useRef({
    ball: {
      x: 190,
      y: 440,
      vx: 0,
      vy: 0,
      radius: 7,
      isRolling: false,
      lastStationaryPos: { x: 190, y: 440 },
      inHole: false,
    },
    aim: {
      isDragging: false,
      startX: 0,
      startY: 0,
      currX: 0,
      currY: 0,
      angle: 0,
      power: 0,
    },
    cupAnim: 0,
    flagFlutter: 0,
    lastTime: performance.now(),
  });

  const loadHole = (idx: number) => {
    const course = HOLES[idx];
    const s = simRef.current;
    s.ball.x = course.ballStart.x;
    s.ball.y = course.ballStart.y;
    s.ball.vx = 0;
    s.ball.vy = 0;
    s.ball.isRolling = false;
    s.ball.inHole = false;
    s.ball.lastStationaryPos = { ...course.ballStart };
    s.cupAnim = 0;

    setCurrentHoleIdx(idx);
    setHoleStrokes(0);
    setHoleResult(null);
  };

  useEffect(() => {
    loadHole(0);
  }, []);

  // Distance to line segment helper for wall collisions
  const distToSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (l2 === 0) return { dist: Math.hypot(px - x1, py - y1), nx: 0, ny: 0, cx: x1, cy: y1 };
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    const cx = x1 + t * (x2 - x1);
    const cy = y1 + t * (y2 - y1);
    const dist = Math.hypot(px - cx, py - cy);
    const nx = (px - cx) / (dist || 1);
    const ny = (py - cy) / (dist || 1);
    return { dist, nx, ny, cx, cy };
  };

  // Touch / Mouse Aiming Event Handlers
  const handlePointerDown = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    const s = simRef.current;
    if (s.ball.isRolling || s.ball.inHole || holeResult) return;

    // Check if clicked near the ball (within 60px)
    const distToBall = Math.hypot(x - s.ball.x, y - s.ball.y);
    if (distToBall < 65) {
      s.aim.isDragging = true;
      s.aim.startX = s.ball.x;
      s.aim.startY = s.ball.y;
      s.aim.currX = x;
      s.aim.currY = y;
      setIsAiming(true);
    }
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    const s = simRef.current;
    if (!s.aim.isDragging) return;

    s.aim.currX = x;
    s.aim.currY = y;

    // Pullback direction: drag opposite to shoot direction
    const dx = s.aim.startX - x;
    const dy = s.aim.startY - y;
    const dragDist = Math.hypot(dx, dy);
    const maxDrag = 140;
    const clampedDist = Math.min(dragDist, maxDrag);
    const powerNorm = clampedDist / maxDrag;

    s.aim.power = powerNorm;
    s.aim.angle = Math.atan2(dy, dx);
    setAimPower(Math.round(powerNorm * 100));
  };

  const handlePointerUp = () => {
    const s = simRef.current;
    if (!s.aim.isDragging) return;
    s.aim.isDragging = false;
    setIsAiming(false);
    setAimPower(0);

    if (s.aim.power > 0.08) {
      // Release shot!
      const launchSpeed = s.aim.power * 850; // max speed pixels/sec
      s.ball.vx = Math.cos(s.aim.angle) * launchSpeed;
      s.ball.vy = Math.sin(s.aim.angle) * launchSpeed;
      s.ball.isRolling = true;
      s.ball.lastStationaryPos = { x: s.ball.x, y: s.ball.y };

      sounds.playGolfPutt();
      setHoleStrokes((prev) => prev + 1);
      setTotalStrokes((prev) => prev + 1);
    }
  };

  // Main Canvas Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    simRef.current.lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - simRef.current.lastTime) / 1000, 0.035);
      simRef.current.lastTime = now;

      const s = simRef.current;
      const hole = HOLES[currentHoleIdx];
      const w = canvas.width;
      const h = canvas.height;

      s.flagFlutter += dt * 5;

      // 1. Ball Physics
      if (s.ball.isRolling && !s.ball.inHole) {
        // Step sub-frames for precise collision resolution
        const subSteps = 4;
        const subDt = dt / subSteps;

        for (let step = 0; step < subSteps; step++) {
          s.ball.x += s.ball.vx * subDt;
          s.ball.y += s.ball.vy * subDt;

          const speed = Math.hypot(s.ball.vx, s.ball.vy);

          // Friction & Terrain resistance
          let friction = 0.985;

          // Check Sand Hazards
          hole.hazards.forEach((hz) => {
            if (
              hz.type === 'sand' &&
              s.ball.x >= hz.x &&
              s.ball.x <= hz.x + hz.w &&
              s.ball.y >= hz.y &&
              s.ball.y <= hz.y + hz.h
            ) {
              friction = 0.94; // heavy sand drag
            }
          });

          // Check Water Hazards (Splash & reset)
          hole.hazards.forEach((hz) => {
            if (
              hz.type === 'water' &&
              s.ball.x >= hz.x &&
              s.ball.x <= hz.x + hz.w &&
              s.ball.y >= hz.y &&
              s.ball.y <= hz.y + hz.h
            ) {
              sounds.playPop(0.5);
              s.ball.x = s.ball.lastStationaryPos.x;
              s.ball.y = s.ball.lastStationaryPos.y;
              s.ball.vx = 0;
              s.ball.vy = 0;
              s.ball.isRolling = false;
            }
          });

          // Wall Collisions
          hole.walls.forEach((wall) => {
            const { dist, nx, ny } = distToSegment(
              s.ball.x,
              s.ball.y,
              wall.x1,
              wall.y1,
              wall.x2,
              wall.y2
            );
            if (dist < s.ball.radius) {
              // Push out of wall
              const overlap = s.ball.radius - dist;
              s.ball.x += nx * overlap;
              s.ball.y += ny * overlap;

              // Reflect velocity vector
              const dot = s.ball.vx * nx + s.ball.vy * ny;
              if (dot < 0) {
                const bounce = wall.bounce || 0.78;
                s.ball.vx = (s.ball.vx - 2 * dot * nx) * bounce;
                s.ball.vy = (s.ball.vy - 2 * dot * ny) * bounce;
                sounds.playBounce(220);
              }
            }
          });

          // Cup Hole Gravitational Pull
          const distToHole = Math.hypot(s.ball.x - hole.holePos.x, s.ball.y - hole.holePos.y);
          const cupRadius = 14;

          if (distToHole < 30 && speed < 320) {
            // Magnetic pull into the cup
            const pullFactor = 120 * subDt;
            s.ball.vx += ((hole.holePos.x - s.ball.x) / distToHole) * pullFactor;
            s.ball.vy += ((hole.holePos.y - s.ball.y) / distToHole) * pullFactor;
          }

          // Sunk into Hole!
          if (distToHole < cupRadius && speed < 190) {
            s.ball.inHole = true;
            s.ball.isRolling = false;
            s.ball.vx = 0;
            s.ball.vy = 0;
            s.ball.x = hole.holePos.x;
            s.ball.y = hole.holePos.y;

            sounds.playCupDrop();
            confetti({ particleCount: 65, spread: 60, origin: { y: 0.35 } });

            // Determine Score Name
            const strokes = holeStrokes + 1; // current stroke
            let title = 'PAR!';
            if (strokes === 1) title = 'HOLE IN ONE! 🏆';
            else if (strokes < hole.par) title = 'BIRDIE! 🐦';
            else if (strokes === hole.par) title = 'PAR! ⛳';
            else title = 'NICE PUTT! 👏';

            setHoleResult(title);
            break;
          }

          // Apply deceleration
          s.ball.vx *= friction;
          s.ball.vy *= friction;

          if (Math.hypot(s.ball.vx, s.ball.vy) < 8) {
            s.ball.vx = 0;
            s.ball.vy = 0;
            s.ball.isRolling = false;
            break;
          }
        }
      }

      // 2. Render Course
      ctx.clearRect(0, 0, w, h);

      // Putting Green Turf
      const greenGrad = ctx.createLinearGradient(0, 0, 0, h);
      greenGrad.addColorStop(0, '#15803d');
      greenGrad.addColorStop(0.5, '#16a34a');
      greenGrad.addColorStop(1, '#15803d');
      ctx.fillStyle = greenGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle Turf Grid pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Hazards (Sand & Water)
      hole.hazards.forEach((hz) => {
        if (hz.type === 'sand') {
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(hz.x, hz.y, hz.w, hz.h);
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 3;
          ctx.strokeRect(hz.x, hz.y, hz.w, hz.h);

          // Sand texture dots
          ctx.fillStyle = '#ca8a04';
          for (let sx = hz.x + 8; sx < hz.x + hz.w - 8; sx += 12) {
            for (let sy = hz.y + 8; sy < hz.y + hz.h - 8; sy += 12) {
              ctx.fillRect(sx, sy, 2, 2);
            }
          }
        } else if (hz.type === 'water') {
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(hz.x, hz.y, hz.w, hz.h);
          ctx.strokeStyle = '#0369a1';
          ctx.lineWidth = 3;
          ctx.strokeRect(hz.x, hz.y, hz.w, hz.h);

          // Water ripple lines
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(hz.x + 10, hz.y + hz.h / 2);
          ctx.lineTo(hz.x + hz.w - 10, hz.y + hz.h / 2);
          ctx.stroke();
        }
      });

      // Wooden Course Walls & Bumpers
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      hole.walls.forEach((wall) => {
        ctx.beginPath();
        ctx.moveTo(wall.x1, wall.y1);
        ctx.lineTo(wall.x2, wall.y2);
        ctx.stroke();
      });

      // Inner Wall Highlight
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 4;
      hole.walls.forEach((wall) => {
        ctx.beginPath();
        ctx.moveTo(wall.x1, wall.y1);
        ctx.lineTo(wall.x2, wall.y2);
        ctx.stroke();
      });

      // Hole Cup & Flag
      const cupX = hole.holePos.x;
      const cupY = hole.holePos.y;

      // Black Cup Shadow
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cupX, cupY, 13, 0, Math.PI * 2);
      ctx.fill();

      // Inner metallic rim
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Flagstick
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cupX, cupY);
      ctx.lineTo(cupX, cupY - 42);
      ctx.stroke();

      // Waving Red Flag
      const wave = Math.sin(s.flagFlutter) * 4;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(cupX, cupY - 42);
      ctx.lineTo(cupX + 22 + wave, cupY - 34);
      ctx.lineTo(cupX, cupY - 26);
      ctx.closePath();
      ctx.fill();

      // Hole number on flag
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText((currentHoleIdx + 1).toString(), cupX + 4, cupY - 32);

      // Ball Trajectory Guide Dotted Line while Aiming
      if (s.aim.isDragging && !s.ball.isRolling && !s.ball.inHole) {
        ctx.save();
        const startX = s.ball.x;
        const startY = s.ball.y;
        const guideLen = s.aim.power * 160;
        const endX = startX + Math.cos(s.aim.angle) * guideLen;
        const endY = startY + Math.sin(s.aim.angle) * guideLen;

        // Dotted power line
        ctx.strokeStyle = s.aim.power > 0.7 ? '#ef4444' : s.aim.power > 0.4 ? '#f59e0b' : '#22c55e';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrow head at end
        ctx.setLineDash([]);
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.arc(endX, endY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Pullback slingshot line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(s.aim.currX, s.aim.currY);
        ctx.stroke();

        ctx.restore();
      }

      // Golf Ball (White dimpled sphere)
      if (!s.ball.inHole) {
        // Drop shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(s.ball.x + 2, s.ball.y + 2, s.ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // White Sphere with 3D gradient
        const ballGrad = ctx.createRadialGradient(
          s.ball.x - 2,
          s.ball.y - 2,
          1,
          s.ball.x,
          s.ball.y,
          s.ball.radius
        );
        ballGrad.addColorStop(0, '#ffffff');
        ballGrad.addColorStop(0.7, '#f1f5f9');
        ballGrad.addColorStop(1, '#94a3b8');
        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(s.ball.x, s.ball.y, s.ball.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [currentHoleIdx, holeStrokes, holeResult]);

  // Next Hole / Finish Course
  const nextHole = () => {
    sounds.playPop();
    if (currentHoleIdx < HOLES.length - 1) {
      loadHole(currentHoleIdx + 1);
    } else {
      // Finished all 6 holes!
      setCourseCompleted(true);
      const finalStrokes = totalStrokes;
      const parTotal = HOLES.reduce((acc, h) => acc + h.par, 0);

      const stars = finalStrokes <= parTotal ? 3 : finalStrokes <= parTotal + 4 ? 2 : 1;
      onGameComplete(stars, finalStrokes);

      if (bestScore === 0 || finalStrokes < bestScore) {
        setBestScore(finalStrokes);
        localStorage.setItem('kiddozap_golf_best', finalStrokes.toString());
      }
    }
  };

  const restartCurrentHole = () => {
    sounds.playPop();
    loadHole(currentHoleIdx);
  };

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 flex flex-col items-center select-none">
      {/* Top Header Controls */}
      <div className="w-full flex items-center justify-between mb-3 bg-white/90 backdrop-blur rounded-2xl p-3 border border-emerald-200 shadow-xs">
        <button
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-300 rounded-xl text-xs font-black text-amber-900">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{bestScore ? `${bestScore} pts` : '--'}</span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1 bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs">
            <Flag className="w-3.5 h-3.5" />
            <span>
              {lang === 'hi'
                ? `होल ${currentHoleIdx + 1}/6 (पार ${HOLES[currentHoleIdx].par})`
                : `Hole ${currentHoleIdx + 1}/6 (Par ${HOLES[currentHoleIdx].par})`}
            </span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-black">
            <span>🏌️ {holeStrokes}</span>
          </div>
        </div>

        <button
          onClick={restartCurrentHole}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all"
          title="Restart Hole"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Course Title & Aim Power Bar */}
      <div className="w-full max-w-[380px] flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-black text-emerald-900">
          ⛳ {lang === 'hi' ? HOLES[currentHoleIdx].nameHi : HOLES[currentHoleIdx].name}
        </span>

        {isAiming && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-700">{aimPower}%</span>
            <div className="w-24 h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
              <div
                className={`h-full transition-all ${
                  aimPower > 75 ? 'bg-red-500' : aimPower > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${aimPower}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mini Golf Canvas */}
      <div
        className="relative w-full max-w-[380px] aspect-[4/5.4] bg-emerald-900 rounded-3xl overflow-hidden shadow-xl border-4 border-emerald-800 touch-none cursor-crosshair"
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onTouchStart={(e) => {
          if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={handlePointerUp}
      >
        <canvas
          ref={canvasRef}
          width={380}
          height={520}
          className="w-full h-full block"
        />

        {/* Sunk Ball Pop-up Celebration */}
        <AnimatePresence>
          {holeResult && !courseCompleted && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-20"
            >
              <div className="text-5xl mb-2">🎉</div>
              <h3 className="text-3xl font-black font-display text-amber-300 drop-shadow-md">
                {holeResult}
              </h3>
              <p className="text-sm font-bold text-slate-200 mt-1">
                {lang === 'hi'
                  ? `${holeStrokes} शॉट में होल पूरा किया!`
                  : `Completed in ${holeStrokes} shots!`}
              </p>

              <button
                onClick={nextHole}
                className="mt-5 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm rounded-2xl shadow-lg active:scale-95 transition-all"
              >
                {currentHoleIdx < HOLES.length - 1
                  ? lang === 'hi'
                    ? 'अगला होल खेलें ➔'
                    : 'Next Hole ➔'
                  : lang === 'hi'
                  ? 'परिणाम देखें 🏆'
                  : 'View Results 🏆'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 18-Hole Course Finished Modal */}
        <AnimatePresence>
          {courseCompleted && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-30"
            >
              <div className="text-6xl mb-2">🏆</div>
              <h3 className="text-2xl font-black font-display text-emerald-300">
                {lang === 'hi' ? 'मिनी गोल्फ चैंपियन!' : 'Mini Golf Champion!'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {lang === 'hi' ? 'सभी 6 होल सफलतापूर्वक पूरे किए!' : 'Completed all 6 championship holes!'}
              </p>

              <div className="bg-white/10 rounded-2xl p-4 my-4 w-full max-w-xs border border-white/20">
                <p className="text-xs text-slate-300 font-bold">{lang === 'hi' ? 'कुल स्ट्रोक्स' : 'Total Strokes'}</p>
                <p className="text-3xl font-black text-amber-300 my-1 font-display">
                  {totalStrokes} 🏌️
                </p>
                <p className="text-xs text-slate-400">
                  {lang === 'hi' ? `कोर्स पार: 19` : `Course Par: 19`}
                </p>
              </div>

              <div className="flex gap-3 w-full max-w-xs">
                <button
                  onClick={() => {
                    setCourseCompleted(false);
                    setTotalStrokes(0);
                    loadHole(0);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs rounded-2xl shadow-md active:scale-95 transition-all"
                >
                  {lang === 'hi' ? 'फिर खेलें' : 'Play Again'}
                </button>
                <button
                  onClick={onBack}
                  className="py-3 px-4 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-2xl active:scale-95 transition-all"
                >
                  {lang === 'hi' ? 'हब' : 'Hub'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Guide text */}
      <p className="text-center text-xs text-slate-500 font-bold mt-3">
        {lang === 'hi'
          ? 'कंट्रोल: गोल्फ बॉल पर क्लिक करके पीछे खींचें और छोड़ें (खींचने से ताकत और दिशा तय होगी)!'
          : 'Controls: Drag back from the golf ball to aim & adjust power, then release to putt!'}
      </p>
    </div>
  );
};
