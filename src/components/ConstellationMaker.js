import React, { useState, useEffect, useMemo, useRef } from 'react';

const STAR_NAMES = [
  'Lyra', 'Orion', 'Vega', 'Sirius', 'Altair', 'Rigel', 'Cassio', 'Draco',
  'Nova', 'Polaris', 'Andra', 'Pegasus', 'Cygnus', 'Aurora', 'Celeste', 'Halo',
];

const PALETTES = {
  Cosmic: ['#a78bfa', '#f472b6', '#60a5fa'],
  Ember:  ['#fbbf24', '#f87171', '#fb923c'],
  Ocean:  ['#22d3ee', '#38bdf8', '#818cf8'],
  Forest: ['#34d399', '#a3e635', '#facc15'],
};

const ConstellationMaker = () => {
  const [stars, setStars] = useState(() => {
    const saved = localStorage.getItem('constellation_stars');
    return saved ? JSON.parse(saved) : [];
  });
  const [palette, setPalette] = useState('Cosmic');
  const [connect, setConnect] = useState(true);
  const [wish, setWish] = useState('');
  const [shooting, setShooting] = useState(null);
  const skyRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('constellation_stars', JSON.stringify(stars));
  }, [stars]);

  const colors = PALETTES[palette];

  const addStar = (e) => {
    const rect = skyRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (x < 1 || x > 99 || y < 1 || y > 99) return;
    const star = {
      id: Date.now() + Math.random(),
      x, y,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      name: STAR_NAMES[Math.floor(Math.random() * STAR_NAMES.length)] + '-' +
            Math.floor(Math.random() * 900 + 100),
      wish: wish.trim() || null,
      born: new Date().toISOString(),
    };
    setStars((prev) => [...prev, star]);
    setWish('');
  };

  const clearSky = () => {
    if (stars.length === 0) return;
    if (window.confirm('Clear the entire night sky?')) setStars([]);
  };

  const removeStar = (id, e) => {
    e.stopPropagation();
    setStars(stars.filter((s) => s.id !== id));
  };

  // Edges: minimum spanning tree (greedy) so constellations look like constellations
  const edges = useMemo(() => {
    if (!connect || stars.length < 2) return [];
    const nodes = stars.map((s, i) => ({ ...s, idx: i }));
    const inTree = new Set([0]);
    const result = [];
    while (inTree.size < nodes.length) {
      let best = null;
      for (const i of inTree) {
        for (let j = 0; j < nodes.length; j++) {
          if (inTree.has(j)) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (!best || d < best.d) best = { i, j, d };
        }
      }
      if (!best) break;
      inTree.add(best.j);
      result.push(best);
    }
    return result;
  }, [stars, connect]);

  const shoot = () => {
    const id = Date.now();
    const top = 5 + Math.random() * 30;
    setShooting({ id, top });
    setTimeout(() => setShooting((s) => (s && s.id === id ? null : s)), 1400);
  };

  return (
    <div className="flex justify-center items-center min-h-[600px] p-5 bg-gradient-to-br from-indigo-500 via-purple-600 to-fuchsia-600 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl max-w-4xl w-full shadow-2xl border border-white/20">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600 mb-2">
            Constellation Maker
          </h2>
          <p className="text-gray-500 font-medium">
            Click the sky to place a star. Make a wish along the way.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl p-4 border border-indigo-100">
            <div className="text-3xl font-black text-indigo-600">{stars.length}</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Stars</div>
          </div>
          <div className="bg-gradient-to-br from-fuchsia-50 to-pink-100 rounded-2xl p-4 border border-fuchsia-100">
            <div className="text-3xl font-black text-fuchsia-600">{edges.length}</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-400">Lines</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-4 border border-amber-100">
            <div className="text-3xl font-black text-orange-600">
              {stars.filter((s) => s.wish).length}
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-400">Wishes</div>
          </div>
          <div className="bg-gradient-to-br from-sky-50 to-cyan-100 rounded-2xl p-4 border border-sky-100">
            <div className="text-sm font-black text-sky-600 truncate">{palette}</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400">Palette</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(PALETTES).map((p) => (
            <button
              key={p}
              onClick={() => setPalette(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                palette === p
                  ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 text-xs font-bold text-gray-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={connect}
              onChange={(e) => setConnect(e.target.checked)}
              className="accent-indigo-600 w-4 h-4"
            />
            Connect stars
          </label>
        </div>

        <div
          ref={skyRef}
          onClick={addStar}
          className="relative w-full h-[420px] rounded-3xl overflow-hidden cursor-crosshair shadow-inner select-none"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, #312e81 0%, #1e1b4b 40%, #020617 100%)',
          }}
        >
          {/* Distant dust */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(1px 1px at 20% 30%, white, transparent), radial-gradient(1px 1px at 70% 80%, white, transparent), radial-gradient(1px 1px at 40% 60%, white, transparent), radial-gradient(1px 1px at 85% 15%, white, transparent), radial-gradient(1px 1px at 10% 75%, white, transparent)',
            }}
          />

          {/* Shooting star */}
          {shooting && (
            <div
              className="absolute h-0.5 w-32 bg-gradient-to-r from-transparent via-white to-white rounded-full pointer-events-none"
              style={{
                top: `${shooting.top}%`,
                left: '-20%',
                animation: 'shoot 1.4s linear forwards',
                filter: 'drop-shadow(0 0 6px white)',
              }}
            />
          )}

          {/* Lines */}
          {edges.length > 0 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {edges.map((e, i) => {
                const a = stars[e.i];
                const b = stars[e.j];
                return (
                  <line
                    key={i}
                    x1={`${a.x}%`} y1={`${a.y}%`}
                    x2={`${b.x}%`} y2={`${b.y}%`}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                );
              })}
            </svg>
          )}

          {/* Stars */}
          {stars.map((s) => (
            <button
              key={s.id}
              onClick={(e) => removeStar(s.id, e)}
              className="absolute group"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size * 4}px`,
                height: `${s.size * 4}px`,
                transform: 'translate(-50%, -50%)',
              }}
              title={`${s.name}${s.wish ? ' — ' + s.wish : ''} (click to remove)`}
            >
              <span
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${s.color} 0%, transparent 70%)`,
                  opacity: 0.7,
                }}
              />
              <span
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{
                  width: `${s.size * 1.6}px`,
                  height: `${s.size * 1.6}px`,
                  transform: 'translate(-50%, -50%)',
                  background: s.color,
                  boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
                }}
              />
              {s.wish && (
                <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded-md pointer-events-none">
                  {s.name}: {s.wish}
                </span>
              )}
            </button>
          ))}

          {stars.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm italic pointer-events-none">
              The sky is empty. Click anywhere to place your first star.
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-5">
          <input
            type="text"
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            placeholder="Optional wish to attach to the next star..."
            maxLength={80}
            className="flex-1 px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-300 focus:bg-white focus:outline-none transition-all text-gray-700"
          />
          <button
            onClick={shoot}
            className="px-5 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-rose-500 hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all"
          >
            Shooting Star
          </button>
          <button
            onClick={clearSky}
            disabled={stars.length === 0}
            className={`px-5 py-3 rounded-2xl font-bold transition-all ${
              stars.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:-translate-y-0.5 shadow-md hover:shadow-lg'
            }`}
          >
            Clear Sky
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Tip: click a star to remove it. Your sky is saved automatically.
        </p>
      </div>

      <style>{`
        @keyframes shoot {
          0%   { transform: translateX(0) translateY(0) rotate(15deg); opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translateX(140vw) translateY(40vh) rotate(15deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ConstellationMaker;
