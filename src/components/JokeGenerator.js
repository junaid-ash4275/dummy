import React, { useState, useEffect } from "react";

const JokeGenerator = () => {
  const [joke, setJoke] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPunchline, setShowPunchline] = useState(false);

  const fetchJoke = async () => {
    try {
      setLoading(true);
      setShowPunchline(false);
      const response = await fetch(
        "https://official-joke-api.appspot.com/random_joke"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch joke");
      }
      const data = await response.json();
      setJoke({
        setup: data.setup,
        punchline: data.punchline,
      });
      setError(null);

      // Auto-show punchline after a short delay for effect
      setTimeout(() => setShowPunchline(true), 2000);

    } catch (err) {
      setError("Failed to load joke. Please try again.");
      console.error("Error fetching joke:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-10 rounded-xl max-w-2xl w-full text-center shadow-xl relative">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
          Random Joke Generator
        </h2>

        <div className="min-h-[200px] flex flex-col justify-center items-center mb-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4"></div>
              <p className="text-gray-500 animate-pulse">Finding a funny one...</p>
            </div>
          ) : error ? (
            <p className="text-red-500 text-lg">{error}</p>
          ) : (
            <div className="space-y-6">
              <p className="text-2xl text-gray-700 font-medium leading-relaxed">
                "{joke.setup}"
              </p>

              <div className={`transition-all duration-500 transform ${showPunchline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                  {joke.punchline} 😆
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={fetchJoke}
          disabled={loading}
          className="bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-none py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-400/50 active:transform-none disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Loading...' : 'Get Another Joke'}
        </button>
      </div>
    </div>
  );
};

export default JokeGenerator;
