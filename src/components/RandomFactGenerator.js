import React, { useState } from 'react';

const RandomFactGenerator = () => {
  const [currentFact, setCurrentFact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [factHistory, setFactHistory] = useState([]);
  const [category, setCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', emoji: '🌟' },
    { id: 'science', name: 'Science', emoji: '🔬' },
    { id: 'history', name: 'History', emoji: '📜' },
    { id: 'nature', name: 'Nature', emoji: '🌿' },
    { id: 'space', name: 'Space', emoji: '🚀' }
  ];

  const facts = {
    science: [
      "A single bolt of lightning contains enough energy to toast 100,000 slices of bread.",
      "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible.",
      "The human brain uses 20% of the body's energy despite being only 2% of its mass.",
      "Water can boil and freeze at the same time under specific conditions called the 'triple point'.",
      "A teaspoon of neutron star material would weigh about 6 billion tons."
    ],
    history: [
      "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
      "Oxford University is older than the Aztec Empire by about 200 years.",
      "The shortest war in history lasted only 38 minutes between Britain and Zanzibar in 1896.",
      "Ancient Romans used urine as mouthwash due to its ammonia content.",
      "The Great Wall of China is not visible from space with the naked eye."
    ],
    nature: [
      "Octopuses have three hearts and blue blood.",
      "A group of flamingos is called a 'flamboyance'.",
      "Bamboo can grow up to 35 inches in a single day.",
      "Butterflies taste with their feet.",
      "A single tree can absorb up to 48 pounds of carbon dioxide per year."
    ],
    space: [
      "One day on Venus is longer than one year on Venus.",
      "There are more stars in the universe than grains of sand on all Earth's beaches.",
      "Footprints on the Moon will last for millions of years due to no wind or water erosion.",
      "The Sun makes up 99.86% of the mass of our entire solar system.",
      "A year on Mercury is just 88 Earth days long."
    ]
  };

  const getAllFacts = () => {
    return Object.values(facts).flat();
  };

  const generateFact = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const factPool = category === 'all' ? getAllFacts() : facts[category];
      const randomIndex = Math.floor(Math.random() * factPool.length);
      const newFact = factPool[randomIndex];
      
      setCurrentFact(newFact);
      setFactHistory(prev => [
        { fact: newFact, category: category, timestamp: new Date().toLocaleTimeString() },
        ...prev.slice(0, 2)
      ]);
      setIsLoading(false);
    }, 500);
  };

  const clearHistory = () => {
    setFactHistory([]);
  };

  return (
    <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-10 rounded-xl max-w-4xl w-full text-center shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-emerald-500 to-cyan-600 bg-clip-text text-transparent">
          Random Fact Generator
        </h2>

        {/* Category Selector */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`py-2 px-4 rounded-full font-semibold transition-all duration-300 ${
                category === cat.id
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              onClick={() => setCategory(cat.id)}
              disabled={isLoading}
            >
              <span className="mr-1">{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Fact Display */}
        <div className="mb-8 min-h-[150px] flex items-center justify-center">
          {currentFact ? (
            <div className={`bg-gradient-to-r from-emerald-50 to-cyan-50 p-8 rounded-xl shadow-lg transition-all duration-500 ${
              isLoading ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
            }`}>
              <p className="text-lg text-gray-800 leading-relaxed font-medium">
                {currentFact}
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-gray-400 text-lg">
                Click "Generate Fact" to discover something amazing!
              </p>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 mb-6">
          Category: <span className="font-semibold">{categories.find(c => c.id === category)?.name}</span>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white border-none py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-400/50 active:transform-none disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            onClick={generateFact}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Generate Fact'}
          </button>
          
          {factHistory.length > 0 && (
            <button
              className="bg-white text-gray-700 border-2 border-gray-300 py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:border-gray-400 hover:bg-gray-50 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform-none"
              onClick={clearHistory}
            >
              Clear History
            </button>
          )}
        </div>

        {/* Fact History */}
        {factHistory.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Facts</h3>
            <div className="space-y-3">
              {factHistory.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm text-left"
                >
                  <p className="text-sm text-gray-700 mb-2">
                    {item.fact}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-emerald-600 uppercase">
                      {categories.find(c => c.id === item.category)?.emoji} {categories.find(c => c.id === item.category)?.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!currentFact && (
          <p className="text-sm text-gray-500 mt-6 italic">
            Select a category and click "Generate Fact" to get started
          </p>
        )}
      </div>
    </div>
  );
};

export default RandomFactGenerator;
