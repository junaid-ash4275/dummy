import React, { useState, useEffect } from "react";

const WorldClock = () => {
  const [time, setTime] = useState(new Date());
  const [selectedCities, setSelectedCities] = useState([
    { name: "New York", timezone: "America/New_York", emoji: "🗽" },
    { name: "London", timezone: "Europe/London", emoji: "🎡" },
    { name: "Tokyo", timezone: "Asia/Tokyo", emoji: "🗼" },
  ]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get all supported IANA timezones
  const allTimezones = React.useMemo(() => {
    try {
      return Intl.supportedValuesOf("timeZone").map((tz) => {
        const parts = tz.split("/");
        const name = parts[parts.length - 1].replace(/_/g, " ");
        const region = parts[0];
        return {
          name: name,
          timezone: tz,
          region: region,
          emoji: "",
        };
      });
    } catch (e) {
      return [];
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date, timezone) => {
    return date.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date, timezone) => {
    return date.toLocaleDateString("en-US", {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const addCity = (city) => {
    if (!selectedCities.find((c) => c.name === city.name)) {
      setSelectedCities([...selectedCities, city]);
    }
    setShowSearch(false);
    setSearchQuery("");
  };

  const removeCity = (cityName) => {
    setSelectedCities(selectedCities.filter((c) => c.name !== cityName));
  };

  const filteredCities = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allTimezones
      .filter(
        (city) =>
          city.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !selectedCities.find((c) => c.timezone === city.timezone),
      )
      .slice(0, 50);
  }, [searchQuery, allTimezones, selectedCities]);

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-8 rounded-xl max-w-2xl w-full shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              World Clock
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Track any city in the world
            </p>
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-3 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
          >
            {showSearch ? "✕" : "＋ Add City"}
          </button>
        </div>

        {showSearch && (
          <div className="mb-8 animate-fadeIn">
            <input
              type="text"
              placeholder="Search cities (e.g. New York, Karachi, London)..."
              className="w-full px-4 py-3 border-2 border-indigo-100 rounded-xl focus:outline-none focus:border-indigo-400 mb-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-indigo-100 italic">
              {filteredCities.map((city) => (
                <button
                  key={city.timezone}
                  onClick={() => addCity(city)}
                  className="px-4 py-2 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-sm font-medium transition-all group flex items-center gap-2"
                >
                  <span>{city.emoji}</span>
                  <span className="font-bold">{city.name}</span>
                  <span className="text-xs text-gray-400">({city.region})</span>
                </button>
              ))}
              {searchQuery.trim() && filteredCities.length === 0 && (
                <p className="text-gray-400 text-sm italic w-full text-center py-4">
                  No cities found matching "{searchQuery}"
                </p>
              )}
              {!searchQuery.trim() && (
                <p className="text-gray-400 text-sm italic w-full text-center py-4">
                  Start typing to search...
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedCities.map((city) => (
            <div
              key={city.name}
              className="group relative bg-gray-50 p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-indigo-100"
            >
              <button
                onClick={() => removeCity(city.name)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
              >
                ✕
              </button>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{city.emoji}</span>
                <div>
                  <h3 className="font-bold text-gray-800">{city.name}</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    {city.timezone.split("/")[1].replace("_", " ")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-mono font-bold text-indigo-600 tabular-nums">
                  {formatTime(time, city.timezone)}
                </span>
                <span className="text-sm text-gray-400 mt-1">
                  {formatDate(time, city.timezone)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedCities.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <span className="text-5xl block mb-4">🕰️</span>
            <p>Your clock list is empty. Add a city to start tracking!</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 font-medium">
            Local Device Time: {time.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorldClock;
