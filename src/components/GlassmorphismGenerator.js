import React, { useState, useMemo } from 'react';

const GlassmorphismGenerator = () => {
    const [blur, setBlur] = useState(12);
    const [transparency, setTransparency] = useState(0.2);
    const [saturation, setSaturation] = useState(100);
    const [border, setBorder] = useState(1);
    const [bgColor, setBgColor] = useState('#6366f1'); // Indigo 500
    const [copied, setCopied] = useState(false);

    const glassStyle = useMemo(() => ({
        backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
        backgroundColor: `rgba(255, 255, 255, ${transparency})`,
        border: `${border}px solid rgba(255, 255, 255, 0.22)`,
    }), [blur, transparency, saturation, border]);

    const cssCode = useMemo(() => {
        return `/* Glassmorphism Effect */
background: rgba(255, 255, 255, ${transparency});
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border: ${border}px solid rgba(255, 255, 255, 0.22);
border-radius: 24px;`;
    }, [transparency, blur, saturation, border]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex justify-center items-center min-h-[600px] p-8 bg-gradient-to-br from-slate-800 to-slate-950 rounded-3xl m-5 shadow-2xl relative overflow-hidden group">
            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div 
                    className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full mix-blend-screen filter blur-[80px] animate-blob transition-colors duration-1000"
                    style={{ backgroundColor: bgColor }}
                ></div>
                <div 
                    className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-2000 transition-colors duration-1000 opacity-70"
                    style={{ backgroundColor: '#db2777' }} // Pink 600
                ></div>
                <div 
                    className="absolute top-[20%] right-[10%] w-64 h-64 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-4000 opacity-50"
                    style={{ backgroundColor: '#f59e0b' }} // Amber 500
                ></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl relative z-10">
                {/* Control Panel */}
                <div className="bg-black/40 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8 transform transition-all duration-500 hover:border-white/20">
                    <header>
                        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">Glass Studio</h2>
                        <p className="text-gray-400 font-medium">Create elegant glassmorphism effects for your UI</p>
                    </header>

                    <div className="space-y-6">
                        {/* Blur Control */}
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Blur Intensity</label>
                                <span className="text-white font-mono text-sm">{blur}px</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="40" 
                                value={blur} 
                                onChange={(e) => setBlur(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>

                        {/* Transparency Control */}
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Transparency</label>
                                <span className="text-white font-mono text-sm">{(transparency * 100).toFixed(0)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="1" step="0.01"
                                value={transparency} 
                                onChange={(e) => setTransparency(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>

                        {/* Saturation Control */}
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Saturation</label>
                                <span className="text-white font-mono text-sm">{saturation}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="200" 
                                value={saturation} 
                                onChange={(e) => setSaturation(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>

                        {/* Theme Color */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Background Hue</label>
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                                <input 
                                    type="color" 
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="w-10 h-10 rounded-xl bg-transparent cursor-pointer border-none"
                                />
                                <span className="text-white font-mono text-sm uppercase">{bgColor}</span>
                            </div>
                        </div>
                    </div>

                    {/* Copy Button */}
                    <div className="pt-4">
                        <button 
                            onClick={copyToClipboard}
                            className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${
                                copied 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:shadow-[0_0_30px_rgba(79,70,229,0.4)]'
                            }`}
                        >
                            {copied ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Copied to Clipboard!
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    Copy CSS Code
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="flex flex-col items-center justify-center space-y-8">
                    <div className="relative w-full aspect-square max-w-[400px]">
                        {/* The Glass Component */}
                        <div 
                            style={glassStyle}
                            className="absolute inset-0 z-20 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center transition-all duration-300 group-hover:scale-[1.02]"
                        >
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 border border-white/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Glass Preview</h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Experience the smooth transparency and blur of glassmorphism in real-time.
                            </p>
                        </div>

                        {/* Background floating objects for depth */}
                        <div className="absolute top-10 right-10 w-20 h-20 bg-pink-500 rounded-full animate-bounce"></div>
                        <div className="absolute bottom-10 left-10 w-24 h-24 bg-amber-500 rounded-lg rotate-12 animate-pulse"></div>
                        <div className="absolute top-1/2 left-[-20px] w-12 h-12 bg-indigo-500 rounded-full animate-ping opacity-50"></div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10">
                        <span className="text-indigo-300/80 font-mono text-xs uppercase tracking-[0.3em]">Hardware Accelerated</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default GlassmorphismGenerator;
