import React, { useState, useEffect } from 'react';

const WaterTracker = () => {
  const [intake, setIntake] = useState(0);
  const [goal, setGoal] = useState(2000);
  const [customAmount, setCustomAmount] = useState('');
  const [showGoalInput, setShowGoalInput] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedIntake = localStorage.getItem('water_intake');
    const savedGoal = localStorage.getItem('water_goal');
    const savedDate = localStorage.getItem('water_date');
    const today = new Date().toLocaleDateString();

    if (savedDate === today) {
      if (savedIntake) setIntake(parseInt(savedIntake));
      if (savedGoal) setGoal(parseInt(savedGoal));
    } else {
      localStorage.setItem('water_date', today);
      localStorage.setItem('water_intake', '0');
      setIntake(0);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('water_intake', intake.toString());
    localStorage.setItem('water_goal', goal.toString());
  }, [intake, goal]);

  const addWater = (amount) => {
    setIntake(prev => Math.min(prev + amount, goal * 2));
  };

  const handleCustomAdd = (e) => {
    e.preventDefault();
    const amount = parseInt(customAmount);
    if (!isNaN(amount) && amount > 0) {
      addWater(amount);
      setCustomAmount('');
    }
  };

  const resetTracker = () => {
    if (window.confirm('Reset today\'s intake?')) {
      setIntake(0);
    }
  };

  const percentage = Math.min((intake / goal) * 100, 100);

  return (
    <div className="flex justify-center items-center min-h-[450px] p-5 bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl max-w-md w-full shadow-xl border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-800 tracking-tight">Water Tracker</h2>
          <button 
            onClick={resetTracker}
            className="text-gray-400 hover:text-red-500 transition-colors p-2"
            title="Reset"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Progress Visualization */}
        <div className="relative h-64 w-48 mx-auto mb-8 bg-blue-50 rounded-b-3xl rounded-t-lg border-4 border-blue-200 overflow-hidden shadow-inner flex items-end">
          {/* Water Fill */}
          <div 
            className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 transition-all duration-1000 ease-in-out relative"
            style={{ height: `${percentage}%` }}
          >
            {/* Waves Effect (SVG) */}
            <div className="absolute top-0 left-0 w-full -mt-2">
              <svg className="w-full h-4 text-cyan-400 fill-current" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 10 Q25 0 50 10 T100 10 V20 H0 Z" />
              </svg>
            </div>
            
            {/* Bubbles */}
            <div className="absolute inset-0 overflow-hidden">
               {[...Array(5)].map((_, i) => (
                 <div 
                   key={i}
                   className="absolute bg-white/30 rounded-full animate-bounce"
                   style={{
                     width: `${Math.random() * 10 + 5}px`,
                     height: `${Math.random() * 10 + 5}px`,
                     left: `${Math.random() * 80 + 10}%`,
                     bottom: `${Math.random() * 90}%`,
                     animationDuration: `${Math.random() * 2 + 2}s`
                   }}
                 />
               ))}
            </div>
          </div>
          
          {/* Percentage Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-black text-blue-900 drop-shadow-sm">{Math.round((intake / goal) * 100)}%</span>
            <span className="text-xs font-bold text-blue-700 uppercase">{intake} / {goal} ml</span>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => addWater(250)}
              className="py-3 px-4 bg-blue-100 text-blue-700 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-sm"
            >
              +250ml
            </button>
            <button 
              onClick={() => addWater(500)}
              className="py-3 px-4 bg-blue-100 text-blue-700 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-sm"
            >
              +500ml
            </button>
          </div>

          <form onSubmit={handleCustomAdd} className="flex gap-2">
            <input 
              type="number" 
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Custom amount (ml)"
              className="flex-1 px-4 py-2 border-2 border-blue-100 rounded-xl focus:outline-none focus:border-blue-400"
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md"
            >
              Add
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 text-center">
            {showGoalInput ? (
              <div className="flex items-center justify-center gap-2">
                <input 
                  type="number"
                  value={goal}
                  onChange={(e) => setGoal(parseInt(e.target.value) || 0)}
                  className="w-24 px-2 py-1 border rounded text-center"
                />
                <button 
                  onClick={() => setShowGoalInput(false)}
                  className="text-xs font-bold text-blue-600 uppercase"
                >
                  Save Goal
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowGoalInput(true)}
                className="text-xs font-bold text-gray-500 hover:text-blue-600 uppercase tracking-widest"
              >
                Set Daily Goal: {goal}ml
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
