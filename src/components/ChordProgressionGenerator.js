import React, { useState, useCallback } from 'react';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SCALE_INTERVALS = {
  Major:      [0, 2, 4, 5, 7, 9, 11],
  Minor:      [0, 2, 3, 5, 7, 8, 10],
  Dorian:     [0, 2, 3, 5, 7, 9, 10],
  Mixolydian: [0, 2, 4, 5, 7, 9, 10],
  Phrygian:   [0, 1, 3, 5, 7, 8, 10],
};

const MAJOR_QUALITIES  = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'];
const MINOR_QUALITIES  = ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'];
const DORIAN_QUALITIES = ['min', 'min', 'maj', 'maj', 'min', 'dim', 'maj'];
const MIXO_QUALITIES   = ['maj', 'min', 'dim', 'maj', 'min', 'min', 'maj'];
const PHRYG_QUALITIES  = ['min', 'maj', 'maj', 'min', 'dim', 'maj', 'min'];

const SCALE_QUALITIES = {
  Major:      MAJOR_QUALITIES,
  Minor:      MINOR_QUALITIES,
  Dorian:     DORIAN_QUALITIES,
  Mixolydian: MIXO_QUALITIES,
  Phrygian:   PHRYG_QUALITIES,
};

const CHORD_SEMITONES = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dim: [0, 3, 6],
};

const QUALITY_COLORS = {
  maj: 'from-violet-500 to-purple-600',
  min: 'from-blue-500 to-indigo-600',
  dim: 'from-rose-500 to-pink-600',
};

const QUALITY_BG = {
  maj: 'bg-violet-50 border-violet-200 text-violet-800',
  min: 'bg-blue-50 border-blue-200 text-blue-800',
  dim: 'bg-rose-50 border-rose-200 text-rose-800',
};

const COMMON_PROGRESSIONS = [
  { name: 'I–V–vi–IV', degrees: [0, 4, 5, 3] },
  { name: 'I–IV–V',    degrees: [0, 3, 4] },
  { name: 'ii–V–I',    degrees: [1, 4, 0] },
  { name: 'I–vi–IV–V', degrees: [0, 5, 3, 4] },
  { name: 'vi–IV–I–V', degrees: [5, 3, 0, 4] },
  { name: 'Random',    degrees: null },
];

const buildChord = (rootIndex, quality) => {
  return CHORD_SEMITONES[quality].map(s => NOTES[(rootIndex + s) % 12]);
};

