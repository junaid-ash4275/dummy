import React, { useState, useEffect } from "react";

const QRCodeGenerator = () => {
  const [text, setText] = useState("https://google.com");
  const [fgColor, setFgColor] = useState("000000");
  const [bgColor, setBgColor] = useState("ffffff");
  const [size, setSize] = useState(250);
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateQr = () => {
      setLoading(true);
      // Clean colors (remove # if present)
      const cleanFg = fgColor.replace("#", "");
      const cleanBg = bgColor.replace("#", "");

      const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
        text
      )}&color=${cleanFg}&bgcolor=${cleanBg}&format=png`;

      setQrUrl(url);
      setLoading(false);
    };

    const debounceTimer = setTimeout(generateQr, 500);
    return () => clearTimeout(debounceTimer);
  }, [text, fgColor, bgColor, size]);

  const downloadQR = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-code-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-2xl m-5 shadow-2xl transition-all duration-300">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl max-w-2xl w-full shadow-xl border border-white/20">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
              QR Pro Generator
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Create premium QR codes in seconds ✨
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform cursor-default">
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
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2M4 8h12m4 0h2M4 16h4m12 0h2M4 20h12"
              />
            </svg>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                Content / URL
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text or URL..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-cyan-400 transition-all bg-white text-gray-700 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Foreground
                </label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                  <input
                    type="color"
                    value={`#${fgColor}`}
                    onChange={(e) => setFgColor(e.target.value.substring(1))}
                    className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-xs font-mono text-gray-500 uppercase">
                    #{fgColor}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Background
                </label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                  <input
                    type="color"
                    value={`#${bgColor}`}
                    onChange={(e) => setBgColor(e.target.value.substring(1))}
                    className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-xs font-mono text-gray-500 uppercase">
                    #{bgColor}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                Size: {size}px
              </label>
              <input
                type="range"
                min="100"
                max="500"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl p-6 border-2 border-dashed border-gray-200 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div
              className={`relative z-10 transition-all duration-500 ${
                loading ? "scale-95 opacity-50" : "scale-100 opacity-100"
              }`}
            >
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt="QR Code"
                  className="rounded-lg shadow-2xl max-w-full h-auto border-4 border-white"
                  onLoad={() => setLoading(false)}
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-lg animate-pulse" />
              )}
            </div>

            <button
              onClick={downloadQR}
              className="mt-6 relative z-10 bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-black hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 group/btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover/btn:translate-y-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PNG
            </button>

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] z-20">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-4 text-gray-400 text-xs font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Instant Generation
          </span>
          <span className="text-gray-200">|</span>
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Secure API
          </span>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
