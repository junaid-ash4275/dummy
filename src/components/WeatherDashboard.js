import React, { useState, useEffect } from 'react';

const WeatherDashboard = () => {
  const [currentWeather, setCurrentWeather] = useState({
    temperature: 22,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 12,
    location: 'New York'
  });
  
  const [forecast, setForecast] = useState([
    { day: 'Today', high: 24, low: 18, condition: 'Sunny', icon: '☀️' },
    { day: 'Tomorrow', high: 26, low: 20, condition: 'Partly Cloudy', icon: '⛅' },
    { day: 'Wednesday', high: 23, low: 17, condition: 'Rainy', icon: '🌧️' },
    { day: 'Thursday', high: 25, low: 19, condition: 'Cloudy', icon: '☁️' },
    { day: 'Friday', high: 27, low: 21, condition: 'Sunny', icon: '☀️' }
  ]);
  
  const [unit, setUnit] = useState('C'); // C for Celsius, F for Fahrenheit
  const [selectedCity, setSelectedCity] = useState('New York');
  
  const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Dubai'];
  
  const convertTemp = (temp) => {
    if (unit === 'F') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  };
  
  const getWeatherIcon = (condition) => {
    const icons = {
      'Sunny': '☀️',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Stormy': '⛈️',
      'Snowy': '❄️'
    };
    return icons[condition] || '🌤️';
  };
  
  const generateRandomWeather = () => {
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const baseTemp = Math.floor(Math.random() * 20) + 15; // 15-35°C
    
    setCurrentWeather({
      temperature: baseTemp,
      condition: randomCondition,
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      location: selectedCity
    });
    
    // Generate new forecast
    const newForecast = forecast.map((day, index) => ({
      ...day,
      high: baseTemp + Math.floor(Math.random() * 6) - 2,
      low: baseTemp - Math.floor(Math.random() * 8) - 3,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      icon: getWeatherIcon(conditions[Math.floor(Math.random() * conditions.length)])
    }));
    
    setForecast(newForecast);
  };
  
  useEffect(() => {
    generateRandomWeather();
  }, [selectedCity]);
  
  const handleCityChange = (city) => {
    setSelectedCity(city);
  };
  
  const toggleUnit = () => {
    setUnit(unit === 'C' ? 'F' : 'C');
  };
  
  return (
    <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-10 rounded-xl max-w-4xl w-full text-center shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
          Weather Dashboard
        </h2>
        
        {/* City Selector */}
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => handleCityChange(city)}
              className={`py-2 px-4 rounded-full font-semibold transition-all duration-300 text-sm ${
                selectedCity === city
                  ? 'bg-gradient-to-r from-orange-500 to-purple-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
        
        {/* Current Weather */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Main Weather Display */}
          <div className="bg-gradient-to-r from-orange-50 to-purple-50 p-6 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <span className="text-6xl mr-4">{getWeatherIcon(currentWeather.condition)}</span>
              <div>
                <div className="text-5xl font-bold text-orange-600">
                  {convertTemp(currentWeather.temperature)}°{unit}
                </div>
                <div className="text-lg text-gray-600 font-medium">
                  {currentWeather.condition}
                </div>
                <div className="text-sm text-gray-500">
                  {currentWeather.location}
                </div>
              </div>
            </div>
          </div>
          
          {/* Weather Details */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">Humidity</p>
              <p className="text-2xl font-bold text-blue-600">{currentWeather.humidity}%</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">Wind Speed</p>
              <p className="text-2xl font-bold text-green-600">{currentWeather.windSpeed} km/h</p>
            </div>
          </div>
        </div>
        
        {/* 5-Day Forecast */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-700 mb-4">5-Day Forecast</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {forecast.map((day, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-50 to-orange-50 p-4 rounded-lg hover:from-orange-50 hover:to-purple-50 transition-all duration-300">
                <div className="text-sm font-semibold text-gray-600 mb-2">{day.day}</div>
                <div className="text-3xl mb-2">{day.icon}</div>
                <div className="text-sm text-gray-700">
                  <div className="font-bold">{convertTemp(day.high)}°</div>
                  <div className="text-gray-500">{convertTemp(day.low)}°</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{day.condition}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Control Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={toggleUnit}
            className="bg-gradient-to-r from-orange-500 to-purple-500 text-white border-none py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-400/50 active:transform-none"
          >
            Switch to °{unit === 'C' ? 'F' : 'C'}
          </button>
          <button
            onClick={generateRandomWeather}
            className="bg-white text-gray-700 border-2 border-gray-300 py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:border-gray-400 hover:bg-gray-50 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform-none"
          >
            Refresh Weather
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
