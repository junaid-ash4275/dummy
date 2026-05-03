import React, { useState, useEffect, useRef, useCallback } from "react";

const SENTENCES = [
  "The quick brown fox jumps over the lazy dog near the riverbank.",
  "A journey of a thousand miles begins with a single step forward.",
  "She sells seashells by the seashore every single morning.",
  "Technology is best when it brings people closer together.",
  "Every great developer you know got there by solving problems.",
  "The only way to do great work is to love what you do daily.",
  "In the middle of difficulty lies hidden opportunity for growth.",
  "Stars can not shine without a little bit of darkness around them.",
  "Practice makes progress and consistency breeds excellence always.",
  "The best time to plant a tree was twenty years ago or today.",
  "Success is not final and failure is not fatal so keep going.",
  "Creativity is intelligence having fun with wild new ideas.",
  "Code is like humor because when you explain it things get worse.",
  "First solve the problem and then write the elegant code for it.",
  "Simplicity is the ultimate form of sophistication in all design.",
];

const TypingSpeedTest = () => {
  const [currentSentence, setCurrentSentence] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [elapsed, setElapsed] = useState(0);
  const [bestWpm, setBestWpm] = useState(() => {
    const saved = localStorage.getItem("typing_speed_best_wpm");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("typing_speed_history");
    return saved ? JSON.parse(saved) : [];
  });
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const pickSentence = useCallback(() => {
    const idx = Math.floor(Math.random() * SENTENCES.length);
    return SENTENCES[idx];
  }, []);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setCurrentSentence(pickSentence());
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setIsActive(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setElapsed(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [pickSentence]);

  useEffect(() => {
    setCurrentSentence(pickSentence());
  }, [pickSentence]);

  useEffect(() => {
    if (isActive && !isFinished) {
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, isFinished, startTime]);

  useEffect(() => {
    localStorage.setItem("typing_speed_best_wpm", bestWpm.toString());
  }, [bestWpm]);

  useEffect(() => {
    localStorage.setItem("typing_speed_history", JSON.stringify(history));
  }, [history]);

  const calculateResults = useCallback(
    (input) => {
      const end = Date.now();
      const timeTaken = (end - startTime) / 1000 / 60; // in minutes
      const wordCount = currentSentence.trim().split(/\s+/).length;
      const calculatedWpm = Math.round(wordCount / timeTaken);

      let correct = 0;
      for (let i = 0; i < currentSentence.length; i++) {
        if (input[i] === currentSentence[i]) correct++;
      }
      const calculatedAccuracy = Math.round(
        (correct / currentSentence.length) * 100
      );

      setWpm(calculatedWpm);
      setAccuracy(calculatedAccuracy);
      setEndTime(end);
      setIsFinished(true);
      setIsActive(false);
      clearInterval(timerRef.current);

      if (calculatedWpm > bestWpm) {
        setBestWpm(calculatedWpm);
      }

      setHistory((prev) =>
        [
          {
            wpm: calculatedWpm,
            accuracy: calculatedAccuracy,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prev,
        ].slice(0, 5)
      );
    },
    [startTime, currentSentence, bestWpm]
  );

  const handleInput = (e) => {
    const value = e.target.value;

    if (!isActive && value.length === 1) {
      setStartTime(Date.now());
      setIsActive(true);
    }

    setUserInput(value);

    if (value.length >= currentSentence.length) {
      calculateResults(value);
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const getCharClass = (index) => {
    if (index >= userInput.length) return "text-gray-400";
    if (userInput[index] === currentSentence[index])
      return "text-emerald-600 bg-emerald-50";
    return "text-red-500 bg-red-50";
  };

  const getSpeedLabel = (speed) => {
    if (speed >= 80) return { text: "Blazing Fast", color: "text-amber-500" };
    if (speed >= 60) return { text: "Excellent", color: "text-emerald-500" };
    if (speed >= 40) return { text: "Good", color: "text-blue-500" };
    if (speed >= 20) return { text: "Keep Practicing", color: "text-purple-500" };
    return { text: "Getting Started", color: "text-gray-500" };
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl max-w-2xl w-full shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 mb-2">
            Typing Speed Test
          </h2>
          <p className="text-gray-500 font-medium">
            How fast can your fingers fly?
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-xl text-center border border-teal-100">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              WPM
            </p>
            <p className="text-3xl font-black text-teal-600">
              {isFinished ? wpm : isActive ? "..." : "—"}
            </p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl text-center border border-cyan-100">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Accuracy
            </p>
            <p className="text-3xl font-black text-cyan-600">
              {isFinished ? `${accuracy}%` : isActive ? "..." : "—"}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl text-center border border-blue-100">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Time
            </p>
            <p className="text-3xl font-black text-blue-600 font-mono">
              {isActive || isFinished ? formatTime(isFinished ? endTime - startTime : elapsed) : "—"}
            </p>
          </div>
        </div>

        {/* Sentence Display */}
        <div className="bg-gray-50 p-6 rounded-xl mb-4 min-h-[80px] border-2 border-gray-100 select-none">
          <p className="text-lg leading-relaxed font-mono tracking-wide">
            {currentSentence.split("").map((char, index) => (
              <span key={index} className={`${getCharClass(index)} rounded-sm px-[1px] transition-colors duration-100`}>
                {char}
              </span>
            ))}
          </p>
        </div>

        {/* Input */}
        <div className="relative mb-6">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInput}
            disabled={isFinished}
            placeholder={isFinished ? "Press 'Try Again' to restart" : "Start typing here..."}
            className={`w-full px-5 py-4 rounded-xl border-2 text-lg font-mono focus:outline-none transition-all ${
              isFinished
                ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                : isActive
                ? "border-teal-400 bg-white shadow-md shadow-teal-100"
                : "border-gray-200 focus:border-teal-400 bg-white"
            }`}
            autoComplete="off"
            spellCheck="false"
          />
          {isActive && !isFinished && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            </div>
          )}
        </div>

        {/* Results */}
        {isFinished && (
          <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 p-6 rounded-xl border border-teal-100 mb-6 text-center">
            <p className={`text-2xl font-black mb-1 ${getSpeedLabel(wpm).color}`}>
              {getSpeedLabel(wpm).text}!
            </p>
            <p className="text-gray-500 text-sm">
              You typed <span className="font-bold text-teal-600">{wpm} WPM</span> with{" "}
              <span className="font-bold text-cyan-600">{accuracy}%</span> accuracy
            </p>
            {wpm >= bestWpm && wpm > 0 && (
              <p className="mt-2 text-amber-500 font-bold text-sm animate-bounce">
                New Personal Best!
              </p>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="py-3 px-8 rounded-full font-bold text-base transition-all duration-300 bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-300/50 active:scale-95"
          >
            {isFinished ? "Try Again" : "New Sentence"}
          </button>
        </div>

        {/* Best & History */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Personal Best
            </p>
            <p className="text-2xl font-black text-amber-500">
              {bestWpm > 0 ? `${bestWpm} WPM` : "—"}
            </p>
          </div>
          {history.length > 0 && (
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Recent
              </p>
              <div className="flex flex-wrap gap-2">
                {history.map((h, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 text-xs font-semibold text-teal-700"
                  >
                    {h.wpm} WPM • {h.accuracy}%
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypingSpeedTest;
