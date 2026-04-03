import React, { useState, useEffect } from 'react';

const FlashcardApp = () => {
  const [cards, setCards] = useState([
    { id: 1, question: 'What is React?', answer: 'A JavaScript library for building user interfaces.' },
    { id: 2, question: 'What is Tailwind CSS?', answer: 'A utility-first CSS framework for rapid UI development.' },
    { id: 3, question: 'What does "MERN" stand for?', answer: 'MongoDB, Express, React, and Node.js.' }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedCards = localStorage.getItem('study_flashcards');
    if (savedCards) {
      try {
        setCards(JSON.parse(savedCards));
      } catch (e) {
        console.error('Failed to load cards', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('study_flashcards', JSON.stringify(cards));
  }, [cards]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    
    const newCard = {
      id: Date.now(),
      question: newQuestion.trim(),
      answer: newAnswer.trim()
    };
    
    setCards([...cards, newCard]);
    setNewQuestion('');
    setNewAnswer('');
    setShowAddForm(false);
  };

  const handleDeleteCard = (id) => {
    if (cards.length <= 1) {
      alert("You need at least one card in your deck!");
      return;
    }
    const filtered = cards.filter(c => c.id !== id);
    setCards(filtered);
    if (currentIndex >= filtered.length) {
      setCurrentIndex(0);
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="flex justify-center items-center min-h-[600px] p-5 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-2xl m-5 shadow-2xl font-sans overflow-hidden">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
      
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl max-w-2xl w-full shadow-xl border border-white/40">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Flashcard Study Tool
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors"
              title="Add New Card"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button 
              onClick={handleShuffle}
              className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
              title="Shuffle Cards"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {showAddForm ? (
          <form onSubmit={handleAddCard} className="bg-orange-50 p-6 rounded-xl mb-6 shadow-inner border border-orange-100 animate-fadeIn">
            <h3 className="font-bold text-orange-800 mb-4">Add New Flashcard</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-orange-700 uppercase mb-1">Question / Term</label>
                <input 
                  type="text" 
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. Hooks"
                  className="w-full px-4 py-2 rounded-lg border-2 border-orange-200 focus:outline-none focus:border-orange-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-orange-700 uppercase mb-1">Answer / Definition</label>
                <textarea 
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="e.g. Functions that let you hook into React state..."
                  className="w-full px-4 py-2 rounded-lg border-2 border-orange-200 focus:outline-none focus:border-orange-500 bg-white h-24 resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-2 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Save Card
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : null}

        <div className="flex flex-col items-center">
          {/* Card Component */}
          {cards.length > 0 ? (
            <>
              <div 
                className="w-full h-80 perspective-1000 cursor-pointer group mb-8"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                  {/* Front */}
                  <div className="absolute w-full h-full bg-white rounded-2xl shadow-lg border-2 border-orange-100 flex flex-col justify-center items-center p-8 backface-hidden">
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-4">Question</span>
                    <h3 className="text-2xl font-bold text-gray-800 leading-tight">
                      {currentCard.question}
                    </h3>
                    <p className="mt-auto text-xs text-gray-400 animate-pulse italic">Click to reveal answer</p>
                  </div>
                  
                  {/* Back */}
                  <div className="absolute w-full h-full bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-lg border-2 border-red-100 flex flex-col justify-center items-center p-8 backface-hidden rotate-y-180">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4">Answer</span>
                    <p className="text-xl text-gray-700 font-medium overflow-y-auto max-h-full">
                      {currentCard.answer}
                    </p>
                    <p className="mt-auto text-xs text-gray-400 italic">Click to see question</p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between w-full px-4">
                <button 
                  onClick={handlePrev}
                  className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition-all active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-400">
                    Card <span className="text-orange-600">{currentIndex + 1}</span> of {cards.length}
                  </p>
                </div>

                <button 
                  onClick={handleNext}
                  className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition-all active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <button 
                onClick={() => handleDeleteCard(currentCard.id)}
                className="mt-8 text-xs font-semibold text-red-300 hover:text-red-500 uppercase tracking-tighter transition-colors"
                title="Remove this card from deck"
              >
                Delete this card
              </button>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 italic mb-4">No cards in your deck.</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition-colors"
              >
                Create Your First Card
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardApp;
