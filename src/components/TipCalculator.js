import React, { useState, useEffect } from "react";

const TipCalculator = () => {
  const [bill, setBill] = useState("");
  const [tip, setTip] = useState(15);
  const [customTip, setCustomTip] = useState("");
  const [people, setPeople] = useState(1);
  const [results, setResults] = useState(null);

  useEffect(() => {
    calculateTip();
  }, [bill, tip, customTip, people]);

  const calculateTip = () => {
    const billNum = parseFloat(bill);
    const peopleNum = parseInt(people);
    const tipNum = customTip ? parseFloat(customTip) : tip;

    if (!billNum || isNaN(billNum) || !peopleNum || peopleNum < 1) {
      setResults(null);
      return;
    }

    const tipAmount = (billNum * tipNum) / 100;
    const totalAmount = billNum + tipAmount;
    const tipPerPerson = tipAmount / peopleNum;
    const totalPerPerson = totalAmount / peopleNum;

    setResults({
      tipAmount: tipAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      tipPerPerson: tipPerPerson.toFixed(2),
      totalPerPerson: totalPerPerson.toFixed(2),
      effectiveTip: tipNum,
    });
  };

  const handleCustomTipChange = (e) => {
    setCustomTip(e.target.value);
    if (e.target.value) setTip(null); // Deselect preset buttons
  };

  const handlePresetTip = (percentage) => {
    setTip(percentage);
    setCustomTip("");
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-rose-400 via-orange-400 to-amber-400 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-8 rounded-xl max-w-lg w-full shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
            Tip Calculator
          </h2>
          <span className="text-3xl">💸</span>
        </div>

        {/* Inputs */}
        <div className="grid gap-6 mb-8">
          {/* Bill Input */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Bill Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">
                $
              </span>
              <input
                type="number"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-2 bg-transparent text-2xl font-bold text-gray-800 placeholder-gray-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Tip Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-3">
              Select Tip %
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {[5, 10, 15, 20, 25].map((pct) => (
                <button
                  key={pct}
                  onClick={() => handlePresetTip(pct)}
                  className={`py-2 px-1 rounded-lg font-bold text-sm transition-all duration-200 transform hover:-translate-y-1 ${
                    tip === pct
                      ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-orange-100"
                  }`}
                >
                  {pct}%
                </button>
              ))}
              <input
                type="number"
                value={customTip}
                onChange={handleCustomTipChange}
                placeholder="Custom"
                className={`py-2 px-3 rounded-lg font-bold text-sm text-center border-2 focus:outline-none transition-all ${
                  customTip
                    ? "border-orange-400 text-orange-600 bg-orange-50"
                    : "border-gray-200 text-gray-600 focus:border-orange-300"
                }`}
              />
            </div>
          </div>

          {/* People Count */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-600">
                Number of People
              </label>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setPeople(Math.max(1, people - 1))}
                className="p-3 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
              >
                ➖
              </button>
              <span className="text-2xl font-bold text-gray-800 w-12 text-center">
                {people}
              </span>
              <button
                onClick={() => setPeople(people + 1)}
                className="p-3 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
              >
                ➕
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div
          className={`transition-all duration-500 transform ${
            results ? "opacity-100 translate-y-0" : "opacity-50 translate-y-4"
          }`}
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
            {/* Total Tip Amount */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-400 text-sm font-medium">Tip Amount</p>
                <p className="text-xs text-gray-500">/ person</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-orange-400">
                  ${results ? results.tipPerPerson : "0.00"}
                </p>
              </div>
            </div>

            {/* Total Bill Amount */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total</p>
                <p className="text-xs text-gray-500">/ person</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-teal-400">
                  ${results ? results.totalPerPerson : "0.00"}
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-gray-700 pt-4 flex justify-between text-sm text-gray-400">
              <div className="flex gap-4">
                <p>Bill: ${bill || "0"}</p>
                <p>Tip: {results?.effectiveTip || 0}%</p>
              </div>
              <p>People: {people}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setBill("");
              setTip(15);
              setCustomTip("");
              setPeople(1);
              setResults(null);
            }}
            className="w-full mt-4 py-3 rounded-xl font-bold text-orange-500 bg-orange-50 hover:bg-orange-100 transition-colors uppercase tracking-wider text-sm"
          >
            Reset Function
          </button>
        </div>
      </div>
    </div>
  );
};

export default TipCalculator;
