import React, { useState } from 'react';

const QuoteGenerator = () => {
  const quotes = [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      text: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs"
    },
    {
      text: "Life is what happens to you while you're busy making other plans.",
      author: "John Lennon"
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt"
    },
    {
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle"
    },
    {
      text: "The only impossible journey is the one you never begin.",
      author: "Tony Robbins"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney"
    }
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateNewQuote = () => {
    setIsAnimating(true);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-10 rounded-xl max-w-2xl text-center shadow-xl relative">
        <div className={`mb-8 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <blockquote className="text-2xl leading-relaxed text-gray-800 italic mb-5 font-light">
            "{currentQuote.text}"
          </blockquote>
          <cite className="text-base text-gray-600 font-medium block not-italic">
            — {currentQuote.author}
          </cite>
        </div>
        
        <button 
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-400/50 active:transform-none disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          onClick={generateNewQuote}
          disabled={isAnimating}
        >
          {isAnimating ? 'Loading...' : 'New Quote'}
        </button>
      </div>
    </div>
  );
};

export default QuoteGenerator;
