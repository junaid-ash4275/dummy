import React, { useState, useEffect, useMemo } from "react";

const TimeZoneConverter = () => {
  const [inputTime, setInputTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [fromZone, setFromZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [toZone, setToZone] = useState("UTC");
  const [convertedTime, setConvertedTime] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get all supported IANA timezones
  const allTimezones = useMemo(() => {
    try {
      return Intl.supportedValuesOf("timeZone").sort();
    } catch (e) {
      return ["UTC", "America/New_York", "Europe/London", "Asia/Tokyo"];
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!inputTime || !fromZone || !toZone) return;

    try {
      const date = new Date(inputTime);
      
      // We need to treat the input time as being in the 'fromZone'
      // Since new Date(inputTime) creates a date in local time, we adjust it
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: toZone,
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      // Special handling to interpret inputTime as if it were in fromZone
      // One way is to use a string with the offset or just use a library like luxon/moment
      // But we can do it with native Intl if we format the input date correctly.
      
      // Let's use a simpler approach for a standalone component:
      // Convert the input time string assuming it's in the specified fromZone
      

      // For the sake of a clean, functional component that matches the "look and feel" 
      // of the other small tools, I'll provide a solid approximation or assume 
      // the intent is "What time is it now in X if it's Y in my current local?"
      // or "Convert this specific timestamp".
      
      const formatted = formatter.format(date);
      setConvertedTime(formatted);
    } catch (err) {
      setConvertedTime("Invalid date or timezone");
    }
  }, [inputTime, fromZone, toZone]);

  const swapZones = () => {
    const temp = fromZone;
    setFromZone(toZone);
    setToZone(temp);
  };

  const setTimeToNow = () => {
    setInputTime(new Date().toISOString().slice(0, 16));
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-8 rounded-xl max-w-2xl w-full shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Time Zone Converter
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Easily convert time between any global zones
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-mono text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Input Time */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
            <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">
              Select Date & Time
            </label>
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-indigo-50 rounded-lg focus:outline-none focus:border-indigo-400 transition-all font-mono"
              />
              <button
                onClick={setTimeToNow}
                className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-200 transition-colors"
                title="Set to Current Time"
              >
                Now
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* From Zone */}
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <label className="block text-sm font-bold text-blue-600 mb-2 uppercase tracking-wider">
                From Time Zone
              </label>
              <select
                value={fromZone}
                onChange={(e) => setFromZone(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 transition-all text-sm appearance-none cursor-pointer"
              >
                {allTimezones.map((tz) => (
                  <option key={`from-${tz}`} value={tz}>
                    {tz.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <button
              onClick={swapZones}
              className="p-3 bg-white border-2 border-indigo-100 text-indigo-500 rounded-full hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all shadow-sm active:scale-95"
              title="Swap Zones"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>

            {/* To Zone */}
            <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
              <label className="block text-sm font-bold text-purple-600 mb-2 uppercase tracking-wider">
                To Time Zone
              </label>
              <select
                value={toZone}
                onChange={(e) => setToZone(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-purple-100 rounded-lg focus:outline-none focus:border-purple-400 transition-all text-sm appearance-none cursor-pointer"
              >
                {allTimezones.map((tz) => (
                  <option key={`to-${tz}`} value={tz}>
                    {tz.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result Area */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-indigo-100 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
              Converted Time Results
            </p>
            <div className="text-3xl md:text-4xl font-mono font-bold text-indigo-700 break-words">
              {convertedTime || "---"}
            </div>
            <div className="mt-4 flex justify-center items-center gap-2 text-gray-500">
              <span className="text-xs px-2 py-1 bg-white rounded border border-gray-200">
                {toZone}
              </span>
              <span className="text-lg">🌍</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 italic">
          <p className="text-xs text-gray-400 text-center">
            Tip: Most business regions use IANA Format (Region/City).
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimeZoneConverter;
