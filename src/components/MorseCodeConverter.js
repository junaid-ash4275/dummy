import React, { useState } from "react";

const MORSE_CODE_DICT = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  0: "-----",
  " ": "/",
};

const REVERSE_MORSE_CODE_DICT = Object.entries(MORSE_CODE_DICT).reduce(
  (acc, [key, value]) => {
    acc[value] = key;
    return acc;
  },
  {},
);

const MorseCodeConverter = () => {
  const [inputText, setInputText] = useState("");
  const [outputMorse, setOutputMorse] = useState("");
  const [mode, setMode] = useState("textToMorse"); // 'textToMorse' or 'morseToText'
  const [copied, setCopied] = useState(false);

  const convertToMorse = (text) => {
    return text
      .toUpperCase()
      .split("")
      .map((char) => {
        return MORSE_CODE_DICT[char] || char;
      })
      .join(" ");
  };

  const convertToText = (morse) => {
    return morse
      .split(" ")
      .map((code) => {
        return REVERSE_MORSE_CODE_DICT[code] || code;
      })
      .join("");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);
    if (mode === "textToMorse") {
      setOutputMorse(convertToMorse(value));
    } else {
      setOutputMorse(convertToText(value));
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "textToMorse" ? "morseToText" : "textToMorse"));
    setInputText("");
    setOutputMorse("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputMorse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-10 rounded-xl max-w-4xl w-full text-center shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">
          Morse Code Converter
        </h2>

        <div className="flex justify-center mb-6">
          <button
            onClick={toggleMode}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-full transition-all font-semibold border border-gray-200"
          >
            <span>{mode === "textToMorse" ? "Text" : "Morse Code"}</span>
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
            <span>{mode === "textToMorse" ? "Morse Code" : "Text"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="text-left">
            <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">
              Input {mode === "textToMorse" ? "Text" : "Morse"}
            </label>
            <textarea
              className="w-full h-40 p-4 border-2 border-gray-100 rounded-xl focus:border-teal-400 focus:outline-none transition-colors resize-none bg-gray-50 text-gray-800 font-mono"
              placeholder={
                mode === "textToMorse"
                  ? "Enter text here..."
                  : "Enter Morse code (dots . and dashes -)..."
              }
              value={inputText}
              onChange={handleInputChange}
            />
          </div>
          <div className="text-left relative">
            <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">
              Output {mode === "textToMorse" ? "Morse" : "Text"}
            </label>
            <div className="w-full h-40 p-4 border-2 border-teal-50 rounded-xl bg-teal-50/30 text-gray-800 font-mono break-all overflow-y-auto">
              {outputMorse || (
                <span className="text-gray-400 italic">
                  Translation will appear here...
                </span>
              )}
            </div>
            {outputMorse && (
              <button
                onClick={copyToClipboard}
                className="absolute bottom-4 right-4 bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg transition-all shadow-md active:scale-95"
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

        <div className="bg-gray-50 p-4 rounded-xl text-left border border-gray-100">
          <p className="text-xs text-gray-500 font-medium uppercase mb-2">
            Tip:
          </p>
          <p className="text-sm text-gray-600">
            {mode === "textToMorse"
              ? "Each Morse character is separated by a space. Words are separated by a slash (/)."
              : "Use dots (.) and dashes (-). Separate characters with spaces and words with slashes (/)."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MorseCodeConverter;
