import React, { useState, useEffect, useCallback } from "react";

const CryptoPriceTracker = () => {
  const [coins, setCoins] = useState([
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 65432.1,
      change: 2.5,
      marketCap: "1.2T",
      icon: "₿",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 3456.78,
      change: -1.2,
      marketCap: "415B",
      icon: "Ξ",
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 145.2,
      change: 5.8,
      marketCap: "65B",
      icon: "◎",
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      price: 0.45,
      change: -0.5,
      marketCap: "16B",
      icon: "₳",
    },
    {
      id: "polkadot",
      name: "Polkadot",
      symbol: "DOT",
      price: 7.2,
      change: 1.1,
      marketCap: "10B",
      icon: "●",
    },
  ]);

  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshPrices = useCallback(() => {
    setCoins((prevCoins) =>
      prevCoins.map((coin) => {
        const volatility = 0.02; // 2% max change per refresh
        const changePercent = Math.random() * volatility * 2 - volatility;
        const newPrice = coin.price * (1 + changePercent);
        const newChange = Math.random() * 10 - 5; // random -5% to +5% 24h change

        return {
          ...coin,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(newChange.toFixed(2)),
        };
      })
    );
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    let interval;
    if (isLive) {
      interval = setInterval(refreshPrices, 3000);
    }
    return () => clearInterval(interval);
  }, [isLive, refreshPrices]);

  return (
    <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl max-w-4xl w-full text-center shadow-xl border border-white/20">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Crypto Pulse
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isLive}
                onChange={() => setIsLive(!isLive)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Live
              </span>
            </label>

            <button
              onClick={refreshPrices}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-full hover:rotate-180 transition-all duration-500 ease-in-out shadow-md"
              title="Refresh Prices"
            >
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="hidden md:grid grid-cols-5 px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
            <div className="text-left col-span-2">Asset</div>
            <div>Price</div>
            <div>24h Change</div>
            <div className="text-right">Market Cap</div>
          </div>

          {coins.map((coin) => (
            <div
              key={coin.id}
              className="grid grid-cols-2 md:grid-cols-5 items-center p-4 md:px-6 md:py-4 bg-gray-50/50 rounded-xl hover:bg-indigo-50/50 hover:scale-[1.01] transition-all duration-300 border border-transparent hover:border-indigo-100 group"
            >
              <div className="flex items-center gap-4 col-span-2">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 text-xl font-bold shadow-inner group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300">
                  {coin.icon}
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-800">{coin.name}</div>
                  <div className="text-xs font-semibold text-gray-400">
                    {coin.symbol}
                  </div>
                </div>
              </div>

              <div className="text-left md:text-center">
                <div className="font-bold text-gray-800">
                  $
                  {coin.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div className="md:hidden text-xs text-gray-400 mt-1">
                  Price
                </div>
              </div>

              <div className="text-right md:text-center">
                <div
                  className={`font-bold flex items-center justify-end md:justify-center gap-1 ${
                    coin.change >= 0 ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {coin.change >= 0 ? "▲" : "▼"} {Math.abs(coin.change)}%
                </div>
                <div className="md:hidden text-xs text-gray-400 mt-1">24h</div>
              </div>

              <div className="hidden md:block text-right font-semibold text-gray-600">
                ${coin.marketCap}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isLive ? "bg-emerald-400" : "bg-gray-300"
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isLive ? "bg-emerald-500" : "bg-gray-400"
                }`}
              ></span>
            </span>
            {isLive ? "Live market data streaming" : "Market standing by"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPriceTracker;
