import React, { useState, useEffect } from 'react';

const ColorPalette = () => {
  const [colors, setColors] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate random hex color
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Generate a palette of 5 colors
  const generatePalette = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newPalette = Array.from({ length: 5 }, () => generateRandomColor());
      setColors(newPalette);
      setIsGenerating(false);
    }, 200);
  };

  // Copy color to clipboard
  const copyToClipboard = (color, index) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  // Generate initial palette on mount
  useEffect(() => {
    generatePalette();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-10 rounded-xl max-w-4xl w-full text-center shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
          Color Palette Generator
        </h2>
        
        <div className={`grid grid-cols-5 gap-4 mb-8 transition-opacity duration-200 ${isGenerating ? 'opacity-50' : 'opacity-100'}`}>
          {colors.map((color, index) => (
            <div 
              key={index}
              className="flex flex-col items-center group cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => copyToClipboard(color, index)}
            >
              <div 
                className="w-full h-32 rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300"
                style={{ backgroundColor: color }}
              ></div>
              <div className="mt-3 relative">
                <p className="text-sm font-mono font-semibold text-gray-700 group-hover:text-gray-900">
                  {color}
                </p>
                {copiedIndex === index && (
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white border-none py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-400/50 active:transform-none disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            onClick={generatePalette}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate New Palette'}
          </button>
          
          <button 
            className="bg-white text-gray-700 border-2 border-gray-300 py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:border-gray-400 hover:bg-gray-50 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform-none"
            onClick={() => {
              const paletteString = colors.join(', ');
              navigator.clipboard.writeText(paletteString);
            }}
          >
            Copy All
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-6 italic">
          Click on any color to copy its hex code
        </p>
      </div>
    </div>
  );
};

export default ColorPalette;
