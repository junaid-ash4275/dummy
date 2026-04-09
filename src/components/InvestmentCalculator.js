import React, { useState, useEffect } from 'react';

const InvestmentCalculator = () => {
    // State for inputs
    const [initialAmount, setInitialAmount] = useState(10000);
    const [monthlyContribution, setMonthlyContribution] = useState(500);
    const [interestRate, setInterestRate] = useState(7);
    const [years, setYears] = useState(10);
    
    // Result states
    const [results, setResults] = useState({
        futureValue: 0,
        totalContributions: 0,
        totalInterest: 0,
        totalInvested: 0
    });
    
    // History state
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    // Load history on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('investmentHistory');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Perform calculation whenever inputs change
    useEffect(() => {
        calculateResults();
    }, [initialAmount, monthlyContribution, interestRate, years]);

    const calculateResults = () => {
        const P = parseFloat(initialAmount) || 0;
        const PMT = parseFloat(monthlyContribution) || 0;
        const r = (parseFloat(interestRate) || 0) / 100 / 12;
        const n = (parseFloat(years) || 0) * 12;

        let futureValue = 0;
        let totalContributions = PMT * n;
        let totalInvested = P + totalContributions;

        if (r === 0) {
            futureValue = totalInvested;
        } else {
            // Future Value of the initial investment: P(1 + r)^n
            const fvPrincipal = P * Math.pow(1 + r, n);
            // Future Value of a series of monthly contributions: PMT * [((1 + r)^n - 1) / r]
            const fvAnnuity = PMT * ((Math.pow(1 + r, n) - 1) / r);
            futureValue = fvPrincipal + fvAnnuity;
        }

        const totalInterest = futureValue - totalInvested;

        setResults({
            futureValue: Math.round(futureValue),
            totalContributions: Math.round(totalContributions),
            totalInterest: Math.round(totalInterest),
            totalInvested: Math.round(totalInvested)
        });
    };

    const saveToHistory = () => {
        const newEntry = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            futureValue: results.futureValue,
            initial: initialAmount,
            contribution: monthlyContribution,
            rate: interestRate,
            years: years
        };

        const newHistory = [newEntry, ...history].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem('investmentHistory', JSON.stringify(newHistory));
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    const deleteHistoryItem = (id) => {
        const newHistory = history.filter(item => item.id !== id);
        setHistory(newHistory);
        localStorage.setItem('investmentHistory', JSON.stringify(newHistory));
    };

    return (
        <div className="flex justify-center items-center min-h-[600px] p-5 bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 rounded-2xl m-5 shadow-2xl transition-all duration-300">
            <div className="bg-white/95 backdrop-blur-md p-8 rounded-xl max-w-2xl w-full shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-emerald-100 pb-4">
                    <div>
                        <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Wealth Builder
                        </h2>
                        <p className="text-emerald-700/60 text-xs font-bold uppercase tracking-widest mt-1">Growth Projection Engine</p>
                    </div>
                    <div className="bg-emerald-100 p-3 rounded-full animate-pulse">
                        <span className="text-3xl">💰</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Inputs Section */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Initial Investment</label>
                                <span className="text-emerald-600 font-mono font-bold">{formatCurrency(initialAmount)}</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="100000" 
                                step="1000"
                                value={initialAmount}
                                onChange={(e) => setInitialAmount(parseInt(e.target.value))}
                                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Monthly Addition</label>
                                <span className="text-emerald-600 font-mono font-bold">{formatCurrency(monthlyContribution)}</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="5000" 
                                step="50"
                                value={monthlyContribution}
                                onChange={(e) => setMonthlyContribution(parseInt(e.target.value))}
                                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Rate (%)</label>
                                <input 
                                    type="number" 
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border-2 border-emerald-50 rounded-lg focus:outline-none focus:border-emerald-400 text-gray-700 font-bold transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Years</label>
                                <input 
                                    type="number" 
                                    value={years}
                                    onChange={(e) => setYears(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border-2 border-emerald-50 rounded-lg focus:outline-none focus:border-emerald-400 text-gray-700 font-bold transition-all"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={saveToHistory}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-lg transition-all shadow-lg shadow-emerald-200 active:scale-95 uppercase tracking-tighter"
                        >
                            Log Projection
                        </button>
                    </div>

                    {/* Results Section */}
                    <div className="flex flex-col justify-between">
                        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 text-emerald-100/30 text-6xl font-black transition-all group-hover:scale-110">?</div>
                            <p className="text-emerald-800/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Estimated Future Wealth</p>
                            <h3 className="text-4xl font-black text-emerald-900 tracking-tight mb-4">
                                {formatCurrency(results.futureValue)}
                            </h3>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500 font-medium italic">Total Contributions</span>
                                    <span className="text-emerald-700 font-bold">{formatCurrency(results.totalInvested)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500 font-medium italic">Interest Earned</span>
                                    <span className="text-emerald-600 font-bold">+{formatCurrency(results.totalInterest)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Visualization */}
                        <div className="mt-6">
                            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                <span>Growth Composition</span>
                                <span>100% Total</span>
                            </div>
                            <div className="h-6 w-full flex rounded-full overflow-hidden shadow-inner bg-gray-100 border border-gray-100">
                                <div 
                                    className="h-full bg-emerald-700 transition-all duration-700 ease-out flex items-center justify-center"
                                    style={{ width: `${(results.totalInvested / results.futureValue) * 100}%` }}
                                    title="Total Invested"
                                >
                                    <span className="text-[8px] text-white/50 font-bold truncate px-1">
                                        {Math.round((results.totalInvested / results.futureValue) * 100)}%
                                    </span>
                                </div>
                                <div 
                                    className="h-full bg-emerald-400 transition-all duration-700 ease-out flex items-center justify-center animate-pulse"
                                    style={{ width: `${(results.totalInterest / results.futureValue) * 100}%` }}
                                    title="Interest Earned"
                                >
                                    <span className="text-[8px] text-emerald-900/50 font-bold truncate px-1">
                                        {Math.round((results.totalInterest / results.futureValue) * 100)}%
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-3">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-emerald-700 rounded-full"></div>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase">Principle</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase">Compound</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                {history.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-emerald-50">
                        <button 
                            onClick={() => setShowHistory(!showHistory)}
                            className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 hover:text-emerald-700 transition-colors"
                        >
                            {showHistory ? 'Hide' : 'Show'} Saved Benchmarks ({history.length})
                        </button>
                        
                        {showHistory && (
                            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                {history.map(item => (
                                    <div key={item.id} className="bg-gray-50/80 p-3 rounded-lg flex justify-between items-center group hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100">
                                        <div>
                                            <p className="text-sm font-bold text-emerald-900">{formatCurrency(item.futureValue)}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">
                                                {item.initial} init • {item.contribution}/mo • {item.rate}% rate • {item.years}y
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => deleteHistoryItem(item.id)}
                                            className="text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Footer Insight */}
                <div className="mt-8 text-center p-4 bg-emerald-900 rounded-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-800 to-emerald-950 opacity-90"></div>
                    <div className="relative z-10">
                        <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-1">Financial Insight</p>
                        <p className="text-white text-xs font-medium italic">
                            "The first $100k is a struggle, the next $1M is an inevitability."
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
                </div>
            </div>
        </div>
    );
};

export default InvestmentCalculator;
