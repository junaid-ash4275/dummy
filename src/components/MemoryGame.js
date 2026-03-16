import React, { useState, useEffect } from 'react';

const EMOJIS = ['🚀', '🎸', '🎮', '🧩', '🎨', '🎲', '🎭', '🎪'];

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledCards = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatches(0);
    setMoves(0);
  };

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    if (newFlippedIndices.length === 2) {
      setMoves((m) => m + 1);
      const [firstIndex, secondIndex] = newFlippedIndices;
      if (newCards[firstIndex].emoji === newCards[secondIndex].emoji) {
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        setMatches((m) => m + 1);
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[600px] p-5 bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 rounded-2xl m-5 shadow-2xl font-sans">
      <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl max-w-2xl w-full shadow-xl border border-white/40 flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-900 mb-2">Memory Match</h2>
        <p className="text-indigo-700/70 text-sm italic mb-6 text-center">Train your brain, match the pairs!</p>
        
        <div className="flex justify-between w-full max-w-sm mb-6 px-2 sm:px-4">
          <div className="bg-indigo-100/80 px-4 py-2 rounded-xl text-indigo-900 font-bold border border-indigo-200 shadow-sm">
            Moves: {moves}
          </div>
          <div className="bg-pink-100/80 px-4 py-2 rounded-xl text-pink-900 font-bold border border-pink-200 shadow-sm">
            Matches: {matches} / 8
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-8 perspective-1000">
          {cards.map((card, index) => (
            <div 
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`w-16 h-16 sm:w-20 sm:h-20 sm:text-4xl text-2xl flex justify-center items-center cursor-pointer rounded-xl transition-all duration-300 transform ${
                card.isFlipped || card.isMatched 
                  ? 'bg-white shadow-inner border border-indigo-100' 
                  : 'bg-indigo-500 hover:bg-indigo-600 shadow-lg hover:-translate-y-1 border border-indigo-400'
              }`}
            >
              <span className={`transition-opacity duration-300 ${card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'}`}>
                {card.emoji}
              </span>
            </div>
          ))}
        </div>

        {matches === 8 && (
          <div className="text-center animate-bounce mb-6">
            <h3 className="text-2xl font-bold text-pink-600">🎉 You Won in {moves} moves! 🎉</h3>
          </div>
        )}

        <button 
          onClick={initializeGame}
          className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          {matches === 8 ? 'Play Again' : 'Restart Game'}
        </button>
      </div>
    </div>
  );
};

export default MemoryGame;
