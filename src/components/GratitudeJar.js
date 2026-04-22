import React, { useState, useEffect, useMemo } from 'react';

const GRATITUDE_COLORS = [
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-500',
  'from-sky-400 to-indigo-500',
  'from-fuchsia-400 to-purple-500',
  'from-lime-400 to-green-500',
  'from-yellow-300 to-amber-500',
  'from-cyan-400 to-blue-500',
];

const PROMPTS = [
  'A person who made you smile today...',
  'A small win you had recently...',
  'Something beautiful you noticed...',
  'A comfort you often take for granted...',
  'A memory that warms your heart...',
  'A skill you are grateful to have...',
];

const GratitudeJar = () => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('gratitude_jar_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState('');
  const [activeNote, setActiveNote] = useState(null);
  const [prompt, setPrompt] = useState(PROMPTS[0]);

  useEffect(() => {
    localStorage.setItem('gratitude_jar_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  }, []);

  const addNote = () => {
    const value = text.trim();
    if (!value) return;
    const newNote = {
      id: Date.now(),
      text: value,
      color: GRATITUDE_COLORS[Math.floor(Math.random() * GRATITUDE_COLORS.length)],
      timestamp: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setText('');
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
    setActiveNote(null);
  };

  const shakeJar = () => {
    if (notes.length === 0) return;
    const random = notes[Math.floor(Math.random() * notes.length)];
    setActiveNote(random);
  };

  const streak = useMemo(() => {
    if (notes.length === 0) return 0;
    const days = new Set(
      notes.map(n => new Date(n.timestamp).toDateString())
    );
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      if (days.has(d.toDateString())) count++;
      else if (i > 0) break;
    }
    return count;
  }, [notes]);

  // Visual pebbles in the jar — deterministic positions based on note id
  const pebbles = useMemo(() => {
    return notes.slice(0, 60).map((n, i) => {
      const seed = n.id % 1000;
      const left = ((seed * 37) % 90) + 5;
      const bottom = ((i * 11 + (seed % 13)) % 75) + 2;
      const size = 14 + ((seed % 5) * 3);
      const rotate = (seed % 40) - 20;
      return { note: n, left, bottom, size, rotate };
    });
  }, [notes]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote();
  };

  return (
    <div className="flex justify-center items-center min-h-[600px] p-5 bg-gradient-to-br from-amber-400 via-rose-400 to-fuchsia-500 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl max-w-3xl w-full shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-fuchsia-600 mb-2">
            Gratitude Jar
          </h2>
          <p className="text-gray-500 font-medium">Fill your jar with moments worth remembering</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Jar Visual */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-[260px] mx-auto">
              {/* Lid */}
              <div className="h-6 mx-6 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-xl shadow-md" />
              <div className="h-3 mx-4 bg-gradient-to-b from-amber-700 to-amber-900 rounded-b-md shadow-inner" />

              {/* Jar body */}
              <div className="relative h-80 mt-1 border-4 border-amber-200/70 bg-gradient-to-b from-sky-50 via-white/60 to-sky-100/80 rounded-b-[3rem] rounded-t-xl overflow-hidden shadow-inner">
                {/* Glass highlight */}
                <div className="absolute top-2 left-3 w-3 h-32 bg-white/70 rounded-full blur-sm" />
                <div className="absolute top-2 left-8 w-1.5 h-20 bg-white/60 rounded-full" />

                {/* Pebbles */}
                {pebbles.map(({ note, left, bottom, size, rotate }) => (
                  <button
                    key={note.id}
                    onClick={() => setActiveNote(note)}
                    style={{
                      left: `${left}%`,
                      bottom: `${bottom}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                      transform: `rotate(${rotate}deg)`,
                    }}
                    className={`absolute rounded-full bg-gradient-to-br ${note.color} shadow-md hover:scale-125 hover:z-10 transition-all duration-300 ring-1 ring-white/60`}
                    title={note.text}
                  />
                ))}

                {notes.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm italic px-6 text-center">
                    Your jar is empty. Add your first gratitude.
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-5 w-full max-w-[260px]">
              <button
                onClick={shakeJar}
                disabled={notes.length === 0}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  notes.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:-translate-y-0.5 shadow-md hover:shadow-lg'
                }`}
              >
                Shake Jar
              </button>
            </div>
          </div>

          {/* Right column: input + stats */}
          <div className="flex flex-col">
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-4 border border-rose-100">
                <div className="text-3xl font-black text-rose-600">{notes.length}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Gratitudes</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-4 border border-amber-100">
                <div className="text-3xl font-black text-orange-600">{streak}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-orange-400">Day Streak</div>
              </div>
            </div>

            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              {prompt}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Today I am grateful for..."
              maxLength={280}
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-rose-300 focus:bg-white focus:outline-none transition-all resize-none h-32 text-gray-700"
            />
            <div className="flex justify-between items-center text-xs text-gray-400 mt-1 mb-3">
              <span>Tip: press ⌘/Ctrl + Enter to add</span>
              <span>{text.length}/280</span>
            </div>

            <button
              onClick={addNote}
              disabled={!text.trim()}
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 shadow-lg ${
                text.trim()
                  ? 'bg-gradient-to-r from-rose-600 to-fuchsia-600 hover:shadow-rose-200 hover:-translate-y-1 active:scale-95'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Drop Into Jar
            </button>
          </div>
        </div>

        {/* Active note popup */}
        {activeNote && (
          <div
            className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-white to-rose-50 border border-rose-100 shadow-md animate-[fadeIn_0.3s_ease-out]"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${activeNote.color} shadow-sm flex items-center justify-center text-white text-xl`}>
                ✨
              </div>
              <div className="flex-1">
                <p className="text-gray-700 leading-relaxed">{activeNote.text}</p>
                <div className="text-[10px] text-gray-400 font-mono mt-2">
                  {new Date(activeNote.timestamp).toLocaleDateString()} at{' '}
                  {new Date(activeNote.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveNote(null)}
                  className="text-gray-400 hover:text-gray-700 transition-colors text-sm font-bold"
                >
                  Close
                </button>
                <button
                  onClick={() => deleteNote(activeNote.id)}
                  className="text-rose-400 hover:text-rose-600 transition-colors text-sm font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GratitudeJar;
