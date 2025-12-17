import React, { useState, useEffect, useRef } from "react";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps([...laps, time]);
  };

  const formatTime = (timeInMs) => {
    const minutes = Math.floor((timeInMs / 60000) % 60);
    const seconds = Math.floor((timeInMs / 1000) % 60);
    const centiseconds = Math.floor((timeInMs / 10) % 100);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}:${String(centiseconds).padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-10 rounded-xl max-w-md w-full text-center shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          Stopwatch
        </h2>

        {/* Time Display */}
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-800 font-mono tracking-wider">
            {formatTime(time)}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            className={`py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider transform hover:-translate-y-0.5 hover:shadow-lg active:transform-none text-white ${
              isRunning
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-orange-400/50"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-indigo-400/50"
            }`}
            onClick={handleStartPause}
          >
            {isRunning ? "Pause" : "Start"}
          </button>

          <button
            className={`py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider transform hover:-translate-y-0.5 hover:shadow-lg active:transform-none bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 ${
              !isRunning && time > 0 ? "" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleReset}
            disabled={isRunning || time === 0}
          >
            Reset
          </button>

          <button
            className={`py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider transform hover:-translate-y-0.5 hover:shadow-lg active:transform-none bg-gray-200 text-gray-700 hover:bg-gray-300 ${
              !isRunning ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleLap}
            disabled={!isRunning}
          >
            Lap
          </button>
        </div>

        {/* Laps List */}
        {laps.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto custom-scrollbar">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-3">
              Laps
            </h3>
            <div className="space-y-2">
              {laps.map((lapTime, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-gray-700 p-2 bg-white rounded shadow-sm"
                >
                  <span className="font-medium text-gray-400">
                    #{index + 1}
                  </span>
                  <span className="font-mono font-bold text-indigo-600">
                    {formatTime(lapTime)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {index > 0
                      ? `+${formatTime(lapTime - laps[index - 1])}`
                      : formatTime(lapTime)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;
