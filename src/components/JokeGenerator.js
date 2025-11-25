import React, { useState, useEffect } from "react";

const JokeGenerator = () => {
  const [joke, setJoke] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJoke = async () => {
    try {
      setLoading(true);
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
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        <span className="inline-block border-b-2 border-indigo-100 pb-1">
          Random Joke
        </span>
      </h2>

      <div className="min-h-32 p-6 bg-gray-50 rounded-lg mb-6 border border-gray-100">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse flex space-x-4">
              <div className="h-4 w-4 bg-indigo-200 rounded-full"></div>
              <div className="h-4 w-4 bg-indigo-200 rounded-full"></div>
              <div className="h-4 w-4 bg-indigo-200 rounded-full"></div>
            </div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4 italic">"{joke.setup}"</p>
            <p className="text-lg font-medium text-indigo-600 transition-all duration-300 transform hover:scale-105 inline-block">
              {joke.punchline}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={fetchJoke}
          disabled={loading}
          className={`py-2 px-6 rounded-full text-white font-medium transition-all duration-300 transform hover:scale-105 ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md"
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
            </span>
          ) : (
            <span className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Another Joke
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default JokeGenerator;