const ChordProgressionGenerator = () => {
  const [rootKey, setRootKey]         = useState('C');
  const [scale, setScale]             = useState('Major');
  const [progression, setProgression] = useState([]);
  const [activeChord, setActiveChord] = useState(null);
  const [copied, setCopied]           = useState(false);
  const [history, setHistory]         = useState([]);

  const getScaleDegrees = useCallback((key, scaleName) => {
    const root = NOTES.indexOf(key);
    return SCALE_INTERVALS[scaleName].map(i => (root + i) % 12);
  }, []);

  const generate = useCallback((presetDegrees = null) => {
    const degrees = getScaleDegrees(rootKey, scale);
    const qualities = SCALE_QUALITIES[scale];

    let indices;
    if (presetDegrees) {
      indices = presetDegrees;
    } else {
      const len = Math.floor(Math.random() * 2) + 3;
      indices = Array.from({ length: len }, () => Math.floor(Math.random() * 7));
    }

    const chords = indices.map(i => ({
      degree: i,
      root: NOTES[degrees[i]],
      quality: qualities[i],
      notes: buildChord(degrees[i], qualities[i]),
    }));

    setProgression(chords);
    setActiveChord(0);
    setHistory(prev => [chords, ...prev.slice(0, 4)]);
  }, [rootKey, scale, getScaleDegrees]);

  const copyToClipboard = () => {
    const text = progression.map(c => `${c.root}${c.quality}`).join(' – ');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const romanLabel = (degree, quality) => {
    const r = ROMAN[degree];
    return quality === 'min' ? r.toLowerCase() : quality === 'dim' ? r.toLowerCase() + '°' : r;
  };

  const allScaleNotes = getScaleDegrees(rootKey, scale).map(i => NOTES[i]);
  const activeNotes = activeChord !== null && progression[activeChord]
    ? progression[activeChord].notes
    : [];

  const KEYBOARD_OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const isBlack = n => n.includes('#');

  return (
    <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-8 rounded-xl max-w-2xl w-full shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-violet-500 to-fuchsia-600 bg-clip-text text-transparent text-center">
          Chord Progression Generator
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Generate chord progressions in any key and scale
        </p>

        {/* Key & Scale selectors */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Root Key</label>
            <select
              value={rootKey}
              onChange={e => setRootKey(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 transition-colors"
            >
              {NOTES.map(n => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Scale</label>
            <select
              value={scale}
              onChange={e => setScale(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 transition-colors"
            >
              {Object.keys(SCALE_INTERVALS).map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Preset progressions */}
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-500 mb-2">Quick Presets</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_PROGRESSIONS.map(p => (
              <button
                key={p.name}
                onClick={() => generate(p.degrees)}
                className="px-3 py-1.5 bg-gray-50 hover:bg-violet-50 border border-gray-200 hover:border-violet-300 rounded-full text-xs font-medium text-gray-700 hover:text-violet-700 transition-all"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={() => generate(null)}
          className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white py-3 rounded-full font-semibold text-base uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-400/50 transition-all duration-300 mb-6"
        >
          Generate Random
        </button>

        {/* Chord cards */}
        {progression.length > 0 && (
          <>
            <div className="flex gap-3 mb-5 flex-wrap justify-center">
              {progression.map((chord, i) => (
                <button
                  key={i}
                  onClick={() => setActiveChord(i)}
                  className={`flex flex-col items-center px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    activeChord === i
                      ? `bg-gradient-to-br ${QUALITY_COLORS[chord.quality]} text-white border-transparent shadow-lg scale-105`
                      : `${QUALITY_BG[chord.quality]} hover:scale-105 cursor-pointer`
                  }`}
                >
                  <span className="text-lg font-bold">{chord.root}{chord.quality === 'min' ? 'm' : chord.quality === 'dim' ? '°' : ''}</span>
                  <span className="text-xs opacity-75 mt-0.5">{romanLabel(chord.degree, chord.quality)}</span>
                </button>
              ))}
            </div>

            {/* Active chord notes */}
            {activeChord !== null && (
              <div className="text-center mb-5">
                <p className="text-xs text-gray-500 mb-1">Notes in chord</p>
                <div className="flex gap-2 justify-center">
                  {progression[activeChord].notes.map((n, i) => (
                    <span key={i} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold">{n}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Mini keyboard */}
            <div className="flex justify-center mb-5">
              <div className="relative flex" style={{ height: '64px' }}>
                {KEYBOARD_OCTAVE.map((note, i) => {
                  const black = isBlack(note);
                  const inScale = allScaleNotes.includes(note);
                  const inChord = activeNotes.includes(note);
                  return (
                    <div
                      key={i}
                      className={`
                        ${black ? 'absolute z-10' : 'relative'}
                        transition-all duration-150
                        ${black
                          ? `w-5 h-9 rounded-b-md border border-gray-800 ${inChord ? 'bg-violet-500' : inScale ? 'bg-gray-600' : 'bg-gray-900'}`
                          : `w-7 h-16 rounded-b-md border border-gray-300 ${inChord ? 'bg-violet-300' : inScale ? 'bg-violet-50' : 'bg-white'}`
                        }
                      `}
                      style={black ? {
                        left: `${i * 28 - 8}px`,
                      } : {}}
                    />
                  );
                })}
              </div>
            </div>

            {/* Copy */}
            <div className="flex justify-center">
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                  copied
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50'
                }`}
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    Copy Progression
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* History */}
        {history.length > 1 && (
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Recent Progressions</p>
            <div className="space-y-1.5">
              {history.slice(1).map((prog, hi) => (
                <button
                  key={hi}
                  onClick={() => { setProgression(prog); setActiveChord(0); }}
                  className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-violet-50 rounded-lg text-sm text-gray-600 hover:text-violet-700 transition-colors border border-transparent hover:border-violet-200"
                >
                  {prog.map(c => `${c.root}${c.quality === 'min' ? 'm' : c.quality === 'dim' ? '°' : ''}`).join(' – ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {progression.length === 0 && (
          <p className="text-sm text-gray-400 text-center italic mt-2">
            Pick a preset or click "Generate Random" to get started
          </p>
        )}
      </div>
    </div>
  );
};

export default ChordProgressionGenerator;
