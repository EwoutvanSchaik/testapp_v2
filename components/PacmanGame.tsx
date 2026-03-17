'use client';

import { useEffect, useRef, useState } from 'react';

const CELL = 26;
const COLS = 19;
const ROWS = 21;

// 0=dot, 1=wall, 2=power pellet, 3=empty (walkable, no dot)
const MAZE_TEMPLATE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,2,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,2,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,3,1,3,1,1,1,0,1,1,1,1],
  [1,1,1,1,0,1,3,3,3,3,3,3,3,1,0,1,1,1,1],
  [1,1,1,1,0,1,3,1,1,3,1,1,3,1,0,1,1,1,1],
  [3,3,3,3,0,3,3,1,3,3,3,1,3,3,0,3,3,3,3],
  [1,1,1,1,0,1,3,1,1,1,1,1,3,1,0,1,1,1,1],
  [1,1,1,1,0,1,3,3,3,3,3,3,3,1,0,1,1,1,1],
  [1,1,1,1,0,1,3,1,1,1,1,1,3,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,2,0,1,0,0,0,0,0,3,0,0,0,0,0,1,0,2,1],
  [1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const GHOST_COLORS = ['#ff0000', '#ffb8de'];
const GHOST_STARTS = [{ x: 8, y: 10 }, { x: 10, y: 10 }];
const PAC_START = { x: 9, y: 16 };
const PAC_SPEED = 200;
const GHOST_SPEED = 300;
const FRIGHTEN_DURATION = 6000;

const DIR_MAP: Record<string, { x: number; y: number }> = {
  ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
  ArrowUp:   { x: 0, y: -1 }, ArrowDown:  { x: 0, y: 1 },
  a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
  w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
};

export default function PacmanGame({ resetKey }: { resetKey: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let running = true;
    let animFrame: number;
    let lastTime = 0;

    // Mutable game state (refs to avoid stale closures)
    const maze = MAZE_TEMPLATE.map(r => [...r]);
    const totalDots = maze.flat().filter(c => c === 0 || c === 2).length;
    let dotsEaten = 0;
    let sc = 0;
    let lv = 3;

    const pac = {
      x: PAC_START.x, y: PAC_START.y,
      dir: { x: 0, y: 0 }, next: { x: 1, y: 0 },
      mouth: 0, opening: true,
      pacTimer: 0,
    };

    const ghosts = GHOST_STARTS.map((pos, i) => ({
      x: pos.x, y: pos.y,
      dir: { x: i === 0 ? -1 : 1, y: 0 },
      color: GHOST_COLORS[i],
      frightened: false,
      frightenTimer: 0,
      ghostTimer: 0,
    }));

    function walkable(x: number, y: number) {
      if (y < 0 || y >= ROWS) return false;
      const nx = ((x % COLS) + COLS) % COLS;
      return maze[y][nx] !== 1;
    }

    function pickGhostDir(g: typeof ghosts[0]) {
      const opts = [
        { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
      ].filter(d => {
        if (d.x === -g.dir.x && d.y === -g.dir.y) return false;
        return walkable(g.x + d.x, g.y + d.y);
      });
      if (!opts.length) return { x: -g.dir.x, y: -g.dir.y };
      if (g.frightened) return opts[Math.floor(Math.random() * opts.length)];
      opts.sort((a, b) =>
        (Math.abs(g.x + a.x - pac.x) + Math.abs(g.y + a.y - pac.y)) -
        (Math.abs(g.x + b.x - pac.x) + Math.abs(g.y + b.y - pac.y))
      );
      return opts[0];
    }

    function resetPositions() {
      pac.x = PAC_START.x; pac.y = PAC_START.y;
      pac.dir = { x: 0, y: 0 }; pac.next = { x: 1, y: 0 };
      ghosts.forEach((g, i) => {
        g.x = GHOST_STARTS[i].x; g.y = GHOST_STARTS[i].y;
        g.dir = { x: i === 0 ? -1 : 1, y: 0 };
        g.frightened = false; g.frightenTimer = 0;
      });
    }

    function update(dt: number) {
      // Mouth
      if (pac.opening) {
        pac.mouth += dt * 0.003;
        if (pac.mouth >= 0.35) pac.opening = false;
      } else {
        pac.mouth -= dt * 0.003;
        if (pac.mouth <= 0.02) pac.opening = true;
      }

      // Pacman
      pac.pacTimer += dt;
      if (pac.pacTimer >= PAC_SPEED) {
        pac.pacTimer = 0;
        // Try buffered direction
        if (pac.next.x !== 0 || pac.next.y !== 0) {
          if (walkable(pac.x + pac.next.x, pac.y + pac.next.y)) {
            pac.dir = { ...pac.next };
          }
        }
        if (pac.dir.x !== 0 || pac.dir.y !== 0) {
          const nx = ((pac.x + pac.dir.x + COLS) % COLS);
          const ny = pac.y + pac.dir.y;
          if (walkable(nx, ny)) {
            pac.x = nx; pac.y = ny;
            const cell = maze[pac.y][pac.x];
            if (cell === 0) { maze[pac.y][pac.x] = 3; dotsEaten++; sc += 10; setScore(sc); }
            if (cell === 2) {
              maze[pac.y][pac.x] = 3; dotsEaten++; sc += 50; setScore(sc);
              ghosts.forEach(g => { g.frightened = true; g.frightenTimer = FRIGHTEN_DURATION; });
            }
          }
        }
      }

      // Ghosts
      for (const g of ghosts) {
        g.ghostTimer += dt;
        if (g.frightened) { g.frightenTimer -= dt; if (g.frightenTimer <= 0) g.frightened = false; }
        if (g.ghostTimer >= GHOST_SPEED) {
          g.ghostTimer = 0;
          g.dir = pickGhostDir(g);
          const nx = ((g.x + g.dir.x + COLS) % COLS);
          const ny = g.y + g.dir.y;
          if (ny >= 0 && ny < ROWS && maze[ny][nx] !== 1) { g.x = nx; g.y = ny; }
        }
      }

      // Collisions
      for (const g of ghosts) {
        if (g.x === pac.x && g.y === pac.y) {
          if (g.frightened) {
            g.x = GHOST_STARTS[ghosts.indexOf(g)].x;
            g.y = GHOST_STARTS[ghosts.indexOf(g)].y;
            g.frightened = false; sc += 200; setScore(sc);
          } else {
            lv--; setLives(lv);
            if (lv <= 0) { running = false; setGameOver(true); return; }
            resetPositions();
          }
        }
      }

      if (dotsEaten >= totalDots) { running = false; setWon(true); }
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = maze[r][c];
          const x = c * CELL, y = r * CELL;
          if (cell === 1) {
            ctx.fillStyle = '#1e1b4b';
            ctx.fillRect(x, y, CELL, CELL);
            ctx.strokeStyle = '#4338ca';
            ctx.lineWidth = 0.8;
            ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
          } else if (cell === 0) {
            ctx.fillStyle = '#c7d2fe';
            ctx.beginPath();
            ctx.arc(x + CELL / 2, y + CELL / 2, 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (cell === 2) {
            const p = 0.6 + 0.4 * Math.sin(Date.now() / 180);
            ctx.fillStyle = `rgba(167,139,250,${p})`;
            ctx.shadowColor = '#a78bfa'; ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(x + CELL / 2, y + CELL / 2, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Pac-Man
      const px = pac.x * CELL + CELL / 2;
      const py = pac.y * CELL + CELL / 2;
      const facing = Math.atan2(pac.dir.y || 0, pac.dir.x || 1);
      ctx.fillStyle = '#fde047';
      ctx.shadowColor = '#facc15'; ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.arc(px, py, CELL / 2 - 1, facing + pac.mouth, facing + Math.PI * 2 - pac.mouth);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Ghosts
      for (const g of ghosts) {
        const gx = g.x * CELL + CELL / 2;
        const gy = g.y * CELL + CELL / 2;
        const gr = CELL / 2 - 1;
        const flicker = g.frightened && g.frightenTimer < 2000 && Math.floor(Date.now() / 200) % 2 === 0;
        ctx.fillStyle = flicker ? '#e0e7ff' : (g.frightened ? '#3730a3' : g.color);
        ctx.shadowColor = flicker ? '#c7d2fe' : (g.frightened ? '#6366f1' : g.color);
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(gx, gy - 1, gr, Math.PI, 0);
        ctx.lineTo(gx + gr, gy + gr);
        const segs = 3, sw = (gr * 2) / segs;
        for (let i = segs; i >= 0; i--) {
          ctx.lineTo(gx - gr + i * sw, gy + gr - (i % 2 === 0 ? 3 : 0));
        }
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        if (!g.frightened && !flicker) {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(gx - 3, gy - 2, 2.5, 0, Math.PI * 2);
          ctx.arc(gx + 3, gy - 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#1d4ed8';
          ctx.beginPath();
          ctx.arc(gx - 3 + g.dir.x, gy - 2 + g.dir.y, 1.2, 0, Math.PI * 2);
          ctx.arc(gx + 3 + g.dir.x, gy - 2 + g.dir.y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function loop(ts: number) {
      if (!running) return;
      const dt = Math.min(ts - lastTime, 50);
      lastTime = ts;
      update(dt);
      draw();
      animFrame = requestAnimationFrame(loop);
    }

    function onKey(e: KeyboardEvent) {
      const d = DIR_MAP[e.key];
      if (d) { e.preventDefault(); pac.next = d; }
    }

    window.addEventListener('keydown', onKey);
    animFrame = requestAnimationFrame(ts => { lastTime = ts; loop(ts); });

    return () => {
      running = false;
      cancelAnimationFrame(animFrame);
      window.removeEventListener('keydown', onKey);
    };
  }, [resetKey]);

  const W = COLS * CELL;
  const H = ROWS * CELL;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-between w-full px-1 text-sm font-bold">
        <span className="text-indigo-300">Score: <span className="text-white">{score}</span></span>
        <span>{'❤️'.repeat(Math.max(0, lives))}</span>
      </div>

      <div
        className="rounded-2xl border border-white/20 bg-black/80 backdrop-blur-xl p-2 relative"
        style={{ boxShadow: '0 0 25px rgba(99,102,241,0.45), 0 0 55px rgba(139,92,246,0.2)' }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="rounded-xl block"
          style={{ imageRendering: 'pixelated' }}
        />

        {(gameOver || won) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 rounded-xl backdrop-blur-sm">
            <p className="text-2xl font-extrabold tracking-tight text-white mb-1">
              {won ? '🎉 Gewonnen!' : '💀 Game Over'}
            </p>
            <p className="text-indigo-300 mb-5 font-semibold">Score: {score}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:scale-105 transition-all shadow-lg shadow-indigo-500/30"
            >
              Opnieuw
            </button>
          </div>
        )}
      </div>

      {/* Mobile d-pad */}
      <div className="flex flex-col items-center gap-1 sm:hidden mt-1">
        <button
          onPointerDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))}
          className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center text-lg active:bg-white/20"
        >▲</button>
        <div className="flex gap-1">
          {(['ArrowLeft','ArrowDown','ArrowRight'] as const).map((k, i) => (
            <button
              key={k}
              onPointerDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: k }))}
              className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center text-lg active:bg-white/20"
            >
              {['◀','▼','▶'][i]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-slate-500 text-xs hidden sm:block">Pijltjestoetsen of WASD</p>
    </div>
  );
}
