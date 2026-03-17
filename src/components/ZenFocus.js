import React, { useState, useEffect, useRef } from 'react';

const ZenFocus = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumes, setVolumes] = useState(() => {
    const savedVolumes = localStorage.getItem('zen_focus_volumes');
    return savedVolumes ? JSON.parse(savedVolumes) : {
      rain: 0.5,
      birds: 0.3,
      waves: 0.4,
      fire: 0.2,
    };
  });

  const audioRefs = {
    rain: useRef(null),
    birds: useRef(null),
    waves: useRef(null),
    fire: useRef(null),
  };

  const sounds = [
    { id: 'rain', label: 'Rain', icon: '🌧️', url: 'https://www.soundjay.com/nature/rain-07.mp3' },
    { id: 'birds', label: 'Birds', icon: '🐦', url: 'https://www.soundjay.com/nature/birds-chirping-05.mp3' },
    { id: 'waves', label: 'Waves', icon: '🌊', url: 'https://www.soundjay.com/nature/ocean-waves-1.mp3' },
    { id: 'fire', label: 'Fire', icon: '🔥', url: 'https://www.soundjay.com/nature/fire-1.mp3' },
  ];

  useEffect(() => {
    localStorage.setItem('zen_focus_volumes', JSON.stringify(volumes));
    
    // Update audio volumes
    Object.keys(audioRefs).forEach(key => {
      if (audioRefs[key].current) {
        audioRefs[key].current.volume = volumes[key];
      }
    });
  }, [volumes]);

  useEffect(() => {
    Object.values(audioRefs).forEach(ref => {
      if (ref.current) {
        if (isPlaying) {
          ref.current.play().catch(e => console.log("Audio play blocked by browser:", e));
        } else {
          ref.current.pause();
        }
      }
    });
  }, [isPlaying]);

  const handleVolumeChange = (soundId, value) => {
    setVolumes(prev => ({
      ...prev,
      [soundId]: parseFloat(value)
    }));
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-2xl m-5 shadow-2xl relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="bg-white/20 backdrop-blur-xl p-10 rounded-3xl max-w-2xl w-full shadow-2xl border border-white/30 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-md">Zen Focus</h2>
          <p className="text-blue-100/80 font-medium">Create your perfect ambient atmosphere</p>
        </div>

        {/* Audio Elements (Hidden) */}
        {sounds.map(sound => (
          <audio
            key={sound.id}
            ref={audioRefs[sound.id]}
            src={sound.url}
            loop
          />
        ))}

        {/* Global Controls */}
        <div className="flex justify-center mb-12">
          <button
            onClick={togglePlay}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 transform hover:scale-110 active:scale-95 shadow-2xl ${
              isPlaying 
                ? 'bg-red-500/80 text-white border-4 border-red-300/50' 
                : 'bg-white text-blue-600 border-4 border-blue-100 hover:bg-blue-50'
            }`}
          >
            <span className="text-4xl">
              {isPlaying ? '⏸️' : '▶️'}
            </span>
          </button>
        </div>

        {/* Individual Mixers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sounds.map(sound => (
            <div key={sound.id} className="bg-white/10 p-5 rounded-2xl border border-white/10 hover:bg-white/20 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl grayscale group-hover:grayscale-0 transition-all duration-500">{sound.icon}</span>
                  <span className="font-bold text-white tracking-wide">{sound.label}</span>
                </div>
                <span className="text-xs font-mono text-blue-200 bg-blue-900/30 px-2 py-1 rounded-md">
                  {Math.round(volumes[sound.id] * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volumes[sound.id]}
                onChange={(e) => handleVolumeChange(sound.id, e.target.value)}
                className="w-full h-2 bg-blue-900/30 rounded-lg appearance-none cursor-pointer accent-white hover:accent-blue-100 transition-all"
              />
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-10 text-center">
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">
            Ambient Soundscape Engine v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default ZenFocus;
