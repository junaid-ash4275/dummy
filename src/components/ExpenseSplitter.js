import React, { useState, useEffect } from "react";

const ExpenseSplitter = () => {
  const [totalAmount, setTotalAmount] = useState("");
  const [numPeople, setNumPeople] = useState("2");
  const [tipPercentage, setTipPercentage] = useState("0");
  const [history, setHistory] = useState([]);
  const [splitResult, setSplitResult] = useState(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem("expenseHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const calculateSplit = () => {
    const amount = parseFloat(totalAmount);
    const people = parseInt(numPeople);
    const tip = parseFloat(tipPercentage);

    if (isNaN(amount) || isNaN(people) || people <= 0) return;

    const totalWithTip = amount + amount * (tip / 100);
    const perPerson = totalWithTip / people;

    const result = {
      id: Date.now(),
      totalAmount: amount,
      numPeople: people,
      tipPercentage: tip,
      totalWithTip: totalWithTip.toFixed(2),
      perPerson: perPerson.toFixed(2),
      date:
        new Date().toLocaleDateString() +
        " " +
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    };

    setSplitResult(result);
    const newHistory = [result, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("expenseHistory", JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("expenseHistory");
  };

  const resetFields = () => {
    setTotalAmount("");
    setNumPeople("2");
    setTipPercentage("0");
    setSplitResult(null);
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-8 rounded-xl max-w-lg w-full shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            Expense Splitter
          </h2>
          <div className="text-2xl">💸</div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-emerald-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-emerald-700 mb-2">
              Total Amount ($)
            </label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 border-2 border-emerald-100 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cyan-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-cyan-700 mb-2">
                Number of People
              </label>
              <input
                type="number"
                value={numPeople}
                onChange={(e) => setNumPeople(e.target.value)}
                min="1"
                className="w-full px-4 py-3 border-2 border-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div className="bg-teal-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-teal-700 mb-2">
                Tip (%)
              </label>
              <select
                value={tipPercentage}
                onChange={(e) => setTipPercentage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-teal-100 rounded-lg focus:outline-none focus:border-teal-500 transition-colors bg-white"
              >
                <option value="0">0%</option>
                <option value="10">10%</option>
                <option value="15">15%</option>
                <option value="20">20%</option>
                <option value="25">25%</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={calculateSplit}
            disabled={!totalAmount}
            className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
              totalAmount
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:transform hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Split Bill
          </button>
          <button
            onClick={resetFields}
            className="py-3 px-4 rounded-full font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
          >
            Reset
          </button>
        </div>

        {splitResult && (
          <div className="mb-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-6 rounded-xl text-white shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm font-medium opacity-90 mb-1">
                    Each Person Pays
                  </p>
                  <p className="text-5xl font-bold">${splitResult.perPerson}</p>
                </div>
                <span className="text-4xl text-white/80">✨</span>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span>Total (Inc. Tip)</span>
                  <span className="font-bold">${splitResult.totalWithTip}</span>
                </div>
                <div className="flex justify-between">
                  <span>Split between</span>
                  <span className="font-bold">
                    {splitResult.numPeople} people
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-700">Recent Splits</h3>
              <button
                onClick={clearHistory}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-emerald-600">
                      ${entry.perPerson} / person
                    </p>
                    <p className="text-xs text-gray-500">
                      Total: ${entry.totalWithTip} • {entry.numPeople} ppl
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseSplitter;
