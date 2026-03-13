import React, { useState, useEffect } from 'react';

const MemoryGame = () => {
  const emojis = ['🎮', '🕹️', '🎲', '🧩', '🎨', '🎬', '🎧', '🎸'];
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const initializeGame = () => {
    const shuffledCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, isFlipped: false }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTimeLeft(0);
    setTimerActive(false);
    setGameStarted(true);
  };

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first].emoji === cards[second].emoji) {
        setMatchedCards(prev => [...prev, cards[first].emoji]);
        setFlippedCards([]);
      } else {
        const timer = setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matchedCards.length === emojis.length) {
      setTimerActive(false);
    }
  }, [matchedCards, emojis.length]);

  const handleCardClick = (index) => {
    if (!timerActive && matchedCards.length < emojis.length) {
      setTimerActive(true);
    }

    if (
      flippedCards.length === 2 ||
      flippedCards.includes(index) ||
      matchedCards.includes(cards[index].emoji)
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-8 rounded-xl max-w-2xl w-full text-center shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          Emoji Memory Game
        </h2>

        {!gameStarted ? (
          <div className="py-10">
            <p className="text-gray-600 mb-8 italic">Test your memory and match all pairs!</p>
            <button
              onClick={initializeGame}
              className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-3 px-10 text-lg font-semibold rounded-full hover:shadow-lg hover:shadow-indigo-400/50 transition-all duration-300 transform hover:-translate-y-1"
            >
              Start Game
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-around mb-8 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Moves</p>
                <p className="text-2xl font-bold text-indigo-600">{moves}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Time</p>
                <p className="text-2xl font-bold text-pink-600">{formatTime(timeLeft)}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              {cards.map((card, index) => {
                const isFlipped = flippedCards.includes(index) || matchedCards.includes(card.emoji);
                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(index)}
                    className={`aspect-square flex items-center justify-center text-4xl cursor-pointer rounded-xl transition-all duration-500 preserve-3d relative ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    <div className={`absolute inset-0 bg-indigo-100 border-2 border-indigo-200 rounded-xl flex items-center justify-center backface-hidden shadow-md hover:bg-indigo-200 transition-colors ${isFlipped ? 'hidden' : 'block'}`}>
                      <span className="text-indigo-400 font-bold text-2xl">?</span>
                    </div>
                    <div className={`absolute inset-0 bg-white border-2 border-pink-200 rounded-xl flex items-center justify-center backface-hidden shadow-inner ${isFlipped ? 'block' : 'hidden'}`}>
                      {card.emoji}
                    </div>
                  </div>
                );
              })}
            </div>

            {matchedCards.length === emojis.length && (
              <div className="mb-6 animate-bounce">
                <p className="text-2xl font-bold text-green-500">🎉 Congratulations! You Won! 🎉</p>
              </div>
            )}

            <button
              onClick={initializeGame}
              className="bg-white text-gray-700 border-2 border-gray-300 py-2 px-8 font-semibold rounded-full hover:border-indigo-400 hover:text-indigo-500 transition-all duration-300"
            >
              {matchedCards.length === emojis.length ? 'Play Again' : 'Reset Game'}
            </button>
          </>
        )}
      </div>
      <style jsx>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default MemoryGame;
