import React, { useState, useEffect } from "react";

const FlashcardApp = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const savedCards = localStorage.getItem("flashcards");
    if (savedCards) {
      setFlashcards(JSON.parse(savedCards));
    } else {
      // Default cards
      const defaultCards = [
        {
          id: 1,
          question: "What is React?",
          answer: "A JavaScript library for building user interfaces.",
        },
        {
          id: 2,
          question: "What is JSX?",
          answer: "A syntax extension for JavaScript that looks like HTML.",
        },
        {
          id: 3,
          question: "What are hooks?",
          answer:
            "Functions that let you 'hook into' React state and lifecycle features from function components.",
        },
      ];
      setFlashcards(defaultCards);
      localStorage.setItem("flashcards", JSON.stringify(defaultCards));
    }
  }, []);

  const saveCards = (cards) => {
    setFlashcards(cards);
    localStorage.setItem("flashcards", JSON.stringify(cards));
  };

  const addCard = (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    const newCard = {
      id: Date.now(),
      question,
      answer,
    };

    const updatedCards = [...flashcards, newCard];
    saveCards(updatedCards);
    setQuestion("");
    setAnswer("");
  };

  const deleteCard = (id) => {
    const updatedCards = flashcards.filter((card) => card.id !== id);
    saveCards(updatedCards);
    if (isStudyMode && currentIndex >= updatedCards.length) {
      setCurrentIndex(Math.max(0, updatedCards.length - 1));
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + flashcards.length) % flashcards.length,
      );
    }, 150);
  };

  const toggleStudyMode = () => {
    setIsStudyMode(!isStudyMode);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-8 rounded-xl max-w-2xl w-full shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
            Flashcard Pro
          </h2>
          <button
            onClick={toggleStudyMode}
            disabled={flashcards.length === 0}
            className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 ${
              isStudyMode
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md hover:shadow-lg"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isStudyMode ? "Manage Cards" : "Start Studying"}
          </button>
        </div>

        {!isStudyMode ? (
          <div className="space-y-6">
            <form
              onSubmit={addCard}
              className="bg-gray-50 p-6 rounded-xl border border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., What is closure?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Answer
                  </label>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="e.g., A function bundled with its lexical environment."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform transition-all hover:-translate-y-0.5"
              >
                Add Flashcard
              </button>
            </form>

            <div className="max-h-80 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {flashcards.length === 0 ? (
                <p className="text-center text-gray-400 py-10">
                  No flashcards yet. Add some above!
                </p>
              ) : (
                flashcards.map((card) => (
                  <div
                    key={card.id}
                    className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{card.question}</p>
                      <p className="text-sm text-gray-500 italic">
                        {card.answer}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteCard(card.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete card"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-sm font-medium text-gray-400 mb-4">
              Card {currentIndex + 1} of {flashcards.length}
            </div>

            <div
              className="relative w-full h-64 perspective-1000 cursor-pointer mb-8"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
              >
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-pink-50 to-orange-50 border-2 border-pink-100 rounded-3xl flex items-center justify-center p-10 text-center shadow-inner">
                  <p className="text-2xl font-bold text-gray-800 leading-tight">
                    {flashcards[currentIndex]?.question}
                  </p>
                  <p className="absolute bottom-4 text-xs text-pink-400 font-semibold uppercase tracking-widest">
                    Click to reveal answer
                  </p>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white border-2 border-orange-100 rounded-3xl flex items-center justify-center p-10 text-center shadow-inner">
                  <p className="text-xl text-gray-700 italic leading-relaxed">
                    {flashcards[currentIndex]?.answer}
                  </p>
                  <p className="absolute bottom-4 text-xs text-orange-400 font-semibold uppercase tracking-widest">
                    Click to see question
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={prevCard}
                className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all hover:scale-110"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextCard}
                className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all hover:scale-110"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          .perspective-1000 {
            perspective: 1000px;
          }
          .transform-style-3d {
            transform-style: preserve-3d;
          }
          .backface-hidden {
            backface-visibility: hidden;
          }
          .rotate-y-180 {
            transform: rotateY(180deg);
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #fbcfe8;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #f9a8d4;
          }
        `}</style>
      </div>
    </div>
  );
};

export default FlashcardApp;
