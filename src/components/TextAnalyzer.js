import React, { useState } from "react";

const TextAnalyzer = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const getStats = () => {
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    const sentences =
      text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
    const readingTime = Math.ceil(words / 200); // Average 200 words per minute

    return { words, chars, sentences, readingTime };
  };

  const stats = getStats();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toTitleCase = () => {
    const newText = text
      .toLowerCase()
      .split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
    setText(newText);
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-8 rounded-xl max-w-2xl w-full shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            Text Analyzer
          </h2>
          <span className="text-3xl">📝</span>
        </div>

        {/* Text Area */}
        <div className="mb-6 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-50 resize-y text-gray-700 transition-all text-lg"
          ></textarea>
          {text && (
            <div className="absolute top-2 right-2 text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
              {stats.chars} chars
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-emerald-50 p-3 rounded-lg text-center border border-emerald-100">
            <span className="block text-2xl font-bold text-emerald-600">
              {stats.words}
            </span>
            <span className="text-xs text-gray-500 uppercase font-semibold">
              Words
            </span>
          </div>
          <div className="bg-teal-50 p-3 rounded-lg text-center border border-teal-100">
            <span className="block text-2xl font-bold text-teal-600">
              {stats.chars}
            </span>
            <span className="text-xs text-gray-500 uppercase font-semibold">
              Characters
            </span>
          </div>
          <div className="bg-cyan-50 p-3 rounded-lg text-center border border-cyan-100">
            <span className="block text-2xl font-bold text-cyan-600">
              {stats.sentences}
            </span>
            <span className="text-xs text-gray-500 uppercase font-semibold">
              Sentences
            </span>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
            <span className="block text-2xl font-bold text-blue-600">
              ~{stats.readingTime}
            </span>
            <span className="text-xs text-gray-500 uppercase font-semibold">
              Min Read
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setText(text.toUpperCase())}
            disabled={!text}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
          >
            UPPERCASE
          </button>
          <button
            onClick={() => setText(text.toLowerCase())}
            disabled={!text}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
          >
            lowercase
          </button>
          <button
            onClick={toTitleCase}
            disabled={!text}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
          >
            Title Case
          </button>

          <div className="flex-1"></div>

          <button
            onClick={handleCopy}
            disabled={!text}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
              copied
                ? "bg-green-100 text-green-700"
                : "bg-teal-50 text-teal-600 hover:bg-teal-100"
            } disabled:opacity-50`}
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
          <button
            onClick={() => setText("")}
            disabled={!text}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
          >
            🗑️ Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextAnalyzer;
