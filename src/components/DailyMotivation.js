import React, { useState, useEffect } from "react";

const DailyMotivation = () => {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [selectedMood, setSelectedMood] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [streak, setStreak] = useState(0);

  const moods = [
    { emoji: "😊", label: "Happy", color: "from-yellow-400 to-orange-400" },
    { emoji: "😔", label: "Sad", color: "from-blue-400 to-indigo-500" },
    { emoji: "😤", label: "Stressed", color: "from-red-400 to-pink-500" },
    { emoji: "😴", label: "Tired", color: "from-purple-400 to-violet-500" },
    { emoji: "🤔", label: "Anxious", color: "from-teal-400 to-cyan-500" },
    { emoji: "💪", label: "Motivated", color: "from-green-400 to-emerald-500" },
  ];

  const motivationalQuotes = {
    Happy: [
      {
        quote:
          "Happiness is not something ready-made. It comes from your own actions.",
        author: "Dalai Lama",
      },
      {
        quote: "The purpose of our lives is to be happy.",
        author: "Dalai Lama",
      },
      { quote: "Joy is the simplest form of gratitude.", author: "Karl Barth" },
      {
        quote: "Spread happiness wherever you go today!",
        author: "Daily Motivation",
      },
    ],
    Sad: [
      {
        quote: "Every cloud has a silver lining. Keep looking up.",
        author: "Unknown",
      },
      {
        quote: "This too shall pass. Brighter days are ahead.",
        author: "Persian Proverb",
      },
      {
        quote: "It's okay to feel sad. Your feelings are valid.",
        author: "Daily Motivation",
      },
      {
        quote: "After every storm, there's a rainbow waiting for you.",
        author: "Unknown",
      },
    ],
    Stressed: [
      {
        quote: "Take a deep breath. You've got this.",
        author: "Daily Motivation",
      },
      {
        quote:
          "The greatest weapon against stress is our ability to choose one thought over another.",
        author: "William James",
      },
      {
        quote:
          "You don't have to control your thoughts. You just have to stop letting them control you.",
        author: "Dan Millman",
      },
      {
        quote: "Stress is caused by being 'here' but wanting to be 'there'.",
        author: "Eckhart Tolle",
      },
    ],
    Tired: [
      {
        quote: "Rest when you're weary. Refresh and renew yourself.",
        author: "Ralph Marston",
      },
      {
        quote: "Sometimes the most productive thing you can do is rest.",
        author: "Mark Black",
      },
      {
        quote: "Your body is telling you something. Listen to it.",
        author: "Daily Motivation",
      },
      { quote: "Even the sun sets to rise again. Rest up!", author: "Unknown" },
    ],
    Anxious: [
      {
        quote:
          "Worry does not empty tomorrow of its sorrow, it empties today of its strength.",
        author: "Corrie Ten Boom",
      },
      {
        quote:
          "You are braver than you believe, stronger than you seem, and smarter than you think.",
        author: "A.A. Milne",
      },
      {
        quote: "The only way out is through. You can handle this.",
        author: "Robert Frost",
      },
      {
        quote: "Breathe in calm, breathe out anxiety.",
        author: "Daily Motivation",
      },
    ],
    Motivated: [
      {
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
      },
      {
        quote:
          "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
      },
      {
        quote: "Your energy is contagious. Go change the world!",
        author: "Daily Motivation",
      },
      {
        quote: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt",
      },
    ],
  };

  useEffect(() => {
    // Load favorites and streak from localStorage
    const savedFavorites = localStorage.getItem("motivationFavorites");
    const savedStreak = localStorage.getItem("motivationStreak");
    const lastVisit = localStorage.getItem("lastMotivationVisit");

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Calculate streak
    const today = new Date().toDateString();
    if (lastVisit) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastVisit === yesterday.toDateString()) {
        const newStreak = (parseInt(savedStreak) || 0) + 1;
        setStreak(newStreak);
        localStorage.setItem("motivationStreak", newStreak.toString());
      } else if (lastVisit !== today) {
        setStreak(1);
        localStorage.setItem("motivationStreak", "1");
      } else {
        setStreak(parseInt(savedStreak) || 1);
      }
    } else {
      setStreak(1);
      localStorage.setItem("motivationStreak", "1");
    }
    localStorage.setItem("lastMotivationVisit", today);
  }, []);

  const getRandomQuote = (mood) => {
    const quotes = motivationalQuotes[mood];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setIsAnimating(true);
    const quote = getRandomQuote(mood);

    setTimeout(() => {
      setCurrentQuote(quote);
      setIsAnimating(false);
    }, 300);
  };

  const getNewQuote = () => {
    if (selectedMood) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuote(getRandomQuote(selectedMood));
        setIsAnimating(false);
      }, 300);
    }
  };

  const toggleFavorite = () => {
    if (!currentQuote) return;

    const quoteKey = `${currentQuote.quote}-${currentQuote.author}`;
    const isFavorited = favorites.some(
      (f) => `${f.quote}-${f.author}` === quoteKey
    );

    let newFavorites;
    if (isFavorited) {
      newFavorites = favorites.filter(
        (f) => `${f.quote}-${f.author}` !== quoteKey
      );
    } else {
      newFavorites = [...favorites, { ...currentQuote, mood: selectedMood }];
    }

    setFavorites(newFavorites);
    localStorage.setItem("motivationFavorites", JSON.stringify(newFavorites));
  };

  const isCurrentFavorited = () => {
    if (!currentQuote) return false;
    return favorites.some(
      (f) =>
        `${f.quote}-${f.author}` ===
        `${currentQuote.quote}-${currentQuote.author}`
    );
  };

  const getMoodColor = () => {
    const mood = moods.find((m) => m.label === selectedMood);
    return mood ? mood.color : "from-emerald-500 to-teal-600";
  };

  return (
    <div
      className={`flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br ${
        selectedMood
          ? getMoodColor()
          : "from-emerald-500 via-teal-500 to-cyan-600"
      } rounded-2xl m-5 shadow-2xl transition-all duration-700`}
    >
      <div className="bg-white p-8 rounded-xl max-w-lg w-full shadow-xl">
        {/* Header with streak */}
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-3xl font-bold bg-gradient-to-r ${
              selectedMood ? getMoodColor() : "from-emerald-500 to-teal-600"
            } bg-clip-text text-transparent transition-all duration-500`}
          >
            Daily Motivation
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-sm font-bold text-gray-700">
              {streak} day{streak !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Mood Selector */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-600 mb-3 text-center">
            How are you feeling today?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => handleMoodSelect(mood.label)}
                className={`p-3 rounded-xl transition-all duration-300 flex flex-col items-center ${
                  selectedMood === mood.label
                    ? `bg-gradient-to-r ${mood.color} text-white shadow-lg transform scale-105`
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-102"
                }`}
              >
                <span className="text-2xl mb-1">{mood.emoji}</span>
                <span className="text-xs font-medium">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quote Display */}
        {currentQuote && (
          <div
            className={`mb-6 transition-all duration-300 ${
              isAnimating
                ? "opacity-0 transform scale-95"
                : "opacity-100 transform scale-100"
            }`}
          >
            <div
              className={`bg-gradient-to-r ${getMoodColor()} bg-opacity-10 p-6 rounded-xl relative overflow-hidden`}
            >
              <div className="absolute top-2 left-4 text-6xl opacity-20 text-gray-400">
                "
              </div>
              <p className="text-lg text-gray-800 font-medium italic relative z-10 mb-4 pt-4">
                {currentQuote.quote}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">— {currentQuote.author}</p>
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isCurrentFavorited()
                      ? "text-red-500 bg-red-50"
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={getNewQuote}
            disabled={!selectedMood}
            className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
              selectedMood
                ? `bg-gradient-to-r ${getMoodColor()} text-white hover:shadow-lg hover:transform hover:-translate-y-0.5`
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            ✨ New Quote
          </button>
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`py-3 px-4 rounded-full font-semibold transition-all duration-300 ${
              showFavorites
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            ❤️ {favorites.length}
          </button>
        </div>

        {/* Favorites Section */}
        {showFavorites && favorites.length > 0 && (
          <div className="mt-6 max-h-48 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Your Favorites
            </h3>
            <div className="space-y-3">
              {favorites.map((fav, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 italic">"{fav.quote}"</p>
                  <p className="text-xs text-gray-500 mt-1">— {fav.author}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {showFavorites && favorites.length === 0 && (
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>No favorites yet! Tap the heart to save quotes.</p>
          </div>
        )}

        {/* Tip */}
        <p className="mt-6 text-xs text-center text-gray-500">
          💡 Select your mood and receive personalized motivation!
        </p>
      </div>
    </div>
  );
};

export default DailyMotivation;
