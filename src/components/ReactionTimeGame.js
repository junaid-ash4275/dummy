import React, { useState, useRef, useCallback } from "react";

const ReactionTimeGame = () => {
  const [gameState, setGameState] = useState("idle"); // idle, waiting, ready, result
  const [reactionTime, setReactionTime] = useState(null);
  const [results, setResults] = useState([]);
  const [bestTime, setBestTime] = useState(null);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);

  const startGame = useCallback(() => {
    setGameState("waiting");
    setReactionTime(null);

    const delay = Math.random() * 4000 + 1000; // 1-5 seconds
    timeoutRef.current = setTimeout(() => {
      setGameState("ready");
      startTimeRef.current = Date.now();
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (gameState === "idle" || gameState === "result") {
      startGame();
    } else if (gameState === "waiting") {
      // Clicked too early
      clearTimeout(timeoutRef.current);
      setGameState("result");
      setReactionTime(-1); // -1 means too early
    } else if (gameState === "ready") {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setGameState("result");

      const newResults = [time, ...results.slice(0, 9)];
      setResults(newResults);

      if (!bestTime || time < bestTime) {
        setBestTime(time);
      }
    }
  }, [gameState, results, bestTime, startGame]);

  const resetAll = () => {
    setGameState("idle");
    setReactionTime(null);
    setResults([]);
    setBestTime(null);
    clearTimeout(timeoutRef.current);
  };

  const getAverage = () => {
    if (results.length === 0) return null;
    return Math.round(results.reduce((a, b) => a + b, 0) / results.length);
  };

  const getRating = (ms) => {
    if (ms < 200) return { label: "Incredible!", color: "text-green-500" };
    if (ms < 300) return { label: "Fast!", color: "text-emerald-500" };
    if (ms < 400) return { label: "Good", color: "text-blue-500" };
    if (ms < 500) return { label: "Average", color: "text-yellow-500" };
    return { label: "Keep Practicing", color: "text-orange-500" };
  };

  const getBackgroundClass = () => {
    switch (gameState) {
      case "waiting":
        return "bg-red-500";
      case "ready":
        return "bg-green-500";
      default:
        return "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500";
    }
  };

  const getInnerContent = () => {
    switch (gameState) {
      case "idle":
        return (
          <>
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Test Your Reflexes
            </h3>
            <p className="text-gray-500 text-sm">
              Click anywhere to start. When the box turns{" "}
              <span className="text-green-500 font-bold">green</span>, click as
              fast as you can!
            </p>
          </>
        );
      case "waiting":
        return (
          <>
            <div className="text-6xl mb-4 animate-pulse">🔴</div>
            <h3 className="text-xl font-bold text-white mb-2">Wait for it...</h3>
            <p className="text-red-100 text-sm">
              Don't click yet! Wait for green.
            </p>
          </>
        );
      case "ready":
        return (
          <>
            <div className="text-6xl mb-4 animate-bounce">🟢</div>
            <h3 className="text-xl font-bold text-white mb-2">CLICK NOW!</h3>
            <p className="text-green-100 text-sm">As fast as you can!</p>
          </>
        );
      case "result":
        if (reactionTime === -1) {
          return (
            <>
              <div className="text-6xl mb-4">😬</div>
              <h3 className="text-xl font-bold text-red-500 mb-2">
                Too Early!
              </h3>
              <p className="text-gray-500 text-sm">
                You clicked before it turned green. Click to try again.
              </p>
            </>
          );
        }
        const rating = getRating(reactionTime);
        return (
          <>
            <div className="text-6xl mb-4">⏱️</div>
            <h3
              className={`text-4xl font-bold mb-2 ${rating.color}`}
            >
              {reactionTime} ms
            </h3>
            <p className={`text-lg font-semibold ${rating.color}`}>
              {rating.label}
            </p>
            <p className="text-gray-400 text-sm mt-2">Click to try again</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex justify-center items-center min-h-[400px] p-5 rounded-2xl m-5 shadow-2xl transition-colors duration-300 ${getBackgroundClass()}`}
    >
      <div className="bg-white p-10 rounded-xl max-w-lg w-full text-center shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
          Reaction Time
        </h2>

        {/* Game Area */}
        <div
          className={`rounded-xl p-10 mb-6 cursor-pointer select-none transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] ${
            gameState === "waiting"
              ? "bg-red-100 border-2 border-red-300"
              : gameState === "ready"
              ? "bg-green-100 border-2 border-green-300"
              : "bg-gray-50 border-2 border-gray-200 hover:border-orange-300"
          }`}
          onClick={handleClick}
        >
          {getInnerContent()}
        </div>

        {/* Stats */}
        {results.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                Best
              </div>
              <div className="text-xl font-bold text-amber-600">
                {bestTime} ms
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-rose-50 p-4 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                Average
              </div>
              <div className="text-xl font-bold text-orange-600">
                {getAverage()} ms
              </div>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-4 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                Tries
              </div>
              <div className="text-xl font-bold text-rose-600">
                {results.length}
              </div>
            </div>
          </div>
        )}

        {/* Recent Results */}
        {results.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-rose-50 p-4 rounded-lg mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
              Recent Results
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {results.map((time, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-mono font-bold ${
                    time === bestTime
                      ? "bg-amber-200 text-amber-800"
                      : "bg-white text-gray-600 shadow-sm"
                  }`}
                >
                  {time}ms
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reset Button */}
        {results.length > 0 && (
          <button
            className="bg-white text-gray-700 border-2 border-gray-300 py-2 px-6 text-sm font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:border-gray-400 hover:bg-gray-50 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform-none"
            onClick={resetAll}
          >
            Reset All
          </button>
        )}
      </div>
    </div>
  );
};

export default ReactionTimeGame;
