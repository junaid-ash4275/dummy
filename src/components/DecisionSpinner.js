import React, { useState, useEffect, useRef, useMemo } from "react";

const SEGMENT_COLORS = [
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-blue-500",
  "from-violet-400 to-purple-500",
  "from-lime-400 to-green-500",
  "from-fuchsia-400 to-pink-500",
  "from-cyan-400 to-indigo-500",
  "from-red-400 to-rose-500",
  "from-yellow-400 to-amber-500",
  "from-teal-400 to-cyan-500",
  "from-indigo-400 to-violet-500",
];

const DecisionSpinner = () => {
  const [options, setOptions] = useState(() => {
    const saved = localStorage.getItem("decision_spinner_options");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, text: "Pizza" },
          { id: 2, text: "Sushi" },
          { id: 3, text: "Tacos" },
          { id: 4, text: "Burger" },
          { id: 5, text: "Pasta" },
          { id: 6, text: "Salad" },
        ];
  });
  const [newOption, setNewOption] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("decision_spinner_history");
    return saved ? JSON.parse(saved) : [];
  });
  const wheelRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("decision_spinner_options", JSON.stringify(options));
  }, [options]);

  useEffect(() => {
    localStorage.setItem("decision_spinner_history", JSON.stringify(history));
  }, [history]);

  const addOption = (e) => {
    e.preventDefault();
    const value = newOption.trim();
    if (!value || options.length >= 12) return;
    setOptions([...options, { id: Date.now(), text: value }]);
    setNewOption("");
  };

  const removeOption = (id) => {
    if (options.length <= 2) return;
    setOptions(options.filter((o) => o.id !== id));
  };

  const spin = () => {
    if (spinning || options.length < 2) return;
    setSpinning(true);
    setResult(null);

    // Random spin: 3-6 full rotations + random offset
    const extraDegrees = Math.random() * 360;
    const fullRotations = (3 + Math.floor(Math.random() * 4)) * 360;
    const newRotation = rotation + fullRotations + extraDegrees;

    setRotation(newRotation);

    // Calculate which segment the pointer lands on
    // Pointer is at top (270 degrees in standard math, or 0 degrees in our CSS rotation)
    const normalizedAngle = (360 - (newRotation % 360)) % 360;
    const segmentAngle = 360 / options.length;
    const selectedIndex = Math.floor(normalizedAngle / segmentAngle);

    setTimeout(() => {
      setSpinning(false);
      const selected = options[selectedIndex % options.length];
      setResult(selected);
      setHistory((prev) => [
        { id: Date.now(), text: selected.text, timestamp: new Date().toISOString() },
        ...prev.slice(0, 9),
      ]);
    }, 4000);
  };

  const segmentAngle = options.length > 0 ? 360 / options.length : 360;
  const radius = 140;
  const center = 160;

  // Generate SVG path for each segment
  const segments = useMemo(() => {
    return options.map((option, i) => {
      const startAngle = i * segmentAngle - 90; // -90 to start from top
      const endAngle = startAngle + segmentAngle;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      const largeArc = segmentAngle > 180 ? 1 : 0;

      const d = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      // Text position — midpoint of the arc
      const midAngle = startAngle + segmentAngle / 2;
      const midRad = (midAngle * Math.PI) / 180;
      const textRadius = radius * 0.6;
      const tx = center + textRadius * Math.cos(midRad);
      const ty = center + textRadius * Math.sin(midRad);

      const colorPairs = [
        ["#fb7185", "#ec4899"],
        ["#fbbf24", "#f97316"],
        ["#34d399", "#14b8a6"],
        ["#38bdf8", "#3b82f6"],
        ["#a78bfa", "#8b5cf6"],
        ["#a3e635", "#22c55e"],
        ["#e879f9", "#ec4899"],
        ["#22d3ee", "#6366f1"],
        ["#f87171", "#f43f5e"],
        ["#facc15", "#d97706"],
        ["#2dd4bf", "#06b6d4"],
        ["#818cf8", "#7c3aed"],
      ];
      const [c1, c2] = colorPairs[i % colorPairs.length];

      return { d, tx, ty, c1, c2, midAngle, option };
    });
  }, [options, segmentAngle]);

  return (
    <div className="flex justify-center items-center min-h-[600px] p-5 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl max-w-3xl w-full shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-2">
            Decision Spinner
          </h2>
          <p className="text-gray-500 font-medium">
            Can't decide? Let the wheel choose for you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Wheel */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-fuchsia-600 drop-shadow-lg" />
              </div>

              {/* Wheel SVG */}
              <svg
                ref={wheelRef}
                width={center * 2}
                height={center * 2}
                className="drop-shadow-2xl"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning
                    ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                    : "none",
                }}
              >
                {segments.map((seg, i) => (
                  <g key={i}>
                    <path
                      d={seg.d}
                      fill={`url(#grad-${i})`}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient
                        id={`grad-${i}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor={seg.c1} />
                        <stop offset="100%" stopColor={seg.c2} />
                      </linearGradient>
                    </defs>
                    <text
                      x={seg.tx}
                      y={seg.ty}
                      fill="white"
                      fontSize={options.length > 8 ? 10 : options.length > 5 ? 12 : 14}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${seg.midAngle + 90}, ${seg.tx}, ${seg.ty})`}
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                    >
                      {seg.option.text.length > 10
                        ? seg.option.text.slice(0, 9) + "…"
                        : seg.option.text}
                    </text>
                  </g>
                ))}
                {/* Center circle */}
                <circle
                  cx={center}
                  cy={center}
                  r="20"
                  fill="white"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <text
                  x={center}
                  y={center}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
                >
                  🎯
                </text>
              </svg>
            </div>

            {/* Spin button */}
            <button
              onClick={spin}
              disabled={spinning || options.length < 2}
              className={`mt-5 py-3 px-10 rounded-full font-bold text-lg transition-all duration-300 shadow-lg ${
                spinning || options.length < 2
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:-translate-y-1 hover:shadow-xl active:scale-95"
              }`}
            >
              {spinning ? "Spinning..." : "Spin!"}
            </button>

            {/* Result */}
            {result && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-100 w-full text-center animate-bounce">
                <p className="text-sm text-gray-500 font-medium mb-1">
                  The wheel says...
                </p>
                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
                  {result.text}!
                </p>
              </div>
            )}
          </div>

          {/* Options panel */}
          <div className="flex flex-col">
            {/* Add option form */}
            <form onSubmit={addOption} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add an option..."
                maxLength={30}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-violet-400 transition-all text-gray-700"
              />
              <button
                type="submit"
                disabled={!newOption.trim() || options.length >= 12}
                className={`px-5 py-3 rounded-xl font-bold transition-all active:scale-95 ${
                  !newOption.trim() || options.length >= 12
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:shadow-lg"
                }`}
              >
                Add
              </button>
            </form>

            <p className="text-xs text-gray-400 mb-3">
              {options.length}/12 options • Minimum 2 required
            </p>

            {/* Options list */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {options.map((option, i) => {
                const colorPairs = [
                  "from-rose-400 to-pink-500",
                  "from-amber-400 to-orange-500",
                  "from-emerald-400 to-teal-500",
                  "from-sky-400 to-blue-500",
                  "from-violet-400 to-purple-500",
                  "from-lime-400 to-green-500",
                  "from-fuchsia-400 to-pink-500",
                  "from-cyan-400 to-indigo-500",
                  "from-red-400 to-rose-500",
                  "from-yellow-400 to-amber-500",
                  "from-teal-400 to-cyan-500",
                  "from-indigo-400 to-violet-500",
                ];
                return (
                  <div
                    key={option.id}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
                  >
                    <div
                      className={`w-6 h-6 rounded-md bg-gradient-to-br ${colorPairs[i % colorPairs.length]} shrink-0 shadow-sm`}
                    />
                    <span className="flex-1 text-gray-700 font-medium text-sm truncate">
                      {option.text}
                    </span>
                    <button
                      onClick={() => removeOption(option.id)}
                      disabled={options.length <= 2}
                      className={`opacity-0 group-hover:opacity-100 text-xs font-bold transition-all ${
                        options.length <= 2
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Recent Picks
                </p>
                <div className="flex flex-wrap gap-2">
                  {history.slice(0, 6).map((h) => (
                    <span
                      key={h.id}
                      className="px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-100 text-xs font-semibold text-violet-700"
                    >
                      {h.text}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionSpinner;
