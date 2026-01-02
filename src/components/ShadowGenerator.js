import React, { useState } from "react";

const ShadowGenerator = () => {
  const [hOffset, setHOffset] = useState(10);
  const [vOffset, setVOffset] = useState(10);
  const [blur, setBlur] = useState(20);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#00000033");
  const [boxColor, setBoxColor] = useState("#6366f1");
  const [isInset, setIsInset] = useState(false);
  const [copied, setCopied] = useState(false);

  const boxShadow = `${
    isInset ? "inset " : ""
  }${hOffset}px ${vOffset}px ${blur}px ${spread}px ${color}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`box-shadow: ${boxShadow};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 rounded-2xl m-5 shadow-2xl transition-all duration-300">
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-xl max-w-4xl w-full shadow-xl border border-white/20">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
              Shadow Pro
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Design perfect CSS shadows visually 🪞
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-lg flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform cursor-default">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Controls */}
          <div className="space-y-5">
            {[
              {
                label: "Horizontal Offset",
                value: hOffset,
                setter: setHOffset,
                min: -100,
                max: 100,
              },
              {
                label: "Vertical Offset",
                value: vOffset,
                setter: setVOffset,
                min: -100,
                max: 100,
              },
              {
                label: "Blur Radius",
                value: blur,
                setter: setBlur,
                min: 0,
                max: 100,
              },
              {
                label: "Spread Radius",
                value: spread,
                setter: setSpread,
                min: -50,
                max: 50,
              },
            ].map((control) => (
              <div key={control.label}>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    {control.label}
                  </label>
                  <span className="text-xs font-mono font-bold text-orange-500">
                    {control.value}px
                  </span>
                </div>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  value={control.value}
                  onChange={(e) => control.setter(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Shadow Color
                </label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                  <input
                    type="color"
                    value={color.substring(0, 7)}
                    onChange={(e) =>
                      setColor(e.target.value + color.substring(7))
                    }
                    className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                  />
                  <input
                    type="range"
                    min="0"
                    max="255"
                    step="1"
                    value={parseInt(color.substring(7), 16) || 51}
                    onChange={(e) => {
                      const hex = parseInt(e.target.value)
                        .toString(16)
                        .padStart(2, "0");
                      setColor(color.substring(0, 7) + hex);
                    }}
                    className="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Box Color
                </label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                  <input
                    type="color"
                    value={boxColor}
                    onChange={(e) => setBoxColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-xs font-mono text-gray-500 uppercase">
                    {boxColor}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="inset"
                checked={isInset}
                onChange={(e) => setIsInset(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-orange-400 text-orange-500 focus:ring-orange-500 cursor-pointer"
              />
              <label
                htmlFor="inset"
                className="text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer"
              >
                Inset Shadow
              </label>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex flex-col items-center justify-between">
            <div className="flex-1 w-full bg-gray-50/50 rounded-2xl p-12 border-2 border-dashed border-gray-200 flex items-center justify-center relative group min-h-[300px]">
              <div
                className="w-40 h-40 rounded-2xl transition-all duration-300 transform group-hover:scale-105"
                style={{
                  backgroundColor: boxColor,
                  boxShadow: boxShadow,
                }}
              />
            </div>

            <div className="w-full mt-6 space-y-4">
              <div className="bg-gray-900 rounded-xl p-4 relative group">
                <code className="text-orange-400 text-xs font-mono block break-all pr-12">
                  box-shadow: {boxShadow};
                </code>
                <button
                  onClick={copyToClipboard}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all active:scale-90"
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
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
            Hex + Alpha Support
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
            Inset Toggle
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            Exportable CSS
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShadowGenerator;
