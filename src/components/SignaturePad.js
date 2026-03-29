import React, { useRef, useState, useEffect } from "react";

const SignaturePad = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#4f46e5"); // Indigo-600
  const [lineWidth, setLineWidth] = useState(3);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateCanvasSize = () => {
      const container = document.getElementById("canvas-container");
      if (container) {
        setCanvasSize({
          width: container.offsetWidth - 40,
          height: 400,
        });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadSignature = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "signature.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-8 rounded-xl max-w-4xl w-full shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Digital Signature Pad
          </h2>
          <div className="flex items-center gap-2 text-2xl">🖋️</div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
            <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
              Brush Color:
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-full rounded cursor-pointer border-none bg-transparent"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
            <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
              Brush Size: {lineWidth}px
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        {/* Canvas Area */}
        <div
          id="canvas-container"
          className="relative bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden mb-6 cursor-crosshair"
          style={{ height: "400px" }}
        >
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full touch-none"
          />
          {!isDrawing && canvasRef.current && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <p className="text-gray-500 font-medium">Draw your signature here</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={downloadSignature}
            className="flex-1 py-3 px-6 rounded-full font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Download Signature
          </button>
          <button
            onClick={clearCanvas}
            className="py-3 px-8 rounded-full font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
          >
            Clear
          </button>
        </div>

        {/* Info */}
        <p className="mt-6 text-xs text-center text-gray-500">
          💡 Your signature is processed locally and not saved on any server.
        </p>
      </div>
    </div>
  );
};

export default SignaturePad;
