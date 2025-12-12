import React, { useState, useEffect } from "react";

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState("");
  const [age, setAge] = useState(null);
  const [nextBirthday, setNextBirthday] = useState(null);

  const calculateAge = () => {
    if (!birthDate) return;

    const today = new Date();
    const birth = new Date(birthDate);

    if (birth > today) {
      alert("Birth date cannot be in the future!");
      return;
    }

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setAge({ years, months, days });

    // Calculate next birthday countdown
    const nextBday = new Date(
      today.getFullYear(),
      birth.getMonth(),
      birth.getDate()
    );
    if (today > nextBday) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = Math.abs(nextBday - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setNextBirthday(diffDays);
  };

  const resetCalculator = () => {
    setBirthDate("");
    setAge(null);
    setNextBirthday(null);
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-pink-400 via-red-400 to-yellow-400 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-8 rounded-xl max-w-lg w-full shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
            Age Calculator
          </h2>
          <span className="text-3xl">🎂</span>
        </div>

        {/* Date Input */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Enter your Date of Birth
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-400 transition-colors text-lg"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={calculateAge}
            disabled={!birthDate}
            className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
              birthDate
                ? "bg-gradient-to-r from-pink-500 to-red-500 text-white hover:shadow-lg hover:transform hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Calculate Age
          </button>
          <button
            onClick={resetCalculator}
            className="py-3 px-6 rounded-full font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
          >
            Reset
          </button>
        </div>

        {/* Results */}
        {age && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-lg">
              <p className="text-gray-400 text-sm mb-2 font-medium">You are</p>
              <div className="flex justify-between items-end">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-yellow-400">
                    {age.years}
                  </span>
                  <span className="text-xs text-gray-400">Years</span>
                </div>
                <div className="text-center">
                  <span className="block text-3xl font-bold text-pink-400">
                    {age.months}
                  </span>
                  <span className="text-xs text-gray-400">Months</span>
                </div>
                <div className="text-center">
                  <span className="block text-3xl font-bold text-red-400">
                    {age.days}
                  </span>
                  <span className="text-xs text-gray-400">Days</span>
                </div>
              </div>
            </div>

            {nextBirthday !== null && (
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-red-600">Next Birthday</p>
                  <p className="text-xs text-red-400">Prepare for the party!</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-red-500">
                    {nextBirthday}
                  </span>
                  <span className="text-sm text-red-400 ml-1">days left</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgeCalculator;
