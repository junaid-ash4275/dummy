import React, { useState, useEffect } from "react";

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("Ready"); // Ready, Inhale, Hold, Exhale
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setPhase("Ready");
      setTimer(0);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    // Cycle duration: 19 seconds total (4s inhale + 7s hold + 8s exhale)
    const cycleTime = timer % 19;

    if (cycleTime < 4) {
      setPhase("Inhale");
    } else if (cycleTime < 11) {
      setPhase("Hold");
    } else {
      setPhase("Exhale");
    }
  }, [timer, isActive]);

  const getScale = () => {
    if (!isActive) return 1;
    switch (phase) {
      case "Inhale":
        return 1.5; // Grow
      case "Hold":
        return 1.5; // Stay large
      case "Exhale":
        return 1; // Shrink
      default:
        return 1;
    }
  };

  const getInstruction = () => {
    if (!isActive) return "Press Start to Begin";
    switch (phase) {
      case "Inhale":
        return "Breathe In... (4s)";
      case "Hold":
        return "Hold... (7s)";
      case "Exhale":
        return "Breathe Out... (8s)";
      default:
        return "";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-8 rounded-xl max-w-lg w-full shadow-xl text-center relative overflow-hidden">
        {/* Header */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent mb-8">
          Breathing Exercise
        </h2>

        {/* Animation Circle */}
        <div className="relative h-64 flex justify-center items-center mb-8">
          {/* Outer Pulse Circles */}
          {isActive && (
            <>
              <div className="absolute w-40 h-40 bg-blue-100 rounded-full animate-ping opacity-75"></div>
              <div className="absolute w-32 h-32 bg-indigo-100 rounded-full animate-ping opacity-50 delay-75"></div>
            </>
          )}

          {/* Main Circle */}
          <div
            className="w-48 h-48 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-full flex justify-center items-center shadow-lg transition-all duration-[4000ms] ease-in-out z-10"
            style={{
              transform: `scale(${getScale()})`,
              transitionDuration:
                phase === "Inhale"
                  ? "4000ms"
                  : phase === "Exhale"
                  ? "8000ms"
                  : "0ms",
            }}
          >
            <span className="text-4xl animate-pulse">
              {phase === "Inhale"
                ? "🌬️"
                : phase === "Hold"
                ? "😶"
                : phase === "Exhale"
                ? "😌"
                : "🧘"}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-xl font-semibold text-gray-700 mb-8 h-8 transition-all duration-300">
          {getInstruction()}
        </p>

        {/* Controls */}
        <button
          onClick={() => setIsActive(!isActive)}
          className={`py-3 px-10 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-md ${
            isActive
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
              : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg"
          }`}
        >
          {isActive ? "Stop" : "Start"}
        </button>

        {/* Technique Info */}
        <div className="mt-8 text-xs text-gray-400">
          Technique: 4-7-8 Breathing (Relaxation)
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;
