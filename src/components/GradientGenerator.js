import React, { useState, useMemo } from 'react';

const GradientGenerator = () => {
    const [color1, setColor1] = useState('#818cf8'); // indigo-400
    const [color2, setColor2] = useState('#db2777'); // pink-600
    const [angle, setAngle] = useState(135);
    const [copied, setCopied] = useState(false);

    const gradientStyle = useMemo(() => ({
        background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
    }), [color1, color2, angle]);

    const cssCode = useMemo(() => {
        return `background: linear-gradient(${angle}deg, ${color1}, ${color2});`;
    }, [color1, color2, angle]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex justify-center items-center min-h-[600px] p-8 bg-slate-900 rounded-3xl m-5 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] relative overflow-hidden transition-all duration-700">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl relative z-10">
                {/* Controls Section */}
                <div className="bg-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/20 shadow-2xl space-y-10">
                    <header>
                        <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Gradient Studio</h2>
                        <p className="text-white/60 font-medium tracking-wide font-sans">Craft smooth, vibrant CSS linear gradients</p>
                    </header>

                    <div className="space-y-8">
                        {/* Color Selection */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Color One</label>
                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 transition-all hover:border-white/30">
                                    <input
                                        type="color"
                                        value={color1}
                                        onChange={(e) => setColor1(e.target.value)}
                                        className="w-10 h-10 rounded-xl bg-transparent cursor-pointer border-none"
                                    />
                                    <input
                                        type="text"
                                        value={color1.toUpperCase()}
                                        onChange={(e) => setColor1(e.target.value)}
                                        className="bg-transparent text-white font-mono text-sm w-full outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Color Two</label>
                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 transition-all hover:border-white/30">
                                    <input
                                        type="color"
                                        value={color2}
                                        onChange={(e) => setColor2(e.target.value)}
                                        className="w-10 h-10 rounded-xl bg-transparent cursor-pointer border-none"
                                    />
                                    <input
                                        type="text"
                                        value={color2.toUpperCase()}
                                        onChange={(e) => setColor2(e.target.value)}
                                        className="bg-transparent text-white font-mono text-sm w-full outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Angle Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Gradient Angle</label>
                                <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-white/10 shadow-lg select-none">
                                    {angle}°
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={angle}
                                onChange={(e) => setAngle(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white transition-all hover:bg-white/20"
                            />
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-gray-950 rounded-2xl p-6 border border-white/10">
                                <pre className="text-indigo-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                                    <code>{cssCode}</code>
                                </pre>
                            </div>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className={`w-full py-4 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all duration-500 transform active:scale-95 shadow-xl ${
                                copied 
                                ? 'bg-emerald-500 text-white scale-[1.02]' 
                                : 'bg-white text-gray-900 hover:shadow-white/10 hover:-translate-y-0.5'
                            }`}
                        >
                            {copied ? 'Successfully Copied!' : 'Copy Css Code'}
                        </button>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="flex flex-col items-center justify-center space-y-12">
                    <div 
                        style={gradientStyle}
                        className="w-full aspect-[4/3] rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-[1.02] relative group"
                    >
                        <div className="absolute inset-0 rounded-[3rem] ring-1 ring-white/20 pointer-events-none"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                               <span className="text-white font-bold tracking-widest text-xs uppercase">Resolution Independent</span>
                           </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="h-px w-12 bg-white/10"></div>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-white/20"></div>
                            <div className="w-2 h-2 rounded-full bg-white/40"></div>
                            <div className="w-2 h-2 rounded-full bg-white/20"></div>
                        </div>
                        <div className="h-px w-12 bg-white/10"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradientGenerator;
