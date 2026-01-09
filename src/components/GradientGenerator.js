import React, { useState, useEffect } from "react";

const GradientGenerator = () => {
  const [type, setType] = useState("linear");
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState([
    { color: "#8b5cf6", position: 0 },
    { color: "#3b82f6", position: 100 },
  ]);
  const [gradient, setGradient] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    let newGradient = "";
    if (type === "linear") {
      newGradient = `linear-gradient(${angle}deg, ${stopsStr})`;
    } else if (type === "radial") {
      newGradient = `radial-gradient(circle, ${stopsStr})`;
    } else if (type === "conic") {
      newGradient = `conic-gradient(from ${angle}deg, ${stopsStr})`;
    }
    setGradient(newGradient);
  }, [type, angle, stops]);

  const addStop = () => {
    if (stops.length < 5) {
      setStops([
        ...stops,
        { color: "#ffffff", position: Math.floor(Math.random() * 100) },
      ]);
    }
  };

  const removeStop = (index) => {
    if (stops.length > 2) {
      const newStops = stops.filter((_, i) => i !== index);
      setStops(newStops);
    }
  };

  const updateStop = (index, field, value) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setStops(newStops);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`background: ${gradient};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-[600px] p-5 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 rounded-2xl m-5 shadow-2xl transition-all duration-300">
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-xl max-w-4xl w-full shadow-xl border border-white/20">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Gradient Pro
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Craft beautiful CSS gradients 🎨
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform cursor-default">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                Type & Geometry
              </label>
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg border border-gray-200">
                {["linear", "radial", "conic"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 py-1.5 px-3 rounded-md text-sm font-semibold capitalize transition-all ${
                      type === t
                        ? "bg-white text-violet-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {(type === "linear" || type === "conic") && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Angle
                  </label>
                  <span className="text-xs font-mono font-bold text-violet-500">
                    {angle}°
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Color Stops
                </label>
                <button
                  onClick={addStop}
                  disabled={stops.length >= 5}
                  className="text-xs px-2 py-1 bg-violet-100 text-violet-600 rounded font-bold hover:bg-violet-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  + Add Stop
                </button>
              </div>
              <div className="space-y-3">
                {stops.map((stop, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100 group"
                  >
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) =>
                        updateStop(index, "color", e.target.value)
                      }
                      className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                    />
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.position}
                        onChange={(e) =>
                          updateStop(
                            index,
                            "position",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                      />
                    </div>
                    <span className="w-10 text-xs font-mono text-gray-500 text-right">
                      {stop.position}%
                    </span>
                    <button
                      onClick={() => removeStop(index)}
                      disabled={stops.length <= 2}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 disabled:opacity-0 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex flex-col gap-6">
            <div className="flex-1 w-full bg-gray-50/50 rounded-2xl p-1 border-2 border-dashed border-gray-200 group min-h-[300px] flex flex-col">
              <div
                className="flex-1 w-full rounded-xl shadow-inner transition-all duration-300"
                style={{ background: gradient }}
              />
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur"></div>
              <div className="relative bg-gray-900 rounded-xl p-4 flex items-center justify-between">
                <code className="text-violet-300 text-xs font-mono truncate mr-4">
                  background: {gradient};
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all active:scale-95 flex-shrink-0"
                  title="Copy to Clipboard"
                >
                  {copied ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-6 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
            CSS3 Compatible
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full" />
            Hex Support
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            Live Preview
          </span>
        </div>
      </div>
    </div>
  );
};

export default GradientGenerator;
