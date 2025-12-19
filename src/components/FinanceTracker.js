import React, { useState, useEffect } from "react";

const FinanceTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense"); // income or expense

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("finance_transactions");
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("finance_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || isNaN(amount)) return;

    const newTransaction = {
      id: Date.now(),
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      date: new Date().toLocaleDateString(),
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription("");
    setAmount("");
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const calculateTotals = () => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expense;

    return { income, expense, balance };
  };

  const { income, expense, balance } = calculateTotals();

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl max-w-xl w-full shadow-xl border border-white/20">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Finance Tracker
            </h2>
            <p className="text-gray-500 text-sm">Manage your money wisely 💰</p>
          </div>
          <div className="text-4xl">🧾</div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 transition-transform hover:scale-105">
            <p className="text-xs text-emerald-600 font-bold uppercase mb-1">
              Total Income
            </p>
            <p className="text-xl font-bold text-emerald-700">
              ${income.toFixed(2)}
            </p>
          </div>
          <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 transition-transform hover:scale-105">
            <p className="text-xs text-rose-600 font-bold uppercase mb-1">
              Total Expense
            </p>
            <p className="text-xl font-bold text-rose-700">
              ${expense.toFixed(2)}
            </p>
          </div>
          <div
            className={`p-4 rounded-xl border transition-transform hover:scale-105 ${
              balance >= 0
                ? "bg-blue-50 border-blue-100"
                : "bg-orange-50 border-orange-100"
            }`}
          >
            <p
              className={`text-xs font-bold uppercase mb-1 ${
                balance >= 0 ? "text-blue-600" : "text-orange-600"
              }`}
            >
              Net Balance
            </p>
            <p
              className={`text-xl font-bold ${
                balance >= 0 ? "text-blue-700" : "text-orange-700"
              }`}
            >
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={addTransaction}
          className="space-y-4 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100"
        >
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Description (e.g. Groceries)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-emerald-400 transition-all text-gray-700"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full md:w-32 px-4 py-3 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-emerald-400 transition-all text-gray-700"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-emerald-400 transition-all text-gray-700 bg-white cursor-pointer"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all active:scale-95"
            >
              Add Transaction
            </button>
          </div>
        </form>

        {/* Transaction History */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            Transaction History
          </h3>
          <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {transactions.length === 0 ? (
              <p className="text-center text-gray-400 italic py-4">
                No transactions recorded yet.
              </p>
            ) : (
              transactions.map((t) => (
                <div
                  key={t.id}
                  className={`group flex items-center justify-between p-4 rounded-xl border-l-4 transition-all hover:bg-gray-50 ${
                    t.type === "income"
                      ? "border-emerald-500 bg-emerald-50/30"
                      : "border-rose-500 bg-rose-50/30"
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {t.description}
                    </p>
                    <p className="text-xs text-gray-500">{t.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-bold text-lg ${
                        t.type === "income"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="p-2 text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceTracker;
