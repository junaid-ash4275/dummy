import React, { useState, useMemo, useEffect } from 'react';

const BlobGenerator = () => {
    const [radius, setRadius] = useState([60, 40, 30, 70, 60, 40, 70, 30]); // TL, TR, BR, BL (horizontal / vertical)
    const [color, setColor] = useState('#6366f1');
    const [colorEnd, setColorEnd] = useState('#a855f7');
    const [isGradient, setIsGradient] = useState(true);
    const [isAnimated, setIsAnimated] = useState(true);
    const [copied, setCopied] = useState(false);

    const borderRadiusValue = useMemo(() => {
        const [tlh, trh, brh, blh, tlv, trv, brv, blv] = radius;
        return `${tlh}% ${100 - trh}% ${brh}% ${100 - blh}% / ${tlv}% ${trv}% ${100 - brv}% ${100 - blv}%`;
    }, [radius]);

    const blobStyle = {
        borderRadius: borderRadiusValue,
        background: isGradient 
            ? `linear-gradient(135deg, ${color}, ${colorEnd})` 
            : color,
        boxShadow: `0 20px 50px ${color}44`,
    };

    const copyToClipboard = () => {
        const css = `border-radius: ${borderRadiusValue};
background: ${blobStyle.background};`;
        navigator.clipboard.writeText(css);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const randomize = () => {
        const newRadius = radius.map(() => Math.floor(Math.random() * 60) + 20);
        setRadius(newRadius);
    };

    const handleSliderChange = (index, value) => {
        const newRadius = [...radius];
        newRadius[index] = parseInt(value);
        setRadius(newRadius);
    };

    return (
        <div className="flex justify-center items-center min-h-[700px] p-8 bg-slate-900 rounded-3xl m-5 shadow-2xl relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full blur-[100px] animate-pulse delay-700"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl relative z-10 text-white">
                {/* Left: Controls */}
                <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
                    <header>
                        <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Blob Morph</h2>
                        <p className="text-slate-400 mt-2 font-medium">Create organic, fluid shapes for your modern layouts</p>
                    </header>

                    <div className="space-y-8">
                        {/* Radius Sliders */}
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: 'Top Left (H)', idx: 0 },
                                { label: 'Top Left (V)', idx: 4 },
                                { label: 'Top Right (H)', idx: 1 },
                                { label: 'Top Right (V)', idx: 5 },
                                { label: 'Bottom Right (H)', idx: 2 },
                                { label: 'Bottom Right (V)', idx: 6 },
                                { label: 'Bottom Left (H)', idx: 3 },
                                { label: 'Bottom Left (V)', idx: 7 },
                            ].map((item) => (
                                <div key={item.idx} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</label>
                                        <span className="text-xs font-mono text-indigo-400">{radius[item.idx]}%</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" max="100" 
                                        value={radius[item.idx]}
                                        onChange={(e) => handleSliderChange(item.idx, e.target.value)}
                                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Color Pickers */}
                        <div className="flex items-center gap-6 p-4 bg-black/20 rounded-2xl border border-white/5">
                            <div className="flex-1 space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Theme Colors</label>
                                <div className="flex gap-3">
                                    <input 
                                        type="color" 
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-10 h-10 rounded-lg bg-transparent cursor-pointer border-none shadow-lg"
                                    />
                                    {isGradient && (
                                        <input 
                                            type="color" 
                                            value={colorEnd}
                                            onChange={(e) => setColorEnd(e.target.value)}
                                            className="w-10 h-10 rounded-lg bg-transparent cursor-pointer border-none shadow-lg"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => setIsGradient(!isGradient)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${isGradient ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-400'}`}
                                >
                                    Gradient
                                </button>
                                <button 
                                    onClick={() => setIsAnimated(!isAnimated)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${isAnimated ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-400'}`}
                                >
                                    Animate
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={randomize}
                                className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all border border-white/10 active:scale-95"
                            >
                                Randomize
                            </button>
                            <button 
                                onClick={copyToClipboard}
                                className={`flex-[2] py-4 rounded-2xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                                    copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20'
                                }`}
                            >
                                {copied ? 'Copied!' : 'Copy CSS'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="flex flex-col items-center justify-center space-y-12">
                    <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center">
                        <div 
                            style={blobStyle}
                            className={`w-full h-full transition-all duration-700 ease-in-out ${isAnimated ? 'animate-blob-morph' : ''}`}
                        ></div>
                        
                        {/* Decorative circle behind */}
                        <div className="absolute inset-0 border-2 border-white/5 rounded-full scale-110 -z-10 bg-gradient-to-tr from-white/5 to-transparent"></div>
                    </div>

                    <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full max-w-[450px]">
                        <code className="text-xs text-indigo-300 font-mono break-all block leading-relaxed">
                            border-radius: {borderRadiusValue};
                        </code>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob-morph {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    33% { transform: scale(1.05) rotate(2deg); }
                    66% { transform: scale(0.95) rotate(-2deg); }
                }
                .animate-blob-morph {
                    animation: blob-morph 8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default BlobGenerator;
