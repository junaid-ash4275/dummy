import React, { useState } from 'react';

const DiceRoller = () => {
  const [currentRoll, setCurrentRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollHistory, setRollHistory] = useState([]);
  const [selectedDice, setSelectedDice] = useState(6);

  const diceOptions = [1, 2, 3, 4, 5, 6];

  const rollDice = () => {
    setIsRolling(true);
    
    // Animate the roll
    let counter = 0;
    const rollInterval = setInterval(() => {
      setCurrentRoll(Math.floor(Math.random() * selectedDice) + 1);
      counter++;
      
      if (counter > 10) {
        clearInterval(rollInterval);
        const finalRoll = Math.floor(Math.random() * selectedDice) + 1;
        setCurrentRoll(finalRoll);
        setRollHistory(prev => [
          { dice: selectedDice, result: finalRoll, timestamp: new Date().toLocaleTimeString() },
          ...prev.slice(0, 4)
        ]);
        setIsRolling(false);
      }
    }, 100);
  };

  const clearHistory = () => {
    setRollHistory([]);
  };

  // Dice face SVG component
  const DiceFace = ({ value, size = 6 }) => {
    const dots = [];
    const positions = {
      1: [[50, 50]],
      2: [[25, 25], [75, 75]],
      3: [[25, 25], [50, 50], [75, 75]],
      4: [[25, 25], [75, 25], [25, 75], [75, 75]],
      5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
      6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]]
    };

    const dotPositions = positions[value] || positions[1];

    return (
      <div className={`relative bg-white rounded-2xl shadow-2xl border-4 border-gray-200 ${isRolling ? 'animate-bounce' : ''}`}
           style={{ width: '180px', height: '180px' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full p-4">
          {dotPositions.map((pos, idx) => (
            <circle
              key={idx}
              cx={pos[0]}
              cy={pos[1]}
              r="8"
              className="fill-gray-800"
            />
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-10 rounded-xl max-w-4xl w-full text-center shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">
          Dice Roller
        </h2>

        {/* Dice Type Selector */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {diceOptions.map(dice => (
            <button
              key={dice}
              className={`py-2 px-4 rounded-full font-semibold transition-all duration-300 ${
                selectedDice === dice
                  ? 'bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedDice(dice)}
              disabled={isRolling}
            >
              D{dice}
            </button>
          ))}
        </div>

        {/* Dice Display */}
        <div className="mb-8 flex justify-center">
          {currentRoll && currentRoll <= 6 ? (
            <DiceFace value={currentRoll} size={selectedDice} />
          ) : (
            <div className={`relative bg-white rounded-2xl shadow-2xl border-4 border-gray-200 flex items-center justify-center ${isRolling ? 'animate-bounce' : ''}`}
                 style={{ width: '180px', height: '180px' }}>
              <div className="text-7xl font-bold text-gray-800">
                {currentRoll || '?'}
              </div>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 mb-6">
          Rolling a D{selectedDice}
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            className="bg-gradient-to-r from-blue-500 to-violet-600 text-white border-none py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-400/50 active:transform-none disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            onClick={rollDice}
            disabled={isRolling}
          >
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </button>
          
          {rollHistory.length > 0 && (
            <button
              className="bg-white text-gray-700 border-2 border-gray-300 py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:border-gray-400 hover:bg-gray-50 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform-none"
              onClick={clearHistory}
            >
              Clear History
            </button>
          )}
        </div>

        {/* Roll History */}
        {rollHistory.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-violet-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Rolls</h3>
            <div className="space-y-2">
              {rollHistory.map((roll, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm"
                >
                  <span className="font-mono font-bold text-gray-800">
                    D{roll.dice}
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {roll.result}
                  </span>
                  <span className="text-xs text-gray-500">
                    {roll.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!currentRoll && (
          <p className="text-sm text-gray-500 mt-6 italic">
            Select a dice type and click "Roll Dice" to get started
          </p>
        )}
      </div>
    </div>
  );
};

export default DiceRoller;
