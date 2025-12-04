import React, { useState } from 'react';

const UnitConverter = () => {
  const [category, setCategory] = useState('length');
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [result, setResult] = useState('');

  const conversions = {
    length: {
      units: ['meters', 'kilometers', 'feet', 'miles', 'inches', 'centimeters'],
      toMeters: {
        meters: 1,
        kilometers: 1000,
        feet: 0.3048,
        miles: 1609.34,
        inches: 0.0254,
        centimeters: 0.01
      }
    },
    weight: {
      units: ['kilograms', 'grams', 'pounds', 'ounces'],
      toKilograms: {
        kilograms: 1,
        grams: 0.001,
        pounds: 0.453592,
        ounces: 0.0283495
      }
    },
    temperature: {
      units: ['celsius', 'fahrenheit', 'kelvin'],
      convert: (value, from, to) => {
        // Convert to Celsius first
        let celsius;
        if (from === 'celsius') celsius = value;
        else if (from === 'fahrenheit') celsius = (value - 32) * 5/9;
        else if (from === 'kelvin') celsius = value - 273.15;

        // Convert from Celsius to target
        if (to === 'celsius') return celsius;
        else if (to === 'fahrenheit') return (celsius * 9/5) + 32;
        else if (to === 'kelvin') return celsius + 273.15;
      }
    }
  };

  const handleConvert = (value, from, to, cat) => {
    if (!value || isNaN(value)) {
      setResult('');
      return;
    }

    const numValue = parseFloat(value);
    let convertedValue;

    if (cat === 'temperature') {
      convertedValue = conversions.temperature.convert(numValue, from, to);
    } else if (cat === 'length') {
      const meters = numValue * conversions.length.toMeters[from];
      convertedValue = meters / conversions.length.toMeters[to];
    } else if (cat === 'weight') {
      const kilograms = numValue * conversions.weight.toKilograms[from];
      convertedValue = kilograms / conversions.weight.toKilograms[to];
    }

    setResult(convertedValue.toFixed(4));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    handleConvert(value, fromUnit, toUnit, category);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setInputValue('');
    setResult('');
    
    // Set default units for the category
    if (newCategory === 'length') {
      setFromUnit('meters');
      setToUnit('feet');
    } else if (newCategory === 'weight') {
      setFromUnit('kilograms');
      setToUnit('pounds');
    } else if (newCategory === 'temperature') {
      setFromUnit('celsius');
      setToUnit('fahrenheit');
    }
  };

  const handleFromUnitChange = (e) => {
    const newFromUnit = e.target.value;
    setFromUnit(newFromUnit);
    handleConvert(inputValue, newFromUnit, toUnit, category);
  };

  const handleToUnitChange = (e) => {
    const newToUnit = e.target.value;
    setToUnit(newToUnit);
    handleConvert(inputValue, fromUnit, newToUnit, category);
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    
    // Swap values
    if (result) {
      setInputValue(result);
      handleConvert(result, toUnit, tempUnit, category);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-10 rounded-xl max-w-md w-full shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent text-center">
          Unit Converter
        </h2>

        {/* Category Selector */}
        <div className="flex gap-2 mb-6 justify-center flex-wrap">
          <button
            className={`py-2 px-4 rounded-full font-semibold transition-all duration-300 text-sm ${
              category === 'length'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            onClick={() => handleCategoryChange('length')}
          >
            Length
          </button>
          <button
            className={`py-2 px-4 rounded-full font-semibold transition-all duration-300 text-sm ${
              category === 'weight'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            onClick={() => handleCategoryChange('weight')}
          >
            Weight
          </button>
          <button
            className={`py-2 px-4 rounded-full font-semibold transition-all duration-300 text-sm ${
              category === 'temperature'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            onClick={() => handleCategoryChange('temperature')}
          >
            Temperature
          </button>
        </div>

        {/* Conversion Interface */}
        <div className="space-y-4">
          {/* From Unit */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              From
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter value"
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
              />
              <select
                value={fromUnit}
                onChange={handleFromUnitChange}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors bg-white capitalize"
              >
                {conversions[category].units.map(unit => (
                  <option key={unit} value={unit} className="capitalize">
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full hover:transform hover:rotate-180 transition-all duration-300 shadow-md hover:shadow-lg"
              title="Swap units"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* To Unit */}
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              To
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={result}
                readOnly
                placeholder="Result"
                className="flex-1 px-4 py-2 border-2 border-orange-200 rounded-lg bg-white font-semibold text-orange-600"
              />
              <select
                value={toUnit}
                onChange={handleToUnitChange}
                className="px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors bg-white capitalize"
              >
                {conversions[category].units.map(unit => (
                  <option key={unit} value={unit} className="capitalize">
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Info Text */}
        {result && (
          <div className="mt-4 text-center text-sm text-gray-600">
            <span className="font-semibold">{inputValue}</span> {fromUnit} = <span className="font-semibold text-orange-600">{result}</span> {toUnit}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitConverter;
