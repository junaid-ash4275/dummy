import React, { useState, useEffect } from 'react';

const CurrencyConverter = () => {
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [result, setResult] = useState('');
    const [exchangeRates, setExchangeRates] = useState({});
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState('');

    // Popular currencies
    const currencies = [
        { code: 'USD', name: 'US Dollar', symbol: '$' },
        { code: 'EUR', name: 'Euro', symbol: '€' },
        { code: 'GBP', name: 'British Pound', symbol: '£' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
        { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
        { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
        { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
        { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
        { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
        { code: 'ZAR', name: 'South African Rand', symbol: 'R' }
    ];

    // Fetch exchange rates
    useEffect(() => {
        const fetchRates = async () => {
            try {
                setLoading(true);
                // Using exchangerate-api.com free tier
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const data = await response.json();
                setExchangeRates(data.rates);
                setLastUpdated(new Date(data.time_last_updated).toLocaleString());
                setLoading(false);
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
                // Fallback to static rates if API fails
                setExchangeRates({
                    USD: 1,
                    EUR: 0.92,
                    GBP: 0.79,
                    JPY: 149.50,
                    AUD: 1.53,
                    CAD: 1.36,
                    CHF: 0.88,
                    CNY: 7.24,
                    INR: 83.12,
                    MXN: 17.15,
                    BRL: 4.97,
                    ZAR: 18.65
                });
                setLastUpdated(new Date().toLocaleString());
                setLoading(false);
            }
        };

        fetchRates();
        // Refresh rates every 5 minutes
        const interval = setInterval(fetchRates, 300000);
        return () => clearInterval(interval);
    }, []);

    const convertCurrency = (value, from, to) => {
        if (!value || isNaN(value) || !exchangeRates[from] || !exchangeRates[to]) {
            setResult('');
            return;
        }

        const numValue = parseFloat(value);
        // Convert to USD first, then to target currency
        const inUSD = numValue / exchangeRates[from];
        const converted = inUSD * exchangeRates[to];
        setResult(converted.toFixed(2));
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);
        convertCurrency(value, fromCurrency, toCurrency);
    };

    const handleFromCurrencyChange = (e) => {
        const newFrom = e.target.value;
        setFromCurrency(newFrom);
        convertCurrency(amount, newFrom, toCurrency);
    };

    const handleToCurrencyChange = (e) => {
        const newTo = e.target.value;
        setToCurrency(newTo);
        convertCurrency(amount, fromCurrency, newTo);
    };

    const swapCurrencies = () => {
        const tempCurrency = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(tempCurrency);

        if (result) {
            setAmount(result);
            convertCurrency(result, toCurrency, tempCurrency);
        }
    };

    const getCurrencySymbol = (code) => {
        const currency = currencies.find(c => c.code === code);
        return currency ? currency.symbol : code;
    };

    const getExchangeRate = () => {
        if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) return null;
        const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
        return rate.toFixed(4);
    };

    return (
        <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl m-5 shadow-2xl">
            <div className="bg-white p-10 rounded-xl max-w-md w-full shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-emerald-500 to-cyan-600 bg-clip-text text-transparent text-center">
                    Currency Converter
                </h2>

                {loading ? (
                    <div className="text-center text-gray-500 mb-6">
                        <div className="animate-spin inline-block w-6 h-6 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
                        <p className="mt-2 text-sm">Loading rates...</p>
                    </div>
                ) : (
                    <p className="text-xs text-gray-500 text-center mb-6">
                        Last updated: {lastUpdated}
                    </p>
                )}

                {/* Conversion Interface */}
                <div className="space-y-4">
                    {/* From Currency */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            From
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2 mb-2">
                            <input
                                type="number"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="Enter amount"
                                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors min-w-0"
                                disabled={loading}
                            />
                            <select
                                value={fromCurrency}
                                onChange={handleFromCurrencyChange}
                                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors bg-white w-full sm:w-auto"
                                disabled={loading}
                            >
                                {currencies.map(currency => (
                                    <option key={currency.code} value={currency.code}>
                                        {currency.code}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="font-semibold">{getCurrencySymbol(fromCurrency)}</span>
                            <span>{currencies.find(c => c.code === fromCurrency)?.name}</span>
                        </div>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={swapCurrencies}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 rounded-full hover:transform hover:rotate-180 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Swap currencies"
                            disabled={loading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    {/* To Currency */}
                    <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            To
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2 mb-2">
                            <input
                                type="text"
                                value={result}
                                readOnly
                                placeholder="Result"
                                className="flex-1 px-4 py-2 border-2 border-emerald-200 rounded-lg bg-white font-semibold text-emerald-600 text-lg min-w-0"
                            />
                            <select
                                value={toCurrency}
                                onChange={handleToCurrencyChange}
                                className="px-4 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors bg-white w-full sm:w-auto"
                                disabled={loading}
                            >
                                {currencies.map(currency => (
                                    <option key={currency.code} value={currency.code}>
                                        {currency.code}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="font-semibold">{getCurrencySymbol(toCurrency)}</span>
                            <span>{currencies.find(c => c.code === toCurrency)?.name}</span>
                        </div>
                    </div>
                </div>

                {/* Exchange Rate Info */}
                {getExchangeRate() && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-lg">
                        <div className="text-center text-sm text-gray-700">
                            <span className="font-semibold">Exchange Rate:</span>
                            <div className="text-emerald-600 font-bold mt-1">
                                1 {fromCurrency} = {getExchangeRate()} {toCurrency}
                            </div>
                        </div>
                    </div>
                )}

                {/* Result Summary */}
                {result && amount && (
                    <div className="mt-4 text-center text-sm text-gray-600 bg-white p-3 rounded-lg border-2 border-emerald-100">
                        <span className="font-semibold">{getCurrencySymbol(fromCurrency)}{amount}</span> {fromCurrency} =
                        <span className="font-semibold text-emerald-600 ml-1">{getCurrencySymbol(toCurrency)}{result}</span> {toCurrency}
                    </div>
                )}

                {/* Quick Convert Buttons */}
                <div className="mt-6 grid grid-cols-4 gap-2">
                    {[1, 10, 100, 1000].map(value => (
                        <button
                            key={value}
                            onClick={() => {
                                setAmount(value.toString());
                                convertCurrency(value.toString(), fromCurrency, toCurrency);
                            }}
                            className="py-2 px-3 bg-gray-100 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-gray-700 rounded-lg font-semibold transition-all duration-300 text-sm"
                            disabled={loading}
                        >
                            {value}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CurrencyConverter;
