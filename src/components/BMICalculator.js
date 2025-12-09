import React, { useState, useEffect } from "react";

const BMICalculator = () => {
  const [system, setSystem] = useState("metric"); // metric or imperial
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("bmiHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const calculateBMI = () => {
    if (!height || !weight || isNaN(height) || isNaN(weight)) {
      return;
    }

    let heightInMeters, weightInKg;

    if (system === "metric") {
      heightInMeters = parseFloat(height) / 100; // cm to meters
      weightInKg = parseFloat(weight);
    } else {
      // Imperial: height in inches, weight in pounds
      heightInMeters = parseFloat(height) * 0.0254; // inches to meters
      weightInKg = parseFloat(weight) * 0.453592; // pounds to kg
    }

    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    const roundedBMI = bmiValue.toFixed(1);
    setBmi(roundedBMI);

    // Determine category
    let cat = "";
    if (bmiValue < 18.5) {
      cat = "Underweight";
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      cat = "Normal weight";
    } else if (bmiValue >= 25 && bmiValue < 30) {
      cat = "Overweight";
    } else {
      cat = "Obese";
    }
    setCategory(cat);

    // Save to history
    const newEntry = {
      bmi: roundedBMI,
      category: cat,
      date: new Date().toLocaleDateString(),
      system,
      height: parseFloat(height),
      weight: parseFloat(weight),
    };

    const newHistory = [newEntry, ...history].slice(0, 10); // Keep last 10 entries
    setHistory(newHistory);
    localStorage.setItem("bmiHistory", JSON.stringify(newHistory));
  };

  const getCategoryColor = () => {
    switch (category) {
      case "Underweight":
        return "from-blue-400 to-cyan-500";
      case "Normal weight":
        return "from-green-400 to-emerald-500";
      case "Overweight":
        return "from-yellow-400 to-orange-500";
      case "Obese":
        return "from-red-400 to-pink-500";
      default:
        return "from-purple-400 to-indigo-500";
    }
  };

  const getCategoryEmoji = () => {
    switch (category) {
      case "Underweight":
        return "🍽️";
      case "Normal weight":
        return "✅";
      case "Overweight":
        return "⚠️";
      case "Obese":
        return "🚨";
      default:
        return "📊";
    }
  };

  const getCategoryMessage = () => {
    switch (category) {
      case "Underweight":
        return "Consider consulting a healthcare provider for personalized advice.";
      case "Normal weight":
        return "Great job! Keep maintaining a healthy lifestyle.";
      case "Overweight":
        return "Consider a balanced diet and regular exercise.";
      case "Obese":
        return "Consult a healthcare provider for a personalized health plan.";
      default:
        return "";
    }
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setCategory("");
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("bmiHistory");
  };

  const getBMIPosition = () => {
    if (!bmi) return 50;
    const bmiNum = parseFloat(bmi);
    // Map BMI to percentage (0-40 BMI range)
    if (bmiNum < 15) return 0;
    if (bmiNum > 40) return 100;
    return ((bmiNum - 15) / 25) * 100;
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-8 rounded-xl max-w-lg w-full shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent">
            BMI Calculator
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            {history.length > 0 && (
              <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                {history.length} saved
              </span>
            )}
          </div>
        </div>

        {/* System Toggle */}
        <div className="flex gap-2 mb-6 justify-center">
          <button
            onClick={() => {
              setSystem("metric");
              resetCalculator();
            }}
            className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 ${
              system === "metric"
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Metric (cm/kg)
          </button>
          <button
            onClick={() => {
              setSystem("imperial");
              resetCalculator();
            }}
            className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 ${
              system === "imperial"
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Imperial (in/lb)
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Height {system === "metric" ? "(cm)" : "(inches)"}
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={system === "metric" ? "e.g., 170" : "e.g., 67"}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Weight {system === "metric" ? "(kg)" : "(pounds)"}
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={system === "metric" ? "e.g., 70" : "e.g., 154"}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={calculateBMI}
            disabled={!height || !weight}
            className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
              height && weight
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg hover:transform hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Calculate BMI
          </button>
          <button
            onClick={resetCalculator}
            className="py-3 px-4 rounded-full font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
          >
            Reset
          </button>
        </div>

        {/* BMI Result */}
        {bmi && (
          <div className="mb-6 transition-all duration-500 animate-fadeIn">
            <div
              className={`bg-gradient-to-r ${getCategoryColor()} p-6 rounded-xl text-white`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium opacity-90 mb-1">
                    Your BMI
                  </p>
                  <p className="text-5xl font-bold">{bmi}</p>
                </div>
                <span className="text-4xl">{getCategoryEmoji()}</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <p className="font-semibold text-lg mb-1">{category}</p>
                <p className="text-sm opacity-90">{getCategoryMessage()}</p>
              </div>
            </div>

            {/* BMI Scale */}
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <p className="text-xs font-medium text-gray-600 mb-2 text-center">
                BMI Scale
              </p>
              <div className="relative h-8 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-500"
                  style={{ left: `${getBMIPosition()}%` }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {bmi}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>15</span>
                <span className="text-center">18.5</span>
                <span className="text-center">25</span>
                <span className="text-center">30</span>
                <span>40</span>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Under</span>
                <span>Normal</span>
                <span>Over</span>
                <span>Obese</span>
              </div>
            </div>
          </div>
        )}

        {/* History Toggle */}
        {history.length > 0 && (
          <div className="space-y-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full py-2 px-4 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>📜</span>
              <span>{showHistory ? "Hide" : "Show"} History</span>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                {history.length}
              </span>
            </button>

            {showHistory && (
              <div className="max-h-64 overflow-y-auto space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Previous Calculations
                  </p>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                {history.map((entry, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        BMI: {entry.bmi} - {entry.category}
                      </p>
                      <p className="text-xs text-gray-500">
                        {entry.height} {entry.system === "metric" ? "cm" : "in"}{" "}
                        / {entry.weight}{" "}
                        {entry.system === "metric" ? "kg" : "lb"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{entry.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <p className="mt-6 text-xs text-center text-gray-500">
          💡 BMI is a screening tool and should not be used as a diagnostic
          tool.
        </p>
      </div>
    </div>
  );
};

export default BMICalculator;
