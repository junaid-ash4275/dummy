import React, { useState, useEffect, useRef } from 'react';

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' or 'break'
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (mode === 'work') {
      setCompletedSessions(completedSessions + 1);
      setMode('break');
      setMinutes(5);
      setSeconds(0);
    } else {
      setMode('work');
      setMinutes(25);
      setSeconds(0);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') {
      setMinutes(25);
    } else {
      setMinutes(5);
    }
    setSeconds(0);
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'work') {
      setMinutes(25);
    } else {
      setMinutes(5);
    }
    setSeconds(0);
  };

  const totalSeconds = mode === 'work' ? 25 * 60 : 5 * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  return (
    <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-10 rounded-xl max-w-md w-full text-center shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
          Pomodoro Timer
        </h2>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-6 justify-center">
          <button
            className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 ${
              mode === 'work'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            onClick={() => switchMode('work')}
          >
            Work
          </button>
          <button
            className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 ${
              mode === 'break'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            onClick={() => switchMode('break')}
          >
            Break
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative mb-8">
          {/* Progress Circle */}
          <svg className="w-64 h-64 mx-auto transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke={mode === 'work' ? '#10b981' : '#06b6d4'}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          
          {/* Time Display */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-6xl font-bold text-gray-800 font-mono">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-500 mt-2 uppercase tracking-wider">
              {mode === 'work' ? 'Focus Time' : 'Break Time'}
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center mb-6">
          <button
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-none py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-400/50 active:transform-none"
            onClick={toggleTimer}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            className="bg-white text-gray-700 border-2 border-gray-300 py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:border-gray-400 hover:bg-gray-50 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform-none"
            onClick={resetTimer}
          >
            Reset
          </button>
        </div>

        {/* Session Counter */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm font-medium">
            Completed Sessions Today
          </p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">
            {completedSessions}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
