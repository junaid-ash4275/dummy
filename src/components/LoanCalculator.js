import React, { useState, useEffect } from "react";

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [termType, setTermType] = useState("years");
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const calculatedInterest = parseFloat(interestRate) / 100 / 12;
    const calculatedPayments =
      termType === "years" ? parseFloat(loanTerm) * 12 : parseFloat(loanTerm);

    // Compute monthly payment
    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);

    if (isFinite(monthly)) {
      setMonthlyPayment(monthly.toFixed(2));
      setTotalPayment((monthly * calculatedPayments).toFixed(2));
      setTotalInterest((monthly * calculatedPayments - principal).toFixed(2));
    } else {
      setMonthlyPayment(0);
      setTotalPayment(0);
      setTotalInterest(0);
    }
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm, termType]);

  return (
    <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-8 rounded-xl max-w-2xl w-full shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center">
          Loan Calculator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Loan Amount ($)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. 100000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. 5.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Loan Term
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. 30"
                />
                <select
                  value={termType}
                  onChange={(e) => setTermType(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex flex-col justify-center space-y-6">
            <div className="text-center">
              <p className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-1">
                Monthly Payment
              </p>
              <p className="text-4xl font-bold text-gray-800">
                ${monthlyPayment}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-indigo-200">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Total Payment
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  ${totalPayment}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Total Interest
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  ${totalInterest}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-500 text-center italic">
          * This calculator is for informational purposes only and does not
          constitute financial advice.
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
