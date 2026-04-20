import React, { useState, useMemo } from 'react';

const FilterStudio = () => {
    const [blur, setBlur] = useState(0);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [grayscale, setGrayscale] = useState(0);
    const [hueRotate, setHueRotate] = useState(0);
    const [invert, setInvert] = useState(0);
    const [saturate, setSaturate] = useState(100);
    const [sepia, setSepia] = useState(0);
    const [copied, setCopied] = useState(false);

    const filterString = useMemo(() => {
        return `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) hue-rotate(${hueRotate}deg) invert(${invert}%) saturate(${saturate}%) sepia(${sepia}%)`;
    }, [blur, brightness, contrast, grayscale, hueRotate, invert, saturate, sepia]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`filter: ${filterString};`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const resetFilters = () => {
        setBlur(0);
        setBrightness(100);
        setContrast(100);
        setGrayscale(0);
        setHueRotate(0);
        setInvert(0);
        setSaturate(100);
        setSepia(0);
    };

    const controls = [
        { label: 'Blur', value: blur, setter: setBlur, min: 0, max: 20, unit: 'px' },
        { label: 'Brightness', value: brightness, setter: setBrightness, min: 0, max: 200, unit: '%' },
        { label: 'Contrast', value: contrast, setter: setContrast, min: 0, max: 200, unit: '%' },
        { label: 'Grayscale', value: grayscale, setter: setGrayscale, min: 0, max: 100, unit: '%' },
        { label: 'Hue Rotate', value: hueRotate, setter: setHueRotate, min: 0, max: 360, unit: 'deg' },
        { label: 'Invert', value: invert, setter: setInvert, min: 0, max: 100, unit: '%' },
        { label: 'Saturate', value: saturate, setter: setSaturate, min: 0, max: 200, unit: '%' },
        { label: 'Sepia', value: sepia, setter: setSepia, min: 0, max: 100, unit: '%' },
    ];

    return (
        <div className="flex justify-center items-center min-h-[800px] p-8 bg-[#0f172a] rounded-[3rem] m-5 shadow-2xl relative overflow-hidden group">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animation-delay-2000"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl relative z-10">
                {/* Control Panel */}
                <div className="bg-slate-900/50 backdrop-blur-2xl p-8 lg:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col justify-between">
                    <div>
                        <header className="mb-10">
                            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">Filter Studio</h2>
                            <p className="text-slate-400 font-medium">Fine-tune your visual effects with CSS filters</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {controls.map((control) => (
                                <div key={control.label} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{control.label}</label>
                                        <span className="text-cyan-400 font-mono text-xs">{control.value}{control.unit}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min={control.min} 
                                        max={control.max} 
                                        value={control.value} 
                                        onChange={(e) => control.setter(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 space-y-4">
                        <div className="flex gap-4">
                            <button 
                                onClick={copyToClipboard}
                                className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${
                                    copied 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20'
                                }`}
                            >
                                {copied ? 'Copied to Clipboard!' : 'Copy CSS Code'}
                                {!copied && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>}
                            </button>
                            <button 
                                onClick={resetFilters}
                                className="px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all transform active:scale-95"
                                title="Reset All"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="flex flex-col items-center justify-center space-y-8">
                    <div className="relative group w-full max-w-[500px] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 bg-slate-800">
                        {/* The Image Preview */}
                        <img 
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                            alt="Filter Preview" 
                            className="w-full h-full object-cover transition-all duration-300"
                            style={{ filter: filterString }}
                        />
                        
                        {/* Overlay info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                            <p className="text-white/80 text-sm font-medium italic">"Real-time visual processing accelerated by CSS"</p>
                        </div>

                        {/* Floating Indicator */}
                        <div className="absolute top-6 right-6 bg-cyan-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/30">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-tighter">Live Preview</span>
                        </div>
                    </div>

                    <div className="w-full max-w-[500px] bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-2xl relative">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                            <span className="ml-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">CSS Output</span>
                        </div>
                        <code className="text-cyan-400/90 text-xs font-mono block leading-relaxed break-all">
                            filter: {filterString};
                        </code>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
};

export default FilterStudio;
