import React, { useState, useEffect } from 'react';

const ColorContrastChecker = () => {
    const [foreground, setForeground] = useState('#1e293b');
    const [background, setBackground] = useState('#ffffff');
    const [ratio, setRatio] = useState(null);
    const [ratings, setRatings] = useState({ aa: false, aaLarge: false, aaa: false, aaaLarge: false });

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
            : null;
    };

    const getLuminance = (r, g, b) => {
        const [rs, gs, bs] = [r, g, b].map((c) => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const getContrastRatio = (hex1, hex2) => {
        const rgb1 = hexToRgb(hex1);
        const rgb2 = hexToRgb(hex2);
        if (!rgb1 || !rgb2) return null;

        const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
        const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);

        return (lighter + 0.05) / (darker + 0.05);
    };

    useEffect(() => {
        const contrastRatio = getContrastRatio(foreground, background);
        if (contrastRatio) {
            setRatio(contrastRatio);
            setRatings({
                aa: contrastRatio >= 4.5,
                aaLarge: contrastRatio >= 3,
                aaa: contrastRatio >= 7,
                aaaLarge: contrastRatio >= 4.5,
            });
        }
    }, [foreground, background]);

    const swapColors = () => {
        setForeground(background);
        setBackground(foreground);
    };

    const getRatioColor = () => {
        if (!ratio) return 'text-gray-500';
        if (ratio >= 7) return 'text-green-600';
        if (ratio >= 4.5) return 'text-yellow-600';
        return 'text-red-600';
    };

    const presets = [
        { fg: '#1e293b', bg: '#ffffff', label: 'Dark on White' },
        { fg: '#ffffff', bg: '#1e40af', label: 'White on Blue' },
        { fg: '#065f46', bg: '#d1fae5', label: 'Green on Mint' },
        { fg: '#7c2d12', bg: '#fed7aa', label: 'Brown on Peach' },
    ];

    return (
        <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-2xl m-5 shadow-2xl">
            <div className="bg-white p-10 rounded-xl max-w-md w-full shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent text-center">
                    Contrast Checker
                </h2>

                {/* Preview */}
                <div
                    className="rounded-lg p-6 mb-6 text-center border-2 border-gray-200"
                    style={{ backgroundColor: background, color: foreground }}
                >
                    <p className="text-2xl font-bold mb-1">Sample Text</p>
                    <p className="text-sm">The quick brown fox jumps over the lazy dog.</p>
                </div>

                {/* Color Inputs */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Foreground</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={foreground}
                                onChange={(e) => setForeground(e.target.value)}
                                className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={foreground}
                                onChange={(e) => setForeground(e.target.value)}
                                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-teal-500 transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        onClick={swapColors}
                        className="mt-5 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Swap colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                        </svg>
                    </button>

                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Background</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={background}
                                onChange={(e) => setBackground(e.target.value)}
                                className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={background}
                                onChange={(e) => setBackground(e.target.value)}
                                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-teal-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Contrast Ratio */}
                {ratio && (
                    <div className="text-center mb-6">
                        <p className="text-sm text-gray-500 mb-1">Contrast Ratio</p>
                        <p className={`text-4xl font-bold ${getRatioColor()}`}>
                            {ratio.toFixed(2)}:1
                        </p>
                    </div>
                )}

                {/* WCAG Ratings */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className={`p-3 rounded-lg text-center ${ratings.aa ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                        <p className={`text-sm font-bold ${ratings.aa ? 'text-green-700' : 'text-red-700'}`}>
                            {ratings.aa ? 'Pass' : 'Fail'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">AA Normal</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${ratings.aaLarge ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                        <p className={`text-sm font-bold ${ratings.aaLarge ? 'text-green-700' : 'text-red-700'}`}>
                            {ratings.aaLarge ? 'Pass' : 'Fail'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">AA Large</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${ratings.aaa ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                        <p className={`text-sm font-bold ${ratings.aaa ? 'text-green-700' : 'text-red-700'}`}>
                            {ratings.aaa ? 'Pass' : 'Fail'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">AAA Normal</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${ratings.aaaLarge ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                        <p className={`text-sm font-bold ${ratings.aaaLarge ? 'text-green-700' : 'text-red-700'}`}>
                            {ratings.aaaLarge ? 'Pass' : 'Fail'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">AAA Large</p>
                    </div>
                </div>

                {/* Presets */}
                <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">Quick Presets</p>
                    <div className="flex flex-wrap gap-2">
                        {presets.map((preset, index) => (
                            <button
                                key={index}
                                onClick={() => { setForeground(preset.fg); setBackground(preset.bg); }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-medium text-gray-700 transition-colors border border-gray-200"
                            >
                                <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: preset.fg }}></span>
                                <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: preset.bg }}></span>
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <p className="text-xs text-center text-gray-500">
                    Check color combinations against WCAG accessibility standards
                </p>
            </div>
        </div>
    );
};

export default ColorContrastChecker;
