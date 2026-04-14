import React, { useState, useEffect } from "react";

const CarbonFootprintCalculator = () => {
  const [transportation, setTransportation] = useState("");
  const [energy, setEnergy] = useState("");
  const [diet, setDiet] = useState("meat-eater");
  const [footprint, setFootprint] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem("carbonHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const calculateFootprint = () => {
    if (!transportation || !energy || isNaN(transportation) || isNaN(energy)) {
      return;
    }

    // Emission Factors (Annual)
    // Transportation: km/year * 0.17 kg CO2/km
    const transCO2 = parseFloat(transportation) * 0.1712; 
    
    // Energy: kWh/month * 12 months * 0.4 kg CO2/kWh
    const energyCO2 = parseFloat(energy) * 12 * 0.417;

    // Diet: tons CO2/year
    let dietCO2 = 0;
    switch (diet) {
      case "meat-eater":
        dietCO2 = 2500; // 2.5 tons in kg
        break;
      case "vegetarian":
        dietCO2 = 1700; // 1.7 tons in kg
        break;
      case "vegan":
        dietCO2 = 1500; // 1.5 tons in kg
        break;
      default:
        dietCO2 = 2000;
    }

    const totalCO2 = (transCO2 + energyCO2 + dietCO2) / 1000; // Convert to tons
    const roundedFootprint = totalCO2.toFixed(2);
    setFootprint(roundedFootprint);

    const newEntry = {
      footprint: roundedFootprint,
      transportation,
      energy,
      diet,
      date: new Date().toLocaleDateString(),
    };

    const newHistory = [newEntry, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("carbonHistory", JSON.stringify(newHistory));
  };

  const resetCalculator = () => {
    setTransportation("");
    setEnergy("");
    setDiet("meat-eater");
    setFootprint(null);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("carbonHistory");
  };

  const getFootprintColor = () => {
    const f = parseFloat(footprint);
    if (f < 4) return "from-green-400 to-emerald-500";
    if (f < 10) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-pink-500";
  };

  const getFootprintEmoji = () => {
    const f = parseFloat(footprint);
    if (f < 4) return "🌿";
    if (f < 10) return "🚗";
    return "🏭";
  };

  const getFootprintMessage = () => {
    const f = parseFloat(footprint);
    if (f < 4) return "Excellent! Your footprint is well below the global average.";
    if (f < 10) return "Moderate. There's room for improvement in some areas.";
    return "High. Consider reducing air travel or switching to renewable energy.";
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-8 rounded-xl max-w-lg w-full shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            Carbon Footprint
          </h2>
          <span className="text-2xl">🌍</span>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-emerald-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-emerald-800 mb-2 font-semibold">
              Transportation (km per year)
            </label>
            <input
              type="number"
              value={transportation}
              onChange={(e) => setTransportation(e.target.value)}
              placeholder="e.g., 10000"
              className="w-full px-4 py-3 border-2 border-emerald-100 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-emerald-800 mb-2 font-semibold">
              Energy Consumption (kWh per month)
            </label>
            <input
              type="number"
              value={energy}
              onChange={(e) => setEnergy(e.target.value)}
              placeholder="e.g., 250"
              className="w-full px-4 py-3 border-2 border-emerald-100 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-emerald-800 mb-2 font-semibold">
              Primary Diet
            </label>
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="w-full px-4 py-3 border-2 border-emerald-100 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors appearance-none bg-white"
            >
              <option value="meat-eater">Meat Eater</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={calculateFootprint}
            disabled={!transportation || !energy}
            className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
              transportation && energy
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:transform hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Calculate Impact
          </button>
          <button
            onClick={resetCalculator}
            className="py-3 px-4 rounded-full font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
          >
            Reset
          </button>
        </div>

        {footprint && (
          <div className="mb-6 animate-fadeIn transition-all duration-500">
            <div className={`bg-gradient-to-r ${getFootprintColor()} p-6 rounded-xl text-white shadow-lg`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium opacity-90 mb-1">Annual Footprint</p>
                  <p className="text-5xl font-bold">{footprint} <span className="text-xl">tons CO₂</span></p>
                </div>
                <span className="text-4xl">{getFootprintEmoji()}</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-sm opacity-90 leading-relaxed">{getFootprintMessage()}</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <h4 className="text-sm font-bold text-emerald-800 mb-2 flex items-center gap-1">
                <span>💡</span> Reduction Tips
              </h4>
              <ul className="text-xs text-emerald-700 space-y-1 list-disc pl-4">
                <li>Switch to a plant-based diet to save ~1 ton CO₂/year.</li>
                <li>Use public transport or carpool for commutes.</li>
                <li>Improve home insulation to reduce energy waste.</li>
              </ul>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="space-y-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full py-2 px-4 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>📜</span> {showHistory ? "Hide" : "Show"} History
            </button>

            {showHistory && (
              <div className="max-h-48 overflow-y-auto space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Logs</p>
                  <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-600">Clear</button>
                </div>
                {history.map((h, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center text-sm">
                    <div>
                      <p className="font-bold text-gray-700">{h.footprint} tons</p>
                      <p className="text-xs text-gray-400 capitalize">{h.diet} | {h.transportation} km</p>
                    </div>
                    <span className="text-xs text-gray-400">{h.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarbonFootprintCalculator;
