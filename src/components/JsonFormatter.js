import React, { useState } from "react";

const JsonFormatter = () => {
  const [inputJson, setInputJson] = useState("");
  const [outputJson, setOutputJson] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      if (!inputJson.trim()) return;
      const parsed = JSON.parse(inputJson);
      setOutputJson(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (err) {
      setError("Invalid JSON string: " + err.message);
      setOutputJson("");
    }
  };

  const handleInputChange = (e) => {
    setInputJson(e.target.value);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInputJson("");
    setOutputJson("");
    setError("");
  };

  return (
    <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-10 rounded-xl max-w-4xl w-full text-center shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          JSON Formatter
        </h2>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={formatJson}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full transition-all font-semibold shadow-md active:scale-95"
          >
            Format JSON
          </button>
          <button
            onClick={clearAll}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-full transition-all font-semibold border border-gray-200 shadow-sm active:scale-95"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="mb-4 text-left text-sm text-red-600 font-semibold bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="text-left w-full h-full flex flex-col">
            <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">
              Input Form
            </label>
            <textarea
              className="flex-1 w-full h-64 p-4 border-2 border-gray-100 rounded-xl focus:border-indigo-400 focus:outline-none transition-colors resize-none bg-gray-50 text-gray-800 font-mono text-sm leading-relaxed"
              placeholder="Paste your unformatted JSON here..."
              value={inputJson}
              onChange={handleInputChange}
            />
          </div>
          <div className="text-left relative w-full h-full flex flex-col">
            <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">
              Formatted Viewer
            </label>
            <div className="relative flex-1">
              <textarea
                readOnly
                className="w-full h-64 p-4 border-2 border-indigo-50 rounded-xl bg-indigo-50/30 text-gray-800 font-mono text-sm leading-relaxed resize-none focus:outline-none"
                value={outputJson}
                placeholder="Formatted JSON will appear here..."
              />
              {outputJson && (
                <button
                  onClick={copyToClipboard}
                  className="absolute bottom-4 right-4 bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-lg transition-all shadow-md active:scale-95"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl text-left border border-gray-100">
          <p className="text-xs text-gray-500 font-medium uppercase mb-2">
            Tip:
          </p>
          <p className="text-sm text-gray-600">
            Paste messy JSON on the left and click "Format JSON" to beautify it
            on the right.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
