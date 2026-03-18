import React, { useState, useMemo } from 'react';

const GlassmorphismGenerator = () => {
    const [blur, setBlur] = useState(10);
    const [transparency, setTransparency] = useState(0.2);
    const [color, setColor] = useState('#ffffff');
    const [borderOpacity, setBorderOpacity] = useState(0.1);
    const [copied, setCopied] = useState(false);

    const glassStyle = useMemo(() => ({
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: `${color}${Math.round(transparency * 255).toString(16).padStart(2, '0')}`,
        border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
    }), [blur, transparency, color, borderOpacity]);

    const cssCode = useMemo(() => {
        const hexTransparency = Math.round(transparency * 255).toString(16).padStart(2, '0');
        return `background: ${color}${hexTransparency};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid rgba(255, 255, 255, ${borderOpacity});
border-radius: 1rem;`;
    }, [blur, transparency, color, borderOpacity]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex justify-center items-center min-h-[600px] p-8 bg-gradient-to-tr from-rose-400 via-fuchsia-500 to-indigo-600 rounded-2xl m-5 shadow-2xl relative overflow-hidden transition-all duration-700">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-yellow-200/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-300/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl relative z-10">
                {/* Controls Section */}
                <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/50 space-y-8">
                    <div>
                        <h2 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">Glassmorphism</h2>
                        <p className="text-gray-500 font-medium">Design stunning frosted glass effects</p>
                    </div>

                    <div className="space-y-6">
                        {/* Blur Slider */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Blur Intensity</label>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-mono font-bold">{blur}px</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="40"
                                value={blur}
                                onChange={(e) => setBlur(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        {/* Transparency Slider */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Transparency</label>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-mono font-bold">{Math.round(transparency * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={transparency}
                                onChange={(e) => setTransparency(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        {/* Color Picker */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider block">Glass Tint</label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-12 h-12 rounded-xl border-none cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={color.toUpperCase()}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2 font-mono text-sm focus:border-indigo-300 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Border Opacity Slider */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Border Strength</label>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-mono font-bold">{Math.round(borderOpacity * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={borderOpacity}
                                onChange={(e) => setBorderOpacity(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>
                    </div>

                    {/* CSS Output */}
                    <div className="bg-gray-900 rounded-2xl p-6 relative group overflow-hidden">
                        <pre className="text-cyan-400 font-mono text-sm leading-relaxed overflow-x-auto">
                            <code>{cssCode}</code>
                        </pre>
                        <button
                            onClick={copyToClipboard}
                            className={`absolute top-4 right-4 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                                copied 
                                ? 'bg-green-500 text-white' 
                                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                            }`}
                        >
                            {copied ? 'COPIED!' : 'COPY CSS'}
                        </button>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="flex flex-col items-center justify-center space-y-8">
                    <div 
                        style={glassStyle}
                        className="w-full aspect-square max-w-[400px] rounded-[2rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center transition-all duration-300 hover:scale-105"
                    >
                        <div className="w-20 h-20 bg-white/20 rounded-full mb-6 flex items-center justify-center text-4xl shadow-inner">
                            ✨
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-sm">Live Preview</h3>
                        <p className="text-white/80 font-medium leading-relaxed">
                            Watch how your changes affect this glass element in real-time. 
                            Experiment with different combinations!
                        </p>
                    </div>
                    
                    <div className="flex gap-4">
                       <div className="w-12 h-12 bg-white/10 rounded-full blur-sm"></div>
                       <div className="w-12 h-12 bg-indigo-400/30 rounded-full"></div>
                       <div className="w-12 h-12 bg-rose-400/30 rounded-full blur-md"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlassmorphismGenerator;
