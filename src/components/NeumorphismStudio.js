import React, { useState, useMemo } from 'react';

const NeumorphismStudio = () => {
    const [color, setColor] = useState('#e0e0e0');
    const [size, setSize] = useState(200);
    const [radius, setRadius] = useState(40);
    const [distance, setDistance] = useState(20);
    const [intensity, setIntensity] = useState(40);
    const [shape, setShape] = useState('flat'); // flat, concave, convex, pressed
    const [copied, setCopied] = useState(false);

    // Color conversion helpers
    const hexToRGB = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    };

    const RGBToHex = ({ r, g, b }) => {
        return `#${[r, g, b].map(x => Math.min(255, Math.max(0, x)).toString(16).padStart(2, '0')).join('')}`;
    };

    const adjustBrightness = (hex, amount) => {
        const { r, g, b } = hexToRGB(hex);
        return RGBToHex({
            r: Math.round(r * (1 + amount)),
            g: Math.round(g * (1 + amount)),
            b: Math.round(b * (1 + amount))
        });
    };

    const lightColor = useMemo(() => adjustBrightness(color, 0.15), [color]);
    const darkColor = useMemo(() => adjustBrightness(color, -0.15), [color]);

    const neumorphicStyle = useMemo(() => {
        let background = color;
        if (shape === 'concave') {
            background = `linear-gradient(145deg, ${darkColor}, ${lightColor})`;
        } else if (shape === 'convex') {
            background = `linear-gradient(145deg, ${lightColor}, ${darkColor})`;
        }

        const boxShadow = shape === 'pressed'
            ? `inset ${distance}px ${distance}px ${intensity}px ${darkColor}, inset -${distance}px -${distance}px ${intensity}px ${lightColor}`
            : `${distance}px ${distance}px ${intensity}px ${darkColor}, -${distance}px -${distance}px ${intensity}px ${lightColor}`;

        return {
            backgroundColor: color,
            background: background,
            borderRadius: `${radius}px`,
            boxShadow: boxShadow,
            width: `${size}px`,
            height: `${size}px`
        };
    }, [color, size, radius, distance, intensity, shape, lightColor, darkColor]);

    const cssCode = useMemo(() => {
        let bgStyle = `background: ${color};`;
        if (shape === 'concave') bgStyle = `background: linear-gradient(145deg, ${darkColor}, ${lightColor});`;
        if (shape === 'convex') bgStyle = `background: linear-gradient(145deg, ${lightColor}, ${darkColor});`;

        const boxShadow = shape === 'pressed'
            ? `box-shadow: inset ${distance}px ${distance}px ${intensity}px ${darkColor},\n            inset -${distance}px -${distance}px ${intensity}px ${lightColor};`
            : `box-shadow: ${distance}px ${distance}px ${intensity}px ${darkColor},\n            -${distance}px -${distance}px ${intensity}px ${lightColor};`;

        return `/* Neumorphic Design */
border-radius: ${radius}px;
${bgStyle}
${boxShadow}`;
    }, [color, radius, distance, intensity, shape, lightColor, darkColor]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex justify-center items-center min-h-[700px] p-8 bg-gradient-to-br from-slate-900 to-black rounded-3xl m-5 shadow-2xl relative overflow-hidden group">
            {/* Animated Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
                <div className="absolute top-[-5%] left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animation-delay-2000"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl relative z-10 font-sans">
                {/* Control Panel */}
                <div className="bg-white/5 backdrop-blur-xl p-8 lg:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8">
                    <header>
                        <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Neumorphism Studio</h2>
                        <p className="text-indigo-200/50 font-medium">Design soft, modern tactile interfaces</p>
                    </header>

                    <div className="space-y-6">
                        {/* Color Picker */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Base Color</label>
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 transition-colors hover:border-white/20">
                                <input 
                                    type="color" 
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-12 h-12 rounded-xl bg-transparent cursor-pointer border-none"
                                />
                                <div className="flex flex-col">
                                    <span className="text-white font-mono text-sm uppercase">{color}</span>
                                    <span className="text-white/30 text-[10px]">Select a soft light color</span>
                                </div>
                            </div>
                        </div>

                        {/* Controls Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Scale</label>
                                    <span className="text-white font-mono text-xs">{size}px</span>
                                </div>
                                <input type="range" min="50" max="400" value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-400" />
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Radius</label>
                                    <span className="text-white font-mono text-xs">{radius}px</span>
                                </div>
                                <input type="range" min="0" max="100" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-400" />
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Distance</label>
                                    <span className="text-white font-mono text-xs">{distance}px</span>
                                </div>
                                <input type="range" min="1" max="50" value={distance} onChange={(e) => setDistance(parseInt(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-400" />
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Intensity</label>
                                    <span className="text-white font-mono text-xs">{intensity}px</span>
                                </div>
                                <input type="range" min="1" max="100" value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-400" />
                            </div>
                        </div>

                        {/* Shape Toggle */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Surface Type</label>
                            <div className="grid grid-cols-4 gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/5">
                                {['flat', 'concave', 'convex', 'pressed'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setShape(s)}
                                        className={`py-2 px-1 text-[10px] font-bold uppercase rounded-xl transition-all duration-300 ${
                                            shape === s 
                                            ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                                            : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="pt-4">
                        <button 
                            onClick={copyToClipboard}
                            className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden relative group ${
                                copied 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-white text-slate-900 hover:bg-indigo-50'
                            }`}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {copied ? 'Snippet Copied!' : 'Copy CSS Properties'}
                                {!copied && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2H7a2 2 0 00-2 2v6H5a2 2 0 01-2-2V7a2 2 0 012-2z" /></svg>}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="flex flex-col items-center justify-center space-y-12">
                    <div 
                        className="flex items-center justify-center p-20 rounded-[3rem] transition-all duration-700 pointer-events-none sm:pointer-events-auto"
                        style={{ backgroundColor: color }}
                    >
                        <div 
                            style={neumorphicStyle}
                            className="transition-all duration-300 ease-out hover:scale-[1.03] group-hover:rotate-1"
                        ></div>
                    </div>

                    <div className="w-full max-w-[400px] bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 font-mono text-[10px] text-indigo-300/80 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-20">
                            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2v20M2 12h20" /></svg>
                        </div>
                        <pre className="whitespace-pre-wrap leading-relaxed">{cssCode}</pre>
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center opacity-40">
                            <span>Ready for production</span>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                                <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                                <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeumorphismStudio;
